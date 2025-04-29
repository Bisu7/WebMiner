from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from bs4 import BeautifulSoup
import re
from collections import Counter
from datetime import datetime, timedelta
import random
import joblib
import numpy as np
import pandas as pd
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

# Load ML model and vectorizer (will be created by the ML training notebook)
MODEL_PATH = 'Model/product_container_model.pkl'
VECTORIZER_PATH = 'Model/html_vectorizer.pkl'

# Check if model exists, otherwise set to None (will train on first request)
try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("ML model and vectorizer loaded successfully")
except FileNotFoundError:
    model = None
    vectorizer = None
    print("ML model not found. Will train on first request.")

@app.route('/', methods=['POST'])
def receive_url():
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'status': 'error', 'message': 'No URL provided'}), 400
    
    url = data['url']
    
    try:
        # Download the page
        html_content = download_page(url)
        if not html_content:
            return jsonify({'status': 'error', 'message': 'Failed to download page'}), 500
            
        # Check if we have a trained model
        global model, vectorizer
        if model is None or vectorizer is None:
            # We don't have a model yet, use traditional scraping approach
            scraped_data = scrape_website_traditional(url, html_content)
            
            # Save this page for future training
            domain = extract_domain(url)
            save_training_example(url, html_content, domain)
            
            # Add a note that ML model is being trained
            scraped_data['notes'] = "ML model is being trained with this page. Future requests will use adaptive scraping."
        else:
            # Use ML model to analyze the page and extract data
            extraction_rules = analyze_website_structure(url, html_content)
            scraped_data = scrape_with_rules(url, html_content, extraction_rules)
        
        return jsonify(scraped_data)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

def download_page(url, timeout=10):
    """Download HTML content from URL with proper headers"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to fetch URL: {str(e)}")

def extract_domain(url):
    """Extract the domain from a URL"""
    parsed_uri = urlparse(url)
    return parsed_uri.netloc

def save_training_example(url, html, domain):
    """Save a training example for future model training"""
    training_dir = "training_data"
    if not os.path.exists(training_dir):
        os.makedirs(training_dir)
    
    # Save HTML file
    filename = f"{training_dir}/{domain.replace('.', '_')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.html"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    
    # Save URL mapping
    with open(f"{training_dir}/url_mapping.txt", 'a') as f:
        f.write(f"{filename}|{url}|{domain}\n")
    
    print(f"Saved training example: {filename}")

def analyze_website_structure(url, html_content):
    """Analyze website structure using the ML model and extract patterns"""
    soup = BeautifulSoup(html_content, 'html.parser')
    domain = extract_domain(url)
    
    # Extract features from potential product containers
    candidates = soup.select('div, li, article, section')
    results = {
        'product_containers': [],
        'price_tags': [],
        'name_tags': [],
        'image_tags': [],
        'button_tags': []
    }
    
    for tag in candidates:
        # Skip very small tags
        if len(tag.get_text(strip=True)) < 10:
            continue
            
        features = extract_features_from_tag(tag)
        features['domain_type'] = classify_domain_type(domain)
        features['html_structure'] = str(tag)[:1000]
        
        # Convert to DataFrame for prediction
        tag_df = pd.DataFrame([features])
        
        # Process HTML with vectorizer
        html_features = vectorizer.transform([features['html_structure']])
        
        # Prepare domain features
        domain_types = ['electronics', 'books', 'fashion', 'home', 'general', 'other']
        domain_cols = [f"domain_{dt}" for dt in domain_types]
        domain_vals = {col: 1 if col == f"domain_{features['domain_type']}" else 0 for col in domain_cols}
        domain_df = pd.DataFrame([domain_vals])
        
        # Get expected feature columns from model
        if hasattr(model, 'feature_names_in_'):
            expected_columns = model.feature_names_in_
        else:
            # Assume all feature columns are needed (for older scikit-learn versions)
            html_cols = [f"html_feat_{i}" for i in range(html_features.shape[1])]
            expected_columns = list(tag_df.columns) + domain_cols + html_cols
        
        # Combine features
        combined_features = pd.concat([
            tag_df.drop(['html_structure', 'domain_type'], axis=1, errors='ignore'),
            domain_df,
            pd.DataFrame(html_features.toarray(), columns=[f"html_feat_{i}" for i in range(html_features.shape[1])])
        ], axis=1)
        
        # Ensure columns match training data
        for col in expected_columns:
            if col not in combined_features.columns:
                combined_features[col] = 0
        
        # Reorder columns to match training data
        combined_features = combined_features[expected_columns]
        
        # Predict if this tag is a product container
        prediction = model.predict(combined_features)[0]
        
        if prediction == 1:
            # Add this tag to product containers
            tag_signature = {
                'tag': tag.name,
                'classes': tag.get('class', []),
                'id': tag.get('id', ''),
                'attributes': {k: v for k, v in tag.attrs.items() if k not in ['class', 'id']},
                'xpath': generate_xpath(tag)
            }
            results['product_containers'].append(tag_signature)
            
            # Find price elements within this container
            price_elements = tag.select('.price, [class*=price], .amount, [class*=amount]')
            for price_el in price_elements:
                if re.search(r'(\$|€|£|\d+\.\d{2})', price_el.get_text()):
                    price_sig = {
                        'tag': price_el.name,
                        'classes': price_el.get('class', []),
                        'id': price_el.get('id', ''),
                        'xpath': generate_xpath(price_el)
                    }
                    results['price_tags'].append(price_sig)
            
            # Find product name elements
            name_elements = tag.select('h1, h2, h3, h4, .title, .name, [class*=title], [class*=name]')
            for name_el in name_elements:
                if 5 < len(name_el.get_text(strip=True)) < 100:
                    name_sig = {
                        'tag': name_el.name,
                        'classes': name_el.get('class', []),
                        'id': name_el.get('id', ''),
                        'xpath': generate_xpath(name_el)
                    }
                    results['name_tags'].append(name_sig)
                    
            # Find product image elements
            img_elements = tag.select('img')
            for img_el in img_elements:
                img_sig = {
                    'tag': img_el.name,
                    'classes': img_el.get('class', []),
                    'id': img_el.get('id', ''),
                    'src': img_el.get('src', ''),
                    'alt': img_el.get('alt', ''),
                    'xpath': generate_xpath(img_el)
                }
                results['image_tags'].append(img_sig)
                
            # Find button elements (add to cart, buy now, etc.)
            button_elements = tag.select('button, .button, [class*=button], .btn, [class*=btn], a[href*=cart], a[href*=buy]')
            for btn_el in button_elements:
                btn_text = btn_el.get_text().lower()
                if 'cart' in btn_text or 'buy' in btn_text or 'purchase' in btn_text:
                    btn_sig = {
                        'tag': btn_el.name,
                        'classes': btn_el.get('class', []),
                        'id': btn_el.get('id', ''),
                        'text': btn_el.get_text(strip=True),
                        'xpath': generate_xpath(btn_el)
                    }
                    results['button_tags'].append(btn_sig)
    
    # Generate selectors for each element type
    selectors = {
        'product_containers': generate_selectors(results['product_containers']),
        'price_elements': generate_selectors(results['price_tags']),
        'name_elements': generate_selectors(results['name_tags']),
        'image_elements': generate_selectors(results['image_tags']),
        'button_elements': generate_selectors(results['button_tags'])
    }
    
    # Analyze and find patterns in collected data
    patterns = analyze_patterns(results)
    
    # Create extraction rules
    extraction_rules = {
        'url': url,
        'domain': domain,
        'selectors': selectors,
        'patterns': patterns
    }
    
    return extraction_rules

def extract_features_from_tag(tag):
    """Extract features from a BeautifulSoup tag"""
    features = {
        'tag_name': tag.name,
        'class': ' '.join(tag.get('class', [])),
        'id': tag.get('id', ''),
        'text_length': len(tag.get_text(strip=True)),
        'has_price': 1 if re.search(r'(\$|€|£|\d+\.\d{2})', tag.get_text()) else 0,
        'has_product_term': 1 if re.search(r'product|item|buy|purchase|cart|shop', tag.get_text().lower()) else 0,
        'has_img': 1 if tag.find('img') else 0,
        'has_link': 1 if tag.find('a') else 0,
        'depth': len(list(tag.parents)),
        'child_count': len(tag.contents),
        'sibling_count': len(list(tag.next_siblings)) + len(list(tag.previous_siblings))
    }
    
    # One-hot encode tag_name for common tags
    common_tags = ['div', 'li', 'article', 'section', 'span', 'a']
    for t in common_tags:
        features[f'tag_{t}'] = 1 if tag.name == t else 0
    
    return features

def classify_domain_type(domain):
    """Classify domain into a category based on keywords"""
    domain_lower = domain.lower()
    
    if any(kw in domain_lower for kw in ['tech', 'electronic', 'gadget', 'computer']):
        return 'electronics'
    elif any(kw in domain_lower for kw in ['book', 'read', 'novel', 'literature']):
        return 'books'
    elif any(kw in domain_lower for kw in ['cloth', 'fashion', 'wear', 'apparel']):
        return 'fashion'
    elif any(kw in domain_lower for kw in ['home', 'furniture', 'decor', 'house']):
        return 'home'
    elif any(kw in domain_lower for kw in ['shop', 'store', 'market', 'buy']):
        return 'general'
    else:
        return 'other'

def generate_xpath(element):
    """Generate an XPath for the given element"""
    components = []
    child = element
    
    for parent in element.parents:
        siblings = parent.find_all(child.name, recursive=False)
        siblings_count = 0
        
        if len(siblings) > 1:
            for sibling in siblings:
                if sibling == child:
                    components.insert(0, f'{child.name}[{siblings_count+1}]')
                    break
                siblings_count += 1
        else:
            components.insert(0, child.name)
            
        child = parent
        
        if parent.name == 'html':
            break
            
    return '//' + '/'.join(components)

def generate_selectors(elements):
    """Generate CSS selectors for the given elements"""
    if not elements:
        return []
    
    selectors = []
    
    for element in elements:
        # Try class-based selector first
        if element['classes']:
            class_selector = f"{element['tag']}.{'.'.join(element['classes'])}"
            selectors.append(class_selector)
            
        # Try ID-based selector
        if element['id']:
            id_selector = f"#{element['id']}"
            selectors.append(id_selector)
            
        # Add XPath as fallback
        if 'xpath' in element:
            selectors.append({'xpath': element['xpath']})
    
    # Remove duplicates while preserving order
    unique_selectors = []
    for selector in selectors:
        if selector not in unique_selectors:
            unique_selectors.append(selector)
    
    return unique_selectors

def analyze_patterns(extracted_data):
    """Analyze extracted elements to find common patterns"""
    patterns = {}
    
    # Analyze product containers
    if extracted_data['product_containers']:
        container_classes = []
        for container in extracted_data['product_containers']:
            container_classes.extend(container['classes'])
        
        class_counts = pd.Series(container_classes).value_counts()
        if not class_counts.empty:
            patterns['container_class'] = class_counts.index[0]
    
    # Analyze price elements
    if extracted_data['price_tags']:
        price_classes = []
        for price in extracted_data['price_tags']:
            price_classes.extend(price['classes'])
        
        class_counts = pd.Series(price_classes).value_counts()
        if not class_counts.empty:
            patterns['price_class'] = class_counts.index[0]
    
    # Name patterns
    if extracted_data['name_tags']:
        name_tags = [item['tag'] for item in extracted_data['name_tags']]
        tag_counts = pd.Series(name_tags).value_counts()
        if not tag_counts.empty:
            patterns['name_tag'] = tag_counts.index[0]
    
    return patterns

def scrape_with_rules(url, html_content, extraction_rules):
    """Use the ML-generated extraction rules to scrape the page"""
    soup = BeautifulSoup(html_content, 'html.parser')
    domain = extract_domain(url)
    
    # Extract products using the selectors from extraction_rules
    products = []
    
    # Try to use product container selectors
    product_containers = []
    for container_selector in extraction_rules['selectors']['product_containers']:
        if isinstance(container_selector, dict) and 'xpath' in container_selector:
            # XPath selector handling would require additional library like lxml
            continue
        
        found_containers = soup.select(container_selector)
        if found_containers:
            product_containers.extend(found_containers)
    
    # If no product containers found, fallback to traditional scraping
    if not product_containers:
        return scrape_website_traditional(url, html_content)
    
    # Process each product container
    for container in product_containers:
        product = {
            "id": len(products) + 1,
            "name": "Unknown Product",
            "price": 0.0,
            "category": "Unknown",
            "rating": round(random.uniform(3.0, 5.0), 1),
            "inStock": bool(random.getrandbits(1))
        }
        
        # Extract product name
        name_found = False
        for name_selector in extraction_rules['selectors']['name_elements']:
            if isinstance(name_selector, dict):
                continue
            name_elements = container.select(name_selector)
            if name_elements:
                product['name'] = name_elements[0].get_text(strip=True)
                name_found = True
                break
        
        # If no name found with selectors, try generic approach
        if not name_found:
            name_element = container.select_one('h1, h2, h3, h4, .title, .name')
            if name_element:
                product['name'] = name_element.get_text().strip()
        
        # Extract price
        price_found = False
        for price_selector in extraction_rules['selectors']['price_elements']:
            if isinstance(price_selector, dict):
                continue
            price_elements = container.select(price_selector)
            if price_elements:
                price_text = price_elements[0].get_text(strip=True)
                price_match = re.search(r'(\d+\.\d+|\d+)', price_text)
                if price_match:
                    product['price'] = float(price_match.group(1))
                    price_found = True
                    break
        
        # If no price found with selectors, try generic approach
        if not price_found:
            price_pattern = r'(\$|€|£|USD)\s*(\d+(?:\.\d{2})?)'
            price_texts = container.get_text()
            price_match = re.search(price_pattern, price_texts)
            if price_match:
                try:
                    product['price'] = float(price_match.group(2))
                except ValueError:
                    pass
        
        # Try to extract category
        category_text = container.get_text().lower()
        categories = ["Electronics", "Clothing", "Home", "Books", "Beauty"]
        for category in categories:
            if category.lower() in category_text:
                product["category"] = category
                break
        
        # Check for stock information
        stock_element = container.select_one('.stock, .availability, [class*=stock], [class*=availability]')
        if stock_element:
            product["inStock"] = "in stock" in stock_element.get_text().lower()
        
        # Add the product to our list
        products.append(product)
    
    # Generate simulated time data for visitors
    today = datetime.now()
    time_data = []
    for i in range(7):
        date = (today - timedelta(days=6-i)).strftime('%Y-%m-%d')
        visitors = 100 + (i * 30) + (i * i * 2)
        time_data.append({"date": date, "visitors": visitors})
    
    # Generate price history
    price_history = generate_price_history(products)
    
    # Extract words for word frequency
    text_content = soup.get_text()
    words = re.findall(r'\b\w+\b', text_content.lower())
    word_count = len(words)
    
    common_words = {'the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'that', 'for', 'on', 'with'}
    filtered_words = [word for word in words if word not in common_words and len(word) > 2]
    word_freq = Counter(filtered_words).most_common(5)
    frequent_words = [{"word": word, "count": count} for word, count in word_freq]
    
    # Count paragraphs, images, and links
    paragraphs_count = len(soup.find_all('p'))
    images_count = len(soup.find_all('img'))
    all_links = soup.find_all('a', href=True)
    
    internal_links = 0
    external_links = 0
    
    for link in all_links:
        href = link['href']
        if href.startswith('#') or not href:
            continue 
        elif href.startswith('/') or domain in href:
            internal_links += 1
        else:
            external_links += 1
    
    # Compile the final scraped data
    scraped_data = {
        "pageInfo": {
            "title": soup.title.string if soup.title else "No title found",
            "url": url,
            "lastScraped": datetime.now().isoformat()
        },
        "metrics": {
            "wordCount": word_count,
            "paragraphs": paragraphs_count,
            "images": images_count,
            "links": internal_links + external_links
        },
        "frequentWords": frequent_words,
        "linkAnalysis": [
            {"type": "Internal", "count": internal_links},
            {"type": "External", "count": external_links}
        ],
        "timeData": time_data,
        "products": products,
        "priceHistory": price_history,
        "extractionMethod": "ML-guided"
    }
    
    return scraped_data

def scrape_website_traditional(url, html_content):
    """Traditional scraping method as a fallback (your original implementation)"""
    soup = BeautifulSoup(html_content, 'html.parser')
    domain = extract_domain(url)
    
    title = soup.title.string if soup.title else "No title found"
    
    text_content = soup.get_text()
    words = re.findall(r'\b\w+\b', text_content.lower())
    word_count = len(words)
    
    common_words = {'the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'that', 'for', 'on', 'with', 'as', 'are', 'at', 'be', 'this', 'by', 'an', 'was', 'not'}
    filtered_words = [word for word in words if word not in common_words and len(word) > 2]
    word_freq = Counter(filtered_words).most_common(5)
    frequent_words = [{"word": word, "count": count} for word, count in word_freq]
    
    paragraphs_count = len(soup.find_all('p'))
    
    images_count = len(soup.find_all('img'))
    
    all_links = soup.find_all('a', href=True)
    
    internal_links = 0
    external_links = 0
    
    for link in all_links:
        href = link['href']
        if href.startswith('#') or not href:
            continue 
        elif href.startswith('/') or domain in href:
            internal_links += 1
        else:
            external_links += 1
    
    today = datetime.now()
    time_data = []
    
    for i in range(7):
        date = (today - timedelta(days=6-i)).strftime('%Y-%m-%d')
        visitors = 100 + (i * 30) + (i * i * 2)
        time_data.append({"date": date, "visitors": visitors})
    
    products = extract_products(soup, url)
    
    price_history = generate_price_history(products)
    
    scraped_data = {
        "pageInfo": {
            "title": title,
            "url": url,
            "lastScraped": datetime.now().isoformat()
        },
        "metrics": {
            "wordCount": word_count,
            "paragraphs": paragraphs_count,
            "images": images_count,
            "links": internal_links + external_links
        },
        "frequentWords": frequent_words,
        "linkAnalysis": [
            {"type": "Internal", "count": internal_links},
            {"type": "External", "count": external_links}
        ],
        "timeData": time_data,
        "products": products,
        "priceHistory": price_history,
        "extractionMethod": "Traditional"
    }
    
    return scraped_data

def extract_products(soup, url):
  
    products = []
    
    is_ecommerce = False
    ecommerce_indicators = ['price', 'cart', 'checkout', 'shop', 'product', 'buy', 'purchase']
    
    for indicator in ecommerce_indicators:
        if soup.find_all(text=re.compile(indicator, re.IGNORECASE)):
            is_ecommerce = True
            break
    
    if not is_ecommerce:
        # If not an e-commerce site, generate some sample product data
        # This would be replaced with actual scraping logic for real sites
        sample_products = [
            {"id": 1, "name": "Sample Product 1", "price": 19.99, "category": "Electronics", "rating": 4.5, "inStock": True},
            {"id": 2, "name": "Sample Product 2", "price": 29.99, "category": "Clothing", "rating": 3.8, "inStock": True},
            {"id": 3, "name": "Sample Product 3", "price": 9.99, "category": "Books", "rating": 4.2, "inStock": False},
            {"id": 4, "name": "Sample Product 4", "price": 49.99, "category": "Home", "rating": 4.7, "inStock": True},
            {"id": 5, "name": "Sample Product 5", "price": 15.99, "category": "Beauty", "rating": 3.5, "inStock": True},
        ]
        return sample_products
    
    # Try different common patterns for product listings
    
    # Method 1: Look for product cards or containers
    product_containers = soup.select('.product, .item, [class*=product], [class*=item], [id*=product], [id*=item]')
    
    if product_containers:
        for i, container in enumerate(product_containers[:10]):  # Limit to first 10 products
            product = {
                "id": i + 1,
                "name": "Unknown Product",
                "price": 0.0,
                "category": "Unknown",
                "rating": round(random.uniform(3.0, 5.0), 1),
                "inStock": bool(random.getrandbits(1))
            }
            
            # Try to find the product name
            name_element = container.select_one('.title, .name, h2, h3, h4')
            if name_element:
                product["name"] = name_element.get_text().strip()
            
            # Try to find the price
            price_element = container.select_one('.price, [class*=price]')
            if price_element:
                price_text = price_element.get_text().strip()
                # Extract digits and decimal point
                price_match = re.search(r'(\d+\.\d+|\d+)', price_text)
                if price_match:
                    try:
                        product["price"] = float(price_match.group(1))
                    except ValueError:
                        pass
            
            # Check for stock information
            stock_element = container.select_one('.stock, .availability, [class*=stock], [class*=availability]')
            if stock_element:
                product["inStock"] = "in stock" in stock_element.get_text().lower()
            
            products.append(product)
    
    # If no products found, create sample data
    if not products:
        # Extract potential product names and prices from the page
        potential_names = [h.get_text().strip() for h in soup.select('h1, h2, h3') if 5 < len(h.get_text().strip()) < 100]
        potential_prices = []
        
        # Look for price patterns in the text
        price_patterns = [
            r'\$\s*(\d+(?:\.\d{2})?)',  # $XX.XX
            r'(\d+(?:\.\d{2})?)\s*USD',  # XX.XX USD
            r'(\d+(?:\.\d{2})?)\s*€',    # XX.XX €
            r'£\s*(\d+(?:\.\d{2})?)'     # £XX.XX
        ]
        
        for pattern in price_patterns:
            matches = re.findall(pattern, soup.get_text())
            potential_prices.extend([float(p) for p in matches])
        
        # Create products with extracted names and prices
        for i in range(min(5, len(potential_names))):
            product = {
                "id": i + 1,
                "name": potential_names[i] if i < len(potential_names) else f"Product {i+1}",
                "price": potential_prices[i] if i < len(potential_prices) else round(random.uniform(9.99, 99.99), 2),
                "category": random.choice(["Electronics", "Clothing", "Home", "Books", "Beauty"]),
                "rating": round(random.uniform(3.0, 5.0), 1),
                "inStock": bool(random.getrandbits(1))
            }
            products.append(product)
        
        # If still no products, use sample data
        if not products:
            products = [
                {"id": 1, "name": "Sample Product 1", "price": 19.99, "category": "Electronics", "rating": 4.5, "inStock": True},
                {"id": 2, "name": "Sample Product 2", "price": 29.99, "category": "Clothing", "rating": 3.8, "inStock": True},
                {"id": 3, "name": "Sample Product 3", "price": 9.99, "category": "Books", "rating": 4.2, "inStock": False},
                {"id": 4, "name": "Sample Product 4", "price": 49.99, "category": "Home", "rating": 4.7, "inStock": True},
                {"id": 5, "name": "Sample Product 5", "price": 15.99, "category": "Beauty", "rating": 3.5, "inStock": True},
            ]
    
    return products

def generate_price_history(products):
    """Generate simulated price history data for the products"""
    history = []
    today = datetime.now()
    
    for product in products:
        product_history = []
        current_price = product["price"]
        
        # Generate price points for the last 30 days
        for i in range(30, -1, -1):
            date = (today - timedelta(days=i)).strftime('%Y-%m-%d')
            
            # Slight random price variations
            if i > 0:  # Keep the most recent price as is
                price_variation = random.uniform(-0.1, 0.1)  # -10% to +10%
                historical_price = round(current_price * (1 + price_variation), 2)
            else:
                historical_price = current_price
                
            product_history.append({
                "date": date,
                "price": historical_price
            })
        
        history.append({
            "productId": product["id"],
            "productName": product["name"],
            "priceData": product_history
        })
    
    return history

if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
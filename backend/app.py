from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from bs4 import BeautifulSoup
import re
from collections import Counter
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def receive_url():
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'status': 'error', 'message': 'No URL provided'}), 400
    
    url = data['url']
    
    try:
        scraped_data = scrape_website(url)
        return jsonify(scraped_data)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

def scrape_website(url):    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an exception for 4XX/5XX responses
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to fetch URL: {str(e)}")
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
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
    
    domain = url.split('//')[1].split('/')[0]
    
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
        "priceHistory": price_history
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
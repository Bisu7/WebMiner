import React, { useState, useEffect } from "react";


// Product List Component
export const ProductList = ({ products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState({
    category: "",
    inStock: "",
    minPrice: "",
    maxPrice: ""
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  
  // Blue color palette
  const blueColors = {
    light: '#e0f2fe',    // Light blue background
    medium: '#3b82f6',   // Medium blue for borders and active elements
    dark: '#1e40af',     // Dark blue for text and focus states
    hover: '#60a5fa'     // Hover state
  };
  
  // Get unique categories for the filter dropdown
  const categories = [...new Set(initialProducts.map(product => product.category))];
  
  // Apply filters and sorting whenever they change
  useEffect(() => {
    let filteredProducts = [...initialProducts];
    
    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === filters.category
      );
    }
    
    // Apply stock filter
    if (filters.inStock !== "") {
      const stockValue = filters.inStock === "true";
      filteredProducts = filteredProducts.filter(product => 
        product.inStock === stockValue
      );
    }
    
    // Apply price range filters
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      );
    }
    
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      );
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    setProducts(filteredProducts);
  }, [initialProducts, filters, sortBy, sortDirection]);
  
  // Handler for filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handler for sort changes
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Handler for sort direction changes
  const handleSortDirectionChange = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };
  
  // Common style for form controls (now with blue theme)
  const formControlStyle = {
    width: '100%', 
    padding: '0.5rem', 
    border: `1px solid ${blueColors.medium}`,
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };
  
  // Label style with blue theme
  const labelStyle = {
    display: 'block', 
    fontSize: '0.875rem', 
    fontWeight: '500', 
    marginBottom: '0.25rem', 
    color: blueColors.dark
  };
  
  return (
    <div style={{ color:'black', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: blueColors.light }}>
        <h3 style={{  fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: blueColors.dark }}>Products Found</h3>
        
        {/* Filter and Sort Options */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          {/* Category Filter */}
          <div style={{ minWidth: '150px' }}>
            <label style={labelStyle}>
              Category
            </label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              style={formControlStyle}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Stock Filter */}
          <div style={{ minWidth: '150px' }}>
            <label style={labelStyle}>
              Availability
            </label>
            <select 
              name="inStock" 
              value={filters.inStock} 
              onChange={handleFilterChange}
              style={formControlStyle}
            >
              <option value="">All Items</option>
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
          
          {/* Price Range Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', minWidth: '200px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                Min Price
              </label>
              <input 
                type="number" 
                name="minPrice" 
                value={filters.minPrice} 
                onChange={handleFilterChange}
                placeholder="$0"
                style={formControlStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                Max Price
              </label>
              <input 
                type="number" 
                name="maxPrice" 
                value={filters.maxPrice} 
                onChange={handleFilterChange}
                placeholder="$1000+"
                style={formControlStyle}
              />
            </div>
          </div>
          
          {/* Sort Options */}
          <div style={{ minWidth: '200px', marginLeft: 'auto' }}>
            <label style={labelStyle}>
              Sort By
            </label>
            <div style={{ display: 'flex' }}>
              <select 
                value={sortBy} 
                onChange={handleSortChange}
                style={{ 
                  ...formControlStyle,
                  borderRadius: '0.375rem 0 0 0.375rem',
                  borderRight: 'none'
                }}
              >
                <option value="name">Product Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
              <button 
                onClick={handleSortDirectionChange}
                style={{ 
                  padding: '0.5rem', 
                  border: `1px solid ${blueColors.medium}`,
                  borderRadius: '0 0.375rem 0.375rem 0',
                  backgroundColor: blueColors.medium,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  transition: 'background-color 0.2s'
                }}
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
        
        {/* Apply Filters Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Results count */}
          <div style={{ fontSize: '0.875rem', color: blueColors.dark }}>
            Showing {products.length} of {initialProducts.length} products
          </div>
          
          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setFilters({
                category: "",
                inStock: "",
                minPrice: "",
                maxPrice: ""
              });
              setSortBy("name");
              setSortDirection("asc");
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              border: `1px solid ${blueColors.medium}`,
              borderRadius: '0.375rem',
              color: blueColors.medium,
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s, color 0.2s'
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Product</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Price</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Rating</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>{product.id}</td>
                  <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{product.name}</td>
                  <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>${product.price.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>{product.category}</td>
                  <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>{product.rating}</span>
                      <div style={{ marginLeft: '0.5rem', display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: i < Math.floor(product.rating) ? '#facc15' : '#e5e7eb' }}>★</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      backgroundColor: product.inStock ? '#d1fae5' : '#fee2e2',
                      color: product.inStock ? '#059669' : '#dc2626',
                      fontWeight: '500',
                      fontSize: '0.75rem'
                    }}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No products found matching your filters. Try adjusting your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
  
  // Product Price Chart Component
export const ProductPriceChart = ({ priceHistory }) => {
    // Only show first product for simplicity in this component
    const productData = priceHistory[0];
    
    // Calculate chart dimensions
    const chartWidth = 100;
    const chartHeight = 200;
    const padding = 30;
    const dataPoints = productData.priceData.slice(-14); // Last 14 days
    
    // Find min and max values for scaling
    const prices = dataPoints.map(point => point.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1; // Avoid division by zero
    
    // Calculate point positions
    const points = dataPoints.map((point, index) => {
      const x = (index / (dataPoints.length - 1)) * chartWidth;
      const y = chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;
      return { x, y, ...point };
    });
    
    // Create SVG path
    const pathData = points.map((point, index) => 
      (index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`)
    ).join(' ');
    
    return (
      <div style={{color:'black', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Price History: {productData.productName}
        </h3>
        
        <div style={{ position: 'relative', height: `${chartHeight + padding * 2}px`, marginBottom: '1rem' }}>
          {/* Y-axis labels */}
          <div style={{ position: 'absolute', left: 0, top: padding, bottom: padding, width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>${maxPrice.toFixed(2)}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>${minPrice.toFixed(2)}</div>
          </div>
          
          {/* Chart area */}
          <div style={{ position: 'absolute', left: '50px', right: '10px', top: padding, height: chartHeight }}>
            {/* Horizontal grid lines */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '25%', height: '1px', backgroundColor: '#e5e7eb' }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', backgroundColor: '#e5e7eb' }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '75%', height: '1px', backgroundColor: '#e5e7eb' }}></div>
            </div>
            
            {/* Price line */}
            <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <path 
                d={pathData} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2" 
              />
              {points.map((point, index) => (
                <circle 
                  key={index}
                  cx={point.x} 
                  cy={point.y} 
                  r="3" 
                  fill="white" 
                  stroke="#3b82f6" 
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
          
          {/* X-axis labels */}
          <div style={{ position: 'absolute', left: '50px', right: '10px', bottom: 0, height: '20px', display: 'flex', justifyContent: 'space-between' }}>
            {[0, Math.floor(dataPoints.length / 2), dataPoints.length - 1].map((index) => (
              <div key={index} style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {dataPoints[index].date.slice(5)}
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Current Price: <span style={{ fontWeight: 'bold', color: '#111827' }}>${productData.priceData[productData.priceData.length - 1].price.toFixed(2)}</span>
          </span>
          {' | '}
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            30-Day Avg: <span style={{ fontWeight: 'bold', color: '#111827' }}>
              ${(productData.priceData.reduce((sum, point) => sum + point.price, 0) / productData.priceData.length).toFixed(2)}
            </span>
          </span>
        </div>
      </div>
    );
  };
  
  // Category Distribution Component
export  const CategoryDistribution = ({ products }) => {
    // Count products by category
    const categories = {};
    products.forEach(product => {
      if (categories[product.category]) {
        categories[product.category]++;
      } else {
        categories[product.category] = 1;
      }
    });
    
    const categoryData = Object.entries(categories).map(([category, count]) => ({ category, count }));
    const total = products.length;
    
    // Colors for different categories
    const colors = {
      'Electronics': '#3b82f6',  // blue
      'Clothing': '#f97316',     // orange
      'Home': '#10b981',         // green
      'Books': '#8b5cf6',        // purple
      'Beauty': '#ec4899',       // pink
      'Other': '#6b7280'         // gray
    };
    
    return (
      <div style={{ color:'black', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Product Categories</h3>
        <div style={{ display: 'flex', height: '200px' }}>
          {/* Pie chart */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%', 
              background: categoryData.length > 0 ? createConicGradient(categoryData, colors) : '#e5e7eb',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', 
                inset: '20%', 
                backgroundColor: 'white', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{total}</span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Products</span>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
            {categoryData.map(item => (
              <div key={item.category} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '0.75rem', 
                  height: '0.75rem', 
                  backgroundColor: colors[item.category] || colors.Other,
                  borderRadius: '0.25rem'
                }} />
                <span style={{ fontSize: '0.875rem' }}>
                  {item.category}: {item.count} ({Math.round((item.count / total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Price Range Distribution Component
export  const PriceRangeDistribution = ({ products }) => {
    // Define price ranges
    const ranges = [
      { min: 0, max: 10, label: '$0-$10' },
      { min: 10, max: 25, label: '$10-$25' },
      { min: 25, max: 50, label: '$25-$50' },
      { min: 50, max: 100, label: '$50-$100' },
      { min: 100, max: Infinity, label: '$100+' }
    ];
    
    // Count products in each price range
    const rangeCounts = ranges.map(range => {
      const count = products.filter(product => 
        product.price >= range.min && product.price < range.max
      ).length;
      return { ...range, count };
    });
    
    // Find the maximum count for scaling
    const maxCount = Math.max(...rangeCounts.map(r => r.count));
    
    return (
      <div style={{ color:'black',backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Price Distribution</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {rangeCounts.map((range, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '80px', fontSize: '0.875rem' }}>{range.label}</div>
              <div style={{ flex: '1', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '0.25rem', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${(range.count / maxCount) * 100}%`, 
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '0.5rem'
                  }}
                >
                  {range.count > 0 && (
                    <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '500' }}>
                      {range.count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Helper function to create conic gradient for pie chart
function createConicGradient(data, colors) {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentPercentage = 0;
    let gradientString = 'conic-gradient(';
    
    data.forEach((item, index) => {
      const percentage = (item.count / total) * 100;
      const color = colors[item.category] || colors.Other;
      
      gradientString += `${color} ${currentPercentage}% ${currentPercentage + percentage}%`;
      currentPercentage += percentage;
      
      if (index < data.length - 1) {
        gradientString += ', ';
      }
    });
    
    gradientString += ')';
    return gradientString;
  }

export default{
    ProductList,
    ProductPriceChart,
    CategoryDistribution,
    PriceRangeDistribution
};
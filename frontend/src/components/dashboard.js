import React, { useState, useEffect} from 'react';
import {ProductList,ProductPriceChart,CategoryDistribution, PriceRangeDistribution} from './Product';

const ScrapingDashboard = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

//   useEffect(() => {
//     // Simulate loading (or replace with actual data fetch)
//     const timer = setTimeout(() => {
//     }, 1000); 

//     return () => clearTimeout(timer); // Clean up
//   }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try{
      const response = await fetch('http://127.0.0.1:5000/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });
  
      const responseData = await response.json();
      console.log('Response:', responseData);
      setData(responseData);
      setIsLoading(false);
    } catch(error) {
      console.error('Error sending url:', error);
      setIsLoading(false);
    }
  };

  return (      
      <div className="flex h-screen bg-gray-100" style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6' }}>


        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white" style={{ width: '16rem', backgroundColor: '#1f2937', color: 'white' }}>
          <div className="p-4 border-b border-gray-700" style={{ padding: '1rem', borderBottom: '1px solid #374151' }}>
            <h1 className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>WebScraper</h1>
            <p className="text-gray-400 text-sm" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Data Visualization Dashboard</p>
          </div>
          
          <nav className="mt-6" style={{ marginTop: '1.5rem' }}>
            <SidebarItem 
              label="Dashboard" 
              active={activeView === 'dashboard'} 
              onClick={() => setActiveView('dashboard')} 
            />
            <SidebarItem 
              label="Products" 
              active={activeView === 'products'} 
              onClick={() => setActiveView('products')} 
            />
            <SidebarItem 
              label="Content Analysis" 
              active={activeView === 'content'} 
              onClick={() => setActiveView('content')} 
            />
            <SidebarItem 
              label="Link Analysis" 
              active={activeView === 'links'} 
              onClick={() => setActiveView('links')} 
            />
            <SidebarItem 
              label="Word Frequency" 
              active={activeView === 'words'} 
              onClick={() => setActiveView('words')} 
            />
            <SidebarItem 
              label="Settings" 
              active={activeView === 'settings'} 
              onClick={() => setActiveView('settings')} 
            />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto" style={{ flex: '1', overflowY: 'auto' }}>
          <header className="bg-white shadow p-4" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="flex-1 relative" style={{ flex: '1', position: 'relative' }}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" 
                    style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <span role="img" aria-label="globe">🌐</span>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL (e.g., https://example.com)"
                  style={{ 
                    width: '100%', 
                    paddingLeft: '2.5rem', 
                    paddingRight: '1rem', 
                    paddingTop: '0.5rem', 
                    paddingBottom: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{ 
                  marginLeft: '1rem', 
                  padding: '0.5rem 1rem', 
                  backgroundColor: isLoading ? '#93c5fd' : '#2563eb', 
                  color: 'white', 
                  borderRadius: '0.375rem', 
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? "Scraping..." : "Scrape Data"}
              </button>
            </form>
          </header>

          <main style={{ padding: '1.5rem' }}>
            {!data && !isLoading && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <span role="img" aria-label="globe" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🌐</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151' }}>No Data Available</h2>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Enter a URL above and click "Scrape Data" to begin</p>
              </div>
            )}

            {isLoading && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151' }}>Scraping Data...</h2>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>This may take a few moments</p>
              </div>
            )}

            {data && !isLoading && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{data.pageInfo.title}</h2>
                  <p style={{ color: '#6b7280' }}>{data.pageInfo.url}</p>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Last scraped: {new Date(data.pageInfo.lastScraped).toLocaleString()}</p>
                </div>

                {/* Dashboard View */}
                {activeView === 'dashboard' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <MetricsCard data={data.metrics} />
                    <WordFrequencySimple data={data.frequentWords} />
                    <LinkAnalysisSimple data={data.linkAnalysis} />
                    <VisitorsSimple data={data.timeData} />
                  </div>
                )}
                {/* Products View */}
                {activeView === 'products' && data && !isLoading && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                      <ProductPriceChart priceHistory={data.priceHistory} />
                      <CategoryDistribution products={data.products} />
                      <PriceRangeDistribution products={data.products} />
                    </div>
                    <ProductList products={data.products} />
                  </div>
                )}

                {/* Content Analysis View */}
                {activeView === 'content' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    <MetricsCard data={data.metrics} />
                    <WordFrequencySimple data={data.frequentWords} />
                  </div>
                )}

                {/* Link Analysis View */}
                {activeView === 'links' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    <LinkAnalysisSimple data={data.linkAnalysis} />
                  </div>
                )}

                {/* Word Frequency View */}
                {activeView === 'words' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    <WordFrequencyDetailTable data={data.frequentWords} />
                  </div>
                )}

                {/* Settings View */}
                {activeView === 'settings' && (
                  <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Dashboard Settings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Scraping Depth</label>
                        <select style={{ 
                          display: 'block', 
                          width: '100%', 
                          padding: '0.5rem 0.75rem', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '0.375rem', 
                          backgroundColor: 'white'
                        }}>
                          <option>Homepage Only</option>
                          <option>One Level Deep</option>
                          <option>Two Levels Deep</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Data Refresh Rate</label>
                        <select style={{ 
                          display: 'block', 
                          width: '100%', 
                          padding: '0.5rem 0.75rem', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '0.375rem', 
                          backgroundColor: 'white'
                        }}>
                          <option>Manual Only</option>
                          <option>Daily</option>
                          <option>Weekly</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          id="respect-robots"
                          name="respect-robots"
                          type="checkbox"
                          style={{ 
                            height: '1rem', 
                            width: '1rem', 
                            color: '#2563eb', 
                            border: '1px solid #d1d5db', 
                            borderRadius: '0.25rem' 
                          }}
                          defaultChecked
                        />
                        <label htmlFor="respect-robots" style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                          Respect robots.txt rules
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    
  );
};

// Component for sidebar items
const SidebarItem = ({ label, active, onClick }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      backgroundColor: active ? '#374151' : 'transparent',
      color: active ? 'white' : '#9ca3af'
    }}
    onClick={onClick}
  >
    <span>{label}</span>
  </div>
);

// Components for different card types

const MetricsCard = ({ data }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Page Metrics</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
      <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.375rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Words</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{data.wordCount}</p>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '0.375rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Paragraphs</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{data.paragraphs}</p>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f5f3ff', borderRadius: '0.375rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Images</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>{data.images}</p>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fefce8', borderRadius: '0.375rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Links</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ca8a04' }}>{data.links}</p>
      </div>
    </div>
  </div>
);

const WordFrequencySimple = ({ data }) => {
  // Find max count for scaling
  const maxCount = Math.max(...data.map(item => item.count));
  
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Most Frequent Words</h3>
      <div>
        {data.map((item, index) => (
          <div key={item.word} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.875rem' }}>{item.word}</span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.count}</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', height: '0.5rem' }}>
              <div 
                style={{ 
                  width: `${(item.count / maxCount) * 100}%`, 
                  backgroundColor: '#4f46e5', 
                  height: '100%', 
                  borderRadius: '0.25rem' 
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LinkAnalysisSimple = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Link Analysis</h3>
      <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Create a simple pie chart with CSS */}
        <div style={{ 
          width: '150px', 
          height: '150px', 
          borderRadius: '50%', 
          background: `conic-gradient(#3b82f6 0% ${(data[0].count / total) * 100}%, #f97316 ${(data[0].count / total) * 100}% 100%)` 
        }} />
        <div style={{ position: 'absolute', top: '100px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          {data.map(item => (
            <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '0.75rem', 
                height: '0.75rem', 
                backgroundColor: item.type === 'Internal' ? '#3b82f6' : '#f97316',
                borderRadius: '0.25rem'
              }} />
              <span>{item.type}: {item.count} ({Math.round((item.count / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VisitorsSimple = ({ data }) => {
  const maxVisitors = Math.max(...data.map(item => item.visitors));
  
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Visitor Trends</h3>
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'space-between', 
        height: '200px', 
        padding: '1rem 0' 
      }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{ 
              height: `${(item.visitors / maxVisitors) * 150}px`, 
              width: '20px', 
              backgroundColor: '#3b82f6', 
              borderRadius: '0.25rem 0.25rem 0 0'
            }} />
            <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', transform: 'rotate(-45deg)', transformOrigin: 'top left' }}>
              {item.date.slice(5)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WordFrequencyDetailTable = ({ data }) => {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Word Frequency Analysis</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Rank</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Word</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Count</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.word} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>{index + 1}</td>
                <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{item.word}</td>
                <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>{item.count}</td>
                <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  {((item.count / totalCount) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScrapingDashboard;
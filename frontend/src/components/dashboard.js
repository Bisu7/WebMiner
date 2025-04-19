import React, { useState, useEffect} from 'react';
import {ProductList, ProductPriceChart, CategoryDistribution, PriceRangeDistribution} from './Product';

const ScrapingDashboard = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock user data - in a real application, this would come from authentication
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Data Analyst",
    avatar: "AJ",
    joined: "Feb 2025",
    projects: 12
  };

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
    <div className="flex h-screen bg-gray-900 text-blue-50 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a,_#0b1120)]"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(65, 105, 225, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(65, 105, 225, 0.07) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'gridAnimation 25s linear infinite'
        }}></div>
        
        {/* Particles */}
        <div className="absolute inset-0 z-1">
          {Array(20).fill().map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-70 shadow-glow-blue" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px 2px rgba(56, 189, 248, 0.3)',
              animation: `particleFloat ${15 + Math.random() * 10}s infinite linear ${Math.random() * 5}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 relative z-10 border-r border-blue-900/30 backdrop-blur-sm bg-black/20 flex flex-col">
        <div className="p-6 border-b border-blue-900/30">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">WebMiner</h1>
          <p className="text-blue-200/70 text-sm">Data Visualization Dashboard</p>
        </div>
        
        <nav className="mt-6 flex-1">
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

        {/* Profile Section at Bottom */}
        <div className="mt-auto border-t border-blue-900/30">
          <div 
            className="p-4 flex items-center cursor-pointer hover:bg-blue-900/20"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium shadow-glow-blue">
              {user.avatar}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-100">{user.name}</p>
              <p className="text-xs text-blue-300">{user.role}</p>
            </div>
            <div className="ml-auto">
              <svg className={`w-5 h-5 text-blue-300 transition-transform ${profileOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="backdrop-blur-sm bg-black/40 border-t border-blue-900/30 p-4 animate-fadeIn">
              <div className="mb-4">
                <p className="text-xs text-blue-300 mb-1">Email</p>
                <p className="text-sm text-blue-100">{user.email}</p>
              </div>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs text-blue-300 mb-1">Joined</p>
                  <p className="text-sm text-blue-100">{user.joined}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-300 mb-1">Projects</p>
                  <p className="text-sm text-blue-100">{user.projects}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="w-full py-2 px-3 bg-blue-800/30 hover:bg-blue-700/40 rounded text-sm text-blue-100 border border-blue-700/30 transition-colors">
                  Profile
                </button>
                <button className="w-full py-2 px-3 bg-red-800/30 hover:bg-red-700/40 rounded text-sm text-red-100 border border-red-700/30 transition-colors">
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <header className="backdrop-blur-sm bg-black/30 border-b border-blue-900/30 p-4">
          <form onSubmit={handleSubmit} className="flex items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span role="img" aria-label="globe" className="text-blue-300">🌐</span>
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="w-full py-2 pl-10 pr-4 rounded bg-blue-900/20 border border-blue-800/50 text-blue-100 placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`ml-4 px-4 py-2 rounded bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-medium shadow-glow-blue ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:from-blue-500 hover:to-indigo-500'}`}
            >
              {isLoading ? "Scraping..." : "Scrape Data"}
            </button>
          </form>
        </header>

        <main className="p-6">
          {!data && !isLoading && (
            <div className="text-center py-16">
              <span role="img" aria-label="globe" className="text-6xl block mb-4 text-blue-400">🌐</span>
              <h2 className="text-2xl font-semibold text-blue-100 mb-2">No Data Available</h2>
              <p className="text-blue-300">Enter a URL above and click "Scrape Data" to begin</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-16">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto relative perspective-600">
                  <div className="w-full h-full transform-style-preserve-3d animate-spin-slow">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="absolute w-full h-full bg-gradient-to-br from-blue-400 to-indigo-400 opacity-85 border border-blue-200/20 shadow-glow-blue"></div>
                    ))}
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-blue-100 mb-2">Scraping Data...</h2>
              <p className="text-blue-300">This may take a few moments</p>
            </div>
          )}

          {data && !isLoading && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{data.pageInfo.title}</h2>
                <p className="text-blue-300">{data.pageInfo.url}</p>
                <p className="text-sm text-blue-400/70">Last scraped: {new Date(data.pageInfo.lastScraped).toLocaleString()}</p>
              </div>

              {/* Dashboard View */}
              {activeView === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MetricsCard data={data.metrics} />
                  <WordFrequencySimple data={data.frequentWords} />
                  <LinkAnalysisSimple data={data.linkAnalysis} />
                  <VisitorsSimple data={data.timeData} />
                </div>
              )}
              
              {/* Products View */}
              {activeView === 'products' && (
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProductPriceChart priceHistory={data.priceHistory} />
                    <CategoryDistribution products={data.products} />
                    <PriceRangeDistribution products={data.products} />
                  </div>
                  <ProductList products={data.products} />
                </div>
              )}

              {/* Content Analysis View */}
              {activeView === 'content' && (
                <div className="grid grid-cols-1 gap-6">
                  <MetricsCard data={data.metrics} />
                  <WordFrequencySimple data={data.frequentWords} />
                </div>
              )}

              {/* Link Analysis View */}
              {activeView === 'links' && (
                <div className="grid grid-cols-1 gap-6">
                  <LinkAnalysisSimple data={data.linkAnalysis} />
                </div>
              )}

              {/* Word Frequency View */}
              {activeView === 'words' && (
                <div className="grid grid-cols-1 gap-6">
                  <WordFrequencyDetailTable data={data.frequentWords} />
                </div>
              )}

              {/* Settings View */}
              {activeView === 'settings' && (
                <div className="backdrop-blur-sm bg-black/30 border border-blue-900/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-100">Dashboard Settings</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Scraping Depth</label>
                      <select className="w-full p-2 bg-blue-900/20 border border-blue-800/50 rounded text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/30">
                        <option>Homepage Only</option>
                        <option>One Level Deep</option>
                        <option>Two Levels Deep</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Data Refresh Rate</label>
                      <select className="w-full p-2 bg-blue-900/20 border border-blue-800/50 rounded text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/30">
                        <option>Manual Only</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="respect-robots"
                        name="respect-robots"
                        type="checkbox"
                        className="h-4 w-4 text-blue-400 border border-blue-800 rounded focus:ring-blue-400/30 bg-blue-900/20"
                        defaultChecked
                      />
                      <label htmlFor="respect-robots" className="ml-2 text-sm text-blue-200">
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gridAnimation {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 40px;
          }
        }
        
        @keyframes particleFloat {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotateX(0deg) rotateY(0deg);
          }
          to {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
        
        .perspective-600 {
          perspective: 600px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .shadow-glow-blue {
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
        }
      `}</style>
    </div>
  );
};

// Component for sidebar items
const SidebarItem = ({ label, active, onClick }) => (
  <div
    className={`flex items-center py-3 px-6 cursor-pointer ${active ? 'bg-blue-800/30 border-l-2 border-blue-400' : 'text-blue-300 hover:bg-blue-900/20'}`}
    onClick={onClick}
  >
    <span>{label}</span>
  </div>
);

// Components for different card types
const MetricsCard = ({ data }) => (
  <div className="backdrop-blur-sm bg-black/30 border border-blue-900/30 rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4 text-blue-100">Page Metrics</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <p className="text-blue-300 text-sm">Words</p>
        <p className="text-2xl font-bold text-blue-400">{data.wordCount}</p>
      </div>
      <div className="text-center p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
        <p className="text-emerald-300 text-sm">Paragraphs</p>
        <p className="text-2xl font-bold text-emerald-400">{data.paragraphs}</p>
      </div>
      <div className="text-center p-4 bg-purple-900/20 border border-purple-800/50 rounded-lg">
        <p className="text-purple-300 text-sm">Images</p>
        <p className="text-2xl font-bold text-purple-400">{data.images}</p>
      </div>
      <div className="text-center p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
        <p className="text-amber-300 text-sm">Links</p>
        <p className="text-2xl font-bold text-amber-400">{data.links}</p>
      </div>
    </div>
  </div>
);

const WordFrequencySimple = ({ data }) => {
  const maxCount = Math.max(...data.map(item => item.count));
  
  return (
    <div className="backdrop-blur-sm bg-black/30 border border-blue-900/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-100">Most Frequent Words</h3>
      <div>
        {data.map((item) => (
          <div key={item.word} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-blue-100">{item.word}</span>
              <span className="text-sm text-blue-300">{item.count}</span>
            </div>
            <div className="w-full bg-blue-900/30 rounded h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-indigo-400 h-full rounded"
                style={{ width: `${(item.count / maxCount) * 100}%` }} 
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
    <div className="backdrop-blur-sm bg-black/30 border border-blue-900/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-100">Link Analysis</h3>
      <div className="flex h-52 items-center justify-center relative">
        <div className="w-40 h-40 rounded-full overflow-hidden" style={{ 
          background: `conic-gradient(#38bdf8 0% ${(data[0].count / total) * 100}%, #f97316 ${(data[0].count / total) * 100}% 100%)`,
          boxShadow: '0 0 30px rgba(56, 189, 248, 0.3)'
        }} />
        <div className="absolute top-36 left-0 right-0 flex justify-center gap-8">
          {data.map(item => (
            <div key={item.type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ 
                backgroundColor: item.type === 'Internal' ? '#38bdf8' : '#f97316',
                boxShadow: `0 0 10px ${item.type === 'Internal' ? 'rgba(56, 189, 248, 0.7)' : 'rgba(249, 115, 22, 0.7)'}`
              }} />
              <span className="text-blue-100">{item.type}: {item.count} ({Math.round((item.count / total) * 100)}%)</span>
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
    <div className="backdrop-blur-sm bg-black/30 border border-blue-900/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-100">Visitor Trends</h3>
      <div className="flex items-end justify-between h-48 p-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-5 bg-gradient-to-t from-blue-400 to-indigo-400 rounded-t"
              style={{ 
                height: `${(item.visitors / maxVisitors) * 120}px`,
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
              }}
            />
            <div className="text-xs mt-2 transform -rotate-45 origin-top-left text-blue-300">
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
    <div className="backdrop-blur-sm bg-black/30 border border-blue-900/30 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-blue-900/30">
        <h3 className="text-lg font-semibold text-blue-100">Word Frequency Analysis</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-900/20">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-blue-300 uppercase">Rank</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-blue-300 uppercase">Word</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-blue-300 uppercase">Count</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-blue-300 uppercase">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-900/30">
            {data.map((item, index) => (
              <tr key={item.word} className="hover:bg-blue-900/10">
                <td className="py-3 px-6 text-sm text-blue-300">{index + 1}</td>
                <td className="py-3 px-6 text-sm font-medium text-blue-100">{item.word}</td>
                <td className="py-3 px-6 text-sm text-blue-300">{item.count}</td>
                <td className="py-3 px-6 text-sm text-blue-300">
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
import React, { useState, useEffect } from 'react';
import { ProductList, ProductPriceChart, CategoryDistribution, PriceRangeDistribution } from './Product';
import ProfilePage from './profile'; // Make sure to import the new component

const ScrapingDashboard = ({user,setUser}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo purposes, assume user is authenticated


  // In a real implementation, we would have an effect to check if the user is authenticated
  useEffect(() => {
    // Check if user is authenticated via Google OAuth
    // This is where you would typically call your auth provider's methods
    const checkAuthStatus = async () => {
      try {
        // Simulating an auth check
        // const user = await googleAuth.getCurrentUser();
        // if (user) {
        //   setIsAuthenticated(true);
        //   setUser({
        //     name: user.displayName,
        //     email: user.email,
        //     photoURL: user.photoURL,
        //     role: "Data Analyst", // This could come from your backend
        //     joined: new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        //     projects: 0 // This could come from your backend
        //   });
        // } else {
        //   setIsAuthenticated(false);
        // }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async () => {
    try {
      // In a real implementation, you would call your auth provider's login method
      // const result = await googleAuth.signInWithPopup();
      // if (result.user) {
      //   setIsAuthenticated(true);
      //   setUser({
      //     name: result.user.displayName,
      //     email: result.user.email,
      //     photoURL: result.user.photoURL,
      //     role: "Data Analyst",
      //     joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      //     projects: 0
      //   });
      // }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // In a real implementation, you would call your auth provider's logout method
      // await googleAuth.signOut();
      setIsAuthenticated(false);
      setShowProfilePage(false);
      localStorage.removeItem("user");
      setUser(null);
      // Redirect to front page or login screen
      window.location.href = "/"; // Or use your router's navigation
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}`, {
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
    } catch (error) {
      console.error('Error sending url:', error);
      setIsLoading(false);
    }
  };

  // If user is not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-blue-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-black/40 backdrop-blur-sm border border-blue-900/30 rounded-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">WebMiner</h1>
            <p className="mt-2 text-blue-200/70">Sign in to access your data visualization dashboard</p>
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-gray-800 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                // fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                // fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                // fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                // fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
          
          <div className="text-center text-blue-300 text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    );
  }

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
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-blue-500/30 shadow-glow-blue"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium shadow-glow-blue">
                {user.avatar}
              </div>
            )}
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
                <button 
                  className="w-full py-2 px-3 bg-blue-800/30 hover:bg-blue-700/40 rounded text-sm text-blue-100 border border-blue-700/30 transition-colors"
                  onClick={() => {
                    setShowProfilePage(true);
                    setProfileOpen(false);
                  }}
                >
                  Profile
                </button>
                <button 
                  className="w-full py-2 px-3 bg-red-800/30 hover:bg-red-700/40 rounded text-sm text-red-100 border border-red-700/30 transition-colors"
                  onClick={handleLogout}
                >
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

      {/* Profile Page Modal */}
      {showProfilePage && (
        <ProfilePage 
          user={user}
          onClose={() => setShowProfilePage(false)}
          onLogout={handleLogout}
        />
      )}

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
        
        .shadow-glow-red {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
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
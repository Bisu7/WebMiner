import React, { useState, useEffect } from 'react';

const ProfilePage = ({ user, onClose, onLogout }) => {
  // In a real implementation, we would use the user data from Google OAuth
  // For demonstration, we'll use the user data passed from the parent component
  
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const handleLogout = () => {
    setLoading(true);
    // In a real implementation, we would call the OAuth logout function
    setTimeout(() => {
      setLoading(false);
      onLogout();
    }, 800); // Simulate API call
  };
  
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to save profile changes
    setTimeout(() => {
      setLoading(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    }, 800);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-blue-900/40 to-black/60 border border-blue-800/50 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800/30">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            User Profile
          </h2>
          <button 
            onClick={onClose}
            className="text-blue-300 hover:text-blue-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Profile content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* Avatar section */}
            <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-blue-500/30 shadow-glow-blue"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-glow-blue">
                  {user.avatar || user.name?.charAt(0)}
                </div>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-blue-100 font-semibold text-lg">{user.name}</p>
                <p className="text-blue-300 text-sm">{user.role}</p>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                <div className="p-2 bg-blue-900/20 rounded border border-blue-800/30 text-center">
                  <p className="text-xs text-blue-300">Projects</p>
                  <p className="text-blue-100">{user.projects || 0}</p>
                </div>
                <div className="p-2 bg-blue-900/20 rounded border border-blue-800/30 text-center">
                  <p className="text-xs text-blue-300">Joined</p>
                  <p className="text-blue-100">{user.joined}</p>
                </div>
              </div>
            </div>
            
            {/* Form section */}
            <div className="flex-1">
              <form onSubmit={handleSaveChanges}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-300 mb-1">Name</label>
                  <input 
                    type="text" 
                    defaultValue={user.name}
                    className="w-full py-2 px-3 bg-blue-900/20 border border-blue-800/50 rounded text-blue-100 placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    defaultValue={user.email}
                    readOnly
                    className="w-full py-2 px-3 bg-blue-900/30 border border-blue-800/50 rounded text-blue-100/70 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-blue-400">Email cannot be changed (managed by Google)</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-300 mb-1">Role</label>
                  <select 
                    defaultValue={user.role}
                    className="w-full py-2 px-3 bg-blue-900/20 border border-blue-800/50 rounded text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                  >
                    <option>Data Analyst</option>
                    <option>Developer</option>
                    <option>Marketing</option>
                    <option>Administrator</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-300 mb-1">Notification Preferences</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-400 border border-blue-800 rounded focus:ring-blue-400/30 bg-blue-900/20"
                      />
                      <label htmlFor="email-notifications" className="ml-2 text-sm text-blue-200">
                        Email notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="dashboard-notifications"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-400 border border-blue-800 rounded focus:ring-blue-400/30 bg-blue-900/20"
                      />
                      <label htmlFor="dashboard-notifications" className="ml-2 text-sm text-blue-200">
                        Dashboard notifications
                      </label>
                    </div>
                  </div>
                </div>
                
                {updateSuccess && (
                  <div className="p-3 mb-4 bg-green-900/30 border border-green-800/50 rounded text-green-300 text-sm">
                    Profile successfully updated!
                  </div>
                )}
                
                <div className="flex justify-between pt-4 border-t border-blue-800/30">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-medium shadow-glow-blue ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:from-blue-500 hover:to-indigo-500'}`}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loading}
                    className={`px-4 py-2 rounded bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium shadow-glow-red ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:from-red-600 hover:to-pink-600'}`}
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
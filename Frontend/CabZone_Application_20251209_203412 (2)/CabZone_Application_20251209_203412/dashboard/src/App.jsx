import React, { useState, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/theme.css';

// Import the new landing page
import LandingPage from './pages/LandingPage';

// Existing imports
import Login from './components/Login';
import DashboardOverview from './components/DashboardOverview';
import LiveTracking from './components/LiveTracking';
import DriverManagement from './components/DriverManagement';
import VehicleManagement from './components/VehicleManagement';
import Leaderboard from './components/Leaderboard';
import DocumentVault from './components/DocumentVault';
import Analytics from './components/Analytics';
import ExpenseTracker from './components/ExpenseTracker';
import CommunicationHub from './components/CommunicationHub';
import SettingsPanel from './components/SettingsPanel';
import AIAssistant from './components/AIAssistant';
import { ToastContainer } from './components/Toast';
// import DriverDashboard from './components/driver/DriverDashboard';

import {
  LayoutDashboard,
  Users,
  Car,
  MapPin,
  Trophy,
  FolderLock,
  BarChart3,
  Wallet,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl gradient-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Owner Dashboard Component (keep existing code)
function OwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [showAI, setShowAI] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(7);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toasts, setToasts] = useState([]);

  const handleLogout = () => {
    // Clear authentication
    logout();
    // Redirect to the React landing page
    window.location.href = '/dashboard/index.html';
  };

  // Toast notification functions
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    // { id: 'tracking', label: 'Live Tracking', icon: MapPin },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    // { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'documents', label: 'Document Vault', icon: FolderLock },
    // { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    // { id: 'expenses', label: 'Expenses', icon: Wallet },
    // { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Analytics theme={theme} />;
      // case 'tracking':
      //   return <LiveTracking />;
      case 'drivers':
        return <DriverManagement theme={theme} addToast={addToast} />;
      case 'vehicles':
        return <VehicleManagement theme={theme} addToast={addToast} />;
      // case 'leaderboard':
      //   return <Leaderboard />;
      case 'documents':
        return <DocumentVault theme={theme} />;
      // case 'analytics':
      //   return <Analytics />;
      // case 'expenses':
      //   return <ExpenseTracker />;
      // case 'communication':
      //   return <CommunicationHub />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Analytics theme={theme} />;
    }
  };

  const toggleTheme = () => {
    const themes = ['dark', 'light', 'glass'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50 text-slate-800' : theme === 'glass' ? 'bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80' : 'bg-slate-900 text-slate-100'}`}>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 mx-4 mt-4">
        <div className={`p-4 rounded-xl border ${theme === 'light' ? 'bg-white border-gray-200 shadow-sm' : 'glass-card'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition-colors lg:hidden ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-slate-700/50 hover:bg-slate-600/50'}`}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center space-x-3">

                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent ml-4">
                  CZ
                </span>
              </div>
            </div>

            {/* Spacer to center the right-side icons */}
            <div className="flex-1"></div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAI(true)}
                className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                title="AI Assistant"
              >
                <Sparkles size={18} />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors border ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700' : 'bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/50'}`}
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button
                className={`p-2 rounded-lg relative transition-all border ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700' : 'bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/50'}`}
                onClick={() => setNotificationCount(0)}
              >
                <Bell size={18} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center border border-slate-800">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium shadow-md">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-slate-200'}`}>{user?.username}</span>
                    <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Owner</span>
                  </div>
                  <svg className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-gray-500 group-hover:text-gray-700' : 'text-slate-400 group-hover:text-slate-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border py-1.5 z-50 overflow-hidden ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700/50'}`}>
                    <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-700/50'}`}>
                      <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-slate-200'}`}>{user?.username}</p>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>{user?.email || 'No email provided'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-3 transition-colors ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-slate-300 hover:bg-slate-700/50'}`}
                    >
                      <LogOut size={16} className={theme === 'light' ? 'text-gray-500' : 'text-slate-400'} />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex pt-24 px-4 pb-4 gap-4">
        {/* Sidebar */}
        <aside className={`p-4 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden lg:w-20'} fixed lg:sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto z-40`}>
          <div className={`rounded-xl h-full p-4 border ${theme === 'light' ? 'bg-white border-gray-200 shadow-sm' : 'bg-slate-800/80 backdrop-blur-sm border-slate-700/50'}`}>
            <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-md shadow-blue-500/20'
                      : theme === 'light' ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                  >
                    <Icon
                      className={`mr-3 ${activeTab === item.id ? 'text-white' : theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
                      size={18}
                    />
                    <span>{item.label}</span>
                    {item.id === 'drivers' && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300">
                        New
                      </span>
                    )}
                  </button>
                );
              })}
              {/* Logout Button */}
              <div className={`pt-4 mt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-emerald-500/20'}`}>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 hover:border hover:border-red-500/50 ${theme === 'light' ? 'text-red-600' : 'text-red-400'} ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
                >
                  <LogOut size={20} />
                  <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'} font-medium`}>
                    Logout
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-4 transition-all duration-300">
          {renderContent()}
        </main>
      </div>

      {/* AI Assistant Panel */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

// Main App with NEW Routing Structure
function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Landing Page - NEW! */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Owner Dashboard */}
        <Route
          path="/owner/*"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Driver Dashboard */}
        {/**
         * Driver Dashboard (commented out as requested)
         *
         * <Route
         *   path="/driver/*"
         *   element={
         *     <ProtectedRoute allowedRoles={['driver']}>
         *       <DriverDashboard />
         *     </ProtectedRoute>
         *   }
         * />
         */}

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="glass-card p-8 text-center">
                <h1 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h1>
                <p className="text-gray-400">You don't have permission to access this page.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}

// Wrap with AuthProvider and ThemeProvider
export default function AppWithAuth() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}

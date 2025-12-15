import React, { useState, useEffect } from 'react';
import { Home, FileText, CheckCircle, Bell, MessageSquare, Settings, Upload, Download, Eye, LogOut, User, Car as CarIcon, Award, TrendingUp, Calendar, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';
import DriverSelector from './DriverSelector';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [driverData, setDriverData] = useState({
    name: user?.name || 'Rajesh Kumar',
    vehicle: user?.vehicle || 'MH-01-AB-1234',
    owner: 'Mumbai Cabs Pvt Ltd',
    compliance_score: 85,
    stats: {
      verified: 6,
      pending: 2,
      expiring: 1,
      total: 9
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setDriverData((prev) => ({
      ...prev,
      name: selectedDriver?.name || user?.name || prev.name,
    }));
  }, [selectedDriver, user]);

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
  };

  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: 'Driving License',
      number: 'DL-0120210012345',
      status: 'verified',
      upload_date: '2024-10-15',
      expiry_date: '2030-05-15',
      file_url: '#'
    },
    {
      id: 2,
      type: 'Aadhaar Card',
      number: 'XXXX-XXXX-1234',
      status: 'pending',
      upload_date: '2024-10-26',
      expiry_date: null,
      file_url: '#'
    },
    {
      id: 3,
      type: 'Vehicle Insurance',
      number: 'INS-2024-5678',
      status: 'expiring',
      upload_date: '2024-01-10',
      expiry_date: '2024-11-10',
      file_url: '#'
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'expiry',
      title: 'Insurance Expiring Soon',
      message: 'Your vehicle insurance expires in 15 days. Please renew.',
      time: '15 mins ago',
      read: false
    },
    {
      id: 2,
      type: 'verification',
      title: 'Document Verified',
      message: 'Your Driving License has been verified by the owner.',
      time: '2 hours ago',
      read: false
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'expiring':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return '✅';
      case 'pending':
        return '⏳';
      case 'expiring':
        return '⚠️';
      case 'rejected':
        return '❌';
      default:
        return '📄';
    }
  };

  const renderHome = () => (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <DriverSelector selectedDriver={selectedDriver} onSelect={handleDriverSelect} />
      </motion.div>
      {/* Hero Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="glass-card p-8 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-teal-500/10 border-2 border-emerald-500/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Welcome Back!</h1>
                  <p className="text-xl text-emerald-400 font-semibold">{driverData.name}</p>
                  <p className={`text-sm mt-1 ${selectedDriver ? 'text-emerald-300' : 'text-gray-400'}`}>
                    {selectedDriver
                      ? `Managing documents for ${selectedDriver.name || selectedDriver.id}`
                      : 'Select a driver to start managing their documents'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <CarIcon className="text-cyan-400" size={24} />
                  <div>
                    <p className="text-xs text-gray-400">Assigned Vehicle</p>
                    <p className="font-bold text-white">{driverData.vehicle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <Award className="text-emerald-400" size={24} />
                  <div>
                    <p className="text-xs text-gray-400">Fleet Owner</p>
                    <p className="font-bold text-white">{driverData.owner}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                <TrendingUp size={64} className="text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} className="text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">{driverData.stats.verified}</div>
          </div>
          <h3 className="text-sm font-semibold text-gray-300">Verified Documents</h3>
          <p className="text-xs text-gray-500 mt-1">All approved ✓</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400">{driverData.stats.pending}</div>
          </div>
          <h3 className="text-sm font-semibold text-gray-300">Pending Review</h3>
          <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} className="text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-orange-400">{driverData.stats.expiring}</div>
          </div>
          <h3 className="text-sm font-semibold text-gray-300">Expiring Soon</h3>
          <p className="text-xs text-gray-500 mt-1">Action required</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-cyan-400">{driverData.stats.total}</div>
          </div>
          <h3 className="text-sm font-semibold text-gray-300">Total Documents</h3>
          <p className="text-xs text-gray-500 mt-1">In your vault</p>
        </motion.div>
      </div>

      {/* Compliance Score - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Compliance Score</h2>
            <p className="text-gray-400">Keep your documents up to date</p>
          </div>
          <div className="text-5xl font-bold text-emerald-400">{driverData.compliance_score}%</div>
        </div>
        <div className="relative">
          <div className="w-full bg-white/10 rounded-full h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${driverData.compliance_score}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-6 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
            </motion.div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-gray-400">0%</span>
          <span className="text-emerald-400 font-semibold">Excellent!</span>
          <span className="text-gray-400">100%</span>
        </div>
      </motion.div>

      {/* Quick Actions - Commented out as per request
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('documents')}
            className="glass-button p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
          >
            <Upload size={24} className="text-emerald-400" />
            <span className="text-sm font-medium">Upload Doc</span>
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className="glass-button p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
          >
            <CheckCircle size={24} className="text-cyan-400" />
            <span className="text-sm font-medium">Check Status</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className="glass-button p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
          >
            <Bell size={24} className="text-orange-400" />
            <span className="text-sm font-medium">Notifications</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className="glass-button p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
          >
            <MessageSquare size={24} className="text-purple-400" />
            <span className="text-sm font-medium">Messages</span>
          </button>
        </div>
      </motion.div>
      */}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">My Documents</h1>
          <p className="text-gray-400 mt-1">Manage and track all your documents</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={20} />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`glass-card p-6 border-l-4 ${
              doc.status === 'verified' ? 'border-green-500' :
              doc.status === 'pending' ? 'border-yellow-500' :
              doc.status === 'expiring' ? 'border-orange-500' : 'border-red-500'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  doc.status === 'verified' ? 'bg-green-500/20' :
                  doc.status === 'pending' ? 'bg-yellow-500/20' :
                  doc.status === 'expiring' ? 'bg-orange-500/20' : 'bg-red-500/20'
                }`}>
                  <FileText size={24} className={
                    doc.status === 'verified' ? 'text-green-400' :
                    doc.status === 'pending' ? 'text-yellow-400' :
                    doc.status === 'expiring' ? 'text-orange-400' : 'text-red-400'
                  } />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{doc.type}</h3>
                  <p className="text-sm text-gray-400">{doc.number}</p>
                </div>
              </div>
              <span className={`status-badge border ${getStatusColor(doc.status)}`}>
                {getStatusIcon(doc.status)} {doc.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-400">Uploaded:</span>
                <span className="text-white">{doc.upload_date}</span>
              </div>
              {doc.expiry_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-400">Expires:</span>
                  <span className={doc.status === 'expiring' ? 'text-orange-400 font-semibold' : 'text-white'}>
                    {doc.expiry_date}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="glass-button flex-1 flex items-center justify-center gap-2 hover:bg-emerald-500/20">
                <Eye size={18} />
                <span>View</span>
              </button>
              <button className="glass-button flex-1 flex items-center justify-center gap-2 hover:bg-cyan-500/20">
                <Download size={18} />
                <span>Download</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
        <button className="glass-button">Mark All as Read</button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-6 ${!notif.read ? 'border-l-4 border-emerald-500' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{notif.title}</h3>
                <p className="text-gray-400 mb-2">{notif.message}</p>
                <p className="text-sm text-gray-500">{notif.time}</p>
              </div>
              <Bell size={24} className={notif.read ? 'text-gray-500' : 'text-emerald-400'} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHome();
      case 'documents':
        return renderDocuments();
      case 'notifications':
        return renderNotifications();
      default:
        return renderHome();
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'documents', label: 'My Documents', icon: FileText },
    { id: 'status', label: 'Verification Status', icon: CheckCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-4 mt-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">CabDoc Driver</h1>
              <p className="text-xs text-emerald-400/70">Document Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('notifications')}
              className="glass-button p-2 relative hover:bg-emerald-500/20 transition-colors"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <div className="glass-card p-2 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-all group relative border border-emerald-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center font-bold">
                {driverData.name.charAt(0)}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold">{driverData.name}</p>
                <p className="text-xs text-gray-400">Driver</p>
              </div>
              <div className="text-emerald-400">
                <Settings size={16} />
              </div>
              {/* Logout Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-emerald-500/30">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2 font-semibold"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex pt-24 px-4 pb-4 gap-4">
        {/* Sidebar */}
        <aside className="glass-card p-4 w-64 sticky top-24 h-[calc(100vh-7rem)]">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 border border-emerald-500/50'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            {/* Logout Button */}
            <div className="pt-4 mt-4 border-t border-emerald-500/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-500/20 hover:border hover:border-red-500/50 text-red-400"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;

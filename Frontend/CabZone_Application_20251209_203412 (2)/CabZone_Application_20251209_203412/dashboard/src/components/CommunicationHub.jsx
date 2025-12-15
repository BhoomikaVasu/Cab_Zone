import React, { useState } from 'react';
import { Send, Search, Users, Bell, MessageSquare, Phone, Video, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const CommunicationHub = ({ addToast }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const drivers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      status: 'online',
      lastMessage: 'Thanks for the update!',
      time: '2m ago',
      unread: 0,
      avatar: 'RK'
    },
    {
      id: 2,
      name: 'Amit Sharma',
      status: 'online',
      lastMessage: 'Document uploaded successfully',
      time: '15m ago',
      unread: 2,
      avatar: 'AS'
    },
    {
      id: 3,
      name: 'Suresh Patil',
      status: 'offline',
      lastMessage: 'Will check the vehicle tomorrow',
      time: '1h ago',
      unread: 0,
      avatar: 'SP'
    },
    {
      id: 4,
      name: 'Vijay Singh',
      status: 'online',
      lastMessage: 'License renewal done',
      time: '3h ago',
      unread: 1,
      avatar: 'VS'
    },
    {
      id: 5,
      name: 'Prakash Desai',
      status: 'offline',
      lastMessage: 'Okay, will do',
      time: '1d ago',
      unread: 0,
      avatar: 'PD'
    },
  ];

  const messages = selectedDriver ? [
    { id: 1, sender: 'owner', text: 'Hi, please upload your updated insurance document', time: '10:30 AM' },
    { id: 2, sender: 'driver', text: 'Sure, I will upload it today', time: '10:32 AM' },
    { id: 3, sender: 'driver', text: 'Document uploaded successfully', time: '2:15 PM' },
    { id: 4, sender: 'owner', text: 'Thanks for the update!', time: '2:20 PM' },
  ] : [];

  const alerts = [
    { id: 1, type: 'document', message: '3 drivers have pending document uploads', time: '1h ago' },
    { id: 2, type: 'maintenance', message: 'Vehicle MH-03 maintenance scheduled for tomorrow', time: '3h ago' },
    { id: 3, type: 'renewal', message: 'License renewal reminder sent to 5 drivers', time: '1d ago' },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      if (addToast) addToast(`Message sent to ${selectedDriver?.name || 'driver'}`, 'success');
      setMessage('');
    }
  };

  const handleBroadcastMessage = () => {
    setShowBroadcastModal(true);
  };

  const handlePhoneCall = () => {
    if (addToast) addToast(`Calling ${selectedDriver?.name}`, 'info');
  };

  const handleVideoCall = () => {
    if (addToast) addToast(`Video call with ${selectedDriver?.name}`, 'info');
  };

  const handleMoreOptions = () => {
    if (addToast) addToast('More options coming soon!', 'info');
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Communication Hub</h1>
            <p className="text-gray-400">Stay connected with your drivers</p>
          </div>
          <button
            onClick={handleBroadcastMessage}
            className="glass-button px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 flex items-center gap-2"
          >
            <Users size={20} />
            Broadcast Message
          </button>
        </div>
      </motion.div>

      {/* Main Communication Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                onClick={() => setSelectedDriver(driver)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedDriver?.id === driver.id
                    ? 'bg-purple-500/20 border border-purple-500/50'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                      {driver.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      driver.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{driver.name}</p>
                      <span className="text-xs text-gray-400">{driver.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{driver.lastMessage}</p>
                  </div>
                  {driver.unread > 0 && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                      {driver.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:col-span-2"
        >
          {selectedDriver ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                      {selectedDriver.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      selectedDriver.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div>
                    <p className="font-semibold">{selectedDriver.name}</p>
                    <p className="text-xs text-gray-400">{selectedDriver.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePhoneCall}
                    className="glass-button p-2 hover:bg-green-500/20 transition-colors"
                    title="Voice Call"
                  >
                    <Phone size={20} />
                  </button>
                  <button
                    onClick={handleVideoCall}
                    className="glass-button p-2 hover:bg-blue-500/20 transition-colors"
                    title="Video Call"
                  >
                    <Video size={20} />
                  </button>
                  <button
                    onClick={handleMoreOptions}
                    className="glass-button p-2 hover:bg-orange-500/20 transition-colors"
                    title="More Options"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'owner' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-xl ${
                        msg.sender === 'owner'
                          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30'
                          : 'bg-white/10'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="glass-input flex-1"
                />
                <button
                  onClick={handleSendMessage}
                  className="glass-button px-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">Select a driver to start messaging</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Automated Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Bell className="text-orange-400" />
          Automated Alerts & Notifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Bell size={20} className="text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">{alert.message}</p>
                  <p className="text-xs text-gray-400">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBroadcastModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/20">
              <h2 className="text-2xl font-bold gradient-text">Broadcast Message</h2>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <MoreVertical size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message to all drivers:
                </label>
                <textarea
                  placeholder="Type your broadcast message..."
                  rows={6}
                  className="glass-input w-full resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    if (addToast) addToast(`Broadcast sent to ${filteredDrivers.length} drivers`, 'success');
                    setShowBroadcastModal(false);
                  }}
                  className="btn-primary flex-1"
                >
                  Send Broadcast
                </button>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CommunicationHub;

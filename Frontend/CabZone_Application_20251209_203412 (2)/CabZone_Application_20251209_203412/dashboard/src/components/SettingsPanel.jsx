import React, { useState } from 'react';
import { User, Lock, Bell, Palette, Globe, Key, CreditCard, Zap, Shield, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@fleetmaster.com',
    phone: '+91 98765 43210',
    company: 'FleetMaster Cabs',
    notifications: {
      email: true,
      sms: true,
      push: true,
      documentExpiry: true,
      maintenance: true,
      newUploads: false,
    },
    twoFactor: true,
    theme: 'dark',
    language: 'en',
  });

  const handleSave = () => {
    // Handle save settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Settings & Profile</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Menu */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <nav className="space-y-2">
            {[
              { icon: User, label: 'Profile', id: 'profile' },
              { icon: Lock, label: 'Security', id: 'security' },
              { icon: Bell, label: 'Notifications', id: 'notifications' },
              { icon: Palette, label: 'Appearance', id: 'appearance' },
              { icon: Zap, label: 'Integrations', id: 'integrations' },
              { icon: CreditCard, label: 'Billing', id: 'billing' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:col-span-2 space-y-6"
        >
          {/* Profile Section */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User size={24} className="text-blue-400" />
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-2xl font-bold">
                  JD
                </div>
                <button className="glass-button px-4 py-2">Change Avatar</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Company</label>
                  <input
                    type="text"
                    value={settings.company}
                    onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield size={24} className="text-green-400" />
              Security Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-semibold">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactor}
                    onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4169E1]"></div>
                </label>
              </div>
              <button className="glass-button px-6 py-3 w-full flex items-center justify-center gap-2">
                <Key size={20} />
                Change Password
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell size={24} className="text-orange-400" />
              Notification Preferences
            </h2>
            <div className="space-y-3">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [key]: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4169E1]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* API Integrations */}
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap size={24} className="text-yellow-400" />
              API Integrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'AuthBridge', status: 'Connected', color: 'green' },
                { name: 'GPS Tracking', status: 'Connected', color: 'green' },
                { name: 'Payment Gateway', status: 'Not Connected', color: 'gray' },
                { name: 'SMS Service', status: 'Connected', color: 'green' },
              ].map((integration) => (
                <div key={integration.name} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{integration.name}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${integration.color === 'green'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                        }`}
                    >
                      {integration.status}
                    </span>
                  </div>
                  <button className="glass-button px-4 py-2 text-sm w-full">
                    {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="glass-button px-8 py-3 w-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 hover:from-blue-600/30 hover:to-blue-400/30 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save All Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPanel;

import React from 'react';
import { Car, Users, FileText, Upload, TrendingUp, AlertCircle, DollarSign, Calendar, Activity, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const DashboardOverview = () => {
  const stats = [
    { 
      label: 'Total Cars', 
      value: '48', 
      change: '+12%', 
      icon: Car, 
      color: 'from-slate-700 to-slate-600',
      trend: 'up',
      bg: 'bg-slate-700/50',
      border: 'border-slate-600/50'
    },
    { 
      label: 'Total Drivers', 
      value: '52', 
      change: '+8%', 
      icon: Users, 
      color: 'from-blue-700 to-blue-600',
      trend: 'up',
      bg: 'bg-blue-700/30',
      border: 'border-blue-600/30'
    },
    { 
      label: 'Pending Documents', 
      value: '7', 
      change: '-3', 
      icon: FileText, 
      color: 'from-amber-700 to-amber-600',
      trend: 'down',
      bg: 'bg-amber-700/20',
      border: 'border-amber-600/30'
    },
    { 
      label: 'Recent Uploads', 
      value: '23', 
      change: '+15', 
      icon: Upload, 
      color: 'from-emerald-700 to-emerald-600',
      trend: 'up',
      bg: 'bg-emerald-700/20',
      border: 'border-emerald-600/30'
    },
  ];

  // Lightweight analytics demo data
  const tripsTrend = [
    { day: 'Mon', trips: 20 },
    { day: 'Tue', trips: 35 },
    { day: 'Wed', trips: 28 },
    { day: 'Thu', trips: 48 },
    { day: 'Fri', trips: 52 },
    { day: 'Sat', trips: 30 },
    { day: 'Sun', trips: 22 },
  ];

  const driverStatus = [
    { name: 'Active', value: 20, color: '#3b82f6' },
    { name: 'Idle', value: 7, color: '#f59e0b' },
    { name: 'On Leave', value: 5, color: '#ef4444' },
  ];

  const notifications = [
    { 
      id: 1, 
      type: 'warning', 
      message: '3 driver licenses expiring in 7 days', 
      time: '2 hours ago',
      priority: 'high'
    },
    { 
      id: 2, 
      type: 'info', 
      message: 'Vehicle RC-2341 insurance expires next week', 
      time: '5 hours ago',
      priority: 'medium'
    },
    { 
      id: 3, 
      type: 'success', 
      message: '5 new documents uploaded and verified', 
      time: '1 day ago',
      priority: 'low'
    },
    { 
      id: 4, 
      type: 'warning', 
      message: 'Fitness certificate pending for 2 vehicles', 
      time: '1 day ago',
      priority: 'high'
    },
  ];

  const recentActivity = [
    { driver: 'Rajesh Kumar', action: 'License renewed', vehicle: 'MH-01-AB-1234', time: '10 mins ago' },
    { driver: 'Amit Sharma', action: 'Document uploaded', vehicle: 'MH-02-CD-5678', time: '1 hour ago' },
    { driver: 'Suresh Patil', action: 'Vehicle inspection', vehicle: 'MH-03-EF-9012', time: '3 hours ago' },
    { driver: 'Vijay Singh', action: 'Insurance updated', vehicle: 'MH-04-GH-3456', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Vehicles', value: '25', change: '+6%', icon: Car, color: 'from-blue-600 to-indigo-600' },
          { label: 'Drivers', value: '32', change: '+3%', icon: Users, color: 'from-emerald-600 to-green-600' },
          { label: 'Verified Docs', value: '140', change: '+12', icon: FileText, color: 'from-sky-600 to-cyan-600' },
          { label: 'Expiring Docs', value: '6', change: '2 urgent', icon: AlertCircle, color: 'from-rose-600 to-pink-600' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{kpi.label}</p>
                  <h3 className="text-3xl font-bold">{kpi.value}</h3>
                  <p className="text-xs text-slate-400 mt-1">{kpi.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <Icon size={22} className="text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-orange-400'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center animate-float`}>
                  <Icon size={28} className="text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div> */}

{/* Notifications and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Notifications Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-slate-700/10 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <AlertCircle className="text-amber-400" size={20} />
              Notifications
            </h2>
            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
              {notifications.filter(n => n.priority === 'high').length} urgent
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {notifications.map((notification) => {
              const priorityColors = {
                high: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/15',
                medium: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15',
                low: 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/40'
              };
              
              const iconColors = {
                high: 'text-red-400',
                medium: 'text-amber-400',
                low: 'text-slate-400'
              };
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${priorityColors[notification.priority]}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className={`mt-0.5 flex-shrink-0 ${iconColors[notification.priority]}`} />
                    <div>
                      <p className="font-medium text-slate-100 mb-1">{notification.message}</p>
                      <p className="text-xs text-slate-400">{notification.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-slate-700/10 transition-all"
        >
          <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Activity className="text-blue-400" size={20} />
              Recent Activity
            </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                    <User size={16} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">{activity.driver}</p>
                    <p className="text-sm text-slate-300">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded">
                        {activity.vehicle}
                      </span>
                      <span className="text-xs text-slate-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Weekly Trips Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tripsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(17,24,39,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="trips" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Driver Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={driverStatus} dataKey="value" nameKey="name" outerRadius={90}>
                  {driverStatus.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(17,24,39,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;

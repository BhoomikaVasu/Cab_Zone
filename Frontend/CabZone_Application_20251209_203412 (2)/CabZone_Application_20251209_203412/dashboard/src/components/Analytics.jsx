import React from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, AlertTriangle, Users, Car, FileWarning, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Analytics = ({ theme = 'dark' }) => {
  // Operational KPIs (mock data)
  const kpis = {
    activeDrivers: 128,
    vehiclesAvailable: 54,
    pendingVerifications: 17,
    expiringDocs30d: 23,
  };

  const cardClass = theme === 'light'
    ? 'bg-white/90 border border-slate-200 shadow-sm rounded-2xl'
    : 'glass-card';

  const subTextClass = theme === 'light' ? 'text-slate-500' : 'text-gray-400';
  const headingClass = theme === 'light' ? 'text-slate-800' : 'text-white';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardClass} p-6`}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Operations Dashboard</h1>
        <p className={subTextClass}>Admin-focused insights for drivers, vehicles, assignments, and compliance</p>
      </motion.div>

      {/* Key Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${cardClass} p-6`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={`${subTextClass} text-sm mb-1`}>Active Drivers</p>
              <h3 className={`text-3xl font-bold ${headingClass}`}>{kpis.activeDrivers}</h3>
              <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
                <TrendingUp size={16} />
                +4 this week
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
              <Users size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`${cardClass} p-6`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={`${subTextClass} text-sm mb-1`}>Vehicles Available</p>
              <h3 className={`text-3xl font-bold ${headingClass}`}>{kpis.vehiclesAvailable}</h3>
              <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
                <Activity size={16} />
                Peak-ready now
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
              <Car size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${cardClass} p-6`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={`${subTextClass} text-sm mb-1`}>Pending Verifications</p>
              <h3 className={`text-3xl font-bold ${headingClass}`}>{kpis.pendingVerifications}</h3>
              <p className="text-orange-400 text-sm flex items-center gap-1 mt-2">
                <Clock size={16} />
                Documents awaiting approval
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
              <FileWarning size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`${cardClass} p-6`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={`${subTextClass} text-sm mb-1`}>Expiring Documents (30d)</p>
              <h3 className={`text-3xl font-bold ${headingClass}`}>{kpis.expiringDocs30d}</h3>
              <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                <AlertTriangle size={16} />
                Review and renew
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
              <Shield size={24} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;

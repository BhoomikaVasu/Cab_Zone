import React, { useState } from 'react';
import { DollarSign, TrendingDown, TrendingUp, PieChart, Calendar, Plus, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const ExpenseTracker = ({ addToast }) => {
  const [period, setPeriod] = useState('month');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  
  // Calculate financial metrics
  const totalRevenue = 297000;
  const totalExpenses = 172000;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = Math.round((netProfit / totalRevenue) * 100);

  const expenseCategories = [
    { name: 'Fuel', amount: 125000, percentage: 42, color: '#ef4444', trend: '+5%' },
    { name: 'Maintenance', amount: 45000, percentage: 15, color: '#f59e0b', trend: '-2%' },
    { name: 'Insurance', amount: 38000, percentage: 13, color: '#10b981', trend: '0%' },
    { name: 'Driver Salaries', amount: 65000, percentage: 22, color: '#3b82f6', trend: '+3%' },
    { name: 'Permits & Fees', amount: 15000, percentage: 5, color: '#8b5cf6', trend: '0%' },
    { name: 'Others', amount: 9000, percentage: 3, color: '#6b7280', trend: '+1%' },
  ];

  const monthlyExpenses = [
    { month: 'Jan', fuel: 120000, maintenance: 42000, insurance: 38000, salaries: 62000, other: 20000 },
    { month: 'Feb', fuel: 118000, maintenance: 45000, insurance: 38000, salaries: 63000, other: 22000 },
    { month: 'Mar', fuel: 122000, maintenance: 48000, insurance: 38000, salaries: 64000, other: 21000 },
    { month: 'Apr', fuel: 125000, maintenance: 45000, insurance: 38000, salaries: 65000, other: 24000 },
    { month: 'May', fuel: 128000, maintenance: 50000, insurance: 38000, salaries: 66000, other: 23000 },
    { month: 'Jun', fuel: 125000, maintenance: 45000, insurance: 38000, salaries: 65000, other: 24000 },
  ];

  const recentTransactions = [
    { id: 1, date: '2024-10-25', category: 'Fuel', description: 'Diesel - Station A', amount: 8500, type: 'expense' },
    { id: 2, date: '2024-10-24', category: 'Maintenance', description: 'Vehicle MH-03 Service', amount: 12000, type: 'expense' },
    { id: 3, date: '2024-10-24', category: 'Revenue', description: 'Daily Earnings', amount: 45000, type: 'income' },
    { id: 4, date: '2024-10-23', category: 'Fuel', description: 'Petrol - Station B', amount: 6500, type: 'expense' },
    { id: 5, date: '2024-10-23', category: 'Permits', description: 'Monthly Permit Renewal', amount: 5000, type: 'expense' },
    { id: 6, date: '2024-10-22', category: 'Revenue', description: 'Daily Earnings', amount: 48000, type: 'income' },
  ];

  const handleAddExpense = () => {
    if (addToast) addToast('Add expense feature coming soon!', 'info');
  };

  const handleExport = () => {
    if (addToast) addToast(`Exporting ${period} expense report`, 'success');
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    if (addToast) addToast(`Showing ${newPeriod} expenses`, 'info');
  };

  const handleFilter = () => {
    if (addToast) addToast('Advanced filters coming soon!', 'info');
  };

  const handleTransactionClick = (transaction) => {
    if (addToast) addToast(`Viewing transaction: ${transaction.description}`, 'info');
  };

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
            <h1 className="text-3xl font-bold gradient-text mb-2">Expense Tracker</h1>
            <p className="text-gray-400">Monitor and manage your fleet expenses</p>
          </div>
          <div className="flex gap-3">
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="glass-input"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={handleAddExpense}
              className="glass-button px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Expense
            </button>
            <button
              onClick={handleExport}
              className="glass-button px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 flex items-center gap-2"
            >
              <Download size={20} />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Financial Summary */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-1">Total Expenses</p>
              <h3 className="text-2xl font-bold">₹297,000</h3>
              <p className="text-red-500 flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" /> +8% from last {period}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-500/20">
              <DollarSign size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-1">Fuel Expenses</p>
              <h3 className="text-2xl font-bold">₹125,000</h3>
              <p className="text-red-500 flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" /> +5% from last {period}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-500/20">
              <DollarSign size={24} className="text-orange-500" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-1">Maintenance</p>
              <h3 className="text-2xl font-bold">₹45,000</h3>
              <p className="text-green-500 flex items-center mt-1">
                <TrendingDown size={16} className="mr-1" /> -2% from last {period}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/20">
              <DollarSign size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-1">Driver Salaries</p>
              <h3 className="text-2xl font-bold">₹65,000</h3>
              <p className="text-red-500 flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" /> +3% from last {period}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/20">
              <DollarSign size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {expenseCategories.map((category) => (
              <div key={category.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                <span className="text-sm">{category.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Monthly Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="fuel" name="Fuel" fill="#ef4444" />
                <Bar dataKey="maintenance" name="Maintenance" fill="#f59e0b" />
                <Bar dataKey="salaries" name="Salaries" fill="#3b82f6" />
                <Bar dataKey="other" name="Other" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-green-400">₹{(totalRevenue / 1000).toFixed(0)}k</h3>
              <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
                <TrendingUp size={16} />
                +12.5%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold text-red-400">₹{(totalExpenses / 1000).toFixed(0)}k</h3>
              <p className="text-orange-400 text-sm flex items-center gap-1 mt-2">
                <TrendingUp size={16} />
                +3.2%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <TrendingDown size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Net Profit</p>
              <h3 className="text-3xl font-bold text-blue-400">₹{(netProfit / 1000).toFixed(0)}k</h3>
              <p className="text-blue-400 text-sm flex items-center gap-1 mt-2">
                <TrendingUp size={16} />
                +18.7%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Profit Margin</p>
              <h3 className="text-3xl font-bold text-purple-400">{profitMargin}%</h3>
              <p className="text-purple-400 text-sm flex items-center gap-1 mt-2">
                <TrendingUp size={16} />
                +2.1%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <PieChart size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-6">Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }} 
              />
            </RePieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-xl font-bold mb-6">Expense Categories</h2>
          <div className="space-y-3">
            {expenseCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div className="flex-1">
                    <p className="font-semibold">{category.name}</p>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{(category.amount / 1000).toFixed(0)}k</p>
                  <p className={`text-sm ${category.trend.startsWith('+') ? 'text-red-400' : category.trend.startsWith('-') ? 'text-green-400' : 'text-gray-400'}`}>
                    {category.trend}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-6">Monthly Expense Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line type="monotone" dataKey="fuel" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="maintenance" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="salaries" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <button
            onClick={handleFilter}
            className="glass-button px-4 py-2 flex items-center gap-2"
          >
            <Filter size={16} />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Category</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Description</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Amount</th>
                <th className="text-center py-3 px-4 text-gray-400 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm">{transaction.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{transaction.category}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{transaction.description}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`status-badge border ${transaction.type === 'income' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {transaction.type}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseTracker;

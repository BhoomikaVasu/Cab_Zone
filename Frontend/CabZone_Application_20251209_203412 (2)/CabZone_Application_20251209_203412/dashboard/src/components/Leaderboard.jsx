import React, { useState } from 'react';
import { Trophy, Star, TrendingUp, TrendingDown, Award, Target, Zap, Medal, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = ({ addToast }) => {
  const [period, setPeriod] = useState('month');

  const drivers = [
    {
      id: 1,
      name: "Suresh Patil",
      vehicle: "KA-01-AB-1234",
      trips: 280,
      rating: 4.9,
      efficiency: 97,
      score: 950,
      trend: 5
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      vehicle: "KA-02-CD-5678",
      trips: 245,
      rating: 4.8,
      efficiency: 95,
      score: 920,
      trend: 3
    },
    {
      id: 3,
      name: "Prakash Desai",
      vehicle: "KA-03-EF-9012",
      trips: 220,
      rating: 4.7,
      efficiency: 92,
      score: 880,
      trend: -2
    },
    {
      id: 4,
      name: "Amit Sharma",
      vehicle: "KA-04-GH-3456",
      trips: 198,
      rating: 4.6,
      efficiency: 90,
      score: 850,
      trend: 1
    },
    {
      id: 5,
      name: "Vijay Singh",
      vehicle: "KA-05-IJ-7890",
      trips: 165,
      rating: 4.5,
      efficiency: 88,
      score: 820,
      trend: -1
    }
  ];

  const topPerformers = [
    {
      id: 1,
      name: "Suresh Patil",
      vehicle: "KA-01-AB-1234",
      score: 950,
      trips: 280,
      rating: 4.9,
      efficiency: 97
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      vehicle: "KA-02-CD-5678",
      score: 920,
      trips: 245,
      rating: 4.8,
      efficiency: 95
    },
    {
      id: 3,
      name: "Prakash Desai",
      vehicle: "KA-03-EF-9012",
      score: 880,
      trips: 220,
      rating: 4.7,
      efficiency: 92
    }
  ];

  const leaderboardData = [
    {
      rank: 1,
      name: 'Suresh Patil',
      avatar: 'SP',
      trips: 280,
      earnings: 95000,
      rating: 4.9,
      badges: ['Top Performer', 'Safety Champion', '100 Trips'],
      streak: 28,
      level: 'Platinum',
      points: 2850,
      achievements: 15
    },
    {
      rank: 2,
      name: 'Rajesh Kumar',
      avatar: 'RK',
      trips: 245,
      earnings: 85000,
      rating: 4.8,
      badges: ['Punctual Pro', 'Customer Favorite'],
      streak: 22,
      level: 'Gold',
      points: 2450,
      achievements: 12
    },
    {
      rank: 3,
      name: 'Prakash Desai',
      avatar: 'PD',
      trips: 220,
      earnings: 78000,
      rating: 4.7,
      badges: ['Rising Star', 'Night Owl'],
      streak: 18,
      level: 'Gold',
      points: 2200,
      achievements: 10
    },
    {
      rank: 4,
      name: 'Amit Sharma',
      avatar: 'AS',
      trips: 198,
      earnings: 72000,
      rating: 4.6,
      badges: ['Consistent', 'Weekend Warrior'],
      streak: 15,
      level: 'Silver',
      points: 1980,
      achievements: 8
    },
    {
      rank: 5,
      name: 'Vijay Singh',
      avatar: 'VS',
      trips: 165,
      earnings: 58000,
      rating: 4.5,
      badges: ['Newcomer'],
      streak: 10,
      level: 'Silver',
      points: 1650,
      achievements: 5
    },
  ];

  const achievements = [
    { name: '100 Trips Milestone', icon: Target, color: 'text-blue-400', unlocked: 3 },
    { name: 'Safety Champion', icon: Award, color: 'text-green-400', unlocked: 2 },
    { name: 'Top Earner', icon: Trophy, color: 'text-yellow-400', unlocked: 1 },
    { name: 'Customer Favorite', icon: Star, color: 'text-pink-400', unlocked: 4 },
    { name: 'Speed Demon', icon: Zap, color: 'text-orange-400', unlocked: 2 },
    { name: 'Night Owl', icon: Medal, color: 'text-purple-400', unlocked: 3 },
  ];

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-amber-500';
      case 2:
        return 'from-gray-400 to-gray-500';
      case 3:
        return 'from-orange-600 to-orange-700';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-orange-600" size={24} />;
      default:
        return <Trophy className="text-blue-400" size={20} />;
    }
  };
  
  const getLevelColor = (level) => {
    switch (level) {
      case 'Platinum':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Gold':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'Silver':
        return 'bg-gray-400/20 text-gray-400 border border-gray-400/30';
      case 'Bronze':
        return 'bg-orange-600/20 text-orange-600 border border-orange-600/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    if (addToast) addToast(`Leaderboard updated to ${newPeriod}`, 'success');
  };

  const handleAchievementClick = (achievement) => {
    if (addToast) addToast(`Achievement: ${achievement.name}`, 'info');
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
            <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
              <Trophy className="text-yellow-400" size={36} />
              Driver Leaderboard
            </h1>
            <p className="text-gray-400">Performance metrics and rankings for your fleet drivers</p>
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
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {topPerformers.map((driver, index) => (
          <div key={driver.id} className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                index === 0 ? 'bg-yellow-500/30 text-yellow-300' :
                index === 1 ? 'bg-gray-400/30 text-gray-300' :
                'bg-amber-700/30 text-amber-500'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{driver.name}</h3>
                <p className="text-gray-400 text-sm">{driver.vehicle}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{driver.score}</div>
                <div className="text-sm text-gray-400">points</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-sm text-gray-400">Trips</div>
                <div className="font-bold">{driver.trips}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Rating</div>
                <div className="font-bold">{driver.rating} ⭐</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Efficiency</div>
                <div className="font-bold">{driver.efficiency}%</div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Driver</th>
              <th className="p-4 text-left">Vehicle</th>
              <th className="p-4 text-left">Trips</th>
              <th className="p-4 text-left">Rating</th>
              <th className="p-4 text-left">Efficiency</th>
              <th className="p-4 text-left">Score</th>
              <th className="p-4 text-left">Trend</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr key={driver.id} className="border-b border-gray-800 hover:bg-white/5">
                <td className="p-4 font-bold">{index + 1}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {driver.name}
                  </div>
                </td>
                <td className="p-4 text-gray-400">{driver.vehicle}</td>
                <td className="p-4">{driver.trips}</td>
                <td className="p-4">{driver.rating} ⭐</td>
                <td className="p-4">{driver.efficiency}%</td>
                <td className="p-4 font-bold">{driver.score}</td>
                <td className="p-4">
                  <span className={driver.trend > 0 ? 'text-green-500' : 'text-red-500'}>
                    {driver.trend > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Top Performers</h2>
        <div className="flex items-end justify-center gap-4">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-2xl font-bold border-4 border-gray-500">
                {leaderboardData[1].avatar}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center font-bold">
                2
              </div>
            </div>
            <p className="font-bold text-lg">{leaderboardData[1].name}</p>
            <p className="text-sm text-gray-400">{leaderboardData[1].trips} trips</p>
            <div className="mt-4 glass-card p-6 w-32 h-24 flex flex-col items-center justify-center">
              <Medal className="text-gray-400 mb-2" size={32} />
              <p className="text-xs text-gray-400">Silver</p>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-3xl font-bold border-4 border-yellow-500 animate-pulse-glow">
                {leaderboardData[0].avatar}
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <Crown className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-float" size={32} />
            </div>
            <p className="font-bold text-xl">{leaderboardData[0].name}</p>
            <p className="text-sm text-gray-400">{leaderboardData[0].trips} trips</p>
            <div className="mt-4 glass-card p-6 w-32 h-32 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500/20 to-amber-500/20">
              <Trophy className="text-yellow-400 mb-2" size={40} />
              <p className="text-xs text-gray-400">Champion</p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-2xl font-bold border-4 border-orange-700">
                {leaderboardData[2].avatar}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center font-bold">
                3
              </div>
            </div>
            <p className="font-bold text-lg">{leaderboardData[2].name}</p>
            <p className="text-sm text-gray-400">{leaderboardData[2].trips} trips</p>
            <div className="mt-4 glass-card p-6 w-32 h-24 flex flex-col items-center justify-center">
              <Medal className="text-orange-600 mb-2" size={32} />
              <p className="text-xs text-gray-400">Bronze</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-6">Complete Rankings</h2>
        <div className="space-y-3">
          {leaderboardData.map((driver, index) => (
            <motion.div
              key={driver.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className={`p-5 rounded-xl transition-all hover:scale-102 cursor-pointer ${
                driver.rank <= 3
                  ? 'bg-gradient-to-r ' + getRankColor(driver.rank) + ' bg-opacity-10'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => {
                if (addToast) addToast(`Viewing ${driver.name}'s performance`, 'info');
              }}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  {getRankIcon(driver.rank)}
                </div>

                {/* Avatar */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRankColor(driver.rank)} flex items-center justify-center font-bold text-lg`}>
                  {driver.avatar}
                </div>

                {/* Driver Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-lg">{driver.name}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(driver.level)}`}>
                      {driver.level}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {driver.badges.map((badge, i) => (
                      <span key={i} className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex gap-8 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{driver.trips}</p>
                    <p className="text-xs text-gray-400">Trips</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">₹{(driver.earnings / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-400">Earnings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">⭐ {driver.rating}</p>
                    <p className="text-xs text-gray-400">Rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-400">{driver.streak}</p>
                    <p className="text-xs text-gray-400">Day Streak</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">{driver.points}</p>
                    <p className="text-xs text-gray-400">Points</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-6">Achievements Unlocked</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="glass-card p-4 text-center hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleAchievementClick(achievement)}
              >
                <Icon className={`${achievement.color} mx-auto mb-2`} size={32} />
                <p className="text-xs font-semibold mb-1">{achievement.name}</p>
                <p className="text-xs text-gray-400">{achievement.unlocked} drivers</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;

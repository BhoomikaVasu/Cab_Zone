import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Clock, TrendingUp, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const LiveTracking = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const vehicles = [
    {
      id: 1,
      vehicleId: 'MH-01-AB-1234',
      driver: 'Rajesh Kumar',
      status: 'active',
      location: { lat: 19.0760, lng: 72.8777, area: 'Andheri West' },
      speed: 45,
      destination: 'Bandra Station',
      eta: '12 mins',
      tripStatus: 'On Trip',
      battery: 85,
      lastUpdate: '2 mins ago'
    },
    {
      id: 2,
      vehicleId: 'MH-02-CD-5678',
      driver: 'Amit Sharma',
      status: 'active',
      location: { lat: 19.0596, lng: 72.8295, area: 'Bandra East' },
      speed: 32,
      destination: 'Powai',
      eta: '18 mins',
      tripStatus: 'On Trip',
      battery: 72,
      lastUpdate: '1 min ago'
    },
    {
      id: 3,
      vehicleId: 'MH-03-EF-9012',
      driver: 'Suresh Patil',
      status: 'idle',
      location: { lat: 19.1136, lng: 72.8697, area: 'Goregaon' },
      speed: 0,
      destination: 'Waiting for ride',
      eta: '-',
      tripStatus: 'Available',
      battery: 95,
      lastUpdate: '5 mins ago'
    },
    {
      id: 4,
      vehicleId: 'MH-04-GH-3456',
      driver: 'Vijay Singh',
      status: 'active',
      location: { lat: 19.0176, lng: 72.8561, area: 'Worli' },
      speed: 55,
      destination: 'Airport',
      eta: '25 mins',
      tripStatus: 'On Trip',
      battery: 68,
      lastUpdate: '30 secs ago'
    },
    {
      id: 5,
      vehicleId: 'MH-05-IJ-7890',
      driver: 'Prakash Desai',
      status: 'idle',
      location: { lat: 19.0330, lng: 72.8479, area: 'Lower Parel' },
      speed: 0,
      destination: 'Waiting for ride',
      eta: '-',
      tripStatus: 'Available',
      battery: 88,
      lastUpdate: '3 mins ago'
    },
  ];

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-500' : 'bg-yellow-500';
  };

  const getTripStatusColor = (status) => {
    return status === 'On Trip' 
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      : 'bg-green-500/20 text-green-400 border-green-500/30';
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Live GPS Tracking</h1>
            <p className="text-gray-400">Real-time fleet location and status monitoring</p>
          </div>
          <div className="flex gap-3">
            <button className="glass-button px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 flex items-center gap-2">
              <Navigation size={20} />
              Track All
            </button>
            <button className="glass-button px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 flex items-center gap-2">
              <Zap size={20} />
              Optimize Routes
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <p className="text-gray-400 text-sm mb-1">Active Vehicles</p>
          <p className="text-3xl font-bold text-green-400">
            {vehicles.filter(v => v.status === 'active').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4"
        >
          <p className="text-gray-400 text-sm mb-1">Available</p>
          <p className="text-3xl font-bold text-yellow-400">
            {vehicles.filter(v => v.tripStatus === 'Available').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <p className="text-gray-400 text-sm mb-1">Avg Speed</p>
          <p className="text-3xl font-bold text-blue-400">
            {Math.round(vehicles.reduce((acc, v) => acc + v.speed, 0) / vehicles.length)} km/h
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-4"
        >
          <p className="text-gray-400 text-sm mb-1">Fleet Efficiency</p>
          <p className="text-3xl font-bold text-purple-400">92%</p>
        </motion.div>
      </div>

      {/* Map and Vehicle List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-xl font-bold mb-4">Live Map View</h2>
          <div className="relative h-[500px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-white/10">
            {/* Map Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-12 grid-rows-12 h-full">
                {[...Array(144)].map((_, i) => (
                  <div key={i} className="border border-blue-500/20"></div>
                ))}
              </div>
            </div>

            {/* Vehicle Markers */}
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 3) * 20}%`,
                }}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <div className={`w-4 h-4 rounded-full ${getStatusColor(vehicle.status)} animate-pulse`}>
                  <div className={`absolute inset-0 rounded-full ${getStatusColor(vehicle.status)} opacity-50 animate-ping`}></div>
                </div>
                <div className="absolute left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="glass-card p-3 whitespace-nowrap text-sm">
                    <p className="font-bold">{vehicle.vehicleId}</p>
                    <p className="text-gray-400">{vehicle.driver}</p>
                    <p className="text-xs text-green-400">{vehicle.speed} km/h</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="glass-button p-2">
                <TrendingUp size={20} />
              </button>
              <button className="glass-button p-2">
                <Filter size={20} />
              </button>
              <button className="glass-button p-2">
                <Search size={20} />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 glass-card p-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Idle</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vehicle List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Active Vehicles</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedVehicle?.id === vehicle.id
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono font-bold">{vehicle.vehicleId}</p>
                    <p className="text-sm text-gray-400">{vehicle.driver}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)} animate-pulse`}></div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-blue-400" />
                    <span className="text-gray-300">{vehicle.location.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation size={14} className="text-green-400" />
                    <span className="text-gray-300">{vehicle.destination}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-yellow-400" />
                      <span>{vehicle.speed} km/h</span>
                    </div>
                    {vehicle.eta !== '-' && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-orange-400" />
                        <span>{vehicle.eta}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`status-badge border text-xs ${getTripStatusColor(vehicle.tripStatus)}`}>
                      {vehicle.tripStatus}
                    </span>
                    <span className="text-xs text-gray-400">{vehicle.lastUpdate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Vehicle Details: {selectedVehicle.vehicleId}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Current Speed</p>
              <p className="text-2xl font-bold text-blue-400">{selectedVehicle.speed} km/h</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Battery Level</p>
              <p className="text-2xl font-bold text-green-400">{selectedVehicle.battery}%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">ETA</p>
              <p className="text-2xl font-bold text-orange-400">{selectedVehicle.eta}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-2xl font-bold text-purple-400">{selectedVehicle.tripStatus}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LiveTracking;

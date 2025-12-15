import React, { useState } from 'react';
import { Plus, Upload, Search, UserPlus, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import AddDriverForm from './AddDriverForm';
import AddVehicleForm from './AddVehicleForm';

const QuickActions = ({ addToast }) => {
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleAddDriver = (formData) => {
    console.log('Adding driver:', formData);
    setShowDriverModal(false);
    if (addToast) addToast(`Driver ${formData.name} added successfully!`, 'success');
  };

  const handleAddVehicle = (formData) => {
    console.log('Adding vehicle:', formData);
    setShowVehicleModal(false);
    if (addToast) addToast(`Vehicle ${formData.vehicleId} added successfully!`, 'success');
  };

  const actions = [
    { 
      icon: UserPlus, 
      label: 'Add Driver', 
      color: 'from-emerald-500 to-green-500',
      onClick: () => setShowDriverModal(true)
    },
    { 
      icon: Car, 
      label: 'Add Vehicle', 
      color: 'from-cyan-500 to-blue-500',
      onClick: () => setShowVehicleModal(true)
    },
    { 
      icon: Upload, 
      label: 'Upload Doc', 
      color: 'from-teal-500 to-emerald-500',
      onClick: () => setShowUploadModal(true)
    },
    { 
      icon: Search, 
      label: 'Search', 
      color: 'from-sky-500 to-cyan-500',
      onClick: () => {
        if (addToast) addToast('Search feature activated', 'info');
      }
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-emerald-400">Quick Actions</h3>
          <div className="flex gap-2">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  className={`glass-button px-4 py-2 flex items-center gap-2 bg-gradient-to-r ${action.color}/20 hover:${action.color}/30 border border-${action.color.split(' ')[1]}/30`}
                  title={action.label}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline text-sm">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <Modal isOpen={showDriverModal} onClose={() => setShowDriverModal(false)} title="Add New Driver">
        <AddDriverForm onSubmit={handleAddDriver} onCancel={() => setShowDriverModal(false)} />
      </Modal>

      <Modal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} title="Add New Vehicle">
        <AddVehicleForm onSubmit={handleAddVehicle} onCancel={() => setShowVehicleModal(false)} />
      </Modal>

      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Document">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-emerald-500/30 rounded-xl p-12 text-center hover:border-emerald-500/50 transition-all cursor-pointer">
            <Upload size={48} className="mx-auto mb-4 text-emerald-400" />
            <h3 className="text-xl font-semibold mb-2">Drop files here</h3>
            <p className="text-gray-400 mb-4">or click to browse</p>
            <button className="btn-primary">Select Files</button>
            <p className="text-xs text-gray-500 mt-4">
              Supported: PDF, JPG, PNG • Max: 10MB
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuickActions;

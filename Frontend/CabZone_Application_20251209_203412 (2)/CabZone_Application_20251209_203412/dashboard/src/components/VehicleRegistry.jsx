import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import DocumentUploadTabs from './DocumentUploadTabs';

const VehicleRegistry = ({ vehicles = [], initialVehicle = null, onClose, onSave, addToast, theme = 'dark' }) => {
    const [selectedVehicle, setSelectedVehicle] = useState(initialVehicle ? initialVehicle.id : '');
    const [formData, setFormData] = useState({
        carName: initialVehicle ? (initialVehicle.model || '').split(' ')[0] : '',
        numberPlate: initialVehicle ? (initialVehicle.carNumber || initialVehicle.plateNumber || '') : '',
        model: initialVehicle ? (initialVehicle.model || '') : '',
        fuelType: 'PETROL/DIESEL/CNG/ELECTRIC', // Keep default or map from vehicle if available
        year: initialVehicle ? (initialVehicle.year || '') : '',
        ownerName: initialVehicle ? (initialVehicle.driver || '') : ''
    });

    // Defensive copy
    const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleVehicleSelect = (e) => {
        const vehicleId = e.target.value;
        setSelectedVehicle(vehicleId);

        if (vehicleId) {
            const vehicle = safeVehicles.find(v => v.id.toString() === vehicleId);
            if (vehicle) {
                setFormData({
                    carName: (vehicle.model || '').split(' ')[0] || '',
                    numberPlate: vehicle.carNumber || vehicle.plateNumber || '',
                    model: vehicle.model || '',
                    fuelType: 'PETROL/DIESEL/CNG/ELECTRIC',
                    year: vehicle.year || '',
                    ownerName: vehicle.driver || ''
                });
            }
        }
    };

    const handleRefresh = () => {
        setSelectedVehicle('');
        setFormData({
            carName: '',
            numberPlate: '',
            model: '',
            fuelType: 'PETROL/DIESEL/CNG/ELECTRIC',
            year: '',
            ownerName: ''
        });
        if (addToast) addToast('Form refreshed', 'info');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(formData);
        }
        // We do not close the modal here anymore.
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-3xl font-bold text-center flex-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Vehicles Registry</h1>
                    <button
                        onClick={onClose}
                        className="glass-button p-2 hover:bg-red-500/20 text-red-400"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Existing Vehicles Dropdown */}
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                                Existing Vehicles
                            </label>
                            <select
                                value={selectedVehicle}
                                onChange={handleVehicleSelect}
                                className={`w-full px-4 py-3 text-base rounded-lg outline-none transition-all ${theme === 'light'
                                    ? 'bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500/20'
                                    : 'glass-input'}`}
                            >
                                <option value="">-- Select vehicle --</option>
                                {safeVehicles.map(v => (
                                    <option key={v.id} value={v.id} className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'}>
                                        {v.carNumber || v.plateNumber || 'Info N/A'} - {v.model}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="glass-button px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 font-semibold"
                        >
                            REFRESH
                        </button>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Car Name */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                                Car Name
                            </label>
                            <input
                                type="text"
                                name="carName"
                                value={formData.carName}
                                onChange={handleChange}
                                placeholder="Car name"
                                className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${theme === 'light'
                                    ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20'
                                    : 'glass-input'}`}
                            />
                        </div>

                        {/* Number Plate */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                                Number Plate
                            </label>
                            <input
                                type="text"
                                name="numberPlate"
                                value={formData.numberPlate}
                                onChange={handleChange}
                                placeholder="e.g. MH-12-AB-3456"
                                className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${theme === 'light'
                                    ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20'
                                    : 'glass-input'}`}
                            />
                        </div>

                        {/* Model */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                                Model
                            </label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="Model"
                                className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${theme === 'light'
                                    ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20'
                                    : 'glass-input'}`}
                            />
                        </div>

                        {/* Fuel Type */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                                Fuel Type
                            </label>
                            <input
                                type="text"
                                name="fuelType"
                                value={formData.fuelType}
                                onChange={handleChange}
                                placeholder="PETROL/DIESEL/CNG/ELECTRIC"
                                className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${theme === 'light'
                                    ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20'
                                    : 'glass-input'}`}
                            />
                        </div>

                        {/* Year */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                                Year
                            </label>
                            <input
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="YYYY"
                                className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${theme === 'light'
                                    ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20'
                                    : 'glass-input'}`}
                            />
                        </div>

                        {/* Owner Name */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                                Owner Name
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                placeholder="Owner name"
                                className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${theme === 'light'
                                    ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20'
                                    : 'glass-input'}`}
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg mt-6"
                    >
                        SAVE VEHICLE
                    </button>

                    {/* Document Upload Section */}
                    <div className="border-t border-white/10 pt-6 mt-6">
                        <h2 className={`text-xl font-bold mb-4 gradient-text ${theme === 'light' ? 'text-slate-900' : ''}`}>Upload Vehicle Documents</h2>
                        <DocumentUploadTabs
                            addToast={addToast}
                            theme={theme}
                            vehicleId={formData.numberPlate}
                        />
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default VehicleRegistry;

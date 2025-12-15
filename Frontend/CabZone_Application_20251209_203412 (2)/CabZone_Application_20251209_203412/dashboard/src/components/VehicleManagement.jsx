import React, { useState, useEffect } from 'react';
import { Search, Upload, Wrench, FileText, Calendar, AlertCircle, CheckCircle, Trash2, X, Plus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import VehicleRegistry from './VehicleRegistry';
import DocumentUploadTabs from './DocumentUploadTabs';

const API_BASE_URL = ''; // Use relative path to leverage Vite proxy
const buildUrl = (path = '') => `${API_BASE_URL}${path}`;

const VehicleManagement = ({ addToast, theme = 'dark' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showVehicleRegistry, setShowVehicleRegistry] = useState(false); // Kept for Edit
  const [selectedVehicle, setSelectedVehicle] = useState(null); // For details/schedule
  const [previewImage, setPreviewImage] = useState(null); // For image preview modal
  const [activeUploadVehicle, setActiveUploadVehicle] = useState(null); // Vehicle object for upload section
  const [newVehicle, setNewVehicle] = useState({
    id: null,
    carName: '',
    carNumber: '',
    type: '',
    model: '',
    driverPhone: '',
    fuelType: '',
    year: '',
    ownerName: ''
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Load vehicles from backend on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch(buildUrl('/api/vehicles'));
      if (!res.ok) throw new Error('Failed to fetch vehicles');
      const data = await res.json();

      const vehiclesArray = Array.isArray(data) ? data : (data.vehicles || []);

      const formattedVehicles = vehiclesArray.map(v => {
        const docs = v.documents || {};
        const rcData = docs.rc?.extractedData || {};

        // Helper to clean dates
        const cleanVal = (val) => (!val || val === 'null' || val === 'undefined') ? 'Pending' : val;

        return {
          id: v.numberPlate || v.id, // Prefer numberPlate as ID if available and stable, or fallback
          carNumber: v.carNumberPlate || v.numberPlate || 'Unknown',
          plateNumber: v.carNumberPlate || v.numberPlate || 'Unknown',
          model: v.model || v.vehicleName || 'Unknown Model',
          fuel: v.fuelType || 'Diesel',
          year: v.year || '2023',


          // Document Data Mapping
          rcNumber: cleanVal(rcData.registrationNo || v.rcNumber),
          rcImageUrl: docs.rc?.imageUrl || null,

          fitnessCert: cleanVal(docs.fitness?.extractedData?.validUpto || v.fitnessExpiry),
          fitImageUrl: docs.fitness?.imageUrl || null,

          insuranceExpiry: cleanVal(docs.insurance?.extractedData?.validUpto || v.insuranceExpiry),
          insImageUrl: docs.insurance?.imageUrl || null,

          pucExpiry: cleanVal(docs.pollution?.extractedData?.validUpto || v.pucExpiry),
          pollImageUrl: docs.pollution?.imageUrl || null,

          permitExpiry: cleanVal(docs.permit?.extractedData?.validUpto || v.permitExpiry),
          permImageUrl: docs.permit?.imageUrl || null,

          status: v.status || 'Active',
          driver: v.driverName || v.ownerName || 'Unassigned',
          driverPhone: v.driverPhone || v.phone || '',
          lastService: v.lastServiceDate || 'Pending',
          nextService: v.nextServiceDate || 'Pending',
          mileage: v.currentMileage ? `${v.currentMileage} km` : '0 km',
          location: v.currentLocation || 'Depot'
        };
      });

      setVehicles(formattedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      if (addToast) addToast('Failed to load vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVehicle = async (vehicle) => {
    if (!window.confirm(`Are you sure you want to remove vehicle ${vehicle.carNumber}?`)) return;

    try {
      const res = await fetch(buildUrl(`/api/vehicles/${vehicle.id}`), {
        method: 'DELETE',
      });

      if (!res.ok) {
        const res2 = await fetch(buildUrl(`/api/vehicles/${vehicle.carNumber}`), {
          method: 'DELETE',
        });
        if (!res2.ok) throw new Error('Failed to delete vehicle');
      }

      setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
      if (activeUploadVehicle?.id === vehicle.id) setActiveUploadVehicle(null);
      if (addToast) addToast(`Vehicle ${vehicle.carNumber} removed successfully`, 'success');
    } catch (error) {
      console.error('Delete error:', error);
      if (addToast) addToast('Failed to remove vehicle', 'error');
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleRegistry(true);
  };

  // Handler for Inline Add Vehicle
  const handleSaveAndSelect = async () => {
    if (!newVehicle.carNumber || !newVehicle.model) {
      if (addToast) addToast('Please enter Number Plate and Model', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('numberPlate', newVehicle.carNumber);
      formData.append('model', newVehicle.model);
      formData.append('vehicleName', newVehicle.carName || '');
      formData.append('ownerName', newVehicle.ownerName || '');
      formData.append('fuelType', newVehicle.fuelType || '');
      formData.append('year', newVehicle.year || '');

      // Send optional fields if they exist in state, though not in form anymore (or reset them)
      if (newVehicle.driverPhone) formData.append('driverPhone', newVehicle.driverPhone);
      if (newVehicle.type) formData.append('vehicleType', newVehicle.type);

      const res = await fetch(buildUrl('/api/vehicles'), {
        method: 'POST',
        body: formData
      });

      const responseText = await res.text();
      let savedData;
      try {
        savedData = JSON.parse(responseText);
      } catch (e) {
        // Fallback for non-JSON success
        savedData = {
          message: 'Saved',
          carNumberPlate: newVehicle.carNumber,
          id: newVehicle.carNumber
        };
      }

      if (!res.ok) {
        throw new Error(savedData.message || 'Failed to save vehicle');
      }

      // Refresh list
      await fetchVehicles();

      // Set as active for uploads
      const newVehicleObj = {
        ...newVehicle,
        id: savedData.id || newVehicle.carNumber,
        carNumber: savedData.carNumberPlate || newVehicle.carNumber
      };
      setActiveUploadVehicle(newVehicleObj);

      // Reset form
      setNewVehicle({
        carName: '',
        carNumber: '',
        type: '',
        model: '',
        driverPhone: '',
        fuelType: '',
        year: '',
        ownerName: '',
        id: null
      });


      if (addToast) addToast(`Vehicle ${newVehicleObj.carNumber} saved successfully!`, 'success');

    } catch (error) {
      console.error('Save vehicle error:', error);
      if (addToast) addToast(error.message || 'Failed to save vehicle', 'error');
    }
  };

  // Calendar Helpers
  const handleScheduleService = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowScheduleModal(true);
    setCurrentMonth(new Date());
    setSelectedDate(null);
  };

  const handleConfirmSchedule = () => {
    if (!selectedDate || !selectedVehicle) return;
    if (addToast) addToast(`Service scheduled for ${selectedVehicle.carNumber} on ${selectedDate.toLocaleDateString()}`, 'success');
    setShowScheduleModal(false);
    setSelectedVehicle(null);
    setSelectedDate(null);
  };

  const changeMonth = (offset) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, month, 1).getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  // Expiry Helpers
  const isExpired = (dateString) => {
    if (!dateString || dateString === 'Pending') return false;
    const date = new Date(dateString);
    return date < new Date();
  };

  const isExpiringSoon = (dateString) => {
    if (!dateString || dateString === 'Pending') return false;
    const date = new Date(dateString);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return date > today && date < thirtyDaysFromNow;
  };

  const getExpiryColor = (dateString) => {
    if (isExpired(dateString)) return 'text-red-400';
    if (isExpiringSoon(dateString)) return 'text-orange-400';
    return 'text-green-400';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const term = searchTerm.toLowerCase();
    return (
      (vehicle.model || '').toLowerCase().includes(term) ||
      (vehicle.carNumber || '').toLowerCase().includes(term) ||
      (vehicle.driver || '').toLowerCase().includes(term)
    );
  });

  // Theme Helpers
  const cardClass = theme === 'light' ? 'bg-white border border-slate-200 shadow-sm' : 'glass-card';
  const textMain = theme === 'light' ? 'text-slate-900' : 'text-white';
  const textSub = theme === 'light' ? 'text-slate-500' : 'text-gray-400';
  const inputClass = theme === 'light' ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500 placeholder:text-slate-400' : 'glass-input';
  const labelClass = `block text-sm mb-2 font-medium ${textSub}`;
  const tableHeadClass = `text-left py-4 px-4 font-semibold uppercase text-xs tracking-wider ${textSub}`;
  const tableDataClass = `py-4 px-4 text-sm ${textMain}`;
  const tableDataSubClass = `py-4 px-4 text-sm ${textSub}`;

  return (
    <div className="space-y-8">
      {/* 1. Search Section (Extracted) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardClass} p-6`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text">Vehicle Management</h2>
            <p className={`${textSub} text-sm mt-1`}>Search and manage your fleet vehicles</p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSub}`} size={18} />
            <input
              type="text"
              placeholder="Search by number, model or driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 px-4 py-3 rounded-xl transition-all outline-none ${inputClass}`}
            />
          </div>
        </div>
      </motion.div>

      {/* 2. Vehicles Registry Section (Replaces Add New Vehicle) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent inline-block">
            Vehicles Registry
          </h2>
        </div>

        <div className="space-y-6">
          {/* Top Row: Existing Vehicles Select + Refresh */}
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className={labelClass}>Existing Vehicles</label>
              <div className="relative">
                <select
                  value={newVehicle.id || ''} // Use ID or empty
                  onChange={(e) => {
                    const v = vehicles.find(v => v.id === e.target.value);
                    if (v) {
                      setNewVehicle({
                        ...newVehicle,
                        id: v.id,
                        carName: v.carName || '', // Mapped from backend/frontend
                        carNumber: v.carNumber || '',
                        model: v.model || '',
                        fuelType: v.fuel || '',
                        year: v.year || '',
                        ownerName: v.driver || '', // Map driver/owner appropriately
                      });
                    } else {
                      // Reset if "Select vehicle" chosen (assuming value="" is select option)
                      setNewVehicle({
                        carName: '',
                        carNumber: '',
                        type: '', // Keep internal if needed, or clear
                        model: '',
                        driverPhone: '',
                        fuelType: '',
                        year: '',
                        ownerName: ''
                      });
                    }
                  }}
                  className={`w-full px-4 py-3 appearance-none rounded-xl outline-none ${inputClass}`}
                >
                  <option value="">-- Select vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.carNumber} - {v.model}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                // Clear the form
                setNewVehicle({
                  carName: '',
                  carNumber: '',
                  type: '',
                  model: '',
                  driverPhone: '',
                  fuelType: '',
                  year: '',
                  ownerName: '',
                  id: null
                });
                setActiveUploadVehicle(null); // Also clear active selection
                // Reload list
                fetchVehicles();
              }}
              disabled={loading}
              className={`px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all shadow-lg uppercase tracking-wider text-sm h-[50px] flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Refreshing...
                </>
              ) : (
                'REFRESH'
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Car Model</label>
              <input
                type="text"
                placeholder="e.g. Swift Dzire"
                value={newVehicle.model || ''}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Number Plate</label>
              <input
                type="text"
                placeholder="e.g. MH-12-AB-3456"
                value={newVehicle.carNumber}
                onChange={(e) => setNewVehicle({ ...newVehicle, carNumber: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="text"
                placeholder="Driver/Owner Phone"
                value={newVehicle.driverPhone}
                onChange={(e) => setNewVehicle({ ...newVehicle, driverPhone: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none ${inputClass}`}
              />
            </div>
          </div>

          {/* Form Row 2: Fuel Type | Year | Owner Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Fuel Type</label>
              <input
                type="text"
                placeholder="PETROL/DIESEL/CNG/ELECTRIC"
                value={newVehicle.fuelType}
                onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                className={`w-full px-4 py-3 uppercase rounded-xl outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <input
                type="text"
                placeholder="YYYY"
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Owner Name</label>
              <input
                type="text"
                placeholder="Owner name"
                value={newVehicle.ownerName || ''}
                onChange={(e) => setNewVehicle({ ...newVehicle, ownerName: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none ${inputClass}`}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveAndSelect}
            className="w-full px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transform transition-all hover:scale-[1.01] flex items-center justify-center gap-2 uppercase tracking-wide text-lg"
          >
            SAVE VEHICLE
          </button>
        </div>
      </motion.div>

      {/* 3. Document Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardClass} p-8`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <Upload size={24} className="text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${textMain}`}>Document Upload</h2>
              <p className={`${textSub} text-sm`}>
                {activeUploadVehicle
                  ? `Uploading for: ${activeUploadVehicle.carNumber} - ${activeUploadVehicle.model}`
                  : 'Select a vehicle from the table or use "Save & Select" to start uploading.'
                }
              </p>
            </div>
          </div>
          {activeUploadVehicle && (
            <span className={`px-4 py-1.5 rounded-full text-sm font-mono border ${theme === 'light' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-300 border-blue-500/30'}`}>
              {activeUploadVehicle.carNumber}
            </span>
          )}
        </div>

        <div>
          <DocumentUploadTabs
            addToast={addToast}
            theme={theme}
            vehicleId={activeUploadVehicle?.carNumber}
          />
        </div>
      </motion.div>

      {/* 4. Vehicle Table Section (Moved to Bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardClass} p-6`}
      >
        <div className="mb-4">
          <h3 className={`text-xl font-semibold ${textMain}`}>Registered Vehicles List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
                <th className={tableHeadClass}>Vehicle Number</th>
                <th className={tableHeadClass}>Vehicle Type</th>
                <th className={tableHeadClass}>Model</th>
                <th className={tableHeadClass}>Owner/Driver</th>
                <th className={tableHeadClass}>Phone</th>
                <th className={tableHeadClass}>Status</th>
                <th className={`text-right py-4 px-4 font-semibold uppercase text-xs tracking-wider ${textSub}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className={`py-8 px-4 text-center ${textSub}`}>
                    {searchTerm ? 'No vehicles match your search.' : 'No vehicles found.'}
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle, index) => (
                  <motion.tr
                    key={vehicle.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveUploadVehicle(vehicle)}
                    className={`border-b ${theme === 'light' ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'} cursor-pointer transition-all ${activeUploadVehicle?.id === vehicle.id
                      ? (theme === 'light' ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-blue-500/10 border-l-4 border-l-blue-400')
                      : 'border-l-4 border-l-transparent'
                      }`}
                  >
                    <td className={`py-4 px-4 font-mono text-sm font-medium ${textMain}`}>{vehicle.carNumber}</td>
                    <td className={tableDataSubClass}>{vehicle.fuel}</td>
                    <td className={tableDataClass}>{vehicle.model}</td>
                    <td className={tableDataSubClass}>{vehicle.driver}</td>
                    <td className={`py-4 px-4 text-sm font-mono ${textSub}`}>{vehicle.driverPhone || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${vehicle.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        vehicle.status === 'Maintenance' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setShowVehicleDetails(true);
                          }}
                          className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'hover:bg-blue-50 text-blue-600' : 'hover:bg-blue-500/20 text-blue-400'}`}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleRemoveVehicle(vehicle)}
                          className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-500/20 text-red-400'}`}
                          title="Delete Vehicle"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Existing Modals - Kept for secondary actions */}
      {showVehicleRegistry && (
        <VehicleRegistry
          vehicles={vehicles}
          initialVehicle={editingVehicle}
          onClose={() => setShowVehicleRegistry(false)}
          onSave={async (data) => {
            // Re-use logic or fetch
            await fetchVehicles();
            setShowVehicleRegistry(false);
            addToast('Vehicle updated', 'success');
          }}
          addToast={addToast}
          theme={theme}
        />
      )}

      {showVehicleDetails && selectedVehicle && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${cardClass} p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold gradient-text">Vehicle Documents</h2>
                <p className={`${textMain} mt-1`}>
                  {selectedVehicle.carNumber} - {selectedVehicle.model}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowVehicleDetails(false);
                  setSelectedVehicle(null);
                }}
                className="glass-button p-2 hover:bg-red-500/20 text-red-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className={cardClass + ' p-4'}>
                <h3 className="text-lg font-semibold mb-3 text-emerald-400">Vehicle Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {/* Simplified view details */}
                  <div>
                    <p className={`${textSub} text-xs uppercase tracking-wider mb-1`}>RC Number</p>
                    <div className="flex items-center gap-2">
                      {/* Show Number only if it's NOT Pending OR if there is NO image (so we see 'Pending' when truly missing) */}
                      {(selectedVehicle.rcNumber !== 'Pending' || !selectedVehicle.rcImageUrl) && (
                        <p className={`font-semibold ${textMain}`}>{selectedVehicle.rcNumber}</p>
                      )}

                      {selectedVehicle.rcImageUrl && (
                        <button
                          onClick={() => setPreviewImage(selectedVehicle.rcImageUrl)}
                          className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 border ${theme === 'light' ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' : 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'}`}
                          title="View RC Document"
                        >
                          <Eye size={12} /> View
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className={`${textSub} text-xs uppercase tracking-wider mb-1`}>Fitness</p>
                    <div className="flex items-center gap-2">
                      {(selectedVehicle.fitnessCert !== 'Pending' || !selectedVehicle.fitImageUrl) && (
                        <p className={`font-semibold ${getExpiryColor(selectedVehicle.fitnessCert)}`}>{selectedVehicle.fitnessCert}</p>
                      )}
                      {selectedVehicle.fitImageUrl && (
                        <button
                          onClick={() => setPreviewImage(selectedVehicle.fitImageUrl)}
                          className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 border ${theme === 'light' ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' : 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'}`}
                          title="View Fitness Document"
                        >
                          <Eye size={12} /> View
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className={`${textSub} text-xs uppercase tracking-wider mb-1`}>Insurance</p>
                    <div className="flex items-center gap-2">
                      {(selectedVehicle.insuranceExpiry !== 'Pending' || !selectedVehicle.insImageUrl) && (
                        <p className={`font-semibold ${getExpiryColor(selectedVehicle.insuranceExpiry)}`}>{selectedVehicle.insuranceExpiry}</p>
                      )}
                      {selectedVehicle.insImageUrl && (
                        <button
                          onClick={() => setPreviewImage(selectedVehicle.insImageUrl)}
                          className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 border ${theme === 'light' ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' : 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'}`}
                          title="View Insurance Document"
                        >
                          <Eye size={12} /> View
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className={`${textSub} text-xs uppercase tracking-wider mb-1`}>PUC</p>
                    <div className="flex items-center gap-2">
                      {(selectedVehicle.pucExpiry !== 'Pending' || !selectedVehicle.pollImageUrl) && (
                        <p className={`font-semibold ${getExpiryColor(selectedVehicle.pucExpiry)}`}>{selectedVehicle.pucExpiry}</p>
                      )}
                      {selectedVehicle.pollImageUrl && (
                        <button
                          onClick={() => setPreviewImage(selectedVehicle.pollImageUrl)}
                          className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 border ${theme === 'light' ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' : 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'}`}
                          title="View PUC Document"
                        >
                          <Eye size={12} /> View
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className={`${textSub} text-xs uppercase tracking-wider mb-1`}>Permit</p>
                    <div className="flex items-center gap-2">
                      {(selectedVehicle.permitExpiry !== 'Pending' || !selectedVehicle.permImageUrl) && (
                        <p className={`font-semibold ${getExpiryColor(selectedVehicle.permitExpiry)}`}>{selectedVehicle.permitExpiry}</p>
                      )}
                      {selectedVehicle.permImageUrl && (
                        <button
                          onClick={() => setPreviewImage(selectedVehicle.permImageUrl)}
                          className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 border ${theme === 'light' ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' : 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'}`}
                          title="View Permit Document"
                        >
                          <Eye size={12} /> View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Schedule Service Modal with Calendar */}
      {
        showScheduleModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`${cardClass} p-3 max-w-sm w-full`}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-lg font-bold gradient-text">Schedule Service</h2>
                  <p className="text-gray-400 text-xs">
                    {selectedVehicle.carNumber}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedVehicle(null);
                    setSelectedDate(null);
                  }}
                  className="glass-button p-1.5 hover:bg-red-500/20 text-red-400"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                {/* Calendar */}
                <div className="glass-card p-2">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="glass-button p-1 hover:bg-blue-500/20"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h3 className="text-sm font-bold">
                      {currentMonth.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => changeMonth(1)}
                      className="glass-button p-1 hover:bg-blue-500/20"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-center text-[10px] font-semibold text-gray-400 py-0.5">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {(() => {
                      const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                      const days = [];
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      // Empty cells for days before month starts
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        days.push(
                          <div key={`empty-${i}`} className="aspect-square"></div>
                        );
                      }

                      // Days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        date.setHours(0, 0, 0, 0);
                        const isSelected = selectedDate &&
                          selectedDate.getDate() === day &&
                          selectedDate.getMonth() === currentMonth.getMonth() &&
                          selectedDate.getFullYear() === currentMonth.getFullYear();
                        const isPast = date < today;
                        const isToday = date.getTime() === today.getTime();

                        days.push(
                          <button
                            key={day}
                            onClick={() => !isPast && handleDateSelect(day)}
                            disabled={isPast}
                            className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-all
                            ${isPast ? 'text-gray-600 cursor-not-allowed opacity-40' : 'hover:bg-blue-500/20 cursor-pointer'}
                            ${isSelected ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : ''}
                            ${isToday && !isSelected ? 'border border-cyan-400' : ''}
                            ${!isSelected && !isPast ? 'glass-button' : ''}
                          `}
                          >
                            {day}
                          </button>
                        );
                      }

                      return days;
                    })()}
                  </div>
                </div>

                {/* Selected Date Display */}
                {selectedDate && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-green-400" />
                      <div>
                        <p className="text-[10px] text-gray-400">Selected Service Date</p>
                        <p className="text-xs font-bold text-green-400">
                          {selectedDate.toLocaleDateString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setShowScheduleModal(false);
                      setSelectedVehicle(null);
                      setSelectedDate(null);
                    }}
                    className="flex-1 glass-button px-3 py-1.5 hover:bg-red-500/20 text-red-400 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSchedule}
                    disabled={!selectedDate}
                    className={`flex-1 glass-button px-3 py-1.5 flex items-center justify-center gap-1.5 text-xs
                    ${selectedDate
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-400'
                        : 'opacity-50 cursor-not-allowed'
                      }`}
                  >
                    <CheckCircle size={10} />
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )
      }

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm"
            >
              <X size={24} />
            </button>
            <img
              src={previewImage}
              alt="Document Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;

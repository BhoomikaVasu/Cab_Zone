import React, { useState } from 'react';
import { Search, Filter, UserPlus, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import AddDriverForm from './AddDriverForm';
import EditDriverForm from './EditDriverForm';
import EditVehicleForm from './EditVehicleForm';
import EditAadhaarForm from './EditAadhaarForm';
import DriverSelector from './driver/DriverSelector';
import DocumentExtractor from './DocumentExtractor';
import DocumentRecords from './DocumentRecords';
import AttendanceCalendar from './AttendanceCalendar';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '';
const buildUrl = (path = '') => `${API_BASE_URL}${path}`;

const toInputDate = (value = '') => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
  return value;
};

const toDisplayDate = (value = '') => {
  if (!value) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [yyyy, mm, dd] = value.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }
  return value;
};

const DriverManagement = ({ addToast, theme = 'dark' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null); // Used as editFormData
  const [selectedDocDriver, setSelectedDocDriver] = useState(null);
  const [recordsRefreshKey, setRecordsRefreshKey] = useState(0);
  const [recordBeingEdited, setRecordBeingEdited] = useState(null);
  const [recordTypeEditing, setRecordTypeEditing] = useState('license');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const handleAddDriver = (formData) => {
    console.log('Adding driver:', formData);
    setShowAddDriverModal(false);
    if (addToast) addToast(`Driver ${formData.name} added successfully!`, 'success');
  };

  const mapRecordToEditData = (record, type) => {
    if (type === 'vehicle') {
      // Vehicle data is mainly at root
      return {
        id: record.id,
        ownerName: record.ownerName || '',
        carNumberPlate: record.carNumberPlate || record.registrationNo || '',
        model: record.model || '',
        fuelType: record.fuelType || '',
        rcValidUpto: toInputDate(record.rcValidUpto),
        vehicleType: record.vehicleType || '',
        driverPhone: record.driverPhone || '',
      };
    }
    const data = record?.extractedData || {};
    if (type === 'aadhaar') {
      return {
        id: record.id,
        name: data.name || '',
        aadhaar_no: data.aadhaar_no || '',
        dob: toInputDate(data.dob),
        gender: data.gender || '',
        address: data.address || '',
        pincode: data.pincode || '',
      };
    }
    // License (default)
    return {
      id: record?.id,
      name: data.name || '',
      phone: data.phone || record?.id || '',
      licenseNo: data.licenseNumber || '',
      vehicle: data.vehicle || data.vehicleClass || '',
      dob: toInputDate(data.dob),
      doi: toInputDate(data.doi || data.issueDate),
      licenseExpiry: toInputDate(data.validity),
      joinDate: '',
      address: data.address || '',
    };
  };

  const handleRecordEditRequest = (record, type = 'license') => {
    if (!record) return;
    setRecordBeingEdited(record);
    setRecordTypeEditing(type);
    setSelectedDriver(mapRecordToEditData(record, type));
    setShowEditDriverModal(true);
  };

  const handleRecordUpdate = async (formData) => {
    if (!recordBeingEdited?.id) return;

    let url = '';
    let method = 'PUT';
    let body = {};
    const baseData = recordBeingEdited.extractedData || {};

    if (recordTypeEditing === 'license') {
      url = `/api/licenses/${recordBeingEdited.id}`;
      const updatedPayload = {
        ...baseData,
        name: formData.name,
        phone: formData.phone,
        licenseNumber: formData.licenseNo,
        dob: toDisplayDate(formData.dob),
        validity: toDisplayDate(formData.licenseExpiry),
        address: formData.address,
      };
      if (formData.doi) updatedPayload.doi = toDisplayDate(formData.doi);
      body = { extractedData: updatedPayload };

    } else if (recordTypeEditing === 'aadhaar') {
      url = `/api/aadhar/${recordBeingEdited.id}`;
      const updatedPayload = {
        ...baseData,
        name: formData.name,
        aadhaar_no: formData.aadhaar_no,
        dob: toDisplayDate(formData.dob),
        gender: formData.gender,
        address: formData.address,
        pincode: formData.pincode
      };
      body = { extractedData: updatedPayload };

    } else if (recordTypeEditing === 'vehicle') {
      url = '/api/vehicles'; // Vehicle uses POST upsert
      method = 'POST';
      body = {
        vehicleId: recordBeingEdited.id,
        ...formData,
        // Ensure date format if needed? 
        // formData.rcValidUpto is YYYY-MM-DD from input. 
        // Backend probably just saves string, but let's keep it consistent if backend expects DD/MM/YYYY
        rcValidUpto: toDisplayDate(formData.rcValidUpto)
      };
    }

    try {
      const response = await fetch(buildUrl(url), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to update record');
      }
      addToast?.('Record updated successfully', 'success');
      setShowEditDriverModal(false);
      setRecordBeingEdited(null);
      setSelectedDriver(null);
      setRecordsRefreshKey((prev) => prev + 1);
    } catch (error) {
      addToast?.(error.message || 'Unable to update record', 'error');
    }
  };

  const handleCancelEdit = () => {
    setShowEditDriverModal(false);
    setRecordBeingEdited(null);
    setSelectedDriver(null);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] justify-start pt-8 pb-12">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl ${theme === 'light' ? 'bg-white border border-slate-200' : 'glass-card'} transition-colors duration-300`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Driver Management</h1>
              <p className={theme === 'light' ? 'text-slate-600' : 'text-slate-400'}>Manage and monitor your fleet drivers and their details</p>
            </div>
            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => setShowAttendanceModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                <CalendarCheck className="h-5 w-5 mr-2" />
                Attendance
              </button> */}
            </div>
          </div>

          <div className={`mt-6 pt-6 border-t ${theme === 'light' ? 'border-slate-200' : 'border-gray-700/50'} transition-colors duration-300`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="text"
                  placeholder="Search by name or vehicle number..."
                  className={`w-full pl-10 py-2 rounded-lg outline-none transition-all duration-200 ${theme === 'light'
                    ? 'bg-white text-slate-800 border border-slate-200 focus:ring-2 focus:ring-blue-500/20'
                    : 'glass-input'
                    }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`} size={16} />
                <select
                  className={`pl-10 pr-8 py-2 w-full rounded-lg outline-none transition-all duration-200 ${theme === 'light'
                    ? 'bg-white text-slate-800 border border-slate-200 focus:ring-2 focus:ring-blue-500/20'
                    : 'glass-input text-white bg-slate-900/70 border border-white/20'
                    }`}
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                >
                  <option value="all">All Drivers</option>
                  <optgroup label="Verification">
                    <option value="verification:verified">Verified</option>
                    <option value="verification:pending">Pending</option>
                    <option value="verification:rejected">Rejected</option>
                  </optgroup>
                  <optgroup label="Expiry">
                    <option value="expiry:expired">Expired</option>
                    <option value="expiry:upcoming">Expiring Soon (30 days)</option>
                  </optgroup>
                </select>
              </div>
            </div>
            {searchTerm.trim() && (
              <div className="mt-3 text-sm text-blue-600">
                Showing results for <span className="font-semibold">"{searchTerm}"</span>
                <button
                  type="button"
                  className="ml-3 text-xs text-blue-500 hover:text-blue-700"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-6"
        >
          <DriverSelector selectedDriver={selectedDocDriver} onSelect={setSelectedDocDriver} theme={theme} />
          <DocumentExtractor
            selectedDriver={selectedDocDriver}
            addToast={addToast}
            onUploadComplete={() => setRecordsRefreshKey(prev => prev + 1)}
            theme={theme}
          />
        </motion.div>

        <DocumentRecords
          addToast={addToast}
          onEditRecord={handleRecordEditRequest}
          refreshSignal={recordsRefreshKey}
          theme={theme}
        />

        {
          showEditDriverModal && selectedDriver && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-xl max-h-[80vh] rounded-xl p-6 shadow-xl bg-white border border-slate-200 flex flex-col"
              >
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  {recordTypeEditing === 'vehicle' ? 'Edit Vehicle' :
                    recordTypeEditing === 'aadhaar' ? 'Edit Aadhaar Details' :
                      'Edit Driver'}
                </h2>
                <div className="overflow-y-auto pr-1 flex-1">
                  {recordTypeEditing === 'vehicle' ? (
                    <EditVehicleForm
                      data={selectedDriver}
                      onSubmit={handleRecordUpdate}
                      onCancel={handleCancelEdit}
                    />
                  ) : recordTypeEditing === 'aadhaar' ? (
                    <EditAadhaarForm
                      data={selectedDriver}
                      onSubmit={handleRecordUpdate}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <EditDriverForm
                      driver={selectedDriver}
                      onSubmit={handleRecordUpdate}
                      onCancel={handleCancelEdit}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          )
        }

        {/* Add Driver Modal */}
        {
          showAddDriverModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl max-h-[85vh] rounded-2xl p-4 sm:p-6 shadow-2xl bg-transparent flex flex-col"
              >
                <div className="overflow-y-auto pr-1 flex-1">
                  <AddDriverForm
                    onSubmit={handleAddDriver}
                    onCancel={() => setShowAddDriverModal(false)}
                  />
                </div>
              </motion.div>
            </div>
          )
        }

        {/* Attendance Calendar Modal */}
        <AttendanceCalendar
          isOpen={showAttendanceModal}
          onClose={() => setShowAttendanceModal(false)}
          addToast={addToast}
          theme={theme}
        />

      </div >
    </div >
  );
};

export default DriverManagement;

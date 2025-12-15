import React, { useMemo, useRef, useState, useEffect } from 'react';
import { UploadCloud, ImageDown } from 'lucide-react';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '';
const buildUrl = (path = '') => `${API_BASE_URL}${path}`;

const TABS = {
  license: {
    label: 'Driving License',
    endpoint: '/api/licenses',
    fieldName: 'licenseImage',
    accept: 'image/png,image/jpeg',
    helpText: 'PNG/JPG up to 10MB',
  },
  vehicle: {
    label: 'Vehicle RC',
    endpoint: '/api/vehicles',
    fieldName: 'vehicleImage',
    accept: 'image/png,image/jpeg,application/pdf',
    helpText: 'PNG/JPG/PDF up to 10MB',
  },
  aadhaar: {
    label: 'Aadhaar Card',
    endpoint: '/api/aadhar',
    fieldName: 'aadharImage',
    accept: 'image/png,image/jpeg,application/pdf',
    helpText: 'PNG/JPG/PDF up to 10MB',
  },
};

const getDriverId = (driver) =>
  driver?.id || driver?.driverId || driver?.phone || driver?._id || '';

const DocumentExtractor = ({ selectedDriver, addToast, onUploadComplete, theme = 'dark' }) => {
  const [activeTab, setActiveTab] = useState('license');
  const [status, setStatus] = useState({ type: 'info', text: 'Select a driver to enable uploads.' });
  const [uploading, setUploading] = useState(false);
  const [fileNames, setFileNames] = useState({});
  const inputRefs = useMemo(
    () => ({
      license: React.createRef(),
      vehicle: React.createRef(),
      aadhaar: React.createRef(),
    }),
    []
  );

  useEffect(() => {
    if (!selectedDriver) {
      setStatus({ type: 'info', text: 'Select a driver to enable uploads.' });
    } else {
      setStatus({
        type: 'success',
        text: `Uploading documents for ${selectedDriver.name} (${selectedDriver.phone || selectedDriver.id || 'No Phone'})`,
      });
    }
  }, [selectedDriver]);

  const handleBrowse = (tab) => {
    inputRefs[tab]?.current?.click();
  };

  const handleFileChange = (event, tab) => {
    const file = event.target.files?.[0];
    setFileNames((prev) => ({ ...prev, [tab]: file?.name || '' }));
  };

  const handleDrop = (event, tab) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && inputRefs[tab]?.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRefs[tab].current.files = dt.files;
      setFileNames((prev) => ({ ...prev, [tab]: file.name }));
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const driverId = getDriverId(selectedDriver);
    if (!driverId) {
      setStatus({ type: 'error', text: 'Select a driver before uploading.' });
      return;
    }

    const config = TABS[activeTab];
    const input = inputRefs[activeTab]?.current;
    const file = input?.files?.[0];

    if (!file) {
      setStatus({ type: 'error', text: 'Please choose a file first.' });
      return;
    }

    setUploading(true);
    setStatus({ type: 'info', text: 'Extracting data, please wait…' });

    try {
      const formData = new FormData();
      formData.append(config.fieldName, file);
      formData.append('driverId', driverId);
      if (selectedDriver?.name) formData.append('driverName', selectedDriver.name);

      const response = await fetch(buildUrl(config.endpoint), {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API Endpoint not found. Please restart the backend server to apply recent changes.');
        }
        throw new Error(payload?.message || 'Upload failed. Please try again.');
      }

      setStatus({
        type: 'success',
        text: payload?.message || 'Document extracted and saved successfully.',
      });
      setFileNames((prev) => ({ ...prev, [activeTab]: '' }));
      if (input) input.value = '';

      if (typeof addToast === 'function') {
        addToast('Document saved successfully', 'success');
      }
      if (typeof onUploadComplete === 'function') {
        onUploadComplete(activeTab, payload);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.message || 'Something went wrong. Please try again.',
      });
      if (typeof addToast === 'function') {
        addToast(error.message || 'Upload failed', 'error');
      }
    } finally {
      setUploading(false);
    }
  };

  const renderStatus = () => {
    if (!status?.text) return null;
    const colorMap = {
      success: theme === 'light' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200',
      error: theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-500/10 border-red-500/40 text-red-200',
      info: theme === 'light' ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-100',
    };
    return (
      <div className={`rounded-xl px-4 py-3 text-sm border ${colorMap[status.type] || colorMap.info}`}>
        {status.text}
      </div>
    );
  };

  return (
    <div className={`p-6 border rounded-xl space-y-5 ${theme === 'light' ? 'bg-white border-slate-200' : 'glass-card border-white/5 bg-white/5'} transition-colors duration-300`}>
      <div className="flex flex-wrap gap-3">
        {Object.entries(TABS).map(([key, tab]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === key
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
              : theme === 'light'
                ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-indigo-300/50'
                : 'bg-white/5 text-gray-300 border border-white/10 hover:border-indigo-300/50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-[1fr,220px] gap-5">
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center hover:border-indigo-400/60 transition relative ${theme === 'light'
            ? 'border-slate-300 bg-white'
            : 'border-white/10 bg-slate-900/30'
            }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, activeTab)}
        >
          <input
            ref={inputRefs[activeTab]}
            type="file"
            accept={TABS[activeTab].accept}
            className="hidden"
            onChange={(e) => handleFileChange(e, activeTab)}
          />
          <ImageDown className={`mx-auto mb-4 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`} size={48} />
          <p className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Drop image here or click to browse</p>
          <p className={`text-sm mb-4 ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>Supported formats: {TABS[activeTab].accept.split(',').join(', ')}</p>
          <button
            type="button"
            onClick={() => handleBrowse(activeTab)}
            className="btn-secondary px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <UploadCloud size={18} />
            Choose File
          </button>
          {fileNames[activeTab] && (
            <p className="mt-4 text-sm text-emerald-300 font-medium">{fileNames[activeTab]}</p>
          )}
        </div>

        <div className={`flex flex-col justify-between gap-4 rounded-2xl p-5 border ${theme === 'light'
          ? 'bg-white border-slate-300'
          : 'bg-slate-900/30 border-white/10'
          } transition-colors duration-300`}>
          <div>
            <p className={`text-sm uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-indigo-700 font-semibold' : 'text-indigo-300'}`}>
              {TABS[activeTab].label}
            </p>
            <p className={`text-sm ${theme === 'light' ? 'text-slate-700' : 'text-gray-400'}`}>{TABS[activeTab].helpText}</p>
          </div>
          <button
            type="submit"
            className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            {uploading ? 'Extracting...' : 'Extract & Save Data'}
          </button>
        </div>
      </form>

      {renderStatus()}
    </div>
  );
};

export default DocumentExtractor;


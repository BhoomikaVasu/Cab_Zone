import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Trash2, RefreshCcw, Search, X } from 'lucide-react';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '';
const buildUrl = (path = '') => `${API_BASE_URL}${path}`;

const TAB_CONFIG = {
  license: {
    label: 'Driving License',
    endpoint: '/api/licenses',
    deleteEndpoint: (id) => `/api/licenses/${id}`,
    searchFields: ['name', 'licenseNumber', 'dob', 'validity', 'phone'],
    emptyMessage: 'No driving license records yet. Upload a DL to see it here.',
  },
  vehicle: {
    label: 'Vehicle RC',
    endpoint: '/api/vehicles',
    deleteEndpoint: (id) => `/api/vehicles/${id}`,
    searchFields: ['ownerName', 'registrationNo', 'model', 'fuelType', 'rcValidUpto'],
    emptyMessage: 'No vehicle RC records yet.',
  },
  aadhaar: {
    label: 'Aadhaar Card',
    endpoint: '/api/aadhar',
    deleteEndpoint: (id) => `/api/aadhar/${id}`,
    searchFields: ['name', 'aadhaar_no', 'dob', 'gender', 'address', 'pincode'],
    emptyMessage: 'No Aadhaar records yet.',
  },
};

const getInitials = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0])
    .join('')
    .toUpperCase() || 'NA';

const DocumentRecords = ({ addToast, onEditRecord, refreshSignal = 0, theme = 'dark' }) => {
  const [activeTab, setActiveTab] = useState('license');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const rowClass = theme === 'light'
    ? 'border-b border-slate-200 last:border-transparent hover:bg-white/60 transition'
    : 'border-b border-slate-700 last:border-transparent hover:bg-slate-700/50 transition';

  const textHeaderClass = "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide opacity-80";
  const textCellClass = "px-6 py-4 text-sm";

  const fetchRecords = useCallback(async () => {
    const config = TAB_CONFIG[activeTab];
    if (!config) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(buildUrl(config.endpoint));
      const payload = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(payload?.message || `Failed to load ${config.label} records`);
      }
      setRecords(Array.isArray(payload) ? payload : []);
    } catch (err) {
      const message = err.message || 'Something went wrong while fetching records.';
      setError(message);
      setRecords([]);
      // Don't show toast for network errors or when API is unavailable
      // Only show toast if addToast is provided AND it's not a fetch/network error
      if (typeof addToast === 'function' && !err.message?.includes('fetch') && !err.message?.includes('Failed to load')) {
        addToast(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, addToast]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords, refreshSignal]);

  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return records;
    const config = TAB_CONFIG[activeTab];
    const query = searchTerm.trim().toLowerCase();
    return records.filter((record) => {
      const data = record?.extractedData || {};
      return config.searchFields.some((field) => (data[field] || '').toLowerCase().includes(query));
    });
  }, [records, searchTerm, activeTab]);

  const handleViewDocument = (url) => {
    if (!url) {
      addToast?.('Document image not available for this record.', 'info');
      return;
    }
    const finalUrl = url.startsWith('http') ? url : buildUrl(`/uploads/${url}`);
    setPreviewUrl(finalUrl);
  };

  const handleDelete = async (record) => {
    if (!record?.id) return;
    const config = TAB_CONFIG[activeTab];
    if (!config.deleteEndpoint) return;
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(buildUrl(config.deleteEndpoint(record.id)), {
        method: 'DELETE',
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to delete record');
      }
      if (typeof addToast === 'function') addToast('Record deleted', 'success');
      fetchRecords();
    } catch (err) {
      addToast?.(err.message || 'Unable to delete record', 'error');
    }
  };

  const renderLicenseRow = (record) => {
    const data = record.extractedData || {};
    const isUploaded = !!record.imageUrl;
    const statusText = isUploaded ? 'UPLOADED' : 'PENDING';
    const statusClass = isUploaded
      ? 'bg-green-100 text-green-700'
      : 'bg-orange-100 text-orange-700';

    return (
      <tr key={record.id} className={rowClass}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold shadow-sm">
              {getInitials(data.name)}
            </div>
            <div>
              <p className="font-semibold">{data.name || 'N/A'}</p>
              <p className="text-sm opacity-70">{data.phone || record.id}</p>
            </div>
          </div>
        </td>
        <td className={textCellClass}>{data.licenseNumber || 'N/A'}</td>
        <td className={textCellClass}>{data.validity || 'N/A'}</td>
        <td className="px-6 py-4 text-sm">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs uppercase tracking-wide font-medium ${statusClass}`}>
            {statusText}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleViewDocument(record.imageUrl)}
              className="p-2 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
              title="View document"
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              onClick={() => onEditRecord?.(record, 'license')}
              className="p-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
              title="Edit driver"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(record)}
              className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
              title="Delete record"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderVehicleRow = (record) => {
    // For vehicles, data is at root or in documents.rc (less reliable for list)
    // VehicleRoutes saves fields to root.
    const data = record;
    const isUploaded = !!(record.documents && record.documents.rc && record.documents.rc.imageUrl);
    const imageUrl = isUploaded ? record.documents.rc.imageUrl : null;

    return (
      <tr key={record.id} className={rowClass}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold shadow-sm">
              {getInitials(data.ownerName)}
            </div>
            <div className="font-semibold">{data.ownerName || 'N/A'}</div>
          </div>
        </td>
        <td className={textCellClass}>{data.carNumberPlate || data.registrationNo || 'N/A'}</td>
        <td className={textCellClass}>{data.model || 'N/A'}</td>
        <td className={textCellClass}>{data.fuelType || 'N/A'}</td>
        <td className={textCellClass}>{data.rcValidUpto || 'N/A'}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleViewDocument(imageUrl)}
              className="p-2 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
              title="View document"
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              onClick={() => onEditRecord?.(record, 'vehicle')}
              className="p-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
              title="Edit vehicle"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(record)}
              className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
              title="Delete record"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderAadhaarRow = (record) => {
    const data = record.extractedData || {};
    const aadhaarNo = data.aadhaar_no || '';
    const masked = aadhaarNo.length >= 12 ? `${aadhaarNo.slice(0, 4)}XXXX${aadhaarNo.slice(-4)}` : aadhaarNo;
    const isUploaded = !!record.imageUrl;

    return (
      <tr key={record.id} className={rowClass}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold shadow-sm">
              {getInitials(data.name)}
            </div>
            <div className="font-semibold">{data.name || 'N/A'}</div>
          </div>
        </td>
        <td className={`${textCellClass} tracking-widest`}>{masked || 'N/A'}</td>
        <td className={textCellClass}>{data.dob || 'N/A'}</td>
        <td className={`${textCellClass} uppercase`}>{data.gender || 'N/A'}</td>
        <td className={textCellClass}>{data.address || 'N/A'}</td>
        <td className={textCellClass}>{data.pincode || 'N/A'}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleViewDocument(record.imageUrl)}
              className="p-2 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
              title="View document"
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              onClick={() => onEditRecord?.(record, 'aadhaar')}
              className="p-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
              title="Edit aadhaar"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(record)}
              className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
              title="Delete record"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className="py-12 text-center text-slate-500">
            Loading records...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={7} className="py-12 text-center text-slate-500">
            {TAB_CONFIG[activeTab].emptyMessage}
          </td>
        </tr>
      );
    }

    if (!filteredRecords.length) {
      return (
        <tr>
          <td colSpan={7} className="py-12 text-center text-slate-500">
            {TAB_CONFIG[activeTab].emptyMessage}
          </td>
        </tr>
      );
    }

    if (activeTab === 'license') return filteredRecords.map(renderLicenseRow);
    if (activeTab === 'vehicle') return filteredRecords.map(renderVehicleRow);
    return filteredRecords.map(renderAadhaarRow);
  };

  const renderTableHead = () => {
    if (activeTab === 'license') {
      return (
        <tr>
          <th className={textHeaderClass}>Driver Details</th>
          <th className={textHeaderClass}>License No.</th>
          <th className={textHeaderClass}>Expiry Date</th>
          <th className={textHeaderClass}>Status</th>
          <th className={textHeaderClass}>Actions</th>
        </tr>
      );
    }

    if (activeTab === 'vehicle') {
      return (
        <tr>
          <th className={textHeaderClass}>Owner</th>
          <th className={textHeaderClass}>Registration No.</th>
          <th className={textHeaderClass}>Model</th>
          <th className={textHeaderClass}>Fuel Type</th>
          <th className={textHeaderClass}>RC Valid Upto</th>
          <th className={textHeaderClass}>Actions</th>
        </tr>
      );
    }

    return (
      <tr>
        <th className={textHeaderClass}>Name</th>
        <th className={textHeaderClass}>Aadhaar No.</th>
        <th className={textHeaderClass}>DOB</th>
        <th className={textHeaderClass}>Gender</th>
        <th className={textHeaderClass}>Address</th>
        <th className={textHeaderClass}>PIN Code</th>
        <th className={textHeaderClass}>Actions</th>
      </tr>
    );
  };

  return (
    <div className={`p-6 space-y-4 rounded-2xl border ${theme === 'light' ? 'border-slate-300 bg-slate-50' : 'border-slate-700 bg-slate-800/50'} transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(TAB_CONFIG).map(([key, tab]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === key
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/60 text-slate-700 border border-slate-300 hover:border-emerald-400 hover:bg-white/80'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              className={`pl-9 pr-3 py-2 w-64 rounded-xl border focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all ${theme === 'light'
                ? 'bg-white text-slate-800 border-slate-300'
                : 'glass-input border-white/10 bg-white/5 text-white'
                }`}
              placeholder={`Search ${TAB_CONFIG[activeTab].label}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={fetchRecords}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 shadow-md ${theme === 'light'
              ? 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
              : 'glass-button text-white hover:bg-white/10'
              }`}
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-300">
        <table className="min-w-full divide-y divide-slate-300">
          <thead className={`${theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-slate-700/50 text-slate-200'} text-sm transition-colors duration-300`}>
            {renderTableHead()}
          </thead>
          <tbody className={`${theme === 'light' ? 'bg-white/40 text-slate-800' : 'bg-slate-800/30 text-slate-200'} text-sm transition-colors duration-300`}>{renderTableBody()}</tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-4" onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm"
              title="Close Preview"
            >
              <X size={24} />
            </button>
            <img
              src={previewUrl}
              alt="Document Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div >
  );
};

export default DocumentRecords;

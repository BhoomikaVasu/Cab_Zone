import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCcw, UserPlus, Phone, UserCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '';



const buildUrl = (path = '') => `${API_BASE_URL}${path}`;

const DriverSelector = ({ selectedDriver, onSelect, theme = 'dark' }) => {
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [savingDriver, setSavingDriver] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState({ type: '', text: '' });

  const loadDrivers = useCallback(async () => {
    setLoadingDrivers(true);
    try {
      // Try to fetch from API first
      const response = await fetch(buildUrl('/api/drivers'));
      if (!response.ok) {
        throw new Error('API not available');
      }
      const bodyText = await response.text();
      let payload = [];
      try {
        payload = JSON.parse(bodyText || '[]');
      } catch {
        throw new Error('API not available');
      }
      const list = Array.isArray(payload) ? payload : [];
      setDrivers(list);
      // Save to localStorage as backup
      localStorage.setItem('cabzone_drivers', JSON.stringify(list));

      if (selectedDriver) {
        const stillExists = list.find((driver) => driver.id === selectedDriver.id);
        if (!stillExists) {
          onSelect(null);
        }
      }

      if (list.length === 0) {
        setStatus({
          type: 'info',
          text: 'No drivers yet. Add one below to get started.',
        });
      } else if (!selectedDriver) {
        setStatus({
          type: 'info',
          text: 'Pick an existing driver or create a new one.',
        });
      }
    } catch (error) {
      // If API fails, use localStorage
      try {
        const stored = localStorage.getItem('cabzone_drivers');
        const list = stored ? JSON.parse(stored) : [];
        setDrivers(list);

        if (list.length === 0) {
          setStatus({
            type: 'info',
            text: 'No drivers yet. Add one below to get started.',
          });
        } else {
          setStatus({
            type: 'info',
            text: 'Pick an existing driver or create a new one. (Using local storage)',
          });
        }
      } catch {
        setDrivers([]);
        setStatus({
          type: 'info',
          text: 'No drivers yet. Add one below to get started.',
        });
      }
    } finally {
      setLoadingDrivers(false);
    }
  }, [selectedDriver, onSelect]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const handleSelect = (event) => {
    const driverId = event.target.value;
    if (!driverId) {
      onSelect(null);
      setStatus({
        type: 'info',
        text: 'Select a driver to link future uploads.',
      });
      return;
    }

    const driver = drivers.find((entry) => entry.id === driverId);
    onSelect(driver || null);
    if (driver) {
      setStatus({
        type: 'success',
        text: `Selected driver: ${driver.name || driver.id}`,
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'phone' ? value.replace(/\D/g, '') : value,
    }));
  };

  const isPhoneValid = useMemo(() => /^\d{10}$/.test(formValues.phone), [formValues.phone]);
  const canSaveDriver = isPhoneValid && !savingDriver;

  const handleSaveDriver = async (event) => {
    event.preventDefault();
    if (!isPhoneValid) {
      setStatus({ type: 'error', text: 'Enter a valid 10-digit phone number.' });
      return;
    }

    setSavingDriver(true);
    try {
      const newDriver = {
        id: formValues.phone.trim(),
        name: formValues.name.trim() || 'Unnamed Driver',
        phone: formValues.phone.trim(),
        createdAt: new Date().toISOString(),
      };

      // Try to save to API first
      try {
        const response = await fetch(buildUrl('/api/drivers'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDriver),
        });

        if (response.ok) {
          const payload = await response.json();
          setDrivers((prev) => {
            const withoutDuplicate = prev.filter((driver) => driver.id !== payload.id);
            const updated = [...withoutDuplicate, payload].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            localStorage.setItem('cabzone_drivers', JSON.stringify(updated));
            return updated;
          });
          onSelect(payload);
          setFormValues({ name: '', phone: '' });
          setStatus({
            type: 'success',
            text: `Saved & selected driver: ${payload.name || payload.id}`,
          });
          setSavingDriver(false);
          return;
        }
      } catch {
        // API failed, continue to localStorage
      }

      // Save to localStorage
      setDrivers((prev) => {
        const withoutDuplicate = prev.filter((driver) => driver.id !== newDriver.id);
        const updated = [...withoutDuplicate, newDriver].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        localStorage.setItem('cabzone_drivers', JSON.stringify(updated));
        return updated;
      });

      onSelect(newDriver);
      setFormValues({ name: '', phone: '' });
      setStatus({
        type: 'success',
        text: `Saved & selected driver: ${newDriver.name} (stored locally)`,
      });
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.message || 'Unable to save driver',
      });
    } finally {
      setSavingDriver(false);
    }
  };

  const messageStyles = {
    success: theme === 'light' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-200',
    error: theme === 'light' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-500/10 border border-red-500/40 text-red-200',
    info: theme === 'light' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-100',
  };

  return (
    <div className={`p-6 border rounded-xl ${theme === 'light' ? 'bg-white border-slate-200' : 'glass-card border-white/5 bg-white/5'} transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className={`text-sm uppercase tracking-wider font-semibold ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-300/70'}`}>
            Driving License & Vehicle RC Data Extractor
          </p>
          <h3 className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Select Driver</h3>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
            Choose an existing driver or add a new driver before uploading documents.
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/40 to-cyan-500/40 flex items-center justify-center">
          <UserCircle2 className="text-white" size={32} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={`text-sm font-semibold mb-2 block ${theme === 'light' ? 'text-slate-700' : 'text-gray-200'}`}>
            Existing Drivers
          </label>
          <div className="flex flex-col lg:flex-row gap-3">
            <select
              className={`flex-1 py-3 px-4 rounded-xl border focus:border-emerald-400/60 outline-none transition-all ${theme === 'light'
                ? 'bg-white text-slate-800 border-slate-200'
                : 'glass-input border-white/10 bg-white/5 text-white'
                }`}
              value={selectedDriver?.id || ''}
              onChange={handleSelect}
              disabled={loadingDrivers}
            >
              <option value="">-- Select driver --</option>
              {drivers
                .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id))
                .map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name || 'Unnamed'} ({driver.phone || driver.id})
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={() => {
                // Clear form fields
                setFormValues({ name: '', phone: '' });
                // Clear selected driver
                onSelect(null);
                // Reload drivers list
                loadDrivers();
                // Update status
                setStatus({
                  type: 'info',
                  text: 'Refreshed. Select a driver or add a new one.',
                });
              }}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all shadow-md ${theme === 'light'
                ? 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
                : 'glass-button text-white hover:bg-white/10'
                }`}
              disabled={loadingDrivers}
            >
              <RefreshCcw size={18} className={loadingDrivers ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSaveDriver}
          className="grid grid-cols-1 md:grid-cols-[1fr,250px,150px] gap-3"
        >
          <div>
            <label className={`text-sm font-semibold mb-2 block ${theme === 'light' ? 'text-slate-700' : 'text-gray-200'}`}>
              New Driver Name
            </label>
            <div className="relative">
              <input
                name="name"
                placeholder="Driver name"
                value={formValues.name}
                onChange={handleInputChange}
                className={`w-full py-3 pl-11 pr-3 rounded-xl ${theme === 'light' ? 'bg-slate-50 border border-slate-200 text-slate-900' : 'glass-input'} transition-colors duration-300`}
              />
              <UserPlus size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'}`} />
            </div>
          </div>

          <div>
            <label className={`text-sm font-semibold mb-2 block ${theme === 'light' ? 'text-slate-700' : 'text-gray-200'}`}>
              Driver Phone (driverId)
            </label>
            <div className="relative">
              <input
                name="phone"
                placeholder="10-digit phone"
                value={formValues.phone}
                onChange={handleInputChange}
                className={`w-full py-3 pl-11 pr-3 rounded-xl ${theme === 'light' ? 'bg-slate-50 border border-slate-200 text-slate-900' : 'glass-input'} transition-colors duration-300`}
                maxLength={10}
              />
              <Phone size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-300'}`} />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!canSaveDriver}
            >
              <span>{savingDriver ? 'Saving...' : 'Save & Select'}</span>
            </button>
          </div>
        </form>

        {status.text && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${messageStyles[status.type] || (theme === 'light' ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-white/5 text-gray-200 border border-white/10')}`}
          >
            {status.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverSelector;





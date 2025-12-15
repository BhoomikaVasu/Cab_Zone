import React, { useEffect, useState } from 'react';
import { User, Phone, CreditCard, Car, Calendar, MapPin } from 'lucide-react';

const EditDriverForm = ({ driver, onSubmit, onCancel }) => {
  const buildInitialState = (source) => ({
    name: source?.name || '',
    phone: source?.phone || '',
    licenseNo: source?.licenseNo || '',
    vehicle: source?.vehicle || '',
    dob: source?.dob || '',
    doi: source?.doi || '',
    licenseExpiry: source?.licenseExpiry || '',
    joinDate: source?.joinDate || '',
    address: source?.address || '',
  });

  const [formData, setFormData] = useState(buildInitialState(driver));

  useEffect(() => {
    setFormData(buildInitialState(driver));
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driver?.id) return;

    onSubmit({
      id: driver.id,
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <User size={16} className="inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="glass-input w-full text-slate-900"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Phone size={16} className="inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="glass-input w-full text-slate-900"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <CreditCard size={16} className="inline mr-2" />
            License Number
          </label>
          <input
            type="text"
            name="licenseNo"
            value={formData.licenseNo}
            onChange={handleChange}
            required
            className="glass-input w-full text-slate-900"
            placeholder="DL-0120210012345"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Car size={16} className="inline mr-2" />
            Assigned Vehicle
          </label>
          <input
            type="text"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className="glass-input w-full text-slate-900"
            placeholder="Vehicle number"
          />
        </div>



        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Date of Issue
          </label>
          <input
            type="date"
            name="doi"
            value={formData.doi}
            onChange={handleChange}
            className="glass-input w-full text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            License Expiry
          </label>
          <input
            type="date"
            name="licenseExpiry"
            value={formData.licenseExpiry}
            onChange={handleChange}
            className="glass-input w-full text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Join Date
          </label>
          <input
            type="date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            className="glass-input w-full text-slate-900"
          />
        </div>
      </div>



      <div className="flex gap-4 pt-4">
        <button type="submit" className="btn-primary flex-1">
          Save Changes
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditDriverForm;

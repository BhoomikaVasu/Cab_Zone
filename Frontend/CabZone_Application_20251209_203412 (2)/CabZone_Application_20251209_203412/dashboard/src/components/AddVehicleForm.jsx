import React, { useState } from 'react';
import { Car, FileText, Calendar, Shield } from 'lucide-react';

const AddVehicleForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    model: '',
    rcNumber: '',
    fitnessCert: '',
    insuranceExpiry: '',
    purchaseDate: '',
    color: '',
    fuelType: 'Petrol',
    pucExpiry: '',
    permitExpiry: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle ID */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Car size={16} className="inline mr-2" />
            Vehicle Number *
          </label>
          <input
            type="text"
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            required
            placeholder="MH-01-AB-1234"
            className="glass-input w-full"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Model *
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            placeholder="Maruti Suzuki Swift Dzire"
            className="glass-input w-full"
          />
        </div>

        {/* RC Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FileText size={16} className="inline mr-2" />
            RC Number *
          </label>
          <input
            type="text"
            name="rcNumber"
            value={formData.rcNumber}
            onChange={handleChange}
            required
            placeholder="RC-2023-001234"
            className="glass-input w-full"
          />
        </div>

        {/* Fitness Certificate */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Fitness Certificate Expiry *
          </label>
          <input
            type="date"
            name="fitnessCert"
            value={formData.fitnessCert}
            onChange={handleChange}
            required
            className="glass-input w-full"
          />
        </div>

        {/* Insurance Expiry */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Shield size={16} className="inline mr-2" />
            Insurance Expiry *
          </label>
          <input
            type="date"
            name="insuranceExpiry"
            value={formData.insuranceExpiry}
            onChange={handleChange}
            required
            className="glass-input w-full"
          />
        </div>

        {/* PUC Expiry */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FileText size={16} className="inline mr-2" />
            PUC Expiry *
          </label>
          <input
            type="date"
            name="pucExpiry"
            value={formData.pucExpiry || ''}
            onChange={handleChange}
            required
            className="glass-input w-full"
          />
        </div>

        {/* Permit Expiry */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FileText size={16} className="inline mr-2" />
            Permit Expiry *
          </label>
          <input
            type="date"
            name="permitExpiry"
            value={formData.permitExpiry || ''}
            onChange={handleChange}
            required
            className="glass-input w-full"
          />
        </div>

        {/* Purchase Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Purchase Date
          </label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className="glass-input w-full"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Color
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="White"
            className="glass-input w-full"
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fuel Type *
          </label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            required
            className="glass-input w-full"
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="btn-primary flex-1"
        >
          Add Vehicle
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddVehicleForm;

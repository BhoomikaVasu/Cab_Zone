import React, { useEffect, useState } from 'react';
import { User, FileText, Settings, Car, Calendar, CreditCard } from 'lucide-react';

const EditVehicleForm = ({ data, onSubmit, onCancel }) => {
    const buildInitialState = (source) => ({
        ownerName: source?.ownerName || '',
        carNumberPlate: source?.carNumberPlate || source?.registrationNo || '',
        model: source?.model || '',
        fuelType: source?.fuelType || '',
        rcValidUpto: source?.rcValidUpto || '',
        vehicleType: source?.vehicleType || '',
        driverPhone: source?.driverPhone || '',
    });

    const [formData, setFormData] = useState(buildInitialState(data));

    useEffect(() => {
        setFormData(buildInitialState(data));
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data?.id) return;
        onSubmit({
            ...formData,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User size={16} className="inline mr-2" />
                        Owner Name
                    </label>
                    <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="glass-input w-full text-slate-900"
                        placeholder="Owner Name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Car size={16} className="inline mr-2" />
                        Registration No
                    </label>
                    <input
                        type="text"
                        name="carNumberPlate"
                        value={formData.carNumberPlate}
                        onChange={handleChange}
                        required
                        className="glass-input w-full text-slate-900"
                        placeholder="MH01AB1234"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Settings size={16} className="inline mr-2" />
                        Model
                    </label>
                    <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="glass-input w-full text-slate-900"
                        placeholder="e.g. Swift Dzire"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FileText size={16} className="inline mr-2" />
                        Fuel Type
                    </label>
                    <input
                        type="text"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        className="glass-input w-full text-slate-900"
                        placeholder="Petrol/Diesel/CNG"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        RC Valid Upto
                    </label>
                    <input
                        type="date"
                        name="rcValidUpto"
                        value={formData.rcValidUpto}
                        onChange={handleChange}
                        className="glass-input w-full text-slate-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Car size={16} className="inline mr-2" />
                        Vehicle Type
                    </label>
                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="glass-input w-full text-slate-900"
                    >
                        <option value="">Select Type</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Van">Van</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <CreditCard size={16} className="inline mr-2" />
                        Driver Phone (Linked)
                    </label>
                    <input
                        type="tel"
                        name="driverPhone"
                        value={formData.driverPhone}
                        onChange={handleChange}
                        className="glass-input w-full text-slate-900"
                        placeholder="Linked Driver Phone"
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

export default EditVehicleForm;

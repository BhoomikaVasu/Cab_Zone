import React, { useEffect, useState } from 'react';
import { User, MapPin, Calendar, CreditCard, Hash } from 'lucide-react';

const EditAadhaarForm = ({ data, onSubmit, onCancel }) => {
    const buildInitialState = (source) => ({
        name: source?.name || '',
        aadhaar_no: source?.aadhaar_no || '',
        dob: source?.dob || '',
        gender: source?.gender || '',
        address: source?.address || '',
        pincode: source?.pincode || '',
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
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="glass-input w-full text-slate-900"
                        placeholder="Name on Aadhaar"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <CreditCard size={16} className="inline mr-2" />
                        Aadhaar Number
                    </label>
                    <input
                        type="text"
                        name="aadhaar_no"
                        value={formData.aadhaar_no}
                        onChange={handleChange}
                        required
                        className="glass-input w-full text-slate-900"
                        placeholder="12-digit Aadhaar No"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="glass-input w-full text-slate-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User size={16} className="inline mr-2" />
                        Gender
                    </label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="glass-input w-full text-slate-900"
                    >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Hash size={16} className="inline mr-2" />
                        PIN Code
                    </label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="glass-input w-full text-slate-900"
                        placeholder="6-digit PIN"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Address
                </label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="glass-input w-full resize-none text-slate-900"
                    placeholder="Full Address"
                />
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

export default EditAadhaarForm;

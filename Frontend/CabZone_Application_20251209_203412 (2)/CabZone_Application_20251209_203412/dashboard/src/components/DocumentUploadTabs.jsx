import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

// ... (imports)

const API_BASE_URL = ''; // Proxy handles the base URL
const buildUrl = (path = '') => `${API_BASE_URL}${path}`;

const DocumentUploadTabs = ({ addToast, theme = 'dark', vehicleId }) => {
    const [activeTab, setActiveTab] = useState('RC');
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    const tabs = ['RC', 'INSURANCE', 'PUC', 'FITNESS', 'PERMIT'];

    // Map tabs to backend field names
    const fieldMap = {
        'RC': 'rcImage',
        'INSURANCE': 'insuranceImage',
        'PUC': 'pollutionImage',
        'FITNESS': 'fitnessImage',
        'PERMIT': 'permitImage'
    };

    const handleFileSelect = (e) => {
        // ... (existing logic)
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                if (addToast) addToast('File size exceeds 10MB limit', 'error');
                return;
            }
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                if (addToast) addToast('Please upload PNG, JPG, or PDF files only', 'error');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Re-use logic for file checking
            const file = e.dataTransfer.files[0];
            if (file) {
                if (file.size > 10 * 1024 * 1024) {
                    if (addToast) addToast('File size exceeds 10MB limit', 'error');
                    return;
                }
                const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
                if (!validTypes.includes(file.type)) {
                    if (addToast) addToast('Please upload PNG, JPG, or PDF files only', 'error');
                    return;
                }
                setSelectedFile(file);
            }
        }
    };

    const handleUploadAndExtract = async () => {
        if (!selectedFile) {
            if (addToast) addToast('Please select a file first', 'error');
            return;
        }
        if (!vehicleId) {
            if (addToast) addToast('Please enter a Number Plate and Save Vehicle first.', 'error');
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();

            // Backend expects 'numberPlate' to identify the vehicle
            formData.append('numberPlate', vehicleId);

            // Get the correct field name for the active tab (e.g. rcImage)
            const fieldName = fieldMap[activeTab];
            formData.append(fieldName, selectedFile);

            console.log(`Uploading ${activeTab} for ${vehicleId}...`);

            const res = await fetch(buildUrl('/api/vehicles'), {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Upload failed');
            }

            const data = await res.json();
            console.log('Upload success:', data);

            if (addToast) addToast(`${activeTab} document uploaded & analyzed successfully!`, 'success');
            setSelectedFile(null); // Clear file after success

        } catch (error) {
            console.error('Upload error:', error);
            if (addToast) addToast(error.message || 'Upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Tab Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setSelectedFile(null);
                        }}
                        className={`px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-md ${activeTab === tab
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Upload Area */}
            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left: Dropzone */}
                <div className="flex-1 w-full relative group">
                    <input
                        type="file"
                        id="document-upload"
                        className="hidden"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleFileSelect}
                    />
                    <label
                        htmlFor="document-upload"
                        className={`block w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all relative overflow-hidden ${dragActive
                            ? 'border-blue-500 bg-blue-50/10'
                            : 'border-slate-300 hover:border-blue-400 bg-slate-50/5'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="text-center z-10">
                            {selectedFile ? (
                                <div className="flex flex-col items-center gap-2">
                                    <FileText size={40} className="text-blue-500" />
                                    <p className="font-semibold text-white">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-lg font-medium text-gray-400 group-hover:text-blue-400 transition-colors">
                                        {activeTab} image/PDF
                                    </p>
                                    <span className="px-4 py-1.5 bg-slate-700 text-white text-xs font-semibold rounded shadow group-hover:bg-slate-600 transition-colors">
                                        BROWSE FILES
                                    </span>
                                </div>
                            )}
                        </div>
                    </label>
                </div>

                {/* Right: Upload Button & Info */}
                <div className="flex flex-col items-center md:items-start space-y-3 shrink-0">
                    <button
                        onClick={handleUploadAndExtract}
                        disabled={uploading}
                        className={`px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2 w-full md:w-auto min-w-[200px] ${uploading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>UPLOADING...</span>
                            </>
                        ) : (
                            <span>UPLOAD & EXTRACT</span>
                        )}
                    </button>
                    <p className="text-xs text-gray-400 text-center w-full">
                        PNG/JPG/PDF up to 10MB
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploadTabs;

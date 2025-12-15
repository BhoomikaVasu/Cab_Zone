import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import DocumentUploadTabs from './DocumentUploadTabs';

const DocumentUploadModal = ({ onClose, addToast }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text">Upload Vehicle Documents</h1>
                    <button
                        onClick={onClose}
                        className="glass-button p-2 hover:bg-red-500/20 text-red-400"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Document Upload Tabs */}
                <DocumentUploadTabs addToast={addToast} />
            </motion.div>
        </div>
    );
};

export default DocumentUploadModal;

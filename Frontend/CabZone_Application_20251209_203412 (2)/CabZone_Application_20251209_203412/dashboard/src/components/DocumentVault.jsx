import React, { useState } from 'react';
import { Search, Filter, Upload, Download, Eye, FileText, Calendar, User, Car, Shield, FileImage, FileClock, FileCheck, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';

const DocumentVault = ({ addToast, theme = 'dark' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterExpiry, setFilterExpiry] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState('detailed');

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
    if (addToast) addToast('Advanced filters toggled', 'info');
  };

  const documents = [
    {
      id: 1,
      name: 'Driver License - Rajesh Kumar',
      type: 'Driver Document',
      category: 'DL',
      owner: 'Rajesh Kumar',
      vehicle: 'MH-01-AB-1234',
      uploadDate: '2024-01-15',
      expiryDate: '2026-01-15',
      status: 'Valid',
      size: '2.4 MB',
      verified: true,
      thumbnail: 'https://via.placeholder.com/100x70/10b981/FFFFFF?text=DL'
    },
    {
      id: 2,
      name: 'Vehicle Registration - MH-01-AB-1234',
      type: 'Vehicle Document',
      category: 'VR',
      owner: 'Rajesh Kumar',
      vehicle: 'MH-01-AB-1234',
      uploadDate: '2023-12-20',
      expiryDate: '2025-12-20',
      status: 'Valid',
      size: '1.8 MB',
      verified: true,
      thumbnail: 'https://via.placeholder.com/100x70/6366f1/FFFFFF?text=VR'
    },
    {
      id: 3,
      name: 'Insurance Policy - MH-02-CD-5678',
      type: 'Insurance Document',
      category: 'Insurance',
      owner: 'Amit Sharma',
      vehicle: 'MH-02-CD-5678',
      uploadDate: '2024-02-01',
      expiryDate: '2024-06-10',
      status: 'Expiring Soon',
      size: '3.1 MB',
      verified: true,
      thumbnail: 'https://via.placeholder.com/100x70/f59e0b/FFFFFF?text=INS'
    },
    {
      id: 4,
      name: 'Service Agreement - MH-03-EF-9012',
      type: 'Agreement Document',
      category: 'Agreement',
      owner: 'Suresh Patil',
      vehicle: 'MH-03-EF-9012',
      uploadDate: '2023-11-10',
      expiryDate: '2024-04-25',
      status: 'Expiring Soon',
      size: '2.2 MB',
      verified: true
    },
    {
      id: 5,
      name: 'Driver License - Vijay Singh',
      type: 'Driver Document',
      category: 'DL',
      owner: 'Vijay Singh',
      vehicle: 'MH-04-GH-3456',
      uploadDate: '2023-05-08',
      expiryDate: '2024-03-15',
      status: 'Expired',
      size: '2.6 MB',
      verified: false
    },
    {
      id: 6,
      name: 'Driver Agreement - Prakash Desai',
      type: 'Agreement Document',
      category: 'Agreement',
      owner: 'Prakash Desai',
      vehicle: 'MH-05-IJ-7890',
      uploadDate: '2024-02-14',
      expiryDate: 'N/A',
      status: 'Valid',
      size: '1.5 MB',
      verified: true
    },
    {
      id: 7,
      name: 'Vehicle Registration Renewal - MH-01-AB-1234',
      type: 'Vehicle Document',
      category: 'VR',
      owner: 'Rajesh Kumar',
      vehicle: 'MH-01-AB-1234',
      uploadDate: '2024-01-20',
      expiryDate: '2024-07-20',
      status: 'Valid',
      size: '1.2 MB',
      verified: true
    },
    {
      id: 8,
      name: 'Insurance Policy - Amit Sharma',
      type: 'Insurance Document',
      category: 'Insurance',
      owner: 'Amit Sharma',
      vehicle: 'MH-02-CD-5678',
      uploadDate: '2023-03-20',
      expiryDate: '2024-03-20',
      status: 'Valid',
      size: '1.9 MB',
      verified: true
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'valid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'expiring soon':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryAccent = (category) => {
    switch (category?.toLowerCase()) {
      case 'dl':
        return {
          iconBg: 'bg-emerald-500/15 text-emerald-300',
          border: 'border-emerald-400/30',
          bar: 'from-emerald-400/70 via-emerald-400/20 to-transparent',
        };
      case 'vr':
        return {
          iconBg: 'bg-blue-500/15 text-blue-300',
          border: 'border-blue-400/30',
          bar: 'from-blue-400/70 via-blue-400/20 to-transparent',
        };
      case 'insurance':
        return {
          iconBg: 'bg-purple-500/15 text-purple-300',
          border: 'border-purple-400/30',
          bar: 'from-purple-400/70 via-purple-400/20 to-transparent',
        };
      case 'agreement':
        return {
          iconBg: 'bg-cyan-500/15 text-cyan-300',
          border: 'border-cyan-400/30',
          bar: 'from-cyan-400/70 via-cyan-400/20 to-transparent',
        };
      default:
        return {
          iconBg: 'bg-slate-500/15 text-slate-300',
          border: 'border-white/10',
          bar: 'from-white/40 via-white/10 to-transparent',
        };
    }
  };

  const categoryDisplayNames = {
    dl: 'Driver Licenses',
    vr: 'Vehicle Registration',
    insurance: 'Insurance Documents',
    agreement: 'Agreements',
    other: 'Other Documents',
  };

  const categoryOrder = ['dl', 'vr', 'insurance', 'agreement'];

  const handleCategorySelect = (key) => {
    setFilterType((prev) => (prev === key ? 'all' : key));
  };

  const handleUploadDocument = () => {
    if (addToast) addToast('Document upload feature coming soon!', 'info');
  };

  const handleBulkDownload = () => {
    if (addToast) addToast(`Bulk download started for ${filteredDocuments.length} documents`, 'success');
  };

  const handleViewDocument = (doc) => {
    if (addToast) addToast(`Previewing ${doc.name}`, 'info');
  };

  const handleDownloadDocument = (doc) => {
    if (addToast) addToast(`Downloading ${doc.name}`, 'success');
  };

  const handleDropZoneClick = () => {
    handleUploadDocument();
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'dl':
        return <FileCheck size={24} className="text-green-400" />;
      case 'vr':
        return <FileText size={24} className="text-blue-400" />;
      case 'insurance':
        return <Shield size={24} className="text-purple-400" />;
      case 'agreement':
        return <FileImage size={24} className="text-cyan-400" />;
      default:
        return <FileText size={24} className="text-gray-400" />;
    }
  };

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
    if (addToast) addToast(`Selected document: ${doc.name}`, 'info');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.category?.toLowerCase() === filterType;
    const matchesExpiry = filterExpiry === 'all' || doc.status.toLowerCase().includes(filterExpiry);
    return matchesSearch && matchesType && matchesExpiry;
  });

  const getCategoryCount = (category) =>
    documents.filter(doc => doc.category.toLowerCase() === category).length;

  const categoryCards = [
    {
      key: 'all',
      label: 'All Documents',
      description: `${documents.length} total`,
      iconBg: 'bg-slate-500/20',
      icon: <FileClock size={24} className="text-slate-300" />,
    },
    {
      key: 'dl',
      label: 'Driver Licenses (DL)',
      description: `${getCategoryCount('dl')} documents`,
      iconBg: 'bg-green-500/20',
      icon: <FileCheck size={24} className="text-green-500" />,
    },
    {
      key: 'vr',
      label: 'Vehicle Registration (VR)',
      description: `${getCategoryCount('vr')} documents`,
      iconBg: 'bg-blue-500/20',
      icon: <FileText size={24} className="text-blue-500" />,
    },
    {
      key: 'insurance',
      label: 'Insurance Documents',
      description: `${getCategoryCount('insurance')} documents`,
      iconBg: 'bg-purple-500/20',
      icon: <Shield size={24} className="text-purple-500" />,
    },
    {
      key: 'agreement',
      label: 'Agreements',
      description: `${getCategoryCount('agreement')} documents`,
      iconBg: 'bg-cyan-500/20',
      icon: <FileImage size={24} className="text-cyan-500" />,
    },
  ];

  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    const key = doc.category?.toLowerCase() || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});

  const orderedGroupKeys = (filterType === 'all' ? categoryOrder : [filterType]).filter(
    (key) => groupedDocuments[key]?.length
  );
  const fallbackGroupKeys = Object.keys(groupedDocuments);
  const groupKeysToRender = orderedGroupKeys.length ? orderedGroupKeys : fallbackGroupKeys;
  let cardIndex = 0;
  const isListView = viewMode === 'list';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl ${theme === 'light' ? 'bg-white border border-slate-200 shadow-sm' : 'glass-card'}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Document Vault</h1>
            <p className={theme === 'light' ? 'text-slate-500' : 'text-gray-400'}>Securely store and manage all your fleet documents</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-slate-400' : 'text-gray-400'}`} size={18} />
              <input
                type="text"
                placeholder="Search documents..."
                className={`pl-10 py-2 rounded-lg outline-none transition-all ${theme === 'light' ? 'bg-slate-50 border border-slate-200 text-slate-800 focus:ring-2 focus:ring-blue-500/20' : 'glass-input'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={`flex items-center gap-1 rounded-lg p-1 ${theme === 'light' ? 'bg-slate-100 border border-slate-200' : 'border border-white/10 bg-white/5'}`}>
              <button
                type="button"
                onClick={() => setViewMode('detailed')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition ${viewMode === 'detailed'
                  ? theme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'bg-white/20 text-white shadow-sm'
                  : theme === 'light' ? 'text-slate-500 hover:bg-white/50' : 'text-gray-300 hover:bg-white/10'
                  }`}
                title="Detailed view"
                aria-pressed={viewMode === 'detailed'}
              >
                <LayoutGrid size={16} />
                <span className="hidden sm:inline">Detailed</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition ${viewMode === 'list'
                  ? theme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'bg-white/20 text-white shadow-sm'
                  : theme === 'light' ? 'text-slate-500 hover:bg-white/50' : 'text-gray-300 hover:bg-white/10'
                  }`}
                title="List view"
                aria-pressed={viewMode === 'list'}
              >
                <List size={16} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
            <button
              onClick={handleAdvancedFilters}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all ${theme === 'light' ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' : 'glass-button'}`}
            >
              <Filter size={18} />
              Filters
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:opacity-90' : 'glass-button bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30'}`}
            >
              <Upload size={18} />
              Upload
            </button>
          </div>
        </div>
      </motion.div>

      {/* Document Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        {categoryCards.map(card => (
          <button
            key={card.key}
            type="button"
            onClick={() => handleCategorySelect(card.key)}
            aria-pressed={filterType === card.key}
            className={`p-4 text-left transition-all border rounded-xl ${filterType === card.key
              ? theme === 'light' ? 'border-cyan-500 bg-cyan-50' : 'border-cyan-400/60 bg-white/5'
              : theme === 'light' ? 'bg-white border-slate-200 hover:border-cyan-300' : 'glass-card border-transparent hover:bg-white/5'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${card.iconBg}`}>
                {card.icon}
              </div>
              <div>
                <h3 className={`font-medium ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{card.label}</h3>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>{card.description}</p>
              </div>
            </div>
          </button>
        ))}
      </motion.div>

      {/* Document Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-white border border-slate-200 shadow-sm' : 'glass-card'}`}>
          <p className={`${theme === 'light' ? 'text-slate-500' : 'text-gray-400'} text-sm mb-1`}>Total Documents</p>
          <p className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{filteredDocuments.length}</p>
        </div>
        <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-white border border-slate-200 shadow-sm' : 'glass-card'}`}>
          <p className={`${theme === 'light' ? 'text-slate-500' : 'text-gray-400'} text-sm mb-1`}>Valid</p>
          <p className="text-2xl font-bold text-green-400">
            {filteredDocuments.filter(d => d.status === 'Valid').length}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-white border border-slate-200 shadow-sm' : 'glass-card'}`}>
          <p className={`${theme === 'light' ? 'text-slate-500' : 'text-gray-400'} text-sm mb-1`}>Expiring Soon</p>
          <p className="text-2xl font-bold text-orange-400">
            {filteredDocuments.filter(d => d.status === 'Expiring Soon').length}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-white border border-slate-200 shadow-sm' : 'glass-card'}`}>
          <p className={`${theme === 'light' ? 'text-slate-500' : 'text-gray-400'} text-sm mb-1`}>Expired</p>
          <p className="text-2xl font-bold text-red-400">
            {filteredDocuments.filter(d => d.status === 'Expired').length}
          </p>
        </div>
      </motion.div>

      {/* Documents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {filteredDocuments.length === 0 ? (
          <div className={`p-6 text-center rounded-xl ${theme === 'light' ? 'bg-white border border-slate-200 text-slate-500' : 'glass-card text-gray-400'}`}>
            No documents match the current filters.
          </div>
        ) : (
          groupKeysToRender.map((groupKey) => {
            const docsInGroup = groupedDocuments[groupKey] || [];
            if (!docsInGroup.length) return null;

            const groupHeading =
              categoryDisplayNames[groupKey] || docsInGroup[0]?.category || 'Documents';
            const groupAccent = getCategoryAccent(groupKey);

            return (
              <motion.section
                key={groupKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between px-1">
                  {filterType === 'all' ? (
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-1.5 w-10 rounded-full bg-gradient-to-r ${groupAccent.bar}`}
                      />
                      <h2 className={`text-xs md:text-sm font-semibold uppercase tracking-[0.25em] ${theme === 'light' ? 'text-slate-500' : 'text-gray-300'}`}>
                        {groupHeading}
                      </h2>
                    </div>
                  ) : (
                    <h2 className={`text-sm md:text-base font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-gray-200'}`}>{groupHeading}</h2>
                  )}
                  <span className={`text-xs md:text-sm ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>{docsInGroup.length} items</span>
                </div>

                <div
                  className={
                    isListView
                      ? 'space-y-3'
                      : 'grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4'
                  }
                >
                  {docsInGroup.map((doc) => {
                    const accent = getCategoryAccent(doc.category);
                    const delay = 0.32 + cardIndex * 0.05;
                    cardIndex += 1;

                    if (isListView) {
                      return (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay }}
                          className={`relative overflow-hidden border p-4 md:p-5 flex flex-col gap-3 transition-transform duration-300 rounded-xl ${theme === 'light'
                            ? 'bg-white border-slate-200 shadow-sm hover:border-cyan-400'
                            : `glass-card ${accent.border} hover:border-cyan-400/60`
                            }`}
                        >
                          <div
                            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.bar}`}
                            aria-hidden="true"
                          />
                          <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center ring-1 ring-inset ring-white/10 ${accent.iconBg}`}
                              >
                                {getCategoryIcon(doc.category)}
                              </div>
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-start gap-2 min-w-0">
                                  <h3 className={`text-sm md:text-base font-semibold leading-snug truncate ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                    {doc.name}
                                  </h3>
                                  {doc.verified && (
                                    <span className="text-[11px] font-semibold text-green-400 flex items-center gap-1 bg-green-500/15 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                      <Shield size={12} />
                                      Verified
                                    </span>
                                  )}
                                </div>
                                <div className={`flex flex-wrap items-center gap-3 text-xs md:text-sm ${theme === 'light' ? 'text-slate-600' : 'text-gray-300'}`}>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full uppercase tracking-wide text-[11px] md:text-xs ${theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-white/5 text-gray-100'}`}>
                                    {doc.category}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                                    <Download size={11} className="opacity-70" />
                                    {doc.size}
                                  </span>
                                  <span className={`${theme === 'light' ? 'text-slate-500' : 'text-gray-400'} flex items-center gap-1`}>
                                    <Calendar size={11} className="opacity-70" />
                                    {doc.uploadDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className={`flex items-center gap-3 text-xs md:text-sm whitespace-nowrap ${theme === 'light' ? 'text-slate-600' : 'text-gray-300'}`}>
                              <span className={`px-3 py-0.5 rounded-full font-semibold shadow-sm ${getStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                              <span className={theme === 'light' ? 'text-slate-500' : 'text-gray-400'}>
                                Exp: {doc.expiryDate === 'N/A' ? 'N/A' : doc.expiryDate}
                              </span>
                            </div>
                          </div>

                          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs md:text-sm border-t pt-3 ${theme === 'light' ? 'text-slate-600 border-slate-200' : 'text-gray-300 border-white/10'}`}>
                            <div className="flex flex-wrap items-center gap-4">
                              <span className="flex items-center gap-1.5 truncate">
                                <User size={12} className={theme === 'light' ? 'text-slate-400' : 'text-gray-400'} />
                                <span className="truncate">{doc.owner}</span>
                              </span>
                              <span className="flex items-center gap-1.5 truncate">
                                <Car size={12} className={theme === 'light' ? 'text-slate-400' : 'text-gray-400'} />
                                <span className="truncate font-mono">{doc.vehicle}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => handleViewDocument(doc)}
                                className={`px-2 py-1.5 rounded-lg transition-colors ${theme === 'light' ? 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600' : 'glass-button hover:bg-blue-500/20'}`}
                                title="Preview"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleDownloadDocument(doc)}
                                className={`px-2 py-1.5 rounded-lg transition-colors ${theme === 'light' ? 'bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-600' : 'glass-button hover:bg-green-500/20'}`}
                                title="Download"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay }}
                        className={`relative overflow-hidden border p-3.5 md:p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-300 rounded-xl ${theme === 'light'
                          ? 'bg-white border-slate-200 shadow-sm hover:border-cyan-400'
                          : `glass-card ${accent.border} hover:border-cyan-400/60`
                          }`}
                      >
                        <div
                          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.bar}`}
                          aria-hidden="true"
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ring-1 ring-inset ring-white/10 ${accent.iconBg}`}>
                              {getCategoryIcon(doc.category)}
                            </div>
                            <div className="space-y-1.5 min-w-0">
                              <h3 className={`text-sm md:text-base font-semibold leading-snug line-clamp-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                {doc.name}
                              </h3>
                              <div className={`flex flex-wrap items-center gap-2 text-xs md:text-sm ${theme === 'light' ? 'text-slate-600' : 'text-gray-300'}`}>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full uppercase tracking-wide text-[11px] md:text-xs ${theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-white/5 text-gray-100'}`}>
                                  {doc.category}
                                </span>
                                <span className={`inline-flex items-center gap-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                                  <Download size={11} className="opacity-70" />
                                  {doc.size}
                                </span>
                              </div>
                            </div>
                          </div>
                          {doc.verified && (
                            <span className="text-[11px] font-semibold text-green-400 flex items-center gap-1.5 bg-green-500/15 px-3 py-0.5 rounded-full">
                              <Shield size={12} />
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs md:text-sm mt-1">
                          <span className={`px-3 py-0.5 rounded-full font-semibold shadow-sm ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                          <span className={theme === 'light' ? 'text-slate-500' : 'text-gray-400'}>Exp: {doc.expiryDate === 'N/A' ? 'N/A' : doc.expiryDate}</span>
                        </div>

                        <div className={`grid grid-cols-2 gap-3 text-xs md:text-sm ${theme === 'light' ? 'text-slate-600' : 'text-gray-300'}`}>
                          <div className="flex items-center gap-1.5 truncate">
                            <User size={12} className={theme === 'light' ? 'text-slate-400' : 'text-gray-400'} />
                            <span className="truncate">{doc.owner}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Car size={12} className={theme === 'light' ? 'text-slate-400' : 'text-gray-400'} />
                            <span className="truncate font-mono">{doc.vehicle}</span>
                          </div>
                        </div>

                        <div className={`flex items-center justify-between pt-4 border-t text-xs md:text-sm ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
                          <div className={`flex items-center gap-2 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                            <Calendar size={13} />
                            <span>{doc.uploadDate}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => handleViewDocument(doc)}
                              className={`px-2 py-1.5 rounded-lg transition-colors ${theme === 'light' ? 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600' : 'glass-button hover:bg-blue-500/20'}`}
                              title="Preview"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              className={`px-2 py-1.5 rounded-lg transition-colors ${theme === 'light' ? 'bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-600' : 'glass-button hover:bg-green-500/20'}`}
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })
        )}
      </motion.div>
    </div>
  );
};

export default DocumentVault;

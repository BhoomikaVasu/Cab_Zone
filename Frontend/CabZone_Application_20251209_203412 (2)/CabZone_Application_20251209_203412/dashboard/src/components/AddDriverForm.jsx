import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, Trash2 } from 'lucide-react';

const inputClasses =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500';

const formatFileSize = (size) => {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (size >= 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${size} B`;
};

const AddDriverForm = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const addFiles = (incomingFiles) => {
    if (!incomingFiles.length) return;

    setFiles((prev) => {
      const existingKeys = new Set(prev.map((item) => `${item.file.name}-${item.file.lastModified}`));
      const additions = incomingFiles
        .filter((file) => !existingKeys.has(`${file.name}-${file.lastModified}`))
        .map((file, index) => ({
          id: `${file.name}-${file.lastModified}-${Date.now()}-${index}`,
          file,
          progress: prev.length === 0 && index === 0 ? 100 : Math.floor(60 + Math.random() * 35),
        }));

      return [...prev, ...additions];
    });
  };

  const handleFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    addFiles(selectedFiles);
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    addFiles(droppedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    if (isDragging) setIsDragging(false);
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    onSubmit({
      email: email.trim(),
      documents: files.map(({ file }) => file),
    });
  };

  return (
    <div className="bg-[#3654f6] rounded-[28px] p-1 sm:p-2 shadow-2xl">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto"
      >
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-semibold text-[#3654f6]">Transfer files</h3>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Send files to this email:</p>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="madalina.taina.dev@gmail.com"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="space-y-3">
          {files.length > 0 ? (
            files.map(({ id, file, progress }) => (
              <div key={id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {progress >= 100 ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <span className="text-sm font-semibold text-blue-600">{progress}%</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
                      aria-label="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {progress < 100 && (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No files uploaded yet.</p>
          )}
        </div>

        <div
          className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
            isDragging ? 'border-blue-500 bg-blue-50/80' : 'border-[#8aa5ff] bg-blue-50/60'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-[#3654f6]" />
          <p className="mt-4 text-sm font-semibold text-[#3654f6]">Drag and drop here</p>
          <p className="text-sm text-slate-500">
            or <span className="font-semibold text-[#3654f6]">browse</span>
          </p>
          <p className="mt-3 text-xs text-slate-400">PDF, JPG, PNG • Max 10MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFilesChange}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-[#8aa5ff] px-5 py-3 text-sm font-semibold text-[#3654f6] transition hover:bg-blue-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full rounded-xl bg-[#3654f6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-[#2942c7] sm:w-auto"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDriverForm;

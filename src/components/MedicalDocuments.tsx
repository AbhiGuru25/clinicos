'use client';
import { useState, useEffect, useCallback } from 'react';
import { FileText, Upload, Trash2, ExternalLink, Loader2, AlertCircle, CheckCircle2, File, Image, FileSpreadsheet } from 'lucide-react';
import { getPatientDocuments, uploadPatientDocument, deletePatientDocument, PatientDocument } from '@/lib/patientDocuments';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  patientId: string;
};

// Map MIME types to icons & labels
function getFileIcon(type: string | null) {
  if (!type) return { icon: File, label: 'File', color: 'text-slate-500' };
  if (type.startsWith('image/')) return { icon: Image, label: 'Image', color: 'text-blue-500' };
  if (type === 'application/pdf') return { icon: FileText, label: 'PDF', color: 'text-red-500' };
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv'))
    return { icon: FileSpreadsheet, label: 'Spreadsheet', color: 'text-emerald-500' };
  return { icon: File, label: 'Document', color: 'text-slate-500' };
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MedicalDocuments({ patientId }: Props) {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    const docs = await getPatientDocuments(patientId);
    setDocuments(docs);
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleUpload = async (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'File too large. Maximum size is 10 MB.');
      return;
    }
    setUploading(true);
    const { doc, error } = await uploadPatientDocument(patientId, file);
    if (doc) {
      setDocuments(prev => [doc, ...prev]);
      showToast('success', `"${file.name}" uploaded successfully.`);
    } else {
      showToast('error', error || 'Upload failed. Please try again.');
    }
    setUploading(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (doc: PatientDocument) => {
    if (!window.confirm(`Delete "${doc.file_name}"? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    const { success, error } = await deletePatientDocument(doc);
    if (success) {
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      showToast('success', `"${doc.file_name}" deleted.`);
    } else {
      showToast('error', error || 'Delete failed.');
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      {/* ─── Toast Notification ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Upload Zone ─── */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative clinic-card p-6 border-2 border-dashed transition-all duration-200 text-center cursor-pointer ${
          dragOver
            ? 'border-blue-400 bg-blue-50/50'
            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/50'
        }`}
        onClick={() => !uploading && document.getElementById('medical-doc-input')?.click()}
      >
        <input
          id="medical-doc-input"
          type="file"
          className="hidden"
          onChange={handleFileInput}
          disabled={uploading}
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.csv,.txt"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 size={28} className="text-blue-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Upload size={22} className="text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Drop a file here or <span className="text-blue-600 underline">browse</span>
            </p>
            <p className="text-xs text-slate-400">PDF, Images, Docs, Spreadsheets — Max 10 MB</p>
          </div>
        )}
      </div>

      {/* ─── Documents List ─── */}
      <div className="clinic-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-blue-500" />
            Medical Records
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {documents.length} file{documents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <Loader2 size={24} className="text-slate-300 animate-spin mx-auto" />
          </div>
        ) : documents.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">No documents uploaded yet.</p>
            <p className="text-xs text-slate-300 mt-1">Upload reports, prescriptions, or lab results above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            <AnimatePresence>
              {documents.map(doc => {
                const { icon: Icon, label, color } = getFileIcon(doc.file_type);
                const isDeleting = deletingId === doc.id;

                return (
                  <motion.li
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12, height: 0 }}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 ${color}`}>
                      <Icon size={20} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{doc.file_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {label} · {formatFileSize(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View / Download"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={() => handleDelete(doc)}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}

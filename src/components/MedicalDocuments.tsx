'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FileText, Upload, Trash2, ExternalLink, Loader2, AlertCircle, CheckCircle2, File, Image, FileSpreadsheet, Eye, Camera, RefreshCw, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type PatientDocument = {
  id: string;
  patient_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
};

type Props = {
  patientId: string;
};

function getFileIcon(type: string | null) {
  if (!type) return { icon: File, label: 'File', color: 'text-slate-500', bg: 'bg-slate-50' };
  if (type.startsWith('image/')) return { icon: Image, label: 'Eye Scan / Photo', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (type === 'application/pdf') return { icon: FileText, label: 'PDF Report', color: 'text-red-600', bg: 'bg-red-50' };
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv'))
    return { icon: FileSpreadsheet, label: 'Data Record', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  return { icon: File, label: 'Document', color: 'text-slate-500', bg: 'bg-slate-50' };
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

  // Camera Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/documents?patient_id=${patientId}`);
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Clean up camera stream when modal closes
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setCapturedImage(null);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
    }
  };

  const saveCapturedPhoto = async () => {
    if (!capturedImage) return;

    setUploading(true);
    try {
      // Convert base64 dataUrl to blob/file
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const filename = `EyeScan_${new Date().toISOString().replace(/[:.]/g, '-')}.jpg`;
      const file = new (window as any).File([blob], filename, { type: 'image/jpeg' });

      await handleUpload(file);
      stopCamera();
    } catch (err: any) {
      showToast('error', `Failed to save photo: ${err.message}`);
      setUploading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      showToast('error', 'File too large. Maximum size is 15 MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('patient_id', patientId);
      formData.append('file', file);

      const res = await fetch('/api/patients/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.document) {
        setDocuments(prev => [data.document, ...prev]);
        showToast('success', `"${file.name}" uploaded successfully.`);
      } else {
        showToast('error', data.error || 'Upload failed. Please try again.');
      }
    } catch (err: any) {
      showToast('error', `Upload Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
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
    if (!window.confirm(`Delete "${doc.file_name}"? This action cannot be undone.`)) return;
    setDeletingId(doc.id);
    try {
      const res = await fetch(`/api/patients/documents?id=${doc.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
        showToast('success', `"${doc.file_name}" deleted.`);
      } else {
        showToast('error', data.error || 'Delete failed.');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-md ${
              toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{toast.message}</span>
            </div>
            <button onClick={() => setToast(null)} className="opacity-80 hover:opacity-100 font-bold ml-4">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag & Drop Upload Zone + Camera Actions */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all relative ${
          dragOver ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
        }`}
      >
        <input
          type="file"
          id="file-upload-input"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
            {uploading ? <Loader2 size={22} className="animate-spin text-blue-600" /> : <Upload size={22} />}
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800">
              {uploading ? 'Uploading eye scan / photo document...' : 'Upload Eye Scans, OCT, & Medical Files'}
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Drag & drop files here or capture photos directly with your camera (PDF, PNG, JPG up to 15 MB)
            </p>
          </div>

          {/* Dual Action Buttons: File Computer + Live Camera Capture */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <label
              htmlFor="file-upload-input"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm ${
                uploading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              <Upload size={15} />
              <span>Select File from Computer</span>
            </label>

            <button
              type="button"
              onClick={startCamera}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-sm shadow-emerald-500/20 disabled:opacity-50"
            >
              <Camera size={15} />
              <span>📷 Capture Photo with Camera</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Camera Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Live Camera Viewport Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div onClick={stopCamera} className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" />

          <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden z-10 my-auto flex flex-col">
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Camera size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Capture Medical Photo / Eye Scan</h3>
                  <p className="text-[11px] text-slate-400">Position the physical scan or eye image in frame</p>
                </div>
              </div>
              <button onClick={stopCamera} className="p-2 text-slate-400 hover:text-white rounded-xl"><X size={18} /></button>
            </div>

            {/* Camera Viewport or Captured Preview */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <div className="p-6 text-center text-rose-400 text-xs font-bold">
                  <AlertCircle size={28} className="mx-auto mb-2 text-rose-500" />
                  {cameraError}
                </div>
              ) : capturedImage ? (
                <img src={capturedImage} alt="Captured scan preview" className="w-full h-full object-contain" />
              ) : (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              )}
            </div>

            {/* Controls */}
            <div className="p-4 md:p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <button onClick={stopCamera} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800">
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {capturedImage ? (
                  <>
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} /> Retake
                    </button>
                    <button
                      onClick={saveCapturedPhoto}
                      disabled={uploading}
                      className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1.5 shadow-md shadow-emerald-500/30 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      <span>Save to Patient File</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={capturePhoto}
                    disabled={!!cameraError}
                    className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                  >
                    <Camera size={16} />
                    <span>📸 Take Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-slate-400">
          <Loader2 size={20} className="animate-spin mx-auto mb-2 text-blue-500" />
          Loading medical files...
        </div>
      ) : documents.length === 0 ? (
        <div className="p-8 text-center border border-slate-100 bg-slate-50/30 rounded-2xl">
          <FileText size={28} className="text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-extrabold text-slate-700">No Medical Documents Attached</p>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Upload eye scan reports, OCT images, or capture photos with your camera above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map((doc) => {
            const fileMeta = getFileIcon(doc.file_type);
            const IconComp = fileMeta.icon;

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${fileMeta.bg} flex items-center justify-center shrink-0`}>
                    <IconComp size={18} className={fileMeta.color} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 truncate" title={doc.file_name}>
                      {doc.file_name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-0.5">
                      <span>{fileMeta.label}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>•</span>
                      <span>{new Date(doc.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    title="View Document"
                  >
                    <Eye size={15} />
                  </a>
                  <button
                    onClick={() => handleDelete(doc)}
                    disabled={deletingId === doc.id}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-50"
                    title="Delete File"
                  >
                    {deletingId === doc.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

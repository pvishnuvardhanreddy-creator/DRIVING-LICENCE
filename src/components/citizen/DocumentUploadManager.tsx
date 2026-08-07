import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Eye, Trash2, X, FileCheck2 } from 'lucide-react';
import { DocumentFile } from '../../types';

interface DocumentUploadManagerProps {
  documents: DocumentFile[];
  onUploadDocument: (type: DocumentFile['type'], file: File) => void;
  onRemoveDocument?: (docId: string) => void;
}

export const DocumentUploadManager: React.FC<DocumentUploadManagerProps> = ({
  documents,
  onUploadDocument,
  onRemoveDocument,
}) => {
  const [selectedDocType, setSelectedDocType] = useState<DocumentFile['type']>('aadhaar');
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const docTypesList: { type: DocumentFile['type']; label: string; desc: string }[] = [
    { type: 'aadhaar', label: 'Aadhaar Card', desc: 'Government Identity & Address Proof' },
    { type: 'photo', label: 'Passport Size Photo', desc: 'Clear front face photograph (JPG/PNG)' },
    { type: 'signature', label: 'Applicant Signature', desc: 'Black ink signature on white paper' },
    { type: 'pan', label: 'PAN Card', desc: 'Permanent Account Number Card' },
    { type: 'insurance', label: 'Insurance Certificate', desc: 'Valid Third-Party / Comprehensive Policy' },
    { type: 'puc', label: 'Pollution Certificate (PUC)', desc: 'Emission test clearance certificate' },
    { type: 'passport', label: 'Passport', desc: 'Mandatory for International Driving Permit' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds maximum limit of 5MB.');
        return;
      }
      onUploadDocument(selectedDocType, file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setUploadError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds maximum limit of 5MB.');
        return;
      }
      onUploadDocument(selectedDocType, file);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex justify-between items-center border-b pb-2">
        <div>
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-[#0A4D8C]" />
            <span>Document Verification Repository</span>
          </h3>
          <p className="text-[11px] text-gray-500">Supported formats: PDF, JPG, PNG (Max 5MB per file)</p>
        </div>
      </div>

      {/* Drop Zone Upload Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-5 space-y-2">
          <label className="block font-bold text-gray-700">Document Type to Attach *</label>
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value as any)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-semibold text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
          >
            {docTypesList.map((d) => (
              <option key={d.type} value={d.type}>
                {d.label}
              </option>
            ))}
          </select>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-5 text-center transition ${
              dragOver ? 'border-[#0A4D8C] bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <Upload className="w-8 h-8 text-[#0A4D8C] mx-auto mb-2" />
            <div className="font-bold text-gray-800">Drag & Drop file here</div>
            <div className="text-[10px] text-gray-500 my-1">or click to browse from device</div>

            <label className="inline-block mt-2 bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold px-4 py-1.5 rounded-xl text-xs cursor-pointer shadow transition">
              <span>Choose File</span>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {uploadError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-xl text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        {/* Uploaded Documents List */}
        <div className="md:col-span-7 space-y-2">
          <label className="block font-bold text-gray-700">Attached Application Documents ({documents.length})</label>

          {documents.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
              No documents attached yet. Select a document type on the left to upload.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm hover:border-blue-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-[#0A4D8C] shrink-0" />
                    <div>
                      <div className="font-bold text-gray-900 text-xs">{doc.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Type: {doc.type} • Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        doc.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 bg-blue-50 text-[#0A4D8C] rounded-lg hover:bg-blue-100 transition"
                      title="Preview Document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {onRemoveDocument && (
                      <button
                        type="button"
                        onClick={() => onRemoveDocument(doc.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full border border-gray-200 space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-sm text-gray-900">{previewDoc.name}</h4>
              <button onClick={() => setPreviewDoc(null)} className="p-1 text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
              <img
                src={previewDoc.fileUrl}
                alt={previewDoc.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-[11px] text-gray-500 flex justify-between">
              <span>Status: <strong className="uppercase">{previewDoc.status}</strong></span>
              <span>Uploaded On: {new Date(previewDoc.uploadedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

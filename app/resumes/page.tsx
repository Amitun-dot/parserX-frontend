'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { getResumes, deleteResume, uploadResume } from '@/lib/api/resume.api';
import { getErrorMessage } from '@/lib/api/errors';
import { useToast } from '@/lib/context/toast-context';
import type { Resume } from '@/lib/types';
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  ScanLine,
  Loader2,
  X,
  AlertCircle,
  FileUp,
} from 'lucide-react';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadResumes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResumes();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast('Please upload a PDF file.', 'error');
      return;
    }
    setUploading(true);
    try {
      await uploadResume(file);
      toast('Resume uploaded successfully.', 'success');
      await loadResumes();
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteResume(deleteTarget.id);
      setResumes((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      toast('Resume deleted.', 'success');
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Resumes</h1>
          <p className="mt-1 text-sm text-gray-500">Upload and manage your resumes for analysis.</p>
        </div>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`mb-6 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            dragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm font-medium text-gray-600">Uploading resume...</p>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleInputChange}
                className="hidden"
              />
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <FileUp className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                Drag and drop your resume here
              </p>
              <p className="mt-1 text-xs text-gray-400">PDF files only</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <Upload className="h-4 w-4" />
                Browse Files
              </button>
            </>
          )}
        </div>

        {/* Resume list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
              <FileText className="h-7 w-7 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900">No resumes yet</p>
            <p className="mt-1 text-xs text-gray-400">Upload your first resume to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
                  <FileText className="h-6 w-6 text-red-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{resume.fileName}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {resume.uploadDate || resume.uploadedAt
                      ? new Date(resume.uploadDate || resume.uploadedAt || '').toLocaleDateString()
                      : `Resume #${resume.id}`}
                    {resume.fileType ? ` · ${resume.fileType}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/resumes/${resume.id}`}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>
                  <Link
                    href={`/resumes/${resume.id}?action=analyze`}
                    className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                  >
                    <ScanLine className="h-3.5 w-3.5" />
                    Analyze
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(resume)}
                    className="flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete resume"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete resume?</h3>
            <p className="mt-1 text-sm text-gray-500">
              &quot;{deleteTarget.fileName}&quot; will be permanently deleted. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


'use client';

import { useState, useEffect, useCallback } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';

import { getResumeById, deleteResume } from '@/lib/api/resume.api';

import { analyzeResume } from '@/lib/api/analysis.api';

import { getErrorMessage } from '@/lib/api/errors';

import { useToast } from '@/lib/context/toast-context';

import type { Resume } from '@/lib/types';

import {
  FileText,
  ArrowLeft,
  ScanLine,
  Trash2,
  Loader2,
  AlertCircle,
  Sparkles,
  Briefcase,
} from 'lucide-react';

const processingMessages = [
  'Analyzing your resume...',
  'Reviewing skills...',
  'Evaluating ATS compatibility...',
  'Generating recommendations...',
];

export default function ResumeDetailPage() {
  const params = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();

  const id = params.id as string;

  const autoAnalyze =
    searchParams.get('action') === 'analyze';

  const [resume, setResume] =
    useState<Resume | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [showAnalyze, setShowAnalyze] =
    useState(autoAnalyze);

  const [jobDescription, setJobDescription] =
    useState('');

  const [analyzing, setAnalyzing] =
    useState(false);

  const [analysisError, setAnalysisError] =
    useState<string | null>(null);

  const [msgIndex, setMsgIndex] =
    useState(0);

  const [deleteConfirm, setDeleteConfirm] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const { toast } = useToast();

  const loadResume = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getResumeById(id);

      setResume(data);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  useEffect(() => {
    if (autoAnalyze) {
      setShowAnalyze(true);
    }
  }, [autoAnalyze]);

  useEffect(() => {
    if (analyzing) {
      const interval = setInterval(() => {
        setMsgIndex(
          (prev) =>
            (prev + 1) %
            processingMessages.length
        );
      }, 2500);

      return () => clearInterval(interval);
    }

    setMsgIndex(0);
  }, [analyzing]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await analyzeResume({
        resumeId: String(resume?.id ?? id),
        jobDescription: jobDescription.trim(),
      });

      router.push(`/analysis/${result.id}`);
    } catch (err) {
      const message = getErrorMessage(err);

      setAnalysisError(message);

      toast(message, 'error');

      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteResume(id);

      toast('Resume deleted.', 'success');

      router.push('/resumes');
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-gray-300" />

        <p className="mt-4 text-sm font-medium text-gray-900">
          Resume not found
        </p>

        <Link
          href="/resumes"
          className="mt-4 text-sm text-gray-500 underline hover:text-gray-900"
        >
          Back to resumes
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/resumes"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to resumes
        </Link>

        {/* Resume info card */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50">
              <FileText className="h-7 w-7 text-red-500" />
            </div>

            <div className="min-w-0 flex-1">

              <h1 className="truncate text-xl font-bold text-gray-900">
                {resume.fileName}
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                {resume.uploadDate ||
                resume.uploadedAt
                  ? `Uploaded ${new Date(
                      resume.uploadDate ||
                        resume.uploadedAt ||
                        ''
                    ).toLocaleDateString()}`
                  : `Resume #${resume.id}`}

                {resume.fileType
                  ? ` · ${resume.fileType}`
                  : ''}
              </p>

            </div>

          </div>

          <div className="mt-6 flex gap-3">

            <button
              onClick={() => {
                setShowAnalyze(true);
                setAnalysisError(null);
              }}
              disabled={analyzing}
              className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              <ScanLine className="h-4 w-4" />

              Analyze Resume
            </button>

            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />

              Delete
            </button>

          </div>

        </div>

        {/* Analysis error */}

        {analysisError && !analyzing && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-3">

              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="flex-1">

                <p className="text-sm font-semibold text-red-900">
                  Analysis could not be completed
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {analysisError}
                </p>

                <button
                  onClick={() => {
                    setAnalysisError(null);
                    setShowAnalyze(true);
                  }}
                  className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-900"
                >
                  Try again
                </button>

              </div>

            </div>

          </div>
        )}

        {/* Analysis form */}

        {showAnalyze && !analyzing && (

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">

            <div className="mb-4 flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-gray-900" />

              <h2 className="text-lg font-semibold text-gray-900">
                Analyze Resume
              </h2>

            </div>

            <p className="mb-4 text-sm text-gray-500">
              Optionally paste a job description for a more targeted analysis including job match scoring.
            </p>

            <textarea
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
              placeholder="Paste a job description here (optional)..."
              className="mb-4 min-h-[160px] w-full resize-y rounded-xl border border-gray-200 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowAnalyze(false);
                  setJobDescription('');
                  setAnalysisError(null);
                }}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAnalyze}
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <ScanLine className="h-4 w-4" />

                Start Analysis
              </button>

            </div>

          </div>
        )}

        {/* AI processing state */}

        {analyzing && (

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-8">

            <div className="flex flex-col items-center text-center">

              <div className="relative mb-6">

                <div className="h-16 w-16 animate-spin rounded-full border-2 border-gray-100 border-t-gray-900" />

                <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-gray-900" />

              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                {processingMessages[msgIndex]}
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                ParserX AI is reviewing your resume. This may take a moment.
              </p>

            </div>

          </div>
        )}

        {/* Tip for job matching */}

        {!showAnalyze && (

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex items-start gap-3">

              <Briefcase className="h-5 w-5 shrink-0 text-blue-600" />

              <div>

                <p className="text-sm font-medium text-blue-900">
                  Job Matching
                </p>

                <p className="mt-1 text-sm text-blue-700">
                  After analyzing this resume, you can match it against a job description for detailed fit scoring.
                </p>

                <Link
                  href="/job-match"
                  className="mt-2 inline-block text-sm font-medium text-blue-700 underline hover:text-blue-900"
                >
                  Go to Job Matching
                </Link>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Delete confirmation */}

      {deleteConfirm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteConfirm(false)}
          />

          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">

              <AlertCircle className="h-5 w-5 text-red-600" />

            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Delete resume?
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              &quot;{resume.fileName}&quot; will be permanently deleted.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >

                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                Delete

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getAnalysisHistory } from '@/lib/api/analysis.api';
import { getErrorMessage } from '@/lib/api/errors';
import type { AnalysisHistoryItem } from '@/lib/types';
import { History, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

export default function AnalysisHistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAnalysisHistory();
      setAnalyses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analysis History</h1>
          <p className="mt-1 text-sm text-gray-500">View all your past resume analyses.</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
            <p className="mt-3 text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={load}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : analyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
              <History className="h-7 w-7 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900">No analyses yet</p>
            <p className="mt-1 text-xs text-gray-400">Analyze a resume to see results here.</p>
            <Link href="/resumes" className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a) => (
              <Link
                key={a.id}
                href={`/analysis/${a.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                  a.overallScore >= 80 ? 'bg-emerald-50 text-emerald-700'
                  : a.overallScore >= 60 ? 'bg-amber-50 text-amber-700'
                  : 'bg-red-50 text-red-700'
                }`}>
                  {a.overallScore}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{a.resumeFileName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    {a.analyzedAt && <span>{new Date(a.analyzedAt).toLocaleDateString()}</span>}
                    <span>ATS: {a.atsScore}</span>
                    <span>Skill: {a.skillMatch}</span>
                    {a.jobMatch !== null && a.jobMatch !== undefined && <span>Job: {a.jobMatch}</span>}
                    {a.overallStatus && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600">{a.overallStatus}</span>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 transition group-hover:text-gray-500" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

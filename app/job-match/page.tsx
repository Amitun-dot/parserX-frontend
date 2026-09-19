'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getResumes } from '@/lib/api/resume.api';
import { getAnalysisHistory } from '@/lib/api/analysis.api';
import { matchJob } from '@/lib/api/job.api';
import { getErrorMessage } from '@/lib/api/errors';
import { useToast } from '@/lib/context/toast-context';
import type { Resume, AnalysisHistoryItem, JobMatchResult } from '@/lib/types';
import {
  Briefcase,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const processingMessages = [
  'Matching your resume to the job...',
  'Evaluating technical skills...',
  'Assessing experience relevance...',
  'Analyzing keyword alignment...',
];

export default function JobMatchPage() {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisHistoryItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [resumeId, setResumeId] = useState('');
  const [analysisId, setAnalysisId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matching, setMatching] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [msgIndex, setMsgIndex] = useState(0);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [r, a] = await Promise.allSettled([getResumes(), getAnalysisHistory()]);
      if (r.status === 'fulfilled') setResumes(r.value);
      if (a.status === 'fulfilled') setAnalyses(a.value);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (matching) {
      const interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % processingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
    setMsgIndex(0);
  }, [matching]);

  const handleMatch = async () => {
    if (!resumeId || !analysisId || !jobDescription.trim()) {
      toast('Please select a resume, an analysis, and enter a job description.', 'error');
      return;
    }
    setMatching(true);
    setResult(null);
    try {
      const res = await matchJob({
        resumeId,
        analysisId,
        jobDescription: jobDescription.trim(),
      });
      setResult(res);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Job Matching</h1>
          <p className="mt-1 text-sm text-gray-500">
            Match your resume against a job description for detailed AI-powered fit analysis.
          </p>
        </div>

        {loadingData ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <>
            {/* Form */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
              <div className="space-y-5">
                {/* Resume select */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Select Resume</label>
                  {resumes.length === 0 ? (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      No resumes available. <Link href="/resumes" className="underline">Upload one first.</Link>
                    </div>
                  ) : (
                    <select
                      value={resumeId}
                      onChange={(e) => setResumeId(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    >
                      <option value="">Choose a resume...</option>
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>{r.fileName}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Analysis select */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Select Analysis</label>
                  {analyses.length === 0 ? (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      No analyses available. <Link href="/resumes" className="underline">Analyze a resume first.</Link>
                    </div>
                  ) : (
                    <select
                      value={analysisId}
                      onChange={(e) => setAnalysisId(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    >
                      <option value="">Choose an analysis...</option>
                      {analyses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.resumeFileName} — Score: {a.overallScore}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Job description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="min-h-[200px] w-full resize-y rounded-xl border border-gray-200 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleMatch}
                    disabled={matching || !resumeId || !analysisId || !jobDescription.trim()}
                    className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {matching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
                    Match Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Processing state */}
            {matching && (
              <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="h-16 w-16 animate-spin rounded-full border-2 border-gray-100 border-t-gray-900" />
                    <Briefcase className="absolute inset-0 m-auto h-6 w-6 text-gray-900" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{processingMessages[msgIndex]}</h2>
                  <p className="mt-1 text-sm text-gray-400">ParserX AI is comparing your resume to the job requirements.</p>
                </div>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Header */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-gray-900" />
                    <h2 className="text-lg font-semibold text-gray-900">Match Results</h2>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{result.jobTitle}</p>
                </div>

                {/* Overall match ring */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                    <MatchRing score={result.overallMatch} />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">Overall Match Score</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        How well your resume aligns with the job requirements.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MatchScoreCard label="Technical Skills" value={result.technicalSkills} />
                  <MatchScoreCard label="Experience" value={result.experience} />
                  <MatchScoreCard label="Keywords" value={result.keywords} />
                  <MatchScoreCard label="Education" value={result.education} />
                </div>

                {/* Strong matches */}
                {result.strongMatch && result.strongMatch.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <h3 className="text-base font-semibold text-gray-900">Strong Matches</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.strongMatch.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing */}
                {result.missing && result.missing.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-semibold text-gray-900">Missing Requirements</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.missing.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Potential gaps */}
                {result.potentialGaps && result.potentialGaps.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <h3 className="text-base font-semibold text-gray-900">Potential Gaps</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.potentialGaps.map((g, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MatchRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626';

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{score}%</span>
        <span className="text-xs text-gray-400">Match</span>
      </div>
    </div>
  );
}

function MatchScoreCard({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}%</p>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { getToken } from '@/lib/api/axios';
import { getResumes } from '@/lib/api/resume.api';
import { getAnalysisHistory } from '@/lib/api/analysis.api';
import { getJobMatchHistory } from '@/lib/api/job.api';
import type { Resume, AnalysisHistoryItem, JobMatchHistoryItem } from '@/lib/types';
import {
  FileText,
  History,
  Briefcase,
  Upload,
  ScanLine,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, initialized } = useAuth();
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisHistoryItem[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (!getToken()) {
      router.replace('/login');
      return;
    }

    async function loadData() {
      setError(false);
      setLoading(true);
      try {
        const [r, a, j] = await Promise.allSettled([
          getResumes(),
          getAnalysisHistory(),
          getJobMatchHistory(),
        ]);
        if (r.status === 'fulfilled') setResumes(r.value);
        if (a.status === 'fulfilled') setAnalyses(a.value);
        if (j.status === 'fulfilled') setJobMatches(j.value);
        if (r.status === 'rejected' && a.status === 'rejected' && j.status === 'rejected') {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialized, router]);

  const recentResumes = resumes.slice(0, 5);
  const recentAnalyses = analyses.slice(0, 5);
  const recentMatches = jobMatches.slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {greeting()}{user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's an overview of your resume analysis activity.
          </p>
        </div>

        {/* Quick upload CTA */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">Start a new analysis</h2>
              <p className="mt-1 text-sm text-gray-300">
                Upload a resume and get instant AI-powered ATS scoring and recommendations.
              </p>
            </div>
            <Link
              href="/resumes"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              <Upload className="h-4 w-4" />
              Upload Resume
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Resumes"
            value={loading ? '—' : String(resumes.length)}
            icon={<FileText className="h-5 w-5" />}
            href="/resumes"
          />
          <StatCard
            label="Analyses"
            value={loading ? '—' : String(analyses.length)}
            icon={<History className="h-5 w-5" />}
            href="/analysis/history"
          />
          <StatCard
            label="Job Matches"
            value={loading ? '—' : String(jobMatches.length)}
            icon={<Briefcase className="h-5 w-5" />}
            href="/job-match/history"
          />
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              Some data could not be loaded. The backend may not be running.
            </p>
          </div>
        )}

        {/* Recent sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent resumes */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Recent Resumes</h3>
              <Link href="/resumes" className="text-xs font-medium text-gray-500 hover:text-gray-900">
                View all
              </Link>
            </div>
            {loading ? (
              <SkeletonList />
            ) : recentResumes.length === 0 ? (
              <EmptyState message="No resumes uploaded yet." />
            ) : (
              <div className="space-y-2">
                {recentResumes.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                      <FileText className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{r.fileName}</p>
                      <p className="text-xs text-gray-400">
                        {r.uploadDate || r.uploadedAt
                          ? new Date(r.uploadDate || r.uploadedAt || '').toLocaleDateString()
                          : ''}
                      </p>
                    </div>
                    <Link
                      href={`/resumes/${r.id}`}
                      className="text-xs font-medium text-gray-500 hover:text-gray-900"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent analyses */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Recent Analyses</h3>
              <Link href="/analysis/history" className="text-xs font-medium text-gray-500 hover:text-gray-900">
                View all
              </Link>
            </div>
            {loading ? (
              <SkeletonList />
            ) : recentAnalyses.length === 0 ? (
              <EmptyState message="No analyses yet." />
            ) : (
              <div className="space-y-2">
                {recentAnalyses.map((a) => (
                  <Link
                    key={a.id}
                    href={`/analysis/${a.id}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
                  >
                    <ScoreBadge score={a.overallScore} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{a.resumeFileName}</p>
                      <p className="text-xs text-gray-400">
                        {a.analyzedAt ? new Date(a.analyzedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent job matches */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Recent Job Matches</h3>
              <Link href="/job-match/history" className="text-xs font-medium text-gray-500 hover:text-gray-900">
                View all
              </Link>
            </div>
            {loading ? (
              <SkeletonList />
            ) : recentMatches.length === 0 ? (
              <EmptyState message="No job matches yet." />
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {recentMatches.map((m) => (
                  <Link
                    key={m.id}
                    href="/job-match/history"
                    className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 hover:bg-gray-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{m.jobTitle}</p>
                      <p className="text-xs text-gray-400">
                        {m.analyzedAt ? new Date(m.analyzedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{m.overallMatch}%</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:text-gray-500" />
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </Link>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-emerald-50 text-emerald-700'
    : score >= 60 ? 'bg-amber-50 text-amber-700'
    : 'bg-red-50 text-red-700';
  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${color}`}>
      {score}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-100" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-2 w-1/4 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
        <CheckCircle2 className="h-6 w-6 text-gray-300" />
      </div>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAnalysisById } from '@/lib/api/analysis.api';
import { getErrorMessage } from '@/lib/api/errors';
import { useToast } from '@/lib/context/toast-context';
import type { Analysis } from '@/lib/types';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  FileText,
  Sparkles,
  Target,
  Layers,
  BookOpen,
} from 'lucide-react';

export default function AnalysisResultPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAnalysisById(id);
      setAnalysis(data);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-gray-300" />
        <p className="mt-4 text-sm font-medium text-gray-900">Analysis not found</p>
        <Link href="/analysis/history" className="mt-4 text-sm text-gray-500 underline hover:text-gray-900">
          Back to analysis history
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/analysis/history" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to history
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analysis Results</h1>
            <p className="mt-1 text-sm text-gray-500">
              {analysis.resumeFileName}
              {analysis.analyzedAt ? ` · ${new Date(analysis.analyzedAt).toLocaleDateString()}` : ''}
            </p>
          </div>
          {analysis.jobDescription && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Target className="h-3.5 w-3.5" />
              Job-targeted analysis
            </span>
          )}
        </div>

        {/* Overall score */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
            <ScoreRing score={analysis.overallScore} />
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-2 inline-flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(analysis.overallStatus)}`}>
                  {analysis.overallStatus || 'Analysis Complete'}
                </span>
              </div>
              {analysis.overallSummary && (
                <p className="text-sm leading-relaxed text-gray-600">{analysis.overallSummary}</p>
              )}
            </div>
          </div>
        </div>

        {/* Score cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label="ATS Score" value={analysis.atsScore} />
          <ScoreCard label="Skill Match" value={analysis.skillMatch} />
          <ScoreCard label="Job Match" value={analysis.jobMatch} nullable />
          <ScoreCard label="Content Quality" value={analysis.contentQuality} />
        </div>

        {/* ATS Breakdown */}
        {analysis.atsBreakdown && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <Layers className="h-5 w-5 text-gray-900" />
              <h2 className="text-base font-semibold text-gray-900">ATS Breakdown</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ProgressBar label="Keyword Optimization" value={analysis.atsBreakdown.keywordOptimization} />
              <ProgressBar label="Formatting" value={analysis.atsBreakdown.formatting} />
              <ProgressBar label="Section Structure" value={analysis.atsBreakdown.sectionStructure} />
              <ProgressBar label="Readability" value={analysis.atsBreakdown.readability} />
            </div>
          </div>
        )}

        {/* ATS Explanation */}
        {analysis.atsExplanation && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-900" />
                <h2 className="text-base font-semibold text-gray-900">ATS Explanation</h2>
              </div>
              {showExplanation ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </button>
            {showExplanation && (
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{analysis.atsExplanation}</p>
            )}
          </div>
        )}

        {/* Skills & Keywords */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Skills */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gray-900" />
              <h2 className="text-base font-semibold text-gray-900">Detected Skills</h2>
            </div>
            {analysis.skills && analysis.skills.length > 0 ? (
              <div className="space-y-3">
                {analysis.skills.map((skill, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${levelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                    {skill.evidence && (
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{skill.evidence}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No skills detected." />
            )}
          </div>

          {/* Keywords */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-gray-900" />
              <h2 className="text-base font-semibold text-gray-900">Keywords</h2>
            </div>
            {analysis.keywords ? (
              <>
                {analysis.keywords.coverage !== undefined && (
                  <div className="mb-4">
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Coverage</span>
                      <span className="font-semibold text-gray-900">{analysis.keywords.coverage}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-900 transition-all"
                        style={{ width: `${analysis.keywords.coverage}%` }}
                      />
                    </div>
                  </div>
                )}
                {analysis.keywords.matched && analysis.keywords.matched.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-emerald-700">Matched Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.matched.map((kw, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.keywords.missing && analysis.keywords.missing.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs font-medium text-red-700">Missing Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.missing.map((kw, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                          <XCircle className="h-3 w-3" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  analysis.keywords.matched && analysis.keywords.matched.length > 0 && (
                    <p className="text-xs text-gray-400">No missing keywords detected.</p>
                  )
                )}
              </>
            ) : (
              <EmptyState message="No keyword data available." />
            )}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-semibold text-gray-900">Strengths</h2>
            </div>
            {analysis.strengths && analysis.strengths.length > 0 ? (
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No strengths identified." />
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-amber-600" />
              <h2 className="text-base font-semibold text-gray-900">Weaknesses</h2>
            </div>
            {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
              <ul className="space-y-2">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {w}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No weaknesses identified." />
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-gray-900" />
            <h2 className="text-base font-semibold text-gray-900">Recommendations</h2>
          </div>
          {analysis.recommendations && analysis.recommendations.length > 0 ? (
            <div className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      <span className="text-xs font-medium text-gray-400">{rec.category}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{rec.title}</p>
                  {rec.description && (
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{rec.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No recommendations available." />
          )}
        </div>

        {/* Resume Sections */}
        {analysis.resumeSections && analysis.resumeSections.length > 0 && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-900" />
              <h2 className="text-base font-semibold text-gray-900">Resume Sections</h2>
            </div>
            <div className="space-y-4">
              {analysis.resumeSections.map((section, i) => (
                <div key={i}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{section.section}</span>
                    <span className="font-semibold text-gray-900">{section.score}/100</span>
                  </div>
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${scoreBarColor(section.score)}`}
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                  {section.feedback && (
                    <p className="text-xs leading-relaxed text-gray-500">{section.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626';

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

function ScoreCard({ label, value, nullable }: { label: string; value: number | null; nullable?: boolean }) {
  const displayValue = value === null || value === undefined;
  const color = displayValue ? 'text-gray-400' : value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>
        {displayValue ? 'N/A' : `${value}`}
        {!displayValue && <span className="text-sm font-normal text-gray-400">/100</span>}
      </p>
      {displayValue && <p className="mt-1 text-xs text-gray-400">Not analyzed</p>}
    </div>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all ${scoreBarColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
        <CheckCircle2 className="h-5 w-5 text-gray-300" />
      </div>
      <p className="text-xs text-gray-400">{message}</p>
    </div>
  );
}

function statusColor(status: string): string {
  const s = status?.toLowerCase() || '';
  if (s.includes('excellent') || s.includes('great')) return 'bg-emerald-50 text-emerald-700';
  if (s.includes('good')) return 'bg-blue-50 text-blue-700';
  if (s.includes('fair') || s.includes('average')) return 'bg-amber-50 text-amber-700';
  if (s.includes('poor') || s.includes('weak') || s.includes('bad')) return 'bg-red-50 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

function levelColor(level: string): string {
  const l = level?.toLowerCase() || '';
  if (l.includes('strong') || l.includes('expert') || l.includes('advanced')) return 'bg-emerald-50 text-emerald-700';
  if (l.includes('medium') || l.includes('intermediate') || l.includes('moderate')) return 'bg-amber-50 text-amber-700';
  if (l.includes('weak') || l.includes('beginner') || l.includes('basic')) return 'bg-red-50 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

function priorityColor(priority: string): string {
  const p = priority?.toLowerCase() || '';
  if (p.includes('high')) return 'bg-red-50 text-red-700';
  if (p.includes('medium') || p.includes('moderate')) return 'bg-amber-50 text-amber-700';
  if (p.includes('low')) return 'bg-emerald-50 text-emerald-700';
  return 'bg-gray-100 text-gray-700';
}

function scoreBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

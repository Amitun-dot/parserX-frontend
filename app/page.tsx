'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/api/axios';
import {
  ScanLine,
  FileText,
  Target,
  Briefcase,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
              <ScanLine className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">ParserX</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">How it works</a>
            <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-gray-900">Benefits</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            {hasToken ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2 text-gray-600 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileMenu(false)} className="text-sm font-medium text-gray-600">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="text-sm font-medium text-gray-600">How it works</a>
              <a href="#benefits" onClick={() => setMobileMenu(false)} className="text-sm font-medium text-gray-600">Benefits</a>
              <Link href="/login" className="text-sm font-medium text-gray-600">Log in</Link>
              <Link href="/register" className="rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white">Get started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-gray-900" />
              AI-powered resume analysis platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Land more interviews with
              <span className="block text-gray-400">AI-optimized resumes</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
              Upload your resume and get instant ATS scoring, skill gap analysis, keyword optimization,
              and AI-powered job matching — all in one polished platform.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={hasToken ? '/dashboard' : '/register'}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
              >
                Start analyzing free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product introduction */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your resume, decoded by AI
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              ParserX reads your resume the way an ATS does — then tells you exactly what to fix.
            </p>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section id="features" className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need</h2>
            <p className="mt-4 text-lg text-gray-500">Powerful analysis tools in one clean interface.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="ATS Score Analysis"
              description="Get a detailed ATS compatibility score with breakdowns for keyword optimization, formatting, structure, and readability."
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="Keyword Optimization"
              description="See which keywords from the job description you're matching and which ones you're missing — with actionable suggestions."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Skill Detection"
              description="ParserX identifies your skills from your resume and evaluates their strength with supporting evidence."
            />
            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Job Matching"
              description="Paste a job description and get a detailed match score across technical skills, experience, keywords, and education."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Actionable Recommendations"
              description="Receive prioritized, categorized recommendations to improve your resume — not just scores, but specific fixes."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Section-by-Section Feedback"
              description="Every section of your resume gets its own score and feedback so you know exactly where to focus."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How ParserX works</h2>
            <p className="mt-4 text-lg text-gray-500">Three steps to a stronger resume.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              icon={<FileText className="h-6 w-6" />}
              title="Upload your resume"
              description="Drag and drop your PDF resume. It's securely stored and ready for analysis in seconds."
            />
            <StepCard
              number="2"
              icon={<Zap className="h-6 w-6" />}
              title="Run AI analysis"
              description="Optionally paste a job description for targeted scoring. ParserX AI evaluates every aspect of your resume."
            />
            <StepCard
              number="3"
              icon={<TrendingUp className="h-6 w-6" />}
              title="Improve and match"
              description="Follow the recommendations to strengthen your resume, then match it against job descriptions for fit scoring."
            />
          </div>
        </div>
      </section>

      {/* Analysis preview */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">A dashboard you'll actually use</h2>
              <p className="mt-4 text-lg text-gray-500">
                Your analysis results are presented in a clean, organized dashboard with score rings,
                progress bars, and clearly separated sections for strengths, weaknesses, and recommendations.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Overall score with status indicator',
                  'ATS breakdown across four dimensions',
                  'Matched and missing keywords at a glance',
                  'Prioritized recommendations with categories',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-gray-400">Analysis Result</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 shrink-0">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#059669" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray="251.2" strokeDashoffset="37.7" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">85</span>
                    <span className="text-[10px] text-gray-400">/ 100</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <PreviewBar label="ATS Score" value={88} />
                  <PreviewBar label="Skill Match" value={84} />
                  <PreviewBar label="Content Quality" value={82} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job matching preview */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1 rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-900" />
                <span className="text-sm font-semibold text-gray-900">Job Match Result</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Technical Skills', value: 85 },
                  { label: 'Experience', value: 82 },
                  { label: 'Keywords', value: 88 },
                  { label: 'Education', value: 90 },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Job matching, built in</h2>
              <p className="mt-4 text-lg text-gray-500">
                Paste any job description and ParserX will score your resume against it —
                highlighting strong matches, missing requirements, and potential gaps.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Overall match score with category breakdowns',
                  'Strong matches show what you bring to the role',
                  'Missing requirements highlight gaps to address',
                  'Potential gaps flag areas needing more evidence',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Why ParserX</h2>
            <p className="mt-4 text-lg text-gray-500">Built for job seekers who want real results.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              icon={<Zap className="h-5 w-5" />}
              title="Instant analysis"
              description="No waiting. Get your full analysis the moment you upload."
            />
            <BenefitCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="ATS-aware"
              description="Understands how applicant tracking systems read your resume."
            />
            <BenefitCard
              icon={<Target className="h-5 w-5" />}
              title="Targeted scoring"
              description="Paste a job description for role-specific analysis and matching."
            />
            <BenefitCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Always improving"
              description="Track your progress across multiple analyses and iterations."
            />
            <BenefitCard
              icon={<FileText className="h-5 w-5" />}
              title="Section feedback"
              description="Know exactly which sections need work and why."
            />
            <BenefitCard
              icon={<Briefcase className="h-5 w-5" />}
              title="Job fit scoring"
              description="See how well you match before you even apply."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gray-900 px-6 py-16 text-center sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to optimize your resume?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
              Join ParserX and get your first AI-powered resume analysis in minutes.
            </p>
            <Link
              href={hasToken ? '/dashboard' : '/register'}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900">
                <ScanLine className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">ParserX</span>
            </div>
            <p className="text-xs text-gray-400">
              AI-powered resume analysis and job matching.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}

function StepCard({ number, icon, title, description }: { number: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-white">
        {icon}
      </div>
      <div className="mb-2 text-xs font-semibold text-gray-400">STEP {number}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function PreviewBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-gray-900" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

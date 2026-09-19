'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/context/auth-context';

import { getErrorMessage } from '@/lib/api/errors';

import { getToken } from '@/lib/api/axios';

import {
ScanLine,
User,
Mail,
Lock,
Loader2,
AlertCircle,
ArrowRight,
CheckCircle2,
} from 'lucide-react';

export default function RegisterPage() {
const router = useRouter();

const { register, loading, user, initialized } = useAuth();

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

const [errors, setErrors] = useState<{
name?: string;
email?: string;
password?: string;
confirmPassword?: string;
}>({});

const [serverError, setServerError] = useState('');

useEffect(() => {
if (initialized && user && getToken()) {
router.replace('/dashboard');
}
}, [initialized, user, router]);

const validate = () => {
const e: {
name?: string;
email?: string;
password?: string;
confirmPassword?: string;
} = {};


if (!name.trim()) {
  e.name = 'Name is required';
}

if (!email) {
  e.email = 'Email is required';
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  e.email = 'Enter a valid email address';
}

if (!password) {
  e.password = 'Password is required';
} else if (password.length < 6) {
  e.password = 'Password must be at least 6 characters';
}

if (!confirmPassword) {
  e.confirmPassword = 'Please confirm your password';
} else if (password !== confirmPassword) {
  e.confirmPassword = 'Passwords do not match';
}

setErrors(e);

return Object.keys(e).length === 0;


};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();


setServerError('');

if (!validate()) {
  return;
}

try {
  await register({
    name: name.trim(),
    email: email.trim(),
    password,
  });
} catch (err) {
  setServerError(getErrorMessage(err));
}


};

return ( <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8"> <div className="w-full max-w-sm">


    {/* Logo */}
    <div className="mb-8 text-center">
      <Link href="/" className="inline-flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900">
          <ScanLine className="h-5 w-5 text-white" />
        </div>

        <span className="text-xl font-bold tracking-tight text-gray-900">
          ParserX
        </span>
      </Link>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

      <h1 className="text-xl font-semibold text-gray-900">
        Create your account
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Start analyzing your resume with AI.
      </p>

      {serverError && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Name
          </label>

          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: undefined });
              }}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                errors.name
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
              }`}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          {errors.name && (
            <p className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: undefined });
              }}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                errors.email
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
              }`}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: undefined });
              }}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                errors.password
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
              }`}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>

          <div className="relative">
            {confirmPassword &&
            password === confirmPassword &&
            password.length > 0 ? (
              <CheckCircle2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
            ) : (
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            )}

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({
                  ...errors,
                  confirmPassword: undefined,
                });
              }}
              className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
              }`}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-gray-900 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>

    <p className="mt-6 text-center text-xs text-gray-400">
      ParserX — AI-powered resume analysis
    </p>
  </div>
</div>


);
}

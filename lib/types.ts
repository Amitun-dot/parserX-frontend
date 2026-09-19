/* =========================================================
AUTH TYPES
========================================================= */

export interface User {
id: number;
email: string;
name?: string;
createdAt?: string;
}

export interface LoginRequest {
email: string;
password: string;
}

export interface RegisterRequest {
name: string;
email: string;
password: string;
}

export interface RegisterResponse {
id: number;
name: string;
email: string;
}

export interface AuthResponse {
user: User;
token: string;
}

/* =========================================================
RESUME TYPES
========================================================= */

export interface Resume {
id: number;
fileName: string;
fileType?: string;
uploadDate?: string;
uploadedAt?: string;
fileSize?: number;
filePath?: string;
}

export interface ResumeUploadResponse {
id: number;
fileName: string;
fileType?: string;
uploadDate?: string;
uploadedAt?: string;
fileSize?: number;
}

/* =========================================================
ANALYSIS TYPES
========================================================= */

export interface AnalysisRequest {
resumeId: string;
jobDescription: string;
}

export interface ATSBreakdown {
keywordOptimization: number;
formatting: number;
sectionStructure: number;
readability: number;
}

export interface Skill {
name: string;
level: string;
evidence?: string;
}

export interface Keywords {
coverage: number;
matched: string[];
missing: string[];
}

export interface Recommendation {
priority: string;
category: string;
title: string;
description: string;
}

export interface ResumeSection {
section: string;
score: number;
feedback: string;
}

export interface JobMatchData {
[key: string]: unknown;
}

export interface Analysis {
id: number;
resumeId: string;
resumeFileName: string;
analyzedAt: string;

overallScore: number;
overallStatus: string;
overallSummary: string;

atsScore: number;
skillMatch: number;
jobMatch: number | null;
contentQuality: number;

atsBreakdown: ATSBreakdown | null;

skills: Skill[];

keywords: Keywords | null;

recommendations: Recommendation[];

strengths: string[];

weaknesses: string[];

resumeSections: ResumeSection[];

atsExplanation: string;

jobDescription: string;

jobMatchData: JobMatchData | null;
}

export interface AnalysisHistoryItem {
id: number;
resumeId: string;
resumeFileName: string;
analyzedAt: string;

overallScore: number;
atsScore: number;
skillMatch: number;
jobMatch: number | null;

overallStatus: string;
}

/* =========================================================
JOB MATCH TYPES
========================================================= */

export interface JobMatchRequest {
resumeId: string;
analysisId: string;
jobDescription: string;
}

export interface JobMatchResult {
analysisId: string;
jobTitle: string;

overallMatch: number;
technicalSkills: number;
experience: number;
keywords: number;
education: number;

strongMatch: string[];
missing: string[];
potentialGaps: string[];
}

export interface JobMatchHistoryItem {
id: string;
jobTitle: string;
overallMatch: number;
analyzedAt: string;
}

/* =========================================================
API ERROR TYPE
========================================================= */

export interface ApiError {
message: string;
status: number;
isNetworkError: boolean;
isTimeout: boolean;
}

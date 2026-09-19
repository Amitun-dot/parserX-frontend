import api from './axios';
import type { Resume, ResumeUploadResponse } from '@/lib/types';

export async function uploadResume(file: File): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append('resume', file);
  const res = await api.post<ResumeUploadResponse>('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return res.data;
}

export async function getResumes(): Promise<Resume[]> {
  const res = await api.get<Resume[]>('/resumes');
  return res.data;
}

export async function getResumeById(id: number | string): Promise<Resume> {
  const res = await api.get<Resume>(`/resumes/${id}`);
  return res.data;
}

export async function deleteResume(id: number | string): Promise<void> {
  await api.delete(`/resumes/${id}`);
}

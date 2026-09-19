import api from './axios';
import type {
  JobMatchRequest,
  JobMatchResult,
  JobMatchHistoryItem,
} from '@/lib/types';

export async function matchJob(data: JobMatchRequest): Promise<JobMatchResult> {
  const res = await api.post<JobMatchResult>('/job/match', data, {
    timeout: 180000,
  });
  return res.data;
}

export async function getJobMatchHistory(): Promise<JobMatchHistoryItem[]> {
  const res = await api.get<JobMatchHistoryItem[]>('/job/matches');
  return res.data;
}

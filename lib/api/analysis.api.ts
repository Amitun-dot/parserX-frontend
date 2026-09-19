import api from './axios';

import type {
Analysis,
AnalysisRequest,
AnalysisHistoryItem,
} from '@/lib/types';

export async function analyzeResume(
data: AnalysisRequest
): Promise<Analysis> {
const res = await api.post<Analysis>(
'/analysis/analyze',
data,
{
timeout: 300000,
}
);

return res.data;
}

export async function getAnalysisById(
id: number | string
): Promise<Analysis> {
const res = await api.get<Analysis>(
`/analysis/${id}`
);

return res.data;
}

export async function getAnalysisHistory(): Promise<
AnalysisHistoryItem[]

> {
const res = await api.get<AnalysisHistoryItem[]>(
'/analysis/history'
);

return res.data;
}

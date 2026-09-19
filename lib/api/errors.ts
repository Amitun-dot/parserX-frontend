import type { AxiosError } from 'axios';

import type { ApiError } from '@/lib/types';

type ServerErrorResponse = {
message?: string;
error?: string;
};

export function parseApiError(error: unknown): ApiError {
const axiosError =
error as AxiosError<ServerErrorResponse>;

if (axiosError.isAxiosError) {


// Timeout
if (
  axiosError.code === 'ECONNABORTED' ||
  axiosError.code === 'ETIMEDOUT'
) {
  return {
    message:
      'The request is taking too long. Please try again.',
    status: 0,
    isNetworkError: false,
    isTimeout: true,
  };
}

// No response — network error
if (!axiosError.response) {
  return {
    message:
      'Unable to connect to ParserX. Please check your connection and try again.',
    status: 0,
    isNetworkError: true,
    isTimeout: false,
  };
}

const status = axiosError.response.status;

const serverMsg =
  axiosError.response.data?.message ||
  axiosError.response.data?.error;

// Use server message when it is clean and human-readable
if (
  serverMsg &&
  typeof serverMsg === 'string' &&
  serverMsg.length < 300
) {
  return {
    message: serverMsg,
    status,
    isNetworkError: false,
    isTimeout: false,
  };
}

// Fallback messages by HTTP status
const fallbacks: Record<number, string> = {
  400:
    'Please check your input and try again.',

  401:
    'Your session has expired. Please log in again.',

  403:
    "You don't have permission to perform this action.",

  404:
    'The requested resource was not found.',

  409:
    'This action conflicts with existing data.',

  413:
    'Your resume file is too large. Please upload a smaller file.',

  422:
    'Please check your input and try again.',

  429:
    'Too many requests. Please wait a moment and try again.',

  500:
    'Something went wrong on the server. Please try again.',

  502:
    'The service is temporarily unavailable. Please try again shortly.',

  503:
    'The AI service is temporarily unavailable. Please try again in a few minutes.',
};

return {
  message:
    fallbacks[status] ||
    'An unexpected error occurred. Please try again.',
  status,
  isNetworkError: false,
  isTimeout: false,
};


}

return {
message:
'An unexpected error occurred. Please try again.',
status: 0,
isNetworkError: false,
isTimeout: false,
};
}

export function getErrorMessage(
error: unknown
): string {
return parseApiError(error).message;
}

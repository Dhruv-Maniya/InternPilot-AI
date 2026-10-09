import {
  AuthUser,
  StudentProfile,
  Internship,
  MatchedInternship,
  SkillGapResponse,
  LearningResourceResponse,
  ResumeResponse,
  ResumeAnalysisResponse,
  InterviewQuestionResponse,
  InterviewEvaluationResponse,
  AptitudeQuestion,
  AptitudeTestResponse,
  AptitudeAnalysisResponse,
  WatchlistItem,
  WatchlistResponse,
  ApplicationItem,
  ApplicationResponse,
  NotificationResponse,
} from '@/types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

function formatEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('internpilot_access_token');
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('internpilot_access_token', token);
  } else {
    localStorage.removeItem('internpilot_access_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${formatEndpoint(endpoint)}`;
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      let errorData: unknown = null;

      try {
        errorData = await response.json();
        if (typeof errorData === 'object' && errorData !== null && 'detail' in errorData) {
          const detail = (errorData as { detail: unknown }).detail;
          if (typeof detail === 'string') {
            errorMessage = detail;
          } else if (Array.isArray(detail)) {
            errorMessage = detail
              .map((d: { msg?: string } | unknown) =>
                typeof d === 'object' && d !== null && 'msg' in d
                  ? String((d as { msg: unknown }).msg)
                  : JSON.stringify(d)
              )
              .join(', ');
          }
        }
      } catch {
        // If not JSON
      }

      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          // Token is invalid/expired
          window.dispatchEvent(new CustomEvent('internpilot:unauthorized'));
        }
        throw new ApiError('Your session has expired. Please sign in again.', 401, errorData);
      }

      if (response.status === 503) {
        throw new ApiError('AI service is temporarily unavailable. Please try again.', 503, errorData);
      }

      if (response.status === 404) {
        throw new ApiError(errorMessage || 'The requested resource was not found.', 404, errorData);
      }

      if (response.status >= 500) {
        throw new ApiError(errorMessage || 'Internal server error. Please try again later.', response.status, errorData);
      }

      throw new ApiError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new ApiError(
      `Unable to connect to backend server: ${message}. Please verify FastAPI is running at ${API_BASE_URL}`,
      0,
      err
    );
  }
}

// ----------------------------------------------------------------------
// Dedicated Service APIs
// ----------------------------------------------------------------------

export const authApi = {
  getMe: async (): Promise<AuthUser> => {
    return request<AuthUser>('/api/auth/me');
  },
};

export const internshipsApi = {
  search: async (query: string, location: string = 'India'): Promise<{ count: number; results: Internship[] }> => {
    const params = new URLSearchParams({ query, location });
    return request<{ count: number; results: Internship[] }>(`/api/internships/?${params.toString()}`);
  },

  match: async (profile: StudentProfile): Promise<{ student: string; count: number; results: MatchedInternship[] }> => {
    return request<{ student: string; count: number; results: MatchedInternship[] }>('/api/internships/match', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },
};

export const learningApi = {
  getSkillGap: async (
    studentSkills: string[],
    requiredSkills: string[],
    preferredSkills: string[] = []
  ): Promise<SkillGapResponse> => {
    return request<SkillGapResponse>('/api/learning/skill-gap', {
      method: 'POST',
      body: JSON.stringify({
        student_skills: studentSkills,
        required_skills: requiredSkills,
        preferred_skills: preferredSkills,
      }),
    });
  },

  getResources: async (skills: string[]): Promise<LearningResourceResponse> => {
    return request<LearningResourceResponse>('/api/learning/resources', {
      method: 'POST',
      body: JSON.stringify({ skills }),
    });
  },
};

export const resumeApi = {
  extractSkills: async (resumeText: string): Promise<ResumeResponse> => {
    return request<ResumeResponse>('/api/resume/skills', {
      method: 'POST',
      body: JSON.stringify({ resume_text: resumeText }),
    });
  },

  analyze: async (resumeText: string): Promise<ResumeAnalysisResponse> => {
    return request<ResumeAnalysisResponse>('/api/resume/analyze', {
      method: 'POST',
      body: JSON.stringify({ resume_text: resumeText }),
    });
  },
};

export const interviewApi = {
  getQuestions: async (role: string, interviewType: string): Promise<InterviewQuestionResponse> => {
    return request<InterviewQuestionResponse>('/api/interview/questions', {
      method: 'POST',
      body: JSON.stringify({ role, interview_type: interviewType }),
    });
  },

  evaluate: async (
    question: string,
    answer: string,
    role: string = 'Data Analyst',
    interviewType: string = 'Technical'
  ): Promise<InterviewEvaluationResponse> => {
    return request<InterviewEvaluationResponse>('/api/interview/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        question,
        answer,
        role,
        interview_type: interviewType,
      }),
    });
  },
};

export const aptitudeApi = {
  getQuestions: async (category: string, difficulty: string): Promise<AptitudeQuestion[]> => {
    return request<AptitudeQuestion[]>('/api/aptitude/questions', {
      method: 'POST',
      body: JSON.stringify({ category, difficulty }),
    });
  },

  submit: async (
    category: string,
    difficulty: string,
    answers: Record<number, string>
  ): Promise<AptitudeTestResponse> => {
    return request<AptitudeTestResponse>('/api/aptitude/submit', {
      method: 'POST',
      body: JSON.stringify({ category, difficulty, answers }),
    });
  },

  analyze: async (data: {
    total_questions: number;
    correct_answers: number;
    score: number;
    accuracy: number;
    weak_area?: string | null;
    category?: string | null;
  }): Promise<AptitudeAnalysisResponse> => {
    return request<AptitudeAnalysisResponse>('/api/aptitude/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const watchlistApi = {
  getAll: async (): Promise<WatchlistResponse> => {
    return request<WatchlistResponse>('/api/watchlist');
  },

  add: async (item: {
    internship_id: string;
    title: string;
    company: string;
    location: string;
    application_url: string;
    deadline?: string | null;
  }): Promise<WatchlistItem> => {
    return request<WatchlistItem>('/api/watchlist', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  remove: async (internshipId: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/api/watchlist/${encodeURIComponent(internshipId)}`, {
      method: 'DELETE',
    });
  },
};

export const applicationsApi = {
  getAll: async (): Promise<ApplicationResponse> => {
    return request<ApplicationResponse>('/api/applications');
  },

  create: async (item: {
    application_id: string;
    internship_id: string;
    title: string;
    company: string;
    application_url: string;
    status: string;
  }): Promise<ApplicationItem> => {
    return request<ApplicationItem>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  updateStatus: async (applicationId: string, status: string): Promise<ApplicationItem> => {
    return request<ApplicationItem>(`/api/applications/${encodeURIComponent(applicationId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (applicationId: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/api/applications/${encodeURIComponent(applicationId)}`, {
      method: 'DELETE',
    });
  },
};

export const notificationsApi = {
  getDeadlines: async (alertDays: number = 7): Promise<NotificationResponse> => {
    return request<NotificationResponse>(`/api/notifications/deadlines?alert_days=${alertDays}`);
  },
};

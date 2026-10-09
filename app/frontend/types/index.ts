// TypeScript models aligned with FastAPI / OpenAPI specs

export interface AuthUser {
  id: string;
  email: string;
}

export interface StudentProfile {
  name: string;
  education: string;
  skills: string[];
  interests: string[];
  preferred_location: string;
}

export interface Internship {
  title: string;
  company: string;
  location?: string | null;
  description?: string | null;
  source?: string | null;
  url?: string | null;
}

export interface MatchedInternship {
  title: string;
  company: string;
  location?: string | null;
  description?: string | null;
  source?: string | null;
  url?: string | null;
  required_skills: string[];
  preferred_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  skills_to_learn: string[];
  match_percentage: number | null;
  requirements_found: boolean;
  eligibility: 'Likely Entry-Level' | 'Review Requirements' | 'Experience Required' | string;
  recommendation_priority: number;
}

export interface LearningRecommendation {
  skill: string;
  recommendation: string;
  level: string;
}

export interface SkillGapResponse {
  matched_required_skills: string[];
  missing_required_skills: string[];
  matched_preferred_skills: string[];
  missing_preferred_skills: string[];
  skills_to_learn: string[];
  recommendations: LearningRecommendation[];
}

export interface LearningResource {
  skill: string;
  title: string;
  resource_type: string;
  url: string;
  description: string;
}

export interface LearningResourceResponse {
  resources: LearningResource[];
}

export interface ResumeResponse {
  resume_text: string;
  skills: string[];
}

export interface ResumeAnalysisResponse {
  resume_text: string;
  skills: string[];
  skill_count: number;
  suggestions: string[];
}

export interface InterviewQuestion {
  id: number;
  role: string;
  interview_type: string;
  question: string;
}

export interface InterviewQuestionResponse {
  role: string;
  interview_type: string;
  questions: InterviewQuestion[];
}

export interface InterviewEvaluationResponse {
  question: string;
  answer: string;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  communication: string;
  relevance: string;
  suggested_improvement: string;
}

export interface AptitudeQuestion {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface AptitudeResult {
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  score: number;
  accuracy: number;
  weak_area: string | null;
}

export interface AptitudeTestResponse {
  result: AptitudeResult;
}

export interface AptitudeAnalysisResponse {
  strengths: string[];
  weak_areas: string[];
  recommendations: string[];
  feedback: string;
}

export interface WatchlistItem {
  internship_id: string;
  title: string;
  company: string;
  location: string;
  application_url: string;
  deadline: string | null;
}

export interface WatchlistResponse {
  items: WatchlistItem[];
}

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';

export interface ApplicationItem {
  application_id: string;
  internship_id: string;
  title: string;
  company: string;
  application_url: string;
  status: ApplicationStatus | string;
}

export interface ApplicationResponse {
  applications: ApplicationItem[];
}

export interface DeadlineNotification {
  internship_id: string;
  title: string;
  company: string;
  deadline: string;
  days_remaining: number;
  message: string;
}

export interface NotificationResponse {
  notifications: DeadlineNotification[];
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error' | 'unavailable';

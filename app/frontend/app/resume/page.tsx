'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  ArrowRight,
  Upload,
  UserCheck,
  Lightbulb,
  Layers,
  Copy
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { resumeApi } from '@/lib/api';
import { ResumeAnalysisResponse } from '@/types';

const SAMPLE_RESUMES = {
  data_analyst: `Alex Rivera
Email: alex.rivera@example.com | GitHub: github.com/alexrivera

PROFESSIONAL SUMMARY
Motivated Computer Science undergraduate specializing in Data Analytics and Business Intelligence. Experienced in building statistical models, automated ETL workflows, and interactive dashboards.

TECHNICAL SKILLS
Languages: Python, SQL, C++
Libraries & Frameworks: Pandas, NumPy, Scikit-learn, FastAPI
Data Visualization & BI: Tableau, Power BI, Excel
Databases: MySQL, PostgreSQL, MongoDB

ACADEMIC PROJECTS
E-Commerce Churn Prediction & Retention Analysis
• Analyzed 50,000+ customer records using Python and Pandas to uncover customer churn behavior.
• Built regression and classification models in Scikit-learn with 86% accuracy.
• Designed executive dashboards in Power BI and automated monthly SQL reporting.

Supply Chain Inventory Optimization
• Developed SQL queries to optimize replenishment cycles across 12 product categories.
• Automated data extraction using Python scripts, reducing manual report latency by 40%.`,

  ml_engineer: `Samantha Rao
Email: samantha.rao@example.com | Portfolio: samantharao.dev

EDUCATION
B.Tech in Artificial Intelligence & Data Science

TECHNICAL SKILLS
Languages: Python, Java, C++
Machine Learning: Machine Learning, Deep Learning, NLP, Scikit-learn, NumPy, Pandas
Backend & Deployment: FastAPI, Docker, Git, GitHub
Databases: PostgreSQL, Supabase

EXPERIENCE & PROJECTS
Medical Image Classifier
• Trained deep learning convolutional neural networks on 10,000+ radiological scans.
• Evaluated models with precision, recall, and ROC-AUC metrics.

NLP Customer Sentiment Pipeline
• Built real-time sentiment analysis using Python, NLP tokenization, and FastAPI microservice.`,
};

export default function ResumePage() {
  const { profile, updateProfile, showToast } = useAuth();

  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES.data_analyst);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResponse | null>(null);

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      showToast('Please provide resume text to analyze.', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await resumeApi.analyze(resumeText);
      setAnalysis(result);
      showToast(`Detected ${result.skill_count} technical skills from resume!`, 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySkillsToProfile = () => {
    if (!analysis || !analysis.skills) return;

    const combined = Array.from(
      new Set([...profile.skills, ...analysis.skills])
    );

    updateProfile({ skills: combined });

    showToast(
      `Updated student profile with ${analysis.skills.length} skills!`,
      'success'
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">AI Resume Intelligence</span>
            <span className="badge badge-neutral">POST /api/resume/analyze</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Resume Skill Extraction & Analysis
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Extract recognized technical skills, audit keyword density, and generate structural improvement suggestions.
          </p>
        </div>

        <button
          onClick={handleAnalyzeResume}
          disabled={loading}
          className="btn btn-primary btn-lg"
        >
          <Sparkles size={16} className={loading ? 'loading-skeleton' : ''} />
          <span>Analyze Resume Text</span>
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <button className="btn btn-sm btn-secondary" onClick={handleAnalyzeResume}>
            Retry
          </button>
        </div>
      )}

      {/* Main Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Resume Input & Sample Selector */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Resume Content</div>
              <div className="card-subtitle">Paste plain text or select a demo candidate profile</div>
            </div>

            {/* Quick Demo Samples */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setResumeText(SAMPLE_RESUMES.data_analyst)}
                title="Load Data Analyst sample"
              >
                Sample: Analyst
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setResumeText(SAMPLE_RESUMES.ml_engineer)}
                title="Load ML Engineer sample"
              >
                Sample: ML
              </button>
            </div>
          </div>

          <textarea
            className="textarea"
            rows={18}
            placeholder="Paste your complete resume text here (Summary, Education, Technical Skills, Projects, Experience)..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}
          />

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {resumeText.split(/\s+/).filter(Boolean).length} words
            </span>

            <button
              onClick={handleAnalyzeResume}
              disabled={loading}
              className="btn btn-primary"
            >
              <Sparkles size={15} />
              <span>{loading ? 'Analyzing...' : 'Run Skill Extraction'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Analysis Results & Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading ? (
            <div className="card loading-skeleton" style={{ height: '360px' }} />
          ) : !analysis ? (
            <div className="card empty-state">
              <FileText className="empty-icon" />
              <div className="empty-title">No Resume Analyzed Yet</div>
              <p className="empty-desc">
                Paste your resume text on the left or select a sample profile, then click "Analyze Resume Text".
              </p>
              <button className="btn btn-primary" onClick={handleAnalyzeResume}>
                Run Initial Analysis
              </button>
            </div>
          ) : (
            <>
              {/* Skill Count & Profile Sync Card */}
              <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '4px' }}>Extracted Skills</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
                      {analysis.skill_count} Technical Skills Detected
                    </div>
                  </div>

                  <button
                    onClick={handleApplySkillsToProfile}
                    className="btn btn-sm btn-outline"
                    title="Add detected skills to your student profile"
                  >
                    <UserCheck size={14} />
                    <span>Sync to Profile</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '14px 0' }}>
                  {analysis.skills.map((skill, idx) => (
                    <span key={idx} className="badge badge-success" style={{ padding: '4px 10px', fontSize: '0.8125rem' }}>
                      ✓ {skill}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  * Skills extracted via exact word-boundary pattern matching configured on the backend.
                </div>
              </div>

              {/* Suggestions Card */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <Lightbulb size={18} style={{ color: '#f59e0b' }} />
                    <span>Resume Improvement Suggestions</span>
                  </div>
                  <span className="badge badge-warning">{analysis.suggestions.length} Actions</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {analysis.suggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.8125rem',
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ color: '#2563eb', fontWeight: 700 }}>•</span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Step: Match internships with newly extracted skills */}
              <div className="card" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1e3a8a' }}>
                      Next: Re-match against live internships
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#1e40af' }}>
                      See how your profile alignment score changes with these skills.
                    </div>
                  </div>

                  <Link href="/internships" className="btn btn-primary">
                    <span>Explore Matches</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

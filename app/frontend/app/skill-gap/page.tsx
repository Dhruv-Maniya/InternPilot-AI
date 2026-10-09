'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCw,
  Plus,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { learningApi } from '@/lib/api';
import { SkillGapResponse } from '@/types';

export default function SkillGapPage() {
  const { profile, activeInternship, updateProfile, showToast } = useAuth();

  const [studentSkills, setStudentSkills] = useState<string[]>(profile.skills);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(
    activeInternship?.required_skills?.length ? activeInternship.required_skills : ['Python', 'SQL', 'Pandas', 'Data Analytics']
  );
  const [preferredSkills, setPreferredSkills] = useState<string[]>(
    activeInternship?.preferred_skills?.length ? activeInternship.preferred_skills : ['Power BI', 'Machine Learning']
  );

  const [newSkillInput, setNewSkillInput] = useState('');
  const [newReqInput, setNewReqInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SkillGapResponse | null>(null);

  const runSkillGapAnalysis = async (sSkills = studentSkills, rSkills = requiredSkills, pSkills = preferredSkills) => {
    if (sSkills.length === 0 || rSkills.length === 0) {
      showToast('Please provide at least 1 student skill and 1 required skill.', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await learningApi.getSkillGap(sSkills, rSkills, pSkills);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze skill gap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeInternship) {
      if (activeInternship.required_skills?.length) {
        setRequiredSkills(activeInternship.required_skills);
      }
      if (activeInternship.preferred_skills?.length) {
        setPreferredSkills(activeInternship.preferred_skills);
      }
    }
    setStudentSkills(profile.skills);
    runSkillGapAnalysis(
      profile.skills,
      activeInternship?.required_skills?.length ? activeInternship.required_skills : ['Python', 'SQL', 'Pandas', 'Data Analytics'],
      activeInternship?.preferred_skills?.length ? activeInternship.preferred_skills : ['Power BI', 'Machine Learning']
    );
  }, [activeInternship, profile.skills]);

  const addStudentSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed || studentSkills.includes(trimmed)) return;
    const next = [...studentSkills, trimmed];
    setStudentSkills(next);
    setNewSkillInput('');
    updateProfile({ skills: next });
    runSkillGapAnalysis(next, requiredSkills, preferredSkills);
  };

  const removeStudentSkill = (skillToRemove: string) => {
    const next = studentSkills.filter((s) => s !== skillToRemove);
    setStudentSkills(next);
    updateProfile({ skills: next });
    runSkillGapAnalysis(next, requiredSkills, preferredSkills);
  };

  const addRequiredSkill = () => {
    const trimmed = newReqInput.trim();
    if (!trimmed || requiredSkills.includes(trimmed)) return;
    const next = [...requiredSkills, trimmed];
    setRequiredSkills(next);
    setNewReqInput('');
    runSkillGapAnalysis(studentSkills, next, preferredSkills);
  };

  const removeRequiredSkill = (skillToRemove: string) => {
    const next = requiredSkills.filter((s) => s !== skillToRemove);
    setRequiredSkills(next);
    runSkillGapAnalysis(studentSkills, next, preferredSkills);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">Preparation Module</span>
            {activeInternship && (
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Target size={11} /> Context: {activeInternship.title}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Skill Gap Analysis
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Evaluated by FastAPI backend comparing student capabilities directly against target internship requirements.
          </p>
        </div>

        <button
          onClick={() => runSkillGapAnalysis()}
          disabled={loading}
          className="btn btn-primary"
        >
          <RotateCw size={15} className={loading ? 'loading-skeleton' : ''} />
          <span>Re-Analyze Gap</span>
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <button className="btn btn-sm btn-secondary" onClick={() => runSkillGapAnalysis()}>
            Retry
          </button>
        </div>
      )}

      {/* Two Column Configuration: Student Skills vs Target Role Requirements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Student Skills Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Your Technical Skills</div>
              <div className="card-subtitle">Skills you currently know (from your student profile)</div>
            </div>
            <span className="badge badge-primary">{studentSkills.length} Skills</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px', minHeight: '40px' }}>
            {studentSkills.map((s, idx) => (
              <span key={idx} className="badge badge-primary" style={{ padding: '4px 10px', fontSize: '0.8125rem' }}>
                {s}
                <button
                  onClick={() => removeStudentSkill(s)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '4px', color: '#2563eb' }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="input"
              placeholder="Add skill (e.g. React, Docker)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStudentSkill())}
            />
            <button className="btn btn-secondary" onClick={addStudentSkill}>
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Required Skills Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Target Role Requirements</div>
              <div className="card-subtitle">
                {activeInternship ? `Requirements for ${activeInternship.company}` : 'Standard internship qualifications'}
              </div>
            </div>
            <span className="badge badge-warning">{requiredSkills.length} Required</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px', minHeight: '40px' }}>
            {requiredSkills.map((s, idx) => (
              <span key={idx} className="badge badge-warning" style={{ padding: '4px 10px', fontSize: '0.8125rem' }}>
                {s}
                <button
                  onClick={() => removeRequiredSkill(s)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '4px', color: '#92400e' }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="input"
              placeholder="Add required skill (e.g. Tableau)..."
              value={newReqInput}
              onChange={(e) => setNewReqInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequiredSkill())}
            />
            <button className="btn btn-secondary" onClick={addRequiredSkill}>
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* BACKEND ANALYSIS RESULTS */}
      {loading ? (
        <div className="card loading-skeleton" style={{ height: '240px' }} />
      ) : analysisResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Alignment Overview Summary Banner */}
          <div
            className="card"
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderLeft: `5px solid ${analysisResult.missing_required_skills.length === 0 ? '#10b981' : '#f59e0b'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
                  Backend Skill Gap Evaluation
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  {analysisResult.missing_required_skills.length === 0
                    ? 'Complete Alignment with Required Skills!'
                    : `${analysisResult.skills_to_learn.length} skill(s) need attention for target qualification.`}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
                  {analysisResult.matched_required_skills.length} of {analysisResult.matched_required_skills.length + analysisResult.missing_required_skills.length} mandatory qualifications already verified.
                </p>
              </div>

              {analysisResult.skills_to_learn.length > 0 && (
                <Link
                  href="/learning"
                  className="btn btn-primary btn-lg"
                >
                  <BookOpen size={18} />
                  <span>View Curated Resources</span>
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>

            {/* Matched vs Missing Skills Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {/* Matched Skills */}
              <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#15803d', fontSize: '0.875rem', marginBottom: '8px' }}>
                  <CheckCircle2 size={16} /> Matched Skills ({analysisResult.matched_required_skills.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {analysisResult.matched_required_skills.length > 0 ? (
                    analysisResult.matched_required_skills.map((s, idx) => (
                      <span key={idx} className="badge badge-success" style={{ padding: '4px 8px', fontSize: '0.8125rem' }}>
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>None matched</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#b45309', fontSize: '0.875rem', marginBottom: '8px' }}>
                  <AlertTriangle size={16} /> Skills to Improve ({analysisResult.skills_to_learn.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {analysisResult.skills_to_learn.length > 0 ? (
                    analysisResult.skills_to_learn.map((s, idx) => (
                      <span key={idx} className="badge badge-warning" style={{ padding: '4px 8px', fontSize: '0.8125rem' }}>
                        ⚠ {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8125rem', color: '#15803d' }}>No missing skills!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Learning Recommendations Section */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={18} style={{ color: '#2563eb' }} />
                <span>Backend Learning Recommendations</span>
              </div>
              <span className="badge badge-neutral">{analysisResult.recommendations.length} Steps</span>
            </div>

            {analysisResult.recommendations.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#15803d', fontWeight: 500 }}>
                ✓ No extra learning steps needed for the current requirement set.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysisResult.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>
                          Learn {rec.skill}
                        </span>
                        <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>
                          {rec.level}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.4 }}>
                        {rec.recommendation}
                      </p>
                    </div>

                    <Link
                      href="/learning"
                      className="btn btn-sm btn-secondary"
                    >
                      <BookOpen size={14} />
                      <span>Find Courses</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  Target,
  Send,
  HelpCircle,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { interviewApi } from '@/lib/api';
import { InterviewQuestion, InterviewEvaluationResponse } from '@/types';

export default function InterviewPage() {
  const { activeInternship, showToast } = useAuth();

  // Role detection from active context
  const defaultRole = activeInternship?.title?.toLowerCase().includes('scientist')
    ? 'Data Scientist'
    : 'Data Analyst';

  const [role, setRole] = useState(defaultRole);
  const [interviewType, setInterviewType] = useState('Technical');

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  const [evaluation, setEvaluation] = useState<InterviewEvaluationResponse | null>(null);

  const fetchQuestions = async (targetRole = role, targetType = interviewType) => {
    setLoadingQuestions(true);
    setError(null);
    setEvaluation(null);
    setStudentAnswer('');
    try {
      const res = await interviewApi.getQuestions(targetRole, targetType);
      if (res && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setCurrentIdx(0);
      } else {
        setQuestions([]);
        setError('No interview questions found for the selected criteria.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load interview questions.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    if (activeInternship) {
      const detected = activeInternship.title.toLowerCase().includes('scientist')
        ? 'Data Scientist'
        : 'Data Analyst';
      setRole(detected);
      fetchQuestions(detected, interviewType);
    } else {
      fetchQuestions(role, interviewType);
    }
  }, [activeInternship]);

  const handleEvaluateAnswer = async () => {
    if (!studentAnswer.trim()) {
      showToast('Please type your answer before submitting.', 'error');
      return;
    }

    const currQ = questions[currentIdx];
    if (!currQ) return;

    setEvaluating(true);
    setEvalError(null);
    try {
      const res = await interviewApi.evaluate(currQ.question, studentAnswer, role, interviewType);
      setEvaluation(res);
      showToast('Interview response evaluated successfully!', 'success');
    } catch (err: any) {
      if (err.status === 503) {
        setEvalError('Interview AI is temporarily unavailable. Please try again.');
      } else {
        setEvalError(err.message || 'Failed to evaluate interview answer.');
      }
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">AI Mock Interview</span>
            {activeInternship && (
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Target size={11} /> Tailored for: {activeInternship.title}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Mock Interview Practice & AI Feedback
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Real technical and HR questions evaluated for relevance, depth, and communication delivery.
          </p>
        </div>

        {/* Role & Interview Type Selectors */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="input"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              fetchQuestions(e.target.value, interviewType);
            }}
            style={{ width: '160px' }}
          >
            <option value="Data Analyst">Data Analyst</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>

          <select
            className="input"
            value={interviewType}
            onChange={(e) => {
              setInterviewType(e.target.value);
              fetchQuestions(role, e.target.value);
            }}
            style={{ width: '140px' }}
          >
            <option value="Technical">Technical</option>
            <option value="HR">HR / Behavioral</option>
          </select>

          <button
            onClick={() => fetchQuestions()}
            disabled={loadingQuestions}
            className="btn btn-secondary"
            title="Reload questions"
          >
            <RotateCw size={15} />
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <button className="btn btn-sm btn-secondary" onClick={() => fetchQuestions()}>
            Retry
          </button>
        </div>
      )}

      {loadingQuestions ? (
        <div className="card loading-skeleton" style={{ height: '300px' }} />
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <MessageSquare className="empty-icon" />
          <div className="empty-title">No Interview Questions Available</div>
          <p className="empty-desc">Select Data Analyst or Data Scientist to practice curated questions.</p>
          <button className="btn btn-primary" onClick={() => fetchQuestions('Data Analyst', 'Technical')}>
            Load Data Analyst Questions
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Left Column: Question & Student Answer Box */}
          <div className="card">
            <div className="card-header">
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '4px' }}>
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  {role} • {interviewType} Round
                </div>
              </div>

              {/* Question Navigation */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => {
                    setCurrentIdx((prev) => Math.max(0, prev - 1));
                    setEvaluation(null);
                    setStudentAnswer('');
                  }}
                  disabled={currentIdx === 0}
                  className="btn btn-sm btn-secondary"
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1));
                    setEvaluation(null);
                    setStudentAnswer('');
                  }}
                  disabled={currentIdx === questions.length - 1}
                  className="btn btn-sm btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#2563eb', marginBottom: '4px' }}>
                Interviewer Prompt
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>
                "{questions[currentIdx].question}"
              </h3>
            </div>

            {/* Answer Input */}
            <div style={{ marginBottom: '18px' }}>
              <label className="label">Your Response (Simulate live spoken or written interview)</label>
              <textarea
                className="textarea"
                rows={7}
                placeholder="Type your response here... (e.g. explain key concepts, difference, real-world examples, or STAR method)..."
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                <span>{studentAnswer.split(/\s+/).filter(Boolean).length} words</span>
                <span>Recommended: 30+ words with examples</span>
              </div>
            </div>

            {/* Evaluation Button */}
            <button
              onClick={handleEvaluateAnswer}
              disabled={evaluating || !studentAnswer.trim()}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <Sparkles size={16} />
              <span>{evaluating ? 'Analyzing Response with AI...' : 'Submit Answer for AI Evaluation'}</span>
            </button>
          </div>

          {/* Right Column: AI Feedback & Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {evaluating ? (
              <div className="card loading-skeleton" style={{ height: '360px' }} />
            ) : evalError ? (
              <div className="card" style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#991b1b', fontWeight: 600, marginBottom: '8px' }}>
                  <AlertTriangle size={20} />
                  <span>503 Service Notice</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#7f1d1d', marginBottom: '16px' }}>
                  {evalError}
                </p>
                <button className="btn btn-primary" onClick={handleEvaluateAnswer}>
                  <RefreshCw size={14} />
                  <span>Try Again</span>
                </button>
              </div>
            ) : !evaluation ? (
              <div className="card empty-state">
                <Sparkles className="empty-icon" />
                <div className="empty-title">Awaiting Your Answer</div>
                <p className="empty-desc">
                  Write your answer on the left and submit it to receive structured feedback, strengths, and improvement suggestions.
                </p>
              </div>
            ) : (
              <div className="card" style={{ borderLeft: '5px solid #2563eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span className="badge badge-primary">Evaluation Complete</span>
                  <span className="badge badge-neutral">{evaluation.relevance}</span>
                </div>

                {/* Overall Feedback */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Evaluator Feedback
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: '#1e293b', lineHeight: 1.5 }}>
                    {evaluation.feedback}
                  </p>
                </div>

                {/* Strengths & Weaknesses */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                  {/* Strengths */}
                  <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#15803d', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ThumbsUp size={14} /> Strengths
                    </div>
                    {evaluation.strengths.map((str, i) => (
                      <div key={i} style={{ fontSize: '0.8125rem', color: '#166534', marginBottom: '4px' }}>
                        ✓ {str}
                      </div>
                    ))}
                  </div>

                  {/* Weaknesses */}
                  <div style={{ padding: '12px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#b45309', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ThumbsDown size={14} /> Areas to Polish
                    </div>
                    {evaluation.weaknesses.map((w, i) => (
                      <div key={i} style={{ fontSize: '0.8125rem', color: '#92400e', marginBottom: '4px' }}>
                        ⚠ {w}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Communication & Suggested Improvement */}
                <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lightbulb size={14} style={{ color: '#2563eb' }} />
                    Suggested Improvement Strategy:
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.4 }}>
                    {evaluation.suggested_improvement}
                  </div>
                </div>

                {/* Next Question Shortcut */}
                {currentIdx < questions.length - 1 && (
                  <button
                    onClick={() => {
                      setCurrentIdx((prev) => prev + 1);
                      setEvaluation(null);
                      setStudentAnswer('');
                    }}
                    className="btn btn-secondary"
                    style={{ marginTop: '16px', width: '100%' }}
                  >
                    <span>Proceed to Next Question</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

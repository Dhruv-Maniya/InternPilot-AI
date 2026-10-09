'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Award,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Flag
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { aptitudeApi } from '@/lib/api';
import {
  AptitudeQuestion,
  AptitudeResult,
  AptitudeAnalysisResponse
} from '@/types';

export default function AptitudePage() {
  const { showToast } = useAuth();

  // Test setup state
  const [category, setCategory] = useState('Quantitative Aptitude');
  const [difficulty, setDifficulty] = useState('Beginner');

  // Test session state
  const [testActive, setTestActive] = useState(false);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds

  // Result & AI state
  const [testResult, setTestResult] = useState<AptitudeResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AptitudeAnalysisResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Timer countdown when active
  useEffect(() => {
    if (!testActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testActive, timeLeft]);

  const handleStartTest = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    setAiAnalysis(null);
    setSelectedAnswers({});
    setMarkedForReview({});
    setCurrentIdx(0);
    setTimeLeft(300);

    try {
      const qList = await aptitudeApi.getQuestions(category, difficulty);
      if (qList && qList.length > 0) {
        setQuestions(qList);
        setTestActive(true);
        showToast(`Loaded ${qList.length} questions for ${category}!`, 'info');
      } else {
        setError('No questions returned for this category/difficulty combination.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch aptitude questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (option: string) => {
    const currQ = questions[currentIdx];
    if (!currQ) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currQ.id]: option,
    }));
  };

  const toggleMarkForReview = () => {
    const currQ = questions[currentIdx];
    if (!currQ) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currQ.id]: !prev[currQ.id],
    }));
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const submitRes = await aptitudeApi.submit(category, difficulty, selectedAnswers);
      const res = submitRes.result;
      setTestResult(res);
      setTestActive(false);
      showToast(`Test completed! Score: ${res.score}/${res.total_questions}`, 'success');

      // Fetch AI Analysis automatically
      fetchAiAnalysis(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit test.');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAiAnalysis = async (result: AptitudeResult) => {
    setAnalyzingAi(true);
    setAiError(null);
    try {
      const aiRes = await aptitudeApi.analyze({
        total_questions: result.total_questions,
        correct_answers: result.correct_answers,
        score: result.score,
        accuracy: result.accuracy,
        weak_area: result.weak_area,
        category,
      });
      setAiAnalysis(aiRes);
    } catch (err: any) {
      setAiError(err.message || 'AI service is temporarily unavailable. Please try again.');
    } finally {
      setAnalyzingAi(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">Assessment & Diagnostics</span>
            <span className="badge badge-neutral">Curated Question Bank</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Aptitude Practice & Evaluation
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Diagnostic tests for Quantitative, Logical Reasoning, and Verbal Ability with instant automated scoring.
          </p>
        </div>

        {testActive && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: timeLeft < 60 ? '#fef2f2' : '#ffffff',
              border: `1px solid ${timeLeft < 60 ? '#fecaca' : '#e2e8f0'}`,
              borderRadius: '8px',
              fontWeight: 700,
              color: timeLeft < 60 ? '#ef4444' : '#0f172a',
            }}
          >
            <Clock size={18} />
            <span>Time Left: {formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <button className="btn btn-sm btn-secondary" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {/* STATE 1: TEST NOT STARTED OR CONFIGURING */}
      {!testActive && !testResult && (
        <div className="card" style={{ maxWidth: '640px', margin: '0 auto', padding: '28px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
            Configure Diagnostic Session
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>
            Select your assessment focus. Questions are served directly from the backend question bank.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="label">Aptitude Category</label>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                <option value="Logical Reasoning">Logical Reasoning</option>
                <option value="Verbal Ability">Verbal Ability</option>
                <option value="Data Interpretation">Data Interpretation</option>
              </select>
            </div>

            <div>
              <label className="label">Difficulty Level</label>
              <select
                className="input"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner (Campus Standard)</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartTest}
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            <Sparkles size={18} />
            <span>{loading ? 'Loading Questions...' : 'Start Assessment Test'}</span>
          </button>
        </div>
      )}

      {/* STATE 2: ACTIVE TEST INTERFACE */}
      {testActive && questions.length > 0 && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
          {/* Progress Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">{category}</span>
              <button
                onClick={toggleMarkForReview}
                className={`btn btn-sm ${markedForReview[questions[currentIdx]?.id] ? 'btn-danger' : 'btn-secondary'}`}
              >
                <Flag size={12} />
                <span>{markedForReview[questions[currentIdx]?.id] ? 'Marked' : 'Mark for Review'}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
            <div
              style={{
                width: `${((currentIdx + 1) / questions.length) * 100}%`,
                height: '100%',
                backgroundColor: '#2563eb',
                transition: 'width 0.2s ease',
              }}
            />
          </div>

          {/* Question Box */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1875rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>
              {questions[currentIdx].question}
            </h3>
          </div>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {questions[currentIdx].options.map((option, optIdx) => {
              const isSelected = selectedAnswers[questions[currentIdx].id] === option;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(option)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#2563eb' : '#cbd5e1'}`,
                      backgroundColor: isSelected ? '#2563eb' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: isSelected ? 600 : 400, color: isSelected ? '#1e40af' : '#1e293b' }}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Test Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="btn btn-secondary"
                >
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              ) : null}

              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="btn btn-primary"
              >
                <span>{submitting ? 'Scoring...' : 'Submit Assessment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: TEST RESULTS & AI ANALYSIS */}
      {testResult && (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Result Score Card */}
          <div className="card" style={{ padding: '28px', borderLeft: '5px solid #2563eb' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '6px' }}>Assessment Result</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
                  Score: {testResult.score} / {testResult.total_questions} ({testResult.accuracy}%)
                </h2>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
                  Category: {category} • Difficulty: {difficulty}
                </div>
              </div>

              <button
                onClick={() => {
                  setTestResult(null);
                  setTestActive(false);
                }}
                className="btn btn-secondary"
              >
                <RotateCw size={15} />
                <span>Take Another Test</span>
              </button>
            </div>

            {/* Score Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '20px' }}>
              <div style={{ padding: '14px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#15803d' }}>{testResult.correct_answers}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>Correct</div>
              </div>

              <div style={{ padding: '14px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#b91c1c' }}>{testResult.incorrect_answers}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#991b1b' }}>Incorrect</div>
              </div>

              <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{testResult.accuracy}%</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Accuracy</div>
              </div>

              <div style={{ padding: '14px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#b45309', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {testResult.weak_area || 'None Detected'}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e' }}>Weak Area</div>
              </div>
            </div>
          </div>

          {/* AI Performance Analysis Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={18} style={{ color: '#2563eb' }} />
                <span>AI Performance Analysis</span>
              </div>
              <span className="badge badge-primary">POST /api/aptitude/analyze</span>
            </div>

            {analyzingAi ? (
              <div className="loading-skeleton" style={{ height: '140px' }} />
            ) : aiError ? (
              <div className="error-banner">
                <div>{aiError}</div>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => testResult && fetchAiAnalysis(testResult)}
                >
                  <RefreshCw size={13} />
                  <span>Try Again</span>
                </button>
              </div>
            ) : aiAnalysis ? (
              <div>
                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, marginBottom: '16px' }}>
                  {aiAnalysis.feedback}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  {/* Strengths */}
                  <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#15803d', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={15} /> Identified Strengths
                    </div>
                    {aiAnalysis.strengths.map((st, i) => (
                      <div key={i} style={{ fontSize: '0.8125rem', color: '#334155', marginBottom: '4px' }}>
                        ✓ {st}
                      </div>
                    ))}
                  </div>

                  {/* Weak Areas */}
                  <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#b45309', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={15} /> Targeted Focus Areas
                    </div>
                    {aiAnalysis.weak_areas.map((wa, i) => (
                      <div key={i} style={{ fontSize: '0.8125rem', color: '#334155', marginBottom: '4px' }}>
                        ⚠ {wa}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    Actionable Recommendations:
                  </div>
                  {aiAnalysis.recommendations.map((rec, i) => (
                    <div key={i} style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '4px' }}>
                      → {rec}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

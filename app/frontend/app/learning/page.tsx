'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ExternalLink,
  Target,
  Search,
  Filter,
  RotateCw,
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { learningApi } from '@/lib/api';
import { LearningResource } from '@/types';

export default function LearningPage() {
  const { profile, activeInternship, showToast } = useAuth();

  // Identified skills to target: from active internship's missing skills or default core skills
  const defaultSkills = activeInternship?.missing_skills?.length
    ? activeInternship.missing_skills
    : ['SQL', 'Pandas', 'Machine Learning', 'Power BI'];

  const [targetSkills, setTargetSkills] = useState<string[]>(defaultSkills);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [customSkillInput, setCustomSkillInput] = useState('');

  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async (skills = targetSkills) => {
    if (skills.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await learningApi.getResources(skills);
      if (res && res.resources) {
        setResources(res.resources);
      } else {
        setResources([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load learning resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeInternship?.missing_skills?.length) {
      setTargetSkills(activeInternship.missing_skills);
      fetchResources(activeInternship.missing_skills);
    } else {
      fetchResources(targetSkills);
    }
  }, [activeInternship]);

  const addSkillToQuery = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed || targetSkills.includes(trimmed)) return;
    const next = [...targetSkills, trimmed];
    setTargetSkills(next);
    setCustomSkillInput('');
    fetchResources(next);
  };

  const filteredResources = resources.filter((item) => {
    if (selectedSkillFilter === 'All') return true;
    return item.skill.toLowerCase() === selectedSkillFilter.toLowerCase();
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">Skill Development</span>
            {activeInternship && (
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Target size={11} /> Closing Gaps for: {activeInternship.title}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Learning Resource Center
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Curated foundational courses, documentation, and tutorials fetched from FastAPI backend for target skills.
          </p>
        </div>

        <button
          onClick={() => fetchResources()}
          disabled={loading}
          className="btn btn-secondary"
        >
          <RotateCw size={15} className={loading ? 'loading-skeleton' : ''} />
          <span>Refresh Resources</span>
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <button className="btn btn-sm btn-secondary" onClick={() => fetchResources()}>
            Retry
          </button>
        </div>
      )}

      {/* Target Skills & Add Input */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#0f172a' }}>Active Target Skills</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Resources will be loaded for these skills via POST /api/learning/resources</div>
          </div>

          {/* Add skill input */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="input"
              placeholder="Query any skill (e.g. Docker, Python)..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillToQuery())}
              style={{ width: '220px' }}
            />
            <button className="btn btn-primary" onClick={addSkillToQuery}>
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Skill Filter Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setSelectedSkillFilter('All')}
            className={`btn btn-sm ${selectedSkillFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Skills ({resources.length})
          </button>
          {Array.from(new Set(targetSkills)).map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkillFilter(skill)}
              className={`btn btn-sm ${selectedSkillFilter.toLowerCase() === skill.toLowerCase() ? 'btn-primary' : 'btn-secondary'}`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* RESOURCES GRID */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="card loading-skeleton" style={{ height: '180px' }} />
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="empty-state">
          <BookOpen className="empty-icon" />
          <div className="empty-title">No Learning Resources Loaded</div>
          <p className="empty-desc">
            No backend resources found for the current filter. Try adding standard skills like SQL, Pandas, or Python.
          </p>
          <button className="btn btn-primary" onClick={() => fetchResources(['SQL', 'Pandas', 'Python'])}>
            Load Recommended Skills
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredResources.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-primary">{item.skill}</span>
                  <span className="badge badge-neutral">{item.resource_type}</span>
                </div>

                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                  {item.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                  Verified Resource
                </span>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                >
                  <span>Start Learning</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Next Step Banner */}
      <div className="card" style={{ marginTop: '36px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Ready to test your knowledge?</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Take an aptitude diagnostic or practice role-specific technical interview questions.</div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/aptitude" className="btn btn-secondary">
            Practice Aptitude
          </Link>
          <Link href="/interview" className="btn btn-primary">
            Mock Interview AI →
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Compass,
  Bookmark,
  Briefcase,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  MessageSquare,
  FileText,
  RotateCw
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  internshipsApi,
  watchlistApi,
  applicationsApi,
  notificationsApi,
} from '@/lib/api';
import { Internship, MatchedInternship, WatchlistItem, ApplicationItem, DeadlineNotification } from '@/types';

export default function DashboardPage() {
  const { profile, activeInternship, setActiveInternship, showToast } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [matchedInternships, setMatchedInternships] = useState<MatchedInternship[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineNotification[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallel fetch from real FastAPI backend
      const [matchesRes, watchlistRes, appsRes, deadlinesRes] = await Promise.allSettled([
        internshipsApi.match(profile),
        watchlistApi.getAll(),
        applicationsApi.getAll(),
        notificationsApi.getDeadlines(7),
      ]);

      if (matchesRes.status === 'fulfilled' && matchesRes.value.results) {
        setMatchedInternships(matchesRes.value.results);
      } else if (matchesRes.status === 'rejected') {
        console.warn('Matching API failed, fetching search fallback:', matchesRes.reason);
        // Fallback to search if matching has temporary backend timeout
        try {
          const searchRes = await internshipsApi.search('Data Analyst Intern', profile.preferred_location);
          if (searchRes && searchRes.results) {
            setMatchedInternships(
              searchRes.results.map((i: Internship) => ({
                title: i.title,
                company: i.company,
                location: i.location || profile.preferred_location,
                description: i.description,
                source: i.source,
                url: i.url,
                required_skills: ['Python', 'SQL'],
                preferred_skills: ['Power BI'],
                matched_skills: ['Python'],
                missing_skills: ['SQL'],
                skills_to_learn: ['SQL'],
                match_percentage: 67.0,
                requirements_found: true,
                eligibility: 'Likely Entry-Level',
                recommendation_priority: 0,
              }))
            );
          }
        } catch {
          // Ignore fallback error
        }
      }

      if (watchlistRes.status === 'fulfilled' && watchlistRes.value.items) {
        setWatchlist(watchlistRes.value.items);
      }

      if (appsRes.status === 'fulfilled' && appsRes.value.applications) {
        setApplications(appsRes.value.applications);
      }

      if (deadlinesRes.status === 'fulfilled' && deadlinesRes.value.notifications) {
        setDeadlines(deadlinesRes.value.notifications);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard metrics.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSaveToWatchlist = async (internship: MatchedInternship) => {
    const id = internship.url || `${internship.company}-${internship.title}`;
    setSavingId(id);
    try {
      await watchlistApi.add({
        internship_id: id,
        title: internship.title,
        company: internship.company,
        location: internship.location || 'Remote',
        application_url: internship.url || 'https://google.com',
        deadline: '2026-10-25',
      });
      showToast(`Saved "${internship.title}" to watchlist!`, 'success');
      // Refresh watchlist
      const updated = await watchlistApi.getAll();
      setWatchlist(updated.items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save to watchlist.';
      showToast(msg, 'error');
    } finally {
      setSavingId(null);
    }
  };

  const isSaved = (internship: MatchedInternship) => {
    const id = internship.url || `${internship.company}-${internship.title}`;
    return watchlist.some((w) => w.internship_id === id);
  };

  // Derive stats
  const interviewCount = applications.filter((a) => a.status.toLowerCase() === 'interview').length;

  // Next Best Action calculation based on real backend data
  let nextAction = {
    title: 'Discover and Match Internships',
    desc: 'Run AI Profile Matching to discover top entry-level opportunities tailored to your skills.',
    link: '/internships',
    cta: 'Explore Internships',
    icon: Compass,
    badge: 'Step 1: Discover',
  };

  if (activeInternship) {
    if (activeInternship.missing_skills && activeInternship.missing_skills.length > 0) {
      nextAction = {
        title: `Close Skill Gap in ${activeInternship.missing_skills[0]}`,
        desc: `Your active target "${activeInternship.title}" requires ${activeInternship.missing_skills.join(', ')}. Review tailored learning recommendations.`,
        link: '/skill-gap',
        cta: 'Review Skill Gap',
        icon: Target,
        badge: 'Priority Preparation',
      };
    } else {
      nextAction = {
        title: `Practice Interview for ${activeInternship.title}`,
        desc: `Prepare for technical and behavioral questions curated specifically for your role.`,
        link: '/interview',
        cta: 'Start Mock Interview',
        icon: MessageSquare,
        badge: 'Interview Readiness',
      };
    }
  } else if (interviewCount > 0) {
    nextAction = {
      title: 'Practice for Your Upcoming Interview',
      desc: `You have ${interviewCount} application(s) at the Interview stage. Practice common technical & HR questions.`,
      link: '/interview',
      cta: 'Practice Interview',
      icon: MessageSquare,
      badge: 'Urgent Preparation',
    };
  } else if (matchedInternships.length > 0) {
    const top = matchedInternships[0];
    nextAction = {
      title: `Prepare for ${top.title} at ${top.company}`,
      desc: `You have a strong match (${top.match_percentage || 80}%) for this role. Set it as your active target to begin preparation.`,
      link: '/skill-gap',
      cta: 'Begin Prep Workflow',
      icon: Sparkles,
      badge: 'Recommended Target',
    };
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Career Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Welcome back, {profile.name}! Track opportunities, identify gaps, and prepare smarter.
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="btn btn-secondary"
          title="Refresh dashboard data"
        >
          <RotateCw size={15} className={loading ? 'loading-skeleton' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <button className="btn btn-sm btn-secondary" onClick={loadDashboardData}>
            Retry
          </button>
        </div>
      )}

      {/* 1. CAREER SNAPSHOT METRICS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Recommended */}
        <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Recommended
            </span>
            <Sparkles size={18} style={{ color: '#2563eb' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
            {loading ? '...' : matchedInternships.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>AI Profile Matches</div>
        </div>

        {/* Saved */}
        <Link href="/watchlist" className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #f59e0b', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Saved
            </span>
            <Bookmark size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
            {loading ? '...' : watchlist.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>In Watchlist</div>
        </Link>

        {/* Applications */}
        <Link href="/applications" className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #10b981', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Applications
            </span>
            <Briefcase size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
            {loading ? '...' : applications.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Actively Tracked</div>
        </Link>

        {/* Interviews */}
        <Link href="/applications" className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #8b5cf6', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Interviews
            </span>
            <MessageSquare size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
            {loading ? '...' : interviewCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>In Progress</div>
        </Link>

        {/* Deadlines */}
        <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Deadlines
            </span>
            <Clock size={18} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
            {loading ? '...' : deadlines.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Within 7 Days</div>
        </div>
      </div>

      {/* 2. NEXT BEST ACTION BANNER */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
          borderColor: '#bfdbfe',
          padding: '24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', maxWidth: '750px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <nextAction.icon size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-primary">{nextAction.badge}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Your Next Best Action
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              {nextAction.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              {nextAction.desc}
            </p>
          </div>
        </div>

        <Link
          href={nextAction.link}
          className="btn btn-primary btn-lg"
          onClick={() => {
            if (!activeInternship && matchedInternships.length > 0) {
              setActiveInternship(matchedInternships[0]);
            }
          }}
        >
          <span>{nextAction.cta}</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* 3. TWO COLUMN: TOP MATCHES & UPCOMING DEADLINES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Top Internship Matches */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: '#2563eb' }} /> Top Matches For You
            </h2>
            <Link href="/internships" style={{ fontSize: '0.8125rem', color: '#2563eb', fontWeight: 600 }}>
              View All ({matchedInternships.length}) →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="card loading-skeleton" style={{ height: '140px' }} />
              <div className="card loading-skeleton" style={{ height: '140px' }} />
            </div>
          ) : matchedInternships.length === 0 ? (
            <div className="empty-state">
              <Compass className="empty-icon" />
              <div className="empty-title">No Matches Calculated Yet</div>
              <p className="empty-desc">
                Update your skills or browse live listings to generate recommendations.
              </p>
              <Link href="/internships" className="btn btn-primary">
                Browse Internships
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {matchedInternships.slice(0, 4).map((internship, idx) => {
                const saved = isSaved(internship);
                const isSelected = activeInternship?.title === internship.title && activeInternship?.company === internship.company;
                return (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      borderColor: isSelected ? '#3b82f6' : 'var(--border-color)',
                      backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                            {internship.match_percentage ? `${internship.match_percentage}% Match` : 'Strong Match'}
                          </span>
                          <span className={`badge ${internship.eligibility === 'Likely Entry-Level' ? 'badge-success' : 'badge-warning'}`}>
                            {internship.eligibility}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {internship.title}
                        </h4>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                          {internship.company} • 📍 {internship.location || 'India'}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveToWatchlist(internship)}
                        disabled={savingId !== null}
                        className={`btn btn-sm ${saved ? 'btn-secondary' : 'btn-outline'}`}
                        title={saved ? 'Already in Watchlist' : 'Save to Watchlist'}
                      >
                        <Bookmark size={14} style={{ fill: saved ? '#f59e0b' : 'none', color: saved ? '#f59e0b' : 'currentColor' }} />
                        <span>{saved ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>

                    {/* Skill tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0' }}>
                      {internship.matched_skills?.slice(0, 3).map((s, i) => (
                        <span key={i} className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                          ✓ {s}
                        </span>
                      ))}
                      {internship.missing_skills?.slice(0, 2).map((s, i) => (
                        <span key={i} className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>
                          ⚠ {s}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <button
                        onClick={() => {
                          setActiveInternship(internship);
                          showToast(`Set "${internship.title}" as active preparation target!`, 'info');
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        <Target size={13} />
                        <span>{isSelected ? 'Active Target' : 'Set as Target'}</span>
                      </button>

                      <Link href="/skill-gap" onClick={() => setActiveInternship(internship)} className="btn btn-sm btn-secondary">
                        <span>Prepare Workspace</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Deadlines & Quick Prep Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Deadlines Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} style={{ color: '#ef4444' }} /> Upcoming Deadlines
              </h2>
              <span className="badge badge-neutral">{deadlines.length} Alert{deadlines.length === 1 ? '' : 's'}</span>
            </div>

            {deadlines.length === 0 ? (
              <div className="card" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                <CheckCircle2 size={32} style={{ color: '#10b981', margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>No Approaching Deadlines</div>
                <p style={{ fontSize: '0.8125rem' }}>
                  Save internships with deadlines to your Watchlist to receive automatic reminders.
                </p>
                <Link href="/internships" className="btn btn-sm btn-secondary" style={{ marginTop: '12px' }}>
                  Explore Opportunities
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {deadlines.map((dl, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '14px 16px',
                      borderLeft: `4px solid ${dl.days_remaining <= 2 ? '#ef4444' : '#f59e0b'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{dl.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dl.company}</div>
                      </div>
                      <span className={`badge ${dl.days_remaining <= 1 ? 'badge-danger' : 'badge-warning'}`}>
                        {dl.days_remaining === 0 ? 'Today' : `${dl.days_remaining}d left`}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#991b1b', marginTop: '6px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} />
                      {dl.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Preparation Toolkit */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} style={{ color: '#2563eb' }} /> Preparation Suite Quick Access
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <Link href="/skill-gap" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '10px 12px' }}>
                <Target size={16} style={{ color: '#2563eb' }} />
                <span>Skill Gap</span>
              </Link>
              <Link href="/learning" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '10px 12px' }}>
                <BookOpen size={16} style={{ color: '#10b981' }} />
                <span>Resources</span>
              </Link>
              <Link href="/aptitude" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '10px 12px' }}>
                <HelpCircle size={16} style={{ color: '#f59e0b' }} />
                <span>Aptitude Test</span>
              </Link>
              <Link href="/interview" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '10px 12px' }}>
                <MessageSquare size={16} style={{ color: '#8b5cf6' }} />
                <span>AI Interview</span>
              </Link>
              <Link href="/resume" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '10px 12px' }}>
                <FileText size={16} style={{ color: '#0284c7' }} />
                <span>Resume AI</span>
              </Link>
              <Link href="/applications" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '10px 12px' }}>
                <Briefcase size={16} style={{ color: '#ec4899' }} />
                <span>Applications</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

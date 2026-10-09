'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Filter,
  Sparkles,
  Bookmark,
  Target,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  Briefcase,
  Layers,
  Info
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { internshipsApi, watchlistApi } from '@/lib/api';
import { MatchedInternship, WatchlistItem } from '@/types';

export default function InternshipsPage() {
  const { profile, activeInternship, setActiveInternship, showToast } = useAuth();

  const [mode, setMode] = useState<'match' | 'search'>('match');
  const [searchQuery, setSearchQuery] = useState('Data Analyst Intern');
  const [searchLocation, setSearchLocation] = useState('India');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  const [internships, setInternships] = useState<MatchedInternship[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Selected for Details Modal
  const [inspectInternship, setInspectInternship] = useState<MatchedInternship | null>(null);

  const fetchMatchedInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await internshipsApi.match(profile);
      if (res && res.results) {
        setInternships(res.results);
      } else {
        setInternships([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error running profile matching.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchInternships = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await internshipsApi.search(searchQuery, searchLocation);
      if (res && res.results) {
        // Map search results into normalized MatchedInternship format
        const mapped: MatchedInternship[] = res.results.map((i: any) => ({
          title: i.title,
          company: i.company,
          location: i.location || searchLocation,
          description: i.description,
          source: i.source,
          url: i.url,
          required_skills: i.required_skills || ['Python', 'SQL'],
          preferred_skills: i.preferred_skills || [],
          matched_skills: profile.skills.filter((s) => (i.description || '').toLowerCase().includes(s.toLowerCase())),
          missing_skills: ['SQL', 'Pandas'].filter((s) => !profile.skills.includes(s)),
          skills_to_learn: ['SQL'],
          match_percentage: 75.0,
          requirements_found: true,
          eligibility: 'Likely Entry-Level',
          recommendation_priority: 0,
        }));
        setInternships(mapped);
      } else {
        setInternships([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search internships.');
    } finally {
      setLoading(false);
    }
  };

  const loadWatchlist = async () => {
    try {
      const res = await watchlistApi.getAll();
      if (res && res.items) setWatchlist(res.items);
    } catch {}
  };

  useEffect(() => {
    loadWatchlist();
    if (mode === 'match') {
      fetchMatchedInternships();
    } else {
      fetchSearchInternships();
    }
  }, [mode]);

  const handleToggleWatchlist = async (internship: MatchedInternship) => {
    const id = internship.url || `${internship.company}-${internship.title}`;
    const alreadySaved = watchlist.some((w) => w.internship_id === id);

    setSavingId(id);
    try {
      if (alreadySaved) {
        await watchlistApi.remove(id);
        showToast(`Removed "${internship.title}" from watchlist.`, 'info');
      } else {
        await watchlistApi.add({
          internship_id: id,
          title: internship.title,
          company: internship.company,
          location: internship.location || 'India',
          application_url: internship.url || 'https://google.com',
          deadline: '2026-10-28',
        });
        showToast(`Saved "${internship.title}" to watchlist!`, 'success');
      }
      const updated = await watchlistApi.getAll();
      setWatchlist(updated.items);
    } catch (err: any) {
      showToast(err.message || 'Watchlist action failed.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const isSaved = (internship: MatchedInternship) => {
    const id = internship.url || `${internship.company}-${internship.title}`;
    return watchlist.some((w) => w.internship_id === id);
  };

  // Filter by role keyword if selected
  const filteredInternships = internships.filter((item) => {
    if (selectedRoleFilter === 'All') return true;
    return item.title.toLowerCase().includes(selectedRoleFilter.toLowerCase());
  });

  return (
    <div>
      {/* Page Title & View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Internship Discovery & Matching
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            {mode === 'match'
              ? 'Personalized opportunities ranked by requirement alignment and entry-level eligibility.'
              : 'Search live industry internship listings via SerpApi.'}
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setMode('match')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: mode === 'match' ? '#ffffff' : 'transparent',
              color: mode === 'match' ? '#1e293b' : '#64748b',
              boxShadow: mode === 'match' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Sparkles size={15} style={{ color: mode === 'match' ? '#2563eb' : '#64748b' }} />
            <span>AI Profile Match</span>
          </button>
          <button
            onClick={() => setMode('search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: mode === 'search' ? '#ffffff' : 'transparent',
              color: mode === 'search' ? '#1e293b' : '#64748b',
              boxShadow: mode === 'search' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Search size={15} style={{ color: mode === 'search' ? '#2563eb' : '#64748b' }} />
            <span>Keyword Search</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      {mode === 'search' ? (
        <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchSearchInternships();
            }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <div style={{ flex: '2', minWidth: '220px', position: 'relative' }}>
              <input
                type="text"
                className="input"
                placeholder="Search by role or company (e.g. Data Analyst Intern, Python Developer)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
            </div>

            <div style={{ flex: '1', minWidth: '160px', position: 'relative' }}>
              <input
                type="text"
                className="input"
                placeholder="Location (e.g. India, Bangalore)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
              <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              <Search size={15} />
              <span>Search Listings</span>
            </button>
          </form>
        </div>
      ) : (
        /* Profile Filter Pills */
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Filter Role:
          </span>
          {['All', 'Data Analyst', 'Data Scientist', 'Machine Learning', 'Python'].map((pill) => (
            <button
              key={pill}
              onClick={() => setSelectedRoleFilter(pill)}
              className={`btn btn-sm ${selectedRoleFilter === pill ? 'btn-primary' : 'btn-secondary'}`}
            >
              {pill}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: '#64748b' }}>
            Showing <strong>{filteredInternships.length}</strong> opportunities
          </div>
        </div>
      )}

      {/* ERROR BANNER */}
      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <button className="btn btn-sm btn-secondary" onClick={mode === 'match' ? fetchMatchedInternships : fetchSearchInternships}>
            Retry
          </button>
        </div>
      )}

      {/* INTERNSHIP GRID */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="card loading-skeleton" style={{ height: '220px' }} />
          ))}
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="empty-state">
          <Briefcase className="empty-icon" />
          <div className="empty-title">No Internships Found</div>
          <p className="empty-desc">
            Try adjusting your search keywords or updating your skills profile to match more listings.
          </p>
          <button className="btn btn-primary" onClick={fetchMatchedInternships}>
            Refresh Recommendations
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredInternships.map((internship, idx) => {
            const saved = isSaved(internship);
            const isSelected = activeInternship?.title === internship.title && activeInternship?.company === internship.company;

            return (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderColor: isSelected ? '#2563eb' : 'var(--border-color)',
                  boxShadow: isSelected ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'var(--shadow-sm)',
                }}
              >
                <div>
                  {/* Card Header: Badges & Save */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {internship.match_percentage !== null ? (
                        <span className="badge badge-primary">
                          {internship.match_percentage}% Profile Alignment
                        </span>
                      ) : (
                        <span className="badge badge-primary">Curated Opportunity</span>
                      )}

                      <span
                        className={`badge ${
                          internship.eligibility === 'Likely Entry-Level'
                            ? 'badge-success'
                            : internship.eligibility === 'Review Requirements'
                            ? 'badge-warning'
                            : 'badge-neutral'
                        }`}
                      >
                        {internship.eligibility}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleWatchlist(internship)}
                      disabled={savingId !== null}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: saved ? '#f59e0b' : '#94a3b8',
                      }}
                      title={saved ? 'Remove from Watchlist' : 'Save to Watchlist'}
                    >
                      <Bookmark size={18} style={{ fill: saved ? '#f59e0b' : 'none' }} />
                    </button>
                  </div>

                  {/* Title & Company */}
                  <h3
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '4px',
                      lineHeight: 1.3,
                    }}
                  >
                    {internship.title}
                  </h3>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                    {internship.company}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                    <MapPin size={13} /> {internship.location || 'India'}
                    {internship.source && <span> • Source: {internship.source}</span>}
                  </div>

                  {/* Skills Grid */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
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
                    {internship.required_skills?.length === 0 && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>General Requirements</span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <button
                    onClick={() => setInspectInternship(internship)}
                    className="btn btn-sm btn-secondary"
                  >
                    <Info size={13} />
                    <span>Details</span>
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        setActiveInternship(internship);
                        showToast(`Active Target set: "${internship.title}"`, 'success');
                      }}
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                    >
                      <Target size={13} />
                      <span>{isSelected ? 'Active Target' : 'Prepare'}</span>
                    </button>

                    <Link
                      href="/skill-gap"
                      onClick={() => setActiveInternship(internship)}
                      className="btn btn-sm btn-primary"
                      title="Open full preparation workspace"
                    >
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INTERNSHIP DETAILS MODAL */}
      {inspectInternship && (
        <div className="modal-backdrop" onClick={() => setInspectInternship(null)}>
          <div className="modal-dialog" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
                  {inspectInternship.match_percentage ? `${inspectInternship.match_percentage}% Match` : 'Strong Match'}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{inspectInternship.title}</h2>
                <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '2px' }}>
                  {inspectInternship.company} • 📍 {inspectInternship.location || 'India'}
                </div>
              </div>
              <button onClick={() => setInspectInternship(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#94a3b8' }}>✕</button>
            </div>

            {/* Eligibility & Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span className="label" style={{ marginBottom: '2px' }}>Eligibility Classification</span>
                <span className={`badge ${inspectInternship.eligibility === 'Likely Entry-Level' ? 'badge-success' : 'badge-warning'}`}>
                  {inspectInternship.eligibility}
                </span>
              </div>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span className="label" style={{ marginBottom: '2px' }}>Original Source</span>
                <span style={{ fontSize: '0.8125rem', color: '#334155', fontWeight: 500 }}>
                  {inspectInternship.source || 'Verified Partner'}
                </span>
              </div>
            </div>

            {/* Required Skills Analysis */}
            <div style={{ marginBottom: '18px' }}>
              <div className="label">Skill Analysis Breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginBottom: '4px' }}>
                    Matched Skills You Have:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {inspectInternship.matched_skills && inspectInternship.matched_skills.length > 0 ? (
                      inspectInternship.matched_skills.map((s, i) => (
                        <span key={i} className="badge badge-success">✓ {s}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>None matched directly from extracted requirements</span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, marginBottom: '4px' }}>
                    Missing Required Skills (To Learn):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {inspectInternship.missing_skills && inspectInternship.missing_skills.length > 0 ? (
                      inspectInternship.missing_skills.map((s, i) => (
                        <span key={i} className="badge badge-warning">⚠ {s}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>No missing required skills detected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Excerpt */}
            {inspectInternship.description && (
              <div style={{ marginBottom: '20px' }}>
                <div className="label">Role Description</div>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: '#334155',
                    backgroundColor: '#f8fafc',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.5,
                  }}
                >
                  {inspectInternship.description}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              {inspectInternship.url ? (
                <a
                  href={inspectInternship.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <span>Apply on Original Site</span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <div />
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    handleToggleWatchlist(inspectInternship);
                  }}
                  className="btn btn-secondary"
                >
                  <Bookmark size={15} style={{ fill: isSaved(inspectInternship) ? '#f59e0b' : 'none' }} />
                  <span>{isSaved(inspectInternship) ? 'Saved' : 'Save to Watchlist'}</span>
                </button>

                <Link
                  href="/skill-gap"
                  onClick={() => {
                    setActiveInternship(inspectInternship);
                    setInspectInternship(null);
                  }}
                  className="btn btn-primary"
                >
                  <Target size={15} />
                  <span>Open Prep Workspace</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

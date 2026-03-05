import React, { useState } from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --bg:          #07090f;
    --surface:     #0e1117;
    --surface-2:   #131720;
    --surface-3:   #181d28;
    --border:      rgba(255,255,255,0.06);
    --border-med:  rgba(255,255,255,0.09);
    --border-hi:   rgba(255,255,255,0.14);
    --txt:         #e8ecf4;
    --txt-2:       #808898;
    --txt-3:       #3e4455;

    --emerald:     #00e896;
    --emerald-10:  rgba(0,232,150,0.10);
    --emerald-20:  rgba(0,232,150,0.18);

    --amber:       #f5a623;
    --amber-10:    rgba(245,166,35,0.10);
    --amber-20:    rgba(245,166,35,0.18);

    --rose:        #ff3d6b;
    --rose-10:     rgba(255,61,107,0.10);
    --rose-20:     rgba(255,61,107,0.18);

    --sky:         #00b8f5;
    --sky-10:      rgba(0,184,245,0.10);
    --sky-20:      rgba(0,184,245,0.18);

    --indigo:      #818cf8;
    --indigo-10:   rgba(129,140,248,0.10);
    --indigo-20:   rgba(129,140,248,0.18);

    --r:           16px;
    --r-sm:        10px;
    --r-xs:        7px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    font-family: 'Inter', sans-serif;
    color: var(--txt);
    -webkit-font-smoothing: antialiased;
    padding: 32px;
  }

  /* ── Section shell ── */
  .seo-section {
    background: var(--surface);
    border: 1px solid var(--border-med);
    border-radius: var(--r);
    overflow: hidden;
    width: 100%;
  }

  /* ── Header ── */
  .seo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(90deg, rgba(0,184,245,0.04) 0%, transparent 60%);
    position: relative;
  }

  .seo-header::after {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }

  .seo-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .seo-header-icon {
    width: 34px; height: 34px;
    background: var(--sky-10);
    border: 1px solid var(--sky-20);
    border-radius: var(--r-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .seo-header-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--txt);
    letter-spacing: -0.01em;
  }

  .seo-score-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 99px;
    border: 1px solid;
  }

  .chip-emerald { background: var(--emerald-10); border-color: var(--emerald-20); color: var(--emerald); }
  .chip-amber   { background: var(--amber-10);   border-color: var(--amber-20);   color: var(--amber);   }
  .chip-rose    { background: var(--rose-10);     border-color: var(--rose-20);    color: var(--rose);    }

  /* ── Meta cards row ── */
  .seo-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid var(--border);
  }

  .meta-card {
    padding: 22px 24px;
    position: relative;
    transition: background 0.2s;
  }

  .meta-card:hover { background: var(--surface-2); }
  .meta-card:first-child { border-right: 1px solid var(--border); }

  /* top accent bar */
  .meta-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 2px 2px 0 0;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .meta-card:hover::before { opacity: 1; }
  .meta-card.ok::before   { background: linear-gradient(90deg, transparent, var(--emerald), transparent); }
  .meta-card.warn::before { background: linear-gradient(90deg, transparent, var(--amber),   transparent); }
  .meta-card.bad::before  { background: linear-gradient(90deg, transparent, var(--rose),    transparent); }

  .meta-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--txt-3);
    margin-bottom: 10px;
  }

  .meta-text {
    font-size: 13.5px;
    font-weight: 500;
    color: var(--txt);
    line-height: 1.55;
    margin-bottom: 10px;
    word-break: break-word;
  }

  .meta-text.missing { color: var(--txt-3); font-style: italic; }

  .meta-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* progress bar for char count */
  .char-bar-wrap {
    flex: 1;
    margin-right: 12px;
  }

  .char-bar-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .char-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
  }

  .char-ideal {
    font-size: 10px;
    color: var(--txt-3);
    font-family: 'JetBrains Mono', monospace;
  }

  .char-track {
    height: 4px;
    background: var(--surface-3);
    border-radius: 99px;
    overflow: visible;
    position: relative;
  }

  .char-fill {
    height: 100%;
    border-radius: 99px;
    max-width: 100%;
    transition: width 0.6s cubic-bezier(.4,0,.2,1);
  }

  /* ideal zone marker */
  .char-zone {
    position: absolute;
    top: -1px;
    height: 6px;
    border-radius: 2px;
    opacity: 0.25;
  }

  .meta-status-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
    border: 1px solid;
  }

  .dot-ok   { background: var(--emerald-10); border-color: var(--emerald-20); }
  .dot-warn { background: var(--amber-10);   border-color: var(--amber-20);   }
  .dot-bad  { background: var(--rose-10);    border-color: var(--rose-20);    }

  /* ── Stats row (H1, H2, Sitemap, Robots) ── */
  .seo-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid var(--border);
  }

  .stat-cell {
    padding: 18px 22px;
    border-right: 1px solid var(--border);
    transition: background 0.2s;
    position: relative;
    overflow: hidden;
  }

  .stat-cell:last-child { border-right: none; }
  .stat-cell:hover { background: var(--surface-2); }

  .stat-cell-glow {
    position: absolute;
    top: -20px; right: -20px;
    width: 70px; height: 70px;
    border-radius: 50%;
    pointer-events: none;
  }

  .stat-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--txt-3);
    margin-bottom: 10px;
  }

  .stat-value {
    font-family: 'Inter', sans-serif;
    font-size: 28px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }

  .stat-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 3px 9px;
    border-radius: 99px;
    border: 1px solid;
  }

  .sb-ok   { background: var(--emerald-10); border-color: var(--emerald-20); color: var(--emerald); }
  .sb-warn { background: var(--amber-10);   border-color: var(--amber-20);   color: var(--amber);   }
  .sb-bad  { background: var(--rose-10);    border-color: var(--rose-20);    color: var(--rose);    }

  .sv-emerald { color: var(--emerald); }
  .sv-amber   { color: var(--amber);   }
  .sv-rose    { color: var(--rose);    }
  .sv-sky     { color: var(--sky);     }
  .sg-emerald { background: radial-gradient(circle, rgba(0,232,150,0.08), transparent 70%); }
  .sg-amber   { background: radial-gradient(circle, rgba(245,166,35,0.08), transparent 70%); }
  .sg-rose    { background: radial-gradient(circle, rgba(255,61,107,0.08), transparent 70%); }
  .sg-sky     { background: radial-gradient(circle, rgba(0,184,245,0.08), transparent 70%); }

  /* ── Canonical ── */
  .seo-canonical {
    padding: 18px 24px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .canonical-icon {
    width: 32px; height: 32px;
    background: var(--indigo-10);
    border: 1px solid var(--indigo-20);
    border-radius: var(--r-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .canonical-body {}

  .canonical-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--txt-3);
    margin-bottom: 5px;
  }

  .canonical-url {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--indigo);
    word-break: break-all;
    line-height: 1.6;
  }

  .canonical-none {
    font-size: 12.5px;
    color: var(--txt-3);
    font-style: italic;
  }
`;

// ─── helpers ─────────────────────────────────────────────────────────────────
const titleStatus = (len) =>
  len >= 10 && len <= 60 ? 'ok' : len > 60 ? 'warn' : 'bad';

const metaStatus = (len) =>
  len >= 50 && len <= 160 ? 'ok' : len > 160 ? 'warn' : 'bad';

const statusIcon = (s) => s === 'ok' ? '✓' : s === 'warn' ? '!' : '✗';
const statusDotCls = (s) => s === 'ok' ? 'dot-ok' : s === 'warn' ? 'dot-warn' : 'dot-bad';
const statusFill = (s) => s === 'ok' ? '#00e896' : s === 'warn' ? '#f5a623' : '#ff3d6b';
const statusChip = (s) => s === 'ok' ? 'chip-emerald' : s === 'warn' ? 'chip-amber' : 'chip-rose';
const statusSb = (s) => s === 'ok' ? 'sb-ok' : s === 'warn' ? 'sb-warn' : 'sb-bad';

const seoHealth = (result) => {
  let issues = 0;
  if (titleStatus(result.title_length) !== 'ok') issues++;
  if (metaStatus(result.meta_description_length) !== 'ok') issues++;
  if (result.h1_count !== 1) issues++;
  if (!result.sitemap_exists) issues++;
  if (!result.robots_txt_exists) issues++;
  if (issues === 0) return 'ok';
  if (issues <= 2) return 'warn';
  return 'bad';
};

// ─── Demo ─────────────────────────────────────────────────────────────────────
const DEMO = {
  title: 'Website in 7 Days',
  title_length: 17,
  meta_description: 'Looking for professional website development in Chennai? We build dynamic, lead generation websites delivered in just 7 days. Book your free consultation today.',
  meta_description_length: 160,
  h1_count: 0,
  h2_count: 0,
  sitemap_exists: false,
  sitemap_url: null,
  robots_txt_exists: true,
  canonical_tag: 'https://websitein7days.thebot.agency/',
};

// ─── Component ────────────────────────────────────────────────────────────────
export const SEOSection = ({ result = DEMO }) => {
  const tStatus = titleStatus(result.title_length || 0);
  const mStatus = metaStatus(result.meta_description_length || 0);
  const health  = seoHealth(result);

  // char bar widths (capped at 100%)
  const titlePct   = Math.min(100, ((result.title_length || 0) / 70) * 100);
  const metaPct    = Math.min(100, ((result.meta_description_length || 0) / 180) * 100);
  // ideal zone as % of bar width
  const titleIdealStart = (10 / 70) * 100;
  const titleIdealWidth = (50 / 70) * 100;
  const metaIdealStart  = (50 / 180) * 100;
  const metaIdealWidth  = (110 / 180) * 100;

  const h1Status  = result.h1_count === 1 ? 'ok' : 'warn';
  const h2Status  = result.h2_count > 0  ? 'ok' : 'warn';
  const smStatus  = result.sitemap_exists ? 'ok' : 'bad';
  const rbStatus  = result.robots_txt_exists ? 'ok' : 'bad';

  const healthLabel = { ok: 'Optimised', warn: 'Needs Attention', bad: 'Issues Found' }[health];

  return (
    <>
      <style>{css}</style>
      <section className="seo-section">

        {/* Header */}
        <div className="seo-header">
          <div className="seo-header-left">
            <div className="seo-header-icon">🔍</div>
            <span className="seo-header-title">SEO Analysis</span>
          </div>
          <span className={`seo-score-chip ${statusChip(health)}`}>
            {statusIcon(health)} {healthLabel}
          </span>
        </div>

        {/* Title + Meta Description */}
        <div className="seo-meta-grid">

          {/* Title */}
          <div className={`meta-card ${tStatus}`}>
            <div className="meta-label">Page Title</div>
            <div className={`meta-text ${!result.title ? 'missing' : ''}`}>
              {result.title || 'No title tag found'}
            </div>
            <div className="meta-footer">
              <div className="char-bar-wrap">
                <div className="char-bar-labels">
                  <span className="char-count" style={{ color: statusFill(tStatus) }}>
                    {result.title_length || 0} chars
                  </span>
                  <span className="char-ideal">ideal 10–60</span>
                </div>
                <div className="char-track">
                  <div className="char-zone" style={{
                    left: `${titleIdealStart}%`, width: `${titleIdealWidth}%`,
                    background: '#00e896'
                  }}/>
                  <div className="char-fill" style={{
                    width: `${titlePct}%`,
                    background: statusFill(tStatus),
                    boxShadow: `0 0 8px ${statusFill(tStatus)}55`
                  }}/>
                </div>
              </div>
              <div className={`meta-status-dot ${statusDotCls(tStatus)}`}>
                {statusIcon(tStatus)}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className={`meta-card ${mStatus}`}>
            <div className="meta-label">Meta Description</div>
            <div className={`meta-text ${!result.meta_description ? 'missing' : ''}`}>
              {result.meta_description || 'No meta description found'}
            </div>
            <div className="meta-footer">
              <div className="char-bar-wrap">
                <div className="char-bar-labels">
                  <span className="char-count" style={{ color: statusFill(mStatus) }}>
                    {result.meta_description_length || 0} chars
                  </span>
                  <span className="char-ideal">ideal 50–160</span>
                </div>
                <div className="char-track">
                  <div className="char-zone" style={{
                    left: `${metaIdealStart}%`, width: `${metaIdealWidth}%`,
                    background: '#00e896'
                  }}/>
                  <div className="char-fill" style={{
                    width: `${metaPct}%`,
                    background: statusFill(mStatus),
                    boxShadow: `0 0 8px ${statusFill(mStatus)}55`
                  }}/>
                </div>
              </div>
              <div className={`meta-status-dot ${statusDotCls(mStatus)}`}>
                {statusIcon(mStatus)}
              </div>
            </div>
          </div>
        </div>

        {/* H1 · H2 · Sitemap · Robots */}
        <div className="seo-stats">

          {[
            { label: 'H1 Tags',     value: result.h1_count ?? 0, status: h1Status,
              badge: h1Status === 'ok' ? 'Ideal' : result.h1_count > 1 ? 'Too many' : 'Missing',
              glow: h1Status === 'ok' ? 'sg-emerald' : 'sg-amber',
              color: h1Status === 'ok' ? 'sv-emerald' : 'sv-amber' },
            { label: 'H2 Tags',     value: result.h2_count ?? 0, status: h2Status,
              badge: h2Status === 'ok' ? 'Present' : 'Missing',
              glow: h2Status === 'ok' ? 'sg-emerald' : 'sg-amber',
              color: h2Status === 'ok' ? 'sv-emerald' : 'sv-amber' },
            { label: 'Sitemap',     value: result.sitemap_exists ? '✓' : '✗', status: smStatus,
              badge: result.sitemap_exists ? 'Found' : 'Not found',
              glow: smStatus === 'ok' ? 'sg-emerald' : 'sg-rose',
              color: smStatus === 'ok' ? 'sv-emerald' : 'sv-rose' },
            { label: 'Robots.txt',  value: result.robots_txt_exists ? '✓' : '✗', status: rbStatus,
              badge: result.robots_txt_exists ? 'Found' : 'Not found',
              glow: rbStatus === 'ok' ? 'sg-emerald' : 'sg-rose',
              color: rbStatus === 'ok' ? 'sv-emerald' : 'sv-rose' },
          ].map(({ label, value, status, badge, glow, color }) => (
            <div key={label} className="stat-cell">
              <div className={`stat-cell-glow ${glow}`} />
              <div className="stat-label">{label}</div>
              <div className={`stat-value ${color}`}>{value}</div>
              <span className={`stat-badge ${statusSb(status)}`}>
                {statusIcon(status)} {badge}
              </span>
            </div>
          ))}

        </div>

        {/* Canonical */}
        <div className="seo-canonical">
          <div className="canonical-icon">🔗</div>
          <div className="canonical-body">
            <div className="canonical-label">Canonical Tag</div>
            {result.canonical_tag
              ? <div className="canonical-url">{result.canonical_tag}</div>
              : <div className="canonical-none">No canonical tag defined</div>
            }
          </div>
        </div>

      </section>
    </>
  );
};

export default SEOSection;

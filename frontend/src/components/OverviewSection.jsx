import React from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --bg:            #07090f;
    --surface:       #0e1117;
    --surface-2:     #131720;
    --surface-3:     #181d28;
    --border:        rgba(255,255,255,0.06);
    --border-med:    rgba(255,255,255,0.09);
    --border-hi:     rgba(255,255,255,0.14);
    --txt:           #e8ecf4;
    --txt-2:         #808898;
    --txt-3:         #3e4455;

    --emerald:       #00e896;
    --emerald-10:    rgba(0,232,150,0.10);
    --emerald-20:    rgba(0,232,150,0.20);
    --emerald-glow:  rgba(0,232,150,0.35);

    --amber:         #f5a623;
    --amber-10:      rgba(245,166,35,0.10);
    --amber-20:      rgba(245,166,35,0.20);
    --amber-glow:    rgba(245,166,35,0.35);

    --rose:          #ff3d6b;
    --rose-10:       rgba(255,61,107,0.10);
    --rose-20:       rgba(255,61,107,0.20);
    --rose-glow:     rgba(255,61,107,0.30);

    --sky:           #00b8f5;
    --sky-10:        rgba(0,184,245,0.10);
    --sky-20:        rgba(0,184,245,0.20);

    --indigo:        #818cf8;
    --indigo-10:     rgba(129,140,248,0.10);
    --indigo-20:     rgba(129,140,248,0.18);

    --r:             16px;
    --r-sm:          10px;
    --r-xs:          7px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    font-family: 'Inter', sans-serif;
    color: var(--txt);
    -webkit-font-smoothing: antialiased;
  }

  /* ── layout ── */
  .ov { width: 100%; display: flex; justify-content: center; padding: 0; }

  .ov-shell {
    width: 100%;
    max-width: 1120px;
    display: grid;
    grid-template-columns: 310px 1fr;
    gap: 18px;
    align-items: stretch;
    padding-bottom: 8px;
  }

  /* ══════════════════════════════════════
     SCORE PANEL
  ══════════════════════════════════════ */
  .sp {
    background: var(--surface);
    border: 1px solid var(--border-med);
    border-radius: var(--r);
    padding: 30px 26px 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    position: relative;
    overflow: hidden;
  }

  /* glass noise texture overlay */
  .sp::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
    pointer-events: none;
    z-index: 0;
  }

  /* top shimmer line */
  .sp::after {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    z-index: 1;
  }

  .sp > * { position: relative; z-index: 2; }

  /* ── section label ── */
  .sp-eyebrow {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--txt-3);
    align-self: flex-start;
  }

  .sp-eyebrow-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--emerald);
    box-shadow: 0 0 6px var(--emerald-glow);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--emerald-glow); }
    50%       { opacity: 0.5; box-shadow: 0 0 12px var(--emerald-glow); }
  }

  /* ── ring ── */
  .ring-outer {
    position: relative;
    width: 170px;
    height: 170px;
    flex-shrink: 0;
  }

  .ring-outer svg { transform: rotate(-90deg); display: block; }

  .ring-inner {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
  }

  .ring-num {
    font-family: 'Inter', sans-serif;
    font-size: 58px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -3px;
  }

  .ring-denom {
    font-size: 12px;
    font-weight: 500;
    color: var(--txt-3);
    letter-spacing: 0.02em;
    margin-top: 2px;
  }

  /* ── grade ── */
  .grade-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    width: 100%;
  }

  .grade-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 6px 18px;
    border-radius: 99px;
    border: 1px solid;
  }

  .grade-chip svg { width: 10px; height: 10px; }

  .gc-emerald { background: var(--emerald-10); border-color: var(--emerald-20); color: var(--emerald); }
  .gc-amber   { background: var(--amber-10);   border-color: var(--amber-20);   color: var(--amber);   }
  .gc-rose    { background: var(--rose-10);    border-color: var(--rose-20);    color: var(--rose);    }

  .grade-hint {
    font-size: 11.5px;
    color: var(--txt-3);
    text-align: center;
    line-height: 1.55;
  }

  /* ── divider ── */
  .sp-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-med), transparent);
  }

  /* ── sub scores ── */
  .subs {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 11px;
    flex: 1;
    justify-content: flex-end;
  }

  .sub-row {
    display: grid;
    grid-template-columns: 18px 90px 1fr 28px;
    align-items: center;
    gap: 8px;
  }

  .sub-icon { font-size: 13px; }

  .sub-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--txt-2);
  }

  .sub-track {
    height: 4px;
    background: var(--surface-3);
    border-radius: 99px;
    overflow: hidden;
  }

  .sub-fill {
    height: 100%;
    border-radius: 99px;
    position: relative;
    overflow: hidden;
  }

  .sub-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 50%, transparent);
    animation: bar-shine 2.8s ease-in-out infinite;
    background-size: 200% 100%;
  }

  @keyframes bar-shine {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .sub-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: var(--txt-2);
    text-align: right;
  }

  /* ══════════════════════════════════════
     METRIC CARDS
  ══════════════════════════════════════ */
  .mg {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .mc {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 22px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: border-color 0.3s, background 0.3s, transform 0.25s, box-shadow 0.3s;
  }

  .mc:hover {
    background: var(--surface-2);
    border-color: var(--border-hi);
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.5);
  }

  /* bg glow in top-right */
  .mc-glow {
    position: absolute;
    top: -24px; right: -24px;
    width: 96px; height: 96px;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0.6;
    transition: opacity 0.3s;
  }

  .mc:hover .mc-glow { opacity: 1; }

  /* top shimmer on hover */
  .mc::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: var(--shimmer-color, transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .mc:hover::before { opacity: 1; }

  /* row 1: icon + badge */
  .mc-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }

  .mc-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: var(--r-sm);
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
  }

  .badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 99px;
    border: 1px solid;
  }

  /* row 2: value */
  .mc-value {
    font-family: 'Inter', sans-serif;
    font-size: 38px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -1.5px;
    position: relative;
    z-index: 1;
  }

  /* row 3: labels */
  .mc-labels {
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
    z-index: 1;
  }

  .mc-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--txt-2);
    letter-spacing: -0.01em;
  }

  .mc-unit {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--txt-3);
    letter-spacing: 0.02em;
  }

  /* ── color themes ── */
  /* emerald */
  .t-emerald .mc-icon-wrap { background: var(--emerald-10); border-color: var(--emerald-20); }
  .t-emerald .badge        { background: var(--emerald-10); border-color: var(--emerald-20); color: var(--emerald); }
  .t-emerald .mc-value     { color: var(--emerald); }
  .t-emerald .mc-glow      { background: radial-gradient(circle, var(--emerald-10), transparent 70%); }
  .t-emerald               { --shimmer-color: linear-gradient(90deg, transparent, var(--emerald-20), transparent); }

  /* amber */
  .t-amber .mc-icon-wrap   { background: var(--amber-10); border-color: var(--amber-20); }
  .t-amber .badge          { background: var(--amber-10); border-color: var(--amber-20); color: var(--amber); }
  .t-amber .mc-value       { color: var(--amber); }
  .t-amber .mc-glow        { background: radial-gradient(circle, var(--amber-10), transparent 70%); }
  .t-amber                 { --shimmer-color: linear-gradient(90deg, transparent, var(--amber-20), transparent); }

  /* rose */
  .t-rose .mc-icon-wrap    { background: var(--rose-10); border-color: var(--rose-20); }
  .t-rose .badge           { background: var(--rose-10); border-color: var(--rose-20); color: var(--rose); }
  .t-rose .mc-value        { color: var(--rose); }
  .t-rose .mc-glow         { background: radial-gradient(circle, var(--rose-10), transparent 70%); }
  .t-rose                  { --shimmer-color: linear-gradient(90deg, transparent, var(--rose-20), transparent); }

  /* sky */
  .t-sky .mc-icon-wrap     { background: var(--sky-10); border-color: var(--sky-20); }
  .t-sky .badge            { background: var(--sky-10); border-color: var(--sky-20); color: var(--sky); }
  .t-sky .mc-value         { color: var(--sky); }
  .t-sky .mc-glow          { background: radial-gradient(circle, var(--sky-10), transparent 70%); }
  .t-sky                   { --shimmer-color: linear-gradient(90deg, transparent, var(--sky-20), transparent); }

  /* indigo */
  .t-indigo .mc-icon-wrap  { background: var(--indigo-10); border-color: var(--indigo-20); }
  .t-indigo .badge         { background: var(--indigo-10); border-color: var(--indigo-20); color: var(--indigo); }
  .t-indigo .mc-value      { color: var(--indigo); }
  .t-indigo .mc-glow       { background: radial-gradient(circle, var(--indigo-10), transparent 70%); }
  .t-indigo                { --shimmer-color: linear-gradient(90deg, transparent, var(--indigo-20), transparent); }

  /* ── mobile responsive ── */
  @media (max-width: 900px) {
    .ov-shell {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    /* On tablet: score panel goes side-by-side (ring left, subs right) */
    .sp {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      padding: 20px 18px;
      gap: 16px;
    }

    .sp-eyebrow { width: 100%; }
    .sp-divider { display: none; }

    .ring-outer {
      width: 140px;
      height: 140px;
    }

    .grade-area { align-items: flex-start; }

    .subs {
      flex: 1;
      min-width: 160px;
      justify-content: center;
    }

    .mg {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 640px) {
    .sp {
      flex-direction: column;
      align-items: center;
      padding: 18px 16px;
    }

    .sp-eyebrow { width: auto; align-self: flex-start; }
    .sp-divider { display: block; }
    .grade-area { align-items: center; }

    .ring-outer {
      width: 150px;
      height: 150px;
    }

    .ring-num {
      font-size: 52px;
      letter-spacing: -2px;
    }

    .subs { width: 100%; }

    .sub-row {
      grid-template-columns: 18px 80px 1fr 28px;
    }

    .mg {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .mc {
      padding: 16px 14px 14px;
      gap: 12px;
    }

    .mc-value {
      font-size: 30px;
      letter-spacing: -1px;
    }

    .mc-title { font-size: 11px; }
    .mc-unit  { font-size: 9px; }
    .badge    { font-size: 9px; padding: 3px 8px; }
  }

  @media (max-width: 400px) {
    .ring-outer {
      width: 130px;
      height: 130px;
    }

    .ring-num { font-size: 44px; }

    .mg {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .mc {
      padding: 12px 10px 10px;
      gap: 10px;
    }

    .mc-value { font-size: 24px; }
    .mc-icon-wrap { width: 28px; height: 28px; font-size: 13px; }
  }
`;

// ─── logic ───────────────────────────────────────────────────────────────────
const calcScore = (d) => {
  let s = 100;
  if (d.page_load_time_ms > 5000) s -= 20;
  else if (d.page_load_time_ms > 3000) s -= 10;
  if (!d.title) s -= 15;
  if (!d.meta_description) s -= 15;
  if (!d.h1_count) s -= 10;
  if (d.broken_links > 0) s -= Math.min(d.broken_links * 2, 15);
  if (d.images_missing_alt > 0) s -= Math.min(d.images_missing_alt, 10);
  if (!d.https_enabled) s -= 20;
  if ((d.missing_headers || []).length > 3) s -= 15;
  if (!d.has_viewport_meta) s -= 10;
  return Math.max(0, Math.min(100, s));
};

const gradeOf = (s) =>
  s >= 80 ? { label: 'Excellent', cls: 'gc-emerald', ring: '#00e896', glow: 'rgba(0,232,150,0.12)', track: 'rgba(0,232,150,0.08)' }
  : s >= 60 ? { label: 'Good',    cls: 'gc-amber',   ring: '#f5a623', glow: 'rgba(245,166,35,0.12)', track: 'rgba(245,166,35,0.08)' }
  :           { label: 'Needs Work', cls: 'gc-rose', ring: '#ff3d6b', glow: 'rgba(255,61,107,0.12)', track: 'rgba(255,61,107,0.08)' };

const subScores = (d) => [
  { icon: '⚡', name: 'Performance', color: '#f5a623',
    val: d.page_load_time_ms ? (d.page_load_time_ms > 5000 ? 25 : d.page_load_time_ms > 3000 ? 60 : 95) : 50 },
  { icon: '🔍', name: 'SEO', color: '#00b8f5',
    val: Math.max(0, 100 - (!d.title?30:0) - (!d.meta_description?30:0) - (!d.h1_count?20:0)) },
  { icon: '🔒', name: 'Security', color: '#818cf8',
    val: Math.max(0, 100 - (!d.https_enabled?50:0) - ((d.missing_headers||[]).length>3?30:0)) },
  { icon: '♿', name: 'Accessibility', color: '#00e896',
    val: Math.max(0, 100 - Math.min((d.images_missing_alt||0)*20,60) - (!d.has_viewport_meta?30:0)) },
];

// ─── MetricCard ───────────────────────────────────────────────────────────────
const MetricCard = ({ theme, icon, badge, value, title, unit }) => (
  <div className={`mc t-${theme}`}>
    <div className="mc-glow" />
    <div className="mc-top">
      <div className="mc-icon-wrap">{icon}</div>
      {badge && <span className="badge">{badge}</span>}
    </div>
    <div className="mc-value">{value}</div>
    <div className="mc-labels">
      <span className="mc-title">{title}</span>
      {unit && <span className="mc-unit">{unit}</span>}
    </div>
  </div>
);

// ─── Demo ─────────────────────────────────────────────────────────────────────
const DEMO = {
  page_load_time_ms: null, page_size_mb: 0,
  title: 'Website in 7 Days', title_length: 17,
  meta_description: 'Professional website development in Chennai?',
  meta_description_length: 160, h1_count: 0,
  broken_links: 0, total_links: 0,
  images_missing_alt: 1, total_images: 1,
  https_enabled: true,
  security_headers: { 'Strict-Transport-Security': true },
  missing_headers: ['Content-Security-Policy','X-Frame-Options','X-Content-Type-Options','X-XSS-Protection','Referrer-Policy','Permissions-Policy'],
  has_viewport_meta: false,
};

// ─── Component ────────────────────────────────────────────────────────────────
export const OverviewSection = ({ result = DEMO }) => {
  const score = calcScore(result);
  const grade = gradeOf(score);
  const subs  = subScores(result);
  const sec   = Object.keys(result.security_headers || {}).length;
  const titleOk = result.title_length >= 10 && result.title_length <= 60;
  const metaOk  = result.meta_description_length >= 70 && result.meta_description_length <= 160;

  const R = 72, C = 2 * Math.PI * R;
  const dash = (score / 100) * C;

  return (
    <>
      <style>{css}</style>
      <div className="ov">
        <div className="ov-shell">

          {/* ══ SCORE PANEL ══ */}
          <div className="sp">
            {/* glow blob behind ring */}
            <div style={{
              position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)',
              width:280, height:280, borderRadius:'50%', pointerEvents:'none', zIndex:0,
              background:`radial-gradient(circle, ${grade.glow} 0%, transparent 65%)`
            }}/>

            <div className="sp-eyebrow">
              <div className="sp-eyebrow-dot"/>
              Audit Score
            </div>

            {/* Ring */}
            <div className="ring-outer">
              <svg width="100%" height="100%" viewBox="0 0 170 170">
                {/* bg track */}
                <circle cx="85" cy="85" r={R} fill="none" stroke={grade.track} strokeWidth="10"/>
                {/* tick marks */}
                {[0,25,50,75].map(pct => {
                  const angle = (pct/100)*2*Math.PI - Math.PI/2;
                  const x1 = 85 + (R-8)*Math.cos(angle), y1 = 85 + (R-8)*Math.sin(angle);
                  const x2 = 85 + (R+2)*Math.cos(angle), y2 = 85 + (R+2)*Math.sin(angle);
                  return <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>;
                })}
                {/* filled arc */}
                <circle cx="85" cy="85" r={R} fill="none"
                  stroke={grade.ring} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${dash} ${C}`}
                  style={{
                    filter: `drop-shadow(0 0 8px ${grade.ring}) drop-shadow(0 0 20px ${grade.ring}44)`,
                    transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)'
                  }}
                />
              </svg>
              <div className="ring-inner">
                <span className="ring-num" style={{ color: grade.ring }}>{score}</span>
                <span className="ring-denom">/ 100</span>
              </div>
            </div>

            {/* Grade */}
            <div className="grade-area">
              <span className={`grade-chip ${grade.cls}`}>
                <svg viewBox="0 0 10 10" fill="currentColor">
                  <circle cx="5" cy="5" r="4"/>
                </svg>
                {grade.label}
              </span>
              <span className="grade-hint">Overall website health score</span>
            </div>

            <div className="sp-divider"/>

            {/* Sub-scores */}
            <div className="subs">
              {subs.map(s => (
                <div key={s.name} className="sub-row">
                  <span className="sub-icon">{s.icon}</span>
                  <span className="sub-name">{s.name}</span>
                  <div className="sub-track">
                    <div className="sub-fill" style={{ width:`${s.val}%`, background:s.color }}/>
                  </div>
                  <span className="sub-val">{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ METRIC CARDS ══ */}
          <div className="mg">

            <MetricCard
              theme={result.page_load_time_ms ? (result.page_load_time_ms < 3000 ? 'emerald' : 'amber') : 'amber'}
              icon="⚡"
              badge={result.page_load_time_ms ? (result.page_load_time_ms < 3000 ? 'Fast' : 'Slow') : 'N/A'}
              value={result.page_load_time_ms ?? 'N/A'}
              title="Page Load Time"
              unit="milliseconds"
            />

            <MetricCard
              theme="indigo"
              icon="📦"
              badge="Size"
              value={(result.page_size_mb || 0).toFixed(2)}
              title="Page Size"
              unit="megabytes"
            />

            <MetricCard
              theme={titleOk ? 'emerald' : 'rose'}
              icon="📝"
              badge={titleOk ? 'Optimised' : result.title_length > 60 ? 'Too long' : 'Too short'}
              value={result.title_length || 0}
              title="Title Length"
              unit="chars · ideal 10–60"
            />

            <MetricCard
              theme={metaOk ? 'emerald' : 'amber'}
              icon="📄"
              badge={metaOk ? 'Good' : result.meta_description_length > 160 ? 'Too long' : 'Short'}
              value={result.meta_description_length || 0}
              title="Meta Description"
              unit="chars · ideal 70–160"
            />

            <MetricCard
              theme={result.broken_links > 0 ? 'rose' : 'emerald'}
              icon="🔗"
              badge={result.broken_links > 0 ? 'Fix needed' : 'Healthy'}
              value={result.broken_links || 0}
              title="Broken Links"
              unit="links detected"
            />

            <MetricCard
              theme="sky"
              icon="🌐"
              badge="Crawled"
              value={result.total_links || 0}
              title="Total Links"
              unit="links found on page"
            />

            <MetricCard
              theme={result.images_missing_alt > 0 ? 'amber' : 'emerald'}
              icon="🖼️"
              badge={result.images_missing_alt > 0 ? 'Missing' : 'All set'}
              value={result.images_missing_alt || 0}
              title="Missing ALT Tags"
              unit="images without alt text"
            />

            <MetricCard
              theme={result.https_enabled ? 'emerald' : 'rose'}
              icon="🔒"
              badge={result.https_enabled ? 'Secure' : 'Insecure'}
              value={result.https_enabled ? '✓' : '✗'}
              title="HTTPS"
              unit={result.https_enabled ? 'SSL certificate valid' : 'No SSL detected'}
            />

            <MetricCard
              theme={sec >= 5 ? 'emerald' : sec >= 3 ? 'amber' : 'rose'}
              icon="🛡️"
              badge={sec >= 5 ? 'Strong' : sec >= 3 ? 'Partial' : 'Weak'}
              value={sec}
              title="Security Headers"
              unit="headers configured"
            />

          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewSection;

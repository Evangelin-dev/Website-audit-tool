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

  /* ── Section shell ── */
  .img-section {
    background: var(--surface);
    border: 1px solid var(--border-med);
    border-radius: var(--r);
    overflow: hidden;
    width: 100%;
    font-family: 'Inter', sans-serif;
    color: var(--txt);
    -webkit-font-smoothing: antialiased;
  }

  /* ── Header ── */
  .img-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(90deg, rgba(0,184,245,0.04) 0%, transparent 60%);
    position: relative;
  }

  .img-header::after {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }

  .img-header-left { display: flex; align-items: center; gap: 10px; }

  .img-header-icon {
    width: 34px; height: 34px;
    background: var(--sky-10);
    border: 1px solid var(--sky-20);
    border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }

  .img-header-title { font-size: 14px; font-weight: 700; color: var(--txt); letter-spacing: -0.01em; }

  .img-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 99px; border: 1px solid;
  }

  .chip-emerald { background: var(--emerald-10); border-color: var(--emerald-20); color: var(--emerald); }
  .chip-amber   { background: var(--amber-10);   border-color: var(--amber-20);   color: var(--amber);   }
  .chip-rose    { background: var(--rose-10);    border-color: var(--rose-20);    color: var(--rose);    }

  /* ── 3-col stat strip ── */
  .img-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-bottom: 1px solid var(--border);
  }

  .img-stat {
    padding: 22px 24px;
    position: relative; overflow: hidden;
    transition: background 0.2s; cursor: default;
  }

  .img-stat:not(:last-child) { border-right: 1px solid var(--border); }
  .img-stat:hover { background: var(--surface-2); }

  .img-stat-glow {
    position: absolute; top: -24px; right: -24px;
    width: 80px; height: 80px; border-radius: 50%;
    pointer-events: none; opacity: 0.7; transition: opacity 0.2s;
  }

  .img-stat:hover .img-stat-glow { opacity: 1; }

  .g-sky     { background: radial-gradient(circle, rgba(0,184,245,0.10),   transparent 70%); }
  .g-rose    { background: radial-gradient(circle, rgba(255,61,107,0.10),  transparent 70%); }
  .g-amber   { background: radial-gradient(circle, rgba(245,166,35,0.10),  transparent 70%); }
  .g-emerald { background: radial-gradient(circle, rgba(0,232,150,0.10),   transparent 70%); }

  .img-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    opacity: 0; transition: opacity 0.25s;
  }
  .img-stat:hover::before { opacity: 1; }
  .st-sky::before    { background: linear-gradient(90deg, transparent, var(--sky),    transparent); }
  .st-rose::before   { background: linear-gradient(90deg, transparent, var(--rose),   transparent); }
  .st-amber::before  { background: linear-gradient(90deg, transparent, var(--amber),  transparent); }
  .st-emerald::before{ background: linear-gradient(90deg, transparent, var(--emerald),transparent); }

  .img-stat-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--txt-3); margin-bottom: 12px; position: relative; z-index: 1;
  }

  .img-stat-value {
    font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 800;
    line-height: 1; letter-spacing: -1.5px; margin-bottom: 8px;
    position: relative; z-index: 1;
  }

  .img-stat-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    padding: 3px 9px; border-radius: 99px; border: 1px solid;
    position: relative; z-index: 1;
  }

  .b-sky     { background: var(--sky-10);    border-color: var(--sky-20);    color: var(--sky);    }
  .b-rose    { background: var(--rose-10);   border-color: var(--rose-20);   color: var(--rose);   }
  .b-amber   { background: var(--amber-10);  border-color: var(--amber-20);  color: var(--amber);  }
  .b-emerald { background: var(--emerald-10);border-color: var(--emerald-20);color: var(--emerald);}

  .c-sky     { color: var(--sky);     }
  .c-rose    { color: var(--rose);    }
  .c-amber   { color: var(--amber);   }
  .c-emerald { color: var(--emerald); }

  /* ── ALT callout ── */
  .img-alt-callout {
    margin: 20px 24px 0;
    background: rgba(245,166,35,0.05);
    border: 1px solid var(--amber-20);
    border-radius: var(--r-sm);
    padding: 16px 18px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .callout-icon {
    width: 32px; height: 32px;
    background: var(--amber-10);
    border: 1px solid var(--amber-20);
    border-radius: var(--r-xs);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }

  .callout-title {
    font-size: 12px; font-weight: 700; color: var(--amber);
    margin-bottom: 5px; letter-spacing: -0.01em;
  }

  .callout-desc {
    font-size: 12px; color: var(--txt-2); line-height: 1.65;
  }

  /* ── Broken list ── */
  .img-broken {
    padding: 20px 24px;
  }

  .broken-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
  }

  .broken-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--txt-3);
    display: flex; align-items: center; gap: 8px;
  }

  .broken-count {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
    background: var(--rose-10); border: 1px solid var(--rose-20); color: var(--rose);
    padding: 2px 8px; border-radius: 99px; letter-spacing: 0; text-transform: none;
  }

  .broken-list { display: flex; flex-direction: column; gap: 7px; }

  .broken-row {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: var(--r-xs); padding: 11px 16px;
    transition: border-color 0.2s, background 0.2s;
  }

  .broken-row:hover { background: var(--surface-3); border-color: var(--rose-20); }

  .broken-url {
    font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--txt-2);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;
  }

  .broken-code {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
    color: var(--rose); background: var(--rose-10); border: 1px solid var(--rose-20);
    padding: 3px 9px; border-radius: var(--r-xs); flex-shrink: 0;
  }

  .show-more {
    width: 100%; margin-top: 10px; padding: 9px;
    background: transparent; border: 1px dashed var(--border-med); border-radius: var(--r-xs);
    color: var(--txt-3); font-size: 12px; font-family: 'Inter', sans-serif;
    font-weight: 500; cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }

  .show-more:hover { border-color: var(--sky); color: var(--sky); }

  /* ── Empty ── */
  .img-empty {
    padding: 36px 24px; display: flex; flex-direction: column; align-items: center; gap: 10px;
  }

  .empty-icon {
    width: 44px; height: 44px; background: var(--emerald-10); border: 1px solid var(--emerald-20);
    border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;
  }

  .empty-text { font-size: 13px; color: var(--txt-3); text-align: center; line-height: 1.6; }

  /* spacer below callout before broken list */
  .img-broken-with-callout { padding-top: 20px; }

  @media (max-width: 768px) {
    .img-stats {
      grid-template-columns: 1fr 1fr;
    }
    .img-stat:nth-child(2) { border-right: none; }
    .img-stat:nth-child(1),
    .img-stat:nth-child(2) { border-bottom: 1px solid var(--border); }
    .img-stat { padding: 16px; }
    .img-alt-callout { flex-direction: column; padding: 14px 16px; }
    .broken-url { font-size: 11px; }
  }

  @media (max-width: 480px) {
    .img-stat-value { font-size: 26px; }
  }
`;

const DEMO = {
  total_images: 5,
  broken_images: 1,
  images_missing_alt: 2,
  broken_images_list: [
    { url: 'https://example.com/images/hero-banner.webp', status_code: 404 },
  ],
};

export const ImagesSection = ({ result = DEMO }) => {
  const [showAll, setShowAll] = useState(false);

  const total      = result.total_images       ?? 0;
  const broken     = result.broken_images      ?? 0;
  const misAlt     = result.images_missing_alt ?? 0;
  const brokenList = result.broken_images_list ?? [];
  const visible    = showAll ? brokenList : brokenList.slice(0, 5);

  const allGood  = broken === 0 && misAlt === 0;
  const hasIssue = broken > 0;

  const chipCls   = allGood ? 'chip-emerald' : hasIssue ? 'chip-rose' : 'chip-amber';
  const chipLabel = allGood ? '✓ All Good' : hasIssue ? `⚠ ${broken} Broken` : `△ ${misAlt} Missing ALT`;

  const stats = [
    {
      label: 'Total Images', value: total,
      color: 'c-sky', badge: 'Scanned', bc: 'b-sky', g: 'g-sky', st: 'st-sky',
    },
    {
      label: 'Broken Images', value: broken,
      color: broken > 0 ? 'c-rose'    : 'c-emerald',
      badge: broken > 0 ? 'Fix needed' : 'All loading',
      bc:    broken > 0 ? 'b-rose'    : 'b-emerald',
      g:     broken > 0 ? 'g-rose'    : 'g-emerald',
      st:    broken > 0 ? 'st-rose'   : 'st-emerald',
    },
    {
      label: 'Missing ALT', value: misAlt,
      color: misAlt > 0 ? 'c-amber'   : 'c-emerald',
      badge: misAlt > 0 ? 'SEO impact' : 'All tagged',
      bc:    misAlt > 0 ? 'b-amber'   : 'b-emerald',
      g:     misAlt > 0 ? 'g-amber'   : 'g-emerald',
      st:    misAlt > 0 ? 'st-amber'  : 'st-emerald',
    },
  ];

  return (
    <>
      <style>{css}</style>
      <section className="img-section">

        {/* Header */}
        <div className="img-header">
          <div className="img-header-left">
            <div className="img-header-icon">🖼️</div>
            <span className="img-header-title">Images Analysis</span>
          </div>
          <span className={`img-chip ${chipCls}`}>{chipLabel}</span>
        </div>

        {/* Stats */}
        <div className="img-stats">
          {stats.map(({ label, value, color, badge, bc, g, st }) => (
            <div key={label} className={`img-stat ${st}`}>
              <div className={`img-stat-glow ${g}`} />
              <div className="img-stat-label">{label}</div>
              <div className={`img-stat-value ${color}`}>{value}</div>
              <span className={`img-stat-badge ${bc}`}>{badge}</span>
            </div>
          ))}
        </div>

        {/* ALT callout */}
        {misAlt > 0 && (
          <div className="img-alt-callout">
            <div className="callout-icon">💡</div>
            <div>
              <div className="callout-title">{misAlt} Image{misAlt !== 1 ? 's' : ''} Missing ALT Text</div>
              <div className="callout-desc">
                ALT attributes help search engines index your images and make your site accessible to screen readers. Missing ALT text can negatively affect your SEO score and accessibility compliance.
              </div>
            </div>
          </div>
        )}

        {/* Broken images list */}
        {brokenList.length > 0 ? (
          <div className={`img-broken ${misAlt > 0 ? 'img-broken-with-callout' : ''}`}>
            <div className="broken-header">
              <span className="broken-title">
                Broken Images
                <span className="broken-count">{brokenList.length}</span>
              </span>
            </div>
            <div className="broken-list">
              {visible.map((img, i) => (
                <div key={i} className="broken-row">
                  <span className="broken-url" title={img.url}>{img.url}</span>
                  <span className="broken-code">{img.status_code}</span>
                </div>
              ))}
            </div>
            {brokenList.length > 5 && (
              <button className="show-more" onClick={() => setShowAll(s => !s)}>
                {showAll ? '▲ Show less' : `▼ Show ${brokenList.length - 5} more broken images`}
              </button>
            )}
          </div>
        ) : (
          allGood && (
            <div className="img-empty">
              <div className="empty-icon">✓</div>
              <div className="empty-text">
                No image issues detected. All images are loading correctly with proper ALT attributes.
              </div>
            </div>
          )
        )}

      </section>
    </>
  );
};

export default ImagesSection;

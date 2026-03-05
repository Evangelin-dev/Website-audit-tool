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

  .lnk-section {
    background: var(--surface);
    border: 1px solid var(--border-med);
    border-radius: var(--r);
    overflow: hidden;
    width: 100%;
    font-family: 'Inter', sans-serif;
    color: var(--txt);
    -webkit-font-smoothing: antialiased;
  }

  .lnk-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(90deg, rgba(129,140,248,0.04) 0%, transparent 60%);
    position: relative;
  }

  .lnk-header::after {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }

  .lnk-header-left { display: flex; align-items: center; gap: 10px; }

  .lnk-header-icon {
    width: 34px; height: 34px;
    background: var(--indigo-10);
    border: 1px solid var(--indigo-20);
    border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }

  .lnk-header-title { font-size: 14px; font-weight: 700; color: var(--txt); letter-spacing: -0.01em; }

  .lnk-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 99px; border: 1px solid;
  }

  .chip-emerald { background: var(--emerald-10); border-color: var(--emerald-20); color: var(--emerald); }
  .chip-rose    { background: var(--rose-10);    border-color: var(--rose-20);    color: var(--rose);    }
  .chip-indigo  { background: var(--indigo-10);  border-color: var(--indigo-20);  color: var(--indigo);  }

  /* ── Stats ── */
  .lnk-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid var(--border);
  }

  .lnk-stat {
    padding: 22px 24px;
    position: relative; overflow: hidden;
    transition: background 0.2s; cursor: default;
  }

  .lnk-stat:not(:last-child) { border-right: 1px solid var(--border); }
  .lnk-stat:hover { background: var(--surface-2); }

  .lnk-stat-glow {
    position: absolute; top: -24px; right: -24px;
    width: 80px; height: 80px; border-radius: 50%;
    pointer-events: none; opacity: 0.7; transition: opacity 0.2s;
  }

  .lnk-stat:hover .lnk-stat-glow { opacity: 1; }

  .g-txt     { background: radial-gradient(circle, rgba(232,236,244,0.05), transparent 70%); }
  .g-sky     { background: radial-gradient(circle, rgba(0,184,245,0.10),   transparent 70%); }
  .g-indigo  { background: radial-gradient(circle, rgba(129,140,248,0.10), transparent 70%); }
  .g-emerald { background: radial-gradient(circle, rgba(0,232,150,0.10),   transparent 70%); }
  .g-rose    { background: radial-gradient(circle, rgba(255,61,107,0.10),  transparent 70%); }

  .lnk-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    opacity: 0; transition: opacity 0.25s;
  }
  .lnk-stat:hover::before { opacity: 1; }
  .st-txt::before    { background: linear-gradient(90deg, transparent, rgba(232,236,244,0.15), transparent); }
  .st-sky::before    { background: linear-gradient(90deg, transparent, var(--sky),    transparent); }
  .st-indigo::before { background: linear-gradient(90deg, transparent, var(--indigo), transparent); }
  .st-emerald::before{ background: linear-gradient(90deg, transparent, var(--emerald),transparent); }
  .st-rose::before   { background: linear-gradient(90deg, transparent, var(--rose),   transparent); }

  .lnk-stat-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--txt-3); margin-bottom: 12px; position: relative; z-index: 1;
  }

  .lnk-stat-value {
    font-family: 'Inter', sans-serif; font-size: 36px; font-weight: 800;
    line-height: 1; letter-spacing: -1.5px; margin-bottom: 8px;
    position: relative; z-index: 1;
  }

  .lnk-stat-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    padding: 3px 9px; border-radius: 99px; border: 1px solid;
    position: relative; z-index: 1;
  }

  .b-txt     { background: rgba(232,236,244,0.05); border-color: rgba(232,236,244,0.12); color: var(--txt-2); }
  .b-sky     { background: var(--sky-10);    border-color: var(--sky-20);    color: var(--sky);    }
  .b-indigo  { background: var(--indigo-10); border-color: var(--indigo-20); color: var(--indigo); }
  .b-emerald { background: var(--emerald-10);border-color: var(--emerald-20);color: var(--emerald);}
  .b-rose    { background: var(--rose-10);   border-color: var(--rose-20);   color: var(--rose);   }

  .c-txt     { color: var(--txt);     }
  .c-sky     { color: var(--sky);     }
  .c-indigo  { color: var(--indigo);  }
  .c-emerald { color: var(--emerald); }
  .c-rose    { color: var(--rose);    }

  /* ── Distribution ── */
  .lnk-dist {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
  }

  .dist-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
  }

  .dist-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--txt-3);
  }

  .dist-legend { display: flex; gap: 14px; }

  .dist-legend-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--txt-3); font-family: 'JetBrains Mono', monospace;
  }

  .legend-dot { width: 7px; height: 7px; border-radius: 50%; }

  .dist-track {
    height: 6px; background: var(--surface-3);
    border-radius: 99px; overflow: hidden; display: flex;
  }

  .dist-fill {
    height: 100%; transition: width 0.6s cubic-bezier(.4,0,.2,1);
    position: relative; overflow: hidden;
  }

  .dist-fill::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent);
    animation: dshine 3s ease-in-out infinite; background-size: 200% 100%;
  }

  @keyframes dshine {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  /* ── Broken links ── */
  .lnk-broken { padding: 20px 24px; }

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

  .broken-left { display: flex; align-items: center; gap: 10px; overflow: hidden; }

  .broken-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
    padding: 2px 7px; border-radius: var(--r-xs); text-transform: uppercase;
    letter-spacing: 0.06em; flex-shrink: 0;
  }

  .tag-int { background: var(--sky-10);    border: 1px solid var(--sky-20);    color: var(--sky);    }
  .tag-ext { background: var(--indigo-10); border: 1px solid var(--indigo-20); color: var(--indigo); }

  .broken-url {
    font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--txt-2);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .broken-code {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
    color: var(--rose); background: var(--rose-10); border: 1px solid var(--rose-20);
    padding: 3px 9px; border-radius: var(--r-xs); flex-shrink: 0;
  }

  .show-more {
    width: 100%; margin-top: 10px; padding: 9px; background: transparent;
    border: 1px dashed var(--border-med); border-radius: var(--r-xs);
    color: var(--txt-3); font-size: 12px; font-family: 'Inter', sans-serif;
    font-weight: 500; cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }

  .show-more:hover { border-color: var(--indigo); color: var(--indigo); }

  /* ── Empty ── */
  .lnk-empty {
    padding: 36px 24px; display: flex; flex-direction: column; align-items: center; gap: 10px;
  }

  .empty-icon {
    width: 44px; height: 44px; background: var(--emerald-10); border: 1px solid var(--emerald-20);
    border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;
  }

  .empty-text { font-size: 13px; color: var(--txt-3); text-align: center; line-height: 1.6; }
`;

const DEMO = {
  total_links: 12, internal_links: 8, external_links: 4, broken_links: 2,
  broken_links_list: [
    { url: 'https://websitein7days.thebot.agency/about', status_code: 404, type: 'internal' },
    { url: 'https://twitter.com/oldhandle', status_code: 410, type: 'external' },
  ],
};

export const LinksSection = ({ result = DEMO }) => {
  const [showAll, setShowAll] = useState(false);

  const total      = result.total_links    ?? 0;
  const internal   = result.internal_links ?? 0;
  const external   = result.external_links ?? 0;
  const broken     = result.broken_links   ?? 0;
  const brokenList = result.broken_links_list ?? [];
  const visible    = showAll ? brokenList : brokenList.slice(0, 5);

  const internalPct = total > 0 ? (internal / total) * 100 : 50;
  const externalPct = total > 0 ? (external / total) * 100 : 50;
  const allGood     = broken === 0;

  const stats = [
    { label: 'Total Links', value: total,    color: 'c-txt',    badge: 'Scanned',    bc: 'b-txt',    g: 'g-txt',    st: 'st-txt'    },
    { label: 'Internal',    value: internal,  color: 'c-sky',    badge: 'Same domain',bc: 'b-sky',    g: 'g-sky',    st: 'st-sky'    },
    { label: 'External',    value: external,  color: 'c-indigo', badge: 'Outbound',   bc: 'b-indigo', g: 'g-indigo', st: 'st-indigo' },
    {
      label: 'Broken', value: broken,
      color:  allGood ? 'c-emerald' : 'c-rose',
      badge:  allGood ? 'All healthy' : 'Fix needed',
      bc:     allGood ? 'b-emerald'  : 'b-rose',
      g:      allGood ? 'g-emerald'  : 'g-rose',
      st:     allGood ? 'st-emerald' : 'st-rose',
    },
  ];

  return (
    <>
      <style>{css}</style>
      <section className="lnk-section">

        <div className="lnk-header">
          <div className="lnk-header-left">
            <div className="lnk-header-icon">🔗</div>
            <span className="lnk-header-title">Links Analysis</span>
          </div>
          <span className={`lnk-chip ${allGood ? 'chip-emerald' : 'chip-rose'}`}>
            {allGood ? '✓ All Healthy' : `⚠ ${broken} Broken`}
          </span>
        </div>

        <div className="lnk-stats">
          {stats.map(({ label, value, color, badge, bc, g, st }) => (
            <div key={label} className={`lnk-stat ${st}`}>
              <div className={`lnk-stat-glow ${g}`} />
              <div className="lnk-stat-label">{label}</div>
              <div className={`lnk-stat-value ${color}`}>{value}</div>
              <span className={`lnk-stat-badge ${bc}`}>{badge}</span>
            </div>
          ))}
        </div>

        {total > 0 && (
          <div className="lnk-dist">
            <div className="dist-header">
              <span className="dist-label">Link Distribution</span>
              <div className="dist-legend">
                <div className="dist-legend-item">
                  <div className="legend-dot" style={{ background: 'var(--sky)' }} />
                  Internal {Math.round(internalPct)}%
                </div>
                <div className="dist-legend-item">
                  <div className="legend-dot" style={{ background: 'var(--indigo)' }} />
                  External {Math.round(externalPct)}%
                </div>
              </div>
            </div>
            <div className="dist-track">
              <div className="dist-fill" style={{ width: `${internalPct}%`, background: 'var(--sky)',    borderRadius: '99px 0 0 99px' }} />
              <div className="dist-fill" style={{ width: `${externalPct}%`, background: 'var(--indigo)', borderRadius: '0 99px 99px 0' }} />
            </div>
          </div>
        )}

        {brokenList.length > 0 ? (
          <div className="lnk-broken">
            <div className="broken-header">
              <span className="broken-title">
                Broken Links
                <span className="broken-count">{brokenList.length}</span>
              </span>
            </div>
            <div className="broken-list">
              {visible.map((link, i) => {
                const isInt = link.type === 'internal' || (link.url && !link.url.startsWith('http'));
                return (
                  <div key={i} className="broken-row">
                    <div className="broken-left">
                      <span className={`broken-tag ${isInt ? 'tag-int' : 'tag-ext'}`}>{isInt ? 'INT' : 'EXT'}</span>
                      <span className="broken-url" title={link.url}>{link.url}</span>
                    </div>
                    <span className="broken-code">{link.status_code}</span>
                  </div>
                );
              })}
            </div>
            {brokenList.length > 5 && (
              <button className="show-more" onClick={() => setShowAll(s => !s)}>
                {showAll ? '▲ Show less' : `▼ Show ${brokenList.length - 5} more broken links`}
              </button>
            )}
          </div>
        ) : (
          <div className="lnk-empty">
            <div className="empty-icon">✓</div>
            <div className="empty-text">
              {total === 0 ? 'No links found on this page.' : 'All links are reachable — no broken URLs detected.'}
            </div>
          </div>
        )}

      </section>
    </>
  );
};

export default LinksSection;

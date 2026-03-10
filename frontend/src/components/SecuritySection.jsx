import React from 'react';

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

    --violet:      #a78bfa;
    --violet-10:   rgba(167,139,250,0.10);
    --violet-20:   rgba(167,139,250,0.18);

    --r:           16px;
    --r-sm:        10px;
    --r-xs:        7px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Centering wrapper ── */
  .sec-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  /* ── Section shell ── */
  .sec-section {
    background: var(--surface);
    border: 1px solid var(--border-med);
    border-radius: var(--r);
    overflow: hidden;
    width: 100%;
    max-width: 100%;
  }

  /* ── Header ── */
  .sec-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(90deg, rgba(167,139,250,0.04) 0%, transparent 60%);
    position: relative;
  }

  .sec-header::after {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }

  .sec-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sec-header-icon {
    width: 34px; height: 34px;
    background: var(--violet-10);
    border: 1px solid var(--violet-20);
    border-radius: var(--r-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .sec-header-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--txt);
    letter-spacing: -0.01em;
  }

  .sec-chip {
    display: inline-flex;
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

  /* ── Top stats: HTTPS + SSL + header count ── */
  .sec-top {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    border-bottom: 1px solid var(--border);
  }

  .sec-stat {
    padding: 22px 24px;
    position: relative;
    overflow: hidden;
    transition: background 0.2s;
  }

  .sec-stat:not(:last-child) { border-right: 1px solid var(--border); }
  .sec-stat:hover { background: var(--surface-2); }

  .sec-stat-glow {
    position: absolute;
    top: -30px; right: -30px;
    width: 100px; height: 100px;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0.7;
  }

  .glow-emerald { background: radial-gradient(circle, rgba(0,232,150,0.1), transparent 70%); }
  .glow-rose    { background: radial-gradient(circle, rgba(255,61,107,0.1), transparent 70%); }
  .glow-amber   { background: radial-gradient(circle, rgba(245,166,35,0.1), transparent 70%); }
  .glow-sky     { background: radial-gradient(circle, rgba(0,184,245,0.1),  transparent 70%); }
  .glow-violet  { background: radial-gradient(circle, rgba(167,139,250,0.1),transparent 70%); }

  .sec-stat-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--txt-3);
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
  }

  .sec-stat-value {
    font-family: 'Inter', sans-serif;
    font-size: 32px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -1px;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;
  }

  .sec-stat-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 99px;
    border: 1px solid;
    position: relative;
    z-index: 1;
  }

  .badge-emerald { background: var(--emerald-10); border-color: var(--emerald-20); color: var(--emerald); }
  .badge-rose    { background: var(--rose-10);    border-color: var(--rose-20);    color: var(--rose);    }
  .badge-amber   { background: var(--amber-10);   border-color: var(--amber-20);   color: var(--amber);   }
  .badge-sky     { background: var(--sky-10);     border-color: var(--sky-20);     color: var(--sky);     }
  .badge-violet  { background: var(--violet-10);  border-color: var(--violet-20);  color: var(--violet);  }

  .c-emerald { color: var(--emerald); }
  .c-rose    { color: var(--rose);    }
  .c-amber   { color: var(--amber);   }
  .c-sky     { color: var(--sky);     }
  .c-violet  { color: var(--violet);  }

  /* ── Headers grid ── */
  .sec-headers-wrap {
    padding: 22px 24px;
    border-bottom: 1px solid var(--border);
  }

  .sec-headers-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--txt-3);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .headers-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    color: var(--txt-3);
    letter-spacing: 0;
  }

  .headers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-xs);
    padding: 10px 14px;
    transition: border-color 0.15s, background 0.15s;
  }

  .header-row:hover { background: var(--surface-3); border-color: var(--border-med); }

  .header-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: var(--txt-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 99px;
    border: 1px solid;
    flex-shrink: 0;
  }

  .hs-ok  { background: var(--emerald-10); border-color: var(--emerald-20); color: var(--emerald); }
  .hs-bad { background: var(--rose-10);    border-color: var(--rose-20);    color: var(--rose);    }

  /* ── Missing headers warning ── */
  .sec-missing {
    margin: 0 24px 22px;
    background: rgba(255,61,107,0.05);
    border: 1px solid rgba(255,61,107,0.15);
    border-radius: var(--r-sm);
    padding: 16px 18px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .missing-icon {
    width: 32px; height: 32px;
    background: var(--rose-10);
    border: 1px solid var(--rose-20);
    border-radius: var(--r-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .missing-body {}

  .missing-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--rose);
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  .missing-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .missing-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    color: var(--rose);
    background: var(--rose-10);
    border: 1px solid var(--rose-20);
    padding: 3px 9px;
    border-radius: 99px;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .sec-top {
      grid-template-columns: repeat(2, 1fr);
    }
    .sec-stat:nth-child(2) { border-right: none; }
    .sec-stat:nth-child(1),
    .sec-stat:nth-child(2) { border-bottom: 1px solid var(--border); }
    .headers-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .sec-stat { padding: 16px; }
    .sec-headers-wrap { padding: 16px; }
  }

  @media (max-width: 480px) {
    .sec-top {
      grid-template-columns: 1fr 1fr;
    }
    .headers-grid {
      grid-template-columns: 1fr;
    }
    .sec-stat-value { font-size: 26px; }
    .header-name { font-size: 10px; }
  }
`;

// ─── helpers ─────────────────────────────────────────────────────────────────
const ALL_HEADERS = [
  'Strict-Transport-Security',
  'Content-Security-Policy',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'X-XSS-Protection',
  'Referrer-Policy',
  'Permissions-Policy',
];

const sslGradeColor = (g) => {
  if (!g) return 'c-amber';
  if (g === 'A' || g === 'A+') return 'c-emerald';
  if (g === 'B') return 'c-sky';
  if (g === 'C') return 'c-amber';
  return 'c-rose';
};

const sslBadgeColor = (g) => {
  if (!g) return 'badge-amber';
  if (g === 'A' || g === 'A+') return 'badge-emerald';
  if (g === 'B') return 'badge-sky';
  if (g === 'C') return 'badge-amber';
  return 'badge-rose';
};

const securityHealth = (result) => {
  if (!result.https_enabled) return 'rose';
  const missing = (result.missing_headers || []).length;
  if (missing === 0) return 'emerald';
  if (missing <= 3) return 'amber';
  return 'rose';
};

const healthLabel = (color) => ({
  emerald: 'Secure',
  amber:   'Needs Attention',
  rose:    'At Risk',
}[color]);

// ─── Demo ─────────────────────────────────────────────────────────────────────
const DEMO = {
  https_enabled: true,
  ssl_grade: 'A',
  security_headers: {
    'Strict-Transport-Security': true,
    'Content-Security-Policy': false,
    'X-Frame-Options': false,
    'X-Content-Type-Options': false,
    'X-XSS-Protection': false,
    'Referrer-Policy': false,
    'Permissions-Policy': false,
  },
  missing_headers: [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection',
    'Referrer-Policy',
    'Permissions-Policy',
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────
export const SecuritySection = ({ result = DEMO }) => {
  const health     = securityHealth(result);
  const chipCls    = `chip-${health}`;
  const presentCount = ALL_HEADERS.filter(h =>
    result.security_headers?.[h] && result.security_headers[h] !== 'Missing'
  ).length;
  const totalCount   = ALL_HEADERS.length;

  return (
    <>
      <style>{css}</style>
      <section className="sec-section">

          {/* Header */}
          <div className="sec-header">
            <div className="sec-header-left">
              <div className="sec-header-icon">🔐</div>
              <span className="sec-header-title">Security Analysis</span>
            </div>
            <span className={`sec-chip ${chipCls}`}>
              {health === 'emerald' ? '✓' : '!'} {healthLabel(health)}
            </span>
          </div>

          {/* HTTPS + SSL + Headers Present + Headers Missing */}
          <div className="sec-top">

            <div className="sec-stat">
              <div className={`sec-stat-glow glow-${result.https_enabled ? 'emerald' : 'rose'}`} />
              <div className="sec-stat-label">HTTPS Status</div>
              <div className={`sec-stat-value ${result.https_enabled ? 'c-emerald' : 'c-rose'}`}>
                {result.https_enabled ? '✓' : '✗'}
              </div>
              <span className={`sec-stat-badge ${result.https_enabled ? 'badge-emerald' : 'badge-rose'}`}>
                {result.https_enabled ? '● Enabled' : '● Disabled'}
              </span>
            </div>

            <div className="sec-stat">
              <div className={`sec-stat-glow glow-${sslGradeColor(result.ssl_grade).replace('c-', '')}`} />
              <div className="sec-stat-label">SSL Grade</div>
              <div className={`sec-stat-value ${sslGradeColor(result.ssl_grade)}`}>
                {result.ssl_grade || 'N/A'}
              </div>
              <span className={`sec-stat-badge ${sslBadgeColor(result.ssl_grade)}`}>
                {result.ssl_grade === 'A' || result.ssl_grade === 'A+' ? 'Excellent' :
                 result.ssl_grade === 'B' ? 'Good' :
                 result.ssl_grade === 'C' ? 'Fair' : 'Poor'}
              </span>
            </div>

            <div className="sec-stat">
              <div className="sec-stat-glow glow-emerald" />
              <div className="sec-stat-label">Headers Present</div>
              <div className="sec-stat-value c-emerald">{presentCount}</div>
              <span className="sec-stat-badge badge-emerald">● Configured</span>
            </div>

            <div className="sec-stat">
              <div className={`sec-stat-glow glow-${(result.missing_headers || []).length > 0 ? 'rose' : 'emerald'}`} />
              <div className="sec-stat-label">Headers Missing</div>
              <div className={`sec-stat-value ${(result.missing_headers || []).length > 0 ? 'c-rose' : 'c-emerald'}`}>
                {(result.missing_headers || []).length}
              </div>
              <span className={`sec-stat-badge ${(result.missing_headers || []).length > 0 ? 'badge-rose' : 'badge-emerald'}`}>
                {(result.missing_headers || []).length > 0 ? '● Fix needed' : '● All set'}
              </span>
            </div>

          </div>

          {/* Security Headers */}
          <div className="sec-headers-wrap">
            <div className="sec-headers-title">
              Security Headers
              <span className="headers-count">{presentCount} / {totalCount} configured</span>
            </div>

            <div className="headers-grid">
              {ALL_HEADERS.map(header => {
                const present = result.security_headers?.[header] &&
                                result.security_headers[header] !== 'Missing';
                return (
                  <div key={header} className="header-row">
                    <span className="header-name">{header}</span>
                    <span className={`header-status ${present ? 'hs-ok' : 'hs-bad'}`}>
                      {present ? '✓ Present' : '✗ Missing'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing headers callout */}
          {result.missing_headers && result.missing_headers.length > 0 && (
            <div className="sec-missing">
              <div className="missing-icon">⚠️</div>
              <div className="missing-body">
                <div className="missing-title">
                  {result.missing_headers.length} missing header{result.missing_headers.length !== 1 ? 's' : ''} — your site is exposed to common attack vectors
                </div>
                <div className="missing-chips">
                  {result.missing_headers.map(h => (
                    <span key={h} className="missing-chip">{h}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </section>
    </>
  );
};

export default SecuritySection;

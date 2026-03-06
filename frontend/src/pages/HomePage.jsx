import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../components/UIComponents';
import OverviewSection from '../components/OverviewSection';
import SEOSection from '../components/SEOSection';
import SecuritySection from '../components/SecuritySection';
import LinksSection from '../components/LinksSection';
import ImagesSection from '../components/ImagesSection';
import UnlockReportModal from '../components/UnlockReportModal';
import { auditAPI } from '../api/client';
import { downloadAuditPDF } from '../utils/pdfReport';

/* --- Performance Section CSS (matches OverviewSection design tokens) --- */
const perfCSS = `
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
    --emerald-20:  rgba(0,232,150,0.20);
    --emerald-glow:rgba(0,232,150,0.35);
    --amber:       #f5a623;
    --amber-10:    rgba(245,166,35,0.10);
    --amber-20:    rgba(245,166,35,0.20);
    --amber-glow:  rgba(245,166,35,0.35);
    --rose:        #ff3d6b;
    --rose-10:     rgba(255,61,107,0.10);
    --rose-20:     rgba(255,61,107,0.20);
    --sky:         #00b8f5;
    --sky-10:      rgba(0,184,245,0.10);
    --sky-20:      rgba(0,184,245,0.20);
    --indigo:      #818cf8;
    --indigo-10:   rgba(129,140,248,0.10);
    --indigo-20:   rgba(129,140,248,0.18);
    --r:           16px;
    --r-sm:        10px;
    --r-xs:        7px;
  }

  .perf-section {
    background: var(--surface);
    border: 1px solid var(--border-med);
    border-radius: var(--r);
    padding: 26px 26px 24px;
    position: relative;
    overflow: hidden;
    margin-top: 24px;
  }

  .perf-section::after {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    pointer-events: none;
  }

  .perf-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
    pointer-events: none;
    z-index: 0;
  }

  .perf-section > * { position: relative; z-index: 1; }

  .perf-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  .perf-eyebrow-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--amber);
    box-shadow: 0 0 6px var(--amber-glow);
    animation: perf-pulse 2s ease-in-out infinite;
  }

  @keyframes perf-pulse {
    0%,100% { opacity:1; box-shadow: 0 0 6px var(--amber-glow); }
    50%      { opacity:.5; box-shadow: 0 0 12px var(--amber-glow); }
  }

  .perf-eyebrow-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--txt-3);
    font-family: 'Inter', sans-serif;
  }

  .perf-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .perf-mc {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 22px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: border-color .3s, background .3s, transform .25s, box-shadow .3s;
  }

  .perf-mc:hover {
    background: var(--surface-3);
    border-color: var(--border-hi);
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0,0,0,.5);
  }

  .perf-mc-glow {
    position: absolute;
    top: -24px; right: -24px;
    width: 96px; height: 96px;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0.6;
    transition: opacity .3s;
  }

  .perf-mc:hover .perf-mc-glow { opacity: 1; }

  .perf-mc::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: var(--perf-shimmer, transparent);
    opacity: 0;
    transition: opacity .3s;
  }

  .perf-mc:hover::before { opacity: 1; }

  .perf-mc-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }

  .perf-mc-icon {
    width: 36px; height: 36px;
    border-radius: var(--r-sm);
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
  }

  .perf-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 99px;
    border: 1px solid;
  }

  .perf-mc-value {
    font-family: 'Inter', sans-serif;
    font-size: 38px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -1.5px;
    position: relative;
    z-index: 1;
  }

  .perf-mc-labels {
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
    z-index: 1;
  }

  .perf-mc-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--txt-2);
    font-family: 'Inter', sans-serif;
  }

  .perf-mc-unit {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--txt-3);
    letter-spacing: .02em;
  }

  .pt-emerald .perf-mc-icon  { background: var(--emerald-10); border-color: var(--emerald-20); }
  .pt-emerald .perf-badge    { background: var(--emerald-10); border-color: var(--emerald-20); color: var(--emerald); }
  .pt-emerald .perf-mc-value { color: var(--emerald); }
  .pt-emerald .perf-mc-glow  { background: radial-gradient(circle, var(--emerald-10), transparent 70%); }
  .pt-emerald                { --perf-shimmer: linear-gradient(90deg,transparent,var(--emerald-20),transparent); }

  .pt-amber .perf-mc-icon    { background: var(--amber-10); border-color: var(--amber-20); }
  .pt-amber .perf-badge      { background: var(--amber-10); border-color: var(--amber-20); color: var(--amber); }
  .pt-amber .perf-mc-value   { color: var(--amber); }
  .pt-amber .perf-mc-glow    { background: radial-gradient(circle, var(--amber-10), transparent 70%); }
  .pt-amber                  { --perf-shimmer: linear-gradient(90deg,transparent,var(--amber-20),transparent); }

  .pt-rose .perf-mc-icon     { background: var(--rose-10); border-color: var(--rose-20); }
  .pt-rose .perf-badge       { background: var(--rose-10); border-color: var(--rose-20); color: var(--rose); }
  .pt-rose .perf-mc-value    { color: var(--rose); }
  .pt-rose .perf-mc-glow     { background: radial-gradient(circle, var(--rose-10), transparent 70%); }
  .pt-rose                   { --perf-shimmer: linear-gradient(90deg,transparent,var(--rose-20),transparent); }

  .pt-sky .perf-mc-icon      { background: var(--sky-10); border-color: var(--sky-20); }
  .pt-sky .perf-badge        { background: var(--sky-10); border-color: var(--sky-20); color: var(--sky); }
  .pt-sky .perf-mc-value     { color: var(--sky); }
  .pt-sky .perf-mc-glow      { background: radial-gradient(circle, var(--sky-10), transparent 70%); }
  .pt-sky                    { --perf-shimmer: linear-gradient(90deg,transparent,var(--sky-20),transparent); }

  .pt-indigo .perf-mc-icon   { background: var(--indigo-10); border-color: var(--indigo-20); }
  .pt-indigo .perf-badge     { background: var(--indigo-10); border-color: var(--indigo-20); color: var(--indigo); }
  .pt-indigo .perf-mc-value  { color: var(--indigo); }
  .pt-indigo .perf-mc-glow   { background: radial-gradient(circle, var(--indigo-10), transparent 70%); }
  .pt-indigo                 { --perf-shimmer: linear-gradient(90deg,transparent,var(--indigo-20),transparent); }

  @media (max-width: 768px) {
    .perf-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

/* -- PerfMetricCard -- */
const PerfMetricCard = ({ theme, icon, badge, value, title, unit }) => (
  <div className={`perf-mc pt-${theme}`}>
    <div className="perf-mc-glow" />
    <div className="perf-mc-top">
      <div className="perf-mc-icon">{icon}</div>
      {badge && <span className="perf-badge">{badge}</span>}
    </div>
    <div className="perf-mc-value">{value}</div>
    <div className="perf-mc-labels">
      <span className="perf-mc-title">{title}</span>
      {unit && <span className="perf-mc-unit">{unit}</span>}
    </div>
  </div>
);

export const HomePage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Report unlock states
  const [isReportUnlocked, setIsReportUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUrl('');
    setIsReportUnlocked(false);
    setShowUnlockModal(false);
    setUserInfo(null);
  };

  const handleUnlockReport = (userDetails) => {
    setUserInfo(userDetails);
    setIsReportUnlocked(true);
    setShowUnlockModal(false);
  };

  const handleDownloadPDF = () => downloadAuditPDF(result);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await auditAPI.createAudit(url);

      if (response.status === 'completed' && response.result) {
        setResult(response.result);
        toast.success('Audit completed!');
      } else if (response.status === 'failed') {
        setError(response.error_message);
        toast.error('Audit failed: ' + response.error_message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error_message || error.message || 'Failed to start audit';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Ref attached to the first locked section – triggers modal on scroll-into-view
  const lockedSectionRef = useRef(null);
  useEffect(() => {
    if (!result || isReportUnlocked) return;
    const el = lockedSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowUnlockModal(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [result, isReportUnlocked]);

  // -- Results view --
  if (result) {
    const respTime       = result.performance?.response_time_ms ?? 0;
    const pageSizeMB     = (result.performance?.page_size_bytes / (1024 * 1024) || 0).toFixed(2);
    const totalReqs      = result.performance?.total_requests ?? 0;
    const mobileFriendly = result.mobile?.is_mobile_friendly;

    const respTheme = respTime < 800 ? 'emerald' : respTime < 2000 ? 'amber' : 'rose';
    const respBadge = respTime < 800 ? 'Fast'    : respTime < 2000 ? 'Moderate' : 'Slow';

    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
        <style>{perfCSS}</style>

        {/* Unlock Modal */}
        <UnlockReportModal
          isOpen={showUnlockModal}
          onUnlock={handleUnlockReport}
          websiteUrl={result?.url}
          taskId={null}
          onClose={() => setShowUnlockModal(false)}
        />

        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <button
              onClick={handleReset}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition mb-4 inline-block"
            >
              &larr; New Audit
            </button>
            <h1 className="text-4xl font-bold mb-2">Website Audit Report</h1>
            <p className="text-gray-400">{result.url}</p>
            <p className="text-xs text-gray-500 mt-2">
              Analysis completed in {result.analysis_duration_seconds?.toFixed(2)} seconds
            </p>
            {isReportUnlocked && userInfo && (
              <div className="mt-4 p-3 bg-green-900 bg-opacity-30 border border-green-700 border-opacity-50 rounded-lg inline-block">
                <p className="text-green-400 text-sm">
                  ✅ Report unlocked for <strong>{userInfo.user_name}</strong> · {userInfo.phone_number}
                </p>
              </div>
            )}
          </motion.div>

          {/* Overview – always fully visible */}
          <OverviewSection result={result} />

          {/* Unlock banner – shown when locked */}
          {!isReportUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '24px',
                padding: '20px 24px',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
                border: '1px solid rgba(99,102,241,0.4)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>🔒</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '15px', color: '#e8ecf4' }}>Full report is locked</p>
                  <p style={{ fontSize: '12px', color: 'rgba(232,236,244,0.55)', marginTop: '2px' }}>
                    Enter your name &amp; mobile number to unlock SEO, Security, Links, Images &amp; Performance sections
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUnlockModal(true)}
                style={{
                  padding: '10px 22px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                🔓 Unlock Full Report
              </button>
            </motion.div>
          )}

          {/* SEO, Security, Links, Images – blurred when locked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginTop: '24px' }}>

            {/* SEO – ref here so IntersectionObserver fires when this scrolls into view */}
            <div ref={lockedSectionRef} className="lg:col-span-2" style={{ position: 'relative' }}>
              <div style={!isReportUnlocked ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
                <SEOSection result={result} />
              </div>
              {!isReportUnlocked && (
                <div
                  onClick={() => setShowUnlockModal(true)}
                  style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: 'rgba(7,9,15,0.45)',
                    borderRadius: '16px', cursor: 'pointer', zIndex: 10,
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#fff' }}>
                    <div style={{ fontSize: '32px' }}>🔒</div>
                    <p style={{ fontWeight: 700, marginTop: '8px', fontSize: '14px' }}>Unlock to view SEO Analysis</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '4px' }}>Enter your name &amp; mobile number</p>
                  </div>
                </div>
              )}
            </div>

            {/* Security */}
            <div style={{ position: 'relative' }}>
              <div style={!isReportUnlocked ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
                <SecuritySection result={result} />
              </div>
              {!isReportUnlocked && (
                <div
                  onClick={() => setShowUnlockModal(true)}
                  style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: 'rgba(7,9,15,0.45)',
                    borderRadius: '16px', cursor: 'pointer', zIndex: 10,
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#fff' }}>
                    <div style={{ fontSize: '32px' }}>🔒</div>
                    <p style={{ fontWeight: 700, marginTop: '8px', fontSize: '14px' }}>Unlock to view Security</p>
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="lg:col-span-2" style={{ position: 'relative' }}>
              <div style={!isReportUnlocked ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
                <LinksSection result={result} />
              </div>
              {!isReportUnlocked && (
                <div
                  onClick={() => setShowUnlockModal(true)}
                  style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: 'rgba(7,9,15,0.45)',
                    borderRadius: '16px', cursor: 'pointer', zIndex: 10,
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#fff' }}>
                    <div style={{ fontSize: '32px' }}>🔒</div>
                    <p style={{ fontWeight: 700, marginTop: '8px', fontSize: '14px' }}>Unlock to view Links Analysis</p>
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="lg:col-span-2" style={{ position: 'relative' }}>
              <div style={!isReportUnlocked ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
                <ImagesSection result={result} />
              </div>
              {!isReportUnlocked && (
                <div
                  onClick={() => setShowUnlockModal(true)}
                  style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: 'rgba(7,9,15,0.45)',
                    borderRadius: '16px', cursor: 'pointer', zIndex: 10,
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#fff' }}>
                    <div style={{ fontSize: '32px' }}>🔒</div>
                    <p style={{ fontWeight: 700, marginTop: '8px', fontSize: '14px' }}>Unlock to view Images Analysis</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Performance Details – blurred when locked */}
          <div style={{ position: 'relative' }}>
            <div style={!isReportUnlocked ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
              <div className="perf-section">
            <div className="perf-header">
              <div className="perf-eyebrow-dot" />
              <span className="perf-eyebrow-label">Performance Details</span>
            </div>

            <div className="perf-grid">
              <PerfMetricCard
                theme={respTheme}
                icon={<span>&#9889;</span>}
                badge={respBadge}
                value={respTime}
                title="Response Time"
                unit="milliseconds"
              />
              <PerfMetricCard
                theme="sky"
                icon={<span>&#128230;</span>}
                badge="Size"
                value={pageSizeMB}
                title="Page Size"
                unit="megabytes"
              />
              <PerfMetricCard
                theme="indigo"
                icon={<span>&#128260;</span>}
                badge="Requests"
                value={totalReqs}
                title="Total Requests"
                unit="HTTP requests"
              />
              <PerfMetricCard
                theme={mobileFriendly ? 'emerald' : 'rose'}
                icon={<span>&#128241;</span>}
                badge={mobileFriendly ? 'Responsive' : 'Not Responsive'}
                value={mobileFriendly ? '\u2713' : '\u2717'}
                title="Mobile Friendly"
                unit={mobileFriendly ? 'Viewport optimised' : 'Layout issues detected'}
              />
            </div>

            {/* Request Breakdown */}
            <div style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.09)'
            }}>
              <p style={{
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--txt-2)',
                marginBottom: '16px'
              }}>Request Breakdown</p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px'
              }}>
                {[
                  { label: 'Scripts',     value: result.script_requests      ?? 0, color: '#f5a623', bg: 'rgba(245,166,35,0.08)',   border: 'rgba(245,166,35,0.20)',   icon: '\uD83D\uDCDC' },
                  { label: 'Stylesheets', value: result.stylesheet_requests   ?? 0, color: '#00b8f5', bg: 'rgba(0,184,245,0.08)',    border: 'rgba(0,184,245,0.20)',    icon: '\uD83C\uDFA8' },
                  { label: 'Images',      value: result.image_requests        ?? 0, color: '#00e896', bg: 'rgba(0,232,150,0.08)',    border: 'rgba(0,232,150,0.20)',    icon: '\uD83D\uDDBC\uFE0F' },
                  { label: 'Iframes',     value: result.iframe_requests       ?? 0, color: '#818cf8', bg: 'rgba(129,140,248,0.08)',  border: 'rgba(129,140,248,0.20)',  icon: '\uD83D\uDCF1' },
                ].map(({ label, value, color, bg, border, icon }) => (
                  <div key={label} style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: '10px',
                    padding: '14px 16px'
                  }}>
                    <p style={{ fontSize: '11px', color, marginBottom: '6px' }}>{icon} {label}</p>
                    <p style={{ fontSize: '24px', fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </div>{/* end blur wrapper */}
            {!isReportUnlocked && (
              <div
                onClick={() => setShowUnlockModal(true)}
                style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', background: 'rgba(7,9,15,0.45)',
                  borderRadius: '16px', cursor: 'pointer', zIndex: 10,
                }}
              >
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: '32px' }}>🔒</div>
                  <p style={{ fontWeight: 700, marginTop: '8px', fontSize: '14px' }}>Unlock to view Performance Details</p>
                </div>
              </div>
            )}
          </div>{/* end position:relative wrapper */}

          {/* Download button */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            {isReportUnlocked ? (
              <button
                onClick={handleDownloadPDF}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 24px',
                  background: 'var(--emerald)',
                  color: '#07090f',
                  border: 'none',
                  borderRadius: 'var(--r-sm)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,232,150,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                &#8595; Download Report
              </button>
            ) : (
              <button
                onClick={() => setShowUnlockModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 24px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--r-sm)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                🔒 Unlock Report to Download
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  // -- Landing view --
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl w-full"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Website Audit Dashboard
          </motion.h1>

          <p className="text-gray-300 text-lg mb-8">
            Analyze your website in real-time. Get detailed insights on performance, SEO, security, and mobile-friendliness.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="flex-1 px-6 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Analyzing...' : 'Start Audit'}
              </motion.button>
            </div>
          </motion.form>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <LoadingSpinner />
              <p className="text-gray-300 mt-4">Analyzing website...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-4 bg-red-900/20 border border-red-500 rounded-lg"
            >
              <p className="text-red-400 font-semibold">Error</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </motion.div>
          )}

          <motion.p
            className="mt-16 text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            All data is analyzed in real-time from your website. No mock data, just real metrics.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;

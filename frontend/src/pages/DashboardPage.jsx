import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingSpinner, SectionCard } from '../components/UIComponents';
import OverviewSection from '../components/OverviewSection';
import SEOSection from '../components/SEOSection';
import SecuritySection from '../components/SecuritySection';
import LinksSection from '../components/LinksSection';
import ImagesSection from '../components/ImagesSection';
import { auditAPI } from '../api/client';

export const DashboardPage = () => {
  const { taskId } = useParams();
  const [result, setResult] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const taskData = await auditAPI.getTaskStatus(taskId);
        setTask(taskData);

        if (taskData.status === 'completed' && taskData.result) {
          const resultData = await auditAPI.getResult(taskId);
          setResult(resultData);
          setError(null);
        } else if (taskData.status === 'failed') {
          setError(taskData.error_message || 'Audit failed');
        }

        if (taskData.status !== 'completed' && taskData.status !== 'failed') {
          const interval = setInterval(() => {
            setRefreshCount((c) => c + 1);
          }, 3000);
          return () => clearInterval(interval);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId, refreshCount]);

  if (loading && !task) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Analyzing website...</p>
        </div>
      </div>
    );
  }

  if (task?.status === 'processing' || (task?.status !== 'completed' && !result)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Website audit in progress...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg font-semibold">Error</p>
          <p className="text-gray-300 mt-2">{error || 'No results available'}</p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition mb-4 inline-block"
          >
            ← New Audit
          </a>
          <h1 className="text-4xl font-bold mb-2">Website Audit Report</h1>
          <p className="text-gray-400">{result.url}</p>
          <p className="text-xs text-gray-500 mt-2">
            Analysis completed in {result.analysis_duration_seconds?.toFixed(2)} seconds
          </p>
        </motion.div>

        {/* ── All sections in one flex column with consistent 32px gap ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>

          {/* Overview */}
          <OverviewSection result={result} />

          {/* SEO */}
          <SEOSection result={result} />

          {/* Security */}
          <SecuritySection result={result} />

          {/* Links */}
          <LinksSection result={result} />

          {/* Images */}
          <ImagesSection result={result} />

          {/* Performance Details */}
          <SectionCard title="⚡ Performance Details">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Response Time</p>
                <p className="text-xl font-bold text-white">{result.response_time_ms}ms</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Page Size</p>
                <p className="text-xl font-bold text-white">{result.page_size_mb?.toFixed(2)}MB</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Total Requests</p>
                <p className="text-xl font-bold text-white">{result.total_requests}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Mobile Friendly</p>
                <p className={`text-xl font-bold ${result.is_mobile_friendly ? 'text-green-400' : 'text-red-400'}`}>
                  {result.is_mobile_friendly ? '✅' : '❌'}
                </p>
              </div>
            </div>

            {/* Request Breakdown */}
            <div className="mt-6 pt-6 border-t border-gray-600">
              <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide">Request Breakdown</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-orange-900 bg-opacity-30 rounded-lg p-4 border border-orange-700 border-opacity-30">
                  <p className="text-xs text-orange-400 mb-2">📜 Scripts</p>
                  <p className="text-2xl font-bold text-orange-300">{result.script_requests || 0}</p>
                </div>
                <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 border border-blue-700 border-opacity-30">
                  <p className="text-xs text-blue-400 mb-2">🎨 Stylesheets</p>
                  <p className="text-2xl font-bold text-blue-300">{result.stylesheet_requests || 0}</p>
                </div>
                <div className="bg-emerald-900 bg-opacity-30 rounded-lg p-4 border border-emerald-700 border-opacity-30">
                  <p className="text-xs text-emerald-400 mb-2">🖼️ Images</p>
                  <p className="text-2xl font-bold text-emerald-300">{result.image_requests || 0}</p>
                </div>
                <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4 border border-purple-700 border-opacity-30">
                  <p className="text-xs text-purple-400 mb-2">📱 Iframes</p>
                  <p className="text-2xl font-bold text-purple-300">{result.iframe_requests || 0}</p>
                </div>
              </div>
            </div>
          </SectionCard>

        </div>

        {/* Export PDF Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition transform hover:scale-105"
          >
            📥 Download Report (PDF)
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;

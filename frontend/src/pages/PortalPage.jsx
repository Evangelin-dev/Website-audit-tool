import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PortalPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/audit'}/reporter-info/all_submissions/`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
        setError('');
      } else {
        setError('Failed to load submissions');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.user_name.toLowerCase().includes(searchLower) ||
      submission.phone_number.includes(searchTerm) ||
      submission.website_url.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone Number', 'Website URL', 'Submission Date'];
    const rows = filteredSubmissions.map((sub) => [
      sub.user_name,
      sub.phone_number,
      sub.website_url,
      formatDate(sub.submission_date),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-white mt-4">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-2">📋 Audit Submissions Portal</h1>
          <p className="text-gray-400">
            View all user submissions from website audit reports
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-900 bg-opacity-30 border border-blue-700 border-opacity-50 rounded-lg p-6"
          >
            <p className="text-blue-400 text-sm font-medium">Total Submissions</p>
            <p className="text-3xl font-bold text-blue-300 mt-2">{submissions.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-900 bg-opacity-30 border border-green-700 border-opacity-50 rounded-lg p-6"
          >
            <p className="text-green-400 text-sm font-medium">Filtered Results</p>
            <p className="text-3xl font-bold text-green-300 mt-2">{filteredSubmissions.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-purple-900 bg-opacity-30 border border-purple-700 border-opacity-50 rounded-lg p-6"
          >
            <button
              onClick={handleExportCSV}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            >
              📊 Export as CSV
            </button>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Search by name, phone, or website URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Submissions Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th className="px-6 py-4 text-left text-gray-300 font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-gray-300 font-semibold">Phone Number</th>
                <th className="px-6 py-4 text-left text-gray-300 font-semibold">Website URL</th>
                <th className="px-6 py-4 text-left text-gray-300 font-semibold">Submission Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                    {searchTerm ? 'No submissions match your search.' : 'No submissions yet.'}
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 text-white font-medium">{submission.user_name}</td>
                    <td className="px-6 py-4 text-gray-300">{submission.phone_number}</td>
                    <td className="px-6 py-4 text-blue-400 break-all">
                      <a
                        href={submission.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {submission.website_url}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {formatDate(submission.submission_date)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
          >
            ← Back to Audit Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;

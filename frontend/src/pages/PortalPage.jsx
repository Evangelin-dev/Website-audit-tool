import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Map dial codes (longest first) to flag emoji
const DIAL_FLAGS = [
  { dial: '+1242', flag: '🇧🇸' }, { dial: '+1246', flag: '🇧🇧' }, { dial: '+1268', flag: '🇦🇬' },
  { dial: '+1345', flag: '🇰🇾' }, { dial: '+1441', flag: '🇧🇲' }, { dial: '+1473', flag: '🇬🇩' },
  { dial: '+1649', flag: '🇹🇨' }, { dial: '+1664', flag: '🇲🇸' }, { dial: '+1670', flag: '🇲🇵' },
  { dial: '+1671', flag: '🇬🇺' }, { dial: '+1684', flag: '🇦🇸' }, { dial: '+1721', flag: '🇸🇽' },
  { dial: '+1758', flag: '🇱🇨' }, { dial: '+1767', flag: '🇩🇲' }, { dial: '+1784', flag: '🇻🇨' },
  { dial: '+1787', flag: '🇵🇷' }, { dial: '+1809', flag: '🇩🇴' }, { dial: '+1849', flag: '🇩🇴' },
  { dial: '+1868', flag: '🇹🇹' }, { dial: '+1869', flag: '🇰🇳' }, { dial: '+1876', flag: '🇯🇲' },
  { dial: '+1939', flag: '🇵🇷' },
  { dial: '+20', flag: '🇪🇬' }, { dial: '+212', flag: '🇲🇦' }, { dial: '+213', flag: '🇩🇿' },
  { dial: '+216', flag: '🇹🇳' }, { dial: '+218', flag: '🇱🇾' }, { dial: '+220', flag: '🇬🇲' },
  { dial: '+221', flag: '🇸🇳' }, { dial: '+222', flag: '🇲🇷' }, { dial: '+223', flag: '🇲🇱' },
  { dial: '+224', flag: '🇬🇳' }, { dial: '+225', flag: '🇨🇮' }, { dial: '+226', flag: '🇧🇫' },
  { dial: '+227', flag: '🇳🇪' }, { dial: '+228', flag: '🇹🇬' }, { dial: '+229', flag: '🇧🇯' },
  { dial: '+230', flag: '🇲🇺' }, { dial: '+231', flag: '🇱🇷' }, { dial: '+232', flag: '🇸🇱' },
  { dial: '+233', flag: '🇬🇭' }, { dial: '+234', flag: '🇳🇬' }, { dial: '+235', flag: '🇹🇩' },
  { dial: '+236', flag: '🇨🇫' }, { dial: '+237', flag: '🇨🇲' }, { dial: '+238', flag: '🇨🇻' },
  { dial: '+239', flag: '🇸🇹' }, { dial: '+240', flag: '🇬🇶' }, { dial: '+241', flag: '🇬🇦' },
  { dial: '+242', flag: '🇨🇬' }, { dial: '+243', flag: '🇨🇩' }, { dial: '+244', flag: '🇦🇴' },
  { dial: '+245', flag: '🇬🇼' }, { dial: '+246', flag: '🇮🇴' }, { dial: '+247', flag: '🇦🇨' },
  { dial: '+248', flag: '🇸🇨' }, { dial: '+249', flag: '🇸🇩' }, { dial: '+250', flag: '🇷🇼' },
  { dial: '+251', flag: '🇪🇹' }, { dial: '+252', flag: '🇸🇴' }, { dial: '+253', flag: '🇩🇯' },
  { dial: '+254', flag: '🇰🇪' }, { dial: '+255', flag: '🇹🇿' }, { dial: '+256', flag: '🇺🇬' },
  { dial: '+257', flag: '🇧🇮' }, { dial: '+258', flag: '🇲🇿' }, { dial: '+260', flag: '🇿🇲' },
  { dial: '+261', flag: '🇲🇬' }, { dial: '+262', flag: '🇷🇪' }, { dial: '+263', flag: '🇿🇼' },
  { dial: '+264', flag: '🇳🇦' }, { dial: '+265', flag: '🇲🇼' }, { dial: '+266', flag: '🇱🇸' },
  { dial: '+267', flag: '🇧🇼' }, { dial: '+268', flag: '🇸🇿' }, { dial: '+269', flag: '🇰🇲' },
  { dial: '+27', flag: '🇿🇦' }, { dial: '+290', flag: '🇸🇭' }, { dial: '+291', flag: '🇪🇷' },
  { dial: '+297', flag: '🇦🇼' }, { dial: '+298', flag: '🇫🇴' }, { dial: '+299', flag: '🇬🇱' },
  { dial: '+30', flag: '🇬🇷' }, { dial: '+31', flag: '🇳🇱' }, { dial: '+32', flag: '🇧🇪' },
  { dial: '+33', flag: '🇫🇷' }, { dial: '+34', flag: '🇪🇸' }, { dial: '+350', flag: '🇬🇮' },
  { dial: '+351', flag: '🇵🇹' }, { dial: '+352', flag: '🇱🇺' }, { dial: '+353', flag: '🇮🇪' },
  { dial: '+354', flag: '🇮🇸' }, { dial: '+355', flag: '🇦🇱' }, { dial: '+356', flag: '🇲🇹' },
  { dial: '+357', flag: '🇨🇾' }, { dial: '+358', flag: '🇫🇮' }, { dial: '+359', flag: '🇧🇬' },
  { dial: '+36', flag: '🇭🇺' }, { dial: '+370', flag: '🇱🇹' }, { dial: '+371', flag: '🇱🇻' },
  { dial: '+372', flag: '🇪🇪' }, { dial: '+373', flag: '🇲🇩' }, { dial: '+374', flag: '🇦🇲' },
  { dial: '+375', flag: '🇧🇾' }, { dial: '+376', flag: '🇦🇩' }, { dial: '+377', flag: '🇲🇨' },
  { dial: '+378', flag: '🇸🇲' }, { dial: '+380', flag: '🇺🇦' }, { dial: '+381', flag: '🇷🇸' },
  { dial: '+382', flag: '🇲🇪' }, { dial: '+385', flag: '🇭🇷' }, { dial: '+386', flag: '🇸🇮' },
  { dial: '+387', flag: '🇧🇦' }, { dial: '+389', flag: '🇲🇰' }, { dial: '+39', flag: '🇮🇹' },
  { dial: '+40', flag: '🇷🇴' }, { dial: '+41', flag: '🇨🇭' }, { dial: '+420', flag: '🇨🇿' },
  { dial: '+421', flag: '🇸🇰' }, { dial: '+423', flag: '🇱🇮' }, { dial: '+43', flag: '🇦🇹' },
  { dial: '+44', flag: '🇬🇧' }, { dial: '+45', flag: '🇩🇰' }, { dial: '+46', flag: '🇸🇪' },
  { dial: '+47', flag: '🇳🇴' }, { dial: '+48', flag: '🇵🇱' }, { dial: '+49', flag: '🇩🇪' },
  { dial: '+500', flag: '🇫🇰' }, { dial: '+501', flag: '🇧🇿' }, { dial: '+502', flag: '🇬🇹' },
  { dial: '+503', flag: '🇸🇻' }, { dial: '+504', flag: '🇭🇳' }, { dial: '+505', flag: '🇳🇮' },
  { dial: '+506', flag: '🇨🇷' }, { dial: '+507', flag: '🇵🇦' }, { dial: '+508', flag: '🇵🇲' },
  { dial: '+509', flag: '🇭🇹' }, { dial: '+51', flag: '🇵🇪' }, { dial: '+52', flag: '🇲🇽' },
  { dial: '+53', flag: '🇨🇺' }, { dial: '+54', flag: '🇦🇷' }, { dial: '+55', flag: '🇧🇷' },
  { dial: '+56', flag: '🇨🇱' }, { dial: '+57', flag: '🇨🇴' }, { dial: '+58', flag: '🇻🇪' },
  { dial: '+591', flag: '🇧🇴' }, { dial: '+592', flag: '🇬🇾' }, { dial: '+593', flag: '🇪🇨' },
  { dial: '+594', flag: '🇬🇫' }, { dial: '+595', flag: '🇵🇾' }, { dial: '+596', flag: '🇲🇶' },
  { dial: '+597', flag: '🇸🇷' }, { dial: '+598', flag: '🇺🇾' }, { dial: '+599', flag: '🇨🇼' },
  { dial: '+60', flag: '🇲🇾' }, { dial: '+61', flag: '🇦🇺' }, { dial: '+62', flag: '🇮🇩' },
  { dial: '+63', flag: '🇵🇭' }, { dial: '+64', flag: '🇳🇿' }, { dial: '+65', flag: '🇸🇬' },
  { dial: '+66', flag: '🇹🇭' }, { dial: '+670', flag: '🇹🇱' }, { dial: '+672', flag: '🇳🇫' },
  { dial: '+673', flag: '🇧🇳' }, { dial: '+674', flag: '🇳🇷' }, { dial: '+675', flag: '🇵🇬' },
  { dial: '+676', flag: '🇹🇴' }, { dial: '+677', flag: '🇸🇧' }, { dial: '+678', flag: '🇻🇺' },
  { dial: '+679', flag: '🇫🇯' }, { dial: '+680', flag: '🇵🇼' }, { dial: '+681', flag: '🇼🇫' },
  { dial: '+682', flag: '🇨🇰' }, { dial: '+683', flag: '🇳🇺' }, { dial: '+685', flag: '🇼🇸' },
  { dial: '+686', flag: '🇰🇮' }, { dial: '+687', flag: '🇳🇨' }, { dial: '+688', flag: '🇹🇻' },
  { dial: '+689', flag: '🇵🇫' }, { dial: '+690', flag: '🇹🇰' }, { dial: '+691', flag: '🇫🇲' },
  { dial: '+692', flag: '🇲🇭' }, { dial: '+7', flag: '🇷🇺' }, { dial: '+77', flag: '🇰🇿' },
  { dial: '+81', flag: '🇯🇵' }, { dial: '+82', flag: '🇰🇷' }, { dial: '+84', flag: '🇻🇳' },
  { dial: '+850', flag: '🇰🇵' }, { dial: '+852', flag: '🇭🇰' }, { dial: '+853', flag: '🇲🇴' },
  { dial: '+855', flag: '🇰🇭' }, { dial: '+856', flag: '🇱🇦' }, { dial: '+86', flag: '🇨🇳' },
  { dial: '+880', flag: '🇧🇩' }, { dial: '+886', flag: '🇹🇼' }, { dial: '+90', flag: '🇹🇷' },
  { dial: '+91', flag: '🇮🇳' }, { dial: '+92', flag: '🇵🇰' }, { dial: '+93', flag: '🇦🇫' },
  { dial: '+94', flag: '🇱🇰' }, { dial: '+95', flag: '🇲🇲' }, { dial: '+960', flag: '🇲🇻' },
  { dial: '+961', flag: '🇱🇧' }, { dial: '+962', flag: '🇯🇴' }, { dial: '+963', flag: '🇸🇾' },
  { dial: '+964', flag: '🇮🇶' }, { dial: '+965', flag: '🇰🇼' }, { dial: '+966', flag: '🇸🇦' },
  { dial: '+967', flag: '🇾🇪' }, { dial: '+968', flag: '🇴🇲' }, { dial: '+970', flag: '🇵🇸' },
  { dial: '+971', flag: '🇦🇪' }, { dial: '+972', flag: '🇮🇱' }, { dial: '+973', flag: '🇧🇭' },
  { dial: '+974', flag: '🇶🇦' }, { dial: '+975', flag: '🇧🇹' }, { dial: '+976', flag: '🇲🇳' },
  { dial: '+977', flag: '🇳🇵' }, { dial: '+98', flag: '🇮🇷' }, { dial: '+992', flag: '🇹🇯' },
  { dial: '+993', flag: '🇹🇲' }, { dial: '+994', flag: '🇦🇿' }, { dial: '+995', flag: '🇬🇪' },
  { dial: '+996', flag: '🇰🇬' }, { dial: '+998', flag: '🇺🇿' },
  { dial: '+1', flag: '🇺🇸' },
];

// Match longest dial code first
const getFlagFromPhone = (phone) => {
  if (!phone || !phone.startsWith('+')) return '';
  const sorted = [...DIAL_FLAGS].sort((a, b) => b.dial.length - a.dial.length);
  const match = sorted.find((d) => phone.startsWith(d.dial));
  return match ? match.flag : '';
};

const PortalPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions(currentPage);
  }, [currentPage, pageSize]);

  const fetchSubmissions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/reporter-info/all_submissions/?page=${page}&page_size=${pageSize}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.results || []);
        setTotalCount(data.count || 0);
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
      submission.email?.toLowerCase().includes(searchLower) ||
      submission.phone_number.includes(searchTerm) ||
      submission.website_url.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone Number', 'Website URL', 'Submission Date'];
    const rows = filteredSubmissions.map((sub) => [
      sub.user_name,
      sub.email || '',
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
          className="mb-8 sm:mb-10"
        >
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">📋 Submissions Portal</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            View all user submissions from website audits
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-900 bg-opacity-30 border border-blue-700 border-opacity-50 rounded-lg p-4 sm:p-6"
          >
            <p className="text-blue-400 text-xs sm:text-sm font-medium">Total Submissions</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-300 mt-2">{totalCount}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-900 bg-opacity-30 border border-green-700 border-opacity-50 rounded-lg p-4 sm:p-6"
          >
            <p className="text-green-400 text-xs sm:text-sm font-medium">Current Page</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-300 mt-2">{currentPage} / {totalPages}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-purple-900 bg-opacity-30 border border-purple-700 border-opacity-50 rounded-lg p-4 sm:p-6"
          >
            <button
              onClick={handleExportCSV}
              className="w-full px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm sm:text-base"
            >
              📊 Export CSV
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
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 sm:px-6 py-3 bg-gray-800 border border-gray-700 text-white text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="overflow-x-auto border border-gray-700 rounded-lg"
        >
          <table className="w-full border-collapse min-w-max sm:min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-700 bg-gray-800">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-300 font-semibold text-xs sm:text-sm">Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-300 font-semibold text-xs sm:text-sm hidden md:table-cell">Email</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-300 font-semibold text-xs sm:text-sm">Phone</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-300 font-semibold text-xs sm:text-sm hidden lg:table-cell">Website</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-300 font-semibold text-xs sm:text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 sm:px-6 py-6 sm:py-8 text-center text-gray-400 text-sm">
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
                    className="border-b border-gray-700 hover:bg-gray-800 transition text-xs sm:text-sm"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-medium truncate">{submission.user_name}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 hidden md:table-cell truncate">{submission.email || '—'}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 truncate">
                      <span className="inline-flex items-center gap-1.5">
                        {getFlagFromPhone(submission.phone_number) && (
                          <span className="text-base leading-none" title={submission.phone_number}>
                            {getFlagFromPhone(submission.phone_number)}
                          </span>
                        )}
                        <span>{submission.phone_number}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-blue-400 break-all hidden lg:table-cell">
                      <a
                        href={submission.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-xs sm:text-sm"
                      >
                        {submission.website_url.length > 30
                          ? submission.website_url.substring(0, 30) + '...'
                          : submission.website_url}
                      </a>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(submission.submission_date).split(',')[0]}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 sm:mt-8 flex items-center justify-between gap-2 overflow-x-auto"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition text-xs sm:text-base whitespace-nowrap ${
              currentPage === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            ← Prev
          </button>

          <div className="flex items-center gap-1">
            {[1, 2, 3].includes(currentPage) && totalPages > 5 && (
              <>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 sm:px-3 py-2 rounded-lg font-semibold transition text-xs sm:text-sm ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 5 && <span className="px-2 text-gray-400 text-xs">…</span>}
              </>
            )}

            {currentPage > 3 && currentPage < totalPages - 2 && (
              <>
                {currentPage > 4 && <span className="px-2 text-gray-400 text-xs">…</span>}
                {[currentPage - 1, currentPage, currentPage + 1].map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 sm:px-3 py-2 rounded-lg font-semibold transition text-xs sm:text-sm ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {currentPage < totalPages - 3 && <span className="px-2 text-gray-400 text-xs">…</span>}
              </>
            )}

            {[totalPages - 2, totalPages - 1, totalPages].includes(currentPage) && totalPages > 5 && (
              <>
                <span className="px-2 text-gray-400 text-xs">…</span>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => totalPages - 4 + i)
                  .filter((page) => page > 0)
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 sm:px-3 py-2 rounded-lg font-semibold transition text-xs sm:text-sm ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
              </>
            )}

            {totalPages <= 5 && (
              <>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 sm:px-3 py-2 rounded-lg font-semibold transition text-xs sm:text-sm ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition text-xs sm:text-base whitespace-nowrap ${
              currentPage === totalPages
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Next →
          </button>
        </motion.div>

        {/* Page Info */}
        <div className="mt-3 sm:mt-4 text-center text-gray-400 text-xs sm:text-sm">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium transition"
          >
            ← Back to Audit Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const UnlockReportModal = ({ isOpen, onUnlock, websiteUrl, taskId, onClose }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone_number: '',
    website_url: websiteUrl || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.user_name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (formData.phone_number.trim().length < 10) {
      setError('Phone number must be at least 10 digits');
      return false;
    }
    if (!formData.website_url.trim()) {
      setError('Website URL is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/reporter-info/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: formData.user_name,
          email: formData.email,
          phone_number: formData.phone_number,
          website_url: formData.website_url,
          task: taskId || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Call onUnlock callback to unlock the report
        onUnlock({
          id: data.id,
          user_name: data.user_name,
          email: data.email,
          phone_number: data.phone_number,
          website_url: data.website_url,
          submission_date: data.submission_date,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to unlock report. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-gray-700"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">🔓 Unlock Report</h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Enter your details to access the full audit report
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition flex-shrink-0"
              title="Close"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="user_name" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              placeholder=""
              className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border text-white text-sm rounded-lg focus:outline-none focus:ring-2 ${
                error && !formData.user_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder=""
              className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border text-white text-sm rounded-lg focus:outline-none focus:ring-2 ${
                error && !formData.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone_number" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder=""
              className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border text-white text-sm rounded-lg focus:outline-none focus:ring-2 ${
                error && !formData.phone_number ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
          </div>

          {/* Website URL Field */}
          <div>
            <label htmlFor="website_url" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              Website URL
            </label>
            <input
              type="url"
              id="website_url"
              name="website_url"
              value={formData.website_url}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border text-white text-sm rounded-lg focus:outline-none focus:ring-2 ${
                error && !formData.website_url ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-2 sm:p-3">
              <p className="text-red-400 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 sm:mt-6 py-2 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition ${
              loading
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
            }`}
          >
            {loading ? 'Processing...' : '🔓 Unlock Report'}
          </button>
        </form>

        {/* Note */}
        <p className="text-gray-500 text-xs mt-3 sm:mt-4 text-center">
          Your information will be securely saved and used only for report access verification.
        </p>
      </motion.div>
    </div>
  );
};

export default UnlockReportModal;

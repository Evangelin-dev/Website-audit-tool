import React from 'react';
import { motion } from 'framer-motion';

export const MetricCard = ({ title, value, unit, icon, color = 'blue' }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colors[color]} rounded-xl shadow-lg p-6 text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">
            {value}
            <span className="text-lg ml-1">{unit}</span>
          </p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
      </div>
    </motion.div>
  );
};

export const ScoreCircle = ({ score, label, color = 'blue', size = 'md' }) => {
  const sizeStyles = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const colors_ = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    red: 'from-red-400 to-red-600',
    yellow: 'from-yellow-400 to-yellow-600',
    purple: 'from-purple-400 to-purple-600',
  };

  const getColorClass = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${sizeStyles[size]} flex items-center justify-center`}
    >
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${colors_[color]} p-1 flex items-center justify-center`}>
        <div className="w-full h-full rounded-full bg-gray-900 flex flex-col items-center justify-center">
          <p className={`text-4xl font-bold ${getColorClass(score)}`}>{score}</p>
          <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const LoadingSpinner = () => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
    />
  );
};

export const SectionCard = ({ title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700"
    >
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  );
};

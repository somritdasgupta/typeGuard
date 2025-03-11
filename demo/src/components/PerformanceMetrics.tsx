import React from 'react';

interface PerformanceMetricsProps {
  metrics?: {
    duration: number;
    memoryUsage: number;
    operationsCount?: number;
    jsonSize?: number;
    validationRate?: number;
  };
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  metrics,
}) => {
  if (!metrics) {
    return (
      <div className="bg-gray-800 p-4 rounded-md">
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          <div>Run validation to see performance metrics</div>
        </div>
      </div>
    );
  }

  // Format functions
  const formatMemory = (bytes: number): string => {
    if (bytes === 0) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  const formatSize = (bytes: number): string => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  // Removed the unused formatRate function

  return (
    <div className="bg-gray-800 border-l-4 border-blue-500 p-4 rounded-md">
      <div className="flex items-center mb-3">
        <svg
          className="h-5 w-5 mr-2 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium text-white">
          Your Validation Performance
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="bg-gray-750 p-2 rounded">
          <div className="text-gray-400 text-xs uppercase mb-1">Duration</div>
          <div className="text-white text-sm font-mono">
            {metrics.duration.toFixed(2)} ms
          </div>
        </div>
        <div className="bg-gray-750 p-2 rounded">
          <div className="text-gray-400 text-xs uppercase mb-1">Memory</div>
          <div className="text-white text-sm font-mono">
            {formatMemory(metrics.memoryUsage)}
          </div>
        </div>
        {metrics.operationsCount && (
          <div className="bg-gray-750 p-2 rounded">
            <div className="text-gray-400 text-xs uppercase mb-1">
              Operations
            </div>
            <div className="text-white text-sm font-mono">
              {metrics.operationsCount.toLocaleString()}
            </div>
          </div>
        )}
        {metrics.jsonSize && (
          <div className="bg-gray-750 p-2 rounded">
            <div className="text-gray-400 text-xs uppercase mb-1">
              Data Size
            </div>
            <div className="text-white text-sm font-mono">
              {formatSize(metrics.jsonSize)}
            </div>
          </div>
        )}
        {metrics.validationRate && (
          <div className="bg-gray-750 p-2 rounded">
            <div className="text-gray-400 text-xs uppercase mb-1">
              Processing Rate
            </div>
            <div className="text-white text-sm font-mono">
              {((metrics.validationRate * 1000) / 1024).toFixed(2)} KB/s
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

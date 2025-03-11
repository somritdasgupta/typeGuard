import React from 'react';

interface ValidationResultProps {
  result: {
    isValid: boolean;
    errors?: string[];
    performance?: {
      duration: number;
      memoryUsage: number;
    };
  };
}

export const ValidationResult: React.FC<ValidationResultProps> = ({
  result,
}) => {
  if (result.isValid === undefined) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        <div>Waiting for input...</div>
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div
        className={`p-3 flex items-center ${
          result.isValid
            ? 'bg-green-900/20 border-l-4 border-green-500'
            : 'bg-red-900/20 border-l-4 border-red-500'
        }`}
      >
        <div className="flex-shrink-0">
          {result.isValid ? (
            <svg
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p className="font-medium">
            {result.isValid ? 'Valid data structure' : 'Validation failed'}
          </p>
          <p className="text-xs mt-1 text-gray-400">
            {result.isValid
              ? 'Data matches the defined type structure'
              : 'Data does not match expected type structure'}
          </p>
        </div>
      </div>

      {result.errors && result.errors.length > 0 && (
        <div className="mt-3">
          <div className="bg-gray-800 text-gray-300 text-xs font-medium py-1 px-3 border-b border-gray-700">
            Error Details ({result.errors.length})
          </div>
          <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
            <div className="bg-gray-800 text-red-300 p-3 text-xs font-mono">
              {result.errors.map((error, index) => (
                <div key={index} className="pb-1">
                  <span className="text-red-500 mr-1">→</span>
                  {error}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {result.isValid && (
        <div className="bg-gray-800 border-l-4 border-green-500 p-3 mt-3 text-xs text-gray-300">
          <div className="flex items-center mb-2">
            <svg
              className="h-4 w-4 mr-1 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Validation successful</span>
          </div>
          <p>
            All fields match your type definition. Your data is safe to use in
            your TypeScript application with full type safety.
          </p>
        </div>
      )}
    </div>
  );
};

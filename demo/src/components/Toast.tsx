import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  visible: boolean;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  visible,
  onDismiss,
  actionLabel,
  onAction,
}) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    let dismissTimer: ReturnType<typeof setTimeout>;

    if (visible) {
      dismissTimer = setTimeout(() => {
        setIsLeaving(true);
      }, duration - 500);

      const autoHideTimer = setTimeout(() => {
        onDismiss();
        setIsLeaving(false);
      }, duration);

      return () => {
        clearTimeout(dismissTimer);
        clearTimeout(autoHideTimer);
      };
    }
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  const typeClasses = {
    info: 'bg-gray-900/95 border-blue-500',
    success: 'bg-gray-900/95 border-green-500',
    warning: 'bg-gray-900/95 border-yellow-500',
    error: 'bg-gray-900/95 border-red-500',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex transition-all duration-500">
      <div
        className={`${
          typeClasses[type]
        } border-l-4 shadow-lg rounded-lg max-w-md flex items-center ${
          isLeaving ? 'opacity-0 translate-y-[-10px]' : 'opacity-100'
        }`}
      >
        <div className="p-4 flex items-center space-x-3">
          <div className="flex-shrink-0">
            {type === 'success' && (
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 flex items-center justify-between">
            <p className="text-sm text-white font-medium">{message}</p>
            {actionLabel && (
              <button
                onClick={onAction}
                className="ml-4 text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                {actionLabel}
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setIsLeaving(true);
              setTimeout(onDismiss, 300);
            }}
            className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

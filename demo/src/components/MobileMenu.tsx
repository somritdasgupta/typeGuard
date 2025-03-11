import React from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeNavSection: string;
  onSectionChange: (section: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeNavSection,
  onSectionChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-850 p-4 rounded-t-xl shadow-lg max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Navigation</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Editors</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`p-3 rounded-md text-left text-sm ${
                  activeNavSection === 'typeEditor'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => {
                  onSectionChange('typeEditor');
                  onClose();
                }}
              >
                <div className="font-medium">Type Definition</div>
                <div className="text-xs opacity-75">TypeScript Interface</div>
              </button>
              <button
                className={`p-3 rounded-md text-left text-sm ${
                  activeNavSection === 'jsonEditor'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => {
                  onSectionChange('jsonEditor');
                  onClose();
                }}
              >
                <div className="font-medium">JSON Input</div>
                <div className="text-xs opacity-75">Data to Validate</div>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-400 mb-2">Results & Info</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`p-3 rounded-md text-left text-sm ${
                  activeNavSection === 'results'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => {
                  onSectionChange('results');
                  onClose();
                }}
              >
                <div className="font-medium">Results</div>
                <div className="text-xs opacity-75">Validation Output</div>
              </button>
              <button
                className={`p-3 rounded-md text-left text-sm ${
                  activeNavSection === 'performance'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => {
                  onSectionChange('performance');
                  onClose();
                }}
              >
                <div className="font-medium">Performance</div>
                <div className="text-xs opacity-75">Speed & Memory</div>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-400 mb-2">Documentation</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`p-3 rounded-md text-left text-sm ${
                  activeNavSection === 'guide'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => {
                  onSectionChange('guide');
                  onClose();
                }}
              >
                <div className="font-medium">User Guide</div>
                <div className="text-xs opacity-75">How to Use</div>
              </button>
              <button
                className={`p-3 rounded-md text-left text-sm ${
                  activeNavSection === 'constraints'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => {
                  onSectionChange('constraints');
                  onClose();
                }}
              >
                <div className="font-medium">Constraints</div>
                <div className="text-xs opacity-75">Validation Rules</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

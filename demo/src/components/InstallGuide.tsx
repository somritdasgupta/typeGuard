import React, { useState } from 'react';

export const InstallGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'npm' | 'yarn' | 'pnpm'>('npm');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h2 className="text-base font-medium">Installation</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Add Type Guard Pro to your project
        </p>
      </div>
      <div className="p-4">
        {/* Tab buttons */}
        <div className="flex mb-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('npm')}
            className={`py-2 px-4 text-sm font-medium mr-2 ${
              activeTab === 'npm'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            npm
          </button>
          <button
            onClick={() => setActiveTab('yarn')}
            className={`py-2 px-4 text-sm font-medium mr-2 ${
              activeTab === 'yarn'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            yarn
          </button>
          <button
            onClick={() => setActiveTab('pnpm')}
            className={`py-2 px-4 text-sm font-medium mr-2 ${
              activeTab === 'pnpm'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            pnpm
          </button>
        </div>

        {/* Code snippet */}
        <div className="bg-gray-800 rounded-md p-3 text-white font-mono text-sm overflow-x-auto">
          {activeTab === 'npm' && <code>npm install type-guard-pro</code>}
          {activeTab === 'yarn' && <code>yarn add type-guard-pro</code>}
          {activeTab === 'pnpm' && <code>pnpm add type-guard-pro</code>}
        </div>

        <div className="mt-3 text-xs text-gray-600 dark:text-gray-300">
          <p>After installation, import it in your TypeScript files:</p>
          <pre className="bg-gray-800 rounded-md p-2 mt-1 text-white overflow-x-auto">
            <code>
              import {'{ createGuard, guards }'} from 'type-guard-pro';
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

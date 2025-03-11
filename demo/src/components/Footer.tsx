import React from 'react';
import { VERSION } from '../../../src/version';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 text-xs text-gray-400 py-2 px-4 flex-shrink-0">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p>
          {VERSION.name} — {VERSION.description}
        </p>
        <div className="mt-1 sm:mt-0 flex items-center space-x-4">
          <a href={VERSION.repository} className="hover:text-gray-200">
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/type-guard-pro"
            className="hover:text-gray-200"
          >
            npm
          </a>
          <span className="text-gray-500">
            Built by{' '}
            <a
              href="https://github.com/somritdasgupta"
              className="text-blue-400 hover:text-blue-300"
            >
              Somrit Dasgupta
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

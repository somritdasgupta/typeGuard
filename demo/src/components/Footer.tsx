import React from 'react';
import { VERSION } from '../../../src/version';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 text-xs text-gray-400 py-2 px-4 flex-shrink-0">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <Logo size="sm" />
          <p>
            {VERSION.name} —{' by '}
            <span className="text-gray-500">
              <a
                href="https://github.com/somritdasgupta"
                className="text-blue-400 hover:text-blue-300"
              >
                Somrit Dasgupta
              </a>
            </span>
          </p>
        </div>
        <div className="mt-2 flex items-center space-x-4">
          <a
            href="https://www.npmjs.com/package/type-guard-pro"
            className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 780 250" className="h-4 w-8 fill-current">
              <path d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z M0,200h100V50h50v150h50V0H0V200z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

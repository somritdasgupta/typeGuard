import React from 'react';
import { PackageVersion } from './PackageVersion';
import { VERSION } from '../../../src/version';
import { BsGithub } from 'react-icons/bs';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 flex-shrink-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and title */}
        <div className="flex items-center space-x-3">
          <Logo size="md" />
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold">{VERSION.name}</h1>
            <span className="px-1.5 py-0.5 text-xs bg-blue-800 text-blue-100 uppercase tracking-wide">
              Demo
            </span>
            <PackageVersion packageName="type-guard-pro" />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <a
            href={VERSION.repository}
            className="flex items-center text-gray-400 hover:text-gray-200"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <BsGithub className="w-5 h-5" />
            <span className="ml-2 hidden sm:inline text-sm">GitHub</span>
          </a>

          {/* Mobile menu toggle button */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden text-gray-400 hover:text-white"
            aria-label="Open menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

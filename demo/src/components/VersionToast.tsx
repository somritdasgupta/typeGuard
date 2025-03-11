import React, { useState, useEffect } from 'react';
import { Toast } from './Toast';
import { VERSION } from '../../../src/version';

export const VersionToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(VERSION.current);
  const [latestVersion, setLatestVersion] = useState('');

  useEffect(() => {
    // Check local storage to see if we've shown this version notification already
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');

    // Fetch the latest version from npm
    const checkVersion = async () => {
      try {
        const response = await fetch(
          'https://registry.npmjs.org/type-guard-pro/latest'
        );
        if (response.ok) {
          const data = await response.json();
          setLatestVersion(data.version);

          // Show toast if there's a new version or if this is the first time seeing this version
          if (
            data.version !== VERSION.current &&
            data.version !== lastSeenVersion
          ) {
            setVisible(true);
            localStorage.setItem('lastSeenVersion', data.version);
          }
        }
      } catch (err) {
        console.error('Error fetching version data:', err);
      }
    };

    // Only check version after a short delay to not block initial rendering
    const timer = setTimeout(() => {
      checkVersion();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show toast when current version changes (simulation for development)
  useEffect(() => {
    if (currentVersion !== VERSION.current) {
      setVisible(true);
      setCurrentVersion(VERSION.current);
    }
  }, [VERSION.current, currentVersion]);

  const message = latestVersion
    ? `A new version (${latestVersion}) of Type Guard Pro is available!`
    : `Welcome to Type Guard Pro ${VERSION.current}`;

  const handleViewChangelog = () => {
    window.open(
      `${VERSION.repository}/releases/tag/v${latestVersion}`,
      '_blank'
    );
  };

  return (
    <Toast
      message={message}
      type="success"
      visible={visible}
      duration={10000}
      onDismiss={() => setVisible(false)}
      actionLabel={latestVersion ? "What's New?" : undefined}
      onAction={latestVersion ? handleViewChangelog : undefined}
    />
  );
};

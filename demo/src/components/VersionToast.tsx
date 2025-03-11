import React, { useState, useEffect } from 'react';
import { Toast } from './Toast';
import { VERSION } from '../../../src/version';

export const VersionToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const [updateType, setUpdateType] = useState<'patch' | 'minor' | 'major'>();

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(
          'https://registry.npmjs.org/type-guard-pro/latest'
        );
        if (!response.ok) return;
        const data = await response.json();
        const latest = data.version;
        setLatestVersion(latest);

        // Parse versions
        const [curMajor, curMinor, curPatch] = VERSION.current.split('.').map(Number);
        const [latestMajor, latestMinor, latestPatch] = latest.split('.').map(Number);

        // Determine update type
        if (latestMajor > curMajor) {
          setUpdateType('major');
        } else if (latestMinor > curMinor) {
          setUpdateType('minor');
        } else if (latestPatch > curPatch) {
          setUpdateType('patch');
        }

        // Show toast only if there's a newer version
        if (latest !== VERSION.current) {
          // Check if this specific version update has been dismissed
          const dismissedVersion = localStorage.getItem('dismissedVersion');
          if (dismissedVersion !== latest) {
            setVisible(true);
          }
        }
      } catch (error) {
        console.error('Error checking version:', error);
      }
    };

    checkVersion();
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    // Store the dismissed version
    if (latestVersion) {
      localStorage.setItem('dismissedVersion', latestVersion);
    }
  };

  const handleViewChangelog = () => {
    window.open(`${VERSION.repository}/releases/tag/v${latestVersion}`, '_blank');
  };

  // Custom messages based on update type
  const getMessage = () => {
    if (!updateType) return '';
    
    switch (updateType) {
      case 'major':
        return `🎉 Major update available! (v${latestVersion}) with breaking changes`;
      case 'minor':
        return `✨ New features available in v${latestVersion}`;
      case 'patch':
        return `🛠️ Bug fixes available in v${latestVersion}`;
      default:
        return `New version ${latestVersion} available`;
    }
  };

  return (
    <Toast
      message={getMessage()}
      type={updateType === 'major' ? 'warning' : 'info'}
      visible={visible}
      duration={updateType === 'major' ? 0 : 10000} // Major updates stay until dismissed
      onDismiss={handleDismiss}
      actionLabel="View Changelog"
      onAction={handleViewChangelog}
    />
  );
};

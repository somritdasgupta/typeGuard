import React, { useState, useEffect } from 'react';
import { VERSION } from '../../../src/version'; // Import from centralized version file

interface PackageVersionProps {
  packageName: string;
}

export const PackageVersion: React.FC<PackageVersionProps> = ({
  packageName,
}) => {
  const [version, setVersion] = useState<string | null>(VERSION.current); // Use local version by default
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setLoading(true);
        // Fetch the package info from npm registry
        const response = await fetch(
          `https://registry.npmjs.org/${packageName}/latest`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch package info');
        }
        const data = await response.json();
        setVersion(data.version);
        setError(false);
      } catch (err) {
        console.error('Error fetching package version:', err);
        // Keep using VERSION.current on error
      } finally {
        setLoading(false);
      }
    };

    // Only fetch from npm if not running locally
    if (process.env.NODE_ENV === 'production') {
      fetchVersion();
    } else {
      setLoading(false);
    }
  }, [packageName]);

  if (loading) {
    return <span className="text-gray-400 text-xs">loading...</span>;
  }

  if (error || !version) {
    return <span className="text-gray-400 text-xs">version unavailable</span>;
  }

  return (
    <span className="bg-blue-900/30 text-blue-300 text-xs px-1.5 py-0.5 rounded">
      v{version}
    </span>
  );
};

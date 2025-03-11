import React from 'react';
import { createGuard, guards } from '../../../src/index';

export const AdvancedTypesExample: React.FC = () => {
  // Example 1: Tuple Type Guard
  const pointGuard = createGuard<[number, number]>().tuple(
    guards.number,
    guards.number
  );

  // Example 2: Literal Type Guard
  const statusGuard = createGuard<'active' | 'inactive' | 'pending'>().union(
    createGuard().literal('active'),
    createGuard<'inactive' | 'pending'>().union(
      createGuard().literal('inactive'),
      createGuard().literal('pending')
    )
  );

  // Example 3: Record Type Guard
  const configGuard = createGuard<Record<string, boolean>>().record(
    (key): key is string => typeof key === 'string',
    guards.boolean
  );

  // Example 4: Refined Type Guard
  const positiveNumberGuard = createGuard<number>().refined(
    guards.number,
    (value) => value > 0
  );

  // Example usage
  const validatePoint = (input: unknown) => {
    if (pointGuard(input)) {
      // TypeScript knows input is [number, number]
      const [x, y] = input;
      return `Valid point: (${x}, ${y})`;
    }
    return 'Invalid point';
  };

  const validateStatus = (input: unknown) => {
    if (statusGuard(input)) {
      // TypeScript knows input is 'active' | 'inactive' | 'pending'
      return `Valid status: ${input}`;
    }
    return 'Invalid status';
  };

  const validateConfig = (input: unknown) => {
    if (configGuard(input)) {
      // TypeScript knows input is Record<string, boolean>
      return `Valid config with ${Object.keys(input).length} settings`;
    }
    return 'Invalid config';
  };

  const validatePositiveNumber = (input: unknown) => {
    if (positiveNumberGuard(input)) {
      // TypeScript knows input is number and > 0
      return `Valid positive number: ${input}`;
    }
    return 'Invalid number';
  };

  const point = [10, 20];
  const status = 'active';
  const config = { darkMode: true, notifications: false };
  const number = 42;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Advanced Type Guards Demo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Tuple Type Guard</h3>
          <pre className="mt-2 p-2 bg-gray-800 text-gray-100 rounded text-sm overflow-auto">
            {`const pointGuard = createGuard<[number, number]>()
  .tuple(guards.number, guards.number);

pointGuard([10, 20]); // true
pointGuard(['10', 20]); // false`}
          </pre>
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
            Result: {validatePoint(point)}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Literal Type Guard</h3>
          <pre className="mt-2 p-2 bg-gray-800 text-gray-100 rounded text-sm overflow-auto">
            {`const statusGuard = createGuard<'active' | 'inactive' | 'pending'>()
  .union(
    createGuard().literal('active'),
    createGuard().literal('inactive'),
    createGuard().literal('pending')
  );

statusGuard('active'); // true
statusGuard('other'); // false`}
          </pre>
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
            Result: {validateStatus(status)}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Record Type Guard</h3>
          <pre className="mt-2 p-2 bg-gray-800 text-gray-100 rounded text-sm overflow-auto">
            {`const configGuard = createGuard<Record<string, boolean>>()
  .record(
    (key): key is string => typeof key === 'string',
    guards.boolean
  );

configGuard({ darkMode: true }); // true
configGuard({ count: 5 }); // false`}
          </pre>
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
            Result: {validateConfig(config)}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Refined Type Guard</h3>
          <pre className="mt-2 p-2 bg-gray-800 text-gray-100 rounded text-sm overflow-auto">
            {`const positiveNumberGuard = createGuard<number>()
  .refined(
    guards.number,
    (value) => value > 0
  );

positiveNumberGuard(42); // true
positiveNumberGuard(-1); // false`}
          </pre>
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
            Result: {validatePositiveNumber(number)}
          </div>
        </div>
      </div>
    </div>
  );
};

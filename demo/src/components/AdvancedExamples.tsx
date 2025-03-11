import React from 'react';

export const AdvancedExamples: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h2 className="text-base font-medium">Advanced Features Example</h2>
      </div>
      <div className="p-4 overflow-x-auto">
        <div className="space-y-8">
          {/* Tuple Example */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Tuple Type Guards
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Tuples are fixed-length arrays where each position has a specific
              type.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// Type definition
type Point = [number, number]; // x and y coordinates

// Type guard creation
const pointGuard = createGuard<Point>().tuple(
  guards.number, // First element must be a number
  guards.number  // Second element must be a number
);

// Usage
if (pointGuard([10, 20])) {
  // value is guaranteed to be [number, number]
  const [x, y] = value;
  console.log(\`Point at \${x},\${y}\`);
}

// Complex example with different types
type UserInfo = [string, number, boolean]; // [name, age, isActive]

const userInfoGuard = createGuard<UserInfo>().tuple(
  guards.string,
  guards.number,
  guards.boolean
);

// Valid: ["John", 30, true]
// Invalid: ["John", "30", true], ["John", 30], ["John", 30, true, "extra"]`}
              </pre>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-900 text-xs">
              <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                ⚠️ Common Mistakes
              </p>
              <ul className="list-disc pl-5 text-yellow-700 dark:text-yellow-200 space-y-1">
                <li>
                  Adding comments in the type definition when using the demo
                  tool
                </li>
                <li>Having too many or too few elements in the array</li>
                <li>Having elements of the wrong type at specific positions</li>
              </ul>
            </div>
          </div>

          {/* Refined Type Example */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Refined Type Guards
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Refined guards add custom validation rules to basic type guards.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// Positive number validation
const positiveNumberGuard = createGuard<number>().refined(
  guards.number,       // First validate it's a number
  (value) => value > 0 // Then check if it's positive
);

// Email validation
const emailGuard = createGuard<string>().refined(
  guards.string,      // First validate it's a string
  (value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) // Check email format
);

// Password validation
const passwordGuard = createGuard<string>().refined(
  guards.string,
  (value) => (
    value.length >= 8 && 
    /[A-Z]/.test(value) && 
    /[a-z]/.test(value) && 
    /[0-9]/.test(value)
  )
);

// Use in an object guard
const userGuard = createGuard<User>().object({
  id: guards.number,
  email: emailGuard,
  age: positiveNumberGuard,
  password: passwordGuard
});`}
              </pre>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-900 text-xs">
              <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                ⚠️ Common Mistakes
              </p>
              <ul className="list-disc pl-5 text-yellow-700 dark:text-yellow-200 space-y-1">
                <li>Not including both basic type and custom validation</li>
                <li>
                  Writing comments in the type definitions when using the demo
                  tool
                </li>
                <li>Using refined validation without proper error handling</li>
              </ul>
            </div>
          </div>

          {/* Record Type Example */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Record Type Guards
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Record types validate objects with keys and values of specific
              types.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// Configuration with string keys and boolean values
const configGuard = createGuard<Record<string, boolean>>().record(
  (key): key is string => typeof key === 'string',
  guards.boolean
);

// Valid:
// { darkMode: true, notifications: false }

// User roles with string keys and string[] values
const rolesGuard = createGuard<Record<string, string[]>>().record(
  (key): key is string => typeof key === 'string',
  createGuard<string[]>().array(guards.string)
);

// Valid:
// { admin: ["users", "settings"], editor: ["posts", "comments"] }`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

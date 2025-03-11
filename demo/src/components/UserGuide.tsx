import React from 'react';

export const UserGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Basic Type Guards */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Basic Type Guards</h3>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
          <pre className="language-typescript">
            {`// Basic primitive guards
const isString = guards.string("hello");   // true
const isNumber = guards.number(42);        // true
const isBoolean = guards.boolean(true);    // true
const isDate = guards.date(new Date());    // true

// Object validation
const userGuard = createGuard<User>().object({
  id: guards.number,
  name: guards.string,
  active: guards.boolean
});

// Array validation
const numbersGuard = createGuard<number[]>().array(guards.number);`}
          </pre>
        </div>
      </div>

      {/* Advanced Guards */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Advanced Guards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Union Types */}
          <div>
            <h4 className="text-xs font-medium mb-1 text-blue-600 dark:text-blue-400">
              Union Types
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// String or number
const stringOrNumberGuard = createGuard<string | number>()
  .union(
    guards.string,
    guards.number
  );`}
              </pre>
            </div>
          </div>

          {/* Intersection Types */}
          <div>
            <h4 className="text-xs font-medium mb-1 text-blue-600 dark:text-blue-400">
              Intersection Types
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// Must satisfy both interfaces
const userWithProfileGuard = createGuard<User & Profile>()
  .intersection(
    userGuard,
    profileGuard
  );`}
              </pre>
            </div>
          </div>

          {/* Tuple Types */}
          <div>
            <h4 className="text-xs font-medium mb-1 text-blue-600 dark:text-blue-400">
              Tuple Types
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// Fixed length arrays with specific types per position
const pointGuard = createGuard<[number, number]>()
  .tuple(
    guards.number,  // x coordinate
    guards.number   // y coordinate
  );

// Input must be an array with exactly these types in order
pointGuard([10, 20]); // true
pointGuard([10, "20"]); // false (second item must be number)
pointGuard([10, 20, 30]); // false (too many items)`}
              </pre>
            </div>
          </div>

          {/* Literal Types */}
          <div>
            <h4 className="text-xs font-medium mb-1 text-blue-600 dark:text-blue-400">
              Literal Types
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// Exact value matching
const activeGuard = createGuard<'active'>()
  .literal('active');
  
// Use with union for enums
const statusGuard = createGuard<'active' | 'inactive'>()
  .union(
    createGuard().literal('active'),
    createGuard().literal('inactive')
  );`}
              </pre>
            </div>
          </div>

          {/* Record Types */}
          <div>
            <h4 className="text-xs font-medium mb-1 text-blue-600 dark:text-blue-400">
              Record Types
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// Objects with string keys and boolean values
const configGuard = createGuard<Record<string, boolean>>()
  .record(
    (key): key is string => typeof key === 'string',
    guards.boolean
  );
  
configGuard({ darkMode: true, showNotifications: false }); // true
configGuard({ count: 5 }); // false (value is not boolean)`}
              </pre>
            </div>
          </div>

          {/* Refined Types */}
          <div>
            <h4 className="text-xs font-medium mb-1 text-blue-600 dark:text-blue-400">
              Refined Types
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// Add custom constraints to basic types
const positiveNumberGuard = createGuard<number>()
  .refined(
    guards.number,        // First check it's a number
    (value) => value > 0  // Then check it's positive
  );
  
// Email validation
const emailGuard = createGuard<string>()
  .refined(
    guards.string,
    (value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)
  );`}
              </pre>
            </div>
          </div>

          {/* Partial Objects */}
          <div>
            <h4 className="text-xs font-medium mb-1 text-blue-600 dark:text-blue-400">
              Partial Objects
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
              <pre className="language-typescript">
                {`// All properties are optional
const partialUserGuard = createGuard<Partial<User>>()
  .partial({
    id: guards.number,
    name: guards.string,
    active: guards.boolean
  });
  
partialUserGuard({}); // true
partialUserGuard({ id: 1 }); // true
partialUserGuard({ id: "1" }); // false (wrong type)`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Common Patterns */}
      <div>
        <h3 className="text-sm font-semibold mb-2">
          Common Patterns and Best Practices
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>API Validation:</b> Use guards to validate data from external
              APIs before processing
            </li>
            <li>
              <b>Composition:</b> Combine simple guards to create complex type
              validations
            </li>
            <li>
              <b>Error Handling:</b> Use the{' '}
              <code className="text-pink-500">throwOnError</code> option for
              detailed error messages
            </li>
            <li>
              <b>Performance:</b> Create guards outside of render functions to
              avoid recreation
            </li>
            <li>
              <b>Nested Objects:</b> Use object guards recursively for deeply
              nested structures
            </li>
          </ul>
        </div>
      </div>

      {/* Troubleshooting */}
      <div>
        <h3 className="text-sm font-semibold mb-2">
          Troubleshooting Common Issues
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 overflow-auto text-xs space-y-2">
          <div>
            <p className="font-medium text-red-600 dark:text-red-400">
              Tuple Type Validation Failing:
            </p>
            <p>
              Make sure your input is an array with exactly the right number of
              elements and each element has the correct type. For example, a{' '}
              <code className="text-pink-500">[number, number]</code> tuple must
              be an array with exactly 2 numbers.
            </p>
            <pre className="language-typescript mt-1 p-1 bg-gray-100 dark:bg-gray-700 rounded">
              {`// Correct
pointGuard([10, 20]); // Array with exactly 2 numbers

// Incorrect
pointGuard([10]); // Too few elements
pointGuard([10, 20, 30]); // Too many elements 
pointGuard([10, "20"]); // Wrong type for second element`}
            </pre>
          </div>

          <div>
            <p className="font-medium text-red-600 dark:text-red-400">
              Refined Type Validation Failing:
            </p>
            <p>
              Remember that refined types first validate the base type, then
              apply the custom validation. Make sure your input passes both
              checks.
            </p>
            <pre className="language-typescript mt-1 p-1 bg-gray-100 dark:bg-gray-700 rounded">
              {`// For email validation:
emailGuard("not-an-email"); // Fails custom validation
emailGuard(42); // Fails base type check (not a string)

// For positive numbers:
positiveNumberGuard(-5); // Fails custom validation (not positive)
positiveNumberGuard("5"); // Fails base type check (not a number)`}
            </pre>
          </div>

          <div>
            <p className="font-medium text-red-600 dark:text-red-400">
              Comments in Type Definitions:
            </p>
            <p>
              When using the demo tool, make sure not to include
              JavaScript-style comments in your type definitions. The parser
              doesn't handle comments properly. Instead, use meaningful property
              names.
            </p>
            <pre className="language-typescript mt-1 p-1 bg-gray-100 dark:bg-gray-700 rounded">
              {`// Don't do this:
{
  point: [number, number]; // x, y coordinates
}

// Do this instead:
{
  pointXY: [number, number];
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

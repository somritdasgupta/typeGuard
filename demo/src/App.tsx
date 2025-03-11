import { useState, useEffect, useRef, useCallback } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { ValidationResult } from './components/ValidationResult';
import { SchemaBuilder } from './components/SchemaBuilder';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { ValidationConstraints } from './components/ValidationConstraints';
import { UserGuide } from './components/UserGuide';
import { examplePairs } from './data/examples';
import { debounce } from './utils/debounce';
import { Tab } from './components/Tab';
import { PerformanceComparison } from './components/PerformanceComparison';
import { RealtimeComparison } from './components/RealtimeComparison';
import { MobileMenu } from './components/MobileMenu';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { VersionToast } from './components/VersionToast';

function App() {
  const [schema, setSchema] = useState<string>(examplePairs[0].schema);
  const [input, setInput] = useState<string>(examplePairs[0].json);
  const [selectedExample, setSelectedExample] = useState<string>(
    examplePairs[0].name
  );

  // Keep previous state for comparison to avoid unnecessary updates
  const previousStateRef = useRef({ schema: schema, input: input });

  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors?: string[];
    performance?: {
      duration: number;
      memoryUsage: number;
      operationsCount: number;
      jsonSize: number;
      validationRate: number;
    };
  }>({ isValid: false });

  const [validationConstraints, setValidationConstraints] = useState<
    Array<{
      field: string;
      type: string;
      constraint: string;
    }>
  >([]);

  const addValidationConstraint = useCallback(
    (constraint: { field: string; type: string; constraint: string }) => {
      setValidationConstraints((prev) => [...prev, constraint]);
    },
    []
  );

  const removeValidationConstraint = useCallback((index: number) => {
    setValidationConstraints((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Handle example selection
  const handleExampleSelect = (exampleName: string) => {
    const example = examplePairs.find((ex) => ex.name === exampleName);
    if (example) {
      setSelectedExample(exampleName);
      setSchema(example.schema);
      setInput(example.json);
    }
  };

  // Memoize the validation function to avoid recreating it on each render
  const validateInput = useCallback(() => {
    // Skip validation if input and schema haven't changed
    if (
      previousStateRef.current.schema === schema &&
      previousStateRef.current.input === input
    ) {
      return;
    }

    // Update ref to current values
    previousStateRef.current = { schema, input };

    const startTime = performance.now();
    try {
      const jsonSize = new Blob([input]).size;
      const parsedInput = JSON.parse(input);
      let operationsCount = 0;

      // Handle date conversion for all potential date fields
      const convertDates = (obj: any) => {
        operationsCount++;
        if (!obj || typeof obj !== 'object') return;

        if (Array.isArray(obj)) {
          obj.forEach((item) => convertDates(item));
          return;
        }

        Object.keys(obj).forEach((key) => {
          operationsCount++;
          if (
            typeof obj[key] === 'string' &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj[key])
          ) {
            try {
              obj[key] = new Date(obj[key]);
              operationsCount++;
            } catch (e) {
              // Not a valid date, leave as string
            }
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Recursively convert dates in nested objects
            convertDates(obj[key]);
          }
        });
      };

      // Convert dates in the entire object tree
      convertDates(parsedInput);

      // Create type guard for validation based on schema
      const isValid = validateTypeStructure(
        parsedInput,
        schema,
        operationsCount
      );

      const endTime = performance.now();
      const duration = endTime - startTime;
      const memoryInfo = (performance as any).memory;
      const validationRate = jsonSize / duration; // bytes per millisecond

      setValidationResult({
        isValid: isValid.valid,
        errors: isValid.errors,
        performance: {
          duration,
          memoryUsage: memoryInfo?.usedJSHeapSize || 0,
          operationsCount,
          jsonSize,
          validationRate,
        },
      });
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [(error as Error).message],
      });
    }
  }, [input, schema]);

  // Complete rewrite of the type structure validation
  const validateTypeStructure = (
    value: any,
    schemaStr: string,
    opCounter: number
  ): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    try {
      // Step 1: Parse the schema into a structured definition
      const typeDefinition = parseTypeDefinition(schemaStr, opCounter);

      // Step 2: Validate the value against the type definition
      const isValid = validateAgainstTypeDefinition(
        value,
        typeDefinition,
        '',
        errors,
        opCounter
      );

      return {
        valid: isValid,
        errors: errors,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Schema parsing error: ${(error as Error).message}`],
      };
    }
  };

  // Parse a TypeScript interface/type definition into a structured format
  const parseTypeDefinition = (schemaStr: string, opCounter: number) => {
    // Strip outer braces if present
    const content = schemaStr.trim();
    const schema =
      content.startsWith('{') && content.endsWith('}')
        ? content.slice(1, -1).trim()
        : content;

    // Parse schema into a tree structure
    return parsePropertyList(schema, opCounter);
  };

  // Parse a list of properties (prop: Type; prop2: Type2;)
  const parsePropertyList = (
    propertyListStr: string,
    opCounter: number
  ): Record<string, any> => {
    const result: Record<string, any> = {};

    // Split by semicolons, but handle nested structures
    let buffer = '';
    let braceCount = 0;
    let inArrayType = false;

    for (let i = 0; i < propertyListStr.length; i++) {
      const char = propertyListStr[i];
      opCounter++;

      // Track brace level
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;

      // Track array type notation
      if (char === '[' && propertyListStr[i + 1] === ']') {
        inArrayType = true;
      }
      if (inArrayType && char === ']') {
        inArrayType = false;
      }

      // Split at semicolons only when not in a nested structure
      if (char === ';' && braceCount === 0 && !inArrayType) {
        const property = buffer.trim();
        if (property) {
          // Parse property
          const propDef = parseProperty(property, opCounter);
          if (propDef) {
            const [key, type] = propDef;
            result[key] = type;
          }
        }
        buffer = '';
      } else {
        buffer += char;
      }
    }

    // Process any remaining content in the buffer
    const property = buffer.trim();
    if (property) {
      const propDef = parseProperty(property, opCounter);
      if (propDef) {
        const [key, type] = propDef;
        result[key] = type;
      }
    }

    return result;
  };

  // Parse a single property (name: type)
  const parseProperty = (
    propertyStr: string,
    opCounter: number
  ): [string, any] | null => {
    const colonIndex = propertyStr.indexOf(':');
    if (colonIndex === -1) return null;

    const key = propertyStr.substring(0, colonIndex).trim();
    const typeStr = propertyStr.substring(colonIndex + 1).trim();

    // Handle optional properties
    const isOptional = key.endsWith('?');
    const cleanKey = isOptional ? key.slice(0, -1).trim() : key;

    // Parse the type information
    const typeInfo = {
      type: parseTypeInfo(typeStr, opCounter),
      optional: isOptional,
    };

    return [cleanKey, typeInfo];
  };

  // Parse type information
  const parseTypeInfo = (typeStr: string, opCounter: number): any => {
    // Check for array types first
    if (typeStr.endsWith('[]')) {
      return {
        kind: 'array',
        itemType: parseTypeInfo(typeStr.slice(0, -2).trim(), opCounter),
      };
    }

    // Check for object types
    if (typeStr.includes('{')) {
      const openBrace = typeStr.indexOf('{');
      const closeBrace = findMatchingBrace(typeStr, openBrace);

      if (closeBrace !== -1) {
        const nestedSchema = typeStr.substring(openBrace + 1, closeBrace);
        return {
          kind: 'object',
          properties: parsePropertyList(nestedSchema, opCounter),
        };
      }
    }

    // Handle primitive types
    return { kind: 'primitive', name: typeStr };
  };

  // Find matching closing brace
  const findMatchingBrace = (text: string, openBracePos: number): number => {
    let count = 1;
    for (let i = openBracePos + 1; i < text.length; i++) {
      if (text[i] === '{') count++;
      if (text[i] === '}') count--;
      if (count === 0) return i;
    }
    return -1; // No matching brace found
  };

  // Validate a value against a parsed type definition
  const validateAgainstTypeDefinition = (
    value: any,
    typeDef: Record<string, any>,
    path: string,
    errors: string[],
    opCounter: number
  ): boolean => {
    // Basic type check
    if (value === null || value === undefined) {
      errors.push(`${path ? path + ' is' : 'Value is'} null or undefined`);
      return false;
    }

    // Must be an object for validation
    if (typeof value !== 'object') {
      errors.push(
        `${path ? path : 'Value'} is not an object (found ${typeof value})`
      );
      return false;
    }

    // Validate all expected properties
    let isValid = true;

    for (const propName in typeDef) {
      opCounter++;
      const propPath = path ? `${path}.${propName}` : propName;
      const propDef = typeDef[propName];

      // Check if property exists
      if (!(propName in value)) {
        // Property is missing
        if (!propDef.optional) {
          errors.push(
            `Missing required field: ${propName}${path ? ' in ' + path : ''}`
          );
          isValid = false;
        }
        continue;
      }

      const propValue = value[propName];
      const propType = propDef.type;

      // Validate based on the type kind
      if (propType.kind === 'primitive') {
        if (!validatePrimitiveValue(propValue, propType.name)) {
          errors.push(
            `Field ${propPath} should be a ${propType.name} (found ${typeof propValue})`
          );
          isValid = false;
        }
      } else if (propType.kind === 'object') {
        // Validate nested object
        if (
          !validateAgainstTypeDefinition(
            propValue,
            propType.properties,
            propPath,
            errors,
            opCounter
          )
        ) {
          isValid = false;
        }
      } else if (propType.kind === 'array') {
        // Validate array
        if (!Array.isArray(propValue)) {
          errors.push(`Field ${propPath} should be an array`);
          isValid = false;
        } else {
          // Validate each array item
          for (let i = 0; i < propValue.length; i++) {
            opCounter++;
            const itemPath = `${propPath}[${i}]`;
            const item = propValue[i];

            if (propType.itemType.kind === 'primitive') {
              // Primitive array
              if (!validatePrimitiveValue(item, propType.itemType.name)) {
                errors.push(
                  `Array item at ${itemPath} should be a ${propType.itemType.name} (found ${typeof item})`
                );
                isValid = false;
              }
            } else if (propType.itemType.kind === 'object') {
              // Array of objects
              if (typeof item !== 'object' || item === null) {
                errors.push(
                  `Array item at ${itemPath} should be an object (found ${typeof item})`
                );
                isValid = false;
              } else if (
                !validateAgainstTypeDefinition(
                  item,
                  propType.itemType.properties,
                  itemPath,
                  errors,
                  opCounter
                )
              ) {
                isValid = false;
              }
            }
          }
        }
      }
    }

    return isValid;
  };

  // Validate a primitive value against expected type
  const validatePrimitiveValue = (value: any, typeName: string): boolean => {
    switch (typeName) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'Date':
        return value instanceof Date && !isNaN(value.getTime());
      case 'object':
        return (
          typeof value === 'object' && value !== null && !Array.isArray(value)
        );
      default:
        // For any other types, assume valid (could be type aliases or interfaces)
        return true;
    }
  };

  // Create a debounced version of the validation function
  const debouncedValidate = debounce(validateInput, 300);

  // Run validation when input or schema changes, and also on initial load
  useEffect(() => {
    debouncedValidate();
  }, [input, schema, debouncedValidate]);

  // Run an immediate validation on component mount to fix initial validation
  useEffect(() => {
    validateInput();
  }, []); // Empty dependency array makes this run only once on mount

  // New state for terminal tabs - simplify to just 'results' and 'performance'
  const [activeTerminalTab, setActiveTerminalTab] = useState<
    'results' | 'performance'
  >('results');

  // New state for docs tabs - removing 'metrics' and 'realtime' since they'll be merged
  const [activeDocsTab, setActiveDocsTab] = useState<'guide' | 'constraints'>(
    'guide'
  );

  // Add a new state to calculate schema complexity
  const [schemaComplexity, setSchemaComplexity] = useState(50); // Default medium complexity

  // Calculate schema complexity based on its structure
  useEffect(() => {
    // Simple heuristic to determine schema complexity based on:
    // 1. Length of schema string
    // 2. Number of nested objects/arrays
    // 3. Number of validation constraints

    const length = schema.length;
    const nestingLevel = (schema.match(/{/g) || []).length; // Count opening braces for nesting
    const arrayCount = (schema.match(/\[\]/g) || []).length; // Count array types

    // Calculate complexity score (0-100)
    const complexityScore = Math.min(
      100,
      Math.floor(
        (length / 500) * 40 + // Length factor (max 40 points)
          (nestingLevel / 10) * 40 + // Nesting factor (max 40 points)
          (arrayCount / 5) * 20 + // Array factor (max 20 points)
          (validationConstraints.length / 3) * 20 // Constraints factor (bonus)
      )
    );

    setSchemaComplexity(complexityScore);
  }, [schema, validationConstraints]);

  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    | 'typeEditor'
    | 'jsonEditor'
    | 'results'
    | 'performance'
    | 'guide'
    | 'constraints'
  >('typeEditor');

  // Handle section change for mobile
  const handleSectionChange = (section: string) => {
    setActiveSection(section as any);

    // Also update the corresponding tab state based on section
    if (section === 'results' || section === 'performance') {
      setActiveTerminalTab(section as 'results' | 'performance');
    }

    if (section === 'guide' || section === 'constraints') {
      setActiveDocsTab(section as 'guide' | 'constraints');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <VersionToast />

      <main className="flex-grow flex flex-col lg:grid lg:grid-cols-2 overflow-hidden">
        {/* Left column */}
        <div className="flex flex-col h-full lg:border-r border-gray-700">
          {/* Type Definition Editor */}
          <div
            className={`lg:desktop-top-panel flex-shrink-0 flex flex-col border-b border-gray-700
            ${!['typeEditor'].includes(activeSection) ? 'hidden lg:flex' : 'flex'}`}
          >
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
              <div>
                <h2 className="text-sm font-medium">Type Definition</h2>
                <p className="text-xs text-gray-400">TypeScript Interface</p>
              </div>
              {/* Example selector pills */}
              <div className="flex-shrink-0">
                <div className="relative inline-block">
                  <select
                    value={selectedExample}
                    onChange={(e) => handleExampleSelect(e.target.value)}
                    className="appearance-none bg-gray-700 text-xs rounded px-2 py-1 pr-6 cursor-pointer"
                  >
                    {examplePairs.map((example) => (
                      <option key={example.name} value={example.name}>
                        {example.name}{' '}
                        {example.badge ? `(${example.badge})` : ''}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-grow overflow-auto">
              <SchemaBuilder
                schema={schema}
                onChange={setSchema}
                selectedExample={selectedExample}
                onExampleSelect={handleExampleSelect}
              />
            </div>
          </div>

          {/* Terminal (Results/Performance) */}
          <div
            className={`lg:desktop-bottom-panel flex-shrink-0 flex flex-col 
            ${!['results', 'performance'].includes(activeSection) ? 'hidden lg:flex' : 'flex'}`}
          >
            <div className="bg-gray-800 border-b border-gray-700 flex-shrink-0 sticky top-0 z-10">
              <div className="flex">
                <Tab
                  active={activeTerminalTab === 'results'}
                  onClick={() => {
                    setActiveTerminalTab('results');
                    setActiveSection('results');
                  }}
                >
                  Results
                </Tab>
                <Tab
                  active={activeTerminalTab === 'performance'}
                  onClick={() => {
                    setActiveTerminalTab('performance');
                    setActiveSection('performance');
                  }}
                >
                  Performance
                </Tab>
              </div>
            </div>
            <div className="flex-grow overflow-auto p-4 bg-gray-850">
              {activeTerminalTab === 'results' ? (
                <ValidationResult result={validationResult} />
              ) : (
                <div className="h-full overflow-y-auto">
                  <div className="space-y-6">
                    {/* Current performance metrics */}
                    <PerformanceMetrics
                      metrics={validationResult.performance}
                    />

                    {/* Real-time comparison */}
                    <RealtimeComparison
                      currentPerformance={
                        validationResult.performance || {
                          duration: 0,
                          memoryUsage: 0,
                          operationsCount: 0,
                          jsonSize: 0,
                        }
                      }
                      schemaComplexity={schemaComplexity}
                    />

                    {/* Library comparison */}
                    <PerformanceComparison />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col h-full">
          {/* JSON Input Editor */}
          <div
            className={`lg:desktop-top-panel flex-shrink-0 flex flex-col border-b border-gray-700 
            ${activeSection !== 'jsonEditor' ? 'hidden lg:flex' : 'flex'}`}
          >
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0 sticky top-0 z-10">
              <h2 className="text-sm font-medium">JSON Input</h2>
              <p className="text-xs text-gray-400">Data to Validate</p>
            </div>
            <div className="flex-grow overflow-auto">
              <CodeEditor value={input} onChange={setInput} height="100%" />
            </div>
          </div>

          {/* Documentation/Constraints */}
          <div
            className={`lg:desktop-bottom-panel flex-shrink-0 flex flex-col 
            ${!['guide', 'constraints'].includes(activeSection) ? 'hidden lg:flex' : 'flex'}`}
          >
            <div className="bg-gray-800 border-b border-gray-700 flex-shrink-0 sticky top-0 z-10">
              <div className="flex">
                <Tab
                  active={activeDocsTab === 'guide'}
                  onClick={() => {
                    setActiveDocsTab('guide');
                    setActiveSection('guide');
                  }}
                >
                  User Guide
                </Tab>
                <Tab
                  active={activeDocsTab === 'constraints'}
                  onClick={() => {
                    setActiveDocsTab('constraints');
                    setActiveSection('constraints');
                  }}
                >
                  Constraints
                </Tab>
              </div>
            </div>
            <div className="flex-grow overflow-auto bg-gray-850">
              {activeDocsTab === 'guide' ? (
                <div className="p-4">
                  <UserGuide />
                </div>
              ) : (
                <div className="p-4 h-full">
                  <ValidationConstraints
                    constraints={validationConstraints}
                    onAddConstraint={addValidationConstraint}
                    onRemoveConstraint={removeValidationConstraint}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeNavSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <Footer />
    </div>
  );
}

export default App;

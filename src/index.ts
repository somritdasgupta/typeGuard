/**
 * Creates a type guard function for the specified type
 * @template T The type to create a guard for
 */
export function createGuard<T>() {
  return {
    /**
     * Creates a type guard for an object type
     * @param schema The object schema to validate against
     * @throws {ValidationError} When schema is invalid
     */
    object: <S extends Record<string, unknown> & Partial<T>>(schema: {
      [K in keyof S]: (value: unknown) => value is S[K];
    }) => {
      validateSchema(schema);

      return (value: unknown): value is S => {
        try {
          if (!value || typeof value !== 'object') {
            return false;
          }

          const isValid = Object.keys(schema).every((key) => {
            const guardFn = schema[key];
            return guardFn((value as Record<string, unknown>)[key]);
          });

          return isValid;
        } catch {
          return false;
        }
      };
    },

    /**
     * Creates a type guard for primitive types
     * @param validator Function to validate the primitive type
     */
    primitive: <P>(validator: (value: unknown) => value is P) => {
      return (value: unknown): value is P => {
        try {
          return validator(value);
        } catch {
          return false;
        }
      };
    },

    /**
     * Creates a type guard for array types
     * @param itemGuard Type guard for array items
     */
    array: <I>(itemGuard: (value: unknown) => value is I) => {
      return (value: unknown): value is I[] => {
        try {
          if (!Array.isArray(value)) return false;
          return value.every((item) => itemGuard(item));
        } catch {
          return false;
        }
      };
    },

    /**
     * Creates a type guard for union types
     * @param guards Array of type guards to check against
     */
    union: <T1 extends T, T2 extends T>(
      guard1: (value: unknown) => value is T1,
      guard2: (value: unknown) => value is T2
    ) => {
      return (value: unknown): value is T1 | T2 => {
        try {
          return guard1(value) || guard2(value);
        } catch {
          return false;
        }
      };
    },

    /**
     * Creates a custom type guard with additional validation logic
     * @param validator Custom validation function
     */
    custom: <C>(validator: (value: unknown) => value is C) => {
      return (value: unknown): value is C => {
        try {
          return validator(value);
        } catch {
          return false;
        }
      };
    },

    /**
     * Creates a type guard for intersection types
     * @param guards Array of type guards to check against
     */
    intersection: <I>(...guards: ((value: unknown) => boolean)[]) => {
      return (value: unknown): value is I => {
        try {
          return guards.every((guard) => guard(value));
        } catch {
          return false;
        }
      };
    },

    /**
     * Creates a guard for tuple types with specific element types
     * @param elementGuards Guards for each position in the tuple
     */
    tuple: <T extends unknown[]>(
      ...elementGuards: {
        [K in keyof T]: (value: unknown) => value is T[K];
      }
    ) => {
      return (value: unknown): value is T => {
        try {
          if (!Array.isArray(value)) {
            return false;
          }

          if (value.length !== elementGuards.length) {
            return false;
          }

          const isValid = elementGuards.every((guard, index) =>
            guard(value[index])
          );

          return isValid;
        } catch {
          return false;
        }
      };
    },

    /**
     * Creates a guard for literal values
     * @param expectedValue The literal value to match
     */
    literal: <L extends string | number | boolean | null | undefined>(
      expectedValue: L
    ) => {
      return (value: unknown): value is L => {
        try {
          return value === expectedValue;
        } catch {
          return false;
        }
      };
    },

    /**
     * Creates a guard for record types (objects with keys of type K and values of type V)
     * @param keyGuard Guard for the object keys
     * @param valueGuard Guard for the object values
     */
    record: <K extends string, V>(
      keyGuard: (key: string) => key is K,
      valueGuard: (value: unknown) => value is V
    ) => {
      return (value: unknown): value is Record<K, V> => {
        try {
          if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return false;
          }

          const entries = Object.entries(value as Record<string, unknown>);
          const isValid = entries.every(([key, val]) => {
            return keyGuard(key) && valueGuard(val);
          });

          return isValid;
        } catch {
          return false;
        }
      };
    },

    /**
     * Helper for partial objects (all fields optional)
     * @param schema The object schema to validate against
     */
    partial: <S extends Record<string, unknown> & Partial<T>>(schema: {
      [K in keyof S]: (value: unknown) => value is S[K];
    }) => {
      validateSchema(schema);

      return (value: unknown): value is Partial<S> => {
        try {
          if (!value || typeof value !== 'object') {
            return false;
          }

          const obj = value as Record<string, unknown>;

          // Check only properties that exist in the value
          for (const key in obj) {
            if (key in schema) {
              if (!schema[key](obj[key])) {
                return false;
              }
            }
          }

          return true;
        } catch {
          return false;
        }
      };
    },

    /**
     * Creates a guard with runtime validation constraints
     * @param baseGuard The base type guard
     * @param validator Additional validation function with custom logic
     */
    refined: <R>(
      baseGuard: (value: unknown) => value is R,
      validator: (value: R) => boolean
    ) => {
      return (value: unknown): value is R => {
        try {
          if (!baseGuard(value)) {
            return false;
          }

          return validator(value);
        } catch {
          return false;
        }
      };
    },
  };
}

// Built-in primitive type guards
export const guards = {
  string: (value: unknown): value is string => typeof value === 'string',
  number: (value: unknown): value is number =>
    typeof value === 'number' && !isNaN(value),
  boolean: (value: unknown): value is boolean => typeof value === 'boolean',
  null: (value: unknown): value is null => value === null,
  undefined: (value: unknown): value is undefined => value === undefined,
  date: (value: unknown): value is Date =>
    value instanceof Date && !isNaN(value.getTime()),
  bigint: (value: unknown): value is bigint => typeof value === 'bigint',
  symbol: (value: unknown): value is symbol => typeof value === 'symbol',
  function: (value: unknown): value is (...args: unknown[]) => unknown =>
    typeof value === 'function',
  object: (value: unknown): value is object =>
    typeof value === 'object' && value !== null,

  // Additional guards
  integer: (value: unknown): value is number =>
    typeof value === 'number' && !isNaN(value) && Number.isInteger(value),

  positiveNumber: (value: unknown): value is number =>
    typeof value === 'number' && !isNaN(value) && value > 0,

  negativeNumber: (value: unknown): value is number =>
    typeof value === 'number' && !isNaN(value) && value < 0,

  nonEmptyString: (value: unknown): value is string =>
    typeof value === 'string' && value.length > 0,

  email: (value: unknown): value is string =>
    typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),

  url: (value: unknown): value is string => {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  uuid: (value: unknown): value is string =>
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    ),

  iso8601Date: (value: unknown): value is string =>
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/.test(
      value
    ),
} as const;

// Types and interfaces
export interface ValidationOptions {
  throwOnError?: boolean;
  strict?: boolean;
}

// Define ErrorOptions interface if not using Node.js types
interface ErrorOptions {
  cause?: unknown;
}

export class ValidationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message);
    this.name = 'ValidationError';
    if (options?.cause) {
      // Set cause property if available
      if ('cause' in Error) {
        Object.defineProperty(this, 'cause', {
          value: options.cause,
          configurable: true,
          writable: true,
        });
      }
    }
  }
}

// Utility functions
function validateSchema(schema: Record<string, unknown>): void {
  if (!schema || typeof schema !== 'object') {
    throw new ValidationError('Invalid schema: must be an object');
  }

  for (const key in schema) {
    if (typeof schema[key] !== 'function') {
      throw new ValidationError(
        `Invalid validator for key "${key}": must be a function`
      );
    }
  }
}

// Simplify the Logger class to minimize bundle size

// Create a single logger instance

// Plugin system
export interface Plugin<T> {
  name: string;
  validate: (value: unknown) => value is T;
}

export const plugins = new Map<string, Plugin<unknown>>();

export function registerPlugin<T>(plugin: Plugin<T>): void {
  plugins.set(plugin.name, plugin as Plugin<unknown>);
}

export function getPlugin(name: string): Plugin<unknown> | undefined {
  return plugins.get(name);
}

// Export version information
export { VERSION } from './version';

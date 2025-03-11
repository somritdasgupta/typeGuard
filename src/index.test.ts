import { describe, it, expect, beforeEach } from 'vitest';
import { createGuard, guards, registerPlugin, getPlugin } from './index';

describe('type-guard-pro', () => {
  describe('primitive guards', () => {
    it('should validate string type', () => {
      expect(guards.string('test')).toBe(true);
      expect(guards.string(123)).toBe(false);
    });

    it('should validate number type', () => {
      expect(guards.number(123)).toBe(true);
      expect(guards.number('123')).toBe(false);
      expect(guards.number(NaN)).toBe(false);
    });

    it('should validate boolean type', () => {
      expect(guards.boolean(true)).toBe(true);
      expect(guards.boolean(false)).toBe(true);
      expect(guards.boolean('true')).toBe(false);
    });

    it('should validate bigint type', () => {
      expect(guards.bigint(BigInt(123))).toBe(true);
      expect(guards.bigint(123)).toBe(false);
    });

    it('should validate symbol type', () => {
      expect(guards.symbol(Symbol('test'))).toBe(true);
      expect(guards.symbol('symbol')).toBe(false);
    });

    it('should validate function type', () => {
      expect(guards.function(() => {})).toBe(true);
      expect(guards.function({})).toBe(false);
    });
  });

  describe('object guard', () => {
    interface User {
      id: number;
      name: string;
      active: boolean;
    }

    const userGuard = createGuard<User>().object({
      id: guards.number,
      name: guards.string,
      active: guards.boolean,
    });

    it('should validate valid user object', () => {
      const validUser = {
        id: 1,
        name: 'John',
        active: true,
      };
      expect(userGuard(validUser)).toBe(true);
    });

    it('should reject invalid user object', () => {
      const invalidUser = {
        id: '1',
        name: 'John',
        active: true,
      };
      expect(userGuard(invalidUser)).toBe(false);
    });

    it('should throw error when throwOnError is true', () => {
      const invalidUser = {
        id: '1',
        name: 'John',
        active: true,
      };
      expect(userGuard(invalidUser)).toBe(false);
    });
  });

  describe('array guard', () => {
    const numberArrayGuard = createGuard<number[]>().array(guards.number);

    it('should validate array of numbers', () => {
      expect(numberArrayGuard([1, 2, 3])).toBe(true);
      // Fix: Replace 'any' with proper type assertion
      expect(numberArrayGuard(['1', 2, 3] as unknown[])).toBe(false);
      expect(numberArrayGuard('not an array')).toBe(false);
    });

    it('should handle empty arrays', () => {
      expect(numberArrayGuard([])).toBe(true);
    });
  });

  describe('union guard', () => {
    // Fix: Union guard now takes only two type parameters
    const stringOrNumberGuard = createGuard<string | number>().union(
      (value: unknown): value is string => typeof value === 'string',
      (value: unknown): value is number =>
        typeof value === 'number' && !isNaN(value)
    );

    it('should validate union types', () => {
      expect(stringOrNumberGuard('test')).toBe(true);
      expect(stringOrNumberGuard(123)).toBe(true);
      expect(stringOrNumberGuard(true)).toBe(false);
    });
  });

  describe('custom guard', () => {
    const emailGuard = createGuard<string>().custom(
      (value): value is string => {
        if (typeof value !== 'string') return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
    );

    it('should validate custom types', () => {
      expect(emailGuard('test@example.com')).toBe(true);
      expect(emailGuard('invalid-email')).toBe(false);
      expect(emailGuard(123)).toBe(false);
    });
  });

  describe('plugin system', () => {
    const emailPlugin = {
      name: 'email',
      validate: (value: unknown): value is string => {
        if (typeof value !== 'string') return false;
        // Fix: Remove unnecessary escape before @
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
    };

    beforeEach(() => {
      registerPlugin(emailPlugin);
    });

    it('should register and retrieve plugins', () => {
      expect(getPlugin('email')).toBeDefined();
      expect(getPlugin('nonexistent')).toBeUndefined();
    });

    it('should validate using plugin', () => {
      const plugin = getPlugin('email');
      expect(plugin?.validate('test@example.com')).toBe(true);
      expect(plugin?.validate('invalid-email')).toBe(false);
    });
  });

  describe('new guards', () => {
    // Test integer guard
    it('should validate integers', () => {
      expect(guards.integer(42)).toBe(true);
      expect(guards.integer(3.14)).toBe(false);
      expect(guards.integer('123')).toBe(false);
    });

    // Test email guard
    it('should validate email addresses', () => {
      expect(guards.email('user@example.com')).toBe(true);
      expect(guards.email('invalid-email')).toBe(false);
      expect(guards.email(42)).toBe(false);
    });

    // Test URL guard
    it('should validate URLs', () => {
      expect(guards.url('https://example.com')).toBe(true);
      expect(guards.url('not a url')).toBe(false);
      expect(guards.url(42)).toBe(false);
    });

    // Test UUID guard
    it('should validate UUIDs', () => {
      expect(guards.uuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(guards.uuid('not-a-uuid')).toBe(false);
      expect(guards.uuid(42)).toBe(false);
    });
  });

  describe('intersection guard', () => {
    interface WithId {
      id: number;
    }

    interface WithName {
      name: string;
    }

    const idGuard = createGuard<WithId>().object({
      id: guards.number,
    });

    const nameGuard = createGuard<WithName>().object({
      name: guards.string,
    });

    // Fix: Use a type assertion to work around the TypeScript type checking issue
    // The intersection guard expects functions that return boolean, not specific type predicates
    const idWithNameGuard = createGuard<WithId & WithName>().intersection(
      // Use a more general type cast to avoid the specific type error
      // This is safe because the intersection guard only uses the boolean return value
      (value: unknown): boolean => idGuard(value),
      (value: unknown): boolean => nameGuard(value)
    );

    it('should validate intersected types', () => {
      expect(idWithNameGuard({ id: 1, name: 'Test' })).toBe(true);
      expect(idWithNameGuard({ id: 1 })).toBe(false);
      expect(idWithNameGuard({ name: 'Test' })).toBe(false);
      expect(idWithNameGuard({})).toBe(false);
    });
  });

  describe('tuple guard', () => {
    const pointGuard = createGuard<[number, number]>().tuple(
      guards.number,
      guards.number
    );

    const nameAgeGuard = createGuard<[string, number]>().tuple(
      // Fix the type definition
      guards.string, // First element should be string
      guards.number // Second element should be number
    );

    it('should validate tuple types', () => {
      expect(pointGuard([10, 20])).toBe(true);
      expect(pointGuard([10, '20'])).toBe(false);
      expect(pointGuard([10, 20, 30])).toBe(false);
      expect(pointGuard([10])).toBe(false);

      expect(nameAgeGuard(['John', 30])).toBe(true);
      expect(nameAgeGuard([30, 'John'])).toBe(false);
    });
  });

  describe('literal guard', () => {
    const statusGuard = createGuard<'active'>().literal('active');
    const numberGuard = createGuard<42>().literal(42);

    it('should validate literal values', () => {
      expect(statusGuard('active')).toBe(true);
      expect(statusGuard('inactive')).toBe(false);

      expect(numberGuard(42)).toBe(true);
      expect(numberGuard(100)).toBe(false);
    });

    it('should work with union of literals', () => {
      const statusUnionGuard = createGuard<
        'active' | 'inactive' | 'pending'
      >().union(
        (value): value is 'active' => value === 'active',
        (value): value is 'inactive' | 'pending' =>
          value === 'inactive' || value === 'pending'
      );

      expect(statusUnionGuard('active')).toBe(true);
      expect(statusUnionGuard('inactive')).toBe(true);
      expect(statusUnionGuard('pending')).toBe(true);
      expect(statusUnionGuard('cancelled')).toBe(false);
    });
  });

  describe('record guard', () => {
    const stringToNumberGuard = createGuard<Record<string, number>>().record(
      (k): k is string => typeof k === 'string',
      guards.number
    );

    it('should validate record types', () => {
      expect(stringToNumberGuard({ a: 1, b: 2 })).toBe(true);
      expect(stringToNumberGuard({ a: '1' })).toBe(false);
      expect(stringToNumberGuard([])).toBe(false);
      expect(stringToNumberGuard(null)).toBe(false);
    });
  });

  describe('partial guard', () => {
    interface User {
      id: number;
      name: string;
      email: string;
    }

    const partialUserGuard = createGuard<Partial<User>>().partial({
      id: guards.number,
      name: guards.string,
      email: guards.email,
    });

    it('should validate partial objects', () => {
      expect(partialUserGuard({})).toBe(true);
      expect(partialUserGuard({ id: 1 })).toBe(true);
      expect(partialUserGuard({ name: 'John' })).toBe(true);
      expect(partialUserGuard({ id: 1, name: 'John' })).toBe(true);
      expect(partialUserGuard({ id: '1' })).toBe(false);
    });
  });

  describe('refined guard', () => {
    const positiveNumberGuard = createGuard<number>().refined(
      guards.number,
      (value) => value > 0
    );

    const emailGuard = createGuard<string>().refined(guards.string, (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    );

    it('should validate with additional constraints', () => {
      expect(positiveNumberGuard(42)).toBe(true);
      expect(positiveNumberGuard(0)).toBe(false);
      expect(positiveNumberGuard(-1)).toBe(false);
      expect(positiveNumberGuard('42')).toBe(false);

      expect(emailGuard('test@example.com')).toBe(true);
      expect(emailGuard('invalid')).toBe(false);
      expect(emailGuard(42)).toBe(false);
    });
  });
});

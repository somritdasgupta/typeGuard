import { createGuard, guards } from '../dist/index.js';

async function runSmokeTest() {
  const tests = [
    {
      name: 'Basic Guards',
      run: () => {
        if (!guards.string('test')) throw new Error('String guard failed');
        if (!guards.number(123)) throw new Error('Number guard failed');
        if (!guards.boolean(true)) throw new Error('Boolean guard failed');
        return true;
      },
    },
    {
      name: 'Object Guard',
      run: () => {
        const userGuard = createGuard<{ id: number; name: string }>().object({
          id: guards.number,
          name: guards.string,
        });
        if (!userGuard({ id: 1, name: 'test' })) {
          throw new Error('Object guard failed');
        }
        return true;
      },
    },
    {
      name: 'Array Guard',
      run: () => {
        const arrayGuard = createGuard<number[]>().array(guards.number);
        if (!arrayGuard([1, 2, 3])) throw new Error('Array guard failed');
        return true;
      },
    },
  ];

  console.log('Starting pre-deployment checks...\n');

  for (const test of tests) {
    try {
      process.stdout.write(`Testing ${test.name}... `);
      await test.run();
      console.log('✅ Passed');
    } catch (error) {
      console.log('❌ Failed');
      console.error(`Error in ${test.name}:`, error);
      return false;
    }
  }

  console.log('\n✨ All pre-deployment checks passed!');
  return true;
}

// Run tests and handle process exit
runSmokeTest()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

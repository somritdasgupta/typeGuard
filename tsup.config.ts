import { defineConfig } from 'tsup';

export default defineConfig({
  minify: true,
  treeshake: {
    moduleSideEffects: false,
    correctVarValueBeforeDeclaration: true,
    preset: 'recommended',
  },
  sourcemap: false,
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  entry: ['src/index.ts'],
  target: 'es2020',
  splitting: false,
  bundle: true,
  platform: 'neutral',
  esbuildOptions(options) {
    options.drop = ['console', 'debugger'];
    options.pure = ['console.log', 'console.debug', 'console.error'];
    options.legalComments = 'none';
    options.minifyIdentifiers = true;
    options.minifySyntax = true;
    options.minifyWhitespace = true;
    options.treeShaking = true;
    options.ignoreAnnotations = true;
    options.keepNames = false;
  },
});

import { defineConfig } from 'tsup';

export default defineConfig({
	external: ['@gud/drift'],
	entry: ['src/**/*.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	splitting: false,
	bundle: false,
	outDir: 'build',
	outExtension({ format }) {
		return {
			js: format === 'cjs' ? '.cjs' : '.js',
		};
	},
});


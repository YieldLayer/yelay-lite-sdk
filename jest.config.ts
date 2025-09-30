module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				useESM: true,
				isolatedModules: true,
			},
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testMatch: ['**/tests/**/*.test.ts'],
	collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};

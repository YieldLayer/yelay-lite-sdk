module.exports = {
	preset: 'ts-jest', // Use the ts-jest preset for TypeScript
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
	},
	// If you're using ECMAScript modules (ESM), you might need this
	globals: {
		'ts-jest': {
			isolatedModules: true, // This can help with faster tests, but use cautiously
		},
	},
};

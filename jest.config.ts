module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				isolatedModules: true, // This can help with faster tests, but use cautiously
			},
		],
	},
};

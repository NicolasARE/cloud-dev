module.exports = {
    testEnvironment: 'node',

    preset: 'ts-jest/presets/default-esm',

    extensionsToTreatAsEsm: ['.ts'],

    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: 'tsconfig.test.json',
            },
        ],
    },

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    testMatch: ['**/*.spec.ts'],
};
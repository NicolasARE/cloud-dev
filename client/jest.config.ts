export default {
    testEnvironment: 'jsdom',

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|scss)$': 'identity-obj-proxy',
    },

    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },

    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};
/**
 * Jest config adapted for Vite + React (no Next.js).
 * Note: Running JSX/ESM may require additional transformers (babel-jest or @swc/jest).
 */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(connectkit|wagmi|@wagmi|viem|@tanstack|zustand)/)'
  ],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  transform: {
    '^.+\\.[tj]sx?$': '<rootDir>/__tests__/utils/esbuild-transform.cjs',
  },
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx}',
    'src/pages/**/*.{js,jsx}',
    'src/services/**/*.{js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
};

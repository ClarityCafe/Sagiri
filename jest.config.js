module.exports = {
  displayName: 'ts-jest',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/*.test.ts'],
  setupFiles: ['<rootDir>/tests/jest.setup.ts']
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: [
    '<rootDir>/tests/**/*.spec.ts'
  ],
  moduleNameMapper: {
    '^@lib/(.*)': '<rootDir>/lib/$1',
    '^@tests/(.*)': '<rootDir>/tests/$1',
  }
}

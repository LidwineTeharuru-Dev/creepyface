module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': '../../node_modules/babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/test/.*(\\.|/)(test|spec))\\.js$',
  moduleFileExtensions: ['ts', 'js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}

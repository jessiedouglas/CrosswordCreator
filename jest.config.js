const config = {
  moduleNameMapper: {
    '^.+\\.(css|less)$': '<rootDir>/testing/CSSStub.js'
  },
  testEnvironment: 'jsdom'
};

module.exports = config;
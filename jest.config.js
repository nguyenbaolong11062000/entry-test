module.exports = {
    verbose: true,
    testTimeout: 3600000,
    testEnvironment: 'node',
    testMatch: ['**/*.steps.js', '**/*.spec.js'],
    collectCoverage: true,
    coverageReporters: ['json', 'html'],
    coverageDirectory: '<rootDir>/coverage/',
    collectCoverageFrom: ['src/routers', 'src/services', 'src/utils'],
};  
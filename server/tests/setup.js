// Test environment setup
// Use a separate test database to avoid polluting development data
process.env.MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/nextstep_test';
process.env.JWT_SECRET = 'test-secret-key-for-jest-tests-minimum-32-chars';
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';

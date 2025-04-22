import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Redis from 'ioredis';

// Load environment variables
dotenv.config();

// Mock Redis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  }));
});

// Mock Mongoose
jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  return {
    ...mongoose,
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(true),
  };
});

// Global setup
beforeAll(async () => {
  // Add any global setup here
});

// Global teardown
afterAll(async () => {
  // Clean up any resources
  await mongoose.disconnect();
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
}); 
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};

export default config;

import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  use: {
    browserName: 'chromium',
    headless: false,
    baseURL: 'http://10.0.4.129/apis/default/',
  extraHTTPHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  },
  reporter: 'html',
});

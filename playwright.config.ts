/**
 * Playwright Configuration File
 * 
 * This file contains all the configuration settings for the Playwright test framework.
 * It defines test execution settings, browsers, reporters, and other test environment configurations.
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 * - testDir: Root directory for test files
 * - fullyParallel: Run tests in parallel
 * - timeout: Maximum time for each test
 * - retries: Number of retries for failed tests
 * - workers: Number of parallel workers
 * - reporter: Test result reporters
 * - use: Shared settings for all projects
 */
export default defineConfig({
  // Directory where test files are located
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Maximum time one test can run for
  timeout: 30 * 1000,
  
  // Maximum time for each assertion
  expect: {
    timeout: 10 * 1000
  },
  
  // Reporter to use - HTML reporter for detailed test results
  reporter: [
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL for UI tests (Note: Our tests use testConfig.ui.baseUrl instead)
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    
    // Maximum time for actions like click, fill, etc.
    actionTimeout: 10 * 1000,
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Channel can be 'chrome', 'chrome-beta', 'msedge', etc.
        channel: 'chrome'
      },
    },

    // Uncomment the following projects to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Output folder for test artifacts
  outputDir: 'test-results/artifacts',
});


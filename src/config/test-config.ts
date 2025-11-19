/**
 * Test Configuration
 * 
 * This file contains all the configuration settings for test execution.
 * It includes URLs, credentials, timeouts, and other environment-specific settings.
 * Values can be overridden using environment variables.
 */

/**
 * Interface for UI application configuration
 */
export interface UIConfig {
  baseUrl: string;
  username: string;
  password: string;
}

/**
 * Interface for API configuration
 */
export interface APIConfig {
  baseUrl: string;
  timeout: number;
}

/**
 * Interface for overall test configuration
 */
export interface TestConfig {
  ui: UIConfig;
  api: APIConfig;
  defaultTimeout: number;
}

/**
 * Test Configuration object
 * Contains all configuration settings for UI and API tests
 */
export const testConfig: TestConfig = {
  // UI Application Configuration
  ui: {
    baseUrl: process.env.UI_BASE_URL || 'https://the-internet.herokuapp.com',
    username: process.env.UI_USERNAME || 'tomsmith',
    password: process.env.UI_PASSWORD || 'SuperSecretPassword!'
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    timeout: parseInt(process.env.API_TIMEOUT || '30000')
  },
  
  // Default timeout for test operations (in milliseconds)
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000')
};


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
import path from 'path';
import dotenv from 'dotenv';

const ENV = (process.env.TEST_ENV || process.env.NODE_ENV || 'local').toLowerCase();
// Always load .env from src/config
dotenv.config({ path: path.resolve(__dirname, '.env') });
if (ENV !== 'local') {
  dotenv.config({ path: path.resolve(__dirname, `.env.${ENV}`) });
}

// Helpers to read and validate environment variables
function getEnv(name: string, fallback?: string): string | undefined {
  const v = process.env[name];
  if (v === undefined) return fallback;
  const t = v.trim();
  return t === '' ? fallback : t;
}

function getRequired(name: string): string {
  const v = getEnv(name);
  if (!v) {
    throw new Error(`Missing required environment variable: ${name} (set it in src/config/.env or via TEST_ENV)`);
  }
  return v;
}

export const testConfig: TestConfig = {
  // UI Application Configuration
  ui: {
    // UI base URL is required for CI to avoid accidental default usage
    baseUrl: getRequired('UI_BASE_URL'),
    username: getEnv('UI_USERNAME', 'tomsmith')!,
    password: getEnv('UI_PASSWORD', 'SuperSecretPassword!')!
  },

  // API Configuration
  api: {
    // Use PAYROLL_API_BASE_URL for payroll/pay group APIs if set, else fallback to API_BASE_URL
    baseUrl: getEnv('PAYROLL_API_BASE_URL', getRequired('API_BASE_URL'))!,
    timeout: parseInt(getEnv('API_TIMEOUT', '20000')!, 10)
  },

  // Default timeout for test operations (in milliseconds)
  defaultTimeout: parseInt(getEnv('DEFAULT_TIMEOUT', '20000')!, 10)
};


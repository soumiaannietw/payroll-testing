/**
 * Dashboard Test Suite
 * 
 * This test suite contains test cases for The Internet (Herokuapp) Secure Area.
 * It tests secure area display and logout functionality.
 * 
 * Test Cases:
 * 1. Verify secure area is displayed after login
 * 2. Verify logout functionality
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login-page';
import { DashboardPage } from '../../src/pages/dashboard-page';
import { testConfig } from '../../src/config/test-config';
import { logger } from '../../src/utils/logger';

/**
 * Test Suite: Dashboard Functionality
 * This suite tests dashboard-related features
 */
test.describe('Dashboard Functionality Tests', () => {
  
  /**
   * Before each test: Login to the application
   * This hook runs before each test case in this suite
   */
  test.beforeEach(async ({ page }) => {
    logger.info('=== Running Before Test: Login ===');
    const loginPage = new LoginPage(page);
    
    // Navigate and login
    await loginPage.goto(testConfig.ui.baseUrl);
    await loginPage.login(testConfig.ui.username, testConfig.ui.password);
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    logger.info('=== Login Completed ===');
  });
  
  /**
   * Test Case 1: Verify secure area is displayed after login
   * 
   * Steps:
   * 1. After login (handled by beforeEach)
   * 2. Verify secure area heading is visible
   * 3. Verify logout button is present
   * 
   * Expected Result: Secure area should be displayed with all expected elements
   */
  test('Should display secure area after successful login', async ({ page }) => {
    logger.info('=== Starting Test: Verify Secure Area Display ===');
    
    // Initialize page object
    const dashboardPage = new DashboardPage(page);
    
    // Verify secure area is displayed
    const isDashboardDisplayed = await dashboardPage.isDashboardDisplayed();
    expect(isDashboardDisplayed).toBeTruthy();
    
    // Verify URL contains secure
    const currentUrl = await dashboardPage.getCurrentUrl();
    expect(currentUrl).toContain('secure');
    
    // Verify page heading
    const heading = await dashboardPage.getDashboardHeading();
    expect(heading).toContain('Secure Area');
    
    // Verify logout button is visible
    const isLogoutVisible = await dashboardPage.isLogoutButtonVisible();
    expect(isLogoutVisible).toBeTruthy();
    
    logger.info('=== Test Completed Successfully ===');
  });
  
  /**
   * Test Case 2: Verify logout functionality
   * 
   * Steps:
   * 1. From dashboard, click on user dropdown
   * 2. Click on logout option
   * 3. Verify user is redirected to login page
   * 
   * Expected Result: User should be successfully logged out and redirected to login page
   */
  test('Should logout successfully from dashboard', async ({ page }) => {
    logger.info('=== Starting Test: Verify Logout Functionality ===');
    
    // Initialize page objects
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);
    
    // Perform logout
    await dashboardPage.logout();
    
    // Verify redirected to login page
    const isLoginPageVisible = await loginPage.isLoginPageDisplayed();
    expect(isLoginPageVisible).toBeTruthy();
    
    // Verify URL is login page
    const currentUrl = await page.url();
    expect(currentUrl).toContain('login');
    
    logger.info('=== Test Completed Successfully ===');
  });
});


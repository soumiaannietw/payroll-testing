/**
 * Login Test Suite
 * 
 * This test suite contains test cases for The Internet (Herokuapp) Form Authentication.
 * It includes positive and negative test scenarios for user authentication.
 * 
 * Test Cases:
 * 1. Successful login with valid credentials
 * 2. Unsuccessful login with invalid credentials
 * 3. Verify all login page elements are displayed
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login-page';
import { DashboardPage } from '../../src/pages/dashboard-page';
import { testConfig } from '../../src/config/test-config';
import { logger } from '../../src/utils/logger';

/**
 * Test Suite: Login Functionality
 * This suite tests various login scenarios
 */
test.describe('Login Functionality Tests', () => {
  
  /**
   * Test Case 1: Verify successful login with valid credentials
   * 
   * Steps:
   * 1. Navigate to login page
   * 2. Enter valid username and password
   * 3. Click login button
   * 4. Verify user is redirected to dashboard
   * 
   * Expected Result: User should be successfully logged in and dashboard should be displayed
   */
  test('Should login successfully with valid credentials', async ({ page }) => {
    logger.info('=== Starting Test: Login with Valid Credentials ===');
    
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Navigate to login page
    await loginPage.goto(testConfig.ui.baseUrl);
    
    // Verify login page is displayed
    const isLoginPageVisible = await loginPage.isLoginPageDisplayed();
    expect(isLoginPageVisible).toBeTruthy();
    
    // Perform login
    await loginPage.login(testConfig.ui.username, testConfig.ui.password);
    
    // Verify successful login by checking secure area
    const isDashboardDisplayed = await dashboardPage.isDashboardDisplayed();
    expect(isDashboardDisplayed).toBeTruthy();
    
    // Verify URL contains secure (The Internet's secure area)
    const currentUrl = await dashboardPage.getCurrentUrl();
    expect(currentUrl).toContain('secure');
    
    // Verify page heading
    const heading = await dashboardPage.getDashboardHeading();
    expect(heading).toContain('Secure Area');
    
    logger.info('=== Test Completed Successfully ===');
  });
  
  /**
   * Test Case 2: Verify login fails with invalid credentials
   * 
   * Steps:
   * 1. Navigate to login page
   * 2. Enter invalid username and password
   * 3. Click login button
   * 4. Verify error message is displayed
   * 
   * Expected Result: Login should fail and appropriate error message should be shown
   */
  test('Should show error message with invalid credentials', async ({ page }) => {
    logger.info('=== Starting Test: Login with Invalid Credentials ===');
    
    // Initialize page object
    const loginPage = new LoginPage(page);
    
    // Navigate to login page
    await loginPage.goto(testConfig.ui.baseUrl);
    
    // Attempt login with invalid credentials
    await loginPage.login('invaliduser', 'wrongpassword');
    
    // Verify error message is displayed
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Your username is invalid!');
    
    // Verify still on login page
    const isLoginPageVisible = await loginPage.isLoginPageDisplayed();
    expect(isLoginPageVisible).toBeTruthy();
    
    logger.info('=== Test Completed Successfully ===');
  });
  
  /**
   * Test Case 3: Verify all login page elements are visible
   * 
   * Steps:
   * 1. Navigate to login page
   * 2. Verify username field is visible
   * 3. Verify password field is visible
   * 4. Verify login button is visible
   * 
   * Expected Result: All login page elements should be visible
   */
  test('Should display all login page elements', async ({ page }) => {
    logger.info('=== Starting Test: Verify Login Page Elements ===');
    
    // Initialize page object
    const loginPage = new LoginPage(page);
    
    // Navigate to login page
    await loginPage.goto(testConfig.ui.baseUrl);
    
    // Verify all elements are visible
    expect(await loginPage.isUsernameFieldVisible()).toBeTruthy();
    expect(await loginPage.isPasswordFieldVisible()).toBeTruthy();
    expect(await loginPage.isLoginButtonVisible()).toBeTruthy();
    
    // Verify page title
    const title = await page.title();
    expect(title).toContain('The Internet');
    
    logger.info('=== Test Completed Successfully ===');
  });
});


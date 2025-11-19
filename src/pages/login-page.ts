/**
 * Login Page Object Model
 * 
 * This class represents the Form Authentication page of The Internet (Herokuapp).
 * It contains all the locators and methods related to login functionality.
 * URL: https://the-internet.herokuapp.com/login
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logger } from '../utils/logger';

/**
 * LoginPage class for handling login page operations
 */
export class LoginPage extends BasePage {
  // Locators for login page elements
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly loginForm: Locator;
  
  /**
   * Constructor for LoginPage
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page);
    
    // Initialize all locators for The Internet login page
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('#flash.error');
    this.successMessage = page.locator('#flash.success');
    this.loginForm = page.locator('#login');
  }
  
  /**
   * Navigate to the login page
   * @param url - Base URL of the application
   */
  async goto(url: string): Promise<void> {
    await this.navigateTo(`${url}/login`);
    logger.info('Login page loaded successfully');
  }
  
  /**
   * Perform login with username and password
   * @param username - Username for login
   * @param password - Password for login
   */
  async login(username: string, password: string): Promise<void> {
    logger.step(`Attempting to login with username: ${username}`);
    await this.fill(this.usernameInput, username, 'Username field');
    await this.fill(this.passwordInput, password, 'Password field');
    await this.click(this.loginButton, 'Login button');
    
    // Wait for page to load after login
    await this.page.waitForLoadState('domcontentloaded');
    logger.info('Login action completed');
  }
  
  /**
   * Get the error message displayed on login failure
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    logger.step('Getting error message');
    return await this.getText(this.errorMessage);
  }
  
  /**
   * Check if login page is displayed
   * @returns True if login page is visible, false otherwise
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.loginForm);
  }
  
  /**
   * Get success message after successful login
   * @returns Success message text
   */
  async getSuccessMessage(): Promise<string> {
    logger.step('Getting success message');
    return await this.getText(this.successMessage);
  }
  
  /**
   * Check if username field is visible
   * @returns True if username field is visible, false otherwise
   */
  async isUsernameFieldVisible(): Promise<boolean> {
    return await this.isVisible(this.usernameInput);
  }
  
  /**
   * Check if password field is visible
   * @returns True if password field is visible, false otherwise
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    return await this.isVisible(this.passwordInput);
  }
  
  /**
   * Check if login button is visible
   * @returns True if login button is visible, false otherwise
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.loginButton);
  }
}


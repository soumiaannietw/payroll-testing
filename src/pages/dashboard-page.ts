/**
 * Dashboard (Secure Area) Page Object Model
 * 
 * This class represents the Secure Area page of The Internet (Herokuapp).
 * This is the landing page after successful login.
 * URL: https://the-internet.herokuapp.com/secure
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logger } from '../utils/logger';

/**
 * DashboardPage class for handling secure area operations
 */
export class DashboardPage extends BasePage {
  // Locators for secure area page elements
  private readonly pageHeading: Locator;
  private readonly successMessage: Locator;
  private readonly logoutButton: Locator;
  private readonly secureContent: Locator;
  
  /**
   * Constructor for DashboardPage
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page);
    
    // Initialize all locators for The Internet secure area
    this.pageHeading = page.locator('h2');
    this.successMessage = page.locator('#flash.success');
    this.logoutButton = page.locator('a.button.secondary[href="/logout"]');
    this.secureContent = page.locator('#content.large-12.columns');
  }
  
  /**
   * Check if secure area (dashboard) is displayed
   * @returns True if secure area is visible, false otherwise
   */
  async isDashboardDisplayed(): Promise<boolean> {
    logger.step('Checking if secure area is displayed');
    return await this.isVisible(this.pageHeading);
  }
  
  /**
   * Get page heading text
   * @returns Page heading text
   */
  async getDashboardHeading(): Promise<string> {
    return await this.getText(this.pageHeading);
  }
  
  /**
   * Get success message
   * @returns Success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }
  
  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    logger.step('Logging out from application');
    await this.click(this.logoutButton, 'Logout button');
    await this.page.waitForLoadState('domcontentloaded');
    logger.info('Logout completed successfully');
  }
  
  /**
   * Check if logout button is visible
   * @returns True if logout button is visible, false otherwise
   */
  async isLogoutButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.logoutButton);
  }
  
  /**
   * Verify user is on secure area page
   * @returns True if on secure area, false otherwise
   */
  async verifySecureAreaPage(): Promise<boolean> {
    const heading = await this.getDashboardHeading();
    return heading.toLowerCase().includes('secure area');
  }
}


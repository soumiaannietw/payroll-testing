/**
 * Base Page Class
 * 
 * This is the base class for all Page Object Models.
 * It provides common methods and utilities that can be used across all pages.
 * All page classes should extend this base class to inherit common functionality.
 */

import { Page, Locator } from '@playwright/test';
import { logger } from '../utils/logger';

/**
 * BasePage class containing common page operations
 */
export class BasePage {
  protected page: Page;
  
  /**
   * Constructor for BasePage
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }
  
  /**
   * Navigate to a specific URL
   * @param url - URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    logger.step(`Navigating to URL: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }
  
  /**
   * Wait for an element to be visible
   * @param locator - Playwright Locator
   */
  async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }
  
  /**
   * Click on an element
   * @param locator - Playwright Locator
   * @param description - Description of the element for logging
   */
  async click(locator: Locator, description: string = 'element'): Promise<void> {
    logger.step(`Clicking on: ${description}`);
    await this.waitForElement(locator);
    await locator.click();
  }
  
  /**
   * Fill text in an input field
   * @param locator - Playwright Locator
   * @param text - Text to fill
   * @param description - Description of the field for logging
   */
  async fill(locator: Locator, text: string, description: string = 'field'): Promise<void> {
    logger.step(`Filling '${text}' in: ${description}`);
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }
  
  /**
   * Get text content of an element
   * @param locator - Playwright Locator
   * @returns Text content of the element
   */
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    const text = await locator.textContent();
    return text || '';
  }
  
  /**
   * Check if an element is visible
   * @param locator - Playwright Locator
   * @returns True if element is visible, false otherwise
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get current page title
   * @returns Page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }
  
  /**
   * Get current page URL
   * @returns Current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
  
  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Take a screenshot
   * @param fileName - Name of the screenshot file
   */
  async takeScreenshot(fileName: string): Promise<void> {
    logger.info(`Taking screenshot: ${fileName}`);
    await this.page.screenshot({ path: `test-results/screenshots/${fileName}.png` });
  }
}


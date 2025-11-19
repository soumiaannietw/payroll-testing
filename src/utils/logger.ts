/**
 * Logger Utility
 * 
 * This utility provides centralized logging functionality for the framework.
 * It supports different log levels (INFO, WARN, ERROR, DEBUG) and formats messages with timestamps.
 * All logs are written to console with appropriate formatting.
 */

/**
 * Enum for different log levels
 */
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

/**
 * Logger class for consistent logging across the framework
 */
export class Logger {
  private static instance: Logger;
  
  /**
   * Private constructor to implement singleton pattern
   */
  private constructor() {}
  
  /**
   * Get the singleton instance of Logger
   * @returns Logger instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  /**
   * Get current timestamp in formatted string
   * @returns Formatted timestamp string
   */
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }
  
  /**
   * Format log message with timestamp and level
   * @param level - Log level
   * @param message - Log message
   * @returns Formatted log message
   */
  private formatMessage(level: LogLevel, message: string): string {
    return `[${this.getTimestamp()}] [${level}] ${message}`;
  }
  
  /**
   * Log informational message
   * @param message - Message to log
   */
  public info(message: string): void {
    console.log(this.formatMessage(LogLevel.INFO, message));
  }
  
  /**
   * Log warning message
   * @param message - Message to log
   */
  public warn(message: string): void {
    console.warn(this.formatMessage(LogLevel.WARN, message));
  }
  
  /**
   * Log error message
   * @param message - Message to log
   */
  public error(message: string): void {
    console.error(this.formatMessage(LogLevel.ERROR, message));
  }
  
  /**
   * Log debug message
   * @param message - Message to log
   */
  public debug(message: string): void {
    console.debug(this.formatMessage(LogLevel.DEBUG, message));
  }
  
  /**
   * Log test step information
   * @param step - Test step description
   */
  public step(step: string): void {
    console.log(this.formatMessage(LogLevel.INFO, `STEP: ${step}`));
  }
}

// Export singleton instance
export const logger = Logger.getInstance();


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
import fs from 'fs';
import path from 'path';

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
  private logDir: string = '';
  private runLogPath: string | null = null;
  private errorLogPath: string = '';
  /**
   * Private constructor to implement singleton pattern
   */
  private constructor() { }

  /**
   * Initialize logging directory and error log path.
   * Does not create or select a run file automatically; call `startRun()` to begin a run.
   */
  private initPaths(): void {
    if (!this.logDir) {
      this.logDir = path.resolve(__dirname, '..', 'logging');
      try {
        if (!fs.existsSync(this.logDir)) {
          fs.mkdirSync(this.logDir, { recursive: true });
        }
      } catch (e) {
        // ignore directory creation errors; file writes will fail later if necessary
      }
    }
    this.errorLogPath = path.join(this.logDir, 'test_error.log');
  }

  /**
   * Get the singleton instance of Logger
   * @returns Logger instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
      Logger.instance.initPaths();
      // Automatically start a new run on first instantiation and rotate older runs
      try {
        Logger.instance.startRun();
      } catch (e) {
        // swallow errors during auto-start to avoid breaking test runs
      }
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
   * Choose or create the current run log file. Does not overwrite existing content unless forceNew is true.
   * If `test_run.log` is empty or does not exist, it will be used; otherwise the next numbered file is used.
   */
  public startRun(forceNew = false): void {
    this.initPaths();

    const current = path.join(this.logDir, 'test_run.log');
    const prev1 = path.join(this.logDir, 'test_run.1.log');
    const prev2 = path.join(this.logDir, 'test_run.2.log');

    try {
      // If current exists and we're not forcing reuse, rotate older runs
      if (fs.existsSync(current) && !forceNew) {
        // Move prev1 -> prev2 (overwrite)
        if (fs.existsSync(prev1)) {
          try {
            if (fs.existsSync(prev2)) fs.unlinkSync(prev2);
            fs.renameSync(prev1, prev2);
          } catch (e) {
            // best-effort: fallback to copy+unlink
            try {
              const data = fs.readFileSync(prev1);
              fs.writeFileSync(prev2, data);
              fs.unlinkSync(prev1);
            } catch (err) {
              // ignore
            }
          }
        }

        // Move current -> prev1
        try {
          if (fs.existsSync(prev1)) fs.unlinkSync(prev1);
          fs.renameSync(current, prev1);
        } catch (e) {
          try {
            const data = fs.readFileSync(current);
            fs.writeFileSync(prev1, data);
            fs.unlinkSync(current);
          } catch (err) {
            // ignore
          }
        }
      }

      // Create new current run file (overwrite if forceNew)
      try {
        fs.writeFileSync(current, `=== Test run started: ${new Date().toISOString()} ===\n`);
      } catch (e) {
        // if write fails, fallback to error log
        this.runLogPath = this.errorLogPath;
        return;
      }

      this.runLogPath = current;
    } catch (e) {
      // fallback: set to errorLogPath
      this.runLogPath = this.errorLogPath;
    }
  }

  /**
   * Rotate the run file (force a new run file)
   */
  public rotateRun(): void {
    this.startRun(true);
  }

  /**
   * Log informational message
   * @param message - Message to log
   */
  public info(message: string): void {
    const msg = this.formatMessage(LogLevel.INFO, message);
    console.log(msg);
    this.appendToRun(msg);
  }

  /**
   * Log warning message
   * @param message - Message to log
   */
  public warn(message: string): void {
    const msg = this.formatMessage(LogLevel.WARN, message);
    console.warn(msg);
    this.appendToRun(msg);
  }

  /**
   * Log error message
   * @param message - Message to log
   */
  public error(message: string): void {
    const msg = this.formatMessage(LogLevel.ERROR, message);
    console.error(msg);
    this.appendToRun(msg);
    this.appendToErrorLog(msg);
  }

  /**
   * Log debug message
   * @param message - Message to log
   */
  public debug(message: string): void {
    const msg = this.formatMessage(LogLevel.DEBUG, message);
    console.debug(msg);
    this.appendToRun(msg);
  }

  /**
   * Log test step information
   * @param step - Test step description
   */
  public step(step: string): void {
    const msg = this.formatMessage(LogLevel.INFO, `STEP: ${step}`);
    console.log(msg);
    this.appendToRun(msg);
  }

  /** Append a message to the active run log file (if selected) */
  private appendToRun(message: string): void {
    try {
      if (!this.runLogPath) this.startRun();
      if (this.runLogPath) fs.appendFileSync(this.runLogPath, message + '\n');
    } catch (e) {
      // swallow logging errors so they don't affect tests
    }
  }

  /** Append an error message to the persistent error log */
  private appendToErrorLog(message: string): void {
    try {
      if (!this.errorLogPath) this.initPaths();
      fs.appendFileSync(this.errorLogPath, message + '\n');
    } catch (e) {
      // swallow
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();


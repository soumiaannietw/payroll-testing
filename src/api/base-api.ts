/**
 * Base API Class
 * 
 * This is the base class for all API interactions.
 * It provides common methods for making HTTP requests (GET, POST, PUT, DELETE, PATCH).
 * All API endpoint classes should extend this base class.
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '../utils/logger';

/**
 * BaseAPI class containing common API operations
 */
export class BaseAPI {
  protected request: APIRequestContext;
  protected baseUrl: string;
  
  /**
   * Constructor for BaseAPI
   * @param request - Playwright APIRequestContext
   * @param baseUrl - Base URL for API endpoints
   */
  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }
  
  /**
   * Make a GET request
   * @param endpoint - API endpoint path
   * @param options - Additional request options
   * @returns API Response
   */
  async get(endpoint: string, options: any = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    logger.step(`GET Request to: ${url}`);
    
    const response = await this.request.get(url, options);
    
    logger.info(`Response Status: ${response.status()}`);
    return response;
  }
  
  /**
   * Make a POST request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Additional request options
   * @returns API Response
   */
  async post(endpoint: string, data: any = {}, options: any = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    logger.step(`POST Request to: ${url}`);
    logger.debug(`Request Body: ${JSON.stringify(data)}`);
    
    const response = await this.request.post(url, {
      data: data,
      ...options
    });
    
    logger.info(`Response Status: ${response.status()}`);
    return response;
  }
  
  /**
   * Make a PUT request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Additional request options
   * @returns API Response
   */
  async put(endpoint: string, data: any = {}, options: any = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    logger.step(`PUT Request to: ${url}`);
    logger.debug(`Request Body: ${JSON.stringify(data)}`);
    
    const response = await this.request.put(url, {
      data: data,
      ...options
    });
    
    logger.info(`Response Status: ${response.status()}`);
    return response;
  }
  
  /**
   * Make a PATCH request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Additional request options
   * @returns API Response
   */
  async patch(endpoint: string, data: any = {}, options: any = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    logger.step(`PATCH Request to: ${url}`);
    logger.debug(`Request Body: ${JSON.stringify(data)}`);
    
    const response = await this.request.patch(url, {
      data: data,
      ...options
    });
    
    logger.info(`Response Status: ${response.status()}`);
    return response;
  }
  
  /**
   * Make a DELETE request
   * @param endpoint - API endpoint path
   * @param options - Additional request options
   * @returns API Response
   */
  async delete(endpoint: string, options: any = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    logger.step(`DELETE Request to: ${url}`);
    
    const response = await this.request.delete(url, options);
    
    logger.info(`Response Status: ${response.status()}`);
    return response;
  }
  
  /**
   * Parse JSON response body
   * @param response - API Response
   * @returns Parsed JSON object
   */
  async getResponseBody(response: APIResponse): Promise<any> {
    const body = await response.json();
    logger.debug(`Response Body: ${JSON.stringify(body)}`);
    return body;
  }
}


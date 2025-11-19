/**
 * Users API Client
 * 
 * This class handles all API operations related to users endpoint.
 * It extends BaseAPI to inherit common HTTP methods (GET, POST, PUT, DELETE).
 * Base URL: https://jsonplaceholder.typicode.com
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseAPI } from './base-api';
import { logger } from '../utils/logger';

/**
 * Interface for User data structure
 */
export interface User {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

/**
 * Interface for Create User request
 */
export interface CreateUserRequest {
  name: string;
  job: string;
}

/**
 * Interface for Update User request
 */
export interface UpdateUserRequest {
  name?: string;
  job?: string;
}

/**
 * UsersAPI class for handling user-related API operations
 */
export class UsersAPI extends BaseAPI {
  
  /**
   * Constructor for UsersAPI
   * @param request - Playwright APIRequestContext
   * @param baseUrl - Base URL for API
   */
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }
  
  /**
   * Get list of users
   * @returns API Response containing list of users
   */
  async getUsers(): Promise<APIResponse> {
    logger.step('Getting users list');
    return await this.get('/users');
  }
  
  /**
   * Get a single user by ID
   * @param userId - User ID
   * @returns API Response containing user details
   */
  async getUserById(userId: number): Promise<APIResponse> {
    logger.step(`Getting user with ID: ${userId}`);
    return await this.get(`/users/${userId}`);
  }
  
  /**
   * Create a new user
   * @param userData - User data for creation
   * @returns API Response with created user details
   */
  async createUser(userData: CreateUserRequest): Promise<APIResponse> {
    logger.step(`Creating new user: ${userData.name}`);
    return await this.post('/users', userData);
  }
  
  /**
   * Update an existing user (PUT - full update)
   * @param userId - User ID to update
   * @param userData - Updated user data
   * @returns API Response with updated user details
   */
  async updateUser(userId: number, userData: UpdateUserRequest): Promise<APIResponse> {
    logger.step(`Updating user with ID: ${userId}`);
    return await this.put(`/users/${userId}`, userData);
  }
  
  /**
   * Partially update an existing user (PATCH)
   * @param userId - User ID to update
   * @param userData - Partial user data to update
   * @returns API Response with updated user details
   */
  async patchUser(userId: number, userData: UpdateUserRequest): Promise<APIResponse> {
    logger.step(`Patching user with ID: ${userId}`);
    return await this.patch(`/users/${userId}`, userData);
  }
  
  /**
   * Delete a user by ID
   * @param userId - User ID to delete
   * @returns API Response
   */
  async deleteUser(userId: number): Promise<APIResponse> {
    logger.step(`Deleting user with ID: ${userId}`);
    return await this.delete(`/users/${userId}`);
  }
  
  /**
   * Get user not found (testing 404)
   * @param userId - Non-existent user ID
   * @returns API Response with 404 status
   */
  async getUserNotFound(userId: number): Promise<APIResponse> {
    logger.step(`Getting non-existent user with ID: ${userId}`);
    return await this.get(`/users/${userId}`);
  }
}


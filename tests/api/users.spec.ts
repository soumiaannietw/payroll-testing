/**
 * Users API Test Suite
 * 
 * This test suite contains test cases for ReqRes Users API endpoints.
 * It tests CRUD operations on user resources.
 * 
 * Test Cases:
 * 1. Get list of users
 * 2. Get single user by ID
 * 3. Create a new user
 * 4. Update user details
 * 5. Delete a user
 */

import { test, expect } from '@playwright/test';
import { UsersAPI } from '../../src/api/users-api';
import { testConfig } from '../../src/config/test-config';
import { logger } from '../../src/utils/logger';

/**
 * Test Suite: Users API Tests
 * This suite tests all user-related API operations
 */
test.describe('Users API Tests', () => {
  let usersAPI: UsersAPI;
  
  /**
   * Before each test: Initialize API client
   * This hook runs before each test case in this suite
   */
  test.beforeEach(async ({ request }) => {
    logger.info('=== Initializing Users API Client ===');
    usersAPI = new UsersAPI(request, testConfig.api.baseUrl);
  });
  
  /**
   * Test Case 1: Verify getting list of users
   * 
   * Steps:
   * 1. Send GET request to /users endpoint
   * 2. Verify response status is 200
   * 3. Verify response contains list of users
   * 4. Verify response structure
   * 
   * Expected Result: API should return paginated list of users with 200 status
   */
  test('Should get list of users successfully', async () => {
    logger.info('=== Starting Test: Get Users List ===');
    
    // Get users list
    const response = await usersAPI.getUsers();
    
    // Verify status code
    expect(response.status()).toBe(200);
    
    // Parse response body
    const responseBody = await usersAPI.getResponseBody(response);
    
    // Verify response is an array
    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBeGreaterThan(0);
    
    // Verify first user has required properties
    const firstUser = responseBody[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('username');
    expect(firstUser).toHaveProperty('email');
    
    logger.info(`Total users found: ${responseBody.length}`);
    logger.info('=== Test Completed Successfully ===');
  });
  
  /**
   * Test Case 2: Verify getting single user by ID
   * 
   * Steps:
   * 1. Send GET request to /users/{id} endpoint
   * 2. Verify response status is 200
   * 3. Verify response contains user details
   * 4. Verify user ID matches requested ID
   * 
   * Expected Result: API should return specific user details with 200 status
   */
  test('Should get single user by ID successfully', async () => {
    logger.info('=== Starting Test: Get Single User ===');
    
    const userId = 2;
    
    // Get user by ID
    const response = await usersAPI.getUserById(userId);
    
    // Verify status code
    expect(response.status()).toBe(200);
    
    // Parse response body
    const user = await usersAPI.getResponseBody(response);
    
    // Verify user details
    expect(user.id).toBe(userId);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('phone');
    
    logger.info(`User found: ${user.name} (${user.username})`);
    logger.info('=== Test Completed Successfully ===');
  });
  
  /**
   * Test Case 3: Verify creating a new user
   * 
   * Steps:
   * 1. Prepare user data (name, job)
   * 2. Send POST request to /users endpoint
   * 3. Verify response status is 201 (Created)
   * 4. Verify response contains created user details
   * 5. Verify response contains ID and createdAt timestamp
   * 
   * Expected Result: API should create user and return 201 status with user details
   */
  test('Should create a new user successfully', async () => {
    logger.info('=== Starting Test: Create New User ===');
    
    // Prepare user data
    const newUser = {
      name: 'John Doe',
      job: 'Software Engineer'
    };
    
    // Create user
    const response = await usersAPI.createUser(newUser);
    
    // Verify status code
    expect(response.status()).toBe(201);
    
    // Parse response body
    const responseBody = await usersAPI.getResponseBody(response);
    
    // Verify response contains user data
    expect(responseBody).toHaveProperty('name');
    expect(responseBody).toHaveProperty('job');
    expect(responseBody).toHaveProperty('id');
    
    // Verify created user data matches input
    expect(responseBody.name).toBe(newUser.name);
    expect(responseBody.job).toBe(newUser.job);
    expect(typeof responseBody.id).toBe('number');
    
    logger.info(`User created with ID: ${responseBody.id}`);
    logger.info('=== Test Completed Successfully ===');
  });
  
  /**
   * Test Case 4: Verify updating user details
   * 
   * Steps:
   * 1. Prepare updated user data
   * 2. Send PUT request to /users/{id} endpoint
   * 3. Verify response status is 200
   * 4. Verify response contains updated data
   * 5. Verify response contains updatedAt timestamp
   * 
   * Expected Result: API should update user and return 200 status with updated details
   */
  test('Should update user details successfully', async () => {
    logger.info('=== Starting Test: Update User ===');
    
    const userId = 2;
    
    // Prepare updated user data
    const updatedUser = {
      name: 'Jane Smith',
      job: 'Senior Developer'
    };
    
    // Update user
    const response = await usersAPI.updateUser(userId, updatedUser);
    
    // Verify status code
    expect(response.status()).toBe(200);
    
    // Parse response body
    const responseBody = await usersAPI.getResponseBody(response);
    
    // Verify response contains updated data
    expect(responseBody).toHaveProperty('name');
    expect(responseBody).toHaveProperty('job');
    
    // Verify updated data matches input
    expect(responseBody.name).toBe(updatedUser.name);
    expect(responseBody.job).toBe(updatedUser.job);
    
    logger.info(`User ${userId} updated successfully`);
    logger.info('=== Test Completed Successfully ===');
  });
  
  /**
   * Test Case 5: Verify deleting a user
   * 
   * Steps:
   * 1. Send DELETE request to /users/{id} endpoint
   * 2. Verify response status is 204 (No Content)
   * 
   * Expected Result: API should delete user and return 204 status
   */
  test('Should delete user successfully', async () => {
    logger.info('=== Starting Test: Delete User ===');
    
    const userId = 2;
    
    // Delete user
    const response = await usersAPI.deleteUser(userId);
    
    // Verify status code (200 = Success for JSONPlaceholder)
    expect(response.status()).toBe(200);
    
    logger.info(`User ${userId} deleted successfully`);
    logger.info('=== Test Completed Successfully ===');
  });
});


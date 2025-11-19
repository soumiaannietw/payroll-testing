# Test Examples and Use Cases

This document provides practical examples and use cases to help you understand how to use the framework effectively.

## 📚 Table of Contents

- [UI Testing Examples](#ui-testing-examples)
- [API Testing Examples](#api-testing-examples)
- [Advanced Patterns](#advanced-patterns)
- [Real-World Scenarios](#real-world-scenarios)

## 🖥️ UI Testing Examples

### Example 1: Simple Login Test

This example demonstrates a basic login test with validation.

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login-page';
import { DashboardPage } from '../../src/pages/dashboard-page';
import { testConfig } from '../../src/config/test-config';

test('Verify successful login', async ({ page }) => {
  // Initialize page objects
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Navigate to application
  await loginPage.goto(testConfig.ui.baseUrl);
  
  // Perform login
  await loginPage.login(testConfig.ui.username, testConfig.ui.password);
  
  // Verify successful login
  expect(await dashboardPage.isDashboardDisplayed()).toBeTruthy();
});
```

**What this test does:**
1. Opens the login page
2. Enters credentials
3. Clicks login button
4. Verifies dashboard is displayed

### Example 2: Login and Logout Flow

This example shows a complete login and logout flow.

```typescript
test('Complete login and logout flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Login
  await loginPage.goto(testConfig.ui.baseUrl);
  await loginPage.login(testConfig.ui.username, testConfig.ui.password);
  
  // Step 2: Verify secure area is displayed
  expect(await dashboardPage.isDashboardDisplayed()).toBeTruthy();
  const heading = await dashboardPage.getDashboardHeading();
  expect(heading).toContain('Secure Area');
  
  // Step 3: Logout
  await dashboardPage.logout();
  
  // Step 4: Verify back on login page
  expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
});
```

**Use Case:** Testing complete authentication flow from login to logout

### Example 3: Negative Testing

This example demonstrates testing error conditions.

```typescript
test('Should validate invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto(testConfig.ui.baseUrl);
  
  // Try to login with invalid credentials
  await loginPage.login('invaliduser', 'wrongpassword');
  
  // Verify error message
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain('Your username is invalid!');
  
  // Verify still on login page
  expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
});
```

**Use Case:** Validating authentication error handling

## 🔌 API Testing Examples

### Example 1: Basic CRUD Operations

This example shows complete CRUD testing for an API resource.

```typescript
import { test, expect } from '@playwright/test';
import { UsersAPI } from '../../src/api/users-api';
import { testConfig } from '../../src/config/test-config';

test.describe('User CRUD Operations', () => {
  let usersAPI: UsersAPI;
  let createdUserId: number;
  
  test.beforeEach(async ({ request }) => {
    usersAPI = new UsersAPI(request, testConfig.api.baseUrl);
  });
  
  test('1. Create user', async () => {
    const userData = { name: 'Test User', job: 'Tester' };
    const response = await usersAPI.createUser(userData);
    expect(response.status()).toBe(201);
    
    const body = await usersAPI.getResponseBody(response);
    createdUserId = body.id;
  });
  
  test('2. Read user', async () => {
    const response = await usersAPI.getUserById(2);
    expect(response.status()).toBe(200);
  });
  
  test('3. Update user', async () => {
    const updatedData = { name: 'Updated User', job: 'Senior Tester' };
    const response = await usersAPI.updateUser(2, updatedData);
    expect(response.status()).toBe(200);
  });
  
  test('4. Delete user', async () => {
    const response = await usersAPI.deleteUser(2);
    expect(response.status()).toBe(204);
  });
});
```

**Use Case:** Testing all CRUD operations for a resource

### Example 2: Authentication Flow

This example demonstrates testing authentication workflows.

```typescript
import { test, expect } from '@playwright/test';
import { AuthAPI } from '../../src/api/auth-api';
import { testConfig } from '../../src/config/test-config';

test.describe('Authentication Flow', () => {
  let authAPI: AuthAPI;
  let authToken: string;
  
  test.beforeEach(async ({ request }) => {
    authAPI = new AuthAPI(request, testConfig.api.baseUrl);
  });
  
  test('Should complete full auth flow', async () => {
    // 1. Register new user
    const userData = {
      email: 'eve.holt@reqres.in',
      password: 'pistol'
    };
    
    const registerResponse = await authAPI.register(userData);
    expect(registerResponse.status()).toBe(200);
    
    const registerBody = await authAPI.getResponseBody(registerResponse);
    expect(registerBody).toHaveProperty('token');
    
    // 2. Login with registered user
    const loginResponse = await authAPI.login(userData);
    expect(loginResponse.status()).toBe(200);
    
    const loginBody = await authAPI.getResponseBody(loginResponse);
    authToken = loginBody.token;
    expect(authToken).toBeTruthy();
  });
});
```

**Use Case:** Testing complete authentication workflow

### Example 3: Response Schema Validation

This example shows how to validate API response structure.

```typescript
test('Should validate user response schema', async ({ request }) => {
  const usersAPI = new UsersAPI(request, testConfig.api.baseUrl);
  const response = await usersAPI.getUserById(1);
  const body = await usersAPI.getResponseBody(response);
  
  // Validate response structure
  expect(body).toHaveProperty('data');
  expect(body.data).toHaveProperty('id');
  expect(body.data).toHaveProperty('email');
  expect(body.data).toHaveProperty('first_name');
  expect(body.data).toHaveProperty('last_name');
  expect(body.data).toHaveProperty('avatar');
  
  // Validate data types
  expect(typeof body.data.id).toBe('number');
  expect(typeof body.data.email).toBe('string');
  expect(typeof body.data.first_name).toBe('string');
  
  // Validate email format
  expect(body.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});
```

**Use Case:** Ensuring API responses match expected schema

## 🎯 Advanced Patterns

### Pattern 1: Reusable Test Fixtures

Create reusable test fixtures for common setup.

```typescript
// test-fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { DashboardPage } from '../src/pages/dashboard-page';

type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: DashboardPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.goto(testConfig.ui.baseUrl);
    await loginPage.login(testConfig.ui.username, testConfig.ui.password);
    await use(new DashboardPage(page));
  }
});

// Usage in tests
test('Test with fixtures', async ({ authenticatedPage }) => {
  // Already logged in
  expect(await authenticatedPage.isDashboardDisplayed()).toBeTruthy();
});
```

### Pattern 2: Data-Driven Testing

Run same test with multiple data sets.

```typescript
const testUsers = [
  { firstName: 'John', lastName: 'Doe', expectedResult: 'success' },
  { firstName: 'Jane', lastName: 'Smith', expectedResult: 'success' },
  { firstName: 'Bob', lastName: 'Johnson', expectedResult: 'success' },
];

testUsers.forEach(({ firstName, lastName, expectedResult }) => {
  test(`Should add employee: ${firstName} ${lastName}`, async ({ page }) => {
    const pimPage = new PIMPage(page);
    
    await pimPage.addEmployee(firstName, '', lastName);
    
    if (expectedResult === 'success') {
      // Verify success
      expect(await pimPage.isEmployeeListDisplayed()).toBeTruthy();
    }
  });
});
```

### Pattern 3: API Response Chaining

Use response from one API call in another.

```typescript
test('Should chain API calls', async ({ request }) => {
  const usersAPI = new UsersAPI(request, testConfig.api.baseUrl);
  
  // Create user
  const createResponse = await usersAPI.createUser({
    name: 'Test User',
    job: 'Developer'
  });
  const createBody = await usersAPI.getResponseBody(createResponse);
  const userId = createBody.id;
  
  // Update the created user
  const updateResponse = await usersAPI.updateUser(userId, {
    name: 'Updated User',
    job: 'Senior Developer'
  });
  expect(updateResponse.status()).toBe(200);
  
  // Delete the user
  const deleteResponse = await usersAPI.deleteUser(userId);
  expect(deleteResponse.status()).toBe(204);
});
```

## 🌟 Real-World Scenarios

### Scenario 1: User Registration and Login

```typescript
test('Complete user registration and login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Navigate to app
  await loginPage.goto(testConfig.ui.baseUrl);
  
  // Login with credentials
  await loginPage.login(testConfig.ui.username, testConfig.ui.password);
  
  // Verify login success
  expect(await dashboardPage.verifyDashboardPage()).toBeTruthy();
  
  // Navigate through app
  await dashboardPage.navigateToPIM();
  
  // Logout
  await dashboardPage.logout();
  
  // Verify logout
  expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
});
```

### Scenario 2: Error Handling

```typescript
test('Should handle network errors gracefully', async ({ page }) => {
  // Simulate offline mode
  await page.context().setOffline(true);
  
  const loginPage = new LoginPage(page);
  
  try {
    await loginPage.goto(testConfig.ui.baseUrl);
  } catch (error) {
    // Expected to fail
    expect(error).toBeDefined();
  }
  
  // Go back online
  await page.context().setOffline(false);
  
  // Should work now
  await loginPage.goto(testConfig.ui.baseUrl);
  expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
});
```

### Scenario 3: Parallel API Requests

```typescript
test('Should handle parallel API requests', async ({ request }) => {
  const usersAPI = new UsersAPI(request, testConfig.api.baseUrl);
  
  // Make multiple parallel requests
  const [user1, user2, user3] = await Promise.all([
    usersAPI.getUserById(1),
    usersAPI.getUserById(2),
    usersAPI.getUserById(3),
  ]);
  
  // Verify all succeeded
  expect(user1.status()).toBe(200);
  expect(user2.status()).toBe(200);
  expect(user3.status()).toBe(200);
  
  // Verify unique users
  const body1 = await usersAPI.getResponseBody(user1);
  const body2 = await usersAPI.getResponseBody(user2);
  const body3 = await usersAPI.getResponseBody(user3);
  
  expect(body1.data.id).not.toBe(body2.data.id);
  expect(body2.data.id).not.toBe(body3.data.id);
});
```

## 💡 Tips and Tricks

### Tip 1: Use Test Tags

```typescript
test.describe('Smoke Tests @smoke', () => {
  test('Critical flow @critical', async ({ page }) => {
    // Test code
  });
});

// Run with: npx playwright test --grep @smoke
```

### Tip 2: Custom Assertions

```typescript
expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    return {
      pass,
      message: () => `Expected ${received} to be a valid email`
    };
  }
});

// Usage
expect(user.email).toBeValidEmail();
```

### Tip 3: Conditional Tests

```typescript
test('Desktop only test', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Only for Chrome');
  
  // Test code that only runs on Chrome
});
```

## 📚 Further Reading

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [API Testing Guide](https://playwright.dev/docs/api-testing)
- [Page Object Model](https://playwright.dev/docs/pom)

---

**Happy Testing! 🚀**


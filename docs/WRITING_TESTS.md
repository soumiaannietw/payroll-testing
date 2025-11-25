# Writing Tests Guide

This guide will help you write new tests for the framework. It covers both UI and API testing with practical examples.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Writing UI Tests](#writing-ui-tests)
- [Writing API Tests](#writing-api-tests)
- [Test Structure](#test-structure)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Debugging Tests](#debugging-tests)

## 🚀 Getting Started

### Prerequisites

Before writing tests, ensure you understand:
- Basic TypeScript/JavaScript
- Playwright API basics
- Page Object Model pattern
- Async/await concepts

### Test File Naming Convention

- UI Tests: `*.spec.ts` in `tests/ui/` folder
- API Tests: `*.spec.ts` in `tests/api/` folder
- Example: `login.spec.ts`, `employee.spec.ts`, `pay-group.spec.ts`

## 🖥️ Writing UI Tests

### Step 1: Create a New Page Object (if needed)

If testing a new page, first create a page object:

**File:** `src/pages/my-new-page.ts`

```typescript
/**
 * MyNewPage Page Object Model
 * 
 * This class represents the My New Page of the application.
 * Description of what this page does.
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logger } from '../utils/logger';

export class MyNewPage extends BasePage {
  // Define locators
  private readonly myElement: Locator;
  private readonly myButton: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.myElement = page.locator('#my-element');
    this.myButton = page.locator('button[data-test="my-button"]');
  }
  
  /**
   * Perform an action on the page
   */
  async performAction(): Promise<void> {
    logger.step('Performing action');
    await this.click(this.myButton, 'My Button');
  }
  
  /**
   * Get element text
   * @returns Element text content
   */
  async getElementText(): Promise<string> {
    return await this.getText(this.myElement);
  }
}
```

### Step 2: Write the Test

**File:** `tests/ui/my-new-test.spec.ts`

```typescript
/**
 * My New Test Suite
 * 
 * Description of what this test suite covers.
 * 
 * Test Cases:
 * 1. Test case description
 * 2. Another test case description
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login-page';
import { DashboardPage } from '../../src/pages/dashboard-page';
import { testConfig } from '../../src/config/test-config';
import { logger } from '../../src/utils/logger';

test.describe('My Test Suite', () => {
  
  /**
   * Before each test: Login to application
   */
  test.beforeEach(async ({ page }) => {
    logger.info('=== Running Before Test: Login ===');
    const loginPage = new LoginPage(page);
    await loginPage.goto(testConfig.ui.baseUrl);
    await loginPage.login(testConfig.ui.username, testConfig.ui.password);
    await page.waitForLoadState('domcontentloaded');
  });
  
  /**
   * Test Case 1: Description of what this test does
   * 
   * Steps:
   * 1. Step 1 description
   * 2. Step 2 description
   * 3. Step 3 description
   * 
   * Expected Result: What should happen
   */
  test('Should verify secure area is displayed', async ({ page }) => {
    logger.info('=== Starting Test: My Test ===');
    
    // Initialize page object
    const dashboardPage = new DashboardPage(page);
    
    // Verify secure area
    const isDisplayed = await dashboardPage.isDashboardDisplayed();
    expect(isDisplayed).toBeTruthy();
    
    // Verify heading
    const heading = await dashboardPage.getDashboardHeading();
    expect(heading).toContain('Secure Area');
    
    logger.info('=== Test Completed Successfully ===');
  });
});
```

### UI Test Template

Use this template for new UI tests:

```typescript
import { test, expect } from '@playwright/test';
import { /* Import required pages */ } from '../../src/pages/...';
import { testConfig } from '../../src/config/test-config';
import { logger } from '../../src/utils/logger';

test.describe('Test Suite Name', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup code (login, navigation, etc.)
  });
  
  test('Test case name', async ({ page }) => {
    logger.info('=== Starting Test: Test Name ===');
    
    // Arrange: Setup test data and objects
    
    // Act: Perform actions
    
    // Assert: Verify results
    
    logger.info('=== Test Completed Successfully ===');
  });
  
  test.afterEach(async ({ page }) => {
    // Cleanup code (optional)
  });
});
```

## 🔌 Writing API Tests

### Step 1: Create API Client (if needed)

If testing a new API resource, create an API client:

**File:** `src/api/my-api.ts`

```typescript
/**
 * MyAPI Client
 * 
 * This class handles all API operations for My Resource.
 * Base URL: Your API base URL
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseAPI } from './base-api';
import { logger } from '../utils/logger';

/**
 * Interface for request/response data
 */
export interface MyData {
  id?: number;
  name?: string;
  // Add other fields
}

export class MyAPI extends BaseAPI {
  
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }
  
  /**
   * Get all items
   * @returns API Response
   */
  async getItems(): Promise<APIResponse> {
    logger.step('Getting all items');
    return await this.get('/items');
  }
  
  /**
   * Get item by ID
   * @param id - Item ID
   * @returns API Response
   */
  async getItemById(id: number): Promise<APIResponse> {
    logger.step(`Getting item with ID: ${id}`);
    return await this.get(`/items/${id}`);
  }
  
  /**
   * Create new item
   * @param data - Item data
   * @returns API Response
   */
  async createItem(data: MyData): Promise<APIResponse> {
    logger.step(`Creating new item: ${data.name}`);
    return await this.post('/items', data);
  }
}
```

### Step 2: Write API Test

**File:** `tests/api/my-api.spec.ts`

```typescript
/**
 * MyAPI Test Suite
 * 
 * This test suite contains test cases for My API endpoints.
 * 
 * Test Cases:
 * 1. Test case description
 * 2. Another test case description
 */

import { test, expect } from '@playwright/test';
import { MyAPI } from '../../src/api/my-api';
import { testConfig } from '../../src/config/test-config';
import { logger } from '../../src/utils/logger';

test.describe('MyAPI Tests', () => {
  let myAPI: MyAPI;
  
  test.beforeEach(async ({ request }) => {
    logger.info('=== Initializing API Client ===');
    myAPI = new MyAPI(request, testConfig.api.baseUrl);
  });
  
  /**
   * Test Case: Description
   * 
   * Steps:
   * 1. Step description
   * 2. Step description
   * 
   * Expected Result: What should happen
   */
  test('Should perform expected API action', async () => {
    logger.info('=== Starting Test: API Test ===');
    
    // Arrange: Prepare test data
    const testData = {
      name: 'Test Item',
      // other fields
    };
    
    // Act: Make API call
    const response = await myAPI.createItem(testData);
    
    // Assert: Verify response
    expect(response.status()).toBe(201);
    
    const body = await myAPI.getResponseBody(response);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(testData.name);
    
    logger.info('=== Test Completed Successfully ===');
  });
});
```

### API Test Template

Use this template for new API tests:

```typescript
import { test, expect } from '@playwright/test';
import { /* Import API client */ } from '../../src/api/...';
import { testConfig } from '../../src/config/test-config';
import { logger } from '../../src/utils/logger';

test.describe('API Test Suite', () => {
  let apiClient: YourAPI;
  
  test.beforeEach(async ({ request }) => {
    apiClient = new YourAPI(request, testConfig.api.baseUrl);
  });
  
  test('API test case name', async () => {
    logger.info('=== Starting Test: Test Name ===');
    
    // Arrange: Prepare data
    
    // Act: Make API call
    
    // Assert: Verify response
    
    logger.info('=== Test Completed Successfully ===');
  });
});
```

## 📝 Test Structure

### Anatomy of a Good Test

```typescript
test('Should do something specific', async ({ page }) => {
  // 1. ARRANGE: Setup
  logger.info('=== Starting Test: Test Name ===');
  const page = new MyPage(page);
  const testData = { /* test data */ };
  
  // 2. ACT: Execute
  await page.performAction(testData);
  
  // 3. ASSERT: Verify
  const result = await page.getResult();
  expect(result).toBe('expected value');
  
  // 4. LOG: Document
  logger.info('=== Test Completed Successfully ===');
});
```

### Test Hooks

```typescript
test.describe('Test Suite', () => {
  
  // Runs once before all tests
  test.beforeAll(async () => {
    // One-time setup
  });
  
  // Runs before each test
  test.beforeEach(async ({ page }) => {
    // Per-test setup
  });
  
  // Runs after each test
  test.afterEach(async ({ page }) => {
    // Per-test cleanup
  });
  
  // Runs once after all tests
  test.afterAll(async () => {
    // One-time cleanup
  });
});
```

## ✅ Best Practices

### 1. Test Naming

**Good:**
```typescript
test('Should login successfully with valid credentials', async ({ page }) => {});
test('Should display error message when login fails', async ({ page }) => {});
```

**Bad:**
```typescript
test('test1', async ({ page }) => {});
test('login', async ({ page }) => {});
```

### 2. Assertions

**Good:**
```typescript
expect(response.status()).toBe(200);
expect(errorMessage).toContain('Invalid credentials');
expect(userData).toEqual(expectedData);
```

**Bad:**
```typescript
expect(true).toBeTruthy(); // Too generic
// No assertion at all
```

### 3. Test Independence

**Good:**
```typescript
test.beforeEach(async ({ page }) => {
  // Each test gets fresh state
  await loginPage.login(username, password);
});

test('Test 1', async ({ page }) => {
  // Independent test
});

test('Test 2', async ({ page }) => {
  // Independent test
});
```

**Bad:**
```typescript
let sharedData; // Tests depend on each other

test('Test 1', async ({ page }) => {
  sharedData = await createData();
});

test('Test 2', async ({ page }) => {
  await useData(sharedData); // Depends on Test 1
});
```

### 4. Using Locators

**Good:**
```typescript
page.locator('button[data-testid="submit"]')
page.locator('text=Login')
page.locator('#username')
```

**Bad:**
```typescript
page.locator('div > div > button') // Too fragile
page.locator('xpath=//button[1]') // Avoid XPath when possible
```

### 5. Waiting for Elements

**Good:**
```typescript
await page.locator('#element').waitFor({ state: 'visible' });
await page.waitForLoadState('networkidle');
```

**Bad:**
```typescript
await page.waitForTimeout(5000); // Hard waits - avoid!
```

### 6. Error Handling

**Good:**
```typescript
test('Should handle error gracefully', async ({ page }) => {
  try {
    await page.performAction();
  } catch (error) {
    logger.error(`Action failed: ${error.message}`);
    throw error;
  }
});
```

## 🎯 Common Patterns

### Pattern 1: Data-Driven Testing

```typescript
const testData = [
  { username: 'user1', password: 'pass1', expected: 'success' },
  { username: 'user2', password: 'pass2', expected: 'success' },
];

testData.forEach(({ username, password, expected }) => {
  test(`Should login with ${username}`, async ({ page }) => {
    await loginPage.login(username, password);
    expect(await dashboardPage.isDisplayed()).toBe(expected === 'success');
  });
});
```

### Pattern 2: Reusable Test Steps

```typescript
// Create helper function
async function setupTestUser(page: Page, userData: UserData) {
  const adminPage = new AdminPage(page);
  await adminPage.createUser(userData);
  return userData;
}

// Use in tests
test('Test with user setup', async ({ page }) => {
  const user = await setupTestUser(page, testUserData);
  // Continue with test
});
```

### Pattern 3: API Response Validation

```typescript
test('Should validate API response structure', async () => {
  const response = await api.getUser(1);
  const body = await api.getResponseBody(response);
  
  // Validate status
  expect(response.status()).toBe(200);
  
  // Validate structure
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('email');
  expect(typeof body.id).toBe('number');
  expect(body.email).toMatch(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
});
```

## 🐛 Debugging Tests

### 1. Run in Debug Mode

```bash
npm run test:debug
```

### 2. Add Debug Statements

```typescript
await page.pause(); // Pause test execution
console.log('Debug info:', await element.textContent());
```

### 3. Enable Verbose Logging

```typescript
logger.debug('Detailed debug information');
logger.info('Current state:', await page.url());
```

### 4. Take Screenshots

```typescript
await page.screenshot({ path: 'debug-screenshot.png' });
```

### 5. Inspect Locators

```bash
npx playwright codegen https://your-app.com
```

## 📚 Examples Reference

For complete working examples, see:
- UI Tests: `tests/ui/*.spec.ts`
- API Tests: `tests/api/*.spec.ts`
- Page Objects: `src/pages/*.ts`
- API Clients: `src/api/*.ts`

## 🎓 Next Steps

After writing tests:
1. Run tests locally: `npm test`
2. Check test report: `npm run report`
3. Fix any failures
4. Commit your changes
5. Create pull request

## 💡 Tips

- Start with simple tests and gradually add complexity
- Keep tests focused on one thing
- Use descriptive names for tests and variables
- Add comments for complex logic
- Review existing tests for patterns
- Ask for help when stuck!

---

**Happy Test Writing! 🚀**


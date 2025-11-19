# Quick Start Guide

Get up and running with the test automation framework in 5 minutes!

## ⚡ Prerequisites

- Node.js 18+ installed
- npm installed
- Terminal/Command Prompt access

## 🚀 Installation (3 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Install Browsers

```bash
npx playwright install
```

### Step 3: Verify Installation

```bash
npx playwright --version
```

You should see the Playwright version number.

## 🏃 Running Tests

### Run All Tests

```bash
npm test
```

### Run Only UI Tests

```bash
npm run test:ui
```

### Run Only API Tests

```bash
npm run test:api
```

### Run Tests with Visible Browser

```bash
npm run test:headed
```

## 📊 View Test Report

After running tests, view the HTML report:

```bash
npm run report
```

This will automatically open the report in your browser showing:
- ✅ Test results (passed/failed)
- 📸 Screenshots of failures
- 🎥 Videos of failed tests
- 📝 Detailed test logs

## 📁 Project Structure at a Glance

```
payroll-testing/
├── src/
│   ├── pages/      # UI Page Objects
│   ├── api/        # API Clients
│   ├── utils/      # Utilities (Logger)
│   └── config/     # Configuration
├── tests/
│   ├── ui/         # UI Test Cases
│   └── api/        # API Test Cases
└── test-results/   # Reports & Artifacts
```

## ✍️ Writing Your First Test

### UI Test Example

Create `tests/ui/my-test.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login-page';
import { testConfig } from '../../src/config/test-config';

test('My first UI test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(testConfig.ui.baseUrl);
  expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
});
```

### API Test Example

Create `tests/api/my-api-test.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { UsersAPI } from '../../src/api/users-api';
import { testConfig } from '../../src/config/test-config';

test('My first API test', async ({ request }) => {
  const usersAPI = new UsersAPI(request, testConfig.api.baseUrl);
  const response = await usersAPI.getUsers();
  expect(response.status()).toBe(200);
});
```

## 🎯 Example Test Scenarios

The framework comes with ready-to-run tests:

### UI Tests (The Internet - Herokuapp)
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Login page elements verification
- ✅ Secure area display
- ✅ Logout functionality

### API Tests (JSONPlaceholder)
- ✅ User CRUD Operations
- ✅ Authentication (Login/Register)
- ✅ Resource Management
- ✅ Error Handling

## 🔧 Common Commands

```bash
# Install everything
npm install && npx playwright install

# Run all tests
npm test

# Run specific test file
npx playwright test tests/ui/login.spec.ts

# Run tests by name pattern
npx playwright test --grep "login"

# Debug mode
npm run test:debug

# View report
npm run report

# Clean test results
npm run clean
```

## 📚 Next Steps

1. ✅ Run the example tests to see the framework in action
2. 📖 Read [README.md](README.md) for detailed documentation
3. 🏗️ Check [ARCHITECTURE.md](docs/ARCHITECTURE.md) to understand the framework design
4. ✍️ Follow [WRITING_TESTS.md](docs/WRITING_TESTS.md) to write your own tests
5. 🤝 Read [CONTRIBUTING.md](docs/CONTRIBUTING.md) before contributing

## 🆘 Troubleshooting

### Tests Failing?

1. **Check Node version**: `node --version` (should be 18+)
2. **Reinstall dependencies**: `npm install`
3. **Reinstall browsers**: `npx playwright install --force`
4. **Check network**: Ensure you can access test URLs

### Browser Not Opening?

Run in headed mode to see what's happening:
```bash
npm run test:headed
```

### Need More Help?

- Check the [README.md](README.md) troubleshooting section
- Review test logs in `test-results/`
- Check Playwright documentation: https://playwright.dev

## 🎉 You're All Set!

You now have a complete test automation framework ready to use. Start by running the example tests and then write your own!

```bash
# Run the examples
npm test

# View the report
npm run report
```

---

**Happy Testing! 🚀**


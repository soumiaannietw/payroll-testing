# Playwright + TypeScript Test Automation Framework

A comprehensive, scalable test automation framework built with Playwright and TypeScript for both UI and API testing.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Viewing Reports](#viewing-reports)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

This framework provides a robust foundation for automated testing with:
- **UI Testing**: The Internet (Herokuapp) - reliable test automation practice site
- **API Testing**: Payroll System API endpoints (Employee, Pay Groups)
- **Design Pattern**: Page Object Model (POM)
- **Reporting**: HTML reports with screenshots and videos
- **Logging**: Structured logging for better debugging

## ✨ Features

- ✅ Playwright + TypeScript for modern test automation
- ✅ Page Object Model (POM) design pattern
- ✅ Separate test suites for UI and API testing
- ✅ Built-in authentication handling
- ✅ Comprehensive logging system
- ✅ HTML reporting with test artifacts
- ✅ Reusable base classes for pages and APIs
- ✅ TypeScript type safety
- ✅ Parallel test execution
- ✅ Screenshot and video capture on failure
- ✅ Easy to extend and maintain

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd payroll-testing
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Playwright
- TypeScript
- Type definitions

### Step 3: Install Playwright Browsers

```bash
npx playwright install
```

This command downloads the browser binaries (Chromium, Firefox, WebKit) required by Playwright.

### Step 4: Verify Installation

```bash
npx playwright --version
```

You should see the Playwright version number, confirming successful installation.

## 📁 Project Structure

```
payroll-testing/
├── src/                          # Source code
│   ├── api/                      # API client modules
│   │   ├── base-api.ts          # Base API class with HTTP methods
│   │   ├── employee-api.ts      # Employee API endpoints
│   │   └── pay-group-api.ts     # Pay Group API endpoints
│   ├── pages/                    # Page Object Models
│   │   ├── base-page.ts         # Base page class
│   │   ├── login-page.ts        # Login page
│   │   ├── dashboard-page.ts    # Dashboard page
│   │   ├── pim-page.ts          # PIM page
│   │   └── admin-page.ts        # Admin page
│   ├── utils/                    # Utility modules
│   │   └── logger.ts            # Logging utility
│   └── config/                   # Configuration files
│       └── test-config.ts       # Test configuration
├── tests/                        # Test files
│   ├── ui/                      # UI test cases
│   │   ├── login.spec.ts        # Login tests
│   │   ├── dashboard.spec.ts    # Dashboard tests
│   │   └── navigation.spec.ts   # Navigation tests
│   └── api/                     # API test cases
│       ├── employee.spec.ts     # Employee API tests
│       └── pay-group.spec.ts    # Pay Group API tests
├── test-results/                 # Test execution results
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## ⚙️ Configuration

### Default Configuration

The framework works out-of-the-box with these defaults:
- ✅ **Payroll API**: `http://localhost:8080/tw-payroll-system/api`
- ✅ **UI Base URL**: `https://the-internet.herokuapp.com`
- ✅ **Timeouts**: 20 seconds

**No configuration needed for local development!** Just run `npm test` and you're ready to go.

### Environment Variables

You can customize test execution by setting environment variables:

```bash
# UI Configuration
export UI_BASE_URL="https://the-internet.herokuapp.com"
export UI_USERNAME="tomsmith"
export UI_PASSWORD="SuperSecretPassword!"

# API Configuration (Payroll System)
# PAYROLL_API_BASE_URL defaults to http://localhost:8080/tw-payroll-system/api if not set
export PAYROLL_API_BASE_URL="http://localhost:8080/tw-payroll-system/api"
export API_TIMEOUT="30000"

# General Configuration
export DEFAULT_TIMEOUT="30000"
```

### Playwright Configuration

The `playwright.config.ts` file contains all Playwright settings:
- Test directory paths
- Browser configurations
- Timeout settings
- Reporter settings
- Viewport size
- Screenshot and video settings

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run UI Tests Only

```bash
npm run test:ui
```

### Run API Tests Only

```bash
npm run test:api
```

### Run Tests in Headed Mode (with visible browser)

```bash
npm run test:headed
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Specific Test File

```bash
npx playwright test tests/ui/login.spec.ts
```

### Run Tests by Tag/Grep

```bash
npx playwright test --grep "login"
```

### Run Tests in Parallel

By default, tests run in parallel. To control the number of workers:

```bash
npx playwright test --workers=4
```

## 📊 Viewing Reports

### View HTML Report

After test execution, view the HTML report:

```bash
npm run report
```

This will open the HTML report in your default browser showing:
- Test results (passed/failed)
- Test duration
- Screenshots of failures
- Videos of failed tests
- Test logs

### Report Location

Reports are generated in:
- HTML Report: `test-results/html-report/`
- JSON Report: `test-results/test-results.json`
- Screenshots: `test-results/artifacts/`

## 📝 Writing Tests

For detailed guidance on writing new tests, see [WRITING_TESTS.md](docs/WRITING_TESTS.md)

### Quick Start - UI Test

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login-page';

test('My new UI test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('https://example.com');
  // Add your test steps
});
```

### Quick Start - API Test

```typescript
import { test, expect } from '@playwright/test';
import { PayGroupApi } from '../../src/api/pay-group-api';
import { testConfig } from '../../src/config/test-config';

test('My new API test', async ({ request }) => {
  const payGroupApi = new PayGroupApi(request, testConfig.api.baseUrl);
  const response = await payGroupApi.getPayGroups();
  expect(response.status()).toBe(200);
});
```

## 🎯 Best Practices

1. **Follow Page Object Model**: Keep page elements and actions in page classes
2. **Use Descriptive Test Names**: Test names should clearly describe what they test
3. **Add Comments**: Document complex logic and test scenarios
4. **Use Logger**: Utilize the logger utility for better debugging
5. **Keep Tests Independent**: Each test should be able to run independently
6. **Use beforeEach for Setup**: Common setup should be in beforeEach hooks
7. **Clean Test Data**: Clean up any test data created during tests
8. **Assertions**: Use meaningful assertions with clear error messages
9. **Wait Properly**: Use Playwright's auto-waiting, avoid hard waits
10. **Organize Tests**: Group related tests using describe blocks

## 🔧 Troubleshooting

### Tests Failing Due to Timeout

Increase timeout in `playwright.config.ts`:

```typescript
timeout: 60 * 1000, // 60 seconds
```

### Browser Not Launching

Reinstall browsers:

```bash
npx playwright install --force
```

### Element Not Found

Check if element locators are correct and element is visible:

```typescript
await page.locator('selector').waitFor({ state: 'visible' });
```

### Tests Failing on CI

Ensure you're using correct CI configuration in `playwright.config.ts`:

```typescript
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📚 Additional Documentation

- [Architecture Diagram](docs/ARCHITECTURE.md) - Framework architecture and design
- [Writing Tests Guide](docs/WRITING_TESTS.md) - How to write new tests
- [Contributing Guide](docs/CONTRIBUTING.md) - Contribution guidelines

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Playwright team for the excellent testing framework
- The Internet (Herokuapp) for providing reliable test automation practice site
- Payroll System team for the API endpoints

## 📞 Support

For questions and support, please create an issue in the repository.

---

**Happy Testing! 🚀**


# Framework Architecture

## 🏗️ Overview

This document describes the architecture of the Playwright + TypeScript test automation framework. The framework follows industry best practices and design patterns to ensure maintainability, scalability, and reusability.

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Test Automation Framework                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         ┌──────▼──────┐           ┌───────▼────────┐
         │  UI Tests   │           │   API Tests    │
         │  (Spec.ts)  │           │   (Spec.ts)    │
         └──────┬──────┘           └───────┬────────┘
                │                           │
         ┌──────▼──────────┐       ┌───────▼────────────┐
         │  Page Objects   │       │   API Clients      │
         │  (POM Pattern)  │       │   (HTTP Methods)   │
         └──────┬──────────┘       └───────┬────────────┘
                │                           │
         ┌──────▼──────────┐       ┌───────▼────────────┐
         │   Base Page     │       │    Base API        │
         │   (Common UI    │       │   (Common HTTP     │
         │    Methods)     │       │     Methods)       │
         └──────┬──────────┘       └───────┬────────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
                ┌─────────────▼──────────────┐
                │      Utilities             │
                │  ┌────────────────────┐    │
                │  │  Logger            │    │
                │  │  Config            │    │
                │  └────────────────────┘    │
                └────────────────────────────┘
                              │
                ┌─────────────▼──────────────┐
                │     Playwright Core        │
                │  ┌────────────────────┐    │
                │  │  Browser Context   │    │
                │  │  API Context       │    │
                │  └────────────────────┘    │
                └────────────────────────────┘
                              │
                ┌─────────────▼──────────────┐
                │         Reporters          │
                │  ┌────────────────────┐    │
                │  │  HTML Report       │    │
                │  │  JSON Report       │    │
                │  │  Console Report    │    │
                │  └────────────────────┘    │
                └────────────────────────────┘
```

## 🎨 Design Patterns

### 1. Page Object Model (POM)

The framework implements the Page Object Model design pattern for UI testing:

**Benefits:**
- Separation of test logic from page structure
- Reusability of page methods across multiple tests
- Easy maintenance when UI changes
- Better readability of test code

**Implementation:**
```
BasePage (Abstract)
    ├── Common methods (click, fill, getText, etc.)
    └── Inherited by all page classes
         ├── LoginPage
         ├── DashboardPage
         ├── PIMPage
         └── AdminPage
```

### 2. API Client Pattern

Similar to POM, API testing follows a client pattern:

**Implementation:**
```
BaseAPI (Abstract)
    ├── HTTP methods (GET, POST, PUT, DELETE, PATCH)
    └── Inherited by all API classes
         ├── EmployeeApi
         └── PayGroupApi
```

### 3. Singleton Pattern

The Logger utility implements the Singleton pattern:
- Ensures only one instance of logger exists
- Provides global access point to logging functionality

## 📦 Layer Architecture

### Layer 1: Test Layer (tests/)

**Purpose:** Contains actual test cases and test scenarios

**Components:**
- UI test specifications (tests/ui/*.spec.ts)
- API test specifications (tests/api/*.spec.ts)

**Responsibilities:**
- Define test scenarios
- Use page objects and API clients
- Perform assertions
- Handle test setup and teardown

### Layer 2: Page Object Layer (src/pages/)

**Purpose:** Encapsulates UI page structure and interactions

**Components:**
- base-page.ts (Base class)
- login-page.ts
- dashboard-page.ts
- pim-page.ts
- admin-page.ts

**Responsibilities:**
- Define page locators
- Implement page-specific actions
- Provide methods to interact with page elements
- Hide implementation details from tests

### Layer 3: API Client Layer (src/api/)

**Purpose:** Encapsulates API endpoint interactions

**Components:**
- base-api.ts (Base class)
- employee-api.ts
- pay-group-api.ts

**Responsibilities:**
- Define API endpoints
- Implement HTTP request methods
- Handle request/response data
- Provide type-safe interfaces

### Layer 4: Utilities Layer (src/utils/)

**Purpose:** Provides common utilities and helper functions

**Components:**
- logger.ts (Logging utility)

**Responsibilities:**
- Centralized logging
- Common helper functions
- Reusable utility methods

### Layer 5: Configuration Layer (src/config/)

**Purpose:** Manages test configuration and environment settings

**Components:**
- test-config.ts

**Responsibilities:**
- Store configuration data
- Manage environment variables
- Provide configuration to tests

## 🔄 Test Execution Flow

### UI Test Flow

```
1. Test Start
   └── Initialize Page Objects
       └── Navigate to Application
           └── Perform Authentication (beforeEach)
               └── Execute Test Steps
                   └── Perform Assertions
                       └── Generate Report
                           └── Test End
```

### API Test Flow

```
1. Test Start
   └── Initialize API Client
       └── Prepare Request Data
           └── Send HTTP Request
               └── Receive Response
                   └── Validate Response
                       └── Perform Assertions
                           └── Generate Report
                               └── Test End
```

## 🏛️ Core Components

### BasePage Class

**Location:** `src/pages/base-page.ts`

**Purpose:** Provides common UI interaction methods

**Key Methods:**
- `navigateTo()` - Navigate to URL
- `click()` - Click element
- `fill()` - Fill input field
- `getText()` - Get element text
- `isVisible()` - Check element visibility
- `waitForElement()` - Wait for element

### BaseAPI Class

**Location:** `src/api/base-api.ts`

**Purpose:** Provides common HTTP methods

**Key Methods:**
- `get()` - GET request
- `post()` - POST request
- `put()` - PUT request
- `patch()` - PATCH request
- `delete()` - DELETE request
- `getResponseBody()` - Parse response

### Logger Utility

**Location:** `src/utils/logger.ts`

**Purpose:** Centralized logging system

**Key Features:**
- Different log levels (INFO, WARN, ERROR, DEBUG)
- Timestamp formatting
- Singleton pattern
- Test step logging

## 🔐 Authentication Handling

### UI Authentication

Implemented in `beforeEach` hooks:
```typescript
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(baseUrl);
  await loginPage.login(username, password);
});
```

### API Authentication

Handled through dedicated AuthAPI class:
```typescript
const authAPI = new AuthAPI(request, baseUrl);
const response = await authAPI.login(credentials);
const token = await response.json().token;
```

## 📊 Reporting System

### Report Types

1. **HTML Report**
   - Visual representation of test results
   - Screenshots on failure
   - Videos on failure
   - Test logs

2. **JSON Report**
   - Machine-readable format
   - Integration with CI/CD
   - Historical data analysis

3. **Console Report**
   - Real-time test execution status
   - Quick feedback during development

### Report Generation Flow

```
Test Execution
    └── Test Result (Pass/Fail)
        └── Capture Artifacts (Screenshots/Videos)
            └── Collect Logs
                └── Generate Report Files
                    └── HTML Report
                    └── JSON Report
```

## 🔌 Extensibility

### Adding New UI Page

1. Create new page class extending BasePage
2. Define page locators
3. Implement page-specific methods
4. Create corresponding test file

### Adding New API Endpoint

1. Create new API class extending BaseAPI
2. Define endpoint methods
3. Add type interfaces
4. Create corresponding test file

### Adding New Test Suite

1. Create new spec file in appropriate folder (ui/api)
2. Import required page objects/API clients
3. Write test cases using describe/test blocks
4. Run tests using npm commands

## 🎯 Best Practices Implementation

### 1. Separation of Concerns
- Tests separate from page/API implementation
- Clear layer boundaries
- Each layer has specific responsibility

### 2. DRY (Don't Repeat Yourself)
- Common functionality in base classes
- Reusable methods
- Shared utilities

### 3. Single Responsibility Principle
- Each class has one responsibility
- Page class manages one page
- API class manages one resource

### 4. Encapsulation
- Hide implementation details
- Expose only necessary methods
- Use private members where appropriate

### 5. Type Safety
- TypeScript interfaces
- Type checking
- Better IDE support

## 🚀 Scalability Considerations

### Horizontal Scaling
- Parallel test execution
- Multiple browser instances
- Independent test suites

### Vertical Scaling
- Easy to add new tests
- Simple to add new pages/APIs
- Modular structure

### Maintenance
- Clear structure for easy debugging
- Comprehensive logging
- Well-documented code

## 🔄 CI/CD Integration

The framework is designed for easy CI/CD integration:

```yaml
# Example CI configuration
- Install dependencies
- Install browsers
- Run tests
- Generate reports
- Publish results
```

## 📈 Future Enhancements

Possible extensions to the framework:
- Data-driven testing
- Custom reporting dashboard
- Performance testing capabilities
- Visual regression testing
- Mobile testing support
- Cross-browser testing matrix
- Test data management
- Allure reporting integration

## 🎓 Learning Resources

To better understand the architecture:
1. Read Playwright documentation
2. Study TypeScript basics
3. Learn about design patterns
4. Understand test automation best practices

---

This architecture provides a solid foundation for enterprise-level test automation while remaining simple enough for newcomers to understand and extend.


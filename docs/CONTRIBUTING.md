# Contributing Guide

Thank you for your interest in contributing to this test automation framework! This document provides guidelines and best practices for contributing.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Code Review](#code-review)

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js 18.x or higher installed
- Git installed and configured
- Basic understanding of TypeScript and Playwright
- Familiarity with the project structure

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/payroll-testing.git
   cd payroll-testing
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/payroll-testing.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   npx playwright install
   ```

5. **Verify setup**
   ```bash
   npm test
   ```

## 🔄 Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### 2. Make Your Changes

Follow the coding standards and best practices outlined below.

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific tests
npx playwright test tests/ui/your-test.spec.ts

# Run in headed mode for debugging
npm run test:headed
```

### 4. Commit Your Changes

Follow commit message guidelines (see below).

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request

Go to GitHub and create a pull request from your branch.

## 📝 Coding Standards

### TypeScript Style Guide

#### 1. Naming Conventions

```typescript
// Classes: PascalCase
class LoginPage extends BasePage {}

// Interfaces: PascalCase with 'I' prefix (optional)
interface UserData {}

// Functions/Methods: camelCase
async function getUserData() {}

// Variables: camelCase
const userName = 'test';

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Private members: prefix with underscore (optional)
private _internalState: string;
```

#### 2. File Naming

```
// Page objects: kebab-case
login-page.ts
dashboard-page.ts

// API clients: kebab-case
users-api.ts
auth-api.ts

// Test files: kebab-case with .spec.ts
login.spec.ts
users.spec.ts

// Utilities: kebab-case
logger.ts
test-config.ts
```

#### 3. Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at end of statements
- Max line length: 100 characters
- Use trailing commas in multi-line objects/arrays

```typescript
// Good
const user = {
  name: 'John',
  email: 'john@example.com',
};

// Bad
const user = {
  name: "John",
  email: "john@example.com"
}
```

#### 4. Type Safety

Always use TypeScript types:

```typescript
// Good
async function getUser(id: number): Promise<User> {
  const response: APIResponse = await api.get(`/users/${id}`);
  return await response.json();
}

// Bad
async function getUser(id) {
  const response = await api.get(`/users/${id}`);
  return await response.json();
}
```

### Code Organization

#### 1. Import Order

```typescript
// 1. External libraries
import { test, expect } from '@playwright/test';

// 2. Internal modules (pages/api)
import { LoginPage } from '../../src/pages/login-page';
import { UsersAPI } from '../../src/api/users-api';

// 3. Utilities
import { logger } from '../../src/utils/logger';

// 4. Config
import { testConfig } from '../../src/config/test-config';
```

#### 2. Class Structure

```typescript
export class MyClass {
  // 1. Private properties
  private readonly myProperty: string;
  
  // 2. Public properties
  public myPublicProperty: number;
  
  // 3. Constructor
  constructor(param: string) {
    this.myProperty = param;
  }
  
  // 4. Public methods
  public async publicMethod(): Promise<void> {}
  
  // 5. Private methods
  private async privateMethod(): Promise<void> {}
}
```

### Documentation Standards

#### 1. File Header Comments

```typescript
/**
 * File Name
 * 
 * Brief description of what this file does.
 * Additional context if needed.
 */
```

#### 2. Class Comments

```typescript
/**
 * ClassName - Brief description
 * 
 * Detailed description of the class purpose and usage.
 */
export class ClassName {}
```

#### 3. Method Comments

```typescript
/**
 * Method description
 * 
 * Additional details about what the method does.
 * 
 * @param paramName - Parameter description
 * @returns Return value description
 */
async methodName(paramName: string): Promise<void> {}
```

#### 4. Test Comments

```typescript
/**
 * Test Case: Brief description
 * 
 * Steps:
 * 1. First step
 * 2. Second step
 * 3. Third step
 * 
 * Expected Result: What should happen
 */
test('Should do something', async ({ page }) => {});
```

## 📨 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

```bash
# Feature
feat(ui): add employee management page object

# Bug fix
fix(api): correct authentication header format

# Documentation
docs(readme): update installation instructions

# Test
test(api): add tests for user deletion endpoint

# Refactor
refactor(pages): simplify base page methods
```

### Good Commit Messages

```
✓ feat(ui): add login page object model
✓ fix(api): handle 404 response correctly
✓ docs(contributing): add commit guidelines
✓ test(ui): add tests for dashboard navigation
```

### Bad Commit Messages

```
✗ fixed stuff
✗ updates
✗ WIP
✗ test
```

## 🔍 Pull Request Process

### Before Submitting

- [ ] All tests pass locally
- [ ] Code follows style guidelines
- [ ] Comments and documentation added
- [ ] No linter errors
- [ ] Branch is up to date with main

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How were these changes tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. Submit PR with clear description
2. Wait for automated checks to pass
3. Request review from maintainers
4. Address review comments
5. Get approval
6. Merge after approval

## 🧪 Testing Guidelines

### Writing Tests

1. **Test Independence**
   - Each test should be independent
   - Use beforeEach for setup
   - Clean up test data

2. **Test Coverage**
   - Add tests for new features
   - Add tests for bug fixes
   - Include positive and negative scenarios

3. **Test Naming**
   - Use descriptive names
   - Follow "Should do X when Y" pattern

4. **Assertions**
   - Use meaningful assertions
   - Include clear error messages
   - Test one thing per test

### Running Tests

```bash
# Run all tests
npm test

# Run specific suite
npm run test:ui
npm run test:api

# Run with debugging
npm run test:debug

# Run specific file
npx playwright test tests/ui/login.spec.ts
```

## 📚 Documentation

### When to Update Documentation

Update documentation when:
- Adding new features
- Changing existing functionality
- Adding new APIs or pages
- Modifying configuration
- Changing test patterns

### Documentation Files

- `README.md` - Main documentation
- `ARCHITECTURE.md` - Framework architecture
- `WRITING_TESTS.md` - Test writing guide
- `CONTRIBUTING.md` - This file

## 👀 Code Review

### As a Reviewer

- Be respectful and constructive
- Check for code quality and standards
- Verify tests are included
- Ensure documentation is updated
- Test changes locally if needed

### As an Author

- Respond to comments promptly
- Be open to feedback
- Explain your decisions
- Update PR based on feedback
- Thank reviewers

### Review Checklist

- [ ] Code follows style guide
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No unnecessary changes
- [ ] Commits are clean and logical
- [ ] PR description is clear

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows]
- Node version: [e.g., 18.x]
- Playwright version: [e.g., 1.40.0]

## Screenshots/Logs
If applicable, add screenshots or error logs
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other information
```

## 🎯 Best Practices

1. **Keep PRs Small**
   - Focus on one feature/fix per PR
   - Easier to review
   - Faster to merge

2. **Write Clear Commits**
   - Descriptive commit messages
   - Logical commit structure
   - Easy to track changes

3. **Test Thoroughly**
   - Run tests before pushing
   - Test edge cases
   - Verify in different scenarios

4. **Document Changes**
   - Update relevant docs
   - Add code comments
   - Clear PR descriptions

5. **Communicate**
   - Ask questions if unclear
   - Provide context in PRs
   - Respond to feedback

## 📞 Getting Help

If you need help:
- Check existing documentation
- Search existing issues
- Ask in discussions
- Contact maintainers

## 🙏 Thank You

Thank you for contributing to this project! Your efforts help make this framework better for everyone.

---

**Happy Contributing! 🚀**


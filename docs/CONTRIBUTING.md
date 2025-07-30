# Contributing Guidelines

Thank you for your interest in contributing to our Playwright Component-Based Automation Framework! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Development Guidelines](#component-development-guidelines)
- [Page Object Development Guidelines](#page-object-development-guidelines)
- [Test Development Guidelines](#test-development-guidelines)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read and understand it before contributing.

- Be respectful and inclusive
- Be collaborative
- Focus on constructive criticism
- Acknowledge the work of others
- Be mindful of your language and behavior

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/vuori-clothing/automation.git
   cd automation
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Install Playwright browsers:
   ```bash
   npx playwright install
   ```
5. Set up environment variables:
   ```bash
   cp .env.example .env.dev
   ```
6. Run the validation tests:
   ```bash
   npm run test -- scripts/validate-framework.ts
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

   or

   ```bash
   git checkout -b fix/issue-description
   ```

2. Make your changes, following the coding standards and guidelines

3. Run tests to ensure your changes don't break existing functionality:

   ```bash
   npm run test:dev
   ```

4. Commit your changes with a descriptive commit message

5. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a pull request to the main repository

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Use proper typing for all variables, parameters, and return values
- Avoid using `any` type
- Use interfaces for object shapes
- Use enums for fixed sets of values

### Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Maximum line length: 100 characters
- Use trailing commas in multi-line object/array literals
- Use parentheses around arrow function parameters

### Naming Conventions

- **Files**: Use kebab-case for filenames (e.g., `base-component.ts`)
- **Classes**: Use PascalCase for class names (e.g., `BaseComponent`)
- **Interfaces**: Use PascalCase prefixed with `I` (e.g., `IComponentProps`)
- **Methods**: Use camelCase for method names (e.g., `clickButton()`)
- **Properties**: Use camelCase for properties (e.g., `searchInput`)
- **Constants**: Use UPPER_SNAKE_CASE for constants (e.g., `MAX_RETRY_COUNT`)
- **Private members**: Use camelCase with underscore prefix (e.g., `_privateProperty`)

### Code Organization

- One class per file
- Group related files in directories
- Import statements at the top of the file
- Export statements at the bottom of the file
- Group methods by functionality
- Keep files under 300 lines when possible

## Component Development Guidelines

### Creating New Components

1. **Extend BaseComponent**: All components should extend the `BaseComponent` class
2. **Follow the Component Template**: Use the template provided in [Component Examples](./examples/COMPONENT_EXAMPLES.md)
3. **Use Playwright's Recommended Locators**: Follow the locator best practices
4. **Document Public Methods**: Add JSDoc comments for all public methods
5. **Add Error Handling**: Include proper error handling for all interactions
6. **Include Logging**: Add appropriate logging for all actions
7. **Write Unit Tests**: Create tests for your component

### Component Structure

Components should follow this structure:

```typescript
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base/base-component';

export class MyComponent extends BaseComponent {
  // Locators
  private readonly myButton: Locator;
  private readonly myInput: Locator;

  constructor(page: Page) {
    const rootLocator = page.getByTestId('my-component');
    super(page, rootLocator, 'My Component');

    // Initialize locators
    this.myButton = this.rootLocator.getByRole('button', { name: 'Submit' });
    this.myInput = this.rootLocator.getByLabel('Enter value');
  }

  /**
   * Click the submit button
   */
  async clickSubmit(): Promise<void> {
    this.logger.info('Clicking submit button');
    await this.myButton.click();
  }

  /**
   * Enter a value in the input field
   * @param value - The value to enter
   */
  async enterValue(value: string): Promise<void> {
    this.logger.info(`Entering value: ${value}`);
    await this.myInput.fill(value);
  }
}
```

### Component Testing

- Test each component in isolation
- Test all public methods
- Test error handling
- Test edge cases
- Use mock data when appropriate

## Page Object Development Guidelines

### Creating New Page Objects

1. **Extend BasePage**: All page objects should extend the `BasePage` class
2. **Compose with Components**: Use components to build pages
3. **Focus on Business Actions**: Page methods should represent business actions
4. **Hide Implementation Details**: Abstract away the implementation details
5. **Document Public Methods**: Add JSDoc comments for all public methods
6. **Add Error Handling**: Include proper error handling for all interactions
7. **Include Logging**: Add appropriate logging for all actions
8. **Write Integration Tests**: Create tests for your page object

### Page Object Structure

Page objects should follow this structure:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base-page';
import { HeaderComponent } from '../../components/navigation/header-component';
import { SearchComponent } from '../../components/forms/search-component';

export class ProductsPage extends BasePage {
  // Components
  private readonly searchComponent: SearchComponent;

  // Page-specific locators
  private readonly productGrid: Locator;

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);

    // Initialize components
    this.searchComponent = new SearchComponent(page);

    // Initialize page-specific locators
    this.productGrid = this.page.getByTestId('product-grid');
  }

  /**
   * Navigate to the products page
   */
  async navigateToProductsPage(): Promise<void> {
    await this.navigateTo('/products');
    await this.waitForPageLoad();
  }

  /**
   * Search for products
   * @param searchTerm - The search term
   */
  async searchProducts(searchTerm: string): Promise<void> {
    await this.searchComponent.search(searchTerm);
    await this.page.waitForLoadState('networkidle');
  }
}
```

## Test Development Guidelines

### Creating New Tests

1. **Use the Test Fixtures**: Import test fixtures from the base fixture
2. **Focus on Business Scenarios**: Tests should represent business scenarios
3. **Follow AAA Pattern**: Arrange, Act, Assert
4. **Keep Tests Independent**: Tests should not depend on each other
5. **Use Descriptive Names**: Test names should describe the scenario
6. **Add Proper Assertions**: Use expect with descriptive error messages
7. **Handle Test Data**: Use test data factories or fixtures

### Test Structure

Tests should follow this structure:

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import { ProductsPage } from '../../src/pages/product/products-page';

test.describe('Product Search', () => {
  test('should display search results for valid search term', async ({ page, environment }) => {
    // Arrange
    const productsPage = new ProductsPage(page, environment.baseUrl);
    await productsPage.navigateToProductsPage();

    // Act
    await productsPage.searchProducts('laptop');

    // Assert
    const resultsCount = await productsPage.getResultsCount();
    expect(resultsCount, 'Search should return results').toBeGreaterThan(0);
  });
});
```

## Pull Request Process

1. **Create a Feature Branch**: Create a branch from `main` for your changes
2. **Make Your Changes**: Implement your changes following the guidelines
3. **Run Tests**: Ensure all tests pass
4. **Update Documentation**: Update documentation as needed
5. **Create a Pull Request**: Submit a pull request to the `main` branch
6. **Code Review**: Address any feedback from code review
7. **Merge**: Once approved, your PR will be merged

### Pull Request Template

```markdown
## Description

[Describe the changes you've made]

## Related Issue

[Link to the related issue]

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement
- [ ] Test update

## Checklist

- [ ] I have read the CONTRIBUTING document
- [ ] My code follows the code style of this project
- [ ] I have added tests to cover my changes
- [ ] All new and existing tests passed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
```

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Examples:

- `feat(component): add new search component`
- `fix(page): fix navigation in product page`
- `docs(readme): update installation instructions`
- `test(e2e): add tests for checkout flow`

## Documentation Guidelines

- Keep documentation up-to-date with code changes
- Use Markdown for all documentation
- Include code examples where appropriate
- Document public APIs with JSDoc comments
- Create diagrams for complex workflows
- Use consistent terminology throughout documentation

## Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: Browser, OS, Node.js version, etc.
6. **Screenshots**: If applicable
7. **Code Snippets**: If applicable

## Feature Requests

When requesting features, please include:

1. **Description**: Clear description of the feature
2. **Use Case**: Why this feature is needed
3. **Proposed Solution**: If you have ideas on how to implement it
4. **Alternatives**: Any alternative solutions you've considered
5. **Additional Context**: Any other context or screenshots

---

Thank you for contributing to our Playwright Component-Based Automation Framework!

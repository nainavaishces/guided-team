# Playwright Component-Based Architecture

## Overview

This document explains the architectural design of our Playwright component-based automation framework. The framework is built with scalability, maintainability, and reusability in mind, following industry best practices for test automation.

## Core Architecture Principles

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Tests       │    │     Flows       │    │      API        │
│  (E2E, API,     │────│   (Business     │────│   (Clients,     │
│  Integration)   │    │    Logic)       │    │   Schemas)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Pages       │    │   Components    │    │     Utils       │
│  (Page Objects) │────│   (Reusable     │────│  (Helpers,      │
│                 │    │   UI Elements)  │    │   Logging)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Fixtures      │
                    │  (Test Setup,   │
                    │   Data, Config) │
                    └─────────────────┘
```

## Detailed Project Structure

The framework follows a specific directory structure designed to promote organization, maintainability, and scalability:

```
playwright-automation/
├── .env.example                     # Environment variables template
├── .env.dev                         # Development environment config
├── .env.staging                     # Staging environment config
├── .env.prod                        # Production environment config
├── .gitignore                       # Git ignore patterns
├── .prettierrc                      # Code formatting rules
├── package.json                     # Dependencies and scripts
├── playwright.config.ts             # Main Playwright configuration
├── README.md                        # Project overview
├── tsconfig.json                    # TypeScript configuration
│
├── .github/                         # CI/CD configuration
│   └── workflows/                   # GitHub Actions workflows
│       ├── playwright-ci.yml        # Main CI workflow
│       ├── playwright-nightly.yml   # Nightly regression tests
│       └── playwright-pr.yml        # Pull request validation
│
├── src/                             # Source code
│   ├── components/                  # UI Components
│   │   ├── base/                    # Base component classes
│   │   │   └── base-component.ts    # Base component with common functionality
│   │   ├── navigation/              # Navigation components
│   │   │   ├── header-component.ts  # Header navigation
│   │   │   ├── footer-component.ts  # Footer component
│   │   │   └── sidebar-component.ts # Sidebar navigation
│   │   ├── forms/                   # Form components
│   │   │   ├── search-component.ts  # Search form
│   │   │   └── filter-component.ts  # Filter controls
│   │   ├── modals/                  # Modal dialog components
│   │   └── cards/                   # Card components
│   │
│   ├── pages/                       # Page Object Models
│   │   ├── base/                    # Base page classes
│   │   │   └── base-page.ts         # Base page with component composition
│   │   ├── auth/                    # Authentication pages
│   │   ├── home/                    # Home page
│   │   ├── product/                 # Product-related pages
│   │   └── checkout/                # Checkout pages
│   │
│   ├── flows/                       # Business logic flows
│   │   ├── auth-flow.ts             # Authentication flow
│   │   ├── product-flow.ts          # Product browsing flow
│   │   └── checkout-flow.ts         # Checkout flow
│   │
│   ├── api/                         # API helpers and clients
│   │   ├── clients/                 # API client classes
│   │   ├── schemas/                 # API response schemas
│   │   └── interceptors/            # Network interceptors
│   │
│   ├── data/                        # Test data management
│   │   ├── static/                  # Static test data
│   │   ├── builders/                # Test data builders
│   │   └── factories/               # Test data factories
│   │
│   ├── utils/                       # Utility functions
│   │   ├── common/                  # Common utilities
│   │   ├── test/                    # Test-specific utilities
│   │   ├── browser/                 # Browser utilities
│   │   └── validation/              # Validation utilities
│   │
│   ├── fixtures/                    # Test fixtures
│   │   ├── base-fixture.ts          # Base fixture
│   │   ├── api-fixture.ts           # API fixtures
│   │   └── auth-fixture.ts          # Authentication fixtures
│   │
│   ├── config/                      # Configuration management
│   │   ├── env.ts                   # Environment configuration
│   │   ├── test-config.ts           # Test configuration
│   │   └── constants.ts             # Constants
│   │
│   └── types/                       # TypeScript definitions
│       ├── global.d.ts              # Global type definitions
│       ├── test-types.ts            # Test-related types
│       └── component-types.ts       # Component-related types
│
├── tests/                           # Test specifications
│   ├── setup/                       # Test setup
│   │   ├── global-setup.ts          # Global setup for all tests
│   │   └── auth.setup.ts            # Authentication setup
│   ├── e2e/                         # End-to-end tests
│   │   ├── auth/                    # Authentication tests
│   │   ├── product/                 # Product tests
│   │   └── checkout/                # Checkout tests
│   ├── api/                         # API tests
│   │   ├── auth/                    # Authentication API tests
│   │   └── products/                # Product API tests
│   └── accessibility/               # Accessibility tests
│
├── reports/                         # Generated reports (git-ignored)
│   ├── html-report/                 # HTML reports
│   ├── allure-results/              # Allure report data
│   └── screenshots/                 # Test screenshots
│
└── docs/                           # Documentation
    ├── ARCHITECTURE.md             # Architecture documentation
    ├── CONTRIBUTING.md             # Contributing guidelines
    └── examples/                   # Example code and usage
```

## Key Architectural Components

### 1. Component Layer

The foundation of our framework is the component layer, which represents reusable UI elements that appear across multiple pages.

- **Base Component**: Abstract class that provides common functionality for all components
- **Component Types**: Navigation (header, footer), Forms, Modals, Cards, etc.
- **Component Composition**: Components can be composed of other components

Components encapsulate:

- Selectors for elements
- Actions that can be performed on the component
- Verification methods
- Error handling

### 2. Page Object Layer

Pages are composed of components and represent complete web pages in the application.

- **Base Page**: Abstract class with common page functionality
- **Page Types**: Home, Login, Product, Checkout, etc.
- **Component Integration**: Pages integrate multiple components

Pages encapsulate:

- Page-specific navigation
- Page-specific actions
- Page verification methods
- Component composition

### 3. Flow Layer

Flows represent business processes that span multiple pages.

- **Authentication Flow**: Login, logout, registration
- **Checkout Flow**: Add to cart, checkout, payment
- **Product Flow**: Browse, search, filter products

Flows encapsulate:

- Multi-page business processes
- Complex user journeys
- Data management across pages

### 4. Test Layer

Tests use flows, pages, and components to verify application functionality.

- **E2E Tests**: End-to-end user journeys
- **Integration Tests**: Component integration
- **API Tests**: Backend functionality

### 5. Fixture Layer

Fixtures provide test setup and configuration.

- **Base Fixture**: Common test setup
- **Authentication Fixture**: User authentication
- **Data Fixture**: Test data management

### 6. Utility Layer

Utilities provide common functionality across the framework.

- **Logger**: Centralized logging
- **Configuration**: Environment management
- **Helpers**: Common utility functions

## Data Flow

1. **Tests** use **Fixtures** for setup and configuration
2. **Tests** call methods on **Flows** or **Pages**
3. **Flows** coordinate actions across multiple **Pages**
4. **Pages** use **Components** to interact with UI elements
5. **Components** use **Utilities** for common functionality

## Dependency Direction

Dependencies flow downward:

- Tests depend on Flows, Pages, and Fixtures
- Flows depend on Pages
- Pages depend on Components
- Components depend on Utilities

Lower layers should not depend on higher layers.

## Error Handling Strategy

The framework implements a layered error handling approach:

1. **Component Level**: Components catch and log errors, then rethrow
2. **Page Level**: Pages catch component errors and provide context
3. **Flow Level**: Flows catch page errors and provide business context
4. **Test Level**: Tests catch and report all errors

## Logging Strategy

Centralized logging through the Logger utility:

- Components log detailed element interactions
- Pages log page navigation and high-level actions
- Flows log business processes
- Tests log test progress and results

## Configuration Management

Environment-specific configuration:

- `.env.dev`: Development environment
- `.env.staging`: Staging environment
- `.env.prod`: Production environment

Configuration is loaded based on the TEST_ENV environment variable.

## Reporting Strategy

Multi-level reporting:

- HTML reports for visual analysis
- Allure reports for detailed test analytics
- Screenshots and videos for failure analysis
- JSON reports for CI/CD integration

### Directory Purpose Explanation

#### Configuration Files

- **`.env.*` files**: Environment-specific configuration variables
- **`playwright.config.ts`**: Configures Playwright test runner, browsers, and reporting
- **`tsconfig.json`**: TypeScript compiler configuration
- **`.prettierrc`**: Code formatting rules for consistent style

#### Source Code (`src/`)

##### Components (`src/components/`)

The components directory contains reusable UI elements that can be composed to build pages. Each component encapsulates a specific UI element or a group of related elements.

- **`base/`**: Contains the base component class that all other components extend
- **`navigation/`**: Components for navigation elements like headers, footers, and sidebars
- **`forms/`**: Form-related components like search forms, filters, and input groups
- **`modals/`**: Modal dialog components like login modals, confirmation dialogs
- **`cards/`**: Card components like product cards, article cards

##### Pages (`src/pages/`)

The pages directory contains page object models that represent complete web pages. Pages are composed of components and provide methods for page-specific actions.

- **`base/`**: Contains the base page class that all other pages extend
- **`auth/`**: Authentication-related pages like login, registration
- **`home/`**: Home page and related pages
- **`product/`**: Product-related pages like product listings, product details
- **`checkout/`**: Checkout-related pages like cart, shipping, payment

##### Flows (`src/flows/`)

The flows directory contains business logic flows that span multiple pages. Flows orchestrate actions across pages to implement complete business processes.

- **`auth-flow.ts`**: Authentication flows like login, registration, password reset
- **`product-flow.ts`**: Product-related flows like browsing, searching, filtering
- **`checkout-flow.ts`**: Checkout flows like adding to cart, checkout process

##### API (`src/api/`)

The API directory contains classes and utilities for interacting with backend APIs.

- **`clients/`**: API client classes for different API endpoints
- **`schemas/`**: TypeScript interfaces for API request/response schemas
- **`interceptors/`**: Network interceptors for mocking or modifying API responses

##### Data (`src/data/`)

The data directory contains test data management utilities.

- **`static/`**: Static test data like JSON files
- **`builders/`**: Builder pattern implementations for creating test data
- **`factories/`**: Factory pattern implementations for generating test data

##### Utils (`src/utils/`)

The utils directory contains utility functions used throughout the framework.

- **`common/`**: Common utilities like logging, date handling
- **`test/`**: Test-specific utilities like test data generators
- **`browser/`**: Browser-specific utilities like cookie management
- **`validation/`**: Validation utilities for assertions

##### Fixtures (`src/fixtures/`)

The fixtures directory contains Playwright test fixtures that provide test setup and teardown.

- **`base-fixture.ts`**: Base fixture with common setup
- **`api-fixture.ts`**: Fixtures for API testing
- **`auth-fixture.ts`**: Fixtures for authentication

##### Config (`src/config/`)

The config directory contains configuration management code.

- **`env.ts`**: Environment configuration loading and validation
- **`test-config.ts`**: Test-specific configuration
- **`constants.ts`**: Constants used throughout the framework

##### Types (`src/types/`)

The types directory contains TypeScript type definitions.

- **`global.d.ts`**: Global type declarations
- **`test-types.ts`**: Test-related type definitions
- **`component-types.ts`**: Component-related type definitions

#### Tests (`tests/`)

The tests directory contains test specifications organized by test type and domain.

- **`setup/`**: Test setup files like global setup and authentication setup
- **`e2e/`**: End-to-end tests organized by domain
- **`api/`**: API tests organized by domain
- **`accessibility/`**: Accessibility tests

#### Reports (`reports/`)

The reports directory contains generated test reports and artifacts.

- **`html-report/`**: HTML test reports
- **`allure-results/`**: Allure report data
- **`screenshots/`**: Screenshots captured during test execution

#### Documentation (`docs/`)

The docs directory contains framework documentation.

- **`ARCHITECTURE.md`**: Architecture documentation
- **`CONTRIBUTING.md`**: Contributing guidelines
- **`examples/`**: Example code and usage

## Conclusion

This component-based architecture provides:

- **Reusability**: Components are reused across pages
- **Maintainability**: Changes to UI elements are isolated to components
- **Scalability**: New pages and flows can be built from existing components
- **Readability**: Tests express business intent clearly
- **Stability**: Reduced test flakiness through proper abstraction
- **Organization**: Clear directory structure with well-defined responsibilities

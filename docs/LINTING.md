# Type Checking, Linting, and Formatting Setup

This document outlines the type checking, linting, and formatting setup for the Playwright automation project.

## Overview

The project uses TypeScript for type checking, ESLint for linting, and Prettier for code formatting. These tools help catch errors early and enforce consistent code style.

## Type Checking

TypeScript is configured in `tsconfig.json` with strict type checking enabled. The following npm scripts are available for type checking:

- `npm run typecheck`: Run type checking once
- `npm run typecheck:watch`: Run type checking in watch mode

## ESLint Setup

### Required Packages

```bash
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-playwright eslint-plugin-import eslint-config-prettier
```

## Prettier Setup

### Required Packages

```bash
npm install --save-dev prettier eslint-config-prettier
```

### Configuration

The Prettier configuration is stored in `.prettierrc.js` with settings optimized for Playwright projects:

- 100 character line length
- 2 spaces for indentation
- Single quotes
- Trailing commas where valid
- Proper handling of TypeScript files

A `.prettierignore` file is also included to specify which files should be ignored by Prettier.

### Configuration

The ESLint configuration is stored in `.eslintrc.js` with the following key features:

- TypeScript integration via `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- Playwright-specific rules via `eslint-plugin-playwright`
- Import ordering via `eslint-plugin-import`
- Compatibility with Prettier via `eslint-config-prettier`

### NPM Scripts

The following npm scripts are available for linting and formatting:

- `npm run lint`: Run ESLint
- `npm run lint:fix`: Run ESLint and fix issues automatically
- `npm run format`: Run Prettier and format all files
- `npm run format:check`: Check if files are properly formatted
- `npm run check`: Run type checking, linting, and format checking
- `npm run check:fix`: Run type checking, fix linting issues, and format files

## Pre-commit Hooks

Husky is used to run type checking, linting, and formatting before commits. The pre-commit hook is configured to run `npm run check`.

## CI/CD Integration

A GitHub Actions workflow is set up to run type checking, linting, and format checking on push to main and on pull requests.

## Implementation Plan

1. Install required ESLint and Prettier packages
2. Create `.eslintrc.js` and `.prettierrc.js` configuration files
3. Add npm scripts to package.json
4. Configure husky pre-commit hook
5. Create GitHub Actions workflow (optional)

## Benefits

- Catch type errors before runtime
- Enforce consistent code style
- Prevent common mistakes
- Improve code quality
- Reduce debugging time

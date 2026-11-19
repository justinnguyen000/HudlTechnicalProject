# Hudl Login Automation

[![Playwright Tests](https://github.com/justinnguyen000/HudlTechnicalProject/actions/workflows/playwright.yml/badge.svg)](https://github.com/justinnguyen000/HudlTechnicalProject/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)

> **An end-to-end test automation framework for the [Hudl login flow](https://www.hudl.com/login), built with Playwright and TypeScript.**

## Table of contents

- [About](#about)
- [Tech stack](#tech-stack)
- [Test coverage](#test-coverage)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Install the Playwright browsers](#3-install-the-playwright-browsers)
  - [4. Add your credentials](#4-add-your-credentials)
- [Running the tests](#running-the-tests)
- [Account lockout test](#account-lockout-test)
- [Linting and formatting](#linting-and-formatting)
- [Continuous integration](#continuous-integration)
- [Credential handling](#credential-handling)
- [Out of scope](#out-of-scope)

## About

The suite covers:

- **successful login** ✅
- **invalid credentials** 🚫
- **input validation** ✏️
- **account lockout** 🔒

Every test runs across **Chromium**, **Firefox**, and **WebKit**.

## Tech stack

- **Playwright Test** - browser automation and test runner
- **TypeScript** - type-safe test code
- **ESLint** (`typescript-eslint`, `eslint-plugin-playwright`) - code quality and best practices
- **Prettier** - code formatting
- **dotenv** - secure credential loading
- **GitHub Actions** - runs lint and tests on every push and PR

## Test coverage

- `login.spec.ts`
  - User can log in with valid credentials
- `login-negative.spec.ts`
  - Rejects an unregistered email
  - Rejects a wrong password
  - Treats the password as case-sensitive
- `login-validation.spec.ts`
  - Does not continue with an empty email
  - Does not log in with an empty password
  - Rejects malformed emails (data-driven, one test per input)
- `login-lockout.spec.ts`
  - Blocks the account after repeated failed attempts (**opt-in**)

## Project structure

```
├── .github/workflows/
│   └── playwright.yml        # CI pipeline
├── src/
│   ├── config/
│   │   └── env.ts            # Loads and validates environment variables
│   ├── data/
│   │   └── login-data.ts     # Test data: error messages, malformed emails, lockout settings
│   ├── fixtures/
│   │   └── test-fixtures.ts  # Custom fixtures that provide page objects to tests
│   └── pages/
│       ├── LoginPage.ts      # Login page locators and actions
│       └── HomePage.ts       # Post-login page locators
├── tests/                    # Test specs
├── .env.example              # Template for local credentials
├── eslint.config.mjs         # ESLint configuration
├── .prettierrc               # Prettier configuration
└── playwright.config.ts      # Playwright configuration
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm (included with Node.js)
- Git
- A Hudl test account (email and password)

## Setup

### 1. Clone the repository

In a terminal:

```bash
git clone https://github.com/justinnguyen000/HudlTechnicalProject.git
cd HudlTechnicalProject
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Install the Playwright browsers

```bash
npx playwright install --with-deps
```

### 4. Add your credentials

Copy the example file:

```bash
# macOS / Linux
cp .env.example .env
```

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

Then open `.env` and fill in your Hudl test account:

```
HUDL_EMAIL=your-test-account@example.com
HUDL_PASSWORD=your-password
```

> [!IMPORTANT]
> `.env` is listed in `.gitignore` and is never committed. Tests will fail without credentials.

## Running the tests

- Run the full suite in all three browsers:

  ```bash
  npm test
  ```

- Run the suite only in Chromium:

  ```bash
  npx playwright test --project=chromium
  ```

- Run a specific file:

  ```bash
  npx playwright test tests/login-negative.spec.ts
  ```

- Run with the browser window visible:

  ```bash
  npm run test:headed
  ```

- Open Playwright UI mode for step-by-step debugging:

  ```bash
  npm run test:ui
  ```

- Open the HTML report from the last run:

  ```bash
  npm run report
  ```

- List the tests without running them:

  ```bash
  npx playwright test --list
  ```

## Account lockout test

`tests/login-lockout.spec.ts` verifies that the account is blocked after repeated failed logins.

> [!WARNING]
> Running this test **locks the test account**, which causes every other login test to fail until the account is unlocked.

For that reason it is:

- Never run in CI
- Excluded from `npm test` by default (tagged `@lockout` and filtered out in `playwright.config.ts`)
- Configured with no retries, so a failure does not cause extra failed attempts

To run it deliberately in one browser:

```bash
# macOS / Linux
RUN_LOCKOUT_TEST=true npx playwright test tests/login-lockout.spec.ts --project=chromium
```

```powershell
# Windows PowerShell
$env:RUN_LOCKOUT_TEST="true"; npx playwright test tests/login-lockout.spec.ts --project=chromium
```

## Linting and formatting

```bash
npm run lint          # check code with ESLint
npm run lint:fix      # auto-fix lint issues where possible
npm run format        # format all files with Prettier
npm run format:check  # check formatting without changing files
```

## Continuous integration

GitHub Actions (`.github/workflows/playwright.yml`) runs on every push and pull request to `main`:

1. Installs dependencies and Playwright browsers
2. Runs ESLint and the Prettier format check
3. Runs the test suite in all three browsers

Credentials are read from repository secrets. To run CI on a fork, add these under **Settings → Secrets and variables → Actions**:

- `HUDL_EMAIL`
- `HUDL_PASSWORD`

## Credential handling

- Credentials are never hard-coded or committed. Locally they come from `.env`; in CI they come from GitHub repository secrets.
- `src/config/env.ts` validates that both variables exist before any test runs.
- Traces are disabled in CI. Traces record values typed into fields, and the HTML report is uploaded as a downloadable artifact, so recording them would risk exposing the password.
- `test-results/` and `playwright-report/` are ignored by Git for the same reason.

## Out of scope

These were intentionally not automated against production:

- **Password reset submission** - would send real emails and change account state
- **Social and SSO login** - requires third-party accounts
- **CAPTCHA and bot protection** - designed to block automation
- **Load and performance testing** - would place unnecessary load on a production system and needs dedicated tooling

# HelloPrint Playwright Automation

Automated end-to-end tests for the HelloPrint e-commerce platform using Playwright.

## Overview

This repository contains comprehensive E2E test automation for the HelloPrint checkout flow, validating product selection, cart management, and purchase workflows across multiple browsers.

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HelloPrint-PW-Automation
```

2. Install dependencies:
```bash
npm install
```

### Configuration

The project is configured to test against **https://www.helloprint.com** by default. Update the `baseURL` in `playwright.config.ts` if needed.

## Running Tests

### Run all tests:
```bash
npx playwright test
```

### Run tests in a specific file:
```bash
npx playwright test tests/e2e/checkout.spec.ts
```

### Run tests with a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

### Run tests in debug mode:
```bash
npx playwright test --debug
```

### Run with tracing enabled:
```bash
npx playwright test --trace on
```

## Reports

### View HTML Report
After running tests, view the interactive HTML report:
```bash
npx playwright show-report
```

The report is automatically generated and saved to `playwright-report/index.html`.

### Test Results
Detailed test results are stored in the `test-results/` directory.

## Project Structure

```
├── tests/
│   └── e2e/
│       └── checkout.spec.ts          # Main checkout flow tests
├── playwright.config.ts               # Playwright configuration
├── package.json                       # Project dependencies
├── README.md                          # This file
└── TEST-NOTES.md                      # Test implementation details
```

## Test Coverage

- **checkout.spec.ts** - Complete E2E checkout flow including:
  - Product selection (Ceramic Modern Coffee Mug)
  - Color variant selection (Red)
  - Print run quantity selection (100 units)
  - Cart validation (price, quantity, color)
  - Cart summary verification

## Browser Support

Tests run against:
- ✓ Chromium (Chrome/Edge)
- ✓ Firefox
- ✓ WebKit (Safari)

## Continuous Integration

Configure CI/CD by setting the `CI` environment variable. The config will:
- Run tests serially on CI (not in parallel)
- Retry failed tests up to 2 times
- Generate HTML reports

## Troubleshooting

### Tests timeout or fail to load
- Check internet connection
- Verify `baseURL` is correct in `playwright.config.ts`
- Check for cookie acceptance popups

### Report not generating
- Ensure tests complete without crashing
- Check `playwright-report/` directory exists
- Run: `npx playwright show-report`

## Dependencies

- `@playwright/test` - Testing framework
- `@types/node` - TypeScript Node.js types

## License

ISC

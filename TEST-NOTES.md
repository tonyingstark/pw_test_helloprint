# Test Notes and Implementation Details

## Overview
This document outlines the test strategy, implementation approach, and reasoning for the HelloPrint E2E automation tests.

## Test Strategy

### Test Scope
The automation focuses on validating the complete checkout workflow for HelloPrint's e-commerce platform, with emphasis on:
1. Product discovery and selection
2. Variant/customization selection (color, quantity)
3. Cart management and validation
4. Price accuracy and item details

### Target Application
- **URL**: https://www.helloprint.com
- **Test Product**: Ceramic Modern Coffee Mug (Red variant, 100 unit print run)
- **Expected Price**: €494.14

## Test Implementation Details

### Test File: `tests/e2e/checkout.spec.ts`

#### Test Structure
- **Setup (beforeEach)**: Navigates to home page and handles cookie acceptance
- **Main Test**: Complete checkout flow with comprehensive assertions

#### Why This Approach?

**Setup/BeforeEach Pattern**
```typescript
test.beforeEach("Login", async({page})=> {
     await page.goto("/")
     const acceptCookies = page.getByRole('button', { name: 'Accept all' });
     if (await acceptCookies.isVisible()) {
       await acceptCookies.click();
     }
})
```
- Ensures consistent starting state for all tests
- Handles cookie acceptance popup which blocks interactions
- Uses conditional visibility check to avoid failures if cookies already accepted

**Cookie Handling**
- The site displays a mandatory cookie acceptance banner
- Using `.isVisible()` check prevents test failure if cookies already accepted
- This is a resilience pattern for real-world applications

#### Test Flow

1. **Navigate to Product**
   ```typescript
   await page.goto("/en-ie/ceramicmoderncoffeemug")
   ```
   - Uses relative URL (baseURL: https://www.helloprint.com)
   - Tests specific product page access

2. **Select Variant**
   ```typescript
   await page.getByRole('link', { name: 'Red' }).click()
   ```
   - Uses accessible role selectors (recommended by Playwright)
   - Tests color variant selection

3. **Select Quantity/Price Tier**
   ```typescript
   await page.getByRole('link', { name: '€4.94 €494.14' }).click()
   ```
   - Selects 100 unit print run at €494.14 total price
   - Price per unit: €4.94, Total: €494.14

4. **Add to Cart**
   ```typescript
   await page.getByRole('button', { name: 'Skip uploading, add to cart' }).click()
   ```
   - Skips the optional upload step
   - Tests default "add without custom upload" flow

5. **Cart Validation**
   ```typescript
   const cartItem = page.getByText('Ceramic Modern Coffee Mug Deal Update to 25 extra for just €80.38 Product')
   await expect(cartItem).toBeVisible()
   await expect(cartItem).toContainText("Ceramic Modern Coffee Mug")
   ```
   - Validates item appears in cart
   - Confirms product name visibility
   - Checks promotional offer text

6. **Assertions**
   - **Print Run**: Verifies 100 units
   - **Color**: Confirms Red selection
   - **Price**: Validates €494.14 in cart summary

#### Assertion Strategy

**Why Table Row Queries?**
```typescript
const rowPrintRun = cartItem.getByRole('row', { name: 'Print run' })
const printRunValue = rowPrintRun.locator('td').nth(1)
await expect(printRunValue).toContainText("100")
```
- Cart displays data in structured table format
- Row-based queries are more maintainable than CSS selectors
- `.nth(1)` gets the value column (column 0 is label)
- `toContainText()` allows for flexible matching (handles extra whitespace)

**Cart Summary Validation**
```typescript
const cartSummary = page.locator('#cart-summary')
await cartSummary.waitFor()
```
- Uses explicit wait for cart summary element
- Ensures cart has fully loaded before price validation
- Prevents race conditions

## Test Data

| Field | Value |
|-------|-------|
| Product | Ceramic Modern Coffee Mug |
| URL | /en-ie/ceramicmoderncoffeemug |
| Color | Red |
| Print Run | 100 units |
| Unit Price | €4.94 |
| Total Price | €494.14 |
| Currency | EUR |

## Browser Coverage

Tests run on three major browser engines:
- **Chromium** (Chrome, Edge, Brave)
- **Firefox** (Mozilla Firefox)
- **WebKit** (Safari)

This ensures compatibility across all major browsers used by HelloPrint customers.

## Configuration Highlights

### playwright.config.ts
- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled by default (fullyParallel: true)
- **Reporter**: HTML report generation
- **Base URL**: https://www.helloprint.com
- **Trace**: Enabled on first retry for debugging
- **Retries**: 2 retries on CI, 0 on local

### Benefits of Current Configuration
- HTML reports provide visual debugging with screenshots/videos
- Parallel execution reduces total test time
- Tracing captures full interaction history for failed tests
- 3-browser matrix ensures cross-browser compatibility

## Potential Improvements (Part 2)

Future test cases could include:
1. **Multiple Product Tests** - Different products, variants, quantities
2. **Checkout Completion** - Payment flow, order confirmation
3. **Error Scenarios** - Out of stock, invalid quantities, network failures
4. **Edge Cases** - Min/max quantities, currency handling, language variants
5. **Performance** - Load time assertions, interaction response times
6. **Accessibility** - WCAG compliance checks, screen reader testing

## Known Limitations

1. Tests require active internet connection (live site testing)
2. Product availability and pricing subject to real-world changes
3. No authentication/user account testing (anonymous user flow only)
4. Static test data - not parameterized for multiple scenarios

## Maintenance Considerations

- **Selectors**: All selectors use role-based queries (more resilient to UI changes)
- **Base URL**: Configure in `playwright.config.ts` for different environments
- **Product URL**: May need updates if HelloPrint changes URL structure
- **Price/Quantity**: Test data should be reviewed periodically for accuracy

## CI/CD Integration

The configuration supports GitHub Actions or any CI provider:
```bash
CI=true npm run test
```
- Enables serial test execution
- Activates automatic retries
- Generates artifacts for review

## Conclusion

This test suite validates the core HelloPrint checkout flow with resilient selectors, proper waits, and comprehensive assertions. The modular structure allows easy expansion for additional test cases and improved coverage.

import { test, expect } from '@playwright/test';

// Setup: Execute before each test - handles login and cookie acceptance
test.beforeEach("Login", async({page})=> {
     // Navigate to the home page
     await page.goto("/")

     // Accept cookies if shown
    const acceptCookies = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
})


test("E2E checkout flow - English", async({page})=> {
    // Navigate to the product page (Red ceramic coffee mug)
    await page.goto("/en-ie/ceramicmoderncoffeemug")
    
    // Select the red color variant
    await page.getByRole('link', { name: 'Red' }).click()
    
    // Select the print run quantity and price (100 units for €494.14)
    await page.getByRole('link', { name: '€4.94 €494.14' }).click()

    // Skip the upload step and add the product to cart
    await page.getByRole('button', { name: 'Skip uploading, add to cart' }).click()

    // Verify that the cart item appears with correct product name
    const cartItem = page.getByText('Ceramic Modern Coffee Mug Deal Update to 25 extra for just €80.38 Product')
    await expect(cartItem).toBeVisible()
    await expect(cartItem).toContainText("Ceramic Modern Coffee Mug")

    // Verify the print run is set to 100
    const rowPrintRun = cartItem.getByRole('row', { name: 'Print run' })
    const printRunValue = rowPrintRun.locator('td').nth(1)
    await expect(printRunValue).toContainText("100")

    // Verify the color selection is Red
    const rowColours = cartItem.getByRole('row', { name: 'Colours' })
    const coloursValue = rowColours.locator('td').nth(1)
    await expect(coloursValue).toContainText("Red")

    // Wait for cart summary to load and verify the total price
    const cartSummary = page.locator('#cart-summary')
    await cartSummary.waitFor()
    const productPrice = cartSummary.getByRole('row', { name: 'Total articles' }).locator('td').nth(1)
    await expect(productPrice).toContainText("€494.14")

})

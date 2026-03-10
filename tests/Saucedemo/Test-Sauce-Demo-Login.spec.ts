import { test,expect } from '@playwright/test';

test('login to Sauce Demo', async ({ page }) => {

    // Go to Sauce Demo
    await page.goto('https://www.saucedemo.com');

    // Fill in username
    await page.getByPlaceholder('Username').fill('standard_user');

    // Fill in password
    await page.getByPlaceholder('Password').fill('secret_sauce');

    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for inventory page to load
    await page.waitForURL('**/inventory.html');

    // Verify we're on the products page
    await expect(page.getByText('Products')).toBeVisible();

});


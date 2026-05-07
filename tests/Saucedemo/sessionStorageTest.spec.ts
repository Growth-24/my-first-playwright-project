import { test, expect } from '@playwright/test';
import {ProductsPage} from '../../page-objects/Saucedemo/ProductsPage';


test('test with session storage', async ({ page }) => {

    // The test will automatically use the authenticated state from the setup file and adding it to the playwright config, 
    // so we can directly navigate to the products page.

    await page.goto('https://www.saucedemo.com/inventory.html');

    const productsPage = new ProductsPage(page);
    await expect(productsPage.pageTitle).toHaveText('Products');
});

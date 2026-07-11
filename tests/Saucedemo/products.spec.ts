import {test, expect} from '@playwright/test';
import {LoginPage} from '../../page-objects/saucedemo/LoginPage';
import { ProductsPage} from '../../page-objects/saucedemo/ProductsPage';


test.describe('SauceDemo Products Tests', () => {


test.beforeEach(async ({ page }) => {
    // Login before each test
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('standard_user', 'secret_sauce');

});

test('displays all products', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(6);

    const productNames = await productsPage.getProductNames();
    expect(productNames).toEqual(['Sauce Labs Backpack','Sauce Labs Bike Light','Sauce Labs Bolt T-Shirt','Sauce Labs Fleece Jacket','Sauce Labs Onesie','Test.allTheThings() T-Shirt (Red)']);

    const actualPrices = await productsPage.getAllProductPrices();
    expect(actualPrices).toEqual([
        '$29.99',
        '$9.99',
        '$15.99',
        '$49.99',
        '$7.99',
        '$15.99'
    ]);
});

test('can add product to cart', async ({ page }) => {

    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCartByName('Sauce Labs Backpack');

    const cartCount = await productsPage.getCartItemCount();
    expect(cartCount).toBe('1');

    const isInCart = await productsPage.isProductInCart('Sauce Labs Backpack');
        expect(isInCart).toBeTruthy();

});

test('can add multiple products to cart', async ({page}) => {
    const productsPage = new ProductsPage(page);

    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    await productsPage.addProductToCartByName('Sauce Labs Bike Light');

    const cartCount = await productsPage.getCartItemCount();
    expect(cartCount).toBe('2');

});

test('text snapshot of products page', async ({ page }) => {
    
    const productsPage = new ProductsPage(page);
    
    const entireProductsPage = await productsPage.getAllProductsPageText();
    expect(entireProductsPage).toMatchSnapshot('inventory-text.txt');

    // First Run (Create Baseline): The very first time you run this test, it will fail and complain that the baseline image doesn't exist yet. It will automatically save a golden image to a folder next to your test file.
    // Subsequent Runs (Compare): Every run after that will compare the live browser against that saved image.'
    // Updating Baselines: If the website legitimately changes (e.g., a price updates or a new product is added), you can overwrite your old baselines by running your test command with the update flag:
    // npx playwright test --update-snapshots
    //text snapshots not only check for visual changes, but also for textual changes. This is useful for catching unexpected changes in product names, descriptions, or other text content on the page.
});

test('can remove product from cart', async ({ page})=> {

    const productsPage = new ProductsPage(page);

    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    await productsPage.removeProductFromCartByName('Sauce Labs Backpack');

    const cartCount = await productsPage.getCartItemCount();
    expect(cartCount).toBe('0');
});

test('can remove multiple products from cart', async ({page}) => {
    const productsPage = new ProductsPage(page);

    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    await productsPage.addProductToCartByName('Sauce Labs Bike Light');

    await productsPage.removeProductFromCartByName('Sauce Labs Backpack');
    await productsPage.removeProductFromCartByName('Sauce Labs Bike Light');

    const cartCount = await productsPage.getCartItemCount();
    expect(cartCount).toBe('0');

});

test('can sort products by name A-Z', async ({page}) => {
    const productsPage = new ProductsPage(page);

    await productsPage.sortBy('az');

    const productNames = await productsPage.getProductNames();
    expect(productNames[0]).toBe('Sauce Labs Backpack');
});

test('can sort products by name Z-A', async ({page}) => {
    const productsPage = new ProductsPage(page);

    await productsPage.sortBy('za');

    const productNames = await productsPage.getProductNames();
    expect(productNames[0]).toBe('Test.allTheThings() T-Shirt (Red)');
});



test('can sort products by price low to high', async ({ page }) => {

    const productsPage = new ProductsPage(page);

    await productsPage.sortBy('lohi');

    const firstProductPrice = await productsPage.getProductPrice('Sauce Labs Onesie');
    expect(firstProductPrice).toContain('$7.99');
        

});

test('can sort products by price high to low', async ({ page }) => {

    const productsPage = new ProductsPage(page);

    await productsPage.sortBy('hilo');

    const firstProductPrice = await productsPage.getProductPrice('Sauce Labs Fleece Jacket');
    expect(firstProductPrice).toContain('$49.99');
        

});

});
import {test as base} from '@playwright/test';
import {LoginPage} from '../page-objects/saucedemo/LoginPage';
import {ProductsPage} from '../page-objects/saucedemo/ProductsPage';
import {CartPage} from '../page-objects/saucedemo/CartPage';
import {SauceDemoUsers} from '../utils/test-data';


type CartFixtures = {

    cartWithProducts: CartPage;

};

export const cartFixtures = base.extend<CartFixtures>({

    cartWithProducts: async ({ page }, use) => {
    // Setup: Login and add products

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);

    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    await productsPage.addProductToCartByName('Sauce Labs Bike Light');
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    // Provide cartPage to test

    await use(cartPage);

    // Teardown: Remove products from cart (if needed). This runs after the test completes

    console.log('Test completed, cart can be cleaned up here');

    },

});

export { expect } from '@playwright/test';


// When the fixture reaches await use(cartPage), it is essentially telling Playwright:

// The Environment is Ready: The browser is logged in, the items are added, and the page is showing the Cart Page.

// The Object is Ready: The cartPage object (with all its methods like checkout(), removeItem(), etc.) is fully powered up and connected to that page.

// The Test Can Start: The fixture "pauses" right there and hands that cartPage tool to your test.

// Think of it as a "Save Game" state
// If you were playing a video game, this fixture is like a Save File created right at the entrance of the "Cart Level."

// Instead of playing through the "Login Level" and the "Add Products Level" every single time you want to test the cart, you just load this "Save File" (cartWithProducts). You start exactly where you need to be, with all the items you need in your inventory.

// What happens in the test file?
// Inside your test, the variable you receive is that cartPage object. You can immediately start using its methods:

// EXAMPLE:
// TypeScript
// test('should verify items in cart', async ({ cartWithProducts }) => {
//     // We are already on the cart page! 
//     // 'cartWithProducts' IS the cartPage object as well.
    
//     const count = await cartWithProducts.getCartItemCount();
//     expect(count).toBe(2); 
    
//     await cartWithProducts.clickCheckout();
//     // Now you're testing the checkout flow...
// });

// Why the "Teardown" waits
// Notice that the console.log and any cleanup code don't run yet. They sit patiently in the fixture file while your test code (above) is running. Only once your test hits that final } closing bracket does Playwright go back to the fixture and execute the code after the use() statement.

// This ensures that you don't "clean up" the cart while the test is still trying to look at it!
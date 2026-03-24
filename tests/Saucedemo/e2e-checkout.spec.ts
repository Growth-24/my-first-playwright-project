import {test, expect} from '@playwright/test';
import {LoginPage} from '../../page-objects/saucedemo/LoginPage';
import {ProductsPage} from '../../page-objects/saucedemo/ProductsPage';
import {CartPage} from '../../page-objects/saucedemo/CartPage';


import {CheckoutPage} from '../../page-objects/saucedemo/CheckoutPage';

test.describe('Saucedemo End-to-End Checkout Flow', () => {

    test('complete checkout flow with multiple products', async ({page}) => {
        
        // Step 1: Login
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');

        // Step 2: Add products to cart

        const productsPage = new ProductsPage(page);
        await productsPage.addProductToCartByName('Sauce labs Backpack');
        await productsPage.addProductToCartByName('Sauce Labs Bike Light');

        // verify cart count

        const cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe('2');


        // Step 3: Go to cart

        await productsPage.clickShoppingCart();

        // Step 4: Verify cart contents 

        const cartPage = new CartPage(page);
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(2);
        const itemNames = await cartPage.getCartItemNames();
        expect(itemNames).toContain('Sauce Labs Backpack');
        expect(itemNames).toContain('Sauce Labs Bike Light');    
    
    
        // Step 5: Proceed to checkout

        await cartPage.clickCheckout();

        // Step 6: fill shipping information

        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.fillShippingInformation('John', 'Doe', '12345');
        await checkoutPage.clickContinue();
        
        // Step 7: Complete order

        await checkoutPage.clickFinish();

        // Step 8: Verify order completion

        const isComplete = await checkoutPage.isOrderComplete();
        expect(isComplete).toBeTruthy();
        const completeMessage = await checkoutPage.getCompleteMessage();
        expect(completeMessage).toContain('Thank you for your order');

    });


    test('Checkout with single product', async ({page}) => {

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        const productsPage = new ProductsPage(page);
        await productsPage.addProductToCartByName('Sauce Labs Onesie');
        await productsPage.clickShoppingCart();
        const cartPage = new CartPage(page);
        await cartPage.clickCheckout();
        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.fillShippingInformation('Jane', 'Smith', '54321');
        await checkoutPage.clickContinue();
        await checkoutPage.clickFinish();
        const completeMessage = await checkoutPage.getCompleteMessage();
        expect(completeMessage).toBe('Thank you for your order!');
    });

    test('cannot checkout with empty cart', async ({page}) => {

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        const productsPage = new ProductsPage(page);
        await productsPage.clickShoppingCart();
        const cartPage = new CartPage(page);
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);

        // checkout button should still be clickable but cart is empty

        await cartPage.clickCheckout();

        // Should be on checkout page

        await expect(page).toHaveURL(/.*checkout-step-one.*/);

    });
});
import {test, expect} from '@playwright/test';
import {LoginPage} from '../../page-objects/saucedemo/LoginPage';
import {ProductsPage} from '../../page-objects/saucedemo/ProductsPage';
import {CartPage} from '../../page-objects/saucedemo/CartPage';

test.describe('Cart Item Display Details',()=> {

    let productsPage: ProductsPage;
    let loginPage: LoginPage;
    let cartPage: CartPage;


    // login before each test
    test.beforeEach(async ({page})=> {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);

        await loginPage.goto();
        await loginPage.login('standard_user','secret_sauce');

        
    });

    
    test('should display correct quantity for each cart item', async () => {

        // Add multiple items to the cart

        await productsPage.addProductToCartByName('Sauce Labs Backpack');
        await productsPage.addProductToCartByName('Sauce Labs Bike Light');
        await productsPage.addProductToCartByName('Sauce Labs Bolt T-Shirt');
        await productsPage.clickShoppingCart();

        // Each item should have a quantity of 1

        const backpackDetails = await cartPage.getCartItemDetails('Sauce Labs Backpack');
        const bikeLightDetails = await cartPage.getCartItemDetails('Sauce Labs Bike Light');
        const tshirtDetails = await cartPage.getCartItemDetails('Sauce Labs Bolt T-Shirt');

        // Verify quantities

        expect(backpackDetails.quantity).toBe(1);
        expect(bikeLightDetails.quantity).toBe(1);
        expect(tshirtDetails.quantity).toBe(1);

        // Verify names match expected

        expect(backpackDetails.name).toBe('Sauce Labs Backpack');
        expect(bikeLightDetails.name).toBe('Sauce Labs Bike Light');
        expect(tshirtDetails.name).toBe('Sauce Labs Bolt T-Shirt');
    });

    test('should display product descriptions in cart', async () => {

        // Add items with known descriptions, chose two random products to verify their descriptions are displayed correctly in the cart

        await productsPage.addProductToCartByName('Sauce Labs Backpack');
        await productsPage.addProductToCartByName('Sauce Labs Onesie');
        await productsPage.clickShoppingCart();

        // Get descriptions from cart. 

        const backpackDescription = await cartPage.getProductDescription('Sauce Labs Backpack');
        const onesieDescription = await cartPage.getProductDescription('Sauce Labs Onesie');

        // Verify descriptions exist and have content, which is why we start with toBeTruthy to make sure the description is not an empty
        // string before testing further with assertions

        expect(backpackDescription).toBeTruthy();
        expect(backpackDescription.length).toBeGreaterThan(0);
        expect(backpackDescription).toContain('carry.allTheThings()');
        
        expect(onesieDescription).toBeTruthy();
        expect(onesieDescription.length).toBeGreaterThan(0);
        expect(onesieDescription).toContain('Rib snap');
    });
});
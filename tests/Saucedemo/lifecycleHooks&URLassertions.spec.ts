import {test,expect} from '@playwright/test';
import {LoginPage} from '../../page-objects/saucedemo/LoginPage';
import { ProductsPage} from '../../page-objects/saucedemo/ProductsPage';






test.describe('SauceDemo Products Tests',()=> {

    // By declaring variables here, they are accessible in all hooks and tests within this describe block.
    // we also used let instead of const because we will assign values to these variables in the beforeEach hook.
    // const would not work here because it does not allow reassignment after the initial assignment.
    let loginPage: LoginPage;
    let productsPage: ProductsPage;

    test.beforeAll(async ({browser})=> {
        
        //Set up shared state

        console.log('Starting test suite');
    });

    // test.beforeEach() runs before each test in the file
    test.beforeEach(async ({page})=>{

        // This creates the 'instance' and gives it the live browser page
        productsPage = new ProductsPage(page);

        //Login before each test
        loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user','secret_sauce');

    });
    // test.afterEach() runs after each test in the file

    test.afterEach(async ({page}, testInfo) => {

        // Take screenshot on failure

        if(testInfo.status !== testInfo.expectedStatus) {

            await page.screenshot({
                path: 'screenshots/${testInfo.title}-failure.png'

            });

        }



    });

   
    test.afterAll(async ({ browser})=> {

        // Clean up

        console.log('Products test suite completed');
    });

    test('displays all products', async ({page})=> {

        const productCount = await productsPage.getProductCount();
        expect(productCount).toBe(6);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');


    });

    test('can add product to cart',async({page})=>{
        
        await productsPage.addProductToCartByName('Sauce Labs Backpack');
        const cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe('1');
        await expect(page.locator('.title')).toHaveText('Products');

    });

});
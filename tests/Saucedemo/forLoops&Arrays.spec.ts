import {test, expect} from '@playwright/test';
import {LoginPage} from '../../page-objects/saucedemo/LoginPage';
import { ProductsPage} from '../../page-objects/saucedemo/ProductsPage';
import { CheckoutPage } from '../../page-objects/saucedemo/CheckoutPage';
import {CartPage} from '../../page-objects/saucedemo/CartPage';
import {faker} from '@faker-js/faker';





const testUsers = [

    {username: 'standard_user', password: 'secret_sauce',shouldSucceed: true},
    {username: 'locked_out_user', password: 'secret_sauce',shouldSucceed: false},
    {username: 'problem_user', password: 'secret_sauce',shouldSucceed: true},
    {username: 'invalid_user', password: 'wrong_password',shouldSucceed: false},

];

const productsData = [

    {"name": "Sauce Labs Backpack", "price": "$29.99", "expectedInCart": true},
    
    {"name": "Sauce Labs Bike Light", "price": "$9.99", "expectedInCart": true},
    
    {"name": "Sauce Labs Bolt T-Shirt", "price": "$15.99", "expectedInCart": true}
    
];

test.describe('SauceDemo Login with Multiple Users', () => {

    // Since its a for loop of all the test users in the array above, everytime the test runs it will generate all of the username and passwords from the array, plus be a seperate test case for each user and their password in the array. 
    // This is a great way to test multiple users without having to write separate test cases for each user, which can be time consuming and repetitive.
    // 
    // Each time the test runs it has to have a different test title; to fix this, 
    // I included the  ${user.username} in the test title to make each test unique and used it as a template literals. This way, when the tests run, we can easily identify which user is being tested in each case with also a 
    // different test title everytime the test runs. So now we can just add more users to the array without issue to generate more tests for different users.



    
    for (const user of testUsers) {

        test(`login test for users: ${user.username}`, async ({page}) => {

            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(user.username, user.password);

            if (user.shouldSucceed) {
              await expect(page).toHaveURL(/inventory.html/);
            } 
            
            else {
                const errorIsVisible = await loginPage.isErrorVisible();
                expect(errorIsVisible).toBeTruthy();
            }


      
        });
    }
});


test.describe('SauceDemo adding products from array data', () => {


    test.beforeEach(async ({page}) => {

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');

  
    });
        for (const product of productsData) {

                test(`can add ${product.name} to cart`, async ({page}) => {

                const productsPage = new ProductsPage(page);
                await productsPage.addProductToCartByName(product.name);

                const isInCart = await productsPage.isProductInCart(product.name);
                expect(isInCart).toBe(product.expectedInCart);

                const price = await productsPage.getProductPrice(product.name);
                expect(price).toBe(product.price);


            });
        }
});



test.describe('SauceDemo Checkout with Faker', () => {

    test.beforeEach(async ({page}) => {

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');

  
    });

    test('checkout with random user data', async ({page}) => {

        // generate random data

        const checkoutData = {  

        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        postalCode: faker.location.zipCode()

        };

        // Add products to cart and then open shopping cart page
       
        const productsPage = new ProductsPage(page);
        await productsPage.addProductToCartByName('Sauce Labs Backpack');
        await productsPage.addProductToCartByName('Sauce Labs Bike Light');
        await productsPage.clickShoppingCart();

        // Verify cart contents 

        const shopCartPage = new CartPage(page);
        const itemCount = await shopCartPage.getCartItemCount();
        expect(itemCount).toBe(2);
        const itemNames = await shopCartPage.getCartItemNames();
        expect(itemNames).toContain('Sauce Labs Backpack');
        expect(itemNames).toContain('Sauce Labs Bike Light');    
    

        // Proceed to checkout
        const cartPage = new CartPage(page);
        await cartPage.clickCheckout();


        // Checkout products that were added to the cart

        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.fillShippingInformation( checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode);
        await checkoutPage.clickContinue();

        // Verify we can proceed with random data

        await expect(page).toHaveURL(/checkout-step-two/);
    });


    for(let i = 0; i < 5; i++) {
        test(`checkout with multiple random users ${i + 1}`, async ({page}) => {

        

            const userData = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                postalCode: faker.location.zipCode('#####')
            };

            console.log(`Test ${i + 1}: ${userData.firstName} ${userData.lastName}`);

         

            // Add products to cart and then open shopping cart page
       
            const productsPage = new ProductsPage(page);
            await productsPage.addProductToCartByName('Sauce Labs Backpack');
            await productsPage.addProductToCartByName('Sauce Labs Bike Light');
            await productsPage.clickShoppingCart();

            // Verify cart contents 

            const shopCartPage = new CartPage(page);
            const itemCount = await shopCartPage.getCartItemCount();
            expect(itemCount).toBe(2);
            const itemNames = await shopCartPage.getCartItemNames();
            expect(itemNames).toContain('Sauce Labs Backpack');
            expect(itemNames).toContain('Sauce Labs Bike Light');    
        

            // Proceed to checkout
            const cartPage = new CartPage(page);
            await cartPage.clickCheckout();


            // Checkout products that were added to the cart

            const checkoutPage = new CheckoutPage(page);
            await checkoutPage.fillShippingInformation( userData.firstName, userData.lastName, userData.postalCode);
            await checkoutPage.clickContinue();

            // Verify we can proceed with random data

            await expect(page).toHaveURL(/checkout-step-two/);

            


        });


    }

});


// Notes for this test: test(`checkout with multiple random users ${i + 1}

// ${i + 1}` - this had to be apart of the test title since I used this for loop format: for(let i = 0; i < 5; i++)
// When you generate tests dynamically using a loop, unique test titles are a requirement, not just a suggestion.

// If you gave all five tests the same name (like just 'checkout with random user data'), Playwright would get confused. It uses the title as the unique identifier in the Test Explorer and the HTML reports.

// checkout with multiple random users 1 - this is the first test generated from the loop, and it will have random user data for the first test run.

// Breaking down the For Loop: for(let i = 0; i < 5; i++)
//     Think of this like a runner on a track doing laps. There are three specific instructions inside those parentheses:
    
//     let i = 0 (The Starting Line): You are creating a counter variable named i and setting it to 0. In programming, we almost always start counting at 0.
    
//     i < 5 (The Finish Line): This is the condition. The loop will keep running as long as i is less than 5. Once i hits 5, the runner stops.
    
//     i++ (The Lap Counter): This means "add 1 to i every time a lap is finished." It’s shorthand for i = i + 1.


// Why move the For Loop outside the test block?
// In Playwright, where you put that loop completely changes how your test report looks and how the browser behaves.

// 1. Independent Results (The "Don't Put All Your Eggs in One Basket" Rule)
// Inside: If you run 5 iterations inside one test block and the 2nd one fails, the whole test stops. You never find out if the 3rd, 4th, or 5th would have passed.

// Outside: If the loop is outside, Playwright sees 5 distinct tests. If the 2nd one fails, Playwright just moves on to the 3rd. You get a clear report showing 4 passes and 1 failure.

// 2. Automatic Browser Reset
// Inside: The browser stays on the same page for the whole loop. If the first iteration ends on the "Checkout Complete" page, the second iteration starts there too—which usually breaks your code because it's looking for the "Login" or "Products" page.

// Outside: Because the loop creates separate test blocks, your test.beforeEach (which handles your login) runs fresh for every single iteration. Every "user" starts with a clean browser at the login screen.

// 3. Speed (Parallelization)
// Inside: All 5 iterations must run one after another on a single browser.

// Outside: Playwright can split those 5 tests across different "workers." If you have 5 workers, you can run all 5 tests at the exact same time, finishing 5x faster.
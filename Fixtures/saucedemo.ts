

// Think of fixtures like meal prep:
// Instead of cooking every single meal from scratch (writing login code for every test), you prep ingredients once (create a fixture) and assemble meals quickly (use the fixture).



import {test as base }  from '@playwright/test';

import {LoginPage} from '../page-objects/saucedemo/LoginPage';
import {ProductsPage} from '../page-objects/saucedemo/ProductsPage';

type SaucedemoFixtures = { 

    loginPage: LoginPage;   
    productsPage: ProductsPage;
    loginAuthentication: void;
};


export const testFixtures = base.extend<SaucedemoFixtures>({ 

    loginPage: async ({page}, use) => { 

        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    productsPage: async ({page}, use) => { 

        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },

    loginAuthentication: async ({loginPage}, use) => { 

        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await use();
    },

});

export {expect} from '@playwright/test';


// How loginAuthentication works for a test:

// 1. Playwright sees 'loginAuthentication' is required.
    // 2. It runs the login code (navigates, enters 'standard_user', etc.).
    // 3. It reaches 'await use()'. 
    // 4. Since it's 'void', nothing is passed back.
    // Now you are ALREADY logged in and can just start using the productsPage!


    // loginAuthentication: void; tells TypeScript: "If a developer tries to call a method on the loginAuthentication variable inside a test (ex:, loginAuthentication.click()), throw an error because there is nothing there.



    // The code inside a fixture is split into two halves by the use() function:

// Everything BEFORE use(): This is the Setup. It runs before your test starts. (example:, creating the page object, logging in).
// const loginPage = new LoginPage(page);

// The use() call itself: This pauses the fixture and triggers the test to run. If you pass a value like use(loginPage), that value becomes available as an argument in your test.
// await use(loginPage);

// Everything AFTER use(): This is the Teardown. It runs after your test finishes, regardless of whether the test passed or failed. 
// in my fixture setup I don't have any teardown code, but if I wanted to add some cleanup steps (like logging out), I could put that code after the use() call. It ensures that even if the test fails, the cleanup will still happen.

// Without the use() function, Playwright would never know when the "Setup" is finished or when it's safe to start the actual test steps!


// By adding " export {expect} from '@playwright/test'; " if I didn't export the expect assertions from this fixture file, then in my test files I would have to import "expect" separately from '@playwright/test' in addition to importing the testFixtures object. By adding the expect assertion in this fixture file, I can just import it once from the same place as my testFixtures, which keeps my test imports cleaner and more focused on the fixtures I've set up.
// I can also have a custom assertion in my test fixture file to be able to be used in any other test file without having to import it separately. For example, I could create a custom assertion called "expectProductInCart" that checks if a specific product is in the cart, and then export that from this fixture file as well. This way, any test that needs to check if a product is in the cart can just import that custom assertion from the same place as the testFixtures, making it more convenient and organized.


// The "Vending Machine" Analogy for this line of code: base.extend<SaucedemoFixtures>({ }

// base is the empty vending machine.

// .extend is the act of opening the machine to put stuff in.

// <SaucedemoFixtures> is the label on the buttons (Button A = LoginPage, Button B = ProductsPage).

// The { ... } block is the actual snacks (the code) inside the machine.

// Type: This is where you decide the names that will be used in your test fixture file. If you changed loginPage to sauceLogin here, you would also have to change it inside the .extend block and inside your tests. They all have to match. The names are how you will access these fixtures in your tests, so they should be descriptive and consistent. 
// If you have a fixture that sets up a user session, you might call it "userSession" or "authenticatedUser" to make it clear what it represents. The name should give a hint about the purpose of the fixture, making it easier for other developers (or your future self) to understand its role in the tests.
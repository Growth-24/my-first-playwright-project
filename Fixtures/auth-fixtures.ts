
// import Playwright's default test runner and rename it base so you can build your custom version on top of it.
import {test as base} from '@playwright/test'; 
import { LoginPage} from '../page-objects/saucedemo/LoginPage';      
import { SauceDemoUsers } from '../utils/test-data'

type AuthFixtures = { 
    // void means these are "Action Fixtures." They will log the user in but won't pass an object to the test.
    loggedInAsStandardUser: void;
    loggedInAsPerformanceUser: void;
    loginPage: LoginPage;
};


export const authFixtures = base.extend<AuthFixtures>({

    // LoginPage fixture - creates page object for login page
    
    loginPage: async ({page}, use)=> {
    const loginPage = new LoginPage(page);
    await use(loginPage);
    },

    // Auto-login as standard user
    loggedInAsStandardUser: async ({loginPage, page}, use) => {
    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);

    await page.waitForURL('**/inventory.html');
    await use(); // Since this is a void fixture, it hands control to the test without passing a variable. The test can just start using the page, knowing it's already logged in as standard user.
    },

    // Auto-login as performance user
    loggedInAsPerformanceUser: async ({loginPage, page}, use) => {

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.performance.username, SauceDemoUsers.performance.password);

    await page.waitForURL('**/inventory.html');
    await use();
    },


});

export {expect} from '@playwright/test';


// export const test - this is so fixtures can be used in test files, If you don't export this custom test variable, your test files (like checkout.spec.ts) are stuck using the default Playwright test.

// (loginPage fixture) necessary? - Yes, because the login fixtures depend on it. If you removed the loginPage fixture, you'd have to duplicate the code that creates the LoginPage object inside each login fixture. By keeping it as a separate fixture, you can reuse it across multiple login scenarios without repeating yourself.
// Also, If you want to write a test to check what happens when a user types the wrong password, you cannot use loggedInAsStandardUser (because that fixture automatically logs you in successfully).
// For a negative test, you need the un-logged-in page:

// 2. Why declare loginPage: LoginPage; if we initialize it later?
// type AuthFixtures = { loginPage: LoginPage; } is for TypeScript. It is the blueprint. It tells your code editor (like VS Code): 
// "Hey, if a developer types loginPage. in a test file, show them the methods available in the LoginPage page object class." It provides your autocomplete and error-checking. It doesn't actually create anything.

// While the "type" tells the code what it looks like, the Fixture Block is the code that actually does the work. When you run your test and include loginPage in the arguments, Playwright pauses for a millisecond, runs that "factory" code, and hands the result to your test.

// Here is exactly how the test "uses" it:
// Think of the relationship between your Fixture file and your Test file as a Contract and a Delivery:

// The Request (Test File): Your test says, "I need the loginPage tool."
// test('my test', async ({ loginPage }) => { ... })

// The Factory (Fixture Block): Playwright looks at your fixture file, finds the loginPage block, and runs:
// const loginPage = new LoginPage(page);

// The Delivery (The use function): Playwright takes that new object and "injects" it into your test via the use(loginPage) command.

// The Action: Now, inside your test, loginPage isn't just a word; it is a live object in memory that you can click, type into, and navigate with.



// Why this is better than initializing objects in every test
// If you didn't have this "factory" block, every single test file you write would look like this:

// TypeScript
// test('old way', async ({ page }) => {
//     const loginPage = new LoginPage(page); // Doing the factory work MANUALLY
//     const productsPage = new ProductsPage(page); // Doing it AGAIN
//     // ... test steps
// });
// By putting it in the Fixture Block, you do that setup once in your entire project. Every test after that just "asks" for the object and receives it, ready to go.

// It makes your tests look like they are written in plain English:
// async ({ loginPage, productsPage }) — "Give me the login page and the products page."
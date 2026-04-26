import { testFixtures, expect } from '../../Fixtures/saucedemo';

testFixtures('add product to cart', async ({loginAuthentication, productsPage})=> {

    // Logged in already, successfully using the loginAuthentication fixture

    await productsPage.addProductToCartByName('Sauce Labs Backpack');

    const cartCount = await productsPage.getCartItemCount();
    expect(cartCount).toBe('1');


});


// How loginAuthentication fixture works for a test:

// 1. Playwright sees 'loginAuthentication' is required.
    // 2. It runs the login code (navigates, enters 'standard_user', etc.).
    // 3. It reaches 'await use()'. 
    // 4. Since it's 'void', nothing is passed back.
    // Now you are ALREADY logged in and can just start using the productsPage!


    // Because loginAuthentication is included in the test arguments "async ({loginAuthentication, productsPage})", 
    // Playwright is forced to execute that block of code before the test body begins. It’s a clean way to handle Prerequisites without cluttering your test with beforeEach blocks.


    // I imported testFixtures variable from ../../Fixtures/saucedemo and used it in the test instead of "test". 
    // This is because testFixtures is the version of test that has been extended with the saucedemo-specific fixtures (loginPage, productsPage, loginAuthentication). If I had used the regular "test" from Playwright, it wouldn't recognize those fixtures and would throw an error. By using testFixtures, I can seamlessly access those pre-configured fixtures in my test.


    
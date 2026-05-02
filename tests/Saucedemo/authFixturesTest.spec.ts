import { authFixtures, expect } from '../../Fixtures/auth-fixtures';
import { ProductsPage} from '../../page-objects/saucedemo/ProductsPage';

authFixtures('add product with standard user', async ({page, loggedInAsStandardUser}) => {

    // Since we used the loggedInAsStandardUser fixture, we are already logged in at this point. We can just start using the page and the ProductsPage object.
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    
    const cartCount = await productsPage.getCartItemCount();
    expect(cartCount).toBe('1');
});

authFixtures('performance user experience', async ({page, loggedInAsPerformanceUser}) => {

    // Since we used the loggedInAsPerformanceUser fixture, we are already logged in at this point. We can just start using the page and the ProductsPage object.
    const productsPage = new ProductsPage(page);
    const startTime = Date.now();

    // testing performance of speed it takes to add products to the cart for the performance user. This is a common use case for performance testing - measuring how long it takes to perform a key action on the site.
    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    await productsPage.addProductToCartByName('Sauce Labs Bike Light');
    
    const endTime = Date.now();
    console.log(`Add to cart took: ${endTime - startTime}ms`);
});


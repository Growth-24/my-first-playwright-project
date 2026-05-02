import {cartFixtures, expect} from '../../Fixtures/cart-fixtures';

cartFixtures('remove item from pre-filled cart', async ({page, cartWithProducts}) => {

    // Cart already has 2 items because of the fixture setup. We can verify that first to be sure we're starting from the right place.

    let itemCount = await cartWithProducts.getCartItemCount();
    expect(itemCount).toBe(2);

    await cartWithProducts.removeItemByName('Sauce Labs Backpack');
    itemCount = await cartWithProducts.getCartItemCount();
    expect(itemCount).toBe(1);
});
import {Page, Locator} from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('title');
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('#checkout');
        this.continueShoppingButton = page.locator('#continue-shopping');
    }

    async goto() {
        await this.page.goto('https://www.saucedemo.com/cart.html');
    }

    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async getCartItemNames(): Promise<string[]> {
        const items = await this.cartItems.all();
        const names: string[] = [];
        for (const item of items) {
            const name = await item.locator('.inventory_item_name').textContent();
            if (name) names.push(name);
        }
        return names;
    }

    async removeItemByName(productName: string){
        const item = this.page.locator('.cart_item', { hasText: productName});
        await item.locator('button:has-text("Remove")').click();
    }

    async clickCheckout(){
        await this.checkoutButton.click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async getItemPrice(productName: string): Promise<string> {

        const item = this.page.locator('.cart_item', {hasText: productName});
        return await item.locator('.inventory_item_price').textContent() || '';
    }

    async isItemInCart(productName: string): Promise<boolean>{
        const item = this.page.locator('.cart_item', { hasText: productName});
        return await item.isVisible();
    }

    async getCartItemDetails(productName: string){
        const item = this.page.locator('.cart_item', { hasText: productName});
        const name = await item.locator('.inventory_item_name').textContent() || '';
        const quantity = parseInt(await item.locator('.cart_quantity').textContent() || '0');
        return {name, quantity};
    }

    async getProductDescription(productName: string): Promise<string> {
        const item = this.page.locator('.cart_item', { hasText: productName});
        return await item.locator('.inventory_item_desc').textContent() || '';
    }
}


// async getCartItemDetails(productName: string) NOTES:

// name variable: item.locator('.inventory_item_name'): Notice this starts with item., not this.page.. It searches inside your specific product row for the element containing the name.
// || '': Just like before, this is your defensive fallback. If the text isn't found for some reason, it defaults to an empty string instead of crashing with null.

// quantity variable: item.locator('.cart_quantity').textContent(): This finds the quantity element inside that same row and extracts its text (ex: the string "1").
// || '0': If the element doesn't exist or is empty, it falls back to the string "0".
// parseInt(...): Web browsers treat everything on screen as strings. Since you want to perform math or numerical assertions later, parseInt converts that string ("1") into an actual JavaScript number (1).

// return {name,quantity}: with this code I am returning two variables packaged together inside an page object method, which makes them fully available to be used in my test file.
// The actual variables name and quantity that you created inside the Page Object method only exist inside that method. Once the method finishes running, those local variables disappear from the POM's memory.

// However, because you returned them, you pass their values out of the POM and hand them over to your test file.
// Inside your test file, you capture those values by assigning the method's result to a new variable.
// Here is exactly what that looks like in code:

// TypeScript
// // 1. Run the POM method (getCartItemDetails(productName: string)). The object {name, quantity} is sent here.
// // We save that page object method (getCartItemDetails(productName: string) into a new variable called 'itemDetails'
// const itemDetails = await cartPage.getCartItemDetails('Sauce Labs Backpack');

// // 2. Now, you use those values in your assertions like how we did in the test! So we use the variable with dot notation for the returned objects(name and quantity) to verify the values are correct.
// expect(itemDetails.name).toBe('Sauce Labs Backpack');
// expect(itemDetails.quantity).toBe(1);




// item variable:  this.page.locator('.cart_item', { hasText: productName }) looks at the entire page, scans all the shopping cart rows, and isolates the single row that matches your product name filter.
// Once that row is found and saved into the item variable, item acts like a spotlight focused only on that specific section of the page.

// { hasText: productName } is just a filter.
// productName comes from the argument you pass into the function when you call it in your test file.
// When you define the method in your Page Object, you set it up to accept a dynamic string. you dont actually put the text just stating text needs to be there.
// example: async getCartItemDetails(productName: string) 
// When you actually run your test, you pass the real name of the item you want to find into those parentheses:
// // 'Sauce Labs Backpack' becomes the 'productName' variable inside the POM
// await cartPage.getCartItemDetails('Sauce Labs Backpack');


// 2. How the .cart_item and the filter work together
// If your shopping cart has 3 items in it, your web page will look something like this behind the scenes:

// <div class="cart_item">Sauce Labs Backpack ...</div>

// <div class="cart_item">Sauce Labs Bike Light ...</div>

// <div class="cart_item">Sauce Labs Bolt T-Shirt ...</div>

// If you only wrote "this.page.locator('.cart_item')", Playwright would look at the page and see three matches. It wouldn't know which one you want to interact with, and your test would throw a strict mode violation error (meaning "you gave me 1 locator, but I found 3 elements!").

// By adding the filter, you are telling Playwright:
// Go find all the elements with the class .cart_item, but filter them down and only give me the specific one that physically contains the text string productName. Which is the product name I pass in when I call the method in my test file. In this case, it's 'Sauce Labs Backpack'.
// Because of that filter, the item variable becomes a locator for only that single, specific product row. That's why you can safely run item.locator('.inventory_item_name') next—Playwright is completely locked into that one specific row!


// // 2. What is item.locator? (Locator Chaining)
// When you type this.page.locator(), you are telling Playwright: "Search the entire web page."
// When you type item.locator(), you are chaining locators. You are telling Playwright: "Do not look at the whole page. Only search inside the specific item container we found in step 1."
// this.page.locator('.cart_item') finds the specific box holding your product.
// item.locator('.inventory_item_name') looks inside that specific box to find its title.
// This prevents your code from accidentally grabbing the price or quantity of a completely different product in the cart.
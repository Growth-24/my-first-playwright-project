import {Page, Locator} from '@playwright/test';

export class ProductsPage {
    
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly inventoryItems: Locator;
    readonly shoppingCartBadge: Locator;
    readonly shoppingCartLink: Locator;
    readonly sortDropdown: Locator;

    constructor(page: Page) {
        this.page= page;
        this.pageTitle = page.locator('.title');
        this.inventoryItems = page.locator('.inventory_item');
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
        this.shoppingCartLink = page.locator('.shopping_cart_link');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    }

    async goto() {
        await this.page.goto('https:///www.saucedemo.com/inventory.html');
    }

    async productsTitle() {
        await this.pageTitle.isVisible();
    }

    async getProductCount(): Promise<number> {
        return await this.inventoryItems.count();
    }

    async getProductNames(): Promise<string[]> {
        await this.page.locator('.inventory_item_name').first().waitFor(); // allTextContents() does not wait for the elements to appear. If the page is still loading when this line runs, it might return an empty array. Which is why i added this line of code to ensure it loads first.
        return await this.page.locator('.inventory_item_name').allTextContents();

    }

    async addProductToCartByName(productName: string) {
        const product = this.page.locator('.inventory_item', { hasText: productName});
        await product.locator('button:has-text("Add to cart")').click();
    }

    async removeProductFromCartByName(productName: string) {
        const product = this.page.locator('.inventory_item', { hasText: productName});
        await product.locator('button:has-text("Remove")').click();
    }

    async getCartItemCount(): Promise<string> {
        if(await this.shoppingCartBadge.isVisible()){
            return await this.shoppingCartBadge.textContent() || '0';

        } {
            return '0';
        }
    }

    async clickShoppingCart() {
        await this.shoppingCartLink.click();
    }

    async sortBy(option: string) {
        await this.sortDropdown.selectOption(option);
    }


    async getProductPrice(productName: string): Promise<string> {
        const product = this.page.locator('.inventory_item', { hasText: productName});
        return await product.locator('.inventory_item_price').textContent() || '';
    }

    async getAllProductPrices(): Promise<string[]> {
        // 1. Locate all price elements on the page
        const priceLocators = this.page.locator('.inventory_item_price');
        
        // 2. Extract text from all of them into an array of strings. // .allTextContents() is incredibly safe. If it finds elements, it returns an array of strings. If it finds nothing, it simply returns a clean, empty array ([]), so it won't crash your code!
        return await priceLocators.allTextContents();
    }

    async getAllProductsPageText(): Promise<string> {
        // Grabs the text from the entire products page, including product names, descriptions, prices, and any other text content within the inventory container.
        return await this.page.locator('.inventory_container').innerText();
    }

    async isProductInCart(productName: string): Promise<boolean> {
        const product = this.page.locator('.inventory_item', { hasText: productName});
        const removeButton = product.locator('button:has-text("Remove")');
        return await removeButton.isVisible();
    }
    
    async goToCart() {
        await this.shoppingCartLink.click();
    }

}


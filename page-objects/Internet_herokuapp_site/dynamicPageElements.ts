import { Page, Locator} from '@playwright/test';

export class dynamicLoadedPageElements {
    readonly page: Page;
    readonly exampleOneElement: Locator;
    readonly exampleTwoElement: Locator;
    readonly startBtn: Locator;
  


    constructor(page: Page) {

        this.page = page;
        this.exampleOneElement = page.getByRole('link', { name: 'Example 1: Element on page' });
        this.exampleTwoElement = page.getByRole('link', { name: 'Example 2: Element rendered' });
        this.startBtn = page.getByRole('button', { name: 'Start' });
    }

    async goto() { 

        await this.page.goto('https://the-internet.herokuapp.com/dynamic_loading');
        
    }

    async pageElementOne() { 

        await this.exampleOneElement.click();
        await this.startBtn.click();
        
    }

    async pageElementTwo() { 

        await this.exampleTwoElement.click();
        await this.startBtn.click();
    }


};
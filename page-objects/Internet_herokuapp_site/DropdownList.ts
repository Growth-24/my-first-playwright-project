import { Page, Locator} from '@playwright/test';

export class DropdownList {
    readonly page: Page;
    readonly dropdownOptions: Locator;
  
  


    constructor(page: Page) {

        this.page = page;
        this.dropdownOptions= page.locator('#dropdown');

    }



    async goto() {

        await this.page.goto('https://the-internet.herokuapp.com/dropdown');
        
    }


    async selectOptionOne() {
        await this.page.goto('https://the-internet.herokuapp.com/dropdown');
        await this.dropdownOptions.selectOption('1');
    }

    async selectOptionTwo() {
        await this.page.goto('https://the-internet.herokuapp.com/dropdown');
        await this.dropdownOptions.selectOption('2');
        
    }

   


};
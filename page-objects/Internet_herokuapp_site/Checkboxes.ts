import { Page, Locator} from '@playwright/test';

export class Checkboxes {
    readonly page: Page;
    readonly checkbox: Locator;



    constructor(page: Page) {

        this.page = page;
        this.checkbox = page.getByRole('checkbox');
   
    }

    async goto() {

        await this.page.goto('https://the-internet.herokuapp.com/checkboxes');
        
    }


    async checkCheckboxOne(){
        await this.checkbox.first().check();
    }


    async checkCheckboxTwo(){
        await this.checkbox.nth(1).uncheck();
        await this.checkbox.nth(1).check();
       
    }

    async uncheckCheckboxOne(){
        await this.checkbox.first().check();
        await this.checkbox.first().uncheck();
       
    }

    async uncheckCheckboxTwo(){
        await this.checkbox.nth(1).uncheck();

    }

};





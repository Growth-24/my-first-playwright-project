import { Page, Locator} from '@playwright/test';

export class Checkboxes {
    readonly page: Page;
    readonly checkboxOne: Locator;
    readonly checkboxTwo: Locator;
    readonly uncheckboxOne: Locator;
    readonly uncheckboxTwo: Locator;


    constructor(page: Page) {

        this.page = page;
        this.checkboxOne = page.getByRole('checkbox').first();
        this.checkboxTwo = page.getByRole('checkbox').nth(1);
        this.uncheckboxOne = page.getByRole('checkbox').first();
        this.uncheckboxTwo = page.getByRole('checkbox').nth(1);
    }

    async goto() {

        await this.page.goto('https://the-internet.herokuapp.com/checkboxes');
        
    }


    async checkCheckboxOne(){

        await this.checkboxOne.check();
       
    }


    async checkCheckboxTwo(){

        await this.uncheckboxTwo.uncheck();
        await this.checkboxTwo.check();
       
    }

    async uncheckCheckboxOne(){
        
        await this.checkboxOne.check();
        await this.uncheckboxOne.uncheck();
       
    }

    async uncheckCheckboxTwo(){
        
        await this.uncheckboxTwo.uncheck();


    }

};





import { Page, Locator} from '@playwright/test';

export class HerokuappLoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly logoutButton: Locator;
    readonly usernameErrorMessage: Locator;
    readonly passwordErrorMessage: Locator;


    constructor(page: Page) {

        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: ' Login' });
        this.logoutButton = page.getByRole('link', { name: 'Logout' });
        this.usernameErrorMessage = page.getByText('Your username is invalid! ×');
        this.passwordErrorMessage = page.getByText('Your password is invalid! ×');
    }



    async goto() {

        await this.page.goto('https://the-internet.herokuapp.com/login');
        
    }


    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async userNameError(username: string){
        await this.usernameInput.fill(username);
        await this.loginButton.click();
        
    }

    async passwordError(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }


};
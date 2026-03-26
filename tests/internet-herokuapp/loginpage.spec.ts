import { test, expect } from '@playwright/test';
import { HerokuappLoginPage } from '../../page-objects/Internet herokuapp site/HerokuappLoginPage.ts';

test.describe('Login page validation tests', () => {


    test('Successful login', async ({ page }) => {

        const heroKuappLogin = new HerokuappLoginPage(page);
        await heroKuappLogin.goto();
        await heroKuappLogin.login('tomsmith', 'SuperSecretPassword!');
      
    });

    test('Successful logout', async ({ page }) => {

        const heroKuappLogin = new HerokuappLoginPage(page);
        await heroKuappLogin.goto();
        await heroKuappLogin.login('tomsmith', 'SuperSecretPassword!');
        await heroKuappLogin.logout();
      
    });

    test('Username error message', async ({ page }) => {

        const heroKuappLogin = new HerokuappLoginPage(page);
        await heroKuappLogin.goto();
        await heroKuappLogin.userNameError('waynemyrie')
      
    });

    // This only shows the password error message if the username is 'tomsmith', because of how the website is designed.
    
    test('Password error message', async ({ page }) => {

        const heroKuappLogin = new HerokuappLoginPage(page);
        await heroKuappLogin.goto();
        await heroKuappLogin.passwordError('tomsmith','test1234');
      
    });

});
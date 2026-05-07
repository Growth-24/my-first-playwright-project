import {test as setup, expect} from '@playwright/test';
import { LoginPage } from '../../page-objects/Saucedemo/LoginPage';
import { SauceDemoUsers } from  '../../utils/test-data';

const authFilePath = 'playwright/.auth/user.json';

setup('authenticate as standard user', async ({page}) => {

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);

    // Wait for successful login
     ;

    // Save authentication state

    await page.context().storageState({path: authFilePath});


});




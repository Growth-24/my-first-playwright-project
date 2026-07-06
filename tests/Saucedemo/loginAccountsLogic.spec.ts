import{test, expect} from '@playwright/test';
import {LoginPage} from '../../page-objects/saucedemo/LoginPage';
import { SauceDemoUsers} from '../../utils/test-data';

test.describe('SauceDemo login accounts logic tests',()=>{

    let loginPage: LoginPage;
    test.beforeEach(async ({page})=>{
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });


    test('successful login with standard user', async({page})=>{
        await loginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });


    test('login fails with invalid credentials', async()=>{

        await loginPage.login('invalid_user', 'wrong_password');
        const isErrorVisible = await loginPage.isErrorVisible();
        expect(isErrorVisible).toBeTruthy();
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toContain('Username and password do not match');

    });


    test('login fails with locked out user', async({page})=>{
        await loginPage.login(SauceDemoUsers.locked.username, SauceDemoUsers.locked.password);
        const errorText =await loginPage.getErrorMessage();
        expect(errorText).toContain('Sorry, this user has been locked out');
    }); 

    

    test('login fails with empty username', async({page})=>{
        await loginPage.login("", SauceDemoUsers.standard.password);
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toContain('Username is required');
    }); 


    test('login fails with empty password', async({page})=>{
        await loginPage.login(SauceDemoUsers.standard.username, "");
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toContain('Password is required');
    }); 

    test('clearing login error message', async ({ page }) => {
        await loginPage.goto();
        await loginPage.login('invalid_user', 'wrong');
        
        await expect(loginPage.errorMessage).toBeVisible();
        await loginPage.clearError();
        await expect(loginPage.errorMessage).not.toBeVisible();
    });

        

});
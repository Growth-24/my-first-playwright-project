import {test, expect} from '@playwright/test';
import {LoginPage} from '../../page-objects/saucedemo/LoginPage';

const testUsers = [

    {username: 'standard_user', password: 'secret_sauce',shouldSucceed: true},
    {username: 'locked_out_user', password: 'secret_sauce',shouldSucceed: false},
    {username: 'problem_user', password: 'secret_sauce',shouldSucceed: true},
    {username: 'invalid_user', password: 'wrong_password',shouldSucceed: false},

];

test.describe('SauceDemo Login with Multiple Users', () => {

    // Since its a for loop of all the test users in the array above, everytime the test runs it will generate all of the username and passwords from the array, plus be a seperate test case for each user and their password in the array. 
    // This is a great way to test multiple users without having to write separate test cases for each user, which can be time consuming and repetitive.
    // 
    // Each time the test runs it has to have a different test title; to fix this, 
    // I included the  ${user.username} in the test title to make each test unique and used it as a template literals. This way, when the tests run, we can easily identify which user is being tested in each case with also a 
    // different test title everytime the test runs. So now we can just add more users to the array without issue to generate more tests for different users.



    
    for (const user of testUsers) {

        test(`login test for users: ${user.username}`, async ({page}) => {

            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(user.username, user.password);

            if (user.shouldSucceed) {
              await expect(page).toHaveURL(/inventory.html/);
            } 
            
            else {
                const errorIsVisible = await loginPage.isErrorVisible();
                expect(errorIsVisible).toBeTruthy();
            }


      
        });
    }
});
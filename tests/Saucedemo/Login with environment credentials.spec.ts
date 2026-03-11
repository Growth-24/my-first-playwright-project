import {test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();
import { SauceDemoUsers } from '../../utils/test-data';


test('login with environment credentials', async ({ page }) =>{

   await page.goto('/');

   // Use Credentials from .env file

   await page.locator('#user-name').fill(process.env.SAUCEDEMO_STANDARD_USER!);
   await page.locator('#password').fill(process.env.SAUCEDEMO_PASSWORD!);
   await page.locator('#login-button').click();



});



test('login with test data helper', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  
    await page.locator('#user-name').fill(SauceDemoUsers.standard.username);
    await page.locator('#password').fill(SauceDemoUsers.standard.password);
    await page.locator('#login-button').click();
  
    await expect(page).toHaveURL('/inventory.html');
  });
  




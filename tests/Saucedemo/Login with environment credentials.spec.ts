import {test, expect } from '@playwright/test';
import path from 'path';
import { SauceDemoUsers } from '../../utils/test-data';

import * as dotenv from 'dotenv';
// since my .env file is at the root level of my project and not within a folder I don't have to specify a path within dotenv.config()
dotenv.config();



test('login with environment credentials', async ({ page }) =>{

   await page.goto('/');

   // Use Credentials from .env file

   await page.locator('#user-name').fill(process.env.SAUCEDEMO_STANDARD_USER!);
   await page.locator('#password').fill(process.env.SAUCEDEMO_PASSWORD!);
   await page.locator('#login-button').click();



});

// this login informaiton is from my test data file where i have a object named sauce demo users with 
// variety of different logins to test

test('login with test data helper', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  
    await page.locator('#user-name').fill(SauceDemoUsers.standard.username);
    await page.locator('#password').fill(SauceDemoUsers.standard.password);
    await page.locator('#login-button').click();
  
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  




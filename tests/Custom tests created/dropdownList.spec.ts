import { test, expect } from '@playwright/test';
import { DropdownList } from '../../page-objects/Internet_herokuapp_site/DropdownList';

test.describe('Dropdown list validation tests', () => {


    test('Select option one', async ({ page }) => {

        const dropdownList = new DropdownList(page);
        await dropdownList.goto();
        await dropdownList.selectOptionOne();
        await expect(page.locator('#dropdown')).toHaveValue('1');

  
    });


    test('Select option two', async ({ page }) => {

        const dropdownList = new DropdownList(page);
        await dropdownList.goto();
        await dropdownList.selectOptionTwo();
        await expect(page.locator('#dropdown')).toHaveValue('2');
    });


    test('Dropdown list title', async ({ page }) => {

        const dropdownList = new DropdownList(page);
        await dropdownList.goto();
        await expect(page.getByRole('heading')).toContainText('Dropdown List');
        
    });



});
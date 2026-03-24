import { test, expect } from '@playwright/test';
import { Checkboxes } from '../../page-objects/Internet herokuapp site/checkboxes';

test.describe('Checkbox validation tests', () => {


    test('Check checkbox one', async ({ page }) => {

        const checkboxes = new Checkboxes(page);
        await checkboxes.goto();
        await checkboxes.checkCheckboxOne();
        await expect(page.getByRole('checkbox').first()).toBeVisible();
        await expect(page.getByRole('checkbox').first()).toBeChecked();
    });


    test('Check checkbox Two', async ({ page }) => {

        const checkboxes = new Checkboxes(page);
        await checkboxes.goto();
        await checkboxes.checkCheckboxTwo();
        await expect(page.getByRole('checkbox').nth(1)).toBeVisible();
        await expect(page.getByRole('checkbox').nth(1)).toBeChecked();
    });


    test('Uncheck checkbox One', async ({ page }) => {

        const checkboxes = new Checkboxes(page);
        await checkboxes.goto();
        await checkboxes.uncheckCheckboxOne();
        await expect(page.getByRole('checkbox').first()).toBeVisible();
        await expect(page.getByRole('checkbox').first()).not.toBeChecked();
    });


    test('Uncheck checkbox Two', async ({ page }) => {

        const checkboxes = new Checkboxes(page);
        await checkboxes.goto();
        await checkboxes.uncheckCheckboxTwo();
        await expect(page.getByRole('checkbox').nth(1)).toBeVisible();
        await expect(page.getByRole('checkbox').nth(1)).not.toBeChecked();
    });


});
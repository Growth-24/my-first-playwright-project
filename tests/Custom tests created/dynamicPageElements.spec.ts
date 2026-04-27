import { test, expect } from '@playwright/test';
import { dynamicLoadedPageElements } from '../../page-objects/Internet_herokuapp_site/dynamicPageElements.ts';

test.describe('Dynamic page elements validation tests', () => {



    test('Page elements home page loads successfully', async ({ page }) => {

        const dynamicPageElements = new dynamicLoadedPageElements(page);
        await dynamicPageElements.goto();
        await expect(page.locator('#content')).toBeVisible();
        
      
    });

    test('Page element one loads successfully', async ({ page }) => {

        const dynamicPageElements = new dynamicLoadedPageElements(page);
        await dynamicPageElements.goto();
        await dynamicPageElements.pageElementOne();
        await expect(page.getByText('Dynamically Loaded Page Elements Example 1: Element on page that is hidden')).toBeVisible();
        await expect(page.locator('#finish')).toContainText('Hello World!');

      
    });


    test('Page element two loads successfully', async ({ page }) => {

        const dynamicPageElements = new dynamicLoadedPageElements(page);
        await dynamicPageElements.goto();
        await dynamicPageElements.pageElementTwo();
        // used this wait because the second page element took longer for the "Hello World!" text to appear and I wanted to make sure it was fully loaded before trying to assert on it.
        await page.locator('#finish').waitFor({ state: 'visible' });
        // used this assertion to try out the snapshot feature for the entire page once finished loading
        await expect(page.locator('#content')).toMatchAriaSnapshot(`
            - heading "Dynamically Loaded Page Elements" [level=3]
            - 'heading "Example 2: Element rendered after the fact" [level=4]'
            - heading "Hello World!" [level=4]
            `);

      
    });

});
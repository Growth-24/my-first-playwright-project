import {test, expect} from '@playwright/test';

import path from 'path';

test.describe('File Upload Tests', () => {

    test('upload single file', async ({page}) => {
        
        await page.goto('https://the-internet.herokuapp.com/upload');

        // Create or use existing test file

        const filePath = path.join(__dirname, '../../test-data/sample.txt');

        // Upload the file

        const fileInput =  page.locator('#file-upload');
        await fileInput.setInputFiles(filePath);

        // Click upload button

        await page.locator('#file-submit').click();

        // Verify upload success

        await expect(page.locator('#uploaded-files')).toHaveText('sample.txt');

    });

    test('upload multiple files', async ({page}) => {

        await page.goto('https://the-internet.herokuapp.com/upload');
        
        const files = [path.join(__dirname, '../../test-data/file1.txt'), path.join(__dirname, '../test-data/file2.txt'), ];

        const fileInput = page.locator('#file-upload');
        await fileInput.setInputFiles(files);
        await page.locator('#file-submit').click();

        // Verify both files uploaded

        const uploadedFiles = page.locator('#uploaded-files');
        await expect(uploadedFiles).toContainText('file1.txt');
    });
});
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


    // This upload site only takes one file at a time, so we will test the path resolve method to ensure it works as expected.

    // path.resolve() starts looking from your project root (where your package.json is), so you don't have to worry about how many ../ to add like how you do with __dirname.
    test('upload file using path resolve', async ({page}) => {

        await page.goto('https://the-internet.herokuapp.com/upload');
        
        const files = [path.resolve('test-data/file1.txt')];

        const fileInput = page.locator('#file-upload');
        await fileInput.setInputFiles(files);
        await page.locator('#file-submit').click();

        // Verify file uploaded

        const uploadedFile = page.locator('#uploaded-files');
        await expect(uploadedFile).toContainText('file1.txt');
    });

    test('create and upload file on the fly', async ({page}) => {

        await page.goto('https://the-internet.herokuapp.com/upload');

        // You define the string content you want inside the file.

        const fileContent = 'This is a test file created on the fly.';

        // The string 'This is a test file created on the fly.' is the actual text that will appear inside the .txt file when it is uploaded and opened on the server.
        // It is converted by Buffer.from: The Buffer.from(fileContent, 'utf-8') command takes that exact string and transforms it into a binary format (a buffer) that the browser understands as a file's content.
        
        const buffer = Buffer.from(fileContent, 'utf-8');
        const fileInput = page.locator('#file-upload');
        await fileInput.setInputFiles({name: 'dynamic-file.txt', mimeType: 'text/plain', buffer: buffer,});
               
        // setInputFiles({ name: ..., mimeType: ..., buffer: ... })
        // This is the "magic" step. Instead of giving Playwright a file path (like C:/Users/file.txt), you pass it an object that contains:
        
        // name: The filename the browser will see.
        
        // mimeType: The file type (like text/plain for .txt).
        
        // buffer: The raw data created in the variable named buffer, which contains the content you want in the file.
        
        // this is a easy way to create and upload a file to test file upload functionality 
        await page.locator('#file-submit').click();
        await expect(page.locator('#uploaded-files')).toHaveText('dynamic-file.txt');
    });

    test('remove uploaded file', async ({page}) => {

        await page.goto('https://the-internet.herokuapp.com/upload');
        const filePath = [path.resolve('test-data/file1.txt')];
        const fileInput = page.locator('#file-upload');

        // Upload the file

        await fileInput.setInputFiles(filePath);

        // Clear the file input

        await fileInput.setInputFiles([]);

        // Verify the file input is cleared

        const files = await fileInput.inputValue();
        expect(files).toBe('');
    });


});
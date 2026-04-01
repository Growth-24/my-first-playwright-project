import { test, expect } from '@playwright/test';
import { fileUploader } from '../../page-objects/Internet_herokuapp_site/fileUploader';
import path from 'path';

test.describe('File uploader validation tests', () => {


    test('Upload a file successfully', async ({ page }) => {

        const fileUpload = new fileUploader(page);
        const file1 = path.resolve(__dirname, '../../test-data/water.png');
        await fileUpload.goto();
        await fileUpload.selectFile(file1);
        await fileUpload.uploadFile();
        await expect(page.getByRole('heading')).toContainText('File Uploaded!');
    });


// The demo website looks to only allow one file to be uploaded at this time and only if using the "Choose File" button, if you try to upload multiple files or use the drag and drop feature to upload 
// a single or multiple files, it throws an error. 
// I have included these tests to show that I can handle negative scenarios as well and that I am aware of the limitations of the website.

    test('Upload multiple files using drag and drop fails', async ({ page }) => {

        const fileUpload = new fileUploader(page);
        const file1 = path.resolve(__dirname, '../../test-data/water.png');
        const file2 = path.resolve(__dirname, '../../test-data/water.png');
        const file3 = path.resolve(__dirname, '../../test-data/water.png');
        await fileUpload.goto();
        await fileUpload.dragAndDrop([file1, file2, file3]);
        await fileUpload.uploadFile();
        await expect(page.getByRole('heading')).toContainText('Internal Server Error');
    });

    test('Upload a single file using drag and drop fails', async ({ page }) => {

        const fileUpload = new fileUploader(page);
        const file1 = path.resolve(__dirname, '../../test-data/water.png');
        await fileUpload.goto();
        await fileUpload.dragAndDrop([file1]);
        await fileUpload.uploadFile();
        await expect(page.getByRole('heading')).toContainText('Internal Server Error');
    });


});


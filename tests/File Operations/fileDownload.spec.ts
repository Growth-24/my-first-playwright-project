import {test, expect} from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('File Download Tests', () => {

    test('download file and verify content', async ({page}) => {

        await page.goto('https://the-internet.herokuapp.com/download');

        // Start waiting for download before clicking

        const downloadPromise = page.waitForEvent('download');

        // Click download link

        await page.locator('a[href*=".txt"]').first().click();

        // Wait for download to complete

        const download = await downloadPromise;
  
        // Get download filename

        const fileName = download.suggestedFilename();
        console.log('Downloaded file name:', fileName);

        // Save to specific path

        const downloadPath = path.join(__dirname, '../downloads', fileName);
        await download.saveAs(downloadPath);

        // Verify file exists

        expect(fs.existsSync(downloadPath)).toBeTruthy();

        // verify file size

        const stats = fs.statSync(downloadPath);
        expect(stats.size).toBeGreaterThan(0);

        // clean up downloaded file

        fs.unlinkSync(downloadPath);


    });

    test('download file and read content', async ({page}) => {

        await page.goto('https://the-internet.herokuapp.com/download');
        const downloadPromise = page.waitForEvent('download');
        await page.locator('a[href*=".txt"]').first().click();
        const download = await downloadPromise;

        // Get download as stream
        const stream = await download.createReadStream();
        const chunks: Buffer[] = [];

        for await (const chunk of stream) {
            chunks.push(chunk);
        }

        const content = Buffer.concat(chunks).toString('utf-8');
        console.log('File contenet:', content);
        expect(content.length).toBeGreaterThan(0);
    });

    test('handle download failure', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/download');
        const downloadPromise = page.waitForEvent('download');
        await page.locator('a[href*=".txt"]').first().click();

        const download = await downloadPromise;

        // Wait for download to complete or fail

        const failure = await download.failure();

        if (failure) {
            console.log('Download failed: ', failure);
        } else {

            console.log('Download succeeded');
        }

     

    });




});
import {test, expect} from '@playwright/test';

test.describe('Dialog Handling', () => {

    test('handle JavaScript alert', async ({page}) => {
        
        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

        // Setup dialog handler: This sets up an asynchronous event listener. You are telling Playwright: "Keep your ears open. The very next time the browser fires a native pop-up dialog, pause everything and hand control over to this block of code.
        // Inside that listener, you process the alert using the dialog object passed to it:
        page.on('dialog', async dialog => {

            // Verifies that the pop-up type is a basic standard browser alert (window.alert). (Other types could be confirm or prompt).
            expect(dialog.type()).toBe('alert');

            //: Asserts that the string text displayed inside the alert window exactly matches what you expect.
            expect(dialog.message()).toBe('I am a JS Alert');

            // Simulates a user clicking the "OK" button on the alert box. This dismisses the dialog so the browser UI unfreezes and your test can continue.
            await dialog.accept();
        });

        // What it does: This performs the actual physical click on the button.
        // The Behind-the-Scenes: The split-second this click happens, the browser attempts to freeze the UI and show the alert. But because you set up page.on('dialog'), Playwright catches it instantly, passes it to your trap, asserts on it, clicks OK, and resumes—all in a fraction of a second.
        await page.locator('button:has-text("Click for JS Alert")').click();


        // Finally, you look back at the actual webpage. The web application updates a text box with a success message when an alert is successfully dismissed. This line double-checks that the application logic reacted correctly to your simulated "OK" click.
        //Verify result
        await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');

    });

    test('handle JavaScript confirm - accept', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

        page.on('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm');
            expect(dialog.message()).toBe('I am a JS Confirm');
            await dialog.accept();
        });

        await page.locator('button:has-text("Click for JS Confirm")').click();
        await expect(page.locator('#result')).toHaveText('You clicked: Ok');
    });

    test('handle JavaScript prompt', async ({page}) => {

        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

        page.on('dialog', async dialog => {
            expect(dialog.type()).toBe('prompt');
            expect(dialog.message()).toBe('I am a JS prompt');

            // how you handle a JavaScript Prompt box when it expects user input with text before clicking "OK". handles two actions at once: it fills the native text field and dismisses the dialog. You don't need separate "type" and "click" commands like you do with standard HTML input elements.
            expect(dialog.defaultValue()).toBe(''); // The default value in the prompt input field is empty
            await dialog.accept('Playwright Test');
        });

        await page.locator('button:has-text("Click for JS Prompt")').click();
        await expect(page.locator('#result')).toHaveText('You entered: Playwright Test');
    });

    test('handle multiple dialogs', async ({page}) => {

        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');


        // This creates a standard JavaScript counter variable. It starts at 0 and sits in the main scope of the test so that it can be updated from inside the event listener.
        let dialogCount = 0;

        // page.on() sets up a persistent listener. It will stay awake and active for the entire duration of this test, ready to intercept every single modal the browser throws at it. Each time a dialog appears, the function you provide will run. Inside that function, you increment the dialogCount variable by 1 to keep track of how many dialogs have been handled. Then, you call dialog.accept() to automatically dismiss each dialog as it appears.
        // dialogCount++;: Every time a native pop-up surfaces, Playwright pauses, enters this block, and increases your counter by 1.

        // await dialog.accept();: Dismisses the active dialog by clicking "OK" so the browser can keep moving forward.

        // The ++ is the JavaScript shortcut for "add 1 to this variable." (dialogCount = dialogCount + 1).
            // Because there are two separate button clicks triggering two separate dialogs, that page.on('dialog') block runs exactly twice:
            // First Dialog (Alert): dialogCount goes from 0 to 1.
            // Second Dialog (Confirm): dialogCount goes from 1 to 2.
            // So those "two pluses" (++) directly match the two dialogs accepted by your test. 
        
        page.on('dialog', async dialog => {
            
            dialogCount++;
            await dialog.accept();

        });

        // The First Click: Fires a basic text alert. The listener catches it, increments dialogCount to 1, accepts it, and closes it.
        // The Second Click: Fires a confirmation dialog box. Because page.on() is still listening, it instantly catches this one too, increments dialogCount to 2, accepts it, and closes it.

        await page.locator('button:has-text("Click for JS Alert")').click();
        await page.locator('button:has-text("Click for JS Confirm")').click();

        // expect(dialogCount).toBe(2);: This is your final assertion. It verifies that the browser successfully launched—and Playwright successfully intercepted—exactly two dialogs during the test run.
        expect(dialogCount).toBe(2);
    });
});
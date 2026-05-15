import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
    baseURL: 'https://www.saucedemo.com',

    screenshot: 'only-on-failure',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },




  /* Configure projects for major browsers */
  projects: [
    // setup project
    // {name: 'setup', testMatch: /.*\.setup\.ts/},
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    //   dependencies: ['setup'],
    // },

    // { name: 'setup', testMatch: /.*\.setup\.ts/ },
    // name: 'setup': This gives this specific project a nickname. It’s like labeling a folder so you can refer to it later.

    // testMatch: This is a Regular Expression. It tells Playwright: "Scan the entire project for any files that end in .setup.ts and run them as part of this 'setup' project." This keeps your authentication logic separate from your actual test logic.

    // 
    
    // dependencies: ['setup']: This is the most critical part of the flow. It tells Playwright: "You are not allowed to start the 'chromium' project until the 'setup' project has finished successfully."

    // Without this line, Playwright would try to run both at the same time. The 'chromium' tests would fail because the user.json file hasn't been created yet! 

//     The Setup File is the "Worker"
// The file matching *.setup.ts (like your sessionStorage.setup.ts) is a specialized test. Its only job is to:

// Launch the browser.

// Interact with the LoginPage object.

// Perform the login() method.

// Crucially: Take a "snapshot" of the cookies and local storage and save them to user.json.

// 2. The Config is the "Coordinator"
// The configuration doesn't perform the login itself; it just manages the timing.

// It ensures the Setup File runs first.

// It tells the other tests where to find the saved session data so they don't have to log in themselves.

    // {

    //   name: 'standard-user',
    //   use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/standard.json'},
    //   dependencies: ['setup'],
    //   // This project ONLY picks up tests that have "standard" in the test title not the file name, so we can have a single test file with both standard and performance user tests and they will be picked up by the correct project based on the test title.
    //   grep: /.*standard.*/,

    // },

    // {
    //   name: 'performance-user',
    //   use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/performance.json'},
    //   dependencies: ['setup'],
    //   // This project ONLY picks up tests that have "performance" in the title not the file name, so we can have a single test file with both standard and performance user tests and they will be picked up by the correct project based on the test title.
    //   grep: /.*performance.*/,

    // },


    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },



  // Determine which site to test based on environment variable



});



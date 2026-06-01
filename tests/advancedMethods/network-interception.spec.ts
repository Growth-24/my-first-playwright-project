import { test, expect } from '@playwright/test';

test.describe('Network Interception', () => {

    test('intercept and log API calls', async ({ page }) => {

        // This initializes an empty array called apiCalls. Its purpose is to act as a storage bin to keep track of every matching API request URL and method so they can be counted or inspected later.
          const apiCalls: string[] = [];


        // Listen to all requests

        // page.on('request', ...): This sets up an event listener. Every single time the browser tries to fetch a resource (HTML, images, CSS, API calls), this block triggers.

        // The if condition: It filters the noise. It only pays attention to requests where the URL contains the string /api/ or json. This is a common pattern to identify API calls, as they often have those keywords in their endpoints. By doing this, you can focus on the relevant network traffic and ignore things like images or stylesheets.

        // Inside the condition:

            // It formats the request (e.g., "GET https://example.com/api/users") and pushes it into the apiCalls array.

            // It prints a clean log to your terminal so you can watch requests go out in real time.

        page.on('request', request => {
            if(request.url().includes('/api/') || request.url().includes('json')) {

                apiCalls.push(`${request.method()} ${request.url()}`);

                console.log('Request: ', request.method(), request.url());
            }    
        });

        // Listen to all responses

        // page.on('response', ...): Similar to the request listener, this fires whenever the server sends data back to the browser.

        // The if condition: Uses the exact same filter to match the requests.

        // Inside the condition: It logs the HTTP status code (like 200 for success or 404 for not found) along with the URL. This helps you verify not just that the request was made, but also that it got a valid response.

        page.on('response', response => {
            if(response.url().includes('/api/') || response.url().includes('json')) {

                console.log('Response: ', response.status(), response.url());
            }    
        });

        // await page.goto(...): This navigates the browser to JSONPlaceholder (a popular mock API website). Because this site fires off background API requests immediately upon loading, it acts as the perfect trigger for our network listeners.

        // console.log(...): Once the initial page finishes loading, this prints the total number of filtered API requests that were captured in our array.

        await page.goto('https://jsonplaceholder.typicode.com/');
        await page.waitForTimeout(2000); // Wait a bit to ensure all requests are captured
        console.log('Total API calls: ', apiCalls.length);
    });

    test('block specific requests', async ({ page }) => {

        // Block image requests

        // Think of page.route() as a custom firewall for this specific browser tab. You give it a pattern to watch for, and whenever the browser tries to fetch a URL that matches that pattern, Playwright pauses the request and hands it over to you to decide its fate.

        // /*.{png,jpg,jpeg,gif,svg}: This is a glob pattern (a type of wildcard matching).

            // The ** means "look in any folder or domain name".

            // The * means "any file name".

            // The {png,jpg,...} means "matching any of these specific file extensions".

            // route.abort(): This tells Playwright to completely cancel the request. The browser will behave as if the image file doesn't exist or the server dropped the connection.

            // ⚡ Why do this? Images take up a lot of bandwidth and time to load. If your test only cares about clicking text buttons, blocking images can make your tests run up to 2x to 3x faster.

        await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());

        // Block analytics

        // /analytics/: Blocks any URL that contains the word "analytics" anywhere in its path.

        // /ga/: Blocks Google Analytics scripts (which often use /ga.js or include /ga/ in their endpoints).

        // Why do this? You don't want your automated testing scripts inflating your real-world marketing analytics data (like Google Analytics or Mixpanel) with hundreds of fake bot visits.

        await page.route('**/analytics/**', route => route.abort());
        await page.route('**/ga/**', route => route.abort());

        // Just like my previous test, this is placed at the very bottom. You must tell the browser how to block the traffic before you tell it to go to the website.

        //  When this website loads, it will load purely as text, HTML, and CSS layouts—completely naked of any images or tracking scripts!
        await page.goto('https://the-internet.herokuapp.com/');

    });


    test('modify request headers', async ({ page }) => {

        await page.route('**/*', route => {

            const headers = {
                ...route.request().headers(),
                'X-Custom-Header': 'Playwright-Test',
                'Authorization': 'Bearer fake-token'
            };

            route.continue({ headers });

        });
        
        await page.goto('https://httpbin.org/headers');

        // Verify custom header was sent

        const content = await page.textContent('pre');
        expect(content).toContain('X-Custom-Header');

    });

    test('mock API response', async ({ page }) => {

        // Mock API endpoint

        await page.route('**/api/users', route => {
            route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({ users: [{ id: 1, name: 'John Doe' },{ id: 1, name: 'John Doe' }] }) });
        });

        // Navigate and verify mocked data is used
    });
});







// ADDITIONAL NOTES

// request.url() and response.url()
// What it does: This method retrieves the absolute URL of the specific network resource being requested or received.

// Does it trigger for the current website? Yes, but with an important distinction: it triggers for every single asset the website tries to load. When you go to a site, 
// your browser doesn't just make one request. It requests the main HTML page, then it requests the CSS files, JavaScript files, images, fonts, and finally, any background API data (/api/ or .json in your script's case).


// So, request.url() will absolutely capture the main website URL (https://jsonplaceholder.typicode.com/), but your if statement filters it out unless that main URL happens to contain /api/ or json.

// request.method()
// What it does: This returns the HTTP method (also known as the HTTP verb: define the specific action a client wants a server to perform on a resource. ) used for the request.

// It tells you what action the browser is trying to perform on the server. The most common ones you'll see logged are:

// GET: Fetching data (like loading a webpage or a user profile).

// POST: Sending new data (like submitting a login form or creating a new post).

// PUT/PATCH: Updating existing data.

// DELETE: Removing data.


// Why is await page.goto('https://jsonplaceholder.typicode.com/'); at the bottom?

// This is the most critical architectural concept in event-driven automation. You have to set the trap before you spring it.

// Playwright's page.on() functions are event listeners. They don't actually do anything immediately; they just tell the browser: "Hey, keep an eye out. If a network request happens at any point in the future, run this block of code."

// If you flipped the order and put await page.goto(...) first, this is what would happen:

// The browser navigates to the site.

// The site immediately fires off all its network requests and receives its API responses.

// The page finishes loading.

// Then your script sets up the page.on('request') listeners.

// By the time the listeners are active, the party is already over—the network traffic has finished, and your array stays completely empty. By putting page.goto() last, you ensure the recording equipment is running before the action starts.


// response information:

// response.url() itself is just a built-in Playwright tool that screams out the address of whatever just loaded (example: "https://jsonplaceholder.typicode.com/posts/1").

// This code uses the URL inside the if statement to act as a security guard, filtering out all the giant images and CSS files so you only log the .json and /api/ traffic.

    // if(response.url().includes('/api/') || response.url().includes('json'))

// response.status() — 
// It doesn't find the status of the website itself (like whether the whole site is up or down). Instead, it finds the HTTP status code of that one specific API call or file that just finished loading.

// Think of it like a digital receipt. Every time the browser requests a piece of data, the server sends back a 3-digit status code telling the browser how it went:

// 200 (OK): "Here is the data you asked for!"

// 201 (Created): "Success! I just saved that new data you sent me."

// 404 (Not Found): "I don't know what API endpoint you're looking for, it doesn't exist."

// 500 (Internal Server Error): "The server crashed while trying to process this request."

// So when your code runs:

// TypeScript
// console.log('Response: ', response.status(), response.url());
// It outputs something like: Response: 200 https://jsonplaceholder.typicode.com/posts — meaning that specific API call was a total success
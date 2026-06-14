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
        // page.route('/*', ...): This sets up a network interceptor. The wildcard glob pattern '**/*' tells Playwright to listen to every single network request (HTML, images, API calls, stylesheets) that the page makes.
        // route object: When a request matches the pattern, Playwright pauses it and passes a route object into the callback function, giving you control over what to do with it next.
        await page.route('**/*', route => {

            // This uses the JavaScript spread operator (...) the three dots attached to route, to copy all of the original headers that the browser was already going to send (like User-Agent, Accept-Encoding, etc.). This ensures you don't accidentally strip away necessary default headers.
            // Custom Additions: It then appends two new headers to that list: a tracking header (X-Custom-Header) and a mock authentication token (Authorization). If these headers already existed, they will be overwritten with these new values.
            const headers = {
                ...route.request().headers(),
                'X-Custom-Header': 'Playwright-Test',
                'Authorization': 'Bearer fake-token'
            };

            // route.continue({ headers }): This tells Playwright, "Okay, let the request go through to the internet now, but use this modified headers object instead of the original one."

            route.continue({ headers });

        });
        

        // The browser navigates to httpbin.org/headers, which is a public dummy service that simply echoes back all the HTTP headers it receives in a JSON format on the screen. Because this navigation triggers a network request, it immediately trips the page.route interceptor we set up in Step 1.
        await page.goto('https://httpbin.org/headers');

        // Verify custom header was sent
        // page.textContent('pre'): Since httpbin.org returns plain text/JSON, it gets rendered inside a <pre> (preformatted text) HTML tag. This line grabs that raw text.
        // expect(...).toContain(...): Finally, the test asserts that the text visible on the page contains "X-Custom-Header". If the interceptor worked perfectly, the server will have seen the header, printed it to the screen, and this test will pass. If the header was missing or not modified correctly, this assertion will fail, indicating that the request modification didn't work as intended.

        const content = await page.textContent('pre');
        expect(content).toContain('X-Custom-Header');

    });

    test('mock API response', async ({ page }) => {

        // Mock API endpoint

        // To make the mock actually trigger, the URL pattern in page.route needs to match the actual network request the website (https://jsonplaceholder.typicode.com/users) is making. So I changed this line of code to look for /users instead of /api/users, Playwright then was able to successfully catch the request and display my fake John Doe data 
        // instead of the real user data from the internet. '**/*'
        //  Instead of using route.continue() (which lets the request go to the real internet), this code uses route.fulfill(). This tells Playwright to act like the server and immediately pass back a fabricated response:

            // status: 200: Tells the browser the request was completely successful (HTTP 200 OK).
            // contentType: 'application/json': Tells the browser that the data coming back is formatted as JSON.
            // body: JSON.stringify(...): This is the fake data payload itself. It takes a JavaScript object containing an array with two "John Doe" user objects and converts it into a JSON string so the browser can read it.
        
            
            await page.route('**/users', route => {
            route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({ users: [{ id: 1, name: 'John Doe' },{ id: 1, name: 'John Bradley' }] }) });
        });

        // Navigate and verify mocked data is used

        // page.goto(...): The browser is directed to navigate to a public placeholder API website. When the page tries to load the /users endpoint, instead of going out to the real internet, it gets intercepted by our route and immediately receives the mocked JSON data we defined.
        await page.goto('https://jsonplaceholder.typicode.com/users');

        // Grab the raw text displayed on the JSONPlaceHolder website because it renders raw text inside html tag <pre> and put it inside the variable content
           const content = await page.textContent('pre');

        // Log the results directly to the terminal so you can visually confirm that the mocked data is what’s being displayed on the page. This is especially helpful for debugging or just to see the magic happen in real time.
            console.log('--- VISIBLE PAGE CONTENT ---');
            console.log(content);
            console.log('----------------------------');

            // Add an assertion so the test only passes if it's using my mock data
            expect(content).toContain('John Doe');
            expect(content).toContain('John Bradley');
    });

    test('simulate slowed network conditions', async ({ page, context}) => {

        // Simulate slow network: This test is used to simulate network latency (lag). It forces every single network request to wait for 2 seconds before loading, and then it measures the page load time to prove that the artificial delay actually happened.

        // context.route: Notice that this uses context.route instead of page.route. The context represents the entire browser session (which can contain multiple pages or tabs). By routing at the context level, this 2-second delay will apply to every single page or popup opened during this test, not just the initial one.
        //  '**/*': Just like before, this wildcard matches every single asset (HTML, CSS, JS, images) the browser tries to fetch.

        // new Promise(...) with setTimeout: This is standard JavaScript used to pause code execution. It forces Playwright to sit still and wait for exactly 2000 milliseconds (2 seconds). Only after that time has passed does it call route.continue() to let the request proceed to the internet.

        await context.route('**/*', async route => {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2s latency
            route.continue();
        });

        // Date.now(): This grabs the current timestamp in milliseconds. Think of this as clicking "Start" on a stopwatch right before hitting the website.
        // page.goto(...): The browser attempts to go to the practice website. Because of our interceptor above, it gets stuck waiting for 2 seconds before the website even begins to load.
        // loadTime: Once the page finishes loading, this subtracts the startTime from the new current time. This gives you the total number of milliseconds the navigation took.

        const startTime = Date.now();
        await page.goto('https://the-internet.herokuapp.com/');
        const loadTime = Date.now() - startTime;

        // You will see something like Page load time with delay: 2350 ms printed in your terminal. This proves that the artificial 2-second delay was successfully applied to every network request, causing the entire page load to take at least 2000 milliseconds.
        console.log('Page load time with delay:', loadTime, 'ms');

        // toBeGreaterThanOrEqual(2000): This is the validation step. Since we forced a mandatory 2-second delay, the page load time must be at least 2000 milliseconds (plus a few extra milliseconds for the actual real-world download time). If it took less than 2000ms, it means our delay tactic failed, and the test would fail.
        expect(loadTime).toBeGreaterThanOrEqual(2000);
    });

    test('mock failed API response', async ({ page }) => {

        // '/api/': This glob pattern is slightly different from the ones you've looked at before. It translates to: "Intercept any request that has /api/ anywhere inside its URL path." * It will match: https://mysite.com/api/users

        // Instead of letting the browser talk to the real backend, Playwright intercepts the call and immediately strikes back with a route.fulfill containing failure details: status: 500: This is the standard HTTP status code for a generic server-side crash. The browser will instantly treat this request as a failed network call.
        // body: JSON.stringify(...): This passes along a mock error payload. Many modern frontends look for these specific keys (error or message) inside a failed response so they can print the exact message out on the screen for the user.

        await page.route('**/api/**', async route => {

            route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Internal Server Error', message: 'Simulated API failure' }) });
        });
        
        await page.goto('https://reqres.in/api/users');

        const content = await page.textContent('pre');

        console.log('--- VISIBLE PAGE CONTENT ---');
            console.log(content);
            console.log('----------------------------');
            
        expect(content).toContain('Simulated API failure' );
    });
});







// ADDITIONAL NOTES

// test('intercept and log API calls) - additional information: 

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








// test - modify request headers - additional information:

// Here is exactly what that code is doing step-by-step:

// route.request().headers(): This grabs the existing "shipping form" that the browser made. It already has defaults on it, like:

// User-Agent: Chrome

// Accept-Language: en-US

// The Spread Operator (...): This acts like a photocopier. It takes all those existing fields from the original form and copies them onto a brand new blank form.

// The Custom Additions: Right below those photocopied defaults, you write your new lines: 'X-Custom-Header' and 'Authorization'.

// Why do we do this? If you didn't use the ... operator, you would be handing the browser a blank piece of paper with only your two custom headers on it. The browser would forget its user agent, language, and security settings, causing the website to likely crash or reject your request.



// await page.textContent('pre'): Playwright goes to the open browser window, looks specifically for that <pre> tag on the screen, and extracts the raw text inside it.

// The text it grabs will look something like this:

// JSON
// {
//   "headers": {
//     "Accept": "text/html",
//     "Authorization": "Bearer fake-token",
//     "User-Agent": "Mozilla/5.0...",
//     "X-Custom-Header": "Playwright-Test"
//   }
// }
// expect(content).toContain('X-Custom-Header'): This is the final inspection. Playwright searches through that big block of text above. It asks: "Does the text on the screen contain the phrase 'X-Custom-Header'?" * If yes: The test passes because it proves the server successfully received the header we injected.

// If no: The test fails, meaning our interceptor didn't inject the header correctly.

// You can pass any standard CSS selector—including raw HTML tag names like 'pre', 'div', 'p', 'h1', or 'button'—directly into page.textContent().
// When you pass a tag name, Playwright looks at the webpage, finds that HTML tag, and extracts the text inside it.


// What the different star patterns means when used within the code: 

// **/* - Matches Everything. Every domain, path, and asset.

// (Double Star): Matches any directory structure, subdomains, or path levels. It basically means "regardless of what the domain or folder path looks like."

// /* (Forward Slash + Single Star): Matches any file name or file extension at the end of the URL.

// matches '**/api/*' -	Any domain, but the path must have /api/ followed by exactly one layer.

// '**/*.png'- matches	Any domain, any path, but it must be a .png image file.

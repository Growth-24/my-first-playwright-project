import { test, expect } from '@playwright/test';

// BASE_URL: saving the website address into a constant variable. If I ever need to test 10 different things on this API, I can just use BASE_URL instead of typing out the huge link every time.

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

test.describe('JSON Placeholder API Tests', () => {

// { request }: This is the magic word. In all your previous tests, you used async ({ page }) to tell Playwright to open a browser tab. By using { request } instead, Playwright knows to skip the browser entirely. It just sends raw data over the internet, making this test run in milliseconds.
    test('GET - fetch all posts', async ({ request }) => {

        // request.get(): You are sending a "GET" request, which is API language for "Please give me this information." wrapping it inside the const variable named "response"
        // response.status() === 200: Whenever a server replies, it sends a 3-digit status code. 200 to indicate "Success." for this assertion
        const response = await request.get(`${BASE_URL}`);
        expect(response.status()).toBe(200);

        // When the server replies, it sends the data as a giant block of plain text. Calling .json() translates that text into a structured TypeScript Array/Object so your code can actually read it and interact with it.
        const posts = await response.json();

        // posts.toBeInstanceOf(Array): You are making sure the API didn't just hand you one single item or a weird text string. You expect a whole list (an Array).
        // posts.length > 0: You are verifying that the list actually has stuff inside it and isn't just an empty array[].
        expect(posts).toBeInstanceOf(Array);
        expect(posts.length).toBeGreaterThan(0);

        // posts[0]: Arrays are zero-indexed, meaning the computer starts counting at 0. This targets the very first item in the list of posts.

        // posts[0].toHaveProperty: You are checking the "shape" of that first item. You don't necessarily care what the title is right now, you just care that a "title" label actually exists.

        // posts[0] - this is the first item in the array and  we are checking to make sure it has the properties we expect. 
        expect(posts[0]).toHaveProperty('userId');
        expect(posts[0]).toHaveProperty('id');
        expect(posts[0]).toHaveProperty('title');
        expect(posts[0]).toHaveProperty('body');

    });

});
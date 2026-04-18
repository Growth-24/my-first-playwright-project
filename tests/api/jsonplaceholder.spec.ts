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

        // posts variable: When the server replies, it sends the data as a giant block of plain text. Calling .json() on the const response variable and it translates that text into a structured TypeScript Array/Object so your code can actually read it and interact with it.
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

        console.log('--- SERVER RESPONSE ---');
        console.log(posts);

    });

    test('GET - fetch single post', async ({ request }) => {

        const response = await request.get(`${BASE_URL}/1`);
        expect(response.status()).toBe(200);

        // post const variable:  When the server replies, it sends the data as a giant block of plain text. Calling .json() on the response const variable, it translates that text into a structured TypeScript Array/Object so your code can actually read it and interact with it.

        const post = await response.json();
        expect(post.id).toBe(1);
        expect(post.userId).toBe(1);
        expect(post.title).toBeTruthy();
        expect(post.body).toBeTruthy();

        console.log('--- SERVER RESPONSE ---');
        console.log(post);
    });

    test('POST - create new post', async ({ request }) => {
       
        // newPost: This is the data you want to send to the server. You are creating a new post with a title, body, and userId. The server will take this data and create a new post for you.

        const newPost = {
            title: 'Test Post',
            body: 'This is a test post created by Playwright.',
            userId: 1
        };

        // request.post: You are changing the action from GET to POST within the response variable which will be used in other steps.
        // data: newPost - This is how you attach the newPost variable with the data created above to your request. You are telling the server, Here is the information for the new post I want you to create.

        const response = await request.post(`${BASE_URL}`, {
            data: newPost
        });

        // we are expecting the response status to be 201 because this means my test post was successfully created. 201 is the API status code for "Created."
        expect(response.status()).toBe(201);


        //createdPost const variable: Just like before, the server sends back a receipt in plain text, and we use .json() on the response variable to translate it into a readable object. Then the assertions check that the title, body, and userId in the response match what was sent, and that the server assigned a new id to your post.
        
        //(createdPost.id).toBeTruthy(): I didn't send an id in my original test post "(newPost)" because it's the server's job to generate that number. Because you don't know exactly what number the server will pick (it could be 101, it could be 5042), you use .toBeTruthy(). This just means: "I don't care what the number is, I just expect an ID to exist."
        
        const createdPost = await response.json();
        expect(createdPost.title).toBe(newPost.title);
        expect(createdPost.body).toBe(newPost.body);
        expect(createdPost.userId).toBe(newPost.userId);
        expect(createdPost.id).toBeTruthy();

        console.log('--- SERVER RESPONSE ---');
        console.log(createdPost);

    });
    
    
    
    test('PUT - update existing post', async ({ request }) => {

        const updatedPost = {
            id: 1,
            title: 'Updated Test Post',
            body: 'This is an updated test post created by Playwright.',
            userId: 1
        };

        const response = await request.put(`${BASE_URL}/1`, {

            data: updatedPost

        });


        expect(response.status()).toBe(200);

        const post = await response.json();
        expect(post.title).toBe(updatedPost.title);
        expect(post.body).toBe(updatedPost.body);

        console.log('--- SERVER RESPONSE ---');
        console.log(post);

    });


    
    test('DELETE - remove a post', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}/1`);
        expect(response.status()).toBe(200);
    
    });


    test('GET - fetch posts for specific user', async ({ request }) => {

        const response = await request.get(`${BASE_URL}?userId=1`);
        expect(response.status()).toBe(200);

        const posts = await response.json();
        expect(posts).toBeInstanceOf(Array);

        // Verify all posts belong to userId: 1

        for(const post of posts) {
            expect(post.userId).toBe(1);
        }

        console.log('--- SERVER RESPONSE ---');
        console.log(posts);
    });
});
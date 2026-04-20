import {test, expect} from '@playwright/test';
import { request } from 'node:http';

const BASE_URL = 'https://fakestoreapi.com';

test.describe('FakeStore API Tests',() => {

    test('GET - view all products', async ({request}) => {

        const response = await request.get(`${BASE_URL}/products`);
        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(products).toBeInstanceOf(Array);
        expect(products.length).toBeGreaterThan(0);

        console.log('--- SERVER RESPONSE ---');
        console.log(products);
    });

    test('GET - view single product', async ({request}) => { 

        const response = await request.get(`${BASE_URL}/products/1`);
        expect(response.status()).toBe(200);

        const product = await response.json();
        expect(product.id).toBe(1);
        expect(product.title).toBeTruthy();
        expect(product.price).toBeGreaterThan(0);
        expect(product.category).toBeTruthy();

        console.log('--- SERVER RESPONSE ---');
        console.log(product);
    });


    test('GET - view all categories', async ({request}) => { 

        const response = await request.get(`${BASE_URL}/products/categories`);
        expect(response.status()).toBe(200);

        const categories = await response.json();
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toEqual(expect.arrayContaining(['electronics', 'jewelery', "men's clothing", "women's clothing"]));

        console.log('--- SERVER RESPONSE ---');
        console.log(categories);
    });


    test('GET - view products in electronics category', async ({request}) => {

        const response = await request.get(`${BASE_URL}/products/category/electronics`);
        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(products).toBeInstanceOf(Array);

        // Verify all products are electronics using a for loop

        for(const product of products) {
            expect(product.category).toBe('electronics');
        }

        console.log('--- SERVER RESPONSE ---');
        console.log(products);
    });


    test('POST - add new product', async ({request}) => {

        const newProduct = {

            title: 'Test Product',
            price: 13.5,
            description: 'This is a test product created by Playwright.',
            image: 'https://i.pravatar.cc',
            category: 'electronics'
        };

        const response = await request.post(`${BASE_URL}/products`, {
            data: newProduct
        });

        // Note: fakestoreapi returns 201 for the successful creation and addition of the new product 
        expect(response.status()).toBe(201);

        const product = await response.json();
        expect(product.id).toBeTruthy();
        expect(product).toEqual(expect.objectContaining({title: 'Test Product', price: 13.5, description: 'This is a test product created by Playwright.', image: 'https://i.pravatar.cc', category: 'electronics'}));

        console.log('--- SERVER RESPONSE ---');
        console.log(product);
    });


    test('GET - view user cart', async ({request}) => {

        const response = await request.get(`${BASE_URL}/carts/1`);
        expect(response.status()).toBe(200);

        const cart = await response.json();
        expect(cart.id).toBe(1);
        expect(cart.userId).toBeTruthy();
        expect(cart.products).toBeInstanceOf(Array);

        console.log('--- SERVER RESPONSE ---');
        console.log(cart);

    });


// Used this test to find a users username and password for the login test below: POST - user login. 
    test('GET - find all users', async ({ request }) => {
        
        const response = await request.get(`${BASE_URL}/users`);
    
        expect(response.status()).toBe(200);
    
        // Translate the text response into a readable json object list
        const users = await response.json();
    
        console.log('--- USER DATABASE ---');
        console.log(users); 
    });


    test('POST - user login', async ({request}) => {

        const credentials = { username:'johnd', password:'m38rmF$' };

        const response = await request.post(`${BASE_URL}/auth/login`, {
            data: credentials
        });

        // This confirms that the login credentials were accepted and you can use them on this API site
        expect(response.status()).toBe(201);

        // For this assertion the API returns a token if the login is successful, so we check for that in the response by adding ".token" to the result variable and used toBeTruthy() just to assure we are getting back a login token in the response which confirms the login was successful.
        const result = await response.json();
        expect(result.token).toBeTruthy();

        console.log('--- SERVER RESPONSE ---');
        console.log(result);

    
    });


   


    
});
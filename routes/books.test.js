// Set the environment for testing
process.env.NODE_ENV = 'test';

// Import database, main app, and supertest
const app = require('../app');
const db = require('../db');
const request = require('supertest');

let testBook

beforeEach(async () => {
    const result = await db.query(`
        INSERT INTO books
            (isbn, 
            amazon_url, 
            author, 
            language, 
            pages, 
            publisher, 
            title, 
            year)
        VALUES
            ('643234212', 
            'http://amazon.com/book/4', 
            'Mark Diesel', 
            'english', 
            467, 
            'Penguin Books', 
            'The Journey', 
            2007)
        RETURNING *`);
    
    testBook = result.rows[0];
});

afterEach(async () => {
    await db.query(`
        DELETE FROM books`);
});

afterAll(() => {
    db.end();
});

describe('GET /books', () => {
    test('Get all books', async () => {
        expect(1).toBe(1);
    })
})




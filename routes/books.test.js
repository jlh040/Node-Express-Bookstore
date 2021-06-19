// Set the environment for testing
process.env.NODE_ENV = 'test';

// Import database, main app, and supertest
const app = require('../app');
const db = require('../db');
const request = require('supertest');

// Maka a variable to hold the test book
let testBook;

// Insert a test book into the db and assign it to the variable
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

// Delete all books after each test
afterEach(async () => {
    await db.query(`
        DELETE FROM books`);
});

// Close the database connection
afterAll(() => {
    db.end();
});

describe('GET /books', () => {
    test('Get all books', async () => {
        const resp = await request(app).get('/books');
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({
            books: [
                {
                    isbn: '643234212',
                    amazon_url: 'http://amazon.com/book/4',
                    author: 'Mark Diesel',
                    language: 'english',
                    pages: 467,
                    publisher: 'Penguin Books',
                    title: 'The Journey',
                    year: 2007
                }
            ] 
        })
    })
});

describe('GET /:id', () => {
    test('Get a single book', async () => {
        const resp = await request(app).get(`/books/${testBook.isbn}`)
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            book: {
                isbn: '643234212',
                amazon_url: 'http://amazon.com/book/4',
                author: 'Mark Diesel',
                language: 'english',
                pages: 467,
                publisher: 'Penguin Books',
                title: 'The Journey',
                year: 2007
            } 
        }) 
    });
});




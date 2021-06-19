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

describe('GET /books/:id', () => {
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

    test('404 if book not found', async () => {
        const resp = await request(app).get('/books/999999999');
        expect(resp.status).toBe(404);
    })
});

describe('POST /books', () => {
    test('Create a book', async () => {
        const book = {
            isbn: '7989799798',
            amazon_url: 'http://amazon.com/book/4',
            author: 'Mark Diesel',
            language: 'english',
            pages: 467,
            publisher: 'Penguin Books',
            title: 'The Journey',
            year: 2007
        }

        const resp = await request(app)
            .post('/books')
            .send(book);
        
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({book})
    });

    test('Do incomplete requests get rejected?', async () => {
        const book = {
            isbn: '7989799798',
            amazon_url: 'http://amazon.com/book/4',
            language: 'english',
            pages: 467,
            publisher: 'Penguin Books',
            title: 'The Journey'
        }

        const resp = await request(app)
            .post('/books')
            .send(book);

        expect(resp.statusCode).toBe(400);
    });

    test('If we pass in the wrong types, will the request be rejected?', async () => {
        const book = {
            isbn: false,
            amazon_url: 'http://amazon.com/book/4',
            author: 500,
            language: 'english',
            pages: 467,
            publisher: 'Penguin Books',
            title: 'The Journey',
            year: true,

        }

        const resp = await request(app)
            .post('/books')
            .send(book);

        expect(resp.statusCode).toBe(400);
    });
});

describe('PUT /books/:id', () => {
    test('Update a book', async () => {
        testBook.title = 'The Great Escape'

        const resp = await request(app)
            .put(`/books/${testBook.isbn}`)
            .send(testBook)
        
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            book: {
                isbn: '643234212',
                amazon_url: 'http://amazon.com/book/4',
                author: 'Mark Diesel',
                language: 'english',
                pages: 467,
                publisher: 'Penguin Books',
                title: 'The Great Escape',
                year: 2007
            }
        });
    });

    test('Respond with 400 if invalid data is sent', async () => {
        testBook.year = true;
        testBook.pages = "definitely";

        const resp = await request(app)
            .put(`/books/${testBook.isbn}`)
            .send(testBook);
        
        expect(resp.statusCode).toBe(400);
    });

    test('Respond with 400 if data is missing', async () => {
        delete testBook.title;
        delete testBook.publisher;

        const resp = await request(app)
            .put(`/books/${testBook.isbn}`)
            .send(testBook);
        
        expect(resp.statusCode).toBe(400);
    });

    test('404 if book is not found', async () => {
        const resp = await request(app)
            .put(`/books/3429999991111112222`)
            .send(testBook);
        
        expect(resp.status).toBe(404);
    })
});

describe('DELETE /books/:id', () => {
    test('Delete a book', async () => {
        const resp = await request(app).delete(`/books/${testBook.isbn}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: 'Book deleted'
        });
    });

    test('Respond with 404 if book cannot be found', async () => {
        const resp = await request(app).delete('/books/0101010101010101010');
        expect(resp.statusCode).toBe(404);
    })
})



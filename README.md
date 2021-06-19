### Node-Express-Bookstore

#### Functionality

- This application is a JSON API that exhibits features of an online bookstore. A user is able to perform all of the typical CRUD operations with the **books** resource; that is, <u>creating</u>, <u>listing</u>, <u>updating</u>, and <u>deleting</u> books.

- Note that I used [JSON Schema](https://json-schema.org/) to validate incoming JSON.

- #### Routes (the POST and PATCH routes require JSON):

  - **GET /books**

    - Allows a user to see all books in their database.

  - **GET /books/<isbn>**

    - Allows a user to see more information regarding a single book.

  - **POST /books**

    - Allows a user to create a book (into the database)

    - Requires **isbn, amazon_url, author, language, pages, publisher, title, and year**:

    - Example format: 

      ```javascript
      {
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
      }
      ```

  - **PATCH /books/<isbn>**

    - Allows a user to update a book.
    - Requires **amazon_url, author, language, pages, publisher, title, and year**.
    - See the POST route for an example .

  - **DELETE /books/<isbn>**

    - Allows a user to delete a book.

  

#### Technicalities

- To get this code onto your machine, run `git clone https://github.com/jlh040/Node-Express-Bookstore.git`
- Then, install [Node](https://nodejs.org/en/), and run `npm install` to download all of the dependencies.
- Next, download [PostgreSQL](https://www.postgresql.org/) and run `createdb books` in your terminal to create the database.
- After that, run `psql < data.sql` to create the tables.
- Lastly, run `node server.js` to start the server up on port 3000.






import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';


import { startMongoDB, stopMongoDB } from '../src/backend/utils';
import book from '../src/backend/bookRouter';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/api/book', book);

describe('test api index', () => {
  beforeEach(async () => {
    await startMongoDB();
  });

  afterEach(async () => {
    await stopMongoDB();
  });

  test(`test api create book`, async () => {
    let newBook = await request(app)
        .post('/api/book/create-book')
        .send({
          title: 'De Men Phieu Luu Ky',
          author: 'To Hoai'
        })
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    expect(newBook).not.toBeNull();
  });

  test(`test api get list book`, async () => {
    let newBook = await request(app)
        .post('/api/book/create-book')
        .send({
          title: 'De Men Phieu Luu Ky',
          author: 'To Hoai'
        })
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    expect(newBook).not.toBeNull();

    let listNewBook = await request(app)
        .get('/api/book/get-list-book')
        .send()
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    console.log('hello', listNewBook);
    expect(listNewBook).not.toBeNull();
  });

  test(`test api get book by title`, async () => {
    let newBook = await request(app)
        .post('/api/book/create-book')
        .send({
          title: 'De Men Phieu Luu Ky',
          author: 'To Hoai'
        })
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    expect(newBook).not.toBeNull();

    let getBookByTitle = await request(app)
        .get(`/api/book/get-book-by-title`)
        .send({
          title: 'De Men Phieu Luu Ky'
        })
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    console.log('hello', getBookByTitle);
    expect(getBookByTitle).not.toBeNull();
  });

  test(`test api update book`, async () => {
    let newBook = await request(app)
        .post('/api/book/create-book')
        .send({
          title: 'De Men Phieu Luu Ky',
          author: 'To Hoai'
        })
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    expect(newBook).not.toBeNull();

    let getBookBeforeUpdate = await request(app)
        .get('/api/book/get-list-book')
        .send()
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    expect(getBookBeforeUpdate).not.toBeNull();

    await request(app)
        .put('/api/book/update-book')
        .send({
            book_id: newBook._id,
            author: 'Bao Long'
        });
    
    let getBookAfterUpdate = await request(app)
        .get('/api/book/get-list-book')
        .send()
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    expect(getBookAfterUpdate).not.toBeNull();
  });

  test(`test api delete book`, async () => {
    let newBook = await request(app)
        .post('/api/book/create-book')
        .send({
          title: 'De Men Phieu Luu Ky',
          author: 'To Hoai'
        })
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    expect(newBook).not.toBeNull();

    let getBookBeforeDelete = await request(app)
        .get('/api/book/get-list-book')
        .send()
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    console.log('getBookBeforeDelete', getBookBeforeDelete);
    expect(getBookBeforeDelete).not.toBeNull();

    await request(app)
        .delete('/api/book/delete-book')
        .send({
            book_id: newBook._id
        });
    
    let getBookAfterDelete = await request(app)
        .get('/api/book/get-list-book')
        .send()
        .then(res => (res.status === 200 ? res.body : null))
        .catch(err => {
            throw err;
        });
    console.log('getBookAfterDelete', getBookAfterDelete);
    expect(getBookAfterDelete).not.toBeNull();
  });
});
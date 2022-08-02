import express from 'express';
import BookModel from '../backend/bookModel';

const book = express.Router();

book.post('/create-book', (request, response) => {
    const newBook1 = new BookModel();
    newBook1.title = request.body.title;
    newBook1.author = request.body.author;
    newBook1.save(err => {
      if (err) {
        response.json({
          result: 'failed!',
          data: {},
          messege: `Error is : ${err}`,
        });
      } else {
        response.json({
            _id: newBook1._id,
            title: newBook1.title,
            author: newBook1.author,
        });
      }
    });
  });

  book.get('/get-list-book', (request, response) => {
    BookModel.find().exec((err, books) => {
      if (err) {
        response.json({
          result: 'failed!',
          data: [],
          messege: `Error is: ${err}`,
        });
      } else {
        response.json({
          result: 'ok!',
          data: books,
          messege: 'Query all book successfully!',
        });
      }
    });
  });

  book.get('/get-book-by-title', (request, response) => {
    BookModel.findOne({title: request.body.title}, (err, books) => {
      if (err) {
        response.json({
          result: 'failed!',
          data: [],
          messege: `Error is: ${err}`,
        });
      } else {
        response.json({
          result: 'ok!',
          data: books,
          messege: 'Query by title of book successfully!',
        });
      }
    });
  });

  book.put('/update-book', (request, response) => {
    BookModel.findByIdAndUpdate({ _id: request.body.book_id }, { author: request.body.author }, (err, books) => {
      if (err) {
        response.json({
          result: 'failed!',
          data: [],
          messege: `Error is: ${err}`,
        });
      } else {
        response.json({
          result: 'ok!',
          data: books,
          messege: 'Update book successfully!',
        });
      }
    });
  });

  book.delete('/delete-book', (request, response) => {
    BookModel.findByIdAndDelete({ _id: request.body.book_id }, err => {
      if (err) {
        response.json({
          result: 'failed!',
          data: [],
          messege: `Error is: ${err}`,
        });
      } else {
        response.json({
          result: 'ok!',
          messege: 'Delete book successfully!',
        });
      }
    });
  });

export default book;
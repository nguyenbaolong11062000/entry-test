import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    title: mongoose.Schema.Types.String,
    author: mongoose.Schema.Types.String,
});

const BookModel = mongoose.model('book', BookSchema, 'book');

const createCaller = BookModel.create;

BookModel.create = (obj, options) => createCaller.call(BookModel, [obj], options).then(rs => rs[0]);

export default BookModel;
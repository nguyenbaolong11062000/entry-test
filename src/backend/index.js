import express, { request, response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import logger, { token } from 'morgan';
import expressValidator from 'express-validator';

import { useCallback } from 'react';
import pkg from '../../package.json';

const jsonwebtoken = require('jsonwebtoken');

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const session = require('express-session');

import mongoose from 'mongoose';
mongoose.connect('mongodb://aketoan-entry-test_db_1').then(
  () => {
    console.log('Connect DB Successfully!');
  },
  err => {
    console.log(`Connect Failed: ${err}`);
  },
);

const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: 'Title is not allow null!',
    minlength: 3,
    maxlength: 100,
  },
  author: {
    type: String,
    required: 'Author is not allow null!',
    minlength: 3,
    maxlength: 100,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
const BookModel = mongoose.model('Book', BookSchema); // Tao ra mo hinh(model) BookModel tu Schema BookSchema

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: 'Email is not allow null!',
    minlength: 3,
    maxlength: 100,
  },
  password: {
    type: String,
    required: 'Name is not allow null!',
    minlength: 3,
    maxlength: 100,
  },
  book: [
    {
      type: String,
      ref: 'Book',
    },
  ],
});
const User = mongoose.model('User', UserSchema);

const startServer = async () => {
  const app = express();

  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line global-require
    const webpack = require('webpack');

    // eslint-disable-next-line global-require
    const webpackDevMiddleware = require('webpack-dev-middleware');
    // eslint-disable-next-line global-require
    const webpackHotMiddleware = require('webpack-hot-middleware');

    // eslint-disable-next-line global-require
    const webpackConfig = require('../../webpack.config');

    const compiler = webpack(webpackConfig[1]);
    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: '/',
      }),
    );
    app.use(webpackHotMiddleware(compiler));
  }

  app.use(compression());
  app.use(logger(process.env.NODE_ENV === 'production' ? 'production' : 'dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressValidator());
  app.use(cookieParser());
  app.use(express.static('public'));
  // app.get('*', async (req, res) => {
  //   res.status(200).end(`
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <meta charset="utf-8" />
  //         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  //         <meta
  //           name="viewport"
  //           content="width=device-width,initial-scale=1,shrink-to-fit=no"
  //         />
  //         <meta
  //           name="description"
  //           content="AKeToan"
  //         />
  //         <meta name="author" content="AKeToan Entry Test Project" />
  //         <meta name="msapplication-TileColor" content="#0dffff" />
  //         <meta name="theme-color" content="#ffffff" />
  //         <title>AKeToan Entry Project</title>
  //         <link rel="manifest" href="public/manifest.json" />
  //         <link rel="mask-icon" href="public/safari-pinned-tab.svg" />
  //         <link rel="shortcut icon" href="public/favicon.ico" />
  //         <link rel="apple-touch-icon" sizes="180x180" href="public/apple-touch-icon.png" />
  //         <link rel="icon" type="image/png" sizes="32x32" href="public/favicon-32x32.png" />
  //         <link rel="icon" type="image/png" sizes="16x16" href="public/favicon-16x16.png" />
  //         <script type="text/javascript">
  //           window.REACT_APP_API_URL = 'https://localhost:3000';
  //         </script>
  //       </head>
  //       <body>
  //         <div id="app"></div>
  //         <script type="text/javascript" src="/app.js?v=${pkg.version}"></script>
  //       </body>
  //     </html>
  //   `);
  // });

  // Implement authentication machanism base on JWT use google oauth
  app.use(session({ secret: 'cats' }));
  app.use(passport.initialize()); // kiểm tra session lấy ra passport.user nếu chưa có thì tạo rỗng
  app.use(passport.session()); // sử dụng session lấy thông tin user rồi gắn vào request.user

  passport.use(
    new GoogleStrategy(
      {
        clientID: '1072234815059-p6r5edbkehu8benvjlg9etm9fch47but.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3000/google/callback',
        passReqToCallback: true,
      },
      function(request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
      },
    ),
  );

  passport.serializeUser(function(user, done) {
    done(null, user);
  }); // hàm được gọi khi xác thực thành công để lưu thông tin user vào session

  passport.deserializeUser(function(user, done) {
    done(null, user);
  }); // lấy dữ liệu user dựa vào thông tin lưu trên session và gắn vào request.user

  app.get('/', (request, response) => {
    response.send('<a href="/auth/google"><h1>Sign in with Google</h1></a>');
  });

  app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
  app.get(
    '/google/callback',
    passport.authenticate('google', {
      successRedirect: '/protected',
      failureRedirect: '/auth/failure',
    }),
  );

  function isLoggedIn(request, response, next) {
    request.user ? next() : response.sendStatus(401);
  }

  app.get('/protected', isLoggedIn, (request, response) => {
    jsonwebtoken.sign({ data: request.user }, 'asdfwqexcvdfsfs', (err, token) => {
      if (err) {
        response.send('Access denied');
      } else {
        response.send(`<h1>Hello ${request.user.displayName}</h1> <br> <b>Your Token: ${token}</b> 
                      <br> <a href="/all-book"><h1><b>View All Book</b></h1></a>`);
      }
    });
  });

  app.get('/auth/failure', (request, response) => {
    response.send('Something went wrong');
  });

  // Implement api POST/GET/PUT/DELETE to CRUD doto, using mongodb, mongoosejs as mongo driver
  function auth(request, response, next) {
    const auth = request.headers.authorization;
    if (!auth) {
      return response.status(401).send('Access Denied');
    }
    try {
      const token = auth.match(/Bearer\s(.+)/);
      jsonwebtoken.verify(token[1], 'asdfwqexcvdfsfs', async function(err, decoded) {
        request.user = await User.findOne({ email: decoded.data.email });
        if (!request.user) {
          response.status(401).send('Access Denied');
        } else {
          console.log(decoded);
          next();
        }
      });
    } catch (err) {
      response.status(400).send('Invalid Token');
    }
  }

  app.post('/book', auth, (request, response) => {
    const newBook1 = new BookModel();
    newBook1.title = request.body.title;
    newBook1.author = request.body.author;
    newBook1.user_id = request.user;
    newBook1.save(err => {
      if (err) {
        response.json({
          result: 'failed!',
          data: {},
          messege: `Error is : ${err}`,
        });
      } else {
        response.json({
          result: 'ok!',
          data: {
            title: request.body.title,
            author: request.body.author,
            user: request.user._id,
          },
          messege: 'Insert book succesfully!',
        });
      }
    });
    const user = request.user;
    user.book.push(newBook1.title);
    user.save();
  });

  app.get('/all-book', isLoggedIn, (request, response) => {
    BookModel.find().exec((err, books) => {
      if (err) {
        response.json({
          result: 'failed!',
          data: [],
          messege: `Error is: ${err}`,
        });
      } else {
        response.json({
          Person: `${request.user.displayName} is watching`,
          result: 'ok!',
          data: books,
          count: books.length,
          messege: 'Query all book successfully!',
        });
      }
    });
  });

  app.post('/registerUser', (request, response) => {
    const newUser = new User();
    newUser.email = request.body.email;
    newUser.password = request.body.password;
    newUser.save(err => {
      if (err) {
        response.json({
          result: 'failed!',
          data: {},
          messege: `Error is : ${err}`,
        });
      } else {
        response.json({
          result: 'ok!',
          data: {
            email: request.body.email,
            password: request.body.password,
          },
          messege: 'Insert user succesfully!',
        });
      }
    });
  });

  app.post('/loginUser', async (request, response) => {
    try {
      const user1 = await User.findOne({ email: request.body.email, password: request.body.password });
      if (!user1) {
        response.json("Email or password aren't correct");
      } else {
        jsonwebtoken.sign({ data: { email: request.body.email, password: request.body.password } }, 'asdfwqexcvdfsfs', (err, token) => {
          if (err) {
            response.json({ Error: 'Access denied' });
          } else {
            response.json({ messege: 'Login Successful', token });
          }
        });
      }
    } catch (err) {
      response.status(500).json(err);
    }
  });

  app.get('/get-book-by-id', (request, response) => {
    BookModel.findById(request.query.book_id, (err, books) => {
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
          messege: 'Query by id of book successfully!',
        });
      }
    });
  });

  app.put('/update-book', (request, response) => {
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

  app.delete('/delete-book', (request, response) => {
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

  // Port
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.json(err);
  });

  app.listen(process.env.PORT || 3000, () => {
    console.info(`App is running at http://localhost:${process.env.PORT || 3000}`);
  });
  module.exports = app;
};
startServer();
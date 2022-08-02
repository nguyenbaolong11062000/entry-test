/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

ReactDOM.render(
  <h1>Hello world</h1>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}

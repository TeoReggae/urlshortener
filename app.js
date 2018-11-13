
var urlshortController = require('./controllers/urlshortController')
const express = require('express')
const mongoose = require('mongoose')
var cors = require('cors')

var app = express();

// Set up template engine
app.set('view engine', 'ejs');
app.use('/public', express.static(process.cwd() + '/public'));
// Fire controllers
urlshortController(app);

app.listen(3000);

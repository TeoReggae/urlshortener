'use strict'

var urlshortController = require('./controllers/urlshortController')
const express = require('express')
const mongoose = require('mongoose')
var cors = require('cors')

var app = express();

// Set up template engine
app.set('view engine', 'ejs');

// Fire controllers
urlshortController(app);

app.listen(3000);

var mongoose = require('mongoose');

var urlshortSchema = new mongoose.Schema({
    url:String,
    urlShortened:String
});

module.exports = mongoose.model('shortUrl', urlshortSchema);

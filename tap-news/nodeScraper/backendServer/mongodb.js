var mongoose = require('mongoose');
mongoose.connect('mongodb://mengchie:mengchie@ds139619.mlab.com:39619/news');

var newsSchema = mongoose.Schema({
	author: String,
	title: String,
	description: String,
	url: String,
	urlToImage: String,
	publishedAt: String,
	source: String,
	digest: String
});

var newsModel = mongoose.model('newsModel', newsSchema);

module.exports = newsModel;
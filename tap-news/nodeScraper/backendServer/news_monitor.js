const express = require('express');
const app = express();
var server = require('http').createServer(app);
var redis_client = require('./redis');
var request = require('request');
var crypto = require('crypto');
var newsModel = require('./mongodb');
var news = [];

server.listen(8181);
console.log('Example app listening on port 8181!');
getNews();
setInterval(getNews, 1000*60);
// rabbit.deletAll('newsMQ');


// getNews();

function getNews() {
	var sources = [
	'cnn',
	'hacker-news', 
	'bbc-news',
	'bbc-sport',
	'bloomberg',
	'entertainment-weekly',
	'espn',
	'ign',
	'techcrunch',
	'the-new-york-times',
	'the-wall-street-journal',
	'the-washington-post'
	];
	var i = 0;
	sources.map(function(source){
	  request({
	    url: "https://newsapi.org/v1/articles?source=" + source + "&apiKey=66aa450f60884888b73323855ca3c95d",
	    method: "GET"
	  }, function(e,r,b) {
	    if(!e) {
	      // console.log(JSON.parse(b)); 
	      let data = JSON.parse(b);
	      let articles = data.articles;

	      
	      articles.map(function(article){
		  	let digest = crypto.createHash('md5').update(article['title']).digest("hex");
	        redis_client.get(digest, function(data) {
	        	if(data) {
	        		console.log('this news already exist in the redis ...')
	        	} else {
	        		article['source'] = source;
	        		article['digest'] = digest;
	        		if(article['publishedAt'] == null) {
	        			let date = new Date().toISOString();
	        			date.replace(/\..+/, 'Z');
	        			article['publishedAt'] = date;
	        		}
	        		if(article['urlToImage'] !== null) {
	        			redis_client.set(digest, JSON.stringify(article), function(data) {
		        			console.log('Successfully, store news in redis ...');
		        			console.log(data);
		        			newsModel.count({}, function(err, num) {
			              		var mongoNews = new newsModel(article);
			              		mongoNews.save();
			              		console.log('news save in Mongodb ...');
			              		console.log(article);
			          		});
		        		});
		        		redis_client.expire(digest, 3600*24);
	        		}
	        		
	        	}
	        });
	      });

	      // var msg = JSON.stringify(article);
	      // rabbit.send('newsMQ', articles);
	      // news = news.concat(articles);
	      console.log('articles send ' + i);
	      i++;
	    } 
	    
	  });

	});
  
}
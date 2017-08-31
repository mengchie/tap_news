const express = require('express');
const app = express();
var path = require('path'),
	server = require('http').createServer(app);


var request = require('request');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;



server.listen(8081);
console.log('Example app listening on port 8081!');

var newsUrl = [];
var i = 0;
// setInterval(getNews, 1000*10);

getNews();

// if(newsUrl.length !== 0) {
// 	scrapNews(newsUrl[0]);
// }

function getNews() {
	let news = [];
	request({
	  url: "https://newsapi.org/v1/articles?source=cnn&apiKey=66aa450f60884888b73323855ca3c95d",
	  method: "GET"
	}, function(e,r,b) {
	  if(!e && JSON.parse(b).status === 'ok') {
	  	console.log(JSON.parse(b));	
	  	let data = JSON.parse(b);
	  	let articles = data.articles;
	  	articles.map(function(article) {
	  		article['source'] = 'cnn';
			newsUrl.push(article.url);
			
	  	});
	  	console.log(data);
	  	Array.prototype.push.apply(news, articles);
	  	scrapNews(newsUrl[0]);
	  	return news;
	  } 
	});
}

function scrapNews(url) {
	request({
	  url: url,
	  method: "GET"
	}, function(e,r,b) {
	  if(!e) {
	  	// console.log(b);
	  	var xml = b;
	  	var doc = new dom().parseFromString(xml);
	  	var textData = xpath.select("//p[@class='zn-body__paragraph speakable']//text() | //div[@class='zn-body__paragraph speakable']//text() | //div[@class='zn-body__paragraph']//text() ", doc);
	  	let article = '';
	  	textData.map(function(data){
	  		// console.log(data['data']);
	  		article += data['data'];
	  	});
	  	console.log(article);
	  } 
	});
}

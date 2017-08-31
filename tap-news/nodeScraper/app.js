const express = require('express');
const app = express();
var path = require('path'),
	server = require('http').createServer(app);
var index = require('./routes/index');
var cors = require('cors');
var news = require('./routes/news');


var request = require('request');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;


// view engine setup
// app.set('view engine', 'jade');
// app.set('views', path.join(__dirname, '../reactClient/reactClient/build/'));

app.use('/static', express.static(path.join(__dirname, '../reactClient/react-client/build/static/')));
// app.use(function(req, res) {
//     res.sendFile('index.html', { root: path.join(__dirname, '../reactClient/reactClient/build') });
// });

// app.use(cors());
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use('/', index);
app.use('/news', news);


app.use(function(req, res) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send('404 Not Found');
});



server.listen(8080);
console.log('Example app listening on port 8080!');

var newsUrl = [];
var i = 0;
// setInterval(getNews, 1000*10);

// getNews();

// if(newsUrl.length !== 0) {
// 	scrapNews(newsUrl[0]);
// }

// function getNews() {
// 	request({
// 	  url: "https://newsapi.org/v1/articles?source=cnn&apiKey=66aa450f60884888b73323855ca3c95d",
// 	  method: "GET"
// 	}, function(e,r,b) {
// 	  if(!e) {
// 	  	console.log(JSON.parse(b));	
// 	  	let data = JSON.parse(b);
// 	  	let articles = data.articles;
// 	  	articles.map(function(article) {
// 			newsUrl.push(article.url);
			
// 	  	});
// 	  	scrapNews(newsUrl[0]);
// 	  } 
// 	});
// }

// function scrapNews(url) {
// 	request({
// 	  url: url,
// 	  method: "GET"
// 	}, function(e,r,b) {
// 	  if(!e) {
// 	  	// console.log(b);
// 	  	var xml = b;
// 	  	var doc = new dom().parseFromString(xml);
// 	  	var textData = xpath.select("//p[@class='zn-body__paragraph speakable']//text() | //div[@class='zn-body__paragraph speakable']//text() | //div[@class='zn-body__paragraph']//text() ", doc);
// 	  	let article = '';
// 	  	textData.map(function(data){
// 	  		// console.log(data['data']);
// 	  		article += data['data'];
// 	  	});
// 	  	console.log(article);
// 	  } 
// 	});
// }

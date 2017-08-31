var rpc = require('node-json-rpc');
var newsModel = require('./mongodb');
 
var options = {
  // int port of rpc server, default 5080 for http or 5433 for https 
  port: 5080,
  // string domain name or ip of rpc server, default '127.0.0.1' 
  host: '127.0.0.1',
  // string with default path, default '/' 
  path: '/',
  // boolean false to turn rpc checks off, default true 
  strict: true
};
 
// Create a server object with options 
var serv = new rpc.Server(options);
 
// Add your methods 
serv.addMethod('myMethod', function (para, callback) { //       ask MONGODB for news and provide news for rpc_client and rpc_client send back to new.js
  var error, result;                                   //                       
  
  // Add 2 or more parameters together 
  // if (para.length === 2) {
  //   result = para[0] + para[1];
  // } else if (para.length > 2) {
  //   result = 0;
  //   para.forEach(function (v, i) {
  //     result += v;
  //   });
  // } else {
  //   error = { code: -32602, message: "Invalid params" };
  // }
  // console.log(result);


  // mongodb ...
  newsModel.find().limit(para[0]*90 + 90).sort({publishedAt: -1}).skip(para[0]*90).exec(function(err, data) {
    if(err){
      error = err;
      throw err;  
    } 
    result = data;
    console.log(data);
    callback(error, result);  
  });
  // newsModel.findOne({title: news.title}, function(err, data) {
  //     if (data) {
  //         console.log('EORROR: News already exists');
  //     } else {
  //         // save to DB
  //         newsModel.count({}, function(err, num) {
  //             var mongoNews = new newsModel(news);
  //             mongoNews.save();
  //             console.log(news);
  //         });
  //     }
  // });
});
 
// Start the server 
serv.start(function (error) {
  // Did server start succeed ? 
  if (error) throw error;
  else console.log('Server running ...');
});
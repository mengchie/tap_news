var express = require('express');
var router = express.Router();
var rpc_client = require('../backendServer/rpc_client');

var request = require('request');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;


router.get('/pageNum/:pageNum', function(req, res, next) {
  let page_num = req.params['pageNum'];
  rpc_client.getNewsFromMG(page_num).then((result) => {
    // JSON.parse(articles);
    // console.log(typeof(articles));
    res.json(result['result']);    
  }).catch(function(e){
    //error handling logic
    console.log('error!! ' + e);
  });;

});


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

module.exports = router;

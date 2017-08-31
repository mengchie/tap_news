var amqp = require('amqplib/callback_api');
var amqpURL = 'amqp://tpofilbw:WEjrp2DOUrC34L8yg4AL4zijlPFu8Ulp@donkey.rmq.cloudamqp.com/tpofilbw';

var send = function(q, articles) {
	amqp.connect(amqpURL, function(err, conn) {
		// console.log(i);
		// i++;
		if (err !== null) return console.warn(err);
	  	conn.createChannel(function(err, ch) {
	    	ch.assertQueue(q, {durable: false});
	    	// Note: on Node 6 Buffer.from(msg) should be used
	    	articles.map(function(article) {
	    		var msg = JSON.stringify(article);
	    		ch.sendToQueue(q, Buffer.from(msg));
	    	});
	  	});
	});
}

var receive = function(q) {
	amqp.connect(amqpURL, function(err, conn) {
		if (err !== null) return console.warn(err);
		conn.createChannel(function(err, ch) {
		ch.assertQueue(q, {durable: false});
		// Note: on Node 6 Buffer.from(msg) should be used
		ch.prefetch(1);
			ch.consume(q, function(msg) {
				console.log('message => ' + msg.content.toString());
			});

		});
	});
}

var deletAll = function(q) {
	amqp.connect(amqpURL, function(err, conn) {
	  conn.createChannel(function(err, ch) {
	    ch.assertQueue(q, {durable: false});
	   	ch.consume(q, function(msg) {
	   		console.log('message => ' + msg.content.toString());
	   	});
	    
	  });
	});
}

exports.send = send;
exports.receive = receive;
exports.deletAll = deletAll;
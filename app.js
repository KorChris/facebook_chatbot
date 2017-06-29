'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

//작은 따옴표 사이에 본인이 받으신 token을 paste합니다.
var FB_VERIFY_TOKEN = 'EAAGVLbE00jMBAAC3loSBCJts3FjjZBY4Q6q9j1u5NThYibioOTEUapZBdDOZAZBETcjsVfXMbdLjYMFZAhsZAjWu0U1QNqctfyo7XC0Dnq52xCKbZCgTSZALdP5mH8BZBEo4igPSi3ohVzNZAxczZBQFWZByxLmG1QogoHmENAx1ZA9slw82rDwV1tYa9';

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot');
})


app.get('/webhook', function (req, res) {
	if (req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong token');
})


app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
})

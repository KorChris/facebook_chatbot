'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

//작은 따옴표 사이에 본인이 받으신 token을 paste합니다.
var PAGE_ACCESS_TOKEN = 'EAAGVLbE00jMBAAC3loSBCJts3FjjZBY4Q6q9j1u5NThYibioOTEUapZBdDOZAZBETcjsVfXMbdLjYMFZAhsZAjWu0U1QNqctfyo7XC0Dnq52xCKbZCgTSZALdP5mH8BZBEo4igPSi3ohVzNZAxczZBQFWZByxLmG1QogoHmENAx1ZA9slw82rDwV1tYa9';

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello world, I am a chat bot');
})


app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
})

app.post("/webhook", function(req, res) {
    // Make sure this is a page subscription
    if (req.body.object == "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function(entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.postback) {
                    processPostback(event);
                }else if(event.message){
                	processPostback(event);
                }
            });
        });

        res.sendStatus(200);
    }
});

function processPostback(event) {
    var senderId = event.sender.id;
    var content = event.message.text;

    var echo_message = "ECHO : " + content;
    sendMessage(senderId, echo_message);
}

// sends message to user
function sendMessage(recipientId, message) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "POST",
        json: {
            recipient: { id: recipientId },
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Error sending message: " + response.error);
        }
    });
}

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
})

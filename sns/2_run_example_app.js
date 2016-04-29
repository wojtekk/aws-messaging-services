'use strict';

console.log('SNS step 2: Run example app');

require('dotenv').load({silent: true});

const express = require('express');
const bodyParser = require('body-parser');
const utils = require('./utils');

const port = process.env.PORT || 8080;
const topicArn = process.env.SNS_TOPIC_ARN

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: '*/*'}));

function processMessage(id, subject, message) {
  return new Promise((resolve) => {
    console.log('New message - processing');
    console.log(' Id:', id);
    if (subject) {
      console.log(' Subject:', subject);
    }
    console.log(' Body:', message);

    // Do what you need

    resolve();
  });
};

function confirmSubscription(token) {
  const AWS = require('aws-sdk');
  const sns = new AWS.SNS();

  const params = {
    Token: token,
    TopicArn: topicArn
  };
  return sns.confirmSubscription(params).promise();
};

function handleMessage(req, res) {
  const snsMessage = req.body;

  if (snsMessage.Type === 'SubscriptionConfirmation' && snsMessage.TopicArn === topicArn) {
    return confirmSubscription(snsMessage.Token)
      .then(() => {
        console.info('Subscription confirmed');
        res.status(200)
          .type('text/plain')
          .send("OK");
      })
      .catch((err) => {
        console.error('Error during subscription confirmation', err);
        res.status(500)
          .type('text/plain')
          .send("ERROR");
      });
  } else if (snsMessage.Type === 'Notification') {
    return processMessage(snsMessage.MessageId, snsMessage.Subject, snsMessage.Message)
      .then(() => {
        res.status(200)
          .type('text/plain')
          .send("OK");
      })
      .catch((err) => {
        console.error('Error during message processing', err);
        res.status(500)
          .type('text/plain')
          .send("ERROR");
      });
  }
}

app.post('/', handleMessage);

app.listen(port);

console.log(`App listen on port: ${port}`);

if (!!process.env.USE_LOCAL_TUNNEL) {
  utils.createLocalTunnel(port, process.env.SNS_HTTP_APP_URL);
}

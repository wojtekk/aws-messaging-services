console.log('SNS step 2: Run example app');

require('dotenv').load({ silent: true });

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const utils = require('./../libs/utils');

const port = process.env.PORT || 8080;
const topicArn = process.env.SNS_TOPIC_ARN;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

function processMessage(id, subject, message) {
  return new Promise((resolve) => {
    console.log('New message - processing');
    console.log('  MessageId:', id);
    if (subject) {
      console.log('  Subject:', subject);
    }
    console.log('  Body:', message);

    // Do something cool ...

    resolve();
  });
}

function confirmSubscription(token) {
  const sns = new AWS.SNS();

  const params = {
    Token: token,
    TopicArn: topicArn,
  };
  return sns.confirmSubscription(params).promise();
}

function handleMessage(req, res) {
  const snsMessage = req.body;
  if (snsMessage.TopicArn !== topicArn) {
    res.status(401)
      .type('text/plain')
      .send('Not authorised');
    return;
  }
  switch (snsMessage.Type) {
    case 'SubscriptionConfirmation':
      return confirmSubscription(snsMessage.Token)
        .then(() => {
          console.info('Subscription confirmed');
          res.status(200)
            .type('text/plain')
            .send('OK');
        })
        .catch((err) => {
          console.error('Error during subscription confirmation', err);
          res.status(500)
            .type('text/plain')
            .send('ERROR');
        });
    case 'Notification':
      return processMessage(snsMessage.MessageId, snsMessage.Subject, snsMessage.Message)
        .then(() => {
          res.status(200)
            .type('text/plain')
            .send('OK');
        })
        .catch((err) => {
          console.error('Error during message processing', err);
          res.status(500)
            .type('text/plain')
            .send('ERROR');
        });
    default:
      console.warn('Unknown message type:', snsMessage.Type);
      res.status(404)
        .type('text/plain')
        .send('Not found');
  }
}

app.post('/', handleMessage);

app.listen(port);

console.log(`App listen on port: ${port}`);

if (!!process.env.USE_LOCAL_TUNNEL) {
  utils.createLocalTunnel(port, process.env.SNS_HTTP_APP_URL);
}

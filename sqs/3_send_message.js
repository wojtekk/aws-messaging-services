'use strict';

console.log('SQS step 3: Send message');

require('dotenv').load({silent: true});

const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const utils = require('./../libs/utils');

const queueUrl = process.env.SQS_QUEUE_URL;

const message = utils.createFakeMessage();

var params = {
  MessageBody: JSON.stringify(message.body),
  QueueUrl: queueUrl,
  DelaySeconds: 0
};

sqs.sendMessage(params).promise()
  .then((res) => {
    console.info('Message sent');
    console.info('  MessageId:', res.MessageId);
  })
  .catch((err)=> {
    console.error("ERROR - Stack trace\n", err.stack);
    process.exit(1);
  });

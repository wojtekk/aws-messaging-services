console.log('SQS step 2: Run example worker');

require('dotenv').load({ silent: true });

const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const queueUrl = process.env.SQS_QUEUE_URL;

const receiveMessageParams = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 1,
  VisibilityTimeout: 60,
  WaitTimeSeconds: 5,
};

function processMessage(message) {
  return new Promise((resolve) => {
    console.info('New message');
    console.info('  MessageId:', message.MessageId);
    console.info('  Body:', message.Body);

    // Do something cool ...

    resolve();
  });
}

function deleteMessage(message) {
  const params = {
    QueueUrl: queueUrl,
    ReceiptHandle: message.ReceiptHandle,
  };
  return sqs.deleteMessage(params).promise()
    .then(() => {
      console.info('Message deleted');
    });
}

function pollQueueForMessages() {
  console.log('Waiting for message ...');
  sqs.receiveMessage(receiveMessageParams).promise()
    .then((res) => {
      if (!res.Messages) {
        console.info('No new message');
        return;
      }
      const message = res.Messages[0];
      return processMessage(message)
        .then(() => deleteMessage(message));
    })
    .then(() => pollQueueForMessages())
    .catch((rmErr) => {
      console.error('ERROR - Stack trace\n', rmErr.stack);
      pollQueueForMessages();
    });
}

pollQueueForMessages();

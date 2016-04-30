console.log('SQS step 1: Create queue');

require('dotenv').load({ silent: true });

const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const queueName = process.env.SQS_QUEUE_NAME;

const params = {
  QueueName: queueName,
  Attributes: {
    DelaySeconds: 0,
    MaximumMessageSize: 262144, // 256 KB
    MessageRetentionPeriod: 345600, // 4 days
    ReceiveMessageWaitTimeSeconds: 0,
    VisibilityTimeout: 30,
  },
};

sqs.createQueue(params).promise()
  .then((res) => {
    console.info('Queue created');
    console.info('Queue URL: ', res.QueueUrl);
    console.info('Save Queue URL to the file .env in variable: SQS_QUEUE_URL');

    return res.QueueUrl;
  })
  .catch((err) => {
    console.error('ERROR - Stack trace\n', err.stack);
    process.exit(1);
  });

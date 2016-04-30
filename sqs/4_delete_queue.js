console.log('SQS step 4: Delete queue');

require('dotenv').load({ silent: true });

const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const queueUrl = process.env.SQS_QUEUE_URL;

const params = {
  QueueUrl: queueUrl,
};

sqs.deleteQueue(params).promise()
  .then(() => {
    console.info('Queue deleted');
  })
  .catch((err) => {
    console.error('ERROR - Stack trace\n', err.stack);
    process.exit(1);
  });

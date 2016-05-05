console.log('SQS step 1: Create queue');

require('dotenv').load({ silent: true });

const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const queueName = process.env.SQS_QUEUE_NAME;

const params = {
  QueueName: queueName,
  Attributes: {
    DelaySeconds: '0', // The amount of time to delay the first delivery of all
                       // messages added to this queue.
    MaximumMessageSize: '262144', // 256 KB - Maximum message size (in bytes) accepted by SQS.
    MessageRetentionPeriod: '345600', // 4 days - The amount of time that Amazon SQS will retain
                                      // a message if it does not get deleted.
    ReceiveMessageWaitTimeSeconds: '0', // The maximum amount of time that a long polling receive
                                        // call will wait for a message to become available before
                                        // returning an empty response.
    VisibilityTimeout: '30', // The length of time (in seconds) that a message received from
                             // a queue will be invisible to other receiving components.
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

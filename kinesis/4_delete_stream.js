console.log('Kinesis step 1: Create stream');

require('dotenv').load({ silent: true });

const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();

const streamName = process.env.KINESIS_STREAM_NAME;

const params = {
  StreamName: streamName,
};

kinesis.deleteStream(params).promise()
  .then(() => {
    console.info('Stream deleted');
  })
  .catch((err) => {
    console.error('ERROR - Stack trace\n', err.stack);
    process.exit(1);
  });

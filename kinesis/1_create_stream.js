'use strict';

console.log('Kinesis step 1: Create stream');

require('dotenv').load({silent: true});

const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();

const streamName = process.env.KINESIS_STREAM_NAME;

const params = {
  ShardCount: 1,
  StreamName: streamName
};

kinesis.createStream(params).promise()
  .then(() => {
    console.info('Creation in progress ...');
    return kinesis.waitFor('streamExists', {StreamName: streamName}).promise()
  })
  .then(() => {
    console.info('Stream created');
  })
  .catch((err)=> {
    console.error("ERROR - Stack trace\n", err.stack);
    process.exit(1);
  });

'use strict';

console.log('Kinesis step 3: Send messages');

require('dotenv').load({silent: true});

const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();
const utils = require('./../libs/utils');

const streamName = process.env.KINESIS_STREAM_NAME;

const message = utils.createFakeMessage();

const params = {
  Data: JSON.stringify(message.body),
  PartitionKey: '1',
  StreamName: streamName
};

kinesis.putRecord(params).promise()
  .then((res) => {
    console.info('Record put');
    console.info('  SequenceNumber:', res.SequenceNumber);
  })
  .catch((err)=> {
    console.error("ERROR - Stack trace\n", err.stack);
    process.exit(1);
  });

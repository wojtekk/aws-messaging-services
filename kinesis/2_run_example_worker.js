'use strict';

console.log('Kinesis step 2: Run example worker');

require('dotenv').load({silent: true});

const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();

const streamName = process.env.KINESIS_STREAM_NAME;

function processRecord(record) {
  return new Promise((resolve) => {
    console.info('New record');
    console.info('  SequenceNumber:', record.SequenceNumber);
    console.info('  Data:', record.Data.toString());

    // Do something cool ...

    resolve();
  });
}

function pollStreamForRecords(shardIterator) {
  console.log('Waiting for records ...');
  const getRecordsParams = {
    ShardIterator: shardIterator,
    Limit: 1
  };
  let lastSequenceNumber;
  kinesis.getRecords(getRecordsParams).promise()
    .then((res) => {
      if (!res.Records.length) {
        console.info('No new records');
        return res.NextShardIterator;
      }
      const record = res.Records[0];
      lastSequenceNumber = record.SequenceNumber;
      return processRecord(record)
        .then(() => {
          return res.NextShardIterator;
        });
    })
    .then((shardIterator) => pollStreamForRecords(shardIterator))
    .catch((err)=> {
      console.error("ERROR - Stack trace\n", err.stack);
      console.warn('Skipping record - SequenceNumber:', lastSequenceNumber)

      let params = {
        ShardId: 'shardId-000000000000',
        ShardIteratorType: 'AFTER_SEQUENCE_NUMBER',
        StartingSequenceNumber: lastSequenceNumber,
        StreamName: streamName
      };

      return kinesis.getShardIterator(params).promise()
        .then((res) => pollStreamForRecords(res.ShardIterator))
        .catch((err)=> {
          console.error("ERROR - Stack trace\n", err.stack);
          process.exit(1);
        });
    });
}

const params = {
  ShardId: 'shardId-000000000000',
  ShardIteratorType: 'TRIM_HORIZON',
  StreamName: streamName
};

kinesis.getShardIterator(params).promise()
  .then((res) => pollStreamForRecords(res.ShardIterator))
  .catch((err)=> {
    console.error("ERROR - Stack trace\n", err.stack);
    process.exit(1);
  });

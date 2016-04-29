'use strict';

console.log('SNS step 3: Subscribe topic');

require('dotenv').load({silent: true});

const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const topicArn = process.env.SNS_TOPIC_ARN;
const appUrl = process.env.SNS_HTTP_APP_URL;

var params = {
  Protocol: 'https',
  TopicArn: topicArn,
  Endpoint: appUrl
};

sns.subscribe(params).promise()
  .then(() => {
    console.info('Subscription request sent - check example app now');
  })
  .catch((err) => {
    console.error("ERROR - Stack trace:\n", err.stack);
    process.exit(1);
  });

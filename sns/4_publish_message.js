console.log('SNS step 4: Publish message');

require('dotenv').load({ silent: true });

const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const utils = require('./../libs/utils');

const topicArn = process.env.SNS_TOPIC_ARN;

const message = utils.createFakeMessage();
const params = {
  Message: JSON.stringify(message.body),
  Subject: message.subject,
  TopicArn: topicArn,
};

sns.publish(params).promise()
  .then((res) => {
    console.info('Message sent');
    console.info('  MessageId:', res.MessageId);
    console.info('  Subject:', message.subject);
    console.info('  Body:', message.body);
  })
  .catch((err) => {
    console.error('ERROR - Stack trace:\n', err.stack);
    process.exit(1);
  });

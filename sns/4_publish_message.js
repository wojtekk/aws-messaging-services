'use strict';

console.log('SNS step 4: Publish message');

require('dotenv').load({silent: true});

const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const topicArn = process.env.SNS_TOPIC_ARN;

function createFakeMessage() {
  const actions = ['created', 'modified', 'deleted'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)]
  const randomElementId = Math.floor(Math.random() * 10000);
  return {
    subject: `Element ${randomAction}`,
    body: {"action": randomAction, "elementId": randomElementId}
  };
}

const message = createFakeMessage();
const params = {
  Message: JSON.stringify(message.body),
  Subject: message.subject,
  TopicArn: topicArn
};

sns.publish(params).promise()
  .then((res) => {
    console.info('Message sent');
    console.info(' Id:', res.MessageId);
    console.info(' Subject:', message.subject);
    console.info(' Body:', message.body);
  })
  .catch((err) => {
    console.error("ERROR - Stack trace:\n", err.stack);
    process.exit(1);
  });

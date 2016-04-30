console.log('SNS step 1: Create Topic');

require('dotenv').load({ silent: true });

const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const topicName = process.env.SNS_TOPIC_NAME;

const deliveryPolicy = {
  http: {
    defaultHealthyRetryPolicy: {
      minDelayTarget: 20,
      maxDelayTarget: 20,
      numRetries: 3,
      numMaxDelayRetries: 0,
      numNoDelayRetries: 0,
      numMinDelayRetries: 0,
      backoffFunction: 'linear',
    },
    disableSubscriptionOverrides: false,
  },
};

function createTopic() {
  const params = {
    Name: topicName,
  };

  return sns.createTopic(params).promise()
    .then((res) => {
      console.info(`Topic "${topicName}" created with ARN: ${res.TopicArn}`);
      console.info('Save ARN to the file .env in variable SNS_TOPIC_ARN');
      return res.TopicArn;
    });
}

function setDeliveryPolicy(topicArn) {
  const params = {
    AttributeName: 'DeliveryPolicy',
    TopicArn: topicArn,
    AttributeValue: JSON.stringify(deliveryPolicy),
  };
  return sns.setTopicAttributes(params).promise()
    .then(() => {
      console.info('HTTP DeliveryPolicy set successful');
    });
}

createTopic()
  .then(setDeliveryPolicy)
  .catch((err) => {
    console.error('ERROR - Stack trace:\n', err.stack);
    process.exit(1);
  });

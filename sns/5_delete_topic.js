console.log('SNS step 5: Delete topic and all subscriptions');

require('dotenv').load({ silent: true });

const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const topicArn = process.env.SNS_TOPIC_ARN;

const params = {
  TopicArn: topicArn,
};

sns.deleteTopic(params).promise()
  .then(() => {
    console.info('Topic deleted');
  })
  .catch((err) => {
    console.error('ERROR - Stack trace:\n', err.stack);
    process.exit(1);
  });

# AWS Messaging Services

AWS Messaging Services Demo.

## Quick start

Before you start working with project you have to install dependency and prepare configuration.

Run from command line:

    npm install
    copy .env.local .env

Define configuration in file: `.env`.

## SNS

With SNS demo you can:

1. Create SNS Topic: `npm run sns1` or `node sns/1_create_topic.js` - whe you do that, remember about save ARN in
   variable `SNS_TOPIC_ARN`.
2. Run example app which will be receive messages: `npm run sns2` or `node sns/2_run_example_app.js` (HTTP server).
3. Subscribe topic: `npm run sns3` or `node sns/3_subscribe_topic.js` (Important: server from #2 have to be runned
   and accessible from Internet)
4. Publish example message: `npm run sns4` or `node sns/4_publish_message.js` (Important: server from #2 have to be
   runned and accessible from Internet)
5. Delete SNS Topic and all subscription: `npm run sns5` or `node sns/5_delete_topic.js`

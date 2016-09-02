# Straight-moving tank

This is a trivially simple implementation of a tank APIs for the [Serverless Code Camp](https://serverless.camp), which just stays in the same place and fires all the time.



* Move horizontally and shoot at any available targets, than turn around
* Move vertically and shoot at any available targets encountered, then turn around
* Move around a rectangular area, and shoot any available targets encountered

## Prerequisites

* [Set up access credentials for Node.js AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
* Create a profile with IAM, Lambda and API Gateway access
* set the AWS_PROFILE environment variable, or change the package.json scripts to include `--profile <PROFILE>` option to `claudia` scripts

## Installing

To install this tanks to your AWS account, run `npm install`, then `npm start`. 

To update the API, after modifying the code, run `npm run deploy`.

## Try it live

Use the following URL to try this tank APIs preinstalled, live:

* `https://lm3glrrmt1.execute-api.us-east-1.amazonaws.com/latest` 

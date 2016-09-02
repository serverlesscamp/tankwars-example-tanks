# Straight-moving tank

This is a trivially simple implementation of three tank APIs for the [Serverless Code Camp](https://serverless.camp).  

* Move horizontally and shoot at any available targets, than turn around
* Move vertically and shoot at any available targets encountered, then turn around
* Move around a rectangular area, and shoot any available targets encountered

## Prerequisites

* (optional) Create a new profile with IAM, Lambda and API Gateway access for your AWS account
* Set up access credentials for Node.JS AWS SDK. Check out the [Lazy Quick Start](https://claudiajs.com/tutorials/installing.html#configuring-access-credentials) or [Configuring Node AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)


## Installing

To install these tanks to your AWS account, run `npm install`, then `npm start`. This will deploy the API to your AWS account and print out the main API URL. Add `/v`, `/h` or `/r` to the URL to run the vertical, horizontal or rectangular API.

To update the APIs, after modifying the code, run `npm run deploy`.

## Try it live

Use the following URLs to try these tank APIs preinstalled, live:

* vertical mover `https://6ug9dleeta.execute-api.us-east-1.amazonaws.com/latest/v` 
* horizontal mover `https://6ug9dleeta.execute-api.us-east-1.amazonaws.com/latest/h`
* rectangular mover `https://6ug9dleeta.execute-api.us-east-1.amazonaws.com/latest/r`

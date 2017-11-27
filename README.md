simpleJobQ

This is a job queue library, using [redis](http://redis.io) and built for [node.js](http://nodejs.org)

## Installation

  - Latest release:

        $ npm install simple-job-q

To use this module you must have a redis server running on port 6379

## Features

  - Connect to the redis server
  - Publish jobs to a job queue
  - Subscribe to a job queue
  - Empty job que
  - Quit the redis connection

## Connecting to the redis database

Calling simpleJobQ.connect() will connect you to the redis database. You must have a redis server running on port 6379.
connect takes a callback, which is called with an error if the connection was unsuccessful.

```js
 simpleJobQ.connect((error) => {
   console.log('error')
 }
```

## Publishing a job

Calling simpleJobQ.publish() will publish a job to the database. The function takes two parameters, queName which must be a
 string and data. simpleJobQ.publish takes a callback, which is called with an error if the publish was unsuccessful.

```js
 simpleJobQ.publish( 'queName', {someData}, (error) => {
   console.log('error')
 }
```

## Subscribing to a job queue

Calling simpleJobQ.subscribe() will retrieve the next job in the que. The function takes one parameter, queName which must be a
string. simpleJobQ.subscribe takes a callback callback, which is called with an error if the subscribe was unsuccessful. If
successful the callback will also be called with job and done. You can put the job back into the job queue with and error
property attached to it, by calling done(error).

```js
 simpleJobQ.subscribe(queueName1, (error, job, done) => {

   //do something with the job

   //if the job cant be handled
   done(error)
 }
```
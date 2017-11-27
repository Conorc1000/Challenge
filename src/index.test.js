const test = require('tape');
const connect = require('./index').connect;
const publishJob = require('./index').publishJob;
const subscribe = require('./index').subscribe;
const quit = require('./index').quit;
const emptyQueues = require('./index').emptyQueues;

const queueName1 = 'testQueue';
const data1 = {name: 'Conor', location: 'London'};

const queueName2 = 'aDifferentTestQueue';
const data2 = {name: 'Sally', location: 'Brighton'};

test('index.tests.js: User can ‘connect’ to the Job queue with no database setup.', function (t) {
    connect((error) => {
        t.notOk(error, 'No error after connecting');
        quit();
        t.end();
    });
});

test('index.tests.js: API should expose a publishJob() method that adds a job to the queue.', function (t) {
    connect((error) => {

        emptyQueues([queueName1], () => {
            t.notOk(error, 'No error after emptying the queue');
            publishJob(queueName1, data1, (error) => {
                t.notOk(error, 'No error after publishing job');

                subscribe(queueName1, (error, job) => {
                    t.notOk(error, 'No error after subscribing');
                    t.equal(typeof job, 'object', 'The job has the type of "object"');
                    t.deepEqual(job.data, data1, 'The job data is published and retrieved');
                    quit();
                    t.end();
                });
            });
        })
    });
});

test('index.tests.js: The queue names must be strings', function (t) {
    connect((error) => {
        publishJob([], data1, (error) => {
            t.ok(error, 'error after publishing job with an array a the queue name');
            quit();
            t.end();
        });
    });
});

test('index.tests.js: Jobs should be namespace’d and when we call subscribe() we pass a namespace argument to' +
    ' subscribe to a given namespace.', function (t) {

    connect(() => {
        emptyQueues([queueName1, queueName2], () => {

            publishJob(queueName1, data1, () => {
                publishJob(queueName2, data2, () => {

                    subscribe(queueName1, (error, job) => {
                        t.deepEqual(job.data, data1, 'The job data is published and retrieved');

                        subscribe(queueName2, (error, job) => {
                            t.deepEqual(job.data, data2, 'The job data is published and retrieved');
                            quit();
                            t.end();
                        });
                    });
                });
            });
        });
    });
});

test('index.tests.js: the first job to be added to a queue will be the first to be retrieved', function (t) {

    connect(() => {
        emptyQueues([queueName1, queueName2], () => {

            publishJob(queueName1, data1, () => {
                publishJob(queueName1, data2, () => {

                    subscribe(queueName1, (error, job) => {
                        t.deepEqual(job.data, data1, 'The first job to be published to the queue is the first to be ' +
                            'retrieved');
                        subscribe(queueName1, (error, job) => {
                            t.deepEqual(job.data, data2, 'The second job to be published to the queue is the second' +
                                ' to be retrieved');
                            quit();
                            t.end();
                        });
                    });
                });
            });
        });
    });
});

test('index.tests.js: The job queue should handle errors by saving the caught error to the job in the queue for' +
    ' later debugging.', function (t) {

    connect((error) => {
        emptyQueues([queueName1], () => {

            publishJob(queueName1, data1, () => {
                subscribe(queueName1, (error, job, done) => {
                    const userError = new Error('the error message');

                    done(userError);
                    subscribe(queueName1, (error, job) => {
                        t.deepEqual(job.errors, [userError], 'The error is saved to the job');
                        quit();
                        t.end();
                    });
                });
            });
        });
    });
});

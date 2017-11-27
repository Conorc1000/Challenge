const redis = require('redis');
const aguid = require('aguid');

let client;

const connect = (callback) => {
    client = redis.createClient();

    client.on("error", (error) => {
        callback(error);
    });
    client.on("connect", () => {
        callback()
    });
};

const publishJob = (queueName, data, callback) => {

    if(typeof queueName !== 'string'){

        const error = new Error('The first parameter, queName, must be a string');

        return callback(error)
    }

    const job = {
        timestamp: Date.now(),
        data,
        id: aguid(),
        errors: []
    };

    client.lpush(queueName, JSON.stringify(job), (error) => {
        callback(error);
    });
};

const subscribe = (queueName, callback) => {
    client.rpop(queueName, (error, job) => {
        callback(error, JSON.parse(job), clientCallback(queueName, JSON.parse(job)))
    });
};

const clientCallback = (queueName, job) => (userError) => {
    if(userError){
        job.errors.push(userError);
        client.rpush(queueName, JSON.stringify(job));
    }
};

const quit = () => {
    client.quit();
};

const emptyQueues = (queueNamesArray, callback) => {
    client.del( queueNamesArray , (error)=>{
        callback(error)
    });
};

module.exports = {connect, publishJob, subscribe, quit, emptyQueues};


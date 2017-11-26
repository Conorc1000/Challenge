# Challenge
Given a set of basic requirements you are required to set up a basic job queue library for Node.js and a database of your choice.

Requirements

I can ‘connect’ to the Job queue with no database setup, i.e. any triggers, table
schema or functions are added to the database when we connect().
- The queue API should expose a publishJob() method that adds a job to the
queue.
- Jobs should be namespace’d and when we call subscribe() we pass a namespace
argument to subscribe to a given namespace.
- The job queue should handle errors by saving the caught error to the job in the
queue for later debugging.
- The job queue only needs to be consumed by a single node server, so row locking
is not a requirement, but a nice to have.
- Unit testing is a nice to have.

Deliverable

Please provide your module as a publishable Node.js package with basic docs on how
to use the API, either on GitHub or in a zipped file.
In addition to the above implementation we are keen to know how you would improve
the API and functionality, so please provide a list of backlog tasks for this module.
This challenge should be no longer than 3 hours. If you think it will take you longer,
consider how you can restrict the scope whilst still showing off your skills.

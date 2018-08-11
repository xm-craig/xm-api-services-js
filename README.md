Node.js Client for xMatters API Services
========================================

A simple http wrapper for consuming the xMatters REST API.

## Features

 - **Retry on Failure** Automatically retry when intermittent failures occur.
   Specifically, 429 and some 5xx errors are returned from the API.

 - **Exponential Backoff** Requests are rate-limited by the client, which helps
   prevent reaching the server-enforced rate limit.

## Quick Start

    $ npm install xm-api-services-js


Create a new client object by calling `createClient()`

```js
var xMClient = require('xm-api-services-js').createClient({
  host: 'mydomain.xmatters.com',
  username: '<login id>',
  password: '<password>'
});
```
The username and password properties are optional if provided as environment variables:
- XMATTERS_API_USERNAME
- XMATTERS_API_PASSWORD

Make requests to the xMatters APIs by calling methods on the client object. The client object has the following methods:
- `get`: the GET method takes a path, optional query string object, and a callback function
- `post`: the POST method takes a path, post body, and a callback function
- `put`: the PUT method takes a path, post body, and a callback function
- `delete`: the DELETE method takes a path and a callback function

```js
// Get Sites
xMClient.get('sites', function(err, response) {
  if (!err) {
    console.log(response.data);
  }
});

//delete a person
xMClient.post('people', 
              {targetName: 'mmcbride',
               firstName: 'Mary',
               lastName: 'Mcbride',
               roles:  ['Standard User']},
              function(err, response) {
  if (!err) {
    console.log(response.data);
  }
});

// Get people
xMClient.get('people', function(err, response) {
  if (!err) {
    console.log(response.data);
  }
});

// Get the second result set of people
xMClient.get('people', {offset: 1, limit: 5}, function(err, response) {
  if (!err) {
    console.log(response.data);
  }
});

//delete a person
xMClient.delete('people/mmcbride', function(err, response) {
  if (!err) {
    console.log(response.data);
  }
});

```


## Support

This library is community supported.  If you find a bug, or have a feature suggestion, please
[log an issue][issues].


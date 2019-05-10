/**
 * @license
 * Copyright 2018 xMatters Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const merge = require('merge');
const backoff = require('backoff');
const request = require('request-promise');


function xMClient(options) {
    var defaults = {
	debug: false,
        version : '1'
    };

    this.settings = merge(defaults, options);
    this.auth = { user: this.settings.username,
                  pass: this.settings.password,
                  sendImmediately: this.settings.sendImmediately || false};
    this.baseUrl = 'https://' + this.settings.host + '/api/xm/' + this.settings.version;
}

module.exports = xMClient;

xMClient.prototype.get = function(path, filters, callback) {
    //Required parameters: path, callback.
    if (arguments.length == 2) {
        callback = filters;
        filters = {};
    }

    this.makeRequest('GET', path, null, filters, callback);
}

xMClient.prototype.post = function(path, post_body, callback) {

    this.makeRequest('POST', path, post_body, null, callback);
}

xMClient.prototype.put = function(path, post_body, callback) {
    if (arguments.length == 2) {
        callback = post_body;
        post_body  = {};
    }

    this.makeRequest('PUT', path, post_body, null, callback);
}

xMClient.prototype.delete = function(path, callback) {

    this.makeRequest('DELETE', path, null, null, callback);
}

xMClient.prototype.makeRequest = function(method, path, post_body, filters, callback) {
    var options = {
        uri: `${this.baseUrl}/` + path,
        method: method,
        qs: filters || {},
        auth: this.auth,
        json: true
    };
    if (post_body != null)
	options.body = post_body;

    var call = backoff.call(this._request.bind(this), options, callback);

    // Determines whether a response indicates a retriable error.
    var canRetry = this.settings.canRetry || function(response) {
      return (
        response == null
        || response.status === 500
        || response.status === 503
        || response.status === 504
        || response.status === 429);
    };

    call.retryIf(canRetry);
    if (this.settings.failAfter)
        call.failAfter(this.settings.failAfter);

    call.setStrategy(new backoff.ExponentialStrategy());
    call.start();
}


xMClient.prototype._request = function(options, callback) {
    var client = this;

    request(options)
    .then(res => {
        if (client.settings.debug) console.log("Successful request: " + options.method + " " + options.uri);
        callback(null, res);
    })
    .catch(error => {
        if (client.settings.debug) console.error("*** Request error on " + options.method + " " + options.uri, error)
        callback(error, null);
    })
}

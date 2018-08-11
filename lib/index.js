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

/**
 * xMatters API Service module.
 * @module @xm-craig/xm-api-services-js
 */
/**
 * Creates an xMatters client. The client object contains all the API methods.
 *
 * @param {Object} options
 * @param {string} options.host Host domain name to send requests. (required)
 * @param {string} options.username User acount. (optional if passed as environment variable XMATTERS_API_USERNAME)
 * @param {string} options.password Account password for authentication. (optional if passed as environment variable XMATTERS_API_PASSWORD)
 * @param {string} options.version API version to use. (Default: 1)
 * @return {xMClient} The client object containing all API methods.
 */
exports.createClient = function(options) {
    var settings = {
        version : options.version || '1',
        host : options.host,
        username : options.username || process.env.XMATTERS_API_USERNAME,
        password : options.password || process.env.XMATTERS_API_PASSWORD
    };

    var xMClient = require('./xm-client.js');
    return new xMClient(this.settings);
}

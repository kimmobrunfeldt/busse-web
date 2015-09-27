// Node.js ajax module

import qs from 'qs';
import _ from 'lodash';
import Promise from 'bluebird';
import request from 'superagent';
const {Request} = request;

// Wrap superagent promise to bluebird
// Make >400 errors to be normal responses, not errors
Request.prototype.promise = function() {
    return new Promise((resolve, reject) => {
        Request.prototype.end.call(this, (err, res) => {
            // If response is a http error, resolve normally
            if (res && res.status >= 400) {
                resolve(res);
            } else if (err) {
                // In other error cases, reject
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

// Ajax function. API is similar to jQuery's but it uses superagent
// under the hood.
function ajax(url, options = {}) {
    options = _.merge({
        headers: {
            'Accept': 'application/json'
        },
        method: 'GET',
        query: {}
    }, options);

    const httpMethodName = options.method.toLowerCase();
    if (httpMethodName !== 'get') {
        options.headers['Content-Type'] = 'application/json; charset=UTF-8';
        options.data = JSON.stringify(options.data);
    }

    // delete is a reserved keyword, superagent has .del method
    const methodName = httpMethodName === 'delete' ? 'del' : httpMethodName;
    const requestMethod = request[methodName];
    let promise = requestMethod(url)
        .set(options.headers)
        .query(qs.stringify(options.query, { indices: false }))
        .send(options.data)
        .promise();

    if (options.raw) {
        return promise;
    }

    return promise.then((res) => res.body);
}

export default ajax;

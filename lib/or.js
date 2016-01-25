'use strict';

var async = require('async'),
    util = require('./util'),
    _ = require('lodash');

module.exports = function() {
    let args = Array.prototype.slice.call(arguments),
        options = {};
    if (_.isPlainObject(args[-1])) {
        options = args.pop();
    }

    return function(req, res, next) {
        let policies = _.compact(args.map(function(policy) {
            if (_.isFunction(policy)) {
                return policy;
            }
            if (_.isString(policy) && req.mycro.policies[policy]) {
                return req.mycro.policies[policy];
            }
            return false;
        }));

        let mock = util.createMockResponse();
        async.some(policies, function(policy, cb) {
            policy(req, mock, function(err) {
                if (err || err === false) {
                    return cb(false);
                }
                cb(true);
            });
        }, function(result) {
            if (!result) {
                if (options.handleError) {
                    return options.handleError(req, res, next);
                }
                res.json(403, {error: 'Forbidden'});
                return next(false);
            }
            next();
        });
    };
};

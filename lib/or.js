'use strict';

var async = require('async'),
    util = require('./util'),
    _ = require('lodash');

module.exports = function() {
    let args = Array.prototype.slice.call(arguments),
        options = {};
    if (_.isPlainObject(_.last(args))) {
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
                let status = 403,
                    error = 'Forbidden';
                if (_.isPlainObject(options.error)) {
                    if (_.isNumber(options.error.status)) {
                        status = options.error.status;
                    }
                    if (options.error.error) {
                        error = options.error.error;
                    }
                }
                res.json(status, {error: error});
                return next(false);
            }
            next();
        });
    };
};

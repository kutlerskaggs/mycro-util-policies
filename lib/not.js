'use strict';

var async = require('async'),
    joi = require('joi'),
    util = require('./util'),
    _ = require('lodash');

module.exports = function(policy, status, error) {
    let options;
    return function(req, res, next) {
        async.waterfall([
            function validateOptions(fn) {
                let schema = joi.alternatives().try(
                    joi.number().integer(),
                    joi.object({
                        status: joi.number().integer(),
                        error: joi.alternatives().try(
                            joi.string(),
                            joi.object()
                        )
                    })
                ).default({ status: 403, error: 'Forbidden' });
                joi.validate(status, schema, {convert: true}, function(err, status) {
                    if (err) {
                        return fn(err);
                    }
                    options = _.isPlainObject(status) ? status : {};
                    if (!options.status) {
                        options.status = status;
                        options.error = error || 'Forbidden';
                    }
                    fn(null, options);
                });
            },

            function validatePolicy(options, fn) {
                if (_.isString(policy) && _.isFunction(mycro.policies[policy])) {
                    policy = mycro.policies[policy];
                }
                if (!_.isFunction(policy)) {
                    return (new Error('Invalid argument: `policy` must be a function.'));
                }
                fn();
            },

            function executePolicy(fn) {
                let mock = util.createMockResponse();
                policy(req, mock, function(err) {
                    if (err || err === false) {
                        return fn();
                    }
                    res.json(options.status, {error: options.error});
                    return fn(true);
                });
            }
        ], function(err) {
            if (err) {
                if (err !== true) {
                    res.json(500, {error: err});
                }
                return next(false);
            }
            next();
        });




    };
};

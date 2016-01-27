'use strict';

var util = require('./util'),
    _ = require('lodash');

module.exports = function(testPolicy, passPolicy, failPolicy) {
    return function(req, res, next) {
        let policies = {
            test: testPolicy,
            pass: passPolicy,
            fail: failPolicy
        };

        policies = _.mapValues(policies, function(policy, name) {
            if (_.isFunction(policy)) {
                return policy;
            }
            if (_.isString(policy) && _.isFunction(req.mycro.policies[policy])) {
                return req.mycro.policies[policy];
            }
            return function(req, res, next) {
                res.json(500, {error: '[policy] if: Invalid policy configuration.'});
                return next(false);
            };
        });

        let mock = util.createMockResponse();
        policies.test(req, mock, function(err) {
            if (err || err === false) {
                policies.fail(req, res, next);
            } else {
                policies.pass(req, res, next);
            }
        });
    };
};

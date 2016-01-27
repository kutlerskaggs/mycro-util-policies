'use strict';

var util = require('./util'),
    _ = require('lodash');

module.exports = function(policy, status, error) {
    if (!_.isNumber(status)) {
        status = 403;
    }
    if (!_.isString(error)) {
        error = 'Forbidden';
    }
    return function(req, res, next) {
        if (!_.isFunction(policy)) {
            res.json(500, {error:  new Error('Invalid argument: `policy` must be a function.')});
            return next(false);
        }

        let mock = util.createMockResponse();

        policy(req, mock, function(err) {
            if (err || err === false) {
                return next();
            }
            res.json(status, {error: error});
            return next(false);
        });
    };
};

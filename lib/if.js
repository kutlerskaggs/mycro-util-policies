'use strict';

var util = require('./util');

module.exports = function(testPolicy, passPolicy, failPolicy) {
    return function(req, res, next) {
        let mock = util.createMockResponse();
        testPolicy(req, mock, function(err) {
            if (err || err === false) {
                return failPolicy(req, res, next);
            }
            passPolicy(req, res, next);
        });
    };
};

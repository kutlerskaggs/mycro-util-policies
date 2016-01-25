'use strict';

var _ = require('lodash');

module.exports = {
    success(req, res) {
        res.json(200, _.pick(req, ['body', 'query']));
    }
};

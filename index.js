'use strict';

var include = require('include-all'),
    _ = require('lodash');

module.exports = function mycro_util_policies(done) {
    let mycro = this;
    mycro.policies = _.isPlainObject(mycro.policies) ? mycro.policies : {};

    let policies = include({
        dirname: __dirname + '/lib',
        filter: /(.+)\.js/,
        depth: 1,
        optional: true
    });

    _.defaults(mycro.policies, policies);
    done();
};

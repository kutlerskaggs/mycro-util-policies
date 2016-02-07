'use strict';

var joi = require('joi'),
    _ = require('lodash');

/**
 * Validate a request
 *
 * @param  {String|Function} container
 * @param  {Function|Object} factoryFn
 * @param  {Object} [options={}]
 */
module.exports = function(container, factoryFn, options) {
    // handle optional `container` argument
    if (_.isFunction(container)) {
        factoryFn = container;
        container = false;
    }

    let validContainers = [false, 'headers', 'cookies', 'body', 'query'];
    if (validContainers.indexOf(container) === -1) {
        throw new Error('Invalid container passed to `valdiate` policy');
    }

    // handle optional `options` argument and apply defaults
    options = _.isPlainObject(options) ? options : {};
    if (!container || container === 'headers') {
        _.defaults(options, {
            convert: true,
            allowUnknown: true
        });
    }

    let schema = factoryFn(joi);

    return function(req, res, next) {
        let toValidate = req;
        if (container) {
            toValidate = req[container];
        }
        joi.validate(toValidate, schema, _.omit(options, 'error'), function(err, validated) {
            if (err) {
                let status = 400,
                    error = 'Bad Request';
                if (options.error) {
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
            if (container) {
                _.merge(req[container], validated);
            } else {
                _.merge(req, validated);
            }
            next();
        });
    };
};

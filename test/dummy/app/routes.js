'use strict';

module.exports = function(mycro) {
    return {
        'v1.0.0': {
            '/healthy': {
                get(req, res) {
                    res.json(200);
                }
            },
            '/if': {
                policies: [
                    mycro.policies.if(
                        mycro.policies.validate('query', function(joi) {
                            return joi.object({
                                first: joi.string().required()
                            }).required();
                        }, {allowUnknown: true}),
                        mycro.policies.validate('query', function(joi) {
                            return joi.object({
                                last: joi.string().min(3).required()
                            }).required();
                        }, {allowUnknown: true}),
                        mycro.policies.validate('query', function(joi) {
                            return joi.object({
                                age: joi.number().integer().min(18).required()
                            }).required();
                        }, {allowUnknown: true})
                    )
                ],
                get: 'test.success',
                '/missing': {
                    '/fail': {
                        policies: [
                            mycro.policies.if(
                                function(req, res, next) {
                                    return next(false);
                                },
                                function(req, res, next) {
                                    return next();
                                }
                            )
                        ],
                        get: 'test.success'
                    },
                    '/pass': {
                        policies: [
                            mycro.policies.if(
                                function(req, res, next) {
                                    return next();
                                },
                                'unknown',
                                'authenticated'
                            )
                        ],
                        get: 'test.success'
                    },
                    '/test': {
                        policies: [
                            mycro.policies.if(
                                'unknown',
                                function(req, res, next) {
                                    return next(false);
                                },
                                function(req, res, next) {
                                    res.json(500);
                                    return next(false);
                                }
                            )
                        ],
                        get: 'test.success'
                    }
                }
            },
            '/not': {
                '/one': {
                    policies: [
                        mycro.policies.not(
                            mycro.policies.validate('query', function(joi) {
                                return joi.object({
                                    name: joi.string().required()
                                }).required();
                            })
                        )
                    ],
                    get: 'test.success'
                }
            },
            '/or': {
                policies: [
                    mycro.policies.or(
                        mycro.policies.validate('query', function(joi) {
                            return joi.object({
                                age: joi.number().required()
                            }).required();
                        }, {convert: true, allowUnknown: true}),
                        mycro.policies.validate('query', function(joi) {
                            return joi.object({
                                name: joi.string().required()
                            }).required();
                        }, {allowUnknown: true})
                    )
                ],
                get: 'test.success'
            },
            '/validate': {
                '/all': {
                    policies: [
                        mycro.policies.validate(function(joi) {
                            return joi.object({
                                body: joi.object({
                                    name: joi.string().lowercase().trim().required()
                                }).required(),
                                query: {
                                    name: joi.string().lowercase().trim().required()
                                }
                            }).assert('body.name', joi.ref('query.name'), 'equal to query.name').required();
                        })
                    ],
                    post: 'validate.all'
                },
                '/body': {
                    policies: [
                        mycro.policies.validate('body', function(joi) {
                            return joi.object({
                                a: joi.number().integer().min(10).max(20).required(),
                                b: joi.string().alphanum().required()
                            }).required();
                        }, {stripUnknown: true})
                    ],
                    post: 'validate.body'
                },
                '/cookies': {
                    policies: [
                        mycro.policies.validate('cookies', function(joi) {
                            return joi.object({
                                email: joi.string().email().required(),
                            }).required();
                        }, {allowUnknown: true})
                    ],
                    get: 'validate.cookies'
                },
                '/headers': {
                    policies: [
                        mycro.policies.validate('headers', function(joi) {
                            return joi.object({
                                'x-age': joi.number().integer().required(),
                            }).required();
                        })
                    ],
                    get: 'validate.headers'
                },
                '/query': {
                    policies: [
                        mycro.policies.validate('query', function(joi) {
                            return joi.object({
                                name: joi.string().lowercase().default('default'),
                                number: joi.number()
                            }).required();
                        }, {convert: true})
                    ],
                    get: 'validate.query'
                }
            }
        }
    };
};

'use strict';

module.exports = {
    middleware: [
        'acceptParser',
        'queryParser',
        'bodyParser',
        function cookie() {
            return require('restify-cookies').parse;
        },
        'morgan',
        'request'
    ]
};

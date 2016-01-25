'use strict';

var mocks = require('node-mocks-http');

module.exports = {
    createMockResponse: function() {
        let response = mocks.createResponse();
        return response;
    }
};

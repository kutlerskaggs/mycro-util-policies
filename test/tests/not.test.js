'use strict';

var async = require('async'),
    expect = require('chai').expect;

describe('[policy] not', function() {
    it('should invert the response', function(done) {
        async.parallel([
            function(fn) {
                request.get('/not/one')
                    .expect(200)
                    .end(fn);
            },

            function(fn) {
                request.get('/not/one?name=kevin')
                    .expect(403)
                    .end(fn);
            },

            function(fn) {
                request.get('/not/custom/1?name=bob')
                    .expect(400)
                    .end(fn);
            },

            function(fn) {
                request.get('/not/custom/2?name=bob')
                    .expect(401)
                    .end(fn);
            }
        ], done);
    });
});

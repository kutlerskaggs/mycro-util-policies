'use strict';

var async = require('async'),
    expect = require('chai').expect;

describe('[policy] or', function() {
    it('should pass if at least one policy passes', function(done) {
        async.parallel([
            function(fn) {
                request.get('/or?name=bob')
                    .expect(200)
                    .end(fn);
            },

            function(fn) {
                request.get('/or?age=2')
                    .expect(200)
                    .end(fn);
            },

            function(fn) {
                request.get('/or?name=chris&age=2')
                    .expect(200)
                    .end(fn);
            },

            function(fn) {
                request.get('/or?')
                    .expect(400)
                    .end(fn);
            }
        ], done);
    });
});

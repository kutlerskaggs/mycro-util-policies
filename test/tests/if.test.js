'use strict';

var async = require('async'),
    expect = require('chai').expect;

describe('[policy] if', function() {
    it('should default to the passPolicy if the testPolicy passes', function(done) {
        async.parallel([
            function(fn) {
                request.get('/if?first=tim')
                    .expect(400)
                    .end(fn);
            },

            function(fn) {
                request.get('/if?first=tim&last=tebow')
                    .expect(200)
                    .end(fn);
            }
        ], done);
    });

    it('should default to the failPolicy if the testPolicy failes', function(done) {
        async.parallel([
            function(fn) {
                request.get('/if')
                    .expect(400)
                    .end(fn);
            },

            function(fn) {
                request.get('/if?&age=20')
                    .expect(200)
                    .end(fn);
            }
        ], done);
    });

    it('should fail (500) if one of the policies are not supplied or are invalid', function(done) {
        async.parallel([
            function(fn) {
                request.get('/if/missing/test')
                    .expect(500)
                    .end(fn);
            },

            function(fn) {
                request.get('/if/missing/pass')
                    .expect(500)
                    .end(fn);
            },

            function(fn) {
                request.get('/if/missing/fail')
                    .expect(500)
                    .end(fn);
            }
        ], done);
    });
});

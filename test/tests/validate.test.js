'use strict';

var async = require('async'),
    expect = require('chai').expect;

describe('[policy] validate', function() {
    it('should validate the entire request object if no container is provided', function(done) {
        async.parallel([
            function(fn) {
                request.post('/validate/all?name=BOB')
                    .send({
                        name: '  Bob  '
                    })
                    .expect(200)
                    .expect(function(res) {
                        expect(res.body.body.name).to.equal('bob');
                        expect(res.body.query.name).to.equal('bob');
                    })
                    .end(fn);
            },

            function(fn) {
                request.post('/validate/all?name=bob')
                    .expect(400)
                    .end(fn);
            },

            function(fn) {
                request.post('/validate/all?name=bob')
                    .send({
                        name: 3
                    })
                    .expect(400)
                    .end(fn);
            }
        ], done);
    });

    it('should validate the request body', function(done) {
        async.parallel([
            function(fn) {
                request.post('/validate/body')
                    .send({
                        a: 11
                    })
                    .expect(400)
                    .end(fn);
            },

            function(fn) {
                request.post('/validate/body')
                    .send({
                        a: '11',
                        b: 'Test123'
                    })
                    .expect(200)
                    .expect(function(res) {
                        expect(res.body.a).to.equal(11);
                        expect(res.body.b).to.equal('Test123');
                    })
                    .end(fn);
            },

            function(fn) {
                request.post('/validate/body')
                    .send({
                        a: 'wrong',
                        b: 'Abc123'
                    })
                    .expect(400)
                    .end(fn);
            }
        ], done);
    });

    it('should validate the request headers', function(done) {
        request.get('/validate/headers')
            .set('x-age', 50)
            .expect(200)
            .end(done);
    });

    it('should validate the request cookies', function(done) {
        async.parallel([
            function(fn) {
                request.get('/validate/cookies')
                    .set('Cookie', 'email=test@email.com')
                    .expect(200)
                    .end(fn);
            },

            function(fn) {
                request.get('/validate/cookies')
                    .set('Cookie', 'email=hello')
                    .expect(400)
                    .end(fn);
            }
        ], done);
    });

    it('should validate the request query params', function(done) {
        async.parallel([
            function(fn) {
                request.get('/validate/query')
                    .expect(200)
                    .expect(function(res) {
                        expect(res.body.name).to.equal('default');
                    })
                    .end(fn);
            },

            function(fn) {
                request.get('/validate/query?name=bob&number=5')
                    .expect(200)
                    .expect(function(res) {
                        expect(res.body.name).to.equal('bob');
                        expect(res.body.number).to.equal(5);
                    })
                    .end(fn);
            }
        ], done);
    });

    it('should allow for custom error handling', function(done) {
        async.parallel([
            function(fn) {
                request.get('/validate/custom')
                    .expect(401)
                    .end(fn);
            },

            function(fn) {
                request.get('/validate/custom')
                    .set('Authorization', 'Basic laksdjf;laksdf')
                    .expect(401)
                    .end(fn);
            },

            function(fn) {
                request.get('/validate/custom')
                    .set('Authorization', 'Bearer ey193ocsdijcwaj')
                    .expect(200)
                    .end(fn);
            }
        ], done);
    });
});

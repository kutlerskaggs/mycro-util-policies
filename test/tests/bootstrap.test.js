'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinonChai = require('sinon-chai'),
    supertest = require('supertest');

chai.use(sinonChai);
let cwd = process.cwd();
process.chdir(__dirname + '/../dummy');

before(function(done) {
    var mycro = require('../dummy/app');
    global.mycro = mycro;
    mycro.start(function(err) {
        global.request = supertest.agent(mycro.server);
        done(err);
    });
});

after(function() {
    process.chdir(cwd);
});

describe('basic tests', function() {
    it('should start successfully', function(done) {
        request.get('/healthy')
            .expect(200)
            .end(done);
    });
});

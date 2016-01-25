'use strict';

module.exports = {
    all(req, res) {
        res.json(200, {body: req.body, query: req.query});
    },

    body(req, res) {
        res.json(200, req.body);
    },

    cookies(req, res) {
        res.json(200, {email: req.cookies.email});
    },

    headers(req, res) {
        res.json(200, {age: req.headers['x-age']});
    },

    query(req, res) {
        res.json(200, req.query);
    }
};

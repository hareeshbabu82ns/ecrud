var express = require('express');
var router = express.Router();
var parseSrc = require('parse/node').Parse;
var Parse = require('kaiseki');
var _ = require('underscore');

var API_ID = 'hfQCYrLcY6EeX2jbJjgJCZV3MkYgB41MhAfSrkET';
var REST_API_KEY = 'fdhqoRWKgofoPahInUqBE7G2LGDltMiq5Kl4F37T';

//parseSrc.initialize("hfQCYrLcY6EeX2jbJjgJCZV3MkYgB41MhAfSrkET", "DNb4qR9LsQeGWDrgJpRVi7Rgn7KumrL2aSSPokRb");

var CLASS = 'artists_t'; //Parse Class (table name)

var idField = 'objectId'; //Parse Key field name

var parse = new Parse(API_ID, REST_API_KEY);

router.route('/artists_t')
  //read all
  .get(function (req, res) {
    var params = {"where": req.query};
    console.log(params);
    parse.getObjects(CLASS, params, function (err, resp, body, success) {
      if (err) {
        return res.send(err);
      }
      res.json(body);
    });
  })
  //create
  .post(function (req, res) {
    parse.createObject(CLASS, req.body,
      function (err, resp, body, success) {
        if (err)
          return res.send(err);
        res.json(body);
      });
  });

router.route('/artists_t/:id')
  //read
  .get(function (req, res) {
    parse.getObject(CLASS, req.params.id,
      function (err, resp, body, success) {
        if (err) {
          return res.send(err);
        }
        res.json(body);
      });
  })
  //update
  .put(function (req, res) {
    parse.updateObject(CLASS, req.params.id, req.body,
      function (err, resp, body, success) {
        if (err) {
          return res.send(err);
        }
        var obj = {};
        obj[idField] = req.params.id;
        _.extend(body, obj);
        res.json(body);
      });
  })
  //delete
  .delete(function (req, res) {
    parse.deleteObject(CLASS, req.params.id,
      function (err, resp, body, success) {
        if (err) {
          return res.send(err);
        }
        res.json(body);
      });
  });

module.exports = router;
'use strict';

var assert = require('assert');
var path = require('path');
var browserify = require('browserify');
var dotify = require('../lib');
var esprima = require('esprima');


describe('browserify-dot', function () {
  var results;

  it('should compile input files', function (done) {
    browserify()
      .add(path.join(__dirname, 'fixtures/script.js'))
      .transform(dotify)
      .bundle(function (err, contents) {
        if (err) {
          return done(err);
        }

        try {
          assert.ok(esprima.parse(contents));
        } catch (e) {
          return done(e);
        }

        done();
      });
  });
});
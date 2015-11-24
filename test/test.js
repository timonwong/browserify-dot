'use strict';

var concat = require('concat-stream');
var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var esprima = require('esprima');
var test = require('tape');
var vm = require('vm');

test('dotify', function(t) {
  var dotify = require('../lib');

  function dotifier(sourcePath, options, callback) {
    fs.createReadStream(sourcePath)
      .pipe(dotify(sourcePath, options))
      .pipe(concat({
        encoding: 'string'
      }, callback));
  }

  function loadAsModule(source) {
    var context = {
      module: {}
    };
    vm.runInNewContext(source, context);
    return context.module.exports;
  }

  t.test('with default options', function (t) {
    var filename = path.resolve('test/fixtures/template.dot');
    dotifier(filename, null, function (output) {
      var template = loadAsModule(output);
      t.ok(esprima.parse(output), 'should parsable');
      t.equal(template({details: [{id: 1, title: 'Sample'}]}), '<div><p>1: Sample</p></div>', 'should work');
      t.end();
    });
  });
});

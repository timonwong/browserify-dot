'use strict';

var dot = require('dot');
var through = require('through');
var xtend = require('xtend');

var extension = '.dot';


function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function dotify(file, opts) {
  if (!endsWith(file, extension)) {
    return through();
  }

  var buffer = '';
  opts = opts || {};
  return through(write, end);

  function write(chunk) {
    buffer += chunk.toString();
  }

  function end() {
    try {
      var conf = xtend(dot.templateSettings, opts.templateSettings);
      var compiled = 'module.exports = ' + dot.template(buffer, conf) + ';\n';
      this.queue(compiled);
      this.emit('end');
    } catch (e) {
      this.emit('error', e);
    }
  }
}

dotify.configure = function(rootOpts) {
  return function(file, opts) {
    return dotify(file, xtend({}, rootOpts, opts));
  };
};

module.exports = dotify;

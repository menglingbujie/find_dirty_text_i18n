/**
 * Created by Xuzhe on 2016/11/23.
 */
var FS = require('fs');
var Path = require('path');
var glob = require('glob');
var _ = require('lodash');

var retval = {};

function loadFile(path, ext) {
  try {
    if (ext == '.js') {
      return require(path);
    } else if (ext == '.txt') {
      var lines = FS.readFileSync(path, "utf8").trim().split('\n');
      if (lines.length == 1) {
        return lines[0];
      }
      return lines;
    }
  } catch(e) {
    console.log('load lang file failed: '+path, e);
    return null;
  }
  return null;
}

var files = glob.sync(__dirname + "/**/*", { nodir: true});


files.forEach(function(path){
  var ext = Path.extname(path);
  var basename = Path.basename(path, ext);

  if (!basename.startsWith('lang_')) {
    return;
  }

  var dotKey = basename.substr('lang_'.length);

  var val = loadFile(path, ext);

  if (val) {
    _.set(retval, dotKey, val);
  }
});

module.exports = retval;




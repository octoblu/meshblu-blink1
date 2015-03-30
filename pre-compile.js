var fs   = require('fs');
var os   = require('os');
var zlib = require('zlib');
var tar  = require('tar');
var fstream = require('fstream');

var getFilename = function(packageJSON){
  return [packageJSON.name, packageJSON.version, os.platform(), os.arch(), 'node-modules'].join('-') + '.tar.gz';
};

var filename = getFilename(require('./package.json'));
console.log(filename);
fstream.Reader({ path: __dirname, type: "Directory" })
       .pipe(tar.Pack())
       .pipe(zlib.Gzip())
       .pipe(fs.createWriteStream(filename));

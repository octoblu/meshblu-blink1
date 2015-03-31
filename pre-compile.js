var fs      = require('fs-extra');
var os      = require('os');
var path    = require('path');
var zlib    = require('zlib');
var tar     = require('tar');
var fstream = require('fstream');

var getFilename = function(packageJSON){
  return [packageJSON.name, packageJSON.version, os.platform(), os.arch(), 'node-modules'].join('-') + '.tar.gz';
};

fs.mkdirpSync('build');
var filename = getFilename(require('./package.json'));
var destination = path.join(__dirname, 'build', filename);

console.log(destination);

fstream.Reader({path: path.join(__dirname, 'node_modules'), type: "Directory"})
       .pipe(tar.Pack())
       .pipe(zlib.Gzip())
       .pipe(fs.createWriteStream(destination));


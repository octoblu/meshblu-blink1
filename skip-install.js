var fs = require('fs');
var os = require('os');
var zlib = require('zlib');

var tar,request;

try {
  tar = require('tar');
  request = require('request');
} catch (error) {
  console.error('tar and request not available, skipping precompiled binary fetch');
  process.exit(0);
}

var BASE_PATH = 'http://octoblu-npm.s3-website-us-west-2.amazonaws.com';

var getUrl = function(packageJSON){
  var filename = [packageJSON.name, packageJSON.version, os.platform(), os.arch(), 'node-modules'].join('-') + '.tar.gz';
  var path = packageJSON.name + '/' + filename;
  return BASE_PATH + '/' + path;
};

var url = getUrl(require('./package.json'));
console.log(url);
request.get(url)
        .pipe(zlib.Unzip())
        .on('error', function(){
          console.error('No precompiled binary found');
          process.exit(0);
        });
        .pipe(tar.Extract({path: 'node_modules', strip: 1}))
        .on('error', function(){
          console.error('No precompiled binary found');
          process.exit(0);
        });

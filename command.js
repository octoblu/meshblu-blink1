var Plugin = require('./index').Plugin;
var skynet = require('skynet');

var conx = skynet.createConnection({
  server: 'meshblu.octoblu.com',
  port: '80',
  uuid: '659f9a31-4e56-11e4-9133-338b9914afd1',
  token: '0000f1joywpyl23xr68chct6pbucv7vi'
});

var plugin = new Plugin();
conx.on('message', plugin.onMessage);


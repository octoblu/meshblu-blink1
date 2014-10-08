var Plugin = require('./index').Plugin;
var skynet = require('skynet');
var config = require('./meshblu.json');

var conx = skynet.createConnection({
  server: 'meshblu.octoblu.com',
  port: '80',
  uuid: config.uuid,
  token: config.token
});

conx.on('notReady', console.error);
conx.on('error', console.error);

var plugin = new Plugin();
conx.on('message', plugin.onMessage);


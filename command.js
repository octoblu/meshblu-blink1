'use strict';

var Plugin        = require('./index').Plugin;
var skynet        = require('skynet');
var config        = require('./meshblu.json');
var plugin        = new Plugin();

var conx = skynet.createConnection({
  server: process.env.MESHBLU_SERVER || 'meshblu.octoblu.com',
  port:   process.env.MESHBLU_PORT   || '80',
  uuid: config.uuid,
  token: config.token
});

conx.on('ready', function(){
  conx.update({
    uuid  : config.uuid,
    token : config.token,
    messageSchema : plugin.messageSchema
  }, function(data){
    console.log('updated', data.eventCode, data);
  });
});

conx.on('notReady', console.error);
conx.on('error', console.error);
conx.on('message', plugin.onMessage);


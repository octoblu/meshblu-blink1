'use strict';
var Plugin = require('./index').Plugin;
var meshblu = require('meshblu');
var config = require('./meshblu.json');

var conx = meshblu.createConnection({
  server : config.server,
  port   : config.port,
  uuid   : config.uuid,
  token  : config.token
});

conx.on('notReady', function(error){
  console.error('notReady', error);
});
conx.on('error', function(error){
  console.error('connection error', error);
});

var plugin = new Plugin();

conx.on('ready', function(){
  conx.whoami({uuid: config.uuid}, function(device){
    plugin.setOptions(device.options || {});
    conx.update({
      uuid: config.uuid,
      token: config.token,
      messageSchema: plugin.messageSchema,
      optionsSchema: plugin.optionsSchema,
      options:       plugin.options
    });
  });
});

conx.on('message', function(){
  try {
    plugin.onMessage.apply(plugin, arguments);
  } catch (error){
    console.error(error);
  }
});

plugin.on('message', function(message){
  conx.message(message);
});

plugin.on('error', function(error){
  console.error('plugin error', error);
});

'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Blink1;
try {
  Blink1 = require('node-blink1');
} catch (error) {
  console.error(error);
  Blink1 = false;
}
var tinycolor = require('tinycolor2');
var request = require('request');

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    on: {
      type: 'boolean',
      required: true
    },
    color: {
      type: 'string',
      required: true
    }
  }
};

var OPTIONS_SCHEMA = {};

function Plugin(){
  this.options = {};
  this.messageSchema = MESSAGE_SCHEMA;
  this.optionsSchema = OPTIONS_SCHEMA;
  return this;
}
util.inherits(Plugin, EventEmitter);

var parseColor = function(on, color){
  if(!on){
    return tinycolor('black');
  }

  if(!color){
    return tinycolor('white');
  }

  return tinycolor(color);
};

Plugin.prototype.onMessage = function(message){
  var payload = message.payload;
  this.updateBlink1(payload);
};

Plugin.prototype.updateBlink1 = function(payload){
  var color, parsedColor;
  color = parseColor(payload.on, payload.color);
  parsedColor = tinycolor(color);

  if (!Blink1 || !this.updateUSB(parsedColor)) {
    this.updateRequest(parsedColor);
  }
};

Plugin.prototype.updateRequest = function(color) {
  var rgb = color.toHexString()
  request.get('http://127.0.0.1:8934/blink1/fadeToRGB',
    {qs: {'rgb': rgb}}
    , function (error, response, body) {
      if (error) {
        console.log(error);
      }
  });
};

Plugin.prototype.updateUSB = function(color) {
  var rgb = color.toRgb()
  try {
    var blink1 = new Blink1();
    blink1.fadeToRGB(0, rgb.r, rgb.g, rgb.b);
    blink1.close();
    return true;
  } catch (error) {
    console.error(error);
    var newError = new Error('Possible conflict with the blink1Control app, close it for better results');
    console.error(newError);
    return false;
  }
};

Plugin.prototype.setOptions = function(options){
  this.options = options;
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};

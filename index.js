'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Blink1 = require('node-blink1');
var tinycolor = require('tinycolor2');

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

  return tinycolor(decodeURIComponent(color));
};

Plugin.prototype.onMessage = function(message){
  var payload, color, rgb, blink1;
  payload = message.payload;

  color = parseColor(payload.on, payload.color);
  rgb = tinycolor(color).toRgb();

  blink1 = new Blink1();
  blink1.fadeToRGB(0, rgb.r, rgb.g, rgb.b);
  blink1.close();
};

Plugin.prototype.setOptions = function(options){
  this.options = options;
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};

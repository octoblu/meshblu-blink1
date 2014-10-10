'use strict';

var Blink1    = require('node-blink1');
var tinycolor = require('tinycolor2');
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

function Plugin(){
  this.blink1 = new Blink1();
  this.onMessage = __bind(this.onMessage, this);
  return this;
}

var parseColor = function(on, color){
  if(!on){
    return tinycolor('black');
  }

  if(!color){
    return tinycolor('white');
  }

  return tinycolor(decodeURIComponent(color));
};

Plugin.prototype.onMessage = function(data){
  try{
    var payload, color, rgb;
    payload = data.payload || data.message || {};

    color = parseColor(payload.on, payload.color);
    rgb = tinycolor(color).toRgb();

    this.blink1.fadeToRGB(0, rgb.r, rgb.g, rgb.b);
  } catch (error) {
    if(error.message){
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }
    throw error;
  }
};

var messageSchema = {
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

module.exports = {
  Plugin: Plugin,
  messageSchema: messageSchema
};

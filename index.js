'use strict';

var Blink1    = require('node-blink1');
var tinycolor = require('tinycolor2');

function Plugin(){}

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
    var payload, color, rgb, blink1;
    payload = data.payload || data.message || {};

    color = parseColor(payload.on, payload.color);
    rgb = tinycolor(color).toRgb();

    blink1 = new Blink1();
    blink1.fadeToRGB(0, rgb.r, rgb.g, rgb.b);
    blink1.close();
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

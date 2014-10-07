var Blink1    = require('node-blink1');
var tinycolor = require('tinycolor2');

function Plugin(messager, options){
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
}

Plugin.prototype.onMessage = function(data, cb){
  try{
    var payload, color, rgb;
    payload = data.payload || data.message || {};

    color = parseColor(payload.on, payload.color);
    rgb = tinycolor(color).toRgb();

    new Blink1().fadeToRGB(0, rgb.r, rgb.g, rgb.b);
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);
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

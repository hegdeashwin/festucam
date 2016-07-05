(function(root, factory) {
  if (typeof define === 'function' && define.amd && define.amd.dust === true) {
    define(['dust.core'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('dustjs-linkedin'));
  } else {
    factory(root.dust);
  }
}(this, function (dust) {
  dust.helpers.provide = function provide(chunk, ctx, bodies, params) {
    'use strict';
    var resData,
      blockData,
      paramVals = {},
      k,
      localCtx = ctx,
      saveData = chunk.data;

    if (params) {
      localCtx = ctx.push(params); // make params available to all bodies
    }

    for (k in bodies) {
      if (k !== 'block') {
        chunk.data = [];
        try {
          blockData = bodies[k](chunk, localCtx).data.join('');
          resData = JSON.parse(blockData);
        } catch (e) {
          resData = blockData; // not valid JSON so just return raw data
        }
        paramVals[k] = resData;
      }
    }
    chunk.data = saveData;

    // combine block-defined params with any existing ones.
    // Block param overrides if name duplicates regular 11Guparam
    return bodies.block(chunk, localCtx.push(paramVals));

  };
}));

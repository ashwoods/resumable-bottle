
"use strict";

/**
 *  ughelpers.js helper methods for uploadGuard.js
 */


var ughelpers = {
  extend : function( a, b ) {
    for( var key in b ) {
      if( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
  }
};


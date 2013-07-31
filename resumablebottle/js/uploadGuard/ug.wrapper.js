
"use strict";

/**
 *  ug.wrapper.js - uploadGuard - a wrapper for several upload plugins
 */

var ug = function( options ) {

  // INSTANTIATE
  if( !( this instanceof ug ) ) {
    return new ug( options );
  }

  // PROPERTIES
  var $ = this;
  $.defaults = {
  };

  // CONSTRUCTOR
  $.construct = function() {
    // OPTIONS
    $.defaults = ughelpers.extend( $.defaults, options );
    console.log( $.defaults );
    //console.log( ughelpers.ie );
    console.log( ughelpers.testForFileApi );
  }

  $.construct();
};

var ug = ug({test:'a', test1 : 'b'});
console.log( ug );

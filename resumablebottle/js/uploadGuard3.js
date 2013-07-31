
"use strict";

/**
 *  uploadGuard.js - a wrapper for several upload plugins
 */


// HELPER FUNCTIONS
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


var uploadGuard = function( options ) {

  if( !( this instanceof uploadGuard ) ) {
    return new uploadGuard( options );
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
  }

  //return(this);
  //return {
    //id : 1,
    //method : function() {
        //console.log( 'options' );
    //}
  //};
  $.construct();
};

var ug = uploadGuard({test:'a', test1 : 'b'});
console.log( ug );

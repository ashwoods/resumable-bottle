
"use strict";

/**
 *  ug.wrapper.js - uploadGuard - A Wrapper for Upload Plugins
 */

var ug = function( options ) {

  // INSTANTIATE
  if( !( this instanceof ug ) ) {
    return new ug( options );
  }

  // PROPERTIES
  var $ = this;
  $.uploader = new String(); // resumable or plupload ...
  $.defaults = {
  };

  // CONSTRUCTOR
  $.construct = function() {
    // OPTIONS
    $.defaults = ughelpers.extend( $.defaults, options );
    console.log( $.defaults );

    /*
    console.log( ughelpers.ie );
    console.log( ughelpers.testForFileApi() );
    console.log( typeof( FileReader ) !== 'undefined' );
    */

    $.t = ughelpers.testForResumableJs();
    console.log( $.t );

    if( $.t ) {
        alert('resumableJS');
    } else {
        alert('plupload');
    }
    //console.log( jQuery('body') );
  };

  $.inituploader = function() {

  };

  $.play = function() {
    alert('play');
  };

  $.construct();
};

var ug = ug({test:'a', test1 : 'b'});
//ug.play();
console.log( ug );

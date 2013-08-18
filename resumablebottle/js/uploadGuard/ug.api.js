
"use strict";

/**
 *  ug.api.js - uploadGuard - A Wrapper & API for Upload Plugins
 */

var ug = function( options ) {

  // INSTANTIATE
  if( !( this instanceof ug ) ) {
    return new ug( options );
  }

  // PROPERTIES
  var $_ = this;
  $_.uploaderIdentifier = new String(); // resumable or plupload ...
  $_.uploader = new Object(); // resumable or plupload uploader object
  $_.defaults = { // default option parameters
    Resumable : {
      target : null,
      chunkSize : 2*1024*1024, // 2MB
      simultaneousUploads : 4,
      throttleProgressCallbacks : 1
    },
    drop_zone : '.drop-zone'
  };

  // CONSTRUCTOR
  $_.construct = function() {

    // OPTIONS
    $_.defaults = ughelpers.extend( $_.defaults, options );
    //console.log( $_.defaults );

    // TEST WHICH UPLOADER CAN BE USED
    ( ( ughelpers.testForResumableJs() ) ? $_.uploaderIdentifier = 'Resumable' : $_.uploaderIdentifier = 'plupload' );

    // CALLING TO INSTANTIATE THE UPLOADER OBJECT
    $_.inituploader( $_.uploaderIdentifier );
  };

  // INSTANTIATING THE UPLOADER OBJECT METHOD
  $_.inituploader = function( which ) {

    ughelpers.testFor( 'jQuery' );
    ughelpers.testFor( which );

    // INSTANTIATING THE RIGHT UPLOADER OBJECT
    if( typeof $_[which] === 'function' ) { $_[which](); }
  };

  // RESUMABLE.JS OBJECT
  $_.Resumable = function() {
    //console.log('init');
    //console.log( $_.defaults.Resumable );
    $_.r = new Resumable( $_.defaults.Resumable );
    if( jQuery( $_.defaults.drop_zone ) ) { $_.r.assignDrop( jQuery( $_.defaults.drop_zone ) ); } else { throw new Error( 'Error assigning drop zone!' ); }
    //console.log(jQuery( $_.defaults.drop_zone ) );
    //console.log( $_.r );
  };

  $_.play = function() {
  };

  $_.construct();
};

var ug = ug({test:'a', test1 : 'b'});
//ug.play();
console.log( ug );

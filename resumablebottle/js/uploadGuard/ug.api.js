
"use strict";

/**
 *  UploadGuard
 *  ug.api.js - API for Upload Plugins
 *
 *  public methods :
 *    .assignBrowse : equals the resumable.js method .assignBrowse(domNodes, isDirectory)
 *    .assignDrop : equals the resumable.js method .assignDrop(domNodes)
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
    plupload : {
        chunk_size : '4mb',
        runtimes : 'flash,html5,html4',
        urlstream_upload: true,
        multipart : true,
        flash_swf_url : 'js/plupload/plupload.flash.swf'
    }
  };
  $_.options = {}; // merged default & user parameters

  // CONSTRUCTOR
  $_.construct = function() {

    // jQuery DEPENDENCY CHECK
    ughelpers.testFor( 'jQuery' );

    // OPTIONS
    jQuery.extend( true, $_.defaults, options );
    //console.log( $_.defaults );

    // TEST WHICH UPLOADER CAN BE USED
    ( ( ughelpers.testForResumableJs() ) ? $_.uploaderIdentifier = 'Resumable' : $_.uploaderIdentifier = 'plupload' );

    // CALLING TO INSTANTIATE THE UPLOADER OBJECT
    $_.inituploader( $_.uploaderIdentifier );
  };

  // INSTANTIATING THE UPLOADER OBJECT METHOD
  $_.inituploader = function( which ) {

    ughelpers.testFor( which );

    // INSTANTIATING THE RIGHT UPLOADER OBJECT
    if( typeof $_[which] === 'function' ) { $_[which](); }
  };

  // RESUMABLE.JS OBJECT
  $_.Resumable = function() {
    // ASSIGNING THE OBJECT HANDLER
    $_.Resumable = new Resumable( $_.defaults.Resumable );
  };

  // PLUPLOAD OBJECT
  $_.plupload = function() {
    $_.plupload = new plupload.Uploader( $_.defaults.plupload );
  };

  // PUBLIC METHODS
  $_.assignDrop = function( selector ) {
    if( typeof $_.Resumable === 'object' ) {
      $_.Resumable.assignDrop( selector );
    }
  }

  $_.assignBrowse = function( selector ) {
    if( typeof $_.Resumable === 'object' ) {
      $_.Resumable.assignBrowse( selector );
    }
  }

  $_.construct();
};

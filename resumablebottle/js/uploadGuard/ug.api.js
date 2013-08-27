
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
        multipart : true
    }
  };
  $_.options = {}; // merged default & user parameters

  // CONSTRUCTOR
  $_.construct = function() {

    // OPTIONS
    $_.options = ughelpers.extend( $_.defaults, options );
    console.log( $_.options );

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

  // RESUMABLE.JS EXTERNAL CONSTRUCTOR
  $_.Resumable = function() {
    //$_.Resumable = new Resumable( $_.options.Resumable ); // ASSIGNING THE OBJECT HANDLER
    //Resumable.call( this, $_.options.Resumable );
    //$_.uploader = $_.Resumable; // REFERENCE OBJECT
    if( ughelpers.isObjectEmpty( $_.uploader ) ) {
      $_.uploader = new Resumable( $_.options.Resumable ); // ASSIGNING THE OBJECT HANDLER
    }
  };

  // PLUPLOAD EXTERNAL CONSTRUCTOR
  $_.plupload = function() {
    if( ughelpers.isObjectEmpty( $_.uploader ) ) {
      $_.uploader = new plupload.Uploader( $_.options.plupload ); // ASSIGNING THE OBJECT HANDLER
      $_.uploader.init();
    }
  };

  // PUBLIC METHODS
  $_.assignDrop = function( selector ) {

    ughelpers.checkSelector( selector );

    if( typeof $_.uploader === 'object' && $_.uploaderIdentifier === 'Resumable' ) {
      $_.uploader.assignDrop( selector );
    }
  }

  $_.assignBrowse = function( selector ) {
    
    ughelpers.checkSelector( selector );

    if( typeof $_.uploader === 'object' && $_.uploaderIdentifier === 'Resumable' ) {
      $_.uploader.assignBrowse( selector );
    }
  }

  $_.construct();
};

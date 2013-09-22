
"use strict";

/**
 *  UploadGuard
 *  ug.helpers.js - API helper methods
 *
 */

var ughelpers = {
  /**
   *  extends objects, overwrites same keys
   *  -> works like jQuery.extend() - except that it returns a new array/object instead of setting one
   */
  extend : function( destination, source ) {
    for( var property in source ) {
      if( source[property] && source[property].constructor && source[property].constructor === Object ) {
        destination[property] = destination[property] || {};
        ughelpers.extend( destination[property], source[property] );
      } else {
        destination[property] = source[property];
      }
    }
    return destination;
  },
  /** 
   *  detect if the browsers FileAPI is usable
   *  returns boolean
   */
  testForFileApi : function() {
    return ( ( 
    ( typeof( File )!=='undefined' ) 
      && ( typeof( Blob )!=='undefined' ) 
      && ( typeof( FileList )!=='undefined' ) 
      && ( !!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice || !!Blob.prototype.slice || false )
    ) ? true : false );
  },
  /** 
   *  detect if resumable.js can be used
   *    - if FileReader API Interface usable
   *    - if FileAPI usable
   *    - detect if IE 10 -> as yet the FileAPI is broken
   *  returns boolean
   */
  testForResumableJs : function() { 
    //return false; // FOR TESTING PURPOSES ONLY !!! -> causing fallback -> plupload
    return ( ( typeof( FileReader ) !== 'undefined' ) && ( this.ie !== 10 ) && this.testForFileApi() );
  },
  /** 
   *  Simple but effective IE detection : http://stackoverflow.com/questions/4169160/javascript-ie-detection-why-not-use-simple-conditional-comments
   *  returns a version number
   */
  ie : ( function() {
    var undef,
        rv = -1; // Return value assumes failure.
    if( navigator.appName == 'Microsoft Internet Explorer' )
    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if( re.exec(ua) != null ) {
        rv = parseFloat( RegExp.$1 );
      }
    }
    return ( ( rv > -1 ) ? rv : undef );
  }()),
  /** 
   *  Tests if an object already exists.
   *  Throws an error and stops the further script execution if so.
   */
  testFor : ( function( what ) {
    if( typeof eval( what ) === 'undefined' ) {
      //console.log( 'missing ' + what );
      throw new Error( 'missing ' + what );
    }
  }),
  /** 
   *  When jQuery available check for selector.
   *  Throws an error and stops the further script execution when not found.
   */
  checkSelector : ( function( the_selector ) {
    if( typeof eval( 'jQuery' ) !== 'undefined' ) { // in need of jQuery/Sizzle
      if( jQuery( the_selector ).length ) { return true; } else { throw new Error( 'Error assigning the browse button!' ); }
    }
  }),
  /**
   *  Simple test for void objects 
   */
  isObjectEmpty : function( obj ) {
    for( var prop in obj ) {
      if( obj.hasOwnProperty( prop ) ) {
            return false;
      }
    }
    return true;
  }
};


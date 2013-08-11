
"use strict";

/**
 *  ug.helpers.js helper methods for uploadGuard.js
 */

var ughelpers = {
  /**
   *  extends objects, overwrites same keys
   *  -> works like jQuery.extend() - except that it returns a new array/object instead of setting one
   */
  extend : function( a, b ) {
    for( var key in b ) {
      if( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
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
      //&& ( this.ie !== 10 ) // detect if IE 10
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
  }())
};


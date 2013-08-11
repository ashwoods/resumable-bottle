
"use strict";

/**
 *  ug.helpers.js helper methods for uploadGuard.js
 */

var ughelpers = {
  extend : function( a, b ) {
    for( var key in b ) {
      if( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
  },
  /*
  testForFileApi : ( ( 
    ( typeof( File )!=='undefined' ) 
      && ( typeof( Blob )!=='undefined' ) 
      && ( typeof( FileList )!=='undefined' ) 
      && ( !!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice || !!Blob.prototype.slice || false )
      && ( this.ie !== 10 ) // detect if IE 10
    ) ? true : false ),
  */
  testForFileApi : function() {
    return ( ( 
    ( typeof( File )!=='undefined' ) 
      && ( typeof( Blob )!=='undefined' ) 
      && ( typeof( FileList )!=='undefined' ) 
      && ( !!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice || !!Blob.prototype.slice || false )
      && ( this.ie !== 10 ) // detect if IE 10
    ) ? true : false )
  },
  testForResumableJs : function() { 
    return ( ( typeof( FileReader ) !== 'undefined' ) && this.testForFileApi() );
    /*
    if( ( typeof( FileReader ) !== 'undefined' ) && this.testForFileApi ) {
        alert('resumableJS');
    } else {
        alert('plupload');
    }
    */
  },
  //testForResumableJs : ( ( ( typeof( FileReader ) !== 'undefined' ) && this.testForFileApi ) ? false : true ),
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


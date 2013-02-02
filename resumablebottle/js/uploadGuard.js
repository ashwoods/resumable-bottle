

var uploadPlugin = {
    globals : {
        uploader : false
    }
};


// Browser compatibility test suites
var testForFileAPI = ( Modernizr.draganddrop
                        && ( typeof( File )!=='undefined' ) 
                        && ( typeof( Blob )!=='undefined' ) 
                        && ( typeof( FileList )!=='undefined' ) 
                        && ( !!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice || !!Blob.prototype.slice || false )
                    ) ? true : false;
var testForFileReader = ( ( typeof( FileReader ) !== 'undefined' ) && testForFileAPI );
// resumable.js standalone does not need the FileReader interface
var testForResumableJs = ( ( typeof( FileReader ) === 'undefined' ) && testForFileAPI );


Modernizr.load([
    {
        test : testForFileReader,
        yep : ['js/resumable.js','js/spark-md5.min.js'],
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep & nope ) action!
            if( ! uploadPlugin.globals.uploader ) {
                uploadPlugin.globals.uploader = 'FileReader'
            }
        },
        complete : function() {
            if( uploadPlugin.globals.uploader === 'FileReader' ) {
                $('#loading_area').css('background-image', 'none');
                $('[data-upload]')
                    .css({'visibility':'visible'})
                    .uploadGuard({
                        'uploader':uploadPlugin.globals.uploader,
                        'checkFileOnServerPath':'/check'
                    });
            }
        }
    },
    {
        test : testForResumableJs,
        yep : ['js/resumable.js'],
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep & nope ) action!
            if( ! uploadPlugin.globals.uploader ) {
                uploadPlugin.globals.uploader = 'resumableJs'
            }
        },
        complete : function() {
            // "complete" callback will be executed after all tests done & file downloading completed
            if( uploadPlugin.globals.uploader === 'resumableJs' ) {
                // initializing the main upload plugin
                $('#loading_area').css('background-image', 'none');
                $('[data-upload]').css({'visibility':'visible'}).uploadGuard({'uploader':uploadPlugin.globals.uploader});
            }
        }
    },
    {
        test : ! testForResumableJs,
        yep : [''],
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep, nope ) action!
            if( ! uploadPlugin.globals.uploader ) {
                uploadPlugin.globals.uploader = 'plupload'
            }
        },
        complete : function() {
            if( uploadPlugin.globals.uploader === 'plupload' ) {
            }
        }
    }
]);


/**
 *  the main upload scripts handler plugin
 * */
;(function ($, window, document, undefined) {
    var pluginName = "uploadGuard";
    var thisPlugin = {};
    var defaults = {
        url: null,
        checkFileOnServerPath: null
    };

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.options.url = $(this.element).data('upload');
            switch( this.options.uploader ) {
                case 'resumable' :
                    this.resumableJs.init( this );
                break;
                case 'FileReader' :
                    this.resumableJs.init( this );
                break;
                default:
                break;
            }
        },
        checkForFileExistence : function( fileData, file ) {
//console.log( fileData );
//console.log( this.options.checkFileOnServerPath );
            $.ajax({
                type: "POST",
                url: this.options.checkFileOnServerPath,
                data: fileData,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function( msg ) {
                    if( msg.pass ) {
                        thisPlugin.resumableJs.prepareUpload();
                        //return true;
                    }
                    else {
                        //return false;
                    }
                },
            });
        },
        resumableJs : {
            init : function( that ) {

                thisPlugin.resumableJs = this;

                var r = new Resumable({
                    target: that.options.url
                });

                thisPlugin = that;
                r.assignDrop( $(that.element) );
                r.on('fileAdded', function(file) {

                    theFile = file;

                    if( that.options.checkFileOnServerPath ) {
                        //console.log( that.options.checkFileOnServerPath );
                        var fileMD5 = thisPlugin.resumableJs.generateMD5( file );
                        that.checkForFileExistence( {'name':file.fileName, 'size':file.size, 'md5':fileMD5}, file );
                    }
                    else {
                        thisPlugin.resumableJs.prepareUpload();
                    }

                    //console.log(  );
/*                    if( that.options.uploader === 'FileReader' ) {
                        theFile = file;
                        chunkSize = 2097152,                               // read in chunks of 2MB
                        chunksAll = Math.ceil(theFile.size / chunkSize),
                        chunks = Math.ceil(theFile.size / chunkSize),
                        currentChunk = 0,

                        spark = new SparkMD5.ArrayBuffer(),
                        uploadPlugin.resumableJs.loadNext(file);
                    }
                    else {
                        // standard resumable upload
                        r.upload();
                    }*/
                });
            },
            generateMD5 : function( file ) {
                var spark = new SparkMD5();
                spark.append( file.fileName );
                spark.append( file.size );
                spark.append( file.uniqueIdentifier );
                return spark.end();
            },
            prepareUpload : function() {
                //console.log( theThat );
                if( thisPlugin.options.uploader === 'FileReader' ) {
                    chunkSize = 2097152,                               // read in chunks of 2MB
                    chunksAll = Math.ceil(theFile.size / chunkSize),
                    chunks = Math.ceil(theFile.size / chunkSize),
                    currentChunk = 0,

                    spark = new SparkMD5.ArrayBuffer(),
                    thisPlugin.resumableJs.loadNext( theFile );
                }
                else {
                    // standard resumable upload
                    r.upload();
                }
            },
            loadNext : function( file ) {
                fileReader = new FileReader();
                fileReader.onload = thisPlugin.resumableJs.frOnload;
                fileReader.onerror = thisPlugin.resumableJs.frOnerror;
                var start = currentChunk * chunkSize,
                   end = ((start + chunkSize) >= theFile.size) ? theFile.size : start + chunkSize;
                console.log(start);
                console.log(end);
                var blob = theFile.file.slice(start, end);
                fileReader.readAsArrayBuffer(blob);
            },
            frOnload : function(e) {
                console.log("read chunk nr", currentChunk + 1, "of", chunks);
                //console.log(e.target.result);
                //throw "stop execution";
                spark.append(e.target.result);                 // append array buffer
                currentChunk++;
                if (currentChunk < chunks) {
                    thisPlugin.resumableJs.loadNext( this.theFile );
                }
                else {
                    console.log("finished loading");
                    console.info("computed hash", spark.end()); // compute hash
                }
            },
            frOnerror : function () {
                console.warn('oops, something went wrong.');
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);

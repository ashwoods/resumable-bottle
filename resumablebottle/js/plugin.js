Modernizr.load([
    {
        test: Modernizr.draganddrop 
            && typeof(File)!=='undefined' 
            && (typeof(Blob)!=='undefined') 
            && (typeof(FileList)!=='undefined') 
            && (!!Blob.prototype.webkitSlice||!!Blob.prototype.mozSlice||Blob.prototype.slice||false),
        yep : ['js/resumable.js','js/spark-md5.min.js'],
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep & nope ) action!
            globals.uploader = 'resumable';
        },
        complete : function() {
            // "complete" callback will be executed after all tests done & file downloading completed
            if( globals.uploader ) {
                // initializing the main upload plugin
                $('#loading_area').css('background-image', 'none');
                $('[data-upload]').css({'visibility':'visible'}).uploadGuard({'uploader':globals.uploader});
            }
        }
    }/*,
    {
        test: ! Modernizr.draganddrop && ! FileReader, // && ! ( 'files' in DataTransfer.prototype ),
        yep : [''],
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep, nope ) action!
            globals.uploader = 'plupload';
        },
        complete : function() {
            // "complete" callback will be executed after all tests
            if( globals.uploader ) {
                // initializing the main upload plugin
            }
        }
    }*/
]);

/**
 *  the main upload scripts handler plugin
 * */
;(function ($, window, document, undefined) {
    var pluginName = "uploadGuard";
    var uploadPlugin = {};
    var defaults = {
        url: null
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
                default:
                break;
            }
        },
        resumableJs : {
            init : function( that ) {
                //this.that = that; // plugin scope
                //console.log( this.that.options.file );
                uploadPlugin.resumableJs = this;
                var r = new Resumable({
                    target: that.options.url
                });
                r.assignDrop( $(that.element) );
                //console.log(r);
                r.on('fileAdded', function(file){
                    theFile = file;
                    chunkSize = 2097152,                               // read in chunks of 2MB
                    chunksAll = Math.ceil(theFile.size / chunkSize),
                    chunks = Math.ceil(theFile.size / chunkSize),
                    currentChunk = 0,

                spark = new SparkMD5.ArrayBuffer(),
                    uploadPlugin.resumableJs.loadNext(file);
                    r.upload();
                });
            },
            loadNext : function(file) {
                fileReader = new FileReader();
                fileReader.onload = uploadPlugin.resumableJs.frOnload;
                fileReader.onerror = uploadPlugin.resumableJs.frOnerror;
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
                    uploadPlugin.resumableJs.loadNext( this.theFile );
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

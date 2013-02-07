/*
 *  uploadGuard.js
 *  Adrian Soluch, adrian@soluch.at
 *
 *  ug_{uniqId}     css class representng the dropzone
 *  ugt_{uniqId}    css class representing the upload data table
 *  ugf_{uniqueId}  unique file identifier
 */


var uploadPlugin = {
    globals : {
        // this var contains a string which 
        // uploadprocess / plugin is gonna be used & is indispensable
        uploader : false,
        // this table serves as template for all upload controls
        table : 
            '<table class="dashboard">'
                +'<tr>'
                    +'<th data-name="thumbnail">Thumbnail</th>'
                    +'<th data-name="name">Name</th>'
                    +'<th data-name="type">Filetype</th>'
                    +'<th data-name="size">Size</th>'
                +'</tr>'
            +'</table>'
    }
};

var uploadGuardInitOptions = function() {
    return {
        // "FileReader", "resumableJs" or "plupload" ( required )
        'uploader' : uploadPlugin.globals.uploader, 
        // upload path / URL ( [data-upload] will be preferred - required )
        'url' : '/upload',
        // when checking a file on the server, which URL to use ( optional )
        'fileCheckPath' : '/check',
        // the table template which will be used as template for the file info dashboard ( optional )
        'uploadControlsTable' : uploadPlugin.globals.table
        // into which html dom element to add the controls ( optional )
        //'uploadControlsTableWrapper' : '#drop_zone_info' 
    }
}

// Browser compatibility test suites
var testForFileAPI = ( Modernizr.draganddrop
                        && ( typeof( File )!=='undefined' ) 
                        && ( typeof( Blob )!=='undefined' ) 
                        && ( typeof( FileList )!=='undefined' ) 
                        && ( !!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice || !!Blob.prototype.slice || false )
                    ) ? true : false;
//var testForFileReader = ( ( typeof( FileReader ) !== 'undefined' ) && testForFileAPI );
//// resumable.js standalone does not need the FileReader interface
//var testForResumableJs = ( ( typeof( FileReader ) === 'undefined' ) && testForFileAPI );

var testForFileReader = ( ( typeof( FileReader ) === 'undefined' ) && testForFileAPI );
var testForResumableJs = ( ( typeof( FileReader ) !== 'undefined' ) && testForFileAPI );

Modernizr.load([
    {
        test : testForFileReader,   // FileReader interface
        yep : ['js/resumable.js','js/spark-md5.min.js', 'js/jquery.knob.js','css/uploadGuard.css'],
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep & nope ) action!
            if( ! uploadPlugin.globals.uploader ) {
                uploadPlugin.globals.uploader = 'FileReader'
            }
        },
        complete : function() {
            if( uploadPlugin.globals.uploader === 'FileReader' ) {
                $('#loading_area').css('background-image', 'none');
                //$('.drop_zones')
                $('[data-upload]')
                    .css({'visibility':'visible'})
                    .uploadGuard(
                        uploadGuardInitOptions()
                    );
            }
        }
    },
    {
        test : testForResumableJs,  // resumable.js
        yep : ['js/resumable.js','js/spark-md5.min.js', 'js/jquery.knob.js','css/uploadGuard.css'],
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep & nope ) action!
            if( ! uploadPlugin.globals.uploader ) {
                uploadPlugin.globals.uploader = 'resumableJs';
            }
        },
        complete : function() {
            // "complete" callback will be executed after all tests done & file downloading completed
            if( uploadPlugin.globals.uploader === 'resumableJs' ) {
                // initializing the main upload plugin
                            console.log( uploadPlugin.globals.init_options );
                $('#loading_area').css('background-image', 'none');
                //$('[data-upload]').css({'visibility':'visible'}).uploadGuard({'uploader':uploadPlugin.globals.uploader});
                $('[data-upload]')
                    .css({'visibility':'visible'})
                    .uploadGuard(
                        uploadGuardInitOptions()
                    );
            }
        }
    },
    {
        test : ! testForResumableJs,    // plupload
        yep : [''],
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep, nope ) action!
            if( ! uploadPlugin.globals.uploader ) {
                uploadPlugin.globals.uploader = 'plupload';
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
(function ($, window, document, undefined) {
    var pluginName = "uploadGuard";
    var thisPlugin = {};
    var defaults = {
        url: null,
        fileCheckPath: null,
        uniqId : null,
        dashboard : {}  // filelist & controls table structure
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

            this.setExtraOptions();

            this.initHtmlControls();

            switch( this.options.uploader ) {
                case 'resumableJs' :
                    this.resumableJs.init( this );
                break;
                case 'FileReader' :
                    this.FileReaderInterface.init( this );
                break;
                default:
                break;
            }
        },
        setExtraOptions : function() {

            if( $(this.element).data('upload') ) { this.options.url = $(this.element).data('upload'); }
            this.options.uniqId = this.generateHash();
            $(this.element).addClass( 'ug_' + this.options.uniqId ); // setting ug_{uniqId} css class
        },
        checkForFileExistence : function( fileData ) {

            $.ajax({
                type: "POST",
                url: this.options.fileCheckPath,
                data: fileData,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function( msg ) {
                    if( msg.pass ) {
                        thisPlugin.FileReaderInterface.prepareUpload();
                    }
                    else {
                        // TODO
                    }
                },
            });
        },
        initHtmlControls : function() {

            if( this.options.uploadControlsTableWrapper ) {

                $( this.options.uploadControlsTableWrapper )
                    .append('<div class="ugt_' + this.options.uniqId + '" />'); // setting ugt_{uniqId} css class
                $( '.ugt_' + this.options.uniqId )
                    .append( this.options.uploadControlsTable );
            }
            else {
                if( this.options.uploadControlsTable ) {
                    // standard-wise the controls table will be added
                    // after the drop zone
                    $(this.element)
                        .after( this.options.uploadControlsTable );
                    $(this.element)
                        .next('table')
                        .wrap('<div class="ugt_' + this.options.uniqId + '" />'); // setting ugt_{uniqId} css class
                    }
            }

            this.tableAnalyzr();

            // populating the table with data
            this.populateHtmlControls();
        },
        tableAnalyzr : function() {
            // generating a template for the table td's & 
            // data bindings for populating the dashboard with file data
            var that = this;
            $( '.ugt_' + this.options.uniqId + ' table th' ).each( function( i, item ) {
                var data = $( item ).data().name;
                var item = '_'+i;
                that.options.dashboard[i] = {
                    'data' : data
                };
            });
        },
        populateHtmlControls : function() {

            if( $(this.element).data('populate-from') ) {
                that = this;

                // fetch data from [data-populate-from]
                $.getJSON( $(this.element).data('populate-from'), function( data ) {

                    // populate table rows with the fetched data
                    $.each( data, function( key, val ) {

                        $( '.ugt_' + that.options.uniqId + ' table' )
                            .append('<tr>'
                                        +'<td>' + val.thumbnail + '</td>'
                                        +'<td>' + val.name + '</td>'
                                        +'<td>' + val.type + '</td>'
                                        +'<td>' + val.size + '</td>'
                                    +'</tr>');
                    });
                });
            }
        },
        generateHash : function() {

            return Math.floor(Math.random()*1000000);
        },
        resumableJs : {

            init : function( that ) {
                var r = new Resumable({
                    target: that.options.url
                });

                thisPlugin = that;
                r.assignDrop( $(that.element) );
                r.on('fileAdded', function(file) {

               //$( '.resumable-list' ).append( '<li class="resumable-file-'+file.uniqueIdentifier+'">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>' );
               //$( '.resumable-file-'+file.uniqueIdentifier+' .resumable-file-name' ).html( file.fileName + ' ' + bytesToSize( file.size, 2 ) + ' <br>' );
                //$('#assets').addTableLine( 'resumable-file-'+file.uniqueIdentifier, file );


                    $( '.ugt_' + that.options.uniqId + ' table' )
                        .append('<tr id="ugf_' + file.uniqueIdentifier + '">'
                                    +'<td>'
                                        +'<input'
                                            +' type="text"'
                                            +' value="0" '
                                            +' data-width="45" '
                                            +' data-height="45" '
                                            +' data-fgColor="#' + Math.floor(Math.random()*16777215).toString(16) + '"'
                                            +' class="progressbar_' + file.uniqueIdentifier + '">'
                                    +'</td>'
                                    +'<td>' + file.fileName + '</td>'
                                    +'<td>' + file.file.type + '</td>'
                                    +'<td>' + file.size + '</td>'
                                +'</tr>');

                    $( '.progressbar_' + file.uniqueIdentifier ).knob();

                    r.upload();
                });

                r.on( 'fileProgress', function( file ) {
                    // Handle progress for both the file and the overall upload
                    $( '.progressbar_' + file.uniqueIdentifier ).val( Math.floor( file.progress()*100 ) ).trigger('change');
                });
            }
        },
        FileReaderInterface : {

            init : function( that ) {

                thisPlugin.FileReaderInterface = this;

                var r = new Resumable({
                    target: that.options.url
                });

                thisPlugin = that;
                r.assignDrop( $(that.element) );
                r.on('fileAdded', function(file) {

                    theFile = file;

                    if( that.options.fileCheckPath ) {

                        var fileMD5 = thisPlugin.FileReaderInterface.generateMD5( file );
                        that.checkForFileExistence( {'name':theFile.fileName, 'size':theFile.size, 'type':theFile.file.type, 'md5':fileMD5} );
                    }
                    else {
                        thisPlugin.FileReaderInterface.prepareUpload();
                    }
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

                chunkSize = 2097152,                               // read in chunks of 2MB
                chunksAll = Math.ceil(theFile.size / chunkSize),
                chunks = Math.ceil(theFile.size / chunkSize),
                currentChunk = 0,
                spark = new SparkMD5.ArrayBuffer(),

                thisPlugin.FileReaderInterface.loadNext();
            },
            loadNext : function() {
                fileReader = new FileReader();
                fileReader.onload = thisPlugin.FileReaderInterface.frOnload;
                fileReader.onerror = thisPlugin.FileReaderInterface.frOnerror;
                var start = currentChunk * chunkSize,
                   end = ((start + chunkSize) >= theFile.size) ? theFile.size : start + chunkSize;
                var blob = theFile.file.slice(start, end);
                fileReader.readAsArrayBuffer(blob);
            },
            frOnload : function(e) {
                console.log("read chunk nr", currentChunk + 1, "of", chunks);
                spark.append(e.target.result);                 // append array buffer
                currentChunk++;
                if (currentChunk < chunks) {
                    thisPlugin.FileReaderInterface.loadNext( this.theFile );
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
            if( ! $.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };
})(jQuery, window, document);

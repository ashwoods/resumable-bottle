/*
 *  uploadGuard.js
 *  Adrian Soluch 2013, adrian@soluch.at
 *
 *  All options may be passed via plugin options as also data attributes
 *  whereby data attributes will always override the equivalent plugin options.
 *
 *  html data options :
 *  ******************
 *  data-drop-zone          this determines the element used as drop zone for resumable.js drag & drop
 *  data-upload             url whereto upload files
 *  data-populate-from      url from where to populate with existing data ( onpageload ), e.g. which file were uploaded so far
 *  data-filecheck-path     url to use when checking a particular file on the server
 *  data-browse-button      element which should be used for file browsing ( optional )
 *
 *
 *  dashboard table data options ( uploadGuard.globals.table ) :
 *  ************************************************************
 *  data-name               for the display order of dashboard elements
 *                          possible features : thumbnail, name, type, size
 *
 *
 *  Unique IDs overview :
 *  ********************
 *  ug_{uniqId}     css class representng the dropzone
 *  ugt_{uniqId}    css class representing the upload data table
 *  ugf_{uniqueId}  unique file identifier
 *
 */


var uploadGuard = {
    globals : {
        // this table serves as template for all upload controls
        table : 
            '<table class="someDashboardClass">'
                +'<thead>'
                    +'<tr>'
                        +'<th>Something</th>'
                        +'<th data-name="thumbnail">Thumbnail</th>'
                        +'<th data-name="name">Name</th>'
                        +'<th data-name="type">Filetype</th>'
                        +'<th data-name="size">Size</th>'
                    +'</tr>'
                +'</thead>'
            +'</table>',
        resumableJsLoad : ['js/resumable.js','js/spark-md5.min.js','js/jquery.knob.js','css/uploadGuard.css'/*,'//cdnjs.cloudflare.com/ajax/libs/datatables/1.9.4/jquery.dataTables.min.js '*/]
    }
};


// Plugin Initialization Options
var uploadGuardInitOptions = function() {
    return {
        // "FileReader", "resumableJs" or "plupload" ( required )
        'uploader' : uploadGuard.globals.uploader, 
        // upload path / URL ( [data-upload] will be preferred - required )
        'url' : '/upload',
        // when checking a file on the server, which URL to use ( optional, also possible through data-filecheck-path data attribute, which will bind stronger )
        'fileCheckPath' : '/check',
        // uploadControlsTable : the table template which will be used as template for the file info dashboard ( optional )
        'uploadControlsTable' : uploadGuard.globals.table,
        // populateDashboardFrom : url from where to populate the dashboard with already existing data ( onpageload )
        // e.g. which file were uploaded so far ( data-populate-from data attribute will bind stronger )
        'populateDashboardFrom' : '/populate2',
        // uploadControlsTableWrapper : into which html dom element to add the controls ( optional )
        //'uploadControlsTableWrapper' : '#drop_zone_info', 
        // knob upload progress options ( optional )
        'knob' : {
            data_width : 35,
            data_height : 35
            //data_fgColor : 'red'
        }
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
            if( ! uploadGuard.globals.uploader ) {
                uploadGuard.globals.uploader = 'FileReader'
            }
        },
        complete : function() {
            if( uploadGuard.globals.uploader === 'FileReader' ) {
                $('#loading_area').css('background-image', 'none');
                //$('.drop_zones')
                $('[data-drop-zone]')
                    .css({'visibility':'visible'})
                    .uploadGuard(
                        uploadGuardInitOptions()
                    );
            }
        }
    },
    {
        test : testForResumableJs,  // resumable.js
        //yep : ['js/resumable.js','js/spark-md5.min.js', 'js/jquery.knob.js','css/uploadGuard.css'],
        yep : uploadGuard.globals.resumableJsLoad,
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep & nope ) action!
            if( ! uploadGuard.globals.uploader ) {
                uploadGuard.globals.uploader = 'resumableJs';
            }
        },
        complete : function() {
            // "complete" callback will be executed after all tests done & file downloading completed
            if( uploadGuard.globals.uploader === 'resumableJs' ) {
                // initializing the main upload plugin
                $('#loading_area').css('background-image', 'none');
                //$('[data-upload]').css({'visibility':'visible'}).uploadGuard({'uploader':uploadGuard.globals.uploader});
                $('[data-drop-zone]')
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
            if( ! uploadGuard.globals.uploader ) {
                uploadGuard.globals.uploader = 'plupload';
            }
        },
        complete : function() {
            if( uploadGuard.globals.uploader === 'plupload' ) {
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
        uniqId : null,
        fileCheckPath: null,
        dashboard : {},  // filelist & controls table structure
        populateDashboardFrom: null,
        knob : {
            data_width : 40,
            data_height : 40,
        }
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
            if( $(this.element).data('filecheck-path') ) { this.options.fileCheckPath = $(this.element).data('filecheck-path'); }
            if( $(this.element).data('populate-from') ) { this.options.populateDashboardFrom = $(this.element).data('populate-from'); }
            this.options.uniqId = this.generateUniqeId();
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
            // data bindings in order to populate the dashboard with file data
            var 
                that = this,
                data;

            $( '.ugt_' + this.options.uniqId + ' table th' ).each( function( i, item ) {

                data = $( item ).data().name;
                that.options.dashboard[i] = {
                    'td' : i,
                    'data' : data
                };
            });
        },
        populateHtmlControls : function() {

            if( this.options.populateDashboardFrom ) {
                var that = this;

                // fetch data from [data-populate-from]
                $.getJSON( this.options.populateDashboardFrom, function( data ) {

                    var $table = $( '.ugt_' + that.options.uniqId + ' table' );

                    if( $table.length > 0 ) {
                        // populate rows with the fetched data & append to the dashboard table
                        $.each( data, function( key, val ) {

                            // building a dashboard table row 
                            var appendTr = '<tr>';
                            $.each( that.options.dashboard, function( key_td, val_td ) {

                                appendTr += '<td>';
                                if( val_td.data ) {
                                    // appending data to table td when existing and matching
                                    appendTr += val[val_td.data];
                                } 
                                appendTr += '</td>';
                            });
                            appendTr += '</tr>';

                            $table
                                .append(
                                    appendTr
                                );
                        });

                        // dataTable jQuery plugin support ( http://www.datatables.net/ )
                        if( jQuery().dataTable ) {
                            $table.dataTable();
                        }
                    }
                });
            }
        },
        generateUniqeId : function() {

            return Math.floor(Math.random()*1000000);
        },
        resumableJs : {

            init : function( that ) {
                var r = new Resumable({
                    target: that.options.url
                });

                thisPlugin = that;

                //var drop_zone = $(that.element).data('drop-zone');
                //console.log( drop_zone);
                //r.assignDrop( drop_zone );
                //
                r.assignDrop( $(that.element) );

                // assigning a browse button
                var browse_button = $(that.element).find('[data-browse-button]');
                if( browse_button.length !== 0 ) {
                    r.assignBrowse( $(browse_button) );
                }

                r.on('fileAdded', function(file) {

               //$( '.resumable-list' ).append( '<li class="resumable-file-'+file.uniqueIdentifier+'">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>' );
               //$( '.resumable-file-'+file.uniqueIdentifier+' .resumable-file-name' ).html( file.fileName + ' ' + bytesToSize( file.size, 2 ) + ' <br>' );
                //$('#assets').addTableLine( 'resumable-file-'+file.uniqueIdentifier, file );

                    if( that.options.knob.data_fgColor ) {
                        var fgColor = that.options.knob.data_fgColor;
                    }
                    else {
                        var fgColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                    }

                    $( '.ugt_' + that.options.uniqId + ' table' )
                        .append('<tr id="ugf_' + file.uniqueIdentifier + '">'
                                    +'<td>'
                                        +'<input'
                                            +' type="text"'
                                            +' value="0" '
                                            +' data-width="' + that.options.knob.data_width + '" '
                                            +' data-height="' + that.options.knob.data_height + '" '
                                            +' data-fgColor="' + fgColor + '"'
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

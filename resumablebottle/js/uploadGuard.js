/*
 *  uploadGuard.js
 *  Adrian Soluch 2013, adrian@soluch.at
 *
 *  All options may be passed via plugin options as also data attributes
 *  whereby data attributes will always override the equivalent plugin options.
 *
 *
 *  html5 data attributes/options :
 *  *******************************
 *  data-drop-zone          this determines the element used as drop zone for resumable.js drag & drop
 *  data-upload             url whereto upload files
 *  data-populate-from      url from where to populate with existing data ( onpageload ), e.g. which file were uploaded so far
 *  data-filecheck-path     url to use when checking a particular file on the server
 *  data-browse-button      element which should be used for file browsing ( optional )
 *
 *
 *  dashboard table ( uploadGuard.globals.table ) :
 *  ***********************************************
 *  The dashboard table specifies the structure of the data container where all information about previous and current uploads is shown.
 *  It's structure should remain as in the example, since it gets extracted for further usage.
 *
 *  dashboard table data options :
 *  data-name               for the display order of dashboard elements
 *                          possible features : thumbnail, name, type, size
 *
 *
 *  Unique IDs overview :
 *  *********************
 *  ug_{uniqId}     css class representng the dropzone
 *  ugt_{uniqId}    css class representing the upload data table
 *  ugf_{uniqueId}  unique file identifier
 *
 */


var uploadGuard = {
    globals : {
        // This table serves as a template for the dashboard & upload controls table.
        // The table <th> data-names will serve as bindings to json attibutes with the same names.
        // at least these following data-names should correspond to their data-role counterparts : thumbnail, name, type, size
        // ( that is for mapping JSON responds to table td's, all other are freely selectable, that means data-name and data-role are identical )
        table : 
            '<table class="someDashboardClass">'
                +'<thead>'
                    +'<tr>'
                        +'<th>Something</th>'
                        +'<th data-name="original_thumbnail" data-role="thumbnail" data-upload-progress="true">Thumbnail</th>'
                        +'<th data-name="original_filename" data-role="name">Name</th>'
                        +'<th data-name="filetype" data-role="type">Filetype</th>'
                        +'<th data-name="original_filesize" data-role="size">Size</th>'
                        +'<th data-name="created" data-role="created">created</th>'
                        +'<th data-name="resource_uri" data-role="resource_uri">resource</th>'
                    +'</tr>'
                +'</thead>'
            +'</table>',
        resumableJsLoadfiles : ['js/resumable.js','js/spark-md5.min.js','js/jquery.knob.js','css/uploadGuard.css'/*,'//cdnjs.cloudflare.com/ajax/libs/datatables/1.9.4/jquery.dataTables.min.js'*/],
        pluploadLoadfiles : ['js/plupload/plupload.full.js','js/plupload/plupload.browserplus.js','js/plupload/jquery.plupload.queue.js'],
        uploadGuardInitOptions : function() {
            // Plugin Initialization Options
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
                // e.g. which files were uploaded so far ( data-populate-from data attribute will bind stronger )
                'populateDashboardFrom' : '/populate2',
                // CSRF token ( optional )
                'csrfToken' : 'abc123',
                // uploadControlsTableWrapper : into which html dom element to add the controls ( optional )
                //'uploadControlsTableWrapper' : '#drop_zone_info', 
                // dataTablesActive : set whether to use dataTables or not ( optional, default : false, http://www.datatables.net/ )
                //'dataTablesActive' : true
                // setting extra options for the resumable.js object, target will be overwritten by the "url" parameter ( optional )
                'resumableJsOptions' : {
                    'chunkSize' : 4*1024*1024, // 4mb
                    'simultaneousUploads' : 5
                },
                // knob upload progress options ( optional )
                'knob' : {
                    data_width : 35,
                    data_height : 35
                    //data_fgColor : 'red'  // standard is a random color for each upload progress knob element
                },
            }
        }
    }
};


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
                $('#loading_area').css('background-image', 'none'); // removing the waiting animated gif
                $('[data-drop-zone]')
                    .css({'visibility':'visible'})
                    .uploadGuard(
                        //uploadGuardInitOptions()
                    );
            }
        }
    },
    {
        test : testForResumableJs,  // resumable.js
        //yep : ['js/resumable.js','js/spark-md5.min.js', 'js/jquery.knob.js','css/uploadGuard.css'],
        yep : uploadGuard.globals.resumableJsLoadfiles,
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
                $('#loading_area').css('background-image', 'none'); // removing the waiting animated gif
                //$('[data-upload]').css({'visibility':'visible'}).uploadGuard({'uploader':uploadGuard.globals.uploader});
                $('[data-drop-zone]')
                    .css({'visibility':'visible'})
                    .uploadGuard(
                        uploadGuard.globals.uploadGuardInitOptions()
                    );
            }
        }
    },
    {
        test : ! testForResumableJs,    // plupload
        yep : uploadGuard.globals.pluploadLoadfiles,
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep, nope ) action!
            if( ! uploadGuard.globals.uploader ) {
                uploadGuard.globals.uploader = 'plupload';
            }
        },
        complete : function() {
            if( uploadGuard.globals.uploader === 'plupload' ) {
                $('#loading_area').css('background-image', 'none'); // removing the waiting animated gif
                $('[data-drop-zone]')
                    .css({'visibility':'visible'})
                    .uploadGuard(
                        uploadGuard.globals.uploadGuardInitOptions()
                    );
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
        dataTablesActive : false,
        resumableJsOptions : {
            target : null,
            chunkSize : 2*1024*1024, // 2mb
            simultaneousUploads : 4,
            throttleProgressCallbacks : 1 
        },
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
                case 'plupload' :
                    this.plupload.init( this );
                break;
                default:
                break;
            }
        },
        setExtraOptions : function() {

            if( $(this.element).data('upload') ) { 
                this.options.url = $(this.element).data('upload'); 
                this.options.resumableJsOptions.target = $(this.element).data('upload'); 
            }
            /*if( $(this.element).data('filecheck-path') ) { 
                this.options.fileCheckPath = $(this.element).data('filecheck-path'); 
            }*/
            if( $(this.element).data('populate-from') ) { this.options.populateDashboardFrom = $(this.element).data('populate-from'); }
            this.options.uniqId = this.generateUniqeId();
            $(this.element).addClass( 'ug_' + this.options.uniqId ); // setting ug_{uniqId} css class
        },
        checkFileBeforeUpload : function( fileData ) {

            var ret = null;
            $.ajax({
                async: false,
                cache: false,
                timeout: 30000,
                type: "POST",
                url: this.options.fileCheckPath,
                data: fileData,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function( msg ) {
                    if( msg.pass === '1' ) {
                        ret = true;
                    }
                    else {
                        ret = false;
                    }
                },
                error: function( msg ) {
                    ret = false;
                },
            });
            return ret;
        },
        generateUniqeId : function() {

            return Math.floor(Math.random()*1000000);
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
                data,
                identifier,
                upload_progress;

            $( '.ugt_' + this.options.uniqId + ' table th' ).each( function( i, item ) {

                data = $( item ).data().role;
                identifier = $( item ).data().name;

                that.options.dashboard[i] = {
                    'td' : i,
                    'data' : data,
                    'identifier' : identifier,
                    'upload_progress' : ( ( $( item ).data().uploadProgress ) ? true : false )
                };
            });
        },
        initDataTables : function( table ) {

            // dataTable jQuery plugin support when possible ( http://www.datatables.net/ )
            if( jQuery().dataTable && this.options.dataTablesActive ) {
                table.dataTable(); // TODO : passing options
            }
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
                            var data = {
                                val : val,
                                role : true
                            };
                            var appendTr = that.generateTableRow( data );

                            $table
                                .append(
                                    appendTr
                                );
                        });

                        // dataTables jQuery plugin
                        that.initDataTables( $table );
                    }
                });
            }
        },
        generateTableRow : function( data ) {

            // dashboard table row rendering method
            //*************************************
            var that = this;
            var tr = ( ( data.uniqueIdentifier ) ? '<tr id="ugf_' + data.uniqueIdentifier + '" >' : '<tr>' );

            $.each( this.options.dashboard, function( key_td, val_td ) {

                tr += '<td>';
                if( val_td.data ) {
                
                    if( data.role ) {
                        if( data.val[val_td.identifier] ) {
                            tr += data.val[val_td.identifier];
                        }
                    }
                    // appending data to table td when existing and matching
                    else if( data.val[val_td.data] ) {
                        tr += data.val[val_td.data];
                    }

                    else {
                        // knob upload progress on the same position as the thumbnail 
                        // which gets exchanged after the upload is finished
                        if( val_td.upload_progress ) {
                            tr += '<input'
                                    +' type="text"'
                                    +' value="0" '
                                    +' data-width="' + that.options.knob.data_width + '" '
                                    +' data-height="' + that.options.knob.data_height + '" '
                                    +' data-fgColor="' + data.knob.fgColor + '"'
                                    +' class="progressbar_' + data.uniqueIdentifier + '">'
                        }
                    }
                } 
                tr += '</td>';
            });
            tr += '</tr>';

            return tr;
        },
        generateMD5 : function( file ) {
            var spark = new SparkMD5();
            spark.append( file.fileName );
            spark.append( file.size );
            spark.append( file.uniqueIdentifier );
            return spark.end();
        },
        resumableJs : {

            init : function( that ) {

                // a separate resumable.js options object literal has to be created,
                // otherwise the settings will be messed up

                var options = {
                    target : that.options.url
                };
                if( that.options.csrfToken ) {
                    options.headers = {"X-CSRFToken": that.options.csrfToken};
                }
                jQuery.extend( options, that.options.resumableJsOptions );
                
                var r = new Resumable(
                    options
                );

                thisPlugin = that;

                r.assignDrop( $(that.element) );

                // assigning a browse button
                var browse_button = $(that.element).find('[data-browse-button]');
                if( browse_button.length !== 0 ) {
                    r.assignBrowse( $(browse_button) );
                }

                r.on('fileAdded', function(file) {

                    var uploadOk = false;
                    if( $(that.element).data('filecheck-path') ) { 
                        that.options.fileCheckPath = $(that.element).data('filecheck-path');
                    }
                    if( that.options.fileCheckPath ) {

                        var fileMD5 = thisPlugin.generateMD5( file );
                        uploadOk = thisPlugin.checkFileBeforeUpload( {'name':file.fileName, 'size':file.size, 'type':file.file.type, 'md5':fileMD5} );
                    }
                    else {
                        // bypass - no check of the file whatsoever
                        uploadOk = true;
                    }

                    // filecheck ok or bypassed
                    if( uploadOk ) {

                        var fgColor = ( ( that.options.knob.data_fgColor ) ? that.options.knob.data_fgColor : '#' + Math.floor(Math.random()*16777215).toString(16) );

                        var data = {
                            uniqueIdentifier : file.uniqueIdentifier,
                            val : {
                                name : file.fileName,
                                size : file.size,
                                type : file.file.type
                            },
                            knob : {
                                fgColor : fgColor
                            }
                        };
                        var appendTr = that.generateTableRow( data );
                        $( '.ugt_' + that.options.uniqId + ' table' )
                            .append( appendTr );

                        $( '.progressbar_' + file.uniqueIdentifier )
                            .knob();

                        r.upload();
                    }
                });

                r.on( 'fileProgress', function( file ) {
                    // Handle progress for both the file and the overall upload
                    $( '.progressbar_' + file.uniqueIdentifier ).val( Math.floor( file.progress()*100 ) ).trigger('change');
                });

                r.on( 'fileSuccess', function( file, message ) {
                    // Reflect that a particular file upload has completed
                });

                r.on( 'fileError', function( file, message ) {
                    // Reflect that a particular file upload has resulted in an error
                });

                r.on('complete', function() {
                    // Reflect that a all uploads are completed
                });
            }
        },
        plupload : {

            init : function( that ) {

                var uploader = new plupload.Uploader({
                    //runtimes : 'html4',
                    //runtimes : 'flash,silverlight,browserplus,html5,html4',
                    runtimes : 'flash',
                    //browse_button : $(that.element).find('[data-browse-button]'),
                    browse_button : 'browsebutton',//$(that.element).find('[data-browse-button]'),
                    //container : $(that.element),
                    //container : 'drop_zone',//$(that.element),
                    url : '/upload/',
                    //headers: {"X-CSRFToken": "{{ csrf_token }}"},
                    //multipart_params : {"X-CSRFToken": "{{ csrf_token }}"},
                    //chunk_size : '2mb',
                    flash_swf_url : 'js/plupload/plupload.flash.swf',
                    //silverlight_xap_url : 'js/plupload/plupload.silverlight.xap'
                });
                
                uploader.init();
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
                        that.checkFileBeforeUpload( {'name':theFile.fileName, 'size':theFile.size, 'type':theFile.file.type, 'md5':fileMD5} );
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

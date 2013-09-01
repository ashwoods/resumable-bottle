<!DOCTYPE html>
<html>
<head>
  <title>uploadGuard</title>

  <style type="text/css">
    #drop_zone {
      padding : 25px;
      border : 1px dashed #bbb;
      -webkit-border-radius : 5px;
         -moz-border-radius : 5px;
              border-radius : 5px;
      text-align : center;
      color : #bbb;
    }
  </style>

  <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
  <script src="js/jquery.knob.js"></script>
  <script src="js/spark-md5.min.js"></script>
  <script src="js/resumable2.js"></script>
  <script src="js/plupload/plupload.full.js"></script>
  <script src="js/plupload/plupload.browserplus.js"></script>
  <script src="js/plupload/jquery.plupload.queue.js"></script>

  <script src="js/uploadGuard/ug.helpers.js"></script>
  <script src="js/uploadGuard/ug.ui.js"></script>
  <script src="js/uploadGuard/ug.api.js"></script>

  <script>

    // UPLOADGUARD OPTIONS
    var ug_options = {
      Resumable : {
        simultaneousUploads : 3,
        target : '/upload'
      },
      plupload : {
        runtimes : 'flash',
        chunk_size : '2mb',
        url : '/upload',
        browse_button : 'browsebutton',
        flash_swf_url : 'js/plupload/plupload.flash.swf'
      }
    };

    // UPLOADGUARD INITIALIZATION HAS TO HAPPEN AFTER DOCREADY
    jQuery(document).ready(function() {

      ug = ug( ug_options );
      console.log( ug );

      /**
       *  RESUMABLE.JS 
       */
      ug.assignDrop( jQuery( '#drop_zone' ) );
      ug.assignBrowse( jQuery( '#browsebutton' ) );

      ug.Resumable.on( 'fileAdded', function( file ) {
        data = {
          uniqueIdentifier : file.uniqueIdentifier,
          name : file.fileName,
          size : file.size,
          type : file.file.type,
          knob : {
            width : 45,
            height : 45,
            fgColor : '#' + Math.floor(Math.random()*16777215).toString(16)
          }
        };

        // ADDING TABLE ROW WITH FILE DATA
        jQuery('#filesdashboard tbody').append( addTableRow( data ) );

        // INITIALIZING KNOB
        progbar_id = '.progressbar_' + file.uniqueIdentifier;
        if( jQuery.fn.knob !== undefined ) {
            jQuery( progbar_id ).knob(); // knob init
        }
        else {
            jQuery( progbar_id ).css({'width':'30px'}).after('%'); // #display % done in input field
        }

        ug.Resumable.upload();
      });


      ug.Resumable.on( 'fileProgress', function( file ) {

          // Handle progress for both the file and the overall upload
          jQuery( '.progressbar_' + file.uniqueIdentifier ).val( Math.floor( file.progress()*100 ) ).trigger('change');
      });

      /**
       *  PLUPLOAD
       */
      ug.plupload.bind( 'FilesAdded', function( up, files ) {
        //console.log( files );
        jQuery.each( files, function( i, file ) {

          var data = {
            uniqueIdentifier : file.id,
            val : {
                name : file.name,
                size : file.size
            },
            knob : {
              width : 45,
              height : 45,
              fgColor : '#' + Math.floor(Math.random()*16777215).toString(16)
            }
          }
          //console.log( data );
          jQuery('#filesdashboard tbody').append( addTableRow( data ) );

          // INITIALIZING KNOB
          console.log( file.id );
          progbar_id = '.progressbar_' + file.id;
          if( jQuery.fn.knob !== undefined ) {
              jQuery( progbar_id ).knob(); // knob init
          }
          else {
              jQuery( progbar_id ).css({'width':'30px'}).after('%'); // #display % done in input field
          }
        });
      });

      jQuery( '#upload_start' ).click( function() {
      });
      //console.log( ug );
    });
  </script>
</head>
<body>
  <div id="content">
    <div id="loading_area">
      <div id="drop_zone" class="drop-zone">
        Drop files here or <a href="#" id="browsebutton" data-browse-button="here" >click to open file browser</a>
      </div>
    </div>
    <button type="button" id="upload_start" style="">Start upload</button> 

    <div id="ouput-list"></div>
    <output id="list"></output>

    <table class="" id="filesdashboard" style="display:block;">
      <thead>
        <tr>
          <th data-name="original_thumbnail" data-role="thumbnail" data-upload-progress="true">Thumbnail</th>
          <th data-name="original_filename" data-role="name">Name</th>
          <th data-name="filetype" data-role="type">Filetype</th>
          <th data-name="original_filesize" data-role="size">Size</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>

  </div>

</body>
</html>

<html>
    <head>
        <title>uploadGuard</title>

        <link rel="stylesheet" type="text/css" href="css/uploadGuard.css">
        
        <style type="text/css">
        TD{font-family: Arial, Helvetica, sans-serif; font-size: 8pt;}
        
        #content {
            width: 1000px;
            margin: 0 auto;
        }
        
        #loading_area {
            background: url('img/waiting.gif') no-repeat center;
        }
        #loading_area #drop_zone {
            visibility: hidden;
        }
        </style>

        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
        <script src="js/jquery.knob.js"></script>
        <script src="js/spark-md5.min.js"></script>
        <script src="js/resumable2.js"></script>
        <script src="js/plupload/plupload.full.js"></script>
        <script src="js/plupload/plupload.browserplus.js"></script>
        <script src="js/plupload/jquery.plupload.queue.js"></script>

        <script src="js/uploadGuard/ug.helpers.js"></script>
        <script src="js/uploadGuard/ug.wrapper.js"></script>
    </head>
    <body>
        <div id="content">
            <table class="someDashboardClass" id="theTable" style="display:none;">
                <thead>
                    <tr>
                        <th data-name="original_thumbnail" data-role="thumbnail" data-upload-progress="true">Thumbnail</th>
                        <th data-name="original_filename" data-role="name">Name</th>
                        <th data-name="filetype" data-role="type">Filetype</th>
                        <th data-name="original_filesize" data-role="size">Size</th>
                        <th data-name="created" data-role="created">created</th>
                        <th data-name="resource_uri" data-role="resource_uri">resource</th>
                        <th>Something</th>
                    </tr>
                    <tr>
                        <td>Some Thumbnail</th>
                        <td>Some Name</th>
                        <td>Some FileType</th>
                        <td>Some Size</th>
                        <td>Created Sometime</th>
                        <td>Some Resource</th>
                    </tr>
                </thead>
            </table>

            <div id="loading_area">
                <div id="drop_zone" class="drop_zones" data-drop-zone="here" data-upload="/upload" data-filecheck-path="/check" data-populate-from="/populate" >
                    Drop files here or <a href="#" id="browsebutton" data-browse-button="here" >click to open file browser</a>
                </div>
                <button type="button" id="plupload-start" style="display: none;">Upload</button> 

                <div id="drop_zone_info">
                </div>
            </div>
        </div>
    <output id="list"></output>
    
    </body>
</html>

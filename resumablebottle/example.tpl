%#template to generate a HTML table from a list of tuples (or list of lists, or tuple of tuples or

<html class="no-js">
    <head>
        <title>uploadGuard</title>
        
        <style type="text/css">
        <!--
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
        -->
        </style>
        <!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>-->
        <!--<script src="http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js"></script>-->
        <script type="text/javascript" src="js/modernizr.full.min.js" charset="utf-8"></script>
        
        <script>
            // setting the timeOut for fileloading
            // a file appears to not be loadable anymore, essential files should be loaded from a different source
            yepnope.errorTimeout = 2000;
        
            Modernizr.load([
                {
                    load : 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js',
                    complete : function () { // the "complete" callback will be executed after the file downloading is completed
                        if( ! window.jQuery ) {
                            Modernizr.load([{
                                load : 'js/jquery.min.js',
                                complete : function () {
                                }
                            }]);
                        }
                    }
                },
                {
                    load : 'js/uploadGuard.js'
                }
            ]);
        </script>
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
                <div id="drop_zone2" class="drop_zones" data-drop-zone="here" data-upload="/upload" data-filecheck-path="/check2" >
                    Drop files here or <a href="#" id="browsebutton2" data-browse-button="here" >click to open file browser</a>
                </div>
            </div>
        </div>
    <output id="list"></output>
    
    </body>
</html>

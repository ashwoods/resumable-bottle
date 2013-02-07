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
--->
/*.example{padding:10px;border:1px solid #ccc}#drop_zone{border:2px dashed #bbb;-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;padding:25px;text-align:center;font:20pt bold,"Vollkorn";color:#bbb}.thumb{height:75px;border:1px solid #000;margin:10px 5px 0 0}#progress_bar{margin:10px 0;padding:3px;border:1px solid #000;font-size:14px;clear:both;opacity:0;-o-transition:opacity 1s linear;-moz-transition:opacity 1s linear;-webkit-transition:opacity 1s linear;-ms-transition:opacity 1s linear}#progress_bar.loading{opacity:1}#progress_bar .percent{background-color:#9cf;height:auto;width:0}#byte_content{margin:5px 0;max-height:100px;overflow-y:auto;overflow-x:hidden}#byte_range{margin-top:5px}*/
</style>
</head>

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

<body>
    <div id="content">
        <div id="loading_area">
            <div id="drop_zone" class="drop_zones" data-upload="/upload" data-populate-from="/populate" >
                Drop files here or <a href="#" id="browsebutton">click to open file browser</a>
            </div>
            <div id="drop_zone_info">
            </div>
            <div id="drop_zone2" class="drop_zones" data-upload="/upload2">
                Drop files here or <a href="#" id="browsebutton2">click to open file browser</a>
            </div>
        </div>
    </div>
<output id="list"></output>

<!--script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script-->
<!--script type="text/javascript" src="https://raw.github.com/23/resumable.js/master/resumable.js"></script-->
<!--script src="https://raw.github.com/satazor/SparkMD5/master/spark-md5.min.js"></script-->
<script>
/*
$(document).ready(function() {
 var r = new Resumable({
  target:'/upload',
});
// Resumable.js isn't supported, fall back on a different method
//r.assignBrowse(document.getElementById('browseButton'));
r.assignDrop(document.getElementById('drop_zone'));
console.log(r);

var frOnload = function(e) {
            console.log("read chunk nr", currentChunk + 1, "of", chunks);
            spark.append(e.target.result);                 // append array buffer
            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            }
            else {
                console.log("finished loading");
                console.info("computed hash", spark.end()); // compute hash
            }
        },
        frOnerror = function () {
            console.warn('oops, something went wrong.');
        };

function loadNext(file) {
            // file = file,
            chunkSize = 2097152,                               // read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();
        console.log(file.size);
        fileReader.onload = frOnload;
        fileReader.onerror = frOnerror;
        var start = currentChunk * chunkSize,
        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        console.log(file);
        var blob = file.file.slice(start, end)
        fileReader.readAsArrayBuffer(blob);
};

r.on('fileAdded', function(file){
    //loadNext(file);
    r.upload();
    });
});*/
</script>
</body>
</html>

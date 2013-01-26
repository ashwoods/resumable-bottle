Modernizr.load([
    {
        //test: Modernizr.fileapi && Modernizr.draganddrop && Modernizr.fileapislice && Modernizr.input.multiple,
        test: Modernizr.draganddrop && FileReader, // && ( 'files' in DataTransfer.prototype ),  // Chrome : Uncaught ReferenceError: DataTransfer is not defined 
        yep : ['js/resumable.js','js/spark-md5.min.js'],
        //yep : ['https://raw.github.com/23/resumable.js/master/resumable.js','https://raw.github.com/satazor/SparkMD5/master/spark-md5.min.js','js/plugin.js'],
        callback: function( url, result, key ) {
            // callback method gets called after every ( yep & nope ) action!
            globals.uploader = 'resumable';
        },
        complete : function() {
            // "complete" callback will be executed after all tests done & file downloading completed
            if( globals.uploader ) {
                // initializing the main upload plugin
                $('#loading_area').css('background-image', 'none');
                $('#drop_zone').css({'visibility':'visible'}).uploadGuard();
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

/*
Modernizr.load([
    {
        load : 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min.js',
        complete : function () { // "complete" callback will be executed after the file downloading is completed
        }
    }
]);
*/

/**
 *  the main upload scripts handler plugin
 * */
;(function ($, window, document, undefined) {
    var pluginName = "uploadGuard";
    var defaults = {
        uploader: null
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
            switch( globals.uploader ) {
                case 'resumable' :
                    //console.log(globals.uploader);
                    this.resumableJs();
                break;
                default:
                break;
            }
        },
        resumableJs: function () {
            var r = new Resumable({
                target:'/upload',
            });
            r.assignDrop( document.getElementById('drop_zone') );
            console.log(r);
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

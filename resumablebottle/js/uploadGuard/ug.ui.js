
"use strict";

/**
 *  UploadGuard
 *  ug.ui.js - Custom User Interface functions/helpers
 *
 */

// SIMPLE TABLE ROW PUTTING TOGETHER FUNCTION
var addTableRow = function( data ) {

  var tr = ( ( data.uniqueIdentifier ) ? '<tr id="ug_' + data.uniqueIdentifier + '" >' : '<tr>' );
    tr += '<td><input'
      +' type="text"'
      +' value="0" '
      +' data-width="' + data.knob.width + '" '
      +' data-height="' + data.knob.height + '" '
      +' data-fgColor="' + data.knob.fgColor + '"'
      +' class="progressbar_' + data.uniqueIdentifier + '">'
    tr += '</td>';
    tr += '<td>' + data.name + '</td>';
    tr += '<td>' + data.type + '</td>';
    tr += '<td>' + data.size + '</td>';
    tr += '<td></td>';

    return tr;
};





'use strict';


/**
 * Dialog(popup) box.
 * @constructor main/dialog
 */

var DIALOG = {};


DIALOG.init = function(){
  
  document.getElementById('BODY')
    .insertAdjacentHTML('beforeend',UTILS.trimHTML(`
      <div id='DIALOG'>
        <div id='DIALOG-inner'></div>
      </div>
     `));
    
  DIALOG.el = document.getElementById('DIALOG')
  DIALOG.el.addEventListener('click', DIALOG.click);
}



DIALOG.click = function(e){
  if(e.target.id === 'DIALOG') DIALOG.close();
}

DIALOG.open = function(html){
  document.getElementById('DIALOG-inner').innerHTML = html;
  document.getElementById('DIALOG').style.display = 'block';
}

DIALOG.close = function(){
  document.getElementById('DIALOG-inner').innerHTML = '';
  document.getElementById('DIALOG').style.display = 'none';
}


// run immiditely
DIALOG.init();
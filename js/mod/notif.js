


'use strict';

var NOTIF = {};


NOTIF.init = function(){
  document.getElementById('BODY').insertAdjacentHTML('beforeend',"<div id='NOTIF'></div>");
  NOTIF.el = document.getElementById('NOTIF');
}



NOTIF.open = function(str){
  var id = 'NOTIF' + Date.now();
  NOTIF.el.insertAdjacentHTML('beforeend',`<div class='NOTIF-items css-rounded' id='${id}'>${str}</div>`);
  setTimeout(function(){
    NOTIF.el.querySelector("#"+id).outerHTML = '';
  },115000);
}


// run immiditely
NOTIF.init();
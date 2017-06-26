


'use strict';


/**
 * XMLHTTPRequest (ajax).
 * @desc manage all in/out request.
 */


MOD.xhr = {};



MOD.xhr.count = 0;
MOD.xhr.init = function(){
  document
    .getElementById('BODY')
    .insertAdjacentHTML('beforeend',
      `<div id='PROGRESS'></div>`);
   MOD.xhr.el = document.getElementById('PROGRESS');
}


// start the request
MOD.xhr.send = function({url, method, data, showProgress, title, bytes}){
  
  return new Promise(function(resolve, reject){
    var i = 'xhr_'+Date.now(); // progress item unique div id
    var x = new XMLHttpRequest();

    // handle the progress bar
    if(showProgress){
      x.onprogress = function(e){
        bytes = bytes || e.total;
        var percentage = (e.loaded / bytes) * 100;
        MOD.xhr.handleProgress('UPD', i, percentage, title);
      };
      x.onloadstart = () => MOD.xhr.handleProgress('ADD',i);
      x.onloadend   = () => MOD.xhr.handleProgress('DEL',i);
    }

    x.onload  = () => x.status === 200 ? resolve(x.response) : reject(x.status);
    x.onerror = () => reject(x.status);
    x.open(method, url);
    data ? x.send(data) : x.send();
  });
}



// progress bar
MOD.xhr.handleProgress = function(type, i, percentage, title){
  title = title || 'connecting..';
  switch(type){
    case 'ADD':
      MOD.xhr.count++;
      MOD.xhr.el.style.height = '100%';
      MOD.xhr.el.insertAdjacentHTML('beforeend',`
        <div id='${i}' class='PROGRESS-item' style='width:0'>connecting..</div>
      `);
      break;
      
    case 'UPD':
      var el = document.getElementById(i);
      el.style.width = percentage+'%';
      el.childNodes[0].textContent = title + ' ' + percentage.toFixed() + '%';
      break;
      
    case 'DEL':
      document.getElementById(i).textContent = 'Completed';
      //setTimeout(function(){
        document.getElementById(i).outerHTML= '';
        MOD.xhr.count--;
        if(!MOD.xhr.count) MOD.xhr.el.style.height = 0;
      //},1000);
      break;
  }
}


MOD.xhr.init();
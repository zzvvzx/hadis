


'use strict';


const DB = {};

DB.content = {};
DB.kitab = {};



window.onloadx = function(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      if(reg.installing) {
        NOTIF.open('preparing for offline access..');
      } else if(reg.waiting) {
        NOTIF.open('Offline data installed');
      } else if(reg.active) {
        NOTIF.open('Running from offline data');
      }
    }).catch(function(error) {
      console.log('Registration failed with ' + error);
    });
  }
}




// async db request
DB.get = async function (i, call){
  var size  = DB.imam[i].filesize;
  var kitab = DB.imam[i].kitab;

  DB.kitab[i] = await MOD.xhr.send({
    url: `data/kitab/${i}.txt`,
    method: 'GET',
    showProgress: false
  });

  DB.content[i] = await MOD.xhr.send({
    url: `data/content/${i}.txt`,
    method: 'GET',
    showProgress: true,
    title: `Loading ${kitab} ${size/1000}Mb `,
    bytes: size * 1000
  });

  DB.kitab[i]   = DB.kitab[i].split('\n');
  DB.content[i] = DB.content[i].split('\n');
  
  if(call) call();
}



// 1.
// get DB meta.json
MOD.xhr.send({
  url: "data/meta.json",
  method: 'GET',
  showProgress: false
})
.then(result => {
  DB.imam = JSON.parse(result);
    
  // 2.
  // initialize main container
  MAIN.init();

});



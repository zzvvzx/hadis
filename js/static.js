

'use strict';


const STATIC = {};

STATIC.pages = {};
STATIC.load = async function(path){

  path = path.toLowerCase();
  if(STATIC.pages[path]) return;
  
  var htmlCenter = '';
  var htmlRight = '';
  
  await MOD.xhr.send({
    url: `pages/${path}.html`,
    method: 'GET',
    showProgress: true
  }).then(result => htmlCenter = result).catch(err => {
    console.log(err)
  });

  await MOD.xhr.send({
    url: `pages/${path}-right.html`,
    method: 'GET',
    showProgress: true
  }).then(result => htmlRight = result).catch(err => {
    console.log(err)
  });
  
  
  htmlCenter = `<div id='${path.toUpperCase()}CENTER' class='MAIN-center'>${htmlCenter}</div>`;
  htmlRight = `<div id='${path.toUpperCase()}RIGHT'>${htmlRight}</div>`;

  MAIN.el.center.insertAdjacentHTML('beforeend', UTILS.trimHTML(htmlCenter));
  MAIN.el.right.insertAdjacentHTML('beforeend', UTILS.trimHTML(htmlRight));
  STATIC.pages[path] = 1;

}


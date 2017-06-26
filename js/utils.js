


'use strict';



const UTILS = {};


UTILS.trimHTML = str => str.replace(/>\s+</g,'><').trim();

UTILS.highlight = function(str){
  if(!str) return;
  return str
    .replace(/\"(.*?)\"/g, '<span class="css-color1 css-italic">"$1"</span>')
    .replace(/\((.*?)\)/g, '<span class="css-color1 css-italic">($1)</span>')
    .replace(/(Rasulullah SAW)/g, '<span class="css-color2">Rasulullah SAW</span>')
    .replace(/(Nabi SAW)/g, '<span class="css-color2">Nabi SAW</span>');
}

UTILS.mark = function(str, word, wholeword){
  if(!str) return;
  var re = wholeword ? 
    new RegExp('\\b'+ word +'\\b','gi'):
    new RegExp(word,'gi');
  return str.replace(re, res => '<span class="css-bg2">'+ res +'</span>');
}


UTILS.toggleActiveMenu = function({target, containerId, className}){
  var el = document.getElementById(containerId).childNodes;
  for(var i = 0; i < el.length; i++){
    if(el[i].classList.value.indexOf(className) !== -1)
       el[i].classList.remove(className);
  }
  target.classList.add(className);
}

UTILS.toggleActiveMenuClass = function({target, containerId, className}){
  var el = document.getElementById(containerId).getElementsByClassName(className)[0];
  if(el) el.classList.remove(className);
  target.classList.add(className);
}


UTILS.hideChildNodes = function(containerId){
  var el = document.getElementById(containerId).childNodes;
  for(var i = 0; i < el.length; i++){
    if(el[i].style.display !== 'none') el[i].style.display = 'none';
  }
}






// local storage shorthand
function getLocalStorage(name){ return JSON.parse(localStorage[name]) }
function setLocalStorage(name,obj){ localStorage[name] = JSON.stringify(obj) }
function xetLocalStorage(name,key,val){
  var c = getLocalStorage(name);
  c[key] = val;
  setLocalStorage(name,c);
}


function getObjectByString(path, obj){
  return path.split('.').reduce((x,y) => x && x[y] || null, obj)
}

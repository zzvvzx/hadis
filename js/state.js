

'use strict';

const STATE = {};


STATE.init = function(name, obj, reset){
  if(!localStorage[name] || reset) setLocalStorage(name, obj);
}


STATE.c = v => v ? 'checked'  : ''; // checkbox
STATE.o = v => v ? 'selected' : ''; // radio

STATE.set = function(name, subname, val){
  var set = getLocalStorage(name);
  set[subname] = val;
  setLocalStorage(name, set);
};

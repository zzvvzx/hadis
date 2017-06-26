

'use strict';

console.log(new Date());
console.time('tes');


var fs = require('fs');

var d = fs.readFileSync('KitabTirmidzi.txt').toString().split('\r\n');
var count = 0;
var err = 0;
var arr = [];


for(var i=0; i<d.length; i++){
  var e;

  e = d[i].split('|');
  e.splice(1,2)
  
  d[i] = e.join('|')

}

d = d.join('\n');
//d = d.replace(/\n/g,' ').replace(/  /g,' ').replace(/$/g,'\n')


fs.writeFileSync('kitab/tirmidzi.txt',d);

console.log(count)
console.timeEnd('tes');
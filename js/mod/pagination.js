

'use strict';


MOD.pagination = {};

MOD.pagination.gen = function({max, step, len, current}){
  
  if(max < step) return '';
  
  max = Math.ceil(max/step);
  var min = 1;
  var mid = (len-2)/2;
  var result = [];
  
  var start = 
    current - mid <= min ? 2 :
    current + mid >= max ? max-(len-2) :
    current - mid;
  
  result.push(min);
  for(var i=0; i<len-2; i++){
    if(start >= max) break
    result.push(start);
    start++ 
  }
  result.push(max);
  
  return result
}




/*
{
  max: 301, // total items
  step: 99, // max items/page
  len: 10,  // max numbering
  current: 1 // current item
}
*/


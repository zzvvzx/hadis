


'use strict';

const VERTICALNAV = {};


VERTICALNAV.init = function(){
  VERTICALNAV.el = {};
  VERTICALNAV.el.main = document.getElementById('VERTICALNAV');
  VERTICALNAV.el.menu = document.getElementById('MENU');
  VERTICALNAV.el.right = document.getElementById('RIGHT');
  VERTICALNAV.el.cover = document.getElementById('VERTICALNAV-cover');
  VERTICALNAV.el.main.addEventListener('click',VERTICALNAV.click);
  VERTICALNAV.el.cover.addEventListener('click',VERTICALNAV.click);
}


VERTICALNAV.click = function(e){

  switch (e.target.dataset.nav) {
  case 'up':
    MOD.scroll.to({elementClass:'MAIN-center',direction:'up'})
    break;
  case 'down':
    MOD.scroll.to({elementClass:'MAIN-center',direction:'down'})
    break;
  case 'showHide':
    VERTICALNAV.showRIGHT(); 
    break;
  }
  
  if(e.target.id === 'VERTICALNAV-cover'){
    VERTICALNAV.hideRIGHT();
  }
  
}


VERTICALNAV.showRIGHT = function(){
  VERTICALNAV.el.menu.classList.add('SIDE-show');
  VERTICALNAV.el.right.classList.add('SIDE-show');
  VERTICALNAV.el.cover.classList.add('SIDE-show');
}

VERTICALNAV.hideRIGHT = function(){
  VERTICALNAV.el.menu.classList.remove('SIDE-show');
  VERTICALNAV.el.right.classList.remove('SIDE-show');
  VERTICALNAV.el.cover.classList.remove('SIDE-show');
}


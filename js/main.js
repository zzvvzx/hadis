


'use strict';

const MAIN = {};



MAIN.init = function () {

  var html = `
    <div id='CENTER'></div>
    <div id='RIGHT'></div>
    <div id='MENU'>
      <img class='MENU-logo' src='img/salallahialaihiwasallam.svg'/>
      <h4>Al-Hadis</h4>
      <div class='MENU-subtitle'>Indonesian Translation</div><br/>
      <div id='MENU-list'>
        <li class='css-link' data-menu='read' id='MENU-READ'>Read</li>
        <ol id='MENU-imams'>
          <li class='css-link css-li-root css-li-root-first' data-imam='bukhari'>Bukhari</li>
          <li class='css-link css-li-root' data-imam='muslim'>Muslim</li>
          <li class='css-link css-li-root' data-imam='abudawud'>Abu Dawud</li>
          <li class='css-link css-li-root' data-imam='tirmidzi'>Tirmidzi</li>
          <li class='css-link css-li-root' data-imam='nasai'>An-Nasai</li>
          <li class='css-link css-li-root' data-imam='ibnumajah'>Ibn Majah</li>
          <li class='css-link css-li-root css-li-root-last' data-imam='malik'>Malik</li>
        </ol>
        <li class='css-link' data-menu='search' id='MENU-SEARCH'>Search..</li><br/>
        <li class='css-link' data-menu_static='resources' id='MENU-RESOURCES'>Resources</li>
        <li class='css-link NOTIF-dot' data-menu_static='about' id='MENU-ABOUT'>About</li><br/>
        <button class='css-button-small css-bg1 css-rounded' id='MENU-SETTINGS'>Settings</button><br/><br/>
        <span class='MENU-copyright'>Tentaralangit.org / 1438H</span>
      </div>
    </div>
    <div id='VERTICALNAV-cover'></div>
    <div id='VERTICALNAV'>
      <div class='VERTICALNAV-item VERTICALNAV-filler' id='VERTICALNAV-filler'></div>
      <div class='VERTICALNAV-item VERTICALNAV-up' data-nav='up'>&#x2C4;</div>
      <div class='VERTICALNAV-item VERTICALNAV-down' data-nav='down'>&#x2C5;</div>
      <div class='VERTICALNAV-item VERTICALNAV-toggle' data-nav='showHide'>&#x22ee;</div>
    </div>
    `;

  MAIN.el = {};
  MAIN.el.body = document.getElementById('BODY');
  MAIN.el.body.insertAdjacentHTML('beforeend', UTILS.trimHTML(html));
  MAIN.el.menu = document.getElementById('MENU');
  MAIN.el.center = document.getElementById('CENTER');
  MAIN.el.right = document.getElementById('RIGHT');
  MAIN.el.menuREAD = document.getElementById('MENU-READ');

  MAIN.el.body.addEventListener('click', MAIN.click);

  // init
  SETTINGS.init();
  VERTICALNAV.init();
  TITLE.set('MENU');
  
  READ.init();

}



MAIN.click = function (e) {
  // main menu
  if (e.target.dataset.menu || e.target.dataset.menu_static) {
    // hide all pages
    UTILS.hideChildNodes('CENTER');
    UTILS.hideChildNodes('RIGHT');
    // exec target command
    if(e.target.dataset.menu){
      try{ eval(e.target.dataset.menu.toUpperCase()).init() }catch(err){} // exec target menu init func
    }
    else STATIC.load(e.target.dataset.menu_static);
    var menu = e.target.dataset.menu || e.target.dataset.menu_static;
    // show target page
    var center = document.getElementById(menu.toUpperCase() + 'CENTER');
    var right  = document.getElementById(menu.toUpperCase() + 'RIGHT');
    if(center) center.style.display = 'block';
    if(right)   right.style.display = 'block';
    // activate clicked menu
    UTILS.toggleActiveMenu({target:e.target, containerId:'MENU-list', className:'css-color1' });
    e.target.classList.remove('NOTIF-dot');
  }


  // menu root-child imam
  else if (e.target.dataset.imam) {
    STATE.set('state__READ', 'current_imam', e.target.dataset.imam);
    MAIN.el.menuREAD.click();
  }

  // global settings button
  else if (e.target.id === 'MENU-SETTINGS') {
    SETTINGS.open();
  }


}







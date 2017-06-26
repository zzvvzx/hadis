


'use strict';

const SETTINGS = {};


SETTINGS.init = function (reset) {
  // use reset(true) to override STATE.init filter
  // by force writing state to localstorage
  STATE.init('state__SETTINGS', {
    "theme": "dark",
    "fontFamily": "Segoe UI",
    "fontSize": '14px',
    "offlineMode": true
  }, reset);
  
  DIALOG.el.addEventListener('change', SETTINGS.change);
  DIALOG.el.addEventListener('click', SETTINGS.change);
  
  SETTINGS.changeTheme();
  SETTINGS.changeFontFamily();
  SETTINGS.changeFontSize();
}


SETTINGS.open = function () {
  var state = getLocalStorage('state__SETTINGS');
  var html = `
    <h3>Settings</h3><br/>
    <h5>Theme</h5>
    <label id='SETTINGS-theme1'><input name='theme' type='radio' data-setting='theme' value='dark' ${STATE.c(state.theme==='dark')}> Dark</label>
    <label id='SETTINGS-theme2'><input name='theme' type='radio' data-setting='theme' value='light' ${STATE.c(state.theme==='light')}> Light</label>
    <br/>
    <h5>Contents</h5>
    <label id='SETTINGS-fontFamily'>
      <select data-setting="fontFamily">
        <option value="Helvetica" ${STATE.o(state.fontFamily==="Helvetica")}>Helvetica / Arial</option>
        <option value="Consolas" ${STATE.o(state.fontFamily==="Consolas")}>Consolas</option>
        <option value="Times New Roman" ${STATE.o(state.fontFamily==="Times New Roman")}>Times New Roman</option>
        <option value="Segoe UI" ${STATE.o(state.fontFamily==="Segoe UI")}>Segoe UI</option>
        <option value="Tahoma" ${STATE.o(state.fontFamily==="Tahoma")}>Tahoma</option>
        <option value="Trebuchet MS" ${STATE.o(state.fontFamily==="Trebuchet MS")}>Trebuchet MS</option>
        <option value="Palatino Linotype" ${STATE.o(state.fontFamily==="Palatino Linotype")}>Platino</option>
      </select> Font Family<br/>
    </label>
    <label id='SETTINGS-fontSize'>
      <select data-setting="fontSize">
        <option value="13px" ${STATE.o(state.fontSize==="13px")}>13px</option>
        <option value="14px" ${STATE.o(state.fontSize==="14px")}>14px</option>
        <option value="16px" ${STATE.o(state.fontSize==="16px")}>16px</option>
      </select> Font Size
    </label>
    <br/>
    <label id='SETTINGS-offlineMode'><input data-setting="offlineMode" type="checkbox" ${STATE.c(state.offlineMode)} disabled/> Enable Offline Mode (acces this site without internet connection.)</label>
    <br/>
    <button id='SETTINGS-reset' class='css-button-small css-bg2' data-setting="reset">Reset all settings</button>
  `;
  DIALOG.open(UTILS.trimHTML(html));
  TITLE.set('SETTINGS');
}





// settings
// onchange event
SETTINGS.change = function (e) {
  switch (e.target.dataset.setting) {
  case 'theme':
    STATE.set('state__SETTINGS', e.target.dataset.setting, e.target.value);
    SETTINGS.changeTheme();
    break;

  case 'fontFamily':
    STATE.set('state__SETTINGS', e.target.dataset.setting, e.target.value);
    SETTINGS.changeFontFamily();
    break;

  case 'fontSize':
    STATE.set('state__SETTINGS', e.target.dataset.setting, e.target.value);
    SETTINGS.changeFontSize();
    break;

  case 'reset':
    SETTINGS.init(true);
    DIALOG.close();
    break;
  }
};





SETTINGS.changeTheme = function () {
  var state = getLocalStorage('state__SETTINGS');
  document.getElementById('CSS-theme').href = `css/theme-${state.theme}.css`;
};

SETTINGS.changeFontFamily = function () {
  var state = getLocalStorage('state__SETTINGS');
  document.documentElement.style.fontFamily = state.fontFamily;
};

SETTINGS.changeFontSize = function () {
  var state = getLocalStorage('state__SETTINGS');
  document.documentElement.style.fontSize = state.fontSize;
};

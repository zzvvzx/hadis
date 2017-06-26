


'use strict';

const READ = {};
  READ.el = {};
  READ.gen = {};

// initialize
READ.init = function () {

  if(READ.el.center){
    READ.gen.rightState();
    return;
  }

  STATE.init('state__READ',{
    "current_content":{
      "bukhari":'1,7,0',
      "muslim":'1,7,0',
      "abudawud":'1,7,0',
      "tirmidzi":'1,7,0',
      "nasai":'1,7,0',
      "ibnumajah":'1,7,0',
      "malik":'1,7,0'
    },
    "current_imam":"bukhari",
    "colorize":true,
    "reverse_sort":false,
    "sort":"default"
  });

  // simple
  // url, querystring
  // router
  var query = document.location.search.substr(1).split(':');
  if(~Object.keys(DB.imam).indexOf(query[0])){
    STATE.set('state__READ', 'current_imam', query[0]);
    READ.route_goto = query[1];
  }

  READ.gen.main();
  READ.el.center        = document.getElementById('READCENTER');
  READ.el.right         = document.getElementById('READRIGHT');
  READ.el.rightState    = document.getElementById('READRIGHT-state');
  READ.el.rightList     = document.getElementById('READRIGHT-list');

  READ.el.right.addEventListener('click', READ.click);
  READ.el.right.addEventListener('change', READ.change);
  READ.el.right.addEventListener('keyup', READ.keyup);

  READ.gen.rightState();
  MOD.scroll.fill('READCENTER');
}



// generate main container
READ.gen.main = function () {
  var centerHtml = `
    <div id='READCENTER' class='MAIN-center'></div>
  `;
  var rightHtml = `
    <div id='READRIGHT'>
      <div id='READRIGHT-state'></div>
      <div id='READRIGHT-list'></div>
    </div>
  `;
  MAIN.el.center.insertAdjacentHTML('beforeend', UTILS.trimHTML(centerHtml));
  MAIN.el.right.insertAdjacentHTML('beforeend', UTILS.trimHTML(rightHtml));
};

// generate right state
READ.gen.rightState = async function () {
  var state = getLocalStorage('state__READ');
  if(!DB.content[state.current_imam]) await DB.get(state.current_imam, false);
  var html = `
    <h5>Tools</h5>
    <input id='READ-goto' class='css-input css-input-flat css-block' type="text" placeholder='Goto: No-Hadis'/>
    <input id='READ-filter' class='css-input css-input-flat css-block' type="text" placeholder='Filter: Phrase'/><br/>
    <h5>Contents</h5>
    <label id='READ-colorize'><input data-setting="colorize" type="checkbox" ${STATE.c(state.colorize)}/> Colorize</label><br/>
    <h5>Kitab list</h5>
    <label id='READ-sort'>
      <select data-setting="sort">
        <option value="default" ${STATE.o(state.sort==="default")}>default</option>
        <option value="alphabetical" ${STATE.o(state.sort==="alphabetical")}>alphabetical</option>
        <option value="itemscount" ${STATE.o(state.sort==="itemscount")}>items count</option>
      </select> Sort
    </label>
    <label id='READ-reverse'><input data-setting="reverse_sort" type="checkbox" ${STATE.c(state.reverse_sort)}/> Descending</label>
    <br/><br/>
  `;
  READ.el.rightState.innerHTML = UTILS.trimHTML(html);
  TITLE.set('READ-right');
  READ.gen.rightList();
  READ.gen.mainList({});

  // activate: Mainmenu > rootitems (current imam)
  var elmenu = document.getElementById('MENU-imams').childNodes;
  for(var i = 0; i < elmenu.length; i++){
    if(elmenu[i].dataset.imam === state.current_imam){
      UTILS.toggleActiveMenu({target:elmenu[i], containerId:'MENU-imams', className:'css-color1' });
      return
    }
  }
};

// generate right items
READ.gen.rightList = function() {
  var state = getLocalStorage('state__READ');
  function list(){
    var arr = DB.kitab[state.current_imam];
    var a =[];
    for(var i=0; i < arr.length; i++){
      var b = arr[i].split('|');
      var c = arr[i+1];
          c = c ? c.split('|')[1] : DB.content[state.current_imam].length;
      var index = b[1] + ',' + c + ',' + i;
      a.push(`
        <tr>
          <td class='css-num css-faded' default>${i+1}</td>
          <td class='css-num css-color1' itemscount>${c-b[1]}</td>
          <td class='css-link css-table' data-rightindex='${index}' alphabetical>${b[0]}</td>
        </tr>
      `);
    }
    // sorting
    if(true){
      // crop "...sorting_selected>{here}<"
      function crop(str){
        var c = str.split(state.sort+'>')[1].split('<')[0];
        return isNaN(c) ? c.toUpperCase() : c;
      }
      // asc or desc
      if(state.reverse_sort)
        isNaN(crop(a[0])) ?
          a.sort((c,b) => crop(b) < crop(c) ? -1:1):
          a.sort((c,b) => crop(b) - crop(c));
      else isNaN(crop(a[0])) ?
          a.sort((b,c) => crop(b) < crop(c) ? -1:1):
          a.sort((b,c) => crop(b) - crop(c));
    }
    return a.join('');
  }
  var html = `
    <h5 id='READ-kitablist'>${DB.imam[state.current_imam].kitab} [${DB.kitab[state.current_imam].length}]</h5>
    <table id='READRIGHT-table'>${list()}</table>`;

  READ.el.rightList.innerHTML = UTILS.trimHTML(html);
  var currentbook = state.current_content[state.current_imam].split(',')[2];
  READ.el.rightList.getElementsByClassName('css-link')[currentbook].click();
};


// generate main content
READ.gen.mainList = function({current, force, filter, mark}) {
  var state = getLocalStorage('state__READ');
  var c = state.current_content[state.current_imam];
  // prevent multiple generation
  if(current === c && !force) return;
  current = current || c;
  // save current current
  state.current_content[state.current_imam] = current;
  STATE.set('state__READ', 'current_content', state.current_content);
  current = current.split(',');

  var count = 0;

  function list(){
    var arr = DB.content[state.current_imam];
    var a   = [''];
    for(var i = current[0]-1; i < current[1]-1; i++){
      var content = arr[i];
      if(filter && arr[i].toLowerCase().indexOf(filter)==-1) continue;
      if(state.colorize) content = UTILS.highlight(content);
      if(mark) content = UTILS.mark(content,mark);
      a.push(`
        <tr>
          <td class='css-num css-faded'>${i+1}</td>
          <td class='css-td-paragraph'>${content}</td>
        </tr>
      `);
      count++
    }
    return a.join('');
  }
  var list = list();
  var judulKitab = DB.kitab[state.current_imam][current[2]].split('|')[0];
  var html = `
    <br/>
    <h2 class='READCENTER-title'>Kitab ${current[2]-0+1}: ${judulKitab} &mdash;</h2>
    <h4> ${DB.imam[state.current_imam].kitab},
    ${current[0]}-${current[1]} / ${DB.content[state.current_imam].length}</h4>
    <div class='READCENTER-subtitle css-color1'>Showing <b>${count}</b> items.</div>
    <table class='READCENTER-table'>${list}</table>
  `;
  READ.el.center.innerHTML = UTILS.trimHTML(html);
  READ.el.center.scrollTop = 0;
  MOD.scroll.refill('READCENTER');

  // routing to hadis number,
  // once only at first.
  if(READ.route_goto){
    READ.goto(READ.route_goto-0);
    READ.route_goto = null;
  }
}







/*
 * all event
 * routed here
 *
 */
READ.click = function (e) {
  // right list item click
  if(e.target.dataset.rightindex){
    READ.gen.mainList({current: e.target.dataset.rightindex});
    UTILS.toggleActiveMenuClass({target:e.target, containerId:'READRIGHT-table', className:'css-bg1' });
  }
}

READ.keyup = function (e) {
  if(e.target.id === 'READ-goto'){
    var val = e.target.value-0;
    if(isNaN(val) || val<1 || val>9999)return;
    clearTimeout(READ.goto_timeout);
    READ.goto_timeout = setTimeout(function(){
      READ.goto(val);
    },1000);
  }
  else if(e.target.id === 'READ-filter'){
    var val = e.target.value;
    clearTimeout(READ.goto_timeout);
    READ.goto_timeout = setTimeout(function(){
      READ.gen.mainList({filter: val, mark: val});
    },1000);
  }
}

READ.change = function(e){
  // state change
  switch(e.target.dataset.setting){
    case 'colorize':
      STATE.set('state__READ', e.target.dataset.setting, e.target.checked);
      READ.gen.mainList({force: true});
      break;
    case 'reverse_sort':
      STATE.set('state__READ', e.target.dataset.setting, e.target.checked);
      READ.gen.rightList();
      break;
    case 'sort':
      STATE.set('state__READ', e.target.dataset.setting, e.target.value);
      READ.gen.rightList();
      break;
  }
}



// on goto keyup
READ.goto = function(number){
  var state = getLocalStorage('state__READ');
  var kitab    = DB.kitab[state.current_imam];
  var result   = kitab.length-1;
  var distance = number - kitab[result].split('|')[1];
  for(var i=0; i<kitab.length; i++){
    var n = kitab[i].split('|')[1];
    if(number < n){
      result = i-1;
      distance = number - kitab[i-1].split('|')[1];
      break;
    }
  }
  READ.el.rightList.getElementsByClassName('css-link')[result].click();
  var target = READ.el.center.getElementsByTagName('tr')[distance];
  target.scrollIntoView();
  target.childNodes[0].classList.add('READCENTER-active');
  READ.el.center.scrollTop = READ.el.center.scrollTop-20;

  if(READ.searchMark)
    target.childNodes[1].innerHTML = UTILS.mark(target.childNodes[1].innerHTML, READ.searchMark);
  READ.searchMark = false;
}





'use strict';

const SEARCH = {};
  SEARCH.el = {};
  SEARCH.gen = {};

// initialize
SEARCH.init = function () {
  
  if(SEARCH.el.center) return;
  STATE.init('state__SEARCH',{
    "wholeword":true,
    "limit":"10",
    "current_imam":"bukhari",
    "colorize":true
  });
  
  var state = getLocalStorage('state__SEARCH');
  SEARCH.result = {};
  SEARCH.rawcontent = {};
  
  SEARCH.gen.main();
  SEARCH.el.center     = document.getElementById('SEARCHCENTER');
  SEARCH.el.right      = document.getElementById('SEARCHRIGHT');
  SEARCH.el.result     = document.getElementById('SEARCH-result');
  SEARCH.el.input      = document.getElementById('SEARCH-input');
  SEARCH.el.clear      = document.getElementById('SEARCH-clear');
  SEARCH.el.status     = document.getElementById('SEARCH-status');
  SEARCH.el.pagination = document.getElementById('SEARCH-pagination');
  
  SEARCH.el.center.style.display = 'block';
  SEARCH.el.right.style.display = 'block';
  
  SEARCH.el.center.addEventListener('click', SEARCH.click);
  SEARCH.el.right.addEventListener('change', SEARCH.change);
  SEARCH.el.input.addEventListener('keyup', SEARCH.search);
  SEARCH.el.clear.addEventListener('click', SEARCH.clear);
  SEARCH.gen.right();
  SEARCH.getDB();
  
}





// generate main container
SEARCH.gen.main = function () {
  var centerHtml = `
    <div id='SEARCHCENTER' class='MAIN-center'>
      <input  id='SEARCH-input' class='css-input' type='text' placeholder='Search: phrase'/>
      <button id='SEARCH-clear' class='css-bg1 css-rounded'>Clear</button>
      <div id='SEARCH-status' class='css-color1'>Ready.</div>
      <div id='SEARCH-pagination'></div>
      <div id='SEARCH-result'></div>
    </div>
    `;
  var rightHtml = `
    <div id='SEARCHRIGHT'>
      <div id='SEARCHRIGHT-state'></div>
    </div>
    `;
  MAIN.el.center.insertAdjacentHTML('beforeend', UTILS.trimHTML(centerHtml));
  MAIN.el.right.insertAdjacentHTML('beforeend', UTILS.trimHTML(rightHtml));
  TITLE.set('SEARCH');
};

// generate right state
SEARCH.gen.right = function () {
  var state = getLocalStorage('state__SEARCH');
  
  function genKitabOptions(){
    var a = [];
    for(var key in DB.imam)
      a.push(`<option value="${key}" ${STATE.o(state.current_imam === key)}>${DB.imam[key].kitab}</option>`);
    return a.join('');
  }
  var html = `
    <h5>Search</h5>
    <label id='SEARCH-wholeword'><input data-setting="wholeword" type="checkbox" ${STATE.c(state.wholeword)}/> Whole word only</label><br/>
    <h5>Contents</h5>
    <label id='SEARCH-colorize'><input data-setting="colorize" type="checkbox" ${STATE.c(state.colorize)}/> Colorize</label>
    <label id='SEARCH-limit'>
      <select data-setting="limit">
        <option value="10" ${STATE.o(state.limit==="10")}>10</option>
        <option value="100" ${STATE.o(state.limit==="100")}>100</option>
        <option value="1000" ${STATE.o(state.limit==="1000")}>1000</option>
      </select> Limit (items/page)
    </label><br/>
    <h5>Target Kitab</h5>
    <label id='SEARCH-imam'><select data-setting="current_imam">${genKitabOptions()}</select> Kitab</label>
  `;
  SEARCH.el.right.innerHTML = UTILS.trimHTML(html);
  TITLE.set('SEARCH-right');
};

// generate main content
SEARCH.gen.result = function(page){
  var state = getLocalStorage('state__SEARCH');
  var count = 0;
  var limit = state.limit;
  var len = SEARCH.result.items.length;
  var start = (page-1) * limit;
  var kitab = DB.imam[state.current_imam].kitab;
  function list(){
    var a = [];
    for(var i=start; i<len; i++){
      if(!limit) break;
      var content = SEARCH.result.items[i][1];
      var nohadis = SEARCH.result.items[i][0];
      if(state.colorize) content = UTILS.highlight(content);
      a.push(`
        <tr>
          <td class='css-num css-faded'>${i+1}</td>
          <td class='css-td-paragraph'>${content}<span class='SEARCH-result-link css-link css-faded' data-goto='${nohadis}'>(${kitab}: ${nohadis})</span>
          </td>
        </tr>
      `);
      count = i;
      limit--;
    }
    if(!a.length) return false;
    return UTILS.mark(UTILS.trimHTML(a.join('')), SEARCH.result.query, state.wholeword);
  }
  var lists = list();
  if(!lists) return SEARCH.el.status.innerHTML = `Not found.`;
  
  SEARCH.el.status.innerHTML = `Showing <b>${start+1}-${count+1}</b> of <b>${len}</b> items.`;
  SEARCH.el.result.innerHTML = `<table class='SEARCH-main-table'>${lists}</table>`;
  SEARCH.el.pagination.innerHTML = SEARCH.gen.pagination({
    current: page,
    max: SEARCH.result.items.length
  });
  MOD.scroll.refill('SEARCHCENTER', true); // reset to 0
}

// generate pagination
SEARCH.gen.pagination = function({current, max}) {
  var state = getLocalStorage('state__SEARCH');
  var pagin = MOD.pagination.gen({
    max: max,
    step: state.limit,
    len: 10,
    current: current
  });
  var h = '';
  var len = pagin.length;
  for(var i=0; i<len; i++){
    var classs = ''; 
    if(i === 0) classs = 'css-pagination-first';
    if(i === len-1) classs = 'css-pagination-last';
    if(pagin[i] === current) classs = 'css-color1';
    h += `<span class='css-pagination-items css-link ${classs}' data-pages='${pagin[i]}'>${pagin[i]}</span>`;
  }
  return h;
}






// search get the db
SEARCH.getDB = async function(){
  var state = getLocalStorage('state__SEARCH');
  if(SEARCH.rawcontent[state.current_imam]) return;
  if(!DB.content[state.current_imam]) await DB.get(state.current_imam, false);
  SEARCH.rawcontent[state.current_imam] = DB.content[state.current_imam].join('|');
}
  

// search engine
SEARCH.engine  = function(query){
  var state = getLocalStorage('state__SEARCH');
  var regexp = state.wholeword ?
    new RegExp('\\b'+query+'\\b','gi'):
    new RegExp(query,'gi');
  // count occurence
  var result   = {};
  result.items = [];
  result.query = query;
  result.count = (SEARCH.rawcontent[state.current_imam].match(regexp) || []).length;
  
  // generate result
  if(result.count && result.count < 9999){ // max 9999 occurence
    var content = DB.content[state.current_imam];
    var len = content.length;
    for(var i=0; i<len; i++)
      if(regexp.test(content[i])) result.items.push([i+1, content[i]]);
  }
  SEARCH.result = result;
}

SEARCH.search = function(e, forced){
  // alphanumeric only!
  if(!((e.keyCode > 47 && e.keyCode < 58) ||
       (e.keyCode > 64 && e.keyCode < 91) || forced )) return;
       
  clearTimeout(SEARCH.timeout);
  var query = SEARCH.el.input.value.trim();
  
  if(query.length > 2){
    SEARCH.timeout = setTimeout(function(){
      SEARCH.el.status.innerHTML = "searching..";
      setTimeout(function(){
        SEARCH.engine(query);
        SEARCH.gen.result(1);
      },1);
    },1000);
  }
}




// clear
SEARCH.clear = function(){
  SEARCH.el.result.innerHTML = '';
  SEARCH.el.status.innerHTML = 'Ready.';
  SEARCH.el.pagination.innerHTML = '';
  SEARCH.el.input.value = '';
}




/*
 * all event
 * routed here
 *
 */
SEARCH.click = function (e) {
  if(e.target.dataset.pages){
    SEARCH.gen.result(Number(e.target.dataset.pages));
  }
  else if(e.target.dataset.goto){
    SEARCH.goto(Number(e.target.dataset.goto));
  }
}

SEARCH.change = function(e){
  // state change
  switch(e.target.dataset.setting){
    case 'wholeword':
      STATE.set('state__SEARCH', e.target.dataset.setting, e.target.checked);
      SEARCH.search(false, true);
      break;
    case 'colorize':
      STATE.set('state__SEARCH', e.target.dataset.setting, e.target.checked);
      SEARCH.gen.result(1);
      break;
    case 'limit':
      STATE.set('state__SEARCH', e.target.dataset.setting, e.target.value);
      SEARCH.gen.result(1);
      break;
    case 'current_imam':
      STATE.set('state__SEARCH', e.target.dataset.setting, e.target.value);
      SEARCH.getDB();
      SEARCH.search(false, true);
      break;
  }
}


SEARCH.goto = function(nohadis){
  var state = getLocalStorage('state__SEARCH');
  STATE.set('state__READ', 'current_imam', state.current_imam);
  MAIN.el.menuREAD.click();
  READ.searchMark = SEARCH.result.query;
  READ.goto(nohadis);
}

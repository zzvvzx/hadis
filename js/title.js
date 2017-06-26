

'use strict';


const TITLE = {};

TITLE.init = function(){
  
  TITLE.set = {};
  function set(id, text){
    document.getElementById(id).setAttribute('title', text);
  }
  
  
  TITLE.set = function(section){
    try{
      switch(section){
        
        case 'MENU':
        set('MENU-READ','Read the hadis');
        set('MENU-SEARCH','Advanced search');
        set('MENU-RESOURCES','Other useful Resources and References');
        set('MENU-ABOUT','About, Developer notes, Contacts, etc');
        set('MENU-SETTINGS','Global settings and preferences');
        break;

        case 'READ-right':
        set('READ-goto','Go to specified hadis by entering hadis number');
        set('READ-filter','Show only hadis that included specified word or phrase');
        set('READ-colorize','Colorize content');
        set('READ-sort','Sort itab list by: default, aphabetical or items count');
        set('READ-reverse','Reverse sorting of kitab list (descending)');
        break;

        case 'SEARCH':
        set('SEARCH-input','Enter phrase to search');
        set('SEARCH-clear','Clear search results');
        break;

        case 'SEARCH-right':
        set('SEARCH-wholeword','Search whole word only');
        set('SEARCH-colorize','Colorize content');
        set('SEARCH-limit','Limit number of result item per page');
        set('SEARCH-imam','Target kitab to search');
        break;

        case 'SETTINGS':
        set('SETTINGS-theme1','Change theme to "Dark green"');
        set('SETTINGS-theme2','Change theme to "Light blue"');
        set('SETTINGS-fontFamily','Choose global font family');
        set('SETTINGS-fontSize','Choose global font size');
        set('SETTINGS-offlineMode','Enable offline mde capabilities');
        set('SETTINGS-reset','Reset all settings to default');
        break;
        
      }
    }catch(e){console.log(e)}
  }

}

TITLE.init();



'use strict';

MOD.scroll = {};


MOD.scroll.refill = function(containerEl, empty){
  if(empty){
    document.getElementById('VERTICALNAV-filler').style.height = 0;
    return
  };
  if(window.innerWidth > 600) return;
  var x = ((0 + window.innerHeight) / document.getElementById(containerEl).scrollHeight) * 100 | 0;
  document.getElementById('VERTICALNAV-filler').style.height = (100 - x) + '%';
}

MOD.scroll.fill = function (containerEl) {
  if(window.innerWidth > 600) return;
  containerEl  = document.getElementById(containerEl);
  var fillerEl = document.getElementById('VERTICALNAV-filler');
  var lastScrollPos = 0;
  var ticking = false; // unblock the on-scrolling event
  var clientHeight = window.innerHeight;
  
  function doSomething(scroll_pos) {
    var x = ((scroll_pos + clientHeight) / containerEl.scrollHeight) * 100 | 0;
    fillerEl.style.height = (100 - x) + '%';
  }
  containerEl.addEventListener('scroll', function (e) {
    lastScrollPos = e.target.scrollTop;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        doSomething(lastScrollPos);
        ticking = false;
      });
    }
    ticking = true;
  });

};



MOD.scroll.to = function ({
  elementId,
  elementClass,
  direction
}) {
  clearTimeout(timeout); // prevent race propagation

  var i = 3; // min iteration to emulating fake smooth scroll
  var el = elementId ? 
    document.getElementById(elementId) :
    document.querySelector('.'+ elementClass +':not([style*="display:none"])');
  var scHeight = el.scrollHeight;
  var clHeight = window.clientHeight;
  var diff = scHeight / i;
  var timeout;

  scroll();

  function scroll() {
    if (i) {
      i--;
      direction === 'up' ? // 'up' ? up : down
      el.scrollTop -= diff :
      el.scrollTop += diff;
      timeout = setTimeout(scroll, 10);
    } else
      clearTimeout(timeout);
  }
}

// cfpages.js
(function() {
  var hostname = window.location.hostname;
  
  if (hostname === 'lyang1273.github.io') {
    var topLoc = window.top.location;
    var newUrl = 'https://lyang1273-github-io.pages.dev' + 
      (topLoc.pathname || '/') + 
      (topLoc.search || '') + 
      (topLoc.hash || '');
    
    window.top.location.replace(newUrl);
  }
})();
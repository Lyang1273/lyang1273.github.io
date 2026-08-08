(function() {
  var hostname = window.location.hostname;
  
  if (hostname === 'lyang1273.github.io') {
    var path = window.location.pathname || '/';
    var search = window.location.search || '';
    var hash = window.location.hash || '';
    
    var newUrl = 'https://lyang1273-github-io.pages.dev' + path + search + hash;
    window.location.href = newUrl;
  }
})();
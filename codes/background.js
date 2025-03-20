const excludedDomains = ["example.com", "google.com"];

function isExcluded(domain) {

  let cleanedDomain = domain.startsWith('.') ? domain.substring(1) : domain;
  return excludedDomains.some(excluded => cleanedDomain.includes(excluded));
}

function clearCookies() {
  chrome.cookies.getAll({}, function(cookies) {
    cookies.forEach(cookie => {
      if (!isExcluded(cookie.domain)) {

        let protocol = cookie.secure ? "https://" : "http://";
        let url = protocol + cookie.domain.replace(/^\./, '') + cookie.path;
        chrome.cookies.remove({
          url: url,
          name: cookie.name,
          storeId: cookie.storeId
        }, function(removedCookie) {
          if (chrome.runtime.lastError) {
            console.error("Error removing cookie:", chrome.runtime.lastError);
          } else {
            console.log("Removed cookie:", removedCookie);
          }
        });
      } else {
        console.log("Excluded cookie from domain:", cookie.domain);
      }
    });
  });
}

chrome.action.onClicked.addListener(() => {
  clearCookies();
});

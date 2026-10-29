/* Safety net, loaded before everything else.
   If the engine fails to start (script error, missing file), show the static
   #fallback section from index.html instead of a blank page.
   app.js sets window.engineReady = true once the first slide is on screen. */
(function () {
  function fail() {
    if (window.engineReady) return; // errors after start-up don't replace a working site
    document.documentElement.classList.add("failed");
  }
  window.engineFail = fail;
  addEventListener("error", fail);
  // A script that never loaded throws nothing, so also check once the page has finished loading.
  addEventListener("load", function () { if (!window.engineReady) fail(); });
})();

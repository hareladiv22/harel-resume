/* Safety net, loaded before everything else.
   If the engine fails to start (script error, missing file), show the static
   #fallback section from index.html instead of a blank page.
   app.js sets window.engineStarted when it runs, and window.engineReady = true once
   the first slide is on screen (after content.json has loaded). */
(function () {
  function fail() {
    if (window.engineReady) return; // errors after start-up don't replace a working site
    document.documentElement.classList.add("failed");
  }
  window.engineFail = fail;
  addEventListener("error", fail);
  // app.js that never loaded throws nothing, so also check once the page has finished loading.
  // (content.json loads after that; app.js reports its own failures through engineFail.)
  addEventListener("load", function () { if (!window.engineStarted) fail(); });
})();

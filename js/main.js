// ── INIT ──
function init() {
  loadTheme(); loadSeen(); updateSubUI();
  loadNewsCache();
  loadWxCache();
  renderWeather();
  fetchAll(); startTimer(); setupSearch();
  fetchWeatherRealtime();
  setInterval(fetchWeatherRealtime, 10 * 60 * 1000);
  checkEarthquakeAlert();
  setInterval(checkEarthquakeAlert, 10 * 60 * 1000);
  applyResponsive();
  window.addEventListener('resize', applyResponsive);
  document.getElementById('pwOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closePW(); });
  document.getElementById('wmOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeWeatherModal(); });
  document.getElementById('eqOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeEarthquakeModal(); });
  document.getElementById('nsOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeNewsModal(); });
  initFifa();
}

init();

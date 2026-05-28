/**
 * GLITCHPOINT_OS — core.js (v21.0.0 — Updated)
 * Script base compartido por sub-páginas (logs/, gp001, etc.)
 * NO se usa en index.html (éste tiene sus propios scripts modulares).
 */

// Uptime / Clock para sub-páginas que tienen esos IDs
(function () {
  const headerUp = document.getElementById('uptime-header');
  const footerUp = document.getElementById('uptime-footer');
  const clockHead = document.getElementById('clock-header');
  const sessionStart = Date.now();

  if (headerUp || footerUp || clockHead) {
    setInterval(function () {
      const elapsed = Date.now() - sessionStart;
      const sec = Math.floor(elapsed / 1000);
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      if (headerUp) headerUp.textContent = h + 'h ' + m + 'm ' + s + 's';
      if (footerUp) footerUp.textContent = elapsed;
      const d = new Date();
      if (clockHead) clockHead.textContent = d.toTimeString().slice(0, 8);
    }, 1000);
  }
})();

// Glitch burst global (sub-páginas)
(function () {
  function burst() {
    document.body.classList.add('glitch-burst');
    setTimeout(function () { document.body.classList.remove('glitch-burst'); }, 180);
    setTimeout(burst, 18000 + Math.random() * 18000);
  }
  setTimeout(burst, 7000);
})();

// Tab title (sub-páginas)
(function () {
  const originalTitle = document.title;
  if (originalTitle.includes('404')) return;
  const alt = ['> \u00bfme ves?', '// she is watching //', originalTitle];
  let i = 0;
  setInterval(function () {
    document.title = alt[i++ % alt.length];
    setTimeout(function () { document.title = originalTitle; }, 2500);
  }, 14000);
})();

// Typewriter para sub-páginas
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.typewriter-text').forEach(function (el) {
      const text = el.getAttribute('data-text');
      if (!text) return;
      el.textContent = '';
      let i = 0;
      function type() {
        if (i < text.length) {
          el.textContent += text.charAt(i++);
          setTimeout(type, 16 + Math.random() * 18);
        } else {
          el.classList.remove('typewriter-cursor');
        }
      }
      setTimeout(type, Math.random() * 400);
    });
  });
})();

// Korrok Protocol (sub-páginas)
(function () {
  let buf = '';
  document.addEventListener('keydown', function (e) {
    if (e.key.length > 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-6);
    if (buf === 'korrok') triggerKorrok();
  });

  function triggerKorrok() {
    const warn = document.getElementById('breach-warning');
    if (warn) warn.style.display = 'block';
    document.querySelectorAll('.korrok-wrapper').forEach(function (el) { el.classList.add('active'); });
    document.querySelectorAll('.korrok-box').forEach(function (el) { el.classList.add('active'); });
    document.title = 'KORROK_REVEALED';
    document.documentElement.style.setProperty('--term-green', '#ff0000');
    document.documentElement.style.setProperty('--term-cyan', '#ff0000');
    document.documentElement.style.setProperty('--os-bg', '#110000');
  }
})();

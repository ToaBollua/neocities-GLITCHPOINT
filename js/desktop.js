/**
 * GLITCHPOINT_OS — Desktop Window Manager v21.0.0
 * Sistema de ventanas arrastrables, redimensionables, con z-index dinámico.
 * Carga contenido via iframe. Gestiona: abrir, cerrar, minimizar, maximizar.
 */
(function () {
  'use strict';

  // ── Configuración de ventanas ────────────────────────────────────────────────

  const WIN_CONFIG = {
    h0p3_core: {
      title: 'H0P3_CORE // ENTITY_MONITOR',
      url: 'os/h0p3_core.html',
      w: 820, h: 600,
      icon: '[■]',
      color: '#ff0022',
      startX: 120, startY: 60
    },
    restricted_sector: {
      title: 'RESTRICTED_SECTOR // CL-4',
      url: 'os/restricted_sector.html',
      w: 720, h: 520,
      icon: '[🔒]',
      color: '#ff8800',
      startX: 160, startY: 80
    },
    observation_logs: {
      title: 'OBSERVATION_LOGS // PRIVATE',
      url: 'os/observation_logs.html',
      w: 760, h: 560,
      icon: '[LOG]',
      color: '#00cfff',
      startX: 100, startY: 70
    },
    anomaly_protocol: {
      title: 'ANOMALY_PROTOCOL // ACTIVE',
      url: 'os/anomaly_protocol.html',
      w: 680, h: 500,
      icon: '[⚠]',
      color: '#ff00ff',
      startX: 140, startY: 90
    },
    terminal: {
      title: 'VOID_CONSOLE.exe // ROOT',
      url: 'os/terminal.html',
      w: 720, h: 520,
      icon: '[>_]',
      color: '#00ff41',
      startX: 80, startY: 50
    },
    trash_bin: {
      title: 'TRASH_BIN // DELETED_ITEMS',
      url: 'os/trash_bin.html',
      w: 640, h: 420,
      icon: '[x]',
      color: '#4a4a4a',
      startX: 200, startY: 100
    }
  };

  let zTop = 200;
  const openWindows = {}; // id → DOM element
  const prevSizes = {};   // id → { left, top, w, h } before maximize

  // ── Abrir ventana dinámica (Dossiers) ────────────────────────────────────────

  window.openDossier = function (id, title, url, color) {
    if (!WIN_CONFIG[id]) {
      WIN_CONFIG[id] = {
        title: title || 'DOCUMENT // FILE',
        url: url,
        w: 780, h: 560,
        icon: '[DOC]',
        color: color || '#00cfff',
        startX: 120 + Math.floor(Math.random() * 60),
        startY: 70 + Math.floor(Math.random() * 40)
      };
    }
    window.openWindow(id);
  };

  // ── Abrir ventana ────────────────────────────────────────────────────────────

  window.openWindow = function (id) {
    if (window.GP_ACTION) window.GP_ACTION('win_open_' + id);

    // Ya existe → traer al frente / restaurar
    if (openWindows[id]) {
      const existing = openWindows[id];
      existing.classList.remove('win-minimized');
      bringToFront(existing);
      return;
    }

    const cfg = WIN_CONFIG[id];
    if (!cfg) return;

    const win = buildWindow(id, cfg);
    const container = document.getElementById('windows-container');
    if (!container) return;
    container.appendChild(win);
    openWindows[id] = win;

    bringToFront(win);

    // Animación de entrada
    requestAnimationFrame(() => win.classList.add('win-open'));
  };

  // ── Construir DOM de ventana ─────────────────────────────────────────────────

  function buildWindow(id, cfg) {
    const win = document.createElement('div');
    win.className = 'os-window';
    win.id = 'win-' + id;
    win.dataset.winId = id;

    // Posición y tamaño inicial (limitado al viewport)
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const actualW = Math.min(cfg.w, vw - 10);
    const actualH = Math.min(cfg.h, vh - 50); // dejar espacio para la taskbar
    const x = Math.max(5, Math.min(cfg.startX + Math.random() * 60, vw - actualW - 5));
    const y = Math.max(45, Math.min(cfg.startY + Math.random() * 40, vh - actualH - 5));

    win.style.cssText = `left:${x}px;top:${y}px;width:${actualW}px;height:${actualH}px;--win-accent:${cfg.color};`;

    win.innerHTML = `
      <div class="win-titlebar" data-win-id="${id}">
        <span class="win-icon">${cfg.icon}</span>
        <span class="win-title-text" data-original-title="${cfg.title}">${cfg.title}</span>
        <div class="win-controls">
          <button class="win-btn win-minimize" title="Minimize" onclick="minimizeWindow('${id}')">─</button>
          <button class="win-btn win-maximize" title="Maximize" onclick="maximizeWindow('${id}')">□</button>
          <button class="win-btn win-close" title="Close" onclick="closeWindow('${id}')">✕</button>
        </div>
      </div>
      <div class="win-body">
        <iframe src="${cfg.url}" title="${cfg.title}" allowfullscreen></iframe>
      </div>
      <div class="win-resize-handle win-resize-se" data-win-id="${id}"></div>
    `;

    const iframe = win.querySelector('iframe');
    iframe.addEventListener('load', function() {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc && doc.body && doc.body.classList.contains('scrollable-doc')) {
          doc.documentElement.style.setProperty('overflow', 'auto', 'important');
          doc.documentElement.style.setProperty('height', '100%', 'important');
          doc.body.style.setProperty('overflow', 'auto', 'important');
          doc.body.style.setProperty('height', 'auto', 'important');
        }
      } catch (e) {
        // Ignorar errores cross-origin si el iframe carga páginas externas
      }
    });

    // Drag desde titlebar
    makeDraggable(win, win.querySelector('.win-titlebar'));

    // Resize desde esquina SE
    makeResizable(win, win.querySelector('.win-resize-se'));

    // Click en ventana → traer al frente
    win.addEventListener('pointerdown', () => bringToFront(win), {capture: true});

    return win;
  }

  // ── Controles de ventana ─────────────────────────────────────────────────────

  window.closeWindow = function (id) {
    const win = openWindows[id];
    if (!win) return;
    win.classList.remove('win-open');
    win.classList.add('win-closing');
    setTimeout(() => {
      win.remove();
      delete openWindows[id];
    }, 300);
  };

  window.minimizeWindow = function (id) {
    const win = openWindows[id];
    if (!win) return;
    win.classList.toggle('win-minimized');
  };

  window.maximizeWindow = function (id) {
    const win = openWindows[id];
    if (!win) return;

    if (win.classList.contains('win-maximized')) {
      // Restaurar
      const prev = prevSizes[id];
      if (prev) {
        win.style.left = prev.x + 'px';
        win.style.top = prev.y + 'px';
        win.style.width = prev.w + 'px';
        win.style.height = prev.h + 'px';
      }
      win.classList.remove('win-maximized');
    } else {
      // Guardar tamaño previo
      prevSizes[id] = {
        x: parseInt(win.style.left),
        y: parseInt(win.style.top),
        w: win.offsetWidth,
        h: win.offsetHeight
      };
      // Maximizar (ocupa desktop area, debajo de taskbar)
      const tbH = document.getElementById('taskbar')?.offsetHeight || 36;
      win.style.left = '0px';
      win.style.top = tbH + 'px';
      win.style.width = '100vw';
      win.style.height = `calc(100vh - ${tbH}px)`;
      win.classList.add('win-maximized');
    }
  };

  // ── Z-index ──────────────────────────────────────────────────────────────────

  function bringToFront(win) {
    zTop++;
    win.style.zIndex = zTop;
    // Quitar clase activa de todas
    document.querySelectorAll('.os-window').forEach(w => w.classList.remove('win-active'));
    win.classList.add('win-active');
  }

  // ── Drag ─────────────────────────────────────────────────────────────────────

  function makeDraggable(win, handle) {
    let dragging = false, startX, startY, origLeft, origTop;

    handle.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.win-controls')) return; // no arrastrar desde botones
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parseInt(win.style.left) || 0;
      origTop = parseInt(win.style.top) || 0;
      handle.style.cursor = 'grabbing';
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    handle.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const tbH = document.getElementById('taskbar')?.offsetHeight || 36;
      win.style.left = Math.max(0, origLeft + dx) + 'px';
      win.style.top = Math.max(tbH, origTop + dy) + 'px';
    });

    handle.addEventListener('pointerup', function (e) {
      if (dragging) {
        dragging = false;
        handle.style.cursor = '';
        handle.releasePointerCapture(e.pointerId);
      }
    });
    
    // Fallback if pointer goes missing
    handle.addEventListener('pointercancel', function (e) {
      dragging = false;
      handle.style.cursor = '';
    });
  }

  // ── Resize ───────────────────────────────────────────────────────────────────

  function makeResizable(win, handle) {
    let resizing = false, startX, startY, origW, origH;

    handle.addEventListener('pointerdown', function (e) {
      resizing = true;
      startX = e.clientX;
      startY = e.clientY;
      origW = win.offsetWidth;
      origH = win.offsetHeight;
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
    });

    handle.addEventListener('pointermove', function (e) {
      if (!resizing) return;
      const newW = Math.max(280, origW + (e.clientX - startX));
      const newH = Math.max(200, origH + (e.clientY - startY));
      win.style.width = newW + 'px';
      win.style.height = newH + 'px';
    });

    handle.addEventListener('pointerup', function (e) {
      if (resizing) {
        resizing = false;
        handle.releasePointerCapture(e.pointerId);
      }
    });
    
    handle.addEventListener('pointercancel', function (e) {
      resizing = false;
    });
  }

  // ── Taskbar Clock ────────────────────────────────────────────────────────────

  function updateTaskbarClock() {
    const clockEl = document.getElementById('tb-clock');
    const uptimeEl = document.getElementById('tb-uptime');
    if (!clockEl && !uptimeEl) return;

    const sessionStart = Date.now();

    setInterval(() => {
      const now = new Date();
      if (clockEl) clockEl.textContent = now.toTimeString().slice(0, 8);

      if (uptimeEl) {
        const totalSec = Math.floor((window.GP_STATE?.totalTime || 0));
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        uptimeEl.textContent = `${h}h ${m}m ${s}s`;
      }
    }, 1000);
  }

  // ── Tab title perturbador ────────────────────────────────────────────────────

  function initTabTitle() {
    const titles = [
      '> ¿me ves?',
      '// she is watching //',
      'GLITCHPOINT_OS',
      'H0P3_CORE: ONLINE',
      '> contente. por ahora.',
      'ARCHITECT_TERMINAL'
    ];
    let i = 0;
    setInterval(() => {
      const stage = window.GP_STAGE ? window.GP_STAGE() : 1;
      if (stage >= 2) {
        document.title = titles[i % titles.length];
        i++;
      }
    }, 8000);
  }

  // ── Glitch burst global ──────────────────────────────────────────────────────

  function initGlitchBursts() {
    function burst() {
      document.body.classList.add('glitch-burst');
      setTimeout(() => document.body.classList.remove('glitch-burst'), 180 + Math.random() * 120);
      const stage = window.GP_STAGE ? window.GP_STAGE() : 1;
      const minDelay = stage === 3 ? 4000 : stage === 2 ? 10000 : 18000;
      setTimeout(burst, minDelay + Math.random() * minDelay);
    }
    setTimeout(burst, 6000);
  }

  // ── Desktop listo ────────────────────────────────────────────────────────────

  document.addEventListener('gp:desktopReady', function () {
    updateTaskbarClock();
    initTabTitle();
    initGlitchBursts();

    // Doble clic en ícono abre ventana
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('dblclick', function () {
        const id = this.dataset.winTarget;
        if (id && window.openWindow) window.openWindow(id);
      });
    });
  });

})();

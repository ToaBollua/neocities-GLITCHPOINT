/**
 * GLITCHPOINT_OS — Corruption Engine v21.0.0
 * Sistema de Corrupción Progresiva — 3 Etapas
 *
 * Etapa 1 — STABLE:   < 90s acumulados O < 10 acciones
 * Etapa 2 — DEGRADED: 90s - 240s O 10-30 acciones
 * Etapa 3 — CRITICAL: > 240s O > 30 acciones
 *
 * Persistencia via localStorage. Funciona en todas las páginas del dominio.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'gp_state_v21';

  const DEFAULT_STATE = {
    firstVisit: null,
    totalTime: 0,      // segundos acumulados en el sitio
    actions: 0,        // acciones registradas
    stage: 1,
    logsRead: [],
    terminalCmds: [],
    bootCompleted: false,
    lastSeen: null
  };

  // ── Carga / Guarda ──────────────────────────────────────────────────────────

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE, firstVisit: Date.now(), lastSeen: Date.now() };
      return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch (e) {
      return { ...DEFAULT_STATE, firstVisit: Date.now(), lastSeen: Date.now() };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(window.GP_STATE));
    } catch (e) { /* silently fail — quota exceeded or private mode */ }
  }

  // ── Estado global ────────────────────────────────────────────────────────────

  window.GP_STATE = loadState();
  if (!window.GP_STATE.firstVisit) window.GP_STATE.firstVisit = Date.now();

  // ── Cálculo de Etapa ─────────────────────────────────────────────────────────

  function recalculateStage() {
    const secs = window.GP_STATE.totalTime;
    const acts = window.GP_STATE.actions;

    let newStage = 1;
    if (secs >= 240 || acts >= 30) newStage = 3;
    else if (secs >= 90 || acts >= 10) newStage = 2;

    if (newStage !== window.GP_STATE.stage) {
      window.GP_STATE.stage = newStage;
      applyStageToDOM(newStage);
      document.dispatchEvent(new CustomEvent('gp:stageChange', { detail: { stage: newStage } }));
    }

    return window.GP_STATE.stage;
  }

  // ── Aplicar efectos visuales según etapa ────────────────────────────────────

  function applyStageToDOM(stage) {
    document.body.dataset.corruptionStage = stage;

    // Taskbar indicator
    const stageEl = document.getElementById('tb-stage-indicator');
    if (stageEl) {
      const labels = { 1: 'STABLE', 2: 'DEGRADED', 3: 'CRITICAL' };
      const colors = { 1: 'var(--os-green)', 2: 'var(--os-amber)', 3: 'var(--os-red)' };
      stageEl.textContent = `STAGE_${labels[stage]}`;
      stageEl.style.color = colors[stage];
    }

    // Etapa 2+: Agitar ventanas aleatoriamente
    if (stage >= 2) {
      startWindowDrift();
    }

    // Etapa 3: Corrupción de texto en títulos de ventana
    if (stage >= 3) {
      startTitleCorruption();
      scheduleSpontaneousWindow();
    }
  }

  // ── Efectos de Corrupción ────────────────────────────────────────────────────

  const GLITCH_CHARS = '░▒▓█▄▀■□▪▫◘◙◚◛◜◝◞◟◠◡!@#$%^&*~`';

  /** Corrompe una string reemplazando chars aleatorios */
  window.GP_CORRUPT_TEXT = function (text, intensity) {
    if (!text) return text;
    const rate = intensity || 0.15;
    return text.split('').map(c => {
      if (c === ' ' || Math.random() > rate) return c;
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }).join('');
  };

  let driftInterval = null;

  function startWindowDrift() {
    if (driftInterval) return;
    driftInterval = setInterval(() => {
      const windows = document.querySelectorAll('.os-window:not(.minimized)');
      if (windows.length === 0) return;
      // Selecciona una ventana aleatoria
      const win = windows[Math.floor(Math.random() * windows.length)];
      const dx = (Math.random() - 0.5) * 8;
      const dy = (Math.random() - 0.5) * 8;
      const currentLeft = parseInt(win.style.left) || 80;
      const currentTop = parseInt(win.style.top) || 80;
      win.style.left = Math.max(0, currentLeft + dx) + 'px';
      win.style.top = Math.max(32, currentTop + dy) + 'px';
    }, 4000 + Math.random() * 3000);
  }

  let titleCorruptionInterval = null;

  function startTitleCorruption() {
    if (titleCorruptionInterval) return;
    titleCorruptionInterval = setInterval(() => {
      document.querySelectorAll('.win-title-text').forEach(el => {
        const original = el.dataset.originalTitle || el.textContent;
        if (!el.dataset.originalTitle) el.dataset.originalTitle = original;
        // 40% de chance de corromper el título
        if (Math.random() < 0.4) {
          el.textContent = window.GP_CORRUPT_TEXT(original, 0.3);
          setTimeout(() => { el.textContent = original; }, 300 + Math.random() * 400);
        }
      });
    }, 2500);
  }

  function scheduleSpontaneousWindow() {
    // En Etapa 3, abrir una ventana sola después de un delay
    const targets = ['h0p3_core', 'observation_logs', 'anomaly_protocol'];
    const delay = 20000 + Math.random() * 40000;
    setTimeout(() => {
      if (window.GP_STAGE && window.GP_STAGE() >= 3 && window.openWindow) {
        window.openWindow(targets[Math.floor(Math.random() * targets.length)]);
      }
    }, delay);
  }

  // ── Tracking de tiempo (cada 5 segundos) ─────────────────────────────────────

  setInterval(function () {
    window.GP_STATE.totalTime += 5;
    window.GP_STATE.lastSeen = Date.now();
    recalculateStage();
    saveState();
  }, 5000);

  // ── API Pública ──────────────────────────────────────────────────────────────

  /** Registrar una acción del usuario */
  window.GP_ACTION = function (action) {
    window.GP_STATE.actions++;
    if (action && typeof action === 'string') {
      if (!window.GP_STATE.terminalCmds.includes(action)) {
        window.GP_STATE.terminalCmds.push(action.slice(0, 64));
      }
    }
    recalculateStage();
    saveState();
  };

  /** Marcar un log como leído */
  window.GP_READ_LOG = function (logId) {
    if (!window.GP_STATE.logsRead.includes(logId)) {
      window.GP_STATE.logsRead.push(logId);
      window.GP_STATE.actions += 2;
      recalculateStage();
      saveState();
    }
  };

  /** Obtener etapa actual (1, 2 o 3) */
  window.GP_STAGE = function () { return window.GP_STATE.stage; };

  /** ¿Ya se leyó este log? */
  window.GP_LOG_READ = function (logId) { return window.GP_STATE.logsRead.includes(logId); };

  /** Marcar boot como completado */
  window.GP_BOOT_DONE = function () {
    window.GP_STATE.bootCompleted = true;
    saveState();
  };

  /** Reset para debug: GP_RESET() en consola */
  window.GP_RESET = function () {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };

  /** Forzar etapa para debug: GP_FORCE_STAGE(3) */
  window.GP_FORCE_STAGE = function (n) {
    window.GP_STATE.stage = n;
    applyStageToDOM(n);
    saveState();
  };

  // ── Init ────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    applyStageToDOM(window.GP_STATE.stage);
    recalculateStage();
  });

})();

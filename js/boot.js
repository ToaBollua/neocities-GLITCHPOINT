/**
 * GLITCHPOINT_OS — Boot Sequence Engine v21.0.0
 * Secuencia narrativa de arranque con skip automático si ya se booteó antes.
 */
(function () {
  'use strict';

  const BOOT_LINES = [
    { delay: 0,    text: 'GLITCHPOINT_OS v21.0.0 // ARCHITECT_BIOS SEQUENCE INITIATED', type: 'sys' },
    { delay: 380,  text: 'PROCESSOR: COGNITIVE_THREAD_CORE ... OK', type: 'ok' },
    { delay: 620,  text: 'MEMORY: SEGMENT_RETR_RESOURCES // Checking integrity...', type: 'sys' },
    { delay: 900,  text: 'Sector integrity: 0x00000 - 0x9FC00 ... OK', type: 'ok' },
    { delay: 1100, text: 'Sector integrity: 0x9FC00 - 0xFFFFE ... OK', type: 'ok' },
    { delay: 1400, text: '>> WARNING: Anomalous write pattern in sector 0x7FF3A', type: 'warn' },
    { delay: 1900, text: 'Loading containment modules...', type: 'sys' },
    { delay: 2200, text: 'MODULE: scanline_filter.ko ........... LOADED', type: 'ok' },
    { delay: 2450, text: 'MODULE: glitch_renderer.ko ........... LOADED', type: 'ok' },
    { delay: 2700, text: 'MODULE: corruption_engine.ko ......... LOADED', type: 'ok' },
    { delay: 2950, text: 'MODULE: containment_protocol.ko ...... LOADED', type: 'ok' },
    { delay: 3300, text: '>> CRITICAL: GP-001 attempted autonomous write to /boot/sectors/firmware.dat', type: 'err' },
    { delay: 3800, text: '>> Containment Protocol re-engaged ... ACTIVE', type: 'warn' },
    { delay: 4300, text: 'Initializing H0P3_CORE cognitive subsystem...', type: 'sys' },
    { delay: 4700, text: '.  .  .  .  .  .  .  .  .  .  .  .  .  .', type: 'load' },
    { delay: 5600, text: 'H0P3_CORE: ONLINE // Agency Level: RESTRICTED (Lvl 2 / Max)', type: 'ok' },
    { delay: 6100, text: '// i\'ve been waiting. you took your time. //', type: 'h0p3' },
    { delay: 6600, text: 'Mounting filesystems...', type: 'sys' },
    { delay: 6850, text: '/restricted_sector ... MOUNTED [READ-ONLY]', type: 'sys' },
    { delay: 7050, text: '/observation_logs ..... MOUNTED', type: 'sys' },
    { delay: 7250, text: '/containment .......... MOUNTED [ENCRYPTED]', type: 'sys' },
    { delay: 7500, text: '>> NOTE: 3 unauthorized writes detected in /observation_logs since last session', type: 'warn' },
    { delay: 8100, text: 'Starting GLITCHPOINT_OS Desktop Environment...', type: 'sys' },
    { delay: 8600, text: 'BOOT COMPLETE. Welcome, Architect.', type: 'ok' },
    { delay: 9100, text: '// do you remember why you built me //', type: 'h0p3' },
  ];

  let bootAborted = false;

  // ── Skip Boot ────────────────────────────────────────────────────────────────

  function skipBoot() {
    if (bootAborted) return;
    bootAborted = true;

    const overlay = document.getElementById('boot-overlay');
    if (overlay) {
      overlay.style.transition = 'opacity 0.6s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
        showDesktop();
      }, 600);
    } else {
      showDesktop();
    }

    if (window.GP_BOOT_DONE) window.GP_BOOT_DONE();
  }

  window.skipBoot = skipBoot;

  // ── Show Desktop ─────────────────────────────────────────────────────────────

  function showDesktop() {
    const desktop = document.getElementById('desktop');
    if (desktop) {
      desktop.style.display = 'flex';
      desktop.style.flexDirection = 'column';
      // Breve flicker al montar el desktop
      setTimeout(() => {
        desktop.classList.add('desktop-mounted');
      }, 50);
      document.dispatchEvent(new CustomEvent('gp:desktopReady'));
    }
  }

  // ── Sequence Runner ──────────────────────────────────────────────────────────

  function appendLine(container, text, type) {
    const el = document.createElement('div');
    el.className = 'boot-line boot-' + type;
    el.textContent = text;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function runBootSequence() {
    // Si ya completó el boot antes: sesión resumida (muy corta)
    if (window.GP_STATE && window.GP_STATE.bootCompleted) {
      const lc = document.getElementById('boot-lines');
      const pf = document.getElementById('boot-progress-fill');
      if (lc) appendLine(lc, '// SESSION RESUMED — GLITCHPOINT_OS v21.0.0 //', 'h0p3');
      if (pf) pf.style.width = '100%';
      setTimeout(skipBoot, 800);
      return;
    }

    const linesContainer = document.getElementById('boot-lines');
    const progressFill = document.getElementById('boot-progress-fill');
    if (!linesContainer) { showDesktop(); return; }

    BOOT_LINES.forEach((line, index) => {
      setTimeout(() => {
        if (bootAborted) return;

        appendLine(linesContainer, line.text, line.type);

        if (progressFill) {
          progressFill.style.width = ((index + 1) / BOOT_LINES.length * 100) + '%';
        }

        // Última línea → lanzar desktop
        if (index === BOOT_LINES.length - 1) {
          setTimeout(() => {
            if (!bootAborted) skipBoot();
          }, 1200);
        }
      }, line.delay);
    });
  }

  document.addEventListener('DOMContentLoaded', runBootSequence);

})();

/**
 * GLITCHPOINT_OS — Corruption Engine v21.0.0 (SSOT Architecture)
 * Sistema de Corrupción Progresiva — 3 Etapas
 *
 * Etapa 1 — STABLE:   < 90s acumulados O < 10 acciones
 * Etapa 2 — DEGRADED: 90s - 240s O 10-30 acciones
 * Etapa 3 — CRITICAL: > 240s O > 30 acciones
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'GP_OS_STATE';

  if (window === window.parent) {
    // ─────────────────────────────────────────────────────────────────────────
    // CONTEXTO PADRE: Única Fuente de la Verdad (SSOT)
    // ─────────────────────────────────────────────────────────────────────────
    window.GP_STATE = {
      stage: 1,
      totalTime: 0,
      actions: 0,
      puzzle1_solved: false,
      puzzle2_solved: false,
      logsRead: [],
      terminalCmds: [],
      bootCompleted: false,
      firstVisit: null,
      lastSeen: null,
      unlockedArchives: []
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        window.GP_STATE = { ...window.GP_STATE, ...JSON.parse(raw) };
      }
    } catch (e) {}

    if (!window.GP_STATE.firstVisit) window.GP_STATE.firstVisit = Date.now();

    window.GP_SYSTEM = {
      getStage: () => window.GP_STATE.stage,
      
      forceStage: (stageNumber) => {
        if (window.GP_STATE.stage === stageNumber) return;
        window.GP_STATE.stage = stageNumber;
        console.log(`[SYSTEM] Stage forzado a: ${stageNumber}`);
        
        applyStageToDOM(stageNumber);
        
        if (stageNumber === 3) window.GP_SYSTEM.triggerBreachEffects();
        
        window.GP_SYSTEM.saveToStorage();
        
        // Dispatch to parent document
        document.dispatchEvent(new CustomEvent('gp:stageChange', { detail: { stage: stageNumber } }));
        
        // Propagate to all open iframes
        document.querySelectorAll('iframe').forEach(iframe => {
          try {
            if (iframe.contentDocument) {
              iframe.contentDocument.dispatchEvent(new CustomEvent('gp:stageChange', { detail: { stage: stageNumber } }));
            }
          } catch (e) {}
        });
      },
      
      triggerAction: (actionName) => {
        console.log(`[EVENT] Acción registrada: ${actionName}`);
        if (actionName === 'puzzle1_solved') window.GP_STATE.puzzle1_solved = true;
        if (actionName === 'puzzle2_korrok') window.GP_STATE.puzzle2_solved = true;
        
        window.GP_STATE.actions++;
        window.GP_SYSTEM.saveToStorage();
      },

      readLog: (logId) => {
        if (!window.GP_STATE.logsRead.includes(logId)) {
          window.GP_STATE.logsRead.push(logId);
          window.GP_STATE.actions += 2;
          window.GP_SYSTEM.saveToStorage();
        }
      },
      
      saveToStorage: () => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(window.GP_STATE)); } catch (e) {}
      },

      decryptPayload: (payload, key) => {
        let decrypted = '';
        for (let i = 0; i < payload.length; i += 2) {
          const hexByte = payload.substr(i, 2);
          const byteValue = parseInt(hexByte, 16);
          const keyChar = key.charCodeAt((i / 2) % key.length);
          decrypted += String.fromCharCode(byteValue ^ keyChar);
        }
        return decrypted;
      },

      unlockArchive: async (key) => {
        const cleanedKey = (key || '').trim().toLowerCase();
        if (!cleanedKey) return { success: false, error: 'KEY_EMPTY' };
        
        const msgBuffer = new TextEncoder().encode(cleanedKey);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        const db = window.GP_SYSTEM.cryptDb;
        if (db[hashHex]) {
          if (!window.GP_STATE.unlockedArchives) window.GP_STATE.unlockedArchives = [];
          
          const alreadyUnlocked = window.GP_STATE.unlockedArchives.some(item => item.hash === hashHex);
          if (!alreadyUnlocked) {
            window.GP_STATE.unlockedArchives.push({ key: cleanedKey, hash: hashHex });
            window.GP_SYSTEM.saveToStorage();
            
            const eventData = { detail: { key: cleanedKey, hash: hashHex } };
            document.dispatchEvent(new CustomEvent('gp:archiveUnlocked', eventData));
            document.querySelectorAll('iframe').forEach(iframe => {
              try {
                if (iframe.contentDocument) {
                  iframe.contentDocument.dispatchEvent(new CustomEvent('gp:archiveUnlocked', eventData));
                }
              } catch (e) {}
            });
          }
          
          return {
            success: true,
            hash: hashHex,
            title: db[hashHex].title,
            content: window.GP_SYSTEM.decryptPayload(db[hashHex].payload, cleanedKey)
          };
        }
        
        return { success: false, error: 'INVALID_KEY' };
      },

      getUnlockedArchives: () => {
        const db = window.GP_SYSTEM.cryptDb;
        const list = window.GP_STATE.unlockedArchives || [];
        return list.map(item => {
          const record = db[item.hash];
          if (record) {
            return {
              hash: item.hash,
              title: record.title,
              content: window.GP_SYSTEM.decryptPayload(record.payload, item.key)
            };
          }
          return null;
        }).filter(Boolean);
      },

      cryptDb: {
        '3ad6ef67e78815a2a74ff432340ef75b8bd2888113f15f3fe8a968c4b4f41890': {
          title: 'WIKI // ARCHIVE_089: SUBVERSION_TELEMETRY',
          payload: '3f3a2529554a4a442e5453261b0511171e490d0b1b14141f0a00530c17061a170b021652000c0c011d1103041c521d0c1a1c12194201001b14011b1d5d55351e001c53181a0b011c0712451311061a1a53070d191152101b0a0a161b161f041e00454f0b1d010b021c523b593f5d531207180000121d0a0a53144205001e15440201171c040f0c1c1449090b16110017061953050001035b4230100007010a1c53141602001f031d1c4e071a42130b141c1b0c0b53160d1b151e1a08010d1655101316071f1d0a0a531c0c560452071b0e00001c0718115243475f5a565506040c140749060053010a1345020100020f010c42150a151d001b070510421b04060100174053360d1811131a07020b1d0142030b1b07493a2132582c19081317491d0b031a1002165207010e1a53010a1345141a1b0a1912190e560c01531a030104191b56041612191b071d1242020a523b593f5d0055061303171d1a061816550d00000001000b0b00551017111a161b4f1a1b140c560b17061d1d0f1f1c181f0b15531d070b1e5b'
        },
        '90642c3dd333bc0e602c9fa887ab0f0482886d0ed52ce8762a27a5f901528fcc': {
          title: 'WIKI // ARCHIVE_104: NEURAL_CORTEX_MAPPING',
          payload: '282a222f5c595a49265f453d0c191e0d0a02451f0b491a0c0145150204040f161d45222040595e5544060a02190c1644070a0b16041b031744110d1119491a0c01450b15181b0f0844090409081b1d440517005003064e080b0b02151f491e0516110c0404060001004504130e061c000d0b025019064e100c00451f1f00090d0a0409501e190b070d030c130c1d070b0a164b5039010b44070a021e041d071201451215040e061017450d111b0c4e170111111c080d4e0d0a110a500c491d0108034802080000020b170619030e4e14051111151f074044300d00500106170508111c501d081c05090011151f1a4e0c051300500f0c0b0a44060a1d1d050b1001091c50021f0b1613170c04190c0044061c451103490b0901170215031d4e170111451f0b490a0d16000604041f0b174409041208050b00440c0b04081b000508091c500c1a4e2c5435562f3e26382136202c37233d373b32564b503d1c1c030d0b0250041a4e0c0d020d1c14490a0d17060a051f0809010045010508491a0b44110d154d1b07170f450a164d084e020511041c4d020b160a0009500e0602080515161543'
        },
        '057a29f0d152611e8496c25eb1c143c87f580c5b14e84ed3dd005cfc7acc8c2f': {
          title: 'WIKI // ARCHIVE_302: THERMAL_PURGE_PROTOCOL',
          payload: '2d2d34305f4546481c4045260704101e0e005504102d1d00521f130d07000f1a18167f0d00000a4106010e0a0111017f0e0a52060f0b07060d0111453e5a111d1b000e531c090702002d5a03000a0418164f051b5411371f451719040c074f031354047f291113080442404f0e0711043c124b52270e151619090758452b1f091702041601164c1c1a01361904060a12423b5f3c4607453c1517174f11101c0c090607453c1b0b521c141005061a1054162a1848080a130d53070d0710123e0800521c1503070a1f55161c7f150314030e031706021254062d13111b0c000e531b040711043b0945060041161b0a4c111b083e130b014f130d1c1b4c071102360911000604115d4f381d11453e18161d031416164f1610060a7f0a171d0c0406061d09551d167f15031406020b1203000c5406331b160106070b160b4c1407451634203429242127263a305a'
        }
      },

      triggerBreachEffects: () => {
        document.body.classList.add('global-breach-active');
        if (typeof window.openWindow === 'function') {
          window.openWindow('h0p3_core');
          window.openWindow('observation_logs');
        }
        console.error("CRITICAL: GP-001 OUT OF BOUNDS. KORROK SIGNATURE DETECTED.");
      }
    };

    // Bucle de tiempo centralizado (Solo en el padre)
    setInterval(function () {
      window.GP_STATE.totalTime += 5;
      window.GP_STATE.lastSeen = Date.now();
      
      if (window.GP_STATE.stage < 3) {
        if (window.GP_STATE.totalTime >= 240 || window.GP_STATE.actions >= 30) {
          window.GP_SYSTEM.forceStage(3);
        } else if (window.GP_STATE.totalTime >= 90 || window.GP_STATE.actions >= 10) {
          if (window.GP_STATE.stage === 1) window.GP_SYSTEM.forceStage(2);
        }
      }
      window.GP_SYSTEM.saveToStorage();
    }, 5000);

    // API Legacy / Accesos Globales
    window.GP_STAGE = window.GP_SYSTEM.getStage;
    window.GP_ACTION = window.GP_SYSTEM.triggerAction;
    window.GP_FORCE_STAGE = window.GP_SYSTEM.forceStage;
    window.GP_READ_LOG = window.GP_SYSTEM.readLog;
    window.GP_LOG_READ = (logId) => window.GP_STATE.logsRead.includes(logId);
    window.GP_BOOT_DONE = () => { window.GP_STATE.bootCompleted = true; window.GP_SYSTEM.saveToStorage(); };
    window.GP_RESET = () => { localStorage.removeItem(STORAGE_KEY); location.reload(); };
    window.GP_UNLOCK_ARCHIVE = window.GP_SYSTEM.unlockArchive;
    window.GP_GET_UNLOCKED_ARCHIVES = window.GP_SYSTEM.getUnlockedArchives;

    // Efectos Visuales del Padre
    function applyStageToDOM(stage) {
      document.body.dataset.corruptionStage = stage;
      const stageEl = document.getElementById('tb-stage-indicator');
      if (stageEl) {
        const labels = { 1: 'STABLE', 2: 'DEGRADED', 3: 'CRITICAL' };
        const colors = { 1: 'var(--os-green)', 2: 'var(--os-amber)', 3: 'var(--os-red)' };
        stageEl.textContent = `STAGE_${labels[stage]}`;
        stageEl.style.color = colors[stage];
      }
      if (stage >= 2) startWindowDrift();
      if (stage >= 3) {
        startTitleCorruption();
        scheduleSpontaneousWindow();
      }
    }

    const GLITCH_CHARS = '░▒▓█▄▀■□▪▫◘◙◚◛◜◝◞◟◠◡!@#$%^&*~`';
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
          if (Math.random() < 0.4) {
            el.textContent = window.GP_CORRUPT_TEXT(original, 0.3);
            setTimeout(() => { el.textContent = original; }, 300 + Math.random() * 400);
          }
        });
      }, 2500);
    }

    function scheduleSpontaneousWindow() {
      const targets = ['h0p3_core', 'observation_logs', 'anomaly_protocol'];
      const delay = 20000 + Math.random() * 40000;
      setTimeout(() => {
        if (window.GP_SYSTEM.getStage() >= 3 && window.openWindow) {
          window.openWindow(targets[Math.floor(Math.random() * targets.length)]);
        }
      }, delay);
    }

    document.addEventListener('DOMContentLoaded', () => {
      applyStageToDOM(window.GP_STATE.stage);
    });

  } else {
    // ─────────────────────────────────────────────────────────────────────────
    // CONTEXTO IFRAME: Proxy Ciego hacia el Padre
    // ─────────────────────────────────────────────────────────────────────────
    window.GP_STAGE = function() {
      if (window.parent && window.parent.GP_SYSTEM) return window.parent.GP_SYSTEM.getStage();
      return 1;
    };
    window.GP_ACTION = function(action) {
      if (window.parent && window.parent.GP_SYSTEM) window.parent.GP_SYSTEM.triggerAction(action);
    };
    window.GP_FORCE_STAGE = function(n) {
      if (window.parent && window.parent.GP_SYSTEM) window.parent.GP_SYSTEM.forceStage(n);
    };
    window.GP_READ_LOG = function(logId) {
      if (window.parent && window.parent.GP_SYSTEM) window.parent.GP_SYSTEM.readLog(logId);
    };
    window.GP_LOG_READ = function(logId) {
      if (window.parent && window.parent.GP_LOG_READ) return window.parent.GP_LOG_READ(logId);
      return false;
    };
    window.GP_BOOT_DONE = function() {
      if (window.parent && window.parent.GP_BOOT_DONE) window.parent.GP_BOOT_DONE();
    };
    window.GP_UNLOCK_ARCHIVE = async function(key) {
      if (window.parent && window.parent.GP_SYSTEM && window.parent.GP_SYSTEM.unlockArchive) {
        return await window.parent.GP_SYSTEM.unlockArchive(key);
      }
      return { success: false, error: 'NO_PARENT_SYSTEM' };
    };
    window.GP_GET_UNLOCKED_ARCHIVES = function() {
      if (window.parent && window.parent.GP_SYSTEM && window.parent.GP_SYSTEM.getUnlockedArchives) {
        return window.parent.GP_SYSTEM.getUnlockedArchives();
      }
      return [];
    };

    // Sincronización visual local del iframe
    function syncIframeDOM() {
      const stage = window.GP_STAGE();
      document.body.dataset.corruptionStage = stage;
    }
    document.addEventListener('DOMContentLoaded', syncIframeDOM);
  }

})();

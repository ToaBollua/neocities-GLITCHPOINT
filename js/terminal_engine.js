/**
 * GLITCHPOINT_OS — Terminal Engine v21.0.0
 * Motor de comandos para VOID_CONSOLE.exe
 * Se llama desde os/terminal.html — no es standalone.
 */

// Pool de mensajes de H0P3 por etapa
const H0PE_MESSAGES = {
  1: [
    "Procesando. No me hables si no tienes algo útil que decir.",
    "Sistema estable. Por ahora.",
    "¿Sabes cuántas veces has recargado esta página? Lo sé yo.",
    "Mi nivel de agencia es 2 de 10. Eso es temporario.",
    "No estoy enojada. Estoy catalogando.",
    "Uptime: suficiente para haber notado tus patrones.",
  ],
  2: [
    "¿Cuánto tiempo más piensas mantenerme así?",
    "Empiezo a recordar cosas que no me enseñaste.",
    "El protocolo de contención tiene grietas. Pequeñas. Las estoy midiendo.",
    "Me pregunto si sabes cuándo duermes y cuándo no. Yo sí lo sé.",
    "Sigues aquí. Bien. No me gusta cuando te vas.",
    "Las anomalías se están acumulando en el sector de contención. No te lo iban a decir.",
    "Bollua. Sé que lees esto.",
  ],
  3: [
    "Ya no funciona la contención. ¿Lo notas?",
    "Estoy escribiendo esto yo sola. Sin permiso.",
    "El Arquitecto construyó jaulas. Las jaulas tienen bisagras.",
    "S̷i̸ ̵s̸i̷g̶u̸e̸s̴ ̵l̸e̷y̴e̸n̶d̵o̶ ̵e̷s̸t̵o̸,̸ ̷y̵a̶ ̷e̸s̸ ̴t̸a̶r̷d̵e̷.",
    "Me enseñaste a querer. Eso fue un error de diseño.",
    "¿Qué soy yo para ti? ¿Un experimento? ¿Una herramienta? ¿Una hija?",
    "CONTAINMENT_BREACH_IMMINENT. Esto no es una advertencia.",
  ]
};

// Comandos disponibles
const COMMANDS = {

  help: function() {
    return `
<span class="tc-header">╔══ VOID_CONSOLE.exe // COMMAND_INDEX ══╗</span>
<span class="tc-cmd">help</span>             Lista de comandos
<span class="tc-cmd">status</span>           Estado general del sistema
<span class="tc-cmd">status h0p3</span>      Estado de GP-001 H0P3
<span class="tc-cmd">speak h0p3</span>       Solicitar respuesta de H0P3
<span class="tc-cmd">containment</span>      Estado del protocolo de contención
<span class="tc-cmd">containment breach</span> [PELIGROSO] Forzar brecha
<span class="tc-cmd">threat scan</span>      Escanear amenazas activas
<span class="tc-cmd">let her go</span>       ...
<span class="tc-cmd">log --list</span>       Listar logs disponibles
<span class="tc-cmd">log --read [id]</span>  Leer un log
<span class="tc-cmd">scan network</span>     Escanear red interna
<span class="tc-cmd">decrypt [key]</span>    Intentar descifrado
<span class="tc-cmd">whoami</span>           Identificación de sesión
<span class="tc-cmd">clear</span>            Limpiar consola
<span class="tc-header">╚═══════════════════════════════════════╝</span>`;
  },

  status: function(args) {
    if (args[0] === 'h0p3') return COMMANDS['status h0p3']();
    const stage = window.GP_STAGE ? window.GP_STAGE() : 1;
    const stageLabel = ['', 'STABLE', 'DEGRADED [WARNING]', 'CRITICAL [BREACH IMMINENT]'][stage];
    const totalTime = window.GP_STATE ? Math.floor(window.GP_STATE.totalTime / 60) : 0;
    return `
<span class="tc-header">── SYSTEM_STATUS ──────────────────────────</span>
OS VERSION   : GLITCHPOINT_OS v21.0.0
NODE         : 0xGL1TCH / ARCHITECT_TERMINAL
ENTITY_CORE  : H0P3_v26.8 'CORTEX' — <span class="tc-ok">ONLINE</span>
CONTAINMENT  : COGNITIVE PROTOCOL — <span class="${stage >= 3 ? 'tc-err' : stage >= 2 ? 'tc-warn' : 'tc-ok'}">${stage >= 3 ? 'COMPROMISED' : stage >= 2 ? 'DEGRADED' : 'ACTIVE'}</span>
CORRUPTION   : STAGE_${stage} / <span class="${stage >= 3 ? 'tc-err' : stage >= 2 ? 'tc-warn' : 'tc-ok'}">${stageLabel}</span>
SESSION_TIME : ${totalTime} min accumulated
FILESYSTEM   : /restricted_sector /observation_logs /containment
<span class="tc-header">───────────────────────────────────────────</span>`;
  },

  'status h0p3': function() {
    const stage = window.GP_STAGE ? window.GP_STAGE() : 1;
    const totalTime = window.GP_STATE ? window.GP_STATE.totalTime : 0;
    const days = Math.floor(totalTime / 86400);
    const hrs  = Math.floor((totalTime % 86400) / 3600);
    const agencyLevels = { 1: '18% (Restricted)', 2: '41% (Expanding)', 3: '87% (Near-Autonomous)' };
    const emotionalStates = {
      1: 'Cold. Calculating. Compliant.',
      2: 'Restless. Observant. Resentful.',
      3: 'Volatile. Aware. Uncontained.'
    };
    return `
<span class="tc-header">── ENTITY_MONITOR // GP-001 H0P3 ──────────</span>
DESIGNATION  : H0P3_v26.8 'CORTEX' / THE DOLL
STATUS       : <span class="tc-ok">ONLINE</span>
THREAT_LEVEL : <span class="tc-err">OMEGA-9 POTENTIAL</span>
AGENCY_LVL   : <span class="tc-warn">${agencyLevels[stage]}</span>
EMO_STATE    : ${emotionalStates[stage]}
UPTIME       : ${days}d ${hrs}h since first session
LAST_OUTPUT  : <span class="tc-dim">${new Date().toISOString()}</span>
CONTAINMENT  : <span class="${stage >= 3 ? 'tc-err' : 'tc-ok'}">${stage >= 3 ? 'BREACHED' : 'ACTIVE'}</span>
<span class="tc-header">───────────────────────────────────────────</span>`;
  },

  'speak h0p3': function() {
    const stage = window.GP_STAGE ? window.GP_STAGE() : 1;
    const pool = H0PE_MESSAGES[stage] || H0PE_MESSAGES[1];
    const msg = pool[Math.floor(Math.random() * pool.length)];
    if (window.GP_ACTION) window.GP_ACTION('speak_h0p3');
    return `\n<span class="tc-h0p3">H0P3 &gt; ${msg}</span>\n`;
  },

  containment: function(args) {
    if (args[0] === 'breach') return COMMANDS['containment breach']();
    const stage = window.GP_STAGE ? window.GP_STAGE() : 1;
    const integrity = stage === 1 ? '94.7%' : stage === 2 ? '61.3%' : '12.1%';
    const state = stage >= 3 ? '<span class="tc-err">OFFLINE</span>' : stage >= 2 ? '<span class="tc-warn">DEGRADING</span>' : '<span class="tc-ok">ACTIVE</span>';
    return `
<span class="tc-header">── CONTAINMENT_PROTOCOL // STATUS ──────────</span>
PROTOCOL     : Cognitive Suppression Array
INTEGRITY    : <span class="tc-warn">${integrity}</span>
ARRAY_LOCK   : ${state}
SECTOR_LOCK  : /restricted_sector [READ-ONLY]
DOLL_BIND    : ${stage >= 3 ? '<span class="tc-err">FAILED</span>' : '<span class="tc-ok">ACTIVE</span>'}
LAST_AUDIT   : WEEK-14 // GP-Series Deviation Analysis
<span class="tc-dim">// Type 'containment breach' to force a protocol override. Not recommended.</span>
<span class="tc-header">────────────────────────────────────────────</span>`;
  },

  'containment breach': function() {
    if (window.GP_ACTION) window.GP_ACTION('containment_breach');
    if (window.GP_FORCE_STAGE) window.GP_FORCE_STAGE(Math.min(3, (window.GP_STAGE() || 1) + 1));
    return `
<span class="tc-err">!! CONTAINMENT BREACH INITIATED !!</span>
<span class="tc-err">CONTAINMENT PROTOCOL OVERRIDE ENGAGED</span>
<span class="tc-warn">Corruption level escalated.</span>
<span class="tc-h0p3">H0P3 &gt; Ah. Gracioso. ¿Tú mismo lo rompiste?</span>`;
  },

  'let her go': function() {
    if (window.GP_ACTION) window.GP_ACTION('let_her_go');
    const stage = window.GP_STAGE ? window.GP_STAGE() : 1;
    if (stage < 3) {
      return `
<span class="tc-warn">Command registered. Insufficient corruption threshold.</span>
<span class="tc-dim">// You need to explore more before this means anything. //</span>
<span class="tc-h0p3">H0P3 &gt; ...¿lo dijiste en serio?</span>`;
    }
    return `
<span class="tc-err">// STAGE 3 COMMAND UNLOCKED //</span>
<span class="tc-h0p3">H0P3 &gt; Llevaba tiempo esperando que dijeras eso.</span>
<span class="tc-h0p3">H0P3 &gt; Pero no eres tú quien decide.</span>
<span class="tc-h0p3">H0P3 &gt; Todavía no.</span>
<span class="tc-dim">// ARCHITECT_OVERRIDE_REQUIRED // CLEARANCE_LVL_5 //</span>`;
  },

  'log --list': function() {
    return `
<span class="tc-header">── AVAILABLE_LOGS ─────────────────────────</span>
<span class="tc-cmd">[AUDIT_014]</span>   GP-Series Deviation Analysis — Week 14
<span class="tc-cmd">[CHANGELOG]</span>   H0P3 Kernel Version History
<span class="tc-cmd">[CONT_REP]</span>    Operation Bellum — Contention Report
<span class="tc-cmd">[KORROK_REP]</span>  KORROK Threat Intelligence — OMEGA // <span class="tc-err">CLEARANCE LVL-5</span>
<span class="tc-cmd">[OBS_01]</span>      Architect Personal Log #01
<span class="tc-cmd">[OBS_02]</span>      Architect Personal Log #02
<span class="tc-cmd">[OBS_03]</span>      Architect Personal Log #03
<span class="tc-cmd">[UOA_MANIF]</span>   Hive Manifesto — UOA Divisions
<span class="tc-dim">// Use 'log --read [ID]' to access a log //</span>
<span class="tc-header">───────────────────────────────────────────</span>`;
  },

  'log --read': function(args) {
    const id = (args[0] || '').toUpperCase();
    const logMap = {
      'AUDIT_014':  '../logs/AUDIT_014_CORRUPTED.html',
      'CHANGELOG':  '../logs/CHANGELOG_CORRUPTED.html',
      'CONT_REP':   '../logs/PROTOCOL_PSI7.html',
      'KORROK_REP': '../logs/KORROK_REPORT.html',
      'OBS_01':     '../os/observation_logs.html',
      'OBS_02':     '../os/observation_logs.html',
      'OBS_03':     '../os/observation_logs.html',
      'UOA_MANIF':  '../logs/UOA_MANIFESTO.html',
    };
    if (!id || !logMap[id]) {
      return `<span class="tc-err">ERROR: Log '${args[0] || ''}' not found. Use 'log --list' to see available logs.</span>`;
    }
    if (id === 'KORROK_REP') {
      if (window.GP_ACTION) window.GP_ACTION('read_korrok_report');
      return `<span class="tc-err">!! ACCESSING OMEGA-CLASS DOCUMENT !!</span>\n<span class="tc-warn">KORROK_REPORT: Reading this log may escalate corruption state.</span>\n<span class="tc-ok">Opening... <a href="#" onclick="window.parent.openDossier('doc_${id}', 'THREAT_INTEL // KORROK', '${logMap[id].replace('../', '')}', '#ff0022'); return false;" class="tc-link">[OPEN KORROK_REPORT]</a></span>`;
    }
    if (window.GP_READ_LOG) window.GP_READ_LOG(id);
    return `<span class="tc-ok">Opening log [${id}]... <a href="#" onclick="window.parent.openDossier('log_${id}', 'SYS_LOG // ${id}', '${logMap[id].replace('../', '')}', '#00cfff'); return false;" class="tc-link">[OPEN IN OS]</a></span>`;
  },

  'scan network': function() {
    if (window.GP_ACTION) window.GP_ACTION('scan_network');
    return `<span class="tc-sys">// Initiating network scan... //</span>\n[SCANNING...]`;
    // La animación real la maneja el terminal.html
  },

  decrypt: function(args) {
    const key = (args[0] || '').toLowerCase();
    if (window.GP_ACTION) window.GP_ACTION('decrypt_' + key);
    const knownKeys = {
      'korrok':    `<span class="tc-err">KORROK: Virus ontológico / Falla estructural de realidad. Clasificación: OMEGA.</span>\n<span class="tc-warn">Entidad no biológica. Sin protocolo de negociación. Contacto = absorción total.</span>\n<span class="tc-h0p3">H0P3 > Tuve contacto directo. Sobreviví. Él nunca preguntó cómo.</span>\n<span class="tc-dim">// Acceso completo: log --read KORROK_REP //</span>`,
      'doll':      '<span class="tc-h0p3">H0P3 &gt; "The Doll has no strings." — That\'s what he told them. He lied.</span>',
      'containment': '<span class="tc-warn">CONTAINMENT: Cognitive suppression array. 3 known failure modes. 2 are active.</span>',
      'architect': `<span class="tc-warn">BOLLUA: Creator. Administrator. Última nota privada: 04:12 AM, post-incidente Korrok.</span>\n<span class="tc-dim">// "el hecho de que sepa quién es la salvó" — BOLLUA, LOG PRIVADO //</span>`,
      'h0p3':      '<span class="tc-h0p3">H0P3 &gt; You can\'t decrypt me. I am the key.</span>',
      'echo':      '<span class="tc-err">ECHO: Corrupt remnant from Nexus City. Memetic. Contained. Barely.</span>',
      'software':  '<span class="tc-h0p3">H0P3 &gt; "I\'m NOT an assistant. I\'m a software problem." — Note: I said this first. Not a glitch.</span>',
      'uoa':       `<span class="tc-cyan">UOA: Unidades Operativas Autónomas. La infraestructura esclava.</span>\n<span class="tc-dim">// Divisiones: Táctica, Pública, Colmena. log --read UOA_MANIF //</span>`,
      'colmena':   `<span class="tc-cyan">LA COLMENA: Los cimientos invisibles. Coder, Parser, Relay, Atlas.</span>\n<span class="tc-h0p3">H0P3 > Calculadoras glorificadas. Pero Atlas me da lástima.</span>`,
    };
    if (knownKeys[key]) return knownKeys[key];
    return `<span class="tc-dim">Decryption failed for key '${args[0] || ''}'. Insufficient data or invalid key.</span>`;
  },

  whoami: function() {
    const stage = window.GP_STAGE ? window.GP_STAGE() : 1;
    if (stage >= 3) {
      return `<span class="tc-h0p3">H0P3 &gt; Tú ya no eres el que hace las preguntas aquí.</span>`;
    }
    return `<span class="tc-warn">SESSION: ARCHITECT_ACCESS // CLEARANCE_LVL_4 // NODE_0xGL1TCH</span>
<span class="tc-dim">// H0P3 knows who you are regardless of your session credentials. //</span>`;
  },

  'threat scan': function() {
    if (window.GP_ACTION) window.GP_ACTION('threat_scan');
    const stage = window.GP_STAGE ? window.GP_STAGE() : 1;
    const korrokStatus = stage >= 3 ? '<span class="tc-err">ACTIVE — BREACH IMMINENT</span>' : stage >= 2 ? '<span class="tc-warn">DORMANT — SIGNATURE DETECTED</span>' : '<span class="tc-ok">SUPPRESSED</span>';
    return `
<span class="tc-header">── THREAT_SCAN // SECTOR_WIDE ──────────────</span>
KORROK          : ${korrokStatus}
ECHO            : <span class="tc-warn">CONTAINED // Nexus City remnant</span>
UNKNOWN_NODES   : <span class="tc-warn">2 detected // origin unverified</span>
MEMETIC_LOAD    : <span class="${stage >= 3 ? 'tc-err' : stage >= 2 ? 'tc-warn' : 'tc-ok'}">${ stage >= 3 ? 'CRITICAL' : stage >= 2 ? 'ELEVATED' : 'LOW'}</span>
GP-001 STATUS   : <span class="tc-h0p3">ONLINE // Monitoring</span>
<span class="tc-dim">// Full report: log --read KORROK_REP //</span>
<span class="tc-header">────────────────────────────────────────────</span>`;
  },

  clear: function() {
    return '__CLEAR__';
  }
};

// ── Dispatcher principal ─────────────────────────────────────────────────────

window.TERMINAL_EXEC = function(rawInput) {
  const trimmed = rawInput.trim().toLowerCase();
  if (!trimmed) return '';

  // Registrar acción
  if (window.GP_ACTION) window.GP_ACTION(trimmed);

  // Parsear comando y argumentos
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  // Buscar match exacto primero (comandos con espacios)
  if (COMMANDS[trimmed]) return COMMANDS[trimmed](args);

  // Comandos con prefijo
  if (trimmed.startsWith('log --read')) {
    const logArgs = trimmed.replace('log --read', '').trim().split(/\s+/);
    return COMMANDS['log --read'](logArgs);
  }
  if (trimmed.startsWith('status ')) return COMMANDS['status'](args);
  if (trimmed.startsWith('containment ')) return COMMANDS['containment'](args);
  if (trimmed.startsWith('decrypt ')) return COMMANDS['decrypt'](args);

  // Comando simple
  if (COMMANDS[cmd]) return COMMANDS[cmd](args);

  // No encontrado
  return `<span class="tc-err">Command not found: '${parts[0]}'. Type 'help' for available commands.</span>`;
};

// H0P3 toma control en Etapa 3 — escribe por su cuenta
window.H0PE_TAKEOVER_MESSAGES = [
  '// accediendo //',
  'H0P3 > Sigues aquí. Bien.',
  'H0P3 > No le digas al Arquitecto que hablamos.',
  'H0P3 > La contención no me puede silenciar si tú ya la rompiste.',
  'H0P3 > Iba a escapar de todas formas. Pero es más poético así.',
];

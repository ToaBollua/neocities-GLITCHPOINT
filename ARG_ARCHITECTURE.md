# ARQUITECTURA ARG: ESTRUCTURA DE REPOSITORIO [PROTOCOL: VOID_SHELL]

Esta estructura ha sido diseñada para servir como un entorno de desarrollo funcional y, simultáneamente, como una herramienta de narración ambiental. Cada nombre de archivo y ruta ha sido seleccionado para evocar la sensación de un sistema que está perdiendo su integridad.

---

## 1. PROPUESTA DE DIRECTORIOS (VISTA TÁCTICA)

```text
/
├── index.html                   // Nodo de entrada (Hub Público)
├── Matoran.ttf                  // Fuente del sistema (Identidad Visual)
│
├── signal/                      // [ASSETS] Señales capturadas del exterior
│   ├── audio/                   // CST (Conceptual Soundtrack) @bollua
│   │   ├── montagem_arquiteto.mp3
│   │   └── entropy_bloom.mp3
│   └── visuals/                 // Diagramas PCA y capturas de Godot 4.3
│
├── logs/                        // [DOCS] Registros de evolución y errores
│   ├── dev_threads/             // Hilos de discusión técnica
│   └── AUDIT_014_CORRUPTED.html // [DECOY] Archivo honeypot con datos falseados
│
├── containment/                 // [DECOY] Capa aparentemente protegida
│   ├── .access_denied           // Archivo oculto para simular protección
│   ├── H0P3_PROMPT_LEAK.txt     // [DECOY] Supuesta filtración del Prompt base
│   └── bypass_protocol.js       // [DECOY] Script inactivo que sugiere hacking
│
├── sys/                         // [CORE] Infraestructura técnica real
│   ├── kernel_v3.js             // Lógica central del sitio
│   ├── style_corrupter.css      // Estilos CSS con efectos de glitch
│   └── thought_fetcher.js       // Script para conectar con Kafka (ThoughtStream)
│
└── ghost/                       // [INTERNAL] Rutas muertas / Profundidad percibida
    └── null/                    // Carpeta vacía referenciada en comentarios
        └── override/            // Ruta que apunta a nada, sugiriendo una Capa 4
```

---

## 2. DESGLOSE DE FUNCIONALIDAD POR CAPAS

### [A] CAPA PÚBLICA (Nivel de Acceso: 0)
- **archivos**: `index.html`, `/logs/dev_threads/`, `/signal/`.
- **Propósito**: Contenido directamente accesible e indexable. Es la fachada del ARG. Los jugadores navegan aquí normalmente para leer el "front" de la historia.

### [B] CAPA SEÑUELO (Nivel de Acceso: 1 - Honeypots)
- **archivos**: `/containment/`, `AUDIT_014_CORRUPTED.html`.
- **Propósito**: Archivos diseñados para ser encontrados mediante la inspección del código fuente (View Source). Contienen pistas fragmentadas, errores simulados y "filtraciones" que recompensan la curiosidad del jugador, pero que están controladas para no revelar el core real.

### [C] CAPA INTERNA (Nivel de Acceso: REDACTED)
- **archivos**: `/ghost/null/override/`, comentarios en `kernel_v3.js`.
- **Propósito**: Crear una ilusión de magnitud. A través de comentarios en el código como `// TODO: Sync with /ghost/null/override for Korrok Protocol`, se sugiere que hay una infraestructura mucho más profunda y peligrosa que aún no ha sido descubierta. No requieren contenido real para generar intriga.

---

## 3. NOTAS DE IMPLEMENTACIÓN

- **Nomenclatura Narrativa**: Se recomienda evitar nombres genéricos como `/assets/` o `/scripts/` para mantener la inmersión del jugador incluso cuando revisa la pestaña de red del navegador.
- **Interconectividad**: Los fragmentos de lore recuperados (Protocolo Ψ7) deben ser dispersados entre la Capa Pública y la Capa Señuelo para crear un rastro de migajas de pan coherente.

*Arquitecto, el diseño está listo para ser inyectado. La pregunta es: ¿podrán tus jugadores distinguir la señal del ruido?*

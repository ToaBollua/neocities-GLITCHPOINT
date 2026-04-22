const container = document.getElementById('terminal-game-container');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseOverlay = document.getElementById('pause-overlay');

let isPaused = true;

function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = 300; // Ajustado para el sidebar
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Diccionario alineado con el Lore de H0P3
const dictionary = {
    tier1: ['h0p3', 'core', 'node', 'grid', 'link', 'vrm', 'bash', 'root'],
    tier2: ['bollua', 'glitch', 'kernel', 'kafka', 'docker', 'binary', 'proxy'],
    tier3: ['korrok', 'aethereon', 'panteon', 'tulandia', 'soberania', 'nexus', 'refugio'],
    tier4: ['protocolo genesis', 'soberania sensorial', 'auditandote', 'glitchpoint spa']
};

let enemies = [];
let particles = [];
let targetedEnemy = null;
let glitchFrames = 0;
let frameCount = 0;
let score = 0;

class Particle {
    constructor(x, y, char, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.char = char;
        this.color = color;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.02;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.font = '16px monospace';
        ctx.fillText(this.char, this.x, this.y);
        ctx.restore();
    }
}

class Enemy {
    constructor(text, x, y, speed) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.typedIndex = 0;
        this.isTargeted = false;
    }
    update() { this.y += this.speed; }
    draw() {
        ctx.font = 'bold 24px monospace';
        const typedPart = this.text.substring(0, this.typedIndex);
        const untypedPart = this.text.substring(this.typedIndex);
        const typedWidth = ctx.measureText(typedPart).width;

        ctx.fillStyle = '#333333';
        ctx.fillText(typedPart, this.x, this.y);

        ctx.fillStyle = this.isTargeted ? '#FF0000' : '#00FF41';
        ctx.fillText(untypedPart, this.x + typedWidth, this.y);
    }
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 50;

    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawUI() {
    ctx.fillStyle = '#00FF41';
    ctx.font = '20px monospace';
    ctx.fillText(`SCORE: ${score.toString().padStart(6, '0')}`, 20, 40);
}

window.addEventListener('keydown', (e) => {
    // Sistema de Pausa (Solo Escape para evitar conflictos con 'p' de h0p3)
    if (e.key === 'Escape') {
        isPaused = !isPaused;
        pauseOverlay.style.display = isPaused ? 'flex' : 'none';
        return;
    }

    if(isPaused || e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;
    const key = e.key;

    if (targetedEnemy) {
        if (key === targetedEnemy.text[targetedEnemy.typedIndex]) {
            targetedEnemy.typedIndex++;
            if (targetedEnemy.typedIndex === targetedEnemy.text.length) {
                score += targetedEnemy.text.length * 10;
                triggerFragmentation(targetedEnemy);
                enemies = enemies.filter(enemy => enemy !== targetedEnemy);
                targetedEnemy = null;
            }
        } else {
            triggerGlitch();
        }
    } else {
        // Lógica de filtrado: buscar candidatos que empiecen con la tecla
        const candidates = enemies.filter(enemy => enemy.text.startsWith(key));
        
        if (candidates.length > 0) {
            // PRIORIDAD: Seleccionar el enemigo más cercano al suelo (Y más alto)
            candidates.sort((a, b) => b.y - a.y);
            targetedEnemy = candidates[0];
            targetedEnemy.isTargeted = true;
            targetedEnemy.typedIndex = 1;
            
            if(targetedEnemy.text.length === 1) {
                score += 10;
                triggerFragmentation(targetedEnemy);
                enemies = enemies.filter(enemy => enemy !== targetedEnemy);
                targetedEnemy = null;
            }
        } else {
            triggerGlitch();
        }
    }
});

function triggerGlitch() { glitchFrames = 8; }

function triggerFragmentation(enemy) {
    ctx.font = 'bold 24px monospace';
    let currentX = enemy.x;
    for (let i = 0; i < enemy.text.length; i++) {
        const char = enemy.text[i];
        particles.push(new Particle(currentX, enemy.y, char, '#00FF41'));
        particles.push(new Particle(currentX, enemy.y, Math.random() > 0.5 ? '0' : '1', '#FF0000'));
        currentX += ctx.measureText(char).width;
    }
}

function loop() {
    frameCount++;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    if (glitchFrames > 0) {
        const shiftX = (Math.random() - 0.5) * 15;
        const shiftY = (Math.random() - 0.5) * 15;
        ctx.setTransform(1, 0, 0, 1, shiftX, shiftY);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
        ctx.fillRect(-20, -20, canvas.width + 40, canvas.height + 40);
        if (!isPaused) glitchFrames--;
    } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    if (!isPaused) {
        let spawnRate = 0.01 + (frameCount * 0.000005);
        if (spawnRate > 0.05) spawnRate = 0.05;

        if (Math.random() < spawnRate) {
            let availableTiers = ['tier1'];
            if (frameCount > 800) availableTiers.push('tier2');
            if (frameCount > 2400) availableTiers.push('tier3');
            if (frameCount > 4800) availableTiers.push('tier4');

            const randomTier = availableTiers[Math.floor(Math.random() * availableTiers.length)];
            const wordList = dictionary[randomTier];
            const word = wordList[Math.floor(Math.random() * wordList.length)];
            
            ctx.font = 'bold 24px monospace';
            const textWidth = ctx.measureText(word).width;
            const xPos = Math.random() * (canvas.width - textWidth - 50) + 25;
            const speed = (Math.random() * 1.2 + 0.6) * (1 + frameCount * 0.00008);
            
            enemies.push(new Enemy(word, xPos, -30, speed));
        }

        enemies.forEach(enemy => enemy.update());
        
        const initialCount = enemies.length;
        enemies = enemies.filter(enemy => enemy.y < canvas.height + 20);
        
        if(enemies.length < initialCount) {
            score = Math.max(0, score - 50);
            triggerGlitch();
            if(targetedEnemy && targetedEnemy.y >= canvas.height + 20) targetedEnemy = null;
        }

        particles.forEach(p => p.update());
        particles = particles.filter(p => p.alpha > 0);
    }

    enemies.forEach(enemy => enemy.draw());
    particles.forEach(p => p.draw());

    drawUI();
    requestAnimationFrame(loop);
}

const startBtn = document.getElementById('start-defense-btn');
if(startBtn) {
    startBtn.addEventListener('click', () => {
        isPaused = false;
        pauseOverlay.style.display = 'none';
    });
}

loop();

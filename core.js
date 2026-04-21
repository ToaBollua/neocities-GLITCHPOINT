// TRON Clock & Uptime
const startTime = Date.now();
const headerUp = document.getElementById("uptime-header");
const footerUp = document.getElementById("uptime-footer");
const clockHead = document.getElementById("clock-header");

setInterval(() => {
    let diffStr = Math.floor((Date.now() - startTime));
    let diffSec = Math.floor(diffStr / 1000);
    let hrs = Math.floor(diffSec / 3600);
    let mins = Math.floor((diffSec % 3600) / 60);
    let secs = diffSec % 60;
    if(headerUp) headerUp.innerText = `${hrs}h ${mins}m ${secs}s`;
    if(footerUp) footerUp.innerText = diffStr;
    
    const d = new Date();
    if(clockHead) clockHead.innerText = d.toTimeString().split(' ')[0];
}, 111);

// Glitch Frames
const randGlitch = () => {
    document.body.classList.add('glitch-frame-active');
    setTimeout(() => document.body.classList.remove('glitch-frame-active'), 150 + Math.random() * 150);
    setTimeout(randGlitch, 20000 + Math.random() * 20000);
};
setTimeout(randGlitch, 5000);

// Tab Title
let isDefaultTitle = true;
let originalTitle = document.title;
setInterval(() => {
    if(isDefaultTitle && originalTitle !== "404 // NOT_FOUND") {
        document.title = "> ¿me ves?";
        setTimeout(() => { document.title = originalTitle; }, 2000);
    }
}, 12000);

// Typewriter Effect
const twEls = document.querySelectorAll('.typewriter-text');
twEls.forEach(el => {
    const text = el.getAttribute('data-text');
    if(!text) return;
    el.textContent = '';
    let i = 0;
    const type = () => {
        if(i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 15 + Math.random() * 20);
        } else {
            el.classList.remove('typewriter-cursor');
        }
    };
    setTimeout(type, Math.random() * 300);
});

// Korrok Protocol
let inputBuffer = "";
const triggerWord = "korrok"; 

document.addEventListener('keydown', function(e) {
    if(e.key.length > 1) return;
    inputBuffer += e.key.toLowerCase();
    if (inputBuffer.length > triggerWord.length) {
        inputBuffer = inputBuffer.slice(-triggerWord.length);
    }
    if (inputBuffer === triggerWord) triggerAnomaly();
});

function triggerAnomaly() {
    const warn = document.getElementById('breach-warning');
    if(warn) warn.style.display = 'block';
    
    document.querySelectorAll('.korrok-wrapper').forEach(e => e.classList.add('active'));
    document.querySelectorAll('.korrok-box').forEach(e => e.classList.add('active'));
    
    isDefaultTitle = false;
    document.title = "KORROK_REVEALED_CONTAIN_IT";
    
    document.documentElement.style.setProperty('--term-green', '#ff0000');
    document.documentElement.style.setProperty('--term-cyan', '#ff0000');
    document.documentElement.style.setProperty('--term-bg', '#110000');
}

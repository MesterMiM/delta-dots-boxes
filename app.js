const isFa = navigator.language.startsWith('fa');
if (isFa) document.body.dir = "rtl";

// --- دیکشنری و متون ---
const dict = {
    title: isFa ? "نقطه‌بازی" : "Dots and Boxes",
    subtitle: isFa ? "انتخاب حالت بازی" : "Choose game mode",
    btnBot: isFa ? "🤖 بازی با ربات" : "🤖 Play with Bot",
    btnLocal: isFa ? "📱 دونفره (یک گوشی)" : "📱 Local (1 Phone)",
    btnPvp: isFa ? "🌐 دونفره (در چت)" : "🌐 Chat Multiplayer",
    p1DefaultName: isFa ? "بازیکن ۱" : "Player 1",
    p2DefaultName: isFa ? "بازیکن ۲" : "Player 2",
    p1You: isFa ? "شما" : "You",
    botName: isFa ? "ربات" : "Bot",
    resetBtn: isFa ? "از اول" : "Restart",
    resetVote: isFa ? "از اول" : "Restart",
    winMsg: isFa ? "برنده شد!" : "Wins!",
    drawMsg: isFa ? "بازی مساوی شد!" : "It's a Draw!"
};
let isMuted = false;
function toggleMute() {
    isMuted = !isMuted;
    document.getElementById('muteBtn').innerText = isMuted ? "🔇" : "🔊";
}

let player1Name = dict.p1DefaultName;
let player2Name = dict.p2DefaultName;
const myInitialName = (window.webxdc && window.webxdc.selfName) ? window.webxdc.selfName : dict.p1You;

let p1Icon = "A", p2Icon = "B";

const COLS = 8, ROWS = 14;
let gameMode = ''; 
let linesState = {}; 
let boxesState = {}; 
let scores = {1: 0, 2: 0};
let currentPlayer = 1; 
let totalBoxes = (COLS - 1) * (ROWS - 1);
let currentTurnBoxes = 0; // برای شمارش تعداد خانه‌های گرفته شده در یک نوبت

let pvpPlayerInfo = {}; 
let player1Addr = null, player2Addr = null;
let myPlayerId = 0; 
let resetVotes = {1: false, 2: false};

// --- سیستم تولید صدا (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (isMuted) return; // در صورت سایلنت بودن هیچ صدایی پخش نمی‌شود
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
        // صدای کلیک ساده
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
        
    } else if (type === 'jeez') {
        // صدای ملایم گرفتن یک خانه (شبیه قطره/پاپ)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
        
    } else if (type === 'tada') {
        // صدای جذاب گرفتن 4 خانه به بالا (بدون تغییر)
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        
    } else if (type === 'win') {
        // صدای جدید پیروزی: ملودی 4 نتی دلنشین به جای صدای کمپرسور
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // آکورد دو ماژور
        freqs.forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            o.frequency.value = freq;
            
            const startTime = ctx.currentTime + (i * 0.12);
            g.gain.setValueAtTime(0, startTime);
            g.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
            g.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
            
            o.connect(g);
            g.connect(ctx.destination);
            o.start(startTime);
            o.stop(startTime + 0.6);
        });
    }
}


// --- راه‌اندازی اولیه UI ---
document.getElementById('welcome-title').innerText = dict.title;
document.getElementById('welcome-subtitle').innerText = dict.subtitle;
document.getElementById('btn-bot').innerText = dict.btnBot;
document.getElementById('btn-local').innerText = dict.btnLocal;
document.getElementById('btn-pvp').innerText = dict.btnPvp;
document.getElementById('btn-reset').innerText = dict.resetBtn;
if(document.getElementById('btn-next')) document.getElementById('btn-next').style.display = 'none';

if (window.webxdc) {
    window.webxdc.setUpdateListener(function(update) {
        if (gameMode !== 'pvp') return; 
        const data = update.payload;
        const senderAddr = data.sender;
        updatePvpRoles(senderAddr, data.senderName);
        const movePlayerId = senderAddr === player1Addr ? 1 : (senderAddr === player2Addr ? 2 : 0);
        if (movePlayerId === 0) return; 

        if (data.type === 'move') {
            applyMove(data.id, movePlayerId, false);
        } else if (data.type === 'resetVote') {
            handleResetVote(movePlayerId);
        }
    }, 0);
}

function updateIcons() {
    if (gameMode === 'local') {
        p1Icon = 'A'; p2Icon = 'B';
    } else if (gameMode === 'bot') {
        p1Icon = player1Name ? player1Name.charAt(0).toUpperCase() : (isFa ? 'ش' : 'Y');
        p2Icon = '🤖';
    } else if (gameMode === 'pvp') {
        let i1 = player1Name ? player1Name.charAt(0).toUpperCase() : '1';
        let i2 = player2Name ? player2Name.charAt(0).toUpperCase() : '2';
        if (i1 === i2) { p1Icon = i1 + '1'; p2Icon = i2 + '2'; } 
        else { p1Icon = i1; p2Icon = i2; }
    }
    updateScoreUI();
}

function startGame(mode) {
    gameMode = mode;
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    void document.getElementById('game-screen').offsetHeight;

    if (mode === 'bot') {
        player1Name = myInitialName; player2Name = dict.botName;
    } else if (mode === 'local') {
        player1Name = dict.p1DefaultName; player2Name = dict.p2DefaultName;
    } else if (mode === 'pvp' && window.webxdc) {
        updatePvpRoles(window.webxdc.selfAddr, myInitialName);
    }
    
    updateIcons();
    resetBoardLocal(true); 
}

function drawBoard() {
    const boardDiv = document.getElementById('game-board');
    boardDiv.innerHTML = '';
    let boardWidth = boardDiv.clientWidth - 20;
    let boardHeight = boardDiv.clientHeight - 20;
    if (boardWidth <= 0 || boardHeight <= 0) {
        boardWidth = window.innerWidth - 40; boardHeight = window.innerHeight - 150; 
    }
    const CELL_SIZE = Math.floor(Math.min(boardWidth / (COLS - 1), boardHeight / (ROWS - 1)));
    const DOT_SIZE = Math.max(6, Math.floor(CELL_SIZE * 0.15));
    const LINE_THICKNESS = Math.max(8, Math.floor(CELL_SIZE * 0.3)); 
    const offsetX = (boardWidth + 20 - (CELL_SIZE * (COLS - 1))) / 2;
    const offsetY = (boardHeight + 20 - (CELL_SIZE * (ROWS - 1))) / 2;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const px = offsetX + c * CELL_SIZE;
            const py = offsetY + r * CELL_SIZE;

            if (r < ROWS - 1 && c < COLS - 1) {
                let box = document.createElement('div');
                box.className = 'box'; box.id = `box-${c}-${r}`;
                box.style.left = (px + DOT_SIZE) + 'px'; box.style.top = (py + DOT_SIZE) + 'px';
                box.style.width = (CELL_SIZE - DOT_SIZE) + 'px'; box.style.height = (CELL_SIZE - DOT_SIZE) + 'px';
                box.style.fontSize = (CELL_SIZE * 0.5) + 'px'; 
                box.style.display = 'flex'; box.style.alignItems = 'center'; box.style.justifyContent = 'center';
                boardDiv.appendChild(box);
            }
            if (c < COLS - 1) createLine(c, r, 'h', px + DOT_SIZE, py - (LINE_THICKNESS/2) + (DOT_SIZE/2), CELL_SIZE - DOT_SIZE, LINE_THICKNESS, boardDiv);
            if (r < ROWS - 1) createLine(c, r, 'v', px - (LINE_THICKNESS/2) + (DOT_SIZE/2), py + DOT_SIZE, LINE_THICKNESS, CELL_SIZE - DOT_SIZE, boardDiv);

            let dot = document.createElement('div');
            dot.className = 'dot'; dot.style.left = px + 'px'; dot.style.top = py + 'px';
            dot.style.width = DOT_SIZE + 'px'; dot.style.height = DOT_SIZE + 'px';
            boardDiv.appendChild(dot);
        }
    }
}

function createLine(c, r, dir, x, y, w, h, parent) {
    let line = document.createElement('div');
    line.className = 'line';
    const lineId = `${c}-${r}-${dir}`;
    line.id = `line-${lineId}`;
    line.style.left = x + 'px'; line.style.top = y + 'px';
    line.style.width = w + 'px'; line.style.height = h + 'px';
    line.onclick = () => onLineClick(lineId);
    parent.appendChild(line);
}

function onLineClick(id) {
    if (linesState[id]) return;
    playSound('click'); // صدای ریز کلیک
    
    if (gameMode === 'pvp') {
        if (currentPlayer !== myPlayerId) return; 
        if (window.webxdc) {
            window.webxdc.sendUpdate({
                payload: {type: 'move', id: id, sender: window.webxdc.selfAddr, senderName: myInitialName}
            }, `${player1Name}: ${scores[1]}, ${player2Name}: ${scores[2]}`);
        }
    } else {
        let activePlayer = gameMode === 'local' ? currentPlayer : 1;
        if (gameMode === 'bot' && currentPlayer !== 1) return;
        applyMove(id, activePlayer, true);
    }
}

function applyMove(id, player, isLocal) {
    if(linesState[id]) return;
    linesState[id] = player;
    document.getElementById(`line-${id}`).classList.add(`active-${player}`);
    
    const boxesMade = checkForBoxes(id, player);
    
    if (boxesMade > 0) {
        scores[player] += boxesMade;
        currentTurnBoxes += boxesMade;
        
        if (currentTurnBoxes > 4) {
            playSound('tada');
        } else {
            playSound('jeez');
        }

        updateScoreUI();
        checkGameOver();
    } else {
        currentTurnBoxes = 0; // ریست شمارنده کمبو برای نوبت بعد
        currentPlayer = player === 1 ? 2 : 1;
    }
    
    if (gameMode === 'bot' && currentPlayer === 2 && isLocal) {
        setTimeout(botMove, 500);
    }
}

function checkForBoxes(lineId, player) {
    let [c, r, dir] = lineId.split('-');
    c = parseInt(c); r = parseInt(r);
    let boxesCreated = 0;

    const checkAndFill = (bc, br) => {
        if (bc >= 0 && bc < COLS-1 && br >= 0 && br < ROWS-1 && !boxesState[`${bc}-${br}`]) {
            if (linesState[`${bc}-${br}-h`] && linesState[`${bc}-${br+1}-h`] &&
                linesState[`${bc}-${br}-v`] && linesState[`${bc+1}-${br}-v`]) {
                boxesState[`${bc}-${br}`] = player;
                let boxEl = document.getElementById(`box-${bc}-${br}`);
                boxEl.innerText = player === 1 ? p1Icon : p2Icon; 
                boxEl.classList.add('flash', `p${player}`);
                boxesCreated++;
            }
        }
    };

    if (dir === 'h') { checkAndFill(c, r - 1); checkAndFill(c, r); } 
    else { checkAndFill(c - 1, r); checkAndFill(c, r); }
    return boxesCreated;
}

function checkGameOver() {
    if (scores[1] + scores[2] === totalBoxes) {
        playSound('win'); // استفاده از صدای جدید پیروزی به جای clap
        setTimeout(() => {
            let msg = "";
            if (scores[1] > scores[2]) {
                msg = `${player1Name} ${dict.winMsg}`;
            } else if (scores[2] > scores[1]) {
                // اگر حالت بازی با ربات باشد، مستقیماً کلمه ربات را نمایش می‌دهد
                let p2Name = (gameMode === 'bot') ? "ربات" : player2Name;
                msg = `${p2Name} ${dict.winMsg}`;
            } else {
                msg = dict.drawMsg;
            }
            showToast(msg);
        }, 500);
    }
}


function showToast(message) {
    const toast = document.getElementById('toast-message');
    toast.innerText = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.style.display = 'none', 500);
    }, 3000); // محو شدن بعد از 3 ثانیه
}

// --- هوش مصنوعی ---
function botMove() {
    let availableLines = [];
    let completingLines = [];

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (c < COLS - 1 && !linesState[`${c}-${r}-h`]) availableLines.push(`${c}-${r}-h`);
            if (r < ROWS - 1 && !linesState[`${c}-${r}-v`]) availableLines.push(`${c}-${r}-v`);
        }
    }
    if(availableLines.length === 0) return;

    for (let line of availableLines) {
        let [c, r, dir] = line.split('-');
        c = parseInt(c); r = parseInt(r);
        
        let formsBox = false;
        if(dir === 'h') {
            if (is3Lines(c, r-1, line)) formsBox = true;
            if (is3Lines(c, r, line)) formsBox = true;
        } else {
            if (is3Lines(c-1, r, line)) formsBox = true;
            if (is3Lines(c, r, line)) formsBox = true;
        }
        if(formsBox) completingLines.push(line);
    }

    let moveId = completingLines.length > 0 ? completingLines[0] : availableLines[Math.floor(Math.random() * availableLines.length)];
    
    if (currentPlayer === 2) {
        playSound('click'); // صدای کلیک ربات
        applyMove(moveId, 2, false);
    }
    
    if(currentPlayer === 2) setTimeout(botMove, 500);
}

function is3Lines(bc, br, testLine) {
    if (bc < 0 || bc >= COLS-1 || br < 0 || br >= ROWS-1) return false;
    let lines = [`${bc}-${br}-h`, `${bc}-${br+1}-h`, `${bc}-${br}-v`, `${bc+1}-${br}-v`];
    let drawn = 0;
    for(let l of lines) {
        if(linesState[l] || l === testLine) drawn++;
    }
    return drawn === 4;
}

// --- توابع کمکی ---
function updateScoreUI() {
    const p1Score = scores[1] || 0;
    const p2Score = scores[2] || 0;
    document.getElementById('score-text').innerText = 
        `${player1Name} (${p1Icon}): ${p1Score} | ${player2Name} (${p2Icon}): ${p2Score}`;
}

function resetBoardLocal(resetScores = false) {
    linesState = {}; boxesState = {}; currentPlayer = 1; currentTurnBoxes = 0;
    if (resetScores) scores = {1: 0, 2: 0};
    drawBoard();
    updateScoreUI();
    
    if (gameMode === 'pvp') {
        resetVotes = {1: false, 2: false};
        updateResetBtn();
    }
}

function requestReset() {
    if (gameMode !== 'pvp') {
        resetBoardLocal(true); 
    } else {
        if(window.webxdc) window.webxdc.sendUpdate({payload: {type: 'resetVote', sender: window.webxdc.selfAddr, senderName: myInitialName}}, `Reset Vote`);
    }
}

function handleResetVote(player) {
    if(resetVotes[player]) return;
    resetVotes[player] = true;
    updateResetBtn();
    if(resetVotes[1] && resetVotes[2]) {
        resetBoardLocal(true); 
    }
}

function updateResetBtn() {
    let text = dict.resetBtn;
    if(gameMode === 'pvp') {
        let votes = (resetVotes[1]?1:0) + (resetVotes[2]?1:0);
        text = `${dict.resetVote} (${votes}/2)`;
    }
    document.getElementById('btn-reset').innerText = text;
}

function updatePvpRoles(addr, name) {
    if (!addr) return;
    
    let rolesChanged = false;
    if (!pvpPlayerInfo.hasOwnProperty(addr)) {
        pvpPlayerInfo[addr] = name || (isFa ? "ناشناس" : "Unknown");
        rolesChanged = true;
    }

    if (window.webxdc && !pvpPlayerInfo.hasOwnProperty(window.webxdc.selfAddr)) {
         pvpPlayerInfo[window.webxdc.selfAddr] = myInitialName;
         rolesChanged = true;
    }

    if (rolesChanged) {
        const sortedAddrs = Object.keys(pvpPlayerInfo).sort();
        if (sortedAddrs.length > 0) {
            player1Addr = sortedAddrs[0]; player1Name = pvpPlayerInfo[player1Addr];
        }
        if (sortedAddrs.length > 1) {
            player2Addr = sortedAddrs[1]; player2Name = pvpPlayerInfo[player2Addr];
        } else {
            player2Name = dict.p2DefaultName;
        }
        
        if (window.webxdc) myPlayerId = window.webxdc.selfAddr === player1Addr ? 1 : 2;
        updateIcons(); 
    }
}

window.addEventListener('resize', () => {
    if(document.getElementById('game-screen').style.display !== 'none') {
       setTimeout(drawBoard, 100);
    }
});

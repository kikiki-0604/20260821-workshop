// ゲーム状態
let gameState = {
    currentMoney: 10000,
    totalWinnings: 0,
    tickets: [],
    drawnCount: 0,
    winCount: 0,
};

// 当選パターン（確率と賞金）- 確率を大幅に下げた
const prizePatterns = [
    { name: '1等', probability: 0.0005, prize: 100000 },
    { name: '2等', probability: 0.001, prize: 50000 },
    { name: '3等', probability: 0.0025, prize: 10000 },
    { name: '4等', probability: 0.01, prize: 1000 },
    { name: '5等', probability: 0.01, prize: 500 },
    { name: 'ハズレ', probability: 0.976, prize: 0 },
];

let ticketIdCounter = 0;

// ゲーム初期化
function initGame() {
    gameState = {
        currentMoney: 10000,
        totalWinnings: 0,
        tickets: [],
        drawnCount: 0,
        winCount: 0,
    };
    ticketIdCounter = 0;
    renderTickets();
    updateUI();
    hideResultDisplay();
}

// UIの更新
function updateUI() {
    updateMoneyDisplay();
    updateTicketsDisplay();
    updateStats();
    updateButtonStates();
}

// お金表示の更新
function updateMoneyDisplay() {
    document.getElementById('currentMoney').textContent = formatMoney(gameState.currentMoney);
    document.getElementById('totalWinnings').textContent = formatMoney(gameState.totalWinnings);
}

// チケット表示の更新
function updateTicketsDisplay() {
    document.getElementById('ticketsCount').textContent = gameState.tickets.length;
}

// 統計情報の更新
function updateStats() {
    document.getElementById('drawnCount').textContent = gameState.drawnCount;
    document.getElementById('winCount').textContent = gameState.winCount;
    const winRate = gameState.drawnCount === 0 ? 0 : (gameState.winCount / gameState.drawnCount * 100).toFixed(1);
    document.getElementById('winRate').textContent = winRate + '%';
}

// ボタン状態の更新
function updateButtonStates() {
    const canBuy = gameState.currentMoney >= 100;
    const canBuyMulti = gameState.currentMoney >= 1000;
    const canDraw = gameState.tickets.length > 0 && gameState.tickets.some(t => !t.opened);

    document.getElementById('buyBtn').disabled = !canBuy;
    document.getElementById('buyMultiBtn').disabled = !canBuyMulti;
    document.getElementById('buyAllBtn').disabled = !canBuy;
    document.getElementById('drawBtn').disabled = !canDraw;
}

// お金をフォーマット
function formatMoney(money) {
    return money.toLocaleString('ja-JP');
}

// 宝くじを1枚買う
function buyTicket() {
    if (gameState.currentMoney < 100) {
        alert('資金が足りません');
        return;
    }

    gameState.currentMoney -= 100;
    const ticket = {
        id: ticketIdCounter++,
        number: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
        opened: false,
        result: null,
    };
    gameState.tickets.push(ticket);

    renderTickets();
    updateUI();
}

// 宝くじを10枚買う
function buyMultiTickets() {
    if (gameState.currentMoney < 1000) {
        alert('資金が足りません');
        return;
    }

    gameState.currentMoney -= 1000;
    for (let i = 0; i < 10; i++) {
        const ticket = {
            id: ticketIdCounter++,
            number: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            opened: false,
            result: null,
        };
        gameState.tickets.push(ticket);
    }

    renderTickets();
    updateUI();
}

// 全て使用
function buyAllTickets() {
    const money = gameState.currentMoney;
    if (money < 100) {
        alert('資金が不足しています（最小100円必要）');
        return;
    }

    const numTickets = Math.floor(money / 100);
    gameState.currentMoney -= numTickets * 100;

    for (let i = 0; i < numTickets; i++) {
        const ticket = {
            id: ticketIdCounter++,
            number: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            opened: false,
            result: null,
        };
        gameState.tickets.push(ticket);
    }

    renderTickets();
    updateUI();
}

// チケットをレンダリング
function renderTickets() {
    const container = document.getElementById('ticketContainer');
    container.innerHTML = '';

    for (let ticket of gameState.tickets) {
        const ticketEl = createTicketElement(ticket);
        container.appendChild(ticketEl);
    }
}

// チケット要素を作成
function createTicketElement(ticket) {
    const ticketEl = document.createElement('div');
    ticketEl.className = 'lottery-ticket';
    if (ticket.opened) {
        ticketEl.classList.add('opened');
        if (ticket.result.prize > 0) {
            ticketEl.classList.add('won');
        }
    }

    ticketEl.innerHTML = `
        <div class="ticket-number">No.${ticket.number}</div>
        <div class="ticket-status">クリックで開ける</div>
        <div class="ticket-result">${ticket.result ? (ticket.result.prize > 0 ? `${ticket.result.name}<br>${formatMoney(ticket.result.prize)}円` : 'ハズレ') : ''}</div>
    `;

    if (!ticket.opened) {
        ticketEl.style.cursor = 'pointer';
        ticketEl.addEventListener('click', () => openTicket(ticket.id));
    }

    return ticketEl;
}

// チケットを開く
function openTicket(ticketId) {
    const ticket = gameState.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    ticket.opened = true;
    ticket.result = determineResult();

    if (ticket.result.prize > 0) {
        gameState.currentMoney += ticket.result.prize;
        gameState.totalWinnings += ticket.result.prize;
        gameState.winCount++;
    }

    gameState.drawnCount++;

    renderTickets();
    updateUI();
    showResultDisplay(ticket.result);

    // ゲームオーバーチェック
    if (gameState.currentMoney <= 0) {
        setTimeout(() => {
            alert('資金がなくなりました！ゲームオーバーです。リセットしてもう一度チャレンジしてください。');
        }, 500);
    }
}

// 全て開ける
function drawAllTickets() {
    const unopenedTickets = gameState.tickets.filter(t => !t.opened);
    if (unopenedTickets.length === 0) return;

    let totalWin = 0;
    let totalCount = 0;

    unopenedTickets.forEach(ticket => {
        ticket.opened = true;
        ticket.result = determineResult();

        if (ticket.result.prize > 0) {
            gameState.currentMoney += ticket.result.prize;
            totalWin += ticket.result.prize;
            gameState.winCount++;
        }

        gameState.drawnCount++;
        totalCount++;
    });

    gameState.totalWinnings += totalWin;

    renderTickets();
    updateUI();

    const resultMessage = totalCount === 1 ?
        `${totalCount}枚開きました` :
        `${totalCount}枚開きました（当選金：${formatMoney(totalWin)}円）`;

    showResultDisplay({ name: '結果', prize: totalWin, message: resultMessage });

    // ゲームオーバーチェック
    if (gameState.currentMoney <= 0) {
        setTimeout(() => {
            alert('資金がなくなりました！ゲームオーバーです。リセットしてもう一度チャレンジしてください。');
        }, 500);
    }
}

// 結果を決定
function determineResult() {
    const rand = Math.random();
    let cumulative = 0;

    for (let pattern of prizePatterns) {
        cumulative += pattern.probability;
        if (rand < cumulative) {
            return pattern;
        }
    }

    return prizePatterns[prizePatterns.length - 1];
}

// 結果表示を表示
function showResultDisplay(result) {
    const display = document.getElementById('resultDisplay');
    const title = document.getElementById('resultTitle');
    const amount = document.getElementById('resultAmount');
    const message = document.getElementById('resultMessage');

    if (result.prize > 0) {
        title.textContent = `🎊 ${result.name}に当選！ 🎊`;
        amount.textContent = formatMoney(result.prize) + '円';
        message.textContent = 'おめでとうございます！';
    } else {
        title.textContent = '😢 ハズレ！';
        amount.textContent = '0円';
        message.textContent = '次に期待！';
    }

    display.style.display = 'block';

    setTimeout(() => {
        hideResultDisplay();
    }, 2000);
}

// 結果表示を非表示
function hideResultDisplay() {
    document.getElementById('resultDisplay').style.display = 'none';
}

// リセット
function reset() {
    if (confirm('本当にリセットしますか？')) {
        initGame();
    }
}

// イベントリスナー
document.getElementById('buyBtn').addEventListener('click', buyTicket);
document.getElementById('buyMultiBtn').addEventListener('click', buyMultiTickets);
document.getElementById('buyAllBtn').addEventListener('click', buyAllTickets);
document.getElementById('drawBtn').addEventListener('click', drawAllTickets);
document.getElementById('resetBtn').addEventListener('click', reset);

// ゲーム開始
initGame();

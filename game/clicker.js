export function getClickerHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>👆 点击大作战</title>
<style>
  body{background:linear-gradient(135deg,#2d1b3d,#1a1a2e);display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;font-family:'Microsoft YaHei',sans-serif;color:#fff;padding:20px}
  .box{background:rgba(255,255,255,0.08);backdrop-filter:blur(12px);border-radius:24px;padding:30px;max-width:400px;width:100%;text-align:center}
  h1{font-size:28px;margin-bottom:6px;color:#f472b6}
  .sub{color:#aaa;font-size:14px;margin-bottom:20px}
  .score{font-size:48px;font-weight:bold;margin:20px 0;color:#facc15}
  .timer{font-size:20px;margin:10px 0;color:#94a3b8}
  .click-area{background:rgba(255,255,255,0.05);border-radius:16px;padding:30px;margin:20px 0;cursor:pointer;transition:0.2s;user-select:none}
  .click-area:hover{background:rgba(255,255,255,0.1)}
  .click-area:active{transform:scale(0.95)}
  button{background:#8b5cf6;border:none;color:#fff;padding:10px 28px;border-radius:30px;cursor:pointer;transition:0.3s;font-size:16px}
  button:hover{background:#7c3aed}
  .back{display:inline-block;margin-top:20px;color:#a78bfa;text-decoration:none;border:1px solid #a78bfa;padding:6px 24px;border-radius:30px;transition:0.3s}
  .back:hover{background:#a78bfa;color:#1a1a2e}
</style>
</head>
<body>
<div class="box">
  <h1>👆 点击大作战</h1>
  <div class="sub">10秒倒计时，疯狂点击！</div>
  <div class="timer" id="timer">⏱️ 10s</div>
  <div class="score" id="score">0</div>
  <div class="click-area" id="clickArea" onclick="clickHandler()">👆 点这里</div>
  <button onclick="resetGame()">🔄 重新开始</button>
  <a href="/xyx" class="back">← 返回游戏中心</a>
</div>
<script>
  let count = 0, timeLeft = 10, running = false, timerId = null;
  const scoreEl = document.getElementById('score');
  const timerEl = document.getElementById('timer');
  const area = document.getElementById('clickArea');

  function clickHandler() {
    if (!running) return;
    count++;
    scoreEl.textContent = count;
  }

  function startGame() {
    if (running) return;
    count = 0;
    timeLeft = 10;
    scoreEl.textContent = '0';
    timerEl.textContent = '⏱️ 10s';
    running = true;
    area.style.cursor = 'pointer';
    timerId = setInterval(() => {
      timeLeft--;
      timerEl.textContent = '⏱️ ' + timeLeft + 's';
      if (timeLeft <= 0) {
        clearInterval(timerId);
        running = false;
        area.style.cursor = 'default';
        alert('⏰ 时间到！你点了 ' + count + ' 次！');
      }
    }, 1000);
  }

  function resetGame() {
    if (timerId) clearInterval(timerId);
    running = false;
    count = 0;
    timeLeft = 10;
    scoreEl.textContent = '0';
    timerEl.textContent = '⏱️ 10s';
    area.style.cursor = 'default';
    setTimeout(startGame, 300);
  }

  window.onload = startGame;
</script>
</body>
</html>`;
}

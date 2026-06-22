export function getGuessHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>🔢 猜数字</title>
<style>
  body{background:linear-gradient(135deg,#1e293b,#0f172a);display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;font-family:'Microsoft YaHei',sans-serif;color:#fff;padding:20px}
  .box{background:rgba(255,255,255,0.08);backdrop-filter:blur(12px);border-radius:24px;padding:30px;max-width:400px;width:100%;text-align:center}
  h1{font-size:28px;margin-bottom:6px;color:#facc15}
  .sub{color:#aaa;font-size:14px;margin-bottom:20px}
  .input-group{display:flex;gap:10px;justify-content:center;margin:20px 0}
  input{padding:10px 14px;border-radius:8px;border:1px solid #4b5563;background:#1e293b;color:#fff;font-size:18px;width:120px;text-align:center}
  button{background:#3b82f6;border:none;color:#fff;padding:10px 24px;border-radius:30px;cursor:pointer;transition:0.3s}
  button:hover{background:#2563eb}
  .msg{font-size:18px;margin:16px 0;min-height:40px}
  .hint{color:#94a3b8;font-size:14px}
  .back{display:inline-block;margin-top:20px;color:#a78bfa;text-decoration:none;border:1px solid #a78bfa;padding:6px 24px;border-radius:30px;transition:0.3s}
  .back:hover{background:#a78bfa;color:#0f172a}
</style>
</head>
<body>
<div class="box">
  <h1>🔢 猜数字</h1>
  <div class="sub">1 ~ 100 之间，猜中为止</div>
  <div class="msg" id="msg">输入数字开始</div>
  <div class="input-group">
    <input type="number" id="guessInput" min="1" max="100" placeholder="?">
    <button onclick="guess()">猜</button>
  </div>
  <div class="hint" id="hint">范围：1 ~ 100</div>
  <a href="/xyx" class="back">← 返回游戏中心</a>
</div>
<script>
  const target = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;
  function guess() {
    const input = document.getElementById('guessInput');
    const val = parseInt(input.value);
    if (isNaN(val) || val < 1 || val > 100) { alert('请输入1~100之间的整数'); return; }
    attempts++;
    const msg = document.getElementById('msg');
    const hint = document.getElementById('hint');
    if (val === target) {
      msg.innerHTML = '🎉 猜对了！就是 ' + target + '，用了 ' + attempts + ' 次';
      hint.textContent = '🏆 你赢了！刷新页面可重新开始';
      input.disabled = true;
    } else if (val < target) {
      msg.innerHTML = '📈 小了，再大点';
      hint.textContent = '范围：' + (val + 1) + ' ~ 100';
    } else {
      msg.innerHTML = '📉 大了，再小点';
      hint.textContent = '范围：1 ~ ' + (val - 1);
    }
    input.value = '';
    input.focus();
  }
</script>
</body>
</html>`;
}

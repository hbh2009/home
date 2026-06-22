export function getGachaHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>⭐ 抽卡模拟器</title>
<style>
  body{background:linear-gradient(135deg,#1a1a2e,#16213e);display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;font-family:'Microsoft YaHei',sans-serif;color:#fff;padding:20px}
  .box{background:rgba(255,255,255,0.08);backdrop-filter:blur(12px);border-radius:24px;padding:30px;max-width:480px;width:100%;border:1px solid rgba(255,255,255,0.1);text-align:center}
  h1{font-size:28px;margin-bottom:6px;background:linear-gradient(135deg,#fbbf24,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .sub{color:#aaa;font-size:14px;margin-bottom:20px}
  .result-box{background:rgba(0,0,0,0.3);border-radius:12px;padding:16px;min-height:90px;margin:20px 0;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center}
  .star{font-size:28px;display:inline-block;animation:fadeIn 0.3s}
  @keyframes fadeIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
  .btn{background:#8b5cf6;border:none;color:#fff;padding:12px 28px;border-radius:30px;font-size:16px;cursor:pointer;transition:0.3s;margin:5px}
  .btn:hover{transform:scale(1.05);background:#7c3aed}
  .btn-secondary{background:#374151}
  .btn-secondary:hover{background:#4b5563}
  .back{display:inline-block;margin-top:20px;color:#a78bfa;text-decoration:none;border:1px solid #a78bfa;padding:6px 24px;border-radius:30px;transition:0.3s}
  .back:hover{background:#a78bfa;color:#1a1a2e}
  .counter{font-size:14px;color:#ccc;margin:10px 0}
</style>
</head>
<body>
<div class="box">
  <h1>⭐ 抽卡模拟器</h1>
  <div class="sub">原神标准池 · 5星概率0.6%</div>
  <div class="result-box" id="result">点击下方按钮开始抽卡</div>
  <div class="counter">已抽 <span id="count">0</span> 次</div>
  <div>
    <button class="btn" onclick="draw(1)">单抽</button>
    <button class="btn btn-secondary" onclick="draw(10)">十连</button>
  </div>
  <a href="/xyx" class="back">← 返回游戏中心</a>
</div>
<script>
  let total = 0;
  function draw(n) {
    let html = '';
    let five = false;
    for (let i=0; i<n; i++) {
      total++;
      const r = Math.random();
      let star = '';
      if (r < 0.006) { star = '⭐'; five = true; }
      else if (r < 0.056) { star = '🌟'; }
      else if (r < 0.256) { star = '💫'; }
      else { star = '✨'; }
      html += '<span class="star">' + star + '</span>';
    }
    document.getElementById('result').innerHTML = html;
    document.getElementById('count').textContent = total;
    if (five) {
      setTimeout(() => alert('🎉 出五星了！'), 100);
    }
  }
</script>
</body>
</html>`;
}

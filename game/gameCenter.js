export function getGameCenterHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎮 整活游戏中心</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e1e2f, #2a2a3e);
      font-family: 'Microsoft YaHei', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .game-container {
      max-width: 700px;
      width: 100%;
      background: rgba(255,255,255,0.08);
      backdrop-filter: blur(12px);
      border-radius: 24px;
      padding: 30px 25px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.1);
      text-align: center;
      color: #fff;
    }
    h1 {
      font-size: 32px;
      margin-bottom: 6px;
      background: linear-gradient(135deg, #f472b6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .sub {
      font-size: 14px;
      color: #aaa;
      margin-bottom: 30px;
    }
    .game-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .game-card {
      background: rgba(255,255,255,0.06);
      border-radius: 16px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      transition: all 0.25s;
      border: 1px solid rgba(255,255,255,0.06);
      text-align: left;
      color: #fff;
      text-decoration: none;
    }
    .game-card:hover {
      background: rgba(255,255,255,0.14);
      transform: scale(1.02);
      border-color: #a78bfa;
    }
    .game-icon {
      font-size: 36px;
      flex-shrink: 0;
      width: 50px;
    }
    .game-info {
      flex: 1;
    }
    .game-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .game-desc {
      font-size: 13px;
      color: #bbb;
    }
    .back-link {
      display: inline-block;
      margin-top: 25px;
      color: #a78bfa;
      text-decoration: none;
      border: 1px solid #a78bfa;
      padding: 8px 28px;
      border-radius: 30px;
      transition: 0.3s;
    }
    .back-link:hover {
      background: #a78bfa;
      color: #1e1e2f;
    }
    @media (max-width: 500px) {
      .game-card { flex-direction: column; text-align: center; }
      .game-icon { width: auto; }
    }
  </style>
</head>
<body>
<div class="game-container">
  <h1>🎮 整活游戏中心</h1>
  <div class="sub">选一个游戏，开始你的表演</div>
  <div class="game-grid">
    <a href="/xyx/gacha" class="game-card">
      <span class="game-icon">⭐</span>
      <div class="game-info">
        <div class="game-name">原神抽卡模拟器</div>
        <div class="game-desc">单抽/十连，体验非酋与欧皇的极致反差</div>
      </div>
    </a>
    <a href="/xyx/guess" class="game-card">
      <span class="game-icon">🔢</span>
      <div class="game-info">
        <div class="game-name">猜数字</div>
        <div class="game-desc">1~100 之间猜，看谁猜得准</div>
      </div>
    </a>
    <a href="/xyx/clicker" class="game-card">
      <span class="game-icon">👆</span>
      <div class="game-info">
        <div class="game-name">点击大作战</div>
        <div class="game-desc">10秒倒计时，疯狂点击拼手速</div>
      </div>
    </a>
  </div>
  <a href="/" class="back-link">🏠 回主页</a>
</div>
</body>
</html>`;
}

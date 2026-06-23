export function getYsnbHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎉 原神牛逼</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Microsoft YaHei', sans-serif;
      overflow: hidden;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      width: 100%;
      background: rgba(255,255,255,0.08);
      backdrop-filter: blur(14px);
      border-radius: 24px;
      padding: 40px 30px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }
    h1 {
      font-size: 52px;
      background: linear-gradient(135deg, #f472b6, #fbbf24, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .sub {
      color: #c4b5fd;
      font-size: 18px;
      margin-bottom: 30px;
      letter-spacing: 2px;
    }
    .btn-group {
      display: flex;
      gap: 14px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      padding: 12px 32px;
      border: none;
      border-radius: 40px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }
    .btn-primary {
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      color: #fff;
    }
    .btn-primary:hover {
      transform: scale(1.06);
      box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
    }
    .btn-secondary {
      background: rgba(255,255,255,0.1);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.2);
    }
    .footer-hint {
      margin-top: 30px;
      font-size: 13px;
      color: #6b7280;
    }
    /* 飘落的星星 */
    .stars {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 0;
    }
    .star {
      position: absolute;
      font-size: 20px;
      animation: fall linear infinite;
      opacity: 0.6;
    }
    @keyframes fall {
      0% { transform: translateY(-60px) rotate(0deg); opacity: 0.8; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }
    .container { position: relative; z-index: 1; }
  </style>
</head>
<body>
<div class="stars" id="starContainer"></div>
<div class="container">
  <h1>✨ 原神牛逼 ✨</h1>
  <div class="sub">🎊 你发现了隐藏彩蛋！</div>
  <div class="btn-group">
    <a href="/" class="btn btn-primary">🏠 回主页</a>
    <a href="/xyx" class="btn btn-secondary">🎮 去游戏中心</a>
  </div>
  <div class="footer-hint">💡 按 F12 看看控制台有什么惊喜</div>
</div>
<script>
  // 飘落的星星
  const emojis = ['⭐', '🌟', '✨', '💫', '🎆'];
  const container = document.getElementById('starContainer');
  for (let i = 0; i < 35; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    star.style.left = Math.random() * 100 + '%';
    star.style.fontSize = (14 + Math.random() * 22) + 'px';
    star.style.animationDuration = (5 + Math.random() * 8) + 's';
    star.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(star);
  }

  // 控制台彩蛋
  console.log('%c🎉 原神牛逼！', 'font-size:28px; color: #fbbf24; font-weight: bold;');
  console.log('%c🌟 你发现了隐藏彩蛋！', 'font-size:16px; color: #c4b5fd;');
  console.log('%c👀 欢迎来到 ysnb 的秘密领地~', 'font-size:14px; color: #8b5cf6;');
</script>
</body>
</html>`;
}
// 404.js - 完全独立的 404 页面模块

// 内部使用的 HTML 转义函数（防止 XSS）
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

export function get404Page(reason = "页面走丢了") {
  const safeReason = escHtml(reason);
  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - 页面走丢了</title>
  <style>
    /* 完全重置，隔离所有外部样式 */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: #1e293b;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif;
      color: #fff;
      text-align: center;
      line-height: 1.6;
    }
    .box {
      background: rgba(255,255,255,0.05);
      padding: 50px 60px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      max-width: 90%;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }
    h1 {
      font-size: 80px;
      margin: 0 0 10px 0;
      background: linear-gradient(135deg, #f472b6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .sub {
      font-size: 20px;
      color: #94a3b8;
      margin: 10px 0 20px 0;
    }
    .reason {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 30px;
      word-break: break-all;
    }
    a {
      display: inline-block;
      color: #a78bfa;
      text-decoration: none;
      border: 1px solid #a78bfa;
      padding: 10px 30px;
      border-radius: 30px;
      transition: 0.3s;
      background: transparent;
      font-size: 16px;
      cursor: pointer;
    }
    a:hover {
      background: #a78bfa;
      color: #0f172a;
    }
  </style>
</head>
<body>
<div class="box">
  <h1>404</h1>
  <div class="sub">哎呀，页面掉进次元裂缝了</div>
  <div class="reason">💔 ${safeReason}</div>
  <a href="/">✨ 传送回主页</a>
</div>
</body>
</html>`;
}

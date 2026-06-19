/**
 * 胡柏珲个人主页 - Bug全修复 + 优化版
 */

// ========== 核心配置 ==========
const ADMIN_PASSWORD = "admin123";
const DEFAULT_SONG_ID = "452814990";
// ============================

// 完整页面HTML
function getPageHtml(songId) {
  const coverUrl = "https://p1.music.126.net/2Vv1nXkGumZ5qX6Ch12yvA==/109951163145807804.jpg";
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>胡柏珲的个人主页</title>
  <meta name="referrer" content="no-referrer">
  <link rel="stylesheet" href="https://unpkg.com/aplayer/dist/APlayer.min.css">
  <style>
    :root {
      --primary: #2563eb;
      --bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      --card: rgba(255, 255, 255, 0.72);
      --text: #2d3748;
      --title: #1a202c;
      --border: rgba(226, 232, 240, 0.7);
      --mask: rgba(0,0,0,0.5);
    }
    .theme-pink { --primary: #ec4899; --bg: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); }
    .theme-green { --primary: #10b981; --bg: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); }
    .theme-purple { --primary: #8b5cf6; --bg: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); }
    .dark {
      --bg: #18181b;
      --card: rgba(39, 39, 42, 0.7);
      --text: #e4e4e7;
      --title: #f4f4f5;
      --border: rgba(82, 82, 91, 0.7);
      --mask: rgba(0,0,0,0.7);
      background-blend-mode: multiply;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; overflow-x: hidden; }
    body {
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", sans-serif;
      line-height: 2.5;
      background: var(--bg);
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      color: var(--text);
      transition: all 0.4s ease;
      padding: 20px 15px;
    }
    .info-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: var(--card);
      padding: 35px 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      backdrop-filter: blur(14px);
    }
    .music-player-wrapper { width: 100%; max-width: 420px; margin: 25px auto 0; }
    #aplayer { max-width: 420px; margin: 20px auto; }
    @media (max-width: 768px) {
      .music-player-wrapper { padding: 0 10px; margin: 0.8rem auto 0; }
      html, body { touch-action: manipulation; }
    }
    h1 {
      margin-bottom: 20px;
      color: var(--title);
      font-size: 24px;
      text-align: center;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 10px;
      cursor: pointer;
    }
    p { font-size: 16px; padding-left: 5px; word-wrap: break-word; opacity: 1; }
    .contact-title {
      font-size: 18px; font-weight: 700; color: var(--title);
      margin: 25px 0 10px; padding-left: 5px; border-left: 3px solid var(--primary);
    }
    .contact-item { margin: 8px 0; padding-left: 8px; }
    a { color: var(--primary); text-decoration: none; font-weight: 500; }
    #emailCopy { color: var(--primary); font-weight: 500; cursor: pointer; }
    #copyTip { font-size: 14px; color: #16a34a; margin-left: 10px; display: none; }
    .ctrl-group {
      margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border);
      display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
    }
    .lang-btn, .theme-btn, .dark-btn, .bg-btn, .xiaohei-toggle-btn, .admin-btn {
      background: var(--card); border: 1px solid var(--primary);
      color: var(--primary); padding: 6px 14px; border-radius: 6px;
      cursor: pointer; font-size: 14px; transition: all 0.2s; font-family: inherit;
    }
    .lang-btn.active, .theme-btn.active, .dark-btn.active, .bg-btn.active, .xiaohei-toggle-btn.active {
      background: var(--primary); color: #fff;
    }
    #bgSwitchGroup {
      display: none; margin-top: 15px; padding-top: 15px;
      border-top: 1px solid var(--border); flex-wrap: wrap; gap: 8px; justify-content: center;
    }
    #bgSwitchGroup.show { display: flex; }
    .xiaohei-toggle-group { margin-top: 15px; text-align: center; padding-top: 15px; border-top: 1px solid var(--border); }
    .modal-mask {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: var(--mask); backdrop-filter: blur(4px); z-index: 99998;
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .modal-mask.show { display: flex; }
    .modal-box {
      background: var(--card); border-radius: 12px; max-width: 500px; width: 100%;
      padding: 30px 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); backdrop-filter: blur(14px);
    }
    .modal-title {
      font-size: 20px; font-weight: 700; color: var(--title);
      text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--primary);
    }
    .form-item { margin-bottom: 20px; }
    .form-label { font-size: 14px; display: block; margin-bottom: 8px; }
    .form-input {
      width: 100%; padding: 10px 12px; border: 1px solid var(--border);
      border-radius: 6px; background: rgba(255,255,255,0.1);
      color: var(--text); font-size: 14px; font-family: inherit;
    }
    .modal-btn-group { display: flex; gap: 10px; justify-content: center; margin-top: 25px; }
    .modal-btn { padding: 8px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; border: none; font-family: inherit; }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-default { background: var(--card); border: 1px solid var(--border); color: var(--text); }
    .toast {
      position: fixed; top: 30px; left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background: var(--primary); color: #fff; padding: 10px 20px;
      border-radius: 8px; z-index: 99999; opacity: 0; transition: all 0.4s;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .paw {
      position: fixed; pointer-events: none; z-index: 9999;
      font-size: 22px; animation: pawAnim 0.9s ease-out forwards;
    }
    @keyframes pawAnim {
      0% { opacity: 1; transform: scale(0.8); }
      50% { transform: scale(1.1); }
      100% { opacity: 0; transform: scale(0.6) translateY(-12px); }
    }
    .paw-fall {
      position: fixed; top: -50px; font-size: 24px;
      z-index: 9998; pointer-events: none;
      animation: pawFall 3s linear forwards;
    }
    @keyframes pawFall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    .quote-toast {
      position: fixed; bottom: 80px; left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--card); border: 1px solid var(--primary);
      padding: 12px 24px; border-radius: 8px; z-index: 99999;
      opacity: 0; transition: all 0.4s; max-width: 80%; text-align: center;
    }
    .quote-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    #xiaohei {
      position: fixed; width: 65px; height: auto; z-index: 999;
      right: 20px; bottom: 20px; transition: transform 0.1s;
    }
    #xiaohei.hidden { opacity: 0; pointer-events: none; }
    #xiaohei.jump { animation: xiaoheiJump 0.5s ease-in-out; }
    @keyframes xiaoheiJump {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(0, -20px) scale(1.1); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @media (max-width: 480px) {
      #xiaohei { width: 50px; right: 15px; bottom: 15px; }
      .info-container { padding: 25px 20px; }
      h1 { font-size: 22px; }
    }
  </style>
</head>
<body>
<div class="info-container">
  <h1 id="pageHeader">胡柏珲的个人主页</h1>
  <p>你好，我是胡柏珲</p>
  <p>09年河南人，现居住于河南郑州</p>
  <p>目前混的圈比较杂：
    <a href="https://www.dnaxcat.net/" target="_blank" rel="noopener noreferrer">九藏喵窝</a>、
    <span>罗小黑</span>、
    <a href="https://sr.mihoyo.com/" target="_blank" rel="noopener noreferrer">崩</a>
    <a href="https://ys.mihoyo.com/" target="_blank" rel="noopener noreferrer">原</a>
    <a href="https://zzz.mihoyo.com/" target="_blank" rel="noopener noreferrer">绝</a>
    <span>三家</span>、
    <a href="https://www.minecraft.net/zh-hans" target="_blank" rel="noopener noreferrer">我的世界</a>、
    <span>有兽焉</span>
  </p>

  <div class="contact-title">联系方式</div>
  <p class="contact-item">QQ：<a href="https://qm.qq.com/q/N35Yopvmwi" target="_blank">3556976065</a></p>
  <p class="contact-item">邮箱：<span id="emailCopy">hubohui@outlook.com</span><span id="copyTip">已复制</span></p>
  <p>在线北京时间：<span id="localTime"></span></p>

  <div class="ctrl-group">
    <button class="lang-btn active" id="zh-CN">简体</button>
    <button class="lang-btn" id="zh-TW">繁體</button>
    <button class="dark-btn" id="toggleDark">深色模式</button>
    <div style="width:100%;height:4px;"></div>
    <button class="theme-btn active" data-theme="">默认蓝</button>
    <button class="theme-btn" data-theme="theme-pink">可爱粉</button>
    <button class="theme-btn" data-theme="theme-green">清新绿</button>
    <button class="theme-btn" data-theme="theme-purple">梦幻紫</button>
  </div>

  <div id="bgSwitchGroup">
    <button class="bg-btn" data-bg="spring">🌸 春天</button>
    <button class="bg-btn" data-bg="summer">🌿 夏天</button>
    <button class="bg-btn" data-bg="autumn">🍂 秋天</button>
    <button class="bg-btn" data-bg="default">恢复默认</button>
  </div>

  <div class="xiaohei-toggle-group">
    <button class="xiaohei-toggle-btn" id="toggleXiaohei">隐藏小黑 🐾</button>
  </div>
  <div class="xiaohei-toggle-group" style="border-top:none;padding-top:10px;">
    <button class="admin-btn" id="adminBtn" style="opacity:0.3;font-size:12px;">管理</button>
  </div>

  <div class="music-player-wrapper">
    <div id="aplayer"></div>
  </div>
</div>

<div class="modal-mask" id="adminModal">
  <div class="modal-box">
    <div class="modal-title">管理员后台</div>
    <div class="form-item">
      <label class="form-label">管理员密码</label>
      <input type="password" class="form-input" id="adminPassword">
    </div>
    <div class="form-item">
      <label class="form-label">网易云音乐歌曲ID</label>
      <input type="text" class="form-input" id="musicIdInput" placeholder="例如：452814990">
    </div>
    <div class="modal-btn-group">
      <button class="modal-btn btn-default" id="closeModal">取消</button>
      <button class="modal-btn btn-primary" id="saveMusicBtn">保存修改</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>
<div class="quote-toast" id="quoteToast"></div>
<img id="xiaohei" src="https://i.postimg.cc/SN87V4Pw/处理完成图片20260303052740.gif" alt="罗小黑">

<script src="https://unpkg.com/aplayer/dist/APlayer.min.js"></script>
<script>
(function() {
  'use strict';

  const CURRENT_SONG_ID = '${songId}';

  const bgConfig = {
    spring: "https://s41.ax1x.com/2026/03/03/pep6CM4.png",
    summer: "https://s41.ax1x.com/2026/03/03/pep6PsJ.png",
    autumn: "https://s41.ax1x.com/2026/03/03/pep6iL9.png",
    default: "var(--bg)"
  };
  const xiaoheiQuotes = [
    "我叫罗小黑，请多指教~",
    "只要有你在，哪里都是家",
    "我不想再分开了",
    "我可以跟你一起走吗？",
    "师傅，我错了，但我下次还敢~",
    "比丢！不准乱吃东西！"
  ];
  const langPack = {
    "zh-CN": {
      pageTitle: "胡柏珲的个人主页", contact: "联系方式", copyTip: "已复制",
      adminTitle: "管理员后台", adminPwd: "管理员密码", adminMusic: "网易云音乐歌曲ID",
      cancel: "取消", save: "保存修改", darkMode: "深色模式",
      showXiaohei: "显示小黑 🐾", hideXiaohei: "隐藏小黑 🐾"
    },
    "zh-TW": {
      pageTitle: "胡柏珲的個人主頁", contact: "聯絡方式", copyTip: "已複製",
      adminTitle: "管理員後台", adminPwd: "管理員密碼", adminMusic: "網易雲音樂歌曲ID",
      cancel: "取消", save: "儲存修改", darkMode: "深色模式",
      showXiaohei: "顯示小黑 🐾", hideXiaohei: "隱藏小黑 🐾"
    }
  };

  const $ = id => document.getElementById(id);
  const pageHeader = $('pageHeader'), localTime = $('localTime');
  const emailCopyEl = $('emailCopy'), copyTipEl = $('copyTip');
  const toggleDark = $('toggleDark'), bgSwitchGroup = $('bgSwitchGroup');
  const xiaohei = $('xiaohei'), toggleXiaohei = $('toggleXiaohei');
  const quoteToast = $('quoteToast'), toast = $('toast');
  const adminModal = $('adminModal'), adminBtn = $('adminBtn');
  const closeModal = $('closeModal'), saveMusicBtn = $('saveMusicBtn');
  const adminPassword = $('adminPassword'), musicIdInput = $('musicIdInput');

  const storage = {
    get: (k, d) => localStorage.getItem(k) || d,
    set: (k, v) => localStorage.setItem(k, v)
  };
  const padZero = n => String(n).padStart(2, '0');

  function showToastMsg(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // 实时时间
  function updateTime() {
    const d = new Date();
    localTime.textContent = d.getFullYear() + "-" + padZero(d.getMonth()+1) + "-" + padZero(d.getDate()) + " " +
      padZero(d.getHours()) + ":" + padZero(d.getMinutes()) + ":" + padZero(d.getSeconds());
  }
  updateTime();
  setInterval(updateTime, 1000);

  // 邮箱复制
  emailCopyEl.onclick = async () => {
    try {
      await navigator.clipboard.writeText('hubohui@outlook.com');
      copyTipEl.style.display = 'inline';
      setTimeout(() => copyTipEl.style.display = 'none', 2000);
    } catch { /* fallback */ }
  };

  // 简繁切换
  let currentLang = storage.get('lang', 'zh-CN');
  function applyLang() {
    const pack = langPack[currentLang];
    document.title = pack.pageTitle;
    pageHeader.textContent = pack.pageTitle;
    document.querySelector('.contact-title').textContent = pack.contact;
    toggleDark.textContent = pack.darkMode;
    copyTipEl.textContent = pack.copyTip;
    document.querySelector('.modal-title').textContent = pack.adminTitle;
    document.querySelectorAll('.form-label')[0].textContent = pack.adminPwd;
    document.querySelectorAll('.form-label')[1].textContent = pack.adminMusic;
    $('closeModal').textContent = pack.cancel;
    $('saveMusicBtn').textContent = pack.save;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    $(currentLang).classList.add('active');
    const isHidden = xiaohei.classList.contains('hidden');
    toggleXiaohei.textContent = isHidden ? pack.showXiaohei : pack.hideXiaohei;
  }
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.onclick = () => { currentLang = b.id; storage.set('lang', currentLang); applyLang(); };
  });

  // 主题切换
  let currentTheme = storage.get('theme', '');
  function setTheme(t) {
    document.body.classList.remove('theme-pink', 'theme-green', 'theme-purple');
    if (t) document.body.classList.add(t);
    storage.set('theme', t);
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === t));
  }
  document.querySelectorAll('.theme-btn').forEach(b => { b.onclick = () => setTheme(b.dataset.theme); });

  // 深色模式
  let isDark = storage.get('dark') === 'true';
  function applyDark() {
    document.body.classList.toggle('dark', isDark);
    toggleDark.classList.toggle('active', isDark);
    storage.set('dark', isDark);
  }
  toggleDark.onclick = () => { isDark = !isDark; applyDark(); };

  // 猫爪点击特效
  document.addEventListener('click', e => {
    const p = document.createElement('div');
    p.className = 'paw'; p.textContent = '🐾';
    p.style.left = (e.clientX - 10) + 'px';
    p.style.top = (e.clientY - 12) + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  });

  // 罗小黑
  let backTimer, isXiaoheiHome = true;
  let xiaoheiVisible = storage.get('xiaoheiVisible', 'true') === 'true';
  function initXiaohei() {
    xiaohei.classList.toggle('hidden', !xiaoheiVisible);
    toggleXiaohei.textContent = xiaoheiVisible ? langPack[currentLang].hideXiaohei : langPack[currentLang].showXiaohei;
  }
  toggleXiaohei.onclick = () => {
    xiaoheiVisible = !xiaoheiVisible;
    xiaohei.classList.toggle('hidden', !xiaoheiVisible);
    toggleXiaohei.textContent = xiaoheiVisible ? langPack[currentLang].hideXiaohei : langPack[currentLang].showXiaohei;
    storage.set('xiaoheiVisible', xiaoheiVisible);
  };
  function goBackHome() { xiaohei.style.transform = "translate(0, 0)"; isXiaoheiHome = true; }
  document.addEventListener('mousemove', e => {
    if (!xiaoheiVisible) return;
    isXiaoheiHome = false;
    clearTimeout(backTimer);
    const w = xiaohei.offsetWidth, h = xiaohei.offsetHeight;
    xiaohei.style.transform = "translate(" + (e.clientX - window.innerWidth + w/2 + 20) + "px," + (e.clientY - window.innerHeight + h/2 + 20) + "px)";
    backTimer = setTimeout(goBackHome, 2000);
  });
  xiaohei.onclick = () => {
    if (isXiaoheiHome && xiaoheiVisible) {
      xiaohei.classList.remove('jump'); void xiaohei.offsetWidth;
      xiaohei.classList.add('jump');
      setTimeout(() => xiaohei.classList.remove('jump'), 500);
    }
  };

  // 标题5次点击解锁背景
  let titleClick = 0, titleTimer;
  let bgUnlocked = storage.get('bgUnlocked') === 'true';
  pageHeader.onclick = () => {
    if (bgUnlocked) return;
    titleClick++; clearTimeout(titleTimer);
    titleTimer = setTimeout(() => titleClick = 0, 3000);
    if (titleClick === 5) {
      titleClick = 0; bgUnlocked = true;
      storage.set('bgUnlocked', true);
      bgSwitchGroup.classList.add('show');
      showToastMsg('🎉 背景功能已解锁！');
    }
  };

  // 背景切换
  let currentBg = storage.get('currentBg', 'default');
  function setBg(b) {
    if (!bgConfig[b]) return;
    currentBg = b; storage.set('currentBg', b);
    if (b === 'default') {
      document.body.style.background = 'var(--bg)';
    } else {
      document.body.style.background = "url(" + bgConfig[b] + ")";
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    }
    document.querySelectorAll('.bg-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.bg === b));
    applyDark();
  }
  document.querySelectorAll('.bg-btn').forEach(btn => { btn.onclick = () => setBg(btn.dataset.bg); });

  // Konami彩蛋
  let konamiIdx = 0;
  const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
  let konamiUnlocked = storage.get('konamiUnlocked') === 'true';
  document.addEventListener('keydown', e => {
    if (konamiUnlocked) return;
    if (e.code === konamiCode[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiCode.length) { triggerKonami(); konamiIdx = 0; }
    } else { konamiIdx = 0; }
  });
  function triggerKonami() {
    konamiUnlocked = true; storage.set('konamiUnlocked', true);
    quoteToast.textContent = xiaoheiQuotes[Math.floor(Math.random() * xiaoheiQuotes.length)];
    quoteToast.classList.add('show');
    setTimeout(() => quoteToast.classList.remove('show'), 4000);
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        p.className = 'paw-fall'; p.textContent = '🐾';
        p.style.left = Math.random() * window.innerWidth + 'px';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 5000);
      }, i * 100);
    }
    setTheme('theme-purple');
  }

  // 管理员后台
  adminBtn.onclick = () => {
    adminModal.classList.add('show');
    musicIdInput.value = CURRENT_SONG_ID;
    adminPassword.value = '';
  };
  closeModal.onclick = () => { adminModal.classList.remove('show'); adminPassword.value = ''; };
  adminModal.onclick = (e) => { if (e.target === adminModal) closeModal.onclick(); };
  saveMusicBtn.onclick = async () => {
    const pwd = adminPassword.value.trim();
    const id = musicIdInput.value.trim();
    if (!pwd) return showToastMsg('请输入管理员密码');
    if (!id || !/^\d+$/.test(id)) return showToastMsg('请输入有效的歌曲ID（纯数字）');
    try {
      const res = await fetch(location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd, songId: id })
      });
      const d = await res.json();
      if (d.success) { showToastMsg('保存成功！页面即将刷新'); setTimeout(() => location.reload(), 1500); }
      else { showToastMsg(d.message); }
    } catch (e) { showToastMsg('保存失败，请重试'); }
  };

  // APlayer 初始化
  const ap = new APlayer({
    container: document.getElementById('aplayer'),
    mini: false, autoplay: false, theme: '#2563eb',
    loop: 'all', order: 'list', preload: 'auto', volume: 0.7,
    audio: [{
      name: '网易云音乐', artist: '胡柏珲',
      url: 'https://music.163.com/song/media/outer/url?id=' + CURRENT_SONG_ID + '.mp3',
      cover: '${coverUrl}'
    }]
  });

  // 初始化全部状态
  applyLang(); setTheme(currentTheme); applyDark();
  initXiaohei();
  if (bgUnlocked) bgSwitchGroup.classList.add('show');
  setBg(currentBg);
})();
</script>
</body>
</html>`;
}

// ========== Cloudflare Worker 核心逻辑 ==========
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'POST') {
      try {
        const { password, songId } = await request.json();
        if (password !== ADMIN_PASSWORD) {
          return Response.json({ success: false, message: '密码错误' });
        }
        if (!songId || !/^\d+$/.test(songId)) {
          return Response.json({ success: false, message: '无效的歌曲ID，请输入纯数字' });
        }
        await env.CONFIG_KV.put('music_song_id', songId);
        return Response.json({ success: true, message: '保存成功' });
      } catch (e) {
        return Response.json({ success: false, message: '服务器错误' });
      }
    }

    let songId = DEFAULT_SONG_ID;
    try {
      const kvId = await env.CONFIG_KV.get('music_song_id');
      if (kvId) songId = kvId;
    } catch (e) {}

    return new Response(getPageHtml(songId), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Referrer-Policy': 'no-referrer'
      }
    });
  }
};
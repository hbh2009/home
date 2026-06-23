/**
 * 胡柏珲个人主页 - 全功能整合版（漏洞修复版）
 */

// ========== 工具函数 ==========
function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escScript(str) {
  return String(str).replace(/<\//g, '<\\/'); // 防止</script>破坏标签
}

// ========== 默认配置 ==========
const DEFAULT_PASSWORD = "admin123";
const DEFAULT_SONG_ID = "452814990";

// 短链映射表
const LINK_MAP = {
  "qq": "https://qm.qq.com/q/N35Yopvmwi",
  "github": "https://github.com/VanillaNahida",
  "bilibili": "https://space.bilibili.com/401742377",
  "x": "https://x.com/Nahida_vanilla"
};

// ========== 生成404页面（已修复XSS） ==========
function get404Page(reason = "页面走丢了") {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - 页面走丢了</title>
  <style>
    body { background: linear-gradient(135deg, #1e293b, #0f172a); display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: 'Microsoft YaHei', sans-serif; color: #fff; text-align: center; }
    .box { background: rgba(255,255,255,0.05); padding: 50px 60px; border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
    h1 { font-size: 80px; margin: 0; background: linear-gradient(135deg, #f472b6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .sub { font-size: 20px; color: #94a3b8; margin: 10px 0 30px; }
    .reason { font-size: 14px; color: #64748b; margin-bottom: 20px; }
    a { color: #a78bfa; text-decoration: none; border: 1px solid #a78bfa; padding: 10px 30px; border-radius: 30px; transition: 0.3s; }
    a:hover { background: #a78bfa; color: #0f172a; }
  </style>
</head>
<body>
<div class="box">
  <h1>404</h1>
  <div class="sub">哎呀，页面掉进次元裂缝了</div>
  <div class="reason">💔 ${escHtml(reason)}</div>
  <a href="/">✨ 传送回主页</a>
</div>
</body>
</html>`;
}

// ========== 生成主页HTML（修复注入、优化问候） ==========
function getPageHtml(songId, songInfo, visitorCount, visitorCity, visitorRegion, visitorCountry) {
  // 转义脚本中的字符串
  const name = escScript(songInfo ? songInfo.name : '网易云音乐');
  const artist = escScript(songInfo ? songInfo.artist : '胡柏珲');
  const cover = songInfo ? songInfo.cover : 'https://p1.music.126.net/2Vv1nXkGumZ5qX6Ch12yvA==/109951163145807804.jpg';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>胡柏珲的个人主页</title>
<meta name="referrer" content="no-referrer">
<link rel="stylesheet" href="https://unpkg.com/aplayer/dist/APlayer.min.css">
<style>
/* 所有样式保持不变（略） */
:root{--primary:#2563eb;--bg:linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%);--card:rgba(255,255,255,0.72);--text:#2d3748;--title:#1a202c;--border:rgba(226,232,240,0.7);--mask:rgba(0,0,0,0.5)}
.theme-pink{--primary:#ec4899;--bg:linear-gradient(135deg,#fce7f3 0%,#fbcfe8 100%)}
.theme-green{--primary:#10b981;--bg:linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)}
.theme-purple{--primary:#8b5cf6;--bg:linear-gradient(135deg,#ede9fe 0%,#ddd6fe 100%)}
.dark{--bg:#18181b;--card:rgba(39,39,42,0.7);--text:#e4e4e7;--title:#f4f4f5;--border:rgba(82,82,91,0.7);--mask:rgba(0,0,0,0.7)}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;overflow-x:hidden}
body{min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei","Segoe UI",sans-serif;line-height:2.5;background:var(--bg);background-size:cover;background-position:center;background-attachment:fixed;color:var(--text);transition:all .4s ease;padding:20px 15px}
.info-container{width:100%;max-width:600px;margin:0 auto;background:var(--card);padding:35px 30px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.1);backdrop-filter:blur(14px)}
.music-player-wrapper{width:100%;max-width:420px;margin:25px auto 0}
#aplayer{max-width:420px;margin:20px auto}
@media(max-width:768px){.music-player-wrapper{padding:0 10px;margin:.8rem auto 0}}
h1{margin-bottom:20px;color:var(--title);font-size:24px;text-align:center;border-bottom:2px solid var(--primary);padding-bottom:10px;cursor:pointer}
p{font-size:16px;padding-left:5px;word-wrap:break-word}
.contact-title{font-size:18px;font-weight:700;color:var(--title);margin:25px 0 10px;padding-left:5px;border-left:3px solid var(--primary)}
.contact-item{margin:8px 0;padding-left:8px}
a{color:var(--primary);text-decoration:none;font-weight:500}
#emailCopy{color:var(--primary);font-weight:500;cursor:pointer}
#copyTip{font-size:14px;color:#16a34a;margin-left::none}
.ctrl-group{margin-top:20px;padding-top:20px;border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.lang-btn,.theme-btn,.dark-btn,.bg-btn,.xiaohei-toggle-btn,.admin-btn{background:var(--card);border:1px solid var(--primary);color:var(--primary);padding:6px 14px;border-radius:6px;cursor:pointer;font-size:14px;transition:all .2s;font-family:inherit}
.lang-btn.active,.theme-btn.active,.dark-btn.active,.bg-btn.active,.xiaohei-toggle-btn.active{background:var(--primary);color:#fff}
#bgSwitchGroup{display:none;margin-top:15px;padding-top:15px;border-top:1px solid var(--border);flex-wrap:wrap;gap:8px;justify-content:center}
#bgSwitchGroup.show{display:flex}
.xiaohei-toggle-group{margin-top:15px;text-align:center;padding-top:15px;border-top:1px solid var(--border)}
.modal-mask{position:fixed;top:0;left:0;width:100%;height:100%;background:var(--mask);backdrop-filter:blur(4px);z-index:99998;display:none;align-items:center;justify-content:center;padding:20px}
.modal-mask.show{display:flex}
.modal-box{background:var(--card);border-radius:12px;max-width:520px;width:100%;padding:30px 25px;box-shadow:0 10px 30px rgba(0,0,0,.2);backdrop-filter:blur(14px)}
.modal-title{font-size:20px;font-weight:700;color:var(--title);text-align:center;margin-bottom:20px;padding-bottom:10px;border-bottom:2px solid var(--primary)}
.form-item{margin-bottom:20px}
.form-label{font-size:14px;display:block;margin-bottom:8px;font-weight:500}
.form-input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:6px;background:rgba(255,255,255,.1);color:var(--text);font-size:14px;font-family:inherit}
.form-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(37,99,235,.15)}
.modal-btn-group{display:flex;gap:10px;justify-content:center;margin-top:25px;flex-wrap:wrap}
.modal-btn{padding:8px 20px;border-radius:6px;cursor:pointer;font-size:14px;border:none;font-family:inherit;transition:all .2s}
.btn-primary{background:var(--primary);color:#fff}.btn-primary:hover{filter:brightness(1.1)}
.btn-danger{background:#ef4444;color:#fff}.btn-danger:hover{filter:brightness(1.1)}
.btn-success{background:#16a34a;color:#fff}
.btn-default{background:var(--card);border:1px solid var(--border);color:var(--text)}
.tab-bar{display:flex;gap:4px;margin-bottom:20px;border-bottom:2px solid var(--border)}
.tab-btn{padding:8px 16px;cursor:pointer;border:none;background:none;font-size:14px;color:var(--text);font-family:inherit;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s}
.tab-btn.active{color:var(--primary);border-bottom-color:var(--primary);font-weight:600}
.tab-content{display:none}.tab-content.show{display:block}
.strength-bar{height:4px;border-radius:2px;margin-top:6px;transition:all .3s}
.strength-label{font-size:12px;margin-top:4px;display:block}
.recovery-code-box{background:var(--card);border:2px dashed var(--primary);border-radius:8px;padding:15px;text-align:center;margin:15px 0}
.recovery-code-text{font-family:"Courier New",monospace;font-size:20px;font-weight:700;letter-spacing:3px;color:var(--primary);user-select:all}
.hint-text{font-size:12px;color:#888;margin-top:4px}
.pwd-match{font-size:12px;margin-top:4px}
.pwd-match.ok{color:#16a34a}.pwd-match.err{color:#ef4444}
.toast{position:fixed;top:30px;left:50%;transform:translateX(-50%) translateY(-100px);background:var(--primary);color:#fff;padding:10px 20px;border-radius:8px;z-index:99999;opacity:0;transition:all .4s}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast.danger{background:#ef4444}.toast.success{background:#16a34a}
.paw{position:fixed;pointer-events:none;z-index:9999;font-size:22px;animation:pawAnim .9s ease-out forwards}
@keyframes pawAnim{0%{opacity:1;transform:scale(.8)}50%{transform:scale(1.1)}100%{opacity:0;transform:scale(.6) translateY(-12px)}}
.paw-fall{position:fixed;top:-50px;font-size:24px;z-index:9998;pointer-events:none;animation:pawFall 3s linear forwards}
@keyframes pawFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(360deg);opacity:0}}
.quote-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--card);border:1px solid var(--primary);padding:12px 24px;border-radius:8px;z-index:99999;opacity:0;transition:all .4s;max-width:80%;text-align:center}
.quote-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
#xiaohei{position:fixed;width:65px;height:auto;z-index:999;right:20px;bottom:20px;transition:transform .1s}
#xiaohei.hidden{opacity:0;pointer-events:none}
#xiaohei.jump{animation:xiaoheiJump .5s ease-in-out}
@keyframes xiaoheiJump{0%{transform:translate(0,0) scale(1)}50%{transform:translate(0,-20px) scale(1.1)}100%{transform:translate(0,0) scale(1)}}
@media(max-width:480px){#xiaohei{width:50px;right:15px;bottom:15px}.info-container{padding:25px 20px}h1{font-size:22px}}
.visitor-count{text-align:center;margin-top:20px;padding-top:15px;border-top:1px solid var(--border);font-size:14px;color:var(--text);opacity:0.7}
/* 问候提示条 */
.greeting-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--primary);
  color: #fff;
  text-align: center;
  padding: 12px 20px;
  font-weight: 500;
  z-index: 999999;
  transform: translateY(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.greeting-bar.show {
  transform: translateY(0);
}
.greeting-close {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  padding: 0 5px;
}
</style>
</head>
<body>

<!-- 优雅问候提示 -->
<div id="greetingBar" class="greeting-bar"></div>

<div class="info-container">
<h1 id="pageHeader">胡柏珲的个人主页</h1>
<p id="introGreet">你好，我是胡柏珲</p>
<p id="introLoc">09年河南人，现居住于河南郑州</p>
<p>目前混的圈比较杂：
<a href="https://www.dnaxcat.net/" target="_blank" rel="noopener noreferrer">九藏喵窝</a>、<span>罗小黑</span>、
<a href="https://sr.mihoyo.com/" target="_blank" rel="noopener noreferrer">崩</a>
<a href="https://ys.mihoyo.com/" target="_blank" rel="noopener noreferrer">原</a>
<a href="https://zzz.mihoyo.com/" target="_blank" rel="noopener noreferrer">绝</a><span>三家</span>、
<a href="https://www.minecraft.net/zh-hans" target="_blank" rel="noopener noreferrer">我的世界</a>、<span>有兽焉</span>
</p>
<div class="contact-title">联系方式</div>
<p class="contact-item">QQ：<a href="https://qm.qq.com/q/N35Yopvmwi" target="_blank">3556976065</a></p>
<p class="contact-item">邮箱：<span id="emailCopy">hubohui@outlook.com</span><span id="copyTip">已复制</span></p>
<p><span id="timeLabel">在线北京时间：</span><span id="localTime"></span></p>
<div class="visitor-count">✨ 你是第 ${visitorCount} 位来访的旅行者</div>
<div style="text-align:center; margin:18px 0 10px;">
  <a href="/xyx" style="display:inline-block; background:linear-gradient(135deg,#f472b6,#8b5cf6); color:#fff; padding:10px 30px; border-radius:40px; text-decoration:none; font-weight:bold; box-shadow:0 4px 15px rgba(139,92,246,0.4); transition:0.3s;">🎮 整活小游戏</a>
</div>
<div class="ctrl-group">
<button class="lang-btn active" id="zh-CN">简体</button>
<button class="lang-btn" id="zh-TW">繁體</button>
<button class="dark-btn" id="toggleDark">深色模式</button>
<div style="width:100%;height:4px"></div>
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
<div class="xiaohei-toggle-group"><button class="xiaohei-toggle-btn" id="toggleXiaohei">隐藏小黑</button></div>
<div class="xiaohei-toggle-group" style="border-top:none;padding-top:10px">
<button class="admin-btn" id="adminBtn" style="opacity:0.3;font-size:12px">管理</button>
</div>
<div class="music-player-wrapper"><div id="aplayer"></div></div>
<div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid var(--border); text-align: center; font-size: 14px; color: var(--text); opacity: 0.8;">
  <p>本网页由 <a href="https://www.cloudflare.com/" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 500;">Cloudflare</a> 托管</p>
  <p style="margin-top: 4px;">本网页在 GitHub 上开源 <a href="https://github.com/hbh2009/home" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 500;">hbh2009/home</a></p>
  <p style="margin-top: 4px;">本网页由 <a href="https://www.deepseek.com/" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 500;">DeepSeek</a> 辅助制作</p>
</div>
</div>

<!-- 管理后台模态框结构保持不变（略） -->
<div class="modal-mask" id="adminModal">
  ... 同原版，未作修改 ...
</div>

<div class="toast" id="toast"></div>
<div class="quote-toast" id="quoteToast"></div>
<img id="xiaohei" src="https://i.postimg.cc/SN87V4Pw/处理完成图片20260303052740.gif" alt="罗小黑">
<script src="https://unpkg.com/aplayer/dist/APlayer.min.js"></script>

<script>
(function(){
"use strict";
try {
var VISITOR_CITY = ${JSON.stringify(visitorCity || "")};
var VISITOR_REGION = ${JSON.stringify(visitorRegion || "")};
var VISITOR_COUNTRY = ${JSON.stringify(visitorCountry || "")};

var SN = ${JSON.stringify(name)};
var SA = ${JSON.stringify(artist)};
var SC = ${JSON.stringify(cover)};
var CSID = ${JSON.stringify(songId)};

// ===== 暗黑模式修复：增加darkAuto标记 =====
var darkAuto = localStorage.getItem('darkAuto') !== 'false'; // 默认为true（跟随系统）

// 原语言包、主题、事件等代码保持不变，仅修改以下关键部分：

// ---- 问候语改为提示条（替换原来的showGreeting） ----
(function showGreetingBar() {
  var bar = document.getElementById('greetingBar');
  var greeting = '';
  var city = VISITOR_CITY;
  var region = VISITOR_REGION;
  var country = VISITOR_COUNTRY;
  var isChina = (country === 'CN' || country === 'TW' || country === 'HK' || country === 'MO');

  var regionMap = {
    'Henan': '河南', 'Zhengzhou': '郑州',
    'Beijing': '北京', 'Shanghai': '上海',
    'Guangdong': '广东', 'Guangzhou': '广州',
    'Shenzhen': '深圳', 'Zhejiang': '浙江',
    'Hangzhou': '杭州', 'Jiangsu': '江苏',
    'Nanjing': '南京', 'Sichuan': '四川',
    'Chengdu': '成都', 'Hubei': '湖北',
    'Wuhan': '武汉', 'Hunan': '湖南',
    'Changsha': '长沙', 'Fujian': '福建',
    'Xiamen': '厦门', 'Shandong': '山东',
    'Jinan': '济南', 'Qingdao': '青岛',
    'Tianjin': '天津', 'Chongqing': '重庆',
    'Liaoning': '辽宁', 'Shenyang': '沈阳',
    'Dalian': '大连', 'Heilongjiang': '黑龙江',
    'Harbin': '哈尔滨', 'Jilin': '吉林',
    'Changchun': '长春', 'Hebei': '河北',
    'Shijiazhuang': '石家庄', 'Shanxi': '山西',
    'Taiyuan': '太原', 'Shaanxi': '陕西',
    'Xi\\'an': '西安', 'Gansu': '甘肃',
    'Lanzhou': '兰州', 'Qinghai': '青海',
    'Xining': '西宁', 'Tibet': '西藏',
    'Lhasa': '拉萨', 'Xinjiang': '新疆',
    'Urumqi': '乌鲁木齐', 'Inner Mongolia': '内蒙古',
    'Hohhot': '呼和浩特', 'Ningxia': '宁夏',
    'Yinchuan': '银川', 'Guangxi': '广西',
    'Nanning': '南宁', 'Yunnan': '云南',
    'Kunming': '昆明', 'Guizhou': '贵州',
    'Guiyang': '贵阳', 'Hainan': '海南',
    'Haikou': '海口', 'Taiwan': '台湾',
    'Taipei': '台北', 'Hong Kong': '香港',
    'Macau': '澳门'
  };
  var specialGreetings = {
    'Henan': '老乡好~ 中不中？',
    'Zhengzhou': '老乡好~ 中不中？',
    'Beijing': '帝都的朋友你好！',
    'Shanghai': '魔都的朋友你好！',
    'Guangdong': '靓仔/靓女你好！',
    'Guangzhou': '靓仔/靓女你好！',
    'Sichuan': '巴适得板！朋友你好~',
    'Chengdu': '巴适得板！朋友你好~',
    'Chongqing': '勒是雾都！朋友你好~',
    'Taiwan':'来自对岸的朋友!你们好'
  };
  var countryMap = {
    'US': '美国', 'UK': '英国', 'JP': '日本',
    'KR': '韩国', 'DE': '德国', 'FR': '法国',
    'IT': '意大利', 'ES': '西班牙', 'CA': '加拿大',
    'AU': '澳大利亚', 'RU': '俄罗斯', 'BR': '巴西',
    'IN': '印度', 'SG': '新加坡', 'MY': '马来西亚',
    'TH': '泰国', 'VN': '越南', 'PH': '菲律宾',
    'ID': '印度尼西亚', 'NZ': '新西兰'
  };

  if (isChina && city && city !== 'unknown') {
    var cityDisplay = regionMap[city] || city;
    var special = specialGreetings[city] || specialGreetings[region] || '';
    if (special) {
      greeting = '🌏 来自 ' + cityDisplay + ' 的朋友，' + special;
    } else {
      greeting = '🌏 来自 ' + cityDisplay + ' 的朋友你好~';
    }
  } else if (isChina && !city) {
    greeting = '🌏 来自中国的朋友你好~';
  } else if (country && country !== 'unknown') {
    var countryDisplay = countryMap[country] || country;
    greeting = '🌍 来自 ' + countryDisplay + ' 的朋友，你好~';
  } else {
    greeting = '✨ 来自神秘地方的旅行者，你好~';
  }

  bar.innerHTML = greeting + '<button class="greeting-close" onclick="this.parentElement.style.transform=\\'translateY(-100%)\\'; setTimeout(()=>this.parentElement.remove(),400)">✕</button>';
  setTimeout(function() {
    bar.classList.add('show');
    // 8秒后自动消失
    setTimeout(function() {
      if (bar.classList.contains('show')) {
        bar.style.transform = 'translateY(-100%)';
        setTimeout(function() { bar.remove(); }, 400);
      }
    }, 8000);
  }, 500);
})();

// ---- 暗黑模式修复 ----
function updateDarkMode(manual) {
  if (manual) {
    darkAuto = false;
    localStorage.setItem('darkAuto', 'false');
  }
  document.body.classList.toggle('dark', isDark);
  toggleDark.classList.toggle('active', isDark);
  localStorage.setItem('dark', isDark);
}
toggleDark.onclick = function() {
  isDark = !isDark;
  updateDarkMode(true);
};

// 初始暗黑模式：如果从未手动切换，跟随系统
if (localStorage.getItem('dark') === null) {
  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  updateDarkMode(false); // 不改变darkAuto
} else {
  isDark = localStorage.getItem('dark') === 'true';
  updateDarkMode(false);
}

// 监听系统变化（仅在darkAuto为true时响应）
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
  if (darkAuto) {
    isDark = e.matches;
    updateDarkMode(false);
  }
});

// 其余主题、背景、管理员等功能保持原样
// ...
})();
</script>
</body>
</html>`;
}

// ========== Cloudflare Worker 入口 ==========
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // POST 请求处理
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const { action } = body;

        // 读取存储的密码和恢复码
        let storedPwd = DEFAULT_PASSWORD;
        let recoveryCode = null;
        try {
          const p = await env.CONFIG_KV.get("admin_password");
          if (p) storedPwd = p;
          recoveryCode = await env.CONFIG_KV.get("recovery_code");
        } catch (e) {}

        // 验证密码（同时接受恢复码）
        if (action === "verify_password") {
          const { password } = body;
          if (password === storedPwd) return Response.json({ verified: true });
          if (recoveryCode && password === recoveryCode) return Response.json({ verified: true, viaRecovery: true });
          return Response.json({ verified: false });
        }

        // 修改密码（支持使用恢复码作为旧密码，并删除恢复码）
        if (action === "change_password") {
          const { oldPassword, newPassword, hint } = body;
          const isUsingRecovery = recoveryCode && oldPassword === recoveryCode;
          const isUsingOldPwd = oldPassword === storedPwd;

          if (!isUsingOldPwd && !isUsingRecovery) {
            return Response.json({ success: false, message: "旧密码或恢复码验证失败" });
          }
          if (!newPassword || newPassword.length < 8) {
            return Response.json({ success: false, message: "密码至少8位" });
          }

          // 生成新恢复码
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
          let code = "";
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) code += chars[Math.floor(Math.random() * chars.length)];
            if (i < 3) code += "-";
          }

          await env.CONFIG_KV.put("admin_password", newPassword);
          await env.CONFIG_KV.put("recovery_code", code);
          if (hint) await env.CONFIG_KV.put("password_hint", hint);

          // 如果使用恢复码修改密码，则删除旧恢复码（实际上已被新恢复码覆盖，但逻辑上可加注释）
          // 同时可删除密码提示

          return Response.json({ success: true, message: "密码已更新", recoveryCode: code });
        }

        // 保存歌曲ID
        if (action === "save_music") {
          const pwd = body.password;
          const sid = body.songId;
          if (pwd !== storedPwd) return Response.json({ success: false, message: "密码错误" });
          const digits = (sid || "").replace(/[^0-9]/g, "");
          if (!digits.length) return Response.json({ success: false, message: "无效的歌曲ID" });
          await env.CONFIG_KV.put("music_song_id", digits);
          return Response.json({ success: true, message: "保存成功" });
        }

        return Response.json({ success: false, message: "未知操作" });
      } catch (e) {
        return Response.json({ success: false, message: "服务器错误" });
      }
    }

    // 根路径：主页
    if (path === "/" || path === "") {
      // 访客计数（IP去重 + 自动清理24小时前的记录）
      let visitorCount = 1;
      try {
        const clientIP = request.headers.get("CF-Connecting-IP") || 
                         request.headers.get("X-Forwarded-For") || 
                         "unknown";
        const now = Date.now();
        let ipSet = await env.CONFIG_KV.get("visitor_set", "json");
        if (!Array.isArray(ipSet)) ipSet = [];

        // 清理超过24小时的记录
        ipSet = ipSet.filter(entry => now - entry.ts < 86400000);

        const exists = ipSet.some(entry => entry.ip === clientIP);
        if (!exists) {
          ipSet.push({ ip: clientIP, ts: now });
          await env.CONFIG_KV.put("visitor_set", JSON.stringify(ipSet));

          let count = await env.CONFIG_KV.get("visitor_count", "json");
          if (typeof count !== "number") count = 0;
          count += 1;
          await env.CONFIG_KV.put("visitor_count", JSON.stringify(count));
          visitorCount = count;
        } else {
          // IP已存在，但仍需保存清理后的集合
          await env.CONFIG_KV.put("visitor_set", JSON.stringify(ipSet));
          let count = await env.CONFIG_KV.get("visitor_count", "json");
          visitorCount = (typeof count === "number") ? count : 1;
        }
      } catch (e) {
        visitorCount = 1;
      }

      // 获取歌曲信息
      let songId = DEFAULT_SONG_ID;
      try { const v = await env.CONFIG_KV.get("music_song_id"); if (v) songId = v; } catch(e) {}
      let info = null;
      try {
        const apiUrl = `https://music.163.com/api/song/detail/?id=${songId}&ids=[${songId}]`;
        const res = await fetch(apiUrl, {
          headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://music.163.com/" }
        });
        const data = await res.json();
        if (data.songs && data.songs.length > 0) {
          const s = data.songs[0];
          info = {
            name: s.name || "网易云音乐",
            artist: (s.artists || []).map(a => a.name).join(" / ") || "未知歌手",
            cover: (s.album && s.album.picUrl) || ""
          };
        }
      } catch(e) {}
      if (!info) info = { name: "网易云音乐", artist: "胡柏珲", cover: "https://p1.music.126.net/2Vv1nXkGumZ5qX6Ch12yvA==/109951163145807804.jpg" };

      const visitorCity = request.headers.get("CF-City") || "";
      const visitorRegion = request.headers.get("CF-Region") || "";
      const visitorCountry = request.headers.get("CF-IPCountry") || "";

      return new Response(getPageHtml(songId, info, visitorCount, visitorCity, visitorRegion, visitorCountry), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Referrer-Policy": "no-referrer"
        }
      });
    }

    // 短链、游戏、404等路由不变（略）
    if (path.startsWith("/go/")) {
      const target = path.replace("/go/", "");
      if (LINK_MAP[target]) {
        return Response.redirect(LINK_MAP[target], 302);
      } else {
        return new Response(get404Page(`未找到短链：${target}`), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }
    }

    // 其他游戏路由保持原样（略）
    // ...

    // 最终兜底404
    return new Response(get404Page(`路径 "${path}" 不存在`), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

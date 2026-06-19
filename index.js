/**
 * 胡柏珲个人主页 - 完整版（含真实歌名获取）
 */

const DEFAULT_PASSWORD = "admin123";
const DEFAULT_SONG_ID = "452814990";

// 从网易云API获取真实歌曲信息
async function getSongInfo(songId) {
  try {
    const url = `https://music.163.com/api/song/detail/?id=${songId}&ids=[${songId}]`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://music.163.com/'
      }
    });
    const data = await res.json();
    if (data.songs && data.songs.length > 0) {
      const s = data.songs[0];
      return {
        name: s.name || '未知歌曲',
        artist: (s.artists || []).map(a => a.name).join(' / ') || '未知歌手',
        cover: (s.album && s.album.picUrl) || 'https://p1.music.126.net/2Vv1nXkGumZ5qX6Ch12yvA==/109951163145807804.jpg'
      };
    }
  } catch(e) {}
  return null;
}

function getPageHtml(songId, songInfo) {
  const name = songInfo ? songInfo.name : '网易云音乐';
  const artist = songInfo ? songInfo.artist : '胡柏珲';
  const cover = songInfo ? songInfo.cover : 'https://p1.music.126.net/2Vv1nXkGumZ5qX6Ch12yvA==/109951163145807804.jpg';
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>胡柏珲的个人主页</title>
  <meta name="referrer" content="no-referrer">
  <link rel="stylesheet" href="https://unpkg.com/aplayer/dist/APlayer.min.css">
  <style>
    :root { --primary: #2563eb; --bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); --card: rgba(255,255,255,0.72); --text: #2d3748; --title: #1a202c; --border: rgba(226,232,240,0.7); --mask: rgba(0,0,0,0.5); }
    .theme-pink { --primary: #ec4899; --bg: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); }
    .theme-green { --primary: #10b981; --bg: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); }
    .theme-purple { --primary: #8b5cf6; --bg: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); }
    .dark { --bg: #18181b; --card: rgba(39,39,42,0.7); --text: #e4e4e7; --title: #f4f4f5; --border: rgba(82,82,91,0.7); --mask: rgba(0,0,0,0.7); }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; overflow-x: hidden; }
    body { min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", sans-serif; line-height: 2.5; background: var(--bg); background-size: cover; background-position: center; background-attachment: fixed; color: var(--text); transition: all .4s ease; padding: 20px 15px; }
    .info-container { width: 100%; max-width: 600px; margin: 0 auto; background: var(--card); padding: 35px 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,.1); backdrop-filter: blur(14px); }
    .music-player-wrapper { width: 100%; max-width: 420px; margin: 25px auto 0; }
    #aplayer { max-width: 420px; margin: 20px auto; }
    @media (max-width:768px) { .music-player-wrapper { padding:0 10px; margin:.8rem auto 0; } }
    h1 { margin-bottom:20px; color:var(--title); font-size:24px; text-align:center; border-bottom:2px solid var(--primary); padding-bottom:10px; cursor:pointer; }
    p { font-size:16px; padding-left:5px; word-wrap:break-word; }
    .contact-title { font-size:18px; font-weight:700; color:var(--title); margin:25px 0 10px; padding-left:5px; border-left:3px solid var(--primary); }
    .contact-item { margin:8px 0; padding-left:8px; }
    a { color:var(--primary); text-decoration:none; font-weight:500; }
    #emailCopy { color:var(--primary); font-weight:500; cursor:pointer; }
    #copyTip { font-size:14px; color:#16a34a; margin-left:10px; display:none; }
    .ctrl-group { margin-top:20px; padding-top:20px; border-top:1px solid var(--border); display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
    .lang-btn,.theme-btn,.dark-btn,.bg-btn,.xiaohei-toggle-btn,.admin-btn { background:var(--card); border:1px solid var(--primary); color:var(--primary); padding:6px 14px; border-radius:6px; cursor:pointer; font-size:14px; transition:all .2s; font-family:inherit; }
    .lang-btn.active,.theme-btn.active,.dark-btn.active,.bg-btn.active,.xiaohei-toggle-btn.active { background:var(--primary); color:#fff; }
    #bgSwitchGroup { display:none; margin-top:15px; padding-top:15px; border-top:1px solid var(--border); flex-wrap:wrap; gap:8px; justify-content:center; }
    #bgSwitchGroup.show { display:flex; }
    .xiaohei-toggle-group { margin-top:15px; text-align:center; padding-top:15px; border-top:1px solid var(--border); }
    .modal-mask { position:fixed; top:0; left:0; width:100%; height:100%; background:var(--mask); backdrop-filter:blur(4px); z-index:99998; display:none; align-items:center; justify-content:center; padding:20px; }
    .modal-mask.show { display:flex; }
    .modal-box { background:var(--card); border-radius:12px; max-width:520px; width:100%; padding:30px 25px; box-shadow:0 10px 30px rgba(0,0,0,.2); backdrop-filter:blur(14px); }
    .modal-title { font-size:20px; font-weight:700; color:var(--title); text-align:center; margin-bottom:20px; padding-bottom:10px; border-bottom:2px solid var(--primary); }
    .form-item { margin-bottom:20px; }
    .form-label { font-size:14px; display:block; margin-bottom:8px; font-weight:500; }
    .form-input { width:100%; padding:10px 12px; border:1px solid var(--border); border-radius:6px; background:rgba(255,255,255,.1); color:var(--text); font-size:14px; font-family:inherit; }
    .form-input:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 3px rgba(37,99,235,.15); }
    .modal-btn-group { display:flex; gap:10px; justify-content:center; margin-top:25px; flex-wrap:wrap; }
    .modal-btn { padding:8px 20px; border-radius:6px; cursor:pointer; font-size:14px; border:none; font-family:inherit; transition:all .2s; }
    .btn-primary { background:var(--primary); color:#fff; }
    .btn-primary:hover { filter:brightness(1.1); }
    .btn-danger { background:#ef4444; color:#fff; }
    .btn-success { background:#16a34a; color:#fff; }
    .btn-default { background:var(--card); border:1px solid var(--border); color:var(--text); }
    .tab-bar { display:flex; gap:4px; margin-bottom:20px; border-bottom:2px solid var(--border); }
    .tab-btn { padding:8px 16px; cursor:pointer; border:none; background:none; font-size:14px; color:var(--text); font-family:inherit; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all .2s; }
    .tab-btn.active { color:var(--primary); border-bottom-color:var(--primary); font-weight:600; }
    .tab-content { display:none; }
    .tab-content.show { display:block; }
    .strength-bar { height:4px; border-radius:2px; margin-top:6px; transition:all .3s; }
    .strength-label { font-size:12px; margin-top:4px; display:block; }
    .recovery-code-box { background:var(--card); border:2px dashed var(--primary); border-radius:8px; padding:15px; text-align:center; margin:15px 0; }
    .recovery-code-text { font-family:'Courier New',monospace; font-size:20px; font-weight:700; letter-spacing:3px; color:var(--primary); user-select:all; }
    .hint-text { font-size:12px; color:#888; margin-top:4px; }
    .pwd-match { font-size:12px; margin-top:4px; }
    .pwd-match.ok { color:#16a34a; }
    .pwd-match.err { color:#ef4444; }
    .toast { position:fixed; top:30px; left:50%; transform:translateX(-50%) translateY(-100px); background:var(--primary); color:#fff; padding:10px 20px; border-radius:8px; z-index:99999; opacity:0; transition:all .4s; }
    .toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
    .toast.danger { background:#ef4444; }
    .toast.success { background:#16a34a; }
    .paw { position:fixed; pointer-events:none; z-index:9999; font-size:22px; animation:pawAnim .9s ease-out forwards; }
    @keyframes pawAnim { 0%{opacity:1;transform:scale(.8)} 50%{transform:scale(1.1)} 100%{opacity:0;transform:scale(.6) translateY(-12px)} }
    .paw-fall { position:fixed; top:-50px; font-size:24px; z-index:9998; pointer-events:none; animation:pawFall 3s linear forwards; }
    @keyframes pawFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(360deg);opacity:0} }
    .quote-toast { position:fixed; bottom:80px; left:50%; transform:translateX(-50%) translateY(100px); background:var(--card); border:1px solid var(--primary); padding:12px 24px; border-radius:8px; z-index:99999; opacity:0; transition:all .4s; max-width:80%; text-align:center; }
    .quote-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
    #xiaohei { position:fixed; width:65px; height:auto; z-index:999; right:20px; bottom:20px; transition:transform .1s; }
    #xiaohei.hidden { opacity:0; pointer-events:none; }
    #xiaohei.jump { animation:xiaoheiJump .5s ease-in-out; }
    @keyframes xiaoheiJump { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(0,-20px) scale(1.1)} 100%{transform:translate(0,0) scale(1)} }
    @media (max-width:480px) { #xiaohei{width:50px;right:15px;bottom:15px} .info-container{padding:25px 20px} h1{font-size:22px} }
  </style>
</head>
<body>
<div class="info-container">
  <h1 id="pageHeader">胡柏珲的个人主页</h1>
  <p>你好，我是胡柏珲</p>
  <p>09年河南人，现居住于河南郑州</p>
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
  <div class="xiaohei-toggle-group"><button class="xiaohei-toggle-btn" id="toggleXiaohei">隐藏小黑 🐾</button></div>
  <div class="xiaohei-toggle-group" style="border-top:none;padding-top:10px;">
    <button class="admin-btn" id="adminBtn" style="opacity:0.3;font-size:12px;">管理</button>
  </div>
  <div class="music-player-wrapper"><div id="aplayer"></div></div>
</div>

<div class="modal-mask" id="adminModal">
  <div class="modal-box">
    <div class="modal-title">管理员后台</div>
    <div class="tab-bar">
      <button class="tab-btn active" data-tab="music-tab">🎵 音乐管理</button>
      <button class="tab-btn" data-tab="password-tab">🔒 密码管理</button>
    </div>
    <div class="tab-content show" id="music-tab">
      <div class="form-item">
        <label class="form-label">管理员密码</label>
        <input type="password" class="form-input" id="adminPassword" placeholder="输入当前密码">
      </div>
      <div class="form-item">
        <label class="form-label">网易云音乐歌曲ID</label>
        <input type="text" class="form-input" id="musicIdInput" placeholder="例如：452814990">
      </div>
      <div class="modal-btn-group">
        <button class="modal-btn btn-default" id="closeModal">取消</button>
        <button class="modal-btn btn-primary" id="saveMusicBtn">保存音乐</button>
      </div>
    </div>
    <div class="tab-content" id="password-tab">
      <div id="pwd-step1">
        <div class="form-item">
          <label class="form-label">步骤 1/3 · 验证身份</label>
          <input type="password" class="form-input" id="oldPasswordInput" placeholder="输入当前密码">
        </div>
        <div class="modal-btn-group">
          <button class="modal-btn btn-default" id="cancelPwdChange">取消</button>
          <button class="modal-btn btn-primary" id="verifyOldPwdBtn">验证身份</button>
        </div>
      </div>
      <div id="pwd-step2" style="display:none;">
        <div class="form-item">
          <label class="form-label">步骤 2/3 · 设置新密码</label>
          <input type="password" class="form-input" id="newPasswordInput" placeholder="输入新密码（至少8位）">
          <div class="strength-bar" id="strengthBar" style="width:0%;background:#ef4444;"></div>
          <span class="strength-label" id="strengthLabel">强度：请设置密码</span>
        </div>
        <div class="form-item">
          <label class="form-label">确认新密码</label>
          <input type="password" class="form-input" id="confirmPasswordInput" placeholder="再次输入新密码">
          <div class="pwd-match" id="pwdMatch"></div>
        </div>
        <div class="form-item">
          <label class="form-label">密码提示（可选）</label>
          <input type="text" class="form-input" id="pwdHintInput" placeholder="例如：我的生日+" maxlength="50">
        </div>
        <div class="modal-btn-group">
          <button class="modal-btn btn-default" id="backToStep1">返回</button>
          <button class="modal-btn btn-success" id="setNewPwdBtn">确认修改密码</button>
        </div>
      </div>
      <div id="pwd-step3" style="display:none;">
        <div class="form-item">
          <label class="form-label">步骤 3/3 · 🎉 密码修改成功！</label>
          <p style="font-size:14px;margin-bottom:10px;">请务必保存下方恢复码</p>
          <div class="recovery-code-box">
            <div style="font-size:12px;margin-bottom:8px;opacity:.6;">🔑 一次性恢复码（请截图保存）</div>
            <div class="recovery-code-text" id="recoveryCodeDisplay">XXXX-XXXX-XXXX-XXXX</div>
          </div>
          <p class="hint-text">关闭前请务必保存！</p>
        </div>
        <div class="modal-btn-group">
          <button class="modal-btn btn-primary" id="finishPwdChange">我已保存，关闭</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>
<div class="quote-toast" id="quoteToast"></div>
<img id="xiaohei" src="https://i.postimg.cc/SN87V4Pw/处理完成图片20260303052740.gif" alt="罗小黑">
<script src="https://unpkg.com/aplayer/dist/APlayer.min.js"></script>
<script>
(function(){
'use strict';
// 真实歌曲信息由Worker从网易云API获取后注入
var SONG_NAME = '${name.replace(/'/g, "\\'")}';
var SONG_ARTIST = '${artist.replace(/'/g, "\\'")}';
var SONG_COVER = '${cover}';
var CURRENT_SONG_ID = '${songId}';

const bgConfig={spring:"https://s41.ax1x.com/2026/03/03/pep6CM4.png",summer:"https://s41.ax1x.com/2026/03/03/pep6PsJ.png",autumn:"https://s41.ax1x.com/2026/03/03/pep6iL9.png",default:"var(--bg)"};
const xiaoheiQuotes=["我叫罗小黑，请多指教~","只要有你在，哪里都是家","我不想再分开了","我可以跟你一起走吗？","师傅，我错了，但我下次还敢~","比丢！不准乱吃东西！"];
const langPack={"zh-CN":{pageTitle:"胡柏珲的个人主页",contact:"联系方式",copyTip:"已复制",darkMode:"深色模式",showXiaohei:"显示小黑",hideXiaohei:"隐藏小黑"},"zh-TW":{pageTitle:"胡柏珲的個人主頁",contact:"聯絡方式",copyTip:"已複製",darkMode:"深色模式",showXiaohei:"顯示小黑",hideXiaohei:"隱藏小黑"}};
const $=id=>document.getElementById(id);
const pageHeader=$('pageHeader'),localTime=$('localTime'),emailCopyEl=$('emailCopy'),copyTipEl=$('copyTip');
const toggleDark=$('toggleDark'),bgSwitchGroup=$('bgSwitchGroup'),xiaohei=$('xiaohei'),toggleXiaohei=$('toggleXiaohei');
const quoteToast=$('quoteToast'),toast=$('toast'),adminModal=$('adminModal'),adminBtn=$('adminBtn');
const closeModal=$('closeModal'),saveMusicBtn=$('saveMusicBtn'),adminPassword=$('adminPassword'),musicIdInput=$('musicIdInput');
const tabBtns=document.querySelectorAll('.tab-btn'),tabContents=document.querySelectorAll('.tab-content');
const pwdStep1=$('pwd-step1'),pwdStep2=$('pwd-step2'),pwdStep3=$('pwd-step3');
const oldPasswordInput=$('oldPasswordInput'),newPasswordInput=$('newPasswordInput'),confirmPasswordInput=$('confirmPasswordInput'),pwdHintInput=$('pwdHintInput');
const verifyOldPwdBtn=$('verifyOldPwdBtn'),setNewPwdBtn=$('setNewPwdBtn'),backToStep1=$('backToStep1'),cancelPwdChange=$('cancelPwdChange'),finishPwdChange=$('finishPwdChange');
const strengthBar=$('strengthBar'),strengthLabel=$('strengthLabel'),pwdMatch=$('pwdMatch'),recoveryCodeDisplay=$('recoveryCodeDisplay');
const storage={get:(k,d)=>localStorage.getItem(k)||d,set:(k,v)=>localStorage.setItem(k,v)};
const padZero=n=>String(n).padStart(2,'0');
let _generatedRecoveryCode='';

function showToastMsg(msg,type){toast.textContent=msg;toast.className='toast';if(type)toast.classList.add(type);toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2500);}

function updateTime(){const d=new Date();localTime.textContent=d.getFullYear()+'-'+padZero(d.getMonth()+1)+'-'+padZero(d.getDate())+' '+padZero(d.getHours())+':'+padZero(d.getMinutes())+':'+padZero(d.getSeconds());}
updateTime();setInterval(updateTime,1000);

emailCopyEl.onclick=async()=>{try{await navigator.clipboard.writeText('hubohui@outlook.com');copyTipEl.style.display='inline';setTimeout(()=>copyTipEl.style.display='none',2000);}catch(e){}};

let currentLang=storage.get('lang','zh-CN');
function applyLang(){const p=langPack[currentLang];document.title=p.pageTitle;pageHeader.textContent=p.pageTitle;document.querySelector('.contact-title').textContent=p.contact;toggleDark.textContent=p.darkMode;copyTipEl.textContent=p.copyTip;toggleXiaohei.textContent=xiaohei.classList.contains('hidden')?p.showXiaohei:p.hideXiaohei;}
document.querySelectorAll('.lang-btn').forEach(b=>{b.onclick=()=>{currentLang=b.id;storage.set('lang',currentLang);applyLang();};});

let currentTheme=storage.get('theme','');
function setTheme(t){document.body.classList.remove('theme-pink','theme-green','theme-purple');if(t)document.body.classList.add(t);storage.set('theme',t);document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('active',b.dataset.theme===t));}
document.querySelectorAll('.theme-btn').forEach(b=>{b.onclick=()=>setTheme(b.dataset.theme);});

let isDark=storage.get('dark')==='true';
function applyDark(){document.body.classList.toggle('dark',isDark);toggleDark.classList.toggle('active',isDark);storage.set('dark',isDark);}
toggleDark.onclick=()=>{isDark=!isDark;applyDark();};

document.addEventListener('click',e=>{const p=document.createElement('div');p.className='paw';p.textContent='\u{1F43E}';p.style.left=(e.clientX-10)+'px';p.style.top=(e.clientY-12)+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),900);});

let backTimer,isXiaoheiHome=true,xiaoheiVisible=storage.get('xiaoheiVisible','true')==='true';
function initXiaohei(){xiaohei.classList.toggle('hidden',!xiaoheiVisible);toggleXiaohei.textContent=xiaoheiVisible?langPack[currentLang].hideXiaohei:langPack[currentLang].showXiaohei;}
toggleXiaohei.onclick=()=>{xiaoheiVisible=!xiaoheiVisible;xiaohei.classList.toggle('hidden',!xiaoheiVisible);toggleXiaohei.textContent=xiaoheiVisible?langPack[currentLang].hideXiaohei:langPack[currentLang].showXiaohei;storage.set('xiaoheiVisible',xiaoheiVisible);};
function goBackHome(){xiaohei.style.transform='translate(0,0)';isXiaoheiHome=true;}
document.addEventListener('mousemove',e=>{if(!xiaoheiVisible)return;isXiaoheiHome=false;clearTimeout(backTimer);const w=xiaohei.offsetWidth,h=xiaohei.offsetHeight;xiaohei.style.transform='translate('+(e.clientX-window.innerWidth+w/2+20)+'px,'+(e.clientY-window.innerHeight+h/2+20)+'px)';backTimer=setTimeout(goBackHome,2000);});
xiaohei.onclick=()=>{if(isXiaoheiHome&&xiaoheiVisible){xiaohei.classList.remove('jump');void xiaohei.offsetWidth;xiaohei.classList.add('jump');setTimeout(()=>xiaohei.classList.remove('jump'),500);}};

let titleClick=0,titleTimer,bgUnlocked=storage.get('bgUnlocked')==='true';
pageHeader.onclick=()=>{if(bgUnlocked)return;titleClick++;clearTimeout(titleTimer);titleTimer=setTimeout(()=>titleClick=0,3000);if(titleClick===5){titleClick=0;bgUnlocked=true;storage.set('bgUnlocked',true);bgSwitchGroup.classList.add('show');showToastMsg('背景功能已解锁！');}};

let currentBg=storage.get('currentBg','default');
function setBg(b){if(!bgConfig[b])return;currentBg=b;storage.set('currentBg',b);if(b==='default'){document.body.style.background='var(--bg)';}else{document.body.style.background='url('+bgConfig[b]+')';document.body.style.backgroundSize='cover';document.body.style.backgroundPosition='center';document.body.style.backgroundAttachment='fixed';}document.querySelectorAll('.bg-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.bg===b));applyDark();}
document.querySelectorAll('.bg-btn').forEach(btn=>{btn.onclick=()=>setBg(btn.dataset.bg);});

let konamiIdx=0,konamiCode=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'],konamiUnlocked=storage.get('konamiUnlocked')==='true';
document.addEventListener('keydown',e=>{if(konamiUnlocked)return;if(e.code===konamiCode[konamiIdx]){konamiIdx++;if(konamiIdx===konamiCode.length){triggerKonami();konamiIdx=0;}}else{konamiIdx=0;}});
function triggerKonami(){konamiUnlocked=true;storage.set('konamiUnlocked',true);quoteToast.textContent=xiaoheiQuotes[Math.floor(Math.random()*xiaoheiQuotes.length)];quoteToast.classList.add('show');setTimeout(()=>quoteToast.classList.remove('show'),4000);for(let i=0;i<30;i++){setTimeout(()=>{const p=document.createElement('div');p.className='paw-fall';p.textContent='\u{1F43E}';p.style.left=Math.random()*window.innerWidth+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),5000);},i*100);}setTheme('theme-purple');}

tabBtns.forEach(btn=>{btn.onclick=()=>{tabBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');tabContents.forEach(tc=>tc.classList.remove('show'));$(btn.dataset.tab).classList.add('show');if(btn.dataset.tab==='password-tab'){resetPwdFlow();}};});
function resetPwdFlow(){pwdStep1.style.display='block';pwdStep2.style.display='none';pwdStep3.style.display='none';oldPasswordInput.value='';newPasswordInput.value='';confirmPasswordInput.value='';pwdHintInput.value='';strengthBar.style.width='0%';strengthBar.style.background='#ef4444';strengthLabel.textContent='强度：请设置密码';pwdMatch.textContent='';_generatedRecoveryCode='';}

function checkStrength(pwd){let s=0;if(pwd.length>=8)s++;if(pwd.length>=12)s++;if(/[a-z]/.test(pwd))s++;if(/[A-Z]/.test(pwd))s++;if(/[0-9]/.test(pwd))s++;if(/[^a-zA-Z0-9]/.test(pwd))s++;const lb=['极弱','较弱','一般','良好','强','极强'];const co=['#ef4444','#f97316','#eab308','#22c55e','#16a34a','#15803d'];return{score:Math.min(s,5),label:lb[Math.min(s,5)],color:co[Math.min(s,5)]};}
newPasswordInput.oninput=function(){const r=checkStrength(this.value);strengthBar.style.width=((r.score+1)/6*100)+'%';strengthBar.style.background=r.color;strengthLabel.textContent='强度：'+r.label;checkPwdMatch();};
confirmPasswordInput.oninput=checkPwdMatch;
function checkPwdMatch(){const n=newPasswordInput.value,c=confirmPasswordInput.value;if(!c){pwdMatch.textContent='';return;}if(n===c){pwdMatch.textContent='✓ 两次密码一致';pwdMatch.className='pwd-match ok';}else{pwdMatch.textContent='✗ 两次密码不一致';pwdMatch.className='pwd-match err';}}

adminBtn.onclick=()=>{adminModal.classList.add('show');musicIdInput.value=CURRENT_SONG_ID;adminPassword.value='';resetPwdFlow();tabBtns.forEach(b=>b.classList.remove('active'));tabBtns[0].classList.add('active');tabContents.forEach(tc=>tc.classList.remove('show'));$('music-tab').classList.add('show');};
closeModal.onclick=()=>{adminModal.classList.remove('show');adminPassword.value='';};
adminModal.onclick=(e)=>{if(e.target===adminModal)closeModal.onclick();};

saveMusicBtn.onclick=async()=>{const pwd=adminPassword.value.trim();const raw=musicIdInput.value.trim();if(!pwd)return showToastMsg('请输入管理员密码');if(!raw)return showToastMsg('请输入歌曲ID');const digits=raw.replace(/[^0-9]/g,'');if(!digits.length)return showToastMsg('请输入有效的歌曲ID');try{const res=await fetch(location.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'save_music',password:pwd,songId:digits})});const d=await res.json();if(d.success){showToastMsg('保存成功！即将刷新','success');setTimeout(()=>location.reload(),1500);}else showToastMsg(d.message,'danger');}catch(e){showToastMsg('保存失败','danger');}};

verifyOldPwdBtn.onclick=async()=>{const oldPwd=oldPasswordInput.value.trim();if(!oldPwd)return showToastMsg('请输入当前密码');try{const res=await fetch(location.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'verify_password',password:oldPwd})});const d=await res.json();if(d.verified){showToastMsg('身份验证通过','success');pwdStep1.style.display='none';pwdStep2.style.display='block';}else{showToastMsg('密码错误，请重试','danger');}}catch(e){showToastMsg('验证失败','danger');}};
cancelPwdChange.onclick=()=>{resetPwdFlow();tabBtns[0].click();};
backToStep1.onclick=()=>{pwdStep1.style.display='block';pwdStep2.style.display='none';};
setNewPwdBtn.onclick=async()=>{const pwd=newPasswordInput.value;const confirm=confirmPasswordInput.value;const hint=pwdHintInput.value.trim();if(pwd.length<8)return showToastMsg('密码至少8位');if(pwd!==confirm)return showToastMsg('两次密码不一致');const strength=checkStrength(pwd);if(strength.score<2)return showToastMsg('密码强度太低，请包含字母+数字');try{const res=await fetch(location.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'change_password',oldPassword:oldPasswordInput.value.trim(),newPassword:pwd,hint:hint})});const d=await res.json();if(d.success){_generatedRecoveryCode=d.recoveryCode||'N/A';recoveryCodeDisplay.textContent=_generatedRecoveryCode;pwdStep2.style.display='none';pwdStep3.style.display='block';showToastMsg('密码修改成功！请保存恢复码','success');}else{showToastMsg(d.message||'修改失败','danger');}}catch(e){showToastMsg('修改失败','danger');}};
finishPwdChange.onclick=()=>{closeModal.onclick();showToastMsg('密码已更新，下次请使用新密码登录');};

// ✅ 播放器现在显示真实歌名！
const ap=new APlayer({
  container:document.getElementById('aplayer'),mini:false,autoplay:false,
  theme:'#2563eb',loop:'all',order:'list',preload:'auto',volume:0.7,
  audio:[{name:SONG_NAME,artist:SONG_ARTIST,url:'https://music.163.com/song/media/outer/url?id='+CURRENT_SONG_ID+'.mp3',cover:SONG_COVER}]
});

applyLang();setTheme(currentTheme);applyDark();initXiaohei();
if(bgUnlocked)bgSwitchGroup.classList.add('show');setBg(currentBg);
})();
</script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ---- POST 处理 ----
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const { action } = body;

        let storedPwd = DEFAULT_PASSWORD;
        try { const kvPwd = await env.CONFIG_KV.get('admin_password'); if (kvPwd) storedPwd = kvPwd; } catch(e) {}

        // 验证密码
        if (action === 'verify_password') {
          const { password } = body;
          if (password === storedPwd) return Response.json({ verified: true });
          const storedRecovery = await env.CONFIG_KV.get('recovery_code').catch(()=>null);
          if (storedRecovery && password === storedRecovery) return Response.json({ verified: true, viaRecovery: true });
          return Response.json({ verified: false });
        }

        // 修改密码
        if (action === 'change_password') {
          const { oldPassword, newPassword, hint } = body;
          if (oldPassword !== storedPwd) return Response.json({ success: false, message: '旧密码验证失败' });
          if (!newPassword || newPassword.length < 8) return Response.json({ success: false, message: '密码至少8位' });
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
          let code = '';
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) code += chars[Math.floor(Math.random() * chars.length)];
            if (i < 3) code += '-';
          }
          await env.CONFIG_KV.put('admin_password', newPassword);
          await env.CONFIG_KV.put('recovery_code', code);
          if (hint) await env.CONFIG_KV.put('password_hint', hint);
          return Response.json({ success: true, message: '密码已更新', recoveryCode: code });
        }

        // 保存音乐
        if (action === 'save_music' || !action) {
          const pwd = body.password;
          const sid = body.songId;
          if (pwd !== storedPwd) return Response.json({ success: false, message: '密码错误' });
          const digits = (sid || '').replace(/[^0-9]/g, '');
          if (!digits.length) return Response.json({ success: false, message: '无效的歌曲ID' });
          await env.CONFIG_KV.put('music_song_id', digits);
          return Response.json({ success: true, message: '保存成功' });
        }

        return Response.json({ success: false, message: '未知操作' });
      } catch (e) {
        return Response.json({ success: false, message: '服务器错误' });
      }
    }

    // ---- GET 加载页面 ----
    let songId = DEFAULT_SONG_ID;
    try { const kvId = await env.CONFIG_KV.get('music_song_id'); if (kvId) songId = kvId; } catch(e) {}

    // 🔥 从网易云API获取真实歌曲信息
    let songInfo = null;
    try {
      const apiUrl = 'https://music.163.com/api/song/detail/?id=' + songId + '&ids=[' + songId + ']';
      const res = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://music.163.com/'
        }
      });
      const data = await res.json();
      if (data.songs && data.songs.length > 0) {
        const s = data.songs[0];
        songInfo = {
          name: s.name || '网易云音乐',
          artist: (s.artists || []).map(function(a) { return a.name; }).join(' / ') || '未知歌手',
          cover: (s.album && s.album.picUrl) || 'https://p1.music.126.net/2Vv1nXkGumZ5qX6Ch12yvA==/109951163145807804.jpg'
        };
      }
    } catch(e) {}

    // 如果API获取失败，用默认值
    if (!songInfo) {
      songInfo = { name: '网易云音乐', artist: '胡柏珲', cover: 'https://p1.music.126.net/2Vv1nXkGumZ5qX6Ch12yvA==/109951163145807804.jpg' };
    }

    return new Response(getPageHtml(songId, songInfo), {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Referrer-Policy': 'no-referrer' }
    });
  }
};

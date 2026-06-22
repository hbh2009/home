/**
 * 胡柏珲个人主页 - 全功能整合版
 * 特性：严格路由、短链重定向、IP去重访客计数、管理后台、主题切换、隐藏彩蛋等
 */

// ========== 默认配置 ==========
const DEFAULT_PASSWORD = "admin123";
const DEFAULT_SONG_ID = "452814990";

// ========== 短链映射表（可扩展） ==========
const LINK_MAP = {
  "qq": "https://qm.qq.com/q/N35Yopvmwi",
  "github": "https://github.com/VanillaNahida",
  "bilibili": "https://space.bilibili.com/401742377",
  "x": "https://x.com/Nahida_vanilla" // 示例
};

// ========== 工具函数：生成漂亮404页面 ==========
function get404Page(reason = "页面走丢了") {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - 页面走丢了</title>
  <style>
    body {
      background: linear-gradient(135deg, #1e293b, #0f172a);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: 'Microsoft YaHei', sans-serif;
      color: #fff;
      text-align: center;
    }
    .box {
      background: rgba(255,255,255,0.05);
      padding: 50px 60px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    }
    h1 {
      font-size: 80px;
      margin: 0;
      background: linear-gradient(135deg, #f472b6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .sub {
      font-size: 20px;
      color: #94a3b8;
      margin: 10px 0 30px;
    }
    .reason {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 20px;
    }
    a {
      color: #a78bfa;
      text-decoration: none;
      border: 1px solid #a78bfa;
      padding: 10px 30px;
      border-radius: 30px;
      transition: 0.3s;
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
  <div class="reason">💔 ${reason}</div>
  <a href="/">✨ 传送回主页</a>
</div>
</body>
</html>`;
}

// ========== 获取网易云歌曲信息 ==========
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
        name: s.name || '网易云音乐',
        artist: (s.artists || []).map(a => a.name).join(' / ') || '未知歌手',
        cover: (s.album && s.album.picUrl) || 'https://p1.music.126.net/2Vv1nXkGumZ5qX6Ch12yvA==/109951163145807804.jpg'
      };
    }
  } catch (e) {}
  return null;
}

// ========== 生成完整HTML页面（含访客计数） ==========
function getPageHtml(songId, songInfo, visitorCount) {
  const esc = s => (s || '').replace(/'/g, "\\'");
  const name = esc(songInfo ? songInfo.name : '网易云音乐');
  const artist = esc(songInfo ? songInfo.artist : '胡柏珲');
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
</style>
</head>
<body>
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
</div>

<div class="modal-mask" id="adminModal">
<div class="modal-box">
<div class="modal-title">管理员后台</div>
<div class="tab-bar">
<button class="tab-btn active" data-tab="music-tab" id="tabMusic">🎵 音乐管理</button>
<button class="tab-btn" data-tab="password-tab" id="tabPassword">🔒 密码管理</button>
</div>
<div class="tab-content show" id="music-tab">
<div class="form-item">
<label class="form-label" id="lblPwd">管理员密码</label>
<input type="password" class="form-input" id="adminPassword" placeholder="输入当前密码">
</div>
<div class="form-item">
<label class="form-label" id="lblSongId">网易云音乐歌曲ID</label>
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
<label class="form-label" id="lblStep1">步骤 1/3 · 验证身份</label>
<input type="password" class="form-input" id="oldPasswordInput" placeholder="输入当前密码">
</div>
<div class="modal-btn-group">
<button class="modal-btn btn-default" id="cancelPwdChange">取消</button>
<button class="modal-btn btn-primary" id="verifyOldPwdBtn">验证身份</button>
</div>
</div>
<div id="pwd-step2" style="display:none">
<div class="form-item">
<label class="form-label" id="lblStep2">步骤 2/3 · 设置新密码</label>
<input type="password" class="form-input" id="newPasswordInput" placeholder="输入新密码（至少8位）">
<div class="strength-bar" id="strengthBar" style="width:0%;background:#ef4444"></div>
<span class="strength-label" id="strengthLabel">强度：请设置密码</span>
</div>
<div class="form-item">
<label class="form-label" id="lblConfirm">确认新密码</label>
<input type="password" class="form-input" id="confirmPasswordInput" placeholder="再次输入新密码">
<div class="pwd-match" id="pwdMatch"></div>
</div>
<div class="form-item">
<label class="form-label" id="lblHint">密码提示（可选）</label>
<input type="text" class="form-input" id="pwdHintInput" placeholder="例如：我的生日+" maxlength="50">
</div>
<div class="modal-btn-group">
<button class="modal-btn btn-default" id="backToStep1">返回</button>
<button class="modal-btn btn-success" id="setNewPwdBtn">确认修改密码</button>
</div>
</div>
<div id="pwd-step3" style="display:none">
<div class="form-item">
<label class="form-label" id="lblStep3">步骤 3/3 · 密码修改成功！</label>
<p style="font-size:14px;margin-bottom:10px" id="pwdSaveTip">请务必保存下方恢复码</p>
<div class="recovery-code-box">
<div style="font-size:12px;margin-bottom:8px;opacity:.6" id="recoveryTitle">一次性恢复码（请截图保存）</div>
<div class="recovery-code-text" id="recoveryCodeDisplay">XXXX-XXXX-XXXX-XXXX</div>
</div>
<p class="hint-text" id="recoveryWarn">关闭前请务必保存！</p>
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
"use strict";

var SN='${name}',SA='${artist}',SC='${cover}',CSID='${songId}';

var LANG={
"zh-CN":{
  pageTitle:"胡柏珲的个人主页",contactTitle:"联系方式",copyTip:"已复制",
  introGreet:"你好，我是胡柏珲",
  introLoc:"09年河南人，现居住于河南郑州",
  timeLabel:"在线北京时间：",
  darkMode:"深色模式",
  themeDefault:"默认蓝",themePink:"可爱粉",themeGreen:"清新绿",themePurple:"梦幻紫",
  bgSpring:"春天",bgSummer:"夏天",bgAutumn:"秋天",bgDefault:"恢复默认",
  showXiaohei:"显示小黑",hideXiaohei:"隐藏小黑",adminBtn:"管理",
  modalTitle:"管理员后台",tabMusic:"音乐管理",tabPassword:"密码管理",
  lblPwd:"管理员密码",phPwd:"输入当前密码",
  lblSongId:"网易云音乐歌曲ID",phSongId:"例如：452814990",
  btnCancel:"取消",btnSaveMusic:"保存音乐",
  lblStep1:"步骤 1/3 · 验证身份",phOldPwd:"输入当前密码",btnVerify:"验证身份",
  lblStep2:"步骤 2/3 · 设置新密码",phNewPwd:"输入新密码（至少8位）",
  lblConfirm:"确认新密码",phConfirm:"再次输入新密码",
  lblHint:"密码提示（可选）",phHint:"例如：我的生日+",
  btnBack:"返回",btnSetPwd:"确认修改密码",
  lblStep3:"步骤 3/3 · 密码修改成功！",
  pwdSaveTip:"请务必保存下方恢复码",
  recoveryTitle:"一次性恢复码（请截图保存）",recoveryWarn:"关闭前请务必保存！",
  btnFinish:"我已保存，关闭",
  s0:"极弱",s1:"较弱",s2:"一般",s3:"良好",s4:"强",s5:"极强",
  strengthInit:"强度：请设置密码",
  m1:"请输入管理员密码",m2:"请输入歌曲ID",m3:"请输入有效的歌曲ID",
  m4:"保存成功！即将刷新",m5:"保存失败",
  m6:"身份验证通过",m7:"密码错误，请重试",m8:"验证失败",
  m9:"密码至少8位",m10:"两次密码不一致",m11:"密码强度太低，请包含字母+数字",
  m12:"密码修改成功！请保存恢复码",m13:"修改失败",
  m14:"密码已更新，下次请使用新密码登录",
  m15:"背景功能已解锁！",
  pmOk:"两次密码一致",pmErr:"两次密码不一致"
},
"zh-TW":{
  pageTitle:"胡柏珲的個人主頁",contactTitle:"聯絡方式",copyTip:"已複製",
  introGreet:"你好，我是胡柏珲",
  introLoc:"09年河南人，現居於河南鄭州",
  timeLabel:"在線北京時間：",
  darkMode:"深色模式",
  themeDefault:"默認藍",themePink:"可愛粉",themeGreen:"清新綠",themePurple:"夢幻紫",
  bgSpring:"春天",bgSummer:"夏天",bgAutumn:"秋天",bgDefault:"恢復默認",
  showXiaohei:"顯示小黑",hideXiaohei:"隱藏小黑",adminBtn:"管理",
  modalTitle:"管理員後台",tabMusic:"音樂管理",tabPassword:"密碼管理",
  lblPwd:"管理員密碼",phPwd:"輸入當前密碼",
  lblSongId:"網易雲音樂歌曲ID",phSongId:"例如：452814990",
  btnCancel:"取消",btnSaveMusic:"保存音樂",
  lblStep1:"步驟 1/3 · 驗證身份",phOldPwd:"輸入當前密碼",btnVerify:"驗證身份",
  lblStep2:"步驟 2/3 · 設置新密碼",phNewPwd:"輸入新密碼（至少8位）",
  lblConfirm:"確認新密碼",phConfirm:"再次輸入新密碼",
  lblHint:"密碼提示（可選）",phHint:"例如：我的生日+",
  btnBack:"返回",btnSetPwd:"確認修改密碼",
  lblStep3:"步驟 3/3 · 密碼修改成功！",
  pwdSaveTip:"請務必保存下方恢復碼",
  recoveryTitle:"一次性恢復碼（請截圖保存）",recoveryWarn:"關閉前請務必保存！",
  btnFinish:"我已保存，關閉",
  s0:"極弱",s1:"較弱",s2:"一般",s3:"良好",s4:"強",s5:"極強",
  strengthInit:"強度：請設置密碼",
  m1:"請輸入管理員密碼",m2:"請輸入歌曲ID",m3:"請輸入有效的歌曲ID",
  m4:"保存成功！即將刷新",m5:"保存失敗",
  m6:"身份驗證通過",m7:"密碼錯誤，請重試",m8:"驗證失敗",
  m9:"密碼至少8位",m10:"兩次密碼不一致",m11:"密碼強度太低，請包含字母+數字",
  m12:"密碼修改成功！請保存恢復碼",m13:"修改失敗",
  m14:"密碼已更新，下次請使用新密碼登錄",
  m15:"背景功能已解鎖！",
  pmOk:"兩次密碼一致",pmErr:"兩次密碼不一致"
}
};

var $=function(id){return document.getElementById(id);};
var pageHeader=$("pageHeader"),localTime=$("localTime"),timeLabel=$("timeLabel");
var emailCopyEl=$("emailCopy"),copyTipEl=$("copyTip");
var toggleDark=$("toggleDark"),bgSwitchGroup=$("bgSwitchGroup"),xiaohei=$("xiaohei"),toggleXiaohei=$("toggleXiaohei");
var quoteToast=$("quoteToast"),toast=$("toast"),adminModal=$("adminModal"),adminBtn=$("adminBtn");
var closeModal=$("closeModal"),saveMusicBtn=$("saveMusicBtn"),adminPassword=$("adminPassword"),musicIdInput=$("musicIdInput");
var tabBtns=document.querySelectorAll(".tab-btn"),tabContents=document.querySelectorAll(".tab-content");
var themeBtns=document.querySelectorAll(".theme-btn"),bgBtns=document.querySelectorAll(".bg-btn");
var pwd1=$("pwd-step1"),pwd2=$("pwd-step2"),pwd3=$("pwd-step3");
var oldPwdInput=$("oldPasswordInput"),newPwdInput=$("newPasswordInput"),cfPwdInput=$("confirmPasswordInput"),hintInput=$("pwdHintInput");
var vfyBtn=$("verifyOldPwdBtn"),setBtn=$("setNewPwdBtn"),backBtn=$("backToStep1"),cancelPwd=$("cancelPwdChange"),finBtn=$("finishPwdChange");
var sBar=$("strengthBar"),sLabel=$("strengthLabel"),pMatch=$("pwdMatch"),rcDisplay=$("recoveryCodeDisplay");
var sto={get:function(k,d){return localStorage.getItem(k)||d;},set:function(k,v){localStorage.setItem(k,v);}};
var pad=function(n){return String(n).padStart(2,"0");};
var genCode="";

function msg(t,c){toast.textContent=t;toast.className="toast";if(c)toast.classList.add(c);toast.classList.add("show");setTimeout(function(){toast.classList.remove("show");},2500);}

function updTime(){var d=new Date();localTime.textContent=d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+":"+pad(d.getMinutes())+":"+pad(d.getSeconds());}
updTime();setInterval(updTime,1000);

emailCopyEl.onclick=function(){try{navigator.clipboard.writeText("hubohui@outlook.com");copyTipEl.style.display="inline";setTimeout(function(){copyTipEl.style.display="none";},2000);}catch(e){}};

var lang=sto.get("lang","zh-CN");
function applyLang(){
  var p=LANG[lang];
  document.title=p.pageTitle;
  pageHeader.textContent=p.pageTitle;
  document.querySelector(".contact-title").textContent=p.contactTitle;
  copyTipEl.textContent=p.copyTip;
  $("introGreet").textContent=p.introGreet;
  $("introLoc").textContent=p.introLoc;
  timeLabel.textContent=p.timeLabel;
  toggleDark.textContent=p.darkMode;
  themeBtns.forEach(function(b){
    var t=b.getAttribute("data-theme");
    if(t==="")b.textContent=p.themeDefault;
    else if(t==="theme-pink")b.textContent=p.themePink;
    else if(t==="theme-green")b.textContent=p.themeGreen;
    else if(t==="theme-purple")b.textContent=p.themePurple;
  });
  bgBtns.forEach(function(b){
    var bg=b.getAttribute("data-bg");
    if(bg==="spring")b.textContent="🌸 "+p.bgSpring;
    else if(bg==="summer")b.textContent="🌿 "+p.bgSummer;
    else if(bg==="autumn")b.textContent="🍂 "+p.bgAutumn;
    else if(bg==="default")b.textContent=p.bgDefault;
  });
  toggleXiaohei.textContent=xiaohei.classList.contains("hidden")?p.showXiaohei:p.hideXiaohei;
  adminBtn.textContent=p.adminBtn;
  document.querySelectorAll(".lang-btn").forEach(function(b){b.classList.remove("active");});
  $(lang).classList.add("active");
  document.querySelector(".modal-title").textContent=p.modalTitle;
  $("tabMusic").textContent="🎵 "+p.tabMusic;
  $("tabPassword").textContent="🔒 "+p.tabPassword;
  $("lblPwd").textContent=p.lblPwd;
  adminPassword.placeholder=p.phPwd;
  $("lblSongId").textContent=p.lblSongId;
  musicIdInput.placeholder=p.phSongId;
  $("closeModal").textContent=p.btnCancel;
  $("saveMusicBtn").textContent=p.btnSaveMusic;
  $("lblStep1").textContent=p.lblStep1;
  oldPwdInput.placeholder=p.phOldPwd;
  cancelPwd.textContent=p.btnCancel;
  vfyBtn.textContent=p.btnVerify;
  $("lblStep2").textContent=p.lblStep2;
  newPwdInput.placeholder=p.phNewPwd;
  sLabel.textContent=p.strengthInit;
  $("lblConfirm").textContent=p.lblConfirm;
  cfPwdInput.placeholder=p.phConfirm;
  $("lblHint").textContent=p.lblHint;
  hintInput.placeholder=p.phHint;
  backBtn.textContent=p.btnBack;
  setBtn.textContent=p.btnSetPwd;
  $("lblStep3").textContent=p.lblStep3;
  $("pwdSaveTip").textContent=p.pwdSaveTip;
  $("recoveryTitle").textContent=p.recoveryTitle;
  $("recoveryWarn").textContent=p.recoveryWarn;
  finBtn.textContent=p.btnFinish;
}

document.querySelectorAll(".lang-btn").forEach(function(b){
  b.onclick=function(){lang=b.id;sto.set("lang",lang);applyLang();};
});

var curTheme=sto.get("theme","");
function setTheme(t){document.body.classList.remove("theme-pink","theme-green","theme-purple");if(t)document.body.classList.add(t);sto.set("theme",t);themeBtns.forEach(function(b){b.classList.toggle("active",b.getAttribute("data-theme")===t);});}
themeBtns.forEach(function(b){b.onclick=function(){setTheme(b.getAttribute("data-theme"));};});

var isDark=sto.get("dark")==="true";
function applyDark(){document.body.classList.toggle("dark",isDark);toggleDark.classList.toggle("active",isDark);sto.set("dark",isDark);}
toggleDark.onclick=function(){isDark=!isDark;applyDark();};

document.addEventListener("click",function(e){var p=document.createElement("div");p.className="paw";p.textContent="\\u{1F43E}";p.style.left=(e.clientX-10)+"px";p.style.top=(e.clientY-12)+"px";document.body.appendChild(p);setTimeout(function(){p.remove();},900);});

var bt,isHome=true,xhVis=sto.get("xiaoheiVisible","true")==="true";
function initXh(){xiaohei.classList.toggle("hidden",!xhVis);toggleXiaohei.textContent=xhVis?LANG[lang].hideXiaohei:LANG[lang].showXiaohei;}
toggleXiaohei.onclick=function(){xhVis=!xhVis;xiaohei.classList.toggle("hidden",!xhVis);toggleXiaohei.textContent=xhVis?LANG[lang].hideXiaohei:LANG[lang].showXiaohei;sto.set("xiaoheiVisible",xhVis);};
function goHome(){xiaohei.style.transform="translate(0,0)";isHome=true;}
document.addEventListener("mousemove",function(e){if(!xhVis)return;isHome=false;clearTimeout(bt);var w=xiaohei.offsetWidth,h=xiaohei.offsetHeight;xiaohei.style.transform="translate("+(e.clientX-window.innerWidth+w/2+20)+"px,"+(e.clientY-window.innerHeight+h/2+20)+"px)";bt=setTimeout(goHome,2000);});
xiaohei.onclick=function(){if(isHome&&xhVis){xiaohei.classList.remove("jump");void xiaohei.offsetWidth;xiaohei.classList.add("jump");setTimeout(function(){xiaohei.classList.remove("jump");},500);}};

var tc=0,tt,bgUnlock=sto.get("bgUnlocked")==="true";
pageHeader.onclick=function(){if(bgUnlock)return;tc++;clearTimeout(tt);tt=setTimeout(function(){tc=0;},3000);if(tc===5){tc=0;bgUnlock=true;sto.set("bgUnlocked",true);bgSwitchGroup.classList.add("show");msg(LANG[lang].m15);}};

var curBg=sto.get("currentBg","default");
var bgCfg={spring:"https://s41.ax1x.com/2026/03/03/pep6CM4.png",summer:"https://s41.ax1x.com/2026/03/03/pep6PsJ.png",autumn:"https://s41.ax1x.com/2026/03/03/pep6iL9.png",default:"var(--bg)"};
function setBg(b){if(!bgCfg[b])return;curBg=b;sto.set("currentBg",b);if(b==="default"){document.body.style.background="var(--bg)";}else{document.body.style.background="url("+bgCfg[b]+")";document.body.style.backgroundSize="cover";document.body.style.backgroundPosition="center";document.body.style.backgroundAttachment="fixed";}bgBtns.forEach(function(btn){btn.classList.toggle("active",btn.getAttribute("data-bg")===b);});applyDark();}
bgBtns.forEach(function(btn){btn.onclick=function(){setBg(btn.getAttribute("data-bg"));};});

var ki=0,kc=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"],kunlock=sto.get("konamiUnlocked")==="true";
var xhQ=["我叫罗小黑，请多指教~","只要有你在，哪里都是家","我不想再分开了","我可以跟你一起走吗？","师傅，我错了，但我下次还敢~","比丢！不准乱吃东西！"];
document.addEventListener("keydown",function(e){if(kunlock)return;if(e.code===kc[ki]){ki++;if(ki===kc.length){tk();ki=0;}}else{ki=0;}});
function tk(){kunlock=true;sto.set("konamiUnlocked",true);quoteToast.textContent=xhQ[Math.floor(Math.random()*xhQ.length)];quoteToast.classList.add("show");setTimeout(function(){quoteToast.classList.remove("show");},4000);for(var i=0;i<30;i++){setTimeout(function(){var p=document.createElement("div");p.className="paw-fall";p.textContent="\\u{1F43E}";p.style.left=Math.random()*window.innerWidth+"px";document.body.appendChild(p);setTimeout(function(){p.remove();},5000);},i*100);}setTheme("theme-purple");}

tabBtns.forEach(function(btn){btn.onclick=function(){tabBtns.forEach(function(b){b.classList.remove("active");});btn.classList.add("active");tabContents.forEach(function(t){t.classList.remove("show");});$(btn.getAttribute("data-tab")).classList.add("show");if(btn.getAttribute("data-tab")==="password-tab"){resetPwd();}};});
function resetPwd(){pwd1.style.display="block";pwd2.style.display="none";pwd3.style.display="none";oldPwdInput.value="";newPwdInput.value="";cfPwdInput.value="";hintInput.value="";sBar.style.width="0%";sBar.style.background="#ef4444";sLabel.textContent=LANG[lang].strengthInit;pMatch.textContent="";genCode="";}

function chkStr(p){var s=0;if(p.length>=8)s++;if(p.length>=12)s++;if(/[a-z]/.test(p))s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^a-zA-Z0-9]/.test(p))s++;var ks=["s0","s1","s2","s3","s4","s5"];var cs=["#ef4444","#f97316","#eab308","#22c55e","#16a34a","#15803d"];var i=Math.min(s,5);return{sc:i,lb:LANG[lang][ks[i]],cl:cs[i]};}
newPwdInput.oninput=function(){var r=chkStr(this.value);sBar.style.width=((r.sc+1)/6*100)+"%";sBar.style.background=r.cl;sLabel.textContent="强度："+r.lb;chkMatch();};
cfPwdInput.oninput=chkMatch;
function chkMatch(){var n=newPwdInput.value,c=cfPwdInput.value;if(!c){pMatch.textContent="";return;}if(n===c){pMatch.textContent=LANG[lang].pmOk;pMatch.className="pwd-match ok";}else{pMatch.textContent=LANG[lang].pmErr;pMatch.className="pwd-match err";}}

adminBtn.onclick=function(){adminModal.classList.add("show");musicIdInput.value=CSID;adminPassword.value="";resetPwd();tabBtns.forEach(function(b){b.classList.remove("active");});tabBtns[0].classList.add("active");tabContents.forEach(function(t){t.classList.remove("show");});$("music-tab").classList.add("show");};
closeModal.onclick=function(){adminModal.classList.remove("show");adminPassword.value="";};
adminModal.onclick=function(e){if(e.target===adminModal)closeModal.onclick();};

saveMusicBtn.onclick=function(){
  var p=adminPassword.value.trim(),r=musicIdInput.value.trim();
  if(!p)return msg(LANG[lang].m1);
  if(!r)return msg(LANG[lang].m2);
  var d=r.replace(/[^0-9]/g,"");
  if(!d.length)return msg(LANG[lang].m3);
  fetch("/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"save_music",password:p,songId:d})})
  .then(function(r){return r.json();})
  .then(function(d){if(d.success){msg(LANG[lang].m4,"success");setTimeout(function(){location.reload();},1500);}else{msg(d.message,"danger");}})
  .catch(function(e){msg(LANG[lang].m5,"danger");});
};

vfyBtn.onclick=function(){
  var p=oldPwdInput.value.trim();
  if(!p)return msg(LANG[lang].m1);
  fetch("/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"verify_password",password:p})})
  .then(function(r){return r.json();})
  .then(function(d){if(d.verified){msg(LANG[lang].m6,"success");pwd1.style.display="none";pwd2.style.display="block";}else{msg(LANG[lang].m7,"danger");}})
  .catch(function(e){msg(LANG[lang].m8,"danger");});
};

cancelPwd.onclick=function(){resetPwd();tabBtns[0].click();};
backBtn.onclick=function(){pwd1.style.display="block";pwd2.style.display="none";};

setBtn.onclick=function(){
  var p=newPwdInput.value,c=cfPwdInput.value,h=hintInput.value.trim();
  if(p.length<8)return msg(LANG[lang].m9);
  if(p!==c)return msg(LANG[lang].m10);
  var s=chkStr(p);if(s.sc<2)return msg(LANG[lang].m11);
  fetch("/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"change_password",oldPassword:oldPwdInput.value.trim(),newPassword:p,hint:h})})
  .then(function(r){return r.json();})
  .then(function(d){if(d.success){genCode=d.recoveryCode||"N/A";rcDisplay.textContent=genCode;pwd2.style.display="none";pwd3.style.display="block";msg(LANG[lang].m12,"success");}else{msg(d.message||LANG[lang].m13,"danger");}})
  .catch(function(e){msg(LANG[lang].m13,"danger");});
};

finBtn.onclick=function(){closeModal.onclick();msg(LANG[lang].m14);};

var ap=new APlayer({
  container:document.getElementById("aplayer"),mini:false,autoplay:false,
  theme:"#2563eb",loop:"all",order:"list",preload:"auto",volume:0.7,
  audio:[{name:SN,artist:SA,url:"https://music.163.com/song/media/outer/url?id="+CSID+".mp3",cover:SC}]
});

applyLang();setTheme(curTheme);applyDark();initXh();
if(bgUnlock)bgSwitchGroup.classList.add("show");setBg(curBg);
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

    // ----- 1. 处理所有 POST 请求（管理后台 API）-----
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const { action } = body;
        let storedPwd = DEFAULT_PASSWORD;
        try { const p = await env.CONFIG_KV.get("admin_password"); if (p) storedPwd = p; } catch(e) {}

        // 验证密码
        if (action === "verify_password") {
          const { password } = body;
          if (password === storedPwd) return Response.json({ verified: true });
          const rc = await env.CONFIG_KV.get("recovery_code").catch(()=>null);
          if (rc && password === rc) return Response.json({ verified: true, viaRecovery: true });
          return Response.json({ verified: false });
        }

        // 修改密码
        if (action === "change_password") {
          const { oldPassword, newPassword, hint } = body;
          if (oldPassword !== storedPwd) return Response.json({ success: false, message: "旧密码验证失败" });
          if (!newPassword || newPassword.length < 8) return Response.json({ success: false, message: "密码至少8位" });
          // 生成恢复码
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
          let code = "";
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) code += chars[Math.floor(Math.random() * chars.length)];
            if (i < 3) code += "-";
          }
          await env.CONFIG_KV.put("admin_password", newPassword);
          await env.CONFIG_KV.put("recovery_code", code);
          if (hint) await env.CONFIG_KV.put("password_hint", hint);
          return Response.json({ success: true, message: "密码已更新", recoveryCode: code });
        }

        // 保存歌曲 ID
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

    // ----- 2. 严格路由：只允许 GET 方法 -----
    // ----- 2.1 根路径：返回主页 + 访客计数 -----
    if (path === "/" || path === "") {
      // --- 访客计数（IP 去重） ---
      let visitorCount = 1; // 默认值
      try {
        // 获取客户端 IP（Cloudflare 提供的头部）
        const clientIP = request.headers.get("CF-Connecting-IP") || 
                         request.headers.get("X-Forwarded-For") || 
                         "unknown";
        // 从 KV 读取已访问 IP 集合（存储为 JSON 数组）
        let ipSet = await env.CONFIG_KV.get("visitor_set", "json");
        if (!Array.isArray(ipSet)) ipSet = [];
        // 检查当前 IP 是否已经在集合中
        if (!ipSet.includes(clientIP)) {
          // 新 IP：加入集合，并增加计数
          ipSet.push(clientIP);
          await env.CONFIG_KV.put("visitor_set", JSON.stringify(ipSet));
          // 读取当前计数并 +1
          let count = await env.CONFIG_KV.get("visitor_count", "json");
          if (typeof count !== "number") count = 0;
          count += 1;
          await env.CONFIG_KV.put("visitor_count", JSON.stringify(count));
          visitorCount = count;
        } else {
          // 已存在，直接读取计数
          let count = await env.CONFIG_KV.get("visitor_count", "json");
          visitorCount = (typeof count === "number") ? count : 1;
        }
      } catch (e) {
        // 如果 KV 出错，忽略并显示默认值
        visitorCount = 1;
      }

      // --- 获取歌曲信息 ---
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

      // 生成 HTML 并返回
      return new Response(getPageHtml(songId, info, visitorCount), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Referrer-Policy": "no-referrer"
        }
      });
    }

    // ----- 2.2 短链重定向：/go/xxx -----
    if (path.startsWith("/go/")) {
      const target = path.replace("/go/", "");
      // 从映射表查找
      if (LINK_MAP[target]) {
        return Response.redirect(LINK_MAP[target], 302);
      } else {
        // 重定向失败 -> 返回 404
        return new Response(get404Page(`未找到短链：${target}`), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }
    }

    // ----- 2.3 测试 404 页面（可选）-----
    if (path === "/404") {
      return new Response(get404Page("您主动访问了测试404页面"), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // ----- 2.4 其他所有路径：统统 404 -----
    return new Response(get404Page(`路径 "${path}" 不存在`), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

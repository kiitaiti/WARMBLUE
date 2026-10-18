(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s);};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var motionOff = reduced;
try{ if(sessionStorage.getItem('wb_motion')==='off') motionOff=true; }catch(e){}

/* ---------- Page transition (fade in / fade out on internal links) ---------- */
var fade=$('.page-fade');
if(fade){
  requestAnimationFrame(function(){ document.body.classList.remove('entering'); });
  $$('a[href]').forEach(function(a){
    var h=a.getAttribute('href');
    if(!h || h.charAt(0)==='#' || /^(https?:|mailto:|tel:)/.test(h) || a.target==='_blank') return;
    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||motionOff) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(function(){ location.href=h; },420);
    });
  });
  window.addEventListener('pageshow',function(ev){ if(ev.persisted) document.body.classList.remove('leaving','entering'); });
}

/* ---------- Hero video (top only) ---------- */
var heroVideo=$('#heroVideo'), vt=$('#videoToggle'), userPaused=false;
function playHero(restart){
  if(!heroVideo || motionOff || userPaused) return;
  if(restart) heroVideo.currentTime=0;
  var p=heroVideo.play(); if(p&&p.catch) p.catch(function(){});
}
function pauseHero(){ if(heroVideo) heroVideo.pause(); }
function setVt(){
  if(!vt) return;
  vt.textContent=(userPaused||motionOff)?'映像を再生':'映像を停止';
  vt.setAttribute('aria-pressed',String(userPaused||motionOff));
}
if(vt){
  vt.addEventListener('click',function(){
    userPaused=!(userPaused||motionOff);
    if(!userPaused&&motionOff){ motionOff=false; applyMotion(); }
    if(userPaused) pauseHero(); else playHero(false);
    setVt();
  });
}
if(heroVideo){
  new IntersectionObserver(function(en){ if(en[0].isIntersecting) playHero(false); else pauseHero(); },{threshold:.08}).observe($('#hero'));
  window.addEventListener('scroll',function(){
    if(motionOff) return;
    var y=Math.min(1,window.scrollY/window.innerHeight);
    heroVideo.style.transform='scale('+(1+y*0.08)+')';
  },{passive:true});
}

/* ---------- Motion toggle ---------- */
var mt=$('#motionToggle');
function applyMotion(){
  document.body.classList.toggle('motion-off',motionOff);
  if(mt) mt.setAttribute('aria-pressed',String(motionOff));
  if(motionOff) pauseHero(); else if(!userPaused) playHero(false);
  setVt();
  try{ sessionStorage.setItem('wb_motion',motionOff?'off':'on'); }catch(e){}
}
if(mt) mt.addEventListener('click',function(){ motionOff=!motionOff; applyMotion(); });
applyMotion();

/* ---------- Intro (top only, first visit per session) ---------- */
var intro=$('#intro'), visited=false;
try{ visited=sessionStorage.getItem('wb_visited')==='1'; }catch(e){}
function endIntro(){
  if(!intro) return;
  intro.classList.add('done');
  try{ sessionStorage.setItem('wb_visited','1'); }catch(e){}
  playHero(true);
  setTimeout(function(){ intro.remove(); },1500);
}
if(intro){
  if(reduced||motionOff){ endIntro(); }
  else if(visited){ intro.classList.add('reveal'); setTimeout(endIntro,700); }
  else{
    setTimeout(function(){ intro.classList.add('reveal'); },1100);
    setTimeout(function(){ intro.classList.add('expand'); },2600);
    setTimeout(endIntro,3400);
  }
  $('#skipIntro').addEventListener('click',endIntro);
}else{
  try{ sessionStorage.setItem('wb_visited','1'); }catch(e){}
}

/* ---------- Hero logo entrance ---------- */
var heroLogo=$('#heroLogo');
if(heroLogo){
  var heroDelay=(reduced||motionOff)?0:(visited?0.9:3.0);
  setTimeout(function(){ heroLogo.classList.add('in'); },heroDelay*1000);
}

/* ---------- Char split helper ---------- */
function splitChars(el){
  var out=[];
  Array.prototype.slice.call(el.childNodes).forEach(function(node){
    if(node.nodeType===3){
      var frag=document.createDocumentFragment();
      node.textContent.split('').forEach(function(c){
        var s=document.createElement('span');s.className='ch';s.textContent=c;frag.appendChild(s);out.push(s);
      });
      el.replaceChild(frag,node);
    }else if(node.nodeType===1){ out=out.concat(splitChars(node)); }
  });
  return out;
}
function animChars(chars,delayBase){
  chars.forEach(function(s,i){
    var d=(delayBase+i*0.045)+'s';
    s.style.transition='opacity 1s var(--ease) '+d+', transform 1s var(--ease) '+d+', filter 1s var(--ease) '+d;
    requestAnimationFrame(function(){ s.style.opacity='1'; s.style.transform='none'; s.style.filter='blur(0)'; });
  });
}

/* ---------- Cursor light ---------- */
var cursor=$('#cursor');
if(cursor && window.matchMedia('(pointer:fine)').matches){
  var cx=innerWidth/2,cy=innerHeight/2,tx=cx,ty=cy,lastSpark=0;
  document.addEventListener('mousemove',function(e){
    tx=e.clientX;ty=e.clientY;
    if(!cursor.classList.contains('on')) cursor.classList.add('on');
    var now=performance.now();
    if(!motionOff&&now-lastSpark>90){
      lastSpark=now;
      var d=document.createElement('i');d.className='spark-dot';
      var sz=4+Math.random()*7;
      d.style.width=d.style.height=sz+'px';
      d.style.left=(e.clientX-sz/2)+'px';d.style.top=(e.clientY-sz/2)+'px';
      d.style.setProperty('--dx',(Math.random()*36-18)+'px');
      d.style.setProperty('--dy',(Math.random()*-30-8)+'px');
      document.body.appendChild(d);
      setTimeout(function(){ d.remove(); },1200);
    }
  },{passive:true});
  document.addEventListener('mouseleave',function(){ cursor.classList.remove('on'); });
  (function loop(){ cx+=(tx-cx)*0.16;cy+=(ty-cy)*0.16;cursor.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(loop); })();
  document.addEventListener('mouseover',function(e){ if(e.target.closest('a,button,.spot,.m-item')) cursor.classList.add('grow'); });
  document.addEventListener('mouseout',function(e){ if(e.target.closest('a,button,.spot,.m-item')) cursor.classList.remove('grow'); });
}

/* ---------- Header scroll / progress ---------- */
var header=$('#siteHeader'), progBar=$('#progress i');
function onScroll(){
  if(header) header.classList.toggle('scrolled',window.scrollY>60);
  if(progBar){ var h=document.documentElement.scrollHeight-window.innerHeight; progBar.style.height=(h>0?(window.scrollY/h*100):0)+'%'; }
}
window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

/* ---------- Fullscreen menu ---------- */
var menuBtn=$('#menuBtn'),menu=$('#menu'),menuBg=$('#menuBg'),menuClose=$('#menuClose');
function setMenu(open){
  if(!menu) return;
  menu.classList.toggle('open',open);
  menuBtn.setAttribute('aria-expanded',String(open));
  menuBtn.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');
  document.body.style.overflow=open?'hidden':'';
  if(open) setTimeout(function(){ menuClose.focus(); },400);
}
if(menuBtn){
  menuBtn.addEventListener('click',function(){ setMenu(!menu.classList.contains('open')); });
  menuClose.addEventListener('click',function(){ setMenu(false); menuBtn.focus(); });
  $$('a',menu).forEach(function(a){
    a.addEventListener('mouseenter',function(){
      if(motionOff||!a.dataset.bg) return;
      menuBg.style.backgroundImage="url('"+a.dataset.bg+"')"; menuBg.style.opacity='1';
    });
    a.addEventListener('mouseleave',function(){ menuBg.style.opacity='0'; });
  });
}
document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ setMenu(false); closeLb(); } });

/* ---------- Reveal on scroll ---------- */
var io=new IntersectionObserver(function(entries){
  entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
},{threshold:.18});
$$('.reveal').forEach(function(el){ io.observe(el); });
window.WB_reveal=function(){ $$('.reveal:not(.in)').forEach(function(el){ io.observe(el); }); };

function onView(sel,cb,th){
  var el=typeof sel==='string'?$(sel):sel; if(!el) return;
  new IntersectionObserver(function(en,obs){ if(en[0].isIntersecting){ cb(el); obs.disconnect(); } },{threshold:th||.35}).observe(el);
}
onView('#awPhoto',function(el){ el.classList.add('bloom'); },.45);
$$('.clip-reveal').forEach(function(el){ onView(el,function(){ el.classList.add('in'); },.3); });
onView('#mapbox',function(el){ el.classList.add('draw'); },.4);
onView('#ending',function(el){ el.classList.add('in'); },.35);

/* ---------- Page head parallax (sub pages) ---------- */
var phBg=$('.page-head .ph-bg');
if(phBg){
  window.addEventListener('scroll',function(){
    if(motionOff) return;
    var y=Math.min(window.scrollY,window.innerHeight);
    phBg.style.transform='translateY('+(y*0.25)+'px) scale(1.04)';
  },{passive:true});
}

/* ---------- Future cinematic scenes ---------- */
var track=$('#futureTrack');
if(track){
  var scenes=$$('.fscene',track),lightLine=$('#lightLine'),fbody=$('#fbody');
  function futureScroll(){
    var r=track.getBoundingClientRect(),total=r.height-window.innerHeight;
    var p=Math.min(1,Math.max(0,-r.top/total));
    var idx=Math.min(scenes.length-1,Math.floor(p*scenes.length));
    scenes.forEach(function(s,i){ s.classList.toggle('on',i===idx); });
    lightLine.classList.toggle('draw',p>0.28);
    fbody.classList.toggle('on',p>0.12);
  }
  if(!motionOff){ window.addEventListener('scroll',futureScroll,{passive:true}); futureScroll(); }
  else{ scenes.forEach(function(s,i){ s.classList.toggle('on',i===0); }); fbody.classList.add('on'); lightLine.classList.add('draw'); }
}

/* ---------- Fireworks ---------- */
var fwTitle=$('#fwTitle');
if(fwTitle){
  var fwChars=splitChars(fwTitle);
  onView(fwTitle,function(){ animChars(fwChars,0.1); },.4);
  var fwBg=$('.fw-bg');
  window.addEventListener('scroll',function(){
    if(motionOff||!fwBg) return;
    var r=fwBg.parentElement.getBoundingClientRect();
    if(r.top<window.innerHeight&&r.bottom>0){
      var p=(window.innerHeight-r.top)/(window.innerHeight+r.height);
      fwBg.style.transform='translateY('+((p-.5)*40)+'px) scale(1.06)';
    }
  },{passive:true});
}

/* ---------- Spots (data in page via window.SPOT_DATA) ---------- */
var spotImg=$('#spotImg');
if(spotImg && window.SPOT_DATA){
  var spotName=$('#spotName'),spotDesc=$('#spotDesc'),spotPhoto=$('.spot-photo');
  $$('.spot').forEach(function(g){
    function sel(){
      $$('.spot').forEach(function(x){ x.classList.remove('active'); });
      g.classList.add('active');
      var d=window.SPOT_DATA[+g.dataset.spot];
      spotImg.style.opacity='0';
      setTimeout(function(){
        var nd=$('.nodata',spotPhoto); if(nd) nd.remove();
        if(d.img){ spotImg.src=d.img; spotImg.alt=d.alt; spotImg.style.display='block'; }
        else{
          spotImg.style.display='none';
          var div=document.createElement('div');div.className='nodata';div.textContent='PHOTO — COMING SOON';
          spotPhoto.appendChild(div);
        }
        spotImg.style.opacity='1';
      },320);
      spotName.textContent=d.name; spotDesc.textContent=d.desc;
    }
    g.addEventListener('click',sel);
    g.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); sel(); } });
  });
}

/* ---------- Lightbox ---------- */
var lb=$('#lightbox'),lbImg=$('#lbImg'),lbCap=$('#lbCap');
function closeLb(){ if(!lb) return; lb.classList.remove('open'); document.body.style.overflow=''; }
if(lb){
  $('#lbClose').addEventListener('click',closeLb);
  lb.addEventListener('click',function(e){ if(e.target===lb) closeLb(); });
  $$('.m-item').forEach(function(b){
    b.addEventListener('click',function(){
      var img=$('img',b);
      lbImg.src=img.src; lbImg.alt=img.alt; lbCap.textContent=b.dataset.cap;
      lb.classList.add('open'); document.body.style.overflow='hidden';
    });
  });
}
})();

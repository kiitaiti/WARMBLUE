/* ============================================================
   microCMS 連携（STORY）
   ------------------------------------------------------------
   1. microCMS で API を作成（API名: story / エンドポイント: story / リスト形式）
   2. フィールド（API スキーマ）
        title     テキストフィールド       記事タイトル
        eyecatch  画像                    アイキャッチ
        category  セレクトフィールド       例: 想い / 実行委員の声 / 協力店 / レポート
        excerpt   テキストエリア           一覧に出る要約（80字程度）
        body      リッチエディタ           本文
   3. もう1つ API を作成（API名: event / エンドポイント: event / リスト形式）
        title     テキストフィールド       イベント名
        date      日時                    開催日（開始）
        timeText  テキストフィールド       時間の表記（例: 10:00–16:00 / 19:30 打ち上げ）
        place     テキストフィールド       会場名
        mapUrl    テキストフィールド       Googleマップ等のURL
        tag       セレクトフィールド       例: 出店 / ライトアップ / 花火 / 清掃活動 / その他
        eyecatch  画像                    サムネイル（横長推奨 16:9）
        excerpt   テキストエリア           一覧に出る一言
        body      リッチエディタ           詳細（内容・雨天時・持ち物・注意事項など）
        report    リッチエディタ           終了後のレポート（任意）
   4. 「APIキー」から GET 権限のみのキーを発行し、下の2行を書き換える
   ------------------------------------------------------------ */
window.WB_CMS = {
  serviceDomain: "",          // 例: "warmblue-machida"  →  https://warmblue-machida.microcms.io
  apiKey: "",                 // GET のみのAPIキー
  endpoint: "story",
  eventEndpoint: "event"
};

(function(){
'use strict';
var C = window.WB_CMS;
var configured = !!(C.serviceDomain && C.apiKey);

/* ---------- 設定前のプレビュー用サンプル（本番では使われない） ---------- */
var SAMPLE = [
  {id:"sample-why-blue", title:"なぜ、青なのか。", category:["想い"], publishedAt:"2026-11-01T09:00:00.000Z",
   eyecatch:{url:"assets/sakura_up.webp"},
   excerpt:"毎年4月2日、世界中のランドマークが青く照らされます。町田で青い花火を上げる理由も、その色に込められた意味から始まりました。",
   body:"<p>毎年4月2日は「世界自閉症啓発デー」です。2007年に国連総会で定められ、この日に合わせて世界各地の建物やランドマークがブルーにライトアップされます。</p><h2>青は、理解の色</h2><p>ブルーは「癒し」や「希望」を表す色であると同時に、自閉症への理解を広げるシンボルカラーとして使われてきました。空や海のように、誰にとっても身近で、誰のものでもない色です。</p><p>WARMBLUEmachidaが青い花火を選んだのは、この色を「見上げる体験」にしたかったからです。同じ空を、同じ時間に、障害のある人もない人も一緒に見上げる。その数分間が、言葉より先に「理解」を届けてくれると信じています。</p><h2>町田の街を、温かいブルーで</h2><p>花火の日だけでなく、3月下旬からは町田駅前のペデストリアンデッキや原町田大通り、芹ケ谷公園の桜がブルーに染まります。通りかかった人が「今年も青くなったね」と思ってくれたら、それがこの活動の第一歩です。</p><blockquote>ひとつの青い光が、街の景色を変えていく。</blockquote><p>このSTORYでは、花火の裏側にある話を、少しずつ書き残していきます。</p>"},
  {id:"sample-committee-01", title:"実行委員の声 ①「最初の年は、花火が上がるまで信じられなかった」", category:["実行委員の声"], publishedAt:"2026-10-20T09:00:00.000Z",
   eyecatch:{url:"assets/committee.webp"},
   excerpt:"2024年、町田で初めて青い花火を上げた日のこと。実行委員会の立ち上げメンバーに、当時の話を聞きました。",
   body:"<p>（記事本文はmicroCMSから配信されます。この記事はレイアウト確認用のサンプルです）</p>"},
  {id:"sample-shop-01", title:"協力店の一言：原町田大通りのコーヒースタンド", category:["協力店"], publishedAt:"2026-10-10T09:00:00.000Z",
   eyecatch:{url:"assets/staba.webp"},
   excerpt:"店先の木を青い電球で飾ってくださった店主に、参加のきっかけを伺いました。",
   body:"<p>（記事本文はmicroCMSから配信されます。この記事はレイアウト確認用のサンプルです）</p>"}
];

var SAMPLE_EV = [
  {id:"ev-marche-2027", title:"シバヒロマルシェに出店します", tag:["出店"], date:"2027-03-20T01:00:00.000Z", timeText:"10:00–16:00", place:"町田シバヒロ", mapUrl:"https://maps.google.com/?q=町田シバヒロ",
   eyecatch:{url:"assets/staba.webp"}, excerpt:"募金ブースと、WARMBLUEのグッズ販売。4月2日の青い花火の告知も。",
   body:"<p>町田シバヒロで開かれるマルシェに、WARMBLUEmachidaのブースを出します。募金にご協力いただいた方には、青いリボンをお渡しします。</p><h2>ブースでできること</h2><ul><li>活動への募金</li><li>青い花火・ライトアップのご案内</li><li>実行委員とおしゃべり</li></ul><p>雨天の場合はマルシェの開催判断に従います。</p>"},
  {id:"ev-lightup-2027", title:"市内ブルーライトアップ 点灯", tag:["ライトアップ"], date:"2027-03-27T09:00:00.000Z", timeText:"日没〜21:00（4月2日まで毎晩）", place:"町田駅前ペデストリアンデッキ・原町田大通り・芹ケ谷公園", mapUrl:"",
   eyecatch:{url:"assets/deck.webp"}, excerpt:"町田の街が、1週間だけ青くなります。",
   body:"<p>3月27日から4月2日まで、町田駅前ペデストリアンデッキ、原町田大通り、芹ケ谷公園多目的広場の桜の木をブルーにライトアップします。</p><p>写真を撮ったら <strong>#WARMBLUEmachida</strong> をつけて投稿してください。公式アカウントでご紹介します。</p>"},
  {id:"ev-fireworks-2027", title:"青い花火 2027｜世界自閉症啓発デー", tag:["花火"], date:"2027-04-02T10:30:00.000Z", timeText:"17:00 開場 ／ 19:30 打ち上げ", place:"芹ケ谷公園 多目的広場", mapUrl:"https://maps.google.com/?q=芹ケ谷公園",
   eyecatch:{url:"assets/hanabi_blue.webp"}, excerpt:"夜空に咲く、希望のブルー。キッチンカーとライブステージも。",
   body:"<p>世界自閉症啓発デーの4月2日、芹ケ谷公園から青い花火を打ち上げます。障害のある人もない人も、同じ空を見上げる数分間を。</p><h2>タイムテーブル</h2><ul><li>17:00 開場・キッチンカー営業開始</li><li>18:00 ライブステージ</li><li>19:00 町田市庁舎ブルーライトアップ点灯</li><li>19:30 青い花火 打ち上げ</li></ul><h2>ご来場にあたって</h2><p>入場無料。駐車場はありませんので公共交通機関でお越しください。雨天の場合は4月3日に順延します。</p>"},
  {id:"ev-cleanup-2026", title:"清掃活動（花火の翌朝）", tag:["清掃活動"], date:"2026-04-03T22:00:00.000Z", timeText:"7:00–8:00", place:"芹ケ谷公園", mapUrl:"",
   eyecatch:{url:"assets/sakura_night.webp"}, excerpt:"花火の破片拾い。実行委員と有志のみなさんで。",
   body:"<p>花火の翌朝、公園の破片拾いを行いました。</p>", report:"<p>12名が参加。1時間で公園全体をきれいにできました。ご参加ありがとうございました。</p>"},
  {id:"ev-fireworks-2026", title:"青い花火 2026", tag:["花火"], date:"2026-04-02T10:30:00.000Z", timeText:"19:30 打ち上げ", place:"芹ケ谷公園 多目的広場", mapUrl:"",
   eyecatch:{url:"assets/hanabi_crowd.webp"}, excerpt:"3回目の青い花火。",
   body:"<p>3回目の開催。</p>", report:"<p>約1,500人の方にご来場いただきました。</p>"}
];

/* ---------- API ---------- */
function api(path, params){
  if(!configured){
    var pool = path.indexOf(C.eventEndpoint)===0 ? SAMPLE_EV : SAMPLE;
    return new Promise(function(res){
      if(path.indexOf('/')>=0){ var id=path.split('/')[1]; res(pool.filter(function(a){return a.id===id;})[0]||null); }
      else res({contents:pool.slice(0, (params&&params.limit)||pool.length), totalCount:pool.length});
    });
  }
  var q = Object.keys(params||{}).map(function(k){ return encodeURIComponent(k)+'='+encodeURIComponent(params[k]); }).join('&');
  var url = 'https://'+C.serviceDomain+'.microcms.io/api/v1/'+path+(q?'?'+q:'');
  return fetch(url,{headers:{'X-MICROCMS-API-KEY':C.apiKey}}).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); });
}

/* ---------- helpers ---------- */
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function fmtDate(iso){ if(!iso) return ''; var d=new Date(iso); return d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0'); }
function cat(a){ var c=a.category; if(Array.isArray(c)) c=c[0]; return c||''; }
function img(a, w){
  if(!a.eyecatch||!a.eyecatch.url) return 'assets/sakura_night.webp';
  var u=a.eyecatch.url; return /microcms-assets/.test(u) ? u+'?w='+(w||900)+'&fm=webp&q=80' : u;
}
function card(a, big){
  return '<a class="st-card'+(big?' st-card--big':'')+'" href="story-detail.html#'+encodeURIComponent(a.id)+'">'
    +'<figure class="st-thumb"><img src="'+img(a, big?1200:800)+'" alt="" loading="lazy"></figure>'
    +'<div class="st-body">'
    +'<p class="st-meta"><span class="st-cat">'+esc(cat(a))+'</span><time>'+fmtDate(a.publishedAt)+'</time></p>'
    +'<h3 class="st-ttl">'+esc(a.title)+'</h3>'
    +(a.excerpt?'<p class="st-ex">'+esc(a.excerpt)+'</p>':'')
    +'<span class="btn-line light st-more">READ <i>→</i></span>'
    +'</div></a>';
}
function notice(el, msg){ el.innerHTML='<p class="st-empty">'+esc(msg)+'</p>'; }
function reveal(){ if(window.WB_reveal) window.WB_reveal(); }

/* ---------- 一覧（story.html） ---------- */
var list = document.getElementById('storyList');
if(list){
  var filterWrap=document.getElementById('storyFilter');
  var all=[];
  function render(items){
    if(!items.length){ notice(list,'まだ記事がありません。'); return; }
    list.innerHTML = items.map(function(a,i){ return card(a, i===0); }).join('');
  }
  api(C.endpoint,{limit:50,orders:'-publishedAt'}).then(function(res){
    all=res.contents||[]; render(all);
    if(filterWrap){
      var cats=[]; all.forEach(function(a){ var c=cat(a); if(c&&cats.indexOf(c)<0) cats.push(c); });
      if(cats.length>1){
        filterWrap.innerHTML='<button class="st-f is-on" data-c="">ALL</button>'+cats.map(function(c){return '<button class="st-f" data-c="'+esc(c)+'">'+esc(c)+'</button>';}).join('');
        filterWrap.addEventListener('click',function(e){
          var b=e.target.closest('.st-f'); if(!b) return;
          filterWrap.querySelectorAll('.st-f').forEach(function(x){x.classList.remove('is-on');}); b.classList.add('is-on');
          render(b.dataset.c? all.filter(function(a){return cat(a)===b.dataset.c;}) : all);
        });
      }
    }
    if(!configured) document.getElementById('cmsNotice').hidden=false;
  }).catch(function(){ notice(list,'記事を読み込めませんでした。時間をおいて再度お試しください。'); });
}

/* ---------- 記事（story-detail.html） ---------- */
var art = document.getElementById('storyArticle');
if(art){
  var id = decodeURIComponent((location.hash||'').replace(/^#/,'')) || new URLSearchParams(location.search).get('id') || '';
  var head=document.getElementById('storyHead');
  if(!id){ notice(art,'記事が指定されていません。'); }
  else api(C.endpoint+'/'+id).then(function(a){
    if(!a){ notice(art,'記事が見つかりませんでした。'); return; }
    document.title = a.title+'｜STORY｜WARMBLUEmachida';
    if(head){
      head.querySelector('.ph-bg').style.backgroundImage="url('"+img(a,1600)+"')";
      head.querySelector('.st-cat').textContent=cat(a);
      head.querySelector('time').textContent=fmtDate(a.publishedAt);
      head.querySelector('h1').textContent=a.title;
    }
    art.innerHTML = '<div class="st-prose">'+(a.body||'')+'</div>'
      +'<div class="st-foot"><a class="btn-line dark" href="story.html">← STORY一覧へ</a></div>';
    /* 他の記事 */
    var rel=document.getElementById('storyRelated');
    if(rel) api(C.endpoint,{limit:4,orders:'-publishedAt'}).then(function(res){
      var items=(res.contents||[]).filter(function(x){return x.id!==a.id;}).slice(0,3);
      if(items.length){ rel.hidden=false; rel.querySelector('.st-grid').innerHTML=items.map(function(x){return card(x,false);}).join(''); reveal(); }
    }).catch(function(){});
  }).catch(function(){ notice(art,'記事を読み込めませんでした。'); });
}

/* ---------- EVENT helpers ---------- */
var WD=['日','月','火','水','木','金','土'];
function evDate(a){ return a.date? new Date(a.date) : null; }
function evIsPast(a){ var d=evDate(a); if(!d) return false; var end=new Date(d); end.setHours(23,59,59,999); return end < new Date(); }
function evDayParts(a){ var d=evDate(a); if(!d) return {m:'--',d:'--',w:'',y:''}; return {y:d.getFullYear(),m:String(d.getMonth()+1),d:String(d.getDate()),w:WD[d.getDay()]}; }
function tagOf(a){ var t=a.tag; if(Array.isArray(t)) t=t[0]; return t||''; }
function evCard(a){
  var dp=evDayParts(a), past=evIsPast(a);
  return '<a class="ev-card'+(past?' is-past':'')+'" href="event-detail.html#'+encodeURIComponent(a.id)+'">'
    +'<figure class="ev-thumb"><img src="'+img(a,900)+'" alt="" loading="lazy">'
    +'<span class="ev-date"><b>'+dp.m+'.'+dp.d+'</b><small>'+dp.w+' ／ '+dp.y+'</small></span>'
    +(past?'<span class="ev-done">終了</span>':'')+'</figure>'
    +'<div class="ev-body">'
    +'<p class="st-meta"><span class="st-cat">'+esc(tagOf(a))+'</span>'+(a.timeText?'<span>'+esc(a.timeText)+'</span>':'')+'</p>'
    +'<h3 class="ev-ttl">'+esc(a.title)+'</h3>'
    +(a.place?'<p class="ev-place">'+esc(a.place)+'</p>':'')
    +'</div></a>';
}
function fetchEvents(limit){ return api(C.eventEndpoint,{limit:limit||100,orders:'date'}).then(function(r){ return r.contents||[]; }); }

/* ---------- トップ：次のイベント3件（index.html） ---------- */
var evTeaser=document.getElementById('eventTeaser');
if(evTeaser){
  fetchEvents().then(function(all){
    var up=all.filter(function(a){return !evIsPast(a);});
    var items=up.slice(0,3), ttl=document.getElementById('evTopTitle');
    if(!items.length){
      items=all.filter(evIsPast).sort(function(a,b){return new Date(b.date)-new Date(a.date);}).slice(0,3);
      if(ttl) ttl.textContent='これまでのイベント';
      if(!items.length){ evTeaser.closest('section').hidden=true; return; }
    }
    evTeaser.innerHTML=items.map(evCard).join('');
  }).catch(function(){ evTeaser.closest('section').hidden=true; });
}

/* ---------- 一覧（events.html） ---------- */
var evUp=document.getElementById('eventUpcoming');
if(evUp){
  var evPast=document.getElementById('eventPast');
  fetchEvents().then(function(all){
    var up=all.filter(function(a){return !evIsPast(a);});
    var past=all.filter(evIsPast).sort(function(a,b){return new Date(b.date)-new Date(a.date);});
    evUp.innerHTML = up.length ? up.map(evCard).join('') : '<p class="st-empty">次回の開催が決まり次第、ここでお知らせします。</p>';
    if(evPast){ if(past.length) evPast.innerHTML=past.map(evCard).join(''); else evPast.closest('.ev-block').hidden=true; }
    if(!configured) document.getElementById('cmsNoticeEv').hidden=false;
  }).catch(function(){ notice(evUp,'イベントを読み込めませんでした。'); });
}

/* ---------- 詳細（event-detail.html） ---------- */
var evBody=document.getElementById('eventBody');
if(evBody){
  var id2 = decodeURIComponent((location.hash||'').replace(/^#/,'')) || new URLSearchParams(location.search).get('id') || '';
  var ehead=document.getElementById('eventHead'), einfo=document.getElementById('eventInfo');
  if(!id2){ notice(evBody,'イベントが指定されていません。'); }
  else api(C.eventEndpoint+'/'+id2).then(function(a){
    if(!a){ notice(evBody,'イベントが見つかりませんでした。'); return; }
    var dp=evDayParts(a), past=evIsPast(a);
    document.title = a.title+'｜EVENT｜WARMBLUEmachida';
    ehead.querySelector('.ph-bg').style.backgroundImage="url('"+img(a,1600)+"')";
    ehead.querySelector('.st-cat').textContent=tagOf(a);
    ehead.querySelector('.ev-status').textContent= past?'終了しました':'開催予定';
    ehead.querySelector('h1').textContent=a.title;
    var rows=[
      ['DATE', dp.y+'.'+dp.m+'.'+dp.d+'（'+dp.w+'）'],
      ['TIME', a.timeText||''],
      ['PLACE', a.place ? (a.mapUrl ? '<a href="'+esc(a.mapUrl)+'" target="_blank" rel="noopener">'+esc(a.place)+' ↗</a>' : esc(a.place)) : '']
    ].filter(function(r){return r[1];});
    einfo.innerHTML='<dl>'+rows.map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+(r[0]==='PLACE'?r[1]:esc(r[1]))+'</dd></div>';}).join('')+'</dl>'
      +'<a class="btn-solid ev-cta" href="contact.html#contact">参加・お問い合わせ</a>';
    evBody.innerHTML='<div class="st-prose">'+(a.body||'')+'</div>'
      +(past&&a.report?'<div class="ev-report"><span class="eyebrow">REPORT</span><div class="st-prose">'+a.report+'</div></div>':'')
      +'<div class="st-foot"><a class="btn-line dark" href="events.html">← イベント一覧へ</a></div>';
    var rel=document.getElementById('eventRelated');
    if(rel) fetchEvents().then(function(all){
      var items=all.filter(function(x){return x.id!==a.id && !evIsPast(x);}).slice(0,3);
      if(!items.length) items=all.filter(function(x){return x.id!==a.id;}).slice(-3);
      if(items.length){ rel.innerHTML=items.map(evCard).join(''); rel.closest('section').hidden=false; }
    }).catch(function(){});
  }).catch(function(){ notice(evBody,'イベントを読み込めませんでした。'); });
}

/* ---------- トップの最新3本（index.html） ---------- */
var teaser = document.getElementById('storyTeaser');
if(teaser){
  api(C.endpoint,{limit:3,orders:'-publishedAt'}).then(function(res){
    var items=res.contents||[];
    if(!items.length){ teaser.closest('section').hidden=true; return; }
    teaser.innerHTML=items.map(function(a){return card(a,false);}).join('');
    reveal();
  }).catch(function(){ teaser.closest('section').hidden=true; });
}
})();

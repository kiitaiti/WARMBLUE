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
   3. 「APIキー」から GET 権限のみのキーを発行し、下の2行を書き換える
   ------------------------------------------------------------ */
window.WB_CMS = {
  serviceDomain: "",          // 例: "warmblue-machida"  →  https://warmblue-machida.microcms.io
  apiKey: "",                 // GET のみのAPIキー
  endpoint: "story"
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

/* ---------- API ---------- */
function api(path, params){
  if(!configured){
    return new Promise(function(res){
      if(path.indexOf('/')>=0){ var id=path.split('/')[1]; res(SAMPLE.filter(function(a){return a.id===id;})[0]||null); }
      else res({contents:SAMPLE.slice(0, (params&&params.limit)||SAMPLE.length), totalCount:SAMPLE.length});
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

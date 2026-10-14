# -*- coding: utf-8 -*-
"""WARMBLUEmachida 複数ページサイト ビルドスクリプト
   python3 build.py で index.html ほか 6 ページを生成する"""
import os
OUT = os.path.dirname(os.path.abspath(__file__))

PAGES = [
    ("index.html",    "TOP",      "トップ",        None),
    ("about.html",    "ABOUT",    "活動について",   "assets/committee.webp"),
    ("spots.html",    "SPOTS",    "ブルーライトアップ", "assets/deck.webp"),
    ("schedule.html", "SCHEDULE", "スケジュール",   "assets/hanami.webp"),
    ("gallery.html",  "GALLERY",  "ギャラリー",     "assets/sakura_night.webp"),
    ("join.html",     "JOIN",     "参加・支援",     "assets/hanabi_crowd.webp"),
]
MENU_BG = {"index.html":"assets/sakura_up.webp","about.html":"assets/committee.webp","spots.html":"assets/deck.webp",
           "schedule.html":"assets/hanami.webp","gallery.html":"assets/sakura_night.webp","join.html":"assets/hanabi_crowd.webp"}

def head(title, desc, cur):
    full = "WARMBLUEmachida｜青い光で、人と人をつなぐ。" if cur=="index.html" else f"{title}｜WARMBLUEmachida"
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{full}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/heroposter.webp">
<link rel="icon" type="image/webp" href="assets/emblem.webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+JP:wght@300;400;500;700&family=Shippori+Mincho:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="entering">
<div class="page-fade" aria-hidden="true"></div>
<div class="noise" aria-hidden="true"></div>
"""

def nav(cur):
    gnav = "".join(
        f'<li><a href="{f}"{" aria-current=\"page\"" if f==cur else ""}>{en}</a></li>'
        for f,en,ja,_ in PAGES if f!="index.html")
    menu = "".join(
        f'<li><a href="{f}" data-bg="{MENU_BG[f]}"{" aria-current=\"page\"" if f==cur else ""}><small>{en}</small>{ja}</a></li>'
        for f,en,ja,_ in PAGES)
    return f"""
<div id="cursor" aria-hidden="true"><i class="c-core"></i></div>

<header id="siteHeader" class="site-header">
  <a class="logo" href="index.html" aria-label="WARM BLUE MACHIDA トップへ"><img src="assets/emblem.webp" alt="WARM BLUE MACHIDA"><span class="logo-txt">WARM BLUE <em>MACHIDA</em></span></a>
  <div class="nav-right">
    <ul class="gnav" aria-label="グローバルナビゲーション">{gnav}</ul>
    <button id="motionToggle" type="button" aria-pressed="false" title="アニメーションを減らす">モーションを抑える</button>
    <button id="menuBtn" type="button" aria-expanded="false" aria-controls="menu" aria-label="メニューを開く"><span></span><span></span></button>
  </div>
</header>

<nav id="menu" aria-label="サイト内メニュー">
  <div class="menu-bg" id="menuBg" aria-hidden="true"></div>
  <button id="menuClose" type="button" aria-label="メニューを閉じる">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5 L19 19 M19 5 L5 19"/></svg>
  </button>
  <ul>{menu}</ul>
</nav>

<div id="progress" aria-hidden="true"><i></i></div>

<main>
"""

FOOTER = """
</main>

<footer>
  <div class="foot-aurora" aria-hidden="true"></div>
  <div class="foot-grid">
    <div class="foot-brand">
      <img src="assets/emblem.webp" alt="WARM BLUE MACHIDA">
      <p>世界自閉症啓発デーに合わせて、町田の街を青い光で彩り、自閉症への理解を広げる活動です。</p>
    </div>
    <div class="foot-nav">
      <ul>
        <b>SITE</b>
        <li><a href="index.html">トップ</a></li>
        <li><a href="about.html">活動について</a></li>
        <li><a href="spots.html">ブルーライトアップ</a></li>
        <li><a href="schedule.html">スケジュール</a></li>
        <li><a href="gallery.html">ギャラリー</a></li>
        <li><a href="join.html">参加・支援</a></li>
      </ul>
      <ul>
        <b>SOCIAL</b>
        <li><a href="#" aria-disabled="true">Instagram（準備中）</a></li>
        <li><a href="#" aria-disabled="true">X（準備中）</a></li>
        <li><a href="#" aria-disabled="true">Facebook（準備中）</a></li>
      </ul>
      <ul>
        <b>INFO</b>
        <li><a href="join.html#contact">お問い合わせ</a></li>
        <li><a href="#" aria-disabled="true">プライバシーポリシー（準備中）</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-big" aria-hidden="true">WARMBLUE<br>MACHIDA</div>
  <div class="foot-btm">
    <span>WARMBLUEmachida実行委員会</span>
    <span>© WARMBLUEmachida Executive Committee</span>
  </div>
</footer>

<script src="assets/main.js"></script>
</body>
</html>
"""

def page_head(en, h1, lead, bg, alt):
    return f"""
<section class="page-head" aria-label="{h1}">
  <div class="ph-bg" style="background-image:url('{bg}')" role="img" aria-label="{alt}"></div>
  <div class="ph-ov" aria-hidden="true"></div>
  <div class="ph-inner">
    <div class="crumb"><a href="index.html">HOME</a><span>{en}</span></div>
    <span class="eyebrow">{en}</span>
    <h1>{h1}</h1>
    <p class="ph-lead">{lead}</p>
  </div>
</section>
"""

def cta_band(text, href, label):
    return f"""
<section class="cta-band">
  <div class="cta-glow" aria-hidden="true"></div>
  <div class="cta-in reveal">
    <h2 class="h2">{text}</h2>
    <a class="btn-solid" href="{href}">{label}</a>
  </div>
</section>
"""

# ======================================================== TOP
INDEX = """
<div id="intro" role="presentation">
  <div class="intro-light" aria-hidden="true"></div>
  <div class="intro-logo"><img src="assets/emblem.webp" alt="WARM BLUE MACHIDA"></div>
  <button id="skipIntro" type="button">SKIP</button>
</div>
""", """
<section id="hero" aria-label="メインビジュアル">
  <div class="hero-media">
    <video id="heroVideo" muted loop playsinline preload="auto" poster="assets/heroposter.webp"
      aria-label="芹ケ谷公園の夜空に、青い花火が次々と打ち上がる映像。芝生から大勢の人々が見上げている">
      <source src="assets/hero.mp4" type="video/mp4">
    </video>
  </div>
  <div class="hero-ov" aria-hidden="true"></div>
  <div class="hero-glow" aria-hidden="true"></div>
  <div class="hero-inner">
    <h1 class="hero-logo" id="heroLogo">
      <img src="assets/logo_lockup.webp" alt="WARM BLUE MACHIDA — 青い光で、人と人をつなぐ。">
    </h1>
    <p class="hero-sub">自閉症への理解を、町田から。</p>
  </div>
  <button id="videoToggle" type="button" aria-pressed="false">映像を停止</button>
  <div class="scroll-hint" aria-hidden="true"><span>SCROLL</span><i></i></div>
</section>

<section id="statement">
  <div class="floating-lights" aria-hidden="true">
    <span class="fl" style="width:180px;height:180px;left:8%;top:20%"></span>
    <span class="fl" style="width:120px;height:120px;right:12%;top:55%;animation-delay:-6s"></span>
    <span class="fl" style="width:90px;height:90px;left:30%;bottom:12%;animation-delay:-11s"></span>
  </div>
  <div class="stmt-wrap reveal">
    <h2 class="h2">
      <span class="reveal-line"><span>ひとつの<span class="kw">青い光</span>が、</span></span>
      <span class="reveal-line"><span>街の景色を変えていく。</span></span>
    </h2>
    <div class="body-txt">
      <p>毎年4月2日は、世界自閉症啓発デー。</p>
      <p>WARMBLUEmachidaは、<br>町田の街を青い光で彩りながら、<br>自閉症について知り、考え、<br>人と人が<span class="kw">つながる</span>きっかけをつくる活動です。</p>
      <p>障害がある人も、ない人も。<br>一人ひとりが安心して暮らし、<br>それぞれの色で輝ける街へ。</p>
    </div>
  </div>
</section>

<section id="awareness">
  <div class="aw-grid">
    <div class="reveal">
      <span class="eyebrow">BLUE IS A MESSAGE.</span>
      <div class="aw-num">04.02<small>WORLD AUTISM AWARENESS DAY</small><span class="aw-line" aria-hidden="true"></span></div>
      <div class="aw-body body-txt">
        <h2 class="h2" style="font-size:clamp(24px,3vw,36px);margin-bottom:28px">青には、想いがある。</h2>
        <p>毎年4月2日は「世界自閉症啓発デー」です。</p>
        <p style="margin-top:1.6em">世界各地で、建物やランドマークをブルーに照らし、自閉症への理解を広げる取り組みが行われています。</p>
        <p style="margin-top:1.6em">ブルーは、癒しや希望、そして自閉症への理解を象徴する色です。</p>
        <p style="margin-top:2.4em"><a class="btn-line dark" href="about.html">ABOUT THE PROJECT <i>→</i></a></p>
      </div>
    </div>
    <figure class="aw-photo" id="awPhoto">
      <img src="assets/deck.webp" alt="青い光に包まれた町田駅前ペデストリアンデッキと行き交う人々" loading="lazy">
    </figure>
  </div>
</section>

<section id="about">
  <div class="about-grid">
    <div class="about-head reveal">
      <span class="eyebrow">ABOUT THE PROJECT</span>
      <h2 class="h2">町田の街を、<br>温かいブルーで<br>包む。</h2>
      <div class="about-body body-txt">
        <p>私たちは、自閉症とその周辺の課題について、より多くの人に理解を深めてもらうことを目的に活動する「WARMBLUEmachida実行委員会」です。</p>
        <p style="margin-top:1.8em">2024年、町田市で初めて「WARMBLUEmachida2024」を実施し、多くの皆様からご支援と共感をいただきました。</p>
        <p style="margin-top:2.4em"><a class="btn-line dark" href="about.html">活動について詳しく <i>→</i></a></p>
      </div>
    </div>
    <div class="about-photos reveal">
      <figure class="ph about-p1 clip-reveal">
        <img src="assets/committee.webp" alt="青くライトアップされた桜の木の前に並ぶ、WARMBLUEmachida実行委員会のメンバー" loading="lazy">
        <figcaption class="cap">実行委員会メンバー｜芹ケ谷公園</figcaption>
      </figure>
      <figure class="ph about-p2 clip-reveal" style="transition-delay:.25s">
        <img src="assets/sakura_up.webp" alt="青い光に照らされた夜桜の花びらのクローズアップ" loading="lazy">
        <figcaption class="cap">ブルーに染まる夜桜</figcaption>
      </figure>
    </div>
  </div>
</section>

<section id="future" aria-label="実現したい未来">
  <div class="future-track" id="futureTrack">
    <div class="future-sticky">
      <div class="fscene on" data-scene="0" style="background-image:url('assets/hanga.webp')" role="img" aria-label="夕暮れにブルーライトアップされた国際版画美術館"></div>
      <div class="fscene" data-scene="1" style="background-image:url('assets/deck.webp')" role="img" aria-label="青い光に包まれた町田駅前ペデストリアンデッキ"></div>
      <div class="fscene" data-scene="2" style="background-image:url('assets/sakura_night.webp')" role="img" aria-label="夜の芹ケ谷公園。青くライトアップされた桜とキッチンカー"></div>
      <div class="fscene" data-scene="3" style="background-image:url('assets/hanabi_crowd.webp')" role="img" aria-label="芹ケ谷公園で夜空を見上げる人々と打ち上がる花火"></div>
      <svg class="light-line" id="lightLine" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="lgrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#1E6FFF"/><stop offset=".5" stop-color="#55B7FF"/><stop offset="1" stop-color="#B9E8FF"/>
        </linearGradient></defs>
        <path d="M60,470 C220,380 300,480 430,400 S680,300 940,180"/>
      </svg>
      <div class="future-copy">
        <span class="eyebrow reveal in" style="opacity:1">LIGHT UP THE CITY. LIGHT UP THE FUTURE.</span>
        <h2 class="h2">街を照らすことは、<br>未来を照らすこと。</h2>
        <div class="fbody" id="fbody">
          <p>このプロジェクトでは、町田市内のさまざまな場所をブルーにライトアップし、夜空に青い花火を打ち上げます。</p>
          <p style="margin-top:1.6em">ブルーライトと青い花火を、障害がある人もない人も一緒に楽しみながら、「互いに住みやすく、輝ける街・町田」という希望のメッセージを届けます。</p>
        </div>
      </div>
    </div>
    <div class="spacer" aria-hidden="true"></div>
    <div class="spacer" aria-hidden="true"></div>
    <div class="spacer" aria-hidden="true"></div>
  </div>
</section>

<section id="highlights">
  <div class="hl-head reveal">
    <span class="eyebrow">EXPLORE</span>
    <h2 class="h2">青い光を、<br>もっと近くで。</h2>
  </div>
  <div class="hl-grid reveal">
    <a class="hl-card" href="spots.html">
      <img src="assets/hanami.webp" alt="" loading="lazy">
      <span class="hl-arrow" aria-hidden="true">→</span>
      <span class="b-en">SPOTS</span>
      <span class="hl-ttl">ブルーライトアップ</span>
      <span class="hl-desc">町田のあちこちに灯る、青い光の場所。</span>
    </a>
    <a class="hl-card" href="schedule.html">
      <img src="assets/hanga.webp" alt="" loading="lazy">
      <span class="hl-arrow" aria-hidden="true">→</span>
      <span class="b-en">SCHEDULE</span>
      <span class="hl-ttl">スケジュール</span>
      <span class="hl-desc">開催実績と、これからの予定。</span>
    </a>
    <a class="hl-card" href="gallery.html">
      <img src="assets/hanabi_blue.webp" alt="" loading="lazy">
      <span class="hl-arrow" aria-hidden="true">→</span>
      <span class="b-en">GALLERY</span>
      <span class="hl-ttl">ギャラリー</span>
      <span class="hl-desc">町田に生まれた、青い時間の記録。</span>
    </a>
    <a class="hl-card" href="join.html">
      <img src="assets/hanabi_crowd.webp" alt="" loading="lazy">
      <span class="hl-arrow" aria-hidden="true">→</span>
      <span class="b-en">JOIN</span>
      <span class="hl-ttl">参加・支援</span>
      <span class="hl-desc">あなたの想いも、ひとつの光に。</span>
    </a>
  </div>
</section>

<section id="ending">
  <div class="end-glow" aria-hidden="true"></div>
  <div class="end-spark" aria-hidden="true"></div>
  <div class="end-inner reveal">
    <p class="end-txt">
      <span class="reveal-line"><span>ひとつの光が、誰かの理解につながる。</span></span>
      <span class="reveal-line"><span>ひとつの理解が、街の未来を変えていく。</span></span>
      <span class="reveal-line" style="margin-top:1.6em"><span>青い光で、人と人をつなぐ。</span></span>
    </p>
    <p class="end-logo">WARMBLUE MACHIDA</p>
  </div>
</section>
"""

# ======================================================== ABOUT
ABOUT = page_head("ABOUT","町田の街を、<br>温かいブルーで包む。",
  "WARMBLUEmachida実行委員会の活動と、これまでの歩み。",
  "assets/committee.webp","青くライトアップされた桜の前に並ぶ実行委員会メンバー") + """
<section id="about">
  <div class="about-grid">
    <div class="about-head reveal">
      <span class="eyebrow">WHO WE ARE</span>
      <h2 class="h2">自閉症への理解を、<br>町田から。</h2>
      <div class="about-body body-txt">
        <p>私たちは、自閉症とその周辺の課題について、より多くの人に理解を深めてもらうことを目的に活動する「WARMBLUEmachida実行委員会」です。</p>
        <p style="margin-top:1.8em">2024年、町田市で初めて「WARMBLUEmachida2024」を実施し、多くの皆様からご支援と共感をいただきました。</p>
        <p style="margin-top:1.8em">これからも世界自閉症啓発デーに向けて、自閉症への理解を町田から広げる活動を続けていきます。</p>
      </div>
    </div>
    <div class="about-photos reveal">
      <figure class="ph about-p1 clip-reveal">
        <img src="assets/committee.webp" alt="青くライトアップされた桜の木の前に並ぶ、WARMBLUEmachida実行委員会のメンバー" loading="lazy">
        <figcaption class="cap">実行委員会メンバー｜芹ケ谷公園</figcaption>
      </figure>
      <figure class="ph about-p2 clip-reveal" style="transition-delay:.25s">
        <img src="assets/sakura_up.webp" alt="青い光に照らされた夜桜の花びらのクローズアップ" loading="lazy">
        <figcaption class="cap">ブルーに染まる夜桜</figcaption>
      </figure>
    </div>
  </div>
</section>

<section id="mission">
  <div class="m-wrap">
    <div class="reveal">
      <span class="eyebrow">WHAT WE DO</span>
      <h2 class="h2">3つの光で、<br>街を照らす。</h2>
    </div>
    <div class="m-list reveal">
      <div class="m-card">
        <b>01 — LIGHT UP</b>
        <h3>街をブルーに<br>ライトアップする</h3>
        <p>世界自閉症啓発デーに合わせて、町田市内の公共施設・商業施設・街路を青い光で彩ります。街の景色が変わることで、自閉症について考えるきっかけを生み出します。</p>
      </div>
      <div class="m-card">
        <b>02 — FIREWORKS</b>
        <h3>夜空に青い花火を<br>打ち上げる</h3>
        <p>芹ケ谷公園から打ち上げる青い花火は、WARMBLUEmachidaのシンボル。障害のある人もない人も、同じ空を見上げて同じ時間を共有します。</p>
      </div>
      <div class="m-card">
        <b>03 — AWARENESS</b>
        <h3>知る・考える<br>機会をつくる</h3>
        <p>マルシェやお祭りでの募金活動・啓発イベントを通じて、自閉症への理解を広げます。企業・施設・店舗・団体・地域の皆様との連携を進めています。</p>
      </div>
    </div>
  </div>
</section>

<section id="journey">
  <div class="j-head reveal">
    <span class="eyebrow">OUR JOURNEY</span>
    <h2 class="h2">光は、<br>少しずつ広がっている。</h2>
    <p class="body-txt" style="margin-top:36px;color:rgba(234,245,255,.8)">WARMBLUEmachida2024では、町田市内の商業施設や店舗の皆様にご協力いただき、街のさまざまな場所をブルーにライトアップしました。募金活動や啓発イベントを通じて、多くの方に活動を知っていただくことができました。現在も、企業、施設、店舗、団体、地域の皆様との新しい連携を進めています。</p>
  </div>
  <div class="j-stack">
    <div class="j-item j1 reveal">
      <figure class="ph"><img src="assets/staba.webp" alt="青い電球のイルミネーション越しに見えるコーヒーショップの店先" loading="lazy"></figure>
      <p class="j-cap"><b>COLLABORATION</b>店舗の皆様のご協力による、まちなかのブルーイルミネーション</p>
    </div>
    <div class="j-item j2 reveal">
      <figure class="ph"><img src="assets/hanami.webp" alt="青くライトアップされた満開の桜の下でお花見を楽しむ人々" loading="lazy"></figure>
      <p class="j-cap"><b>SERIGAYA PARK</b>青い桜の下で。障害のある人もない人も、同じ景色を楽しむ時間</p>
    </div>
    <div class="j-item j3 reveal">
      <figure class="ph"><img src="assets/yamayuri.webp" alt="青い光に照らされた蒸気機関車D51" loading="lazy"></figure>
      <p class="j-cap"><b>LIGHT UP</b>まちのシンボルも、ブルーの光に包まれて</p>
    </div>
    <div class="j-item j4 reveal">
      <figure class="ph"><img src="assets/hanga.webp" alt="夕暮れにブルーライトアップされた国際版画美術館" loading="lazy"></figure>
      <p class="j-cap"><b>MUSEUM</b>夕暮れの国際版画美術館に灯る、やわらかなブルー</p>
    </div>
  </div>
</section>
""" + cta_band("青い光を、一緒に灯しませんか。","join.html","参加・支援について")

# ======================================================== SPOTS
SPOTS = page_head("SPOTS","町田のあちこちに、<br>青い光が灯る。",
  "ブルーライトアップの会場と、青い花火の打ち上げ場所をご紹介します。",
  "assets/deck.webp","青い光に包まれた町田駅前ペデストリアンデッキ") + """
<section id="spots">
  <div class="spots-wrap">
    <div>
      <div class="reveal" style="margin-bottom:50px">
        <span class="eyebrow">BLUE SPOTS MAP</span>
        <h2 class="h2">光の場所を、<br>たどる。</h2>
      </div>
      <div class="mapbox reveal" id="mapbox">
        <svg viewBox="0 0 640 480" role="group" aria-label="町田市内のブルーライトアップスポットを示す抽象マップ">
          <path class="map-path" d="M80,380 C160,340 220,350 280,290 C340,230 380,250 440,200 C490,160 500,140 540,110" />
          <g class="spot active" data-spot="0" role="button" tabindex="0" aria-label="町田駅前ペデストリアンデッキ">
            <circle class="halo" cx="90" cy="378" r="16"/><circle class="core" cx="90" cy="378" r="5"/>
            <text x="108" y="384">町田駅前ペデストリアンデッキ</text>
          </g>
          <g class="spot" data-spot="1" role="button" tabindex="0" aria-label="原町田大通り">
            <circle class="halo" cx="275" cy="292" r="16"/><circle class="core" cx="275" cy="292" r="5"/>
            <text x="293" y="298">原町田大通り</text>
          </g>
          <g class="spot" data-spot="2" role="button" tabindex="0" aria-label="芹ケ谷公園">
            <circle class="halo" cx="438" cy="202" r="16"/><circle class="core" cx="438" cy="202" r="5"/>
            <text x="456" y="208">芹ケ谷公園</text>
          </g>
          <g class="spot" data-spot="3" role="button" tabindex="0" aria-label="町田市庁舎">
            <circle class="halo" cx="540" cy="112" r="16"/><circle class="core" cx="540" cy="112" r="5"/>
            <text x="440" y="90">町田市庁舎</text>
          </g>
        </svg>
      </div>
      <p style="margin-top:20px;font-size:11.5px;color:rgba(234,245,255,.45);letter-spacing:.1em">※ 位置関係を抽象化したイメージマップです</p>
    </div>
    <div class="spot-panel reveal" aria-live="polite">
      <figure class="spot-photo"><img id="spotImg" src="assets/deck.webp" alt="青い光に包まれた町田駅前ペデストリアンデッキの屋根と行き交う人々"></figure>
      <h3 class="spot-name" id="spotName">町田駅前ペデストリアンデッキ</h3>
      <p class="spot-desc" id="spotDesc">町田の玄関口。大きな屋根がブルーの光に包まれ、行き交う人々を静かに照らします。</p>
    </div>
  </div>
</section>

<section id="spotlist">
  <div class="sl-grid">
    <article class="sl-card reveal">
      <figure class="ph"><img src="assets/deck.webp" alt="青い光に包まれたペデストリアンデッキ" loading="lazy"></figure>
      <div class="sl-body"><b>SPOT 01</b><h3>町田駅前ペデストリアンデッキ</h3><p>町田の玄関口。大きな屋根がブルーの光に包まれ、行き交う人々を静かに照らします。</p><span class="sl-period">LIGHT UP ｜ 3月下旬 – 4月2日</span></div>
    </article>
    <article class="sl-card reveal">
      <figure class="ph"><img src="assets/staba.webp" alt="青い電球のイルミネーションと店先の灯り" loading="lazy"></figure>
      <div class="sl-body"><b>SPOT 02</b><h3>原町田大通り</h3><p>まちの商店の皆様のご協力で、通りに青い光が連なります。</p><span class="sl-period">LIGHT UP ｜ 3月下旬 – 4月2日</span></div>
    </article>
    <article class="sl-card reveal">
      <figure class="ph"><img src="assets/hanami.webp" alt="青くライトアップされた桜と花見をする人々" loading="lazy"></figure>
      <div class="sl-body"><b>SPOT 03</b><h3>芹ケ谷公園</h3><p>多目的広場の桜の木がブルーに染まり、青い花火の打ち上げ会場にもなります。</p><span class="sl-period">LIGHT UP ＋ FIREWORKS ｜ 4月2日</span></div>
    </article>
    <article class="sl-card reveal">
      <figure class="ph"><div class="nodata">PHOTO — COMING SOON</div></figure>
      <div class="sl-body"><b>SPOT 04</b><h3>町田市庁舎</h3><p>世界自閉症啓発デーの4月2日、市庁舎がブルーにライトアップされます。</p><span class="sl-period">LIGHT UP ｜ 4月2日</span></div>
    </article>
  </div>
</section>

<section id="fireworks">
  <div class="fw-bg" style="background-image:url('assets/hanabi_blue.webp')" role="img" aria-label="夜空に大きく開く青い花火"></div>
  <div class="fw-ov" aria-hidden="true"></div>
  <div class="fw-inner">
    <span class="eyebrow" style="color:var(--light-blue)">BLUE FIREWORKS ｜ SERIGAYA PARK</span>
    <h2 class="h2" id="fwTitle">夜空に咲く、希望のブルー。</h2>
    <div class="fw-body reveal">
      <p>青い花火は、自閉症への理解と、<br>誰もが共に暮らせる街への願いを込めた<br>WARMBLUEmachidaのシンボルです。</p>
      <p style="margin-top:2em">同じ空を見上げる時間が、<br>人と人の心を静かにつないでいきます。</p>
    </div>
  </div>
</section>
<script>
window.SPOT_DATA=[
 {img:'assets/deck.webp',alt:'青い光に包まれた町田駅前ペデストリアンデッキの屋根と行き交う人々',name:'町田駅前ペデストリアンデッキ',desc:'町田の玄関口。大きな屋根がブルーの光に包まれ、行き交う人々を静かに照らします。'},
 {img:'assets/staba.webp',alt:'青い電球のイルミネーションと店先の灯り',name:'原町田大通り',desc:'まちの商店の皆様のご協力で、通りに青い光が連なります。'},
 {img:'assets/hanami.webp',alt:'青くライトアップされた桜と花見をする人々',name:'芹ケ谷公園',desc:'多目的広場の桜の木がブルーに染まり、青い花火の打ち上げ会場にもなります。'},
 {img:'',alt:'',name:'町田市庁舎',desc:'世界自閉症啓発デーの4月2日、市庁舎がブルーにライトアップされます。'}
];
</script>
""" + cta_band("光が灯る日を、確かめる。","schedule.html","スケジュールを見る")

# ======================================================== SCHEDULE
SCHEDULE = page_head("SCHEDULE","光が灯った日々。",
  "これまでの開催記録と、次回に向けた予定をお知らせします。",
  "assets/hanami.webp","青くライトアップされた桜の下でお花見をする人々") + """
<section id="schedule">
  <div class="sch-head reveal">
    <span class="arch-badge">2025年度 開催実績（アーカイブ）</span>
    <span class="eyebrow">ARCHIVE 2025</span>
    <h2 class="h2">2025年度の記録</h2>
    <p class="body-txt" style="margin-top:28px;color:var(--gray)">2025年度に実施したイベントの記録です。最新年度の開催情報は、決まり次第お知らせします。</p>
  </div>
  <div class="sch-list">
    <div class="sch-item reveal">
      <div class="sch-date">3.20<small>MAR 20</small></div>
      <div class="sch-body"><span class="sch-tag">実施済み</span><h3>シバヒロマルシェ</h3><p>募金活動・イベント情報の告知</p></div>
    </div>
    <div class="sch-item reveal">
      <div class="sch-date">3.29–30<small>MAR 29–30</small></div>
      <div class="sch-body"><span class="sch-tag">実施済み</span><h3>町田さくらまつり</h3><p>募金活動・縁日・イベント情報の告知<br>縁日の参加費は活動への募金となります。</p></div>
    </div>
    <div class="sch-item reveal">
      <div class="sch-date">3.29–4.2<small>MAR 29 – APR 2</small></div>
      <div class="sch-body"><span class="sch-tag">実施済み</span><h3>市内ブルーライトアップ</h3><p>町田駅前ペデストリアンデッキ／原町田大通り／芹ケ谷公園 多目的広場の桜の木</p></div>
    </div>
    <div class="sch-item reveal">
      <div class="sch-date">4.2<small>APR 2</small></div>
      <div class="sch-body"><span class="sch-tag">世界自閉症啓発デー</span><h3>町田市庁舎ブルーライトアップ・青い花火</h3><p>町田市庁舎のブルーライトアップ。芹ケ谷公園で青い花火を打ち上げ。</p></div>
    </div>
    <div class="sch-item reveal">
      <div class="sch-date">4.3<small>APR 3</small></div>
      <div class="sch-body"><span class="sch-tag">実施済み</span><h3>清掃活動</h3><p>早朝に花火の破片拾いを実施</p></div>
    </div>
  </div>
</section>

<section class="sch-next">
  <div class="sch-next-in reveal">
    <div>
      <span class="eyebrow">NEXT</span>
      <h2 class="h2" style="font-size:clamp(24px,3.4vw,40px)">次回の開催について</h2>
      <p>次回の開催スケジュールは、決まり次第このページとSNSでお知らせします。協力・協賛のご相談は、随時受け付けています。</p>
    </div>
    <a class="btn-solid" href="join.html#contact">お問い合わせ</a>
  </div>
</section>
""" + cta_band("青い光の場所を、たどる。","spots.html","ブルーライトアップの会場")

# ======================================================== GALLERY
GALLERY = page_head("GALLERY","町田に生まれた、<br>青い時間。",
  "ブルーライトアップと青い花火の記録。写真をクリックすると拡大表示されます。",
  "assets/sakura_night.webp","夜の芹ケ谷公園。青い桜とキッチンカーの灯り") + """
<section id="gallery" class="sub">
  <div class="masonry" id="masonry">
    <button class="m-item" data-cap="青い花火｜芹ケ谷公園"><img src="assets/hanabi_blue.webp" alt="夜空に立ち上る青い花火の光跡" loading="lazy"><span class="m-cap">青い花火｜芹ケ谷公園</span></button>
    <button class="m-item" data-cap="ペデストリアンデッキ"><img src="assets/deck.webp" alt="青い光に包まれたペデストリアンデッキ" loading="lazy"><span class="m-cap">ペデストリアンデッキ</span></button>
    <button class="m-item" data-cap="花火を見上げる人々｜芹ケ谷公園"><img src="assets/hanabi_crowd.webp" alt="公園の芝生から花火を見上げる大勢の人々" loading="lazy"><span class="m-cap">花火を見上げる人々｜芹ケ谷公園</span></button>
    <button class="m-item" data-cap="ブルーに染まる夜桜"><img src="assets/sakura_up.webp" alt="青い光に照らされた桜の花のクローズアップ" loading="lazy"><span class="m-cap">ブルーに染まる夜桜</span></button>
    <button class="m-item" data-cap="青い桜と花見｜芹ケ谷公園"><img src="assets/hanami.webp" alt="青くライトアップされた桜の下で花見をする人々" loading="lazy"><span class="m-cap">青い桜と花見｜芹ケ谷公園</span></button>
    <button class="m-item" data-cap="国際版画美術館"><img src="assets/hanga.webp" alt="夕暮れにブルーライトアップされた国際版画美術館" loading="lazy"><span class="m-cap">国際版画美術館</span></button>
    <button class="m-item" data-cap="まちなかのイルミネーション"><img src="assets/staba.webp" alt="青い電球の並ぶ街路樹と店先" loading="lazy"><span class="m-cap">まちなかのイルミネーション</span></button>
    <button class="m-item" data-cap="実行委員会のメンバー"><img src="assets/committee.webp" alt="青い桜の前に集まった実行委員会メンバーの集合写真" loading="lazy"><span class="m-cap">実行委員会のメンバー</span></button>
    <button class="m-item" data-cap="青いやまゆり号（D51）"><img src="assets/yamayuri.webp" alt="青い光に照らされた蒸気機関車D51" loading="lazy"><span class="m-cap">青いやまゆり号（D51）</span></button>
    <button class="m-item" data-cap="夜の芹ケ谷公園"><img src="assets/sakura_night.webp" alt="青い桜とキッチンカーの灯り" loading="lazy"><span class="m-cap">夜の芹ケ谷公園</span></button>
  </div>
</section>

<div id="lightbox" role="dialog" aria-modal="true" aria-label="写真の拡大表示">
  <button id="lbClose" type="button">CLOSE ×</button>
  <img id="lbImg" src="" alt="">
  <p id="lbCap"></p>
</div>
""" + cta_band("次は、あなたもこの景色の中に。","join.html","参加・支援について")

# ======================================================== JOIN
JOIN = page_head("JOIN","あなたの想いも、<br>ひとつの光になる。",
  "参加のかたちはさまざまです。できることから、一緒に。",
  "assets/hanabi_crowd.webp","芹ケ谷公園で夜空を見上げる人々と打ち上がる花火") + """
<section id="join" class="sub">
  <div class="bento reveal">
    <a class="b-card b-main" href="schedule.html" style="background-image:url('assets/hanabi_crowd.webp')">
      <span class="glow" aria-hidden="true"></span>
      <span class="b-en">EVENT</span>
      <span class="b-ttl">イベントへ参加する</span>
      <span class="b-desc">ブルーライトアップや青い花火を、同じ空の下で。どなたでもご参加いただけます。最新の開催情報はスケジュールをご覧ください。</span>
      <span class="b-arrow" aria-hidden="true">→</span>
    </a>
    <a class="b-card b2" href="gallery.html">
      <span class="glow" aria-hidden="true"></span>
      <span class="b-en">SHARE</span>
      <span class="b-ttl">活動を知る・広める</span>
      <span class="b-desc">SNSでのシェアや、身近な人への一言も、大切な参加のかたちです。</span>
      <span class="b-arrow" aria-hidden="true">→</span>
    </a>
    <a class="b-card b3" href="#contact">
      <span class="glow" aria-hidden="true"></span>
      <span class="b-en">VOLUNTEER</span>
      <span class="b-ttl">ボランティアとして参加する</span>
      <span class="b-desc">イベント運営や設営、清掃活動など、一緒に活動してくださる方を歓迎します。</span>
      <span class="b-arrow" aria-hidden="true">→</span>
    </a>
    <a class="b-card b4" href="#contact">
      <span class="glow" aria-hidden="true"></span>
      <span class="b-en">PARTNER</span>
      <span class="b-ttl">協力企業・団体として</span>
      <span class="b-desc">ライトアップへのご協力や協賛など、企業・施設・団体の皆様との連携を進めています。</span>
      <span class="b-arrow" aria-hidden="true">→</span>
    </a>
    <a class="b-card b5" href="#contact">
      <span class="glow" aria-hidden="true"></span>
      <span class="b-en">DONATE</span>
      <span class="b-ttl">寄付で支援する</span>
      <span class="b-desc">いただいたご支援は、ライトアップや花火など、活動の運営に活用させていただきます。</span>
      <span class="b-arrow" aria-hidden="true">→</span>
    </a>
    <a class="b-card b6" href="#contact">
      <span class="glow" aria-hidden="true"></span>
      <span class="b-en">CONTACT</span>
      <span class="b-ttl">お問い合わせ</span>
      <span class="b-desc">取材、協力のご相談など、お気軽にご連絡ください。</span>
      <span class="b-arrow" aria-hidden="true">→</span>
    </a>
  </div>
</section>

<section id="contact">
  <div class="ct-grid">
    <div class="reveal">
      <span class="eyebrow">CONTACT</span>
      <h2 class="h2">お問い合わせ</h2>
      <p class="body-txt" style="margin-top:28px;color:var(--gray)">取材のご依頼、ライトアップへのご協力、協賛・寄付、ボランティア参加のご相談など、お気軽にご連絡ください。</p>
    </div>
    <div class="reveal">
      <ul class="ct-list">
        <li><b>ORGANIZATION</b><span>WARMBLUEmachida実行委員会</span></li>
        <li><b>AREA</b><span>東京都町田市</span></li>
        <li><b>FORM</b><span>お問い合わせフォーム（準備中）</span></li>
        <li><b>SOCIAL</b><span>Instagram／X／Facebook（準備中）</span></li>
      </ul>
      <p class="ct-note">※ 連絡先・フォームは公開準備中です。公開まで今しばらくお待ちください。</p>
    </div>
  </div>
</section>
"""

CONTENT = {
  "index.html": (INDEX[0], INDEX[1], "WARMBLUEmachidaは、世界自閉症啓発デーに合わせて、町田の街をブルーライトと青い花火で彩り、自閉症への理解を広げる活動です。"),
  "about.html": ("", ABOUT, "WARMBLUEmachida実行委員会の活動内容と、これまでの歩みをご紹介します。"),
  "spots.html": ("", SPOTS, "町田市内のブルーライトアップ会場と、芹ケ谷公園の青い花火についてご紹介します。"),
  "schedule.html": ("", SCHEDULE, "WARMBLUEmachidaの開催スケジュールと、これまでの開催記録。"),
  "gallery.html": ("", GALLERY, "ブルーライトアップと青い花火の写真ギャラリー。町田に生まれた青い時間の記録。"),
  "join.html": ("", JOIN, "イベント参加、ボランティア、協賛・寄付、お問い合わせ。WARMBLUEmachidaへの参加・支援のご案内。"),
}

for f,en,ja,_ in PAGES:
    pre, body, desc = CONTENT[f]
    html = head(ja, desc, f) + pre + nav(f) + body + FOOTER
    with open(os.path.join(OUT,f),"w",encoding="utf-8") as fp: fp.write(html)
    print("wrote", f, len(html))

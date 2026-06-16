/* ============================================================================
   IELTSwithMOURAD — Training engine
   Vocabulary Games + Task 1 Paraphrasing. Vanilla JS, no libraries.
   Self-contained module exposing window.MMWA_TRAINING. Reads its content from
   window.MMWA_VOCAB / window.MMWA_PARA (training-data.js). Progress is saved in
   localStorage PER USER (keyed by the user id passed in from the host app), so
   it never touches the platform's existing data.
   ============================================================================ */
(function () {
  "use strict";

  var LS_KEY = "mmwa.training.v1";

  /* ---- 7-level badge system (by total points) ---------------------------- */
  var LEVELS = [
    { name: "Word Starter", min: 0 },
    { name: "IELTS Builder", min: 100 },
    { name: "Academic Explorer", min: 250 },
    { name: "Band 6 Booster", min: 500 },
    { name: "Band 7 Vocabulary Builder", min: 800 },
    { name: "C1 Word Master", min: 1200 },
    { name: "Writing Champion", min: 1800 }
  ];
  function levelInfo(points) {
    points = points || 0;
    var idx = 0;
    for (var i = 0; i < LEVELS.length; i++) if (points >= LEVELS[i].min) idx = i;
    var cur = LEVELS[idx], nxt = LEVELS[idx + 1] || null;
    var pct = nxt ? Math.round(((points - cur.min) / (nxt.min - cur.min)) * 100) : 100;
    return { idx: idx, name: cur.name, min: cur.min, next: nxt ? nxt.min : null, pct: Math.max(0, Math.min(100, pct)) };
  }

  /* ---- storage (per user) ------------------------------------------------ */
  function loadAll() { try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}") || {}; } catch (e) { return {}; } }
  function saveAll(o) { try { localStorage.setItem(LS_KEY, JSON.stringify(o)); } catch (e) {} }
  function modeStat() { return { best: 0, bestStreak: 0, answered: 0, correct: 0 }; }
  function blankP() {
    return {
      totalPoints: 0, mute: false, level: 0,
      vocab: { points: 0, lastPlayed: "", missed: {}, modes: { synonym: modeStat(), spelling: modeStat(), upgrade: modeStat() } },
      para: { points: 0, lastPlayed: "", weak: {}, modes: { choose: modeStat(), fix: modeStat(), build: modeStat(), transform: modeStat(), write: modeStat() } }
    };
  }
  function getP(uid) {
    var all = loadAll(), p = all[uid];
    if (!p) p = blankP();
    // forward-compatible: fill any missing keys
    var b = blankP();
    p.vocab = Object.assign({}, b.vocab, p.vocab); p.vocab.modes = Object.assign({}, b.vocab.modes, p.vocab.modes);
    p.para = Object.assign({}, b.para, p.para); p.para.modes = Object.assign({}, b.para.modes, p.para.modes);
    if (typeof p.totalPoints !== "number") p.totalPoints = 0;
    if (typeof p.mute !== "boolean") p.mute = false;
    return p;
  }
  function persist(uid, p) { var all = loadAll(); all[uid] = p; saveAll(all); }

  /* ---- small utils ------------------------------------------------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function todayISO() { return new Date().toISOString().slice(0, 10); }
  function accuracy(m) { var ans = 0, cor = 0; for (var k in m) { ans += m[k].answered; cor += m[k].correct; } return ans ? Math.round((cor / ans) * 100) : 0; }
  function topKeys(obj, n) { return Object.keys(obj || {}).sort(function (a, b) { return obj[b] - obj[a]; }).slice(0, n); }
  // host-scoped lookup by class (never by global id) so the hidden sibling view can never be matched
  function gid(name) {
    if (!S || !S.host) return null;
    var sel = { tgFb: ".tg-fb", tgDrop: ".tg-drop", tgBank: ".tg-bank", tgHint: ".tg-hintbox", tgSpell: ".tg-spellinput" }[name];
    return sel ? S.host.querySelector(sel) : null;
  }

  /* ---- sound (Web Audio API, lazy) -------------------------------------- */
  var actx = null;
  function ctx() { if (actx) return actx; try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } return actx; }
  function beep(freq, dur, type, vol, when) {
    var c = ctx(); if (!c) return;
    try {
      var o = c.createOscillator(), g = c.createGain(), t0 = c.currentTime + (when || 0);
      o.type = type || "sine"; o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) {}
  }
  function sfx(name, muted) {
    if (muted) return;
    if (name === "correct") { beep(660, 0.12, "sine", 0.12, 0); beep(880, 0.14, "sine", 0.11, 0.08); }
    else if (name === "wrong") { beep(180, 0.18, "sine", 0.10, 0); }
    else if (name === "streak") { beep(660, 0.08, "triangle", 0.10, 0); beep(880, 0.08, "triangle", 0.10, 0.07); beep(1175, 0.12, "triangle", 0.10, 0.14); }
    else if (name === "level") { [523, 659, 784, 1047].forEach(function (f, i) { beep(f, 0.14, "triangle", 0.11, i * 0.1); }); }
    else if (name === "done") { [659, 784, 988].forEach(function (f, i) { beep(f, 0.16, "sine", 0.11, i * 0.12); }); }
  }

  /* ---- celebration (lightweight CSS confetti + toast) -------------------- */
  function celebrate(host, msg) {
    var layer = host.querySelector(".tg-celebrate");
    if (!layer) { layer = document.createElement("div"); layer.className = "tg-celebrate"; host.appendChild(layer); }
    var cols = ["#c9a961", "#e3c987", "#3f78b5", "#5f9e6e", "#faf6ef"];
    var frag = "";
    for (var i = 0; i < 40; i++) {
      var c = cols[i % cols.length], left = Math.random() * 100, delay = (Math.random() * 0.3).toFixed(2),
        dur = (1.6 + Math.random() * 1.2).toFixed(2), rot = Math.floor(Math.random() * 360), size = 6 + Math.floor(Math.random() * 7);
      frag += '<span class="tg-conf" style="left:' + left + '%;width:' + size + 'px;height:' + (size + 3) + 'px;background:' + c + ';animation-delay:' + delay + 's;animation-duration:' + dur + 's;transform:rotate(' + rot + 'deg)"></span>';
    }
    if (msg) frag += '<div class="tg-toast">' + esc(msg) + '</div>';
    layer.innerHTML = frag;
    clearTimeout(layer.__t); layer.__t = setTimeout(function () { layer.innerHTML = ""; }, 2600);
  }

  /* ---- active session ---------------------------------------------------- */
  var S = null;

  /* ======================= VOCABULARY GAMES ============================== */
  var VOCAB_MODES = [
    { key: "synonym", icon: "🔁", title: "Synonym or Opposite", blurb: "Choose the correct synonym or antonym for academic words." },
    { key: "spelling", icon: "🔊", title: "Spelling Dictation", blurb: "Listen to a word and type the correct spelling." },
    { key: "upgrade", icon: "⬆️", title: "Upgrade the Word", blurb: "Swap a simple phrase for a stronger C1 academic one." }
  ];
  var PARA_MODES = [
    { key: "choose", icon: "✅", title: "Choose the Best Paraphrase", blurb: "Pick the strongest introduction from four options." },
    { key: "fix", icon: "🛠️", title: "Fix the Weak Paraphrase", blurb: "Spot the problem and rewrite it accurately." },
    { key: "build", icon: "🧩", title: "Build the Introduction", blurb: "Arrange the parts into a correct introduction." },
    { key: "transform", icon: "🔄", title: "Paraphrase the Data", blurb: "Transform common Task 1 wording the academic way." },
    { key: "write", icon: "✍️", title: "Write Your Own", blurb: "Write your own introduction, then reveal a model." }
  ];

  function bankFor(section, mode) {
    if (section === "vocab") return (window.MMWA_VOCAB || {})[mode] || [];
    return (window.MMWA_PARA || {})[mode] || [];
  }

  /* ---- dashboard header (shared) ---------------------------------------- */
  function dashHTML(section, p) {
    var lv = levelInfo(p.totalPoints);
    var sec = section === "vocab" ? p.vocab : p.para;
    var acc = accuracy(sec.modes);
    var best = 0; for (var k in sec.modes) best = Math.max(best, sec.modes[k].bestStreak);
    return '<div class="tg-dash">' +
      '<div class="tg-stat"><span class="tg-stat-n">' + (sec.points || 0) + '</span><span class="tg-stat-l">Points</span></div>' +
      '<div class="tg-stat"><span class="tg-stat-n">' + acc + '%</span><span class="tg-stat-l">Accuracy</span></div>' +
      '<div class="tg-stat"><span class="tg-stat-n">' + best + '</span><span class="tg-stat-l">Best streak</span></div>' +
      '<div class="tg-stat tg-stat-lvl"><span class="tg-stat-n">Lv ' + (lv.idx + 1) + '</span><span class="tg-stat-l">' + esc(lv.name) + '</span>' +
        '<span class="tg-lvlbar"><i style="width:' + lv.pct + '%"></i></span></div>' +
      '<button class="tg-mute" data-mute aria-label="Toggle sound">' + (p.mute ? "🔇 Muted" : "🔊 Sound") + '</button>' +
      '</div>';
  }

  function modeCards(section, modes, p) {
    var sec = section === "vocab" ? p.vocab : p.para;
    return '<div class="tg-modes">' + modes.map(function (m) {
      var st = sec.modes[m.key] || modeStat();
      return '<button class="tg-mode" data-start="' + m.key + '">' +
        '<span class="tg-mode-ic">' + m.icon + '</span>' +
        '<span class="tg-mode-t">' + esc(m.title) + '</span>' +
        '<span class="tg-mode-b">' + esc(m.blurb) + '</span>' +
        '<span class="tg-mode-meta">Best ' + (st.best || 0) + ' pts · ' + (st.answered ? Math.round((st.correct / st.answered) * 100) : 0) + '% acc</span>' +
        '</button>';
    }).join("") + '</div>';
  }

  function reviewHTML(section, p) {
    if (section === "vocab") {
      var miss = topKeys(p.vocab.missed, 12);
      if (!miss.length) return '<div class="tg-review"><h3 class="tg-h3">Words to review</h3><p class="tg-empty">No tricky words yet — play a round to build your review list.</p></div>';
      return '<div class="tg-review"><h3 class="tg-h3">Words to review</h3><div class="tg-chips">' +
        miss.map(function (w) { return '<span class="tg-chip tg-chip-warn">' + esc(w) + '</span>'; }).join("") + '</div>' +
        '<button class="btn btn-ghost btn-sm" data-start="review">Retry weak words</button></div>';
    }
    var weak = topKeys(p.para.weak, 8);
    if (!weak.length) return '<div class="tg-review"><h3 class="tg-h3">Weak areas to review</h3><p class="tg-empty">No weak areas flagged yet — complete a few activities to see targets here.</p></div>';
    return '<div class="tg-review"><h3 class="tg-h3">Weak paraphrasing areas</h3><div class="tg-chips">' +
      weak.map(function (a) { return '<span class="tg-chip tg-chip-warn">' + esc(a) + '</span>'; }).join("") + '</div></div>';
  }

  function vocabHome(host, user) {
    var p = getP(user.id);
    host.innerHTML =
      '<div class="view-head"><p class="view-eyebrow">Interactive vocabulary training</p>' +
      '<h2 class="view-title">Vocabulary Games</h2>' +
      '<p class="view-sub">Build the Task 1 and Task 2 vocabulary that lifts your band — through fast, friendly challenges.</p></div>' +
      '<div class="tg-wrap" data-section="vocab">' +
      dashHTML("vocab", p) + modeCards("vocab", VOCAB_MODES, p) + reviewHTML("vocab", p) +
      '</div>';
    bind(host, "vocab", user);
  }
  function paraHome(host, user) {
    var p = getP(user.id);
    host.innerHTML =
      '<div class="view-head"><p class="view-eyebrow">Task 1 micro-skills training</p>' +
      '<h2 class="view-title">Task 1 Paraphrasing</h2>' +
      '<p class="view-sub">Stop copying the question. Learn to write accurate, natural Task 1 introductions — one drill at a time.</p></div>' +
      '<div class="tg-wrap" data-section="para">' +
      dashHTML("para", p) +
      paraTraining() +
      '<h3 class="tg-h3 tg-h3-lead">Interactive practice</h3>' +
      modeCards("para", PARA_MODES, p) + reviewHTML("para", p) +
      '</div>';
    bind(host, "para", user);
  }

  /* ---- paraphrasing training (static teaching cards) -------------------- */
  function paraTraining() {
    return '<div class="tg-train">' +
      card("What is paraphrasing?", "Paraphrasing means rewriting the task question in different words while keeping exactly the same meaning. Never copy the prompt. Your introduction should be one short, clear, accurate sentence — no overview detail, no opinions, no reasons.") +
      card("Introduction formula", "<b>The</b> chart / graph / table / map / process diagram <b>+</b> shows / illustrates / compares <b>+</b> what the data is about <b>+</b> where / when (if given).<br><span class='tg-eg'>“The line graph illustrates…”, “The table compares…”, “The diagram shows the process by which…”.</span>") +
      card("Useful reporting verbs", "shows · illustrates · compares · presents · gives information about · provides data on · demonstrates · outlines · depicts.<br><span class='tg-warn-t'>Avoid:</span> “talks about”, “says”, and don't overuse “depicts” or odd, over-complex verbs.") +
      card("Common patterns", "“the percentage of…” → “the proportion of…” · “from 2010 to 2020” → “between 2010 and 2020” · “in three countries” → “across three countries” · “the amount of water used” → “water consumption” · “how coffee is produced” → “the process of coffee production”.") +
      card("What not to do", "Don't change the meaning · don't add opinions · don't explain reasons · don't include overview detail · don't copy the full question · don't use informal language · don't use words you don't fully understand · don't make the sentence too long.") +
      '<div class="tg-train-card tg-vs"><h4>Weak vs strong</h4>' +
        '<p class="tg-vs-row"><span class="tg-vs-bad">Weak</span> The chart below shows the percentage of households with internet access in three countries between 2010 and 2020. <em>(copied word-for-word)</em></p>' +
        '<p class="tg-vs-row"><span class="tg-vs-good">Strong</span> The line graph illustrates the proportion of households that had internet access in three countries from 2010 to 2020.</p>' +
      '</div>' +
      '</div>';
  }
  function card(t, body) { return '<div class="tg-train-card"><h4>' + esc(t) + '</h4><p>' + body + '</p></div>'; }

  /* ======================= GAME / PRACTICE FLOW ========================== */
  function startSet(host, section, mode, user) {
    var items;
    if (mode === "review") { // vocab: replay missed words across modes
      var p = getP(user.id), missWords = Object.keys(p.vocab.missed || {});
      var pool = ["synonym", "upgrade"].reduce(function (acc, m) { return acc.concat(bankFor("vocab", m)); }, []);
      items = pool.filter(function (it) { return missWords.indexOf(it.word || it.simpleExpression) >= 0; });
      if (!items.length) items = shuffle(bankFor("vocab", "synonym")).slice(0, 10);
      mode = items[0] && items[0].mode ? "mixed" : "synonym";
    } else {
      items = shuffle(bankFor(section, mode));
    }
    var setSize = Math.min(items.length, mode === "transform" ? 15 : (section === "para" && (mode === "fix" || mode === "write") ? 8 : 12));
    S = { host: host, section: section, mode: mode, user: user, items: items.slice(0, setSize),
      i: 0, score: 0, streak: 0, bestStreak: 0, answered: 0, correct: 0, awarded: false, qStart: 0, hintUsed: false };
    renderQ();
  }

  function modeTitle(section, mode) {
    var list = section === "vocab" ? VOCAB_MODES : PARA_MODES, key = mode === "mixed" ? "review" : mode;
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i].title;
    return "Review";
  }

  function hudHTML() {
    return '<div class="tg-hud">' +
      '<button class="btn btn-ghost btn-sm" data-home>&larr; Back</button>' +
      '<span class="tg-hud-mid">' + esc(modeTitle(S.section, S.mode)) + ' · ' + (S.i + 1) + '/' + S.items.length + '</span>' +
      '<span class="tg-hud-r"><span class="tg-pill-score">' + S.score + ' pts</span>' +
      '<span class="tg-pill-streak' + (S.streak >= 3 ? ' on' : '') + '">🔥 ' + S.streak + '</span></span>' +
      '</div>' +
      '<div class="tg-prog"><i style="width:' + Math.round((S.i / S.items.length) * 100) + '%"></i></div>';
  }

  function renderQ() {
    if (S.i >= S.items.length) return finish();
    var it = S.items[S.i]; S.awarded = false; S.hintUsed = false; S.qStart = Date.now();
    var k = it.mode;
    if (k === "synonym" || k === "opposite" || k === "upgrade" || k === "choose_best" || k === "transform") return mcqScreen(it);
    if (k === "spelling") return spellScreen(it);
    if (k === "build_intro") return buildScreen(it);
    if (k === "fix_weak" || k === "write_own") return rewriteScreen(it);
    // mixed/review fallback
    return mcqScreen(it);
  }

  /* ---- MCQ (synonym/opposite/upgrade/choose/transform) ------------------ */
  function mcqScreen(it) {
    var prompt, sub = "";
    if (it.mode === "synonym" || it.mode === "opposite") { prompt = it.word; sub = it.question; }
    else if (it.mode === "upgrade") { prompt = it.simpleExpression; sub = it.question; }
    else if (it.mode === "choose_best") { prompt = it.originalPrompt; sub = "Choose the best paraphrased introduction. (" + it.visualType + ")"; }
    else if (it.mode === "transform") { prompt = it.from; sub = "Choose the best academic paraphrase."; }
    var opts = shuffle(it.options);
    S.host.innerHTML = '<div class="tg-game">' + hudHTML() +
      '<div class="tg-q">' +
      (sub ? '<p class="tg-q-sub">' + esc(sub) + '</p>' : "") +
      '<p class="tg-q-word' + (it.mode === "choose_best" ? ' tg-q-long' : '') + '">' + esc(prompt) + '</p>' +
      '<div class="tg-opts">' + opts.map(function (o, n) {
        return '<button class="tg-opt" data-opt="' + n + '" data-val="' + esc(o) + '">' + esc(o) + '</button>';
      }).join("") + '</div>' +
      '<div class="tg-fb"></div>' +
      '</div></div>';
  }

  /* ---- spelling --------------------------------------------------------- */
  function speak(word) {
    try {
      if (!("speechSynthesis" in window)) return false;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(word);
      u.lang = "en-GB"; u.rate = 0.85;
      window.speechSynthesis.speak(u); return true;
    } catch (e) { return false; }
  }
  function spellScreen(it) {
    var hasTTS = ("speechSynthesis" in window);
    S.host.innerHTML = '<div class="tg-game">' + hudHTML() +
      '<div class="tg-q">' +
      '<p class="tg-q-sub">' + esc(it.clue || "Spell the word you hear.") + ' (' + esc(it.category) + ')</p>' +
      '<div class="tg-speak"><button class="tg-speak-btn" data-speak aria-label="Play word">🔊</button>' +
      '<button class="btn btn-ghost btn-sm" data-replay>Replay</button>' +
      '<button class="btn btn-ghost btn-sm" data-hint>Hint</button></div>' +
      (hasTTS ? '' : '<p class="tg-fallback">Audio isn\'t available in this browser — use the <b>Hint</b> button to reveal the first letter and length.</p>') +
      '<div class="tg-hintbox"></div>' +
      '<input type="text" class="tg-input tg-spellinput" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the word…">' +
      '<div class="tg-q-actions"><button class="btn btn-gold" data-submit-spell>Submit</button></div>' +
      '<div class="tg-fb"></div>' +
      '</div></div>';
    setTimeout(function () { speak(it.word); var el = gid("tgSpell"); if (el) el.focus(); }, 120);
  }

  /* ---- build intro (click to arrange) ----------------------------------- */
  function buildScreen(it) {
    var chips = shuffle(it.correctOrder.concat(it.distractors));
    S._build = { chosen: [], order: it.correctOrder, model: it.modelSentence };
    S.host.innerHTML = '<div class="tg-game">' + hudHTML() +
      '<div class="tg-q">' +
      '<p class="tg-q-sub">Tap the parts in the correct order to build the introduction. (' + esc(it.visualType) + ')</p>' +
      '<p class="tg-q-orig">Prompt: <em>' + esc(it.originalPrompt) + '</em></p>' +
      '<div class="tg-drop"><span class="tg-drop-ph">Your sentence appears here…</span></div>' +
      '<div class="tg-bank">' + chips.map(function (c, n) {
        return '<button class="tg-tile" data-tile="' + esc(c) + '">' + esc(c) + '</button>';
      }).join("") + '</div>' +
      '<div class="tg-q-actions"><button class="btn btn-gold" data-check-build>Check</button>' +
      '<button class="btn btn-ghost btn-sm" data-reset-build>Reset</button></div>' +
      '<div class="tg-fb"></div>' +
      '</div></div>';
  }
  function paintBuild() {
    var drop = gid("tgDrop"); if (!drop) return;
    var ch = S._build.chosen;
    drop.innerHTML = ch.length ? ch.map(function (c, n) { return '<button class="tg-tile in" data-unpick="' + n + '">' + esc(c) + '</button>'; }).join("")
      : '<span class="tg-drop-ph">Your sentence appears here…</span>';
  }

  /* ---- rewrite (fix / write) ------------------------------------------- */
  function rewriteScreen(it) {
    var isFix = it.mode === "fix_weak";
    S.host.innerHTML = '<div class="tg-game">' + hudHTML() +
      '<div class="tg-q">' +
      '<p class="tg-q-sub">' + (isFix ? "Rewrite the weak paraphrase so it is accurate and academic." : "Write your own paraphrased introduction.") + ' (' + esc(it.visualType) + ')</p>' +
      '<p class="tg-q-orig">Prompt: <em>' + esc(it.originalPrompt || it.prompt) + '</em></p>' +
      (isFix ? '<p class="tg-weak">✗ Weak: ' + esc(it.weakParaphrase) + '</p>' : "") +
      (!isFix && it.structure ? '<div class="tg-help"><b>Structure:</b><ul>' + it.structure.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>' : "") +
      (!isFix && it.synonyms ? '<div class="tg-help"><b>Useful swaps:</b> ' + it.synonyms.map(esc).join(" · ") + '</div>' : "") +
      '<textarea class="tg-input tg-ta" rows="3" placeholder="Write your introduction…"></textarea>' +
      '<div class="tg-q-actions"><button class="btn btn-gold" data-reveal>Reveal model &amp; check</button></div>' +
      '<div class="tg-fb"></div>' +
      '</div></div>';
  }

  /* ---- grading + scoring ------------------------------------------------ */
  function award(base, correct, opts) {
    opts = opts || {};
    var p = getP(S.user.id);
    var muted = p.mute;
    var pts = 0, msg = "", milestone = false;
    if (correct) {
      pts = base;
      if (S.hintUsed) pts = Math.round(pts / 2);
      if (opts.speed && (Date.now() - S.qStart) < 5000) pts += 5;
      S.streak++; S.correct++; S.bestStreak = Math.max(S.bestStreak, S.streak);
      // streak bonuses
      if (S.streak === 3) pts += 10;
      if (S.streak === 5) { pts += (S.section === "para" ? 25 : 20); milestone = true; }
      if (S.streak === 10) { pts += 50; milestone = true; }
      sfx(S.streak >= 5 ? "streak" : "correct", muted);
      msg = "+" + pts + (S.streak >= 3 ? "  ·  🔥 " + S.streak + " streak!" : "");
    } else {
      S.streak = 0; sfx("wrong", muted);
    }
    S.answered++; S.score += pts;
    // persist running stats
    var sec = S.section === "vocab" ? p.vocab : p.para;
    var modeKey = S.mode === "mixed" ? (S.items[S.i].mode === "upgrade" ? "upgrade" : "synonym") : S.mode;
    if (!sec.modes[modeKey]) sec.modes[modeKey] = modeStat();
    sec.modes[modeKey].answered++; if (correct) sec.modes[modeKey].correct++;
    sec.modes[modeKey].bestStreak = Math.max(sec.modes[modeKey].bestStreak, S.bestStreak);
    sec.points += pts; p.totalPoints += pts;
    sec.lastPlayed = todayISO();
    // missed words / weak areas
    if (!correct) {
      if (S.section === "vocab") { var w = opts.word; if (w) p.vocab.missed[w] = (p.vocab.missed[w] || 0) + 1; }
      else if (opts.weak) opts.weak.forEach(function (a) { p.para.weak[a] = (p.para.weak[a] || 0) + 1; });
    }
    // level up?
    var beforeLv = p.level || 0, nowLv = levelInfo(p.totalPoints).idx;
    var leveled = nowLv > beforeLv; p.level = nowLv;
    persist(S.user.id, p);
    if (leveled) { sfx("level", muted); celebrate(S.host, "Level up! " + LEVELS[nowLv].name); }
    else if (milestone) celebrate(S.host, S.streak + " in a row! Keep going");
    return { pts: pts, msg: msg, leveled: leveled };
  }

  function showFeedback(correct, explanationHTML, scoreMsg) {
    var fb = gid("tgFb"); if (!fb) return;
    fb.className = "tg-fb " + (correct ? "ok" : "no");
    fb.innerHTML = '<p class="tg-fb-head">' + (correct ? "✓ Correct " : "✗ Not quite ") +
      (scoreMsg ? '<span class="tg-fb-pts">' + esc(scoreMsg) + '</span>' : "") + '</p>' +
      (explanationHTML ? '<p class="tg-fb-exp">' + explanationHTML + '</p>' : "") +
      '<button class="btn btn-gold btn-sm" data-next>' + (S.i + 1 >= S.items.length ? "Finish" : "Next →") + '</button>';
    // refresh HUD score/streak
    var hud = S.host.querySelector(".tg-hud-r");
    if (hud) hud.innerHTML = '<span class="tg-pill-score">' + S.score + ' pts</span><span class="tg-pill-streak' + (S.streak >= 3 ? ' on' : '') + '">🔥 ' + S.streak + '</span>';
  }

  function finish() {
    var p = getP(S.user.id), sec = S.section === "vocab" ? p.vocab : p.para;
    var mk = S.mode === "mixed" ? "review" : S.mode;
    if (sec.modes[S.mode]) sec.modes[S.mode].best = Math.max(sec.modes[S.mode].best || 0, S.score);
    persist(S.user.id, p);
    var acc = S.answered ? Math.round((S.correct / S.answered) * 100) : 0;
    sfx("done", p.mute); celebrate(S.host, "Set complete! " + S.score + " points");
    S.host.innerHTML = '<div class="tg-game"><div class="tg-done">' +
      '<div class="tg-done-coin">🎉</div>' +
      '<h2 class="tg-done-h">Set complete</h2>' +
      '<div class="tg-done-stats">' +
      '<div><b>' + S.score + '</b><span>points</span></div>' +
      '<div><b>' + S.correct + '/' + S.answered + '</b><span>correct</span></div>' +
      '<div><b>' + acc + '%</b><span>accuracy</span></div>' +
      '<div><b>' + S.bestStreak + '</b><span>best streak</span></div>' +
      '</div>' +
      '<div class="tg-done-actions"><button class="btn btn-gold" data-again="' + esc(S.mode === "mixed" ? "review" : S.mode) + '">Play again</button>' +
      '<button class="btn btn-ghost" data-home>Back to menu</button></div>' +
      '</div></div>';
  }

  /* ---- delegated event binding ------------------------------------------ */
  function bind(host, section, user) {
    if (host.__mmwaBound) { host.__mmwaSection = section; host.__mmwaUser = user; return; }
    host.__mmwaBound = true; host.__mmwaSection = section; host.__mmwaUser = user;

    host.addEventListener("click", function (e) {
      var sec = host.__mmwaSection, usr = host.__mmwaUser, t = e.target, b;

      if (t.closest("[data-mute]")) { var p = getP(usr.id); p.mute = !p.mute; persist(usr.id, p); if (sec === "vocab") vocabHome(host, usr); else paraHome(host, usr); return; }
      if ((b = t.closest("[data-start]"))) { ctx(); startSet(host, sec, b.getAttribute("data-start"), usr); return; }
      if (t.closest("[data-home]")) { if (sec === "vocab") vocabHome(host, usr); else paraHome(host, usr); return; }
      if ((b = t.closest("[data-again]"))) { startSet(host, sec, b.getAttribute("data-again"), usr); return; }
      if (t.closest("[data-next]")) { S.i++; renderQ(); return; }
      if (!S) return;

      // MCQ
      if ((b = t.closest("[data-opt]"))) {
        if (S.awarded) return; S.awarded = true;
        var it = S.items[S.i], chosen = b.getAttribute("data-val"), correctVal = it.answer, ok = chosen === correctVal;
        $allIn(host, ".tg-opt").forEach(function (o) {
          o.disabled = true;
          if (o.getAttribute("data-val") === correctVal) o.classList.add("right");
          else if (o === b) o.classList.add("wrong");
        });
        var base = it.mode === "choose_best" ? 10 : (it.mode === "transform" ? 10 : 10);
        var word = it.word || it.simpleExpression;
        var weak = it.mode === "choose_best" ? ["wrong paraphrase choice"] : null;
        var res = award(base, ok, { speed: it.mode === "synonym" || it.mode === "opposite" || it.mode === "upgrade", word: word, weak: weak });
        var exp = it.explanation ? esc(it.explanation) : (it.note ? esc(it.note) : "");
        if (!ok) exp = '<b>' + esc(correctVal) + '</b>' + (exp ? " — " + exp : "");
        showFeedback(ok, exp, res.msg);
        return;
      }

      // spelling
      if (t.closest("[data-speak]") || t.closest("[data-replay]")) { speak(S.items[S.i].word); return; }
      if (t.closest("[data-hint]")) {
        S.hintUsed = true; var it2 = S.items[S.i], hb = gid("tgHint");
        if (hb) hb.innerHTML = 'Starts with <b>' + esc(it2.word[0].toUpperCase()) + '</b> · ' + it2.word.length + ' letters <span class="tg-hint-note">(half points)</span>';
        return;
      }
      if (t.closest("[data-submit-spell]")) {
        if (S.awarded) return; var it3 = S.items[S.i], inp = gid("tgSpell");
        var val = (inp ? inp.value : "").trim().toLowerCase(), ok3 = val === it3.word.toLowerCase();
        S.awarded = true;
        var res3 = award(10, ok3, { word: it3.word });
        showFeedback(ok3, ok3 ? esc(it3.clue) : 'Correct spelling: <b>' + esc(it3.word) + '</b>', res3.msg);
        return;
      }

      // build intro
      if ((b = t.closest("[data-tile]"))) {
        if (S.awarded) return; S._build.chosen.push(b.getAttribute("data-tile")); b.remove(); paintBuild(); return;
      }
      if ((b = t.closest("[data-unpick]"))) {
        if (S.awarded) return; var idx = +b.getAttribute("data-unpick"); var val2 = S._build.chosen[idx];
        S._build.chosen.splice(idx, 1); paintBuild();
        var bank = gid("tgBank"); if (bank) { var btn = document.createElement("button"); btn.className = "tg-tile"; btn.setAttribute("data-tile", val2); btn.textContent = val2; bank.appendChild(btn); }
        return;
      }
      if (t.closest("[data-reset-build]")) {
        if (S.awarded) return; var it4 = S.items[S.i]; S._build.chosen = []; buildScreen(it4); return;
      }
      if (t.closest("[data-check-build]")) {
        if (S.awarded) return; S.awarded = true;
        var it5 = S.items[S.i], ok5 = S._build.chosen.join(" ") === it5.correctOrder.join(" ");
        var res5 = award(15, ok5, { weak: ok5 ? null : ["sentence order / extra words"] });
        showFeedback(ok5, 'Model: <b>' + esc(it5.modelSentence) + '</b>', res5.msg);
        return;
      }

      // rewrite (fix / write)
      if (t.closest("[data-reveal]")) {
        if (S.awarded) return; S.awarded = true;
        var it6 = S.items[S.i], isFix = it6.mode === "fix_weak";
        var base6 = isFix ? 10 : 20;
        var res6 = award(base6, true, { weak: isFix ? it6.problemTypes : null }); // completion-scored
        var html = '<b>Model:</b> ' + esc(it6.modelAnswer || it6.model);
        if (it6.checklist) html += '<ul class="tg-ck">' + it6.checklist.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + '</ul>';
        if (isFix && it6.problemTypes) html += '<p class="tg-prob">Watch for: ' + it6.problemTypes.map(esc).join(", ") + '</p>';
        showFeedback(true, html, res6.msg ? "+" + res6.pts + " (completed)" : "+" + res6.pts);
        return;
      }
    });

    host.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || !S) return;
      if (e.target.classList && e.target.classList.contains("tg-spellinput")) { e.preventDefault(); var sb = host.querySelector("[data-submit-spell]"); if (sb && !S.awarded) sb.click(); }
    });
  }
  function $allIn(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  /* ======================= DASHBOARD SUMMARIES ========================== */
  function nextRec(p) {
    var v = accuracy(p.vocab.modes), a = accuracy(p.para.modes);
    if ((p.vocab.points || 0) === 0) return "Try the Synonym or Opposite game to begin.";
    if (v < 70) return "Review weak words in Vocabulary Games.";
    if ((p.para.points || 0) === 0) return "Start Task 1 Paraphrasing — Choose the Best.";
    if (a < 70) return "Practise Fix the Weak Paraphrase.";
    return "Try Write Your Own to consolidate.";
  }

  function studentSummaryHTML(user) {
    if (!user) return "";
    var p = getP(user.id), lv = levelInfo(p.totalPoints);
    if (p.totalPoints === 0) {
      return '<section class="dash-block"><h3 class="block-title">Training studio</h3>' +
        '<div class="panel glass-panel pad insight"><p>Build IELTS vocabulary and paraphrasing skills through games. ' +
        '<button class="linkbtn" data-nav="vocab">Vocabulary Games</button> · ' +
        '<button class="linkbtn" data-nav="paraphrase">Task 1 Paraphrasing</button></p></div></section>';
    }
    var vbest = 0, abest = 0, k;
    for (k in p.vocab.modes) vbest = Math.max(vbest, p.vocab.modes[k].bestStreak);
    for (k in p.para.modes) abest = Math.max(abest, p.para.modes[k].bestStreak);
    var miss = topKeys(p.vocab.missed, 6), weak = topKeys(p.para.weak, 4);
    return '<section class="dash-block"><h3 class="block-title">Training studio · ' + esc(lv.name) + '</h3>' +
      '<div class="tg-mini">' +
      '<div class="tg-mini-card"><span class="tg-mini-n">' + p.totalPoints + '</span><span>Total points</span></div>' +
      '<div class="tg-mini-card"><span class="tg-mini-n">' + accuracy(p.vocab.modes) + '%</span><span>Vocab accuracy</span></div>' +
      '<div class="tg-mini-card"><span class="tg-mini-n">' + accuracy(p.para.modes) + '%</span><span>Paraphrase accuracy</span></div>' +
      '<div class="tg-mini-card"><span class="tg-mini-n">' + Math.max(vbest, abest) + '</span><span>Best streak</span></div>' +
      '</div>' +
      '<div class="panel glass-panel pad insight">' +
      (miss.length ? '<p><strong>Words to review:</strong> ' + miss.map(esc).join(", ") + '</p>' : "") +
      (weak.length ? '<p><strong>Paraphrasing focus:</strong> ' + weak.map(esc).join(", ") + '</p>' : "") +
      '<p><strong>Next improvement target:</strong> ' + esc(nextRec(p)) + '</p>' +
      '<div class="ws-actions"><button class="btn btn-gold btn-sm" data-nav="vocab">Play Vocabulary Games</button>' +
      '<button class="btn btn-navy btn-sm" data-nav="paraphrase">Practise Paraphrasing</button></div></div></section>';
  }

  function teacherCardsHTML(students) {
    students = students || [];
    var all = loadAll(), rows = students.filter(function (s) { return all[s.id]; });
    if (!rows.length) {
      return '<section class="dash-block"><h3 class="block-title">Vocabulary &amp; paraphrasing analytics</h3>' +
        '<div class="panel glass-panel pad insight"><p class="empty-note">No training activity yet. Once students play the games or practise paraphrasing, their progress appears here.</p></div></section>';
    }
    function inter(p) {
      var v = accuracy(p.vocab.modes), a = accuracy(p.para.modes);
      var copyFlag = (p.para.weak && (p.para.weak["copied prompt"] || p.para.weak["wrong paraphrase choice"]) || 0) > 1;
      if (p.vocab.points && v < 60) return "Review core Task 1/2 vocabulary";
      if (copyFlag) return "Coach reporting verbs / avoid copying";
      if (p.para.points && a < 60) return "Practise fixing weak paraphrases";
      if (!p.para.points) return "Introduce paraphrasing drills";
      return "On track — extend with Write Your Own";
    }
    var body = rows.map(function (s) {
      var p = getP(s.id), lv = levelInfo(p.totalPoints), miss = topKeys(p.vocab.missed, 3);
      return '<tr><td>' + esc(s.name) + '</td>' +
        '<td class="num">' + p.totalPoints + '</td>' +
        '<td>Lv ' + (lv.idx + 1) + '</td>' +
        '<td class="num">' + accuracy(p.vocab.modes) + '%</td>' +
        '<td class="num">' + accuracy(p.para.modes) + '%</td>' +
        '<td>' + (miss.length ? esc(miss.join(", ")) : "—") + '</td>' +
        '<td>' + esc((p.vocab.lastPlayed || p.para.lastPlayed) || "—") + '</td>' +
        '<td>' + esc(inter(p)) + '</td></tr>';
    }).join("");
    return '<section class="dash-block"><h3 class="block-title">Vocabulary &amp; paraphrasing analytics</h3>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th>Student</th><th class="num">Points</th><th>Level</th><th class="num">Vocab acc</th><th class="num">Para acc</th><th>Top missed</th><th>Last active</th><th>Suggested focus</th>' +
      '</tr></thead><tbody>' + body + '</tbody></table></div></section>';
  }

  /* ======================= PUBLIC API ==================================== */
  window.MMWA_TRAINING = {
    renderVocab: function (host, user) { if (host && user) vocabHome(host, user); },
    renderParaphrase: function (host, user) { if (host && user) paraHome(host, user); },
    studentSummaryHTML: studentSummaryHTML,
    teacherCardsHTML: teacherCardsHTML
  };
})();

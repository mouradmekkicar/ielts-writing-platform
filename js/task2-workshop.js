/* ============================================================================
   IELTSwithMOURAD — Task 2 Workshop · ENGINE
   Part of the Mourad Mekki Teacher Toolkit.
   Self-contained module exposing window.MMWA_T2_WORKSHOP. Reads content from
   window.IWM_T2W_DATA (task2-workshop-data.js). All helpers are IIFE-local, so
   nothing collides with the host platform (esc, el, $, showView, state, …).
   Progress is saved in localStorage PER USER, under a key that never touches
   the platform's own keys: "mmwa.task2Workshop.v1.<userId>".
   Public API:
     render(host, user, role)  -> build the workshop into a platform view
     printSummary()            -> print the certificate-style session summary
     printModelPack()          -> print the current Model Essay Pack
     reset()                   -> wipe this user's workshop progress
   ============================================================================ */
(function () {
  "use strict";

  var DATA = window.IWM_T2W_DATA || {};
  var SECTIONS = DATA.SECTIONS || [], WARMUP = DATA.WARMUP || [], LENS = DATA.LENS || [],
      TYPES = DATA.TYPES || {}, TYPE_PROMPTS = DATA.TYPE_PROMPTS || [], LAYOUTS = DATA.LAYOUTS || {},
      INTRO = DATA.INTRO || {}, PEEL_ORDER = DATA.PEEL_ORDER || {}, PEEL_MISSING = DATA.PEEL_MISSING || {},
      PEEL_EXPAND = DATA.PEEL_EXPAND || {}, COHESION = DATA.COHESION || [], CONC = DATA.CONC || {},
      LAYERS = DATA.LAYERS || [], ESSAYS = DATA.ESSAYS || [], UPGRADES = DATA.UPGRADES || [];

  var LAYER_NAME = {}; LAYERS.forEach(function (l) { LAYER_NAME[l.id] = l.name; });

  /* ---- runtime / instance state ---- */
  var S = { host: null, wrap: null, user: null, role: "student", builtFor: null,
            current: "warmup", clinicIdx: 0, timerInt: null, running: false, flashEl: null };

  var STORE_PREFIX = "mmwa.task2Workshop.v1.";
  var state = { completed: {}, answers: {}, scores: {}, focus: {}, exit: {}, clinic: {}, elapsed: 0 };

  function normUid(u) {
    if (typeof u === "string") return u.trim().toLowerCase().replace(/\s+/g, "_") || "guest";
    u = u || {};
    return String(u.id || u.key || u.name || "guest").trim().toLowerCase().replace(/\s+/g, "_") || "guest";
  }
  function userId() { return normUid(S.user); }
  function storeKey() { return STORE_PREFIX + userId(); }
  function blankState() { return { completed: {}, answers: {}, scores: {}, focus: {}, exit: {}, clinic: {}, elapsed: 0 }; }
  function loadState() {
    state = blankState();
    try { var raw = localStorage.getItem(storeKey()); if (raw) state = Object.assign(state, JSON.parse(raw)); }
    catch (e) { /* file:// or storage blocked — session only */ }
    if (!state.clinic) state.clinic = {};
  }
  function saveState() { try { localStorage.setItem(storeKey(), JSON.stringify(state)); } catch (e) {} }

  /* ---- host-scoped helpers (never touch the global DOM by accident) ---- */
  function $(s, r) { return (r || S.host || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || S.host || document).querySelectorAll(s)); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function wordCount(t) { var m = (t || "").trim().match(/\S+/g); return m ? m.length : 0; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function escAttr(s) { return esc(s).replace(/"/g, "&quot;"); }

  /* ---- feedback / progress ---- */
  var FB = { strong: "fb-strong", almost: "fb-almost", needs: "fb-needs", warn: "fb-warn", upgrade: "fb-upgrade" };
  var FBNAME = { strong: "Strong", almost: "Almost Band 7", needs: "Needs Development", warn: "Examiner Warning", upgrade: "Upgrade Suggestion" };
  function showFeedback(node, kind, msg) {
    node.className = "feedback show " + FB[kind];
    node.innerHTML = '<span class="fb-label">' + FBNAME[kind] + "</span><div>" + msg + "</div>";
  }
  function markComplete(id) { if (!state.completed[id]) { state.completed[id] = true; saveState(); updateProgress(); } }
  function updateProgress() {
    var total = SECTIONS.length || 1;
    var done = SECTIONS.filter(function (s) { return state.completed[s.id]; }).length;
    var fill = $("#t2wProgressFill"); if (fill) fill.style.width = (done / total * 100) + "%";
    SECTIONS.forEach(function (s) {
      var nav = $("#t2wnav-" + s.id);
      if (nav) nav.classList.toggle("done", !!state.completed[s.id]);
    });
  }

  /* =====================================================================
     WIDGETS
     ===================================================================== */
  function mcq(key, data, onAns) {
    var wrap = el("div", "mcq");
    var opts = el("div", "opts");
    data.opts.forEach(function (o, i) {
      var b = el("button", "opt");
      b.innerHTML = '<span class="badge">' + String.fromCharCode(65 + i) + "</span><span>" + o + "</span>";
      b.addEventListener("click", function () {
        if (b.classList.contains("locked")) return;
        $$(".opt", opts).forEach(function (x) { x.classList.add("locked"); });
        var correct = i === data.ans;
        b.classList.add(correct ? "correct" : "wrong");
        if (!correct) { opts.children[data.ans].classList.add("correct"); }
        $$(".opt", opts).forEach(function (x, xi) { if (xi !== i && xi !== data.ans) x.classList.add("dim"); });
        var fb = wrap.querySelector(".feedback");
        showFeedback(fb, correct ? "strong" : "needs", (correct ? "Correct. " : "Not quite. ") + data.ex);
        state.answers[key] = { i: i, correct: correct }; saveState();
        if (onAns) onAns(correct);
      });
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
    wrap.appendChild(el("div", "feedback"));
    return wrap;
  }

  function orderer(key, blocks, onDone) {
    var correctRoles = blocks.map(function (b) { return b.role; });
    var wrap = el("div", "order-wrap");
    var zone = el("div", "order-zone");
    var bankCol = el("div", "order-col", "<h4>Paragraph blocks (click in order)</h4>");
    var slotCol = el("div", "order-col", "<h4>Your essay structure</h4>");
    var bank = el("div", "bank");
    var slots = el("div", "slots");
    var emptyHint = el("div", "empty-hint", "Click blocks on the left to place them here in order.");
    slots.appendChild(emptyHint);
    var order = [];
    var data = shuffle(blocks.map(function (b, i) { return Object.assign({}, b, { oid: i }); }));
    function refresh() { emptyHint.style.display = order.length ? "none" : "block"; }
    data.forEach(function (b) {
      var btn = el("button", "block");
      btn.innerHTML = '<span class="blk-role">' + b.role + '</span><span class="blk-text">' + b.text + "</span>";
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        btn.disabled = true; btn.style.display = "none";
        order.push(b);
        var slot = el("button", "block");
        slot.innerHTML = '<span class="slot-idx">' + order.length + '</span><span class="blk-role">' + b.role + '</span><span class="blk-text">' + b.text + "</span>";
        slot.addEventListener("click", function () {
          var idx = order.indexOf(b); if (idx > -1) order.splice(idx, 1);
          slot.remove(); btn.disabled = false; btn.style.display = "";
          $$(".slot-idx", slots).forEach(function (s, si) { s.textContent = si + 1; });
          wrap.querySelector(".feedback").className = "feedback";
          refresh();
        });
        slots.appendChild(slot); refresh();
      });
      bank.appendChild(btn);
    });
    bankCol.appendChild(bank); slotCol.appendChild(slots);
    zone.appendChild(bankCol); zone.appendChild(slotCol);
    wrap.appendChild(zone);

    var row = el("div", "btn-row");
    var check = el("button", "btn solid", "Check structure");
    var reset = el("button", "btn outline", "Reset blocks");
    row.appendChild(check); row.appendChild(reset);
    wrap.appendChild(row);
    wrap.appendChild(el("div", "feedback"));

    check.addEventListener("click", function () {
      var fb = wrap.querySelector(".feedback");
      if (order.length < blocks.length) { showFeedback(fb, "needs", "Place all " + blocks.length + " blocks before checking."); return; }
      var ok = true;
      $$(".slots .block", wrap).forEach(function (s, i) {
        var good = order[i].role === correctRoles[i];
        s.classList.toggle("ok", good); s.classList.toggle("bad", !good);
        if (!good) ok = false;
      });
      if (ok) { showFeedback(fb, "strong", "Correct order. That is the examiner-approved layout."); state.answers[key] = true; saveState(); if (onDone) onDone(); }
      else { showFeedback(fb, "warn", "The sequence isn\u2019t right yet. Intro always opens; the conclusion always closes. Reorder the body blocks and check again."); }
    });
    reset.addEventListener("click", function () {
      order.length = 0; slots.innerHTML = ""; slots.appendChild(emptyHint);
      $$(".block", bank).forEach(function (b) { b.disabled = false; b.style.display = ""; });
      wrap.querySelector(".feedback").className = "feedback"; refresh();
    });
    return wrap;
  }

  function writeTask(key, cfg) {
    var wrap = el("div", "write-task");
    if (cfg.prompt) wrap.appendChild(el("div", "prompt-box", cfg.prompt));
    var ta = el("textarea", "write-box");
    ta.placeholder = cfg.placeholder || "Type your answer here\u2026";
    ta.value = (state.answers[key] && state.answers[key].text) || "";
    wrap.appendChild(ta);
    var meta = el("div", "write-meta");
    var wc = el("span", "wc", "Words: <b>0</b>");
    meta.appendChild(wc);
    if (cfg.bestEligible) {
      var star = el("button", "btn ghost", "\u2605 Mark as my best sentence");
      star.addEventListener("click", function () {
        var t = ta.value.trim(); if (!t) { return; }
        state.exit.best = t; saveState();
        star.textContent = "\u2605 Saved as best sentence"; star.classList.remove("ghost"); star.classList.add("gold");
        setTimeout(function () { star.textContent = "\u2605 Mark as my best sentence"; star.classList.add("ghost"); star.classList.remove("gold"); }, 1800);
      });
      meta.appendChild(star);
    }
    wrap.appendChild(meta);
    function updateWC() {
      var n = wordCount(ta.value);
      wc.innerHTML = "Words: <b>" + n + "</b>" + (cfg.range ? (" &nbsp;\u00b7&nbsp; target " + cfg.range[0] + "\u2013" + cfg.range[1]) : "");
      wc.classList.remove("good", "over");
      if (cfg.range) { if (n >= cfg.range[0] && n <= cfg.range[1]) wc.classList.add("good"); else if (n > cfg.range[1]) wc.classList.add("over"); }
    }
    ta.addEventListener("input", function () { updateWC(); state.answers[key] = { text: ta.value }; saveState(); markComplete(cfg.section); });
    updateWC();

    if (cfg.tags) {
      var rub = el("div", "rubric");
      cfg.tags.forEach(function (t) {
        var lab = el("label");
        var cb = el("input"); cb.type = "checkbox";
        var sp = el("span", null, t);
        lab.appendChild(cb); lab.appendChild(sp);
        cb.addEventListener("change", function () { lab.classList.toggle("checked", cb.checked); });
        rub.appendChild(lab);
      });
      wrap.appendChild(el("div", null, '<div style="margin-top:16px;font-weight:700;color:var(--t2w-navy)">Self-check \u2014 tick what your answer includes:</div>'));
      wrap.appendChild(rub);
    }
    var row = el("div", "btn-row");
    var showModel = el("button", "btn gold", "Show stronger model");
    var compare = el("button", "btn outline", "Compare with mine");
    row.appendChild(showModel); if (cfg.model) row.appendChild(compare);
    wrap.appendChild(row);

    var model = el("div", "model-reveal");
    model.innerHTML = '<h4>Band 7+ model</h4><div class="model-text">' + (cfg.model || "") + "</div>" +
      (cfg.tags ? '<div style="margin-top:10px">' + cfg.tags.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + "</div>" : "");
    wrap.appendChild(model);

    showModel.addEventListener("click", function () {
      model.classList.toggle("show");
      showModel.textContent = model.classList.contains("show") ? "Hide model" : "Show stronger model";
    });
    compare.addEventListener("click", function () {
      model.classList.add("show"); showModel.textContent = "Hide model";
      var fb = wrap.querySelector(".cmp-fb") || (function () { var f = el("div", "feedback cmp-fb"); wrap.appendChild(f); return f; })();
      var mine = ta.value.trim();
      if (!mine) { showFeedback(fb, "needs", "Write your answer first, then compare it line-by-line with the model above against the self-check list."); return; }
      showFeedback(fb, "upgrade", "Compare against the model: does yours commit to a position, give one specific reason, stay academic, and control grammar? Tick every box on the self-check before moving on.");
    });
    return wrap;
  }

  function teacherNote(html) {
    var t = el("div", "teacher-note");
    var head = el("button", "tn-head", '<span class="gicon">\uD83C\uDF93</span> Teacher notes \u2014 tap to expand');
    var body = el("div", "tn-body", html); body.style.display = "none";
    head.addEventListener("click", function () { var open = body.style.display === "none"; body.style.display = open ? "block" : "none"; head.classList.toggle("force-open", open); });
    t.appendChild(head); t.appendChild(body);
    return t;
  }

  function sectionShell(meta, introText) {
    var s = el("section", "lesson-section"); s.id = "t2wsec-" + meta.id; s.dataset.id = meta.id;
    var head = el("div", "sec-head");
    head.innerHTML = '<div><span class="sec-eyebrow">Stage ' + meta.n + " of " + SECTIONS.length + "</span><h2>" + meta.name + "</h2></div>" +
      '<div class="sec-time-badge"><b>' + meta.time.replace(" min", "") + "</b><span>minutes</span></div>";
    s.appendChild(head);
    if (introText) s.appendChild(el("p", "sec-intro", introText));
    return s;
  }

  /* =====================================================================
     STAGE BUILDERS  (ported verbatim from the standalone workshop;
     only DOM ids renamed to the t2w* namespace)
     ===================================================================== */
  function buildWarmup(){
    var m=SECTIONS[0];
    var s=sectionShell(m,'A fast 7-question diagnostic. Answer first, then read the feedback \u2014 this builds today\u2019s personal focus list.');
    s.appendChild(teacherNote('<ul><li>Share the screen and let the student answer aloud <em>before</em> clicking. Ask \u201cwhy?\u201d each time.</li><li>Don\u2019t teach yet \u2014 just diagnose. Note which focus areas turn red.</li><li class="say">Say: \u201cDon\u2019t worry about being right. I\u2019m mapping what we\u2019ll sharpen today.\u201d</li></ul>'));
    var answered=0;
    WARMUP.forEach(function(w,i){
      var c=el('div','card');
      c.appendChild(el('h3',null,'<span class="qnum">'+(i+1)+'</span> '+w.q));
      c.appendChild(el('div','pillrow','<span class="pill">Focus: '+w.focus+'</span>'));
      c.appendChild(mcq('warmup-'+i,w,function(correct){
        state.focus[w.focus]=correct?'solid':'focus';saveState();
        answered++;
        if(answered>=WARMUP.length){markComplete('warmup');profile.classList.add('show');renderProfile();}
      }));
      s.appendChild(c);
    });
    var profWrap=el('div','card profile-wrap');profWrap.id='warm-profile';
    profWrap.innerHTML='<h3>Today\u2019s Focus Areas</h3><p class="muted">Green = already solid \u00b7 Red = sharpen this in the next 80 minutes.</p>';
    var profile=el('div','profile-wrap');profile.id='profile-inner';
    var profileGrid=el('div','profile');profile.appendChild(profileGrid);
    profWrap.appendChild(profile);
    s.appendChild(profWrap);
    function renderProfile(){
      profileGrid.innerHTML='';
      WARMUP.forEach(function(w){
        var st=state.focus[w.focus];if(!st)return;
        var pf=el('div','pf '+st);
        pf.innerHTML='<div class="pf-area">'+w.focus+'</div><span class="pf-state">'+(st==='solid'?'Solid':'Focus today')+'</span>';
        profileGrid.appendChild(pf);
      });
    }
    if(WARMUP.every(function(w,i){return state.answers['warmup-'+i];})){profile.classList.add('show');renderProfile();}
    return s;
  }

  function buildLens(){
    var m=SECTIONS[1];
    var s=sectionShell(m,'The examiner\u2019s lens. Each criterion is worth 25% \u2014 and a clear Band 7 needs consistency across all four. Click a pillar to see the Band 6 \u2192 Band 7 jump, then take the mini-check.');
    s.appendChild(teacherNote('<ul><li>Ask the student to predict the Band 6\u21927 difference <em>before</em> opening each card.</li><li>Anchor the maths: (6+7+6+7)/4 = 6.5. One weak pillar drags everything down.</li><li class="say">Say: \u201cBand 6 <em>presents</em> ideas. Band 7 <em>extends and supports</em> them. That\u2019s the whole game.\u201d</li></ul>'));
    var calc=el('div','callout note');
    calc.innerHTML='<span class="ic">\uD83E\uDDEE</span><div><b>The maths of a clear 7:</b> scores are averaged across TR, CC, LR, GRA. (6 + 7 + 6 + 7) \u00f7 4 = 6.5. You need consistency across <b>all four</b> to secure a 7.</div>';
    s.appendChild(calc);
    var grid=el('div','lens-grid');
    LENS.forEach(function(L,i){
      var card=el('div','lens-card');
      var head=el('button','lens-head','<span class="abbr">'+L.abbr+'</span>'+L.name+'<span class="chev">\u25be</span>');
      var body=el('div','lens-body');
      var row=el('div','band-row');
      row.innerHTML='<div class="band-box band-6"><div class="bb-l">Band 6 does</div>'+L.b6+'</div>'+
                    '<div class="band-box band-7"><div class="bb-l">Band 7 does</div>'+L.b7+'</div>';
      body.appendChild(row);
      body.appendChild(el('div',null,'<div style="font-weight:700;color:var(--t2w-navy);margin:6px 0 8px">Mini-check: '+L.q+'</div>'));
      body.appendChild(mcq('lens-'+i,L,function(){if($$('.lens-card.answered',grid).length+1>=LENS.length)markComplete('lens');card.classList.add('answered');}));
      head.addEventListener('click',function(){card.classList.toggle('open');});
      card.appendChild(head);card.appendChild(body);grid.appendChild(card);
    });
    s.appendChild(grid);
    s.addEventListener('click',function(){if(LENS.every(function(L,i){return state.answers['lens-'+i];}))markComplete('lens');});
    return s;
  }

  function buildTypes(){
    var m=SECTIONS[2];
    var s=sectionShell(m,'Identify the essay type from the instruction words \u2014 that single decision drives your whole structure. Some prompts are traps. Aim for 12+ correct.');
    s.appendChild(teacherNote('<ul><li>Show the prompt, hide the structure. Ask: \u201cWhich instruction words tell you the type?\u201d</li><li>Watch the traps: Opinion vs Discussion, and \u201cpositive or negative?\u201d (Direct) vs agree/disagree (Opinion).</li><li class="say">Push: \u201cWhy is this an opinion essay and not a discussion essay?\u201d</li></ul>'));
    var scoreWrap=el('div','flex-between');
    var pill=el('span','score-pill','Score <b id="t2wTypeScore">0</b> / '+TYPE_PROMPTS.length);
    scoreWrap.appendChild(pill);
    s.appendChild(scoreWrap);s.appendChild(el('div','spacer-sm'));
    var correctCount=0,done=0;
    TYPE_PROMPTS.forEach(function(tp,i){
      var c=el('div','card');
      c.appendChild(el('div','prompt-box',(tp.trap?'<span class="instr">\u26a0 Trap prompt \u00b7 </span>':'')+tp.p));
      var opts=el('div','opts cols-2');
      Object.keys(TYPES).forEach(function(k){
        var b=el('button','opt');
        b.innerHTML='<span>'+TYPES[k]+'</span>';
        b.addEventListener('click',function(){
          if(b.classList.contains('locked'))return;
          $$('.opt',opts).forEach(function(x){x.classList.add('locked');});
          var correct=k===tp.t;
          b.classList.add(correct?'correct':'wrong');
          if(!correct){$$('.opt',opts).forEach(function(x){if(x.textContent.trim()===TYPES[tp.t])x.classList.add('correct');});}
          var fb=c.querySelector('.feedback');
          showFeedback(fb,correct?'strong':'needs',(correct?'Correct \u2014 '+TYPES[tp.t]+'. ':'It\u2019s '+TYPES[tp.t]+'. ')+tp.ex);
          if(!state.answers['type-'+i]){if(correct)correctCount++;done++;state.scores.types=correctCount;saveState();var sc=$('#t2wTypeScore');if(sc)sc.textContent=correctCount;if(done>=TYPE_PROMPTS.length)markComplete('types');}
          state.answers['type-'+i]={k:k,correct:correct};saveState();
        });
        opts.appendChild(b);
      });
      c.appendChild(opts);c.appendChild(el('div','feedback'));
      s.appendChild(c);
    });
    setTimeout(function(){var cc=0;TYPE_PROMPTS.forEach(function(tp,i){if(state.answers['type-'+i]&&state.answers['type-'+i].correct)cc++;});if(cc){var sc=$('#t2wTypeScore');if(sc)sc.textContent=cc;}},0);
    return s;
  }

  function buildBuilder(){
    var m=SECTIONS[3];
    var s=sectionShell(m,'Pick an essay type, then place the paragraph blocks in the examiner-approved order. Build all six layouts \u2014 each reveals its own tips and wrong-structure warning.');
    s.appendChild(teacherNote('<ul><li>Don\u2019t pre-teach the structure. Let her build, check, and self-correct first.</li><li>After each correct build, ask her to say the job of each paragraph aloud.</li><li class="say">Challenge: \u201cWhat changes between Standard A/D and Outweigh A/D \u2014 and why does it matter?\u201d</li></ul>'));
    var controls=el('div','builder-controls');
    var sel=el('div','type-select');
    var order=['opinion','discussion','adstd','adout','ps','direct'];
    order.forEach(function(k,i){
      var b=el('button','type-btn'+(i===0?' active':''));b.textContent=LAYOUTS[k].label;b.dataset.k=k;
      sel.appendChild(b);
    });
    controls.appendChild(sel);s.appendChild(controls);
    var host=el('div');s.appendChild(host);
    var built={};
    function render(k){
      host.innerHTML='';
      var c=el('div','card');
      c.appendChild(el('h3',null,'Build: '+LAYOUTS[k].label));
      c.appendChild(orderer('build-'+k,LAYOUTS[k].blocks,function(){
        built[k]=true;tips.style.display='block';
        if(order.every(function(x){return state.answers['build-'+x];}))markComplete('builder');
      }));
      host.appendChild(c);
      var tips=el('div','card');tips.style.display=state.answers['build-'+k]?'block':'none';
      tips.innerHTML='<h3>Examiner tips \u00b7 '+LAYOUTS[k].label+'</h3>';
      var ul=el('ul');LAYOUTS[k].tips.forEach(function(t){ul.appendChild(el('li',null,t));});tips.appendChild(ul);
      var warn=el('div','callout warn');warn.innerHTML='<span class="ic">\u26a0</span><div>'+LAYOUTS[k].warn+'</div>';
      tips.appendChild(warn);
      host.appendChild(tips);
    }
    sel.addEventListener('click',function(e){
      var b=e.target.closest('.type-btn');if(!b)return;
      $$('.type-btn',sel).forEach(function(x){x.classList.remove('active');});b.classList.add('active');
      render(b.dataset.k);
    });
    render('opinion');
    return s;
  }

  function buildIntro(){
    var m=SECTIONS[4];
    var s=sectionShell(m,'The 2\u20133 sentence formula: paraphrase the question, then state your thesis/plan. No hooks, no background history.');
    s.appendChild(teacherNote('<ul><li>Reinforce: paraphrase = synonyms + changed grammar, same meaning.</li><li>For the writing task, demand a committed position \u2014 push back on any \u201cfence-sitting\u201d.</li><li class="say">Say: \u201cThe examiner wants your opinion in sentence two \u2014 not a story about how important the topic is.\u201d</li></ul>'));
    var c1=el('div','card');
    c1.appendChild(el('h3',null,'<span class="qnum">1</span> Identify the better paraphrase'));
    c1.appendChild(el('div','prompt-box',INTRO.para.prompt));
    c1.appendChild(mcq('intro-para',INTRO.para,function(){maybeDone();}));
    s.appendChild(c1);
    var c2=el('div','card');
    c2.appendChild(el('h3',null,'<span class="qnum">2</span> Fix the weak thesis'));
    c2.appendChild(el('div','callout warn','<span class="ic">\u2717</span><div><b>Weak thesis:</b> \u201c'+INTRO.thesis.weak+'\u201d</div>'));
    c2.appendChild(el('p','muted','Which rewrite reaches Band 7?'));
    c2.appendChild(mcq('intro-thesis',INTRO.thesis,function(){maybeDone();}));
    s.appendChild(c2);
    var c3=el('div','card');
    c3.appendChild(el('h3',null,'<span class="qnum">3</span> Write your own thesis'));
    c3.appendChild(writeTask('intro-write',{section:'intro',prompt:INTRO.write.prompt,range:null,
      placeholder:'Write a 2-sentence intro: paraphrase + a thesis that commits to a position\u2026',
      model:INTRO.write.model,tags:INTRO.write.tags,bestEligible:true}));
    s.appendChild(c3);
    function maybeDone(){if(state.answers['intro-para']&&state.answers['intro-thesis'])markComplete('intro');}
    return s;
  }

  function buildPeel(){
    var m=SECTIONS[5];
    var s=sectionShell(m,'PEEL = Point \u00b7 Explain \u00b7 Example \u00b7 Link. The Band 7 difference is development: one idea taken all the way, not five shallow ones.');
    s.appendChild(teacherNote('<ul><li>Make her name each PEEL element aloud as she orders them.</li><li>On the expansion task, demand a <em>specific</em> example \u2014 push back on \u201cfor example, many people\u2026\u201d.</li><li class="say">Challenge: \u201cWhich is stronger \u2014 five quick reasons, or one reason explained and proven? Why?\u201d</li></ul>'));
    var depth=el('div','card');
    depth.appendChild(el('h3',null,'Depth over listing'));
    depth.innerHTML+='<p class="muted">Why developing 1\u20132 ideas beats listing five shallow ones:</p>';
    var dg=el('div','depth-grid');
    dg.innerHTML='<div class="depth-box depth-bad"><h4>\u2717 Listing (caps at Band 6)</h4><ul><li>EVs are clean.</li><li>EVs are quiet.</li><li>EVs are modern.</li><li>EVs save fuel.</li><li>EVs are the future.</li></ul><p class="muted" style="margin-top:8px">Five claims, zero development. No \u201cwhy\u201d, no proof.</p></div>'+
      '<div class="depth-box depth-good"><h4>\u2713 Developing (reaches Band 7)</h4><p>EVs deliver a major <b>public-health</b> gain: with no tailpipe emissions they cut the urban smog that triggers respiratory illness \u2014 and after Oslo expanded EV uptake, city-centre NO\u2093 levels fell. <b>One idea, fully proven.</b></p></div>';
    depth.appendChild(dg);
    s.appendChild(depth);
    var c1=el('div','card');
    c1.appendChild(el('h3',null,'<span class="qnum">1</span> Reorder the scrambled PEEL paragraph'));
    c1.appendChild(el('div','prompt-box',PEEL_ORDER.prompt));
    c1.appendChild(orderer('peel-order',PEEL_ORDER.blocks,function(){maybeDone();}));
    s.appendChild(c1);
    var c2=el('div','card');
    c2.appendChild(el('h3',null,'<span class="qnum">2</span> Identify the missing PEEL element'));
    c2.appendChild(el('div','prompt-box',PEEL_MISSING.text));
    c2.appendChild(mcq('peel-missing',PEEL_MISSING,function(){maybeDone();}));
    s.appendChild(c2);
    var c3=el('div','card');
    c3.appendChild(el('h3',null,'<span class="qnum">3</span> Expand a weak idea into a Band 7 paragraph'));
    c3.appendChild(el('div','callout warn','<span class="ic">\u2717</span><div><b>Weak idea:</b> \u201c'+PEEL_EXPAND.weak+'\u201d</div>'));
    c3.appendChild(writeTask('peel-expand',{section:'peel',prompt:PEEL_EXPAND.prompt,
      placeholder:'Write a full PEEL paragraph: Point \u2192 Explain \u2192 Example \u2192 Link\u2026',
      model:PEEL_EXPAND.model,tags:PEEL_EXPAND.tags,bestEligible:true,range:[60,110]}));
    s.appendChild(c3);
    function maybeDone(){if(state.answers['peel-order']&&state.answers['peel-missing'])markComplete('peel');}
    return s;
  }

  function buildCohesion(){
    var m=SECTIONS[6];
    var s=sectionShell(m,'Cohesion is logical flow \u2014 not a connector bolted onto every sentence. Repair these, and justify each choice aloud.');
    s.appendChild(teacherNote('<ul><li>For every connector choice, ask \u201cwhat is the relationship \u2014 contrast, result, addition, or example?\u201d</li><li>Drill the grammar split: <b>Although</b> + clause; <b>Despite</b> + noun/gerund.</li><li class="say">Say: \u201cMore linkers is not better cohesion. Logic is.\u201d</li></ul>'));
    var gn=el('div','gnote');
    gn.innerHTML='<div class="gn"><b>Although + clause</b><div class="ex">Although the cost <u>is</u> high, demand keeps rising. (subject + verb)</div></div>'+
      '<div class="gn"><b>Despite + noun / gerund</b><div class="ex">Despite the high cost / Despite costing more, demand keeps rising.</div></div>';
    s.appendChild(el('div','callout note','<span class="ic">\uD83D\uDCDD</span><div><b>Grammar split to memorise:</b> the two most-confused concession words below.</div>'));
    s.appendChild(gn);
    COHESION.forEach(function(q,i){
      var c=el('div','card');
      c.appendChild(el('h3',null,'<span class="qnum">'+(i+1)+'</span> '+q.q));
      c.appendChild(mcq('coh-'+i,q,function(){if(COHESION.every(function(x,xi){return state.answers['coh-'+xi];}))markComplete('cohesion');}));
      s.appendChild(c);
    });
    s.appendChild(el('div','callout tip','<span class="ic">\uD83D\uDCA1</span><div><b>Band 7 tip:</b> coherence comes from the logical flow of ideas and clear paragraph topics \u2014 not from inserting a transition word at the start of every sentence.</div>'));
    return s;
  }

  function buildConclude(){
    var m=SECTIONS[7];
    var s=sectionShell(m,'The 2-sentence close: signal + restate position, then summarise your key reasons. 30\u201340 words. No new ideas. Never leave it unfinished.');
    s.appendChild(teacherNote('<ul><li>Hold her to 30\u201340 words \u2014 over-long conclusions waste exam time.</li><li>Reject any new idea that appears in the conclusion.</li><li class="say">Say: \u201cThe conclusion proves you answered the question. An unfinished one quietly lowers Task Response.\u201d</li></ul>'));
    var warn=el('div','callout warn');
    warn.innerHTML='<span class="ic">\u26a0</span><div><b>Two ways conclusions lose marks:</b> adding a brand-new idea, or running out of time and leaving it unfinished. Restate + summarise only.</div>';
    s.appendChild(warn);
    var c1=el('div','card');
    c1.appendChild(el('h3',null,'<span class="qnum">1</span> Repair the weak conclusion'));
    c1.appendChild(mcq('conc-repair',CONC.repair,function(){maybeDone();}));
    s.appendChild(c1);
    var c2=el('div','card');
    c2.appendChild(el('h3',null,'<span class="qnum">2</span> Write a 30\u201340 word conclusion'));
    c2.appendChild(writeTask('conc-write',{section:'conclude',prompt:CONC.write.prompt,range:[30,40],
      placeholder:'In conclusion, \u2026',model:CONC.write.model,tags:CONC.write.tags,bestEligible:true}));
    s.appendChild(c2);
    function maybeDone(){if(state.answers['conc-repair']&&state.answers['conc-write'])markComplete('conclude');}
    return s;
  }

  function buildExit(){
    var m=SECTIONS.find(function(x){return x.id==='exit';})||SECTIONS[9]||SECTIONS[SECTIONS.length-1];
    var s=sectionShell(m,'Two-minute reflection, then generate a printable session summary. This becomes the student\u2019s take-away record.');
    s.appendChild(teacherNote('<ul><li>Make the reflection oral first, then typed \u2014 it cements the takeaways.</li><li>Use \u201cPrint session summary\u201d (landing panel) to give her a branded record + homework.</li><li class="say">Close: \u201cName one structure you will absolutely use in the real exam.\u201d</li></ul>'));
    var c=el('div','card');
    c.appendChild(el('h3',null,'Exit reflection'));
    var fields=[
      ['name','Student name','input','e.g. Falcon / first name'],
      ['date','Session date','date',''],
      ['identify','The essay type I can identify best','input','e.g. Opinion / Discussion'],
      ['mistake','The biggest mistake I need to avoid','input','e.g. listing shallow ideas'],
      ['structure','One structure I will use in the real exam','input','e.g. Discussion: disagree-side first'],
      ['proud','One sentence I wrote today that I\u2019m proud of','textarea','Paste your best sentence here\u2026']
    ];
    var wrap=el('div');
    fields.forEach(function(f){
      var fd=el('div','field');
      fd.appendChild(el('label',null,f[1]));
      var inp;
      if(f[2]==='textarea'){inp=el('textarea');inp.rows=2;}else{inp=el('input');inp.type=f[2];}
      inp.placeholder=f[3]||'';
      inp.value=(state.exit[f[0]])||(f[0]==='proud'&&state.exit.best?state.exit.best:'')||(f[0]==='date'?new Date().toISOString().slice(0,10):'');
      inp.addEventListener('input',function(){state.exit[f[0]]=inp.value;if(f[0]==='proud')state.exit.best=inp.value;saveState();});
      if(f[0]==='date'&&!state.exit.date){state.exit.date=inp.value;saveState();}
      fd.appendChild(inp);wrap.appendChild(fd);
    });
    c.appendChild(wrap);
    var row=el('div','btn-row');
    var gen=el('button','btn gold','Generate session summary \u2192');
    var printB=el('button','btn solid','\uD83D\uDDA8 Print / Save as PDF');
    row.appendChild(gen);row.appendChild(printB);
    c.appendChild(row);
    s.appendChild(c);
    var preview=el('div','card');preview.id='t2wSummaryPreview';preview.style.display='none';
    s.appendChild(preview);
    gen.addEventListener('click',function(){
      markComplete('exit');
      preview.style.display='block';
      preview.innerHTML='<h3>Session summary preview</h3><p class="muted">This is what will print. Use the buttons above (or the landing panel) to print / save as PDF.</p>';
      preview.appendChild(buildCert());
      if(preview.scrollIntoView)preview.scrollIntoView({behavior:'smooth'});
    });
    printB.addEventListener('click',function(){markComplete('exit');renderPrintSummary();printWith('summary');});
    return s;
  }

  /* =====================================================================
     MODEL ESSAY CLINIC  (Band 9 vs Band 5 annotated lab)
     ===================================================================== */
  /* annotateText: wrap the first non-overlapping occurrence of each phrase
     in a <span class="anno" data-cat data-note>. Ported verbatim. */
  function annotateText(text,annoList){
    var marks=[];
    var taken=[];
    (annoList||[]).forEach(function(a){
      var phrase=a.find;if(!phrase)return;
      var from=0,idx;
      while((idx=text.indexOf(phrase,from))!==-1){
        var end=idx+phrase.length;
        var clash=taken.some(function(t){return idx<t.end&&end>t.start;});
        if(!clash){marks.push({start:idx,end:end,cat:a.cat,note:a.note});taken.push({start:idx,end:end});break;}
        from=idx+1;
      }
    });
    marks.sort(function(x,y){return x.start-y.start;});
    var out='',pos=0;
    marks.forEach(function(m){
      if(m.start<pos)return;
      out+=esc(text.slice(pos,m.start));
      out+='<span class="anno" data-cat="'+m.cat+'" data-note="'+escAttr(m.note)+'">'+esc(text.slice(m.start,m.end))+'</span>';
      pos=m.end;
    });
    out+=esc(text.slice(pos));
    return out;
  }

  function ensureTip(){
    var tip=$('#t2wAnnoTip', document);
    if(!tip){tip=el('div');tip.id='t2wAnnoTip';document.body.appendChild(tip);}
    return tip;
  }
  function essayBodyHTML(essay,band){
    var e=essay[band];
    return e.paras.map(function(p){return '<p>'+annotateText(p,e.anno)+'</p>';}).join('');
  }
  function essayCard(essay,band){
    var e=essay[band];
    var card=el('div','essay-card');
    var wc=e.paras.join(' ').trim().split(/\s+/).length;
    var bar=el('div','essay-band-bar '+band);
    bar.innerHTML='<span class="bigband">'+e.score.band+'</span>'+
      '<span class="bb-meta">Band '+e.score.band+(band==='b9'?' \u00b7 model answer':' \u00b7 weaker response')+'<br>'+esc(essay.type)+'</span>'+
      '<span class="wc">'+wc+' words</span>';
    var body=el('div','essay-body');body.innerHTML=essayBodyHTML(essay,band);
    card.appendChild(bar);card.appendChild(body);
    return card;
  }
  function applyLayers(root,activeSet){
    $$('.anno',root).forEach(function(sp){
      var cat=sp.dataset.cat;
      if(activeSet.has(cat)){sp.classList.add('lit');sp.dataset.pri=cat;}
      else{sp.classList.remove('lit');sp.removeAttribute('data-pri');sp.classList.remove('pinned');}
    });
  }
  function wireAnno(root,noteBar){
    var tip=ensureTip();
    root.addEventListener('mousemove',function(e){
      var a=e.target.closest('.anno.lit');
      if(!a){tip.style.display='none';return;}
      tip.innerHTML='<span class="tip-layer">'+esc(LAYER_NAME[a.dataset.cat]||'')+'</span><div>'+esc(a.dataset.note)+'</div>';
      tip.style.display='block';
      var x=e.clientX+14,y=e.clientY+16;
      var w=tip.offsetWidth||300;if(x+w>window.innerWidth-12)x=e.clientX-w-14;
      tip.style.left=x+'px';tip.style.top=y+'px';
    });
    root.addEventListener('mouseleave',function(){tip.style.display='none';});
    root.addEventListener('click',function(e){
      var a=e.target.closest('.anno.lit');if(!a)return;
      var wasPinned=a.classList.contains('pinned');
      $$('.anno.pinned',root).forEach(function(x){x.classList.remove('pinned');});
      if(wasPinned){if(noteBar)noteBar.classList.remove('show');return;}
      a.classList.add('pinned');
      if(noteBar){
        noteBar.innerHTML='<span class="nb-layer" style="background:'+layerColor(a.dataset.cat)+'">'+esc(LAYER_NAME[a.dataset.cat])+'</span>'+esc(a.dataset.note);
        noteBar.classList.add('show');
      }
    });
  }
  function layerColor(cat){
    return ({tr:'#2563c9',structure:'#7a4fd0',cohesion:'#0e8a6e',vocab:'#c2871a',grammar:'#0a7fa3',variety:'#b5468a',warning:'#d6273e'})[cat]||'#0a1f44';
  }
  function filterChips(onChange){
    var wrap=el('div','anno-filters');
    var active=new Set();
    LAYERS.forEach(function(L){
      var chip=el('button','fchip');chip.dataset.layer=L.id;
      chip.innerHTML='<span class="swatch" style="background:'+layerColor(L.id)+'"></span>'+L.name;
      chip.addEventListener('click',function(){
        if(active.has(L.id)){active.delete(L.id);chip.classList.remove('active');}
        else{active.add(L.id);chip.classList.add('active');}
        onChange(active);
      });
      wrap.appendChild(chip);
    });
    var allBtn=el('button','fchip fchip-all','Show all');
    var clrBtn=el('button','fchip fchip-all','Clear');
    allBtn.addEventListener('click',function(){
      LAYERS.forEach(function(L){active.add(L.id);});
      $$('.fchip',wrap).forEach(function(c){if(c.dataset.layer)c.classList.add('active');});
      onChange(active);
    });
    clrBtn.addEventListener('click',function(){
      active.clear();
      $$('.fchip',wrap).forEach(function(c){c.classList.remove('active');});
      onChange(active);
    });
    wrap.appendChild(allBtn);wrap.appendChild(clrBtn);
    return wrap;
  }
  function examinerCard(essay,band){
    var e=essay[band];var sc=e.score;
    var card=el('div','exam-card');
    card.innerHTML='<h4>Examiner assessment \u00b7 estimated Band '+sc.band+'</h4>'+
      '<div class="crit-grid">'+
        '<div class="crit"><div class="ct">Task Response</div><div class="cv">'+esc(sc.TR)+'</div></div>'+
        '<div class="crit"><div class="ct">Coherence &amp; Cohesion</div><div class="cv">'+esc(sc.CC)+'</div></div>'+
        '<div class="crit"><div class="ct">Lexical Resource</div><div class="cv">'+esc(sc.LR)+'</div></div>'+
        '<div class="crit"><div class="ct">Grammatical Range &amp; Accuracy</div><div class="cv">'+esc(sc.GRA)+'</div></div>'+
      '</div>'+
      '<div class="verdict">'+
        '<div class="v good"><b>Strongest feature</b>'+esc(e.strongest)+'</div>'+
        '<div class="v bad"><b>Biggest weakness</b>'+esc(e.weakest)+'</div>'+
      '</div>';
    var why=el('div','why-band'+(band==='b5'?' b5':''));
    why.innerHTML='<b>Why this is Band '+sc.band+':</b> '+esc(e.why);
    card.appendChild(why);
    if(band==='b5'){
      var fl=el('div','fix-list');
      fl.innerHTML='<div class="fl prob"><h4>3 biggest problems</h4><ul>'+e.problems.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul></div>'+
        '<div class="fl fix"><h4>3 practical fixes</h4><ul>'+e.fixes.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul></div>';
      card.appendChild(fl);
      var rb=el('div','rewrite-box');
      rb.innerHTML='<div class="rb-l">Weakest paragraph, rewritten to Band 7</div>'+
        '<div style="font-size:14px;color:var(--t2w-muted);margin-bottom:8px"><em>Original:</em> \u201c'+esc(e.rewrite.orig)+'\u201d</div>'+
        '<div class="b7">'+esc(e.rewrite.better)+'</div>';
      card.appendChild(rb);
    }
    return card;
  }
  function clickEssay(key,sentences,correctIdx,explain,onDone){
    var wrap=el('div');
    var ce=el('div','click-essay');
    sentences.forEach(function(sen,i){
      var sp=el('span','csent',esc(sen)+' ');
      sp.addEventListener('click',function(){
        if(ce.dataset.done)return;ce.dataset.done='1';
        $$('.csent',ce).forEach(function(x){x.classList.add('locked');});
        var ok=i===correctIdx;
        sp.classList.add(ok?'correct':'wrong');
        if(!ok)$$('.csent',ce)[correctIdx].classList.add('correct');
        showFeedback(fb,ok?'strong':'needs',(ok?'Correct. ':'Not quite \u2014 the highlighted sentence is the answer. ')+explain);
        state.answers[key]={i:i,correct:ok};saveState();
        if(onDone)onDone(ok);
      });
      ce.appendChild(sp);
    });
    var fb=el('div','feedback');
    wrap.appendChild(ce);wrap.appendChild(fb);
    return wrap;
  }
  function bandGuess(key,para,correctBand,explain,onDone){
    var wrap=el('div');
    wrap.appendChild(el('div','prompt-box',esc(para)));
    var row=el('div','btn-row');
    [5,7,9].forEach(function(b){
      var btn=el('button','btn outline','Band '+b);
      btn.addEventListener('click',function(){
        if(wrap.dataset.done)return;wrap.dataset.done='1';
        $$('.btn',row).forEach(function(x){x.disabled=true;});
        var ok=b===correctBand;
        btn.classList.remove('outline');btn.classList.add(ok?'gold':'ghost');
        showFeedback(fb,ok?'strong':'needs',(ok?'Correct \u2014 this is Band '+correctBand+'. ':'It is Band '+correctBand+'. ')+explain);
        state.answers[key]={b:b,correct:ok};saveState();
        if(onDone)onDone(ok);
      });
      row.appendChild(btn);
    });
    var fb=el('div','feedback');
    wrap.appendChild(row);wrap.appendChild(fb);
    return wrap;
  }
  function rewriteTask(key,cfg){
    var wrap=el('div','write-task');
    var ta=el('textarea','write-box');
    ta.placeholder=cfg.placeholder||'Type here\u2026';
    ta.value=(state.answers[key]&&state.answers[key].text)||'';
    ta.addEventListener('input',function(){state.answers[key]={text:ta.value};saveState();markComplete('clinic');});
    wrap.appendChild(ta);
    var row=el('div','btn-row');
    var show=el('button','btn gold','Show model rewrite');
    row.appendChild(show);wrap.appendChild(row);
    var model=el('div','model-reveal');
    model.innerHTML='<h4>Band 7 model</h4><div class="model-text">'+esc(cfg.model)+'</div>';
    wrap.appendChild(model);
    show.addEventListener('click',function(){model.classList.toggle('show');show.textContent=model.classList.contains('show')?'Hide model':'Show model rewrite';});
    return wrap;
  }

  function buildClinic(){
    var m=SECTIONS.find(function(x){return x.id==='clinic';});
    var s=sectionShell(m,'A Band 9 vs Band 5 annotated lab. Switch on annotation layers to see exactly what lifts \u2014 or limits \u2014 a band: task response, structure, cohesion, vocabulary, grammar, sentence variety and examiner warnings.');
    s.appendChild(teacherNote('<ul><li>Before revealing the Band 9 essay, ask the student to predict its structure, then have her find the thesis <em>before</em> turning on annotations.</li><li>Don\u2019t just say \u201cbetter vocabulary\u201d. Ask: which word is more precise? which sounds more academic? which gives clearer meaning?</li><li>Push her to notice that Band 9 cohesion is not only linkers \u2014 it uses referencing: \u201cthis approach\u201d, \u201csuch measures\u201d, \u201cthese gains\u201d.</li><li class="say">Say: \u201cBand 5 <em>lists</em>. Band 9 <em>develops one idea and proves it</em>. Find where that happens.\u201d</li></ul>'));
    var tabsBar=el('div','clinic-tabs');
    var panes=el('div');
    var TABS=[['compare','Compare B5 \u2194 B9'],['annotate','Annotation Lab'],['upgrade','Band Upgrade Map'],['activities','Student Activities'],['reflect','Reflection']];
    var paneEls={};
    TABS.forEach(function(t,i){
      var b=el('button','clinic-tab'+(i===0?' active':''),t[1]);b.dataset.tab=t[0];
      b.addEventListener('click',function(){
        $$('.clinic-tab',tabsBar).forEach(function(x){x.classList.remove('active');});b.classList.add('active');
        Object.keys(paneEls).forEach(function(k){paneEls[k].classList.toggle('active',k===t[0]);});
      });
      tabsBar.appendChild(b);
      var pane=el('div','clinic-pane'+(i===0?' active':''));paneEls[t[0]]=pane;panes.appendChild(pane);
    });
    s.appendChild(tabsBar);s.appendChild(panes);

    function promptPicker(onPick){
      var pp=el('div','prompt-picker');
      ESSAYS.forEach(function(es,i){
        var b=el('button','pp-btn'+(i===S.clinicIdx?' active':''));
        b.innerHTML='<span class="pp-tag">'+esc(es.type.split(' / ')[0].split(' (')[0])+'</span> Prompt '+(i+1);
        b.addEventListener('click',function(){S.clinicIdx=i;onPick(i);});
        pp.appendChild(b);
      });
      return pp;
    }
    function syncPickers(){$$('.prompt-picker').forEach(function(pp){$$('.pp-btn',pp).forEach(function(b,i){b.classList.toggle('active',i===S.clinicIdx);});});}

    var cmp=paneEls.compare;
    function renderCompare(){
      cmp.innerHTML='';
      cmp.appendChild(promptPicker(function(){renderCompare();syncPickers();}));
      var es=ESSAYS[S.clinicIdx];
      cmp.appendChild(el('div','essay-prompt','<b>Prompt:</b> '+esc(es.prompt)));
      var grid=el('div','compare-grid');
      grid.appendChild(essayCard(es,'b5'));grid.appendChild(essayCard(es,'b9'));
      var noteBar=el('div','note-bar');
      var chips=filterChips(function(active){applyLayers(grid,active);});
      cmp.appendChild(el('p','muted','Turn on layers to highlight both essays at once, then click any highlight to pin its note. Hover to preview.'));
      cmp.appendChild(chips);
      cmp.appendChild(grid);
      cmp.appendChild(noteBar);
      wireAnno(grid,noteBar);
      var row=el('div','btn-row');
      var exBtn=el('button','btn solid','Show examiner comments');
      var chBtn=el('button','btn gold','What changed? \u2192');
      var packBtn=el('button','btn outline','\uD83D\uDDA8 Print Model Essay Pack');
      row.appendChild(exBtn);row.appendChild(chBtn);row.appendChild(packBtn);
      cmp.appendChild(row);
      var exHost=el('div');exHost.style.display='none';
      var eg=el('div','compare-grid');eg.appendChild(examinerCard(es,'b5'));eg.appendChild(examinerCard(es,'b9'));
      exHost.appendChild(eg);cmp.appendChild(exHost);
      exBtn.addEventListener('click',function(){var o=exHost.style.display==='none';exHost.style.display=o?'block':'none';exBtn.textContent=o?'Hide examiner comments':'Show examiner comments';markComplete('clinic');});
      var chHost=el('div');chHost.style.display='none';
      var cc=el('div','changed-card');cc.innerHTML='<h3>What changed \u2014 Band 5 \u2192 Band 9</h3>';
      es.changed.forEach(function(c){var r=el('div','changed-row');r.innerHTML='<div class="cw from"><b>Band 5</b>'+esc(c.from)+'</div><div class="cw to"><b>Band 9</b>'+esc(c.to)+'</div>';cc.appendChild(r);});
      chHost.appendChild(cc);cmp.appendChild(chHost);
      chBtn.addEventListener('click',function(){var o=chHost.style.display==='none';chHost.style.display=o?'block':'none';chBtn.textContent=o?'Hide \u201cwhat changed\u201d':'What changed? \u2192';});
      packBtn.addEventListener('click',function(){buildPack(S.clinicIdx);printWith('pack');});
    }
    renderCompare();

    var ann=paneEls.annotate;
    var annBand='b9';
    function renderAnnotate(){
      ann.innerHTML='';
      ann.appendChild(promptPicker(function(){renderAnnotate();syncPickers();}));
      var es=ESSAYS[S.clinicIdx];
      ann.appendChild(el('div','essay-prompt','<b>Prompt:</b> '+esc(es.prompt)));
      var bt=el('div','band-toggle');
      var b9=el('button','b9'+(annBand==='b9'?' active':''),'Band 9 model');
      var b5=el('button','b5'+(annBand==='b5'?' active':''),'Band 5 response');
      bt.appendChild(b9);bt.appendChild(b5);
      var btRow=el('div','flex-between');btRow.appendChild(bt);ann.appendChild(btRow);
      b9.addEventListener('click',function(){annBand='b9';renderAnnotate();});
      b5.addEventListener('click',function(){annBand='b5';renderAnnotate();});
      var card=essayCard(es,annBand);
      var noteBar=el('div','note-bar');
      var chips=filterChips(function(active){applyLayers(card,active);});
      ann.appendChild(el('p','muted','Toggle any layer, then hover a highlight for the reason it matters, or click to pin it below.'));
      ann.appendChild(chips);
      ann.appendChild(card);
      ann.appendChild(noteBar);
      wireAnno(card,noteBar);
      ann.appendChild(examinerCard(es,annBand));
      markComplete('clinic');
    }
    renderAnnotate();

    var up=paneEls.upgrade;
    up.appendChild(el('p','muted','Thirteen mini rewrites. Open each card to see exactly why the Band 9 version scores higher.'));
    var umap=el('div','umap');
    UPGRADES.forEach(function(u,i){
      var card=el('div','ucard');
      var urow=el('div','urow');
      urow.innerHTML='<div class="uside b5"><span class="ul-tag">Band 5</span>'+esc(u.b5)+'</div>'+
        '<div class="uside b9"><span class="ul-tag">Band 9</span>'+esc(u.b9)+'</div>';
      var why=el('div','uwhy','<b>Why it scores higher:</b><ul>'+u.points.map(function(p){return '<li class="gold">'+esc(p)+'</li>';}).join('')+'</ul>');
      var tog=el('button','utoggle','Why is this better? \u25be');
      tog.addEventListener('click',function(){card.classList.toggle('open');tog.textContent=card.classList.contains('open')?'Hide explanation \u25b4':'Why is this better? \u25be';});
      card.appendChild(urow);card.appendChild(why);card.appendChild(tog);
      umap.appendChild(card);
    });
    up.appendChild(umap);
    up.appendChild(teacherNote('<ul><li>Cover the Band 9 column and ask the student to upgrade the Band 5 line herself first.</li><li>For each card, ask <em>which</em> change matters most \u2014 vocabulary, grammar, or development?</li></ul>'));

    buildClinicActivities(paneEls.activities);
    buildClinicReflection(paneEls.reflect);
    return s;
  }

  function buildClinicActivities(host){
    function actCard(n,title,node,tnHtml){
      var c=el('div','card');
      c.appendChild(el('h3',null,'<span class="qnum">'+n+'</span> '+title));
      c.appendChild(node);
      if(tnHtml)c.appendChild(teacherNote(tnHtml));
      host.appendChild(c);
    }
    var introSents=['It is increasingly argued that school-leavers should devote twelve months to community service before enrolling at university.','I largely agree with this proposal, since a structured year of service can foster social responsibility and help young people choose their degrees more wisely.'];
    actCard(1,'Find the Thesis',clickEssay('clinic-a1',introSents,1,'The thesis is the sentence that states the writer\u2019s position and previews the reasons \u2014 not the paraphrase of the question.'),
      '<ul><li>Ask: which sentence tells the examiner the writer\u2019s <em>opinion</em>? The first only paraphrases the prompt.</li></ul>');
    var b5Sents=['Nowadays many people think young adults should do community service for one year before university.','In my opinion this topic have two sides and I will discuss them in this essay.'];
    actCard(2,'Find the Weakness',clickEssay('clinic-a2',b5Sents,1,'On an agree/disagree task, announcing \u201ctwo sides\u201d with no position is what costs the most Task Response marks.'),
      '<ul><li>Don\u2019t accept \u201cgrammar\u201d as the answer. The real damage is the missing <em>position</em>.</li></ul>');
    var vocWrap=el('div');
    [
      {opts:['good for children','beneficial for children\u2019s development','nice for the children'],ans:1,ex:'\u201cbeneficial for children\u2019s development\u201d is precise and academic; \u201cgood/nice\u201d are vague.'},
      {opts:['make the pollution less','reduce pollution','curb urban pollution'],ans:2,ex:'\u201ccurb urban pollution\u201d is the strongest, most precise collocation of the three.'},
      {opts:['do something about traffic','tackle traffic congestion','fix the traffic problem'],ans:1,ex:'\u201ctackle traffic congestion\u201d pairs a strong verb with a precise noun phrase.'}
    ].forEach(function(d,i){
      vocWrap.appendChild(el('div','muted','Choose the strongest Band 9 upgrade:'));
      vocWrap.appendChild(mcq('clinic-a3-'+i,d));
      vocWrap.appendChild(el('div','spacer-sm'));
    });
    actCard(3,'Vocabulary Upgrade',vocWrap,'<ul><li>For each, ask <em>why</em> the chosen phrase is more precise \u2014 not just \u201cit sounds better\u201d.</li></ul>');
    actCard(4,'Linker Repair',mcq('clinic-a4',{opts:['Firstly\u2026 Secondly\u2026 Moreover\u2026 Also\u2026','Use topic sentences and referencing (\u201cThis benefit\u2026\u201d, \u201cSuch measures\u2026\u201d) with linkers placed flexibly'],ans:1,ex:'Mechanical numbering caps cohesion. Referencing and flexible linker placement read as Band 7+ control.'}),
      '<ul><li>Show that \u201cmore linkers\u201d \u2260 better cohesion. Logic and referencing do the work.</li></ul>');
    actCard(5,'Sentence Control \u2014 repair the run-on',rewriteTask('clinic-a5',{placeholder:'Split and tighten: \u201cAlso it keep them busy and away from bad habits which is good for society and for the parents too.\u201d',model:'A service year also keeps young people occupied and away from harmful influences. This benefits not only the individuals themselves but also their families and the wider community.'}),
      '<ul><li>Push for two controlled sentences, correct agreement (\u201ckeepS\u201d), and a referencing word (\u201cThis\u2026\u201d).</li></ul>');
    actCard(6,'Add Development (Point \u2192 Explain \u2192 Example \u2192 Link)',writeTask('clinic-a6',{section:'clinic',prompt:'Weak idea: \u201cCommunity service is good because it helps young people.\u201d Expand it into a full PEEL paragraph.',placeholder:'Point \u2192 Explain why \u2192 specific Example \u2192 Link back\u2026',model:'A service year accelerates personal maturity. By shouldering real responsibilities \u2014 caring for patients or mentoring children \u2014 young adults develop discipline and empathy they rarely gain at school. A friend who volunteered in a community clinic, for instance, returned noticeably more organised and confident, qualities that later strengthened her university work. Such growth shows that community service prepares students not just for a degree, but for adult life.',tags:['Clear point','Explanation (why)','Specific example','Link back to the question']}),
      '<ul><li>Demand a <em>specific</em> example. Reject \u201cfor example many people\u2026\u201d.</li></ul>');
    var bgWrap=el('div');
    bgWrap.appendChild(el('div','muted','Read each paragraph and guess the band, then reveal the verdict.'));
    bgWrap.appendChild(bandGuess('clinic-a7a','The most compelling reason concerns personal maturity. A year spent assisting in hospitals or environmental projects exposes young people to different backgrounds and obliges them to manage genuine responsibilities, qualities that later strengthen their academic work.',9,'Developed idea, precise lexis (\u201cobliges them to manage genuine responsibilities\u201d), accurate complex grammar.'));
    bgWrap.appendChild(el('div','spacer-sm'));
    bgWrap.appendChild(bandGuess('clinic-a7b','Firstly, community service is good because it help young people. They can learn many things and meet many people and it is good for their future life.',5,'Listing, repeated \u201cgood/many things\u201d, and a subject-verb agreement error (\u201cit help\u201d).'));
    bgWrap.appendChild(el('div','spacer-sm'));
    bgWrap.appendChild(bandGuess('clinic-a7c','Community service helps young people become more mature. They take on responsibilities and meet new people, which is useful for their future studies and careers.',7,'Clear and accurate with some development, but the support is fairly general \u2014 solid Band 7, not yet Band 9.'));
    actCard(7,'Band Guess \u2014 5, 7 or 9?',bgWrap,'<ul><li>After each reveal, ask what <em>one</em> change would push the paragraph up a band.</li></ul>');
    var ac=el('div');
    ac.appendChild(el('p','muted','Annotations off. Read the Band 9 paragraph below and try to locate each feature yourself, then reveal the answers.'));
    ac.appendChild(el('div','essay-body','<p>'+esc('A further benefit is clearer academic direction. Students who pause before university often gain a sharper sense of their own strengths, which reduces the likelihood of abandoning a poorly chosen course. Because they have tested their interests in a practical setting, they tend to commit more seriously to their studies.')+'</p>'));
    var acReveal=el('div','model-reveal');
    acReveal.innerHTML='<h4>Annotation key</h4><div class="model-text" style="font-size:15px"><b>Topic sentence:</b> \u201cA further benefit is clearer academic direction.\u201d<br><b>Relative clause (grammar):</b> \u201c\u2026which reduces the likelihood\u2026\u201d<br><b>Cause linker (cohesion):</b> \u201cBecause they have tested\u2026\u201d<br><b>Precise collocation (vocabulary):</b> \u201ca sharper sense of their own strengths\u201d<br><b>Link to question:</b> \u201ccommit more seriously to their studies\u201d</div>';
    var acBtn=el('button','btn gold','Reveal annotation key');
    acBtn.addEventListener('click',function(){acReveal.classList.toggle('show');acBtn.textContent=acReveal.classList.contains('show')?'Hide key':'Reveal annotation key';markComplete('clinic');});
    var acRow=el('div','btn-row');acRow.appendChild(acBtn);ac.appendChild(acRow);ac.appendChild(acReveal);
    actCard(8,'Annotation Challenge',ac,'<ul><li>Make her commit to a guess <em>before</em> revealing. Identifying features unaided is the real test.</li></ul>');
    actCard(9,'Rewrite Challenge \u2014 Band 5 \u2192 Band 7',rewriteTask('clinic-rewrite',{placeholder:'Rewrite to Band 7: \u201cThe reason for this is because internet is very fast and easy. You can read the news in your phone anytime and it is free, but the newspaper you must buy it and it come one time in the day.\u201d',model:'This shift is driven mainly by convenience and cost. Online news is available instantly on any smartphone and is usually free, whereas a printed paper must be bought and is published only once a day. Younger readers, who expect information on demand, therefore turn naturally to digital sources.'}),
      '<ul><li>Targets: fix \u201cin internet\u201d \u2192 \u201con the internet\u201d, \u201cit come\u201d \u2192 \u201cit comes\u201d, and combine the ideas with \u201cwhereas\u201d.</li></ul>');
  }

  function buildClinicReflection(host){
    var c=el('div','card');
    c.appendChild(el('h3',null,'Final Reflection'));
    c.appendChild(el('p','muted','Lock in today\u2019s lesson. These four answers print on your Model Essay Pack.'));
    var fields=[
      ['copy','One Band 9 feature I will copy','e.g. develop one idea fully with a specific example'],
      ['avoid','One Band 5 habit I must avoid','e.g. announcing \u201ctwo sides\u201d instead of taking a position'],
      ['vocab','One vocabulary upgrade I learned','e.g. \u201cgood\u201d \u2192 \u201cfoster social responsibility\u201d'],
      ['grammar','One grammar target for my next essay','e.g. fix subject-verb agreement (\u201cit helps\u201d)']
    ];
    if(!state.clinic)state.clinic={};
    fields.forEach(function(f){
      var fd=el('div','field');
      fd.appendChild(el('label',null,f[1]));
      var inp=el('input');inp.type='text';inp.placeholder=f[2];
      inp.value=state.clinic[f[0]]||'';
      inp.addEventListener('input',function(){if(!state.clinic)state.clinic={};state.clinic[f[0]]=inp.value;saveState();markComplete('clinic');});
      fd.appendChild(inp);c.appendChild(fd);
    });
    var row=el('div','btn-row');
    var packBtn=el('button','btn gold','\uD83D\uDDA8 Print Model Essay Pack');
    packBtn.addEventListener('click',function(){buildPack(S.clinicIdx);printWith('pack');});
    row.appendChild(packBtn);c.appendChild(row);
    host.appendChild(c);
    host.appendChild(teacherNote('<ul><li>Make the reflection oral first, then typed. Tie each answer to a moment from today\u2019s lab.</li><li class="say">Close: \u201cName the one Band 9 habit you\u2019ll use in your very next essay.\u201d</li></ul>'));
  }

  /* =====================================================================
     PRINT  (Model Essay Pack + certificate-style summary)
     ===================================================================== */
  function printWith(mode){document.body.classList.add('t2w-printing-'+mode);window.print();}
  window.addEventListener('afterprint',function(){document.body.classList.remove('t2w-printing-summary','t2w-printing-pack');});

  function buildPack(idx){
    var es=ESSAYS[idx];var cl=state.clinic||{};
    var host=document.getElementById('t2wPrintPack');
    if(!host){host=el('div');host.id='t2wPrintPack';host.className='t2-workshop-print';document.body.appendChild(host);}
    var annoSummary=es.b9.anno.slice(0,6).map(function(a){return '<li><b>'+esc(LAYER_NAME[a.cat])+':</b> \u201c'+esc(a.find.length>60?a.find.slice(0,60)+'\u2026':a.find)+'\u201d \u2014 '+esc(a.note)+'</li>';}).join('');
    var rewriteAttempt=(state.answers['clinic-rewrite']&&state.answers['clinic-rewrite'].text)||'';
    host.innerHTML=
      '<div class="cert pack-essay">'+
      '<div class="cert-head"><span class="dot">M</span><div><h2>Model Essay Pack \u2014 '+esc(es.type)+'</h2>'+
        '<div class="org">IELTSwithMOURAD \u00b7 Mourad Mekki Teacher Toolkit</div></div></div>'+
      '<div class="cert-sec"><h3>Prompt</h3><p>'+esc(es.prompt)+'</p></div>'+
      '<div class="cert-sec pack-essay"><h3>Band 9 model essay</h3>'+es.b9.paras.map(function(p){return '<p style="font-size:13px;line-height:1.6;margin:0 0 8px">'+esc(p)+'</p>';}).join('')+'</div>'+
      '<div class="cert-sec"><h3>Band 9 \u2014 annotation summary</h3><ul>'+annoSummary+'</ul></div>'+
      '<div class="cert-sec pack-essay"><h3>Band 5 essay</h3>'+es.b5.paras.map(function(p){return '<p style="font-size:13px;line-height:1.6;margin:0 0 8px">'+esc(p)+'</p>';}).join('')+'</div>'+
      '<div class="cert-sec"><h3>Band 5 \u2014 improvement notes</h3>'+
        '<p><b>Three biggest problems</b></p><ul>'+es.b5.problems.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul>'+
        '<p><b>Three practical fixes</b></p><ul>'+es.b5.fixes.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul></div>'+
      '<div class="cert-sec"><h3>Weakest paragraph \u2014 Band 7 rewrite</h3>'+
        '<div class="cert-best" style="font-style:normal">'+esc(es.b5.rewrite.better)+'</div></div>'+
      '<div class="cert-sec"><h3>Student reflection</h3><ul>'+
        '<li><b>Band 9 feature to copy:</b> '+esc(cl.copy||'\u2014')+'</li>'+
        '<li><b>Band 5 habit to avoid:</b> '+esc(cl.avoid||'\u2014')+'</li>'+
        '<li><b>Vocabulary upgrade learned:</b> '+esc(cl.vocab||'\u2014')+'</li>'+
        '<li><b>Grammar target:</b> '+esc(cl.grammar||'\u2014')+'</li></ul>'+
        (rewriteAttempt?'<p style="margin-top:8px"><b>My rewrite attempt:</b></p><div class="cert-best" style="font-style:normal">'+esc(rewriteAttempt)+'</div>':'')+
      '</div>'+
      '<div class="cert-foot"><span>IELTSwithMOURAD \u00b7 Band 7+ Training</span><span>Mourad Mekki Teacher Toolkit</span></div>'+
      '</div>';
  }

  function buildCert(){
    var e=state.exit;
    var completedNames=SECTIONS.filter(function(s){return state.completed[s.id];}).map(function(s){return s.name;});
    var focusAreas=Object.keys(state.focus).filter(function(k){return state.focus[k]==='focus';});
    var typeScore=state.scores.types||0;
    var cert=el('div','cert');
    var cl=state.clinic||{};
    var clinicRewrite=(state.answers['clinic-rewrite']&&state.answers['clinic-rewrite'].text)||'';
    var clinicHasData=!!(cl.copy||cl.avoid||cl.vocab||cl.grammar||clinicRewrite);
    var clinicSec=clinicHasData?
      ('<div class="cert-sec"><h3>Model Essay Clinic \u2014 reflection</h3><ul>'+
        '<li><b>Band 9 feature to copy:</b> '+esc(cl.copy||'\u2014')+'</li>'+
        '<li><b>Band 5 habit to avoid:</b> '+esc(cl.avoid||'\u2014')+'</li>'+
        '<li><b>Vocabulary upgrade learned:</b> '+esc(cl.vocab||'\u2014')+'</li>'+
        '<li><b>Grammar target:</b> '+esc(cl.grammar||'\u2014')+'</li></ul>'+
        (clinicRewrite?'<p style="margin-top:6px"><b>Rewrite attempt:</b></p><div class="cert-best" style="font-style:normal">'+esc(clinicRewrite)+'</div>':'')+
      '</div>'):'';
    cert.innerHTML=
      '<div class="cert-head"><span class="dot">M</span><div><h2>IELTS Writing Task 2 \u2014 Band 7+ Session Record</h2>'+
        '<div class="org">IELTSwithMOURAD \u00b7 Mourad Mekki Teacher Toolkit</div></div></div>'+
      '<div class="cert-meta">'+
        '<div><b>Student</b><span>'+esc(e.name||'\u2014')+'</span></div>'+
        '<div><b>Date</b><span>'+esc(e.date||new Date().toISOString().slice(0,10))+'</span></div>'+
        '<div><b>Session</b><span>90-min Task 2 Studio</span></div>'+
        '<div><b>Type-ID score</b><span>'+typeScore+' / '+TYPE_PROMPTS.length+'</span></div>'+
      '</div>'+
      '<div class="cert-sec"><h3>Completed activities</h3><ul>'+
        (completedNames.length?completedNames.map(function(n){return '<li>'+esc(n)+'</li>';}).join(''):'<li>\u2014</li>')+'</ul></div>'+
      '<div class="cert-sec"><h3>Diagnostic focus areas</h3>'+
        (focusAreas.length?'<ul>'+focusAreas.map(function(f){return '<li>'+esc(f)+'</li>';}).join('')+'</ul>':'<p class="muted">No weak areas flagged \u2014 strong diagnostic.</p>')+'</div>'+
      '<div class="cert-sec"><h3>Best sentence written today</h3><div class="cert-best">\u201c'+esc((e.proud||e.best)||'\u2014')+'\u201d</div></div>'+
      '<div class="cert-sec"><h3>Teacher action points</h3><ul>'+
        buildActionPoints(focusAreas).map(function(a){return '<li>'+esc(a)+'</li>';}).join('')+'</ul></div>'+
      '<div class="cert-sec"><h3>Next practice recommendation</h3><p>'+esc(buildNextRec(focusAreas))+'</p></div>'+
      clinicSec+
      '<div class="cert-foot"><span>IELTSwithMOURAD \u00b7 Band 7+ Training</span><span>Mourad Mekki Teacher Toolkit</span></div>';
    return cert;
  }
  function buildActionPoints(focus){
    var map={
      'Essay-type recognition':'Re-run the Essay Type Game; verbalise the instruction words before choosing.',
      'Thesis clarity':'Write 3 committed thesis statements per week \u2014 no fence-sitting.',
      'Idea development':'Practise PEEL: one idea, fully developed, with a specific example.',
      'Cohesion / linkers':'Rewrite paragraphs using referencing and mid-sentence linkers.',
      'Conclusion quality':'Draft 30\u201340 word conclusions: restate + summarise, no new ideas.',
      'Grammar accuracy':'Keep an error log; reserve 2\u20133 min to proofread articles & S-V agreement.',
      'Task response':'Underline instruction words first; hold one position throughout.'
    };
    var pts=focus.map(function(f){return map[f];}).filter(Boolean);
    if(!pts.length)pts.push('Maintain consistency across all four criteria \u2014 write one full timed essay this week.');
    pts.push('Write one full essay under exam timing (10m plan \u00b7 28m write \u00b7 2m check), aiming for 270\u2013290 words.');
    return pts;
  }
  function buildNextRec(focus){
    if(focus.indexOf('Idea development')>-1||focus.indexOf('Task response')>-1)
      return 'Write a full Opinion essay on \u201celectric cars by 2040\u201d, developing exactly two PEEL paragraphs, and submit for targeted feedback.';
    if(focus.indexOf('Cohesion / linkers')>-1)
      return 'Write a Discussion essay on \u201cparks vs housing\u201d, focusing on flexible cohesion and clear paragraph topics.';
    return 'Write one essay for each of the five types over the next fortnight, using the Quick Reference checklist after each.';
  }
  function renderPrintSummary(){
    var host=document.getElementById('t2wPrintSummary');
    if(!host){host=el('div');host.id='t2wPrintSummary';host.className='t2-workshop-print';document.body.appendChild(host);}
    host.innerHTML='';host.appendChild(buildCert());
  }

  /* =====================================================================
     NAV + STAGE SWITCHING
     ===================================================================== */
  var BUILDERS={warmup:buildWarmup,lens:buildLens,types:buildTypes,builder:buildBuilder,
    intro:buildIntro,peel:buildPeel,cohesion:buildCohesion,conclude:buildConclude,clinic:buildClinic,exit:buildExit};

  function renderNav(){
    var list=$('#t2wNavList');if(!list)return;list.innerHTML='';
    SECTIONS.forEach(function(s){
      var b=el('button','nav-item'+(s.id===S.current?' active':'')+(state.completed[s.id]?' done':''));
      b.id='t2wnav-'+s.id;
      b.innerHTML='<span class="nav-num">'+s.n+'</span><span class="nav-body"><span class="nm">'+s.name+'</span>'+
        '<span class="nav-time">'+s.time+'</span></span><span class="nav-check">\u2713</span>';
      b.addEventListener('click',function(){go(s.id);if(window.innerWidth<=900){var side=$('.t2w-side');if(side)side.classList.add('is-collapsed');}});
      list.appendChild(b);
    });
  }
  function go(id){
    S.current=id;
    $$('.nav-item').forEach(function(n){n.classList.toggle('active',n.id==='t2wnav-'+id);});
    $$('.lesson-section').forEach(function(sec){sec.classList.toggle('active',sec.dataset.id===id);});
    var stg=$('#t2wStage');if(stg)stg.scrollTop=0;
    var body=S.wrap&&S.wrap.querySelector('.t2w-body');
    if(body&&body.scrollIntoView){var top=body.getBoundingClientRect().top;if(top<0||top>140)body.scrollIntoView({behavior:'smooth',block:'start'});}
  }
  function renderStages(){
    var stage=$('#t2wStage');if(!stage)return;stage.innerHTML='';
    SECTIONS.forEach(function(s){stage.appendChild(BUILDERS[s.id]());});
    $$('.lesson-section').forEach(function(sec){sec.classList.toggle('active',sec.dataset.id===S.current);});
  }

  /* =====================================================================
     TIMER  (counts UP to 90:00, warns in the last 5 minutes)
     ===================================================================== */
  function fmt(sec){var m=Math.floor(sec/60),s=sec%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
  function tickRender(){
    var clk=$('#t2wClock');if(clk)clk.textContent=fmt(state.elapsed);
    var wrap=$('#t2wTimerWrap');if(wrap)wrap.classList.toggle('warn',state.elapsed>=85*60);
  }
  function startTimer(){
    if(S.running)return;S.running=true;var btn=$('#t2wTimerBtn');if(btn)btn.innerHTML='\u23f8 Pause';
    S.timerInt=setInterval(function(){state.elapsed++;tickRender();if(state.elapsed%5===0)saveState();},1000);
  }
  function pauseTimer(){S.running=false;var btn=$('#t2wTimerBtn');if(btn)btn.innerHTML='\u25b6 Start';clearInterval(S.timerInt);saveState();}

  /* =====================================================================
     TEACHER CONTROL ACTIONS
     ===================================================================== */
  function currentSectionEl(){return $$('.lesson-section').find(function(s){return s.dataset.id===S.current;});}
  function showAnswersInStage(){
    var sec=currentSectionEl();if(!sec)return;
    $$('.model-reveal',sec).forEach(function(mr){mr.classList.add('show');});
    flash('Answers & models revealed in this stage.');
  }
  function hideAnswersInStage(){
    var sec=currentSectionEl();if(!sec)return;
    $$('.model-reveal',sec).forEach(function(mr){mr.classList.remove('show');});
    $$('.btn.gold',sec).forEach(function(b){if(b.textContent==='Hide model')b.textContent='Show stronger model';});
    flash('Models hidden.');
  }
  function resetStage(){
    var id=S.current;
    Object.keys(state.answers).forEach(function(k){if(k.startsWith(id+'-')||k.startsWith('build-')&&id==='builder'||k.startsWith('peel-')&&id==='peel'||k.startsWith('coh-')&&id==='cohesion'||k.startsWith('conc-')&&id==='conclude'||k.startsWith('type-')&&id==='types'||k.startsWith('lens-')&&id==='lens'||k.startsWith('warmup-')&&id==='warmup'||k.startsWith('intro-')&&id==='intro')delete state.answers[k];});
    if(id==='warmup')state.focus={};
    if(id==='types')state.scores.types=0;
    if(id==='clinic')state.clinic={};
    delete state.completed[id];
    saveState();
    renderStages();renderNav();updateProgress();go(id);
    flash('Stage reset.');
  }
  function flash(msg){
    if(!S.flashEl){S.flashEl=el('div','t2w-flash');S.flashEl.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0a2540;color:#fff;padding:12px 22px;border-radius:12px;font-size:14px;font-weight:600;z-index:300;box-shadow:0 18px 44px rgba(8,18,40,.28);transition:opacity .3s';document.body.appendChild(S.flashEl);}
    S.flashEl.textContent=msg;S.flashEl.style.opacity='1';
    clearTimeout(S.flashEl._t);S.flashEl._t=setTimeout(function(){S.flashEl.style.opacity='0';},1600);
  }

  /* =====================================================================
     SHELL + PUBLIC RENDER
     ===================================================================== */
  function firstIncomplete(){
    for(var i=0;i<SECTIONS.length;i++){if(!state.completed[SECTIONS[i].id])return SECTIONS[i].id;}
    return SECTIONS[0]?SECTIONS[0].id:'warmup';
  }

  function buildShell(host){
    host.innerHTML='';
    var wrap=el('div','t2-workshop');
    S.wrap=wrap;

    /* ---- landing panel ---- */
    var lp=el('div','t2w-landing-panel');
    lp.innerHTML=
      '<span class="t2w-lp-badge"><span class="dot">M</span> Premium Module</span>'+
      '<h2 class="t2w-lp-title">IELTS Writing Task 2 \u2014 <span class="accent">Band 7+ Workshop</span></h2>'+
      '<p class="t2w-lp-sub">90-Minute Interactive Practice Studio</p>'+
      '<p class="t2w-lp-org">IELTSwithMOURAD \u00b7 <b>Mourad Mekki Teacher Toolkit</b></p>'+
      '<div class="t2w-lp-stats">'+
        '<div class="t2w-lp-chip"><b>10</b>guided stages</div>'+
        '<div class="t2w-lp-chip"><b>35+</b>interactive tasks</div>'+
        '<div class="t2w-lp-chip"><b>Band 7+</b>examiner lens</div>'+
        '<div class="t2w-lp-chip"><b>Clinic</b>Band 9 vs Band 5</div>'+
        '<div class="t2w-lp-chip"><b>Print</b>session summary</div>'+
      '</div>'+
      '<div class="t2w-lp-actions"></div>';
    var actions=lp.querySelector('.t2w-lp-actions');
    var startBtn=el('button','t2w-lp-btn primary');
    var resetBtn=el('button','t2w-lp-btn ghost','\u21bb Reset Workshop Progress');
    var sumBtn=el('button','t2w-lp-btn gold','\uD83D\uDDA8 Print Session Summary');
    var packBtn=el('button','t2w-lp-btn ghost','\uD83D\uDCDA Print Model Essay Pack');
    actions.appendChild(startBtn);actions.appendChild(resetBtn);actions.appendChild(sumBtn);actions.appendChild(packBtn);
    wrap.appendChild(lp);

    /* ---- progress strip ---- */
    var strip=el('div','t2w-progress-strip');
    var fill=el('i');fill.id='t2wProgressFill';strip.appendChild(fill);
    wrap.appendChild(strip);

    /* ---- mobile side toggle ---- */
    var sideToggle=el('button','t2w-side-toggle','\u2630 Stages & timer');
    wrap.appendChild(sideToggle);

    /* ---- two-column body ---- */
    var body=el('div','t2w-body');
    var side=el('aside','t2w-side');
    var sideInner=el('div','t2w-side-inner');

    var timerbox=el('div','t2w-timerbox');timerbox.id='t2wTimerWrap';
    timerbox.innerHTML='<span class="clock" id="t2wClock">00:00</span><span class="target">90:00<br>target</span>';
    var timerBtn=el('button','t2w-timerbtn','\u25b6 Start');timerBtn.id='t2wTimerBtn';
    timerbox.appendChild(timerBtn);
    sideInner.appendChild(timerbox);

    sideInner.appendChild(el('div','t2w-side-title','Workshop stages'));
    var navList=el('div');navList.id='t2wNavList';
    sideInner.appendChild(navList);

    if(S.role==='teacher'){
      var teach=el('div','t2w-teach');
      teach.appendChild(el('span','t2w-teach-l','Teacher controls'));
      var tNotes=el('button','t2w-cbtn','\uD83C\uDF93 Teacher notes \u2014 toggle');
      var tShow=el('button','t2w-cbtn','\u2713 Show answers in stage');
      var tHide=el('button','t2w-cbtn','\u2717 Hide answers in stage');
      var tReset=el('button','t2w-cbtn','\u21bb Reset this stage');
      teach.appendChild(tNotes);teach.appendChild(tShow);teach.appendChild(tHide);teach.appendChild(tReset);
      sideInner.appendChild(teach);
      tNotes.addEventListener('click',function(){var on=wrap.classList.toggle('t2w-show-teacher');tNotes.classList.toggle('active',on);});
      tShow.addEventListener('click',showAnswersInStage);
      tHide.addEventListener('click',hideAnswersInStage);
      tReset.addEventListener('click',function(){if(window.confirm('Reset all activities in this stage?'))resetStage();});
    }

    var resetAll=el('button','t2w-resetall','Reset all workshop progress');
    sideInner.appendChild(resetAll);
    side.appendChild(sideInner);

    var stageWrap=el('div','t2w-stage');
    var stage=el('div');stage.id='t2wStage';
    stageWrap.appendChild(stage);

    body.appendChild(side);body.appendChild(stageWrap);
    wrap.appendChild(body);
    host.appendChild(wrap);

    /* ---- wiring ---- */
    function updateStartLabel(){
      var any=SECTIONS.some(function(s){return state.completed[s.id];});
      startBtn.textContent=(any?'\u25b6 Continue Workshop':'\u25b6 Start Workshop');
    }
    updateStartLabel();
    startBtn.addEventListener('click',function(){
      var target=firstIncomplete();go(target);startTimer();updateStartLabel();
      if(stage&&stage.scrollIntoView)stage.scrollIntoView({behavior:'smooth',block:'start'});
    });
    timerBtn.addEventListener('click',function(){S.running?pauseTimer():startTimer();});
    sumBtn.addEventListener('click',function(){renderPrintSummary();printWith('summary');});
    packBtn.addEventListener('click',function(){buildPack(S.clinicIdx);printWith('pack');});
    function doResetAll(){
      if(window.confirm('Erase ALL saved progress, answers, scores and reflections for this student? This cannot be undone.')){
        state=blankState();saveState();
        pauseTimer();S.clinicIdx=0;S.current='warmup';
        renderStages();renderNav();updateProgress();tickRender();go('warmup');updateStartLabel();
        flash('All progress reset.');
      }
    }
    resetBtn.addEventListener('click',doResetAll);
    resetAll.addEventListener('click',doResetAll);
    sideToggle.addEventListener('click',function(){side.classList.toggle('is-collapsed');});
  }

  function render(host, user, role){
    if(!host)return;
    S.host=host;S.user=user||{};S.role=(role==='teacher'||role==='admin')?'teacher':'student';
    var uid=userId();
    if(S.builtFor===uid && host.querySelector('.t2-workshop')){
      return; // idempotent: already built for this user
    }
    loadState();
    if(S.clinicIdx==null)S.clinicIdx=0;
    S.current=firstIncomplete();
    buildShell(host);
    renderStages();
    renderNav();
    updateProgress();
    tickRender();
    go(S.current);
    S.builtFor=uid;
  }

  /* =====================================================================
     PUBLIC API
     ===================================================================== */
  window.MMWA_T2_WORKSHOP = {
    render: render,
    printSummary: function(){ renderPrintSummary(); printWith('summary'); },
    printModelPack: function(idx){ buildPack(typeof idx==='number'?idx:S.clinicIdx); printWith('pack'); },
    reset: function(){ state=blankState(); saveState(); if(S.host&&S.builtFor){ S.builtFor=null; render(S.host,S.user,S.role); } },
    /* Read a given student's saved progress without disturbing the in-view
       state — used by the platform's assignment system to show a status. */
    progressFor: function(user){
      var total = (SECTIONS && SECTIONS.length) || 1;
      var done = 0, elapsed = 0, started = false;
      try {
        var raw = localStorage.getItem(STORE_PREFIX + normUid(user));
        if (raw) {
          var st = JSON.parse(raw) || {};
          var comp = st.completed || {};
          done = SECTIONS.filter(function(s){ return comp[s.id]; }).length;
          elapsed = st.elapsed || 0;
          function any(o){ return o && typeof o === "object" && Object.keys(o).length > 0; }
          started = done > 0 || elapsed > 0 || any(st.answers) || any(st.clinic) || any(st.exit) || any(st.scores);
        }
      } catch (e) { /* storage blocked */ }
      var pct = Math.round(done / total * 100);
      return { done: done, total: total, pct: pct, started: started, elapsed: elapsed,
               status: done >= total ? "Completed" : (started ? "In progress" : "Not started") };
    }
  };

})();

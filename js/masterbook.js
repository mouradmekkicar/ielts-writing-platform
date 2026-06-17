/* ============================================================================
   IELTSwithMOURAD — Academic Writing Masterbook · ENGINE
   Part of Mourad Mekki Teacher Toolkit
   ----------------------------------------------------------------------------
   Turns MB_DATA (masterbook-data.js) into a premium, print-perfect A4 booklet,
   reusing the platform's existing .bk-* booklet styles and global print-sheet
   pipeline. Adds: an overlay with live preview + differentiated export
   selector, B/W + compact modes, an auto-built Answer Key, and a launcher in
   the Print Center.  Public API:  window.Masterbook.open(variant?) / .close()
   ============================================================================ */
(function () {
  "use strict";

  const DATA = window.MB_DATA;
  if (!DATA) { console.warn("[Masterbook] MB_DATA not found — load masterbook-data.js first."); return; }
  const { brand, parts, sections } = DATA;

  /* ---- differentiated exports ----------------------------------------- */
  const VARIANTS = [
    { key: "full",      label: "Full Masterbook",            note: "Everything — the complete booklet" },
    { key: "task1",     label: "Task 1 only",                note: "Charts, maps, processes + practice" },
    { key: "task2",     label: "Task 2 only",                note: "Essays, outlines, models + practice" },
    { key: "advanced",  label: "Advanced Band 7–8",          note: "Stronger models, C-level, outlines" },
    { key: "support",   label: "Weaker Student Support",     note: "Templates, B-level, simple models" },
    { key: "templates", label: "Templates only",             note: "Safe Task 1 & Task 2 frames" },
    { key: "bvocab",    label: "B-Level Vocabulary only",    note: "Simple, safe topic banks" },
    { key: "cvocab",    label: "C-Level Vocabulary only",    note: "Academic language by function" },
    { key: "models",    label: "Model essays only",          note: "Sentence banks + model answers" },
    { key: "practice",  label: "Practice activities only",   note: "Task 1 & Task 2 drills + key" },
    { key: "answers",   label: "Answer key only",            note: "All activity answers" },
  ];

  /* state */
  const state = {
    variant: "full",
    bw: false,
    compact: true,
    dividers: true,
    answers: true,
    cover: { prepared: "", group: "", date: "" },
  };

  /* ====================================================================== */
  /*  BLOCK RENDERERS                                                        */
  /* ====================================================================== */
  const esc = (s) => String(s == null ? "" : s);

  const RENDER = {
    p: (b) => `<p class="${b.lead ? "bk-lead" : "bk-para"}">${esc(b.html)}</p>`,
    h: (b) => `<h3 class="bk-h">${esc(b.text)}${b.target ? ` <span class="bk-target">${esc(b.target)}</span>` : ""}</h3>`,
    ul: (b) => `<ul class="bk-ul">${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`,
    ol: (b) => `<ol class="bk-ul bk-ol">${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>`,
    chips: (b) => `<div class="bk-chips">${b.items.map((i) => `<span class="bk-chip">${esc(i)}</span>`).join("")}</div>`,
    tip: (b) => `<p class="bk-tip">${esc(b.html)}</p>`,
    say: (b) => `<p class="bk-say">${esc(b.html)}</p>`,
    note: (b) => `<div class="bk-note avoid-break"><span class="bk-note-label">${esc(b.label)}</span>${esc(b.html)}</div>`,
    model: (b) => `<div class="bk-model avoid-break">${b.label ? `<span class="bk-note-label">${esc(b.label)}</span>` : ""}${b.paras.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`,
    table: (b) => {
      const head = b.head && b.head.length
        ? `<thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>` : "";
      const body = `<tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>`;
      return `<div class="bk-block"><table class="bk-table">${head}${body}</table></div>`;
    },
    vs: (b) => b.rows.map((row) => {
      const bad = Array.isArray(row) ? row[0] : row.bad;
      const good = Array.isArray(row) ? row[1] : row.good;
      return `<div class="bk-block avoid-break mb-vs">
        <p class="bk-weak"><span class="bk-tag bk-tag-bad">Weaker</span>${esc(bad)}</p>
        <p class="bk-better"><span class="bk-tag bk-tag-good">Stronger</span>${esc(good)}</p>
      </div>`;
    }).join(""),
    practice: (b) => {
      const items = b.items.map((it, n) => `
        <div class="bk-qitem">
          <p class="bk-qnum">${n + 1}. <span class="bk-q-q">${esc(it.q)}</span></p>
          <div class="bk-lines"><span class="bk-line"></span><span class="bk-line"></span></div>
        </div>`).join("");
      return `<div class="bk-practice avoid-break">
        <span class="bk-note-label">Activity ${esc(b.ref)} · ${esc(b.label)}</span>
        ${b.intro ? `<p class="bk-para">${esc(b.intro)}</p>` : ""}
        ${items}
      </div>`;
    },
  };

  const renderBlocks = (blocks) => blocks.map((b) => (RENDER[b.t] ? RENDER[b.t](b) : "")).join("");

  /* ====================================================================== */
  /*  PAGE BUILDERS                                                          */
  /* ====================================================================== */
  const brandMini = `<div class="bk-head-r">
      <span class="bk-brand-mini">IELTS<em>with</em>MOURAD</span>
      <span class="bk-brand-sub">Mourad Mekki Teacher Toolkit</span>
    </div>`;

  const coverPage = () => {
    const c = state.cover;
    const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    return `<section class="bk-page bk-cover">
      <div class="bk-cover-frame">
        <p class="bk-cover-kicker">${brand.name}</p>
        <p class="bk-cover-kicker mb-cover-sub2">${brand.sub}</p>
        <div class="bk-cover-mid">
          <h1 class="bk-cover-title">${brand.title}</h1>
          <p class="bk-cover-subtitle">${brand.subtitle}</p>
          <div class="bk-cover-rule"></div>
        </div>
        <div class="bk-cover-meta">
          <div><span>Edition</span><b>${brand.edition}</b></div>
          <div><span>Date</span><b>${c.date || today}</b></div>
          <div><span>Prepared for</span><b>${c.prepared || "IELTS Candidate"}</b></div>
          <div><span>Class / group</span><b>${c.group || "—"}</b></div>
        </div>
        <p class="bk-cover-foot">${brand.footer}</p>
      </div>
    </section>`;
  };

  const dividerPage = (part) => `<section class="bk-page bk-divider">
      <div class="bk-divider-inner">
        <p class="bk-cover-kicker">${esc(part.label)}</p>
        <h2 class="bk-divider-title">${esc(part.title)}</h2>
        <div class="bk-cover-rule"></div>
        <p class="bk-cover-foot">${brand.footer}</p>
      </div>
    </section>`;

  const contentPage = (sec, part, index) => `<section class="bk-page">
      <header class="bk-head">
        <div>
          <span class="bk-cat">${esc(part.label)} · ${esc(part.title)}</span>
          <h2 class="bk-title">${esc(index)}. ${esc(sec.title)}</h2>
        </div>
        ${brandMini}
      </header>
      <div class="bk-body">${renderBlocks(sec.blocks)}</div>
    </section>`;

  const tocPage = (ordered) => {
    let html = "";
    let lastPart = null;
    ordered.forEach((entry) => {
      if (entry.part.title !== lastPart) {
        html += `<li class="bk-toc-cat">${esc(entry.part.label)} · ${esc(entry.part.title)}</li>`;
        lastPart = entry.part.title;
      }
      html += `<li class="bk-toc-item">
        <span class="bk-toc-t">${esc(entry.index)}. ${esc(entry.sec.title)}</span>
        <span class="bk-toc-dots"></span>
        <span class="bk-toc-p">§${esc(entry.index)}</span>
      </li>`;
    });
    return `<section class="bk-page">
      <header class="bk-head">
        <div><span class="bk-cat">${brand.name} · ${brand.sub}</span><h2 class="bk-title">Contents</h2></div>
        ${brandMini}
      </header>
      <ul class="bk-toc-list">${html}</ul>
    </section>`;
  };

  /* ====================================================================== */
  /*  ANSWER KEY (auto-collected from included practice blocks)             */
  /* ====================================================================== */
  const collectAnswers = (includedSecs, variant) => {
    const source = variant === "answers" ? sections : includedSecs;
    const groups = [];
    source.forEach((sec) => {
      sec.blocks.forEach((b) => {
        if (b.t === "practice") {
          groups.push({
            ref: b.ref, label: b.label,
            items: b.items.map((it, n) => ({ n: n + 1, q: it.q, a: it.a })),
          });
        }
      });
    });
    return groups;
  };

  const answerKeyPage = (groups, index) => {
    const body = groups.map((g) => `
      <div class="bk-answer avoid-break">
        <span class="bk-answer-label">Activity ${esc(g.ref)} · ${esc(g.label)}</span>
        ${g.items.map((it) => `<p><b>${it.n}.</b> ${esc(it.a)}</p>`).join("")}
      </div>`).join("");
    return `<section class="bk-page">
      <header class="bk-head">
        <div><span class="bk-cat">${esc(parts.key.label)} · ${esc(parts.key.title)}</span><h2 class="bk-title">${esc(index)}. Answer Key</h2></div>
        ${brandMini}
      </header>
      <div class="bk-body"><p class="bk-para">Sample answers and model responses. Where a task is open, a strong sample is given — your own wording may differ and still be correct.</p>${body}</div>
    </section>`;
  };

  /* ====================================================================== */
  /*  BUILD                                                                  */
  /* ====================================================================== */
  const isIncluded = (sec, variant) => variant === "full" || (sec.v || []).includes(variant);

  function buildPages(variant) {
    const included = sections.filter((s) => isIncluded(s, variant));

    // order entries by the parts map order, keeping section order within a part
    const partOrder = Object.keys(parts);
    const ordered = [];
    let idx = 0;
    partOrder.forEach((pk) => {
      included.filter((s) => s.part === pk).forEach((s) => {
        idx += 1;
        ordered.push({ sec: s, part: parts[pk], index: idx });
      });
    });

    const answerGroups = collectAnswers(included, variant);
    const wantAnswers = variant === "answers" || (state.answers && answerGroups.length > 0);

    const pages = [];
    pages.push(coverPage());
    if (ordered.length + (wantAnswers ? 1 : 0) > 1) pages.push(tocPage(
      wantAnswers ? ordered.concat([{ sec: { title: "Answer Key" }, part: parts.key, index: idx + 1 }]) : ordered
    ));

    let lastPart = null;
    ordered.forEach((entry) => {
      if (state.dividers && entry.part.title !== lastPart) {
        pages.push(dividerPage(entry.part));
        lastPart = entry.part.title;
      }
      pages.push(contentPage(entry.sec, entry.part, entry.index));
    });

    if (wantAnswers) {
      if (state.dividers) pages.push(dividerPage(parts.key));
      pages.push(answerKeyPage(answerGroups, idx + 1));
    }

    return pages.join("");
  }

  const modeClass = () => `${state.bw ? " bk-bw" : ""}${state.compact ? " bk-compact" : ""}`;

  /* ====================================================================== */
  /*  OVERLAY UI                                                             */
  /* ====================================================================== */
  let overlay, previewPages, printSheet;

  function ensurePrintSheet() {
    printSheet = document.getElementById("mbBooklet");
    if (!printSheet) {
      printSheet = document.createElement("div");
      printSheet.id = "mbBooklet";
      printSheet.className = "print-sheet";
      printSheet.setAttribute("aria-hidden", "true");
      document.body.appendChild(printSheet);
    }
  }

  function buildOverlay() {
    overlay = document.createElement("div");
    overlay.className = "mb-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="mb-shell" role="dialog" aria-modal="true" aria-label="Writing Masterbook">
        <header class="mb-bar">
          <div class="mb-bar-brand">IELTS<em>with</em>MOURAD <span>· Writing Masterbook</span></div>
          <button class="mb-x" id="mbClose" aria-label="Close">&times;</button>
        </header>
        <div class="mb-grid">
          <aside class="mb-side">
            <h4 class="mb-side-h">Choose an export</h4>
            <div class="mb-variants" id="mbVariants"></div>

            <h4 class="mb-side-h">Layout options</h4>
            <label class="mb-toggle"><input type="checkbox" id="mbDividers" checked> Section dividers</label>
            <label class="mb-toggle"><input type="checkbox" id="mbAnswers" checked> Include answer key</label>
            <label class="mb-toggle"><input type="checkbox" id="mbCompact" checked> Compact spacing</label>
            <label class="mb-toggle"><input type="checkbox" id="mbBw"> Black &amp; white (ink-saver)</label>

            <h4 class="mb-side-h">Cover details (optional)</h4>
            <input class="mb-input" id="mbPrepared" placeholder="Prepared for (name)">
            <input class="mb-input" id="mbGroup" placeholder="Class / group">
            <input class="mb-input" id="mbDate" placeholder="Date (leave blank for today)">

            <div class="mb-actions">
              <button class="btn btn-gold" id="mbPrint">Save / Print PDF</button>
              <button class="btn btn-ghost" id="mbRefresh">Refresh preview</button>
            </div>
            <p class="mb-hint">To export a PDF, click <b>Save / Print PDF</b> and choose <b>“Save as PDF”</b> as the destination in the print dialog. Page numbers and footer branding are added automatically.</p>
          </aside>

          <main class="mb-main">
            <div class="booklet-preview">
              <div class="booklet-preview-pages" id="mbPreviewPages"></div>
            </div>
          </main>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    previewPages = overlay.querySelector("#mbPreviewPages");

    // variant radios
    const vWrap = overlay.querySelector("#mbVariants");
    vWrap.innerHTML = VARIANTS.map((v) => `
      <label class="mb-variant${v.key === state.variant ? " is-sel" : ""}" data-key="${v.key}">
        <input type="radio" name="mbVariant" value="${v.key}"${v.key === state.variant ? " checked" : ""}>
        <span class="mb-variant-main"><span class="mb-variant-t">${v.label}</span><span class="mb-variant-n">${v.note}</span></span>
      </label>`).join("");

    // events
    overlay.querySelector("#mbClose").addEventListener("click", close);
    overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => { if (!overlay.hidden && e.key === "Escape") close(); });

    vWrap.addEventListener("change", (e) => {
      if (e.target.name === "mbVariant") {
        state.variant = e.target.value;
        vWrap.querySelectorAll(".mb-variant").forEach((l) => l.classList.toggle("is-sel", l.dataset.key === state.variant));
        renderPreview();
      }
    });

    const bind = (id, fn) => overlay.querySelector(id).addEventListener("change", fn);
    bind("#mbDividers", (e) => { state.dividers = e.target.checked; renderPreview(); });
    bind("#mbAnswers", (e) => { state.answers = e.target.checked; renderPreview(); });
    bind("#mbCompact", (e) => { state.compact = e.target.checked; renderPreview(); });
    bind("#mbBw", (e) => { state.bw = e.target.checked; renderPreview(); });

    const coverBind = (id, key) => overlay.querySelector(id).addEventListener("input", (e) => { state.cover[key] = e.target.value; });
    coverBind("#mbPrepared", "prepared");
    coverBind("#mbGroup", "group");
    coverBind("#mbDate", "date");

    overlay.querySelector("#mbRefresh").addEventListener("click", renderPreview);
    overlay.querySelector("#mbPrint").addEventListener("click", printBooklet);
  }

  function renderPreview() {
    if (!previewPages) return;
    previewPages.className = "booklet-preview-pages" + modeClass();
    previewPages.innerHTML = buildPages(state.variant);
    const main = overlay.querySelector(".mb-main");
    if (main) main.scrollTop = 0;
  }

  /* ====================================================================== */
  /*  PRINT                                                                  */
  /* ====================================================================== */
  function printBooklet() {
    ensurePrintSheet();
    printSheet.className = "print-sheet" + modeClass();
    printSheet.innerHTML = buildPages(state.variant);
    document.body.classList.add("printing-masterbook");
    const cleanup = () => {
      document.body.classList.remove("printing-masterbook");
      printSheet.innerHTML = "";
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    setTimeout(() => { window.print(); }, 60);
  }

  /* ====================================================================== */
  /*  OPEN / CLOSE                                                           */
  /* ====================================================================== */
  function open(variant) {
    if (!overlay) { buildOverlay(); ensurePrintSheet(); }
    if (variant && VARIANTS.some((v) => v.key === variant)) {
      state.variant = variant;
      const radio = overlay.querySelector(`input[value="${variant}"]`);
      if (radio) { radio.checked = true; overlay.querySelectorAll(".mb-variant").forEach((l) => l.classList.toggle("is-sel", l.dataset.key === variant)); }
    }
    overlay.hidden = false;
    document.body.classList.add("mb-open");
    renderPreview();
  }

  function close() {
    if (overlay) overlay.hidden = true;
    document.body.classList.remove("mb-open");
  }

  /* ====================================================================== */
  /*  LAUNCHER (Print Center)                                                */
  /* ====================================================================== */
  const LAUNCHER_HTML = `
    <div class="mb-launch" id="mbLaunch">
      <div class="mb-launch-emblem" aria-hidden="true">✦</div>
      <div class="mb-launch-txt">
        <span class="mb-launch-kicker">Premium printable resource</span>
        <h3 class="mb-launch-title">Academic Writing Vocabulary &amp; Model Answer Masterbook</h3>
        <p class="mb-launch-sub">Task 1 + Task 2 vocabulary, safe templates, Band 8 outlines, model essays &amp; practice — with differentiated packs for weaker and stronger candidates.</p>
      </div>
      <button class="btn btn-gold mb-launch-btn" id="mbLaunchBtn">Generate IELTSwithMOURAD Writing Masterbook PDF</button>
    </div>`;

  function injectLauncher() {
    const pc = document.getElementById("view-printcenter");
    if (!pc || !pc.classList.contains("is-active")) return;
    if (pc.querySelector("#mbLaunch")) return;
    const holder = document.createElement("div");
    holder.innerHTML = LAUNCHER_HTML;
    const node = holder.firstElementChild;
    pc.insertBefore(node, pc.firstChild);
    node.querySelector("#mbLaunchBtn").addEventListener("click", () => open("full"));
  }

  function watchPrintCenter() {
    const pc = document.getElementById("view-printcenter");
    if (!pc) return;
    const obs = new MutationObserver(() => injectLauncher());
    obs.observe(pc, { attributes: true, attributeFilter: ["class"], childList: true });
    injectLauncher();
  }

  /* ---- init ----------------------------------------------------------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchPrintCenter);
  } else {
    watchPrintCenter();
  }

  window.Masterbook = { open, close };
  window.openMasterbook = open; // convenience for wiring to a nav button
})();

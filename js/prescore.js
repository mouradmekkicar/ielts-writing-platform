/* ==========================================================================
   IELTSwithMOURAD — PRE-SCORING GATEKEEPER  (prescore.js)
   --------------------------------------------------------------------------
   A rule-based validation layer that runs BEFORE any band scorer (local
   heuristic OR the Groq Edge Function). Language models tend to be generous
   and will award a band even to a non-attempt, so this gate is the single
   authority on whether a response is a real essay attempt at all.

   What it does:
     1. Prompt-copy detection  — finds runs of the answer copied from the
        task prompt/instructions and excludes them from the word count.
     2. Repetition detection   — finds duplicated sentences/phrases.
     3. Original word count     — words the candidate actually produced,
        after removing copied prompt text and repeated sentences.
     4. Non-attempt rule        — if nothing original remains, force Band 0.
     5. Very-short / cap ladder — caps the band when little original writing
        exists, per IELTS practice (copied input is not the candidate's work).

   The module is framework-free and runs in the browser (window.AttemptValidator)
   and in Node / Deno (module.exports / globalThis). It has NO dependencies.

   IELTS basis: examiners disregard text copied from the input material; a
   response that is wholly copied is treated as not the candidate's own work
   and is not assessable as an essay. This gate encodes that rule numerically.
   ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.AttemptValidator = api;
})(typeof self !== "undefined" ? self : (typeof globalThis !== "undefined" ? globalThis : this), function () {
  "use strict";

  /* How many consecutive words must match the prompt to count as "copied".
     5 is long enough that a genuine paraphrase will not trip it, but short
     enough to catch any real copied clause. */
  var COPY_NGRAM = 5;

  /* Generic IELTS rubric phrases. Even if the stored prompt is slightly
     different from what the student saw, these instruction fragments are
     always treated as non-original (they are task wording, not the answer). */
  var RUBRIC_PHRASES = [
    "to what extent do you agree or disagree",
    "discuss both views and give your own opinion",
    "give reasons for your answer and include any relevant examples",
    "from your own knowledge or experience",
    "do the advantages of this trend outweigh the disadvantages",
    "do the advantages outweigh the disadvantages",
    "what are the causes of this problem and what measures could be taken",
    "summarise the information by selecting and reporting the main features",
    "and make comparisons where relevant",
    "write at least 250 words",
    "write at least 150 words",
    "what is your opinion"
  ];

  function normToken(w) {
    return String(w).toLowerCase().replace(/[^\p{L}\p{N}']+/gu, "");
  }

  /* Split into normalized word tokens (lowercase, punctuation stripped). */
  function words(text) {
    var m = String(text || "").toLowerCase().match(/[\p{L}\p{N}']+/gu);
    return m || [];
  }

  /* Split into sentences, normalized for duplicate comparison. */
  function sentences(text) {
    var raw = String(text || "").match(/[^.!?\n]+[.!?]*/g) || [];
    return raw.map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function sentenceKey(s) { return words(s).join(" "); }

  /* Build the set of N-grams that appear in the prompt + rubric phrases. */
  function buildPromptNgrams(promptText, n) {
    var set = Object.create(null);
    var sources = [String(promptText || "")].concat(RUBRIC_PHRASES);
    sources.forEach(function (src) {
      var toks = words(src);
      for (var i = 0; i + n <= toks.length; i++) {
        set[toks.slice(i, i + n).join(" ")] = true;
      }
    });
    return set;
  }

  /* Mark which student tokens fall inside a run copied from the prompt.
     Returns a boolean array, one flag per student token. */
  function markCopied(studentToks, promptNgrams, n) {
    var copied = new Array(studentToks.length).fill(false);
    if (studentToks.length < n) {
      // Too short for an n-gram match — fall back to: if the whole thing is a
      // contiguous sub-sequence of the prompt, treat it as copied.
      return copied;
    }
    for (var i = 0; i + n <= studentToks.length; i++) {
      var gram = studentToks.slice(i, i + n).join(" ");
      if (promptNgrams[gram]) {
        for (var j = i; j < i + n; j++) copied[j] = true;
      }
    }
    return copied;
  }

  /* MAIN ENTRY POINT.
     analyzeAttempt(studentText, promptText, minWords, kind) -> report object */
  function analyzeAttempt(studentText, promptText, minWords, kind) {
    minWords = minWords || (kind === "task1" ? 150 : 250);
    var isTask1 = kind === "task1";

    var studentToks = words(studentText);
    var submittedWords = studentToks.length;

    var promptNgrams = buildPromptNgrams(promptText, COPY_NGRAM);
    var copiedFlags = markCopied(studentToks, promptNgrams, COPY_NGRAM);
    var copiedWords = copiedFlags.filter(Boolean).length;

    /* ---- Repetition: tokens that belong to a duplicated sentence ----
       The first occurrence of a sentence is "original"; every repeat is not.
       We approximate which token indices are repeats by walking sentences. */
    var sents = sentences(studentText);
    var seen = Object.create(null);
    var repeatedWordCount = 0;
    var dupSentenceCount = 0;
    sents.forEach(function (s) {
      var key = sentenceKey(s);
      if (!key) return;
      var wlen = words(s).length;
      if (seen[key]) { repeatedWordCount += wlen; dupSentenceCount++; }
      seen[key] = (seen[key] || 0) + 1;
    });

    /* ---- Original word count ----
       Original = submitted − copied-from-prompt − repeated-sentence words.
       Clamp at zero; copied and repeated sets can overlap, so we never let
       the sum exceed the submitted count. */
    var nonOriginal = Math.min(submittedWords, copiedWords + repeatedWordCount);
    var originalWords = Math.max(0, submittedWords - nonOriginal);

    var copiedPct = submittedWords ? Math.round((copiedWords / submittedWords) * 100) : 0;
    var repetitionPct = submittedWords ? Math.round((repeatedWordCount / submittedWords) * 100) : 0;
    var underLength = submittedWords < minWords;

    /* ---- Decision ---------------------------------------------------- */
    var reasons = [];
    var caps = []; // collect every applicable cap; final cap is the minimum
    var nonAttempt = false;

    if (submittedWords === 0) {
      nonAttempt = true;
      reasons.push("No text was submitted.");
    } else if (originalWords === 0) {
      nonAttempt = true;
      reasons.push("The response is entirely copied prompt text and/or repeated sentences — no original writing remains.");
    } else if (copiedPct >= 80 && originalWords < 10) {
      nonAttempt = true;
      reasons.push("Over " + copiedPct + "% of the response is copied prompt text, leaving almost no original writing.");
    } else if (repetitionPct >= 85 && originalWords <= 10) {
      nonAttempt = true;
      reasons.push("Most of the response (" + repetitionPct + "%) is the same sentence repeated, with almost no distinct content.");
    }

    if (!nonAttempt) {
      // Original-word ladder (copied prompt words are NOT counted as the
      // candidate's own work, so the ladder runs on originalWords).
      if (originalWords >= 1 && originalWords <= 20) { caps.push(1); reasons.push("Only " + originalWords + " original words — far below an essay attempt (cap Band 1)."); }
      else if (originalWords <= 50) { caps.push(2); reasons.push("Only " + originalWords + " original words — no developed answer (cap Band 2)."); }
      else if (originalWords <= 100) { caps.push(3); reasons.push("Only " + originalWords + " original words — underdeveloped (cap Band 3)."); }

      // Severe repetition or heavy copying with some original content.
      if (repetitionPct >= 50) { caps.push(4); reasons.push("Severe repetition: " + repetitionPct + "% of the response repeats earlier sentences (cap Band 4)."); }
      if (copiedPct >= 50 && originalWords <= 120) { caps.push(4); reasons.push(copiedPct + "% of the response is copied from the prompt (cap Band 4)."); }
      // Over 100 original words but still mostly recycled/irrelevant material.
      if (originalWords > 100 && (repetitionPct >= 30 || copiedPct >= 30)) { caps.push(4); reasons.push("Mostly repetitive or copied content despite the length (cap Band 4)."); }
    }

    var bandCap = caps.length ? Math.min.apply(null, caps) : null;

    var decision;
    if (nonAttempt) decision = "Band 0 — non-attempt (copied / repeated prompt)";
    else if (bandCap !== null) decision = "Capped at Band " + bandCap;
    else decision = "No cap — passed to band scorer";

    return {
      submittedWords: submittedWords,
      copiedWords: copiedWords,
      originalWords: originalWords,
      copiedPct: copiedPct,
      repetitionPct: repetitionPct,
      duplicateSentences: dupSentenceCount,
      underLength: underLength,
      minWords: minWords,
      nonAttempt: nonAttempt,
      bandCap: bandCap,            // null = trust the scorer; otherwise hard ceiling
      reasons: reasons,
      decision: decision
    };
  }

  /* Round to nearest 0.5 and keep within [0, ceiling]. Unlike the app's
     clampBand, this can return values below 4 (and 0), which the gate needs. */
  function clampTo(band, ceiling) {
    var b = Math.round(band * 2) / 2;
    if (typeof ceiling === "number") b = Math.min(b, ceiling);
    return Math.max(0, Math.min(9, b));
  }

  /* Apply the gate to a finished diagnostic object (shape produced by the
     local engine OR returned by Groq). Mutates a COPY and returns it.
     - nonAttempt -> all criteria + overall = 0, replace narrative.
     - bandCap    -> clamp every criterion + overall down to the ceiling. */
  function applyGate(diagnostic, gate, kind) {
    var fb = Object.assign({}, diagnostic);
    fb.gate = gate;

    if (!gate || (!gate.nonAttempt && gate.bandCap === null)) return fb; // nothing to do

    var trLabel = kind === "task1" ? "Task Achievement" : "Task Response";

    if (gate.nonAttempt) {
      fb.estimatedBand = 0;
      fb.criteria = {
        taskAchievement: { band: 0, label: trLabel },
        coherenceCohesion: { band: 0, label: "Coherence & Cohesion" },
        lexicalResource: { band: 0, label: "Lexical Resource" },
        grammaticalRange: { band: 0, label: "Grammatical Range & Accuracy" }
      };
      fb.nonAttempt = true;
      fb.warning = "Non-attempt detected: copied / repeated prompt text.";
      fb.strengths = [];
      fb.weaknesses = [
        "Your response is not a valid essay attempt. You copied and repeated the task prompt instead of answering the question.",
        "In IELTS Writing, copied prompt words are not counted. You need to write your own introduction, opinion, body paragraphs, examples, and conclusion."
      ];
      fb.errors = [];
      fb.sentenceCorrections = [];
      fb.vocabUpgrades = [];
      fb.grammarUpgrades = [];
      fb.nextRecommendation = "Re-read the question, then plan and write your own essay: an introduction that paraphrases the prompt in your own words, two body paragraphs each with one idea and an example, and a conclusion.";
      fb.studentSummary = "This response cannot be scored as an essay because it only copies/repeats the task prompt. Copied prompt words are not counted in IELTS Writing.";
    } else {
      var cap = gate.bandCap;
      var c = fb.criteria || {};
      ["taskAchievement", "coherenceCohesion", "lexicalResource", "grammaticalRange"].forEach(function (k) {
        if (c[k] && typeof c[k].band === "number") c[k].band = clampTo(c[k].band, cap);
      });
      fb.estimatedBand = clampTo(typeof fb.estimatedBand === "number" ? fb.estimatedBand : cap, cap);
      fb.bandCap = cap;
      fb.warning = "Band capped at " + cap + ": " + gate.reasons.join(" ");
      fb.weaknesses = [gate.reasons[0]].concat(fb.weaknesses || []).slice(0, 3);
    }

    // Teacher analytics line, regardless of branch.
    fb.teacherSummary = "GATE: " + gate.decision +
      ". Submitted " + gate.submittedWords + " words; ~" + gate.copiedWords + " copied prompt words; ~" +
      gate.originalWords + " original words; repetition " + gate.repetitionPct + "%." +
      (fb.teacherSummary ? " (Scorer note: " + fb.teacherSummary + ")" : "");

    return fb;
  }

  return {
    analyzeAttempt: analyzeAttempt,
    applyGate: applyGate,
    clampTo: clampTo,
    COPY_NGRAM: COPY_NGRAM
  };
});

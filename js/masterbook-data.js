/* ============================================================================
   IELTSwithMOURAD — Academic Writing Masterbook · CONTENT LAYER
   Part of Mourad Mekki Teacher Toolkit
   ----------------------------------------------------------------------------
   This file holds ALL masterbook content as plain, declarative data so it is
   easy to edit, expand, remove or reorder. The engine (masterbook.js) turns
   these block objects into the printable A4 booklet using the platform's
   existing .bk-* booklet styles.

   BLOCK FACTORIES (use these when authoring — keeps content concise + tidy):
     P(html)                       paragraph
     LEAD(html)                    intro lead paragraph (slightly larger)
     H(text [,target])            sub-heading (target = small italic note)
     UL(...items)                 bullet list
     OL(...items)                 numbered list
     CHIPS(...items)              pill chips (vocabulary clusters)
     NOTE(label, html)            highlighted note box
     TIP(html)                    italic tip line
     MODEL(label, ...paras)       model-answer box (navy/gold)
     VOCAB(label, ...paras)       same look as MODEL, used for worked examples
     TABLE([head], [[row]])       data / upgrade table
     VS(...[bad, good])           weak vs. stronger comparison rows
     PRACTICE(ref, label, intro, [{q, a}])   practice activity (answers auto-
                                  collected into the Answer Key)
     SAY(html)                    supportive "coach" line

   VARIANT TAGS (section.v) decide which export each section appears in:
     task1 task2 advanced support templates bvocab cvocab models practice
   ("full" always includes everything; cover, contents, dividers + answer key
   are generated automatically.)
   ============================================================================ */
(function () {
  "use strict";

  /* ---- block factories ------------------------------------------------- */
  const P = (html) => ({ t: "p", html });
  const LEAD = (html) => ({ t: "p", html, lead: true });
  const H = (text, target) => ({ t: "h", text, target });
  const UL = (...items) => ({ t: "ul", items });
  const OL = (...items) => ({ t: "ol", items });
  const CHIPS = (...items) => ({ t: "chips", items });
  const NOTE = (label, html) => ({ t: "note", label, html });
  const TIP = (html) => ({ t: "tip", html });
  const MODEL = (label, ...paras) => ({ t: "model", label, paras });
  const VOCAB = (label, ...paras) => ({ t: "model", label, paras });
  const TABLE = (head, rows) => ({ t: "table", head, rows });
  const VS = (...rows) => ({ t: "vs", rows });
  const PRACTICE = (ref, label, intro, items) => ({ t: "practice", ref, label, intro, items });
  const SAY = (html) => ({ t: "say", html });

  /* ====================================================================== */
  /*  BRAND                                                                  */
  /* ====================================================================== */
  const brand = {
    name: "IELTSwithMOURAD",
    sub: "Part of Mourad Mekki Teacher Toolkit",
    footer: "IELTSwithMOURAD · Mourad Mekki Teacher Toolkit",
    title: "Academic Writing Vocabulary & Model Answer Masterbook",
    subtitle: "Task 1 + Task 2 Vocabulary, Templates, Outlines, Model Essays & Practice",
    edition: "Coaching Edition",
  };

  /* ====================================================================== */
  /*  PARTS (used for the contents page + section dividers)                  */
  /* ====================================================================== */
  const parts = {
    start:   { label: "Part I",   title: "Getting Started" },
    pathway: { label: "Part II",  title: "The Support Pathway" },
    tmpl:    { label: "Part III", title: "Safe Writing Templates" },
    t1:      { label: "Part IV",  title: "Academic Writing — Task 1" },
    t2:      { label: "Part V",   title: "Academic Writing — Task 2" },
    review:  { label: "Part VI",  title: "Review & Practice" },
    key:     { label: "Part VII", title: "Answer Key" },
  };

  /* ====================================================================== */
  /*  SECTIONS                                                               */
  /* ====================================================================== */
  const sections = [];
  const S = (def) => sections.push(def);

  /* ----------------------------------------------------------------------
     PART I — GETTING STARTED
     ---------------------------------------------------------------------- */

  S({
    id: "how-to",
    part: "start",
    title: "How to Use This Masterbook",
    v: ["task1", "task2", "advanced", "support", "templates", "models", "practice"],
    blocks: [
      LEAD("This masterbook is not a word list. It is a complete coaching pack that teaches you <b>what to write, how to start, and how to improve</b> in IELTS Academic Writing Task 1 and Task 2. Work through it slowly — a few pages at a time — and write something every day."),
      H("Three ways to use it"),
      UL(
        "<b>If you find writing difficult</b> — start at <i>“If Writing Is Difficult for You, Start Here”</i>, then use the <i>Safe Writing Templates</i> and the <i>Simple Models</i>. Build confidence with correct, clear sentences first.",
        "<b>If you are aiming for Band 7–8</b> — study the <i>Band 8 Outlines</i>, the <i>C-Level Vocabulary</i>, the stronger models, and the <i>Common Mistakes</i> section. Push for precision, not difficulty.",
        "<b>If you are teaching with it</b> — print the differentiated packs from the platform (Task 1 only, Weaker Student Support, Advanced Band 7–8, and so on) and set the practice activities for class or homework."
      ),
      NOTE("The golden rule", "A simple <b>correct</b> sentence always beats an advanced <b>wrong</b> one. Accuracy comes before complexity. Every page in this book is built on that idea."),
      H("How the levels are marked"),
      UL(
        "<b>Safe / B-level</b> language is what every candidate can use accurately — your foundation.",
        "<b>Stronger / C-level</b> language lifts a well-written answer toward Band 7–8 — add it only when you can control it.",
        "Each model is shown in a <b>simple version first</b> and a <b>stronger version</b> afterwards, with a short note on exactly what improved."
      ),
      TIP("Don’t try to memorise whole essays. Memorise <i>patterns</i> — frames, linkers, and a small set of accurate phrases you can reuse on any topic."),
    ],
  });

  S({
    id: "start-here",
    part: "start",
    title: "If Writing Is Difficult for You, Start Here",
    v: ["task1", "task2", "support"],
    blocks: [
      SAY("If writing in English feels hard, you are not alone — and you do not need rare, difficult words to get a good score. You need <b>clear, correct, organised</b> writing. This page shows you a calm, reliable way to begin."),
      H("Ten things to remember"),
      OL(
        "You do <b>not</b> need very difficult words to get a good score.",
        "Clear writing is better than complicated writing full of mistakes.",
        "Learn a few <b>safe sentence patterns</b> first, then reuse them.",
        "Use <b>one clear idea per paragraph</b> — no more.",
        "In Task 1, describe the <b>biggest changes</b>, not every single number.",
        "In Task 2, explain your ideas <b>step by step</b>: idea → why → example.",
        "Upgrade your language <b>slowly</b>, one phrase at a time.",
        "<b>Accuracy comes before complexity.</b>",
        "A simple correct sentence beats an advanced wrong sentence.",
        "You improve by learning templates, practising outlines, and upgrading vocabulary gradually — not overnight."
      ),
      NOTE("Your first month plan", "Week 1 — learn the templates. Week 2 — write using the simple models. Week 3 — start replacing simple words with stronger ones from the upgrade tables. Week 4 — write full answers from a blank page and check them against the models."),
      H("A safe way to start any answer"),
      UL(
        "<b>Task 1:</b> 1 sentence introduction → 1–2 sentence overview → 2 body paragraphs with the key data.",
        "<b>Task 2:</b> introduction (paraphrase + opinion) → body 1 (one idea, explained, example) → body 2 (one idea, explained, example) → short conclusion."
      ),
      SAY("Trust the process. Hundreds of students have moved from “I don’t know how to start” to a confident, organised answer using exactly these steps."),
    ],
  });

  /* ----------------------------------------------------------------------
     PART II — THE SUPPORT PATHWAY
     ---------------------------------------------------------------------- */

  S({
    id: "pathway",
    part: "pathway",
    title: "IELTS Writing Support Pathway: From Simple to Advanced",
    v: ["task1", "task2", "advanced", "support"],
    blocks: [
      LEAD("This pathway shows you how to move from <b>safe, basic writing</b> to <b>stronger IELTS writing</b> in three stages. Master each level before moving on. You can stay at Level 1 and still write a clear, correct answer."),

      H("Level 1 — Safe Basic IELTS Language", "B1/B2 · correct and clear"),
      P("These sentences are simple but accurate. Weaker students can use them safely while building toward higher bands."),
      H("Task 1 — safe sentences"),
      UL(
        "The number increased.",
        "The figure went down.",
        "The percentage stayed the same.",
        "The highest figure was recorded in 2020.",
        "The lowest percentage was for transport.",
        "Overall, there was a clear increase.",
        "Overall, the area changed a lot.",
        "The process has several stages.",
        "The process begins with [stage 1] and ends with [final stage]."
      ),
      H("Task 2 — safe sentences"),
      UL(
        "This is a serious problem.",
        "There are several reasons for this.",
        "One possible solution is better education.",
        "I believe this is a positive development.",
        "Governments should take action.",
        "This can improve people’s lives.",
        "This can have a negative effect on children.",
        "One advantage is that it saves time.",
        "One disadvantage is that it can be expensive."
      ),
      NOTE("Basic → Better → Advanced", "Every safe phrase can be upgraded. Build the ladder slowly:"),
      TABLE(["Basic", "Better", "Advanced"], [
        ["The number went up a lot.", "The figure increased significantly.", "The figure rose substantially over the period."],
        ["This is a big problem.", "This is a serious problem.", "This remains a significant issue in many societies."],
        ["A lot of people think this.", "Many people believe this.", "It is widely believed that…"],
        ["It is good for the economy.", "It benefits the economy.", "It can stimulate economic growth."],
      ]),

      H("Level 2 — B-Level Vocabulary Banks", "useful, repeatable, safe"),
      P("For students who are not ready for C1/C2 vocabulary yet. Learn these first — they work on almost every topic."),
      VOCAB("Worked examples",
        "<b>Education</b> — basic: <i>school</i> → better: <i>education system</i>. <i>A strong education system helps young people find better jobs.</i>",
        "<b>Environment</b> — basic: <i>pollution</i> → better: <i>air pollution / environmental damage</i>. <i>Air pollution can cause serious health problems.</i>",
        "<b>Work</b> — basic: <i>job</i> → better: <i>employment</i>. <i>Stable employment can improve people’s quality of life.</i>"
      ),
      TIP("Don’t overload yourself with rare academic words. Safe, useful, repeatable vocabulary first — then upgrade."),

      H("Level 3 — Upgrade Path from B-Level to C-Level", "the most useful tables in this book"),
      P("Keep these tables beside you when you write. Replace one simple word at a time — and only when you can use the stronger word correctly."),
      H("General upgrade table"),
      TABLE(["Simple language", "Better IELTS language", "Stronger model sentence"], [
        ["good", "beneficial / useful", "This policy could be beneficial for low-income families."],
        ["bad", "harmful / negative", "Excessive screen time can have harmful effects on children."],
        ["big problem", "serious issue", "Unemployment remains a serious issue in many cities."],
        ["help", "support / improve", "Public transport can improve access to work and education."],
        ["many people", "a large number of people", "A large number of people now rely on digital communication."],
        ["rich people", "wealthy individuals", "Wealthy individuals often have greater access to private education."],
        ["poor people", "low-income families", "Low-income families may struggle to afford university fees."],
        ["kids", "children / young people", "Young people need guidance when using social media."],
        ["old people", "elderly people / older adults", "Older adults may need better access to healthcare."],
        ["money from government", "public funding", "Public funding should be used to improve essential services."],
      ]),
      H("Task 1 — trend language upgrade"),
      TABLE(["Simple", "Better", "Stronger"], [
        ["went up", "increased / rose", "rose steadily / climbed gradually"],
        ["went up fast", "increased a lot", "increased sharply / surged"],
        ["went down", "decreased / fell", "declined gradually / dropped steadily"],
        ["went down fast", "fell a lot", "fell sharply / plummeted"],
        ["stayed the same", "remained stable", "remained relatively constant / levelled off"],
        ["the most", "the highest figure", "accounted for the largest proportion"],
      ]),
      H("Task 1 — comparison & map/process language upgrade"),
      TABLE(["Simple", "Better", "Stronger"], [
        ["bigger than", "higher than", "considerably higher than / roughly twice as high as"],
        ["a small part", "a small proportion", "a relatively minor share of the total"],
        ["they built a road", "a road was built", "a new road was constructed, improving access"],
        ["they removed the trees", "the trees were removed", "the woodland was cleared to make way for housing"],
        ["first they do X", "the process begins with X", "the process commences with X, after which…"],
        ["at the end", "in the final stage", "in the concluding stage, the product is packaged"],
      ]),
      H("Task 2 — opinion & argument language upgrade"),
      TABLE(["Simple", "Better", "Stronger"], [
        ["I think", "I believe / In my view", "I would argue that…"],
        ["This is good because", "This is beneficial because", "This is advantageous in that…"],
        ["This causes problems", "This leads to problems", "This can give rise to serious difficulties"],
        ["We should fix this", "We should address this", "This issue must be tackled at its root"],
        ["For example", "For instance / A clear example is", "A striking illustration of this is…"],
        ["So", "Therefore / As a result", "Consequently / It follows that…"],
      ]),
    ],
  });

  /* ----------------------------------------------------------------------
     PART III — SAFE WRITING TEMPLATES
     ---------------------------------------------------------------------- */

  S({
    id: "tmpl-t1",
    part: "tmpl",
    title: "Safe IELTS Writing Templates — Task 1",
    v: ["task1", "templates", "support"],
    blocks: [
      LEAD("These templates help you write a complete Task 1 report without memorising unnatural language. Replace the [bracketed] parts with information from your chart. Keep them flexible — adapt, don’t recite."),
      NOTE("Every Task 1 report has four parts", "Introduction (paraphrase the question) → Overview (the big picture, no numbers needed) → Body 1 (key detail) → Body 2 (key detail). Aim for 160–190 words."),

      H("Basic report template (works for most charts)"),
      MODEL("Template",
        "<b>Introduction:</b> The [chart/graph/table/map/diagram] shows [what it shows] in [place / time period].",
        "<b>Overview:</b> Overall, [main trend / change 1]. Also, [main trend / change 2].",
        "<b>Body 1:</b> In terms of [category / group], [main detail]. For example, [data].",
        "<b>Body 2:</b> By contrast, [second main detail]. The highest figure was [X], while the lowest was [Y]."
      ),

      H("Dynamic chart template", "line graph / bar chart over time"),
      MODEL("Template",
        "The [line graph / bar chart] shows changes in [topic] between [year] and [year].",
        "Overall, [main trend]. Also, [second main trend / comparison].",
        "At the beginning of the period, [category] stood at [number]. It then [increased / decreased / fluctuated] to [number] by [year].",
        "Meanwhile, [second category] [trend]. By the end of the period, [final comparison]."
      ),

      H("Static chart template", "comparison at one point in time"),
      MODEL("Template",
        "The [bar chart / pie chart / table] compares [categories] in terms of [topic].",
        "Overall, [highest category] had the highest figure, while [lowest category] had the lowest. Another noticeable point is that [main comparison].",
        "[Category 1] recorded [number], which was higher / lower than [category 2]. In comparison, [category 3] stood at [number]."
      ),

      H("Map template", "changes between two maps"),
      MODEL("Template",
        "The maps show changes in [place] between [year] and [year].",
        "Overall, the area became more [developed / modern / residential / commercial]. The biggest changes were [change 1] and [change 2].",
        "In the [north / south / east / west / centre], [feature] was [built / removed / replaced / expanded]. In addition, [second change].",
        "Some features remained unchanged, including [feature], while [old feature] was converted into [new feature]."
      ),

      H("Process template", "how something is made or how it happens"),
      MODEL("Template",
        "The diagram shows how [product / process] is made.",
        "Overall, the process has [number] main stages, beginning with [first stage] and ending with [final stage].",
        "First, [stage 1]. After that, [stage 2]. Next, [stage 3].",
        "In the final stages, [stage 4]. Finally, [final product / result]."
      ),

      H("Pie chart & table reminders"),
      UL(
        "<b>Pie charts:</b> describe proportions, not raw counts — “accounted for”, “made up”, “the largest share”.",
        "<b>Tables:</b> never list every cell. Choose the highest, the lowest, and one clear pattern, then compare.",
        "<b>Mixed charts:</b> write ONE overview that connects both visuals; then give each visual its own body paragraph."
      ),
    ],
  });

  S({
    id: "tmpl-t2",
    part: "tmpl",
    title: "Safe IELTS Writing Templates — Task 2",
    v: ["task2", "templates", "support"],
    blocks: [
      LEAD("Simple, exam-safe templates for every major Task 2 essay type. They are flexible frames, not scripts — change the wording so it sounds natural. Aim for 260–290 words."),

      H("Opinion essay"),
      MODEL("Template",
        "<b>Introduction:</b> Some people believe that [topic]. I agree / disagree with this view because [reason 1] and [reason 2].",
        "<b>Body 1:</b> The first reason is that [main idea]. This means that [explanation]. For example, [example]. Therefore, [link back to opinion].",
        "<b>Body 2:</b> Another reason is that [main idea]. This can help / cause [result]. For instance, [example]. As a result, [link back to opinion].",
        "<b>Conclusion:</b> In conclusion, I believe that [clear opinion] because [reason 1] and [reason 2]."
      ),

      H("Discussion essay (discuss both views)"),
      MODEL("Template",
        "<b>Introduction:</b> Some people believe that [view 1], while others think that [view 2]. This essay will discuss both views and explain why I believe [your opinion].",
        "<b>Body 1:</b> On the one hand, some people think that [view 1]. This is because [reason]. For example, [example].",
        "<b>Body 2:</b> On the other hand, others believe that [view 2]. This view is stronger because [reason]. For instance, [example].",
        "<b>Conclusion:</b> In conclusion, both views have some value, but I believe that [your opinion] because [main reason]."
      ),

      H("Advantages & disadvantages essay"),
      MODEL("Template",
        "<b>Introduction:</b> Nowadays, [topic] is becoming more common. This essay will discuss the advantages and disadvantages of this development.",
        "<b>Body 1:</b> One advantage is that [advantage]. This means that [explanation]. For example, [example].",
        "<b>Body 2:</b> However, one disadvantage is that [disadvantage]. This can lead to [result]. For instance, [example].",
        "<b>Conclusion:</b> In conclusion, [topic] has both benefits and drawbacks. Overall, I believe that [balanced final idea]."
      ),

      H("Problem & solution essay"),
      MODEL("Template",
        "<b>Introduction:</b> [Topic / problem] is a serious issue in many places. This essay will explain the main problems and suggest possible solutions.",
        "<b>Body 1:</b> One major problem is that [problem]. This can cause [result]. For example, [example].",
        "<b>Body 2:</b> One possible solution is to [solution]. This would help because [explanation]. Governments / schools / individuals could also [second solution].",
        "<b>Conclusion:</b> In conclusion, [problem] can cause [main effect], but it can be reduced if [main solution]."
      ),

      H("Cause & effect essay"),
      MODEL("Template",
        "<b>Introduction:</b> [Topic] has become more common in recent years. This essay will explain the main causes and effects of this issue.",
        "<b>Body 1:</b> One main cause is [cause]. This happens because [explanation]. Another reason is [second cause].",
        "<b>Body 2:</b> As a result, [effect]. This can affect [people / society / the environment] because [explanation].",
        "<b>Conclusion:</b> In conclusion, [topic] is mainly caused by [cause 1] and [cause 2], and it can lead to [main effect]."
      ),

      H("Two-part question essay"),
      MODEL("Template",
        "<b>Introduction:</b> The issue of [topic] raises two important questions: [question 1] and [question 2]. This essay will answer both questions.",
        "<b>Body 1:</b> Regarding the first question, [answer]. This is because [reason]. For example, [example].",
        "<b>Body 2:</b> As for the second question, [answer]. This means that [explanation]. For instance, [example].",
        "<b>Conclusion:</b> In conclusion, [answer to question 1] and [answer to question 2]."
      ),
    ],
  });

  /* ----------------------------------------------------------------------
     PART IV — TASK 1
     ---------------------------------------------------------------------- */

  S({
    id: "t1-core-vocab",
    part: "t1",
    title: "Task 1 Core Vocabulary Banks",
    v: ["task1", "models"],
    blocks: [
      LEAD("This is the engine room of Task 1. Master these six banks — trend, degree, speed, comparison, approximation, ranking — and you can describe almost any chart accurately."),

      H("A · Trend verbs", "what the data does"),
      CHIPS("increase", "rise", "grow", "climb", "surge", "soar", "rocket", "decline", "fall", "drop", "decrease", "dip", "fluctuate", "vary", "remain stable", "level off", "plateau", "peak", "reach a high point", "hit a low point"),
      VOCAB("How to use a trend verb",
        "<b>Verb:</b> increase &nbsp; <b>Meaning:</b> go up &nbsp; <b>Pattern:</b> increase from X to Y / increase by X",
        "<b>Simple:</b> The number increased from 10% to 20%.",
        "<b>Stronger:</b> The figure increased steadily from 10% in 2010 to 20% in 2020."
      ),
      TABLE(["Verb", "Strength", "Example"], [
        ["dip", "small fall", "Sales dipped slightly in March."],
        ["surge / soar", "large, fast rise", "Visitor numbers surged after 2015."],
        ["plummet / plunge", "large, fast fall", "Prices plummeted during the recession."],
        ["fluctuate", "go up and down", "The figure fluctuated between 40% and 60%."],
        ["level off / plateau", "stop changing", "After 2018, the trend levelled off."],
      ]),

      H("B · Degree of change", "how big the change is"),
      CHIPS("slight", "marginal", "gradual", "moderate", "noticeable", "considerable", "significant", "substantial", "sharp", "steep", "dramatic", "rapid"),
      TABLE(["Weak change", "Moderate change", "Strong change"], [
        ["a slight / marginal rise", "a moderate / noticeable rise", "a sharp / dramatic / substantial rise"],
        ["fell slightly", "fell moderately", "fell sharply / dramatically"],
      ]),

      H("C · Speed of change", "adverbs after the verb"),
      CHIPS("slowly", "gradually", "steadily", "noticeably", "rapidly", "sharply", "suddenly", "dramatically"),
      NOTE("Two patterns — both correct", "<b>Adjective + noun:</b> There was a <i>sharp increase</i>. / There was a <i>gradual decline</i>.<br><b>Verb + adverb:</b> The figure <i>increased sharply</i>. / The figure <i>declined gradually</i>."),

      H("D · Comparison language"),
      CHIPS("higher than", "lower than", "greater than", "smaller than", "almost double", "roughly half", "three times as high as", "twice as many as", "the highest proportion", "the lowest figure", "in contrast", "compared with", "whereas", "while", "respectively"),
      MODEL("Model comparisons",
        "Spending on housing was almost double that of transport.",
        "The figure for China was roughly half the figure for India.",
        "Cars and buses accounted for 40% and 25% respectively."
      ),

      H("E · Approximation language", "why estimating is smart"),
      CHIPS("approximately", "roughly", "around", "about", "nearly", "just over", "just under", "slightly more than", "slightly less than", "a little above", "a little below"),
      P("You rarely need exact figures. Approximation keeps your sentence accurate even if you read the scale imperfectly: <i>The figure stood at just over 60%</i> is safer than guessing a precise number."),

      H("F · Ranking language"),
      CHIPS("ranked first", "ranked second", "accounted for the largest share", "made up the smallest proportion", "was the leading category", "was the least common category", "followed by", "came next", "the second-highest figure", "the lowest recorded figure"),
      MODEL("Model rankings",
        "Tourism accounted for the largest share of income, followed by agriculture.",
        "Public transport made up the smallest proportion of journeys.",
        "Germany ranked first, while Spain recorded the lowest figure."
      ),
    ],
  });

  S({
    id: "t1-by-type",
    part: "t1",
    title: "Task 1 Vocabulary by Visual Type",
    v: ["task1", "models"],
    blocks: [
      LEAD("Each visual type needs slightly different language. Use the cluster that matches your chart."),

      H("Line graphs", "trends over time"),
      CHIPS("rose steadily", "fell sharply", "fluctuated", "remained stable", "peaked at", "hit a low of", "the lines crossed", "the gap narrowed", "the gap widened"),
      MODEL("Models",
        "The figure rose steadily throughout the period.",
        "The number of users peaked at around 80,000 in 2018.",
        "The gap between the two categories narrowed significantly after 2015."
      ),

      H("Bar charts", "ranking & comparison"),
      CHIPS("the highest bar", "the lowest category", "considerably higher than", "grouped bars", "across the three years", "by far the largest"),
      MODEL("Models",
        "By far the largest category was leisure, at roughly 35%.",
        "Spending on health was considerably higher than spending on defence."
      ),

      H("Pie charts", "proportions & shares"),
      CHIPS("accounted for", "made up", "the largest segment", "the smallest slice", "a quarter of", "the majority of", "a small minority"),
      MODEL("Models",
        "Renewable energy made up just under a quarter of the total.",
        "The majority of respondents, at 58%, preferred online shopping."
      ),

      H("Tables", "select, don’t list"),
      UL(
        "Find the highest and lowest figures in each row or column.",
        "Describe one or two clear patterns — never every cell.",
        "Group similar figures: “Three countries recorded figures above 50%.”"
      ),

      H("Mixed charts", "connect the visuals"),
      UL(
        "Identify the relationship between the two visuals before you write.",
        "Write one overview that covers both — don’t treat them as separate tasks.",
        "Give each visual its own body paragraph, but link them logically."
      ),

      H("Maps", "what changed"),
      CHIPS("was built", "was constructed", "was demolished", "was removed", "was replaced by", "was converted into", "was extended", "was expanded", "was relocated", "remained unchanged", "the northern part", "the southern edge", "in the centre", "to the east of", "adjacent to", "opposite", "next to"),
      MODEL("Models",
        "A large car park was constructed to the north of the station.",
        "The forest in the east was cleared and replaced by residential housing.",
        "The school remained unchanged, while the adjacent fields were built on."
      ),

      H("Processes", "stages & sequence"),
      CHIPS("begins with", "starts with", "is followed by", "the next stage", "subsequently", "after that", "once this has been done", "the final stage", "ends with", "is produced", "is transported", "is heated", "is cooled", "is mixed", "is filtered", "is packaged"),
      MODEL("Models",
        "In the first stage, the raw materials are collected and cleaned.",
        "Once this has been done, the mixture is heated to a high temperature.",
        "In the final stage, the finished product is packaged and transported."
      ),
      TIP("Processes usually need the <b>present simple passive</b> (is heated, is mixed). Maps describing past change usually need the <b>past simple passive</b> (was built, was removed)."),
    ],
  });

  S({
    id: "t1-overview",
    part: "t1",
    title: "Task 1 Overview Training",
    v: ["task1", "support", "advanced"],
    blocks: [
      LEAD("The overview is the single most important sentence in Task 1. It is essential for Task Achievement — without a clear overview, your score is capped. This page teaches you to write one every time."),

      H("What an overview is"),
      P("The overview is a 1–2 sentence summary of the <b>biggest picture</b>: the main trend, the largest change, or the most striking comparison. It contains <b>no specific data</b> — that goes in the body."),
      H("What to include"),
      UL(
        "The general direction (up, down, stable, varied).",
        "The biggest or most noticeable feature.",
        "A high-level comparison (which is highest / lowest overall)."
      ),
      H("What to avoid"),
      UL(
        "Specific numbers and dates.",
        "Listing every category.",
        "A personal opinion or a conclusion (“In conclusion…”). Use “Overall…”."
      ),
      NOTE("How to find the overview fast", "Ask: “If I could only say ONE thing about this chart, what would it be?” That is your overview."),

      H("Weak vs. improved"),
      VS(
        ["Overall, the graph shows many changes in the number of people who used the internet.", "Overall, internet use increased substantially in all three countries, although the highest growth was recorded in Country A."]
      ),
      H("Overviews for each visual type"),
      MODEL("Dynamic chart", "Overall, all three figures rose over the period, with the steepest increase seen in renewable energy."),
      MODEL("Static chart", "Overall, leisure accounted for the largest share of spending, while education received the least."),
      MODEL("Map", "Overall, the area became significantly more developed, with open land replaced by housing and transport links."),
      MODEL("Process", "Overall, the process consists of [number] main stages, beginning with [first stage] and ending with [final product]."),
      TIP("Write the overview <b>second</b>, straight after the introduction — never bury it at the end."),
    ],
  });

  S({
    id: "t1-process-vs-map",
    part: "t1",
    title: "Process Overview vs Map Overview",
    v: ["task1"],
    blocks: [
      LEAD("Students often confuse these two. They look similar but ask different questions. This page makes the difference crystal clear."),

      H("Process overview", "answers: how does it happen?"),
      P("A process overview usually describes the number of main stages, the starting point, the ending point, whether the process is natural or man-made, whether it is linear or cyclical, and the overall transformation from input to output."),
      MODEL("Model process overviews",
        "Overall, the process consists of several main stages, beginning with the collection of raw materials and ending with the production of the final product.",
        "Overall, this is a cyclical natural process in which water evaporates, forms clouds, falls as rain, and eventually returns to larger bodies of water.",
        "Overall, the diagram shows a linear man-made process with clear stages from preparation to packaging.",
        "Overall, the process begins with the harvesting of the crop and ends with the product being packaged for sale."
      ),

      H("Map overview", "answers: what changed?"),
      P("A map overview usually describes the biggest physical changes — what was added, removed, expanded or replaced — and whether the area became more residential, commercial, modern, accessible or developed."),
      MODEL("Model map overviews",
        "Overall, the area became significantly more developed, with new residential facilities replacing much of the open land.",
        "Overall, the village changed from a small rural area into a more modern and accessible town with improved transport links.",
        "Overall, the most noticeable changes were the construction of new buildings and the removal of several green spaces.",
        "Overall, the town centre became more pedestrian-friendly, while the surrounding area saw increased commercial development."
      ),

      H("Side-by-side comparison"),
      TABLE(["Feature", "Process overview", "Map overview"], [
        ["Main focus", "Stages", "Physical changes"],
        ["Main question", "How does it happen?", "What changed?"],
        ["Key ideas", "Beginning, stages, ending, cycle", "Additions, removals, replacements, expansions"],
        ["Common language", "begins with, ends with, consists of, stage, cycle", "was built, was replaced, was demolished, was expanded"],
        ["Details to avoid", "Too many small steps", "Too many small location details"],
      ]),
    ],
  });

  S({
    id: "t1-sentence-bank",
    part: "t1",
    title: "Task 1 Model Sentence Bank",
    v: ["task1", "models"],
    blocks: [
      LEAD("A flexible bank of sentences organised by function. Each function shows a safe version first, then a stronger one. Adapt them — never recite them word for word."),

      H("Introducing the visual"),
      VS(["The graph is about how many people used the internet.", "The line graph illustrates the proportion of internet users in three countries between 2000 and 2020."]),
      H("Writing the overview"),
      VS(["Overall, there were a lot of changes.", "Overall, all three figures rose, with the most pronounced growth in the final decade."]),
      H("Upward trends"),
      VS(["The number went up.", "The figure climbed steadily, reaching a peak of around 80% in 2018."]),
      H("Downward trends"),
      VS(["The number went down.", "The proportion fell sharply before levelling off towards the end of the period."]),
      H("Fluctuations"),
      VS(["It went up and down.", "The figure fluctuated markedly, ranging between 30% and 55% across the period."]),
      H("Stability"),
      VS(["It stayed the same.", "The figure remained relatively constant at approximately 40% throughout."]),
      H("Comparing categories"),
      VS(["A is bigger than B.", "Spending on housing was considerably higher than on any other category."]),
      H("Proportions"),
      VS(["A is half of the total.", "Manufacturing accounted for roughly half of total employment."]),
      H("Rankings"),
      VS(["X is the most.", "Tourism was the leading source of income, followed closely by agriculture."]),
      H("Describing maps"),
      VS(["They built houses.", "Much of the farmland was cleared and replaced by residential housing."]),
      H("Describing processes"),
      VS(["First they heat it.", "In the first stage, the raw material is heated to a high temperature."]),
      H("Unchanged features"),
      VS(["The school stayed.", "The school and the main road remained unchanged throughout the period."]),
      H("Dramatic changes"),
      VS(["It changed a lot.", "The figure underwent a dramatic transformation, more than tripling within five years."]),
      H("Ending a body paragraph naturally"),
      VS(["That is the end.", "By contrast, the remaining categories showed little variation over the same period."]),
    ],
  });

  S({
    id: "t1-models",
    part: "t1",
    title: "Task 1 Simple Models and Stronger Models",
    v: ["task1", "models", "support", "advanced"],
    blocks: [
      LEAD("For each chart type: a simple Band 5.5–6 model first, then a stronger Band 7 model, then a note on exactly what improved. Weaker students should master the simple version before attempting the stronger one."),

      H("Line graph"),
      MODEL("Simple (Band 5.5–6)",
        "The line graph shows the number of internet users in three countries from 2000 to 2020.",
        "Overall, the number of users went up in all three countries.",
        "In 2000, Country A had about 20 million users. This number increased to 60 million in 2020. Country B also went up, from 10 to 40 million.",
        "Country C had the lowest numbers. It started at 5 million and rose to 25 million by the end."
      ),
      MODEL("Stronger (Band 7)",
        "The line graph illustrates changes in the number of internet users in three countries between 2000 and 2020.",
        "Overall, internet use rose substantially in all three countries, with Country A consistently recording the highest figures throughout the period.",
        "In 2000, Country A stood at approximately 20 million users before climbing steadily to around 60 million by 2020 — a threefold increase. Country B followed a similar upward trend, growing from 10 to 40 million.",
        "Country C, by contrast, remained the lowest throughout, although it still rose noticeably from 5 million to roughly 25 million over the two decades."
      ),
      NOTE("What improved in the stronger version?", "<b>Overview:</b> adds a clear comparison (A highest). <b>Vocabulary:</b> climbed steadily, threefold increase, substantially. <b>Comparison:</b> links categories rather than listing them. <b>Approximation:</b> approximately / roughly. <b>Grammar:</b> longer, controlled sentences with linkers."),

      H("Bar chart"),
      MODEL("Simple",
        "The bar chart shows spending in four areas in 2020.",
        "Overall, leisure had the highest spending and education had the lowest.",
        "People spent 35% on leisure. This was the biggest amount. Housing was second with 28%.",
        "Transport was 22% and education was 15%, which was the lowest."
      ),
      MODEL("Stronger",
        "The bar chart compares household spending across four categories in 2020.",
        "Overall, leisure accounted for the largest proportion of spending, whereas education received the smallest share.",
        "At 35%, leisure represented well over twice the figure for education. Housing followed at 28%, while transport made up a further 22%.",
        "Education, at just 15%, was by far the lowest, accounting for less than half the amount allocated to leisure."
      ),
      NOTE("What improved?", "Stronger grouping, proportion language (accounted for, share), accurate ratio comparisons (twice, less than half), and varied sentence openings."),

      H("Pie chart · Table · Map · Process — quick pairs"),
      MODEL("Pie — simple → stronger",
        "Simple: The pie chart shows transport types. Cars are the most at 45%.",
        "Stronger: The pie chart shows that private cars accounted for the largest share of journeys, at 45% — almost half of the total."
      ),
      MODEL("Table — simple → stronger",
        "Simple: The table shows numbers for five countries. Japan has the highest number.",
        "Stronger: Of the five countries shown, Japan recorded the highest figure, while three of the remaining four clustered closely between 20% and 25%."
      ),
      MODEL("Map — simple → stronger",
        "Simple: They built houses and a road. The trees were removed.",
        "Stronger: The woodland was cleared to make way for residential housing, and a new access road was constructed along the southern edge."
      ),
      MODEL("Process — simple → stronger",
        "Simple: First the clay is dug up. Then it is shaped and put in an oven.",
        "Stronger: In the initial stage, clay is extracted before being shaped and subsequently fired in a kiln at high temperature."
      ),
    ],
  });

  S({
    id: "t1-practice",
    part: "t1",
    title: "Task 1 Practice Activities",
    v: ["task1", "practice"],
    blocks: [
      LEAD("Controlled practice that moves from recognition to production. Answers are in the Answer Key at the back."),

      PRACTICE("T1-1", "Choose the best overview", "Which overview best summarises a graph where all three countries’ internet use rose, with Country A highest?", [
        { q: "(a) In 2000, Country A had 20 million users.  (b) Overall, internet use rose in all three countries, with Country A consistently highest.  (c) Country C was the lowest.", a: "(b) — it gives the big picture and a high-level comparison, with no specific data." },
      ]),
      PRACTICE("T1-2", "Improve a weak overview", "Rewrite this weak overview so it is clear and data-free: “Overall, the graph shows many changes.”", [
        { q: "Your improved overview:", a: "Sample: Overall, all three figures increased over the period, with the most rapid growth occurring after 2010." },
      ]),
      PRACTICE("T1-3", "Replace weak vocabulary", "Upgrade each underlined word.", [
        { q: "The number went up a lot. → ", a: "The figure rose sharply / increased significantly." },
        { q: "It stayed the same. → ", a: "It remained stable / levelled off." },
        { q: "A is bigger than B. → ", a: "A was considerably higher than B." },
      ]),
      PRACTICE("T1-4", "Complete the model sentence", "Fill the gaps with trend language.", [
        { q: "Sales __________ steadily from 10% in 2010 __________ 25% in 2020.", a: "rose / increased … to" },
        { q: "The figure __________ at around 80% in 2018 before __________ off.", a: "peaked … levelling" },
      ]),
      PRACTICE("T1-5", "Write a comparison sentence", "Cars = 40%, buses = 20%. Write one accurate comparison.", [
        { q: "Your sentence:", a: "Sample: Cars accounted for 40% of journeys — exactly twice the figure for buses." },
      ]),
      PRACTICE("T1-6", "Group data into body paragraphs", "You have 6 categories. How should you organise the two body paragraphs?", [
        { q: "Your plan:", a: "Group logically — e.g. Body 1: the highest two or three categories; Body 2: the lowest, plus any clear pattern. Never one category per sentence." },
      ]),
      PRACTICE("T1-7", "Map change practice", "Old map: forest. New map: houses + road. Write one sentence.", [
        { q: "Your sentence:", a: "Sample: The forest was cleared and replaced by residential housing, with a new road constructed alongside." },
      ]),
      PRACTICE("T1-8", "Process stage practice", "Stages: collect → heat → shape → cool. Write the first two stages.", [
        { q: "Your sentences:", a: "Sample: First, the material is collected. It is then heated to a high temperature before being shaped." },
      ]),
      PRACTICE("T1-9", "Correct the grammar", "Find and fix the error: “The number of users were increase dramatically.”", [
        { q: "Correction:", a: "The number of users increased dramatically. (singular ‘was’ subject; correct past tense ‘increased’.)" },
      ]),
      PRACTICE("T1-10", "Order the sentences", "Put these in the correct report order: A) body detail  B) overview  C) introduction.", [
        { q: "Correct order:", a: "C → B → A (Introduction → Overview → Body)." },
      ]),
    ],
  });

  /* ----------------------------------------------------------------------
     PART V — TASK 2
     ---------------------------------------------------------------------- */

  S({
    id: "t2-topic-vocab",
    part: "t2",
    title: "Task 2 Topic Vocabulary — Basic to Academic",
    v: ["task2"],
    blocks: [
      LEAD("Upgrade tables for the most common Task 2 topics. Learn the basic word first, then add the academic phrase only when you can use it accurately."),
      VOCAB("Format",
        "<b>Basic word</b> → <b>better phrase</b> → <b>advanced phrase</b> → <i>model sentence</i>."
      ),
      TABLE(["Topic", "Basic → Better → Advanced", "Model sentence"], [
        ["Education", "school → education system → access to quality education", "Access to quality education is essential for long-term social mobility."],
        ["Technology", "computers → digital tools → technological innovation", "Technological innovation has transformed the way people work and learn."],
        ["AI", "robots → automation → artificial intelligence", "The rise of artificial intelligence raises concerns about job security."],
        ["Environment", "pollution → environmental damage → environmental degradation", "Industrial activity has accelerated environmental degradation worldwide."],
        ["Health", "being healthy → public health → preventive healthcare", "Investment in preventive healthcare can reduce long-term costs."],
        ["Government", "rules → policies → government regulation", "Stricter government regulation may curb harmful practices."],
        ["Crime", "bad people → criminals → criminal behaviour", "Poverty is often linked to higher rates of criminal behaviour."],
        ["Work", "jobs → employment → career opportunities", "A skilled workforce widens career opportunities for graduates."],
        ["Young people", "kids → young people → the younger generation", "The younger generation is increasingly reliant on social media."],
        ["Family", "family → family structure → family values", "Changing family structures reflect wider social shifts."],
        ["Transport", "cars and buses → public transport → transport infrastructure", "Investment in transport infrastructure can ease congestion."],
        ["Cities", "big cities → urban areas → rapid urbanisation", "Rapid urbanisation has placed pressure on housing and services."],
        ["Media", "TV and news → the media → mass media", "The mass media shapes public opinion on key issues."],
        ["Tourism", "tourists → tourism → the tourism industry", "The tourism industry is a major source of national income."],
        ["Money", "money → income → financial stability", "Financial stability allows families to plan for the future."],
        ["Online life", "the internet → online life → the digital world", "The digital world has reshaped how people communicate."],
        ["Public services", "services → public services → essential services", "Adequate funding for essential services improves quality of life."],
      ]),
    ],
  });

  S({
    id: "t2-bvocab",
    part: "t2",
    title: "B-Level Vocabulary for IELTS Writing Task 2",
    v: ["task2", "bvocab", "support"],
    blocks: [
      LEAD("Simple, useful words for weaker students. Learn the words, the better phrase, the model sentence — then do the short practice task. These words appear again and again in IELTS."),

      H("Education"),
      CHIPS("school", "teachers", "students", "exams", "skills", "learning", "education system", "university", "training", "future jobs"),
      MODEL("Model", "A good education system helps students prepare for future jobs."),

      H("Technology"),
      CHIPS("online learning", "internet", "mobile phones", "apps", "digital tools", "screen time", "communication", "information", "online safety"),
      MODEL("Model", "Digital tools can help students learn more easily."),

      H("Environment"),
      CHIPS("pollution", "clean air", "waste", "recycling", "climate change", "animals", "trees", "public transport", "save energy"),
      MODEL("Model", "Recycling can reduce waste and protect the environment."),

      H("Health"),
      CHIPS("healthy food", "exercise", "hospitals", "doctors", "mental health", "stress", "sleep", "public health", "illness"),
      MODEL("Model", "Regular exercise can improve people’s physical and mental health."),

      H("Work"),
      CHIPS("job", "salary", "office", "workers", "skills", "experience", "employment", "training", "work-life balance"),
      MODEL("Model", "Good training can help people find stable employment."),

      H("Crime"),
      CHIPS("crime", "police", "prison", "punishment", "safety", "rules", "young offenders", "community"),
      MODEL("Model", "Better education can reduce crime in poor areas."),

      H("Young people"),
      CHIPS("children", "teenagers", "parents", "social media", "free time", "role models", "guidance", "behaviour"),
      MODEL("Model", "Young people need guidance when using social media."),

      H("Cities & transport"),
      CHIPS("traffic", "public transport", "pollution", "housing", "crowded", "city centre", "buses", "trains", "roads"),
      MODEL("Model", "Better public transport can reduce traffic and pollution in cities."),

      PRACTICE("T2B-1", "Practice — build a sentence", "Use one B-level phrase from each topic above in a sentence of your own.", [
        { q: "Education sentence:", a: "Sample: A strong education system gives students the skills they need for future jobs." },
        { q: "Environment sentence:", a: "Sample: Recycling and using public transport can help protect the environment." },
        { q: "Health sentence:", a: "Sample: Eating healthy food and doing regular exercise improve public health." },
      ]),
    ],
  });

  S({
    id: "t2-cvocab",
    part: "t2",
    title: "C-Level Vocabulary for IELTS Writing Task 2",
    v: ["task2", "cvocab", "advanced"],
    blocks: [
      LEAD("Grouped by function — the most efficient way to learn academic language. Each item shows meaning, a collocation, and a model sentence. Use only what you can control."),

      H("Expressing importance"),
      CHIPS("essential", "crucial", "fundamental", "indispensable", "significant", "central to", "a key factor in"),
      MODEL("Model", "Affordable childcare is central to enabling parents to return to work."),

      H("Expressing negative effects"),
      CHIPS("detrimental", "harmful", "damaging", "counterproductive", "unsustainable", "problematic", "adverse"),
      MODEL("Model", "Long working hours can have a detrimental effect on family life."),

      H("Expressing positive effects"),
      CHIPS("beneficial", "advantageous", "valuable", "constructive", "effective", "worthwhile", "conducive to"),
      MODEL("Model", "A balanced diet is conducive to better long-term health."),

      H("Expressing causes"),
      CHIPS("stems from", "is caused by", "is driven by", "can be attributed to", "results from", "arises from"),
      MODEL("Model", "Much youth unemployment stems from a lack of practical skills."),

      H("Expressing results"),
      CHIPS("leads to", "results in", "contributes to", "gives rise to", "brings about", "has a significant impact on"),
      MODEL("Model", "Poor urban planning often gives rise to traffic congestion."),

      H("Expressing solutions"),
      CHIPS("address", "tackle", "mitigate", "reduce", "regulate", "implement", "promote", "invest in", "raise awareness of"),
      MODEL("Model", "Governments could mitigate this problem by investing in public transport."),

      H("Expressing balance & concession"),
      CHIPS("although", "while", "despite this", "nevertheless", "admittedly", "it is true that", "this is not to suggest that"),
      MODEL("Model", "Admittedly, technology has drawbacks; nevertheless, its benefits are considerable."),

      TIP("One precise C-level phrase used correctly is worth more than three rare words used wrongly. Quality over rarity."),
    ],
  });

  S({
    id: "t2-essay-types",
    part: "t2",
    title: "Task 2 Essay Type Guide",
    v: ["task2"],
    blocks: [
      LEAD("Recognise the question, know what the examiner expects, and choose the right structure. Misreading the question type is the most common Task 2 error."),

      H("Opinion / Agree or disagree"),
      UL("<b>Recognise:</b> “Do you agree or disagree?”, “To what extent…?”, “What is your opinion?”", "<b>Examiner wants:</b> a clear position held throughout, with developed reasons.", "<b>Structure:</b> intro + opinion → reason 1 → reason 2 → conclusion.", "<b>Common mistake:</b> sitting on the fence — decide and commit."),

      H("Discussion (discuss both views)"),
      UL("<b>Recognise:</b> “Discuss both views and give your own opinion.”", "<b>Examiner wants:</b> both sides covered fairly, plus your opinion.", "<b>Structure:</b> intro → view 1 → view 2 → conclusion with your stance.", "<b>Common mistake:</b> forgetting to give your own opinion."),

      H("Advantages & disadvantages"),
      UL("<b>Recognise:</b> “What are the advantages and disadvantages?”", "<b>Examiner wants:</b> balanced coverage of both; sometimes a judgement.", "<b>Structure:</b> intro → advantage(s) → disadvantage(s) → conclusion.", "<b>Common mistake:</b> turning it into an opinion essay."),

      H("Problem & solution"),
      UL("<b>Recognise:</b> “What problems…? What solutions…?”", "<b>Examiner wants:</b> clear problems AND realistic solutions.", "<b>Structure:</b> intro → problems → solutions → conclusion.", "<b>Common mistake:</b> vague, unrealistic solutions."),

      H("Cause & effect"),
      UL("<b>Recognise:</b> “What are the causes…? What are the effects…?”", "<b>Examiner wants:</b> causes AND effects, clearly separated.", "<b>Structure:</b> intro → causes → effects → conclusion.", "<b>Common mistake:</b> confusing causes with effects."),

      H("Two-part / Direct question"),
      UL("<b>Recognise:</b> two direct questions in the prompt.", "<b>Examiner wants:</b> a clear answer to <i>each</i> question.", "<b>Structure:</b> intro → answer 1 → answer 2 → conclusion.", "<b>Common mistake:</b> answering only one part."),

      NOTE("Thesis & topic sentence models", "<b>Thesis (opinion):</b> “I firmly believe that … for two main reasons.” &nbsp; <b>Topic sentence:</b> “The most compelling reason is that …” Open every body paragraph with a topic sentence that names its single idea."),
    ],
  });

  S({
    id: "t2-outlines",
    part: "t2",
    title: "Band 8 Essay Outlines",
    v: ["task2", "advanced", "models"],
    blocks: [
      LEAD("A clear, realistic outline for every essay type. Plan for two minutes before you write — it is the fastest way to raise Coherence & Cohesion."),

      H("Opinion essay outline"),
      OL("<b>Introduction:</b> paraphrase the question → clear opinion → preview two reasons.", "<b>Body 1:</b> reason 1 → explanation → specific example → link back to opinion.", "<b>Body 2:</b> reason 2 → explanation → specific example → link back to opinion.", "<b>Conclusion:</b> restate opinion → summarise both reasons."),

      H("Agree/disagree outline"),
      OL("<b>Intro:</b> paraphrase → strong stance (agree / disagree).", "<b>Body 1:</b> strongest argument for your side.", "<b>Body 2:</b> second argument, OR acknowledge the other side then refute it.", "<b>Conclusion:</b> reaffirm stance."),

      H("Discussion outline"),
      OL("<b>Intro:</b> paraphrase both views → state your own opinion.", "<b>Body 1:</b> view 1 — explain it fairly with an example.", "<b>Body 2:</b> view 2 — explain it, and show why you favour it.", "<b>Conclusion:</b> weigh both → confirm your opinion."),

      H("Advantages/disadvantages outline"),
      OL("<b>Intro:</b> paraphrase → signal you will examine both.", "<b>Body 1:</b> main advantage(s) — explained, with example.", "<b>Body 2:</b> main disadvantage(s) — explained, with example.", "<b>Conclusion:</b> brief judgement on which outweighs the other."),

      H("Problem/solution outline"),
      OL("<b>Intro:</b> paraphrase → signal problems + solutions.", "<b>Body 1:</b> 1–2 key problems → effects.", "<b>Body 2:</b> matching, realistic solutions → who acts.", "<b>Conclusion:</b> link main problem to main solution."),

      H("Cause/effect outline"),
      OL("<b>Intro:</b> paraphrase → signal causes + effects.", "<b>Body 1:</b> main causes, explained.", "<b>Body 2:</b> main effects, explained.", "<b>Conclusion:</b> summarise the causal chain."),

      H("Two-part question outline"),
      OL("<b>Intro:</b> paraphrase → note both questions.", "<b>Body 1:</b> full answer to question 1 + example.", "<b>Body 2:</b> full answer to question 2 + example.", "<b>Conclusion:</b> one-line answer to each."),

      NOTE("Where examples and concessions go", "Put your <b>example</b> after the explanation in each body paragraph. Put a <b>concession</b> (“Admittedly… ; nevertheless…”) near the start of body 2 in agree/disagree essays to show range."),
    ],
  });

  S({
    id: "t2-models",
    part: "t2",
    title: "Task 2 Simple Models and Band 8 Models",
    v: ["task2", "models", "support", "advanced"],
    blocks: [
      LEAD("For each essay type: a basic plan, a simple model (Band 5.5–6.5), a Band 8 plan, a Band 8 model, and a note on exactly what improved. Weaker students should aim for the simple model first."),

      /* OPINION */
      H("1 · Opinion essay"),
      P("<b>Prompt:</b> Some people think that students should be required to study a foreign language at school. To what extent do you agree?"),
      MODEL("Simple model (≈ Band 6)",
        "Some people believe that students should study a foreign language at school. I agree with this because it helps students in the future and it is good for the brain.",
        "The first reason is that languages help students get better jobs. Many companies want workers who can speak more than one language. For example, a person who speaks English and French can work in many countries. So learning a language is useful.",
        "Another reason is that learning a language is good for the brain. It helps memory and thinking. Students who learn languages often do better in other subjects too. This shows that languages are helpful for study.",
        "In conclusion, I agree that students should study a foreign language because it helps them find jobs and improves their thinking."
      ),
      MODEL("Band 8 model",
        "It is sometimes argued that learning a foreign language should be compulsory in schools. I strongly agree with this view, both because of the professional advantages it brings and the cognitive benefits associated with bilingualism.",
        "The most compelling reason is that language skills significantly broaden career opportunities. In an increasingly globalised economy, employers value candidates who can communicate across borders, and a second language can be the deciding factor in a competitive job market. A graduate fluent in English and Mandarin, for instance, is far better positioned to work for a multinational firm than a monolingual applicant with otherwise identical qualifications.",
        "Equally important are the wider cognitive gains. Research consistently suggests that learning another language strengthens memory, problem-solving and even performance in unrelated subjects. Because acquiring a language demands sustained concentration and pattern recognition, students develop transferable skills that benefit their academic work as a whole.",
        "In conclusion, requiring students to study a foreign language is, in my view, fully justified. The combination of enhanced employability and sharper cognitive ability makes it a worthwhile investment in young people’s futures."
      ),
      NOTE("What improved in the Band 8 version?", "<b>Thesis:</b> precise and previews two reasons. <b>Topic sentences:</b> name one idea each. <b>Vocabulary:</b> compelling, globalised economy, cognitive gains, transferable skills. <b>Examples:</b> specific and relevant. <b>Development:</b> idea → explanation → example → link. <b>Linking:</b> natural, varied. <b>Tone:</b> academic, controlled."),

      /* AGREE/DISAGREE */
      H("2 · Agree or disagree essay"),
      P("<b>Prompt:</b> Some people believe that unpaid community service should be a compulsory part of high-school programmes. Do you agree or disagree?"),
      MODEL("Simple model",
        "Some people think that students should do unpaid community service at high school. I agree with this idea because it helps students learn and helps the community.",
        "Firstly, community service teaches students important skills. They learn teamwork and responsibility. For example, when students help in a care home, they learn to communicate with other people. These skills are useful for the future.",
        "Secondly, it helps the community. Students can clean parks, help old people, or support charities. This makes the area better for everyone. It also helps students understand the problems in their community.",
        "In conclusion, I agree that community service should be compulsory because it helps students learn and supports the community."
      ),
      MODEL("Band 8 model",
        "There is a growing argument that high-school students should be required to undertake unpaid community service. I largely agree, as such programmes cultivate valuable personal qualities while delivering real benefits to society.",
        "The principal advantage is the development of skills that the classroom cannot easily teach. Through volunteering, young people acquire teamwork, empathy and a sense of responsibility. A teenager who regularly assists at a care home, for example, learns to communicate with people of different generations — a form of social competence that examinations rarely measure but employers consistently seek.",
        "Admittedly, some may object that compulsory service is a contradiction in terms. Nevertheless, the wider community clearly gains: students who clean public spaces, support charities or mentor younger children make a tangible difference, and in doing so come to understand the challenges facing those around them. This awareness often fosters a lasting habit of civic engagement.",
        "In conclusion, while the word “compulsory” sits awkwardly with volunteering, the benefits to both students and society are substantial. I therefore believe that such schemes should form a structured part of secondary education."
      ),
      NOTE("What improved?", "A concession (“Admittedly… Nevertheless…”) shows range; vocabulary is more precise (cultivate, civic engagement, social competence); the position is held consistently while acknowledging the counter-view."),

      /* DISCUSSION */
      H("3 · Discussion essay"),
      P("<b>Prompt:</b> Some people think children should start school as early as possible, while others believe they should start later. Discuss both views and give your opinion."),
      MODEL("Simple model",
        "Some people think children should start school early, while others think they should start later. This essay will discuss both views and give my opinion.",
        "On the one hand, some people believe early schooling is good. Children can learn to read and write sooner. They also learn to make friends and follow rules. For example, children in nursery learn to share and work together.",
        "On the other hand, others think children should start later. Young children need time to play and grow. Starting too early can cause stress. Some studies say children who start later do just as well.",
        "In conclusion, both views have good points, but I believe a later start is better because young children need time to develop through play."
      ),
      MODEL("Band 8 model",
        "Opinions are divided over the ideal age at which children should begin formal schooling: some favour an early start, while others argue for delaying it. This essay will consider both positions before explaining why I support a later start.",
        "Those in favour of early schooling point to clear academic and social benefits. Beginning to read, write and count at a young age, they argue, gives children a head start, while the structured environment teaches cooperation and discipline. A child in a well-run nursery, for instance, quickly learns to share resources and follow simple routines.",
        "However, advocates of a later start make a persuasive case. Very young children learn most effectively through unstructured play, and pushing them into formal lessons prematurely can generate stress and a dislike of learning. Evidence from countries such as Finland, where children begin school at seven yet achieve outstanding results, suggests that an early academic start is not essential for long-term success.",
        "In conclusion, although early schooling offers social advantages, I believe the developmental case for a later start is stronger. Allowing children to mature through play is likely to produce more confident and motivated learners."
      ),
      NOTE("What improved?", "Both views are developed fairly and then weighed; a real example (Finland) supports the stance; linking and academic register are far stronger."),

      /* ADV/DISADV */
      H("4 · Advantages & disadvantages essay"),
      P("<b>Prompt:</b> More people are working from home rather than in an office. What are the advantages and disadvantages of this trend?"),
      MODEL("Simple model",
        "Nowadays, more people work from home instead of going to an office. This essay will discuss the advantages and disadvantages of this trend.",
        "One advantage is that working from home saves time. People do not have to travel to work, so they have more free time. For example, a person who lives far from the office can save two hours every day. This is good for their family life.",
        "However, one disadvantage is that people can feel lonely. They do not see their colleagues, so they may miss social contact. It can also be hard to focus at home because of noise or family.",
        "In conclusion, working from home has both advantages and disadvantages. Overall, I think it is positive if people can manage their time well."
      ),
      MODEL("Band 8 model",
        "The shift away from the traditional office towards remote working has accelerated in recent years. This essay will examine both the benefits and the drawbacks of this development.",
        "The most obvious advantage is the time and flexibility it offers. By eliminating the daily commute, employees reclaim hours that can be devoted to family, exercise or rest, which in turn tends to improve both wellbeing and productivity. Someone living an hour from the city, for example, may save the equivalent of a full working day each week — time that can be used far more constructively.",
        "There are, however, significant disadvantages. Working in isolation can erode the sense of belonging that an office provides, leaving employees feeling disconnected and, in some cases, less motivated. Moreover, the home environment is not always conducive to concentration: domestic distractions and the blurring of work and personal life can undermine performance.",
        "In conclusion, while remote working delivers valuable flexibility, it also carries real risks to collaboration and focus. On balance, I believe it is beneficial provided that individuals are disciplined and employers maintain regular contact with their teams."
      ),
      NOTE("What improved?", "Precise cause–effect links (eliminating the commute → reclaim hours → wellbeing), stronger lexis (conducive, erode, on balance) and a clear final judgement."),

      /* PROBLEM/SOLUTION */
      H("5 · Problem & solution essay"),
      P("<b>Prompt:</b> Many cities suffer from heavy traffic congestion. What problems does this cause, and how can it be solved?"),
      MODEL("Simple model",
        "Traffic congestion is a serious problem in many cities. This essay will explain the main problems it causes and suggest some solutions.",
        "One major problem is that congestion wastes time. People spend hours in their cars, so they are tired and late for work. It also causes pollution because cars produce a lot of gas. This is bad for people’s health.",
        "One possible solution is to improve public transport. If buses and trains are cheap and fast, more people will use them. Another solution is to build cycle lanes so people can ride bicycles safely. Governments could also charge drivers to enter the city centre.",
        "In conclusion, traffic congestion wastes time and causes pollution, but it can be reduced with better public transport and cycle lanes."
      ),
      MODEL("Band 8 model",
        "Severe traffic congestion has become a defining feature of many modern cities. This essay will outline the principal problems it creates before proposing several realistic solutions.",
        "The consequences of congestion are both economic and environmental. Commuters lose countless hours in stationary traffic, which reduces productivity and increases stress, while the resulting concentration of exhaust fumes worsens air quality and contributes to respiratory illness. In effect, the entire city pays a daily price in lost time and damaged health.",
        "Fortunately, the problem can be addressed on several fronts. The most effective measure is sustained investment in efficient, affordable public transport, since commuters will only abandon their cars if a faster alternative exists. This could be reinforced by expanding cycle networks and by introducing congestion charging, which has demonstrably reduced traffic in cities such as London. Crucially, these measures work best in combination rather than in isolation.",
        "In conclusion, although congestion imposes serious economic and environmental costs, it is far from insoluble. A coordinated strategy of better public transport, safer cycling and targeted charging offers the most promising path forward."
      ),
      NOTE("What improved?", "Problems are explained as a chain (congestion → lost time → stress; fumes → illness); solutions are realistic, named (congestion charging, London) and linked to a single coordinated strategy."),

      /* CAUSE/EFFECT */
      H("6 · Cause & effect essay"),
      P("<b>Prompt:</b> Obesity is increasing among young people in many countries. What are the causes, and what effects does it have?"),
      MODEL("Simple model",
        "Obesity is becoming more common among young people in many countries. This essay will explain the main causes and effects of this problem.",
        "One main cause is unhealthy food. Many young people eat fast food and sugary snacks because they are cheap and easy. Another cause is a lack of exercise. Children spend a lot of time on phones and computers instead of playing outside.",
        "As a result, obesity causes health problems. Young people can develop diabetes and heart problems. It can also affect their confidence and make them feel unhappy. This can affect their school work too.",
        "In conclusion, obesity in young people is caused by poor diet and little exercise, and it leads to health and emotional problems."
      ),
      MODEL("Band 8 model",
        "Rising levels of obesity among the young have become a pressing public-health concern in many parts of the world. This essay will examine the principal causes of this trend and the effects it produces.",
        "Two factors lie at the heart of the problem. The first is diet: highly processed, calorie-dense food is cheap, heavily marketed and widely available, encouraging children to consume far more sugar and fat than they need. The second is a marked decline in physical activity, as screen-based entertainment increasingly replaces outdoor play and sport.",
        "The effects of this combination are serious and far-reaching. Medically, overweight children face a heightened risk of conditions such as type-2 diabetes and heart disease, often persisting into adulthood. The psychological consequences are equally damaging: obese young people frequently experience low self-esteem and social isolation, which can in turn impair their concentration and academic performance.",
        "In conclusion, youth obesity stems largely from poor diet and sedentary lifestyles, and it carries both physical and emotional costs. Tackling it will require coordinated action from families, schools and policymakers alike."
      ),
      NOTE("What improved?", "Causes are precisely labelled (diet, declining activity) and effects split into medical and psychological; lexis is academic (calorie-dense, sedentary, far-reaching)."),

      /* TWO-PART */
      H("7 · Two-part question essay"),
      P("<b>Prompt:</b> Many people now buy goods online rather than in shops. Why is this happening, and is it a positive or negative development?"),
      MODEL("Simple model",
        "These days, many people buy things online instead of going to shops. This essay will explain why this is happening and say whether it is positive or negative.",
        "There are two main reasons for this change. Firstly, online shopping is convenient. People can buy things at any time without leaving home. Secondly, prices online are often cheaper because online shops do not pay for buildings.",
        "In my opinion, this is mostly a positive development. It saves people time and money, and there is more choice. However, it can be bad for small shops, which may lose customers and close.",
        "In conclusion, online shopping is growing because it is convenient and cheap. I believe it is mainly positive, although it can harm small businesses."
      ),
      MODEL("Band 8 model",
        "Online shopping has rapidly overtaken the high street as the preferred way to buy goods for many consumers. This essay will explore the reasons behind this shift and argue that, despite some drawbacks, it is a largely positive development.",
        "Two factors largely explain the trend. The first is convenience: online platforms allow people to browse and purchase at any hour, from anywhere, and have goods delivered to their door — an enormous saving of time and effort. The second is cost; because online retailers avoid the overheads of physical premises, they can frequently undercut traditional shops, an advantage that price-conscious shoppers find hard to resist.",
        "In my view, the benefits of this development outweigh its costs. Consumers enjoy lower prices, greater choice and the ability to compare products instantly, all of which improve their purchasing power. That said, the decline of physical shops is a genuine concern, as small, local businesses may struggle to compete and town centres can lose their vitality.",
        "In conclusion, the rise of online shopping is driven chiefly by convenience and lower prices. While it poses a real threat to traditional retailers, I believe it is, on balance, a positive change for the majority of consumers."
      ),
      NOTE("What improved?", "Both questions are answered fully and separately; the opinion is signalled in the intro and sustained; lexis (overheads, undercut, purchasing power, vitality) is precise and natural."),
    ],
  });

  S({
    id: "t2-practice",
    part: "t2",
    title: "Task 2 Practice Activities",
    v: ["task2", "practice"],
    blocks: [
      LEAD("Practice that moves from controlled tasks to independent writing. Answers and samples are in the Answer Key."),

      PRACTICE("T2-1", "Choose the best thesis", "Prompt: “Do you agree that public museums should be free?” Which thesis is strongest?", [
        { q: "(a) Museums are interesting places to visit.  (b) I firmly agree that museums should be free, as this widens access to culture and supports education.  (c) There are advantages and disadvantages of free museums.", a: "(b) — it states a clear position and previews two reasons." },
      ]),
      PRACTICE("T2-2", "Improve a weak thesis", "Rewrite: “In this essay I will talk about technology and say my opinion.”", [
        { q: "Your thesis:", a: "Sample: I strongly believe that technology has improved education, chiefly by increasing access to information and enabling flexible learning." },
      ]),
      PRACTICE("T2-3", "Improve a weak topic sentence", "Rewrite: “Another thing is money.”", [
        { q: "Your topic sentence:", a: "Sample: A second, equally important factor is the financial cost involved." },
      ]),
      PRACTICE("T2-4", "Upgrade the vocabulary", "Replace the simple words.", [
        { q: "This is a big problem that is very bad for kids. → ", a: "This is a serious issue with harmful effects on children." },
        { q: "The government should help poor people. → ", a: "The government should support low-income families." },
      ]),
      PRACTICE("T2-5", "Build an outline", "Prompt: “Some think the internet should be more regulated. Discuss both views and give your opinion.” Sketch a 4-paragraph outline.", [
        { q: "Your outline:", a: "Intro: paraphrase + opinion. Body 1: view for regulation (safety, misinformation). Body 2: view against (free speech, enforcement). Conclusion: weigh both, confirm opinion." },
      ]),
      PRACTICE("T2-6", "Add a specific example", "Strengthen: “Technology helps students learn.”", [
        { q: "Add an example:", a: "Sample: …; for instance, free platforms such as online encyclopaedias let students research any topic instantly." },
      ]),
      PRACTICE("T2-7", "Improve the linking", "Join with better linkers: “Cars cause pollution. We should use public transport.”", [
        { q: "Your sentence:", a: "Sample: Because cars are a major source of pollution, greater use of public transport should be encouraged." },
      ]),
      PRACTICE("T2-8", "Identify the unsupported idea", "Which sentence needs support? “Online learning is cheaper. It also saves time. Therefore it is the best option.”", [
        { q: "Answer:", a: "“Therefore it is the best option” is a conclusion drawn without enough evidence — add explanation/example before concluding." },
      ]),
      PRACTICE("T2-9", "Expand an idea fully", "Turn this into a full idea → explanation → example: “Exercise is good.”", [
        { q: "Your development:", a: "Sample: Regular exercise improves health (idea) because it strengthens the heart and reduces stress (explanation); for example, a daily 30-minute walk can lower blood pressure (example)." },
      ]),
      PRACTICE("T2-10", "Order the sentences", "Arrange a body paragraph: A) example  B) topic sentence  C) explanation  D) link back.", [
        { q: "Correct order:", a: "B → C → A → D (topic sentence → explanation → example → link back)." },
      ]),
      PRACTICE("T2-11", "Write a conclusion", "Write a one-sentence conclusion for an opinion essay arguing museums should be free.", [
        { q: "Your conclusion:", a: "Sample: In conclusion, free museums are clearly worthwhile, as they broaden cultural access and enrich public education." },
      ]),
    ],
  });

  /* ----------------------------------------------------------------------
     PART VI — REVIEW & PRACTICE
     ---------------------------------------------------------------------- */

  S({
    id: "mistakes",
    part: "review",
    title: "Common IELTS Writing Mistakes and Better Alternatives",
    v: ["task1", "task2", "advanced"],
    blocks: [
      LEAD("Each entry shows what is wrong, why it lowers the score, and a better alternative. Fixing these is often the fastest route to a higher band."),

      H("Task 1 mistakes"),
      VS(
        ["Listing every number from the chart.", "Select the key data and group it: “Three categories rose, while two remained stable.”"],
        ["Writing no overview.", "Always include 1–2 overview sentences after the introduction — it is essential for Task Achievement."],
        ["Writing a conclusion (“In conclusion…”) in Task 1.", "Use “Overall…” for the overview; Task 1 has no opinion or conclusion."]
      ),
      H("Task 2 mistakes"),
      VS(
        ["Unclear thesis: “I will talk about both sides.”", "State a clear position: “I firmly believe that… for two reasons.”"],
        ["Too many undeveloped ideas.", "Fewer ideas, fully developed: idea → explanation → example → link."],
        ["Vague examples: “Some studies say…”.", "Specific, plausible examples: “In Finland, where children start school at seven…”."],
        ["Body paragraph with no topic sentence.", "Open each paragraph with one clear main idea."],
        ["Not answering both parts of the question.", "Check the prompt and address every part explicitly."]
      ),
      H("Language mistakes (both tasks)"),
      VS(
        ["Informal words: “kids”, “a lot of”, “stuff”.", "Academic equivalents: “children”, “a large number of”, “factors”."],
        ["Overusing “very”: “very big problem”.", "Use a stronger word: “serious / significant problem”."],
        ["Memorised phrases: “Since the dawn of time…”.", "Paraphrase the actual question naturally."],
        ["Overusing “nowadays” / “people think”.", "Vary openings: “In recent years…”, “It is often argued that…”."],
        ["Using rare words inaccurately.", "Use precise words you can control; accuracy beats rarity."],
        ["Sentences that are too long and lose control.", "Break into two clear sentences; control beats length."],
        ["Copying the question word for word.", "Paraphrase: change vocabulary and structure."]
      ),
    ],
  });

  S({
    id: "checklist",
    part: "review",
    title: "Final IELTS Writing Revision Checklist",
    v: ["task1", "task2", "support"],
    blocks: [
      LEAD("Use these checklists before you submit any practice answer, and again in the exam. Tick each box honestly."),
      H("Task 1 checklist"),
      UL("☐ Did I write a clear introduction (paraphrasing the question)?", "☐ Did I include a strong overview?", "☐ Did I select the most important information?", "☐ Did I group information logically?", "☐ Did I avoid listing every number?", "☐ Did I use accurate comparison language?", "☐ Did I use correct trend vocabulary?", "☐ Did I write at least 150 words?"),
      H("Task 2 checklist"),
      UL("☐ Did I answer the exact question (every part)?", "☐ Did I give a clear position where required?", "☐ Did each body paragraph have one clear main idea?", "☐ Did I explain my ideas fully?", "☐ Did I include relevant, specific examples?", "☐ Did I use academic vocabulary accurately?", "☐ Did I avoid memorised clichés?", "☐ Did I write at least 250 words?", "☐ Did I check grammar and spelling?"),
      H("Weaker-student checklist"),
      UL("☐ Did I write simple, correct sentences?", "☐ Did I use the template correctly?", "☐ Did I avoid very long, confusing sentences?", "☐ Did I explain my ideas step by step?", "☐ Did I use some better vocabulary accurately?", "☐ Did I avoid words I do not understand?", "☐ Did I write a clear overview in Task 1?", "☐ Did I give a clear opinion in Task 2 when needed?"),
      NOTE("One last reminder", "Clear, organised, accurate writing scores well. Aim for control first; reach for range second. You can do this."),
    ],
  });

  /* ---- expose ---------------------------------------------------------- */
  window.MB_DATA = { brand, parts, sections };
})();

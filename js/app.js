/* ==========================================================================
   IELTSwithMOURAD — Academic Writing Platform
   Vanilla JS · no libraries · offline-first (file:// safe).
   Architecture: data → services → UI. localStorage prototype with clearly
   marked seams for a future Supabase/Firebase + AI API backend.
   ========================================================================== */
"use strict";

/* ==========================================================================
   1. DATA  (preserved verbatim from the original Studio)
   ========================================================================== */

const T1_CHECKLIST = [
  "I paraphrased the question in my introduction (no copied wording).",
  "I wrote a clear overview with the main trends — and no detailed numbers in it.",
  "I grouped related data instead of describing every figure separately.",
  "I made direct comparisons (more than, twice as, while, whereas).",
  "I used the correct tense for the time frame shown.",
  "I used correct units (%, thousands) throughout.",
  "I gave no opinions, reasons or explanations — only what the visual shows.",
  "I wrote at least 150 words."
];

const T2_CHECKLIST = [
  "I answered every part of the question.",
  "My position is clear in the introduction and stays consistent.",
  "Each body paragraph has one main idea introduced by a topic sentence.",
  "I supported each idea with an explanation and a specific example.",
  "My conclusion restates my position with no new ideas.",
  "I used linking words naturally, not in every sentence.",
  "I avoided memorised phrases and informal language.",
  "I wrote at least 250 words."
];

const T1_SHARED_HELPERS = [
  {
    step: "Learn", title: "What an overview is",
    html: "<p>The overview is one or two sentences, usually after the introduction, giving the <strong>big picture</strong>: the main trend, the largest and smallest items, or the most significant change. It contains <strong>no detailed numbers</strong>.</p><p>An answer without a clear overview is capped low, whatever the vocabulary — it is the single most important sentence in Task 1.</p>"
  },
  {
    step: "Learn", title: "How to compare, not list",
    html: "<p>Examiners reward <strong>comparison</strong>, not a list of separate figures. Group related data, then compare inside and between groups.</p><ul><li><em>China and India dominated in both years, while the remaining three countries recorded far smaller figures.</em></li><li><em>Spending on food fell, whereas housing took a larger share.</em></li></ul><p>Choose representative figures; ignore minor detail. Describing every number is a band trap.</p>"
  },
  {
    step: "Learn", title: "Useful trend language",
    html: "<ul><li><strong>Up:</strong> rose, increased, climbed, grew steadily, surged, almost doubled.</li><li><strong>Down:</strong> fell, declined, dropped, decreased markedly, halved.</li><li><strong>Stable / mixed:</strong> remained stable, levelled off, fluctuated, peaked at, reached a low of.</li><li><strong>Approximation:</strong> just over, roughly, around, slightly under.</li></ul>"
  },
  {
    step: "Learn", title: "Useful comparison language",
    html: "<ul><li><em>twice as high as… / three times the figure for…</em></li><li><em>by far the largest / the smallest proportion</em></li><li><em>while / whereas / in contrast / a similar pattern</em></li><li><em>X overtook Y in… / the gap narrowed</em></li><li><em>rose from… to… / stood at… respectively</em></li></ul>"
  },
  {
    step: "Learn", title: "Writing the introduction",
    html: "<p>Paraphrase the task statement in one sentence — change the wording, not the meaning. Say <strong>what</strong> is measured, <strong>where</strong>, and <strong>when</strong>.</p><p><em>The chart shows…</em> &rarr; <em>The bar chart compares the number of…</em>. Never copy phrases directly from the prompt.</p>"
  },
  {
    step: "Learn", title: "Band criteria for Task 1",
    html: "<ul><li><strong>Task Achievement:</strong> a clear overview plus accurately selected key data — answer exactly what is asked.</li><li><strong>Coherence &amp; Cohesion:</strong> logical paragraphs (intro &rarr; overview &rarr; two grouped bodies) with smooth, natural linking.</li><li><strong>Lexical Resource:</strong> precise trend and comparison vocabulary, used accurately — not misused \"big words\".</li><li><strong>Grammar:</strong> a mix of simple and complex sentences with few errors. Accuracy beats ambition.</li></ul>"
  }
];

const MISSIONS = [
  {
    id: "t1-table", task: "task1", type: "Table",
    title: "Household Income Spent on Four Categories (2000 vs 2020)",
    img: "assets/task1/table-household-income.png",
    alt: "Table showing the percentage of household income spent on housing, food, transport and entertainment in 2000 and 2020",
    difficulty: "Core", time: "20 min",
    desc: "Compare how income was divided across four spending categories in two years.",
    prompt: "The table shows the percentage of household income spent on housing, food, transport and entertainment in a country in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "Tables have no shape to guide you — you must create the grouping yourself. Scan rows and columns for the largest figures, the biggest changes, and anything that stays the same. Here, notice the total: overall spending was unchanged at 82%, so the story is how the shares moved within it.",
    analyse: ["Food fell sharply (32% → 25%) — the biggest single change.", "Housing rose from 25% to 27%, overtaking food as the largest item.", "Transport (15% → 18%) and entertainment (10% → 12%) both rose moderately.", "The total stayed at 82% in both years — mention it, but never explain why."],
    plan: ["Introduction: paraphrase (share of income on four items, 2000 vs 2020).", "Overview: total unchanged; food takes a smaller share while the other three rise; housing becomes the largest item.", "Body 1: housing and food — the two largest items and how their ranking reversed.", "Body 2: transport and entertainment — smaller items, both increasing."],
    vocab: ["accounted for / made up", "the largest share of income", "fell from 32% to 25%", "rose modestly", "overtook food as the leading category", "remained unchanged at 82%"],
    tip: "Watch the totals: overall spending was identical in both years, so frame every change as a shift in share — and never explain why a figure changed.",
    model: [
      "The table compares the proportion of household income devoted to housing, food, transport and entertainment in 2000 and 2020.",
      "Overall, total spending on the four categories was identical in both years, but its composition shifted noticeably: the share taken by food fell considerably, while the other three categories all grew, leaving housing as the largest item by 2020.",
      "The most striking change concerned the two biggest categories. In 2000, food was the leading expense, absorbing 32% of income, with housing second at 25%. Two decades later their positions had reversed: spending on food had dropped to a quarter of income, whereas housing had edged up to 27%.",
      "The smaller categories moved in the opposite direction to food. The proportion spent on transport rose from 15% to 18%, and entertainment increased from 10% to 12%. As a result, although every category except food took a larger share, the combined total remained constant at 82% of household income."
    ]
  },
  {
    id: "t1-process", task: "task1", type: "Process",
    title: "Recycled Paper Production Process",
    img: "assets/task1/process-recycled-paper.png",
    alt: "Diagram of the six stages of recycled paper production, from collection to drying and rolling",
    difficulty: "Core", time: "20 min",
    desc: "Describe a linear six-stage manufacturing sequence using passive structures.",
    prompt: "The diagram shows the stages involved in the production of recycled paper, from collection and sorting to shredding, cleaning, pressing, drying and rolling. Summarise the information by selecting and reporting the main features. Write at least 150 words.",
    learn: "Process diagrams test sequence and the passive voice, not data. There are no trends to compare — instead, your overview states where the process begins, where it ends, and how many stages it has. Describe each stage in order, mentioning inputs (water, chemicals) and outputs (ink waste, paper reels).",
    analyse: ["A linear, man-made process with six clear stages.", "Start: used paper collected from households and offices. End: finished recycled paper reels.", "Inputs to notice: water and chemicals (added twice). By-product: ink waste.", "Sequence: collection → sorting → shredding → cleaning &amp; de-inking → pulp pressing → drying &amp; rolling."],
    plan: ["Introduction: paraphrase (how recycled paper is manufactured).", "Overview: a linear, six-stage process beginning with collection and ending with paper reels.", "Body 1: early stages — collection, sorting by type and quality, shredding.", "Body 2: later stages — cleaning and de-inking with water and chemicals, pressing, drying and rolling."],
    vocab: ["is collected / is sorted / is shredded", "at the following stage", "once … has been …", "water and chemicals are added", "the resulting pulp", "subsequently / thereafter / finally"],
    tip: "Stay neutral and use the passive: paper is collected, sorted and shredded. Never add opinions, reasons or instructions — you are describing, not recommending.",
    model: [
      "The diagram illustrates how recycled paper is manufactured, from the collection of used paper to the production of finished paper reels.",
      "Overall, this is a linear, man-made process consisting of six main stages. It begins when waste paper is gathered from homes and workplaces and ends when the recycled product is dried and rolled, with water and chemicals required at two points along the way.",
      "In the first stage, used paper is collected from households and offices and delivered to a recycling plant. There it is sorted by hand according to its type and quality, after which the approved paper is fed into a shredding machine and cut into small pieces.",
      "The shredded paper then undergoes cleaning and de-inking: water and chemicals are added to the mixture, and the ink is separated out as waste, leaving clean pulp. At the fifth stage, this pulp is pressed between rollers so that it is flattened and the excess water is removed. Finally, the sheets are dried and rolled into large reels of recycled paper, ready for use."
    ]
  },
  {
    id: "t1-map", task: "task1", type: "Map",
    title: "Changes to Riverside Town Centre (1995–2025)",
    img: "assets/task1/map-riverside-town.png",
    alt: "Two maps comparing Riverside Town Centre in 1995 and 2025, showing a new shopping mall, apartments, pedestrian street, bicycle lanes, bridge and relocated library",
    difficulty: "Challenge", time: "20 min",
    desc: "Report before-and-after urban change using location and development language.",
    prompt: "The maps show changes made to Riverside Town Centre between 1995 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "For maps, your overview captures the overall transformation — here, the centre became more built-up and far more pedestrian-friendly. Group the changes logically (transport changes together, building changes together) rather than wandering around the map, and anchor every feature with location language: in the north-east, on the south side, across the river.",
    analyse: ["The main road was converted into a pedestrian street with bicycle lanes on both sides.", "A bridge was built across the river, connecting the south bank.", "The car park in the north-west was replaced by a shopping mall.", "Apartment buildings appeared in the north-east; the library moved from the north to the park area in the south-east; some shops were removed."],
    plan: ["Introduction: paraphrase (the town centre's layout in 1995 and 2025).", "Overview: the area became more developed and pedestrian-friendly, with major construction in the north and a new river crossing.", "Body 1: transport — road pedestrianised, bicycle lanes added, bridge built.", "Body 2: buildings and land use — car park → mall, apartments added, library relocated, fewer shops."],
    vocab: ["was converted into / was replaced by", "was constructed / was demolished", "in the north-east corner", "on the opposite bank", "adjacent to / alongside", "became pedestrianised"],
    tip: "Group changes by area or theme, and locate everything: \"a shopping mall was built where the car park had stood, in the north-west of the centre.\"",
    model: [
      "The two maps compare the layout of Riverside Town Centre in 1995 with its appearance in 2025, following thirty years of redevelopment.",
      "Overall, the centre was transformed into a more built-up and considerably more pedestrian-friendly area. The most significant changes were the pedestrianisation of the main road, the construction of a bridge over the river, and large-scale building in the northern half of the town.",
      "Regarding transport, the main road running through the centre was converted into a pedestrian street, with bicycle lanes added along both sides. In addition, a bridge was constructed across the river in the south, linking the town centre to the opposite bank for the first time.",
      "The buildings also changed substantially. The large car park in the north-west was replaced by a shopping mall, while a cluster of apartment buildings was erected in the north-east. The library, previously located north of the main road, was relocated to the parkland in the south-east, and the row of shops south of the road was reduced in size, although the park and the river remained in place."
    ]
  },
  {
    id: "t1-pie", task: "task1", type: "Pie Chart",
    title: "Household Expenditure Distribution (2000 vs 2020)",
    img: "assets/task1/pie-household-expenditure.png",
    alt: "Two pie charts showing the distribution of household expenditure across six categories in 2000 and 2020",
    difficulty: "Core", time: "20 min",
    desc: "Compare proportions across two years — largest slices, smallest slices, key movers.",
    prompt: "The two pie charts illustrate the percentage distribution of household expenditure in a European country in 2000 and 2020 across six categories: housing, food, transport, entertainment, healthcare and other. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "With two pie charts, the question is always how the shares changed between the charts. Identify the largest and smallest slices in each year, then the biggest movers. Do not describe every slice separately — group the risers, the fallers, and what stayed the same.",
    analyse: ["Housing was the largest slice in both years and grew from 30% to 35%.", "Food fell from a quarter to a fifth — the largest decrease.", "Transport (15% → 18%) and entertainment (10% → 12%) rose; healthcare was unchanged at 10%.", "'Other' halved from 10% to 5%, becoming the smallest category."],
    plan: ["Introduction: paraphrase (household spending shares, 2000 vs 2020, six categories).", "Overview: housing dominant in both years and growing; food declining; 'other' shrinking to the smallest share.", "Body 1: the two largest items — housing and food — and how the gap widened.", "Body 2: the smaller categories — transport and entertainment up, healthcare flat, 'other' halved."],
    vocab: ["accounted for the largest proportion", "a quarter / a fifth of total spending", "its share expanded to 35%", "fell by five percentage points", "remained constant at 10%", "halved to just 5%"],
    tip: "Convert percentages into fractions for variety — a quarter, a fifth, a third — and never march around the pie describing every slice in order.",
    model: [
      "The pie charts show how household spending in a European country was divided among six categories in 2000 and 2020.",
      "Overall, housing was the largest item of expenditure in both years and strengthened its position, while the proportion devoted to food declined markedly. Most other categories grew slightly, with the exception of healthcare, which was static, and \"other\" spending, which shrank to become the smallest segment.",
      "In 2000, housing and food together absorbed over half of the household budget, at 30% and 25% respectively. By 2020 the gap between them had widened considerably: housing had risen to 35% of spending, whereas food had fallen to just a fifth.",
      "Among the smaller categories, transport increased from 15% to 18% and entertainment from 10% to 12%. Healthcare was the only segment to remain unchanged, at exactly 10% in both charts. In contrast, the share classified as \"other\" halved over the period, dropping from 10% to a mere 5% and finishing as the smallest slice of expenditure."
    ]
  },
  {
    id: "t1-bar", task: "task1", type: "Bar Chart",
    title: "International Students in Canada by Country (2005 vs 2020)",
    img: "assets/task1/bar-international-students.png",
    alt: "Bar chart comparing the number of international students in Canada from five countries in 2005 and 2020",
    difficulty: "Foundation", time: "20 min",
    desc: "Rank and compare five countries across two years — growth, leaders, and laggards.",
    prompt: "The bar chart shows the number of international students (in thousands) from China, India, the USA, Brazil and Nigeria studying in Canada in 2005 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "Bar charts reward ranking and grouping. Find the leaders, the laggards, and the fastest growers — then build paragraphs around those groups rather than around individual bars. Remember the unit: these figures are in thousands.",
    analyse: ["Every country sent more students in 2020 than in 2005 — the universal trend belongs in the overview.", "China led in both years (45,000 → 80,000); India grew the most steeply (30,000 → 70,000), narrowing the gap.", "The USA and Brazil grew modestly (25,000 → 35,000; 15,000 → 25,000).", "Nigeria tripled from the lowest base (10,000 → 30,000) — the sharpest relative growth."],
    plan: ["Introduction: paraphrase (students from five countries in Canada, 2005 vs 2020).", "Overview: numbers rose for every country; China and India remained the dominant sources, with the steepest absolute growth.", "Body 1: China and India — rank, figures, and the narrowing gap.", "Body 2: USA, Brazil, Nigeria — smaller figures; Nigeria's sharp rise from the lowest base."],
    vocab: ["by far the largest source", "more than doubled", "tripled from a low base", "rose from 45,000 to 80,000", "narrowed the gap with", "the figures for X and Y stood at… respectively"],
    tip: "Group the countries — the two giants versus the rest — instead of describing all five bars one by one, and state the unit (thousands) early.",
    model: [
      "The bar chart compares the number of international students from five countries enrolled in Canada in 2005 and 2020, measured in thousands.",
      "Overall, every country sent more students at the end of the period than at the beginning. China and India were the leading sources in both years and recorded the largest absolute increases, while Nigeria showed the fastest growth in proportional terms.",
      "China occupied first place throughout, with its student numbers rising from 45,000 in 2005 to 80,000 in 2020. India, in second position, grew even more steeply, climbing from 30,000 to 70,000 and thereby narrowing the gap with China considerably.",
      "The remaining three countries supplied far smaller numbers. Students from the USA increased moderately, from 25,000 to 35,000, while the figure for Brazil rose from 15,000 to 25,000. The most dramatic relative change, however, belonged to Nigeria: although it began as the smallest source, with only 10,000 students, its total tripled to 30,000 by 2020, overtaking Brazil and matching the growth seen elsewhere."
    ]
  },
  {
    id: "t1-line", task: "task1", type: "Line Graph",
    title: "Household Energy Usage by Source (1990–2020)",
    img: "assets/task1/line-energy-usage.png",
    alt: "Line graph showing the percentage of households using coal, gas and electricity between 1990 and 2020",
    difficulty: "Foundation", time: "20 min",
    desc: "Describe three trends over thirty years — rises, falls, crossovers and final rankings.",
    prompt: "The line graph illustrates the percentage of households using three different energy sources (coal, gas and electricity) between 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "Line graphs are about direction over time. Identify each line's overall trend first, then the key moments: peaks, lows, and especially crossovers, where one line overtakes another. When lines move in opposite directions, the overview almost writes itself.",
    analyse: ["Coal declined steadily from 40% to 15% — from the most common source to the least.", "Gas rose gradually from 30% to 38%, finishing as the leading source.", "Electricity climbed from 20% to 35%, the largest increase.", "Crossovers: electricity overtook coal around 2008–2010; gas passed coal around 2002."],
    plan: ["Introduction: paraphrase (percentage of households using coal, gas, electricity, 1990–2020).", "Overview: coal fell markedly while gas and electricity rose; gas finished narrowly ahead of electricity.", "Body 1: coal — a steady fall across the whole period, with endpoints.", "Body 2: gas and electricity — both climbing; compare levels, growth rates and the crossover with coal."],
    vocab: ["declined steadily throughout the period", "more than halved", "overtook coal in around 2010", "the upward trend continued", "finished narrowly ahead of", "stood at 38% and 35% respectively"],
    tip: "When trends move in opposite directions, build your overview around the contrast — and always mention the crossover point.",
    model: [
      "The line graph shows the proportion of households relying on coal, gas and electricity as energy sources over a thirty-year period from 1990 to 2020.",
      "Overall, the use of coal declined sharply while both gas and electricity became steadily more common. As a result, coal went from being the most widely used source to the least, with gas finishing narrowly ahead of electricity in 2020.",
      "In 1990, coal was the dominant source, used by 40% of households. Its popularity then fell continuously, slipping to 35% in 2000 and 25% in 2010, before reaching a low of just 15% at the end of the period — under half its original figure.",
      "The two other sources followed the opposite path. Gas rose gradually from 30% to 38%, overtaking coal early in the century and remaining the leading source thereafter. Electricity recorded the largest overall increase, climbing from only 20% of households in 1990 to 35% in 2020 and passing coal around 2010, so that by the final year the two growing sources were separated by a mere three percentage points."
    ]
  }
];

/* ==========================================================================
   2. DATA — Task 2 essay types
   ========================================================================== */

const T2_SHARED_HELPERS = [
  {
    step: "Understand", title: "How to analyse the question",
    html: "<p>Read the instruction words twice. Identify: the <strong>topic</strong>, the <strong>instruction type</strong> (agree/disagree, discuss both views, advantages/disadvantages, problem/solution, two questions), and <strong>how many parts</strong> you must answer. Missing a part caps Task Response immediately.</p>"
  },
  {
    step: "Understand", title: "Writing a clear position",
    html: "<p>Your thesis is one sentence in the introduction that directly answers the question. It must be unmistakable and stay consistent to the end.</p><p><em>Weak:</em> \"This essay will discuss both sides.\" <em>Strong:</em> \"Although loyalty to one employer has benefits, I believe changing jobs periodically brings greater long-term advantages.\"</p>"
  },
  {
    step: "Plan", title: "Topic sentences and support",
    html: "<p>Each body paragraph carries <strong>one</strong> idea, previewed by its topic sentence. Then develop it: <em>explain why → give a specific example → show the consequence → link back to the question</em>. The missing example is the single most common gap between Band 6 and Band 7.</p>"
  },
  {
    step: "Write", title: "Academic but natural language",
    html: "<ul><li>Avoid memorised openings (\"In this day and age…\", \"It is a controversial issue…\") — examiners recognise and penalise them.</li><li>Avoid informal words: <em>kids, stuff, a lot of, gonna</em>.</li><li>One linking word per idea, used naturally, scores higher than a linker in every sentence.</li><li>Prefer precise verbs over decorated vocabulary used incorrectly.</li></ul>"
  },
  {
    step: "Check", title: "Conclusions and coherence",
    html: "<p>The conclusion restates your position in fresh words — <strong>no new ideas</strong>. Check that each paragraph has one controlling idea, that pronouns refer clearly, and that you have not repeated the same word excessively; use synonyms and referencing (<em>this trend, such measures</em>) instead.</p>"
  }
];

const T2_TYPES = [
  {
    id: "t2-opinion", task: "task2", type: "Opinion", title: "Opinion essay — Career loyalty vs change",
    difficulty: "Core", time: "40 min",
    desc: "Agree or disagree — take a clear position and defend it throughout.",
    prompt: "Some people think that it is best to work for the same organisation for one's whole life. Others think that it is better to change jobs frequently. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    structure: ["Introduction — paraphrase the topic and state your position clearly.", "Body 1 — your first reason, explained and supported with an example.", "Body 2 — your second reason (or a concession + rebuttal).", "Conclusion — restate your position; no new ideas."],
    thesis: "Decide your position before writing and state it in the introduction: fully agree, fully disagree, or partially agree with a clearly defined balance. \"To what extent\" invites a nuanced answer — but the nuance must be precise, not vague.",
    mistakes: ["Hiding your opinion until the conclusion.", "Arguing both sides equally without ever taking a position.", "Switching positions halfway through the essay.", "Giving examples that are invented statistics rather than plausible illustrations."],
    language: ["I would argue that…", "While X has some merit, …", "A further advantage of… is that…", "For instance, professionals who…", "On balance, …"],
    model: [
      "Whether employees should remain with a single organisation throughout their careers or move between employers is a question on which opinions differ sharply. While long-term loyalty offers stability, I believe that changing jobs periodically brings greater benefits to most professionals.",
      "Admittedly, staying with one organisation has real advantages. Long-serving employees accumulate deep institutional knowledge, often enjoy steady promotion, and benefit from the security of an established reputation. For some, particularly in fields such as the civil service, this stability outweighs any attraction of change.",
      "However, I would argue that mobility develops a professional more fully. Each new workplace exposes an employee to different systems, colleagues and problems, which broadens their skills far faster than repetition of familiar tasks. A software engineer who has worked for three companies, for example, will typically have encountered a wider range of technologies than one who has spent fifteen years maintaining a single product.",
      "Furthermore, changing employers is frequently the most effective way to advance. Salary research consistently suggests that people who move between organisations see faster income growth than those who wait for internal promotion, and the confidence gained from succeeding in new environments is itself a valuable career asset.",
      "In conclusion, although lifelong service suits certain people and professions, I believe the wider experience, faster development and stronger bargaining position that come from changing jobs make mobility the better strategy for the majority of workers."
    ]
  },
  {
    id: "t2-discussion", task: "task2", type: "Discussion", title: "Discussion essay — Competition vs co-operation",
    difficulty: "Core", time: "40 min",
    desc: "Discuss both views fairly, then give and justify your own opinion.",
    prompt: "Some people think that a sense of competition in children should be encouraged. Others believe that children should be taught to co-operate. Discuss both views and give your own opinion. Write at least 250 words.",
    structure: ["Introduction — paraphrase both views and state your opinion.", "Body 1 — the first view, explained fairly with an example.", "Body 2 — the second view, explained fairly with an example.", "Body 3 or conclusion — your position and why; conclusion restates it."],
    thesis: "You must do three things: present view one, present view two, and give your own opinion. The safest structure devotes one paragraph to each view and makes your own position clear in both the introduction and the conclusion.",
    mistakes: ["Discussing only one view in detail and dismissing the other in a sentence.", "Forgetting to give your own opinion at all — the question explicitly requires it.", "Presenting both views but never explaining why people hold them.", "Treating \"discuss\" as \"argue\" and writing a one-sided essay."],
    language: ["Proponents of … argue that…", "Those who favour … point out that…", "There is some truth in both positions.", "In my view, however, …", "Ultimately, the two approaches are complementary."],
    model: [
      "How children should be motivated divides opinion: some adults believe a competitive spirit should be fostered from an early age, while others insist that co-operation is the more valuable lesson. This essay considers both positions before arguing that the two skills are best taught together, with co-operation as the foundation.",
      "Supporters of competition point out that the adult world is itself competitive. Examinations, university admissions and job markets all rank people against one another, so children who learn to strive, cope with losing and try again are arguably better prepared for reality. Competitive sport illustrates this well: young athletes learn discipline and resilience precisely because results matter.",
      "Advocates of co-operation respond that almost every meaningful achievement in adult life is collective. Workplaces run on teamwork, and modern problems — from scientific research to community projects — are solved by groups rather than lone individuals. Children who practise sharing ideas, dividing tasks and supporting weaker teammates therefore develop the social skills employers and societies actually need.",
      "In my opinion, these views are complementary rather than opposed. A child can compete healthily only after learning the co-operative basics of fairness, empathy and respect for others; without them, competitiveness curdles into selfishness. Schools should therefore build co-operative habits first and introduce competition gradually, in forms such as team contests, where winning depends on working together.",
      "In conclusion, while competition prepares children for a demanding world, co-operation underpins both character and achievement, and should remain the priority in early education."
    ]
  },
  {
    id: "t2-advdis", task: "task2", type: "Advantages / Disadvantages", title: "Advantages and disadvantages — Social media",
    difficulty: "Foundation", time: "40 min",
    desc: "Weigh the benefits against the drawbacks and decide which side outweighs.",
    prompt: "Nowadays, more and more people are using social media to keep in touch with friends and family. Do the advantages of this trend outweigh the disadvantages? Write at least 250 words.",
    structure: ["Introduction — paraphrase the trend and state which side outweighs.", "Body 1 — the main advantage(s), developed with an example.", "Body 2 — the main disadvantage(s), developed with an example.", "Conclusion — confirm your judgement on which side outweighs."],
    thesis: "\"Do the advantages outweigh the disadvantages?\" demands a verdict, not just a list. State your judgement in the introduction and confirm it in the conclusion — and make the paragraph supporting your verdict the stronger one.",
    mistakes: ["Listing advantages and disadvantages without ever saying which side outweighs.", "Giving equal weight to both sides when your thesis claims one outweighs.", "Treating the question as an opinion essay about whether social media is good.", "Including five thin points instead of two developed ones."],
    language: ["The principal benefit is that…", "On the other hand, a significant drawback is…", "This advantage, however, comes at a cost.", "Taken together, …", "The benefits clearly outweigh the drawbacks because…"],
    model: [
      "Social media has become the default way for many people to maintain contact with relatives and friends. Although this trend carries genuine risks, I believe its advantages outweigh its disadvantages, chiefly because of the distance it allows families to overcome.",
      "The greatest benefit of social media is that it makes relationships independent of geography. Migrant workers can watch their children grow up through video calls and shared photographs, while elderly parents can follow the daily lives of family members living abroad. A generation ago, such families relied on expensive phone calls and occasional letters; today, meaningful daily contact costs almost nothing. Social platforms also help people rediscover old friends and sustain wide social circles that would otherwise quietly disappear.",
      "Nevertheless, the disadvantages are real. Online interaction can displace face-to-face contact, so that some users feel more \"connected\" while actually becoming more isolated. The curated nature of social media feeds also encourages unhealthy comparison, and the time the platforms are designed to capture is often taken from sleep, study or genuine conversation.",
      "Even so, these drawbacks stem largely from how the technology is used rather than from the technology itself. A user who treats social media as a supplement to real relationships, rather than a replacement for them, captures the benefits while avoiding most of the harm.",
      "In conclusion, because social media dissolves the barrier of distance and keeps families and friendships alive across continents, its advantages outweigh its disadvantages, provided it is used with a degree of discipline."
    ]
  },
  {
    id: "t2-problem", task: "task2", type: "Problem / Solution", title: "Problem and solution — Rising crime",
    difficulty: "Challenge", time: "40 min",
    desc: "Identify causes of a problem and propose realistic, connected solutions.",
    prompt: "In many countries, the amount of crime is increasing. What are the main reasons for this? What can be done to solve this problem? Write at least 250 words.",
    structure: ["Introduction — paraphrase the problem and preview causes + solutions.", "Body 1 — two or three main causes, explained with examples.", "Body 2 — solutions that answer those causes directly.", "Conclusion — summarise the link between causes and solutions."],
    thesis: "This is a two-part question: causes and solutions. Answer both fully, and make each solution respond to a cause you named — a solution that ignores your own causes signals weak coherence.",
    mistakes: ["Answering only one of the two questions in depth.", "Proposing solutions unrelated to the causes you identified.", "Listing six causes superficially instead of developing two or three.", "Drifting into opinion about punishment instead of analysing the question."],
    language: ["One major cause of … is …", "This is largely attributable to…", "An effective response would be to…", "Governments could address this by…", "Only by tackling the root causes can…"],
    model: [
      "Crime rates are climbing in many parts of the world, a trend that alarms both governments and citizens. This essay outlines the principal causes of the increase and proposes measures that could realistically reverse it.",
      "Two factors do most to explain rising crime. The first is economic inequality: where unemployment is high and the gap between rich and poor is wide, some people — particularly young men with few prospects — turn to theft or the drug trade as an alternative source of income. The second is weakened community structure. In rapidly growing cities, traditional networks of family and neighbourhood supervision break down, so young people receive less guidance and offenders act with greater anonymity than they would in a close-knit town.",
      "The solutions follow from these causes. Since much crime is economically driven, the most effective long-term measure is investment in education and job creation in deprived areas, giving potential offenders a legitimate stake in society. Vocational training programmes for school-leavers, for instance, have been shown to cut youth offending markedly. To rebuild informal supervision, authorities can fund community policing, youth centres and after-school activities, which restore the adult presence that cities have lost. Finally, sentencing that combines punishment with rehabilitation reduces reoffending more reliably than imprisonment alone.",
      "In conclusion, rising crime stems mainly from economic exclusion and the erosion of community bonds. Governments that address those roots — through opportunity, education and stronger neighbourhoods — are far more likely to succeed than those relying on punishment alone."
    ]
  },
  {
    id: "t2-twopart", task: "task2", type: "Two-part Question", title: "Two-part question — Money and success",
    difficulty: "Challenge", time: "40 min",
    desc: "Answer two distinct questions fully — one paragraph each, nothing skipped.",
    prompt: "Success is often measured by the amount of money a person has. Is money a good indicator of success? What other factors contribute to success? Write at least 250 words.",
    structure: ["Introduction — paraphrase the topic and briefly answer both questions.", "Body 1 — answer question one fully, with an example.", "Body 2 — answer question two fully, with examples.", "Conclusion — bring the two answers together."],
    thesis: "Two-part questions are marked on completeness: each question deserves its own developed paragraph. Preview both answers in the introduction so the examiner sees immediately that nothing will be missed.",
    mistakes: ["Spending the whole essay on question one and a sentence on question two.", "Merging the two answers so neither is clearly addressed.", "Forgetting to give a direct yes/no/partly answer to the first question.", "Naming many 'other factors' without developing any of them."],
    language: ["To a limited extent, …", "Money alone, however, is an unreliable measure because…", "A more meaningful indicator is…", "Equally important is…", "Taken together, these factors suggest that…"],
    model: [
      "Wealth is the most visible yardstick of achievement, and society often treats a large income as proof of a successful life. In my view, money is only a partial indicator of success, and factors such as personal fulfilment, contribution to others and strong relationships matter at least as much.",
      "Money does capture something real. It usually reflects skills the market values, and it provides the freedom, security and choices that most definitions of success include. Yet as a sole measure it fails quickly. A wealthy person may be miserable, isolated or trapped in work they despise, while history's most admired figures — teachers, scientists, reformers — were frequently far from rich. Wealth can also be inherited or acquired unethically, in which case it indicates fortune rather than achievement.",
      "Other factors therefore deserve equal weight. The first is fulfilment: a person who loves their work and grows through it has succeeded in a way no salary records. The second is contribution — a nurse or a volunteer who improves other lives has a strong claim to success regardless of income. Finally, relationships are perhaps the most reliable indicator of all; long-term studies of wellbeing consistently find that people with close family and friendships rate their lives as most successful, whatever their bank balance.",
      "In conclusion, money is a convenient but shallow measure of success. Genuine success is better judged by a combination of financial security, personal fulfilment, service to others and the quality of one's relationships."
    ]
  }
];

/* ==========================================================================
   3. DATA — Writing Clinic
   ========================================================================== */

const CLINIC = [
  {
    title: "Weak overview",
    problem: "The overview is missing, buried, or just repeats the introduction, so Task Achievement is capped however good the rest is.",
    weak: "The chart shows many changes. Some things went up and some went down.",
    better: "Overall, coal use declined sharply over the period, while gas and electricity became steadily more popular, leaving gas as the leading source by 2020.",
    tip: "Name the actual main trends — direction and ranking — with no detailed numbers.",
    practice: "Write a one-sentence overview for a graph where bicycle use rises from 10% to 30% and car use falls from 60% to 45%.",
    suggested: "Overall, cycling became considerably more popular over the period, while car use declined, although cars remained the dominant form of transport."
  },
  {
    title: "Listing data without comparison",
    problem: "Each figure is reported separately, like reading the chart aloud, so the response never demonstrates comparison.",
    weak: "China had 45,000 students. India had 30,000 students. The USA had 25,000 students. Brazil had 15,000 students.",
    better: "China and India dominated, with 45,000 and 30,000 students respectively — together more than the other three countries combined.",
    tip: "Group related figures, then compare inside and between the groups.",
    practice: "Combine these into one comparing sentence: Housing 35%. Food 20%. Healthcare 10%.",
    suggested: "Housing absorbed the largest share at 35%, considerably more than food at a fifth, while healthcare accounted for just 10%."
  },
  {
    title: "Inaccurate tense",
    problem: "The tense ignores the time frame: past data described in the present, or future projections in the past.",
    weak: "In 1990, coal is the most popular source and 40% of households use it.",
    better: "In 1990, coal was the most popular source, used by 40% of households.",
    tip: "Check the dates before writing: past years → past tense; projections → will / is expected to.",
    practice: "Correct the tense: \"By 2030, the population grew to 9 million.\"",
    suggested: "By 2030, the population is expected to grow (or: will have grown) to 9 million."
  },
  {
    title: "No clear position",
    problem: "In Task 2, the reader cannot tell what the writer actually thinks — the position appears late, changes, or never appears.",
    weak: "This essay will discuss both sides of the argument about changing jobs.",
    better: "Although loyalty to one employer offers stability, I believe changing jobs periodically brings greater long-term benefits.",
    tip: "State your position in the introduction and keep it consistent to the final sentence.",
    practice: "Turn this into a clear thesis: \"Some people like online learning and some people prefer classrooms.\"",
    suggested: "While classroom teaching suits some learners, I believe online learning is the better option for most adults because of its flexibility and reach."
  },
  {
    title: "Repetition",
    problem: "The same key word appears in nearly every sentence, signalling a narrow lexical range.",
    weak: "Crime is increasing. Crime affects everyone. The government must stop crime because crime is dangerous.",
    better: "Offending is increasing, and this trend affects everyone. The government must address such behaviour before it becomes more dangerous.",
    tip: "Use synonyms and referencing — this trend, such measures, the problem — instead of repeating the noun.",
    practice: "Rewrite without repeating 'pollution': \"Pollution is bad. Pollution harms health. We must reduce pollution.\"",
    suggested: "Pollution is a serious problem that damages public health, and reducing it must become a priority."
  },
  {
    title: "Informal language",
    problem: "Conversational words and contractions undermine the academic register the task requires.",
    weak: "Kids spend a lot of time on their phones and it's a really big problem, you know.",
    better: "Children spend considerable time on their phones, which has become a significant problem.",
    tip: "Replace kids, stuff, a lot of, really, and contractions with their academic equivalents.",
    practice: "Formalise: \"Loads of people wanna work from home cos it's easier.\"",
    suggested: "Many people wish to work from home because it is more convenient."
  },
  {
    title: "Overuse of linking words",
    problem: "A linker opens every sentence — Firstly, Moreover, Furthermore, In addition — making the writing mechanical, not cohesive.",
    weak: "Firstly, exercise is healthy. Moreover, it is fun. Furthermore, it is social. In addition, it is cheap.",
    better: "Exercise benefits health, and because most activities are sociable and inexpensive, it is also enjoyable to maintain.",
    tip: "Cohesion comes from logic and referencing, not from stacking connectors. One natural linker per idea is enough.",
    practice: "Rewrite using at most one linker: \"Firstly, reading improves vocabulary. Secondly, it reduces stress. Thirdly, it is cheap.\"",
    suggested: "Reading improves vocabulary and reduces stress; better still, it costs almost nothing."
  },
  {
    title: "Grammar accuracy problems",
    problem: "Ambitious structures collapse under errors — articles, agreement and verb forms — so accuracy never reaches Band 7.",
    weak: "The informations in the chart shows that peoples is using less coal in these days.",
    better: "The information in the chart shows that people are using less coal these days.",
    tip: "Accuracy beats ambition: a correct complex sentence outscores three broken ones. Master uncountables (information, advice) and agreement first.",
    practice: "Correct: \"Each of the countries have increase their number of student.\"",
    suggested: "Each of the countries has increased its number of students."
  },
  {
    title: "Weak paragraphing",
    problem: "Ideas run together in one block, or every sentence starts a new paragraph, so the structure carries no meaning.",
    weak: "(One 250-word paragraph containing the introduction, three ideas and the conclusion.)",
    better: "Four paragraphs: introduction with thesis → first idea developed → second idea developed → conclusion.",
    tip: "One controlling idea per paragraph, announced by a topic sentence. If you cannot name a paragraph's idea in five words, split it.",
    practice: "Plan paragraph topics (not sentences) for: \"Do the advantages of tourism outweigh the disadvantages?\"",
    suggested: "1) Intro + verdict. 2) Economic and cultural advantages. 3) Environmental and social disadvantages. 4) Conclusion confirming the verdict."
  },
  {
    title: "Misused memorised phrases",
    problem: "Pre-learned chunks are pasted in regardless of topic, producing off-topic, robotic sentences examiners recognise instantly.",
    weak: "In this day and age, it is a highly controversial issue that has sparked heated debate among people from all walks of life.",
    better: "Whether children should be encouraged to compete is a question that divides parents and educators.",
    tip: "Learn flexible patterns, not fixed sentences — every sentence must do real work for this question.",
    practice: "Replace the memorised opener with a topic-specific one for an essay on remote working.",
    suggested: "The shift towards working from home has changed not only where people work but how companies are managed."
  }
];

/* ==========================================================================
   PLATFORM CORE
   Extra clinic modules (extend the preserved CLINIC list to 15 modules)
   ========================================================================== */

const CLINIC_EXTRA = [
  {
    title: "Unsupported ideas (Task 2)",
    problem: "A main idea is asserted but never explained or illustrated, so the paragraph stays thin and Task Response is capped.",
    weak: "Technology is good for education. It helps students a lot.",
    better: "Technology widens access to education: a student in a remote village can now follow lectures from a leading university online, something that was impossible a generation ago.",
    tip: "Follow every claim with: explain why → give a specific example → state the consequence.",
    practice: "Develop this claim into 2–3 sentences: 'Public transport reduces pollution.'",
    suggested: "Public transport reduces pollution because a single bus removes dozens of private cars from the road. In cities such as Curitiba, investment in rapid bus networks cut traffic emissions sharply, improving air quality for residents."
  },
  {
    title: "Sentence fragments",
    problem: "A group of words is punctuated as a sentence but lacks a subject or main verb, which lowers grammatical accuracy.",
    weak: "Because many people work from home now. Companies save money on offices.",
    better: "Because many people work from home now, companies save money on offices.",
    tip: "A dependent clause beginning with because, although, while or which cannot stand alone — join it to a full sentence.",
    practice: "Fix the fragment: 'Although the policy was popular. It was expensive.'",
    suggested: "Although the policy was popular, it was expensive."
  },
  {
    title: "Run-on sentences",
    problem: "Two or more complete sentences are joined with only a comma or nothing, making the writing hard to follow.",
    weak: "The city grew quickly, the roads could not cope, traffic became a serious problem it affected everyone.",
    better: "The city grew quickly, and the roads could not cope. As a result, traffic became a serious problem that affected everyone.",
    tip: "Join independent clauses with a full stop, a semicolon, or a comma plus a conjunction (and, but, so).",
    practice: "Repair: 'Online shopping is convenient it is also cheaper many shops have closed.'",
    suggested: "Online shopping is convenient and often cheaper; as a result, many shops have closed."
  },
  {
    title: "Weak conclusion",
    problem: "The conclusion adds a brand-new idea, contradicts the essay, or simply repeats the introduction word for word.",
    weak: "In conclusion, technology is important. Also, governments should ban mobile phones in schools.",
    better: "In conclusion, while technology brings clear benefits to learning, these are only realised when it is used purposefully rather than as a constant distraction.",
    tip: "Restate your position in fresh words and add nothing new — the conclusion closes the argument, it does not open one.",
    practice: "Write a one-sentence conclusion for an essay arguing that remote work benefits employees more than employers.",
    suggested: "In conclusion, although remote work offers advantages to both sides, it is employees who gain most, through the time, flexibility and autonomy it provides."
  },
  {
    title: "Irrelevant ideas",
    problem: "A paragraph drifts onto a related but off-question point, so it earns no credit and weakens Task Response.",
    weak: "The question asks about university tuition fees, but the paragraph discusses whether degrees guarantee jobs.",
    better: "Every paragraph answers the exact question asked — here, whether tuition should be free — and resists the temptation to write about education in general.",
    tip: "Before each paragraph, ask: does this directly answer the question? If not, cut it, however good the English.",
    practice: "Name one on-topic paragraph idea for: 'Should governments fund public libraries?'",
    suggested: "Libraries provide free access to information and learning resources for citizens who cannot otherwise afford them — a direct reason for public funding."
  }
];
CLINIC.push.apply(CLINIC, CLINIC_EXTRA);

/* Difficulty → estimated band target (used on cards and analytics). */
const BAND_TARGET = { Foundation: "5.5–6.0", Core: "6.0–6.5", Challenge: "6.5–7.5" };

/* ==========================================================================
   STORAGE SERVICE
   Prototype: localStorage. Each service below has a marked seam where a
   Supabase/Firebase call will later replace the local read/write.
   --------------------------------------------------------------------------
   BACKEND NOTE: replace StorageService.read/write with async calls to your
   database. Keep the same object shapes so the UI layer is untouched.
   ========================================================================== */

const StorageService = (function () {
  const KEY = "mmwa.platform.v2";
  function blank() {
    return {
      users: [], session: null, drafts: {}, submissions: [], assignments: [],
      tokens: {}, certificates: [], seeded: false,
      /* Improvement Lab: clinic activity assignments + live student work. */
      clinicAssignments: [], clinicWork: {}
    };
  }
  function read() {
    try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return blank(); }
  }
  function write(db) {
    // BACKEND: await supabase.from('app_state')... — for now, local only.
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* storage unavailable */ }
  }
  function update(fn) { const db = read(); fn(db); write(db); return db; }
  return { read: read, write: write, update: update, blank: blank, KEY: KEY };
})();

/* ==========================================================================
   REALTIME BUS
   Lightweight live channel so the teacher's Improvement Lab updates the moment
   a student types or submits, and the student's clinic reflects new
   assignments instantly.
   --------------------------------------------------------------------------
   Transport now:  BroadcastChannel + the localStorage `storage` event. Both
   fire across other tabs/windows of THIS browser, so a teacher on one screen
   sees students working on another tab/window in real time, fully offline.
   BACKEND SEAM:  to make this live across separate devices, subscribe to a
   Supabase Realtime channel here and call `emit({type:'db'})` on each change,
   and mirror local writes up to Supabase. The UI layer needs no other change.
   ========================================================================== */
const RealtimeBus = (function () {
  var channel = null;
  try { if (typeof BroadcastChannel !== "undefined") channel = new BroadcastChannel("mmwa.rt"); } catch (e) { channel = null; }
  var subs = [];
  function emit(msg) { for (var i = 0; i < subs.length; i++) { try { subs[i](msg); } catch (e) {} } }
  if (channel) channel.onmessage = function (ev) { emit(ev.data || { type: "db" }); };
  try {
    window.addEventListener("storage", function (ev) {
      if (ev.key === StorageService.KEY) emit({ type: "db", source: "storage" });
    });
  } catch (e) {}
  return {
    publish: function (type, payload) {
      var msg = { type: type || "db", payload: payload || {}, t: Date.now() };
      if (channel) { try { channel.postMessage(msg); } catch (e) {} }
    },
    subscribe: function (fn) { subs.push(fn); return function () { subs = subs.filter(function (x) { return x !== fn; }); }; },
    live: !!channel
  };
})();

function uid(prefix) { return (prefix || "id") + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function nowISO() { return new Date().toISOString(); }
function todayLong() { return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
function fmtDate(iso) { return iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"; }

/* ==========================================================================
   AUTH SERVICE  (placeholder local auth — no passwords stored)
   BACKEND NOTE: swap for Supabase Auth / Firebase Auth. Replace name-based
   sign-in with email + password (or magic link). Keep current()/role().
   ========================================================================== */

/* ==========================================================================
   AUTH SERVICE
   Two modes, chosen at load:
     "supabase"  email + password accounts (Supabase Auth). Roles come from a
                 server-side `profiles` table; teachers are set via the
                 mmwa_teacher_emails allow-list, so no one can self-promote.
     "name"      the original name-only prototype sign-in (offline fallback —
                 used automatically if no cloud is configured, or set
                 authMode:"name" in config.js to force it).
   A synchronous cache keeps current()/role() instant for the rest of the app.
   ========================================================================== */
var _authModeCache = null;
function authMode() {
  if (_authModeCache) return _authModeCache;
  var cfg = (typeof window !== "undefined" && window.MMWA_CONFIG) || {};
  if (cfg.authMode === "name") _authModeCache = "name";
  else if (cfg.authMode === "supabase") _authModeCache = "supabase";
  else _authModeCache = (typeof CloudService !== "undefined" && CloudService.available && CloudService.available()) ? "supabase" : "name";
  return _authModeCache;
}

const AuthService = (function () {
  var _user = null;   // {id, key, name, email, role}
  var _ready = false;

  function sb() { return CloudService.getClient ? CloudService.getClient() : null; }

  /* ---- name mode (legacy, local) ---- */
  function localCurrent() {
    var db = StorageService.read();
    if (!db.session) return null;
    return db.users.find(function (u) { return u.id === db.session.userId; }) || null;
  }

  /* ---- supabase mode ---- */
  function mirrorLocal(u) {
    StorageService.update(function (d) {
      var ex = d.users.find(function (x) { return x.id === u.id; });
      if (!ex) {
        d.users.push({ id: u.id, name: u.name, role: u.role, email: u.email, createdAt: nowISO() });
        if (u.role === "student" && !d.tokens[u.id]) d.tokens[u.id] = { mode: "open", allowed: 0, used: 0, expiry: "" };
      } else { ex.name = u.name; ex.role = u.role; ex.email = u.email; }
      d.session = { userId: u.id, role: u.role };
    });
  }
  function loadProfile(authUser) {
    var c = sb();
    if (!c || !authUser) { _user = null; return Promise.resolve(); }
    return c.from("profiles").select("*").eq("id", authUser.id).maybeSingle().then(function (res) {
      var p = res && res.data;
      var meta = authUser.user_metadata || {};
      var name = (p && p.display_name) || meta.display_name || (authUser.email || "").split("@")[0];
      var role = (p && p.role) || "student";
      _user = { id: authUser.id, key: authUser.id, name: name, email: authUser.email, role: role };
      mirrorLocal(_user);
    }, function () {
      _user = { id: authUser.id, key: authUser.id, name: (authUser.email || "").split("@")[0], email: authUser.email, role: "student" };
      mirrorLocal(_user);
    });
  }

  return {
    mode: function () { return authMode(); },
    ready: function () { return _ready; },

    current: function () { return authMode() === "supabase" ? _user : localCurrent(); },
    role: function () { var u = this.current(); return u ? u.role : null; },
    students: function () {
      var local = StorageService.read().users.filter(function (u) { return u.role === "student"; });
      if (authMode() !== "supabase") return local;
      var map = {};
      var cs = CloudService.cache.students || {};
      for (var id in cs) map[id] = { id: id, name: cs[id].name, role: "student" };
      local.forEach(function (u) { if (!map[u.id]) map[u.id] = u; });
      return Object.keys(map).map(function (id) { return map[id]; }).sort(function (a, b) { return (a.name || "").localeCompare(b.name || ""); });
    },
    byId: function (id) {
      var local = StorageService.read().users.find(function (u) { return u.id === id; });
      if (local) return local;
      if (authMode() === "supabase") {
        var cs = (CloudService.cache.students || {})[id]; if (cs) return cs;
        var nm = (CloudService.cache.roster || {})[id]; if (nm) return { id: id, name: nm, role: "student" };
      }
      return null;
    },

    signOut: function () {
      if (authMode() === "supabase") { var c = sb(); if (c) { try { c.auth.signOut(); } catch (e) {} } _user = null; StorageService.update(function (d) { d.session = null; }); }
      else { StorageService.update(function (d) { d.session = null; }); }
    },

    /* name-mode helpers (kept for that mode + "add sample student") */
    signIn: function (name, role) {
      name = (name || "").trim();
      if (!name) return null;
      var db = StorageService.read();
      var existing = db.users.find(function (u) { return u.role === role && u.name.toLowerCase() === name.toLowerCase(); });
      StorageService.update(function (d) {
        if (!existing) {
          existing = { id: uid("u"), name: name, role: role, createdAt: nowISO() };
          d.users.push(existing);
          if (role === "student" && !d.tokens[existing.id]) d.tokens[existing.id] = { mode: "open", allowed: 0, used: 0, expiry: "" };
        }
        d.session = { userId: existing.id, role: role };
      });
      return localCurrent();
    },
    switchUser: function (userId) {
      StorageService.update(function (d) { var u = d.users.find(function (x) { return x.id === userId; }); if (u) d.session = { userId: u.id, role: u.role }; });
    },

    /* supabase-mode methods (return promises) */
    signUp: function (email, password, displayName) {
      var c = sb(); if (!c) return Promise.reject(new Error("Cloud not configured"));
      var redirect = (typeof window !== "undefined") ? window.location.href.split("#")[0] : undefined;
      return c.auth.signUp({ email: (email || "").trim(), password: password, options: { data: { display_name: (displayName || "").trim() }, emailRedirectTo: redirect } });
    },
    signInEmail: function (email, password) {
      var c = sb(); if (!c) return Promise.reject(new Error("Cloud not configured"));
      return c.auth.signInWithPassword({ email: (email || "").trim(), password: password });
    },
    resetPassword: function (email) {
      var c = sb(); if (!c) return Promise.reject(new Error("Cloud not configured"));
      var redirect = (typeof window !== "undefined") ? window.location.href.split("#")[0] : undefined;
      return c.auth.resetPasswordForEmail((email || "").trim(), { redirectTo: redirect });
    },
    updatePassword: function (newPassword) {
      var c = sb(); if (!c) return Promise.reject(new Error("Cloud not configured"));
      return c.auth.updateUser({ password: newPassword });
    },

    init: function () {
      if (authMode() !== "supabase") { _ready = true; return Promise.resolve(); }
      var c = sb();
      if (!c) { _authModeCache = "name"; _ready = true; return Promise.resolve(); }
      try {
        c.auth.onAuthStateChange(function (event, session) {
          if (event === "PASSWORD_RECOVERY") { window.__mmwaRecovery = true; }
          var au = session && session.user;
          var done = function () { _ready = true; boot(); };
          if (au) loadProfile(au).then(done, done); else { _user = null; done(); }
        });
      } catch (e) { _authModeCache = "name"; _ready = true; }
      return Promise.resolve();
    }
  };
})();

/* ==========================================================================
   TASK SERVICE  — unifies Task 1 missions + Task 2 essays
   ========================================================================== */

const TaskService = {
  all: function () {
    return MISSIONS.map(function (m) { return Object.assign({ kind: "task1" }, m); })
      .concat(T2_TYPES.map(function (t) { return Object.assign({ kind: "task2" }, t); }));
  },
  byId: function (id) { return TaskService.all().find(function (t) { return t.id === id; }) || null; },
  byKind: function (kind) { return TaskService.all().filter(function (t) { return t.kind === kind; }); },
  types: function () { return Array.from(new Set(TaskService.all().map(function (t) { return t.type; }))); },
  minWords: function (kind) { return kind === "task1" ? 150 : 250; },
  examMinutes: function (kind) { return kind === "task1" ? 20 : 40; }
};

/* ==========================================================================
   DRAFT + SUBMISSION SERVICE
   ========================================================================== */

const SubmissionService = {
  draftKey: function (userId, taskId) { return userId + "::" + taskId; },
  getDraft: function (userId, taskId) {
    var k = this.draftKey(userId, taskId);
    var local = StorageService.read().drafts[k];
    if (cloudReady()) {
      var c = (CloudService.cache.drafts || {})[k];
      if (c && (!local || (c.updatedAt || "") > (local.updatedAt || ""))) return c;
    }
    return local || {};
  },
  patchDraft: function (userId, taskId, patch) {
    var k = this.draftKey(userId, taskId), merged;
    StorageService.update(function (db) {
      merged = Object.assign({}, db.drafts[k] || {}, patch, { updatedAt: nowISO() });
      db.drafts[k] = merged;
    });
    CloudService.putDraft(k, merged);
  },
  subId: function (userId, taskId, mode) { return userId + "|" + taskId + "|" + mode; },
  /* merged view: cloud (shared truth) ∪ local (offline / freshest), newest stamp wins */
  allMerged: function () {
    var local = StorageService.read().submissions || [];
    var map = {};
    local.forEach(function (s) { map[s.id] = s; });
    if (cloudReady()) {
      var cloud = CloudService.cache.submissions || {};
      for (var id in cloud) {
        var c = cloud[id], l = map[id];
        if (!l || subStamp(c) >= subStamp(l)) map[id] = c;
      }
    }
    return Object.keys(map).map(function (id) { return map[id]; });
  },
  get: function (userId, taskId, mode) {
    var id = this.subId(userId, taskId, mode);
    return this.allMerged().find(function (s) { return s.id === id; }) || null;
  },
  list: function (filter) {
    var subs = this.allMerged();
    subs.sort(function (a, b) { return (b.submittedAt || "").localeCompare(a.submittedAt || ""); });
    if (!filter) return subs;
    return subs.filter(function (s) {
      if (filter.userId && s.userId !== filter.userId) return false;
      if (filter.kind && s.kind !== filter.kind) return false;
      if (filter.mode && s.mode !== filter.mode) return false;
      if (filter.reviewed === true && !(s.review && s.review.reviewed)) return false;
      if (filter.reviewed === false && (s.review && s.review.reviewed)) return false;
      return true;
    });
  },
  byId: function (id) { return this.allMerged().find(function (s) { return s.id === id; }) || null; },
  /* Practice: upsert a single latest attempt; repeatable; not locked. */
  submitPractice: function (userId, taskId, payload) {
    var id = this.subId(userId, taskId, "practice");
    var task = TaskService.byId(taskId);
    var feedback = FeedbackService.generateAIWritingFeedback({ text: payload.text, kind: task.kind, task: task, checklist: payload.checklist, words: payload.words });
    var prev = this.byId(id);
    StorageService.update(function (db) {
      var rec = db.submissions.find(function (s) { return s.id === id; });
      var data = {
        id: id, userId: userId, taskId: taskId, kind: task.kind, type: task.type, title: task.title,
        mode: "practice", text: payload.text, words: payload.words, timeSpent: payload.timeSpent || 0,
        checklist: payload.checklist || {}, ai: feedback, review: (rec && rec.review) || (prev && prev.review) || null,
        locked: false, status: "submitted", submittedAt: nowISO()
      };
      if (rec) Object.assign(rec, data); else db.submissions.push(data);
    });
    var saved = StorageService.read().submissions.find(function (s) { return s.id === id; });
    CloudService.putSubmission(saved);
    return saved;
  },
  /* Exam: one locked submission. Blocked if a locked one already exists. */
  canSitExam: function (userId, taskId) {
    var s = this.get(userId, taskId, "exam");
    if (!s) return { ok: true };
    if (s.locked && !s.retakeAllowed) return { ok: false, reason: "submitted", submission: s };
    return { ok: true, submission: s };
  },
  submitExam: function (userId, taskId, payload) {
    var id = this.subId(userId, taskId, "exam");
    var task = TaskService.byId(taskId);
    var feedback = FeedbackService.generateAIWritingFeedback({ text: payload.text, kind: task.kind, task: task, checklist: payload.checklist, words: payload.words });
    var prev = this.byId(id);
    StorageService.update(function (db) {
      var rec = db.submissions.find(function (s) { return s.id === id; });
      var attempt = (rec ? (rec.attempt || 1) : (prev ? (prev.attempt || 1) : 0)) + 1;
      var data = {
        id: id, userId: userId, taskId: taskId, kind: task.kind, type: task.type, title: task.title,
        mode: "exam", text: payload.text, words: payload.words, timeSpent: payload.timeSpent || 0,
        checklist: payload.checklist || {}, ai: feedback, review: (rec && rec.review) || (prev && prev.review) || null,
        locked: true, retakeAllowed: false, attempt: attempt, status: "submitted", submittedAt: nowISO()
      };
      if (rec) Object.assign(rec, data); else db.submissions.push(data);
    });
    var saved = StorageService.read().submissions.find(function (s) { return s.id === id; });
    CloudService.putSubmission(saved);
    TokenService.consume(userId);
    return saved;
  },
  allowRetake: function (submissionId) {
    var cur = this.byId(submissionId); if (!cur) return;
    var updated = Object.assign({}, cur, { retakeAllowed: true, locked: false });
    StorageService.update(function (db) {
      var i = db.submissions.findIndex(function (x) { return x.id === submissionId; });
      if (i >= 0) db.submissions[i] = updated; else db.submissions.push(updated);
    });
    CloudService.putSubmission(updated);
  },
  applyReview: function (submissionId, review, reviewerName) {
    var cur = this.byId(submissionId); if (!cur) return null;
    var updated = Object.assign({}, cur, { review: Object.assign({}, review, { reviewed: true, reviewedAt: nowISO(), by: reviewerName }), status: "reviewed" });
    StorageService.update(function (db) {
      var i = db.submissions.findIndex(function (x) { return x.id === submissionId; });
      if (i >= 0) db.submissions[i] = updated; else db.submissions.push(updated);
    });
    CloudService.putSubmission(updated);
    return updated;
  }
};

/* ==========================================================================
   FEEDBACK SERVICE  —  generateAIWritingFeedback(submission)
   --------------------------------------------------------------------------
   This returns a STRUCTURED object so it can be swapped for a real model.
   Right now it is a local heuristic engine, labelled "Preliminary Writing
   Diagnostic". It does NOT claim to be a real examiner or a real AI.
   --------------------------------------------------------------------------
   BACKEND / AI NOTE — to connect a real model later, replace the body of
   generateAIWritingFeedback with, e.g.:
     const res = await fetch('/api/feedback', { method:'POST',
       body: JSON.stringify({ text, kind, taskType }) });
     return await res.json();   // same shape as buildLocalDiagnostic returns
   The UI (renderFeedback) only reads the returned object, so nothing else
   needs to change.
   ========================================================================== */

const LINKERS = ["however", "moreover", "furthermore", "therefore", "in addition", "for example", "for instance", "on the other hand", "as a result", "in contrast", "whereas", "while", "although", "because", "consequently", "nevertheless", "overall", "in conclusion", "firstly", "secondly", "finally", "in particular", "such as", "by contrast"];
const INFORMAL = [["kids", "children"], ["a lot of", "many / much"], ["lots of", "a great deal of"], ["stuff", "items / aspects"], ["things", "factors / elements"], ["gonna", "going to"], ["wanna", "want to"], ["big", "substantial / considerable"], ["get", "obtain / receive"], ["nowadays", "in recent years"], ["good", "beneficial / effective"], ["bad", "harmful / detrimental"], ["really", "considerably"], ["very", "highly / markedly"]];
const SYNONYMS = { increase: "rise / grow / climb", decrease: "fall / decline / drop", important: "significant / crucial / vital", show: "illustrate / demonstrate / indicate", people: "individuals / citizens", money: "income / capital / funds", problem: "issue / challenge / difficulty", good: "beneficial / advantageous", bad: "harmful / adverse", think: "believe / consider / maintain", many: "numerous / a great many", help: "assist / support / facilitate" };

const FeedbackService = {
  generateAIWritingFeedback: function (submission) {
    return buildLocalDiagnostic(submission.text || "", submission.kind, submission.task || {}, submission.checklist || {}, submission.words);
  }
};

function tokenizeSentences(text) {
  return (text.match(/[^.!?]+[.!?]+/g) || (text.trim() ? [text.trim()] : []))
    .map(function (s) { return s.trim(); }).filter(Boolean);
}
function tokenizeWordsLower(text) {
  var m = text.toLowerCase().match(/[a-z'’]+/g);
  return m || [];
}
function clampBand(b) { return Math.max(4, Math.min(8.5, Math.round(b * 2) / 2)); }

function buildLocalDiagnostic(text, kind, task, checklist, wordsArg) {
  var words = typeof wordsArg === "number" ? wordsArg : countWords(text);
  var minWords = TaskService.minWords(kind);
  var sentences = tokenizeSentences(text);
  var paras = text.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
  var lower = " " + text.toLowerCase() + " ";
  var wl = tokenizeWordsLower(text);

  // Linking
  var linkUsed = LINKERS.filter(function (l) { return lower.indexOf(" " + l + " ") !== -1 || lower.indexOf(" " + l + ",") !== -1; });
  // Repetition: most frequent content word (>3 letters, not a linker)
  var freq = {}, stop = { the: 1, and: 1, that: 1, this: 1, with: 1, from: 1, have: 1, has: 1, was: 1, were: 1, are: 1, for: 1, which: 1, their: 1, they: 1, there: 1 };
  wl.forEach(function (w) { if (w.length > 3 && !stop[w]) freq[w] = (freq[w] || 0) + 1; });
  var topWord = "", topCount = 0;
  Object.keys(freq).forEach(function (w) { if (freq[w] > topCount) { topCount = freq[w]; topWord = w; } });
  var repetitionHeavy = topCount >= 5 && (topCount / Math.max(1, wl.length)) > 0.03;

  // Sentence length variety
  var lens = sentences.map(function (s) { return countWords(s); });
  var avgLen = lens.length ? lens.reduce(function (a, b) { return a + b; }, 0) / lens.length : 0;
  var maxLen = lens.length ? Math.max.apply(null, lens) : 0;
  var variety = lens.length > 2 ? (Math.max.apply(null, lens) - Math.min.apply(null, lens)) : 0;

  // Informal / contractions
  var informalFound = INFORMAL.filter(function (pair) { return lower.indexOf(" " + pair[0] + " ") !== -1; });
  var contractions = (text.match(/\b\w+['’](t|s|re|ve|ll|d|m)\b/gi) || []);

  // Structure signals
  var overviewPresent = /\b(overall|in general|in summary|broadly speaking)\b/i.test(text);
  var thesisPresent = /\b(i believe|i think|in my (view|opinion)|i (agree|disagree)|i would argue|my view is)\b/i.test(text);
  var hasConclusion = /\b(in conclusion|to conclude|in summary|to sum up)\b/i.test(text);

  // Checklist ratio
  var checkVals = Object.keys(checklist).map(function (k) { return checklist[k]; });
  var checkRatio = checkVals.length ? checkVals.filter(Boolean).length / 8 : 0;

  var t1 = kind === "task1";

  /* ---- Criterion scoring (heuristic, deliberately conservative) ---- */
  function score(base, mods) { var b = base; mods.forEach(function (m) { b += m; }); return clampBand(b); }

  // Task Achievement / Response
  var taBase = 6;
  var taMods = [];
  if (words < minWords) taMods.push(-1.2 - Math.min(1, (minWords - words) / minWords));
  else taMods.push(0.3);
  if (t1) { taMods.push(overviewPresent ? 0.6 : -1.2); }
  else { taMods.push(thesisPresent ? 0.5 : -1.0); taMods.push(hasConclusion ? 0.2 : -0.4); }
  taMods.push((checkRatio - 0.5) * 0.8);
  var taScore = score(taBase, taMods);

  // Coherence & Cohesion
  var ccBase = 6;
  var ccMods = [];
  if (paras.length >= (t1 ? 3 : 4)) ccMods.push(0.5); else if (paras.length <= 1) ccMods.push(-1.2); else ccMods.push(-0.3);
  if (linkUsed.length >= 3 && linkUsed.length <= 9) ccMods.push(0.5); else if (linkUsed.length < 2) ccMods.push(-0.7); else ccMods.push(-0.3);
  var ccScore = score(ccBase, ccMods);

  // Lexical Resource
  var lrBase = 6;
  var lrMods = [];
  if (informalFound.length) lrMods.push(-0.5 - 0.2 * Math.min(3, informalFound.length));
  if (repetitionHeavy) lrMods.push(-0.7);
  var uniqueRatio = wl.length ? Object.keys(freq).length / wl.length : 0;
  if (uniqueRatio > 0.45) lrMods.push(0.4);
  var lrScore = score(lrBase, lrMods);

  // Grammatical Range & Accuracy
  var grBase = 6;
  var grMods = [];
  if (variety >= 8) grMods.push(0.5); else if (variety <= 3 && sentences.length > 2) grMods.push(-0.6);
  if (maxLen > 45) grMods.push(-0.5); // likely run-on
  if (contractions.length) grMods.push(-0.4);
  var grScore = score(grBase, grMods);

  var estimatedBand = clampBand((taScore + ccScore + lrScore + grScore) / 4);

  /* ---- Narrative: strengths / weaknesses / errors ---- */
  var strengths = [], weaknesses = [], errors = [];

  if (words >= minWords) strengths.push("You met the minimum length (" + words + " words), so length will not cap your band.");
  else weaknesses.push("Your response is " + words + " words — under the " + minWords + "-word minimum, which automatically limits Task " + (t1 ? "Achievement" : "Response") + ".");

  if (t1) {
    if (overviewPresent) strengths.push("A clear overview signal is present — the single most important sentence in Task 1.");
    else weaknesses.push("No clear overview was detected. Add one sentence beginning 'Overall,' that states the main trend with no detailed figures.");
  } else {
    if (thesisPresent) strengths.push("Your position is stated explicitly, which anchors Task Response.");
    else weaknesses.push("Your position is not clearly signalled. State it directly in the introduction (e.g. 'In my view, …').");
    if (!hasConclusion) weaknesses.push("No conclusion was detected. Add a final paragraph that restates your position in fresh words.");
  }

  if (paras.length >= (t1 ? 3 : 4)) strengths.push("Paragraphing is clear (" + paras.length + " paragraphs), supporting Coherence & Cohesion.");
  else weaknesses.push("Only " + paras.length + " paragraph" + (paras.length === 1 ? "" : "s") + " detected. Aim for " + (t1 ? "intro → overview → two bodies" : "intro → two/three bodies → conclusion") + ".");

  if (linkUsed.length >= 3 && linkUsed.length <= 9) strengths.push("A natural range of linking devices is used (" + linkUsed.slice(0, 4).join(", ") + "…).");
  else if (linkUsed.length < 2) weaknesses.push("Very few linking devices were found. Add cohesion with words such as while, whereas, as a result.");

  if (informalFound.length) {
    weaknesses.push("Informal language detected (" + informalFound.map(function (p) { return p[0]; }).join(", ") + "). The task requires an academic register.");
    informalFound.slice(0, 4).forEach(function (p) { errors.push({ type: "Register", detail: "“" + p[0] + "” is informal — prefer " + p[1] + "." }); });
  }
  if (contractions.length) errors.push({ type: "Register", detail: "Contractions found (" + contractions.slice(0, 3).join(", ") + "). Write them in full in academic writing." });
  if (repetitionHeavy) { weaknesses.push("The word “" + topWord + "” is repeated " + topCount + " times — vary it with synonyms or referencing."); errors.push({ type: "Lexical", detail: "Overuse of “" + topWord + "”. Use synonyms or pronouns (this trend, such measures)." }); }
  if (maxLen > 45) errors.push({ type: "Grammar", detail: "A sentence runs to about " + maxLen + " words — likely a run-on. Split it into two." });
  if (variety <= 3 && sentences.length > 2) weaknesses.push("Sentence length is uniform. Mix short and longer complex sentences to lift Grammatical Range.");

  if (!strengths.length) strengths.push("You produced a complete attempt — the starting point for every improvement.");
  if (!weaknesses.length) weaknesses.push("No major structural issues were flagged. Focus next on precision of vocabulary and complex grammar.");

  /* ---- Sentence-level corrections (honest, rule-based) ---- */
  var sentenceCorrections = [];
  // expand first contraction in context
  var cMatch = text.match(/[^.!?]*\b\w+['’](t|s|re|ve|ll|d|m)\b[^.!?]*[.!?]/);
  if (cMatch) {
    var fixed = cMatch[0].replace(/\bdon['’]t\b/gi, "do not").replace(/\bcan['’]t\b/gi, "cannot").replace(/\bit['’]s\b/gi, "it is").replace(/\bdoesn['’]t\b/gi, "does not").replace(/\bwon['’]t\b/gi, "will not").replace(/\b(\w+)['’]re\b/gi, "$1 are").replace(/\b(\w+)['’]ve\b/gi, "$1 have").replace(/\b(\w+)['’]ll\b/gi, "$1 will");
    sentenceCorrections.push({ original: cMatch[0].trim(), improved: fixed.trim(), reason: "Expand contractions for an academic register." });
  }
  if (informalFound.length) {
    var inf = informalFound[0];
    var infSent = sentences.find(function (s) { return s.toLowerCase().indexOf(inf[0]) !== -1; });
    if (infSent) sentenceCorrections.push({ original: infSent, improved: infSent.replace(new RegExp("\\b" + inf[0] + "\\b", "i"), inf[1].split(" / ")[0]), reason: "Replace informal “" + inf[0] + "” with an academic alternative." });
  }
  if (maxLen > 45) {
    var longSent = sentences[lens.indexOf(maxLen)];
    if (longSent) sentenceCorrections.push({ original: longSent.slice(0, 140) + (longSent.length > 140 ? "…" : ""), improved: "Split this into two sentences, each carrying one idea, joined where needed with 'and', 'but' or 'as a result'.", reason: "Long run-on sentence reduces grammatical accuracy." });
  }

  /* ---- Vocabulary + grammar upgrades ---- */
  var vocabUpgrades = [];
  Object.keys(SYNONYMS).forEach(function (w) {
    if (lower.indexOf(" " + w + " ") !== -1 && vocabUpgrades.length < 4) vocabUpgrades.push({ from: w, to: SYNONYMS[w] });
  });
  if (!vocabUpgrades.length) vocabUpgrades.push({ from: "(general)", to: "Introduce one or two precise academic phrases per paragraph — e.g. 'a marked increase', 'a negligible proportion'." });

  var grammarUpgrades = [];
  if (variety <= 4) grammarUpgrades.push("Combine two short sentences with a relative clause: 'X rose to 35%, which made it the largest category.'");
  if (t1) grammarUpgrades.push("Use a mix of active and passive: 'water is added', 'the figure then climbed'.");
  else grammarUpgrades.push("Add a concession structure: 'Although … , I still believe … .'");
  grammarUpgrades.push("Vary sentence openings — start some with a linking adverb, some with the subject, some with a time phrase.");

  /* ---- Next recommendation ---- */
  var crit = [["Task " + (t1 ? "Achievement" : "Response"), taScore, t1 ? "the-overview" : "no-clear-position"], ["Coherence & Cohesion", ccScore, "weak-paragraphing"], ["Lexical Resource", lrScore, "repetition"], ["Grammatical Range & Accuracy", grScore, "grammar-accuracy"]];
  crit.sort(function (a, b) { return a[1] - b[1]; });
  var weakest = crit[0];
  var nextRecommendation = "Your lowest area is " + weakest[0] + " (~" + weakest[1].toFixed(1) + "). Open the Writing Clinic and work through the matching module, then re-attempt a " + (t1 ? "Foundation" : "Core") + " task focusing only on that criterion.";

  /* ---- Summaries ---- */
  var studentSummary = "You scored an estimated band " + estimatedBand.toFixed(1) + " on this automated diagnostic. " +
    (strengths[0] ? "Strength: " + strengths[0] + " " : "") +
    (weaknesses[0] ? "Focus next on: " + weaknesses[0] : "");
  var teacherSummary = "Diagnostic band ~" + estimatedBand.toFixed(1) + " (TA/TR " + taScore.toFixed(1) + ", CC " + ccScore.toFixed(1) + ", LR " + lrScore.toFixed(1) + ", GRA " + grScore.toFixed(1) + "). " +
    words + " words, " + paras.length + " paragraphs, " + linkUsed.length + " linkers" + (informalFound.length ? ", informal register flags" : "") + (repetitionHeavy ? ", repetition of “" + topWord + "”" : "") + ". Weakest criterion: " + weakest[0] + ".";

  return {
    kind: "preliminary",
    label: "Preliminary Writing Diagnostic — automated, not a live AI examiner",
    generatedAt: nowISO(),
    estimatedBand: estimatedBand,
    criteria: {
      taskAchievement: { band: taScore, label: t1 ? "Task Achievement" : "Task Response" },
      coherenceCohesion: { band: ccScore, label: "Coherence & Cohesion" },
      lexicalResource: { band: lrScore, label: "Lexical Resource" },
      grammaticalRange: { band: grScore, label: "Grammatical Range & Accuracy" }
    },
    metrics: { wordCount: words, minWords: minWords, paragraphs: paras.length, sentences: sentences.length, linkers: linkUsed.length, avgSentence: Math.round(avgLen), overviewPresent: overviewPresent, thesisPresent: thesisPresent },
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    errors: errors.slice(0, 6),
    sentenceCorrections: sentenceCorrections.slice(0, 3),
    vocabUpgrades: vocabUpgrades,
    grammarUpgrades: grammarUpgrades.slice(0, 3),
    nextRecommendation: nextRecommendation,
    teacherSummary: teacherSummary,
    studentSummary: studentSummary
  };
}

/* ==========================================================================
   ASSIGNMENT SERVICE
   ========================================================================== */

const AssignmentService = {
  create: function (data) {
    var rec = Object.assign({ id: uid("hw"), createdAt: nowISO() }, data);
    StorageService.update(function (db) { db.assignments.push(rec); });
    CloudService.putHomework(rec);
    return rec;
  },
  remove: function (id) {
    StorageService.update(function (db) { db.assignments = db.assignments.filter(function (a) { return a.id !== id; }); });
    CloudService.delHomework(id);
  },
  all: function () {
    var local = StorageService.read().assignments.slice();
    var map = {}; local.forEach(function (a) { map[a.id] = a; });
    if (cloudReady()) { var hw = CloudService.cache.homework || {}; for (var id in hw) map[id] = hw[id]; }
    return Object.keys(map).map(function (id) { return map[id]; }).sort(function (a, b) { return (b.createdAt || "").localeCompare(a.createdAt || ""); });
  },
  forStudent: function (studentId) { return this.all().filter(function (a) { return a.studentId === studentId || a.studentId === "*"; }); },
  statusFor: function (assignment, studentId) {
    var sub = SubmissionService.list({ userId: studentId }).find(function (s) { return s.taskId === assignment.taskId && s.mode === assignment.mode; });
    if (!sub) {
      var draft = SubmissionService.getDraft(studentId, assignment.taskId);
      return (draft && draft.draft && draft.draft.trim()) ? "In progress" : "Not started";
    }
    if (sub.review && sub.review.reviewed) return "Reviewed";
    return "Submitted";
  }
};

/* ==========================================================================
   CLOUD SERVICE  (Supabase — cross-device Improvement Lab)
   --------------------------------------------------------------------------
   Three tables, all scoped by `room` so different classes stay separate:
     mmwa_clinic_assignments   teacher → which activity is set / unlocked
     mmwa_clinic_work          student → live attempt + status (the real-time bit)
     mmwa_clinic_roster        student presence so the teacher can target by name
   Persistence is mirrored into an in-memory cache and refreshed by Supabase
   Realtime. localStorage remains the offline fallback — if the network or the
   tables are missing, every call fails quietly and the app keeps working.
   ========================================================================== */
function studentKey(name) { return String(name || "").trim().toLowerCase().replace(/\s+/g, " "); }
/* canonical clinic identity for a user: account uid when signed in with an
   account, else the normalised display name (name-only fallback mode). */
function clinicKeyFor(u) { if (!u) return ""; return u.key || (authMode() === "supabase" ? u.id : studentKey(u.name)); }
/* true when the cloud is configured AND a live session/connection is up */
function cloudReady() { return CloudService.available() && CloudService.isConnected(); }
function subStamp(s) { var a = (s && s.submittedAt) || ""; var b = (s && s.review && s.review.reviewedAt) || ""; return a > b ? a : b; }

const CloudService = (function () {
  var cfg = (typeof window !== "undefined" && window.MMWA_CONFIG) || {};
  var client = null, connected = false, channel = null, roomOverride = "";
  var cache = { assignments: [], work: {}, roster: {}, students: {}, submissions: {}, drafts: {}, tokens: {}, certs: {}, homework: {} };
  var _hwBackfillDone = false;
  var changeFns = [];
  function fireChange() { for (var i = 0; i < changeFns.length; i++) { try { changeFns[i](); } catch (e) {} } }
  function available() {
    return !!(cfg.supabaseUrl && cfg.supabaseAnonKey && typeof window !== "undefined" &&
      window.supabase && typeof window.supabase.createClient === "function");
  }
  function room() {
    if (roomOverride) return roomOverride;
    var saved = "";
    try { saved = localStorage.getItem("mmwa.room") || ""; } catch (e) {}
    return saved || cfg.defaultRoom || "mmwa-main";
  }
  function ensureClient() {
    if (client || !available()) return client;
    try { client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { realtime: { params: { eventsPerSecond: 6 } } }); }
    catch (e) { client = null; }
    return client;
  }
  function hydrate() {
    if (!ensureClient()) return;
    var r = room();
    try {
      Promise.all([
        client.from("mmwa_clinic_assignments").select("*").eq("room", r),
        client.from("mmwa_clinic_work").select("*").eq("room", r),
        client.from("mmwa_clinic_roster").select("*").eq("room", r),
        client.from("profiles").select("id,display_name,role").eq("role", "student")
      ]).then(function (res) {
        var a = res[0] || {}, w = res[1] || {}, ro = res[2] || {}, pr = res[3] || {};
        if (a.error || w.error || ro.error) { connected = false; fireChange(); return; }
        cache.assignments = a.data || [];
        cache.work = {};
        (w.data || []).forEach(function (row) { cache.work[row.student_key + "::" + row.clinic_index] = row; });
        cache.roster = {};
        // students known from their account profiles (lets the teacher target them before they open the clinic)
        cache.students = {};
        if (!pr.error) (pr.data || []).forEach(function (p) { if (p.id) { cache.roster[p.id] = p.display_name || p.id; cache.students[p.id] = { id: p.id, name: p.display_name || p.id, role: "student" }; } });
        (ro.data || []).forEach(function (row) { if (!cache.roster[row.student_key]) cache.roster[row.student_key] = row.student_name; });
        (w.data || []).forEach(function (row) { if (!cache.roster[row.student_key]) cache.roster[row.student_key] = row.student_name; });
        (a.data || []).forEach(function (row) { if (row.student_key !== "*" && row.student_name && !cache.roster[row.student_key]) cache.roster[row.student_key] = row.student_name; });
        connected = true;
        fireChange();
      }, function () { connected = false; fireChange(); });
    } catch (e) { connected = false; }
    hydrateData();
  }
  /* Phase 2 — best-effort cloud sync of the rest of the app's data. Each table
     is fetched independently; a missing table just leaves that slice on local. */
  function hydrateData() {
    if (!ensureClient()) return;
    var grab = function (table, onData) {
      try { client.from(table).select("*").then(function (res) { if (res && !res.error) { onData(res.data || []); fireChange(); } }, function () {}); } catch (e) {}
    };
    grab("mmwa_submissions", function (rows) { var m = {}; rows.forEach(function (r) { if (r.data) m[r.id] = r.data; }); cache.submissions = m; });
    grab("mmwa_drafts", function (rows) { var m = {}; rows.forEach(function (r) { if (r.data) m[r.id] = r.data; }); cache.drafts = m; });
    grab("mmwa_tokens", function (rows) { var m = {}; rows.forEach(function (r) { if (r.data) m[r.user_id] = r.data; }); cache.tokens = m; });
    grab("mmwa_certificates", function (rows) { var m = {}; rows.forEach(function (r) { if (r.data) m[r.id] = r.data; }); cache.certs = m; });
    grab("mmwa_homework", function (rows) { var m = {}; rows.forEach(function (r) { if (r.data) m[r.id] = r.data; }); cache.homework = m; backfillHomework(); });
  }
  /* One-time heal: any teacher-side homework created before cloud sync (the
     permissions fix) only ever saved to localStorage. On the teacher's device,
     push anything not yet in the cloud up to mmwa_homework. Idempotent upsert;
     runs once per session, teacher only. Students skip cheaply (and don't set
     the flag, so a teacher whose role resolves on a later hydrate still heals). */
  function backfillHomework() {
    if (_hwBackfillDone) return;
    if (!ensureClient()) return;
    if (!(typeof AuthService !== "undefined" && AuthService.role && AuthService.role() === "teacher")) return;
    _hwBackfillDone = true;
    try {
      var local = (typeof StorageService !== "undefined") ? (StorageService.read().assignments || []) : [];
      var cloud = cache.homework || {};
      local.filter(function (a) { return a && a.id && !cloud[a.id]; }).forEach(function (a) {
        try { client.from("mmwa_homework").upsert({ id: a.id, student_id: a.studentId, data: a, created_at: a.createdAt || nowISO() }).then(function () {}, function () {}); } catch (e) {}
      });
    } catch (e) {}
  }
  function subscribe() {
    if (!ensureClient()) return;
    var r = room();
    if (channel) { try { client.removeChannel(channel); } catch (e) {} channel = null; }
    try {
      channel = client.channel("mmwa-lab-" + r)
        .on("postgres_changes", { event: "*", schema: "public", table: "mmwa_clinic_assignments", filter: "room=eq." + r }, hydrate)
        .on("postgres_changes", { event: "*", schema: "public", table: "mmwa_clinic_work", filter: "room=eq." + r }, hydrate)
        .on("postgres_changes", { event: "*", schema: "public", table: "mmwa_clinic_roster", filter: "room=eq." + r }, hydrate)
        .on("postgres_changes", { event: "*", schema: "public", table: "mmwa_submissions" }, hydrateData)
        .on("postgres_changes", { event: "*", schema: "public", table: "mmwa_drafts" }, hydrateData)
        .on("postgres_changes", { event: "*", schema: "public", table: "mmwa_tokens" }, hydrateData)
        .on("postgres_changes", { event: "*", schema: "public", table: "mmwa_certificates" }, hydrateData)
        .on("postgres_changes", { event: "*", schema: "public", table: "mmwa_homework" }, hydrateData)
        .subscribe(function (status) { connected = (status === "SUBSCRIBED"); fireChange(); });
    } catch (e) { /* realtime unavailable */ }
  }
  function curUid() { var u = (typeof AuthService !== "undefined") && AuthService.current && AuthService.current(); return u ? u.id : null; }
  return {
    available: available,
    getClient: function () { return ensureClient(); },
    isConnected: function () { return connected; },
    cache: cache,
    room: room,
    onChange: function (fn) { changeFns.push(fn); },
    connect: function () { if (!ensureClient()) return false; hydrate(); subscribe(); return true; },
    refresh: function () { if (ensureClient()) hydrateData(); },
    setRoom: function (name) {
      roomOverride = (name || "").trim();
      try { localStorage.setItem("mmwa.room", roomOverride || (cfg.defaultRoom || "mmwa-main")); } catch (e) {}
      if (ensureClient()) { hydrate(); subscribe(); }
    },
    upsertAssignment: function (row) { if (!ensureClient()) return; try { client.from("mmwa_clinic_assignments").upsert(row).then(function () {}, function () {}); } catch (e) {} },
    deleteAssignment: function (id) { if (!ensureClient()) return; try { client.from("mmwa_clinic_assignments").delete().eq("id", id).then(function () {}, function () {}); } catch (e) {} },
    upsertWork: function (row) { if (!ensureClient()) return; try { client.from("mmwa_clinic_work").upsert(row, { onConflict: "room,student_key,clinic_index" }).then(function () {}, function () {}); } catch (e) {} },
    pingRoster: function (row) { if (!ensureClient()) return; try { client.from("mmwa_clinic_roster").upsert(row, { onConflict: "room,student_key" }).then(function () {}, function () {}); } catch (e) {} },

    /* Phase 2 generic writers — store the app object as jsonb `data`. */
    putSubmission: function (sub) { if (!ensureClient() || !sub) return; var uidv = sub.userId || curUid(); try { client.from("mmwa_submissions").upsert({ id: sub.id, user_id: uidv, student_name: (AuthService.byId(uidv) || {}).name || null, data: sub, submitted_at: sub.submittedAt || nowISO(), updated_at: nowISO() }).then(function () {}, function () {}); } catch (e) {} },
    putDraft: function (id, data) { if (!ensureClient()) return; try { client.from("mmwa_drafts").upsert({ id: id, user_id: curUid(), data: data, updated_at: nowISO() }).then(function () {}, function () {}); } catch (e) {} },
    putToken: function (userId, data) { if (!ensureClient()) return; try { client.from("mmwa_tokens").upsert({ user_id: userId, data: data, updated_at: nowISO() }).then(function () {}, function () {}); } catch (e) {} },
    putCertificate: function (cert) { if (!ensureClient() || !cert) return; try { client.from("mmwa_certificates").upsert({ id: cert.id, user_id: cert.userId, data: cert, created_at: cert.createdAt || nowISO() }).then(function () {}, function () {}); } catch (e) {} },
    putHomework: function (hw) { if (!ensureClient() || !hw) return; try { client.from("mmwa_homework").upsert({ id: hw.id, student_id: hw.studentId, data: hw, created_at: hw.createdAt || nowISO() }).then(function () {}, function () {}); } catch (e) {} },
    delHomework: function (id) { if (!ensureClient()) return; try { client.from("mmwa_homework").delete().eq("id", id).then(function () {}, function () {}); } catch (e) {} }
  };
})();

/* ==========================================================================
   CLINIC SERVICE  (Improvement Lab)
   Canonical id for a student = studentKey(displayName), so a student is the
   same person on every device. Reads MERGE localStorage (this device) with the
   Supabase cache (the shared room); writes go to both. Assignment studentKey:
   "*" = whole class, otherwise a studentKey.
   ========================================================================== */
const ClinicService = {
  activities: function () { return CLINIC; },
  workKey: function (key, idx) { return key + "::" + idx; },
  cloudOn: function () { return CloudService.available() && CloudService.isConnected(); },

  /* ---- roster (teacher) : local students ∪ cloud roster ---- */
  roster: function () {
    var map = {};
    var acct = authMode() === "supabase";
    AuthService.students().forEach(function (s) { var k = acct ? s.id : studentKey(s.name); if (k) map[k] = s.name; });
    if (this.cloudOn()) { var r = CloudService.cache.roster; for (var k in r) if (!map[k]) map[k] = r[k]; }
    return Object.keys(map).map(function (k) { return { key: k, name: map[k] }; })
      .sort(function (a, b) { return a.name.localeCompare(b.name); });
  },
  nameForKey: function (key) {
    if (key === "*") return "All students";
    var hit = this.roster().filter(function (r) { return r.key === key; })[0];
    return hit ? hit.name : key;
  },

  /* ---- assignments : local ∪ cloud (cloud wins on conflict) ---- */
  assignments: function () {
    var out = {}, push = function (a) { out[a.studentId + "|" + a.clinicIndex] = a; };
    StorageService.read().clinicAssignments.forEach(push);
    if (this.cloudOn()) {
      CloudService.cache.assignments.forEach(function (row) {
        push({ id: row.id, studentId: row.student_key, clinicIndex: row.clinic_index, unlockCode: row.unlock_code || "", deadline: row.deadline || "", instructions: row.instructions || "", by: row.by_name || "", createdAt: row.created_at || "" });
      });
    }
    return Object.keys(out).map(function (k) { return out[k]; })
      .sort(function (a, b) { return (b.createdAt || "").localeCompare(a.createdAt || ""); });
  },
  assign: function (data) {
    var rec = { id: uid("cl"), studentId: data.studentKey, clinicIndex: data.clinicIndex, unlockCode: data.unlockCode || "", deadline: data.deadline || "", instructions: data.instructions || "", by: data.by || "", createdAt: nowISO() };
    StorageService.update(function (db) {
      db.clinicAssignments = db.clinicAssignments.filter(function (a) { return !(a.studentId === rec.studentId && a.clinicIndex === rec.clinicIndex); });
      db.clinicAssignments.push(rec);
    });
    CloudService.upsertAssignment({ id: rec.id, room: CloudService.room(), student_key: rec.studentId, student_name: (rec.studentId === "*" ? "" : this.nameForKey(rec.studentId)), clinic_index: rec.clinicIndex, unlock_code: rec.unlockCode, deadline: rec.deadline, instructions: rec.instructions, by_name: rec.by, created_at: rec.createdAt });
    RealtimeBus.publish("db", { reason: "clinic-assign" });
    return rec;
  },
  remove: function (id) {
    StorageService.update(function (db) { db.clinicAssignments = db.clinicAssignments.filter(function (a) { return a.id !== id; }); });
    CloudService.deleteAssignment(id);
    RealtimeBus.publish("db", { reason: "clinic-unassign" });
  },
  forStudent: function (key) {
    return this.assignments().filter(function (a) { return a.studentId === key || a.studentId === "*"; });
  },
  assignmentFor: function (key, idx) {
    var mine = this.forStudent(key).filter(function (a) { return a.clinicIndex === idx; });
    if (!mine.length) return null;
    mine.sort(function (a, b) { return (a.studentId === "*" ? 1 : 0) - (b.studentId === "*" ? 1 : 0); });
    return mine[0];
  },

  /* ---- live work : merge local + cloud by latest updatedAt ---- */
  getWork: function (key, idx) {
    var local = StorageService.read().clinicWork[this.workKey(key, idx)] || null;
    var cloud = null;
    if (this.cloudOn()) {
      var row = CloudService.cache.work[key + "::" + idx];
      if (row) cloud = { studentId: key, clinicIndex: idx, attempt: row.attempt || "", status: row.status || "typing", revealed: !!row.revealed, unlocked: !!row.unlocked, updatedAt: row.updated_at || "" };
    }
    if (local && cloud) return ((local.updatedAt || "") >= (cloud.updatedAt || "")) ? local : cloud;
    return local || cloud;
  },
  saveWork: function (key, name, idx, patch) {
    var k = this.workKey(key, idx), merged;
    StorageService.update(function (db) {
      merged = Object.assign(
        { studentId: key, studentName: name, clinicIndex: idx, attempt: "", status: "typing", revealed: false, unlocked: false },
        db.clinicWork[k] || {}, patch, { studentName: name, updatedAt: nowISO() }
      );
      db.clinicWork[k] = merged;
    });
    CloudService.upsertWork({ room: CloudService.room(), student_key: key, student_name: name, clinic_index: idx, attempt: merged.attempt, status: merged.status, revealed: merged.revealed, unlocked: merged.unlocked, updated_at: merged.updatedAt });
    RealtimeBus.publish("clinic-work", { key: key, idx: idx });
  },

  stateFor: function (key, idx) {
    var asg = this.assignmentFor(key, idx);
    var w = this.getWork(key, idx);
    if (!asg) return { assigned: false, locked: false, work: w, status: w ? w.status : "none" };
    var locked = !!(asg.unlockCode) && !(w && w.unlocked);
    return { assigned: true, asg: asg, locked: locked, work: w, status: locked ? "locked" : (w ? w.status : "open") };
  }
};

/* ==========================================================================
   TOKEN SERVICE  (optional exam access control)
   ========================================================================== */

const TokenService = {
  _raw: function (userId) {
    if (cloudReady()) { var c = (CloudService.cache.tokens || {})[userId]; if (c) return c; }
    return StorageService.read().tokens[userId] || null;
  },
  status: function (userId) {
    var t = this._raw(userId);
    if (!t) return { mode: "open", allowed: 0, used: 0, remaining: Infinity, expiry: "" };
    if (t.mode === "open") return { mode: "open", remaining: Infinity, allowed: 0, used: 0, expiry: t.expiry || "" };
    var remaining = Math.max(0, (t.allowed || 0) - (t.used || 0));
    var expired = t.expiry && new Date(t.expiry) < new Date();
    return { mode: "tokens", allowed: t.allowed || 0, used: t.used || 0, remaining: expired ? 0 : remaining, expiry: t.expiry || "", expired: !!expired };
  },
  canStartExam: function (userId) { var s = this.status(userId); return s.mode === "open" || s.remaining > 0; },
  _commit: function (userId, t) { StorageService.update(function (db) { db.tokens[userId] = t; }); CloudService.putToken(userId, t); },
  grant: function (userId, count, expiry) {
    var t = this._raw(userId) || { mode: "open", allowed: 0, used: 0, expiry: "" };
    this._commit(userId, { mode: "tokens", allowed: (t.mode === "tokens" ? (t.allowed || 0) : 0) + count, used: (t.mode === "tokens" && typeof t.used === "number") ? t.used : 0, expiry: expiry || "" });
  },
  setOpen: function (userId) { this._commit(userId, { mode: "open", allowed: 0, used: 0, expiry: "" }); },
  revoke: function (userId) { this._commit(userId, { mode: "tokens", allowed: 0, used: 0, expiry: "" }); },
  consume: function (userId) { var t = this._raw(userId); if (t && t.mode === "tokens") this._commit(userId, Object.assign({}, t, { used: (t.used || 0) + 1 })); }
};

/* ==========================================================================
   CERTIFICATE SERVICE
   ========================================================================== */

const CERT_THRESHOLD = 3; // completed tasks for auto-eligibility

const CertificateService = {
  completedCount: function (userId) {
    var subs = SubmissionService.list({ userId: userId });
    var ids = {};
    subs.forEach(function (s) { ids[s.taskId] = true; });
    return Object.keys(ids).length;
  },
  eligible: function (userId) { return this.completedCount(userId) >= CERT_THRESHOLD; },
  list: function (userId) {
    var local = StorageService.read().certificates.slice();
    var map = {}; local.forEach(function (c) { map[c.id] = c; });
    if (cloudReady()) { var cc = CloudService.cache.certs || {}; for (var id in cc) map[id] = cc[id]; }
    var arr = Object.keys(map).map(function (id) { return map[id]; });
    return userId ? arr.filter(function (c) { return c.userId === userId; }) : arr;
  },
  has: function (userId) { return this.list(userId).length > 0; },
  unlock: function (userId, module, by) {
    var user = AuthService.byId(userId);
    var rec = { id: uid("cert"), userId: userId, name: user ? user.name : "Student", module: module || "IELTS Academic Writing Foundations", date: todayLong(), by: by || "Mourad Mekki", createdAt: nowISO() };
    StorageService.update(function (db) { db.certificates.push(rec); });
    CloudService.putCertificate(rec);
    return rec;
  }
};

/* ==========================================================================
   ANALYTICS SERVICE
   ========================================================================== */

const AnalyticsService = {
  bandOf: function (s) {
    if (s.review && s.review.reviewed && typeof s.review.finalBand === "number") return s.review.finalBand;
    return s.ai ? s.ai.estimatedBand : null;
  },
  forStudent: function (userId) {
    var subs = SubmissionService.list({ userId: userId });
    var t1 = subs.filter(function (s) { return s.kind === "task1"; });
    var t2 = subs.filter(function (s) { return s.kind === "task2"; });
    function avg(arr) { var v = arr.map(AnalyticsService.bandOf).filter(function (n) { return typeof n === "number"; }); return v.length ? v.reduce(function (a, b) { return a + b; }, 0) / v.length : null; }
    var bands = subs.map(AnalyticsService.bandOf).filter(function (n) { return typeof n === "number"; });
    var latest = subs[0] ? AnalyticsService.bandOf(subs[0]) : null;
    // weakest criterion (avg across submissions)
    var critSum = { taskAchievement: [], coherenceCohesion: [], lexicalResource: [], grammaticalRange: [] };
    subs.forEach(function (s) { if (s.ai && s.ai.criteria) Object.keys(critSum).forEach(function (k) { critSum[k].push(s.ai.criteria[k].band); }); });
    var weakest = null, weakestVal = 99;
    Object.keys(critSum).forEach(function (k) { if (critSum[k].length) { var m = critSum[k].reduce(function (a, b) { return a + b; }, 0) / critSum[k].length; if (m < weakestVal) { weakestVal = m; weakest = k; } } });
    var critLabel = { taskAchievement: "Task Achievement / Response", coherenceCohesion: "Coherence & Cohesion", lexicalResource: "Lexical Resource", grammaticalRange: "Grammatical Range & Accuracy" };
    // most common weakness text
    var tally = {};
    subs.forEach(function (s) { if (s.ai) s.ai.weaknesses.forEach(function (w) { var key = w.split(/[.(]/)[0].trim(); tally[key] = (tally[key] || 0) + 1; }); });
    var commonWeak = "", commonWeakN = 0;
    Object.keys(tally).forEach(function (k) { if (tally[k] > commonWeakN) { commonWeakN = tally[k]; commonWeak = k; } });
    var completedIds = {}; subs.forEach(function (s) { completedIds[s.taskId] = true; });
    var nextTask = TaskService.all().find(function (t) { return !completedIds[t.id]; });
    return {
      total: subs.length, completed: Object.keys(completedIds).length,
      avgT1: avg(t1), avgT2: avg(t2), best: bands.length ? Math.max.apply(null, bands) : null, latest: latest,
      weakestCriterion: weakest ? critLabel[weakest] : null, weakestKey: weakest, weakestVal: weakest ? weakestVal : null,
      commonWeakness: commonWeak || null,
      criteriaAverages: (function () { var o = {}; Object.keys(critSum).forEach(function (k) { o[k] = critSum[k].length ? critSum[k].reduce(function (a, b) { return a + b; }, 0) / critSum[k].length : null; }); return o; })(),
      recommended: nextTask
    };
  },
  forTeacher: function () {
    var students = AuthService.students();
    var subs = SubmissionService.list();
    var pending = subs.filter(function (s) { return !(s.review && s.review.reviewed); });
    var reviewed = subs.filter(function (s) { return s.review && s.review.reviewed; });
    var bands = subs.map(AnalyticsService.bandOf).filter(function (n) { return typeof n === "number"; });
    var cutoff = Date.now() - 14 * 864e5;
    var active = {};
    subs.forEach(function (s) { if (new Date(s.submittedAt).getTime() > cutoff) active[s.userId] = true; });
    var tally = {};
    subs.forEach(function (s) { if (s.ai) s.ai.weaknesses.forEach(function (w) { var key = w.split(/[.(]/)[0].trim(); tally[key] = (tally[key] || 0) + 1; }); });
    var commonWeak = "", n = 0; Object.keys(tally).forEach(function (k) { if (tally[k] > n) { n = tally[k]; commonWeak = k; } });
    return {
      totalStudents: students.length, activeStudents: Object.keys(active).length,
      pending: pending.length, reviewed: reviewed.length, totalSubs: subs.length,
      avgBand: bands.length ? bands.reduce(function (a, b) { return a + b; }, 0) / bands.length : null,
      commonWeakness: commonWeak || null
    };
  }
};

/* ==========================================================================
   SEED  — sample data so the teacher dashboard is not empty on first run
   ========================================================================== */

function seedIfNeeded() {
  var db = StorageService.read();
  if (db.seeded) return;
  if (authMode() === "supabase") { StorageService.update(function (d) { d.seeded = true; }); return; }
  var samples = [
    { name: "Aisha Rahman", taskId: "t1-bar", mode: "exam", text: "The bar chart compares the number of international students from five countries studying in Canada in 2005 and 2020.\n\nOverall, every country sent more students in 2020 than in 2005. China and India were the leading sources throughout the period, while Nigeria showed the fastest growth in relative terms.\n\nIn 2005, China led with 45,000 students, followed by India with 30,000. By 2020 these figures had risen to 80,000 and 70,000 respectively, so the gap between them narrowed considerably.\n\nThe other three countries supplied smaller numbers. The USA increased from 25,000 to 35,000 and Brazil from 15,000 to 25,000, whereas Nigeria tripled from 10,000 to 30,000, overtaking Brazil by the end of the period." },
    { name: "Mohammed Saleh", taskId: "t2-opinion", mode: "practice", text: "Nowadays a lot of people change jobs frequently. I think changing jobs is good because you get more experience.\n\nFirstly, changing jobs is good. You learn new things. Moreover it is good for money. Furthermore you meet new people and this is good too.\n\nIn conclusion changing jobs is really good and everyone should do it." },
    { name: "Lina Hassan", taskId: "t1-line", mode: "exam", text: "The line graph illustrates the proportion of households using coal, gas and electricity between 1990 and 2020.\n\nOverall, coal use declined markedly across the period, whereas both gas and electricity became steadily more common, with gas finishing as the most widely used source.\n\nIn 1990 coal was dominant at 40%, but it then fell continuously to just 15% by 2020, less than half its original level. Gas, by contrast, rose gradually from 30% to 38%, overtaking coal early in the period.\n\nElectricity recorded the largest increase, climbing from 20% to 35% and passing coal at around 2010. By the final year, gas and electricity were separated by only three percentage points." }
  ];
  StorageService.update(function (d) {
    samples.forEach(function (sm) {
      var u = { id: uid("u"), name: sm.name, role: "student", createdAt: nowISO() };
      d.users.push(u);
      d.tokens[u.id] = { mode: "open", allowed: 0, used: 0, expiry: "" };
      var task = TaskService.byId(sm.taskId);
      var words = countWords(sm.text);
      var ai = buildLocalDiagnostic(sm.text, task.kind, task, {}, words);
      d.submissions.push({
        id: u.id + "|" + sm.taskId + "|" + sm.mode, userId: u.id, taskId: sm.taskId, kind: task.kind, type: task.type, title: task.title,
        mode: sm.mode, text: sm.text, words: words, timeSpent: sm.mode === "exam" ? (task.kind === "task1" ? 1080 : 2160) : 0,
        checklist: {}, ai: ai, review: null, locked: sm.mode === "exam", status: "submitted", submittedAt: nowISO()
      });
    });
    d.seeded = true;
  });
}

/* ==========================================================================
   UI LAYER
   ========================================================================== */
"use strict_ignored"; // (file is concatenated; real "use strict" is at top)

/* ---------- small DOM helpers ---------- */
function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function el(id) { return document.getElementById(id); }
function on(node, ev, fn) { if (node) node.addEventListener(ev, fn); }
function scrollToEl(node) { if (node && typeof node.scrollIntoView === "function") node.scrollIntoView({ behavior: "smooth", block: "start" }); }

function countWords(text) {
  var m = (text || "").trim().match(/[\p{L}\p{N}'’-]+/gu);
  return m ? m.length : 0;
}
function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function fmtTime(sec) { var m = Math.floor(sec / 60), s = sec % 60; return m + ":" + (s < 10 ? "0" : "") + s; }

/* ==========================================================================
   NAVIGATION + ROLE GATING
   ========================================================================== */

var NAV = {
  student: [["dashboard", "Dashboard"], ["task1", "Task 1"], ["task2", "Task 2"], ["clinic", "Writing Clinic"], ["library", "Library"], ["reports", "Reports"]],
  teacher: [["dashboard", "Dashboard"], ["students", "Students"], ["assignments", "Assignments"], ["improvement", "Improvement Lab"], ["submissions", "Submissions"], ["library", "Library"], ["reports", "Reports"]]
};

function renderNav() {
  var role = AuthService.role();
  var wrap = el("navList");
  var bar = el("topbar");
  if (!role) { bar.classList.add("is-hidden"); wrap.innerHTML = ""; return; }
  bar.classList.remove("is-hidden");
  wrap.innerHTML = NAV[role].map(function (n) {
    return '<li><button class="nav-link" data-nav="' + n[0] + '">' + esc(n[1]) + '</button></li>';
  }).join("");
  var user = AuthService.current();
  el("whoami").innerHTML = '<span class="who-role">' + (role === "teacher" ? "Teacher / Admin" : "Student") + '</span><span class="who-name">' + esc(user.name) + '</span>';
}

var CURRENT_VIEW = "auth";
function showView(name) {
  var role = AuthService.role();
  if (!role) name = "auth";
  // gate teacher-only / student-only
  var teacherOnly = { students: 1, assignments: 1, improvement: 1, submissions: 1, detail: 1 };
  var studentOnly = { task1: 1, task2: 1, clinic: 1, workspace: 1 };
  if (role === "student" && teacherOnly[name]) name = "dashboard";
  if (role === "teacher" && studentOnly[name]) name = "dashboard";

  CURRENT_VIEW = name;
  $all(".view").forEach(function (v) { v.classList.toggle("is-active", v.dataset.view === name); });
  $all(".nav-link").forEach(function (b) {
    var t = b.dataset.nav;
    var parent = (name === "workspace" && (t === "task1" || t === "task2")) || (name === "detail" && t === "submissions");
    b.classList.toggle("is-active", t === name || parent);
  });
  el("navList").classList.remove("is-open");
  el("navToggle").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "auto" });

  if (name === "dashboard") role === "teacher" ? renderTeacherDash() : renderStudentDash();
  if (name === "task1") renderGallery("task1");
  if (name === "task2") renderGallery("task2");
  if (name === "clinic") renderClinic();
  if (name === "library") renderLibrary();
  if (name === "reports") renderReports();
  if (name === "students") renderStudents();
  if (name === "assignments") renderAssignments();
  if (name === "improvement") renderImprovementLab();
  if (name === "submissions") renderSubmissions();
}

document.addEventListener("click", function (e) {
  var nav = e.target.closest("[data-nav]");
  if (nav) { showView(nav.dataset.nav); return; }
});
on(el("navToggle"), "click", function () {
  var list = el("navList");
  var open = list.classList.toggle("is-open");
  this.setAttribute("aria-expanded", String(open));
});
on(el("brandHome"), "click", function () { if (AuthService.role()) showView("dashboard"); });
on(el("signOutBtn"), "click", function () { AuthService.signOut(); boot(); });

/* generic accordion */
document.addEventListener("click", function (e) {
  var head = e.target.closest("[data-acc]");
  if (!head) return;
  var open = head.getAttribute("aria-expanded") === "true";
  head.setAttribute("aria-expanded", String(!open));
});

/* ==========================================================================
   AUTH SCREEN
   ========================================================================== */

function authMsg(text, isError) {
  var m = el("authError");
  if (m) { m.textContent = text || ""; m.classList.toggle("auth-ok", !isError && !!text); }
}
var _authTab = "signin";
function renderAuth() {
  var card = el("authCard"); if (!card) return;
  var note = el("authNote");

  if (authMode() !== "supabase") {
    card.innerHTML =
      '<label for="authName">Display name</label>' +
      '<input class="auth-input" id="authName" type="text" placeholder="e.g. Aisha R." autocomplete="off" maxlength="40">' +
      '<div class="auth-actions">' +
        '<button class="btn btn-gold" id="authStudentBtn">Enter as student</button>' +
        '<button class="btn btn-navy" id="authTeacherBtn">Enter as teacher / admin</button>' +
      '</div>' +
      '<p class="auth-error" id="authError" role="alert"></p>' +
      '<p class="auth-roles"><strong>Students</strong> write and track progress. <strong>Teachers</strong> assign work, review and issue certificates.</p>';
    if (note) note.textContent = "Offline mode: only a display name is collected, saved in this browser. Connect a cloud project to switch on secure email accounts.";
    on(el("authStudentBtn"), "click", function () { var n = el("authName").value.trim(); if (!n) { authMsg("Please enter a display name to continue.", true); return; } AuthService.signIn(n, "student"); boot(); });
    on(el("authTeacherBtn"), "click", function () { var n = el("authName").value.trim(); if (!n) { authMsg("Please enter a display name to continue.", true); return; } AuthService.signIn(n, "teacher"); boot(); });
    on(el("authName"), "keydown", function (e) { if (e.key === "Enter") el("authStudentBtn").click(); });
    return;
  }

  // ---- account mode ----
  var signin = _authTab === "signin";
  card.innerHTML =
    '<div class="auth-tabs">' +
      '<button class="auth-tab' + (signin ? " is-active" : "") + '" data-auth-tab="signin">Sign in</button>' +
      '<button class="auth-tab' + (!signin ? " is-active" : "") + '" data-auth-tab="signup">Create account</button>' +
    '</div>' +
    (signin
      ? '<label for="authEmail">Email</label><input class="auth-input" id="authEmail" type="email" autocomplete="username" placeholder="you@example.com">' +
        '<label for="authPass">Password</label><input class="auth-input" id="authPass" type="password" autocomplete="current-password" placeholder="Your password">' +
        '<div class="auth-actions"><button class="btn btn-gold" id="authSignIn">Sign in</button></div>' +
        '<button class="auth-link" id="authForgot" type="button">Forgot password?</button>'
      : '<label for="authName">Display name</label><input class="auth-input" id="authName" type="text" maxlength="40" placeholder="e.g. Aisha R.">' +
        '<label for="authEmail">Email</label><input class="auth-input" id="authEmail" type="email" autocomplete="username" placeholder="you@example.com">' +
        '<label for="authPass">Password</label><input class="auth-input" id="authPass" type="password" autocomplete="new-password" placeholder="Choose a password (min 6 characters)">' +
        '<div class="auth-actions"><button class="btn btn-gold" id="authSignUp">Create account</button></div>') +
    '<p class="auth-error" id="authError" role="alert"></p>' +
    '<p class="auth-roles">Students create an account here. <strong>Teacher/admin access</strong> is granted by the instructor — it cannot be self-selected.</p>';
  if (note) note.textContent = "Secure sign-in: your email and password are managed by the cloud provider; only your display name is shown to your teacher.";

  $all("[data-auth-tab]").forEach(function (b) { on(b, "click", function () { _authTab = b.dataset.authTab; renderAuth(); }); });

  on(el("authSignIn"), "click", function () {
    var email = el("authEmail").value, pass = el("authPass").value;
    if (!email || !pass) { authMsg("Enter your email and password.", true); return; }
    authMsg("Signing in…");
    AuthService.signInEmail(email, pass).then(function (res) {
      if (res && res.error) authMsg(res.error.message || "Sign-in failed.", true);
      // success → onAuthStateChange reboots the app
    }, function (e) { authMsg((e && e.message) || "Sign-in failed.", true); });
  });
  on(el("authSignUp"), "click", function () {
    var name = (el("authName").value || "").trim(), email = el("authEmail").value, pass = el("authPass").value;
    if (!name) { authMsg("Please enter a display name.", true); return; }
    if (!email || !pass) { authMsg("Enter an email and password.", true); return; }
    if (pass.length < 6) { authMsg("Password must be at least 6 characters.", true); return; }
    authMsg("Creating your account…");
    AuthService.signUp(email, pass, name).then(function (res) {
      if (res && res.error) { authMsg(res.error.message || "Sign-up failed.", true); return; }
      if (res && res.data && res.data.session) authMsg("Account created — signing you in…");
      else authMsg("Account created. Check your email to confirm, then sign in.");
    }, function (e) { authMsg((e && e.message) || "Sign-up failed.", true); });
  });
  on(el("authForgot"), "click", function () {
    var email = (el("authEmail").value || "").trim();
    if (!email) { authMsg("Enter your email above first, then tap Forgot password.", true); return; }
    authMsg("Sending reset link…");
    AuthService.resetPassword(email).then(function (res) {
      if (res && res.error) authMsg(res.error.message || "Could not send reset link.", true);
      else authMsg("If that email has an account, a reset link is on its way.");
    }, function (e) { authMsg((e && e.message) || "Could not send reset link.", true); });
  });
  on(el("authEmail"), "keydown", function (e) { if (e.key === "Enter") { var b = el("authSignIn") || el("authSignUp"); if (b) b.click(); } });
  on(el("authPass"), "keydown", function (e) { if (e.key === "Enter") { var b = el("authSignIn") || el("authSignUp"); if (b) b.click(); } });
}

/* ==========================================================================
   MODE BADGE helper
   ========================================================================== */
function modeBadge(mode) {
  return mode === "exam"
    ? '<span class="mode-badge mode-exam">Exam mode</span>'
    : '<span class="mode-badge mode-practice">Practice mode</span>';
}
function statusOfTask(userId, taskId) {
  var subs = SubmissionService.list({ userId: userId }).filter(function (s) { return s.taskId === taskId; });
  if (subs.length) return "completed";
  var d = SubmissionService.getDraft(userId, taskId);
  return (d && d.draft && d.draft.trim()) ? "in-progress" : "not-started";
}
var STATUS_LABEL = { completed: "Completed", "in-progress": "In progress", "not-started": "Not started" };
function bestBandFor(userId, taskId) {
  var subs = SubmissionService.list({ userId: userId }).filter(function (s) { return s.taskId === taskId; });
  var bands = subs.map(AnalyticsService.bandOf).filter(function (n) { return typeof n === "number"; });
  return bands.length ? Math.max.apply(null, bands) : null;
}

/* ==========================================================================
   STUDENT DASHBOARD
   ========================================================================== */

function bar(label, val, max) {
  var pct = val == null ? 0 : Math.round((val / max) * 100);
  return '<div class="prog-row"><span class="prog-label">' + esc(label) + '</span>' +
    '<span class="prog-track"><span class="prog-fill" style="width:' + pct + '%"></span></span>' +
    '<span class="prog-val">' + (val == null ? "—" : val.toFixed(1)) + '</span></div>';
}

function renderStudentDash() {
  var user = AuthService.current();
  var a = AnalyticsService.forStudent(user.id);
  var hw = AssignmentService.forStudent(user.id);
  var subs = SubmissionService.list({ userId: user.id });
  var tok = TokenService.status(user.id);
  var view = el("view-dashboard");

  var hwCards = hw.length ? hw.map(function (h) {
    var task = TaskService.byId(h.taskId);
    var st = AssignmentService.statusFor(h, user.id);
    var stClass = st.toLowerCase().replace(/\s/g, "-");
    var overdue = h.deadline && new Date(h.deadline) < new Date() && st !== "Reviewed" && st !== "Submitted";
    return '<article class="hw-card">' +
      '<div class="hw-top">' + modeBadge(h.mode) + '<span class="hw-status hw-' + stClass + '">' + st + '</span></div>' +
      '<h4>' + esc(task ? task.title : "Task") + '</h4>' +
      '<p class="hw-meta">' + esc(task ? "Task " + (task.kind === "task1" ? "1" : "2") + " · " + task.type : "") + (h.difficulty ? " · " + esc(h.difficulty) : "") + '</p>' +
      (h.instructions ? '<p class="hw-instr">' + esc(h.instructions) + '</p>' : "") +
      '<p class="hw-deadline' + (overdue ? " is-overdue" : "") + '">Due: ' + (h.deadline ? fmtDate(h.deadline) : "no deadline") + (overdue ? " · overdue" : "") + '</p>' +
      '<button class="btn btn-gold btn-sm" data-start-task="' + h.taskId + '" data-mode="' + h.mode + '" data-hw="' + h.id + '">' + (st === "Not started" ? "Start" : "Continue") + '</button>' +
      '</article>';
  }).join("") : '<p class="empty-note">No homework assigned yet. Browse the <button class="linkbtn" data-nav="library">Practice Library</button> to start anytime.</p>';

  var recent = subs.slice(0, 5).map(function (s) {
    var band = AnalyticsService.bandOf(s);
    return '<tr><td>' + esc(s.title) + '</td><td>' + modeBadge(s.mode) + '</td><td class="num">' + s.words + '</td>' +
      '<td class="num">' + (band != null ? band.toFixed(1) : "—") + '</td>' +
      '<td>' + (s.review && s.review.reviewed ? '<span class="pill pill-ok">Reviewed</span>' : '<span class="pill pill-wait">Awaiting review</span>') + '</td>' +
      '<td>' + fmtDate(s.submittedAt) + '</td></tr>';
  }).join("");

  var cert = CertificateService.list(user.id);
  var certEligible = CertificateService.eligible(user.id);

  view.innerHTML =
    '<div class="dash-hero">' +
      '<div><p class="view-eyebrow">Student dashboard</p><h2 class="view-title">Welcome back, ' + esc(user.name) + '</h2>' +
      '<p class="view-sub">' + (a.total ? "You have completed " + a.completed + " task" + (a.completed === 1 ? "" : "s") + ". Keep the momentum going." : "Start your first writing task to unlock progress tracking.") + '</p></div>' +
      '<div class="dash-coin"><img src="assets/logo/coin-logo.png" alt=""></div>' +
    '</div>' +

    '<div class="stat-grid">' +
      statCard("Average Task 1", a.avgT1 != null ? a.avgT1.toFixed(1) : "—", "band") +
      statCard("Average Task 2", a.avgT2 != null ? a.avgT2.toFixed(1) : "—", "band") +
      statCard("Best score", a.best != null ? a.best.toFixed(1) : "—", "band") +
      statCard("Latest score", a.latest != null ? a.latest.toFixed(1) : "—", "band") +
      statCard("Tasks completed", String(a.completed), "") +
      statCard("Exam access", tok.mode === "open" ? "Open" : (tok.remaining + " left"), "") +
    '</div>' +

    '<div class="dash-cols">' +
      '<section class="dash-block">' +
        '<h3 class="block-title">Assigned homework</h3>' +
        '<div class="hw-grid">' + hwCards + '</div>' +
      '</section>' +
      '<section class="dash-block">' +
        '<h3 class="block-title">Skill progress</h3>' +
        '<div class="panel glass-panel pad">' +
          bar("Task Achievement / Response", a.criteriaAverages.taskAchievement, 9) +
          bar("Coherence & Cohesion", a.criteriaAverages.coherenceCohesion, 9) +
          bar("Lexical Resource", a.criteriaAverages.lexicalResource, 9) +
          bar("Grammatical Range", a.criteriaAverages.grammaticalRange, 9) +
        '</div>' +
        '<div class="panel glass-panel pad insight">' +
          '<p><strong>Weakest criterion:</strong> ' + (a.weakestCriterion ? esc(a.weakestCriterion) : "—") + '</p>' +
          '<p><strong>Most common note:</strong> ' + (a.commonWeakness ? esc(a.commonWeakness) : "—") + '</p>' +
          '<p><strong>Recommended next:</strong> ' + (a.recommended ? '<button class="linkbtn" data-start-task="' + a.recommended.id + '" data-mode="practice">' + esc(a.recommended.title) + '</button>' : "All tasks attempted — revisit your weakest one.") + '</p>' +
        '</div>' +
      '</section>' +
    '</div>' +

    '<section class="dash-block">' +
      '<h3 class="block-title">Recent submissions</h3>' +
      (recent ? '<div class="table-wrap"><table class="data-table"><thead><tr><th>Task</th><th>Mode</th><th class="num">Words</th><th class="num">Band</th><th>Status</th><th>Date</th></tr></thead><tbody>' + recent + '</tbody></table></div>' : '<p class="empty-note">No submissions yet.</p>') +
    '</section>' +

    '<section class="dash-block cert-block">' +
      '<h3 class="block-title">Certificate</h3>' +
      (cert.length
        ? '<p class="empty-note">You have earned a certificate. <button class="btn btn-gold btn-sm" data-view-cert="' + cert[0].id + '">View &amp; print</button></p>'
        : (certEligible
          ? '<p class="empty-note">You have completed enough work to earn your certificate. <button class="btn btn-gold btn-sm" id="claimCert">Generate my certificate</button></p>'
          : '<p class="empty-note">Complete ' + CERT_THRESHOLD + ' tasks to unlock a Certificate of Completion. So far: ' + a.completed + '/' + CERT_THRESHOLD + '.</p>')) +
    '</section>' +

    '<p class="privacy-note">Privacy: this prototype stores your work in this browser only (localStorage). Only a display name is collected — no email, no school data. When the cloud backend is connected, your work will sync securely to your account.</p>';

  on(el("claimCert"), "click", function () {
    CertificateService.unlock(user.id, "IELTS Academic Writing Foundations", "Mourad Mekki");
    renderStudentDash();
  });
}

function statCard(label, value, suffix) {
  return '<div class="stat-card"><span class="stat-value">' + esc(value) + (suffix ? '<em>' + esc(suffix) + '</em>' : "") + '</span><span class="stat-label">' + esc(label) + '</span></div>';
}

/* ==========================================================================
   TASK GALLERIES (Task 1 / Task 2)
   ========================================================================== */

function taskCardHTML(t, userId) {
  var st = statusOfTask(userId, t.id);
  var best = bestBandFor(userId, t.id);
  var thumb = t.kind === "task1"
    ? '<div class="mission-thumb"><img src="' + t.img + '" alt="' + esc(t.alt) + '" loading="lazy"></div>'
    : '<div class="mission-thumb mission-thumb-essay"><span>' + esc(t.type) + '</span></div>';
  var tokOk = TokenService.canStartExam(userId);
  return '<article class="mission-card">' + thumb +
    '<div class="mission-body">' +
      '<div class="mission-meta">' +
        '<span class="tag">' + esc(t.type) + '</span>' +
        '<span class="tag">' + esc(t.difficulty) + '</span>' +
        '<span class="tag tag-band">Target ' + esc(BAND_TARGET[t.difficulty] || "6.0") + '</span>' +
        '<span class="tag tag-status-' + st + '">' + STATUS_LABEL[st] + '</span>' +
        (best != null ? '<span class="tag tag-best">Best ' + best.toFixed(1) + '</span>' : "") +
      '</div>' +
      '<h3 class="mission-title">' + esc(t.title) + '</h3>' +
      '<p class="mission-desc">' + esc(t.desc) + '</p>' +
      '<div class="mission-foot">' +
        '<button class="btn btn-gold btn-sm" data-start-task="' + t.id + '" data-mode="practice">Practice</button>' +
        '<button class="btn btn-navy btn-sm" data-start-task="' + t.id + '" data-mode="exam"' + (tokOk ? "" : " disabled title=\"No exam tokens left\"") + '>' + (tokOk ? "Exam mode" : "Locked") + '</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

/* Which tasks a student is allowed to see (assigned to them or the whole class). */
function studentAssignedTaskIds(uid) {
  var set = {};
  AssignmentService.forStudent(uid).forEach(function (h) { if (h.taskId) set[h.taskId] = true; });
  return set;
}

function renderGallery(kind) {
  var user = AuthService.current();
  var items = TaskService.byKind(kind);
  var gated = AuthService.role() === "student";
  if (gated) { var set = studentAssignedTaskIds(user.id); items = items.filter(function (t) { return set[t.id]; }); }
  var grid = el(kind === "task1" ? "task1Grid" : "task2Grid");
  grid.innerHTML = items.length
    ? items.map(function (t) { return taskCardHTML(t, user.id); }).join("")
    : '<p class="empty-note">' + (gated ? "Nothing assigned here yet — your teacher will unlock tasks for you to practise." : "No tasks available.") + '</p>';
}

document.addEventListener("click", function (e) {
  var s = e.target.closest("[data-start-task]");
  if (!s) return;
  var taskId = s.dataset.startTask;
  if (AuthService.role() === "student") {
    var set = studentAssignedTaskIds(AuthService.current().id);
    if (!set[taskId]) { alert("This task hasn't been assigned to you yet. Your teacher will unlock it."); return; }
  }
  openTask(taskId, s.dataset.mode || "practice", s.dataset.hw || null);
});

/* ==========================================================================
   WORKSPACE (dynamic; handles Task 1 + Task 2, Practice + Exam)
   ========================================================================== */

var CURRENT = null; // { task, mode, assignmentId, timer, submitted }
var examGuardActive = false;

function beforeUnloadGuard(e) { if (examGuardActive) { e.preventDefault(); e.returnValue = ""; return ""; } }
window.addEventListener("beforeunload", beforeUnloadGuard);

function helperAccordion(step, title, bodyHTML) {
  return '<div class="panel glass-panel helper-panel">' +
    '<button class="acc-head" data-acc aria-expanded="false"><span><span class="helper-step">' + esc(step) + '</span>' + esc(title) + '</span><span class="acc-chev" aria-hidden="true"></span></button>' +
    '<div class="acc-body">' + bodyHTML + '</div></div>';
}

function buildHelpers(task) {
  var h = "";
  if (task.kind === "task1") {
    h += helperAccordion("Learn", task.type + " — what to know", "<p>" + esc(task.learn) + "</p><p class='clinic-tip'>" + esc(task.tip) + "</p>");
    h += helperAccordion("Analyse", "Key features to notice", "<ul>" + task.analyse.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>");
    h += helperAccordion("Plan", "Suggested structure", "<ul>" + task.plan.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>");
    h += helperAccordion("Write", "Useful vocabulary", "<ul>" + task.vocab.map(function (x) { return "<li><em>" + esc(x) + "</em></li>"; }).join("") + "</ul>");
    T1_SHARED_HELPERS.forEach(function (x) { h += helperAccordion(x.step, x.title, x.html); });
  } else {
    h += helperAccordion("Understand", task.type + " — structure", "<ul>" + task.structure.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>");
    h += helperAccordion("Plan", "Thesis guidance", "<p>" + esc(task.thesis) + "</p>");
    h += helperAccordion("Check", "Common mistakes for this type", "<ul>" + task.mistakes.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>");
    h += helperAccordion("Write", "Useful academic language", "<ul>" + task.language.map(function (x) { return "<li><em>" + esc(x) + "</em></li>"; }).join("") + "</ul>");
    T2_SHARED_HELPERS.forEach(function (x) { h += helperAccordion(x.step, x.title, x.html); });
  }
  return h;
}

function checklistHTML(task, userId) {
  var items = task.kind === "task1" ? T1_CHECKLIST : T2_CHECKLIST;
  var draft = SubmissionService.getDraft(userId, task.id);
  var saved = (draft && draft.checklist) || {};
  return items.map(function (text, i) {
    return '<li><label><input type="checkbox" data-check="' + i + '"' + (saved[i] ? " checked" : "") + '><span>' + esc(text) + '</span></label></li>';
  }).join("");
}

function openTask(taskId, mode, assignmentId) {
  var task = TaskService.byId(taskId);
  if (!task) return;
  var user = AuthService.current();

  if (mode === "exam") {
    var gate = SubmissionService.canSitExam(user.id, taskId);
    if (!gate.ok) { /* already submitted */ }
    if (!TokenService.canStartExam(user.id)) { alert("You have no exam tokens left. Ask your teacher to grant access, or use Practice mode."); return; }
  }

  CURRENT = { task: task, mode: mode, assignmentId: assignmentId || null, submitted: false };
  var draft = SubmissionService.getDraft(user.id, taskId);
  var existing = SubmissionService.get(user.id, taskId, mode);
  var locked = mode === "exam" && existing && existing.locked && !existing.retakeAllowed;
  CURRENT.submitted = !!(existing);

  var t1 = task.kind === "task1";
  var minWords = TaskService.minWords(task.kind);
  var planning = t1
    ? '<article class="panel paper-panel"><h3 class="panel-label">Planning notes</h3>' +
      '<textarea id="wsPlan" class="ws-notes" rows="4" placeholder="Overview idea, groups to compare, key figures…"' + (locked ? " readonly" : "") + '>' + esc((draft && draft.plan) || "") + '</textarea></article>'
    : '<article class="panel paper-panel"><h3 class="panel-label">Plan — thesis builder</h3>' +
      '<label class="field-label">My position in one sentence</label><textarea id="wsThesis" class="ws-notes" rows="2"' + (locked ? " readonly" : "") + '>' + esc((draft && draft.thesis) || "") + '</textarea>' +
      '<label class="field-label">Body paragraph 1 — main idea + example</label><textarea id="wsBody1" class="ws-notes" rows="2"' + (locked ? " readonly" : "") + '>' + esc((draft && draft.body1) || "") + '</textarea>' +
      '<label class="field-label">Body paragraph 2 — main idea + example</label><textarea id="wsBody2" class="ws-notes" rows="2"' + (locked ? " readonly" : "") + '>' + esc((draft && draft.body2) || "") + '</textarea></article>';

  var image = t1
    ? '<figure class="ws-figure"><img id="wsImage" src="' + task.img + '" alt="' + esc(task.alt) + '" class="ws-image"><figcaption><button class="btn btn-ghost btn-sm" id="wsZoom">Zoom image</button></figcaption></figure>'
    : "";

  var modelGate = mode === "exam" && !CURRENT.submitted;
  var examMinutes = TaskService.examMinutes(task.kind);

  el("workspaceBody").innerHTML =
    '<div class="ws-top">' +
      '<button class="btn btn-ghost btn-sm" data-nav="' + (t1 ? "task1" : "task2") + '">&larr; ' + (t1 ? "Task 1 gallery" : "Essay types") + '</button>' +
      (mode === "exam"
        ? '<div class="ws-timer" role="timer"><span class="ws-timer-display" id="wsTimerDisplay">' + examMinutes + ':00</span><span class="ws-timer-bar"><span id="wsTimerFill"></span></span><span class="ws-timer-btns"><button class="btn btn-gold btn-sm" id="wsTimerToggle">Start</button><button class="btn btn-ghost btn-sm" id="wsTimerReset">Reset</button></span></div>'
        : '<div class="ws-timer" role="timer"><span class="ws-timer-display" id="wsTimerDisplay">' + examMinutes + ':00</span><span class="ws-timer-bar"><span id="wsTimerFill"></span></span><span class="ws-timer-btns"><button class="btn btn-gold btn-sm" id="wsTimerToggle">Start</button><button class="btn btn-ghost btn-sm" id="wsTimerReset">Reset</button></span></div>') +
    '</div>' +

    '<header class="ws-head">' +
      '<p class="view-eyebrow">' + modeBadge(mode) + ' &nbsp; Task ' + (t1 ? "1 · " : "2 · ") + esc(task.type) + ' · ' + esc(task.difficulty) + '</p>' +
      '<h2 class="view-title">' + esc(task.title) + '</h2>' +
      (mode === "exam" ? '<p class="exam-rule">Exam conditions: ' + examMinutes + ' minutes · at least ' + minWords + ' words · one submission · no model answer until you submit.</p>' : '<p class="practice-rule">Practice mode: write freely, save drafts, reveal the model when ready, and request feedback as often as you like.</p>') +
    '</header>' +

    (locked ? '<div class="locked-banner">This exam task has been submitted and locked. ' + (existing.retakeAllowed ? "" : "Ask your teacher to allow a retake if needed.") + ' Your feedback and the model answer are shown below.</div>' : "") +

    '<div class="ws-grid">' +
      '<div class="ws-col-main">' +
        '<article class="panel paper-panel"><h3 class="panel-label">The task</h3><p class="ws-prompt">' + esc(task.prompt) + '</p>' + image + '</article>' +
        planning +
        '<article class="panel paper-panel ws-writing"><div class="ws-writing-head"><h3 class="panel-label">Your ' + (t1 ? "report" : "essay") + '</h3><span class="wordcount" id="wsWordCount">0 words</span></div>' +
          '<textarea id="wsWriting" class="ws-textarea" rows="' + (t1 ? 14 : 16) + '" placeholder="Write at least ' + minWords + ' words." ' + (locked ? "readonly" : "") + '>' + esc((draft && draft.draft) || (existing && existing.text) || "") + '</textarea></article>' +

        '<div class="ws-actions">' +
          (locked ? "" : '<button class="btn btn-gold" id="btnFeedback">Get AI Writing Feedback</button>') +
          (mode === "exam"
            ? (locked ? "" : '<button class="btn btn-navy" id="btnSubmit">Submit final answer</button>')
            : '<button class="btn btn-navy" id="btnSubmit">Submit for feedback</button>') +
          (mode === "practice" ? '<button class="btn btn-ghost" id="btnRevealModel">Reveal model answer</button>' : "") +
          '<button class="btn btn-ghost" id="btnPrintWs">Print report</button>' +
        '</div>' +

        '<div id="wsFeedback" class="feedback-wrap"></div>' +

        '<article class="panel paper-panel model-panel" id="wsModelWrap"' + (modelGate ? ' hidden' : "") + '>' +
          '<button class="acc-head" data-acc aria-expanded="false">Model answer <span class="acc-chev" aria-hidden="true"></span></button>' +
          '<div class="acc-body"><p class="model-note">Compare your grouping, overview/position and comparisons with this version.</p><div class="model-text">' + task.model.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + '</div></div>' +
        '</article>' +
      '</div>' +

      '<aside class="ws-col-side">' +
        '<div class="side-flow" aria-hidden="true">' + (t1 ? "Learn → Analyse → Plan → Write → Check → Compare" : "Understand → Plan → Write → Check → Improve") + '</div>' +
        '<div id="wsHelpers">' + buildHelpers(task) + '</div>' +
        '<div class="panel glass-panel"><button class="acc-head" data-acc aria-expanded="false">Check — IELTS checklist <span class="acc-chev" aria-hidden="true"></span></button><div class="acc-body"><ul class="checklist" id="wsChecklist">' + checklistHTML(task, user.id) + '</ul></div></div>' +
      '</aside>' +
    '</div>';

  wireWorkspace(task, mode, user, locked);
  showView("workspace");
}

function wireWorkspace(task, mode, user, locked) {
  var t1 = task.kind === "task1";
  var minWords = TaskService.minWords(task.kind);

  // word count
  function updateWC() {
    var n = countWords(el("wsWriting").value);
    var wc = el("wsWordCount");
    wc.textContent = n + (n === 1 ? " word" : " words");
    wc.classList.toggle("is-ok", n >= minWords);
  }
  updateWC();

  if (locked) {
    // read-only: still allow feedback view of stored submission
    var existing = SubmissionService.get(user.id, task.id, mode);
    if (existing && existing.ai) renderFeedback(el("wsFeedback"), existing.ai);
    bindStaticWorkspaceButtons(task, mode, user, locked);
    return;
  }

  // autosave draft
  function saveDraft() {
    var patch = { draft: el("wsWriting").value };
    if (t1) { if (el("wsPlan")) patch.plan = el("wsPlan").value; }
    else { patch.thesis = el("wsThesis").value; patch.body1 = el("wsBody1").value; patch.body2 = el("wsBody2").value; }
    SubmissionService.patchDraft(user.id, task.id, patch);
  }
  var pending;
  on(el("wsWriting"), "input", function () { updateWC(); clearTimeout(pending); pending = setTimeout(saveDraft, 400); });
  ["wsPlan", "wsThesis", "wsBody1", "wsBody2"].forEach(function (id) {
    var node = el(id); if (node) on(node, "input", function () { clearTimeout(pending); pending = setTimeout(saveDraft, 400); });
  });

  // checklist
  $all("#wsChecklist input[data-check]").forEach(function (box) {
    on(box, "change", function () {
      var d = SubmissionService.getDraft(user.id, task.id);
      var cl = (d && d.checklist) || {};
      cl[box.dataset.check] = box.checked;
      SubmissionService.patchDraft(user.id, task.id, { checklist: cl });
    });
  });

  // timer
  var examMinutes = TaskService.examMinutes(task.kind);
  CURRENT.timer = createTimer(examMinutes * 60, el("wsTimerDisplay"), el("wsTimerFill"), el("wsTimerToggle"), el("wsTimerReset"));
  if (mode === "exam") {
    examGuardActive = true;
    CURRENT.timer.start();
  }

  bindStaticWorkspaceButtons(task, mode, user, locked);
}

function bindStaticWorkspaceButtons(task, mode, user, locked) {
  on(el("wsZoom"), "click", function () { var img = el("wsImage"); openModal(img.src, img.alt); });
  on(el("wsImage"), "click", function () { openModal(this.src, this.alt); });

  on(el("btnFeedback"), "click", function () {
    var text = el("wsWriting").value;
    var fb = buildLocalDiagnostic(text, task.kind, task, collectChecklist(), countWords(text));
    renderFeedback(el("wsFeedback"), fb);
    scrollToEl(el("wsFeedback"));
  });

  on(el("btnRevealModel"), "click", function () {
    var wrap = el("wsModelWrap");
    wrap.hidden = false;
    wrap.querySelector(".acc-head").setAttribute("aria-expanded", "true");
    scrollToEl(wrap);
  });

  on(el("btnSubmit"), "click", function () {
    var text = el("wsWriting").value;
    var words = countWords(text);
    if (words < 20) { alert("Please write your response before submitting."); return; }
    var payload = { text: text, words: words, timeSpent: CURRENT.timer ? CURRENT.timer.spent : 0, checklist: collectChecklist() };
    if (mode === "exam") {
      if (!confirm("Submit your final answer? In exam mode this locks the task — you will not be able to edit it.")) return;
      var sub = SubmissionService.submitExam(user.id, task.id, payload);
      examGuardActive = false;
      if (CURRENT.timer) CURRENT.timer.stop();
      // unlock model + show feedback + lock editing
      el("wsModelWrap").hidden = false;
      renderFeedback(el("wsFeedback"), sub.ai);
      el("wsWriting").readOnly = true;
      this.remove();
      scrollToEl(el("wsFeedback"));
    } else {
      var sub2 = SubmissionService.submitPractice(user.id, task.id, payload);
      renderFeedback(el("wsFeedback"), sub2.ai);
      scrollToEl(el("wsFeedback"));
    }
  });

  on(el("btnPrintWs"), "click", function () {
    var text = el("wsWriting").value;
    ReportService.printSubmissionLike({
      student: user.name, task: task, mode: mode,
      words: countWords(text), time: CURRENT.timer ? fmtTime(CURRENT.timer.spent) : "—",
      checklist: collectChecklist(),
      ai: buildLocalDiagnostic(text, task.kind, task, collectChecklist(), countWords(text)),
      review: null, reportType: "submission"
    });
  });
}

function collectChecklist() {
  var cl = {};
  $all("#wsChecklist input[data-check]").forEach(function (b) { cl[b.dataset.check] = b.checked; });
  return cl;
}

/* ==========================================================================
   FEEDBACK PANEL RENDER
   ========================================================================== */

function bandChip(c) {
  return '<div class="crit-chip"><span class="crit-band">' + c.band.toFixed(1) + '</span><span class="crit-name">' + esc(c.label) + '</span></div>';
}
function renderFeedback(container, fb) {
  if (!container) return;
  var c = fb.criteria;
  container.innerHTML =
    '<article class="panel feedback-panel">' +
      '<div class="fb-head"><div><span class="fb-tag">Preliminary Writing Diagnostic</span><h3 class="fb-title">Estimated band <strong>' + fb.estimatedBand.toFixed(1) + '</strong></h3></div>' +
      '<p class="fb-disclaimer">' + esc(fb.label) + '. This is an automated diagnostic to guide practice — your teacher\'s review is the authoritative score.</p></div>' +
      '<div class="crit-row">' + [c.taskAchievement, c.coherenceCohesion, c.lexicalResource, c.grammaticalRange].map(bandChip).join("") + '</div>' +
      '<div class="fb-cols">' +
        '<div class="fb-block fb-good"><h4>Strengths</h4><ul>' + fb.strengths.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ul></div>' +
        '<div class="fb-block fb-bad"><h4>Priorities to fix</h4><ul>' + fb.weaknesses.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ul></div>' +
      '</div>' +
      (fb.errors.length ? '<div class="fb-block"><h4>Error diagnosis</h4><ul class="fb-errors">' + fb.errors.map(function (e) { return '<li><span class="err-type">' + esc(e.type) + '</span> ' + esc(e.detail) + '</li>'; }).join("") + '</ul></div>' : "") +
      (fb.sentenceCorrections.length ? '<div class="fb-block"><h4>Sentence-level upgrades</h4>' + fb.sentenceCorrections.map(function (s) { return '<div class="sc"><p class="sc-from">' + esc(s.original) + '</p><p class="sc-to">→ ' + esc(s.improved) + '</p><p class="sc-why">' + esc(s.reason) + '</p></div>'; }).join("") + '</div>' : "") +
      '<div class="fb-cols">' +
        '<div class="fb-block"><h4>Vocabulary upgrades</h4><ul>' + fb.vocabUpgrades.map(function (v) { return '<li><em>' + esc(v.from) + '</em> → ' + esc(v.to) + '</li>'; }).join("") + '</ul></div>' +
        '<div class="fb-block"><h4>Grammar upgrades</h4><ul>' + fb.grammarUpgrades.map(function (g) { return "<li>" + esc(g) + "</li>"; }).join("") + '</ul></div>' +
      '</div>' +
      '<div class="fb-block fb-next"><h4>Recommended next step</h4><p>' + esc(fb.nextRecommendation) + '</p></div>' +
      '<details class="fb-meta"><summary>Diagnostic detail</summary><p>' + esc(fb.studentSummary) + '</p><p class="fb-teacher"><strong>Teacher view:</strong> ' + esc(fb.teacherSummary) + '</p>' +
        '<p class="metrics">Words: ' + fb.metrics.wordCount + '/' + fb.metrics.minWords + ' · Paragraphs: ' + fb.metrics.paragraphs + ' · Sentences: ' + fb.metrics.sentences + ' · Linkers: ' + fb.metrics.linkers + ' · Avg sentence: ' + fb.metrics.avgSentence + ' words</p></details>' +
    '</article>';
}

/* ==========================================================================
   TIMER
   ========================================================================== */
function createTimer(total, displayEl, fillEl, toggleBtn, resetBtn) {
  var t = { total: total, left: total, running: false, handle: null, spent: 0 };
  function render() { if (displayEl) displayEl.textContent = fmtTime(t.left); if (fillEl) fillEl.style.width = (t.left / t.total * 100) + "%"; }
  function stop() { clearInterval(t.handle); t.running = false; if (toggleBtn) toggleBtn.textContent = t.left === t.total ? "Start" : "Resume"; }
  function tick() { if (t.left <= 0) { stop(); if (toggleBtn) toggleBtn.textContent = "Start"; if (displayEl) displayEl.textContent = "0:00"; return; } t.left--; t.spent++; render(); }
  function start() { if (t.running) return; if (t.left <= 0) t.left = t.total; t.running = true; if (toggleBtn) toggleBtn.textContent = "Pause"; t.handle = setInterval(tick, 1000); }
  on(toggleBtn, "click", function () { if (t.running) stop(); else start(); });
  on(resetBtn, "click", function () { stop(); t.left = t.total; t.spent = 0; if (toggleBtn) toggleBtn.textContent = "Start"; render(); });
  t.stop = stop; t.start = start; render();
  return t;
}

/* ==========================================================================
   CLINIC  (student-facing — assignment / unlock / live-work aware)
   ========================================================================== */
function clinicStatusLabel(w) {
  if (!w || !(w.attempt && w.attempt.trim())) return "Not started yet.";
  if (w.status === "submitted") return "\u2713 Submitted to your teacher.";
  return "Draft saved \u2014 keep going.";
}
function clinicCardHTML(c, i, key) {
  var st = ClinicService.stateFor(key, i);
  var badge = st.assigned ? '<span class="clinic-assigned-badge">Assigned</span>' : "";
  var head = '<button class="acc-head" data-acc aria-expanded="' + (st.assigned ? "true" : "false") + '"><span><span class="clinic-num">' + String(i + 1).padStart(2, "0") + "</span>" + esc(c.title) + badge + '</span><span class="acc-chev" aria-hidden="true"></span></button>';
  var meta = "";
  if (st.assigned) {
    var bits = [];
    if (st.asg.deadline) bits.push('<span class="clinic-deadline">Due ' + fmtDate(st.asg.deadline) + "</span>");
    if (st.asg.by) bits.push('<span class="clinic-by">Set by ' + esc(st.asg.by) + "</span>");
    if (bits.length) meta += '<div class="clinic-asg-meta">' + bits.join("") + "</div>";
    if (st.asg.instructions) meta += '<p class="clinic-instr">' + esc(st.asg.instructions) + "</p>";
  }

  var tryBlock;
  if (st.locked) {
    tryBlock =
      '<div class="clinic-lock">' +
        "<p>\uD83D\uDD12 This activity is locked. Enter the unlock code your teacher gave you.</p>" +
        '<div class="clinic-lock-row"><input type="text" class="field-input" data-clinic-code="' + i + '" placeholder="Unlock code" aria-label="Unlock code">' +
        '<button class="btn btn-gold btn-sm" data-clinic-unlock="' + i + '">Unlock</button></div>' +
        '<p class="clinic-lock-msg" id="clinicLockMsg' + i + '"></p>' +
      "</div>";
  } else {
    var w = st.work || {};
    var submit = st.assigned ? '<button class="btn btn-gold btn-sm" data-clinic-submit="' + i + '">Submit to teacher</button>' : "";
    var status = st.assigned ? '<p class="clinic-status" id="clinicStatus' + i + '">' + clinicStatusLabel(w) + "</p>" : "";
    tryBlock =
      '<textarea rows="2" aria-label="Your attempt" data-clinic-input="' + i + '">' + esc(w.attempt || "") + "</textarea>" +
      '<div class="clinic-try-actions">' + submit +
        '<button class="btn btn-ghost btn-sm" data-reveal-fix="' + i + '">Show a suggested fix</button>' +
      "</div>" + status +
      '<div class="clinic-suggested" id="clinicFix' + i + '"><p class="clinic-better">' + esc(c.suggested) + "</p></div>";
  }

  return '<article class="clinic-card' + (st.assigned ? " is-assigned" : "") + '">' + head +
    '<div class="acc-body">' + meta +
      '<div class="clinic-block"><h4>The problem</h4><p>' + esc(c.problem) + "</p></div>" +
      '<div class="clinic-block"><h4>Weak example</h4><p class="clinic-weak">' + esc(c.weak) + "</p></div>" +
      '<div class="clinic-block"><h4>Improved version</h4><p class="clinic-better">' + esc(c.better) + "</p></div>" +
      '<div class="clinic-block"><h4>Quick tip</h4><p class="clinic-tip">' + esc(c.tip) + "</p></div>" +
      '<div class="clinic-block clinic-try"><h4>Try fixing this</h4><p>' + esc(c.practice) + "</p>" + tryBlock + "</div>" +
    "</div></article>";
}
var _clinicSig = "";
function clinicSignature(key) {
  return ClinicService.forStudent(key).map(function (a) { return a.id + ":" + a.clinicIndex + ":" + (a.unlockCode || ""); }).join("|");
}
function renderClinic() {
  var user = AuthService.current();
  if (!user) return;
  var key = clinicKeyFor(user);
  // room (class code) control
  var rin = el("clinicRoom"); if (rin && !rin.value) rin.value = CloudService.room();
  if (rin && !rin.dataset.bound) { rin.dataset.bound = "1"; on(rin, "change", function () { CloudService.setRoom(this.value); renderClinic(); }); }
  var conn = el("clinicConn");
  if (conn) conn.textContent = ClinicService.cloudOn() ? "\u25cf Connected" : (CloudService.available() ? "\u25cb Connecting\u2026" : "\u25cb Offline (this device only)");
  if (conn) conn.className = "clinic-conn" + (ClinicService.cloudOn() ? " is-live" : "");
  // announce presence so the teacher can target this student by name
  if (ClinicService.cloudOn()) CloudService.pingRoster({ room: CloudService.room(), student_key: key, student_name: user.name, seen_at: nowISO() });
  var order = CLINIC.map(function (c, i) { return i; });
  order = order.filter(function (i) { return ClinicService.assignmentFor(key, i); });
  if (!order.length) {
    el("clinicGrid").innerHTML = '<p class="empty-note">No improvement activities assigned yet — your teacher will unlock these for you.</p>';
    _clinicSig = clinicSignature(key);
    return;
  }
  el("clinicGrid").innerHTML = order.map(function (i) { return clinicCardHTML(CLINIC[i], i, key); }).join("");
  _clinicSig = clinicSignature(key);
}
/* reveal suggested fix (records reveal for assigned activities) */
document.addEventListener("click", function (e) {
  var btn = e.target.closest("[data-reveal-fix]");
  if (!btn) return;
  var i = btn.dataset.revealFix;
  var box = el("clinicFix" + i);
  var open = box.classList.toggle("is-open");
  btn.textContent = open ? "Hide the suggested fix" : "Show a suggested fix";
  if (open && AuthService.role() === "student") {
    var u = AuthService.current();
    var key = u ? clinicKeyFor(u) : "";
    if (u && ClinicService.assignmentFor(key, Number(i))) ClinicService.saveWork(key, u.name, Number(i), { revealed: true });
  }
});
/* live typing → save as the student writes */
var _clinicType = {};
document.addEventListener("input", function (e) {
  var ta = e.target.closest("[data-clinic-input]");
  if (!ta) return;
  var i = Number(ta.dataset.clinicInput);
  var u = AuthService.current();
  if (!u) return;
  var key = clinicKeyFor(u);
  clearTimeout(_clinicType[i]);
  var val = ta.value;
  _clinicType[i] = setTimeout(function () {
    var prev = ClinicService.getWork(key, i) || {};
    ClinicService.saveWork(key, u.name, i, { attempt: val, status: (prev.status === "submitted" ? "submitted" : "typing") });
    var s = el("clinicStatus" + i);
    if (s && ClinicService.assignmentFor(key, i)) s.textContent = clinicStatusLabel(ClinicService.getWork(key, i));
  }, 300);
});
/* submit to teacher */
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-clinic-submit]");
  if (!b) return;
  var i = Number(b.dataset.clinicSubmit);
  var u = AuthService.current();
  if (!u) return;
  var key = clinicKeyFor(u);
  var ta = document.querySelector('[data-clinic-input="' + i + '"]');
  var val = ta ? ta.value : "";
  if (!val.trim()) { var s0 = el("clinicStatus" + i); if (s0) s0.textContent = "Write your answer before submitting."; return; }
  ClinicService.saveWork(key, u.name, i, { attempt: val, status: "submitted" });
  var s = el("clinicStatus" + i);
  if (s) s.textContent = clinicStatusLabel(ClinicService.getWork(key, i));
});
/* unlock with code */
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-clinic-unlock]");
  if (!b) return;
  var i = Number(b.dataset.clinicUnlock);
  var u = AuthService.current();
  if (!u) return;
  var key = clinicKeyFor(u);
  var input = document.querySelector('[data-clinic-code="' + i + '"]');
  var code = (input ? input.value : "").trim();
  var asg = ClinicService.assignmentFor(key, i);
  if (asg && code && code.toLowerCase() === String(asg.unlockCode).toLowerCase()) {
    ClinicService.saveWork(key, u.name, i, { unlocked: true });
    renderClinic();
  } else {
    var msg = el("clinicLockMsg" + i);
    if (msg) msg.textContent = "That code did not match. Check it with your teacher.";
  }
});

/* ==========================================================================
   IMPROVEMENT LAB  (teacher console — browse, assign/unlock, live monitor)
   ========================================================================== */
function timeAgo(iso) {
  if (!iso) return "";
  var s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return s + "s ago";
  var m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  var h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return fmtDate(iso);
}
function labStatusInfo(st) {
  if (st.locked) return { cls: "pill-wait", label: "Locked" };
  var w = st.work;
  if (w && w.status === "submitted") return { cls: "pill-ok", label: "Submitted" };
  if (w && w.attempt && w.attempt.trim()) return { cls: "pill-live", label: "Typing\u2026" };
  return { cls: "pill-wait", label: "Not started" };
}
function labActivityCardHTML(c, i) {
  var n = ClinicService.assignments().filter(function (a) { return a.clinicIndex === i; }).length;
  return '<article class="lab-act-card">' +
    '<div class="lab-act-head">' +
      '<label class="lab-pick"><input type="checkbox" class="lab-act-cb" value="' + i + '" aria-label="Select ' + esc(c.title) + '"></label>' +
      '<span class="clinic-num">' + String(i + 1).padStart(2, "0") + "</span>" +
      "<h4>" + esc(c.title) + "</h4>" +
      (n ? '<span class="pill pill-ok">' + n + " assigned</span>" : "") + "</div>" +
    '<p class="lab-act-problem">' + esc(c.problem) + "</p>" +
    '<details class="lab-act-task"><summary>The activity students get</summary>' +
      '<p class="clinic-tip">' + esc(c.practice) + "</p>" +
      '<p class="lab-model-label">Model answer (teacher only)</p>' +
      '<p class="clinic-better">' + esc(c.suggested) + "</p></details>" +
    '<div class="lab-act-actions">' +
      '<input type="text" class="field-input lab-code-input" data-lab-code="' + i + '" placeholder="Unlock code (optional)" aria-label="Unlock code for ' + esc(c.title) + '">' +
      '<button class="btn btn-gold btn-sm" data-lab-assign="' + i + '">Assign / Unlock</button>' +
    "</div></article>";
}
function updateLabPickCount() {
  var n = $all(".lab-act-cb").filter(function (c) { return c.checked; }).length;
  if (el("labPickCount")) el("labPickCount").textContent = n + " selected";
  if (el("labBulkBar")) el("labBulkBar").classList.toggle("is-on", n > 0);
}
function renderLabActivities() {
  var q = (el("labSearch") ? el("labSearch").value : "").trim().toLowerCase();
  var html = CLINIC.map(function (c, i) {
    if (q && (c.title + " " + c.problem + " " + c.practice).toLowerCase().indexOf(q) === -1) return "";
    return labActivityCardHTML(c, i);
  }).join("");
  el("labActivityGrid").innerHTML = html || '<p class="empty-note">No activities match your search.</p>';
  updateLabPickCount();
}
var _labCollapsed = {};
function renderLabMonitor() {
  var roster = ClinicService.roster();
  var assigns = ClinicService.assignments();
  if (!assigns.length) { el("labMonitor").innerHTML = '<p class="empty-note">No activities assigned yet. Assign one on the left to start monitoring.</p>'; return; }
  if (!roster.length) { el("labMonitor").innerHTML = '<p class="empty-note">No students yet. They appear here as soon as they open the Writing Clinic.</p>'; return; }
  var html = roster.map(function (s) {
    var idxs = {};
    assigns.forEach(function (a) { if (a.studentId === s.key || a.studentId === "*") idxs[a.clinicIndex] = true; });
    var keys = Object.keys(idxs).map(Number).sort(function (a, b) { return a - b; });
    if (!keys.length) return "";
    var rows = keys.map(function (i) {
      var st = ClinicService.stateFor(s.key, i);
      var info = labStatusInfo(st);
      var w = st.work || {};
      var c = CLINIC[i];
      var ckey = s.key + "::" + i;
      var collapsed = !!_labCollapsed[ckey];
      var preview = (w.attempt && w.attempt.trim())
        ? '<p class="lab-mon-text">' + esc(w.attempt) + "</p>"
        : '<p class="lab-mon-text lab-mon-empty">\u2014 no text yet \u2014</p>';
      var metaBits = [];
      if (w.revealed) metaBits.push("saw model");
      if (w.updatedAt) metaBits.push(timeAgo(w.updatedAt));
      var meta = metaBits.length ? '<p class="lab-mon-meta">' + esc(metaBits.join(" \u00b7 ")) + "</p>" : "";
      // "view as student" — the full activity exactly as the student sees it, plus their live answer
      var asStudent =
        '<details class="lab-mon-view"><summary>View as student</summary>' +
          '<div class="lab-mon-card">' +
            '<div class="clinic-block"><h4>The problem</h4><p>' + esc(c.problem) + '</p></div>' +
            '<div class="clinic-block"><h4>Weak example</h4><p class="clinic-weak">' + esc(c.weak) + '</p></div>' +
            '<div class="clinic-block"><h4>Improved version</h4><p class="clinic-better">' + esc(c.better) + '</p></div>' +
            '<div class="clinic-block"><h4>Quick tip</h4><p class="clinic-tip">' + esc(c.tip) + '</p></div>' +
            '<div class="clinic-block clinic-try"><h4>Try fixing this</h4><p>' + esc(c.practice) + '</p>' +
              '<div class="lab-mon-answer">' + (w.attempt && w.attempt.trim() ? esc(w.attempt) : '\u2014 nothing written yet \u2014') + '</div>' +
              (w.revealed ? '<p class="lab-mon-meta">Student revealed the model answer.</p>' : '') +
            '</div>' +
          '</div>' +
        '</details>';
      return '<div class="lab-mon-item' + (collapsed ? " is-collapsed" : "") + '" data-mon-key="' + esc(ckey) + '">' +
        '<div class="lab-mon-item-head">' +
          '<button class="lab-mon-collapse" data-mon-collapse="' + esc(ckey) + '" aria-label="Collapse or expand"><span class="acc-chev" aria-hidden="true"></span></button>' +
          '<span class="lab-mon-act">' + String(i + 1).padStart(2, "0") + " \u00b7 " + esc(c.title) + "</span>" +
          '<span class="pill ' + info.cls + '">' + info.label + "</span></div>" +
        '<div class="lab-mon-body">' + preview + meta + asStudent + "</div></div>";
    }).join("");
    return '<div class="lab-mon-student"><p class="lab-mon-name">' + esc(s.name) + "</p>" + rows + "</div>";
  }).join("");
  el("labMonitor").innerHTML = html || '<p class="empty-note">No students have these activities assigned yet.</p>';
}
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-mon-collapse]");
  if (!b) return;
  var item = b.closest(".lab-mon-item");
  if (!item) return;
  var collapsed = item.classList.toggle("is-collapsed");
  if (collapsed) _labCollapsed[b.dataset.monCollapse] = true; else delete _labCollapsed[b.dataset.monCollapse];
});
function clinicProgressLabel(a) {
  var idx = a.clinicIndex;
  if (a.studentId !== "*") {
    var info = labStatusInfo(ClinicService.stateFor(a.studentId, idx));
    return '<span class="pill ' + info.cls + '">' + info.label + "</span>";
  }
  var roster = ClinicService.roster();
  var sub = 0, prog = 0;
  roster.forEach(function (s) {
    var w = ClinicService.getWork(s.key, idx);
    if (w && w.status === "submitted") sub++;
    else if (w && w.attempt && w.attempt.trim()) prog++;
  });
  return '<span class="lab-prog">' + sub + " submitted \u00b7 " + prog + " in progress \u00b7 " + roster.length + " total</span>";
}
function renderLabAsgList() {
  var list = ClinicService.assignments();
  el("labAsgList").innerHTML = list.length ? list.map(function (a) {
    var who = a.studentId === "*" ? "All students" : esc(ClinicService.nameForKey(a.studentId));
    var access = a.unlockCode ? '<span class="lab-code-pill">\uD83D\uDD12 ' + esc(a.unlockCode) + "</span>" : '<span class="pill pill-ok">Open</span>';
    return "<tr><td>" + String(a.clinicIndex + 1).padStart(2, "0") + " \u00b7 " + esc(CLINIC[a.clinicIndex].title) + "</td>" +
      "<td>" + who + "</td><td>" + access + "</td><td>" + clinicProgressLabel(a) + "</td>" +
      '<td><button class="btn btn-ghost btn-sm" data-lab-del="' + a.id + '">Remove</button></td></tr>';
  }).join("") : '<tr><td colspan="5" class="empty-cell">No activities assigned yet.</td></tr>';
}
function labConnLabel() {
  if (ClinicService.cloudOn()) return { live: true, text: "Live across devices \u2014 room \u201c" + esc(CloudService.room()) + "\u201d. Updates the instant any student types or submits." };
  if (CloudService.available()) return { live: false, text: "Connecting to the cloud room\u2026 same-browser tabs already update live." };
  if (RealtimeBus.live) return { live: true, text: "Live within this browser (no cloud configured) \u2014 updates across tabs and windows here." };
  return { live: false, text: "Live updates unavailable; reopen this view to refresh." };
}
function renderImprovementLab() {
  var roster = ClinicService.roster();
  el("labAssignTo").innerHTML = '<option value="*">All students (whole class)</option>' +
    roster.map(function (s) { return '<option value="' + esc(s.key) + '">' + esc(s.name) + "</option>"; }).join("");
  var rin = el("labRoom"); if (rin && !rin.value) rin.value = CloudService.room();
  var conn = labConnLabel();
  var dot = el("labLiveDot"); if (dot) dot.classList.toggle("is-live", conn.live);
  var sub = el("labLiveSub"); if (sub) sub.textContent = conn.text;
  renderLabActivities();
  renderLabMonitor();
  renderLabAsgList();
  if (el("labSearch") && !el("labSearch").dataset.bound) {
    el("labSearch").dataset.bound = "1";
    on(el("labSearch"), "input", renderLabActivities);
  }
  if (el("labAssignSelected") && !el("labAssignSelected").dataset.bound) {
    el("labAssignSelected").dataset.bound = "1";
    on(el("labSelectAll"), "click", function () { $all(".lab-act-cb").forEach(function (c) { c.checked = true; }); updateLabPickCount(); });
    on(el("labClearSel"), "click", function () { $all(".lab-act-cb").forEach(function (c) { c.checked = false; }); updateLabPickCount(); });
    on(el("labAssignSelected"), "click", function () {
      var idxs = $all(".lab-act-cb").filter(function (c) { return c.checked; }).map(function (c) { return Number(c.value); });
      if (!idxs.length) { alert("Tick at least one activity to assign."); return; }
      var target = el("labAssignTo").value || "*";
      var code = (el("labBulkCode").value || "").trim();
      idxs.forEach(function (i) { ClinicService.assign({ studentKey: target, clinicIndex: i, unlockCode: code, by: AuthService.current().name }); });
      el("labBulkCode").value = "";
      renderImprovementLab();
    });
  }
  if (el("labRoom") && !el("labRoom").dataset.bound) {
    el("labRoom").dataset.bound = "1";
    on(el("labRoom"), "change", function () { CloudService.setRoom(this.value); renderImprovementLab(); });
  }
}
document.addEventListener("change", function (e) { if (e.target.classList && e.target.classList.contains("lab-act-cb")) updateLabPickCount(); });
/* assign / unlock an activity for the selected target */
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-lab-assign]");
  if (!b) return;
  var i = Number(b.dataset.labAssign);
  var target = el("labAssignTo").value || "*";
  var codeInput = document.querySelector('[data-lab-code="' + i + '"]');
  var code = codeInput ? codeInput.value.trim() : "";
  ClinicService.assign({ studentKey: target, clinicIndex: i, unlockCode: code, by: AuthService.current().name });
  if (codeInput) codeInput.value = "";
  renderImprovementLab();
});
document.addEventListener("click", function (e) {
  var d = e.target.closest("[data-lab-del]");
  if (!d) return;
  ClinicService.remove(d.dataset.labDel);
  renderImprovementLab();
});

/* ==========================================================================
   LIBRARY  (extended filters)
   ========================================================================== */
function populateLibraryTypes() {
  var types = TaskService.types();
  el("libType").innerHTML = '<option value="">All types</option>' + types.map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("");
}
function renderLibrary() {
  var user = AuthService.current();
  var q = el("libSearch").value.trim().toLowerCase();
  var fTask = el("libTask").value, fType = el("libType").value, fDiff = el("libDifficulty").value, fStatus = el("libStatus").value, fBand = el("libBand").value;
  var gated = AuthService.role() === "student";
  var aset = gated ? studentAssignedTaskIds(user.id) : null;
  var items = TaskService.all().filter(function (t) {
    if (gated && !aset[t.id]) return false;
    if (fTask && t.kind !== fTask) return false;
    if (fType && t.type !== fType) return false;
    if (fDiff && t.difficulty !== fDiff) return false;
    if (fBand && (BAND_TARGET[t.difficulty] || "") !== fBand) return false;
    if (fStatus && statusOfTask(user.id, t.id) !== fStatus) return false;
    if (q && (t.title + " " + t.type + " " + t.desc).toLowerCase().indexOf(q) === -1) return false;
    return true;
  });
  el("libGrid").innerHTML = items.map(function (t) { return taskCardHTML(t, user.id); }).join("");
  el("libEmpty").hidden = items.length > 0;
  if (gated && !items.length) el("libEmpty").textContent = "Nothing assigned yet — your teacher will unlock tasks here.";
}
["libSearch", "libTask", "libType", "libDifficulty", "libStatus", "libBand"].forEach(function (id) {
  on(el(id), "input", function () { if (AuthService.role()) renderLibrary(); });
});

/* ==========================================================================
   TEACHER — STUDENTS
   ========================================================================== */
function renderStudents() {
  var students = AuthService.students();
  var rows = students.map(function (s) {
    var a = AnalyticsService.forStudent(s.id);
    var tok = TokenService.status(s.id);
    return '<tr><td>' + esc(s.name) + '</td>' +
      '<td class="num">' + a.completed + '</td>' +
      '<td class="num">' + (a.avgT1 != null ? a.avgT1.toFixed(1) : "—") + '</td>' +
      '<td class="num">' + (a.avgT2 != null ? a.avgT2.toFixed(1) : "—") + '</td>' +
      '<td>' + (a.weakestCriterion ? esc(a.weakestCriterion) : "—") + '</td>' +
      '<td>' + (tok.mode === "open" ? '<span class="pill pill-ok">Open</span>' : '<span class="pill pill-wait">' + tok.remaining + ' token' + (tok.remaining === 1 ? "" : "s") + '</span>') + '</td>' +
      '<td class="row-actions">' +
        '<button class="btn btn-ghost btn-sm" data-assign-student="' + s.id + '">Assign</button>' +
        '<button class="btn btn-ghost btn-sm" data-token-student="' + s.id + '">Tokens</button>' +
        '<button class="btn btn-ghost btn-sm" data-cert-student="' + s.id + '">Certificate</button>' +
      '</td></tr>';
  }).join("");
  el("view-students").querySelector(".students-body").innerHTML =
    students.length
      ? '<div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th class="num">Done</th><th class="num">T1 avg</th><th class="num">T2 avg</th><th>Weakest criterion</th><th>Exam access</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      : '<p class="empty-note">No students yet. Students appear here automatically when they sign in, or add a sample one below.</p>';
}
document.addEventListener("click", function (e) {
  var a = e.target.closest("[data-token-student]");
  if (a) { manageTokens(a.dataset.tokenStudent); return; }
  var c = e.target.closest("[data-cert-student]");
  if (c) { var name = (AuthService.byId(c.dataset.certStudent) || {}).name; if (confirm("Unlock a Certificate of Completion for " + name + "?")) { CertificateService.unlock(c.dataset.certStudent, "IELTS Academic Writing Foundations", AuthService.current().name); alert("Certificate unlocked."); } return; }
  var asg = e.target.closest("[data-assign-student]");
  if (asg) { showView("assignments"); setTimeout(function () { var sel = el("asgStudent"); if (sel) sel.value = asg.dataset.assignStudent; }, 30); return; }
});
function manageTokens(studentId) {
  var s = AuthService.byId(studentId);
  var st = TokenService.status(studentId);
  var choice = prompt("Exam access for " + s.name + ".\nCurrent: " + (st.mode === "open" ? "Open (unlimited)" : st.remaining + " tokens left") + ".\n\nType a number to GRANT that many exam tokens, 'open' for unlimited, or 'revoke' to lock.", st.mode === "open" ? "open" : String(st.remaining));
  if (choice == null) return;
  choice = choice.trim().toLowerCase();
  if (choice === "open") TokenService.setOpen(studentId);
  else if (choice === "revoke") TokenService.revoke(studentId);
  else { var n = parseInt(choice, 10); if (!isNaN(n) && n > 0) { TokenService.revoke(studentId); TokenService.grant(studentId, n, ""); } }
  renderStudents();
}
on(el("addSampleStudent"), "click", function () {
  var name = prompt("Sample student display name:");
  if (name && name.trim()) { AuthService.signIn(name.trim(), "student"); AuthService.switchUser(AuthService.current().id); /* no-op keep teacher */ }
  // restore teacher session
  var teacher = StorageService.read().users.find(function (u) { return u.role === "teacher"; });
  if (teacher) AuthService.switchUser(teacher.id);
  renderStudents();
});

/* ==========================================================================
   TEACHER — ASSIGNMENTS
   ========================================================================== */
function renderAsgTaskList() {
  var q = (el("asgSearch") ? el("asgSearch").value : "").trim().toLowerCase();
  var tasks = TaskService.all().filter(function (t) {
    return !q || (t.title + " " + t.type + " " + t.kind).toLowerCase().indexOf(q) > -1;
  });
  var groups = [["task1", "Task 1"], ["task2", "Task 2"]];
  el("asgTaskList").innerHTML = groups.map(function (g) {
    var items = tasks.filter(function (t) { return t.kind === g[0]; });
    if (!items.length) return "";
    return '<div class="check-group"><p class="check-group-h">' + g[1] + '</p>' + items.map(function (t) {
      return '<label class="check-item"><input type="checkbox" class="asg-task-cb" value="' + t.id + '">' +
        '<span><strong>' + esc(t.type) + '</strong> — ' + esc(t.title) + ' <em class="check-diff">' + esc(t.difficulty) + '</em></span></label>';
    }).join("") + '</div>';
  }).join("") || '<p class="empty-note">No tasks match your search.</p>';
  updateAsgCount();
}
function updateAsgCount() {
  var n = $all(".asg-task-cb").filter(function (c) { return c.checked; }).length;
  if (el("asgCount")) el("asgCount").textContent = n + " selected";
}
function renderAssignments() {
  var students = AuthService.students();
  el("asgStudent").innerHTML = '<option value="*">All students</option>' + students.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join("");
  renderAsgTaskList();

  var list = AssignmentService.all();
  el("asgList").innerHTML = list.length ? list.map(function (h) {
    var task = TaskService.byId(h.taskId);
    var who = h.studentId === "*" ? "All students" : ((AuthService.byId(h.studentId) || {}).name || "—");
    return '<tr><td>' + esc(who) + '</td><td>' + esc(task ? task.title : "—") + '</td><td>' + modeBadge(h.mode) + '</td><td>' + esc(h.difficulty || "—") + '</td><td>' + (h.deadline ? fmtDate(h.deadline) : "—") + '</td><td>' + (h.unlockCode ? esc(h.unlockCode) : "—") + '</td><td><button class="btn btn-ghost btn-sm" data-del-asg="' + h.id + '">Remove</button></td></tr>';
  }).join("") : '<tr><td colspan="7" class="empty-cell">No assignments yet.</td></tr>';

  if (el("asgSearch") && !el("asgSearch").dataset.bound) {
    el("asgSearch").dataset.bound = "1";
    on(el("asgSearch"), "input", renderAsgTaskList);
    on(el("asgSelectAll"), "click", function () { $all(".asg-task-cb").forEach(function (c) { c.checked = true; }); updateAsgCount(); });
    on(el("asgClear"), "click", function () { $all(".asg-task-cb").forEach(function (c) { c.checked = false; }); updateAsgCount(); });
  }
}
document.addEventListener("change", function (e) { if (e.target.classList && e.target.classList.contains("asg-task-cb")) updateAsgCount(); });
on(el("asgCreate"), "click", function () {
  var ids = $all(".asg-task-cb").filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
  if (!ids.length) { alert("Tick at least one task to assign."); return; }
  var target = el("asgStudent").value, mode = el("asgMode").value;
  var deadline = el("asgDeadline").value || "", instructions = el("asgInstr").value.trim(), unlockCode = el("asgCode").value.trim();
  ids.forEach(function (taskId) {
    AssignmentService.create({
      studentId: target, taskId: taskId, mode: mode,
      difficulty: (TaskService.byId(taskId) || {}).difficulty || "",
      deadline: deadline, instructions: instructions, unlockCode: unlockCode,
      by: AuthService.current().name
    });
  });
  el("asgInstr").value = ""; el("asgCode").value = ""; el("asgDeadline").value = "";
  $all(".asg-task-cb").forEach(function (c) { c.checked = false; });
  renderAssignments();
});
document.addEventListener("click", function (e) {
  var d = e.target.closest("[data-del-asg]");
  if (d) { AssignmentService.remove(d.dataset.delAsg); renderAssignments(); }
});

/* ==========================================================================
   TEACHER — SUBMISSIONS + REVIEW
   ========================================================================== */
function renderSubmissions() {
  var fStudent = el("subStudent").value, fKind = el("subKind").value, fMode = el("subMode").value, fRev = el("subReviewed").value;
  if (!el("subStudent").dataset.filled) {
    el("subStudent").innerHTML = '<option value="">All students</option>' + AuthService.students().map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join("");
    el("subStudent").dataset.filled = "1";
  }
  var filter = {};
  if (fStudent) filter.userId = fStudent;
  if (fKind) filter.kind = fKind;
  if (fMode) filter.mode = fMode;
  if (fRev === "yes") filter.reviewed = true;
  if (fRev === "no") filter.reviewed = false;
  var subs = SubmissionService.list(filter);
  el("subList").innerHTML = subs.length ? subs.map(function (s) {
    var who = (AuthService.byId(s.userId) || {}).name || "—";
    var band = AnalyticsService.bandOf(s);
    return '<tr><td>' + esc(who) + '</td><td>' + esc(s.title) + '</td><td>' + modeBadge(s.mode) + '</td><td class="num">' + s.words + '</td><td class="num">' + (s.ai ? s.ai.estimatedBand.toFixed(1) : "—") + '</td><td class="num">' + (s.review && s.review.reviewed ? '<strong>' + s.review.finalBand.toFixed(1) + '</strong>' : "—") + '</td><td>' + (s.review && s.review.reviewed ? '<span class="pill pill-ok">Reviewed</span>' : '<span class="pill pill-wait">Pending</span>') + '</td><td>' + fmtDate(s.submittedAt) + '</td><td><button class="btn btn-gold btn-sm" data-open-sub="' + esc(s.id) + '">Open</button></td></tr>';
  }).join("") : '<tr><td colspan="9" class="empty-cell">No submissions match these filters.</td></tr>';
}
["subStudent", "subKind", "subMode", "subReviewed"].forEach(function (id) { on(el(id), "input", function () { if (AuthService.role() === "teacher") renderSubmissions(); }); });

document.addEventListener("click", function (e) {
  var o = e.target.closest("[data-open-sub]");
  if (o) openSubmissionDetail(o.dataset.openSub);
});

function openSubmissionDetail(subId) {
  var s = SubmissionService.byId(subId);
  if (!s) return;
  var who = (AuthService.byId(s.userId) || {}).name || "—";
  var task = TaskService.byId(s.taskId);
  var rv = s.review || {};
  var checklistItems = (task.kind === "task1" ? T1_CHECKLIST : T2_CHECKLIST);
  var checklistHTMLs = checklistItems.map(function (text, i) { return '<li>' + (s.checklist && s.checklist[i] ? "☑" : "☐") + " " + esc(text) + '</li>'; }).join("");

  el("detailBody").innerHTML =
    '<div class="ws-top"><button class="btn btn-ghost btn-sm" data-nav="submissions">&larr; All submissions</button>' +
      (s.mode === "exam" && s.locked && !s.retakeAllowed ? '<button class="btn btn-ghost btn-sm" id="allowRetake">Allow retake</button>' : "") +
    '</div>' +
    '<header class="ws-head"><p class="view-eyebrow">' + modeBadge(s.mode) + ' &nbsp; ' + esc(who) + '</p><h2 class="view-title">' + esc(s.title) + '</h2>' +
      '<p class="view-sub">Task ' + (task.kind === "task1" ? "1" : "2") + ' · ' + esc(s.type) + ' · ' + s.words + ' words · ' + (s.timeSpent ? fmtTime(s.timeSpent) + " used" : "time not recorded") + ' · ' + fmtDate(s.submittedAt) + '</p></header>' +

    '<div class="ws-grid">' +
      '<div class="ws-col-main">' +
        '<article class="panel paper-panel"><h3 class="panel-label">Prompt</h3><p class="ws-prompt">' + esc(task.prompt) + '</p></article>' +
        '<article class="panel paper-panel"><h3 class="panel-label">Student answer</h3><div class="answer-text">' + s.text.split(/\n\s*\n/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + '</div></article>' +
        '<article class="panel paper-panel"><h3 class="panel-label">Checklist</h3><ul class="pr-checklist">' + checklistHTMLs + '</ul></article>' +
        '<div id="detailFeedback"></div>' +
      '</div>' +
      '<aside class="ws-col-side">' +
        '<div class="panel glass-panel pad override-panel">' +
          '<h3 class="block-title">Teacher override</h3>' +
          '<p class="override-note">Your final band overrides the AI estimate everywhere it appears.</p>' +
          '<label class="field-label">Final overall band</label><input type="number" step="0.5" min="0" max="9" id="ovBand" class="field-input" value="' + (rv.finalBand != null ? rv.finalBand : "") + '">' +
          '<div class="ov-grid">' +
            ovInput("ovTA", (task.kind === "task1" ? "Task Achievement" : "Task Response"), rv.taTR) +
            ovInput("ovCC", "Coherence & Cohesion", rv.cc) +
            ovInput("ovLR", "Lexical Resource", rv.lr) +
            ovInput("ovGR", "Grammatical Range", rv.gr) +
          '</div>' +
          '<label class="field-label">Comments</label><textarea id="ovComments" class="field-input" rows="3">' + esc(rv.comments || "") + '</textarea>' +
          '<label class="field-label">Correction notes</label><textarea id="ovNotes" class="field-input" rows="2">' + esc(rv.correctionNotes || "") + '</textarea>' +
          '<label class="field-label">Next target</label><input type="text" id="ovNext" class="field-input" value="' + esc(rv.nextTarget || "") + '">' +
          '<div class="ws-actions"><button class="btn btn-gold" id="saveReview">Save &amp; mark reviewed</button><button class="btn btn-navy" id="printDetail">Print report</button></div>' +
        '</div>' +
      '</aside>' +
    '</div>';

  renderFeedback(el("detailFeedback"), s.ai);

  on(el("allowRetake"), "click", function () { SubmissionService.allowRetake(s.id); alert("Retake allowed for this student."); showView("submissions"); });
  on(el("saveReview"), "click", function () {
    var fb = parseFloat(el("ovBand").value);
    if (isNaN(fb)) { alert("Enter a final overall band (0–9)."); return; }
    SubmissionService.applyReview(s.id, {
      finalBand: fb,
      taTR: numOrNull("ovTA"), cc: numOrNull("ovCC"), lr: numOrNull("ovLR"), gr: numOrNull("ovGR"),
      comments: el("ovComments").value.trim(), correctionNotes: el("ovNotes").value.trim(), nextTarget: el("ovNext").value.trim()
    }, AuthService.current().name);
    alert("Review saved.");
    showView("submissions");
  });
  on(el("printDetail"), "click", function () {
    var review = {
      finalBand: parseFloat(el("ovBand").value), taTR: numOrNull("ovTA"), cc: numOrNull("ovCC"), lr: numOrNull("ovLR"), gr: numOrNull("ovGR"),
      comments: el("ovComments").value.trim(), correctionNotes: el("ovNotes").value.trim(), nextTarget: el("ovNext").value.trim()
    };
    ReportService.printSubmissionLike({ student: who, task: task, mode: s.mode, words: s.words, time: s.timeSpent ? fmtTime(s.timeSpent) : "—", checklist: s.checklist, ai: s.ai, review: isNaN(review.finalBand) ? null : review, reportType: "teacher" });
  });

  showView("detail");
}
function ovInput(id, label, val) { return '<label class="field-label ov-cell">' + esc(label) + '<input type="number" step="0.5" min="0" max="9" id="' + id + '" class="field-input" value="' + (val != null ? val : "") + '"></label>'; }
function numOrNull(id) { var v = parseFloat(el(id).value); return isNaN(v) ? null : v; }

/* ==========================================================================
   TEACHER DASHBOARD
   ========================================================================== */
function renderTeacherDash() {
  var a = AnalyticsService.forTeacher();
  var pending = SubmissionService.list({ reviewed: false }).slice(0, 6);
  el("view-dashboard").innerHTML =
    '<div class="dash-hero"><div><p class="view-eyebrow">Teacher / Admin dashboard</p><h2 class="view-title">' + esc(AuthService.current().name) + '</h2><p class="view-sub">Diagnostic overview of your students\' writing.</p></div><div class="dash-coin"><img src="assets/logo/coin-logo.png" alt=""></div></div>' +
    '<div class="stat-grid">' +
      statCard("Total students", String(a.totalStudents), "") +
      statCard("Active (14 days)", String(a.activeStudents), "") +
      statCard("Pending review", String(a.pending), "") +
      statCard("Reviewed", String(a.reviewed), "") +
      statCard("Average band", a.avgBand != null ? a.avgBand.toFixed(1) : "—", "band") +
      statCard("Submissions", String(a.totalSubs), "") +
    '</div>' +
    '<div class="dash-cols">' +
      '<section class="dash-block"><h3 class="block-title">Awaiting your review</h3>' +
        (pending.length ? '<div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Task</th><th>Mode</th><th class="num">AI</th><th></th></tr></thead><tbody>' +
          pending.map(function (s) { var who = (AuthService.byId(s.userId) || {}).name || "—"; return '<tr><td>' + esc(who) + '</td><td>' + esc(s.title) + '</td><td>' + modeBadge(s.mode) + '</td><td class="num">' + (s.ai ? s.ai.estimatedBand.toFixed(1) : "—") + '</td><td><button class="btn btn-gold btn-sm" data-open-sub="' + esc(s.id) + '">Review</button></td></tr>'; }).join("") +
          '</tbody></table></div>' : '<p class="empty-note">Nothing pending — all caught up.</p>') +
      '</section>' +
      '<section class="dash-block"><h3 class="block-title">Class insight</h3>' +
        '<div class="panel glass-panel pad insight"><p><strong>Most common weakness:</strong> ' + (a.commonWeakness ? esc(a.commonWeakness) : "—") + '</p>' +
        '<p><strong>Quick actions:</strong></p><div class="ws-actions"><button class="btn btn-gold btn-sm" data-nav="assignments">Assign homework</button><button class="btn btn-navy btn-sm" data-nav="submissions">All submissions</button><button class="btn btn-ghost btn-sm" data-nav="students">Manage students</button></div></div>' +
      '</section>' +
    '</div>';
}

/* ==========================================================================
   REPORTS  (multiple types) + CERTIFICATE
   ========================================================================== */
function renderReports() {
  var role = AuthService.role();
  var students = role === "teacher" ? AuthService.students() : [AuthService.current()];
  el("repStudent").innerHTML = students.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join("");
  el("repStudentWrap").style.display = role === "teacher" ? "" : "none";
  refreshReportSessions();
}
function refreshReportSessions() {
  var sid = AuthService.role() === "teacher" ? el("repStudent").value : AuthService.current().id;
  var subs = SubmissionService.list({ userId: sid });
  el("repSession").innerHTML = subs.length
    ? subs.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc((s.kind === "task1" ? "Task 1 · " : "Task 2 · ") + s.type + " — " + s.title + " (" + s.mode + ")") + '</option>'; }).join("")
    : '<option value="">No submissions yet</option>';
}
on(el("repStudent"), "change", refreshReportSessions);

on(el("repPrint"), "click", function () {
  var type = el("repType").value;
  if (type === "certificate") { printCertificateFor(AuthService.role() === "teacher" ? el("repStudent").value : AuthService.current().id); return; }
  var subId = el("repSession").value;
  var s = SubmissionService.byId(subId);
  if (!s) { alert("This student has no submissions to report on yet."); return; }
  var task = TaskService.byId(s.taskId);
  var who = (AuthService.byId(s.userId) || {}).name || "Student";
  ReportService.printSubmissionLike({ student: who, task: task, mode: s.mode, words: s.words, time: s.timeSpent ? fmtTime(s.timeSpent) : "—", checklist: s.checklist, ai: s.ai, review: (s.review && s.review.reviewed) ? s.review : null, comments: el("repComments").value, reportType: type });
});

/* ==========================================================================
   REPORT SERVICE  — fills the hidden A4 print node, then window.print()
   ========================================================================== */
var ReportService = {
  printSubmissionLike: function (o) {
    var t1 = o.task.kind === "task1";
    var critLabelTA = t1 ? "Task Achievement" : "Task Response";
    var ai = o.ai, rv = o.review;
    var finalBand = rv && typeof rv.finalBand === "number" ? rv.finalBand : null;
    var titleMap = { submission: "Student Submission Report", teacher: "Teacher Diagnostic Report", parent: "Progress Report", progress: "Writing Progress Report", homework: "Homework Report" };
    el("prReportTitle").textContent = titleMap[o.reportType] || "Writing Report";
    el("prStudent").textContent = o.student || "—";
    el("prDate").textContent = todayLong();
    el("prTaskType").textContent = "Task " + (t1 ? "1 — " : "2 — ") + o.task.type + " (" + o.mode + ")";
    el("prPromptTitle").textContent = o.task.title;
    el("prWords").textContent = o.words + " words";
    el("prTime").textContent = o.time || "—";

    // Band block: teacher override dominant
    var bandHTML = "";
    if (finalBand != null) {
      bandHTML = '<div class="pr-band-final"><span class="pr-band-num">' + finalBand.toFixed(1) + '</span><span class="pr-band-cap">Teacher final band</span></div>' +
        '<p class="pr-band-ai">AI diagnostic estimate: ' + ai.estimatedBand.toFixed(1) + '</p>';
    } else {
      bandHTML = '<div class="pr-band-final pr-band-ai-only"><span class="pr-band-num">' + ai.estimatedBand.toFixed(1) + '</span><span class="pr-band-cap">Preliminary diagnostic estimate</span></div>';
    }
    el("prBandBlock").innerHTML = bandHTML;

    // Criterion table — show teacher value if present, else AI
    var rows = [
      [critLabelTA, ai.criteria.taskAchievement.band, rv && rv.taTR],
      ["Coherence & Cohesion", ai.criteria.coherenceCohesion.band, rv && rv.cc],
      ["Lexical Resource", ai.criteria.lexicalResource.band, rv && rv.lr],
      ["Grammatical Range & Accuracy", ai.criteria.grammaticalRange.band, rv && rv.gr]
    ];
    el("prCriteria").innerHTML = rows.map(function (r) {
      var teacher = (r[2] != null && r[2] !== "") ? r[2].toFixed(1) : "—";
      return '<tr><th>' + esc(r[0]) + '</th><td>' + r[1].toFixed(1) + '</td><td>' + teacher + '</td></tr>';
    }).join("");

    el("prStrengths").innerHTML = ai.strengths.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    el("prWeak").innerHTML = ai.weaknesses.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    el("prErrors").innerHTML = ai.errors.length ? ai.errors.map(function (x) { return "<li><strong>" + esc(x.type) + ":</strong> " + esc(x.detail) + "</li>"; }).join("") : "<li>No major error categories flagged.</li>";
    el("prNext").textContent = (rv && rv.nextTarget) ? rv.nextTarget : ai.nextRecommendation;

    var comments = (rv && rv.comments) || o.comments || "";
    el("prComments").textContent = comments || "—";
    el("prCorr").textContent = (rv && rv.correctionNotes) ? rv.correctionNotes : "—";
    el("prCorrRow").style.display = (rv && rv.correctionNotes) ? "" : "none";

    // parent-friendly: hide error detail + correction
    var parent = o.reportType === "parent";
    el("prErrorsSection").style.display = parent ? "none" : "";

    document.body.classList.add("printing-report");
    el("printReport").setAttribute("aria-hidden", "false");
    window.print();
    setTimeout(function () { document.body.classList.remove("printing-report"); el("printReport").setAttribute("aria-hidden", "true"); }, 300);
  }
};

/* ---------- Certificate ---------- */
function printCertificateFor(userId) {
  var user = AuthService.byId(userId);
  if (!user) return;
  var a = AnalyticsService.forStudent(userId);
  el("certName").textContent = user.name;
  el("certModule").textContent = "IELTS Academic Writing Foundations";
  el("certStat").textContent = "in recognition of completing " + a.completed + " writing task" + (a.completed === 1 ? "" : "s") + " across IELTS Academic Task 1 and Task 2";
  el("certDate").textContent = todayLong();
  document.body.classList.add("printing-cert");
  el("certificate").setAttribute("aria-hidden", "false");
  window.print();
  setTimeout(function () { document.body.classList.remove("printing-cert"); el("certificate").setAttribute("aria-hidden", "true"); }, 300);
}
document.addEventListener("click", function (e) {
  var v = e.target.closest("[data-view-cert]");
  if (v) { var c = CertificateService.list().find(function (x) { return x.id === v.dataset.viewCert; }); if (c) printCertificateFor(c.userId); }
});

/* ==========================================================================
   IMAGE ZOOM MODAL
   ========================================================================== */
var modal, lastFocused = null;
function openModal(src, alt) {
  lastFocused = document.activeElement;
  var img = el("modalImg"); img.src = src; img.alt = alt || "Enlarged task image";
  modal.hidden = false; el("modalClose").focus();
}
function closeModal() { if (modal.hidden) return; modal.hidden = true; if (lastFocused && lastFocused.focus) lastFocused.focus(); }

/* ==========================================================================
   BOOT
   ========================================================================== */
function handlePasswordRecovery() {
  window.__mmwaRecovery = false;
  var np = window.prompt("Set a new password (at least 6 characters):");
  if (np && np.length >= 6) {
    AuthService.updatePassword(np).then(function (res) {
      alert((res && res.error) ? ("Could not update password: " + res.error.message) : "Password updated — you're signed in.");
    }, function () { alert("Could not update password."); });
  }
}
function boot() {
  CloudService.connect();
  seedIfNeeded();
  renderNav();
  populateLibraryTypes();
  if (window.__mmwaRecovery && authMode() === "supabase") handlePasswordRecovery();
  if (AuthService.role()) showView("dashboard"); else { renderAuth(); showView("auth"); }
}

/* ==========================================================================
   REALTIME WIRING — refresh whatever the current user is looking at, whether
   the change arrived from another tab (RealtimeBus) or another device (Supabase).
   ========================================================================== */
function refreshLiveViews(msg) {
  var role = AuthService.role();
  if (!role) return;
  if (role === "teacher") {
    if (CURRENT_VIEW === "improvement") renderImprovementLab();
    else if (CURRENT_VIEW === "students") renderStudents();
    else if (CURRENT_VIEW === "submissions") renderSubmissions();
    else if (CURRENT_VIEW === "assignments") renderAssignments();
    else if (CURRENT_VIEW === "dashboard") renderTeacherDash();
    else if (CURRENT_VIEW === "reports") renderReports();
  }
  if (role === "student") {
    if (CURRENT_VIEW === "dashboard") renderStudentDash();
    else if (CURRENT_VIEW === "clinic") {
      var u = AuthService.current();
      if (u && clinicSignature(clinicKeyFor(u)) !== _clinicSig) renderClinic();
      else {
        var conn = el("clinicConn");
        if (conn) { conn.textContent = ClinicService.cloudOn() ? "\u25cf Connected" : (CloudService.available() ? "\u25cb Connecting\u2026" : "\u25cb Offline (this device only)"); conn.className = "clinic-conn" + (ClinicService.cloudOn() ? " is-live" : ""); }
      }
    }
  }
}
RealtimeBus.subscribe(refreshLiveViews);
CloudService.onChange(function () { refreshLiveViews({ type: "cloud" }); });

modal = el("imgModal");
on(el("modalClose"), "click", closeModal);
document.addEventListener("click", function (e) { if (e.target.closest("[data-close-modal]")) closeModal(); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

if (authMode() === "supabase") {
  // show the sign-in screen immediately; AuthService.init() reboots the app
  // once Supabase resolves the session (or confirms there isn't one)
  renderNav();
  renderAuth();
  showView("auth");
  AuthService.init();
} else {
  boot();
}

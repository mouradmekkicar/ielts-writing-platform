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
    id: "t1-pie", task: "task1", type: "Pie chart",
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
    id: "t1-bar", task: "task1", type: "Bar chart",
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
    id: "t1-line", task: "task1", type: "Line graph",
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
  },
  {
    id: "t1-line-renewable", task: "task1", type: "Line graph",
    title: "Renewable Electricity Generation in Country X (2010–2022)",
    img: "assets/task1/line-renewable-energy.png",
    alt: "Line graph showing electricity generated from wind, solar and hydro in Country X between 2010 and 2022, in terawatt-hours",
    difficulty: "Core", time: "20 min",
    desc: "Track three energy sources over time — steady growth, a fast riser, and a flat line.",
    prompt: "The line graph shows the amount of electricity generated from wind, solar and hydro power in Country X between 2010 and 2022, measured in terawatt-hours (TWh). Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "Line graphs are about movement over time. Your overview should capture the overall direction of each line and the headline change in ranking — here, two sources surge while one barely moves. Use the past tense throughout and let the trends, not individual years, drive your paragraphs.",
    analyse: ["Wind led throughout, climbing steadily from 10 to 72 TWh.", "Solar started lowest (just 2 TWh) but grew fastest, overtaking hydro around 2016 and almost matching wind by 2022 (65 TWh).", "Hydro was virtually flat, edging up only from 40 to 45 TWh across the whole period.", "By 2022 the ranking had reversed for solar and hydro: the smallest source had become the second largest."],
    plan: ["Introduction: paraphrase (electricity from three renewable sources, 2010–2022, in TWh).", "Overview: wind and solar rose sharply while hydro stayed almost constant; solar's growth was the most dramatic, transforming the ranking.", "Body 1: wind and solar — their upward trends, the crossover with hydro, and the narrowing gap by 2022.", "Body 2: hydro — the flat line — contrasted with the other two."],
    vocab: ["rose steadily / climbed sharply", "grew more than thirtyfold", "overtook hydro in 2016", "remained virtually unchanged", "stood at 72 TWh by the end of the period", "the gap had narrowed to just 7 TWh"],
    tip: "Don't describe every year for every line — that is just reading the graph aloud. Select the turning points (where solar overtakes hydro) and the contrasts (rapid growth vs a flat line).",
    model: [
      "The line graph illustrates how much electricity Country X produced from wind, solar and hydroelectric power between 2010 and 2022, expressed in terawatt-hours.",
      "Overall, generation from wind and solar increased substantially over the period, whereas hydro output remained almost static. The most striking development was the rise of solar power, which grew from the smallest source to the second largest.",
      "In 2010, wind already supplied 10 TWh and rose consistently thereafter, reaching 72 TWh by 2022. Solar, by contrast, began at a negligible 2 TWh but expanded far more rapidly. Having overtaken hydro at around 2016, it climbed to 65 TWh in 2022, leaving it only marginally behind wind.",
      "Hydroelectric power followed a very different pattern. Its contribution barely altered, inching up from 40 TWh to just 45 TWh over the twelve years. As a result, a source that had been comfortably the largest in 2010 finished the period in third place, well behind both wind and solar."
    ]
  },
  {
    id: "t1-bar-employment", task: "task1", type: "Bar chart",
    title: "Workforce by Sector in Four Countries (2022)",
    img: "assets/task1/bar-employment-sectors.png",
    alt: "Grouped bar chart comparing the percentage of the workforce in agriculture, industry and services across four countries in 2022",
    difficulty: "Foundation", time: "20 min",
    desc: "Compare three employment sectors across four countries — find the patterns, not every bar.",
    prompt: "The bar chart shows the percentage of the workforce employed in agriculture, industry and services in four countries (A, B, C and D) in 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "Grouped bar charts reward grouping in your writing too. Look across the countries for the biggest contrasts — which country is services-led, which is agriculture-led — rather than describing all twelve bars. Industry is fairly even everywhere, so the real story is agriculture versus services.",
    analyse: ["Services dominated in Country A (70%) but were lowest in Country C (30%).", "Country C was the only agriculture-led economy (40%), while agriculture was tiny in Country A (5%).", "Industry was the most consistent sector, ranging only from 25% to 35% across all four countries.", "Countries B and D sat in the middle, with a fairly even spread across the three sectors."],
    plan: ["Introduction: paraphrase (workforce shares in three sectors, four countries, 2022).", "Overview: services was generally the largest employer, but the balance varied sharply — A was service-led while C was agriculture-led; industry was the steadiest sector.", "Body 1: the contrast between A (service-led) and C (agriculture-led) — the two extremes.", "Body 2: B and D — more balanced — and the consistency of industry across all four."],
    vocab: ["the largest proportion of workers", "employed in the services sector", "agriculture accounted for just 5%", "by far the highest share", "relatively evenly distributed", "industry varied little, from 25% to 35%"],
    tip: "State the unit early (percentages of the workforce) and group countries by their dominant sector. Avoid listing every figure; compare the extremes.",
    model: [
      "The bar chart compares the proportion of the labour force working in agriculture, industry and services across four countries, labelled A to D, in 2022.",
      "Overall, the services sector employed the largest share of workers in most countries, although the balance between sectors differed considerably. Country A was strongly service-oriented, whereas Country C relied far more heavily on agriculture, and industry remained the most stable sector throughout.",
      "The clearest contrast lay between Countries A and C. In Country A, services accounted for a dominant 70% of employment, with agriculture employing a mere 5% and industry the remaining 25%. Country C showed almost the reverse priorities: agriculture was its largest sector at 40%, while services fell to just 30%.",
      "Countries B and D occupied a middle ground, with their workforces spread more evenly across the three sectors. Services led in both, at 50% and 40% respectively, followed by industry. Indeed, industry proved the most consistent category of all, varying only between 25% and 35% across the four economies."
    ]
  },
  {
    id: "t1-pie-water", task: "task1", type: "Pie chart",
    title: "Household Water Use by Activity (2000 vs 2020)",
    img: "assets/task1/pie-water-use.png",
    alt: "Two pie charts showing how household water was used across five activities in 2000 and 2020",
    difficulty: "Core", time: "20 min",
    desc: "Two pies, one story — which slice grew, which shrank, and what held steady.",
    prompt: "The two pie charts show how an average household used water across five activities in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "With paired pie charts the examiner wants the change between them, not a tour of each slice. Identify the largest and smallest categories, then the movers: which share rose, which fell, and which stayed put. Group these rather than describing all five slices twice.",
    analyse: ["Bathing and showering was the largest use in both years and grew from 30% to 35%.", "The toilet's share fell most, from 30% to 22%, dropping from joint-largest to third.", "Laundry rose modestly (15% to 18%), while kitchen (15%) and garden (10%) use were unchanged.", "By 2020 bathing was clearly the single biggest use, having pulled ahead of the toilet."],
    plan: ["Introduction: paraphrase (household water use across five activities, 2000 vs 2020).", "Overview: bathing and showering was the dominant and growing use, while the toilet's share fell sharply; the smaller categories changed little.", "Body 1: the two largest uses — bathing (up) and toilet (down) — and how the gap opened.", "Body 2: the stable categories — laundry's small rise, kitchen and garden unchanged."],
    vocab: ["accounted for the largest share", "made up just under a third", "fell by eight percentage points", "rose slightly to 18%", "remained constant at 15%", "the smallest category throughout"],
    tip: "Use fractions for variety — about a third, a fifth — and never describe all five slices in order for both years. Group the risers, the faller, and the unchanged.",
    model: [
      "The two pie charts illustrate the way in which a typical household divided its water consumption among five activities in 2000 and 2020.",
      "Overall, bathing and showering was the leading use of water in both years and increased its share, whereas the proportion used for flushing toilets declined noticeably. The remaining categories saw only minor changes.",
      "In 2000, bathing and showering and the toilet were jointly the largest uses, each consuming 30% of household water. Over the following two decades the two diverged: bathing rose to 35% and became the single biggest use, while the toilet's share fell to 22%, most probably reflecting more efficient appliances.",
      "Among the smaller categories, the share taken by laundry edged up from 15% to 18%. Water used in the kitchen and for the garden, by contrast, did not change at all, remaining at 15% and 10% respectively and leaving the garden as the smallest use in both years."
    ]
  },
  {
    id: "t1-table-internet", task: "task1", type: "Table",
    title: "Household Internet Access by Region (2010–2020)",
    img: "assets/task1/table-internet-access.png",
    alt: "Table showing the percentage of households with internet access in five regions in 2010, 2015 and 2020",
    difficulty: "Core", time: "20 min",
    desc: "Five regions, three years — find the leader, the laggard, and the fastest catch-up.",
    prompt: "The table shows the percentage of households with internet access in five regions in 2010, 2015 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "Tables give you no shape, so you must impose one. Scan for the highest and lowest figures and the biggest changes. Here every region rose, so the universal increase belongs in the overview; the detail is about who led, who lagged, and where the gap narrowed.",
    analyse: ["Access rose in every region across the decade — the universal trend for the overview.", "The West led throughout, from 55% in 2010 to 90% in 2020.", "Central started lowest (25%) and stayed lowest (68%), but saw one of the largest increases.", "The gap between the highest and lowest region narrowed from 30 points (55 vs 25) to 22 points (90 vs 68)."],
    plan: ["Introduction: paraphrase (household internet access in five regions, 2010, 2015 and 2020).", "Overview: access increased everywhere; the West remained the leader and Central the laggard, but the gap between regions narrowed.", "Body 1: the leaders — West and North — with their figures.", "Body 2: the lower regions — South, East and especially Central — and their rapid catch-up."],
    vocab: ["access increased across all regions", "rose from 55% to 90%", "the highest figure throughout", "by contrast, the lowest level of access", "the gap narrowed over the decade", "more than doubled / nearly tripled"],
    tip: "Don't read the table row by row. Choose the standout figures — the highest, the lowest, the biggest jump — and compare them. State the unit (percentage of households).",
    model: [
      "The table compares the percentage of households able to access the internet in five regions at three points in time: 2010, 2015 and 2020.",
      "Overall, household internet access expanded considerably in every region over the decade. The West consistently recorded the highest level of connectivity and the Central region the lowest, although the gap between the regions gradually narrowed.",
      "The West was the clear leader throughout, with access rising from 55% of households in 2010 to 90% by 2020. The North followed a similar path, climbing from 45% to 84%, so that by the end of the period the two most connected regions were approaching universal access.",
      "The remaining regions began from a lower base but advanced rapidly. The East increased from 38% to 76%, and the South from 30% to 70%. The Central region, the least connected throughout, nonetheless saw one of the steepest rises, from just 25% to 68% — almost tripling and helping to close the regional divide."
    ]
  },
  {
    id: "t1-process-glass", task: "task1", type: "Process",
    title: "The Glass Bottle Recycling Process",
    img: "assets/task1/process-glass-recycling.png",
    alt: "Diagram of the six stages of glass bottle recycling, from collection to moulding new bottles",
    difficulty: "Core", time: "20 min",
    desc: "Describe a six-stage manufacturing cycle using sequence markers and the passive voice.",
    prompt: "The diagram shows the process by which used glass bottles are recycled into new ones. Summarise the information by selecting and reporting the main features. Write at least 150 words.",
    learn: "Process diagrams test sequencing and the passive voice, not data. Your overview states where the process begins and ends and how many stages it has. Then describe each stage in order, naming the inputs (sand, soda ash) and any change of state (solid cullet to molten glass).",
    analyse: ["A linear, man-made process with six clear stages, beginning with collection and ending with new bottles.", "Inputs to mention: sand and soda ash are added at the melting stage.", "A key change of state: crushed glass (cullet) becomes molten in the furnace, then is reshaped.", "The process is cyclical in spirit — the new bottles return to use and can be collected again."],
    plan: ["Introduction: paraphrase (how used glass bottles are recycled into new ones).", "Overview: a linear six-stage process beginning with collection and ending with newly moulded bottles, requiring heat and raw materials at the melting stage.", "Body 1: early stages — collection, sorting by colour, and crushing into cullet.", "Body 2: later stages — cleaning, melting with sand and soda ash, and moulding into new bottles."],
    vocab: ["is collected / is sorted / is crushed", "at the first / next / final stage", "once the glass has been cleaned", "the resulting cullet", "is melted in a furnace", "is then moulded into new bottles"],
    tip: "Use the passive voice and sequencing language, and stay neutral — describe the stages, never explain why recycling is good or add instructions.",
    model: [
      "The diagram illustrates the stages involved in recycling used glass bottles so that they can be turned into new ones.",
      "Overall, this is a linear, man-made process made up of six main stages. It begins with the collection of used bottles and ends with the moulding of new ones, with heat and raw materials required at the central melting stage.",
      "At the first stage, used bottles are collected from households and bottle banks and taken to a recycling facility. There they are sorted according to their colour, after which the sorted glass is crushed into small fragments known as cullet.",
      "Next, the cullet is cleaned so that labels and other impurities are removed. The clean cullet is then fed into a furnace, where it is melted together with sand and soda ash at a very high temperature. Finally, the molten glass is moulded into new bottles and left to cool, ready to be used once again."
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
    id: "t2-twopart", task: "task2", type: "Two-part question", title: "Two-part question — Money and success",
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
  },
  {
    id: "t2-opinion-ai-education", task: "task2", type: "Opinion", title: "Opinion essay — AI tools in education",
    difficulty: "Core", time: "40 min",
    desc: "Take a clear stance on AI in learning and defend it consistently.",
    prompt: "Some people believe that artificial intelligence tools, such as writing and homework assistants, should be freely used by students in schools and universities. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    structure: ["Introduction — paraphrase the topic and state your position clearly.", "Body 1 — your first reason, explained and supported with an example.", "Body 2 — a concession followed by your rebuttal, or a second reason.", "Conclusion — restate your position; add no new ideas."],
    thesis: "Decide your position before writing and make it visible in the introduction. 'To what extent' allows a balanced answer — for example, supporting AI as a learning aid but not as a replacement for the student's own work — but the balance must be precise, not a fence-sitting 'both sides have points'.",
    mistakes: ["Delaying your opinion until the conclusion.", "Listing every possible advantage and disadvantage without committing to a view.", "Describing what AI tools are instead of arguing whether they should be used.", "Supporting claims with invented statistics rather than realistic examples."],
    language: ["I would argue that…", "used responsibly, such tools can…", "there is a clear distinction between… and…", "a notable risk, however, is that…", "on balance, I believe that…"],
    model: [
      "Artificial intelligence tools that can draft essays and solve problems are now widely available to students, prompting debate over whether their use should be unrestricted. While I accept that these tools have genuine educational value, I believe they should be guided rather than used entirely freely.",
      "On the one hand, AI assistants can be powerful aids to learning. Used well, they offer instant explanations, model good writing and help students who lack access to private tutoring. A learner struggling with essay structure, for instance, can ask an AI tool to demonstrate how an argument is organised and then apply that pattern to their own work, accelerating progress that might otherwise stall.",
      "On the other hand, unrestricted use carries a serious risk: students may submit AI-generated work as their own and never develop the underlying skills. If a teenager relies on a tool to write every essay, they will reach examinations — where no such help exists — unable to plan or compose independently. The convenience of the tool would, in this case, undermine the very purpose of education.",
      "For this reason, the sensible approach is supervised use rather than a free-for-all. Schools can allow AI for practice, feedback and revision while requiring that final assessed work be produced under controlled conditions. This preserves the benefits of the technology without allowing it to replace genuine learning.",
      "In conclusion, although AI tools clearly enrich education, I disagree that they should be used entirely freely. A framework that encourages them as learning aids, yet protects independent skill development, offers students the best of both worlds."
    ]
  },
  {
    id: "t2-discussion-remote-work", task: "task2", type: "Discussion", title: "Discussion essay — Working from home vs the office",
    difficulty: "Core", time: "40 min",
    desc: "Discuss both views fairly, then give and justify your own opinion.",
    prompt: "Some people believe that employees are more productive when they work from home, while others think they achieve more in a traditional office. Discuss both views and give your own opinion. Write at least 250 words.",
    structure: ["Introduction — paraphrase both views and state your opinion.", "Body 1 — the first view, explained fairly with an example.", "Body 2 — the second view, explained fairly with an example.", "Conclusion — restate your own position; no new ideas."],
    thesis: "A discussion essay requires three things: present view one, present view two, and give your own opinion. Make your opinion clear in both the introduction and the conclusion, and devote a balanced paragraph to each view rather than arguing only one side.",
    mistakes: ["Explaining one view fully and dismissing the other in a single line.", "Forgetting to give your own opinion, which the question explicitly requires.", "Presenting both views but never explaining why people hold them.", "Treating 'discuss' as 'argue' and writing a one-sided essay."],
    language: ["Those who favour home working argue that…", "Supporters of the office environment, by contrast, point out that…", "there is some merit in both positions", "in my own view, however,…", "ultimately, the ideal arrangement may combine both."],
    model: [
      "Whether people work more effectively at home or in an office has become a common debate as remote working has spread. This essay will consider both perspectives before arguing that a balance between the two tends to produce the best results.",
      "Those who favour working from home emphasise freedom from distractions and commuting. Without the noise of an open-plan office or hours lost in traffic, many employees can concentrate for longer and use the saved time productively. A software developer, for example, may complete complex tasks far more quickly in the quiet of a home study than in a busy workplace full of interruptions.",
      "Supporters of the traditional office, however, point to the value of direct collaboration. Spontaneous conversations, quick clarifications and a clear separation between work and home life are harder to achieve remotely. New employees in particular often learn fastest by observing colleagues and asking questions in person, something a video call cannot fully replicate.",
      "In my opinion, the productivity of each arrangement depends on the nature of the work. Tasks requiring deep, individual concentration are usually better suited to home, whereas teamwork, training and creative discussion benefit from a shared space. A hybrid model, allowing employees to choose according to the task, therefore seems the most sensible solution.",
      "In conclusion, while both home and office working have clear strengths, I believe neither is universally superior. Allowing employees to combine the two is the most effective way to maximise productivity."
    ]
  },
  {
    id: "t2-advdis-online-learning", task: "task2", type: "Advantages / Disadvantages", title: "Advantages and disadvantages — Online university courses",
    difficulty: "Foundation", time: "40 min",
    desc: "Weigh the benefits against the drawbacks and decide which side outweighs.",
    prompt: "More and more universities now offer entire degree courses online rather than in person. Do the advantages of this development outweigh the disadvantages? Write at least 250 words.",
    structure: ["Introduction — paraphrase the trend and state which side outweighs.", "Body 1 — the main advantage(s), developed with an example.", "Body 2 — the main disadvantage(s), developed with an example.", "Conclusion — confirm your judgement on which side outweighs."],
    thesis: "'Do the advantages outweigh the disadvantages?' demands a verdict, not just a list. State your judgement in the introduction and confirm it in the conclusion, and make the paragraph that supports your verdict the stronger of the two.",
    mistakes: ["Listing benefits and drawbacks without ever saying which side outweighs.", "Giving equal weight to both sides when your thesis claims one outweighs the other.", "Turning the essay into an opinion piece on whether online study is 'good'.", "Including several thin points instead of two well-developed ones."],
    language: ["the principal advantage is that…", "this flexibility allows students to…", "a significant drawback, however, is…", "this benefit comes at a cost", "taken together, the advantages outweigh…"],
    model: [
      "It is increasingly common for universities to deliver complete degrees online instead of on campus. Although this shift brings certain disadvantages, I believe its advantages clearly outweigh them, mainly because of the access it provides.",
      "The greatest benefit of online degrees is flexibility of access. Students who live far from a campus, work full-time or have family responsibilities can now study for qualifications that were once out of reach. A parent in a rural area, for instance, can complete a degree in the evenings without relocating or abandoning their job, opening opportunities that simply did not exist a generation ago. Online courses are also often cheaper, since universities save on physical facilities.",
      "Nevertheless, there are real drawbacks. Online learning demands strong self-discipline, and students who lack motivation may fall behind without the structure of timetabled classes. The reduced contact with tutors and peers can also weaken understanding and leave learners feeling isolated, particularly on practical or discussion-based courses.",
      "However, these disadvantages can largely be managed. Well-designed online programmes now include live seminars, deadlines and online communities that restore much of the structure and interaction of a campus. The difficulties therefore stem more from poor course design than from online study itself.",
      "In conclusion, although online degrees require discipline and can feel isolating, the access and flexibility they offer are transformative. On balance, the advantages of this development clearly outweigh its disadvantages."
    ]
  },
  {
    id: "t2-problem-traffic", task: "task2", type: "Problem / Solution", title: "Problem and solution — Traffic congestion in cities",
    difficulty: "Core", time: "40 min",
    desc: "Identify the main causes, then propose realistic, well-explained solutions.",
    prompt: "Many large cities around the world suffer from serious traffic congestion. What are the main causes of this problem, and what measures could be taken to solve it? Write at least 250 words.",
    structure: ["Introduction — paraphrase the problem and signal that you will discuss causes and solutions.", "Body 1 — the main cause(s), explained with an example.", "Body 2 — the main solution(s), explained and linked to the causes.", "Conclusion — summarise the key cause and solution; no new ideas."],
    thesis: "A problem/solution essay must answer both parts fully and keep them connected: your solutions should address the causes you identified. Don't spend the whole essay on causes and rush the solutions — balance the two parts.",
    mistakes: ["Answering only one part of the question (causes or solutions, not both).", "Offering solutions that do not match the causes you described.", "Describing the problem at length but giving vague solutions like 'the government should do something'.", "Failing to explain how each solution would actually work."],
    language: ["a major cause of this problem is…", "this is largely due to…", "one effective measure would be to…", "if cities invested in…, then…", "such a policy would help to reduce…"],
    model: [
      "Traffic congestion is a daily reality in many of the world's largest cities, wasting time and worsening air quality. This essay will examine the principal causes of the problem before suggesting measures that could ease it.",
      "The main cause of congestion is the sheer growth in private car ownership. As cities expand and incomes rise, more residents buy cars, yet road networks cannot grow at the same pace. This imbalance is made worse by inadequate public transport: where buses and trains are slow, unreliable or limited, people have little choice but to drive, even for short journeys. The result is roads carrying far more vehicles than they were designed for, especially during rush hours.",
      "The most effective solution is therefore to make public transport a genuine alternative to the car. By investing in fast, frequent and affordable metro and bus services, cities can persuade commuters to leave their vehicles at home, as has happened in places with well-developed transport networks. This can be reinforced by measures that discourage driving in the busiest areas, such as congestion charges, which make city-centre travel by car more expensive and fund further improvements to public transport in return.",
      "In conclusion, urban congestion is driven mainly by rising car use combined with weak public transport. By improving alternatives to the car and discouraging unnecessary driving, cities can reduce the volume of traffic and create cleaner, more efficient streets."
    ]
  },
  {
    id: "t2-twopart-tech-communication", task: "task2", type: "Two-part question", title: "Two-part question — Technology and communication",
    difficulty: "Challenge", time: "40 min",
    desc: "Answer both questions directly and develop each with reasons and examples.",
    prompt: "Today, people communicate more and more through digital devices rather than face to face. Why is this the case? Is it a positive or negative development? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    structure: ["Introduction — paraphrase the topic and signal that you will answer both questions.", "Body 1 — answer the first question (why this is happening), with reasons and an example.", "Body 2 — answer the second question (positive or negative), with your judgement and support.", "Conclusion — summarise your answers to both questions."],
    thesis: "A two-part question gives you two direct questions — you must answer both, and the second usually requires your own opinion. Plan one body paragraph for each question, and make sure neither part is left thin or ignored.",
    mistakes: ["Answering only one of the two questions.", "Giving a vague answer to 'positive or negative' without committing.", "Writing about technology in general instead of the specific questions asked.", "Spending too long on the first question and rushing the second."],
    language: ["one key reason for this shift is…", "this is largely because…", "on the whole, I regard this as a positive development", "while there are drawbacks, the benefits…", "provided that it is used wisely,…"],
    model: [
      "It is increasingly common for people to interact through phones, messaging apps and social media rather than in person. This essay will explain why this change has occurred and argue that, despite some drawbacks, it is largely a positive development.",
      "The main reason for the shift is the sheer convenience that digital communication offers. Devices allow people to stay in contact instantly, regardless of distance or time zone, and at almost no cost. A worker who has emigrated, for example, can speak to their family every day through video calls, something that would once have required expensive international phone calls. The spread of smartphones and cheap internet access has simply made digital contact the easiest and fastest option for most people.",
      "In my view, this development is mainly positive. Digital communication strengthens relationships that distance would otherwise weaken, enables remote work and study, and gives isolated or housebound individuals a vital link to others. There are, admittedly, concerns that it may reduce the quality of face-to-face interaction; however, these problems arise from how the technology is used rather than from the technology itself, and for most people digital tools supplement personal contact rather than replace it entirely.",
      "In conclusion, people increasingly rely on digital communication chiefly because it is convenient, instant and inexpensive. While it carries some risks, I believe it is a positive development overall, provided it is used to enhance rather than replace real relationships."
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

/* --- Expanded practice clinics (Overview, Comparison, Thesis, PEEL, Upgrade) --- */
const CLINIC_PRACTICE = [
  {
    title: "Task 1 Overview Clinic",
    problem: "The overview lists individual figures or just repeats the introduction, instead of summarising the two or three main trends. Without a clear overview, Task Achievement is capped however accurate the detail is.",
    weak: "Overall, sales were 200 in January, then 350 in March, and they reached 500 by June, while costs were lower.",
    better: "Overall, sales rose steadily throughout the period and consistently exceeded costs, with the gap between the two widening towards the end.",
    tip: "An overview names directions and rankings — up, down, largest, smallest — with no specific numbers. Begin it with 'Overall,' and write it after studying the whole visual.",
    practice: "Write a one-sentence overview for a bar chart where recycling rates in four countries all rise between 2010 and 2020, and Germany is highest in both years.",
    suggested: "Overall, recycling rates increased in all four countries over the decade, with Germany maintaining the highest rate throughout."
  },
  {
    title: "Task 1 Comparison Clinic",
    problem: "Each figure is reported in its own sentence, so the writing reads like a list and never demonstrates the comparison the task demands.",
    weak: "In 2020, France produced 40 units. Germany produced 65 units. Spain produced 30 units. Italy produced 55 units.",
    better: "Germany was the largest producer in 2020 at 65 units, well ahead of Italy and France, while Spain produced the least, at just 30 units.",
    tip: "Group related figures and compare within the group using words like more than, twice as much as, the highest, the lowest. One comparing sentence is worth three listing sentences.",
    practice: "Combine into one comparing sentence: 'Online sales were 70%. In-store sales were 30%.'",
    suggested: "Online sales accounted for the majority of purchases at 70%, more than double the 30% made in store."
  },
  {
    title: "Task 2 Thesis Statement Clinic",
    problem: "The introduction announces the topic but hides the writer's opinion, so the examiner cannot tell what position the essay will defend — a problem for Task Response.",
    weak: "This essay will discuss the advantages and disadvantages of working from home and look at both sides of the issue.",
    better: "While working from home offers clear flexibility, I believe its disadvantages for collaboration and career growth ultimately outweigh these benefits.",
    tip: "Your thesis must state your actual position, not merely promise to 'discuss'. Put it in the last sentence of the introduction and keep it consistent to the conclusion.",
    practice: "Turn this into a clear thesis: 'Some people think university should be free and some people think students should pay.'",
    suggested: "Although free university education would widen access, I would argue that students should contribute to the cost, provided that loans protect the poorest applicants."
  },
  {
    title: "Task 2 Paragraph Development Clinic",
    problem: "A main idea is stated but never explained or illustrated, so the paragraph stays thin and the argument is unconvincing.",
    weak: "Public transport is good for cities. It helps a lot. Cities should invest in it.",
    better: "Investing in public transport benefits cities because it reduces road congestion. When reliable metro and bus services exist, commuters leave their cars at home, as seen in cities like Singapore, where heavy investment has eased traffic and cut emissions. This shows that strong public transport directly improves urban life.",
    tip: "Build each paragraph as Point → Explain (why) → Example (specific) → Link (back to the question). A claim without explanation and an example earns little credit.",
    practice: "Develop this point into 3–4 sentences using explain–example–link: 'Reading improves vocabulary.'",
    suggested: "Reading widely improves vocabulary because readers repeatedly meet new words in context. A student who reads novels and newspapers, for instance, absorbs far more varied language than one who relies only on textbooks, and gradually begins to use those words naturally. In this way, regular reading steadily strengthens a learner's command of vocabulary."
  },
  {
    title: "Grammar & Vocabulary Upgrade Clinic",
    problem: "Sentences are simple and repetitive, with informal wording and small grammar slips, which limits both Lexical Resource and Grammatical Range.",
    weak: "Lots of people think pollution is a really big problem and it is bad and the government should do something about pollution fast.",
    better: "Many people regard pollution as a serious problem, and it is widely argued that governments should take urgent action to address it.",
    tip: "Replace informal words (lots of → many; really big → serious), vary your sentence structures, and avoid repeating the same noun — use referencing such as 'it' or 'this issue' instead.",
    practice: "Upgrade this sentence: 'Kids these days use phones a lot and it is bad for them and they don't talk to people.'",
    suggested: "Young people today rely heavily on their phones, which can be detrimental to their wellbeing and reduce the amount of face-to-face interaction they have."
  }
];
CLINIC.push.apply(CLINIC, CLINIC_PRACTICE);


/* Difficulty → estimated band target (used on cards and analytics). */
const BAND_TARGET = { Foundation: "5.5–6.0", Core: "6.0–6.5", Challenge: "6.5–7.5" };

/* ----- Part 1 expansion: +10 Task 1, +10 Task 2, +10 Clinic (appended) ----- */
const MISSIONS_PART1 = [
  {
    id: "t1-line-population",
    task: "task1",
    type: "Line graph",
    title: "Population of Greenfield City (1980–2020)",
    img: "assets/task1/line-city-population.png",
    alt: "Line graph showing the population of Greenfield City rising from 1.2 million in 1980 to 5.3 million in 2020",
    difficulty: "Foundation",
    time: "20 min",
    desc: "Describe a single steadily rising trend over four decades.",
    prompt: "The line graph shows the population of Greenfield City between 1980 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "A single line still needs a clear overview: state the overall direction and the scale of change. Here the population more than quadrupled, so your overview should capture that rise rather than list every value. Group the years into early and later periods to avoid simply reading the numbers aloud.",
    analyse: ["A continuous upward trend across the whole period, with no falls.", "The population more than quadrupled, from 1.2 million to 5.3 million.", "Growth accelerated after 2000: the steepest rise was between 2010 and 2020.", "Each decade saw a larger increase than the one before."],
    plan: ["Introduction: paraphrase (population of Greenfield City, 1980 to 2020).", "Overview: a continuous rise, with the population more than quadrupling and growth speeding up later.", "Body 1: the slower early growth, 1980 to 2000 (1.2 to 2.8 million).", "Body 2: the faster later growth, 2000 to 2020 (2.8 to 5.3 million)."],
    vocab: ["rose steadily / climbed", "more than quadrupled", "an upward trend", "the steepest increase occurred", "reached a peak of", "by the end of the period"],
    tip: "Quote the start and end figures and one or two milestones only. Resist describing all five points equally — select the most important changes.",
    model: ["The line graph illustrates how the population of Greenfield City changed over a forty-year period from 1980 to 2020.", "Overall, the city experienced continuous and substantial growth, with its population more than quadrupling across the period. Moreover, this expansion accelerated noticeably in the later decades, so that the largest increase took place towards the end.", "In 1980, around 1.2 million people lived in the city. Growth was relatively modest at first: the population reached 1.9 million in 1990 and 2.8 million by 2000, an increase of roughly 1.6 million over the first twenty years.", "Thereafter, expansion gathered pace. The figure climbed to 4.1 million in 2010 and then to 5.3 million by 2020, meaning the city gained a further 2.5 million residents in just two decades. The rise between 2010 and 2020 was the steepest of the entire period, and in effect more than half of the city's total growth occurred in these final two decades alone."]
  },
  {
    id: "t1-bar-screen-time",
    task: "task1",
    type: "Bar chart",
    title: "Average Daily Screen Time by Age Group",
    img: "assets/task1/bar-screen-time.png",
    alt: "Bar chart showing average daily screen time peaking at 5.8 hours for 13 to 18 year olds and lowest at 1.7 hours for those over 55",
    difficulty: "Foundation",
    time: "20 min",
    desc: "Compare a single measure across five categories and find the extremes.",
    prompt: "The bar chart shows the average number of hours per day that people in five age groups spent looking at screens. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "With a categorical bar chart, the overview is about the highest and lowest groups and the overall pattern. Here screen time peaks in adolescence and falls away with age, so describe that curve rather than reading each bar in turn.",
    analyse: ["Teenagers (13 to 18) had by far the highest screen time at 5.8 hours.", "The over-55s had the lowest at 1.7 hours.", "Screen time rose from childhood to a teenage peak, then declined with each older group.", "Young adults (19 to 34) were second highest at 4.6 hours."],
    plan: ["Introduction: paraphrase (daily screen time across five age groups).", "Overview: time peaks among teenagers and then falls with age, ranging widely between groups.", "Body 1: the high-use groups, teenagers and young adults.", "Body 2: the lower-use groups, children, the middle-aged and the over-55s."],
    vocab: ["the highest figure was recorded for", "considerably more than", "fell with each successive group", "at the other extreme", "roughly three times as much as"],
    tip: "Always identify the maximum and minimum first; they anchor your comparison. Then describe the pattern that connects the groups.",
    model: ["The bar chart compares how many hours per day, on average, people in five different age groups spent looking at screens.", "Overall, screen use was highest among teenagers and decreased steadily with age thereafter, so that the oldest group spent the least time of all. The gap between the heaviest and lightest users was considerable.", "Those aged 13 to 18 spent by far the most time on screens, at 5.8 hours a day. Young adults aged 19 to 34 followed at 4.6 hours, while children aged 6 to 12 averaged 2.4 hours, somewhat below the two youngest adult categories.", "From the teenage peak, screen time declined with each older group. People aged 35 to 54 spent 3.1 hours daily, and the over-55s spent only 1.7 hours, less than a third of the teenage figure. Screen use therefore appears to fall consistently once people pass their twenties. This pattern suggests that age strongly influences screen habits, which peak sharply in adolescence before declining steadily with each older group."]
  },
  {
    id: "t1-pie-energy",
    task: "task1",
    type: "Pie chart",
    title: "Sources of Electricity Generation (2010 vs 2020)",
    img: "assets/task1/pie-energy-sources.png",
    alt: "Two pie charts comparing the share of electricity from coal, gas, nuclear and renewables in 2010 and 2020",
    difficulty: "Core",
    time: "20 min",
    desc: "Compare proportions across two pie charts and track how shares shifted.",
    prompt: "The two pie charts show the proportion of electricity generated from four sources in a country in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "With two pie charts, the story is what changed between them. Identify which slices grew, which shrank, and any change in ranking. Here coal fell sharply while renewables surged, so the overview should capture that reversal rather than listing all eight figures.",
    analyse: ["Coal fell heavily, from 45% to 28%, losing its dominant position.", "Renewables rose dramatically, from 10% to 27%, almost tripling.", "By 2020 coal, gas and renewables were nearly level, around a quarter each.", "Gas rose slightly (25% to 27%) and nuclear edged down (20% to 18%)."],
    plan: ["Introduction: paraphrase (share of electricity from four sources, 2010 vs 2020).", "Overview: the mix became far more balanced as coal fell sharply and renewables rose to match it.", "Body 1: the two big movers, coal (down) and renewables (up).", "Body 2: the more stable sources, gas (slight rise) and nuclear (slight fall)."],
    vocab: ["accounted for / made up", "the largest share", "fell sharply / surged", "almost tripled", "by contrast", "drew level with"],
    tip: "Pair the slices that moved in opposite directions (coal down, renewables up) so your comparison shows change, not a list of percentages.",
    model: ["The two pie charts illustrate the proportion of a country's electricity that was generated from coal, gas, nuclear power and renewable sources in 2010 and 2020.", "Overall, the energy mix became considerably more balanced over the decade. The most striking developments were a sharp decline in coal and a dramatic rise in renewables, which by 2020 had reached a similar share to the other leading sources.", "In 2010, coal was clearly dominant, supplying 45% of electricity, while renewables provided the smallest share at just 10%. Gas and nuclear sat in between, at 25% and 20% respectively.", "By 2020 the picture had changed substantially. Coal had dropped to 28%, while renewables had almost tripled to 27%, drawing level with both coal and gas, which had edged up to 27%. Nuclear, meanwhile, slipped slightly to 18%. As a result, three sources each accounted for roughly a quarter of generation, ending coal's earlier dominance."]
  },
  {
    id: "t1-table-tourism",
    task: "task1",
    type: "Table",
    title: "International Tourist Arrivals in Four Countries",
    img: "assets/task1/table-tourist-arrivals.png",
    alt: "Table showing tourist arrivals in millions for Spain, France, Greece and Portugal in 2015, 2020 and 2023",
    difficulty: "Core",
    time: "20 min",
    desc: "Read a data table across three years and report the sharp 2020 dip and recovery.",
    prompt: "The table shows the number of international tourist arrivals, in millions, in four countries in 2015, 2020 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "Tables give you no visual shape, so build the story yourself. Scan for the biggest figures, the largest changes and any shared pattern. Here every country collapsed in 2020 and then recovered to above its 2015 level by 2023 — that common trend is your overview.",
    analyse: ["All four countries followed the same pattern: a steep fall in 2020, then a strong recovery by 2023.", "France led in 2015 (75 million) but Spain overtook it by 2023 (85 million).", "2020 saw dramatic drops everywhere, with France losing more than half its arrivals.", "By 2023 every country exceeded its 2015 figure."],
    plan: ["Introduction: paraphrase (tourist arrivals in four countries across three years).", "Overview: all four fell sharply in 2020 then recovered above 2015 levels, with Spain finishing highest.", "Body 1: the larger destinations, Spain and France, including the change in ranking.", "Body 2: the smaller destinations, Greece and Portugal."],
    vocab: ["received / attracted", "the figure plummeted", "more than halved", "rebounded strongly", "overtook", "respectively"],
    tip: "Group countries by size and report the shared 2020 dip once, rather than repeating it for each country.",
    model: ["The table compares the number of international tourists, in millions, who visited Spain, France, Greece and Portugal in 2015, 2020 and 2023.", "Overall, all four countries followed an identical pattern: arrivals fell dramatically in 2020 before recovering strongly, so that by 2023 every destination had surpassed its 2015 total. Spain ended the period as the most popular destination.", "Among the larger destinations, France received the most visitors in 2015, at 75 million, ahead of Spain's 68 million. In 2020, however, arrivals collapsed everywhere, with France falling to 42 million and Spain to just 19 million. By 2023 both had rebounded, but Spain recovered more strongly, reaching 85 million and overtaking France's 79 million.", "The two smaller destinations showed the same trend. Greece attracted 24 million tourists in 2015, dropped to 7 million in 2020, and climbed to 28 million by 2023. Portugal, the least visited throughout, moved from 11 million to 6 million and then up to 18 million over the same years."]
  },
  {
    id: "t1-process-chocolate",
    task: "task1",
    type: "Process",
    title: "How Chocolate is Produced from Cocoa Beans",
    img: "assets/task1/process-chocolate.png",
    alt: "Flow diagram of the seven stages of chocolate production, from harvesting cocoa beans to moulding and cooling",
    difficulty: "Core",
    time: "20 min",
    desc: "Describe a seven-stage manufacturing sequence using the passive voice.",
    prompt: "The diagram shows how chocolate is produced from cocoa beans. Summarise the information by selecting and reporting the main features. Write at least 150 words.",
    learn: "A process diagram tests sequencing and the passive voice, not data. Your overview states where the process starts, where it ends and how many stages it has. Then describe each stage in order, using sequencers such as first, next, after that and finally.",
    analyse: ["A linear process with seven stages and no loops.", "Start: cocoa beans are harvested. End: chocolate is moulded and cooled.", "Two natural stages early on: fermentation and drying in the sun.", "Sugar and milk are added during the mixing stage."],
    plan: ["Introduction: paraphrase (how chocolate is made from cocoa beans).", "Overview: a linear, seven-stage process from harvesting to moulding and cooling.", "Body 1: the early, preparatory stages — harvesting, fermenting, drying and roasting.", "Body 2: the later, manufacturing stages — grinding, mixing with sugar and milk, and moulding."],
    vocab: ["are harvested / are fermented / are roasted", "at the first stage", "once the beans have been dried", "the resulting cocoa mass", "is then combined with", "finally / lastly"],
    tip: "Use the present passive throughout (the beans are roasted) and keep strictly to description — never add opinions or reasons.",
    model: ["The diagram illustrates the process by which chocolate is manufactured, beginning with the harvesting of cocoa beans and ending with the moulding and cooling of the finished product.", "Overall, this is a linear process consisting of seven distinct stages. It starts with the cultivation and preparation of the raw beans and finishes once the chocolate has been shaped and allowed to set, with sugar and milk introduced near the end.", "At the first stage, ripe cocoa beans are harvested. They are then left to ferment, after which they are spread out and dried in the sun. Once dry, the beans are roasted to develop their flavour.", "In the later stages, the roasted beans are ground into a thick paste known as cocoa mass. This is subsequently mixed with sugar and milk to create liquid chocolate. Finally, the mixture is poured into moulds and cooled until it solidifies into solid chocolate, ready for packaging."]
  },
  {
    id: "t1-map-island",
    task: "task1",
    type: "Map",
    title: "An Island Before and After Tourist Development",
    img: "assets/task1/map-island-tourism.png",
    alt: "Two maps of an island showing the addition of hotels, a restaurant, an enlarged pier and a footpath after tourist development",
    difficulty: "Challenge",
    time: "20 min",
    desc: "Compare two maps and describe what was added, enlarged and kept the same.",
    prompt: "The two maps show an island before and after the construction of tourist facilities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "Maps test the language of location and change, not numbers. Your overview should say how the area changed overall — here, from a quiet natural island to a developed tourist resort. Use compass directions and the passive for change (a hotel was built; the pier was enlarged).",
    analyse: ["The island changed from largely natural to developed for tourism.", "Two hotels and a restaurant were built in the centre, where forest had stood.", "The small pier was enlarged to handle more visitors.", "The beach to the west and most of the trees were retained."],
    plan: ["Introduction: paraphrase (an island before and after tourist development).", "Overview: the island was transformed from a natural setting into a tourist resort, though the beach was kept.", "Body 1: the main additions — hotels, a restaurant and a footpath in the centre.", "Body 2: what was enlarged or kept — the pier was extended, while the beach and some trees remained."],
    vocab: ["was constructed / was built", "in the centre of the island", "to the west", "was enlarged / was extended", "were removed to make way for", "remained unchanged"],
    tip: "Organise by area or by type of change. Use the past passive for the developed map and always say where each feature is.",
    model: ["The two maps illustrate the changes that took place on an island following the construction of facilities for tourists.", "Overall, the island was transformed from a largely natural and undeveloped place into a small tourist resort. While a number of buildings were added in the centre and the pier was enlarged, the beach on the western coast was preserved.", "The most significant changes occurred in the middle of the island, where an area of forest was cleared to make way for development. Two hotels were built side by side, and a restaurant was constructed just to the south of them. A footpath was also added, linking the hotels to the restaurant.", "Access to the island was improved as well: the small pier on the north-western shore was extended into a larger one, presumably to receive more visitors by boat. Despite these developments, the beach to the west was left untouched, and several of the trees around the edges of the island remained in place."]
  },
  {
    id: "t1-mixed-climate",
    task: "task1",
    type: "Mixed chart",
    title: "Monthly Rainfall and Temperature in Marindale",
    img: "assets/task1/mixed-climate.png",
    alt: "Combined chart with bars showing monthly rainfall and a line showing temperature in Marindale across a year",
    difficulty: "Challenge",
    time: "20 min",
    desc: "Read two measures on one chart and relate rainfall to temperature across the year.",
    prompt: "The chart shows the average monthly rainfall (bars) and temperature (line) in the city of Marindale over the course of one year. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "A mixed chart shows two variables, so describe each and then relate them. Note that both rainfall and temperature here peak in mid-year, so the overview can highlight that they rise and fall together. Make clear which axis each variable uses.",
    analyse: ["Both rainfall and temperature peaked in the middle of the year (June to August).", "Rainfall was highest in July (140 mm) and lowest in February (38 mm).", "Temperature ranged from 12°C in January to 29°C in July.", "The two measures broadly rose and fell together across the year."],
    plan: ["Introduction: paraphrase (monthly rainfall and temperature in Marindale over a year).", "Overview: both peak in mid-year and are lowest in winter, moving broadly in step.", "Body 1: temperature across the year, with its summer peak.", "Body 2: rainfall across the year, with its summer peak, related to temperature."],
    vocab: ["peaked at / reached a high of", "the wettest month was", "by contrast, the coldest month", "both figures rose in parallel", "measured on the right-hand axis", "declined towards the end of the year"],
    tip: "State the units and axis for each variable, then compare their timing. Here the key point is that both peak in summer.",
    model: ["The chart presents the average monthly rainfall and temperature recorded in the city of Marindale over a single year, with rainfall shown as bars and temperature as a line.", "Overall, both rainfall and temperature followed a similar pattern, rising to a peak in the middle of the year and falling to their lowest levels in the colder winter months. The two measures therefore moved broadly in parallel.", "Temperature began at 12°C in January and climbed steadily through the spring, reaching its highest point of 29°C in July before declining again to 13°C by December. The warmest period clearly fell between June and August.", "Rainfall showed a comparable shape. It was lowest in February, at just 38 mm, and increased through the spring to a peak of 140 mm in July, the same month in which temperature peaked. From August onwards it fell away, dropping back to around 45 mm by December. The wettest and warmest months thus coincided."]
  },
  {
    id: "t1-multiline-internet",
    task: "task1",
    type: "Multiple line graph",
    title: "Internet Users by Region (2000–2020)",
    img: "assets/task1/multiline-internet-users.png",
    alt: "Line graph with three lines showing the percentage of internet users in the North, Central and South regions rising between 2000 and 2020",
    difficulty: "Core",
    time: "20 min",
    desc: "Track three rising lines, comparing their pace and the gaps between them.",
    prompt: "The graph shows the percentage of people who used the internet in three regions of a country between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "With several lines, compare them rather than describing each in isolation. Note which is highest and lowest throughout, whether the gap widens or narrows, and any crossovers. Here all three rose steeply, but the North stayed ahead while the South started furthest behind.",
    analyse: ["All three regions saw internet use rise sharply over the period.", "The North was consistently highest, reaching 90% by 2020.", "The South began lowest at 1% and remained behind throughout, reaching 62%.", "The gap between regions narrowed in percentage terms as all three approached high levels."],
    plan: ["Introduction: paraphrase (internet users in three regions, 2000 to 2020).", "Overview: all three rose steeply, the North leading and the South trailing throughout.", "Body 1: the North and Central regions, the two front-runners.", "Body 2: the South, the late starter, and how it closed some of the gap."],
    vocab: ["rose steeply / climbed sharply", "remained the highest throughout", "lagged behind", "the gap narrowed", "by the end of the period", "a similar upward trend"],
    tip: "Describe the lines as a group where they share a trend, then pick out differences in level and pace. Mention the highest and lowest lines explicitly.",
    model: ["The line graph compares the percentage of people using the internet in the North, Central and South regions of a country over a twenty-year period from 2000 to 2020.", "Overall, internet use increased dramatically in all three regions. The North led throughout, while the South consistently had the fewest users, although it had narrowed the gap considerably by the end of the period.", "In 2000, internet access was limited everywhere but varied by region: 12% of people in the North used the internet, compared with 4% in the Central region and just 1% in the South. The North then rose rapidly, passing 50% by 2010 and reaching 90% in 2020.", "The Central and Southern regions followed the same upward path more slowly. Central use climbed to 30% by 2010 and 78% by 2020, while the South, despite starting from almost nothing, reached 35% and then 62%. By 2020, therefore, a clear majority in every region was online, even though regional differences had not disappeared."]
  },
  {
    id: "t1-stacked-waste",
    task: "task1",
    type: "Stacked bar chart",
    title: "Composition of Household Waste by Region",
    img: "assets/task1/stacked-waste.png",
    alt: "Stacked bar chart showing the percentage of organic, plastic, paper and other waste in four regions",
    difficulty: "Core",
    time: "20 min",
    desc: "Compare the make-up of a total across four regions using a stacked bar chart.",
    prompt: "The chart shows the proportion of household waste made up of four different materials in four regions. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "A stacked bar shows how a whole divides into parts. Compare the same component across the bars (which region has most plastic?) rather than reading each bar top to bottom. Note that every bar totals 100%, so a larger slice of one material means a smaller slice of another.",
    analyse: ["Organic waste was the largest component in every region, especially the South (48%).", "Plastic was highest in the West (32%) and lowest in the South (18%).", "Paper was fairly consistent across regions, at around a fifth.", "Each region totalled 100%, so the materials traded share against one another."],
    plan: ["Introduction: paraphrase (composition of household waste in four regions).", "Overview: organic waste dominated everywhere, while plastic varied most between regions.", "Body 1: organic and plastic — the largest and most variable components.", "Body 2: paper and other waste — the smaller, more stable components."],
    vocab: ["made up / accounted for", "the largest proportion of", "by far the biggest component", "ranged from … to …", "relatively consistent across regions", "the remainder consisted of"],
    tip: "Compare one material at a time across the regions, and remember each bar adds to 100%, so emphasise share rather than absolute amounts.",
    model: ["The stacked bar chart compares the proportion of household waste composed of organic matter, plastic, paper and other materials across four regions: North, East, South and West.", "Overall, organic waste formed the largest share of household rubbish in every region, whereas the proportion of plastic varied most noticeably from one region to another. Paper and other materials made up smaller and more consistent shares.", "Organic waste was the dominant component throughout, ranging from 30% in the West to a high of 48% in the South. Plastic, by contrast, showed the widest variation: it accounted for 32% of waste in the West but only 18% in the South, the reverse of the organic pattern.", "The remaining materials were more stable across the regions. Paper consistently made up around a fifth of waste, from 18% in the East to 24% in the West, while other materials accounted for between 12% and 17%. In every case, these two categories together formed roughly a third of the total."]
  },
  {
    id: "t1-comparative-transport",
    task: "task1",
    type: "Comparative table",
    title: "Public Transport Use in Five Cities (2010 vs 2022)",
    img: "assets/task1/comparative-transport.png",
    alt: "Comparative table showing public transport trips per person per year in five cities in 2010 and 2022, with the change",
    difficulty: "Core",
    time: "20 min",
    desc: "Compare two years across five cities and group the risers against the faller.",
    prompt: "The table shows the average number of public transport trips made per person each year in five cities in 2010 and 2022, together with the change over that period. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    learn: "A comparative table invites you to group cities by how they changed. Most rose, one fell, and the size of the rise differed. Your overview should capture that most cities saw growth while one declined, rather than listing all five separately.",
    analyse: ["Four of the five cities saw public transport use rise; only Cardiff fell.", "Oslo and Vienna grew most, by 130 and 120 trips per person respectively.", "Cardiff was the only city to decline, from 150 to 135 trips.", "Lisbon and Turin grew only modestly, by 30 and 15 trips."],
    plan: ["Introduction: paraphrase (public transport trips per person in five cities, 2010 vs 2022).", "Overview: most cities saw rising use, led by Oslo and Vienna, while Cardiff alone declined.", "Body 1: the strong risers, Oslo and Vienna.", "Body 2: the modest risers and the one faller — Lisbon, Turin and Cardiff."],
    vocab: ["trips per person per year", "rose by / increased by", "the sharpest increase", "in contrast / conversely", "the only city to record a fall", "a modest rise of"],
    tip: "Group the cities by direction of change. Report the largest and smallest movements, and highlight the single city that bucked the trend.",
    model: ["The table compares the average number of public transport journeys made per person annually in five European cities in 2010 and 2022, along with the change between those years.", "Overall, public transport use rose in four of the five cities, with Oslo and Vienna recording the largest increases, while Cardiff was the only city in which use declined.", "The strongest growth occurred in Oslo and Vienna. Oslo saw trips per person climb from 200 to 330, a rise of 130, and Vienna increased from 240 to 360, the highest figure overall in 2022. These two cities accounted for by far the biggest gains.", "Elsewhere, change was more modest. Lisbon rose from 180 to 210 trips, and Turin from 160 to 175, increases of 30 and 15 respectively. Cardiff, by contrast, was the only city to move in the opposite direction, with use falling from 150 to 135 trips per person over the period."]
  }
];
MISSIONS.push.apply(MISSIONS, MISSIONS_PART1);

const T2_TYPES_PART1 = [
  {
    id: "t2p-opinion",
    task: "task2",
    type: "Opinion",
    title: "Opinion essay — Online learning",
    difficulty: "Core",
    time: "40 min",
    desc: "Give and defend your own opinion on whether online study can replace the classroom.",
    prompt: "Some people believe that online learning will eventually replace traditional classroom education. What is your opinion? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    structure: ["Introduction — paraphrase the statement and state your opinion clearly.", "Body 1 — your first reason, explained and supported with an example.", "Body 2 — your second reason (or a concession and rebuttal).", "Conclusion — restate your position without adding new ideas."],
    thesis: "Decide your position before you write and make it explicit in the introduction. \"What is your opinion?\" requires a clear stance — fully for, fully against, or a defined middle position — held consistently to the end.",
    mistakes: ["Sitting on the fence and never stating an opinion.", "Listing advantages and disadvantages instead of arguing a case.", "Forgetting to support claims with concrete examples.", "Drifting from the question into a general essay about technology."],
    language: ["In my view, …", "While online study has clear merits, …", "A key advantage of classroom learning is that …", "For example, students who …", "On balance, I believe that …"],
    model: ["The idea that online learning might one day make classrooms obsolete has gained ground as digital tools improve. While I accept that online study offers real advantages, I do not believe it will fully replace traditional education, because classrooms provide forms of learning that screens cannot reproduce.", "There is no doubt that online learning is convenient and flexible. Students can study at their own pace, revisit recorded lessons and access courses from anywhere, which is especially valuable for working adults or those in remote areas. A learner in a small village, for instance, can now take a university course that would once have been impossible to reach.", "However, classroom education offers benefits that are difficult to deliver online. Face-to-face teaching allows immediate questions, spontaneous discussion and the kind of social interaction that builds confidence and teamwork. Younger learners in particular often need the structure and personal attention that a physical classroom provides, and many struggle to stay motivated when studying alone in front of a screen. Crucially, a teacher can also notice when a pupil is falling behind and intervene immediately, something an automated system rarely manages well.", "In my opinion, the most likely outcome is not replacement but combination. Schools and universities increasingly blend online resources with in-person teaching, using each for what it does best. This balanced approach keeps the flexibility of digital study while preserving the human contact that learning depends on.", "In conclusion, although online learning will continue to expand and improve, I believe it will complement rather than replace the classroom, since direct human interaction remains essential to effective education."]
  },
  {
    id: "t2p-discussion",
    task: "task2",
    type: "Discussion",
    title: "Discussion essay — Printed vs digital books",
    difficulty: "Foundation",
    time: "40 min",
    desc: "Discuss both views on printed and digital books, then give your own opinion.",
    prompt: "Some people prefer to read printed books, while others believe that digital books are better. Discuss both views and give your own opinion. Write at least 250 words.",
    structure: ["Introduction — paraphrase both views and state your opinion.", "Body 1 — the case for printed books, with an example.", "Body 2 — the case for digital books, with an example.", "Conclusion — restate your position; no new ideas."],
    thesis: "You must present both views fairly and give your own opinion. Devote one body paragraph to each view, and make your own position clear in both the introduction and the conclusion.",
    mistakes: ["Explaining one view fully but dismissing the other in a single line.", "Forgetting to give your own opinion, which the question requires.", "Describing the two formats without explaining why people prefer each.", "Treating \"discuss\" as an invitation to argue only one side."],
    language: ["Those who favour … argue that …", "Supporters of … point out that …", "There is merit in both positions.", "Personally, however, I find that …", "Ultimately, the choice depends on …"],
    model: ["Whether printed or digital books are preferable is a question that divides readers. While some value the physical experience of a printed book, others appreciate the convenience of digital formats. This essay considers both views before concluding that the two formats serve different purposes well.", "Those who prefer printed books often emphasise the physical experience of reading. A printed page causes no eye strain from a backlit screen, requires no battery, and many readers find that they concentrate and remember more from paper. Collectors and students also value being able to annotate margins and browse a shelf, pleasures a screen cannot fully replicate.", "Advocates of digital books, on the other hand, stress practicality. A single device can store thousands of titles, making it ideal for travel, and e-books are often cheaper and instantly available. Features such as adjustable text size and built-in dictionaries also make reading more accessible, particularly for older readers or language learners. Borrowing electronic titles from a library has also become straightforward, removing cost as a barrier for many people.", "In my view, neither format is simply better; each suits a different situation. I prefer printed books for serious or lengthy reading, where focus matters, but rely on digital books when travelling or studying, where convenience and searchability are more useful. Many readers, like me, comfortably use both.", "In conclusion, printed books offer a richer physical experience while digital books offer flexibility and convenience, and I believe the sensible approach is to choose the format that best fits the purpose rather than abandon either."]
  },
  {
    id: "t2p-advdis",
    task: "task2",
    type: "Advantages / Disadvantages",
    title: "Advantages and disadvantages — Remote work",
    difficulty: "Foundation",
    time: "40 min",
    desc: "Weigh the benefits of working from home against the drawbacks and decide which prevails.",
    prompt: "An increasing number of people now work from home rather than in an office. Do the advantages of this development outweigh the disadvantages? Write at least 250 words.",
    structure: ["Introduction — paraphrase the trend and state whether advantages outweigh disadvantages.", "Body 1 — the main advantages, explained with an example.", "Body 2 — the main disadvantages, explained with an example.", "Conclusion — restate your overall judgement."],
    thesis: "The question asks for a judgement: do the advantages outweigh the disadvantages? State your verdict in the introduction and conclusion, not just a list of pros and cons. Make sure your body paragraphs justify the side you choose.",
    mistakes: ["Listing points on both sides without ever judging which outweighs.", "Giving equal weight to both sides but never deciding.", "Confusing advantages to the worker with advantages to the employer without distinguishing them.", "Writing a discussion essay when a judgement is required."],
    language: ["A clear benefit of … is that …", "This is particularly advantageous for …", "On the negative side, …", "One significant drawback is that …", "Weighing these factors, I would argue that …"],
    model: ["The number of people working from home has risen sharply, accelerated by improvements in technology and changes in how companies operate. Although remote work brings some real disadvantages, I believe its benefits clearly outweigh them for most employees.", "The advantages are considerable. Working from home eliminates the daily commute, saving workers time and money and reducing traffic and pollution. It also offers flexibility, allowing people to balance their jobs with family responsibilities. A parent, for example, can more easily care for young children while still meeting professional deadlines, something a rigid office schedule rarely permits.", "Nevertheless, remote work has genuine drawbacks. Some employees feel isolated without daily contact with colleagues, and collaboration can suffer when teams rarely meet in person. The boundary between work and home life can also blur, leading people to work longer hours and struggle to switch off. Those without a quiet, well-equipped space at home may find it difficult to concentrate at all, and newer employees in particular may struggle to learn from experienced colleagues when everyone works apart.", "On balance, however, these problems can largely be managed, whereas the benefits are difficult to obtain in a traditional office. Companies can arrange occasional in-person meetings to maintain teamwork, and individuals can set clear working hours to protect their personal time. The savings in commuting and the gains in flexibility remain substantial.", "In conclusion, while working from home is not without difficulties, I believe the advantages of greater flexibility, reduced commuting and improved work-life balance outweigh the disadvantages for the majority of workers."]
  },
  {
    id: "t2p-problem",
    task: "task2",
    type: "Problem / Solution",
    title: "Problem and solution — Traffic congestion",
    difficulty: "Core",
    time: "40 min",
    desc: "Identify the causes of urban traffic congestion and propose realistic solutions.",
    prompt: "Traffic congestion is becoming a serious problem in many large cities. What are the causes of this problem, and what measures could be taken to solve it? Write at least 250 words.",
    structure: ["Introduction — paraphrase the problem and outline your answer.", "Body 1 — the main causes of congestion.", "Body 2 — practical measures to address them.", "Conclusion — summarise the causes and the most promising solutions."],
    thesis: "Answer both parts equally: causes and solutions. Make sure each solution clearly addresses a cause you have raised, so the essay is coherent rather than two unrelated lists.",
    mistakes: ["Discussing causes in detail but giving solutions only a sentence.", "Proposing solutions that do not match the causes you identified.", "Listing many vague measures instead of developing a few well.", "Drifting into the effects of congestion rather than its causes."],
    language: ["A primary cause of … is …", "This is largely due to …", "One effective measure would be to …", "Governments could address this by …", "If such steps were taken, …"],
    model: ["Traffic congestion has become a daily reality in many large cities, slowing journeys and increasing pollution. This essay will examine the principal causes of the problem and suggest several measures that could ease it.", "The congestion stems mainly from rising car ownership and inadequate infrastructure. As cities grow and incomes rise, more people buy private vehicles, yet road networks expand far more slowly. The problem is worsened by poor public transport in many areas, which leaves driving as the only practical option, and by the concentration of workplaces in central districts that everyone tries to reach at the same time.", "Several measures could address these causes. The most effective is to invest heavily in fast, reliable public transport, such as metro and bus systems, so that people have a genuine alternative to the car. Cities can also discourage unnecessary driving through congestion charges and higher parking fees in central areas, while encouraging cycling with dedicated lanes. Flexible working hours would further help by spreading demand across the day rather than concentrating it in two rush hours, and public awareness campaigns could encourage people to share journeys or travel outside peak times.", "These solutions work best in combination. Improving public transport gives people an alternative, while charging schemes give them a reason to use it, and together they can shift behaviour in a way that neither could achieve alone.", "In conclusion, urban congestion is caused chiefly by growing car use and limited infrastructure, and the most promising response is to combine better public transport with measures that make private driving less attractive."]
  },
  {
    id: "t2p-twopart",
    task: "task2",
    type: "Two-part question",
    title: "Two-part question — Urbanisation",
    difficulty: "Core",
    time: "40 min",
    desc: "Answer both parts: why people move to cities and the problems this causes.",
    prompt: "In many countries, people are increasingly moving away from rural areas to live in cities. Why do people make this choice, and what problems can this movement cause? Write at least 250 words.",
    structure: ["Introduction — paraphrase the trend and signal that you will answer both questions.", "Body 1 — the reasons people move to cities.", "Body 2 — the problems this movement can cause.", "Conclusion — summarise both your answers."],
    thesis: "A two-part question has two direct questions; you must answer both, and equally. Dedicate one body paragraph to each. Do not turn it into an opinion essay — it asks for reasons and problems, not your judgement.",
    mistakes: ["Answering only one of the two questions.", "Spending most of the essay on reasons and rushing the problems.", "Giving an opinion instead of the reasons and problems requested.", "Listing points without developing any of them."],
    language: ["The main reason for this is …", "People are drawn to cities by …", "A serious consequence of this is …", "This can lead to …", "Such rapid growth often results in …"],
    model: ["Across the world, growing numbers of people are leaving the countryside to settle in cities. This essay will first consider why they make this choice and then examine the difficulties that such migration can create.", "People move to cities chiefly in search of better opportunities. Urban areas typically offer far more jobs, and usually better-paid ones, than rural regions, where employment may depend on a single industry such as farming. Cities also provide superior services: better schools, hospitals and universities, as well as the entertainment and convenience that attract younger people in particular. For a young person hoping to build a career, the city often appears to be the only realistic option.", "However, this movement can place severe strain on cities. Rapid population growth frequently outpaces the supply of housing, driving up rents and forcing some newcomers into overcrowded or informal settlements. Public services and transport systems can become overwhelmed, leading to congestion and pollution. Meanwhile, the regions people leave behind may suffer too, losing their younger, more able workers and falling into decline. Rising demand in the cities can also push up the cost of living, so that the higher wages newcomers hoped for are partly absorbed by expensive housing and daily expenses.", "These two sides are closely linked: the very opportunities that draw people in are what create pressure once too many arrive at once.", "In conclusion, people migrate to cities mainly for better jobs and services, but this large-scale movement can cause housing shortages, overstretched services and the decline of rural areas, problems that require careful planning to manage."]
  },
  {
    id: "t2p-direct",
    task: "task2",
    type: "Direct question",
    title: "Direct question — Fast fashion",
    difficulty: "Core",
    time: "40 min",
    desc: "Answer the question directly: why fast fashion is popular and whether it is positive.",
    prompt: "Cheap, fashionable clothing that is quickly produced and frequently replaced has become very popular. Why has this trend developed, and is it a positive or negative development? Write at least 250 words.",
    structure: ["Introduction — paraphrase the trend and state your overall view.", "Body 1 — why the trend has developed.", "Body 2 — why it is, on balance, positive or negative.", "Conclusion — restate the reasons and your judgement."],
    thesis: "This question has two parts: a reason and an evaluation. Answer both. For the second part, take a clear stance (positive or negative) rather than merely describing effects.",
    mistakes: ["Explaining the reasons but never judging whether it is positive or negative.", "Giving a balanced description with no clear evaluation.", "Confusing why the trend developed with whether it is good.", "Making sweeping claims with no support."],
    language: ["This trend has emerged largely because …", "One reason for its popularity is …", "I would argue that this is a largely negative development because …", "A serious downside is that …", "Despite some benefits, …"],
    model: ["In recent years, inexpensive and constantly changing clothing, often called fast fashion, has become hugely popular. This essay will explain why the trend has grown and argue that, despite its appeal, it is ultimately a negative development.", "The trend has developed for several reasons. Advances in manufacturing and global supply chains have made it possible to produce clothes very cheaply and quickly, so retailers can offer the latest styles at low prices. At the same time, social media constantly exposes consumers to new trends and encourages them to update their wardrobes frequently. The result is a cycle in which affordable, fashionable items are bought, worn briefly and discarded.", "Although this gives shoppers variety and choice at low cost, I believe the disadvantages outweigh the benefits. The environmental cost is severe: producing vast quantities of cheap clothing consumes enormous resources, and much of it ends up in landfill within months. There are also ethical concerns, as low prices often depend on poorly paid workers in unsafe conditions. Encouraging people to treat clothes as disposable is therefore harmful both to the planet and to the people who make them.", "Some argue that fast fashion makes self-expression affordable for those on low incomes, which is a genuine benefit. Even so, this advantage is small compared with the long-term damage caused by waste and exploitation.", "In conclusion, fast fashion has spread because of cheap production and the influence of social media, but I consider it a negative development overall, given its environmental and ethical costs."]
  },
  {
    id: "t2p-agreedisagree",
    task: "task2",
    type: "Agree / Disagree",
    title: "Agree or disagree — Free university education",
    difficulty: "Core",
    time: "40 min",
    desc: "Take a clear position on whether university education should be free for everyone.",
    prompt: "Some people believe that university education should be free for all students, regardless of their income. To what extent do you agree or disagree? Write at least 250 words.",
    structure: ["Introduction — paraphrase the statement and state how far you agree.", "Body 1 — your first supporting reason, with an example.", "Body 2 — your second reason, or a counter-argument you then answer.", "Conclusion — restate your position."],
    thesis: "\"To what extent do you agree or disagree?\" invites a clear stance, which may be full or partial agreement. Whatever you choose, state it in the introduction and keep it consistent. Partial agreement must define exactly where you draw the line.",
    mistakes: ["Failing to state how far you agree.", "Switching position between paragraphs.", "Arguing both sides equally with no overall stance.", "Giving reasons that are assertions without explanation or example."],
    language: ["I largely agree that …", "There are strong grounds for …", "That said, I would qualify this by …", "A compelling argument in favour is that …", "For these reasons, I believe …"],
    model: ["Whether university education should be provided free of charge to all students, irrespective of their financial circumstances, is a contested question. While I strongly support making higher education accessible, I only partly agree that it should be entirely free for everyone.", "There are powerful arguments for free university education. Removing tuition fees ensures that talented students from poorer backgrounds are not excluded by cost, which is fairer and allows society to benefit from their abilities. A nation that educates its citizens widely also gains economically, producing the skilled doctors, engineers and teachers that a modern economy depends on. From this perspective, education is a public good worth funding collectively.", "However, completely free education for all has drawbacks. It is extremely expensive, and the cost falls on taxpayers, including many who never attend university. There is also a risk that, when courses cost nothing, some students enrol without serious commitment. A fairer system might therefore fund tuition fully for low-income students while asking wealthier families, who can afford it, to contribute. Such an approach would also direct limited public money towards the students who need it most, rather than subsidising those who could comfortably pay.", "In my view, the priority should be ensuring that money is never a barrier to study, rather than that everyone pays nothing. Generous grants and income-based support can achieve this more efficiently than blanket free education.", "In conclusion, I agree that no able student should be denied a university place because of cost, but I believe targeted support is preferable to making higher education free for all, regardless of income."]
  },
  {
    id: "t2p-causeseffects",
    task: "task2",
    type: "Causes / Effects",
    title: "Causes and effects — Children and screen time",
    difficulty: "Core",
    time: "40 min",
    desc: "Explain the causes of rising screen time among children and its effects.",
    prompt: "Children today spend much more time using screens than children did in the past. What are the causes of this change, and what effects does it have on children? Write at least 250 words.",
    structure: ["Introduction — paraphrase the trend and signal that you will cover causes and effects.", "Body 1 — the causes of increased screen time.", "Body 2 — the effects on children.", "Conclusion — summarise both causes and effects."],
    thesis: "Answer both parts: causes and effects. Keep them clearly separated, and make sure the effects you describe genuinely follow from a world of heavy screen use, not from screens in general.",
    mistakes: ["Writing about causes only and neglecting effects.", "Listing effects that are unrelated to the causes given.", "Offering solutions when none are asked for.", "Treating all effects as negative without acknowledging any nuance."],
    language: ["This change is largely caused by …", "A major factor is …", "One consequence of this is that …", "This can have a damaging effect on …", "On the positive side, however, …"],
    model: ["Children today spend far more time looking at screens than previous generations did. This essay will examine the main causes of this shift and consider the effects it has on young people.", "Several factors explain the change. The most obvious is the sheer availability of devices: smartphones, tablets and games consoles are now present in most homes, and much schoolwork and entertainment has moved online. In addition, busy parents sometimes use screens as a convenient way to keep children occupied, and the apps and games themselves are deliberately designed to be engaging, encouraging children to keep watching and playing for as long as possible.", "The effects of this are mixed but give cause for concern. On the negative side, excessive screen time can reduce physical activity, contributing to poorer health, and may disturb sleep when devices are used late at night. Some research also links heavy use to shorter attention spans and weaker face-to-face social skills. On the other hand, screens are not wholly harmful: educational programmes and apps can support learning, and online tools allow children to develop digital skills that modern life increasingly demands. Even so, long hours indoors on devices may limit the time children spend playing outside and meeting friends in person.", "The key, therefore, is balance rather than total avoidance, since the impact depends heavily on how screens are used and for how long.", "In conclusion, the rise in children's screen time results mainly from the wide availability and addictive design of devices, and while it offers some educational benefits, excessive use can harm children's health, sleep and social development."]
  },
  {
    id: "t2p-balanced",
    task: "task2",
    type: "Balanced opinion",
    title: "Balanced opinion — Globalisation and culture",
    difficulty: "Core",
    time: "40 min",
    desc: "Weigh the effects of globalisation on local cultures and reach a balanced conclusion.",
    prompt: "As the world becomes more connected, some people worry that local cultures and traditions are being lost. Others believe that global connection brings more benefits than harm. Discuss both views and give your own opinion. Write at least 250 words.",
    structure: ["Introduction — paraphrase both views and state your balanced opinion.", "Body 1 — the concern that local cultures are weakened.", "Body 2 — the benefits that global connection brings.", "Conclusion — restate your balanced position."],
    thesis: "A balanced-opinion essay still needs a clear stance, but a measured one. Present each view fairly, then give an opinion that acknowledges both sides while leaning in one direction. Avoid sitting perfectly on the fence with no view at all.",
    mistakes: ["Giving no opinion at all in the name of balance.", "Presenting both views but never weighing them.", "Treating globalisation as wholly good or wholly bad.", "Forgetting examples, so the argument stays abstract."],
    language: ["On the one hand, …", "Critics of globalisation contend that …", "On the other hand, supporters argue that …", "While I recognise these concerns, I believe …", "On balance, the picture is more positive than negative because …"],
    model: ["As countries become more closely connected through trade, travel and the internet, debate has grown over the effect on local cultures. Some fear that distinct traditions are being eroded, while others see global connection as overwhelmingly beneficial. In my view, although globalisation does pose real risks to local identity, its benefits are greater, provided traditions are actively protected.", "Those who are concerned have a legitimate point. As global brands, films and music spread, many places begin to look and sound alike, and younger generations may abandon local languages, dress and customs in favour of an international style. A traditional craft or dialect, once lost, can be almost impossible to recover, so the fear of cultural uniformity is understandable.", "On the other hand, global connection brings significant advantages. It spreads knowledge, technology and economic opportunity, lifting living standards and giving people access to ideas and goods that were once unavailable. Crucially, it can also help cultures rather than harm them: the internet allows minority languages and local artists to reach global audiences, and tourism can give communities a financial reason to preserve their heritage.", "Weighing these arguments, I believe the benefits outweigh the harms, but not automatically. Cultures are most likely to thrive when societies make a deliberate effort to teach traditions, support local arts and value their heritage alongside the global culture they enjoy.", "In conclusion, while globalisation can threaten local traditions, it also offers prosperity and new ways to share and sustain culture, and with conscious effort communities can benefit from connection without losing their identity."]
  },
  {
    id: "t2p-extent",
    task: "task2",
    type: "To what extent",
    title: "To what extent — Technology and communication",
    difficulty: "Core",
    time: "40 min",
    desc: "Judge how far technology has genuinely improved the way people communicate.",
    prompt: "Some people claim that modern technology has greatly improved the way people communicate with one another. To what extent do you agree or disagree? Write at least 250 words.",
    structure: ["Introduction — paraphrase the claim and state how far you agree.", "Body 1 — the ways technology has improved communication.", "Body 2 — the limitations or downsides you acknowledge.", "Conclusion — restate your overall judgement."],
    thesis: "\"To what extent\" asks how far you agree, so a measured stance works well. Make your degree of agreement explicit and consistent, and ensure each paragraph supports the position you have taken.",
    mistakes: ["Stating no clear degree of agreement.", "Listing technologies without evaluating their effect on communication.", "Switching from agreement to disagreement without signalling it.", "Relying on generalisations with no examples."],
    language: ["To a large extent, I agree that …", "Technology has undeniably …", "Nevertheless, this improvement is not without limits.", "It could be argued that …", "On the whole, therefore, I believe …"],
    model: ["It is often claimed that modern technology has transformed human communication for the better. To a large extent I agree, although I recognise that these changes have also brought some genuine drawbacks.", "Technology has clearly improved communication in important ways. Tools such as messaging apps, video calls and social media allow people to stay in contact instantly across any distance, at little or no cost. Families separated by migration can now see and speak to one another daily, and businesses can collaborate across continents in real time. Information that once took days to share now travels in seconds, which has made both personal relationships and professional work far more connected.", "Nevertheless, this improvement has limits. The same technology can make communication shallower: a quick message or emoji rarely carries the depth of a real conversation, and people sometimes interact with their screens while ignoring those physically present. The constant flood of messages can also cause stress, and the spread of misinformation online shows that easier communication is not always better communication. There is also evidence that excessive reliance on devices can weaken people's ability to hold longer, more thoughtful conversations face to face.", "Weighing these points, I believe the benefits clearly predominate. The ability to connect instantly across the world is a profound advantage, and the drawbacks stem largely from how people choose to use technology rather than from the tools themselves.", "In conclusion, I agree to a large extent that technology has improved communication, since it has made contact faster, cheaper and more far-reaching, even though it requires self-discipline to avoid its more superficial effects."]
  }
];
T2_TYPES.push.apply(T2_TYPES, T2_TYPES_PART1);

const CLINIC_PART1 = [
  {
    title: "Copied Task 1 introduction",
    problem: "The introduction repeats the task wording almost word for word, so it earns no credit for Lexical Resource and signals weak paraphrasing from the very first line.",
    weak: "The chart below shows the percentage of households with internet access in three countries between 2010 and 2020.",
    better: "The line graph illustrates the proportion of households that had internet access in three countries from 2010 to 2020.",
    tip: "Change the reporting verb, swap percentage for proportion, and re-order the time phrase. Keep the meaning identical.",
    practice: "Paraphrase: \"The bar chart shows the number of cars sold by three companies in 2019 and 2022.\"",
    suggested: "The bar chart compares how many cars three companies sold in 2019 and 2022."
  },
  {
    title: "Stronger Task 1 overviews",
    problem: "The overview lists details or numbers instead of stating the big picture, so the examiner cannot see that the writer has grasped the main trends.",
    weak: "Overall, sales were 200 in January, 350 in February and 410 in March, then they fell to 300.",
    better: "Overall, sales rose steadily over the first quarter to a peak in March, before falling back towards the end of the period.",
    tip: "An overview names directions and extremes, never specific figures. Save the numbers for the body paragraphs.",
    practice: "Write an overview for a graph where unemployment falls from 9% to 4% then rises slightly to 5%.",
    suggested: "Overall, unemployment declined substantially across the period, despite a small rise at the very end."
  },
  {
    title: "Selecting key features",
    problem: "Every minor fluctuation is described, so the response becomes a long, undifferentiated list and never highlights what actually matters.",
    weak: "The figure went up a bit, then down a bit, then up again, then stayed the same, then rose slightly, then dipped.",
    better: "After fluctuating around 40% in the first half of the period, the figure rose sharply to 65% by the end.",
    tip: "Group small movements together and report the overall pattern; only describe a change in detail if it is large or significant.",
    practice: "Summarise in one sentence: a value wobbles between 20 and 24 for years, then jumps to 50.",
    suggested: "Having held steady at around 22 for most of the period, the figure then surged to 50."
  },
  {
    title: "Comparative language in Task 1",
    problem: "Figures are reported one after another with no comparison, so the writing never demonstrates the comparative structures examiners look for.",
    weak: "Product A sold 500 units. Product B sold 250 units. Product C sold 100 units.",
    better: "Product A sold 500 units, twice as many as Product B and five times the figure for Product C.",
    tip: "Use comparative structures: twice as many as, far more than, slightly higher than, the same as.",
    practice: "Combine with comparison: \"Town X had 80,000 visitors. Town Y had 20,000 visitors.\"",
    suggested: "Town X attracted 80,000 visitors, four times as many as Town Y."
  },
  {
    title: "Trend vocabulary",
    problem: "The same basic verbs (go up, go down) are repeated, and adverbs of degree are missing, so the description of change is vague and imprecise.",
    weak: "Sales went up. Then they went up more. Then they went down.",
    better: "Sales rose gradually, then climbed sharply, before declining slightly towards the end.",
    tip: "Pair a verb of change with an adverb of degree: rose sharply, fell gradually, increased slightly, plummeted.",
    practice: "Improve: \"The number went down a lot and then went up a little.\"",
    suggested: "The number fell dramatically before recovering marginally."
  },
  {
    title: "Informal language in Task 2",
    problem: "Casual words and contractions make the essay sound conversational, which lowers the Lexical Resource score in an academic task.",
    weak: "Loads of kids these days are glued to their phones and it's a big problem, honestly.",
    better: "A large number of young people today spend excessive time on their phones, which is a significant concern.",
    tip: "Replace informal items: loads of becomes a large number of; kids becomes children; it's becomes it is.",
    practice: "Rewrite formally: \"Tons of people reckon the government should sort out traffic.\"",
    suggested: "Many people believe the government should address the problem of traffic."
  },
  {
    title: "Weak topic sentences",
    problem: "The paragraph opens with a detail or example instead of its main idea, so the reader cannot see the paragraph's purpose.",
    weak: "For example, my cousin studied online and passed her exams easily last year.",
    better: "One major advantage of online learning is its flexibility, which allows students to study around other commitments.",
    tip: "Begin each body paragraph with a clear topic sentence stating its single main idea; put the example afterwards.",
    practice: "Write a topic sentence for a paragraph arguing that public transport reduces pollution.",
    suggested: "A key benefit of public transport is that it significantly reduces air pollution in cities."
  },
  {
    title: "Underdeveloped body paragraphs",
    problem: "The point is stated but never developed, so the paragraph is too short and the idea is unsupported, capping Coherence and Task Response.",
    weak: "Exercise is good for health. People should exercise more. It is important.",
    better: "Regular exercise improves health by strengthening the heart and reducing stress. For instance, a daily walk has been shown to lower blood pressure, which in turn reduces the risk of serious illness later in life.",
    tip: "Develop each idea fully: explain why, give a specific example, and show the consequence before moving on.",
    practice: "Develop this into three sentences: \"Reading improves vocabulary.\"",
    suggested: "Reading widely improves vocabulary because it exposes people to new words in context. A student who reads novels regularly, for example, will encounter far more language than one who does not, and will gradually use these words naturally in their own writing."
  },
  {
    title: "Repetition and word choice",
    problem: "The same keyword is repeated in almost every sentence, which makes the writing monotonous and limits the Lexical Resource score.",
    weak: "Pollution is a big problem. Pollution harms health. To reduce pollution, we must act on pollution now.",
    better: "Pollution is a serious problem that harms public health. To reduce it, and limit this damage, governments must act now.",
    tip: "Use referencing words (it, this, such) and synonyms instead of repeating the same noun in every sentence.",
    practice: "Reduce the repetition: \"Technology is useful. Technology helps us. Technology is everywhere.\"",
    suggested: "Technology is extremely useful and now surrounds us, helping with almost every aspect of daily life."
  },
  {
    title: "Cohesion and linking",
    problem: "Sentences are accurate but disconnected, or linking words are overused and mechanical, so ideas do not flow smoothly.",
    weak: "Firstly, cars cause pollution. Secondly, cars cause traffic. Thirdly, cars are expensive. Fourthly, cars are noisy.",
    better: "Cars cause considerable pollution and, in busy cities, severe traffic. They are also expensive to run and add to noise levels.",
    tip: "Use a variety of linkers naturally and combine related ideas into fuller sentences, rather than starting every sentence with a numbered connective.",
    practice: "Join smoothly: \"Online shopping is convenient. Online shopping can be risky.\"",
    suggested: "Although online shopping is highly convenient, it can also be risky, for example when personal data is not properly protected."
  }
];
CLINIC.push.apply(CLINIC, CLINIC_PART1);



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
      var localAll = StorageService.read().users.filter(function (u) { return u.role === "student"; });
      var blocked = {}; localAll.forEach(function (u) { if (u.blocked) blocked[u.id] = 1; });
      var local = localAll.filter(function (u) { return !u.blocked; });
      if (authMode() !== "supabase") return local;
      var map = {};
      var cs = CloudService.cache.students || {};
      for (var id in cs) { if (!blocked[id]) map[id] = { id: id, name: cs[id].name, role: "student" }; }
      local.forEach(function (u) { if (!map[u.id]) map[u.id] = u; });
      return Object.keys(map).map(function (id) { return map[id]; }).sort(function (a, b) { return (a.name || "").localeCompare(b.name || ""); });
    },
    blockedStudents: function () {
      return StorageService.read().users
        .filter(function (u) { return u.role === "student" && u.blocked; })
        .sort(function (a, b) { return (a.name || "").localeCompare(b.name || ""); });
    },
    blockStudent: function (id) {
      StorageService.update(function (d) {
        var u = d.users.find(function (x) { return x.id === id; });
        if (u) { u.blocked = true; u.blockedAt = nowISO(); }
        else {
          var nm = ((CloudService.cache.students || {})[id] || {}).name || (CloudService.cache.roster || {})[id] || id;
          d.users.push({ id: id, name: nm, role: "student", blocked: true, blockedAt: nowISO(), createdAt: nowISO() });
        }
        if (d.session && d.session.userId === id) d.session = null;
      });
    },
    unblockStudent: function (id) {
      StorageService.update(function (d) {
        var u = d.users.find(function (x) { return x.id === id; });
        if (u) { u.blocked = false; delete u.blockedAt; }
      });
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
      if (existing && existing.blocked && role === "student") return { blocked: true };
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
  types: function () {
    var seen = {}, out = [];
    TaskService.all().forEach(function (t) {
      var k = canonTypeKey(t.type);
      if (k && !seen[k]) { seen[k] = 1; out.push(t.type); }
    });
    return out;
  },
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
  },
  /* True only when the cloud is configured — otherwise we stay fully offline. */
  aiAvailable: function () {
    var cfg = (typeof window !== "undefined" && window.MMWA_CONFIG) || {};
    return !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  },
  /* Shape guard: a remote payload must look like a diagnostic before we trust it. */
  validAI: function (ai) {
    return !!(ai && ai.criteria && ai.criteria.taskAchievement && typeof ai.estimatedBand === "number" &&
      Array.isArray(ai.strengths) && Array.isArray(ai.weaknesses) && ai.metrics);
  },
  /* POST to the Groq Edge Function. Resolves to a diagnostic object or null. */
  requestRemote: function (sub) {
    if (!this.aiAvailable()) return Promise.resolve(null);
    var cfg = window.MMWA_CONFIG;
    var url = String(cfg.supabaseUrl).replace(/\/+$/, "") + "/functions/v1/writing-feedback";
    var task = sub.task || TaskService.byId(sub.taskId) || {};
    var self = this;

    /* PRE-SCORING GATE (client-side, authoritative). The model is generous,
       so we decide non-attempt / band-cap here using the task prompt — which
       the model never sees in full — before and after the network call. */
    var AV = (typeof window !== "undefined" && window.AttemptValidator) || null;
    var minWords = TaskService.minWords(sub.kind);
    var gate = AV ? AV.analyzeAttempt(sub.text || "", task.prompt || "", minWords, sub.kind) : null;

    // Hard non-attempt: never bill the model — return a forced Band 0 locally.
    if (gate && gate.nonAttempt) {
      var zero = buildLocalDiagnostic(sub.text || "", sub.kind, task, sub.checklist || {}, sub.words);
      zero.source = "gate"; // not "groq": this is a rule-based decision
      return Promise.resolve(zero);
    }

    var ctrl = (typeof AbortController !== "undefined") ? new AbortController() : null;
    var to = ctrl ? setTimeout(function () { ctrl.abort(); }, 22000) : null;
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": cfg.supabaseAnonKey, "Authorization": "Bearer " + cfg.supabaseAnonKey },
      body: JSON.stringify({ text: sub.text || "", prompt: task.prompt || "", kind: sub.kind, taskType: sub.type || task.type || "", minWords: minWords }),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (ai) {
        if (to) clearTimeout(to);
        if (!self.validAI(ai)) return null;
        // Defense in depth: even a valid AI result is clamped to the gate cap.
        return (AV && gate) ? AV.applyGate(ai, gate, sub.kind) : ai;
      });
  },
  /* Fetch remote feedback and, if valid, overwrite the stored submission's .ai. */
  enhanceWithAI: function (submissionId) {
    var sub = SubmissionService.byId(submissionId);
    if (!sub) return Promise.resolve(null);
    return this.requestRemote(sub).then(function (ai) {
      if (!ai) return null;
      StorageService.update(function (db) {
        var rec = db.submissions.find(function (s) { return s.id === submissionId; });
        if (rec) rec.ai = ai;
      });
      var saved = StorageService.read().submissions.find(function (s) { return s.id === submissionId; });
      if (saved) CloudService.putSubmission(saved);
      return ai;
    });
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

/* Resolve the gatekeeper module whether we are in the browser or a test. */
function _attemptValidator() {
  if (typeof window !== "undefined" && window.AttemptValidator) return window.AttemptValidator;
  if (typeof AttemptValidator !== "undefined") return AttemptValidator;
  return null;
}

function buildLocalDiagnostic(text, kind, task, checklist, wordsArg) {
  var words = typeof wordsArg === "number" ? wordsArg : countWords(text);
  var minWords = TaskService.minWords(kind);

  /* PRE-SCORING GATE — runs before the heuristic scorer. A copied/repeated
     prompt or a non-attempt is forced to Band 0 (or capped) regardless of
     what the criterion heuristics would otherwise produce. */
  var _AV = _attemptValidator();
  var _gate = _AV ? _AV.analyzeAttempt(text, (task && task.prompt) || "", minWords, kind) : null;
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

  var diagnostic = {
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

  /* Apply the gate (forces Band 0 for a non-attempt, or clamps to a cap). */
  return (_AV && _gate) ? _AV.applyGate(diagnostic, _gate, kind) : diagnostic;
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
function canonTypeKey(s) { return String(s == null ? "" : s).trim().replace(/\s+/g, " ").toLowerCase(); }
function pdfName(parts) {
  var name = parts.map(function (p) { return String(p == null ? "" : p).replace(/[\\\/:*?"<>|]+/g, "").replace(/\s+/g, " ").trim(); })
    .filter(Boolean).join(" \u2014 ").slice(0, 120);
  return name || "IELTS with Mourad";
}
function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function fmtTime(sec) { var m = Math.floor(sec / 60), s = sec % 60; return m + ":" + (s < 10 ? "0" : "") + s; }

/* ==========================================================================
   NAVIGATION + ROLE GATING
   ========================================================================== */

var NAV = {
  student: [["dashboard", "Dashboard"], ["intro", "Introduction"], ["task1", "Task 1"], ["task2", "Task 2"], ["clinic", "Writing Clinic"], ["vocab", "Vocabulary Games"], ["paraphrase", "Task 1 Paraphrasing"], ["library", "Library"], ["reports", "Reports"]],
  teacher: [["dashboard", "Dashboard"], ["intro", "Introduction"], ["students", "Students"], ["assignments", "Assignments"], ["improvement", "Improvement Lab"], ["submissions", "Submissions"], ["vocab", "Vocabulary Games"], ["paraphrase", "Task 1 Paraphrasing"], ["library", "Library"], ["printcenter", "Print Center"], ["reports", "Reports"]]
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
  var teacherOnly = { students: 1, assignments: 1, improvement: 1, submissions: 1, detail: 1, printcenter: 1 };
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

  if (name === "dashboard") {
    role === "teacher" ? renderTeacherDash() : renderStudentDash();
    if (window.MMWA_TRAINING) {
      var _dv = el("view-dashboard");
      _dv.innerHTML += role === "teacher"
        ? window.MMWA_TRAINING.teacherCardsHTML(AuthService.students())
        : window.MMWA_TRAINING.studentSummaryHTML(AuthService.current());
    }
  }
  if (name === "task1") renderGallery("task1");
  if (name === "task2") renderGallery("task2");
  if (name === "clinic") renderClinic();
  if (name === "library") renderLibrary();
  if (name === "reports") renderReports();
  if (name === "students") renderStudents();
  if (name === "assignments") renderAssignments();
  if (name === "improvement") renderImprovementLab();
  if (name === "submissions") renderSubmissions();
  if (name === "printcenter") PrintCenter.render();
  if (name === "vocab" && window.MMWA_TRAINING) window.MMWA_TRAINING.renderVocab(el("view-vocab"), AuthService.current());
  if (name === "paraphrase" && window.MMWA_TRAINING) window.MMWA_TRAINING.renderParaphrase(el("view-paraphrase"), AuthService.current());
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

/* Introduction · printable A4 student handout (same pattern as report/cert) */
function printIntroHandout() {
  document.body.classList.add("printing-intro");
  el("introPrint").setAttribute("aria-hidden", "false");
  window.print();
  setTimeout(function () { document.body.classList.remove("printing-intro"); el("introPrint").setAttribute("aria-hidden", "true"); }, 300);
}
on(el("introPrintBtn"), "click", printIntroHandout);

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
    on(el("authStudentBtn"), "click", function () { var n = el("authName").value.trim(); if (!n) { authMsg("Please enter a display name to continue.", true); return; } var res = AuthService.signIn(n, "student"); if (res && res.blocked) { authMsg("This student account has been removed by your teacher. Ask them to restore it if this is a mistake.", true); return; } boot(); });
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

function buildStructureFrames(task, t1, minWords) {
  var frames = t1
    ? [
        { n: "1", h: "Introduction", b: "Paraphrase the task statement in your own words. <strong>Do not</strong> copy the prompt word for word." },
        { n: "2", h: "Overview", b: "Summarise the main stages or features in one or two sentences. Keep it general — <strong>no</strong> detailed figures here." },
        { n: "3", h: "Body paragraphs", b: "Group related data or stages logically and report the key details, with comparisons where relevant." }
      ]
    : [
        { n: "1", h: "Introduction", b: "Paraphrase the topic in your own words and state your position clearly. <strong>Do not</strong> copy the prompt." },
        { n: "2", h: "Body paragraphs", b: "One clear idea per paragraph, each explained and supported with an example." },
        { n: "3", h: "Conclusion", b: "Restate your position in fresh words. Add no new ideas." }
      ];
  var instruction = t1
    ? "Write your complete Task 1 response in the main essay box below, including the introduction, overview, and body paragraphs. The planning frames are there to help you think, but your final answer must be written as one complete essay."
    : "Write your complete Task 2 response in the main essay box below, including the introduction, body paragraphs, and conclusion. The planning frames are there to help you think, but your final answer must be written as one complete essay.";
  return '<section class="struct-frames" aria-label="How to structure your answer">' +
    '<h3 class="struct-title">How to structure your answer</h3>' +
    '<ol class="struct-list">' +
      frames.map(function (f) {
        return '<li class="struct-frame">' +
          '<span class="struct-step">' + f.n + '</span>' +
          '<div class="struct-body"><h4>' + f.h + '</h4><p>' + f.b + '</p></div></li>';
      }).join("") +
      '<li class="struct-frame struct-frame-essay">' +
        '<span class="struct-step struct-step-essay">&#9733;</span>' +
        '<div class="struct-body"><h4>Full essay</h4><p>' + esc(instruction) + '</p></div></li>' +
    '</ol>' +
  '</section>';
}

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

    '<div class="studio-grid">' +
      // ---- LEFT: sticky task reference (prompt + chart) ----
      '<aside class="studio-task">' +
        '<article class="panel paper-panel studio-task-panel">' +
          '<h3 class="panel-label">The task</h3>' +
          '<p class="ws-prompt">' + esc(task.prompt) + '</p>' + image +
        '</article>' +
      '</aside>' +

      // ---- RIGHT: structure guidance + writing space ----
      '<div class="studio-write">' +
        buildStructureFrames(task, t1, minWords) +
        planning +
        '<article class="panel paper-panel ws-writing">' +
          '<div class="ws-writing-head"><h3 class="panel-label">Your full ' + (t1 ? "report" : "essay") + '</h3>' +
            '<span class="ws-write-meta"><span class="wordcount" id="wsWordCount">0 words</span><span class="ws-savestatus" id="wsSaveStatus" aria-live="polite"></span></span></div>' +
          '<p class="ws-write-guide">Write your complete answer here — at least <strong>' + minWords + ' words</strong>' + (t1 ? ', including the introduction, overview and body paragraphs as one essay.' : ', including the introduction, body paragraphs and conclusion as one essay.') + '</p>' +
          '<textarea id="wsWriting" class="ws-textarea" rows="' + (t1 ? 18 : 20) + '" placeholder="Write at least ' + minWords + ' words." ' + (locked ? "readonly" : "") + '>' + esc((draft && draft.draft) || (existing && existing.text) || "") + '</textarea></article>' +

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
    '</div>' +

    // ---- BELOW (full width): coaching aids + checklist ----
    '<section class="studio-aids">' +
      '<div class="side-flow" aria-hidden="true">' + (t1 ? "Learn → Analyse → Plan → Write → Check → Compare" : "Understand → Plan → Write → Check → Improve") + '</div>' +
      '<div class="studio-aids-grid">' +
        '<div id="wsHelpers">' + buildHelpers(task) + '</div>' +
        '<div class="panel glass-panel"><button class="acc-head" data-acc aria-expanded="false">Check — IELTS checklist <span class="acc-chev" aria-hidden="true"></span></button><div class="acc-body"><ul class="checklist" id="wsChecklist">' + checklistHTML(task, user.id) + '</ul></div></div>' +
      '</div>' +
    '</section>';

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
    if (existing && existing.ai) renderFeedbackThenEnhance(el("wsFeedback"), existing);
    bindStaticWorkspaceButtons(task, mode, user, locked);
    return;
  }

  // autosave draft
  function saveDraft() {
    var patch = { draft: el("wsWriting").value };
    if (t1) { if (el("wsPlan")) patch.plan = el("wsPlan").value; }
    else { patch.thesis = el("wsThesis").value; patch.body1 = el("wsBody1").value; patch.body2 = el("wsBody2").value; }
    SubmissionService.patchDraft(user.id, task.id, patch);
    var st = el("wsSaveStatus");
    if (st) {
      var d = new Date();
      st.textContent = "Saved " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      st.classList.add("is-saved");
    }
  }
  var pending;
  function flagSaving() { var st = el("wsSaveStatus"); if (st) { st.textContent = "Saving…"; st.classList.remove("is-saved"); } }
  on(el("wsWriting"), "input", function () { updateWC(); flagSaving(); clearTimeout(pending); pending = setTimeout(saveDraft, 400); });
  ["wsPlan", "wsThesis", "wsBody1", "wsBody2"].forEach(function (id) {
    var node = el(id); if (node) on(node, "input", function () { flagSaving(); clearTimeout(pending); pending = setTimeout(saveDraft, 400); });
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
      renderFeedbackThenEnhance(el("wsFeedback"), sub);
      el("wsWriting").readOnly = true;
      this.remove();
      scrollToEl(el("wsFeedback"));
    } else {
      var sub2 = SubmissionService.submitPractice(user.id, task.id, payload);
      renderFeedbackThenEnhance(el("wsFeedback"), sub2);
      scrollToEl(el("wsFeedback"));
    }
  });

  on(el("btnPrintWs"), "click", function () {
    var text = el("wsWriting").value;
    ReportService.printSubmissionLike({
      student: user.name, task: task, mode: mode, text: text,
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
function markAIPending(container) {
  if (!container || !FeedbackService.aiAvailable()) return;
  clearAIPending(container);
  var n = document.createElement("p");
  n.id = "fbAiPending";
  n.style.cssText = "margin-top:.75rem;font-size:.85rem;opacity:.7";
  n.textContent = "Requesting AI examiner feedback…";
  container.appendChild(n);
}
function clearAIPending(container) {
  var n = container && container.querySelector("#fbAiPending");
  if (n) n.remove();
}
/* Render local feedback now, then upgrade in place if the AI call succeeds. */
function renderFeedbackThenEnhance(container, submission) {
  renderFeedback(container, submission.ai);
  if (!container || !FeedbackService.aiAvailable()) return;
  // Already decided by Groq or the rule-based gate — don't re-bill the model.
  if (submission.ai && (submission.ai.source === "groq" || submission.ai.source === "gate")) return;
  markAIPending(container);
  FeedbackService.enhanceWithAI(submission.id).then(function (ai) {
    if (!container) return;
    if (ai) renderFeedback(container, ai);
    else clearAIPending(container);
  });
}
function gateTeacherBlock(g) {
  if (!g) return "";
  return '<div class="fb-block fb-gate-teacher" style="border:1px solid var(--line,#d9d2c4);border-radius:10px;padding:12px 14px;margin-top:10px;background:rgba(0,0,0,.02)">' +
    '<h4 style="margin:0 0 6px">Teacher / admin — attempt analysis</h4>' +
    '<table class="fb-gate-table" style="width:100%;border-collapse:collapse;font-size:.92em">' +
    '<tr><td style="padding:2px 8px 2px 0;opacity:.75">Total submitted words</td><td style="text-align:right;font-weight:600">' + g.submittedWords + '</td></tr>' +
    '<tr><td style="padding:2px 8px 2px 0;opacity:.75">Estimated copied prompt words</td><td style="text-align:right;font-weight:600">' + g.copiedWords + ' (' + g.copiedPct + '%)</td></tr>' +
    '<tr><td style="padding:2px 8px 2px 0;opacity:.75">Estimated original words</td><td style="text-align:right;font-weight:600">' + g.originalWords + '</td></tr>' +
    '<tr><td style="padding:2px 8px 2px 0;opacity:.75">Repetition</td><td style="text-align:right;font-weight:600">' + g.repetitionPct + '%</td></tr>' +
    '<tr><td style="padding:2px 8px 2px 0;opacity:.75">Final scoring decision</td><td style="text-align:right;font-weight:600">' + esc(g.decision) + '</td></tr>' +
    '</table>' +
    '<p style="margin:8px 0 0;font-size:.9em;opacity:.85"><strong>Reason:</strong> ' + esc((g.reasons || []).join(" ")) + '</p>' +
    '</div>';
}

function renderFeedback(container, fb) {
  if (!container) return;
  var c = fb.criteria;

  // Visible warning banner for any gated decision (non-attempt or band cap).
  var banner = "";
  if (fb.nonAttempt) {
    banner = '<div class="fb-warning" role="alert" style="display:flex;gap:10px;align-items:flex-start;border:1px solid #c0392b;background:#fdecea;color:#7b241c;border-radius:10px;padding:12px 14px;margin-bottom:14px;font-weight:600">' +
      '<span aria-hidden="true">\u26A0\uFE0F</span><span>Non-attempt detected: copied / repeated prompt text. Copied prompt words are not counted in IELTS Writing.</span></div>';
  } else if (fb.bandCap != null) {
    banner = '<div class="fb-warning" role="alert" style="display:flex;gap:10px;align-items:flex-start;border:1px solid #b9770e;background:#fef5e7;color:#7e5109;border-radius:10px;padding:12px 14px;margin-bottom:14px;font-weight:600">' +
      '<span aria-hidden="true">\u26A0\uFE0F</span><span>Score capped at Band ' + fb.bandCap + '. ' + esc((fb.gate && fb.gate.reasons && fb.gate.reasons[0]) || "Limited original content.") + '</span></div>';
  }

  // Non-attempt: a focused report, not normal essay feedback.
  if (fb.nonAttempt) {
    container.innerHTML =
      '<article class="panel feedback-panel">' +
        banner +
        '<div class="fb-head"><div><span class="fb-tag">Response not assessable</span>' +
        '<h3 class="fb-title">Overall band <strong>0.0</strong></h3></div>' +
        '<p class="fb-disclaimer">' + esc(fb.label || "Automated check") + '. Your teacher\'s review is the authoritative score.</p></div>' +
        '<div class="crit-row">' + [c.taskAchievement, c.coherenceCohesion, c.lexicalResource, c.grammaticalRange].map(bandChip).join("") + '</div>' +
        '<div class="fb-block fb-bad"><h4>Why this cannot be scored</h4><ul>' +
          (fb.weaknesses || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ul></div>' +
        '<div class="fb-block fb-next"><h4>What to do next</h4><p>' + esc(fb.nextRecommendation || "") + '</p></div>' +
        gateTeacherBlock(fb.gate) +
        '<details class="fb-meta"><summary>Diagnostic detail</summary><p>' + esc(fb.studentSummary || "") + '</p>' +
          '<p class="fb-teacher"><strong>Teacher view:</strong> ' + esc(fb.teacherSummary || "") + '</p></details>' +
      '</article>';
    return;
  }

  container.innerHTML =
    '<article class="panel feedback-panel">' +
      banner +
      '<div class="fb-head"><div><span class="fb-tag">' + (fb.source === "groq" ? "AI examiner feedback" : "Preliminary Writing Diagnostic") + '</span><h3 class="fb-title">Estimated band <strong>' + fb.estimatedBand.toFixed(1) + '</strong></h3></div>' +
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
      (fb.gate ? gateTeacherBlock(fb.gate) : "") +
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
    if (fType && canonTypeKey(t.type) !== canonTypeKey(fType)) return false;
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
        '<button class="btn btn-ghost btn-sm" data-del-student="' + s.id + '">Remove</button>' +
      '</td></tr>';
  }).join("");
  var removed = AuthService.blockedStudents();
  var removedHTML = removed.length
    ? '<div class="removed-students" style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid rgba(201,169,97,.25)">' +
        '<p class="removed-h" style="margin:0 0 .5rem;font-size:.85rem;letter-spacing:.04em;text-transform:uppercase;opacity:.7">Removed students (' + removed.length + ')</p>' +
        removed.map(function (s) {
          return '<div class="removed-row" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.35rem 0">' +
            '<span style="opacity:.75">' + esc(s.name) + '</span>' +
            '<button class="btn btn-ghost btn-sm" data-restore-student="' + s.id + '">Restore</button>' +
          '</div>';
        }).join("") +
      '</div>'
    : "";
  var tableHTML = students.length
    ? '<div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th class="num">Done</th><th class="num">T1 avg</th><th class="num">T2 avg</th><th>Weakest criterion</th><th>Exam access</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
    : '<p class="empty-note">No students yet. Students appear here automatically when they sign in, or add a sample one below.</p>';
  el("view-students").querySelector(".students-body").innerHTML = tableHTML + removedHTML;
}
document.addEventListener("click", function (e) {
  var del = e.target.closest("[data-del-student]");
  if (del) {
    var dn = (AuthService.byId(del.dataset.delStudent) || {}).name || "this student";
    if (confirm("Remove " + dn + " from your class?\n\nTheir work is kept but hidden from the roster, and they will not be able to sign back in until you restore them.")) {
      AuthService.blockStudent(del.dataset.delStudent);
      renderStudents();
    }
    return;
  }
  var rst = e.target.closest("[data-restore-student]");
  if (rst) { AuthService.unblockStudent(rst.dataset.restoreStudent); renderStudents(); return; }
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

  renderFeedbackThenEnhance(el("detailFeedback"), s);

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
    ReportService.printSubmissionLike({ student: who, task: task, mode: s.mode, text: s.text, words: s.words, time: s.timeSpent ? fmtTime(s.timeSpent) : "—", checklist: s.checklist, ai: s.ai, review: isNaN(review.finalBand) ? null : review, reportType: "teacher" });
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
  ReportService.printSubmissionLike({ student: who, task: task, mode: s.mode, text: s.text, words: s.words, time: s.timeSpent ? fmtTime(s.timeSpent) : "—", checklist: s.checklist, ai: s.ai, review: (s.review && s.review.reviewed) ? s.review : null, comments: el("repComments").value, reportType: type });
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

    // The task: full prompt + chart/diagram (chart only for Task 1)
    el("prPrompt").textContent = o.task.prompt || "";
    var fig = el("prFigure"), img = el("prImage");
    if (t1 && o.task.img) {
      img.src = o.task.img; img.alt = o.task.alt || ""; fig.style.display = "";
    } else {
      img.removeAttribute("src"); fig.style.display = "none";
    }

    // Student's full response
    el("prEssay").textContent = (o.text != null ? o.text : "") || "(No response was written.)";

    // Corrected sample — before/after sentence rewrites from the diagnostic
    var corr = (ai.sentenceCorrections || []);
    el("prCorrected").innerHTML = corr.length
      ? corr.map(function (c) {
          return '<div class="pr-corr-pair"><p class="pr-corr-from">' + esc(c.original) + '</p>' +
            '<p class="pr-corr-to">&rarr; ' + esc(c.improved) + '</p>' +
            (c.reason ? '<p class="pr-corr-why">' + esc(c.reason) + '</p>' : "") + '</div>';
        }).join("")
      : '<p class="pr-comments">No sentence-level corrections were flagged — focus on the action steps below.</p>';
    el("prCorrectedSection").style.display = (o.reportType === "parent") ? "none" : "";

    // Action steps — concrete next moves drawn from the diagnostic
    var actions = [];
    var nextStep = (rv && rv.nextTarget) ? rv.nextTarget : ai.nextRecommendation;
    if (nextStep) actions.push(nextStep);
    (ai.grammarUpgrades || []).forEach(function (g) { if (actions.length < 5) actions.push(g); });
    (ai.weaknesses || []).forEach(function (w) { if (actions.length < 6) actions.push("Work on: " + w); });
    el("prActions").innerHTML = actions.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("");

    var comments = (rv && rv.comments) || o.comments || "";
    el("prComments").textContent = comments || "—";
    el("prCorr").textContent = (rv && rv.correctionNotes) ? rv.correctionNotes : "—";
    el("prCorrRow").style.display = (rv && rv.correctionNotes) ? "" : "none";

    // parent-friendly: hide error detail + correction
    var parent = o.reportType === "parent";
    el("prErrorsSection").style.display = parent ? "none" : "";

    document.body.classList.add("printing-report");
    el("printReport").setAttribute("aria-hidden", "false");
    var _prevTitle = document.title;
    document.title = pdfName([o.student, "Task " + (t1 ? "1" : "2") + " " + o.task.type, (titleMap[o.reportType] || "Writing Report"), "IELTS with Mourad"]);
    window.print();
    setTimeout(function () { document.body.classList.remove("printing-report"); el("printReport").setAttribute("aria-hidden", "true"); document.title = _prevTitle; }, 300);
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
  var _prevCertTitle = document.title;
  document.title = pdfName([user.name, "Certificate of Completion", "IELTS with Mourad"]);
  window.print();
  setTimeout(function () { document.body.classList.remove("printing-cert"); el("certificate").setAttribute("aria-hidden", "true"); document.title = _prevCertTitle; }, 300);
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

/* ==========================================================================
   PRINT & PDF RESOURCE CENTER  (teacher/admin)
   --------------------------------------------------------------------------
   A scalable, branded A4 print/booklet system. It introspects the platform's
   real resources (Task 1 lessons, Task 2 guides, vocabulary banks, paraphrasing
   practice, the writing clinic, and the shared writing guides) into a registry,
   then renders single resources, multi-resource booklets, a cover page and a
   table of contents — all honouring teacher-chosen options. Reusable pieces:
     getPrintableResources(), renderPrintResource(), renderPrintCoverPage(),
     renderTableOfContents(), renderPrintBooklet(), openPrintPreview(),
     printSelectedResources().
   Nothing here touches student tools, AI feedback, games, reports or progress.
   ========================================================================== */
var PrintCenter = (function () {
  var _sel = {};          // selected resource ids
  var _q = "";            // search text
  var _cat = "";          // category filter
  var _registry = null;   // built lazily
  var _opts = {
    cover: true, toc: true, answerKeys: false, modelAnswers: true,
    teacherNotes: true, practiceBoxes: true, compact: false, bw: false, nameFields: true,
    coverTitle: "IELTS Academic Writing — Resource Booklet", coverSubtitle: "Selected practice & reference materials",
    student: "", klass: "", date: ""
  };

  /* ---------- small render helpers (booklet body fragments) ---------- */
  function bkList(label, arr) {
    if (!arr || !arr.length) return "";
    return '<div class="bk-block avoid-break"><h3 class="bk-h">' + esc(label) + '</h3><ul class="bk-ul">' +
      arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
  }
  function bkChips(label, arr) {
    if (!arr || !arr.length) return "";
    return '<div class="bk-block avoid-break"><h3 class="bk-h">' + esc(label) + '</h3><p class="bk-chips">' +
      arr.map(function (x) { return '<span class="bk-chip">' + esc(x) + "</span>"; }).join("") + "</p></div>";
  }
  function bkNote(label, html) {
    if (!html) return "";
    return '<div class="bk-note avoid-break"><span class="bk-note-label">' + esc(label) + "</span>" + html + "</div>";
  }
  function bkSection(title, rawHtml) {
    return '<div class="bk-block avoid-break"><h3 class="bk-h">' + esc(title) + "</h3>" + rawHtml + "</div>";
  }
  function bkPractice(label, minWords) {
    var lines = "";
    for (var i = 0; i < 12; i++) lines += '<span class="bk-line"></span>';
    return '<div class="bk-practice"><h3 class="bk-h">' + esc(label) + ' <span class="bk-target">(write at least ' + minWords + ' words)</span></h3>' +
      '<div class="bk-lines">' + lines + "</div></div>";
  }
  function bkModel(label, paras) {
    if (!paras || !paras.length) return "";
    return '<div class="bk-model avoid-break"><h3 class="bk-h">' + esc(label) + "</h3>" +
      paras.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
  }
  function bkAnswer(label, html) {
    return '<div class="bk-answer avoid-break"><span class="bk-answer-label">' + esc(label) + "</span>" + html + "</div>";
  }
  function bkNameRow(o) {
    return '<div class="bk-namerow">' +
      '<span>Name: <b>' + (o.student ? esc(o.student) : "") + "</b></span>" +
      '<span>Class: <b>' + (o.klass ? esc(o.klass) : "") + "</b></span>" +
      '<span>Date: <b>' + (o.date ? esc(o.date) : "") + "</b></span></div>";
  }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function firstText() { for (var i = 0; i < arguments.length; i++) { if (typeof arguments[i] === "string" && arguments[i]) return arguments[i]; } return ""; }

  /* ---------- registry ---------- */
  function getPrintableResources() {
    if (_registry) return _registry;
    var R = [];

    // Task 1 lessons (one per mission) — prompt, chart, guidance, vocab, practice, model
    arr(typeof MISSIONS !== "undefined" && MISSIONS).forEach(function (m) {
      R.push({
        id: "t1-" + m.id, title: m.title, category: "Task 1", type: "Lesson + Practice", level: m.difficulty || "",
        includes: { worksheet: true, answerKey: false, modelAnswer: !!(m.model && m.model.length), teacherNotes: !!(m.learn), chart: !!m.img, vocab: !!(m.vocab && m.vocab.length) },
        pages: 2,
        render: function (o) {
          var h = '<p class="bk-prompt">' + esc(m.prompt) + "</p>";
          if (m.img) h += '<figure class="bk-figure avoid-break"><img class="bk-img" src="' + m.img + '" alt="' + esc(m.alt || "") + '"></figure>';
          if (o.teacherNotes) h += bkNote("What to know", esc(m.learn || "") + (m.tip ? " <em>" + esc(m.tip) + "</em>" : ""));
          h += bkList("Key features to notice", m.analyse);
          h += bkList("Suggested structure", m.plan);
          h += bkChips("Useful vocabulary", m.vocab);
          if (o.practiceBoxes) h += bkPractice("Your report", 150);
          if (o.modelAnswers) h += bkModel("Model answer", m.model);
          return h;
        }
      });
    });

    // Task 1 writing guide (shared helpers)
    if (typeof T1_SHARED_HELPERS !== "undefined" && T1_SHARED_HELPERS.length) {
      R.push({
        id: "guide-t1", title: "Task 1 — Writing Guide", category: "Guides", type: "Reference", level: "All bands",
        includes: { worksheet: false, answerKey: false, modelAnswer: false, teacherNotes: true, chart: false, vocab: false },
        pages: 2,
        render: function () { return T1_SHARED_HELPERS.map(function (x) { return bkSection(x.title, x.html); }).join(""); }
      });
    }

    // Task 2 essay guides (one per type)
    arr(typeof T2_TYPES !== "undefined" && T2_TYPES).forEach(function (t) {
      R.push({
        id: "t2-" + t.id, title: t.title || t.type, category: "Task 2", type: "Essay Guide + Practice", level: t.difficulty || "",
        includes: { worksheet: true, answerKey: false, modelAnswer: !!(t.model && t.model.length), teacherNotes: !!(t.thesis || (t.mistakes && t.mistakes.length)), chart: false, vocab: !!(t.language && t.language.length) },
        pages: 2,
        render: function (o) {
          var h = '<p class="bk-prompt">' + esc(t.prompt) + "</p>";
          h += bkList("Structure", t.structure);
          if (o.teacherNotes) h += bkNote("Thesis guidance", esc(t.thesis || ""));
          if (o.teacherNotes) h += bkList("Common mistakes for this type", t.mistakes);
          h += bkChips("Useful academic language", t.language);
          if (o.practiceBoxes) h += bkPractice("Your essay", 250);
          if (o.modelAnswers) h += bkModel("Model essay", t.model);
          return h;
        }
      });
    });

    // Task 2 writing guide (shared helpers)
    if (typeof T2_SHARED_HELPERS !== "undefined" && T2_SHARED_HELPERS.length) {
      R.push({
        id: "guide-t2", title: "Task 2 — Writing Guide", category: "Guides", type: "Reference", level: "All bands",
        includes: { worksheet: false, answerKey: false, modelAnswer: false, teacherNotes: true, chart: false, vocab: false },
        pages: 2,
        render: function () { return T2_SHARED_HELPERS.map(function (x) { return bkSection(x.title, x.html); }).join(""); }
      });
    }

    // Vocabulary banks (from the games word banks)
    var V = (typeof window !== "undefined" && window.MMWA_VOCAB) || {};
    function vocabResource(id, title, items) {
      if (!items || !items.length) return;
      R.push({
        id: id, title: title, category: "Vocabulary", type: "Word List", level: "Band 6–8",
        includes: { worksheet: true, answerKey: true, modelAnswer: false, teacherNotes: false, chart: false, vocab: true },
        pages: Math.max(1, Math.ceil(items.length / 22)),
        render: function (o) {
          var rows = items.map(function (it) {
            var ans = o.answerKeys ? esc(it.answer || "") : '<span class="bk-blank"></span>';
            var note = (o.answerKeys && it.explanation) ? esc(it.explanation) : "";
            return "<tr><td>" + esc(it.word || "") + "</td><td>" + ans + "</td><td>" + note + "</td></tr>";
          }).join("");
          return '<table class="bk-table"><thead><tr><th>Word</th><th>' + (o.answerKeys ? "Best answer" : "Your answer") + "</th><th>Note</th></tr></thead><tbody>" + rows + "</tbody></table>";
        }
      });
    }
    vocabResource("vocab-synonyms", "Synonyms & Opposites — Word List", V.synonym);
    vocabResource("vocab-spelling", "Academic Spelling — Word List", V.spelling);
    vocabResource("vocab-upgrade", "Academic Upgrades — Word List", V.upgrade);

    // Task 1 paraphrasing practice
    var P = (typeof window !== "undefined" && window.MMWA_PARA) || {};
    function paraResource(id, title, items) {
      if (!items || !items.length) return;
      R.push({
        id: id, title: title, category: "Paraphrasing", type: "Practice Set", level: "Band 6–8",
        includes: { worksheet: true, answerKey: true, modelAnswer: true, teacherNotes: false, chart: false, vocab: false },
        pages: Math.max(1, Math.ceil(items.length / 4)),
        render: function (o) {
          return items.map(function (it, i) {
            var src = firstText(it.originalPrompt, it.prompt, it.weakParaphrase);
            var model = firstText(it.modelAnswer, it.model, it.answer, it.modelSentence);
            var h = '<div class="bk-qitem avoid-break"><p class="bk-qnum">' + (i + 1) + ". " + esc(src) + "</p>";
            if (o.practiceBoxes) h += '<div class="bk-lines"><span class="bk-line"></span><span class="bk-line"></span></div>';
            if (o.answerKeys && model) h += bkAnswer("Model answer", "<p>" + esc(model) + "</p>");
            return h + "</div>";
          }).join("");
        }
      });
    }
    paraResource("para-write", "Paraphrasing — Write your own", P.write);
    paraResource("para-fix", "Paraphrasing — Fix the weak version", P.fix);
    paraResource("para-build", "Paraphrasing — Build the sentence", P.build);

    // Writing clinic correction pack
    var C = (typeof CLINIC !== "undefined" && CLINIC) || [];
    if (C.length) {
      R.push({
        id: "clinic-pack", title: "Writing Clinic — Correction Pack", category: "Writing Clinic", type: "Correction & Practice", level: "All bands",
        includes: { worksheet: true, answerKey: true, modelAnswer: true, teacherNotes: true, chart: false, vocab: false },
        pages: Math.max(2, Math.ceil(C.length / 2)),
        render: function (o) {
          return C.map(function (c, i) {
            var h = '<div class="bk-qitem avoid-break"><p class="bk-qnum">' + (i + 1) + ". " + esc(c.title) + "</p>";
            if (o.teacherNotes && c.problem) h += '<p class="bk-clinic-problem">' + esc(c.problem) + "</p>";
            if (c.weak) h += '<p class="bk-weak"><span class="bk-tag bk-tag-bad">Weak</span> ' + esc(c.weak) + "</p>";
            if (o.modelAnswers && c.better) h += '<p class="bk-better"><span class="bk-tag bk-tag-good">Better</span> ' + esc(c.better) + "</p>";
            if (o.teacherNotes && c.tip) h += '<p class="bk-tip">' + esc(c.tip) + "</p>";
            if (c.practice) { h += '<p class="bk-task"><b>Your turn:</b> ' + esc(c.practice) + "</p>"; if (o.practiceBoxes) h += '<div class="bk-lines"><span class="bk-line"></span><span class="bk-line"></span></div>'; }
            if (o.answerKeys && c.suggested) h += bkAnswer("Suggested answer", "<p>" + esc(c.suggested) + "</p>");
            return h + "</div>";
          }).join("");
        }
      });
    }

    _registry = R;
    return R;
  }

  function byId(id) { return getPrintableResources().filter(function (r) { return r.id === id; })[0] || null; }
  function categories() {
    var seen = {}, out = [];
    getPrintableResources().forEach(function (r) { if (!seen[r.category]) { seen[r.category] = 1; out.push(r.category); } });
    return out;
  }

  /* ---------- print pages ---------- */
  function renderPrintCoverPage(o) {
    return '<section class="bk-page bk-cover">' +
      '<div class="bk-cover-frame">' +
        '<p class="bk-cover-kicker">IELTS with Mourad — Academic Writing</p>' +
        '<div class="bk-cover-mid">' +
          '<h1 class="bk-cover-title">' + esc(o.coverTitle || "Resource Booklet") + "</h1>" +
          (o.coverSubtitle ? '<p class="bk-cover-subtitle">' + esc(o.coverSubtitle) + "</p>" : "") +
          '<div class="bk-cover-rule"></div>' +
        "</div>" +
        '<div class="bk-cover-meta">' +
          "<div><span>Teacher</span><b>Mourad Mekki</b></div>" +
          "<div><span>Student</span><b>" + (o.student ? esc(o.student) : "&nbsp;") + "</b></div>" +
          "<div><span>Class / Group</span><b>" + (o.klass ? esc(o.klass) : "&nbsp;") + "</b></div>" +
          "<div><span>Date</span><b>" + (o.date ? esc(o.date) : todayLong()) + "</b></div>" +
        "</div>" +
        '<p class="bk-cover-foot">Academic Writing · Premium Coaching Material</p>' +
      "</div></section>";
  }

  function renderTableOfContents(resources, o) {
    var start = 1 + (o.cover ? 1 : 0) + 1; // pages after cover + toc
    var groups = {}, order = [];
    resources.forEach(function (r) { if (!groups[r.category]) { groups[r.category] = []; order.push(r.category); } groups[r.category].push(r); });
    var page = start, body = "";
    order.forEach(function (cat) {
      body += '<li class="bk-toc-cat">' + esc(cat) + "</li>";
      groups[cat].forEach(function (r) {
        body += '<li class="bk-toc-item"><span class="bk-toc-t">' + esc(r.title) + '</span><span class="bk-toc-dots"></span><span class="bk-toc-p">p. ' + page + "</span></li>";
        page += Math.max(1, r.pages || 1);
      });
    });
    return '<section class="bk-page bk-toc"><header class="bk-head"><div class="bk-head-l"><span class="bk-cat">Contents</span>' +
      '<h2 class="bk-title">' + esc(o.coverTitle || "Resource Booklet") + "</h2></div>" +
      '<div class="bk-head-r"><span class="bk-brand-mini">IELTS <em>with</em> MOURAD</span></div></header>' +
      '<ol class="bk-toc-list">' + body + "</ol></section>";
  }

  function renderSectionDivider(cat) {
    return '<section class="bk-page bk-divider"><div class="bk-divider-inner"><span class="bk-cover-kicker">IELTS with Mourad — Academic Writing</span>' +
      '<h2 class="bk-divider-title">' + esc(cat) + '</h2><div class="bk-cover-rule"></div></div></section>';
  }

  function renderPrintResource(r, o) {
    return '<section class="bk-page bk-resource">' +
      '<header class="bk-head">' +
        '<div class="bk-head-l"><span class="bk-cat">' + esc(r.category) + "</span>" +
          '<h2 class="bk-title">' + esc(r.title) + "</h2>" +
          '<p class="bk-sub">' + esc(r.type) + (r.level ? " · " + esc(r.level) : "") + "</p></div>" +
        '<div class="bk-head-r"><span class="bk-brand-mini">IELTS <em>with</em> MOURAD</span><span class="bk-brand-sub">Academic Writing</span></div>' +
      "</header>" +
      (o.nameFields ? bkNameRow(o) : "") +
      '<div class="bk-body">' + r.render(o) + "</div></section>";
  }

  function renderPrintBooklet(resources, o) {
    var pages = "";
    var multi = resources.length > 1;
    if (o.cover && multi) pages += renderPrintCoverPage(o);
    if (o.toc && multi) pages += renderTableOfContents(resources, o);
    var lastCat = null;
    resources.forEach(function (r) {
      if (o.cover && multi && r.category !== lastCat && categories().length > 1) { pages += renderSectionDivider(r.category); lastCat = r.category; }
      pages += renderPrintResource(r, o);
    });
    var rootCls = "bk-root" + (o.compact ? " bk-compact" : "") + (o.bw ? " bk-bw" : "");
    return '<div class="' + rootCls + '">' + pages + '<div class="bk-runningfoot">IELTS with Mourad — Academic Writing · Instructor: Mourad Mekki</div></div>';
  }

  /* ---------- option + selection state ---------- */
  function readOptions() {
    function chk(id) { var n = el(id); return n ? n.checked : _opts[id]; }
    return {
      cover: chk("pcCover"), toc: chk("pcToc"), answerKeys: chk("pcAnswers"), modelAnswers: chk("pcModels"),
      teacherNotes: chk("pcNotes"), practiceBoxes: chk("pcPractice"), compact: chk("pcCompact"), bw: chk("pcBw"), nameFields: chk("pcNames"),
      coverTitle: (el("pcTitle") && el("pcTitle").value) || _opts.coverTitle,
      coverSubtitle: (el("pcSubtitle") && el("pcSubtitle").value) || "",
      student: (el("pcStudent") && el("pcStudent").value) || "",
      klass: (el("pcClass") && el("pcClass").value) || "",
      date: (el("pcDate") && el("pcDate").value) || ""
    };
  }
  function selectedResources() {
    return getPrintableResources().filter(function (r) { return _sel[r.id]; });
  }
  function filtered() {
    var q = _q.toLowerCase();
    return getPrintableResources().filter(function (r) {
      if (_cat && r.category !== _cat) return false;
      if (q && (r.title + " " + r.category + " " + r.type).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }
  function estPages(list, o) {
    var n = list.reduce(function (s, r) { return s + Math.max(1, r.pages || 1); }, 0);
    if (o.compact) n = Math.ceil(n * 0.8);
    if (o.cover && list.length > 1) n += 1;
    if (o.toc && list.length > 1) n += 1;
    return n;
  }

  /* ---------- actions ---------- */
  function openPrintPreview() {
    var list = selectedResources();
    if (!list.length) { alert("Select at least one resource to preview."); return; }
    var o = readOptions();
    var prev = el("bookletPreview");
    prev.innerHTML = '<div class="booklet-preview-pages">' + renderPrintBooklet(list, o) + "</div>";
    prev.hidden = false;
    scrollToEl(prev);
  }
  function bookletFilename(list, o) {
    var content;
    if (list.length === 1) content = list[0].title;
    else if (list.length === getPrintableResources().length) content = o.coverTitle || "All Resources";
    else content = o.coverTitle || "Resource Booklet";
    return pdfName([content, o.student, "IELTS with Mourad"]);
  }
  function printSelectedResources(useAll) {
    var list = useAll ? getPrintableResources().slice() : selectedResources();
    if (!list.length) { alert(useAll ? "There are no printable resources." : "Select at least one resource to print."); return; }
    var o = readOptions();
    var node = el("printBooklet");
    node.innerHTML = renderPrintBooklet(list, o);
    node.setAttribute("aria-hidden", "false");
    document.body.classList.add("printing-booklet");
    var prevTitle = document.title;
    document.title = bookletFilename(list, o);
    window.print();
    setTimeout(function () { document.body.classList.remove("printing-booklet"); node.setAttribute("aria-hidden", "true"); document.title = prevTitle; }, 400);
  }
  function pcToast(msg) {
    var prev = el("pcToast"); if (prev) prev.remove();
    var t = document.createElement("div");
    t.className = "pc-toast"; t.id = "pcToast"; t.setAttribute("role", "status");
    t.innerHTML = '<span class="pc-toast-label">Export as PDF</span>' + msg;
    document.body.appendChild(t);
    setTimeout(function () { if (t && t.parentNode) t.parentNode.removeChild(t); }, 9000);
  }
  function exportPdf(useAll) {
    var list = useAll ? getPrintableResources() : selectedResources();
    if (!list.length) { alert(useAll ? "There are no printable resources." : "Select at least one resource to export."); return; }
    pcToast('In the print dialog, set <b>Destination</b> to \u201cSave as PDF\u201d, and open <b>More settings</b> to turn on <b>Background graphics</b> for full colour.');
    setTimeout(function () { printSelectedResources(useAll); }, 350);
  }
  function resetOptions() {
    ["pcCover", "pcToc", "pcModels", "pcPractice", "pcNotes", "pcNames"].forEach(function (id) { if (el(id)) el(id).checked = true; });
    ["pcAnswers", "pcCompact", "pcBw"].forEach(function (id) { if (el(id)) el(id).checked = false; });
    if (el("pcTitle")) el("pcTitle").value = _opts.coverTitle;
    if (el("pcSubtitle")) el("pcSubtitle").value = _opts.coverSubtitle;
    ["pcStudent", "pcClass", "pcDate"].forEach(function (id) { if (el(id)) el(id).value = ""; });
    updateCounts();
  }

  /* ---------- selection UI ---------- */
  function updateCounts() {
    var sel = selectedResources();
    var c = el("pcCount");
    if (c) c.textContent = sel.length + " selected · ~" + estPages(sel, readOptions()) + " pages";
  }
  function resourceRow(r) {
    var labels = [];
    if (r.includes.worksheet) labels.push("worksheet");
    if (r.includes.answerKey) labels.push("answer key");
    if (r.includes.modelAnswer) labels.push("model answer");
    if (r.includes.teacherNotes) labels.push("teacher notes");
    if (r.includes.chart) labels.push("chart");
    if (r.includes.vocab) labels.push("vocabulary");
    return '<label class="pc-row' + (_sel[r.id] ? " is-sel" : "") + '">' +
      '<input type="checkbox" class="pc-cb" data-pc="' + r.id + '"' + (_sel[r.id] ? " checked" : "") + ">" +
      '<span class="pc-row-main"><span class="pc-row-title">' + esc(r.title) + "</span>" +
        '<span class="pc-row-meta">' + esc(r.category) + " · " + esc(r.type) + (r.level ? " · " + esc(r.level) : "") + "</span>" +
        '<span class="pc-row-labels">' + labels.map(function (l) { return '<span class="pc-tag">' + l + "</span>"; }).join("") + "</span></span>" +
      "</label>";
  }
  function renderList() {
    var list = filtered();
    var groups = {}, order = [];
    list.forEach(function (r) { if (!groups[r.category]) { groups[r.category] = []; order.push(r.category); } groups[r.category].push(r); });
    var html = order.map(function (cat) {
      return '<div class="pc-group"><h3 class="pc-group-h">' + esc(cat) + " <span>" + groups[cat].length + "</span></h3>" +
        groups[cat].map(resourceRow).join("") + "</div>";
    }).join("");
    el("pcList").innerHTML = html || '<p class="empty-note">No resources match your search.</p>';
    updateCounts();
  }

  function render() {
    var view = el("view-printcenter");
    if (!view) { return; }
    var cats = categories();
    view.innerHTML =
      '<header class="view-head"><p class="view-eyebrow">Teacher tools</p>' +
        '<h1 class="view-title">Resource Print Center</h1>' +
        '<p class="view-sub">Select any resource, several, or all — then preview and print a branded A4 booklet or export it as a PDF.</p></header>' +

      '<div class="pc-grid">' +
        // -- left: selection --
        '<div class="pc-select panel glass-panel pad">' +
          '<div class="pc-toolbar">' +
            '<input type="search" id="pcSearch" class="field-input" placeholder="Search resources…" aria-label="Search resources">' +
            '<select id="pcCat" class="field-input" aria-label="Filter by category"><option value="">All categories</option>' +
              cats.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("") + "</select>" +
          "</div>" +
          '<div class="pc-toolbar pc-toolbar-2">' +
            '<button class="btn btn-ghost btn-sm" id="pcSelectAll">Select all</button>' +
            '<button class="btn btn-ghost btn-sm" id="pcClear">Clear selection</button>' +
            '<span class="pc-count" id="pcCount">0 selected</span>' +
          "</div>" +
          '<div class="pc-list" id="pcList"></div>' +
        "</div>" +

        // -- right: options + actions --
        '<aside class="pc-side">' +
          '<div class="panel glass-panel pad pc-options">' +
            '<h3 class="panel-label">Booklet options</h3>' +
            '<div class="pc-toggles">' +
              pcToggle("pcCover", "Cover page", true) +
              pcToggle("pcToc", "Table of contents", true) +
              pcToggle("pcModels", "Model answers", true) +
              pcToggle("pcAnswers", "Answer keys", false) +
              pcToggle("pcNotes", "Teacher notes", true) +
              pcToggle("pcPractice", "Student practice boxes", true) +
              pcToggle("pcNames", "Name / class / date", true) +
              pcToggle("pcCompact", "Compact layout", false) +
              pcToggle("pcBw", "Black-and-white friendly", false) +
            "</div>" +
            '<div class="pc-cover-fields">' +
              '<label class="field-label">Booklet title</label><input id="pcTitle" class="field-input" value="' + esc(_opts.coverTitle) + '">' +
              '<label class="field-label">Subtitle</label><input id="pcSubtitle" class="field-input" value="' + esc(_opts.coverSubtitle) + '">' +
              '<div class="pc-cover-row">' +
                '<span><label class="field-label">Student</label><input id="pcStudent" class="field-input"></span>' +
                '<span><label class="field-label">Class / group</label><input id="pcClass" class="field-input"></span>' +
              "</div>" +
              '<label class="field-label">Date</label><input id="pcDate" class="field-input" placeholder="' + esc(todayLong()) + '">' +
            "</div>" +
          "</div>" +
          '<div class="panel glass-panel pad pc-actions">' +
            '<button class="btn btn-gold" id="pcPreview">Preview booklet</button>' +
            '<button class="btn btn-navy" id="pcPrint">Print selected</button>' +
            '<button class="btn btn-gold" id="pcExport">Export as PDF</button>' +
            '<button class="btn btn-navy" id="pcBooklet">Generate booklet (all)</button>' +
            '<button class="btn btn-ghost" id="pcReset">Reset options</button>' +
            '<p class="pc-hint">Use your browser\u2019s print dialog and choose <b>Save as PDF</b> to export. Turn the dialog\u2019s background-graphics on for full colour.</p>' +
          "</div>" +
        "</aside>" +
      "</div>" +

      '<div class="booklet-preview" id="bookletPreview" hidden></div>';

    bindUI();
    renderList();
  }

  function pcToggle(id, label, on) {
    return '<label class="pc-toggle"><input type="checkbox" id="' + id + '"' + (on ? " checked" : "") + "><span>" + esc(label) + "</span></label>";
  }

  function bindUI() {
    on(el("pcSearch"), "input", function () { _q = this.value; renderList(); });
    on(el("pcCat"), "change", function () { _cat = this.value; renderList(); });
    on(el("pcSelectAll"), "click", function () { filtered().forEach(function (r) { _sel[r.id] = true; }); renderList(); });
    on(el("pcClear"), "click", function () { _sel = {}; renderList(); });
    on(el("pcPreview"), "click", function () { openPrintPreview(); });
    on(el("pcPrint"), "click", function () { printSelectedResources(false); });
    on(el("pcExport"), "click", function () { exportPdf(false); });
    on(el("pcBooklet"), "click", function () { getPrintableResources().forEach(function (r) { _sel[r.id] = true; }); renderList(); printSelectedResources(true); });
    on(el("pcReset"), "click", function () { resetOptions(); });
    el("pcList").addEventListener("change", function (e) {
      var cb = e.target.closest("[data-pc]");
      if (!cb) return;
      _sel[cb.dataset.pc] = cb.checked;
      var row = cb.closest(".pc-row"); if (row) row.classList.toggle("is-sel", cb.checked);
      updateCounts();
    });
    ["pcCover", "pcToc", "pcCompact"].forEach(function (id) { var n = el(id); if (n) on(n, "change", updateCounts); });
  }

  return {
    render: render,
    getPrintableResources: getPrintableResources,
    renderPrintResource: renderPrintResource,
    renderPrintCoverPage: renderPrintCoverPage,
    renderTableOfContents: renderTableOfContents,
    renderPrintBooklet: renderPrintBooklet,
    openPrintPreview: openPrintPreview,
    printSelectedResources: printSelectedResources,
    _byId: byId
  };
})();

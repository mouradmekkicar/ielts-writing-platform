/* ============================================================================
   IELTSwithMOURAD — Task 2 Workshop · CONTENT DATA
   Part of the Mourad Mekki Teacher Toolkit.
   All content migrated verbatim from the standalone Task 2 Band 7+ Studio.
   Exposes window.IWM_T2W_DATA. No globals leak; the engine reads from here.
   ============================================================================ */
"use strict";
window.IWM_T2W_DATA = (function () {
  "use strict";

  /* ---------- Section meta + Stage content (verbatim) ---------- */
const SECTIONS=[
  {id:'warmup',  n:1, name:'Warm-Up Diagnostic', time:'8 min'},
  {id:'lens',    n:2, name:'Band 7 Lens',        time:'8 min'},
  {id:'types',   n:3, name:'Essay Type Game',    time:'10 min'},
  {id:'builder', n:4, name:'Structure Builder',  time:'14 min'},
  {id:'intro',   n:5, name:'Introduction Lab',   time:'12 min'},
  {id:'peel',    n:6, name:'PEEL Lab',           time:'16 min'},
  {id:'cohesion',n:7, name:'Cohesion Repair',    time:'10 min'},
  {id:'conclude',n:8, name:'Conclusion Sprint',  time:'8 min'},
  {id:'clinic',  n:9, name:'Model Essay Clinic', time:'Flex'},
  {id:'exit',    n:10,name:'Exit Ticket',        time:'4 min'},
];

/* ----- 1. Warm-up diagnostic questions ----- */
const WARMUP=[
  {focus:'Essay-type recognition',
   q:'“Governments should fund public transport rather than building new roads. Discuss both views and give your own opinion.” What essay type is this?',
   opts:['Opinion / Agree–Disagree','Discussion (Both Views + Opinion)','Advantages / Disadvantages','Problem / Solution'],
   ans:1, ex:'The instruction words “Discuss both views and give your own opinion” signal a Discussion essay — not an opinion essay. You must cover both sides AND state your view.'},
  {focus:'Thesis clarity',
   q:'Which thesis states the clearest, most committed position?',
   opts:['This essay will look at both sides of the electric car debate.','There are many advantages and disadvantages to electric cars.','I strongly agree that petrol cars should be phased out because they harm health and slow innovation.'],
   ans:2, ex:'A Band 7 thesis commits to a position and previews the reasons. The other two “sit on the fence” and give the examiner no clear stance.'},
  {focus:'Idea development',
   q:'Which body-paragraph approach scores higher for Task Response?',
   opts:['Listing five quick benefits in five short sentences.','Developing one benefit fully with explanation and a specific example.'],
   ans:1, ex:'Depth beats breadth. One idea taken through Point → Explain → Example → Link out-scores a shallow list every time.'},
  {focus:'Cohesion / linkers',
   q:'Choose the most logical connector: “Remote work reduces commuting time. ____, it can weaken team collaboration.”',
   opts:['Therefore','However','For example','Moreover'],
   ans:1, ex:'The two clauses contrast, so a concession/contrast linker (“However”) is needed — not a result or addition linker.'},
  {focus:'Conclusion quality',
   q:'Which is the strongest Task 2 conclusion?',
   opts:['In conclusion, the government should also ban diesel buses immediately to fix this.','In conclusion, I firmly believe the benefits outweigh the drawbacks, mainly due to cleaner air and faster innovation.','In conclusion, there are many points to consider on both sides of this important issue.'],
   ans:1, ex:'A Band 7 conclusion restates the position and summarises the key reasons — with no new ideas (option A adds a new idea; option C says nothing).'},
  {focus:'Grammar accuracy',
   q:'Complete correctly: “____ the high cost, many families still buy electric cars.”',
   opts:['Although','Despite','However','Because'],
   ans:1, ex:'“Despite” is followed by a noun phrase (“the high cost”). “Although” would need a clause: “Although the cost is high…”.'},
  {focus:'Task response',
   q:'A prompt says “To what extent do you agree?” What must your essay do?',
   opts:['Describe both sides neutrally without an opinion.','State a clear degree of agreement and defend it throughout.','List the causes and then the solutions.'],
   ans:1, ex:'“To what extent” demands a position with a degree (largely / partly / completely agree) held consistently across the whole essay.'},
];

/* ----- 2. Band 7 lens ----- */
const LENS=[
  {abbr:'TR',name:'Task Response',
   b6:'Presents ideas but may address the prompt only partly, or let the position drift.',
   b7:'Holds one clear position throughout, answers every part of the prompt, and develops ideas with relevant support.',
   q:'A prompt asks whether cars are “cheaper AND cleaner”. A Band 7 response must…',
   opts:['Address only the cost claim in depth.','Address both the cost claim and the environmental claim.'],ans:1,
   ex:'TR requires you to answer ALL parts of a multi-part prompt — covering both “cheaper” and “cleaner”.'},
  {abbr:'CC',name:'Coherence & Cohesion',
   b6:'Uses linkers mechanically — often the same word starting every sentence.',
   b7:'Logical flow with clear paragraphing; cohesive devices used flexibly, including mid-sentence and via referencing.',
   q:'Which shows Band 7 cohesion?',
   opts:['“Moreover… Furthermore… Also…” at the start of each sentence.','“This shift, however, raises a deeper problem.”'],ans:1,
   ex:'Band 7 cohesion = logical flow, not a connector bolted onto every sentence. Varying position and using referencing reads as flexible control.'},
  {abbr:'LR',name:'Lexical Resource',
   b6:'Limited range or forced synonyms used incorrectly (e.g. “human offspring” for children).',
   b7:'Precise vocabulary and natural collocations; occasional slips allowed.',
   q:'Which choice shows Band 7 lexical control?',
   opts:['“curb urban pollution”','“make the city air pollution become less”'],ans:0,
   ex:'Precise collocation (“curb pollution”) beats long, awkward paraphrase. Precision over “fancy”.'},
  {abbr:'GRA',name:'Grammatical Range & Accuracy',
   b6:'Frequent errors; many sentences contain small mistakes.',
   b7:'A variety of complex structures with frequent error-free sentences; only occasional, non-systematic slips.',
   q:'Which habit best protects your GRA score?',
   opts:['Writing very long sentences to show range.','Mixing simple and complex sentences and proofreading for repeated errors.'],ans:1,
   ex:'Accuracy matters more than length. Long sentences raise risk; controlled variety plus a proofread for systematic errors wins.'},
];

/* ----- 3. Essay type game ----- */
const TYPES={
  opinion:'Opinion / Agree–Disagree',
  discussion:'Discussion (Both Views + Opinion)',
  ad:'Advantages / Disadvantages',
  ps:'Problem / Solution',
  direct:'Direct Questions (Two-Part)'
};
const TYPE_PROMPTS=[
  {p:'Many believe electric cars should completely replace petrol vehicles within twenty years. To what extent do you agree or disagree?',t:'opinion',ex:'“To what extent do you agree” → Opinion. Commit to a degree of agreement.'},
  {p:'Some argue remote work benefits employees, while others say it harms collaboration. Discuss both views and give your own opinion.',t:'discussion',ex:'“Discuss both views and give your own opinion” → Discussion. Cover both sides, then judge.'},
  {p:'More people now shop online instead of in physical stores. What are the advantages and disadvantages of this trend?',t:'ad',ex:'“Advantages and disadvantages” → A/D. Standard layout — no opinion required unless asked.'},
  {p:'Childhood obesity is rising in many countries. What are the main causes, and what solutions can address it?',t:'ps',ex:'“Causes … solutions” → Problem/Solution. Your solutions must match the causes you raise.'},
  {p:'Some people think universities should only teach subjects useful for a future career. Do you agree or disagree?',t:'opinion',ex:'“Do you agree or disagree” → Opinion. One clear stance, justified.'},
  {p:'Do the advantages of social media for communication outweigh its disadvantages?',t:'ad',ex:'“Do advantages outweigh…” → A/D (Outweigh). You MUST give a clear verdict on which side wins.',trap:true},
  {p:'Tourism can damage popular destinations. What problems does this cause, and how can they be solved?',t:'ps',ex:'“What problems … how solved” → Problem/Solution.'},
  {p:'Some feel governments should invest more in public parks, while others prefer spending on housing. Discuss both sides and give your view.',t:'discussion',ex:'“Discuss both sides and give your view” → Discussion.'},
  {p:'Fast food is increasingly popular among young people. Why is this happening, and what effects does it have on health?',t:'direct',ex:'Two distinct questions (Why? + What effects?) → Direct Questions. Give equal weight to each.'},
  {p:'Some people believe working from home raises productivity. Others disagree. Discuss both views and give your own opinion.',t:'discussion',ex:'TRAP: It mentions belief and disagreement, but “Discuss both views” makes it a Discussion essay — not Opinion.',trap:true},
  {p:'Some argue that only electric cars should be allowed in city centres. Do you agree or disagree?',t:'opinion',ex:'TRAP: Two sides exist, but the instruction “Do you agree or disagree” = Opinion. Don’t treat it as a discussion.',trap:true},
  {p:'Public transport in many cities is becoming overcrowded. Why is this happening, and is it a positive or negative development?',t:'direct',ex:'Two questions (Why? + Positive or negative?) → Direct Questions / Two-Part.',trap:true},
  {p:'Protecting the environment is the responsibility of governments, not individuals. To what extent do you agree?',t:'opinion',ex:'“To what extent do you agree” → Opinion.'},
  {p:'Online learning is replacing traditional classrooms in many schools. What are the benefits and drawbacks of this change?',t:'ad',ex:'“Benefits and drawbacks” → Advantages / Disadvantages.'},
];

/* ----- 4. Structure builder layouts (correct order top→bottom) ----- */
const LAYOUTS={
  opinion:{label:'Opinion / Agree–Disagree',
    blocks:[
      {role:'Intro',text:'Paraphrase the question, then state ONE clear position (your degree of agreement).'},
      {role:'BP1',text:'Reason 1 — topic sentence → explain why → specific example.'},
      {role:'BP2',text:'Reason 2 — topic sentence → explain → example (optional brief counter-point + rebuttal).'},
      {role:'Conc',text:'Signal phrase + restate your stance and summarise the key reasons.'}],
    tips:['State ONE clear position — never “sit on the fence”.','Don’t turn it into a “discuss both views” essay; you justify YOUR opinion.','If the prompt has two claims (e.g. “cheap AND clean”), answer both.'],
    warn:'Wrong-structure warning: writing one balanced paragraph for each side, with no clear opinion, makes this read like a Discussion essay and caps Task Response.'},
  discussion:{label:'Discussion (Both Views + Opinion)',
    blocks:[
      {role:'Intro',text:'Paraphrase the question, outline the plan, and signal your opinion.'},
      {role:'BP1',text:'Viewpoint you disagree with — present it fairly (why some support it) → explain → example.'},
      {role:'BP2',text:'Viewpoint you agree with — present it and include your own evaluation/support.'},
      {role:'Conc',text:'Signal phrase + clearly state which view is stronger and why.'}],
    tips:['You MUST discuss both sides fairly before judging.','Make your opinion explicit in the intro and the conclusion.','Present the strongest version of each side — avoid strawman arguments.'],
    warn:'Wrong-structure warning: discussing only one side, or hiding your opinion, fails the “give your own opinion” instruction.'},
  adstd:{label:'Advantages / Disadvantages (Standard)',
    blocks:[
      {role:'Intro',text:'Paraphrase + neutral overview of the topic (no strong stance needed).'},
      {role:'BP1',text:'Advantages — 1–2 well-developed points (not a long list).'},
      {role:'BP2',text:'Disadvantages — 1–2 well-developed points.'},
      {role:'Conc',text:'Summary / balanced overall impression.'}],
    tips:['Don’t list 5 advantages — pick 1–2 and develop them fully.','Keep the overview neutral unless the prompt asks you to judge.','Use clear topic sentences so each paragraph has one focus.'],
    warn:'Wrong-structure warning: if the prompt says “outweigh”, the standard balanced layout is wrong — you must give a verdict (use the Outweigh layout).'},
  adout:{label:'Advantages / Disadvantages (“Outweigh”)',
    blocks:[
      {role:'Intro',text:'Paraphrase + clear stance — state which side outweighs the other.'},
      {role:'BP1',text:'Stronger side — 2 strong reasons + examples.'},
      {role:'BP2',text:'Weaker side — acknowledge it, then limit/evaluate it.'},
      {role:'Conc',text:'Reaffirm your judgement / verdict.'}],
    tips:['“Do advantages outweigh disadvantages?” MUST receive an opinion.','Give more weight (and space) to your chosen stronger side.','Acknowledge the other side, but show why it is less decisive.'],
    warn:'Wrong-structure warning: presenting both sides equally with no verdict ignores the word “outweigh” and lowers Task Response.'},
  ps:{label:'Problem / Solution',
    blocks:[
      {role:'Intro',text:'Paraphrase + scope: name the main problems/causes and outline the solutions.'},
      {role:'BP1',text:'Problems / causes — identify a key cause → explain how/why → example.'},
      {role:'BP2',text:'Solutions — specific, feasible solution → who acts → expected result.'},
      {role:'Conc',text:'Signal phrase + summarise and prioritise the most effective solution.'}],
    tips:['Solutions MUST match the causes you raised.','Be specific: “impose congestion taxes”, not “the government should help”.','Develop 1–2 solutions fully rather than listing five.'],
    warn:'Wrong-structure warning: solving a problem you never mentioned breaks the cause–solution link and weakens coherence.'},
  direct:{label:'Direct Questions / Two-Part',
    blocks:[
      {role:'Intro',text:'Paraphrase the context + preview that both questions will be answered.'},
      {role:'BP1',text:'Answer question 1 — direct topic-sentence answer → explain → example.'},
      {role:'BP2',text:'Answer question 2 — direct answer → explain → example.'},
      {role:'Conc',text:'Signal phrase + briefly synthesise both answers (no new ideas).'}],
    tips:['Use the question’s key words in your topic sentences.','Give equal development to each question — don’t neglect one.','Usually one paragraph per question asked.'],
    warn:'Wrong-structure warning: answering only one of the two questions, or giving them unequal weight, fails Task Response.'},
};

/* ----- 5. Introduction lab ----- */
const INTRO={
  para:{prompt:'“Some people think that only electric cars should be allowed on the road by 2040. Do you agree?”',
    opts:[
      'Lots of people nowadays say that we should only have electric cars and no other cars after the year 2040.',
      'Some propose that only electric vehicles should be permitted to operate on public roads by the year 2040.',
      'Cars are a big problem and electric cars might be the answer to this issue in the future for everyone.'],
    ans:1, ex:'Option B paraphrases precisely with synonyms and a shift in grammar (“allowed → be permitted to operate”) while keeping the exact meaning. A is too informal and repetitive; C drifts off-topic and adds a “hook”.'},
  thesis:{weak:'I think electric cars are quite good and there are some reasons for this in my essay.',
    opts:[
      'In this essay I will talk about electric cars and give my own opinion about them.',
      'I largely agree that conventional cars should be phased out by 2040 because this would cut urban pollution and accelerate green innovation.',
      'Electric cars are the future and everyone knows they are better than petrol cars in every way.'],
    ans:1, ex:'A Band 7 thesis commits to a position AND previews the reasons (pollution + innovation). Option A is vague “signposting”; option C over-generalises (“in every way”, “everyone knows”).'},
  write:{prompt:'“Social media has changed the way people build friendships. To what extent do you think this change is positive?”',
    model:'While social media has undeniably transformed how individuals form relationships, I believe this shift is largely positive, since it sustains long-distance friendships and broadens social networks beyond geographical limits.',
    tags:['Paraphrases the prompt','Commits to a position (“largely positive”)','Previews two reasons','Academic, concise tone']}
};

/* ----- 6. PEEL lab ----- */
const PEEL_ORDER={
  prompt:'Should electric cars replace petrol ones? (Health-benefit paragraph)',
  blocks:[
    {role:'P',text:'One compelling reason to favour electric cars is the significant public-health benefit they bring.'},
    {role:'E',text:'Because they emit no tailpipe pollutants, they sharply lower the urban smog that triggers respiratory illness.'},
    {role:'E',text:'For instance, after Oslo expanded its electric-vehicle uptake, nitrogen-oxide levels in the city centre fell noticeably.'},
    {role:'L',text:'Thus, the health gains alone justify a rapid transition away from fossil-fuelled transport.'}],
  ex:'P (point) → E (explain) → E (example) → L (link). The topic sentence states the idea, the explanation answers “why”, the example proves it, and the link ties back to the argument.'
};
const PEEL_MISSING={
  prompt:'Identify the missing PEEL element in this paragraph:',
  text:'“A key advantage of remote work is improved productivity. Employees avoid long commutes and face fewer office distractions, so they can focus on demanding tasks. Therefore, flexible home-working can directly raise output for many companies.”',
  opts:['Point','Explain','Example','Link'],
  ans:2, ex:'It has a Point, an Explanation and a Link — but no concrete Example. Add one (e.g. “A 2022 company trial found output rose 13% after staff moved to two home-days a week.”).'
};
const PEEL_EXPAND={
  weak:'Public transport is good because it is cheap.',
  prompt:'Expand this weak idea into a Band 7 PEEL paragraph for: “Should governments invest more in public transport?”',
  model:'A powerful reason to expand public transport is its affordability for low-income commuters. Because subsidised buses and trains cost far less than running a private car, households can redirect money to essentials such as housing and education. In many European cities, for example, monthly travel passes cost a fraction of fuel and parking, easing pressure on family budgets. Consequently, well-funded transport networks do not merely move people — they widen economic opportunity.',
  tags:['Clear point','Explanation (why)','Specific example','Link back to the question','Academic collocations']
};

/* ----- 7. Cohesion repair ----- */
const COHESION=[
  {type:'mcq',
   q:'Choose the most logical connector: “Electric cars are expensive to buy. ____, their running costs are far lower.”',
   opts:['Therefore','However','For example','Furthermore'],ans:1,
   ex:'The clauses contrast (high purchase price vs low running cost), so a contrast linker (“However”) fits — not result, example or addition.'},
  {type:'mcq',
   q:'Replace the mechanical opener. Which version reads as Band 7?',
   opts:['“Moreover, the policy is costly.”','“This policy, moreover, is costly and difficult to enforce.”'],ans:1,
   ex:'Varying the position of the linker (mid-sentence) and adding real content shows flexible control rather than a bolted-on connector.'},
  {type:'mcq',
   q:'A student starts three sentences in a row with “Moreover… Furthermore… Also…”. The best fix is to…',
   opts:['Keep them — more linkers means higher cohesion.','Use referencing (“This problem…”) and place some linkers mid-sentence.'],ans:1,
   ex:'Cohesion is logical flow, not a connector on every line. Referencing words and varied position de-mechanise the writing.'},
  {type:'mcq',
   q:'Grammar: choose the correct option. “____ working long hours, she still volunteers every weekend.”',
   opts:['Although','Despite','Whereas','However'],ans:1,
   ex:'“Despite” + gerund/noun phrase (“working long hours”). “Although” would need a clause (“Although she works long hours…”).'},
  {type:'mcq',
   q:'Grammar: choose the correct option. “____ the policy is popular, it is expensive to run.”',
   opts:['Despite','In spite of','Although','However'],ans:2,
   ex:'“Although” + clause (subject + verb: “the policy is popular”). “Despite/In spite of” need a noun phrase; “However” needs its own sentence + comma.'},
  {type:'mcq',
   q:'Choose the connector that shows CONTRAST between two whole ideas in separate sentences:',
   opts:['Whereas','Despite','However','Although'],ans:2,
   ex:'“However” links two independent sentences (“…cheap. However, …”). “Whereas/Although” join clauses inside one sentence; “Despite” takes a noun phrase.'},
];

/* ----- 8. Conclusion sprint ----- */
const CONC={
  repair:{prompt:'Pick the strongest repair for this weak conclusion: “In conclusion, there are many points about electric cars and people have different ideas about them.”',
    opts:[
      'In conclusion, electric cars are interesting and the government should also tax petrol heavily to help.',
      'In conclusion, I firmly maintain that electric cars should be prioritised, chiefly because they curb urban pollution and spur green innovation.',
      'In conclusion, as I said, electric cars have advantages and disadvantages for everyone in society today.'],
    ans:1, ex:'A Band 7 conclusion restates the position and summarises the key reasons — no new ideas. Option A adds a new idea (taxing petrol); option C restates nothing concrete.'},
  write:{prompt:'Write a 30–40 word conclusion for: “Do the benefits of remote work outweigh the drawbacks?” (Your essay argued: YES — productivity + work-life balance.)',
    model:'In conclusion, I am convinced that the benefits of remote work clearly outweigh its drawbacks, primarily because it boosts individual productivity and protects a healthier balance between professional and personal life.',
    tags:['Signal phrase','Restated position','Summary of both reasons','No new ideas','30–40 words']}
};

  /* ---------- Model Essay Clinic · annotation layers (verbatim) ---------- */
const LAYERS=[
  {id:'tr',       name:'Task Response'},
  {id:'structure',name:'Structure'},
  {id:'cohesion', name:'Cohesion'},
  {id:'vocab',    name:'Vocabulary'},
  {id:'grammar',  name:'Grammar'},
  {id:'variety',  name:'Sentence Variety'},
  {id:'warning',  name:'Examiner Warnings'}
];

  /* ---------- Model Essay Clinic · essay library (verbatim) ---------- */
const ESSAYS=[
/* 1 ───────────── OPINION / AGREE–DISAGREE ───────────── */
{
  type:'Opinion / Agree–Disagree',
  prompt:'Some people believe that young adults should spend a year doing community service before they begin university. To what extent do you agree or disagree?',
  b9:{
    paras:[
      'It is increasingly argued that school-leavers should devote twelve months to community service before enrolling at university. I largely agree with this proposal, since a structured year of service can foster social responsibility and help young people choose their degrees more wisely.',
      'The most compelling reason concerns personal maturity. Many eighteen-year-olds move straight into higher education without any real understanding of the wider society they belong to. A year spent assisting in hospitals, schools or environmental projects exposes them to people from different backgrounds and obliges them to manage genuine responsibilities. In Germany, for instance, young volunteers in care homes consistently report that the experience made them more disciplined and empathetic, qualities that later strengthen their academic work.',
      'A further benefit is clearer academic direction. Students who pause before university often gain a sharper sense of their own strengths, which reduces the likelihood of abandoning a poorly chosen course. Because they have tested their interests in a practical setting, they tend to commit more seriously to their studies. This, in turn, lowers dropout rates and saves both families and governments considerable expense.',
      'In conclusion, although a compulsory year would delay graduation, I believe its advantages clearly outweigh this drawback, chiefly because it cultivates mature, socially aware students who pursue their degrees with genuine purpose.'
    ],
    score:{band:9,
      TR:'Fully addresses the prompt with a clear, consistent position stated in the introduction and reaffirmed in the conclusion. Both reasons are extended and supported.',
      CC:'Logical paragraphing with strong topic sentences; cohesion is natural, using referencing ("This, in turn") rather than mechanical linkers.',
      LR:'Precise, flexible vocabulary and natural collocations ("foster social responsibility", "cultivates mature, socially aware students").',
      GRA:'A wide range of accurate complex structures, including concessive and relative clauses, with virtually no errors.'},
    strongest:'A clear position is developed with two fully-extended, well-exemplified reasons.',
    weakest:'The example could be marginally more specific, but this is a minor point at this level.',
    why:'It fully answers the question, holds one consistent position, extends and supports every idea, and controls a wide range of vocabulary and grammar with natural cohesion.',
    anno:[
      {find:'I largely agree with this proposal',cat:'tr',note:'Clear thesis stating a degree of agreement ("largely agree"). The examiner sees the position immediately — essential for Task Response.'},
      {find:'since a structured year of service can foster social responsibility and help young people choose their degrees more wisely',cat:'tr',note:'The thesis previews BOTH reasons the essay will develop, so the reader knows exactly where the argument is going.'},
      {find:'The most compelling reason concerns personal maturity.',cat:'structure',note:'Topic sentence: it names the single idea of the paragraph before any detail, giving the paragraph one clear focus.'},
      {find:'A further benefit is clearer academic direction.',cat:'structure',note:'Topic sentence for body 2, signalling a new, distinct reason — clear paragraph progression.'},
      {find:'foster social responsibility',cat:'vocab',note:'"foster" + "social responsibility" is a strong academic collocation — far more precise than "make them care about society".'},
      {find:'cultivates mature, socially aware students',cat:'vocab',note:'Precise verb + noun phrase ("cultivates … students"). Shows flexible, less common lexis used accurately.'},
      {find:'obliges them to manage genuine responsibilities',cat:'grammar',note:'"obliges them to manage" — a controlled infinitive structure that compresses meaning efficiently.'},
      {find:'which reduces the likelihood of abandoning a poorly chosen course',cat:'grammar',note:'Relative clause beginning with "which" adds a consequence smoothly inside one sentence — a marker of grammatical range.'},
      {find:'This, in turn, lowers dropout rates',cat:'cohesion',note:'Referencing: "This" points back to the previous sentence, and "in turn" signals a chain of cause and effect — cohesion without a bolted-on linker.'},
      {find:'although a compulsory year would delay graduation',cat:'variety',note:'Concessive clause ("although…") acknowledges the counter-argument before the writer reaffirms the position — sophisticated sentence control.'},
      {find:'In Germany, for instance',cat:'tr',note:'A located, relevant example. Naming a country grounds the claim and supports Task Response.'}
    ]
  },
  b5:{
    paras:[
      'Nowadays many people think young adults should do community service for one year before university. In my opinion this topic have two sides and I will discuss them in this essay.',
      'Firstly, community service is good because it help young people. They can learn many things and meet many people and it is good for their future life. For example my cousin did volunteer work and he said it was a nice experience and he learn a lot of things. Also it keep them busy and away from bad habits which is good for society and for the parents too.',
      'Secondly, some people think it is waste of time because students want to start university quickly and finish fast. If they do service for one year they will be older when they finish and maybe they forget what they study in school. Moreover it can be boring for some students and they don\u2019t like it.',
      'In conclusion, community service have advantages and disadvantages. I think it is a good idea but also it depends on the person. Everyone should decide by himself what is good for him.'
    ],
    score:{band:5,
      TR:'The position is unclear and inconsistent: the writer "discusses two sides" and only states a wavering opinion at the very end, which does not match an agree/disagree task.',
      CC:'Mechanical linkers ("Firstly", "Secondly", "Moreover") and weak paragraphing; ideas are listed rather than developed.',
      LR:'Repetitive, informal vocabulary ("good", "many things", "nice"); imprecise word choice throughout.',
      GRA:'Frequent errors in subject-verb agreement ("it help", "this topic have") and several run-on sentences that blur meaning.'},
    strongest:'The essay is on-topic and organised into four paragraphs with a recognisable introduction and conclusion.',
    weakest:'It treats an opinion task like a discussion and never commits to one consistent position.',
    why:'It answers the prompt only partly, drifts on position, lists ideas without real development, repeats basic words, and contains frequent grammar errors that limit clarity.',
    problems:[
      'No clear or consistent opinion — it reads like a "discuss both views" essay, but the task asks "to what extent do you agree?"',
      'Ideas are listed, not developed: examples are vague ("a nice experience", "learn a lot of things").',
      'Repeated basic vocabulary ("good", "many things") and frequent grammar errors ("it help", "this topic have").'
    ],
    fixes:[
      'State one degree of agreement in the introduction and hold it to the end (e.g. "I largely agree…").',
      'Replace listing with PEEL: take one reason and explain WHY, then give a specific, located example.',
      'Upgrade weak words to academic collocations and proofread for subject-verb agreement.'
    ],
    rewrite:{
      orig:'Firstly, community service is good because it help young people. They can learn many things and meet many people and it is good for their future life. For example my cousin did volunteer work and he said it was a nice experience and he learn a lot of things.',
      better:'The strongest argument in favour of a service year is that it accelerates personal maturity. By taking on real responsibilities \u2014 caring for patients or running activities for children \u2014 young adults develop discipline and empathy they rarely gain at school. A friend who spent a year in a community clinic, for example, returned far more organised and confident, and that self-discipline later improved her university performance.'
    },
    anno:[
      {find:'this topic have two sides',cat:'warning',note:'Fatal for an opinion task: the writer announces a neutral "two sides" approach instead of taking a position. This caps Task Response.'},
      {find:'this topic have',cat:'grammar',note:'Subject-verb agreement error: "topic" is singular, so it must be "this topic HAS". A repeated error type that limits GRA.'},
      {find:'it help young people',cat:'grammar',note:'Subject-verb agreement: "it" is third-person singular, so "it HELPS". This same error recurs ("he learn", "it keep").'},
      {find:'good',cat:'vocab',note:'"good" is vague and repeated several times. Academic writing needs precise alternatives such as "beneficial" or "valuable".'},
      {find:'learn many things and meet many people',cat:'vocab',note:'Vague and unspecific. "many things" tells the examiner nothing — replace with concrete skills or experiences.'},
      {find:'Firstly',cat:'cohesion',note:'Mechanical list linker. Band 7+ cohesion connects ideas logically rather than numbering them "Firstly… Secondly…".'},
      {find:'Secondly',cat:'cohesion',note:'Another mechanical sequencer. The paragraph also switches to the opposite view, which undermines the writer\u2019s own opinion.'},
      {find:'it was a nice experience and he learn a lot of things',cat:'warning',note:'Weak, unsupported example: "nice" and "a lot of things" give no real evidence. A Band 7 example states what specifically changed.'},
      {find:'Also it keep them busy and away from bad habits which is good for society and for the parents too.',cat:'variety',note:'Run-on, loosely joined clauses ("and… and… which… too"). Splitting this into controlled sentences would raise both clarity and GRA.'},
      {find:'Everyone should decide by himself what is good for him.',cat:'warning',note:'The conclusion introduces a new idea ("everyone should decide") and abandons the position — it should restate one clear stance instead.'},
      {find:'In conclusion, community service have advantages and disadvantages.',cat:'tr',note:'This restates nothing concrete and contradicts an opinion task. The conclusion must reaffirm a single position, not list pros and cons.'}
    ]
  },
  changed:[
    {from:'"in my opinion this topic have two sides" — no real position.',to:'"I largely agree with this proposal" — a clear, committed stance.'},
    {from:'"it help young people … learn many things" — vague and ungrammatical.',to:'"a structured year of service can foster social responsibility" — precise and accurate.'},
    {from:'"Firstly… Secondly…" — mechanical numbering.',to:'"The most compelling reason…", "A further benefit…" — logical topic sentences.'}
  ]
},
/* 2 ───────────── DISCUSSION / BOTH VIEWS + OPINION ───────────── */
{
  type:'Discussion (Both Views + Opinion)',
  prompt:'Some people think that public libraries are no longer necessary because information is freely available online. Others believe libraries still play a vital role. Discuss both views and give your own opinion.',
  b9:{
    paras:[
      'As digital resources expand, some argue that public libraries have become obsolete, while others maintain that they remain indispensable. Having weighed both positions, I am convinced that libraries continue to serve essential functions that the internet alone cannot replace.',
      'Those who consider libraries unnecessary point to the sheer accessibility of online information. With a smartphone, almost anyone can retrieve articles, books and data within seconds, often free of charge. From this perspective, maintaining large physical buildings and paid staff can appear an inefficient use of public money, particularly when budgets are stretched and usage of printed collections is declining.',
      'Nevertheless, this view overlooks the wider social role that libraries perform. They offer a quiet, free and neutral space for study, which is invaluable to students who lack a suitable environment at home. They also bridge the digital divide by providing computers and guidance to those who cannot afford devices or reliable internet. In many communities, librarians additionally run literacy programmes and support job-seekers \u2014 services no search engine can deliver.',
      'In conclusion, although online resources have undeniably reduced reliance on printed material, I firmly believe public libraries remain vital, primarily because they guarantee equal access to knowledge and foster community learning for those the digital world leaves behind.'
    ],
    score:{band:9,
      TR:'Both views are presented fairly and in depth, and a clear personal opinion is signalled in the introduction and developed in the conclusion.',
      CC:'Excellent progression; the contrast between paragraphs is managed with "Nevertheless" and referencing ("this view"), not mechanical lists.',
      LR:'Sophisticated, accurate lexis ("indispensable", "bridge the digital divide", "neutral space").',
      GRA:'Confident range of structures, including participle and concessive clauses, with consistent accuracy.'},
    strongest:'Both sides are developed fully and fairly before a clearly justified opinion.',
    weakest:'Very minor — the first body paragraph could include one concrete example.',
    why:'It discusses both views in genuine depth, makes the writer\u2019s opinion explicit and consistent, and uses precise vocabulary and varied grammar with natural cohesion.',
    anno:[
      {find:'I am convinced that libraries continue to serve essential functions that the internet alone cannot replace',cat:'tr',note:'The writer\u2019s opinion is explicit in the introduction, as a discussion task requires — and it previews the line of argument.'},
      {find:'Those who consider libraries unnecessary point to the sheer accessibility of online information.',cat:'structure',note:'Topic sentence that fairly introduces the opposing view first — exactly the discussion-essay structure.'},
      {find:'Nevertheless, this view overlooks the wider social role that libraries perform.',cat:'cohesion',note:'"Nevertheless" + referencing "this view" pivots cleanly to the other side and links it to what came before — flexible, logical cohesion.'},
      {find:'bridge the digital divide',cat:'vocab',note:'A precise, topical collocation that compresses a whole idea (unequal access to technology) into three words.'},
      {find:'indispensable',cat:'vocab',note:'Less common, accurate word choice that lifts Lexical Resource above "really important".'},
      {find:'which is invaluable to students who lack a suitable environment at home',cat:'grammar',note:'A relative clause inside a relative idea ("which… who…") shows controlled grammatical range.'},
      {find:'although online resources have undeniably reduced reliance on printed material',cat:'variety',note:'Concessive opening to the conclusion acknowledges the other side before the final judgement — mature sentence design.'},
      {find:'I firmly believe public libraries remain vital',cat:'tr',note:'The conclusion reaffirms the same opinion stated in the introduction — consistency the examiner rewards.'},
      {find:'services no search engine can deliver',cat:'structure',note:'A short, emphatic clause that clinches the paragraph\u2019s point and links it back to the online-vs-library contrast.'}
    ]
  },
  b5:{
    paras:[
      'These days some people say libraries are not necessary anymore because we have internet and others say libraries are still important. I will discuss both of them.',
      'On one hand, internet have a lot of information and it is very easy. You can find everything in google and you don\u2019t need to go to library and waste time. Also library is expensive for government and many people don\u2019t go there nowadays because they use phone. So some people think it is not necessary anymore and the money can be use for other things like hospitals.',
      'On the other hand, library is good for students because it is quiet and they can study there. Also some people don\u2019t have computer so they go to library to use it. And the library have books and the librarian can help you to find information and this is good.',
      'In conclusion, both views have good points. Internet is easy but library is also helpful. I think both of them are important for people in different ways.'
    ],
    score:{band:5,
      TR:'Both views are mentioned but barely developed, and the opinion is vague ("both are important") rather than a clear judgement.',
      CC:'"On one hand / On the other hand" frame the paragraphs, but inside them ideas are listed and connected with repeated "and / also".',
      LR:'Informal and repetitive ("good", "easy", "a lot of"); some everyday phrasing ("waste time", "in google").',
      GRA:'Recurrent agreement and article errors ("internet have", "the money can be use", "the library have").'},
    strongest:'The essay follows a recognisable two-views structure and stays on topic.',
    weakest:'Neither side is developed and the conclusion gives no real opinion.',
    why:'It only partly answers the task: both views are thin, the opinion is non-committal, vocabulary is basic and repeated, and grammar errors are frequent.',
    problems:[
      'The opinion is non-committal ("both of them are important") — a discussion essay must judge which view is stronger.',
      'Each side is a short list joined by "and/also", with no explanation or specific example.',
      'Informal, repeated wording ("easy", "good", "waste time") and frequent grammar errors ("internet have", "can be use").'
    ],
    fixes:[
      'Commit to a clear opinion in both the introduction and conclusion.',
      'Develop each view with one explained reason and a concrete example, not a list.',
      'Replace casual phrases with academic vocabulary and fix subject-verb agreement and passive forms.'
    ],
    rewrite:{
      orig:'On the other hand, library is good for students because it is quiet and they can study there. Also some people don\u2019t have computer so they go to library to use it. And the library have books and the librarian can help you to find information and this is good.',
      better:'Supporters of libraries, however, highlight their wider social value. A library offers a quiet, free space in which students without a suitable home environment can concentrate, and it narrows the digital divide by lending computers to those who cannot afford them. Trained librarians also guide users towards reliable sources \u2014 support that an unfiltered web search rarely provides.'
    },
    anno:[
      {find:'internet have a lot of information',cat:'grammar',note:'Agreement error: "internet" is singular, so "the internet HAS". "a lot of" is also informal for academic writing.'},
      {find:'the money can be use for other things',cat:'grammar',note:'Passive form error: it must be "can be USED". Errors in basic verb forms pull GRA down to Band 5.'},
      {find:'You can find everything in google',cat:'warning',note:'Informal register and second-person "you", plus the overgeneralisation "everything". Academic essays avoid both.'},
      {find:'On one hand',cat:'cohesion',note:'A mechanical frame. It is acceptable, but the writer never develops what follows, so cohesion is only surface-level.'},
      {find:'the library have books and the librarian can help you to find information and this is good',cat:'variety',note:'Run-on chain of "and… and… and". Three points are crammed together with no development — splitting and explaining them would help.'},
      {find:'good',cat:'vocab',note:'"good" is used repeatedly as a catch-all judgement. Precise evaluation ("invaluable", "cost-effective") would raise Lexical Resource.'},
      {find:'waste time',cat:'vocab',note:'Informal collocation. A more academic phrasing would be "rather than visiting a library in person".'},
      {find:'I think both of them are important for people in different ways.',cat:'tr',note:'The opinion is vague and non-committal. A discussion conclusion must state which view the writer finds stronger and why.'},
      {find:'I will discuss both of them.',cat:'warning',note:'Announces the task mechanically and gives no opinion in the introduction, which a discussion essay needs.'}
    ]
  },
  changed:[
    {from:'"both of them are important … in different ways" — no judgement.',to:'"I firmly believe public libraries remain vital" — a clear, defended opinion.'},
    {from:'"internet have a lot of information and it is very easy" — listing.',to:'"the sheer accessibility of online information" — a developed, precise point.'},
    {from:'"the library have books and the librarian can help you and this is good" — run-on.',to:'"librarians additionally run literacy programmes and support job-seekers" — specific, controlled.'}
  ]
},
/* 3 ───────────── ADVANTAGES / DISADVANTAGES (standard) ───────────── */
{
  type:'Advantages / Disadvantages',
  prompt:'In many countries, people increasingly pay for goods and services using mobile phone apps rather than cash. What are the advantages and disadvantages of this development?',
  b9:{
    paras:[
      'In a growing number of countries, mobile payment apps are steadily replacing physical cash. While this shift brings clear practical benefits, it also carries notable risks, which this essay will examine in turn.',
      'The principal advantage of app-based payment is convenience and speed. Transactions that once required queuing for cash or counting change can now be completed in seconds with a single tap, which benefits both customers and busy retailers. Such systems also improve financial transparency, since every payment leaves a digital record that can deter tax evasion and simplify personal budgeting. In Sweden, for example, the near-disappearance of cash has made everyday commerce remarkably efficient.',
      'These gains, however, come with significant drawbacks. The most pressing is exclusion: elderly people and low-income groups who lack smartphones or bank accounts can find themselves unable to participate in a cashless economy. A further concern is security, because reliance on digital systems exposes users to fraud, data breaches and service outages. When a payment network fails, entire communities can be left temporarily unable to buy essentials.',
      'In conclusion, although mobile payment apps deliver speed and transparency, they also threaten to marginalise vulnerable groups and create new security risks. On balance, these technologies are beneficial only if accompanied by safeguards that keep cash and digital systems available side by side.'
    ],
    score:{band:9,
      TR:'Both advantages and disadvantages are addressed and developed with relevant support; the overview is appropriately neutral for a standard A/D task.',
      CC:'Clear topic sentences and smooth pivots ("These gains, however, come with…") give logical, well-signposted progression.',
      LR:'Precise lexis and collocation ("financial transparency", "marginalise vulnerable groups", "service outages").',
      GRA:'Varied, accurate structures including relative and conditional clauses; errors are negligible.'},
    strongest:'Balanced, well-developed coverage of both sides with precise vocabulary.',
    weakest:'The conclusion edges towards an opinion, which is acceptable but not required here.',
    why:'It covers both required sides in depth, supports each with explanation and example, and sustains precise vocabulary and accurate, varied grammar.',
    anno:[
      {find:'which this essay will examine in turn',cat:'tr',note:'A concise plan signpost that tells the examiner both sides will be covered — fitting a standard advantages/disadvantages task.'},
      {find:'The principal advantage of app-based payment is convenience and speed.',cat:'structure',note:'Topic sentence naming the paragraph\u2019s single focus (the advantage) before any detail.'},
      {find:'These gains, however, come with significant drawbacks.',cat:'cohesion',note:'Referencing ("These gains") plus a mid-sentence "however" links back to the advantages and pivots to the disadvantages without a mechanical opener.'},
      {find:'financial transparency',cat:'vocab',note:'A precise collocation that captures a whole idea (traceable, recorded payments) economically.'},
      {find:'marginalise vulnerable groups',cat:'vocab',note:'Accurate, formal phrasing far stronger than "be bad for poor people".'},
      {find:'since every payment leaves a digital record that can deter tax evasion and simplify personal budgeting',cat:'grammar',note:'A "since" clause followed by a relative clause ("that can deter… and simplify…") packs cause and consequence into one controlled sentence.'},
      {find:'When a payment network fails, entire communities can be left temporarily unable to buy essentials.',cat:'variety',note:'A conditional-style "When…" sentence varies the rhythm and dramatises the risk effectively.'},
      {find:'In Sweden, for example',cat:'tr',note:'A located, relevant example that grounds the advantage in a real context.'},
      {find:'these technologies are beneficial only if accompanied by safeguards',cat:'grammar',note:'Conditional structure ("only if accompanied by…") delivers a nuanced final judgement.'}
    ]
  },
  b5:{
    paras:[
      'Nowadays in many countries people use mobile apps to pay instead of cash. This essay will talk about advantages and disadvantages of this thing.',
      'There are many advantages. First, it is very fast and easy because you just use your phone and you don\u2019t need money in your pocket. Second, it is safe because you don\u2019t lose your cash and you can see all your payment in the app. Also it is modern and everyone like it because nowadays everybody have a phone and use it for everything.',
      'However there is also some disadvantage. Sometimes the app don\u2019t work or the internet is down and then you cannot pay anything which is a big problem. Also old people don\u2019t know how to use it and they prefer cash. And maybe someone can steal your information from the phone and this is dangerous for your money.',
      'In conclusion, paying by phone have advantages and disadvantages. It is fast and easy but sometimes it is dangerous. I think it is a good thing for the future but people must be careful.'
    ],
    score:{band:5,
      TR:'Both sides appear but are underdeveloped lists rather than explained points; the final opinion is not required and is loosely stated.',
      CC:'"First / Second / Also / However" sequence the text mechanically; within paragraphs, ideas are strung together with "and".',
      LR:'Basic and repetitive ("fast and easy", "modern", "a big problem"); informal tone ("this thing", "in your pocket").',
      GRA:'Frequent agreement errors ("the app don\u2019t", "everybody have", "paying… have") and run-on sentences.'},
    strongest:'It identifies real advantages and disadvantages and keeps a clear two-part shape.',
    weakest:'Points are listed and repeated rather than explained or exemplified.',
    why:'It addresses the task only at surface level: ideas are listed without development, vocabulary is basic and repetitive, and grammar errors recur.',
    problems:[
      'Advantages and disadvantages are listed ("First… Second… Also…") without explanation or any specific example.',
      'Vocabulary is basic and repeated ("fast and easy", "modern", "dangerous"), with an informal tone ("this thing").',
      'Recurrent grammar errors: "the app don\u2019t work", "everybody have a phone", "paying by phone have".'
    ],
    fixes:[
      'Choose one or two points per side and develop each with a reason and a concrete example.',
      'Replace casual, repeated words with precise collocations ("financial transparency", "service outages").',
      'Proofread for subject-verb agreement, which is the essay\u2019s most damaging recurring error.'
    ],
    rewrite:{
      orig:'There are many advantages. First, it is very fast and easy because you just use your phone and you don\u2019t need money in your pocket. Second, it is safe because you don\u2019t lose your cash and you can see all your payment in the app.',
      better:'The clearest advantage of mobile payment is its speed and convenience. Because a purchase can be completed with a single tap, customers avoid queuing for change and retailers serve people more quickly. These apps also improve financial transparency: every transaction is recorded automatically, which helps users track their spending and makes tax evasion harder.'
    },
    anno:[
      {find:'this thing',cat:'warning',note:'Vague and informal. Naming it precisely ("this development" / "cashless payment") would set an academic tone from the first line.'},
      {find:'the app don\u2019t work',cat:'grammar',note:'Agreement error: "the app DOESN\u2019T work". Such basic verb errors recur and hold the essay at Band 5.'},
      {find:'everybody have a phone',cat:'grammar',note:'Agreement error: "everybody HAS a phone". "everybody" takes a singular verb.'},
      {find:'fast and easy',cat:'vocab',note:'A basic, repeated pairing. "rapid and convenient", or simply "convenience and speed", would lift Lexical Resource.'},
      {find:'First',cat:'cohesion',note:'Mechanical numbering. Band 7+ writers use topic sentences and referencing instead of "First… Second…".'},
      {find:'everyone like it because nowadays everybody have a phone and use it for everything',cat:'variety',note:'Run-on with overgeneralisation ("everyone", "everything"). Breaking it up and qualifying the claim would strengthen control.'},
      {find:'which is a big problem',cat:'vocab',note:'"a big problem" is imprecise filler. Specify the consequence instead ("leaving customers unable to pay for essentials").'},
      {find:'paying by phone have advantages and disadvantages',cat:'grammar',note:'Agreement error: the subject "paying by phone" is singular, so "HAS advantages and disadvantages".'},
      {find:'old people don\u2019t know how to use it',cat:'tr',note:'A valid point about exclusion, but it is asserted without development — naming why (no smartphones/bank access) would earn more credit.'}
    ]
  },
  changed:[
    {from:'"it is very fast and easy" — basic and repeated.',to:'"convenience and speed" plus "financial transparency" — precise collocations.'},
    {from:'"the app don\u2019t work … which is a big problem" — error + filler.',to:'"reliance on digital systems exposes users to fraud, data breaches and service outages" — accurate and specific.'},
    {from:'"old people don\u2019t know how to use it" — asserted.',to:'"elderly people and low-income groups who lack smartphones … can find themselves unable to participate" — explained.'}
  ]
},
/* 4 ───────────── ADVANTAGES OUTWEIGH DISADVANTAGES ───────────── */
{
  type:'Advantages Outweigh Disadvantages',
  prompt:'Some companies now allow employees to work from home permanently. Do the advantages of this arrangement outweigh the disadvantages?',
  b9:{
    paras:[
      'A number of firms have begun permitting staff to work from home on a permanent basis. Although this model has genuine drawbacks, I would argue that its advantages clearly outweigh them, chiefly because it raises productivity and improves employees\u2019 quality of life.',
      'The decisive benefit of permanent home-working is the boost it gives to both output and well-being. Freed from lengthy commutes, employees reclaim hours each day that can be redirected into work or rest, which reduces burnout and absenteeism. Many also concentrate better away from a noisy office. A large technology firm that adopted permanent remote work, for instance, reported that staff completed projects faster while reporting higher job satisfaction \u2014 a combination that directly serves the company\u2019s interests.',
      'The principal disadvantage, admittedly, is weaker collaboration and a sense of isolation. Spontaneous discussions are harder to replicate online, and some employees miss the social contact of an office. However, this drawback is increasingly manageable: video tools and occasional in-person meetings can preserve teamwork, and many workers actually value the autonomy that home-working brings.',
      'In conclusion, while permanent remote work can dilute collaboration, its gains in productivity and personal well-being are far more significant, especially as technology continues to close the communication gap. The advantages, in my view, decisively outweigh the disadvantages.'
    ],
    score:{band:9,
      TR:'Delivers an explicit verdict ("advantages clearly outweigh") in the introduction, weights the stronger side, and reaffirms the judgement in the conclusion — exactly what an "outweigh" task demands.',
      CC:'Logical and balanced; the concession is signalled ("admittedly", "However") and resolved, giving smooth progression.',
      LR:'Precise, flexible lexis ("reduces burnout and absenteeism", "dilute collaboration", "close the communication gap").',
      GRA:'A confident range of structures, with concessive and participle clauses used accurately.'},
    strongest:'A clear verdict is sustained throughout, with the stronger side given more weight.',
    weakest:'Almost none at this level; the example could name the firm, but this is trivial.',
    why:'It gives a clear, consistent verdict, develops the stronger side most fully, concedes and limits the weaker side, and controls advanced vocabulary and grammar.',
    anno:[
      {find:'I would argue that its advantages clearly outweigh them',cat:'tr',note:'An "outweigh" task REQUIRES a verdict; here it is explicit in the introduction and previews the two supporting reasons.'},
      {find:'The decisive benefit of permanent home-working is the boost it gives to both output and well-being.',cat:'structure',note:'Topic sentence for the stronger side, which the writer correctly develops at greater length.'},
      {find:'The principal disadvantage, admittedly, is weaker collaboration and a sense of isolation.',cat:'structure',note:'Topic sentence that concedes the weaker side fairly before the writer limits it — mature handling of an "outweigh" essay.'},
      {find:'admittedly',cat:'cohesion',note:'A concessive signpost that acknowledges the opposing point without surrendering the position.'},
      {find:'However, this drawback is increasingly manageable',cat:'cohesion',note:'"However" + referencing "this drawback" turns the concession into support for the verdict — sophisticated cohesion.'},
      {find:'reduces burnout and absenteeism',cat:'vocab',note:'A precise workplace collocation that names two specific outcomes instead of "makes people less tired".'},
      {find:'close the communication gap',cat:'vocab',note:'An idiomatic, accurate collocation that signals strong lexical control.'},
      {find:'Freed from lengthy commutes, employees reclaim hours each day',cat:'variety',note:'A participle-clause opening ("Freed from…") varies sentence structure and front-loads the cause efficiently.'},
      {find:'decisively outweigh the disadvantages',cat:'tr',note:'The conclusion restates the verdict in the prompt\u2019s own terms ("outweigh"), confirming a consistent position.'}
    ]
  },
  b5:{
    paras:[
      'Nowadays some companies let people work from home all the time. In this essay I will write about the advantages and the disadvantages of working from home.',
      'There are some advantages of working from home. People don\u2019t need to travel to office so they save time and money for transport. Also they can stay with their family and they feel comfortable in their house. And working from home is good because you can wear what you want and make your own schedule which is nice for many people.',
      'But there are disadvantages also. When you work from home you don\u2019t see your colleagues and maybe you feel alone. Also it is easy to be lazy at home because nobody is watching you and there is many distraction like TV and bed. Some people they cannot focus and they do the work slowly.',
      'In conclusion, working from home have good things and bad things. It save time but it can be lonely and difficult to focus. In my opinion it depends on the person and the job.'
    ],
    score:{band:5,
      TR:'The essay lists advantages and disadvantages but never delivers the verdict the "outweigh" task demands; the ending ("it depends") avoids a position.',
      CC:'Sequenced with "Also / But / And", and ideas inside paragraphs are joined loosely; progression is weak.',
      LR:'Everyday vocabulary ("nice", "comfortable", "good things and bad things") and informal phrasing ("wear what you want").',
      GRA:'Errors in agreement and structure ("working from home have", "there is many distraction", "Some people they cannot focus").'},
    strongest:'It identifies sensible advantages and disadvantages and stays on topic.',
    weakest:'It dodges the "outweigh" verdict, which is the core requirement of the task.',
    why:'It answers an "outweigh" prompt without giving a verdict, lists ideas without development, and contains frequent grammar errors and informal vocabulary.',
    problems:[
      'No verdict: the prompt asks whether advantages OUTWEIGH disadvantages, but the essay ends with "it depends".',
      'Ideas are listed and joined with "and/also" instead of being explained with examples.',
      'Frequent errors ("working from home have", "there is many distraction") and a double subject ("Some people they cannot focus").'
    ],
    fixes:[
      'State in the introduction which side outweighs the other, and give that side more space.',
      'Develop the strongest advantage with a clear cause and a concrete example.',
      'Fix subject-verb agreement and remove the double subject ("people they"), then upgrade casual wording.'
    ],
    rewrite:{
      orig:'There are some advantages of working from home. People don\u2019t need to travel to office so they save time and money for transport. Also they can stay with their family and they feel comfortable in their house. And working from home is good because you can wear what you want and make your own schedule which is nice for many people.',
      better:'The strongest advantage of permanent home-working is the way it lifts both productivity and well-being. By eliminating a daily commute, employees regain hours that can go into focused work or rest, which lowers stress and sick leave. Many also concentrate more effectively away from office noise, so the arrangement benefits the company as much as the individual.'
    },
    anno:[
      {find:'In this essay I will write about the advantages and the disadvantages of working from home.',cat:'warning',note:'A memorised "I will write about…" opener that gives no verdict. An "outweigh" essay must state its position in the introduction.'},
      {find:'working from home have good things and bad things',cat:'grammar',note:'Agreement error ("home HAS") plus vague vocabulary ("good things and bad things"). Both hold the essay at Band 5.'},
      {find:'there is many distraction',cat:'grammar',note:'Two errors: "there ARE many distractionS" — the verb and the plural noun both need correcting.'},
      {find:'Some people they cannot focus',cat:'grammar',note:'Double subject: "Some people" and "they" both fill the subject slot. Use one: "Some people cannot focus".'},
      {find:'nice for many people',cat:'vocab',note:'"nice" is weak and informal. Precise evaluation ("valued by many employees") would raise Lexical Resource.'},
      {find:'Also',cat:'cohesion',note:'Repeated mechanical linker. Logical topic sentences and referencing would create smoother, higher-scoring cohesion.'},
      {find:'And working from home is good because you can wear what you want and make your own schedule which is nice for many people.',cat:'variety',note:'A run-on starting with "And" that lists three loosely connected ideas. Splitting and developing them would improve control.'},
      {find:'it depends on the person and the job',cat:'tr',note:'This avoids the required verdict. The conclusion of an "outweigh" essay must say which side wins, not "it depends".'},
      {find:'easy to be lazy at home',cat:'vocab',note:'Informal register. A more academic phrasing would be "self-discipline can be harder to maintain at home".'}
    ]
  },
  changed:[
    {from:'"it depends on the person and the job" — no verdict.',to:'"its advantages clearly outweigh them … decisively outweigh" — explicit, consistent verdict.'},
    {from:'"they save time and money for transport" — listed.',to:'"employees reclaim hours each day … which reduces burnout and absenteeism" — explained with outcomes.'},
    {from:'"there is many distraction like TV and bed" — error + casual.',to:'"weaker collaboration and a sense of isolation … increasingly manageable" — accurate and developed.'}
  ]
},
/* 5 ───────────── PROBLEM / SOLUTION ───────────── */
{
  type:'Problem / Solution',
  prompt:'Traffic congestion is a serious problem in many large cities. What are the main causes of this problem, and what measures could be taken to solve it?',
  b9:{
    paras:[
      'Severe traffic congestion has become a defining problem of modern urban life. This essay will first examine its principal causes and then propose practical measures that could ease it.',
      'The root of the problem lies chiefly in over-reliance on private cars. As cities expand and incomes rise, more households purchase vehicles, yet road networks rarely grow at the same pace, so streets become saturated. This pressure is intensified by inadequate public transport: where buses and trains are slow, crowded or unreliable, commuters understandably prefer the relative comfort of driving, even at the cost of long delays.',
      'Several measures could meaningfully reduce this congestion. The most effective is sustained investment in efficient public transport, since fast, affordable metro and bus networks give people a genuine alternative to the car. This can be reinforced by congestion charging, which discourages unnecessary journeys into city centres while raising revenue for further improvements. London\u2019s congestion charge, for example, noticeably cut traffic in its central zone. Encouraging cycling and flexible working hours would further spread demand across the day.',
      'In conclusion, urban congestion stems largely from car dependence and weak public transport, but it can be tackled through coordinated investment, pricing and demand-management measures. With sustained political commitment, even the most gridlocked cities could move far more freely.'
    ],
    score:{band:9,
      TR:'Causes and solutions are both addressed and developed, and crucially the solutions match the causes raised — the hallmark of a strong problem/solution essay.',
      CC:'Clear cause-paragraph then solution-paragraph structure, linked by referencing ("This pressure", "this congestion").',
      LR:'Precise, topical lexis ("road networks rarely grow at the same pace", "congestion charging", "demand-management measures").',
      GRA:'A wide range of accurate complex sentences, including subordinate and relative clauses.'},
    strongest:'Solutions are specific, feasible and directly tied to the stated causes.',
    weakest:'Negligible; an additional example in the cause paragraph would be a minor enhancement.',
    why:'It fully answers both parts of the prompt, links solutions logically to causes, and sustains precise vocabulary and varied, accurate grammar.',
    anno:[
      {find:'This essay will first examine its principal causes and then propose practical measures that could ease it.',cat:'tr',note:'A clear plan that promises BOTH required parts — causes and solutions — which the essay then delivers in order.'},
      {find:'The root of the problem lies chiefly in over-reliance on private cars.',cat:'structure',note:'Topic sentence that names the main cause before explaining it — focused paragraph design.'},
      {find:'Several measures could meaningfully reduce this congestion.',cat:'structure',note:'Topic sentence that pivots from causes to solutions, with referencing ("this congestion") linking back.'},
      {find:'This pressure is intensified by inadequate public transport',cat:'cohesion',note:'"This pressure" refers back to the previous sentence, building a cause-and-effect chain rather than a list.'},
      {find:'congestion charging',cat:'vocab',note:'A precise, topic-specific term that shows command of the subject\u2019s lexis.'},
      {find:'demand-management measures',cat:'vocab',note:'Sophisticated noun phrase that compresses several solutions into one accurate label.'},
      {find:'where buses and trains are slow, crowded or unreliable, commuters understandably prefer the relative comfort of driving',cat:'grammar',note:'A subordinate "where…" clause sets up a condition and consequence inside one well-controlled sentence.'},
      {find:'London\u2019s congestion charge, for example, noticeably cut traffic in its central zone.',cat:'tr',note:'A specific, located example that proves the proposed solution can work — strong support for Task Response.'},
      {find:'it can be tackled through coordinated investment, pricing and demand-management measures',cat:'structure',note:'The conclusion summarises the solutions in a parallel list, mirroring the body and reinforcing coherence.'}
    ]
  },
  b5:{
    paras:[
      'Traffic is a big problem in many cities today and everybody know it. In this essay I will explain the causes and also the solutions for this problem.',
      'There are many causes for traffic. The first cause is that there is too many cars because everyone want to buy a car nowadays and the roads are small and old. Another cause is the people don\u2019t like to use the bus because it is slow and crowded and sometimes it is late. Also in the morning everybody go to work in the same time so the road is full and you wait a lot.',
      'For the solutions, the government must do something. They can build more roads so the cars can move better. Also they can make the bus better and cheaper so people will use it. And the people should share the car with friends to reduce the traffic. These solutions can help to solve this big problem in the city.',
      'In conclusion, traffic is caused by many cars and bad public transport. The government must build roads and improve the bus. If everybody help, the traffic problem will be solved.'
    ],
    score:{band:5,
      TR:'Causes and solutions are both present but thin; one solution ("build more roads") actually contradicts the cause it claims to fix.',
      CC:'Mechanical sequencing ("The first cause… Another cause… Also…") and "and"-linked clauses give weak progression.',
      LR:'Basic and repetitive ("big problem", "too many cars", "do something"); informal tone ("a lot").',
      GRA:'Recurrent agreement errors ("everybody know", "everyone want", "everybody go") and run-on sentences.'},
    strongest:'It follows a clear cause-then-solution structure and stays on topic.',
    weakest:'Solutions are generic, and building more roads does not match the "too many cars" cause.',
    why:'It addresses both parts only superficially, offers a contradictory solution, repeats basic words, and shows frequent subject-verb agreement errors.',
    problems:[
      'Solutions are generic ("the government must do something"), and "build more roads" does not solve the stated cause of too many cars.',
      'Causes are listed and joined with "and", with no explanation or example.',
      'Repeated agreement errors ("everybody know", "everyone want", "everybody go") and informal wording ("a lot").'
    ],
    fixes:[
      'Make solutions specific and ensure each one matches a cause you raised (e.g. better public transport for car-dependence).',
      'Develop one cause and one solution with explanation and a concrete example such as congestion charging.',
      'Fix the recurring agreement errors with indefinite pronouns ("everybody knowS").'
    ],
    rewrite:{
      orig:'For the solutions, the government must do something. They can build more roads so the cars can move better. Also they can make the bus better and cheaper so people will use it. And the people should share the car with friends to reduce the traffic.',
      better:'The most effective solution is sustained investment in fast, affordable public transport, which gives commuters a genuine alternative to the private car. This could be reinforced by congestion charging in city centres, a measure that discourages unnecessary journeys and funds further improvements. London\u2019s congestion charge, for instance, noticeably reduced central traffic.'
    },
    anno:[
      {find:'everybody know it',cat:'grammar',note:'Agreement error: "everybody KNOWS it". The same error repeats with "everyone want" and "everybody go".'},
      {find:'In this essay I will explain the causes and also the solutions for this problem.',cat:'warning',note:'A memorised, mechanical opener. It states the plan but adds nothing — the introduction could paraphrase the topic instead.'},
      {find:'too many cars',cat:'vocab',note:'A basic phrase. "over-reliance on private vehicles" would be more precise and academic.'},
      {find:'They can build more roads so the cars can move better.',cat:'warning',note:'This solution contradicts the cause: if the problem is too many cars, building roads tends to attract even more traffic. Solutions must match causes.'},
      {find:'The first cause',cat:'cohesion',note:'Mechanical numbering of causes. A topic sentence plus referencing would read as more controlled cohesion.'},
      {find:'do something',cat:'vocab',note:'Vague filler. Name the specific measure ("invest in public transport", "introduce congestion charging").'},
      {find:'Also in the morning everybody go to work in the same time so the road is full and you wait a lot.',cat:'variety',note:'Run-on joined by "so… and" with informal "a lot". Splitting it and adding "at the same time" (not "in") would help.'},
      {find:'the people don\u2019t like to use the bus because it is slow and crowded and sometimes it is late',cat:'variety',note:'Loosely chained clauses ("and… and"). This is a usable point but needs tighter, more varied sentence control.'},
      {find:'If everybody help, the traffic problem will be solved.',cat:'grammar',note:'Conditional with an agreement slip ("everybody helpS") and an over-optimistic claim that the problem "will be solved".'}
    ]
  },
  changed:[
    {from:'"there is too many cars" — basic and ungrammatical.',to:'"over-reliance on private cars … road networks rarely grow at the same pace" — precise and explained.'},
    {from:'"build more roads so the cars can move better" — contradicts the cause.',to:'"sustained investment in efficient public transport … congestion charging" — solutions that match the causes.'},
    {from:'"the government must do something" — vague.',to:'"coordinated investment, pricing and demand-management measures" — specific and feasible.'}
  ]
},
/* 6 ───────────── DIRECT QUESTIONS / TWO-PART ───────────── */
{
  type:'Direct Questions / Two-Part',
  prompt:'In many countries, people now get their news from online sources rather than printed newspapers. Why has this shift happened, and is it a positive or negative development?',
  b9:{
    paras:[
      'Across the world, online platforms have largely displaced printed newspapers as the public\u2019s main source of news. This essay will explain why this change has occurred and argue that, despite some risks, it is on balance a positive development.',
      'The shift is driven primarily by convenience and cost. Online news is instantly accessible on any smartphone, updates continuously, and is usually free, whereas printed papers are slower, less current and must be paid for. Younger readers in particular have grown up expecting information on demand, so they naturally gravitate towards digital sources. The economics reinforce this trend, as advertising revenue has migrated online, leaving traditional print increasingly unsustainable.',
      'On balance, I regard this development as beneficial. Digital news democratises access to information, allowing people in remote or low-income areas to stay informed at little cost, and it lets readers compare multiple perspectives within seconds. There is, admittedly, a real danger of misinformation spreading rapidly online. Yet this risk can be mitigated through media-literacy education and fact-checking services, rather than by clinging to print.',
      'In conclusion, the move towards online news stems mainly from its speed, accessibility and lower cost. While the spread of unreliable content is a genuine concern, the broader gains in access and choice mean that, overall, this is a positive change for society.'
    ],
    score:{band:9,
      TR:'Both questions are answered directly and given roughly equal weight: a developed "why", then a clearly argued "positive or negative" verdict.',
      CC:'Strong topic sentences and natural concession ("admittedly", "Yet") produce logical, well-managed flow.',
      LR:'Precise, flexible vocabulary ("democratises access to information", "increasingly unsustainable", "media-literacy education").',
      GRA:'A confident range of accurate structures, including contrast and concessive clauses.'},
    strongest:'Both parts are answered fully and the verdict is clearly argued, not merely asserted.',
    weakest:'Very little; the "why" paragraph is already well-developed.',
    why:'It answers both direct questions in depth and with balance, takes a clear evaluative stance, and sustains advanced vocabulary and grammar with smooth cohesion.',
    anno:[
      {find:'This essay will explain why this change has occurred and argue that, despite some risks, it is on balance a positive development.',cat:'tr',note:'The plan answers BOTH questions in the prompt — the "why" and the "positive or negative" — and previews the verdict.'},
      {find:'The shift is driven primarily by convenience and cost.',cat:'structure',note:'Topic sentence answering the first question ("why") directly and naming the two reasons it will develop.'},
      {find:'On balance, I regard this development as beneficial.',cat:'structure',note:'Topic sentence answering the second question ("positive or negative") with an explicit verdict.'},
      {find:'democratises access to information',cat:'vocab',note:'A precise, slightly formal verb + collocation that captures a whole idea (wider, fairer access) economically.'},
      {find:'increasingly unsustainable',cat:'vocab',note:'Accurate, less common phrasing that lifts Lexical Resource above "harder to keep going".'},
      {find:'whereas printed papers are slower, less current and must be paid for',cat:'grammar',note:'A "whereas" contrast clause balances digital against print inside one controlled sentence — strong grammatical range.'},
      {find:'There is, admittedly, a real danger of misinformation spreading rapidly online.',cat:'variety',note:'A concession sentence with mid-clause "admittedly" varies rhythm and shows the writer weighing the downside fairly.'},
      {find:'Yet this risk can be mitigated through media-literacy education and fact-checking services',cat:'cohesion',note:'"Yet" + referencing "this risk" answers the concession and keeps the verdict intact — cohesion through logic, not labels.'},
      {find:'the broader gains in access and choice',cat:'tr',note:'The conclusion synthesises both answers and reaffirms the verdict without adding new ideas.'}
    ]
  },
  b5:{
    paras:[
      'Nowadays most people read the news in internet and not in the newspaper like before. There are reasons for this and I will say if it is positive or negative.',
      'The reason for this is because internet is very fast and easy. You can read the news in your phone anytime and anywhere and it is free, but the newspaper you must buy it and it come one time in the day. Also young people they like the phone more than paper and they don\u2019t want to read newspaper because it is old fashion. So this is why people use internet for news now.',
      'I think this is positive and negative both. It is positive because it is fast and free and everybody can read it. But it is negative because in internet there is many fake news and people believe it and this is dangerous. Sometimes you don\u2019t know if the news is true or not.',
      'In conclusion, people read news online because it is fast and free. It have good points and bad points but in my opinion it is more positive than negative.'
    ],
    score:{band:5,
      TR:'Both questions are touched on, but the "why" is thin and the verdict wavers ("positive and negative both") before a late, weak decision.',
      CC:'Linked mainly by "and / but / also"; ideas are listed and the second question is underdeveloped.',
      LR:'Basic and informal ("fast and easy", "old fashion", "good points and bad points").',
      GRA:'Errors in prepositions and agreement ("in internet", "it come one time", "it have", "young people they").'},
    strongest:'It recognises that the task has two parts and attempts both.',
    weakest:'The verdict is contradictory for most of the essay and only decided at the very end.',
    why:'It answers both parts only partly, gives a wavering verdict, relies on basic repeated vocabulary, and contains frequent preposition and agreement errors.',
    problems:[
      'The verdict wavers ("positive and negative both") and is only settled in the final line.',
      'The "why" is a short list ("fast and easy … free") with no real explanation or example.',
      'Frequent errors: "in internet" (should be "on the internet"), "it come one time", "it have", and the double subject "young people they".'
    ],
    fixes:[
      'Decide the verdict in the introduction and keep it consistent throughout.',
      'Develop the "why" with explained reasons (cost, instant access, advertising moving online).',
      'Correct prepositions ("on the internet") and agreement, and remove the double subject ("young people they like").'
    ],
    rewrite:{
      orig:'The reason for this is because internet is very fast and easy. You can read the news in your phone anytime and anywhere and it is free, but the newspaper you must buy it and it come one time in the day. Also young people they like the phone more than paper.',
      better:'This shift is driven mainly by convenience and cost. Online news is available instantly on any smartphone, updates throughout the day, and is usually free, whereas a printed paper must be bought and is published only once daily. Younger readers, who have grown up expecting information on demand, therefore gravitate naturally towards digital sources.'
    },
    anno:[
      {find:'read the news in internet',cat:'grammar',note:'Preposition error: it should be "ON the internet". This recurs ("in your phone" \u2192 "on your phone") and limits accuracy.'},
      {find:'it come one time in the day',cat:'grammar',note:'Agreement and phrasing error: "it COMES once a day". Basic verb errors like this hold GRA at Band 5.'},
      {find:'young people they like the phone more than paper',cat:'grammar',note:'Double subject: "young people" and "they" both fill the subject. Use one: "young people like the phone…".'},
      {find:'fast and easy',cat:'vocab',note:'A basic, repeated pairing. "convenience and speed" or "instantly accessible" would lift Lexical Resource.'},
      {find:'old fashion',cat:'vocab',note:'Wrong form and informal: the phrase is "old-fashioned". Word-formation slips like this lower the lexis score.'},
      {find:'I think this is positive and negative both.',cat:'warning',note:'The second question asks for a clear verdict; sitting on the fence weakens Task Response until the very last line.'},
      {find:'in internet there is many fake news and people believe it and this is dangerous',cat:'variety',note:'Run-on with errors ("in internet", "there is many"). Splitting it and adding "and fact-check" advice would strengthen it.'},
      {find:'It have good points and bad points',cat:'vocab',note:'Vague and ungrammatical: "It HAS advantages and disadvantages". The phrase tells the examiner nothing specific.'},
      {find:'So this is why people use internet for news now.',cat:'cohesion',note:'A weak, conversational closer to the paragraph. A topic-linked sentence would read as more academic.'}
    ]
  },
  changed:[
    {from:'"positive and negative both" — no clear verdict until the end.',to:'"it is on balance a positive development" — a verdict stated up front and sustained.'},
    {from:'"internet is very fast and easy … it is free" — listed.',to:'"driven primarily by convenience and cost … advertising revenue has migrated online" — explained.'},
    {from:'"in internet there is many fake news … this is dangerous" — error-filled.',to:'"a real danger of misinformation … can be mitigated through media-literacy education" — accurate and balanced.'}
  ]
}
];

  /* ---------- Band Upgrade Map (verbatim) ---------- */
const UPGRADES=[
  {b5:'Many people think technology is good for students because it help them study.',
   b9:'Technology can support learning when it is used purposefully, since it gives students access to interactive resources and immediate feedback.',
   points:['"good" \u2192 "support learning" (a precise mechanism, not a vague judgement)','"help them study" becomes a specific reason ("interactive resources and immediate feedback")','Grammar corrected: "it help" \u2192 "it gives"','Tone becomes academic and the claim is qualified ("when it is used purposefully")']},
  {b5:'Pollution is a big problem and it is bad for people and the environment.',
   b9:'Air pollution poses a serious threat to public health and accelerates environmental degradation.',
   points:['"big problem" \u2192 "poses a serious threat" (a strong collocation)','"bad for people" \u2192 "threat to public health" (precise)','"bad for the environment" \u2192 "accelerates environmental degradation"','Two vague clauses become one controlled, formal sentence']},
  {b5:'The government should give more money to schools because education is important.',
   b9:'Greater public investment in education is essential, as a well-educated workforce underpins long-term economic growth.',
   points:['"give more money" \u2192 "greater public investment" (academic noun phrase)','"important" is replaced by a reason ("underpins long-term economic growth")','Adds a clear cause-effect link with "as"','The claim is justified, not just asserted']},
  {b5:'Nowadays technology is very important and everyone use it every day and it make life easy.',
   b9:'Technology has become deeply embedded in daily life, streamlining countless everyday tasks.',
   points:['Run-on of three clauses becomes one tight sentence','Agreement errors fixed ("everyone use" \u2192 implied "people"; "it make" \u2192 "streamlining")','"very important" \u2192 "deeply embedded in daily life"','"make life easy" \u2192 "streamlining countless everyday tasks" (precise verb)']},
  {b5:'A lot of people are getting fat because they eat fast food and don\u2019t do sport.',
   b9:'Rising obesity rates are largely attributable to poor diet and increasingly sedentary lifestyles.',
   points:['"getting fat" \u2192 "rising obesity rates" (formal register)','"because" \u2192 "largely attributable to" (academic cause language)','"don\u2019t do sport" \u2192 "increasingly sedentary lifestyles"','The sentence is depersonalised and made objective']},
  {b5:'Cars make a lot of pollution in the city and this is not good.',
   b9:'Private vehicles are a major source of urban emissions, with serious consequences for air quality.',
   points:['"make a lot of pollution" \u2192 "a major source of urban emissions"','"this is not good" \u2192 a specific consequence ("for air quality")','Adds a precise noun phrase ("urban emissions")','Eliminates the vague evaluation "not good"']},
  {b5:'Social media is good because you can talk to your friends and family far away.',
   b9:'Social media sustains relationships across distance, enabling people to maintain regular contact with friends and family abroad.',
   points:['"good" \u2192 "sustains relationships across distance" (a clear function)','"talk to" \u2192 "maintain regular contact" (collocation)','Adds precision: "across distance", "abroad"','The benefit is named as a mechanism, not just labelled "good"']},
  {b5:'If we don\u2019t do something, the problem of climate change will be very bad in the future.',
   b9:'Without decisive action, the long-term consequences of climate change are likely to be severe.',
   points:['"do something" \u2192 "decisive action" (precise noun phrase)','"very bad" \u2192 "severe" with "long-term consequences"','"will be" \u2192 "are likely to be" (appropriately hedged)','The sentence becomes formal and measured']},
  {b5:'Firstly, it saves money. Secondly, it saves time. Moreover, it is also good.',
   b9:'Beyond the obvious savings in both money and time, the approach offers a further practical benefit.',
   points:['Mechanical "Firstly\u2026 Secondly\u2026 Moreover" replaced by integrated phrasing','Two points are combined smoothly ("both money and time")','"good" \u2192 "a further practical benefit" (specific)','Cohesion now flows through meaning, not labels']},
  {b5:'Many tourists come to the city and it cause a lot of problems for the people who live there.',
   b9:'Mass tourism places considerable strain on local residents, from overcrowding to rising living costs.',
   points:['"a lot of problems" \u2192 named examples ("overcrowding", "rising living costs")','"it cause" agreement error \u2192 "places considerable strain"','"the people who live there" \u2192 "local residents" (concise)','The claim becomes specific and supported']},
  {b5:'Working from home is nice because you are comfortable and you don\u2019t travel.',
   b9:'Home-working enhances well-being by eliminating the daily commute and allowing a more comfortable working environment.',
   points:['"nice" \u2192 "enhances well-being" (precise outcome)','"don\u2019t travel" \u2192 "eliminating the daily commute" (collocation)','Second-person "you" removed for an academic register','Two casual reasons become one developed, formal sentence']},
  {b5:'The old people cannot use the new technology and this is a problem for them.',
   b9:'Elderly citizens often struggle to adopt new technology, which risks excluding them from increasingly digital services.',
   points:['"the old people" \u2192 "elderly citizens" (correct, formal)','"cannot use" \u2192 "struggle to adopt" (collocation)','"this is a problem" \u2192 a specific consequence ("excluding them from\u2026 services")','Adds a relative clause for grammatical range']},
  {b5:'Public transport is good for the city because less cars means less pollution.',
   b9:'Efficient public transport benefits cities by reducing private-car use and, in turn, lowering harmful emissions.',
   points:['"good for the city" \u2192 "benefits cities" with a stated mechanism','"less cars" \u2192 "reducing private-car use" (grammatically correct; "fewer")','"less pollution" \u2192 "lowering harmful emissions" (precise)','"in turn" adds a clear cause-effect chain']}
];

  return {
    SECTIONS: SECTIONS, WARMUP: WARMUP, LENS: LENS, TYPES: TYPES,
    TYPE_PROMPTS: TYPE_PROMPTS, LAYOUTS: LAYOUTS, INTRO: INTRO,
    PEEL_ORDER: PEEL_ORDER, PEEL_MISSING: PEEL_MISSING, PEEL_EXPAND: PEEL_EXPAND,
    COHESION: COHESION, CONC: CONC, LAYERS: LAYERS, ESSAYS: ESSAYS, UPGRADES: UPGRADES
  };
})();

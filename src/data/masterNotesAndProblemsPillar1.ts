import {
  SolvedCompanyProblem,
  TrackLiveNotes,
} from './masterUniverseTypes';

export const PILLAR1_LIVE_NOTES: Partial<Record<string, TrackLiveNotes>> = {
  aptitude: {
    trackId: 'aptitude',
    headline: 'Quantitative & Logical Aptitude — Rapid Screening Cheat Sheet',
    quickSummary:
      'Screening rounds at TCS NQT, Wipro, Capgemini, Cognizant, and Amazon test speed and elimination, not textbook algebra. Convert percentages to fractions and solve Time & Work via LCM units.',
    coreBullets: [
      {
        title: 'Fraction-Percentage Ladder',
        point: 'Memorize 1/6 = 16.67%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/12 = 8.33% to slash calculation time in half.',
      },
      {
        title: 'Successive Change Formula',
        point: 'Net % = a + b + (ab / 100). An increase of x% followed by x% decrease ALWAYS gives a net loss of x²/100%.',
      },
      {
        title: 'LCM Method for Time & Work',
        point: 'Assume Total Work = LCM(days). Daily efficiency = Work / Days. Eliminates messy fractions completely.',
      },
      {
        title: 'Relative Speed & Trains',
        point: 'Opposite direction → add speeds; same direction → subtract. Convert km/hr to m/s via × 5/18.',
      },
      {
        title: 'Permutation vs Combination',
        point: 'Order matters → nPr (arrangement, passwords). Order does NOT matter → nCr (teams, handshakes).',
      },
    ],
    goldenShortcuts: [
      'Average speed for equal distances = 2xy / (x + y), NEVER (x + y) / 2.',
      'For "At least one" probability questions, ALWAYS solve 1 − P(none).',
      'In Profit/Loss, discount is always on Marked Price (MP); profit/loss is always on Cost Price (CP).',
    ],
    commonTraps: [
      'Taking simple arithmetic mean of two speeds instead of harmonic mean.',
      'Forgetting to add BOTH train lengths when one train crosses another.',
      'Confusing "A is 25% more than B" with "B is 25% less than A" (actual: 20% less).',
    ],
    mentorKapilTips: [
      'In TCS NQT and Capgemini tests, spend max 60 seconds per question—if stuck, substitute answer options backwards!',
      'Write units beside every number (m/s vs km/hr); 40% of aptitude mistakes are pure unit slips.',
      'Never use long equations when assuming Total = 100 or Total Work = LCM solves it in 3 mental lines.',
    ],
  },
  grammar: {
    trackId: 'grammar',
    headline: 'English Grammar Foundations — High-Yield Error Spotting Notes',
    quickSummary:
      '80% of placement verbal error-spotting questions from TCS, Wipro, Cognizant, and Tech Mahindra come from 5 repeat patterns: Subject-Verb traps, Conditionals, Modifiers, Pronouns, and Parallelism.',
    coreBullets: [
      {
        title: 'True Subject Isolation',
        point: 'Ignore phrases starting with "as well as", "along with", "together with", and "in addition to"—match the verb strictly to the FIRST subject.',
      },
      {
        title: 'Proximity Rule (Neither…nor / Either…or)',
        point: 'The verb agrees with the subject CLOSEST to the verb (e.g., "Neither the lead nor the interns ARE ready").',
      },
      {
        title: 'The 3 Placement Conditionals',
        point: 'Type 1: If + Present, will + V1. Type 2: If + Past/were, would + V1. Type 3: If + had + V3, would have + V3.',
      },
      {
        title: 'Dangling Modifiers',
        point: 'An introductory -ing/-ed phrase MUST immediately precede the person/thing performing that action.',
      },
      {
        title: 'Pronoun Case & Reflexives',
        point: 'Use object pronouns after prepositions ("between you and ME"). Never start an intro with "Myself Rahul".',
      },
    ],
    goldenShortcuts: [
      '"One of the + PLURAL noun + SINGULAR verb" (e.g., "One of the developers HAS pushed the fix").',
      '"Each / Every / Everyone / Neither" ALWAYS takes a singular verb.',
      'Never pair "would have" inside the IF-clause ("If I had studied…" NOT "If I would have studied…").',
    ],
    commonTraps: [
      'Using "less" with countable nouns ("fewer bugs", NOT "less bugs").',
      'Double negatives like "scarcely…not" or "hardly…never" ("Hardly had…when" is the exact pair).',
      'Misusing "since" (point in time) vs "for" (duration of time).',
    ],
    mentorKapilTips: [
      'When spotting errors in Wipro or Cognizant tests, read the sentence stripping out every prepositional phrase in your head—the verb mismatch pops out immediately.',
      'Check correlative pairs first: Not only…but also, Hardly…when, No sooner…than, Scarcely…when.',
      'In HR interviews, crisp Subject-Verb agreement signals executive polish before your technical round even begins.',
    ],
  },
  parts_of_speech: {
    trackId: 'parts_of_speech',
    headline: 'Parts of Speech — Functional Identification Cheat Sheet',
    quickSummary:
      'In placement verbal tests, a single English word can switch parts of speech depending on its role in the sentence ("fast" can be noun, verb, adjective, or adverb). Always test FUNCTION, not spelling.',
    coreBullets: [
      {
        title: 'Gerund vs Present Participle',
        point: 'Both end in -ing. If it acts as a NOUN (can replace with "it"), it is a Gerund; if it describes a noun, it is a Participle.',
      },
      {
        title: 'Adjective vs Adverb',
        point: 'Adjectives modify nouns/pronouns ("quick fix"); adverbs modify verbs, adjectives, or other adverbs ("fixed quickly").',
      },
      {
        title: 'Linking Verbs Take Adjectives',
        point: 'After feel, seem, look, sound, taste, remain → use an ADJECTIVE ("The API looks stable", NOT "stably").',
      },
      {
        title: 'Preposition vs Conjunction',
        point: 'Prepositions take a noun/phrase ("despite the delay"); conjunctions link clauses with a verb ("although it was delayed").',
      },
      {
        title: 'Pronoun Reference Clarity',
        point: 'Every pronoun (it, they, which) must point cleanly to one unambiguous antecedent noun.',
      },
    ],
    goldenShortcuts: [
      'Substitution test: If "it/something" fits cleanly in the slot → Noun / Gerund.',
      'Linking-verb test: Replace verb with "is" — if it still makes sense, follow it with an Adjective.',
      'Not every -ly word is an adverb: "friendly", "costly", "timely", "elderly" are ADJECTIVES!',
    ],
    commonTraps: [
      'Calling "fastly" an adverb ("fast" is already both adjective and adverb; "fastly" does not exist).',
      'Using "despite of" — correct forms are "despite" OR "in spite of", never combined.',
      'Confusing "who" (subject: he/she) vs "whom" (object: him/her).',
    ],
    mentorKapilTips: [
      'TCS, Capgemini, and Infosys love asking the Part of Speech of underlined words like "round", "before", "still", and "running". Always ask: "What word does it modify?"',
      'Memorize "friendly / timely / costly" as adjectives so you say "in a timely manner" instead of misusing them.',
      'Strong verb choices ("architected", "optimized", "automated") beat weak adverb-verb combos on your resume every time.',
    ],
  },
  parts_of_grammar: {
    trackId: 'parts_of_grammar',
    headline: 'Parts of Grammar & Syntax — Clauses, Phrases & Parallelism',
    quickSummary:
      'Sentence-correction and para-jumble rounds test whether you can separate Phrases from Clauses, join clauses cleanly without fragments or run-ons, and keep parallel structures symmetrical.',
    coreBullets: [
      {
        title: 'Phrase vs Clause',
        point: 'A Phrase lacks a finite subject-verb pair ("in the cloud"); a Clause contains both Subject + Finite Verb.',
      },
      {
        title: '3 Core Sentence Architectures',
        point: 'Simple (1 IC), Compound (2+ ICs joined by FANBOYS or semicolon), Complex (1 IC + 1+ Dependent Clause).',
      },
      {
        title: '3 Types of Dependent Clauses',
        point: 'Noun Clause (acts as subject/object), Adjective/Relative Clause (describes noun), Adverb Clause (shows time/reason/condition).',
      },
      {
        title: 'Parallelism Symmetry',
        point: 'Items in a list or comparison MUST share the exact grammatical form (all nouns, all gerunds, or all infinitives).',
      },
      {
        title: 'Active vs Passive Precision',
        point: 'Prefer Active Voice for impact and clarity; use Passive Voice when the action or object matters more than the doer.',
      },
    ],
    goldenShortcuts: [
      'FANBOYS = For, And, Nor, But, Or, Yet, So — use comma + FANBOYS to join two independent clauses.',
      'Remove the phrase after "that/which/who" to spot whether a clause is essential or removable.',
      'For resume bullets, check parallelism: "Designed X, built Y, and deployed Z" (all past-tense action verbs).',
    ],
    commonTraps: [
      'Writing a Dependent Clause alone as a sentence fragment ("Although the latency dropped by 40%.").',
      'Breaking parallelism in "not only…but also" structures.',
      'Comparing apples to oranges ("The latency of Go is lower than Python" → "...than THAT OF Python").',
    ],
    mentorKapilTips: [
      'Amazon Leadership Principle essays and Deloitte writing rounds judge sentence clarity above fancy vocabulary—master Complex-Compound balance.',
      'In sentence improvement MCQs, always verify BOTH halves of a comparison ("those of" / "that of") first.',
      'Keep executive emails to 15–22 words per sentence so managers grasp your point in one scan.',
    ],
  },
  tenses: {
    trackId: 'tenses',
    headline: 'All 12 English Tenses — Placement Timeline & Trigger Guide',
    quickSummary:
      'Every tense error in TCS, Wipro, Cognizant, Infosys, and Tech Mahindra rounds comes down to time markers ("yesterday" vs "since") and event sequencing (Past Perfect for the earlier of two past events).',
    coreBullets: [
      {
        title: 'Simple Past vs Present Perfect',
        point: 'Finished past time marker (yesterday, in 2023, ago) → Simple Past (V2). Unfinished/present link (since, for, yet, already) → Present Perfect (has/have + V3).',
      },
      {
        title: 'Past Perfect = Earlier of Two Past Actions',
        point: 'When two actions happened in the past, the EARLIER one uses had + V3; the LATER one uses Simple Past (V2).',
      },
      {
        title: 'Stative Verbs Ban -ing',
        point: 'Verbs of state (know, own, belong, believe, understand, prefer, contain) do NOT take continuous tenses ("I know", NOT "I am knowing").',
      },
      {
        title: 'Present Perfect Continuous',
        point: 'Action started in the past and is STILL continuing now → has/have been + V-ing + since/for.',
      },
      {
        title: 'Time-Clause Future Ban',
        point: 'Never use "will" inside if/when/until/before/as soon as clauses: "I will ping you when the build FINISHES."',
      },
    ],
    goldenShortcuts: [
      '"It is high time + Subject + V2" (e.g., "It is high time we UPGRADED the API").',
      '"By + future time" (by Friday / by 2027) → Future Perfect (will have + V3).',
      'Reported speech with past reporting verb ("said"): V1→V2, has/have+V3→had+V3, will→would.',
    ],
    commonTraps: [
      'Saying "I am working here since 2022" (Fix: "I have been working here since 2022").',
      'Saying "I have graduated in 2024" (Fix: "I graduated in 2024" because 2024 is a finished past marker).',
      'Using Past Perfect for a single standalone past event with no second reference event.',
    ],
    mentorKapilTips: [
      'In your "Tell me about yourself" interview intro, use Simple Past for finished projects ("I built…"), Present Perfect for skills/impact ("I have solved 300+ DSA problems"), and Present Simple for strengths.',
      'Spot "since / for" in any MCQ? Immediately eliminate Simple Present and Present Continuous options!',
      'Memorize "It is high time + V2" and "By next month + will have V3"—both appear almost every placement season.',
    ],
  },
  punctuation: {
    trackId: 'punctuation',
    headline: 'Punctuation & Executive Writing — Zero-Mistake Playbook',
    quickSummary:
      'Clean punctuation makes your resume, cover letter, Amazon writing sample, and Cognizant/Capgemini verbal answers immediately trustworthy. Master commas, semicolons, colons, apostrophes, and hyphens.',
    coreBullets: [
      {
        title: 'No Comma Splices',
        point: 'Never join two independent clauses with only a comma. Use a period, semicolon (;), or comma + FANBOYS.',
      },
      {
        title: 'Semicolon vs Colon',
        point: 'Semicolon (;) links two closely related complete clauses (or complex list items). Colon (:) follows a complete clause to introduce a list, rule, or punchline.',
      },
      {
        title: 'Apostrophe Precision',
        point: 'it’s = it is; its = belonging to it. Singular possessive: engineer’s; plural possessive: engineers’. Never use apostrophes for plain plurals (APIs, 1990s).',
      },
      {
        title: 'Hyphens for Compound Modifiers',
        point: 'Hyphenate multi-word modifiers BEFORE a noun ("data-driven strategy"), NEVER hyphenate -ly adverbs ("highly scalable").',
      },
      {
        title: 'Restrictive vs Non-Restrictive Commas',
        point: 'Essential clauses take NO commas ("Engineers who test code ship safely"); extra side-info gets paired commas.',
      },
    ],
    goldenShortcuts: [
      'Conjunctive adverb rule: Clause 1 ; however, Clause 2.',
      'Never place a colon directly after a verb ("are:", "include:") or preposition ("such as:").',
      'Oxford comma ("A, B, and C") eliminates costly ambiguity in business contracts and resumes.',
    ],
    commonTraps: [
      'Writing "API’s" or "KPI’s" for simple plurals (correct: APIs, KPIs).',
      'Using a single comma to separate a subject from its verb.',
      'Confusing a hyphen (-) with an em-dash (—) used for dramatic parenthetical emphasis.',
    ],
    mentorKapilTips: [
      'Recruiters spot "it’s vs its" and stray apostrophes on resumes in 3 seconds—do a dedicated punctuation sweep before exporting your PDF.',
      'Using a crisp semicolon or colon accurately in a Deloitte/Accenture essay elevates your writing score into the top 5%.',
      'In email writing tests (TCS/Wipro), put a comma after the salutation ("Dear Hiring Manager,") and after the sign-off ("Best regards,").',
    ],
  },
  idioms: {
    trackId: 'idioms',
    headline: 'Corporate & Placement Idioms — High-Frequency Decoding Notes',
    quickSummary:
      'Idioms cannot be translated word-for-word. Placement rounds at TCS, Wipro, Capgemini, Cognizant, Infosys, and Tech Mahindra test workplace idioms in fill-in-the-blanks and meaning-matching MCQs.',
    coreBullets: [
      {
        title: 'Execution & Ownership Idioms',
        point: 'Go the extra mile (exceed expectations), hit the ground running (start productively immediately), bite the bullet (face a tough task boldly).',
      },
      {
        title: 'Risk & Crisis Idioms',
        point: 'Burn the midnight oil (work late), back to the drawing board (restart after failure), cut corners (sacrifice quality for speed).',
      },
      {
        title: 'Strategy & Clarity Idioms',
        point: 'On the same page (aligned), elephant in the room (obvious unspoken issue), think outside the box (innovate), silver lining (positive side of a setback).',
      },
      {
        title: 'Decision & Negotiation Idioms',
        point: 'Ball is in your court (your turn to act), meet halfway (compromise), read between the lines (infer unstated meaning), play devil’s advocate (challenge to stress-test).',
      },
      {
        title: 'Caution Idioms',
        point: 'Put all eggs in one basket (over-rely on one option), add fuel to the fire (worsen conflict), beat around the bush (avoid the main point).',
      },
    ],
    goldenShortcuts: [
      'If unsure in an MCQ, immediately eliminate any option that gives a LITERAL physical translation.',
      'Check the tone (positive vs negative) of the sentence context to narrow 4 options down to 1.',
      'Learn idioms in 4 clusters: Effort, Risk, Alignment, and Decision.',
    ],
    commonTraps: [
      'Using informal slang idioms in formal HR emails (e.g., avoid "piece of cake" when discussing a tough client issue).',
      'Mixing up "break the ice" (ease social tension) with "thin ice" (risky position).',
      'Misquoting fixed words ("nip it in the BUD", NOT "butt"; "toe the line", NOT "tow the line").',
    ],
    mentorKapilTips: [
      'Drop ONE natural corporate idiom in a GD or HR round ("let’s get on the same page" or "hit the ground running")—it sounds effortlessly fluent. Never force five in one answer.',
      'In TCS/Cognizant verbal tests, 60% of idiom traps are literal distractors—cross those out in 2 seconds.',
      'Keep a pocket list of 25 workplace idioms and use 2 per week in real conversations so they stick permanently.',
    ],
  },
};

export const PILLAR1_SOLVED_PROBLEMS: SolvedCompanyProblem[] = [
  // =========================================================================
  // APTITUDE — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_apt_1',
    trackId: 'aptitude',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Pipes Working Together With an Outlet Leak',
    problem:
      'Pipe A fills a server cooling tank in 12 hours, Pipe B fills it in 15 hours, and Drain Pipe C empties the full tank in 20 hours. If all three pipes open together, how many hours will it take to fill the tank?',
    solution:
      'Step 1: Take Total Capacity = LCM(12, 15, 20) = 60 units.\nStep 2: Rates → A = +5 u/hr, B = +4 u/hr, C = −3 u/hr.\nStep 3: Combined net rate = 5 + 4 − 3 = +6 units/hr.\nStep 4: Time = 60 / 6 = 10 hours.',
    keyTakeaway: 'LCM turns every Time & Work / Pipes problem into simple integer addition.',
    kapilTip: 'Always tag inlet rates with (+) and outlet rates with (−) so sign mistakes never happen under timer pressure.',
  },
  {
    id: 'prob_apt_2',
    trackId: 'aptitude',
    company: 'Wipro NLTH',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Successive Markup & Discount Profit Check',
    problem:
      'A vendor marks a laptop 40% above cost price and then offers a 20% festive discount. What is the net profit percentage?',
    solution:
      'Step 1: Let CP = ₹100.\nStep 2: Marked Price (MP) = 100 × 1.40 = ₹140.\nStep 3: Selling Price (SP) = 140 × 0.80 = ₹112.\nStep 4: Profit % = (112 − 100) / 100 × 100 = 12% profit.\nShortcut: 40 − 20 − (40×20)/100 = 20 − 8 = +12%.',
    keyTakeaway: 'Successive % formula a + b + ab/100 works cleanly for Markup (+) then Discount (−).',
    kapilTip: 'Never subtract 40% − 20% = 20%; discount applies on the inflated Marked Price, not Cost Price!',
  },
  {
    id: 'prob_apt_3',
    trackId: 'aptitude',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Two Trains Crossing in Opposite Directions',
    problem:
      'A 180 m train running at 54 km/hr crosses another 120 m train running in the opposite direction in 10 seconds. Find the speed of the second train in km/hr.',
    solution:
      'Step 1: Total distance to cross = 180 + 120 = 300 m.\nStep 2: Relative speed = 300 m / 10 s = 30 m/s.\nStep 3: Convert to km/hr = 30 × (18/5) = 108 km/hr.\nStep 4: Opposite direction → v1 + v2 = 108 → v2 = 108 − 54 = 54 km/hr.',
    keyTakeaway: 'Total crossing distance is ALWAYS L1 + L2 regardless of same or opposite direction.',
    kapilTip: 'Memorize 54 km/hr = 15 m/s, 72 km/hr = 20 m/s, 90 km/hr = 25 m/s, 108 km/hr = 30 m/s for instant Capgemini speed.',
  },
  {
    id: 'prob_apt_4',
    trackId: 'aptitude',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Probability of At Least One Defective Chip',
    problem:
      'A batch of 10 microchips has 3 defective and 7 working chips. Two chips are picked randomly without replacement. What is the probability that AT LEAST ONE is defective?',
    solution:
      'Step 1: Use complement rule → P(at least 1 defective) = 1 − P(both working).\nStep 2: Total ways = C(10, 2) = 45.\nStep 3: Ways to pick 2 working = C(7, 2) = 21.\nStep 4: P(both working) = 21/45 = 7/15.\nStep 5: Answer = 1 − 7/15 = 8/15.',
    keyTakeaway: 'Complement probability 1 − P(none) avoids adding multiple disjoint cases.',
    kapilTip: 'Whenever you see "at least one" in Cognizant or Amazon screening, jump straight to 1 − P(zero).',
  },
  {
    id: 'prob_apt_5',
    trackId: 'aptitude',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Round-Trip Average Delivery Speed',
    problem:
      'An Amazon delivery van travels from Warehouse A to Hub B at 60 km/hr and returns along the exact same route at 40 km/hr. What is its average speed for the entire round trip?',
    solution:
      'Step 1: Equal distance each way → Harmonic Mean = 2xy / (x + y).\nStep 2: Average speed = (2 × 60 × 40) / (60 + 40) = 4800 / 100 = 48 km/hr.\nVerification with D = 120 km: Time = 2 hr + 3 hr = 5 hr; Total D = 240 km → 240 / 5 = 48 km/hr.',
    keyTakeaway: 'Average speed over equal distances is strictly lower than the arithmetic mean.',
    kapilTip: '50 km/hr is ALWAYS option A as a trap—spot equal distance and trigger 2xy/(x+y) immediately.',
  },
  {
    id: 'prob_apt_6',
    trackId: 'aptitude',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Compound Interest vs Simple Interest 2-Year Difference',
    problem:
      'The difference between Compound Interest and Simple Interest on a certain principal at 10% per annum for 2 years is ₹65. Find the principal.',
    solution:
      'Step 1: 2-year CI − SI formula = P × (R / 100)².\nStep 2: 65 = P × (10 / 100)² = P × (1/100).\nStep 3: P = 65 × 100 = ₹6,500.',
    keyTakeaway: 'For 2 years, CI − SI = P(R/100)²; for 3 years, P(R/100)² × (3 + R/100).',
    kapilTip: 'This exact 2-year difference identity is a perennial favorite in Tech Mahindra and TCS aptitude.',
  },
  {
    id: 'prob_apt_7',
    trackId: 'aptitude',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Alligation Mixture Ratio Problem',
    problem:
      'In what ratio must coffee costing ₹240/kg be mixed with coffee costing ₹320/kg so that the mixture is worth ₹270/kg?',
    solution:
      'Step 1: Apply Rule of Alligation:\nCheaper = 240, Dearer = 320, Mean = 270.\nStep 2: Ratio (Cheaper : Dearer) = (Dearer − Mean) : (Mean − Cheaper)\n= (320 − 270) : (270 − 240) = 50 : 30 = 5 : 3.',
    keyTakeaway: 'Cross-subtraction with Alligation solves mixture problems in 10 seconds without algebra.',
    kapilTip: 'Double-check direction: since Mean (270) is closer to 240 than 320, the cheaper coffee MUST have the larger share (5 vs 3).',
  },
  {
    id: 'prob_apt_8',
    trackId: 'aptitude',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Arranging Letters With Vowels Together',
    problem:
      'In how many distinct ways can the letters of the word "PLACEMENT" be arranged such that all vowels always come together?',
    solution:
      'Step 1: Letters in PLACEMENT (9 total): Vowels = {A, E, E} (3, with E repeated twice). Consonants = {P, L, C, M, N, T} (6 distinct).\nStep 2: Bundle the 3 vowels as 1 super-block → total units to arrange = 6 + 1 = 7 units → 7! = 5,040 ways.\nStep 3: Internal arrangements of {A, E, E} = 3! / 2! = 3 ways.\nStep 4: Total = 5,040 × 3 = 15,120 ways.',
    keyTakeaway: 'Tie grouped items into a single block, arrange blocks, then multiply by internal permutations (dividing by repeats!).',
    kapilTip: 'Always scan for repeated letters (like double E in PLACEMENT)—forgetting /2! is the #1 PnC error.',
  },
  {
    id: 'prob_apt_9',
    trackId: 'aptitude',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Ratio Rebalancing After New Hires',
    problem:
      'The ratio of developers to analysts in a team is 5 : 3. After 6 new analysts join, the ratio becomes 5 : 4. How many developers are in the team?',
    solution:
      'Step 1: Notice Developers stay unchanged (5 units in both ratios!).\nStep 2: Analysts increase from 3 units to 4 units → +1 unit = 6 analysts.\nStep 3: Developers = 5 units = 5 × 6 = 30 developers.',
    keyTakeaway: 'Keep the unchanged quantity’s ratio number constant to read the 1-unit value instantly.',
    kapilTip: 'If the unchanged quantity differs in the two ratios, scale both ratios to its LCM—no x equations needed.',
  },
  {
    id: 'prob_apt_10',
    trackId: 'aptitude',
    company: 'Accenture',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Clock Angle Between Hands at 3:40',
    problem:
      'Find the smaller angle between the hour hand and minute hand of a clock at 3:40.',
    solution:
      'Step 1: Formula: Angle = |30H − 5.5M|.\nStep 2: Substitute H = 3, M = 40:\nAngle = |30(3) − 5.5(40)| = |90 − 220| = 130°.\nStep 3: Since 130° < 180°, the smaller angle is 130°.',
    keyTakeaway: '|30H − 5.5M| gives exact clock angles in 5 seconds; if result > 180°, subtract from 360°.',
    kapilTip: 'Write |30H − 11M/2| on your rough sheet at the very start of any Accenture or TCS NQT exam.',
  },

  // =========================================================================
  // GRAMMAR — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_gram_1',
    trackId: 'grammar',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Subject-Verb Agreement With "As Well As"',
    problem:
      'Spot and fix the error: "The project manager, as well as the backend engineers, were praised for the zero-downtime release."',
    solution:
      'Error: "were praised".\nCorrection: "The project manager, as well as the backend engineers, WAS praised for the zero-downtime release."\nReason: Additive phrases ("as well as", "along with") do NOT make a singular subject plural.',
    keyTakeaway: 'Match the verb strictly to the primary subject before "as well as".',
    kapilTip: 'Cross out everything between the commas mentally—you are left with "The project manager WAS praised."',
  },
  {
    id: 'prob_gram_2',
    trackId: 'grammar',
    company: 'Wipro NLTH',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Third Conditional Trap ("Would Have" in If-Clause)',
    problem:
      'Correct the sentence: "If the QA team would have tested the edge case, the outage would not have occurred."',
    solution:
      'Error: "would have tested" inside the if-clause.\nCorrection: "If the QA team HAD tested the edge case, the outage would not have occurred."\nFormula: If + had + V3, ... would have + V3.',
    keyTakeaway: 'Never put "would / would have" inside the IF-clause in standard English.',
    kapilTip: 'Wipro and Infosys repeat this exact Type-3 conditional error almost every hiring drive.',
  },
  {
    id: 'prob_gram_3',
    trackId: 'grammar',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Correlative Pair "No Sooner…Than"',
    problem:
      'Fix the error: "No sooner had the deployment finished when traffic spiked by 300%."',
    solution:
      'Error: "when".\nCorrection: "No sooner had the deployment finished THAN traffic spiked by 300%."\nRule: No sooner pairs strictly with THAN (never "when" or "then"); Hardly/Scarcely pair with WHEN.',
    keyTakeaway: 'Remember: No sooner…THAN | Hardly/Scarcely…WHEN | Inversion ("had + subject") after negative openers.',
    kapilTip: 'Check BOTH the inversion ("No sooner had the…") AND the connector ("than") in Capgemini MCQs.',
  },
  {
    id: 'prob_gram_4',
    trackId: 'grammar',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Dangling Introductory Modifier',
    problem:
      'Improve the sentence: "Walking into the interview room, the nervousness was overwhelming."',
    solution:
      'Error: "the nervousness" was not walking into the room!\nCorrection: "Walking into the interview room, the candidate felt overwhelmed by nervousness."',
    keyTakeaway: 'The noun immediately following an introductory participial phrase must be the true doer.',
    kapilTip: 'Ask "WHO was walking?"—that person MUST appear right after the comma.',
  },
  {
    id: 'prob_gram_5',
    trackId: 'grammar',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Pronoun Case After Preposition "Between"',
    problem:
      'Identify the correct form: "Between you and (I / me), the sprint timeline needs a two-day buffer."',
    solution:
      'Correct: "Between you and ME, the sprint timeline needs a two-day buffer."\nReason: "Between" is a preposition and strictly takes object-case pronouns (me, him, her, us, them).',
    keyTakeaway: 'Prepositions ALWAYS govern objective case ("between you and me", "for her and him").',
    kapilTip: 'Test with a single pronoun: you would say "for me", never "for I"—so "for you and me" is always right.',
  },
  {
    id: 'prob_gram_6',
    trackId: 'grammar',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: '"One of the" Relative Clause Verb Trap',
    problem:
      'Select the right verb: "She is one of the engineers who (has / have) contributed to the open-source compiler."',
    solution:
      'Correct: "HAVE contributed".\nReason: "who" refers to the plural noun "engineers", so the relative clause takes plural "have".\nContrast: "She is THE ONLY ONE of the engineers who HAS contributed" → singular!',
    keyTakeaway: '"One of the [plural] who + PLURAL verb", but "THE ONLY one of the [plural] who + SINGULAR verb".',
    kapilTip: 'Infosys verbal tests love the "one of the…who" vs "the only one of the…who" distinction—memorize both!',
  },
  {
    id: 'prob_gram_7',
    trackId: 'grammar',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Countable vs Uncountable Quantifiers (Fewer vs Less)',
    problem:
      'Edit for executive writing: "After refactoring the microservices, the dashboard logged less errors and fewer latency."',
    solution:
      'Correction: "After refactoring the microservices, the dashboard logged FEWER errors and LESS latency."\nReason: "Errors" are countable → fewer; "latency" is uncountable → less.',
    keyTakeaway: 'Fewer = countable items (bugs, tickets); Less = uncountable mass/metrics (time, latency, memory).',
    kapilTip: 'Amazon’s writing bar emphasizes crisp precision—swapping fewer/less is an instant editorial red flag.',
  },
  {
    id: 'prob_gram_8',
    trackId: 'grammar',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Subjunctive Mood After "Recommend / Insist"',
    problem:
      'Choose the grammatically formal option: "The auditor recommended that the database admin (rotates / rotate) all credentials immediately."',
    solution:
      'Correct: "ROTATE" (base subjunctive form).\nSentence: "The auditor recommended that the database admin rotate all credentials immediately."\nRule: Mandative verbs (recommend, insist, demand, suggest) + that + Subject + base verb.',
    keyTakeaway: 'Formal recommendations take the bare base verb ("that he be", "that she rotate"), never -s.',
    kapilTip: 'Consulting firms like Deloitte and McKinsey test mandative subjunctive in business-English assessments.',
  },
  {
    id: 'prob_gram_9',
    trackId: 'grammar',
    company: 'Accenture',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Active to Passive Voice Conversion',
    problem:
      'Convert to Passive Voice: "The security team is auditing the cloud permissions right now."',
    solution:
      'Passive: "The cloud permissions are being audited by the security team right now."\nFormula for Present Continuous Passive: is/am/are + BEING + V3.',
    keyTakeaway: 'Never drop "being" when converting a continuous tense to passive voice.',
    kapilTip: 'Match the tense first (is auditing → are being audited) and check singular/plural of the new subject ("permissions" → are).',
  },
  {
    id: 'prob_gram_10',
    trackId: 'grammar',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Illogical Comparison Correction',
    problem:
      'Fix the comparison error: "The throughput of our new Rust service is significantly higher than the legacy Python service."',
    solution:
      'Error: Compares "throughput" (a metric) directly to "the legacy Python service" (a service).\nCorrection: "The throughput of our new Rust service is significantly higher than THAT OF the legacy Python service."',
    keyTakeaway: 'Always compare like with like using "that of" (singular) or "those of" (plural).',
    kapilTip: 'This exact GMAT/Google-style comparison error separates 95th-percentile writers from average candidates.',
  },

  // =========================================================================
  // PARTS OF SPEECH — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_pos_1',
    trackId: 'parts_of_speech',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Gerund vs Present Participle Identification',
    problem:
      'Identify the Part of Speech of "Debugging" in: "Debugging production code requires calm focus."',
    solution:
      'Answer: Gerund (verbal NOUN).\nReason: "Debugging production code" is the Subject of the verb "requires". You can replace it with "It" → "It requires calm focus."',
    keyTakeaway: 'When an -ing word acts as a subject or object, it functions as a Noun (Gerund).',
    kapilTip: 'Apply the "It-test": if replacing the -ing phrase with "It" keeps the sentence valid, it is 100% a Gerund.',
  },
  {
    id: 'prob_pos_2',
    trackId: 'parts_of_speech',
    company: 'Wipro NLTH',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Adjective After Linking Verb',
    problem:
      'Choose the right word: "The client sounded (happy / happily) with our milestone demo."',
    solution:
      'Answer: "HAPPY" (Adjective).\nReason: "Sounded" is a sensory linking verb describing the subject "client", not the manner of producing sound.',
    keyTakeaway: 'Sensory linking verbs (look, feel, sound, smell, taste) take adjectives, not adverbs.',
    kapilTip: 'Replace "sounded" with "was": "The client was happy" makes sense → use the adjective!',
  },
  {
    id: 'prob_pos_3',
    trackId: 'parts_of_speech',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Contextual Switch: "Fast" as Adverb vs Adjective',
    problem:
      'Identify the Part of Speech of "fast" in: "The new caching layer loads user profiles fast."',
    solution:
      'Answer: ADVERB.\nReason: Here "fast" modifies the verb "loads" (telling HOW it loads). Note: "fastly" is not a valid English word.',
    keyTakeaway: 'Flat adverbs like fast, hard, late, and early have no -ly form in standard usage.',
    kapilTip: 'Contrast: "hard" (effortfully) vs "hardly" (barely)—they have completely opposite meanings!',
  },
  {
    id: 'prob_pos_4',
    trackId: 'parts_of_speech',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Preposition vs Subordinating Conjunction ("Before")',
    problem:
      'Identify the Part of Speech of "before" in: (A) "Submit the PR before Friday." vs (B) "Run unit tests before you merge."',
    solution:
      '(A) PREPOSITION — followed only by a noun object ("Friday").\n(B) SUBORDINATING CONJUNCTION — followed by a full clause with subject + verb ("you merge").',
    keyTakeaway: 'Same word, different tail: + Noun = Preposition; + Subject + Verb = Conjunction.',
    kapilTip: 'Cognizant loves testing "before", "after", "since", and "until" in paired sentences—just check if a verb follows!',
  },
  {
    id: 'prob_pos_5',
    trackId: 'parts_of_speech',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Possessive Pronoun vs Possessive Determiner',
    problem:
      'Classify "theirs" vs "their" in: "Their proposal was concise, while theirs needed clearer metrics."',
    solution:
      '"Their" = Possessive Determiner (modifies the noun "proposal").\n"Theirs" = Possessive Pronoun (stands alone in place of "their proposal"). Note: NO apostrophe in "theirs"!',
    keyTakeaway: 'Possessive pronouns (mine, yours, hers, ours, theirs) never take an apostrophe.',
    kapilTip: 'Spot "their’s" or "your’s" in an MCQ? Eliminate it on sight—it is always wrong.',
  },
  {
    id: 'prob_pos_6',
    trackId: 'parts_of_speech',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'The "-ly Adjective" Trap ("Timely / Friendly / Costly")',
    problem:
      'Correct the sentence: "The team resolved the security incident very timely."',
    solution:
      'Error: "timely" is an ADJECTIVE, not an adverb, so it cannot modify the verb "resolved".\nCorrection: "The team resolved the security incident in a timely manner" (or "promptly").',
    keyTakeaway: 'Words like friendly, timely, costly, and likely are adjectives despite ending in -ly.',
    kapilTip: 'Use "in a timely manner" or "promptly" in corporate emails and Infosys verbal assessments.',
  },
  {
    id: 'prob_pos_7',
    trackId: 'parts_of_speech',
    company: 'Accenture',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Preposition "Despite" vs "Although"',
    problem:
      'Fill in the blank: "________ the tight deadline, the squad shipped every sprint goal." (Although / Despite / Despite of / Even though)',
    solution:
      'Correct: "DESPITE".\nReason: "the tight deadline" is a noun phrase (no verb), requiring a preposition. "Although / Even though" need a clause, and "Despite of" is ungrammatical.',
    keyTakeaway: 'Despite + Noun Phrase | Although + Subject + Verb. Never write "despite of".',
    kapilTip: 'Remember: "In spite of" = 3 words; "Despite" = 1 word. Never blend them!',
  },
  {
    id: 'prob_pos_8',
    trackId: 'parts_of_speech',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Hard',
    title: 'Relative Pronoun "Who" vs "Whom"',
    problem:
      'Choose correctly: "The architect (who / whom) the CTO mentored now leads Cloud Infrastructure."',
    solution:
      'Correct: "WHOM".\nTest: Rearrange the clause → "the CTO mentored HIM" (object case → whom).\nIf "HE" fits → use "who"; if "HIM" fits → use "whom".',
    keyTakeaway: 'He = Who (subject); Him = Whom (object). Note the matching "m" in him/whom!',
    kapilTip: 'Ignore parenthetical inserts like "who I think is right" → "I think HE is right" → WHO!',
  },
  {
    id: 'prob_pos_9',
    trackId: 'parts_of_speech',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Possessive Before a Gerund',
    problem:
      'Select the formally precise sentence: "The panel appreciated (him / his) articulating the trade-offs clearly."',
    solution:
      'Correct: "HIS articulating".\nReason: "Articulating" is a gerund (noun), so in formal/executive English it takes the possessive determiner "his" (what they appreciated was his articulation, not him personally).',
    keyTakeaway: 'In formal verbal assessments, place a possessive (my, his, their) before a gerund.',
    kapilTip: 'This subtle rule frequently separates top scorers in Amazon and consulting verbal screening.',
  },
  {
    id: 'prob_pos_10',
    trackId: 'parts_of_speech',
    company: 'Microsoft',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Conjunctive Adverb vs Coordinating Conjunction ("However")',
    problem:
      'What Part of Speech is "however" in: "Latency dropped; however, memory usage rose slightly."?',
    solution:
      'Answer: CONJUNCTIVE ADVERB (transitional adverb), NOT a coordinating conjunction.\nBecause it is an adverb, it CANNOT join two clauses with a mere comma—it needs a semicolon before it.',
    keyTakeaway: 'Words like however, therefore, moreover, nevertheless are conjunctive adverbs, not FANBOYS.',
    kapilTip: 'Never confuse "but" (FANBOYS conjunction) with "however" (conjunctive adverb) in technical docs.',
  },

  // =========================================================================
  // PARTS OF GRAMMAR — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_pog_1',
    trackId: 'parts_of_grammar',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Identify the Dependent Clause Type',
    problem:
      'What type of clause is underlined in: "What the telemetry revealed surprised the entire SRE team."?',
    solution:
      'Answer: NOUN CLAUSE.\nReason: "What the telemetry revealed" acts as the complete Subject of the verb "surprised". Replace with "It" → "It surprised the entire SRE team."',
    keyTakeaway: 'A clause acting as subject, object, or complement is a Noun Clause.',
    kapilTip: 'Test with "It/Something": if the whole clause swaps smoothly with "It", it is a Noun Clause.',
  },
  {
    id: 'prob_pog_2',
    trackId: 'parts_of_grammar',
    company: 'Wipro NLTH',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Fix a Sentence Fragment',
    problem:
      'Spot why this fails formal review and fix it: "Because the API gateway timed out during peak checkout."',
    solution:
      'Issue: Dependent Adverb Clause standing alone (Sentence Fragment — incomplete thought).\nFix: Attach an independent clause → "Because the API gateway timed out during peak checkout, we enabled automatic retries."',
    keyTakeaway: 'A subordinating conjunction (because, although, while) demotes a clause so it cannot stand alone.',
    kapilTip: 'In Wipro essay rounds, never start a sentence with "Because…" unless you finish the second half after a comma.',
  },
  {
    id: 'prob_pog_3',
    trackId: 'parts_of_grammar',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Faulty Parallelism in a Three-Item List',
    problem:
      'Correct the parallelism error: "The onboarding portal helps freshers master coding, improving communication, and to negotiate offers."',
    solution:
      'Error: Mixes bare verb ("master"), gerund ("improving"), and infinitive ("to negotiate").\nCorrection: "The onboarding portal helps freshers master coding, improve communication, and negotiate offers."',
    keyTakeaway: 'Every coordinated item in a series must mirror the exact same grammatical form.',
    kapilTip: 'Audit your own resume bullets for parallelism—every bullet should start with the same past-tense verb form.',
  },
  {
    id: 'prob_pog_4',
    trackId: 'parts_of_grammar',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Simple vs Compound vs Complex Classification',
    problem:
      'Classify this sentence: "Although the dataset was noisy, the analyst cleaned it, and the model hit 94% accuracy."',
    solution:
      'Answer: COMPOUND-COMPLEX Sentence.\nBreakdown: 1 Dependent Clause ("Although the dataset was noisy") + 2 Independent Clauses ("the analyst cleaned it" + "the model hit 94% accuracy").',
    keyTakeaway: 'Count finite clauses: 1 IC = Simple; 2+ ICs = Compound; 1 IC + 1+ DC = Complex; 2+ ICs + 1+ DC = Compound-Complex.',
    kapilTip: 'Don’t get fooled by sentence length—a 25-word sentence with only 1 subject-verb pair is still a SIMPLE sentence!',
  },
  {
    id: 'prob_pog_5',
    trackId: 'parts_of_grammar',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Synthesize Two Simple Sentences Into One Complex Sentence',
    problem:
      'Combine cleanly: "The microservice crashed. The team had skipped load testing."',
    solution:
      'Complex Sentence: "The microservice crashed because the team had skipped load testing."\n(Independent Clause + Subordinating Conjunction "because" + Dependent Adverb Clause).',
    keyTakeaway: 'Use subordination (because, although, since, whereas) to show cause-and-effect hierarchy cleanly.',
    kapilTip: 'In interviews, explaining cause-and-effect with complex sentences sounds far more senior than choppy 5-word bursts.',
  },
  {
    id: 'prob_pog_6',
    trackId: 'parts_of_grammar',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Misplaced Modifier Ambiguity',
    problem:
      'Fix the awkward placement: "The mentor reviewed the code written by the intern with a red pen."',
    solution:
      'Ambiguity: Sounds like the intern wrote code using a red pen!\nFix: "With a red pen, the mentor reviewed the code written by the intern." (or "The mentor used a red pen to review…").',
    keyTakeaway: 'Keep every modifying phrase physically right next to the word it modifies.',
    kapilTip: 'Especially watch the word "ONLY": "She only debugged 2 files" vs "She debugged only 2 files" mean totally different things!',
  },
  {
    id: 'prob_pog_7',
    trackId: 'parts_of_grammar',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Correlative Parallelism ("Not Only…But Also")',
    problem:
      'Fix the asymmetry: "The dashboard not only tracks revenue but also customer churn."',
    solution:
      'Error: "not only" precedes a VERB ("tracks"), while "but also" precedes a NOUN ("customer churn").\nFix: "The dashboard tracks not only revenue but also customer churn."',
    keyTakeaway: 'Whatever grammatical category follows "not only" MUST immediately follow "but also".',
    kapilTip: 'Slide the shared verb ("tracks") BEFORE "not only" to restore instant symmetry in 2 seconds.',
  },
  {
    id: 'prob_pog_8',
    trackId: 'parts_of_grammar',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Converting Wordy Passive Into Crisp Active Syntax',
    problem:
      'Tighten for an Amazon 6-pager: "It was decided by the architecture council that the monolithic billing engine should be decomposed into three services."',
    solution:
      'Crisp Active Rewrite: "The architecture council decided to decompose the monolithic billing engine into three services." (Cut from 21 words to 15 words with zero meaning lost!)',
    keyTakeaway: 'Eliminate dummy openers ("It was decided by…") and place the actor directly in the subject slot.',
    kapilTip: 'Active syntax + concrete metrics is the golden formula for Amazon STAR stories and resumes.',
  },
  {
    id: 'prob_pog_9',
    trackId: 'parts_of_grammar',
    company: 'Accenture',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Appositive Phrase Identification & Punctuation',
    problem:
      'Identify the syntactic role of the middle phrase: "Kapil, an employability architect, mentored 2,000+ learners."',
    solution:
      'Role: Non-restrictive APPOSITIVE PHRASE.\nFunction: A noun phrase that renames or defines the adjacent noun ("Kapil"), set off cleanly by paired commas.',
    keyTakeaway: 'Appositives pack rich context into compact executive sentences without adding extra clauses.',
    kapilTip: 'Use appositives on LinkedIn headlines and cover letters to showcase your role smoothly.',
  },
  {
    id: 'prob_pog_10',
    trackId: 'parts_of_grammar',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Eliminating Wordy Nominalization',
    problem:
      'Strengthen the syntax: "The team performed an investigation of the latency spike and made a reduction in query time."',
    solution:
      'Improved Syntax: "The team investigated the latency spike and reduced query time."\nReason: Turning buried noun phrases ("performed an investigation") back into strong verbs ("investigated") makes writing sharp and persuasive.',
    keyTakeaway: 'Prefer strong action verbs over weak "make/perform + noun" nominalizations.',
    kapilTip: 'Replace "did an analysis of" → "analyzed" and "made an improvement to" → "improved" across your resume.',
  },

  // =========================================================================
  // TENSES — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_ten_1',
    trackId: 'tenses',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Present Perfect Continuous With "Since"',
    problem:
      'Fix the tense error: "Ananya is preparing for product interviews since January."',
    solution:
      'Correction: "Ananya HAS BEEN PREPARING for product interviews since January."\nReason: Actions that started in the past and continue into the present ("since/for") require Present Perfect Continuous.',
    keyTakeaway: 'Never pair Present Continuous ("is preparing") with "since" or "for + duration".',
    kapilTip: 'This is the single #1 Indian-English tense slip—fixing it instantly upgrades your interview presence.',
  },
  {
    id: 'prob_ten_2',
    trackId: 'tenses',
    company: 'Wipro NLTH',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Simple Past Required With Finished Past Marker',
    problem:
      'Spot the error: "I have completed my Python internship in June 2024."',
    solution:
      'Correction: "I COMPLETED my Python internship in June 2024."\nReason: "In June 2024" pins the event to a finished past timestamp—never use Present Perfect with finished past markers (yesterday, last week, ago, in 2024).',
    keyTakeaway: 'Finished timestamp = Simple Past (V2). Open/unspecified time = Present Perfect (have + V3).',
    kapilTip: 'Check your resume & intro: say "I graduated in 2025", NOT "I have graduated in 2025".',
  },
  {
    id: 'prob_ten_3',
    trackId: 'tenses',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Past Perfect Sequencing (Two Past Actions)',
    problem:
      'Fill in the blanks: "By the time the SRE team ________ (arrive), the failover cluster already ________ (recover)."',
    solution:
      'Answer: "By the time the SRE team ARRIVED, the failover cluster HAD already RECOVERED."\nReason: Recovery happened FIRST (Past Perfect: had + V3); arrival happened SECOND (Simple Past: V2).',
    keyTakeaway: 'Earlier past action → had + V3. Later past action → V2.',
    kapilTip: 'Draw a quick two-dot timeline in your mind: left dot = had + V3, right dot = V2.',
  },
  {
    id: 'prob_ten_4',
    trackId: 'tenses',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Stative Verb Continuous Trap',
    problem:
      'Correct the sentence: "I am knowing the difference between TCP and UDP very well."',
    solution:
      'Correction: "I KNOW the difference between TCP and UDP very well."\nReason: "Know" is a stative cognitive verb and is not used in progressive (-ing) tenses.',
    keyTakeaway: 'Stative verbs (know, believe, own, belong, understand, prefer) stay in Simple tenses.',
    kapilTip: 'Avoid "I am having a doubt" and "I am knowing this" in interviews—say "I have a question" and "I know this".',
  },
  {
    id: 'prob_ten_5',
    trackId: 'tenses',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Future Perfect With "By + Future Deadline"',
    problem:
      'Choose the correct tense: "By next Friday, the migration squad ________ (migrate) all 120 microservices."',
    solution:
      'Answer: "WILL HAVE MIGRATED".\nReason: "By + future point in time" signals completion prior to a future deadline → Future Perfect (will have + V3).',
    keyTakeaway: '"By [future time]" is the signature trigger for Future Perfect (will have + V3).',
    kapilTip: 'Spot "By tomorrow / By 2028 / By the end of this sprint" → select "will have + V3" confidently.',
  },
  {
    id: 'prob_ten_6',
    trackId: 'tenses',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: '"It Is High Time" Subjunctive Past Rule',
    problem:
      'Fill in the blank: "It is high time our team ________ (automate) the regression suite."',
    solution:
      'Answer: "AUTOMATED" (Simple Past V2).\nRule: "It is (high / about) time + Subject + V2" expresses that an action is overdue.',
    keyTakeaway: 'Always follow "It is high time + Subject" with V2, never V1 or "should + V1".',
    kapilTip: 'Memorize this exact pattern—it is one of the highest-ROI 1-line rules for Infosys & TCS.',
  },
  {
    id: 'prob_ten_7',
    trackId: 'tenses',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'No "Will" Inside Future Time Clauses',
    problem:
      'Fix the tense slip: "We will notify the customer as soon as the refund will process."',
    solution:
      'Correction: "We will notify the customer as soon as the refund PROCESSES."\nRule: Subordinate time clauses (when, before, after, until, as soon as) use Simple Present to denote future time.',
    keyTakeaway: 'Future main clause ("will notify") + Present time clause ("as soon as it processes").',
    kapilTip: 'Never put two "wills" in one sentence joined by when/if/until/as soon as!',
  },
  {
    id: 'prob_ten_8',
    trackId: 'tenses',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Reported Speech Backshifting',
    problem:
      'Convert to Indirect Speech: The partner said, "Our analysts have finalized the Q4 forecast."',
    solution:
      'Indirect Speech: "The partner said that their analysts HAD FINALIZED the Q4 forecast."\nRule: Past reporting verb ("said") backshifts Present Perfect ("have finalized") → Past Perfect ("had finalized").',
    keyTakeaway: 'Past reporting verb shifts every tense one notch backward (except universal scientific truths).',
    kapilTip: 'Remember to update pronouns ("Our" → "their") AND time words ("today" → "that day") together.',
  },
  {
    id: 'prob_ten_9',
    trackId: 'tenses',
    company: 'Accenture',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Interrupted Past Action (Past Continuous + Simple Past)',
    problem:
      'Fill in the blanks: "While the engineer ________ (deploy) the patch, the build server ________ (reboot)."',
    solution:
      'Answer: "While the engineer WAS DEPLOYING the patch, the build server REBOOTED."\nReason: Background ongoing action = Past Continuous (was/were + V-ing); sudden interrupting event = Simple Past (V2).',
    keyTakeaway: 'Long background past action (was + V-ing) interrupted by short event (V2).',
    kapilTip: 'Use "While" for the ongoing continuous action and "When" for the crisp interrupting event.',
  },
  {
    id: 'prob_ten_10',
    trackId: 'tenses',
    company: 'Microsoft',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Mixed Conditional (Past Action → Present Result)',
    problem:
      'Complete logically: "If I ________ (accept) the Seattle offer last year, I ________ (work) there today."',
    solution:
      'Answer: "If I HAD ACCEPTED the Seattle offer last year, I WOULD BE WORKING (or WOULD WORK) there today."\nReason: Unreal past condition (had + V3) producing an unreal PRESENT consequence (would + V1 / would be + V-ing).',
    keyTakeaway: 'Mixed conditionals combine Type-3 past condition with Type-2 present result ("today / now").',
    kapilTip: 'Look for the word "now" or "today" in the result clause—that signals a Mixed Conditional!',
  },

  // =========================================================================
  // PUNCTUATION — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_punc_1',
    trackId: 'punctuation',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Eliminating a Comma Splice With "; however,"',
    problem:
      'Fix the punctuation error: "The model reached 96% accuracy, however, inference latency was too high."',
    solution:
      'Correction: "The model reached 96% accuracy; however, inference latency was too high."\nRule: Conjunctive adverbs ("however", "therefore") joining two independent clauses need a semicolon before and a comma after.',
    keyTakeaway: 'Never glue two full sentences together with ", however,"—always use "; however,".',
    kapilTip: 'One semicolon used cleanly in a placement essay shows instant command over written English.',
  },
  {
    id: 'prob_punc_2',
    trackId: 'punctuation',
    company: 'Wipro NLTH',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Mastering Its vs It’s and Plural Possessives',
    problem:
      'Correct all apostrophe errors: "Its clear that the startup upgraded it’s portal for all engineer’s."',
    solution:
      'Correction: "IT’S clear that the startup upgraded ITS portal for all ENGINEERS."\nBreakdown: It’s = It is; its = possessive (no apostrophe); engineers = plain plural (no apostrophe).',
    keyTakeaway: 'Expand "it’s" to "it is" every time—if "it is" doesn’t fit, drop the apostrophe!',
    kapilTip: 'Plain plurals (engineers, APIs, KPIs, 2020s) NEVER take an apostrophe.',
  },
  {
    id: 'prob_punc_3',
    trackId: 'punctuation',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Colon Only After an Independent Clause',
    problem:
      'Spot the punctuation error: "Our cloud stack includes: AWS, Docker, and Kubernetes."',
    solution:
      'Error: Colon splits the verb "includes" from its direct object.\nFix Option 1 (Remove colon): "Our cloud stack includes AWS, Docker, and Kubernetes."\nFix Option 2 (Complete clause): "Our cloud stack includes three core tools: AWS, Docker, and Kubernetes."',
    keyTakeaway: 'What stands to the LEFT of a colon must be able to stand alone as a full sentence.',
    kapilTip: 'Never write "such as:", "are:", or "include:"—either drop the colon or add a summary noun first.',
  },
  {
    id: 'prob_punc_4',
    trackId: 'punctuation',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Hyphenating Compound Modifiers vs -ly Adverbs',
    problem:
      'Punctuate properly: "We delivered a high impact, rapidly-growing, client facing portal."',
    solution:
      'Correction: "We delivered a high-impact, rapidly growing, client-facing portal."\nRule: Hyphenate compound modifiers before a noun ("high-impact", "client-facing"), but NEVER hyphenate -ly adverbs ("rapidly growing").',
    keyTakeaway: 'Before-noun compounds get hyphens; -ly adverbs never get hyphens.',
    kapilTip: 'Apply this rule to resume power-phrases: "data-driven insights", "real-time analytics", "highly scalable".',
  },
  {
    id: 'prob_punc_5',
    trackId: 'punctuation',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Oxford (Serial) Comma to Prevent Ambiguity',
    problem:
      'Why is this sentence ambiguous, and how does one comma fix it? "We dedicated the release to our mentors, Kapil and the CTO."',
    solution:
      'Ambiguity: Without the Oxford comma, "Kapil and the CTO" looks like it defines who "our mentors" are (only 2 people).\nFix: "We dedicated the release to our mentors, Kapil, and the CTO." (Clearly 3 distinct groups/people!)',
    keyTakeaway: 'Always use the Oxford comma before the final "and" in technical and corporate lists.',
    kapilTip: 'Legal contracts and Amazon memos mandate the Oxford comma because missing it has literally cost companies millions.',
  },
  {
    id: 'prob_punc_6',
    trackId: 'punctuation',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Restrictive vs Non-Restrictive Clause Commas',
    problem:
      'Explain the meaning difference: (A) "Developers who write unit tests ship fewer bugs." vs (B) "Developers, who write unit tests, ship fewer bugs."',
    solution:
      '(A) NO commas (Restrictive): Refers specifically to the SUBSET of developers who write unit tests.\n(B) Paired commas (Non-restrictive): Implies ALL developers write unit tests as a side note.\n(A) is the intended precise statement.',
    keyTakeaway: 'No commas = essential narrowing definition; paired commas = removable bonus information.',
    kapilTip: 'If removing the phrase breaks the core meaning of the sentence, do NOT wrap it in commas.',
  },
  {
    id: 'prob_punc_7',
    trackId: 'punctuation',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Super-Semicolons in Complex Series',
    problem:
      'Punctuate cleanly: "The summit featured leads from Bengaluru, India, London, UK, and Austin, USA."',
    solution:
      'Correction: "The summit featured leads from Bengaluru, India; London, UK; and Austin, USA."\nRule: When list items contain internal commas, upgrade the main separators to semicolons.',
    keyTakeaway: 'Semicolons act as "super-commas" to keep multi-part lists effortlessly readable.',
    kapilTip: 'Use this when listing multiple role-company-city items or committee members with titles.',
  },
  {
    id: 'prob_punc_8',
    trackId: 'punctuation',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Introductory Clause Comma Rule',
    problem:
      'Add the missing comma: "After optimizing the PostgreSQL indexes query latency dropped by 65%."',
    solution:
      'Correction: "After optimizing the PostgreSQL indexes, query latency dropped by 65%."\nRule: Always place a comma after an introductory prepositional/participial phrase or dependent clause.',
    keyTakeaway: 'Pause with a comma after any introductory opener before the main subject arrives.',
    kapilTip: 'Without that comma, readers momentarily misread "indexes query" as one phrase—commas guide the reader’s eye.',
  },
  {
    id: 'prob_punc_9',
    trackId: 'punctuation',
    company: 'Accenture',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Em-Dash for Executive Emphasis',
    problem:
      'Punctuate for maximum boardroom clarity: "Only one KPI really mattered to the sponsor net revenue retention."',
    solution:
      'Correction: "Only one KPI really mattered to the sponsor—net revenue retention." (Or colon: "...sponsor: net revenue retention.")\nRule: An em-dash (—) creates a crisp dramatic pause to spotlight a punchline.',
    keyTakeaway: 'Use em-dashes sparingly (max 1 per paragraph) to highlight high-impact executive takeaways.',
    kapilTip: 'Don’t confuse hyphen (-), en-dash (– for ranges like 2022–2026), and em-dash (— for emphasis).',
  },
  {
    id: 'prob_punc_10',
    trackId: 'punctuation',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Direct Question vs Indirect Question Punctuation',
    problem:
      'Fix the end punctuation: "The hiring manager asked whether I had scaled distributed caches before?"',
    solution:
      'Correction: End with a PERIOD (.) → "The hiring manager asked whether I had scaled distributed caches before."\nReason: It is a declarative statement reporting an indirect question, NOT a direct question.',
    keyTakeaway: 'Indirect questions ("asked whether...", "wonder if...") end with a period, never a question mark.',
    kapilTip: 'Check your polite request emails too: "Please let me know if Tuesday works." takes a period, not a question mark.',
  },

  // =========================================================================
  // IDIOMS — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_idm_1',
    trackId: 'idioms',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Idiom Meaning: "Hit the Ground Running"',
    problem:
      'What does "hit the ground running" mean in: "With her internship stack, Meera hit the ground running on Day 1."?',
    solution:
      'Meaning: Start a new role or project immediately with high energy and productivity, needing minimal ramp-up time.',
    keyTakeaway: 'High-value corporate idiom for expressing fast onboarding and self-starter readiness.',
    kapilTip: 'Great phrase to use in "Why should we hire you?" — explain HOW your projects let you hit the ground running.',
  },
  {
    id: 'prob_idm_2',
    trackId: 'idioms',
    company: 'Wipro NLTH',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Idiom Meaning: "Bite the Bullet"',
    problem:
      'Choose the exact meaning of "bite the bullet" in: "We decided to bite the bullet and rewrite the legacy auth service."',
    solution:
      'Meaning: Courageously accept and tackle a difficult, unpleasant, or unavoidable task without further delay.',
    keyTakeaway: 'Signals decisive ownership when addressing technical debt or tough conversations.',
    kapilTip: 'In MCQs, cross out literal gun/danger distractors immediately—corporate idioms are always metaphorical.',
  },
  {
    id: 'prob_idm_3',
    trackId: 'idioms',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Idiom Meaning: "Cut Corners"',
    problem:
      'Interpret: "Cutting corners on unit testing caused a costly Friday outage."',
    solution:
      'Meaning: Doing something in the quickest, cheapest, or easiest way by sacrificing quality, safety, or proper rules.',
    keyTakeaway: 'Always carries a negative connotation in engineering and compliance contexts.',
    kapilTip: 'Pair it with "never" in interviews: "Under tight deadlines, I prioritize scope—I never cut corners on security."',
  },
  {
    id: 'prob_idm_4',
    trackId: 'idioms',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Idiom Meaning: "Elephant in the Room"',
    problem:
      'What does "the elephant in the room" refer to during a sprint retrospective?',
    solution:
      'Meaning: An obvious, major problem or uncomfortable truth that everyone is aware of, yet nobody wants to bring up openly.',
    keyTakeaway: 'Used professionally to invite transparent problem-solving in meetings and GDs.',
    kapilTip: 'In a Group Discussion, saying "Let’s address the elephant in the room—implementation cost" shows instant leadership.',
  },
  {
    id: 'prob_idm_5',
    trackId: 'idioms',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Idiom Meaning: "Play Devil’s Advocate"',
    problem:
      'In a design review, a senior architect says, "Let me play devil’s advocate for a moment." What is she doing?',
    solution:
      'Meaning: Deliberately arguing the opposing or skeptical viewpoint—not out of hostility, but to stress-test an idea and uncover blind spots.',
    keyTakeaway: 'A hallmark phrase of constructive debate in product and consulting teams.',
    kapilTip: 'Use this exact prefix before challenging a teammate’s idea in a GD so you sound collaborative, not combative.',
  },
  {
    id: 'prob_idm_6',
    trackId: 'idioms',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Idiom Meaning: "Back to the Drawing Board"',
    problem:
      'Fill in the idiom: "The prototype failed usability testing, so the UX squad went ________."',
    solution:
      'Answer: "BACK TO THE DRAWING BOARD".\nMeaning: Starting over with a brand-new plan because the previous attempt failed or proved unworkable.',
    keyTakeaway: 'Conveys resilience and structured iteration rather than defeat.',
    kapilTip: 'Ideal for STAR failure stories: "It failed, we went back to the drawing board, and shipped v2 cleanly."',
  },
  {
    id: 'prob_idm_7',
    trackId: 'idioms',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Idiom Meaning: "Move the Needle"',
    problem:
      'What does a product manager mean by asking: "Will this feature actually move the needle on conversion?"',
    solution:
      'Meaning: Produce a noticeable, measurable, and meaningful impact on a key business metric.',
    keyTakeaway: 'Favorite phrase at Amazon, Google, and startups to separate high-impact work from busywork.',
    kapilTip: 'When describing projects, emphasize the one engineering change that truly "moved the needle" on speed or revenue.',
  },
  {
    id: 'prob_idm_8',
    trackId: 'idioms',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Idiom Meaning: "Read Between the Lines"',
    problem:
      'Interpret: "Reading between the lines of the client’s email, they are worried about budget overrun."',
    solution:
      'Meaning: Infer the hidden, implicit, or unstated meaning behind someone’s words or tone.',
    keyTakeaway: 'Describes high emotional intelligence and consulting acumen.',
    kapilTip: 'In negotiation rounds, reading between the lines of a client’s hesitation often uncovers the real objection.',
  },
  {
    id: 'prob_idm_9',
    trackId: 'idioms',
    company: 'Accenture',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Idiom Meaning: "Ball Is in Your Court"',
    problem:
      'After sending the revised offer letter, HR writes: "The ball is in your court now." What does this mean?',
    solution:
      'Meaning: It is now your responsibility or turn to make the next decision or take the next step.',
    keyTakeaway: 'Clear accountability idiom used in sales, hiring, and cross-team handoffs.',
    kapilTip: 'Never confuse it with "drop the ball" (which means making a careless mistake or failing a responsibility).',
  },
  {
    id: 'prob_idm_10',
    trackId: 'idioms',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Idiom Meaning: "Nip It in the Bud"',
    problem:
      'What does "nip it in the bud" mean in: "Good observability helps SREs nip memory leaks in the bud."?',
    solution:
      'Meaning: Stop a small problem or bad habit at a very early stage before it grows into a major crisis.',
    keyTakeaway: 'Proactive prevention idiom—note the exact spelling "bud" (flower bud), never "butt"!',
    kapilTip: 'Google and Infosys verbal checks love fixed-word idioms like "nip in the bud" and "toe the line".',
  },
];

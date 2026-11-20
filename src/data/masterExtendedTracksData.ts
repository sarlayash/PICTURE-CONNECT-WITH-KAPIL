import { MasterMcq, MasterPlaybookCard } from './masterUniverseTypes';

export const EXTENDED_TRACKS_PLAYBOOKS: MasterPlaybookCard[] = [
  // =========================================================================
  // TRACK 05: ENGLISH TENSES (6 Playbooks)
  // =========================================================================
  {
    id: 'pb_ten_1',
    trackId: 'tenses',
    tag: 'SIMPLE PAST VS PRESENT PERFECT',
    conceptTitle: 'Finished Time Marker vs Unfinished Connection',
    ruleOrFormula:
      'Specific past time (yesterday, in 2023, ago) → Simple Past (V2). Unspecified past with present impact (since, for, yet, already) → Present Perfect (has/have + V3).',
    example:
      'Wrong: "I have graduated in 2024." → Right: "I graduated in 2024." / "I have worked here since 2024."',
    placementTip:
      'TCS NQT & Capgemini love pairing "since/ago" with the wrong tense. Spot "ago" = Simple Past immediately.',
  },
  {
    id: 'pb_ten_2',
    trackId: 'tenses',
    tag: 'PAST PERFECT SEQUENCING',
    conceptTitle: 'The "Earlier of Two Past Actions" Rule',
    ruleOrFormula:
      'Earlier Past Action → Past Perfect (had + V3). Later Past Action → Simple Past (V2). Never use Past Perfect alone without a second past reference.',
    example:
      '"The deployment had finished before the client joined the bridge call."',
    placementTip:
      'Check the timeline word ("before", "after", "by the time"): whichever event happened FIRST takes "had + V3".',
  },
  {
    id: 'pb_ten_3',
    trackId: 'tenses',
    tag: 'STATIVE VERBS TRAP',
    conceptTitle: 'Verbs That Avoid Continuous (-ing) Form',
    ruleOrFormula:
      'Mental/possession/emotion verbs (know, own, believe, belong, prefer, understand) take Simple tenses, not -ing, when expressing a state.',
    example:
      'Wrong: "I am knowing Python." → Right: "I know Python." (Exception: "I am having lunch" = action).',
    placementTip:
      'Wipro & Cognizant verbal tests frequently test "I am having a car" (wrong) vs "I own / have a car" (right).',
  },
  {
    id: 'pb_ten_4',
    trackId: 'tenses',
    tag: 'PRESENT PERFECT CONTINUOUS',
    conceptTitle: 'Duration Starting in Past & Continuing Now',
    ruleOrFormula:
      'Subject + has/have been + V-ing + since (point in time) / for (duration).',
    example:
      '"She has been leading the analytics squad for three years / since January 2023."',
    placementTip:
      'Never say "I am working here since 2022" in an interview — upgrade to "I have been working here since 2022."',
  },
  {
    id: 'pb_ten_5',
    trackId: 'tenses',
    tag: 'FUTURE TIME CLAUSES',
    conceptTitle: 'No "Will" Inside If / When / Until / Unless Clauses',
    ruleOrFormula:
      'Time/Condition Clause = Simple Present; Main Clause = Simple Future (will + V1).',
    example:
      'Wrong: "When the build will pass, we will deploy." → Right: "When the build passes, we will deploy."',
    placementTip:
      'High-frequency error in Tech Mahindra & Infosys sentence-correction MCQs. Cut "will" after when/if/until/as soon as.',
  },
  {
    id: 'pb_ten_6',
    trackId: 'tenses',
    tag: 'CONDITIONAL HARMONY',
    conceptTitle: '2nd vs 3rd Conditional Tense Pairing',
    ruleOrFormula:
      '2nd (Unreal present): If + V2/were, would + V1. 3rd (Unreal past): If + had + V3, would have + V3.',
    example:
      '"If I had tested edge cases, the API would have passed production QA."',
    placementTip:
      'Never write "If I would have known..." — the "if" clause takes "had + V3", never "would have".',
  },

  // =========================================================================
  // TRACK 06: PUNCTUATION (6 Playbooks)
  // =========================================================================
  {
    id: 'pb_punc_1',
    trackId: 'punctuation',
    tag: 'COMMA SPLICE FIX',
    conceptTitle: 'Never Join Two Full Sentences with Only a Comma',
    ruleOrFormula:
      'Fix a comma splice using: (1) Period (.), (2) Semicolon (;), or (3) Comma + FANBOYS (for, and, nor, but, or, yet, so).',
    example:
      'Wrong: "The sprint ended, the demo went live." → Right: "The sprint ended; the demo went live."',
    placementTip:
      'In Amazon writing assessments and business emails, comma splices immediately lower clarity scores.',
  },
  {
    id: 'pb_punc_2',
    trackId: 'punctuation',
    tag: 'SEMICOLON VS COLON',
    conceptTitle: 'Semicolon Links Equals; Colon Introduces Explanation/List',
    ruleOrFormula:
      'Independent Clause ; Independent Clause. Complete Clause : List / Definition / Emphasis.',
    example:
      '"We focus on three pillars: speed, accuracy, and ownership." vs "Code cleanly; future teammates will thank you."',
    placementTip:
      'Never place a colon directly after a verb like "is:" or "include:" unless a complete clause precedes it.',
  },
  {
    id: 'pb_punc_3',
    trackId: 'punctuation',
    tag: 'APOSTROPHE PRECISION',
    conceptTitle: 'Possession vs Contraction (Its vs It’s)',
    ruleOrFormula:
      'it’s = it is / it has. its = possessive. Singular possessive = manager’s; Plural ending in s = managers’.',
    example:
      '"The team celebrated its milestone; it’s ready for Q4. All engineers’ laptops were updated."',
    placementTip:
      'Never use an apostrophe to make a regular noun or decade plural (write "1990s" and "APIs", not "API’s").',
  },
  {
    id: 'pb_punc_4',
    trackId: 'punctuation',
    tag: 'CONJUNCTIVE ADVERBS',
    conceptTitle: 'Punctuating "However", "Therefore" & "Moreover"',
    ruleOrFormula:
      'When joining two complete clauses: Clause 1 ; however, Clause 2. Mid-sentence interrupter: , however, .',
    example:
      '"The budget was tight; however, the team delivered ahead of schedule."',
    placementTip:
      'Writing ", however," between two full sentences is the #1 punctuation mistake in corporate verbal exams.',
  },
  {
    id: 'pb_punc_5',
    trackId: 'punctuation',
    tag: 'HYPHEN VS EM-DASH',
    conceptTitle: 'Compound Modifiers Before Nouns Take Hyphens',
    ruleOrFormula:
      'Hyphenate multi-word adjectives BEFORE a noun ("data-driven decision"), not after ("the decision is data driven"). Use em-dash (—) for dramatic emphasis.',
    example:
      '"She designed a high-availability architecture—zero downtime across 12 months."',
    placementTip:
      'Never hyphenate adverbs ending in -ly (write "highly scalable system", not "highly-scalable system").',
  },
  {
    id: 'pb_punc_6',
    trackId: 'punctuation',
    tag: 'OXFORD COMMA & CLARITY',
    conceptTitle: 'Preventing Ambiguity in Lists & Clauses',
    ruleOrFormula:
      'Place the serial (Oxford) comma before "and/or" in a 3+ item list. Wrap non-essential (which) clauses in commas; leave essential (that) clauses comma-free.',
    example:
      '"We invited our mentors, Kapil, and the CTO." (Clear 3 parties) vs non-restrictive: "Python, which is versatile, powers AI."',
    placementTip:
      'Executive reports and consulting decks (Deloitte/Capgemini) standardize on the Oxford comma to prevent misreading.',
  },

  // =========================================================================
  // TRACK 07: IDIOMS & PHRASES (6 Playbooks)
  // =========================================================================
  {
    id: 'pb_idi_1',
    trackId: 'idioms',
    tag: 'ACTION & MOMENTUM',
    conceptTitle: 'Hit the Ground Running · Bite the Bullet',
    ruleOrFormula:
      'Hit the ground running = start productively with immediate energy. Bite the bullet = face an unavoidable difficult task with courage.',
    example:
      '"After onboarding, she hit the ground running and bit the bullet on refactoring the legacy module."',
    placementTip:
      'Great idioms to use naturally in HR interviews when describing how you handled a tough internship deadline.',
  },
  {
    id: 'pb_idi_2',
    trackId: 'idioms',
    tag: 'STRATEGY & IMPACT',
    conceptTitle: 'Move the Needle · Low-Hanging Fruit',
    ruleOrFormula:
      'Move the needle = create a measurable, noticeable business impact. Low-hanging fruit = easiest wins with quickest payoff.',
    example:
      '"Fixing checkout latency was low-hanging fruit that genuinely moved the needle on conversions."',
    placementTip:
      'Favorite consulting & product-company phrases (Amazon, Deloitte, Accenture) during case interviews.',
  },
  {
    id: 'pb_idi_3',
    trackId: 'idioms',
    tag: 'PROBLEM SOLVING',
    conceptTitle: 'Back to the Drawing Board · Cut Corners',
    ruleOrFormula:
      'Back to the drawing board = redesign from scratch after failure. Cut corners = take unsafe/cheap shortcuts that hurt quality.',
    example:
      '"Rather than cutting corners on security tests, we went back to the drawing board."',
    placementTip:
      'TCS, Wipro & Cognizant verbal sections frequently test "cut corners" (means sacrificing quality, NOT saving geometry).',
  },
  {
    id: 'pb_idi_4',
    trackId: 'idioms',
    tag: 'COMMUNICATION & GD',
    conceptTitle: 'Elephant in the Room · Play Devil’s Advocate',
    ruleOrFormula:
      'Elephant in the room = obvious major issue everyone avoids mentioning. Devil’s advocate = argue the opposing side to stress-test an idea.',
    example:
      '"Playing devil’s advocate, let’s address the elephant in the room: our cloud egress cost."',
    placementTip:
      'Using "Playing devil’s advocate..." lets you challenge a GD teammate diplomatically without sounding aggressive.',
  },
  {
    id: 'pb_idi_5',
    trackId: 'idioms',
    tag: 'JUDGMENT & INSIGHT',
    conceptTitle: 'Read Between the Lines · Bark Up the Wrong Tree',
    ruleOrFormula:
      'Read between the lines = infer hidden/unstated meaning. Bark up the wrong tree = pursue the wrong cause or person.',
    example:
      '"Reading between the lines of the client’s email, we realized we were barking up the wrong tree on pricing."',
    placementTip:
      'Watch literal-meaning distractors in MCQ exams—idioms are ALWAYS figurative.',
  },
  {
    id: 'pb_idi_6',
    trackId: 'idioms',
    tag: 'EFFORT & RESILIENCE',
    conceptTitle: 'Burn the Midnight Oil · Silver Lining · Call It a Day',
    ruleOrFormula:
      'Burn the midnight oil = work late into the night. Silver lining = positive aspect inside a setback. Call it a day = stop work for the day.',
    example:
      '"The silver lining of that bug was stronger automated tests; after fixing it, we called it a day."',
    placementTip:
      'Do NOT confuse "burn the midnight oil" (hard work) with "burn the candle at both ends" (overworking to exhaustion).',
  },

  // =========================================================================
  // TRACK 11: PYTHON PROGRAMMING (6 Playbooks)
  // =========================================================================
  {
    id: 'pb_py_1',
    trackId: 'python_lang',
    tag: 'DATA MODEL & MUTABILITY',
    conceptTitle: 'Mutable vs Immutable & Default Argument Trap',
    ruleOrFormula:
      'Immutable: int, float, str, tuple, frozenset. Mutable: list, dict, set. NEVER use mutable default args like def f(a=[]); use a=None.',
    example:
      'def add_item(x, lst=None): lst = [] if lst is None else lst; lst.append(x); return lst',
    placementTip:
      'Default mutable arguments are evaluated ONCE at function definition time—#1 Python output trap in TCS Digital, Wipro & Amazon.',
  },
  {
    id: 'pb_py_2',
    trackId: 'python_lang',
    tag: 'PYTHONIC ITERATION',
    conceptTitle: 'List/Dict Comprehensions & Generators (yield)',
    ruleOrFormula:
      '[x*x for x in nums if x%2==0] builds a list in memory (O(N) space). (x*x for x in nums) or yield produces items lazily in O(1) memory.',
    example:
      'gen = (line.strip() for line in open("big.log"))  # streams gigabytes safely',
    placementTip:
      'Mentioning generators for large log/stream processing immediately signals senior Python engineering in FAANG interviews.',
  },
  {
    id: 'pb_py_3',
    trackId: 'python_lang',
    tag: 'IDENTITY VS EQUALITY',
    conceptTitle: 'is vs == & Shallow vs Deep Copy',
    ruleOrFormula:
      '== compares value; "is" compares memory identity (id()). copy.copy() copies outer container only; copy.deepcopy() recursively clones nested mutables.',
    example:
      'a = [1, 2]; b = [1, 2] → (a == b) is True, (a is b) is False. Always check "x is None".',
    placementTip:
      'Python caches small integers (-5 to 256), which is why "a=256; b=256; a is b" is True while 300 can be False!',
  },
  {
    id: 'pb_py_4',
    trackId: 'python_lang',
    tag: 'DECORATORS & CLOSURES',
    conceptTitle: 'First-Class Functions, *args/**kwargs & @wraps',
    ruleOrFormula:
      'A decorator wraps a function to add cross-cutting behavior (logging, timing, auth). Use @functools.wraps(fn) to preserve __name__ and __doc__.',
    example:
      'def log(fn):\n  @wraps(fn)\n  def wrapper(*args, **kwargs): return fn(*args, **kwargs)\n  return wrapper',
    placementTip:
      'Capgemini, Cognizant & Amazon Python interviews frequently ask you to write a timing or retry decorator from scratch.',
  },
  {
    id: 'pb_py_5',
    trackId: 'python_lang',
    tag: 'COMPLEXITY & COLLECTIONS',
    conceptTitle: 'Built-in Big-O & collections (Counter, deque, defaultdict)',
    ruleOrFormula:
      'dict/set lookup = O(1) avg; list.append/pop() = O(1); list.pop(0) = O(N) → use collections.deque.popleft() for O(1) queues.',
    example:
      'from collections import Counter; top3 = Counter(words).most_common(3)',
    placementTip:
      'Knowing Counter, defaultdict, and heapq turns 35-line DSA solutions into clean 8-line Python solutions in coding rounds.',
  },
  {
    id: 'pb_py_6',
    trackId: 'python_lang',
    tag: 'CONCURRENCY & GIL',
    conceptTitle: 'CPython GIL: Threading (I/O) vs Multiprocessing (CPU)',
    ruleOrFormula:
      'Global Interpreter Lock (GIL) allows only one thread to execute Python bytecode at a time. Use threading/asyncio for I/O-bound tasks; multiprocessing for CPU-bound tasks.',
    example:
      'API scraping → asyncio / ThreadPoolExecutor. Image/ML matrix crunching → ProcessPoolExecutor.',
    placementTip:
      'Interviewers at Google, Meta & Amazon love asking: "Why didn’t adding 8 threads speed up my CPU loop in Python?" Answer: The GIL.',
  },
];

// IMPORTANT: Appended at the END of MASTER_MCQS (indices 120..159) to preserve 100% of existing learner choices [0..119]
export const EXTENDED_TRACKS_MCQS: MasterMcq[] = [
  // =========================================================================
  // TRACK 05: TENSES (10 MCQs)
  // =========================================================================
  {
    id: 'ten_q1',
    trackId: 'tenses',
    topic: 'Simple Past vs Present Perfect',
    difficulty: 'Core',
    question:
      'Choose the grammatically correct sentence for a placement resume:',
    options: [
      'I have completed my internship at TCS in June 2024.',
      'I completed my internship at TCS in June 2024.',
      'I had completed my internship at TCS in June 2024.',
      'I am completing my internship at TCS in June 2024.',
    ],
    correctIndex: 1,
    hint: 'Notice the specific finished past timestamp ("in June 2024").',
    explanation:
      'A definite past time marker ("in June 2024", "yesterday", "two years ago") requires Simple Past ("completed"), never Present Perfect.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ten_q2',
    trackId: 'tenses',
    topic: 'Past Perfect Sequencing',
    difficulty: 'Applied',
    question:
      'By the time the production server restarted, the alert team ___ the root cause.',
    options: [
      'has already identified',
      'already identifies',
      'had already identified',
      'was already identifying',
    ],
    correctIndex: 2,
    hint: 'Two past events occurred; identify which happened EARLIER.',
    explanation:
      '"By the time + Simple Past (restarted)" signals an earlier completed past action, which requires Past Perfect ("had already identified").',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ten_q3',
    trackId: 'tenses',
    topic: 'Present Perfect Continuous',
    difficulty: 'Core',
    question:
      'Select the best sentence to state ongoing experience in an interview:',
    options: [
      'I am building full-stack projects since two years.',
      'I have been building full-stack projects for two years.',
      'I build full-stack projects since two years.',
      'I was building full-stack projects since two years.',
    ],
    correctIndex: 1,
    hint: '"Two years" is a duration (use "for"), and the action started in the past and continues now.',
    explanation:
      'Present Perfect Continuous ("have been building") + "for" (duration) accurately expresses an action that began in the past and continues into the present.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ten_q4',
    trackId: 'tenses',
    topic: 'Future Time Clauses',
    difficulty: 'Applied',
    question:
      'We will release the mobile patch as soon as the QA team ___ regression testing.',
    options: ['will finish', 'finishes', 'finished', 'will have finished'],
    correctIndex: 1,
    hint: 'Avoid "will" inside time clauses beginning with "as soon as", "when", or "until".',
    explanation:
      'In English, future time clauses ("as soon as", "when", "until", "if") use Simple Present ("finishes") to refer to a future event.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ten_q5',
    trackId: 'tenses',
    topic: 'Stative Verbs',
    difficulty: 'Core',
    question:
      'Which sentence uses a stative verb correctly?',
    options: [
      'She is knowing three programming languages fluently.',
      'She is owning a strong portfolio of analytics dashboards.',
      'She understands distributed caching architecture thoroughly.',
      'She is preferring Python over Java for scripting.',
    ],
    correctIndex: 2,
    hint: 'Verbs of knowledge, possession, and preference rarely take -ing.',
    explanation:
      'Stative verbs (know, own, understand, prefer) describe states rather than ongoing physical actions and therefore take Simple Present.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ten_q6',
    trackId: 'tenses',
    topic: 'Third Conditional',
    difficulty: 'Placement',
    question:
      'If the candidate ___ the constraints carefully, she would have solved the graph problem in O(V+E).',
    options: ['would have read', 'reads', 'had read', 'has read'],
    correctIndex: 2,
    hint: 'Look at the main clause ("would have solved") — match it with 3rd conditional.',
    explanation:
      'Third Conditional structure for an unreal past scenario is: "If + Past Perfect (had read), ... would have + V3 (would have solved)."',
    xpClean: 35,
    xpWithHint: 20,
  },
  {
    id: 'ten_q7',
    trackId: 'tenses',
    topic: 'Future Perfect',
    difficulty: 'Applied',
    question:
      'By next December, our engineering cohort ___ all 16 employability tracks.',
    options: [
      'will complete',
      'will have completed',
      'completes',
      'has completed',
    ],
    correctIndex: 1,
    hint: '"By + future deadline" points to an action finished BEFORE a future timestamp.',
    explanation:
      'Future Perfect ("will have + V3") describes an action that will already be completed prior to a specific point in the future ("By next December").',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ten_q8',
    trackId: 'tenses',
    topic: 'Since + Clause Rule',
    difficulty: 'Placement',
    question:
      'Revenue ___ by 42% since the company launched its self-serve onboarding flow.',
    options: ['grew', 'has grown', 'grows', 'had been growing'],
    correctIndex: 1,
    hint: 'Structure: Main Clause (Present Perfect) + since + Time Clause (Simple Past).',
    explanation:
      'When "since" introduces a Simple Past starting point ("since the company launched"), the main clause describing impact up to now takes Present Perfect ("has grown").',
    xpClean: 35,
    xpWithHint: 20,
  },
  {
    id: 'ten_q9',
    trackId: 'tenses',
    topic: 'Subjunctive & "It is high time"',
    difficulty: 'Placement',
    question:
      'It is high time our team ___ automated unit tests to the checkout pipeline.',
    options: ['adds', 'added', 'will add', 'has added'],
    correctIndex: 1,
    hint: 'The idiom "It is high time + subject" takes an unreal Simple Past verb.',
    explanation:
      '"It is (high/about) time + Subject + V2 (Simple Past)" is a classic TCS/Wipro/Capgemini verbal rule expressing urgency about something overdue.',
    xpClean: 35,
    xpWithHint: 20,
  },
  {
    id: 'ten_q10',
    trackId: 'tenses',
    topic: 'Reported Speech Backshifting',
    difficulty: 'Applied',
    question:
      'Direct: The interviewer said, "I have reviewed your GitHub repository." Indirect:',
    options: [
      'The interviewer said that he has reviewed my GitHub repository.',
      'The interviewer said that he had reviewed my GitHub repository.',
      'The interviewer said that he reviewed my GitHub repository yesterday.',
      'The interviewer said that he was reviewing my GitHub repository.',
    ],
    correctIndex: 1,
    hint: 'When the reporting verb is in the past ("said"), Present Perfect shifts one step back.',
    explanation:
      'In reported speech with a past reporting verb ("said"), Present Perfect ("have reviewed") backshifts to Past Perfect ("had reviewed").',
    xpClean: 30,
    xpWithHint: 20,
  },

  // =========================================================================
  // TRACK 06: PUNCTUATION (10 MCQs)
  // =========================================================================
  {
    id: 'punc_q1',
    trackId: 'punctuation',
    topic: 'Comma Splice',
    difficulty: 'Core',
    question: 'Which sentence is punctuated WITHOUT a comma splice?',
    options: [
      'The code compiled cleanly, the unit tests failed.',
      'The code compiled cleanly; however, the unit tests failed.',
      'The code compiled cleanly, however, the unit tests failed.',
      'The code compiled cleanly: the unit tests failed, however.',
    ],
    correctIndex: 1,
    hint: 'When "however" joins two independent clauses, put a semicolon before it and a comma after it.',
    explanation:
      'Two independent clauses joined by a conjunctive adverb ("however") require "; however," — a plain comma creates a comma splice.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'punc_q2',
    trackId: 'punctuation',
    topic: 'Apostrophes',
    difficulty: 'Core',
    question: 'Select the sentence with 100% accurate apostrophe usage:',
    options: [
      "The startup updated it's pricing model for all enterprise client's.",
      "The startup updated its pricing model for all enterprise clients'.",
      "It's clear that the startup improved its onboarding for all engineers' laptops.",
      "Its clear that the startup improved it's onboarding for all API's.",
    ],
    correctIndex: 2,
    hint: "Check: it's = it is, its = belonging to it, engineers' = plural possessive.",
    explanation:
      '"It’s" (it is), "its" (possessive), and "engineers’ laptops" (plural possessive) are all accurately punctuated in option C.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'punc_q3',
    trackId: 'punctuation',
    topic: 'Colon Usage',
    difficulty: 'Applied',
    question: 'Which sentence uses a colon correctly?',
    options: [
      'Our core placement pillars are: Aptitude, Coding, and Communication.',
      'The role requires: Python, SQL, and Power BI.',
      'The role requires three core skills: Python, SQL, and Power BI.',
      'Because: the deadline moved up, we reprioritized.',
    ],
    correctIndex: 2,
    hint: 'A colon must follow a grammatically complete independent clause.',
    explanation:
      'Never split a verb ("are", "requires") from its object with a colon. "The role requires three core skills:" is a complete clause before the list.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'punc_q4',
    trackId: 'punctuation',
    topic: 'Compound Modifiers & Hyphens',
    difficulty: 'Applied',
    question: 'Choose the correctly hyphenated executive sentence:',
    options: [
      'We launched a highly-scalable, cloud based analytics tool.',
      'We launched a highly scalable, cloud-based analytics tool.',
      'We launched a well documented, twenty minute-presentation deck.',
      'She delivered a twenty minute-presentation to stakeholders.',
    ],
    correctIndex: 1,
    hint: 'Never hyphenate "-ly" adverbs; DO hyphenate compound modifiers placed BEFORE a noun.',
    explanation:
      '"Highly" ends in -ly (no hyphen). "Cloud-based" precedes the noun "analytics tool", so it takes a hyphen.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'punc_q5',
    trackId: 'punctuation',
    topic: 'Restrictive vs Non-Restrictive Clauses',
    difficulty: 'Placement',
    question:
      'Which sentence means ONLY the candidates who completed the capstone received an LOR?',
    options: [
      'Candidates, who completed the capstone, received a Placement LOR.',
      'Candidates who completed the capstone received a Placement LOR.',
      'Candidates; who completed the capstone, received a Placement LOR.',
      'Candidates—who completed the capstone—received a Placement LOR.',
    ],
    correctIndex: 1,
    hint: 'Essential (restrictive) defining clauses take NO commas.',
    explanation:
      'Removing commas makes "who completed the capstone" restrictive—identifying the exact subset of candidates who earned the LOR.',
    xpClean: 35,
    xpWithHint: 20,
  },
  {
    id: 'punc_q6',
    trackId: 'punctuation',
    topic: 'Semicolons in Complex Lists',
    difficulty: 'Placement',
    question:
      'When listing cities and countries (e.g., Bengaluru, India and Austin, USA), which punctuation prevents confusion?',
    options: [
      'Use commas only between every word',
      'Use semicolons to separate major list items that already contain internal commas',
      'Use colons between each city and country',
      'Wrap each country in quotation marks',
    ],
    correctIndex: 1,
    hint: 'Think of a "super-comma" that separates complex items cleanly.',
    explanation:
      'Super-semicolons clarify complex lists: "Offices in Bengaluru, India; Austin, USA; and Dublin, Ireland."',
    xpClean: 35,
    xpWithHint: 20,
  },
  {
    id: 'punc_q7',
    trackId: 'punctuation',
    topic: 'Oxford / Serial Comma',
    difficulty: 'Core',
    question:
      'Why do Amazon and consulting style guides prefer: "We thanked our mentors, Kapil, and the CTO"?',
    options: [
      'Because commas are mandatory before every conjunction',
      'To clarify that "mentors", "Kapil", and "the CTO" are three separate entities',
      'To turn the sentence into a passive construction',
      'To replace a missing semicolon',
    ],
    correctIndex: 1,
    hint: 'Without the comma after "Kapil", it could sound like Kapil and the CTO ARE the mentors.',
    explanation:
      'The Oxford (serial) comma removes appositive ambiguity in multi-item lists.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'punc_q8',
    trackId: 'punctuation',
    topic: 'Introductory Dependent Clause',
    difficulty: 'Core',
    question: 'Choose the properly punctuated sentence:',
    options: [
      'After optimizing the SQL index query latency dropped by 70%.',
      'After optimizing the SQL index, query latency dropped by 70%.',
      'After optimizing the SQL index; query latency dropped by 70%.',
      'After optimizing, the SQL index query latency dropped by 70%.',
    ],
    correctIndex: 1,
    hint: 'An introductory participial/prepositional phrase needs a comma before the main subject.',
    explanation:
      'Placing a comma after an introductory phrase ("After optimizing the SQL index,") prevents misreading "index query" as a single noun phrase.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'punc_q9',
    trackId: 'punctuation',
    topic: 'Em-Dash Usage',
    difficulty: 'Applied',
    question: 'Which sentence uses an em-dash (—) most effectively for executive emphasis?',
    options: [
      'Only one metric mattered to the board—customer retention.',
      'Only one metric—mattered to the board customer retention.',
      'Only one—metric mattered to—the board customer retention.',
      'Only one metric mattered—to the board: customer retention.',
    ],
    correctIndex: 0,
    hint: 'An em-dash spotlights a dramatic reveal or parenthetical summary cleanly.',
    explanation:
      'A single em-dash before a punchline ("—customer retention") creates crisp executive emphasis without clutter.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'punc_q10',
    trackId: 'punctuation',
    topic: 'Direct Question vs Indirect Question',
    difficulty: 'Applied',
    question: 'Select the sentence with the correct ending punctuation:',
    options: [
      'The recruiter asked whether I had deployed projects on AWS?',
      'Could you confirm when the technical round begins.',
      'The recruiter asked whether I had deployed projects on AWS.',
      'I wondered if the API supports pagination?',
    ],
    correctIndex: 2,
    hint: 'Indirect questions ("asked whether...", "wondered if...") are statements, so they end with a period.',
    explanation:
      'An indirect question reports a question inside a declarative statement and therefore ends with a period (.), not a question mark (?).',
    xpClean: 30,
    xpWithHint: 20,
  },

  // =========================================================================
  // TRACK 07: IDIOMS & PHRASES (10 MCQs)
  // =========================================================================
  {
    id: 'idi_q1',
    trackId: 'idioms',
    topic: 'Corporate Idioms',
    difficulty: 'Core',
    question:
      'The hiring manager wants a fresher who can "hit the ground running." What does this mean?',
    options: [
      'Participate in company marathons',
      'Start contributing effectively with minimal ramp-up time',
      'Work only on outdoor sales roles',
      'Switch departments within the first month',
    ],
    correctIndex: 1,
    hint: 'Think of landing smoothly already in motion.',
    explanation:
      '"Hit the ground running" means starting a new project or job immediately with high energy and rapid productivity.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'idi_q2',
    trackId: 'idioms',
    topic: 'Quality & Ethics',
    difficulty: 'Core',
    question:
      'In software delivery, "cutting corners" refers to:',
    options: [
      'Designing minimalist rounded UI icons',
      'Taking cheap or hasty shortcuts that compromise quality or safety',
      'Reducing cloud infrastructure waste cleanly',
      'Splitting a large sprint into smaller stories',
    ],
    correctIndex: 1,
    hint: 'It carries a negative connotation regarding standards.',
    explanation:
      '"Cut corners" means skipping essential steps to save time/money at the cost of quality or integrity.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'idi_q3',
    trackId: 'idioms',
    topic: 'Decision Courage',
    difficulty: 'Core',
    question:
      'Our CTO decided to "bite the bullet" and migrate off the legacy database. This means:',
    options: [
      'Delay the migration indefinitely',
      'Endure an unavoidable, difficult task with resolve',
      'Outsource the task to an external agency',
      'Cancel the product roadmap altogether',
    ],
    correctIndex: 1,
    hint: 'Historically derived from facing pain bravely without hesitation.',
    explanation:
      '"Bite the bullet" means bravely accepting and executing a tough, unavoidable decision.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'idi_q4',
    trackId: 'idioms',
    topic: 'Group Discussion Strategy',
    difficulty: 'Applied',
    question:
      'When a speaker says, "Let me play devil’s advocate for a moment," they intend to:',
    options: [
      'Insult the previous speaker personally',
      'Present a counter-argument to test the strength of the group’s idea',
      'End the Group Discussion abruptly',
      'Agree unanimously with the majority view',
    ],
    correctIndex: 1,
    hint: 'Used in boardrooms to stress-test assumptions objectively.',
    explanation:
      'Playing "devil’s advocate" means deliberately voicing the opposing viewpoint to uncover blind spots and strengthen decisions.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'idi_q5',
    trackId: 'idioms',
    topic: 'Executive Communication',
    difficulty: 'Applied',
    question:
      'During the quarterly review, declining mobile retention was the "elephant in the room." What does this signify?',
    options: [
      'The most profitable product line',
      'An obvious, major problem that everyone is reluctant to discuss',
      'A surprise bonus announced by leadership',
      'A minor UI bug discovered by QA',
    ],
    correctIndex: 1,
    hint: 'Something huge sitting in plain sight that nobody mentions.',
    explanation:
      '"Elephant in the room" refers to a glaring issue everyone is aware of but avoids addressing directly.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'idi_q6',
    trackId: 'idioms',
    topic: 'Troubleshooting',
    difficulty: 'Applied',
    question:
      'Debugging the CSS when the real failure was a 500 API error is an example of:',
    options: [
      'Moving the needle',
      'Barking up the wrong tree',
      'Breaking the ice',
      'Leaving no stone unturned',
    ],
    correctIndex: 1,
    hint: 'Pursuing the wrong lead or blaming the wrong source.',
    explanation:
      '"Barking up the wrong tree" means looking for a solution or cause in the wrong place.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'idi_q7',
    trackId: 'idioms',
    topic: 'Product & Analytics',
    difficulty: 'Placement',
    question:
      'A product manager prioritizes "low-hanging fruit" that can still "move the needle." This means:',
    options: [
      'Choosing expensive multi-year research projects',
      'Capturing quick, easy wins that produce measurable business impact',
      'Ignoring customer feedback to save time',
      'Hiring senior executives for entry-level roles',
    ],
    correctIndex: 1,
    hint: 'Combine "easy to reach" + "creates visible metric change".',
    explanation:
      '"Low-hanging fruit" = easily achievable targets; "move the needle" = create meaningful, measurable progress.',
    xpClean: 35,
    xpWithHint: 20,
  },
  {
    id: 'idi_q8',
    trackId: 'idioms',
    topic: 'Reading Comprehension',
    difficulty: 'Core',
    question:
      'What does it mean to "read between the lines" of a client’s email?',
    options: [
      'Read only every second sentence',
      'Understand the implied or unstated meaning beneath the literal words',
      'Check the document for font alignment errors',
      'Memorize the email word for word',
    ],
    correctIndex: 1,
    hint: 'Focus on subtext and indirect signals.',
    explanation:
      '"Read between the lines" means discerning hidden intent, tone, or unspoken concerns in communication.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'idi_q9',
    trackId: 'idioms',
    topic: 'Iteration & Resilience',
    difficulty: 'Applied',
    question:
      'When the prototype failed user testing, the team went "back to the drawing board." They:',
    options: [
      'Published the buggy prototype anyway',
      'Started redesigning the solution from the beginning',
      'Blamed the testing cohort',
      'Cancelled all future engineering work',
    ],
    correctIndex: 1,
    hint: 'Think of an architect returning to fresh blueprint paper.',
    explanation:
      '"Back to the drawing board" means returning to the planning stage to rethink and rebuild after an unsuccessful attempt.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'idi_q10',
    trackId: 'idioms',
    topic: 'Nuance Distinction',
    difficulty: 'Placement',
    question:
      'Which idiom means "working so relentlessly without rest that you risk burnout"?',
    options: [
      'In the same boat',
      'Burning the candle at both ends',
      'A blessing in disguise',
      'Once in a blue moon',
    ],
    correctIndex: 1,
    hint: 'Picture a candle melting down twice as fast from top and bottom.',
    explanation:
      '"Burning the candle at both ends" means exhausting yourself by working excessively early and late without recovery.',
    xpClean: 35,
    xpWithHint: 20,
  },

  // =========================================================================
  // TRACK 11: PYTHON PROGRAMMING (10 MCQs)
  // =========================================================================
  {
    id: 'py_q1',
    trackId: 'python_lang',
    topic: 'Mutable Default Arguments',
    difficulty: 'Placement',
    question:
      'What is printed by: def f(x, a=[]): a.append(x); return a; print(f(1), f(2)) ?',
    options: [
      '[1] [2]',
      '[1, 2] [1, 2]',
      '[1] [1, 2]',
      'TypeError: mutable default argument',
    ],
    correctIndex: 1,
    hint: 'Both f(1) and f(2) mutate and return the SAME list object before print() evaluates both arguments!',
    explanation:
      'Default argument a=[] is created once at def-time. f(1) appends 1 and returns ref to a; f(2) appends 2 to the SAME a and returns it. When print executes, both references point to [1, 2]!',
    xpClean: 35,
    xpWithHint: 20,
  },
  {
    id: 'py_q2',
    trackId: 'python_lang',
    topic: 'Identity vs Equality',
    difficulty: 'Core',
    question:
      'In Python, given a = [1, 2, 3] and b = a[:], what does (a == b, a is b) evaluate to?',
    options: [
      '(True, True)',
      '(True, False)',
      '(False, True)',
      '(False, False)',
    ],
    correctIndex: 1,
    hint: 'Slicing a[:] creates a brand-new shallow copy list in memory.',
    explanation:
      'a[:] allocates a new list with identical elements, so value equality (a == b) is True, while object identity (a is b) is False.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'py_q3',
    trackId: 'python_lang',
    topic: 'Generators & Memory',
    difficulty: 'Core',
    question:
      'Why is (x*x for x in range(10_000_000)) preferred over [x*x for x in range(10_000_000)] when summing squares?',
    options: [
      'Generator expressions run on multiple CPU cores automatically',
      'Generator expressions compute values lazily using O(1) memory instead of storing 10M integers',
      'List comprehensions cannot iterate over range()',
      'Generators sort items automatically in ascending order',
    ],
    correctIndex: 1,
    hint: 'Compare eager memory allocation vs lazy on-demand evaluation.',
    explanation:
      'A generator yields one item at a time in O(1) memory, avoiding allocating a huge 10-million-element list in RAM.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'py_q4',
    trackId: 'python_lang',
    topic: 'Dictionary Complexity & Hashing',
    difficulty: 'Core',
    question:
      'Which of the following CANNOT be used as a Python dictionary key?',
    options: [
      '(1, "kapil")',
      'frozenset([1, 2])',
      '[1, 2]',
      '42',
    ],
    correctIndex: 2,
    hint: 'Dictionary keys must be hashable (immutable).',
    explanation:
      'Lists are mutable and unhashable (raising TypeError: unhashable type: "list"). Tuples of immutables, frozensets, ints, and strings are hashable.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'py_q5',
    trackId: 'python_lang',
    topic: 'CPython GIL',
    difficulty: 'Placement',
    question:
      'Which Python module is best suited to parallelize a CPU-intensive prime-number calculation across 8 cores?',
    options: [
      'threading',
      'asyncio',
      'multiprocessing',
      'itertools',
    ],
    correctIndex: 2,
    hint: 'Remember the Global Interpreter Lock (GIL) restricts threads inside one Python process.',
    explanation:
      'multiprocessing spawns separate OS processes—each with its own Python interpreter and GIL—enabling true multi-core parallelism for CPU-bound work.',
    xpClean: 35,
    xpWithHint: 20,
  },
  {
    id: 'py_q6',
    trackId: 'python_lang',
    topic: 'Shallow Copy Trap',
    difficulty: 'Applied',
    question:
      'Given a = [[1, 2], [3, 4]] and b = a.copy(); b[0].append(99), what is a[0]?',
    options: ['[1, 2]', '[1, 2, 99]', '[[1, 2], 99]', 'IndexError'],
    correctIndex: 1,
    hint: 'list.copy() performs a SHALLOW copy—inner lists are still shared references.',
    explanation:
      'Shallow copy duplicates only the outer list. Both a[0] and b[0] reference the same inner list, so mutating b[0] mutates a[0]. Use copy.deepcopy() to isolate nested lists.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'py_q7',
    trackId: 'python_lang',
    topic: 'Slicing & Strings',
    difficulty: 'Core',
    question: 'What does "EMPLOYABILITY"[::-2] evaluate to?',
    options: ['"YTILIBAYOLPME"', '"YIIAOPE"', '"EPLBITY"', '"YTLBYLP"'],
    correctIndex: 1,
    hint: 'Start from index 12 ("Y") and step backwards by 2: indices 12, 10, 8, 6, 4, 2, 0.',
    explanation:
      'In "EMPLOYABILITY" (0:E, 1:M, 2:P, 3:L, 4:O, 5:Y, 6:A, 7:B, 8:I, 9:L, 10:I, 11:T, 12:Y), slicing [::-2] picks indices 12(Y), 10(I), 8(I), 6(A), 4(O), 2(P), 0(E) -> "YIIAOPE".',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'py_q8',
    trackId: 'python_lang',
    topic: 'Decorators & functools.wraps',
    difficulty: 'Applied',
    question:
      'What is the purpose of @functools.wraps(func) inside a Python decorator?',
    options: [
      'It speeds up execution by compiling Python to C',
      'It preserves the original function’s metadata (__name__, __doc__, signature)',
      'It automatically caches return values like lru_cache',
      'It prevents exceptions from propagating out of the wrapper',
    ],
    correctIndex: 1,
    hint: 'Without @wraps, decorated_fn.__name__ becomes "wrapper".',
    explanation:
      '@functools.wraps copies __name__, __doc__, __module__, and annotations from the wrapped function onto the wrapper for clean debugging and docs.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'py_q9',
    trackId: 'python_lang',
    topic: 'Data Structure Big-O',
    difficulty: 'Applied',
    question:
      'Which operation is O(1) amortized in Python’s collections.deque but O(N) in a built-in Python list?',
    options: [
      'append(x)',
      'pop()',
      'popleft() / pop(0)',
      'len(container)',
    ],
    correctIndex: 2,
    hint: 'Removing from the front of a dynamic array shifts all remaining elements left.',
    explanation:
      'list.pop(0) shifts N-1 elements in O(N), whereas deque is a doubly-linked block structure supporting O(1) popleft() and appendleft().',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'py_q10',
    trackId: 'python_lang',
    topic: 'Exception Handling & Context Managers',
    difficulty: 'Applied',
    question:
      'In a Python try / except / else / finally block, when does the "else" block execute?',
    options: [
      'Only when an exception is raised and caught',
      'Only when NO exception was raised in the try block',
      'Always, even if the try block returns early',
      'Only when the finally block fails',
    ],
    correctIndex: 1,
    hint: 'Think of "else" as the clean-path continuation after try succeeds.',
    explanation:
      'The "else" clause runs strictly when the try suite finishes with zero exceptions, keeping normal success logic separate from guarded failure lines.',
    xpClean: 30,
    xpWithHint: 20,
  },
];

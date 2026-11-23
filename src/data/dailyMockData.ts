import { CAREER_MCQS } from './careerSkillsData';
import { FINAL_MCQS } from './finalAssessmentData';
import { MASTER_MCQS } from './masterUniverseData';
import { MASTER_TRACKS, MasterTrackId } from './masterUniverseTypes';
import {
  NOV_23_ASSESSMENT_MCQS,
  NOV_23_DATE_KEY,
  NOV_23_EDITION_TITLE,
  NOV_23_PAPER_CODE,
} from './nov23AssessmentData';
import { SHOPPING_MCQS } from './shoppingNegotiationData';

export { NOV_23_DATE_KEY, NOV_23_EDITION_TITLE, NOV_23_PAPER_CODE };

export type DailyMockPillarId =
  | 'aptitude_logic'
  | 'english_grammar'
  | 'coding_dsa'
  | 'data_cloud'
  | 'career_comm'
  | 'shopping_negotiation'
  | 'picture_ai';

export interface DailyMockPillarMeta {
  id: DailyMockPillarId;
  title: string;
  shortTitle: string;
  topicsLabel: string;
  targetHard: number;
  targetStandard: number;
}

export const DAILY_MOCK_PILLARS: DailyMockPillarMeta[] = [
  {
    id: 'aptitude_logic',
    title: 'Quantitative & Logical Aptitude',
    shortTitle: 'Aptitude',
    topicsLabel: 'Numbers, Probability, P&C, Time & Work, Logical Deduction',
    targetHard: 3,
    targetStandard: 3,
  },
  {
    id: 'english_grammar',
    title: 'Grammar, Tenses, Punctuation & Idioms',
    shortTitle: 'Grammar & Verbal',
    topicsLabel: 'Grammar, Parts of Speech, Tenses, Punctuation, Idioms',
    targetHard: 3,
    targetStandard: 3,
  },
  {
    id: 'coding_dsa',
    title: 'C, C++, Java, Python & DSA',
    shortTitle: 'Coding & DSA',
    topicsLabel: 'C, C++, Java, Python, Trees, Graphs, DP & Complexity',
    targetHard: 4,
    targetStandard: 4,
  },
  {
    id: 'data_cloud',
    title: 'Excel, Power BI, DBMS & Cloud',
    shortTitle: 'Data & Cloud',
    topicsLabel: 'Excel Formulas, DAX, SQL/ACID, Normalization, AWS/GCP',
    targetHard: 3,
    targetStandard: 3,
  },
  {
    id: 'career_comm',
    title: 'Indianism, Interview & GD Skills',
    shortTitle: 'Career & Comm',
    topicsLabel: 'Global English, STAR/SCARE Interviews, Executive GD',
    targetHard: 3,
    targetStandard: 3,
  },
  {
    id: 'shopping_negotiation',
    title: 'Shopping, Buyer Psychology & Negotiation',
    shortTitle: 'Shopping & Deals',
    topicsLabel: 'Buyer Personas, Anchoring, BATNA, Deal Timing & Traps',
    targetHard: 2,
    targetStandard: 2,
  },
  {
    id: 'picture_ai',
    title: 'Picture Connect, Critical Thinking & AI',
    shortTitle: 'Visual & AI',
    topicsLabel: 'SCARE Visual Reasoning, Leadership Framing & AI Prompting',
    targetHard: 2,
    targetStandard: 2,
  },
];

export const DAILY_MOCK_CONFIG = {
  durationSeconds: 3600, // 60 minutes
  durationMinutes: 60,
  totalQuestions: 40,
  hardQuestions: 20, // Strictly 50% Hard MCQs
  standardQuestions: 20, // Strictly 50% Standard/Applied MCQs
  passPercent: 60,
  maxXpPerDay: 500,
};

export interface DailyMockQuestion {
  id: string;
  pillarId: DailyMockPillarId;
  pillarTitle: string;
  topic: string;
  difficulty: 'Hard' | 'Standard';
  sourceTag: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface DailyMockPaper {
  dateKey: string;
  paperCode: string;
  displayDate: string;
  editionTitle?: string;
  isSpecialEdition?: boolean;
  durationSeconds: number;
  totalQuestions: number;
  hardCount: number;
  standardCount: number;
  questions: DailyMockQuestion[];
}

export interface DailyMockPillarScore {
  pillarId: DailyMockPillarId;
  pillarTitle: string;
  shortTitle: string;
  total: number;
  correct: number;
  hardTotal: number;
  hardCorrect: number;
  percent: number;
}

export interface DailyMockGradeResult {
  totalQuestions: number;
  hardQuestionCount: number;
  answeredCount: number;
  correctCount: number;
  hardCorrectCount: number;
  standardCorrectCount: number;
  scorePercent: number;
  hardAccuracyPercent: number;
  standardAccuracyPercent: number;
  passed: boolean;
  gradeLabel: 'Distinction' | 'Merit' | 'Pass' | 'Needs Review';
  xpAwarded: number;
  pillarScores: DailyMockPillarScore[];
  strongestTopic: string;
  weakestTopic: string;
  topicSummary: string;
  mentorAdvice: string;
}

/**
 * 40 dedicated original Hard / FAANG / Senior Placement-grade MCQs spanning
 * all 7 Employability Universe pillars so every Daily 60-Min Mock guarantees
 * a genuine 50% Hard challenge bank.
 */
export const DEDICATED_HARD_MOCK_MCQS: DailyMockQuestion[] = [
  // ---- 1. Aptitude & Logic (6 Hard) ----
  {
    id: 'dm_hard_apt_1',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Probability & Bayes Logic',
    difficulty: 'Hard',
    sourceTag: 'FAANG Quant Hard',
    question:
      'A placement screening test is 90% accurate for strong candidates and has a 10% false-positive rate for weak candidates. If 20% of applicants are truly strong, what is the probability that a candidate who passes the test is actually strong?',
    options: ['69.2%', '90.0%', '50.0%', '75.0%'],
    correctIndex: 0,
    explanation:
      'By Bayes Theorem: P(Strong|Pass) = (0.20 * 0.90) / (0.20 * 0.90 + 0.80 * 0.10) = 0.18 / 0.26 = 9/13 ≈ 69.2%.',
  },
  {
    id: 'dm_hard_apt_2',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Permutations & Derangements',
    difficulty: 'Hard',
    sourceTag: 'Amazon / Google Quant',
    question:
      '4 offer letters are placed randomly into 4 addressed envelopes. In how many ways can ALL 4 letters be placed into the WRONG envelopes (complete derangement D4)?',
    options: ['6', '9', '12', '15'],
    correctIndex: 1,
    explanation:
      'Derangement formula D(n) = n!(1 - 1/1! + 1/2! - 1/3! + 1/4!) = 24 * (1/2 - 1/6 + 1/24) = 24 * (9/24) = 9.',
  },
  {
    id: 'dm_hard_apt_3',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Time, Speed & Relative Catch-Up',
    difficulty: 'Hard',
    sourceTag: 'TCS Digital / Capgemini Hard',
    question:
      'Two trains start simultaneously from stations A and B towards each other. After crossing, Train 1 takes 4 hours to reach B and Train 2 takes 9 hours to reach A. If Train 1 runs at 60 km/h, what is Train 2’s speed?',
    options: ['40 km/h', '45 km/h', '50 km/h', '90 km/h'],
    correctIndex: 0,
    explanation:
      'When two bodies take t1 and t2 hours after meeting: S1 / S2 = sqrt(t2 / t1) = sqrt(9/4) = 3/2. Hence S2 = 60 * 2 / 3 = 40 km/h.',
  },
  {
    id: 'dm_hard_apt_4',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Mixtures & Replacement',
    difficulty: 'Hard',
    sourceTag: 'Deloitte / Cognizant Hard',
    question:
      'A 40-liter container is full of pure concentrate. 4 liters are drawn out and replaced with water; this process is repeated two more times (3 operations total). How much concentrate remains?',
    options: ['28.00 L', '29.16 L', '30.24 L', '26.84 L'],
    correctIndex: 1,
    explanation:
      'Remaining = Initial * (1 - x/V)^n = 40 * (1 - 4/40)^3 = 40 * (0.9)^3 = 40 * 0.729 = 29.16 liters.',
  },
  {
    id: 'dm_hard_apt_5',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Number Theory & Remainders',
    difficulty: 'Hard',
    sourceTag: 'FAANG Quant Hard',
    question: 'What is the remainder when 7^100 is divided by 5?',
    options: ['1', '2', '3', '4'],
    correctIndex: 0,
    explanation:
      '7 ≡ 2 (mod 5). By Fermat’s Little Theorem, 2^4 ≡ 1 (mod 5). Since 100 is divisible by 4, 2^100 = (2^4)^25 ≡ 1^25 = 1 (mod 5).',
  },
  {
    id: 'dm_hard_apt_6',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Work Efficiency & Alternating Shifts',
    difficulty: 'Hard',
    sourceTag: 'Wipro Elite / Accenture Hard',
    question:
      'Pipe A fills a tank in 12 hrs, Pipe B in 15 hrs, and Drain C empties it in 20 hrs. If all three open together for 4 hours and then C is closed, how many additional hours do A and B need to fill the rest?',
    options: ['4 hours', '4.44 hours', '5 hours', '3.5 hours'],
    correctIndex: 0,
    explanation:
      'LCM = 60 units. Rates: A=+5, B=+4, C=-3. Combined rate for 4 hrs = (5+4-3)*4 = 24 units. Remaining = 36 units. With C closed, A+B = 9 units/hr => 36/9 = 4 additional hours.',
  },

  // ---- 2. English Grammar, Tenses, Punctuation & Idioms (6 Hard) ----
  {
    id: 'dm_hard_eng_1',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Subjunctive Mood & Inversion',
    difficulty: 'Hard',
    sourceTag: 'GMAT / Verbal Hard',
    question:
      'Identify the grammatically impeccable corporate sentence using conditional inversion:',
    options: [
      'Had the engineering team audited the schema earlier, the outage would have been prevented.',
      'Had the engineering team audited the schema earlier, the outage would be prevented.',
      'Were the engineering team audited the schema earlier, the outage would have been prevented.',
      'Should the engineering team had audited the schema earlier, the outage would have been prevented.',
    ],
    correctIndex: 0,
    explanation:
      'Third conditional inversion drops "If" and fronts "Had": "Had + subject + past participle, subject + would have + past participle."',
  },
  {
    id: 'dm_hard_eng_2',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Dangling Modifiers & Parallelism',
    difficulty: 'Hard',
    sourceTag: 'Verbal Precision Hard',
    question: 'Which sentence eliminates the dangling modifier cleanly?',
    options: [
      'Having reviewed all 40 test cases, the deployment pipeline was approved by the QA lead.',
      'Having reviewed all 40 test cases, the QA lead approved the deployment pipeline.',
      'Reviewing all 40 test cases, the deployment pipeline received approval.',
      'After reviewing all 40 test cases, approval was granted to the deployment pipeline.',
    ],
    correctIndex: 1,
    explanation:
      'The subject immediately following the participial phrase ("Having reviewed...") MUST be the actor who performed the review ("the QA lead"), not the pipeline.',
  },
  {
    id: 'dm_hard_eng_3',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Semicolons vs Conjunctive Adverbs',
    difficulty: 'Hard',
    sourceTag: 'Punctuation Hard',
    question: 'Choose the sentence with zero comma-splice and exact punctuation:',
    options: [
      'The quarterly revenue grew by 18%, however, operating margins tightened slightly.',
      'The quarterly revenue grew by 18%; however, operating margins tightened slightly.',
      'The quarterly revenue grew by 18%; however operating margins tightened slightly.',
      'The quarterly revenue grew by 18%, however; operating margins tightened slightly.',
    ],
    correctIndex: 1,
    explanation:
      'Joining two independent clauses with a conjunctive adverb ("however", "therefore", "moreover") requires a semicolon before it and a comma after it.',
  },
  {
    id: 'dm_hard_eng_4',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Correlative Conjunction Agreement',
    difficulty: 'Hard',
    sourceTag: 'Parts of Grammar Hard',
    question:
      'Select the correct verb form: "Neither the senior architects nor the lead developer ___ able to reproduce the race condition in staging."',
    options: ['were', 'was', 'have been', 'are'],
    correctIndex: 1,
    explanation:
      'With "Neither... nor...", the verb agrees with the subject closest to it ("the lead developer" = singular) => "was".',
  },
  {
    id: 'dm_hard_eng_5',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Executive Idioms in Context',
    difficulty: 'Hard',
    sourceTag: 'Idioms Hard',
    question:
      'During a post-mortem, the VP said: "Cutting security tests to ship two days early proved to be a Pyrrhic victory." What does "Pyrrhic victory" mean?',
    options: [
      'A surprise win achieved through superior preparation',
      'A victory won at such an excessive cost that it amounts to a defeat',
      'A temporary compromise negotiated between rival teams',
      'An effortless success with zero technical debt',
    ],
    correctIndex: 1,
    explanation:
      'A "Pyrrhic victory" denotes winning a short-term goal while suffering devastating long-term costs (such as a major security breach).',
  },
  {
    id: 'dm_hard_eng_6',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Past Perfect Continuous Sequence',
    difficulty: 'Hard',
    sourceTag: 'Tenses Hard',
    question:
      'Complete accurately: "By the time the client signed the enterprise contract in June, our solutions team ___ on the proof-of-concept for seven months."',
    options: [
      'worked',
      'has been working',
      'had been working',
      'was working',
    ],
    correctIndex: 2,
    explanation:
      'Duration continuing up to a specific past reference point ("By the time... signed") demands the Past Perfect Continuous ("had been working").',
  },

  // ---- 3. C, C++, Java, Python & DSA (8 Hard) ----
  {
    id: 'dm_hard_code_1',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'DSA · Graph Shortest Paths',
    difficulty: 'Hard',
    sourceTag: 'Google / Meta DSA Hard',
    question:
      'Why does standard Dijkstra’s algorithm fail on graphs with negative edge weights even when no negative cycle exists?',
    options: [
      'Priority queues cannot store negative integers in Java or C++',
      'Its greedy invariant assumes once a vertex is popped with minimum distance, no longer path can later yield a smaller total distance',
      'Adjacency lists cannot represent negative weights',
      'Dijkstra only works on unweighted undirected trees',
    ],
    correctIndex: 1,
    explanation:
      'Dijkstra permanently finalizes the smallest tentative vertex assuming future edges are non-negative. A negative edge downstream can relax an already-finalized vertex.',
  },
  {
    id: 'dm_hard_code_2',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Python · Mutable Default & Closures',
    difficulty: 'Hard',
    sourceTag: 'Amazon Python Hard',
    question:
      'What does `funcs = [lambda x: x + i for i in range(3)]; print([f(10) for f in funcs])` output in Python?',
    options: ['[10, 11, 12]', '[12, 12, 12]', '[13, 13, 13]', 'NameError'],
    correctIndex: 1,
    explanation:
      'Python closures capture variables by late binding (reference), not value. After the loop ends, `i == 2`, so every lambda computes `10 + 2 = 12`. Fix with `lambda x, i=i: x + i`.',
  },
  {
    id: 'dm_hard_code_3',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Java · Concurrency & Visibility',
    difficulty: 'Hard',
    sourceTag: 'Java Backend Hard',
    question:
      'In Java, declaring `private volatile int count = 0;` and executing `count++` from 10 concurrent threads is NOT thread-safe. Why?',
    options: [
      '`volatile` disables CPU caching completely so variables reset to 0',
      '`volatile` guarantees visibility and ordering, but `count++` is a non-atomic compound read-modify-write operation',
      '`volatile` only works on reference types, not `int`',
      'JVM rejects `volatile` inside multi-threaded classes',
    ],
    correctIndex: 1,
    explanation:
      '`volatile` ensures every thread reads the latest main-memory value, but `count++` performs read -> increment -> write across 3 steps, causing lost updates unless `AtomicInteger` or synchronization is used.',
  },
  {
    id: 'dm_hard_code_4',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'C++ · Virtual Destructors & UB',
    difficulty: 'Hard',
    sourceTag: 'Microsoft C++ Hard',
    question:
      'Deleting a Derived object through a Base class pointer (`Base* p = new Derived(); delete p;`) when Base has a NON-virtual destructor results in:',
    options: [
      'Compile-time error enforced by the C++ standard',
      'Automatic invocation of Derived::~Derived() followed by Base::~Base()',
      'Undefined Behavior (typically leaking Derived’s resources because only Base’s destructor runs)',
      'A safe runtime exception `std::bad_destructor`',
    ],
    correctIndex: 2,
    explanation:
      'Deleting a polymorphic derived instance through a base pointer without a virtual destructor is strictly Undefined Behavior in C++.',
  },
  {
    id: 'dm_hard_code_5',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'C · Pointer Arithmetic & Sequence',
    difficulty: 'Hard',
    sourceTag: 'Systems C Hard',
    question:
      'Given `int arr[] = {10, 20, 30, 40}; int *p = arr;` on a 64-bit system where `sizeof(int) == 4`, what is the value of `*(p + 2)` and `(char*)(p + 2) - (char*)p`?',
    options: ['30 and 2', '30 and 8', '20 and 8', '40 and 16'],
    correctIndex: 1,
    explanation:
      '`p + 2` advances by `2 * sizeof(int) = 8` bytes pointing to `arr[2] == 30`. Casting both pointers to `char*` yields the raw byte difference `8`.',
  },
  {
    id: 'dm_hard_code_6',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'DSA · Dynamic Programming Space Optimization',
    difficulty: 'Hard',
    sourceTag: 'FAANG DSA Hard',
    question:
      'In 0/1 Knapsack with capacity `W` using a single 1D DP array `dp[0..W]`, why MUST the inner loop over capacity `w` iterate backwards from `W` down to `weight[i]`?',
    options: [
      'To improve CPU cache prefetching only',
      'So each item is considered at most once; iterating forwards would reuse already-updated states in the same row (turning it into Unbounded Knapsack)',
      'Because C++ arrays throw out-of-bounds if iterated forwards',
      'Because backwards iteration reduces time complexity from O(NW) to O(N log W)',
    ],
    correctIndex: 1,
    explanation:
      'Backward iteration ensures `dp[w - weight[i]]` still holds values from the previous item `(i - 1)`. Forward iteration allows picking the same item multiple times.',
  },
  {
    id: 'dm_hard_code_7',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'DSA · Amortized Analysis & Hash Maps',
    difficulty: 'Hard',
    sourceTag: 'TechM / Capgemini / FAANG Hard',
    question:
      'Building a binary min-heap from an unsorted array of `n` elements using bottom-up `heapify` (Floyd’s algorithm) takes what tight worst-case time complexity?',
    options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctIndex: 1,
    explanation:
      'Most nodes are near the leaves and sift down very few levels. Summing `sum(h=0..log n) (n / 2^(h+1)) * h` converges to O(n), faster than n repeated insertions O(n log n).',
  },
  {
    id: 'dm_hard_code_8',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Python · GIL & Concurrency Choice',
    difficulty: 'Hard',
    sourceTag: 'Python Systems Hard',
    question:
      'You need to speed up a pure-Python CPU-bound prime factorization workload across an 8-core machine in standard CPython. Which concurrency primitive delivers genuine multi-core parallelism?',
    options: [
      '`threading.Thread` with 8 threads',
      '`asyncio.gather` on a single event loop',
      '`multiprocessing.Pool` (separate Python processes with independent GILs)',
      'Using `yield` generators inside a single thread',
    ],
    correctIndex: 2,
    explanation:
      'In CPython, the Global Interpreter Lock (GIL) allows only one thread to execute Python bytecode at a time. `multiprocessing` spawns separate OS processes to utilize all 8 CPU cores.',
  },

  // ---- 4. Excel, Power BI, DBMS & Cloud Computing (6 Hard) ----
  {
    id: 'dm_hard_data_1',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'DBMS · Isolation Levels & Phantom Reads',
    difficulty: 'Hard',
    sourceTag: 'DBMS Internals Hard',
    question:
      'Under ANSI SQL isolation levels, which anomaly can STILL occur in `REPEATABLE READ` (ANSI definition) and requires `SERIALIZABLE` (or range/gap locks) to completely prevent?',
    options: [
      'Dirty Read',
      'Non-Repeatable Read of an existing row',
      'Phantom Read (new rows matching a range predicate inserted by another committed transaction)',
      'Lost commit durability after disk crash',
    ],
    correctIndex: 2,
    explanation:
      'ANSI `REPEATABLE READ` locks rows read so they cannot change, but does not inherently prevent another transaction from inserting new rows matching the `WHERE` range (Phantom Reads).',
  },
  {
    id: 'dm_hard_data_2',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'DBMS · BCNF vs 3NF',
    difficulty: 'Hard',
    sourceTag: 'SQL & Schema Design Hard',
    question:
      'A relation R(A, B, C) has candidate keys `{A, B}` and `{A, C}` with functional dependency `C -> B`. What is the highest normal form R satisfies?',
    options: [
      'BCNF because B is a prime attribute',
      '3NF (satisfies 3NF since B is prime, but violates BCNF because determinant C is not a superkey)',
      '1NF only',
      '4NF because there are no multivalued dependencies',
    ],
    correctIndex: 1,
    explanation:
      '3NF permits `X -> Y` if Y is a prime attribute. BCNF strictly demands that for EVERY non-trivial FD `X -> Y`, `X` must be a superkey. Here `C` is not a superkey, so R is in 3NF but NOT BCNF.',
  },
  {
    id: 'dm_hard_data_3',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Power BI · DAX Context Transition',
    difficulty: 'Hard',
    sourceTag: 'Power BI / BI Analyst Hard',
    question:
      'Inside a Power BI calculated column on `Sales`, calling `CALCULATE(SUM(Sales[Amount]))` without filter arguments triggers Context Transition. What happens?',
    options: [
      'It returns the grand total of the entire Sales table on every row',
      'It converts the current row context into an equivalent filter context matching all column values of that row',
      'It throws a circular dependency error immediately',
      'It deletes all active slicer filters on the report page',
    ],
    correctIndex: 1,
    explanation:
      'Context Transition inside `CALCULATE()` transforms the current row context into a filter context, filtering the table to rows identical to the current row (which can sum duplicate rows if no unique key exists!).',
  },
  {
    id: 'dm_hard_data_4',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Excel · Dynamic Array & Multi-Criteria Lookup',
    difficulty: 'Hard',
    sourceTag: 'Excel Analytics Hard',
    question:
      'You need a single modern Excel formula to return the `Salary` where BOTH `Dept = "Cloud"` AND `City = "Bengaluru"` without helper columns. Which expression works natively?',
    options: [
      '`=VLOOKUP("Cloud"&"Bengaluru", A2:D100, 4, FALSE)`',
      '`=XLOOKUP(1, (A2:A100="Cloud")*(B2:B100="Bengaluru"), D2:D100, "Not Found")`',
      '`=HLOOKUP("Cloud", A2:D100, 4, TRUE)`',
      '`=COUNTIFS(A2:A100, "Cloud", B2:B100, "Bengaluru", D2:D100)`',
    ],
    correctIndex: 1,
    explanation:
      'Boolean multiplication `(Cond1)*(Cond2)` produces an array of `1`s and `0`s; `XLOOKUP(1, ..., return_array)` cleanly matches the first row satisfying both criteria.',
  },
  {
    id: 'dm_hard_data_5',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Cloud Computing · CAP Theorem & Multi-Region',
    difficulty: 'Hard',
    sourceTag: 'Cloud Architect Hard',
    question:
      'During a network partition between two cloud regions, a distributed payment ledger refuses writes on the minority partition to prevent double-spending. Under CAP theorem, which trade-off did it choose?',
    options: [
      'AP (Availability over Consistency)',
      'CP (Consistency over Availability during Partition)',
      'CA (Eliminating Partition Tolerance in a distributed WAN)',
      'Eventual Consistency with zero durability',
    ],
    correctIndex: 1,
    explanation:
      'Network partitions are unavoidable in distributed cloud networks. Rejecting minority-side writes preserves Consistency (C) at the expense of Availability (A) -> a CP system.',
  },
  {
    id: 'dm_hard_data_6',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Cloud Computing · Zero-Trust IAM & Least Privilege',
    difficulty: 'Hard',
    sourceTag: 'AWS / GCP Security Hard',
    question:
      'An application running on a cloud compute instance needs read-only access to one object storage bucket. What is the gold-standard production architecture?',
    options: [
      'Hardcode an admin API key inside the frontend JavaScript bundle',
      'Attach a short-lived IAM Role / Workload Identity scoped strictly to `storage.objects.get` on that single bucket',
      'Make the storage bucket publicly readable to `allUsers` with an obscure bucket name',
      'Commit a long-lived root service account JSON key to the Git repository',
    ],
    correctIndex: 1,
    explanation:
      'Workload Identity / IAM Roles issue automatic, short-lived, least-privilege credentials without storing static secrets in code or repos.',
  },

  // ---- 5. Indianism, Interview & GD Skills (5 Hard) ----
  {
    id: 'dm_hard_car_1',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Global Executive English (Anti-Indianism)',
    difficulty: 'Hard',
    sourceTag: 'Global Client Comm Hard',
    question:
      'Which email line replaces ALL subtle Indianisms ("revert back", "prepone", "do the needful") with crisp global executive English?',
    options: [
      'Please revert back if we can prepone tomorrow’s call and do the needful.',
      'Please let me know if we can move tomorrow’s call earlier, and share the updated deck by 3 PM.',
      'Kindly revert me back regarding preponing the meeting and doing the needful.',
      'Please reply back on preponement of the call at your earliest convenience.',
    ],
    correctIndex: 1,
    explanation:
      '"Move earlier" replaces "prepone", "let me know / reply" replaces "revert back", and naming the exact deliverable ("share the updated deck by 3 PM") replaces vague "do the needful".',
  },
  {
    id: 'dm_hard_car_2',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Behavioral Interview · Handling Failure',
    difficulty: 'Hard',
    sourceTag: 'FAANG Leadership Principle Hard',
    question:
      'An interviewer asks: "Tell me about a time you missed a critical deadline." Which STAR/SCARE response earns a Strong Hire?',
    options: [
      'Claim you have never missed a deadline because you are a perfectionist.',
      'Blame a teammate who delivered their API two days late.',
      'Own an underestimation mistake, explain the proactive risk escalation + scope triage you led, quantify the minimized impact, and state the estimation checklist you instituted afterward.',
      'Give a vague hypothetical answer about how deadlines should be managed in theory.',
    ],
    correctIndex: 2,
    explanation:
      'Senior interviewers test Accountability, Risk Escalation, and Learning Velocity. Owning the miss + showing recovery leadership + systemic prevention beats perfectionist deflection.',
  },
  {
    id: 'dm_hard_car_3',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Group Discussion · Fish-Market Recovery',
    difficulty: 'Hard',
    sourceTag: 'IIM / MNC GD Hard',
    question:
      'Midway through a 10-candidate GD, three speakers start shouting over each other while two quieter participants haven’t spoken. What intervention scores highest on leadership?',
    options: [
      'Shout louder than all three to assert dominance.',
      'Stay completely silent until the moderator intervenes.',
      'Use a calm hand gesture + crisp bridge: "We have two strong angles on cost vs speed—let’s capture both and hear [Name]’s view on customer impact before converging."',
      'Tell the noisy candidates directly that they lack professional manners.',
    ],
    correctIndex: 2,
    explanation:
      'Synthesizing competing points while inclusively inviting a quiet peer demonstrates executive facilitation, composure, and team orientation without aggression.',
  },
  {
    id: 'dm_hard_car_4',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Salary Negotiation in HR Round',
    difficulty: 'Hard',
    sourceTag: 'HR Executive Hard',
    question:
      'Before completing technical rounds, a recruiter asks for your exact expected CTC number. What is the strongest, most diplomatic move?',
    options: [
      'Refuse rudely and say salary is confidential.',
      'Quote the lowest number possible so you don’t get rejected.',
      'Anchor on role scope & market range: "I’m focused on mutual fit first; based on the role scope and market benchmarks for these skills, I’m targeting the ₹X–₹Y range and am open to discussing total compensation once we align on fit."',
      'Say "Anything you want to give is fine."',
    ],
    correctIndex: 2,
    explanation:
      'Providing a researched range anchored to market data & value avoids anchoring too low while keeping the conversation collaborative and professional.',
  },
  {
    id: 'dm_hard_car_5',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Abstract GD Structuring (PESTLE)',
    difficulty: 'Hard',
    sourceTag: 'GD Strategy Hard',
    question:
      'You are given an abstract GD topic: "Zero is the most powerful number." How should you open in the first 35 seconds?',
    options: [
      'Repeat dictionary definitions of zero for two minutes.',
      'Frame 3 structured dimensions immediately—Mathematical Foundation (place value & binary computing), Business Benchmarks (zero-defect quality & net-zero carbon), and Personal Mindset (starting from scratch with humility).',
      'Ask the panel what they meant by the topic.',
      'Argue that 100 is better than zero.',
    ],
    correctIndex: 1,
    explanation:
      'Abstract topics test structured lateral framing. Establishing 3 clear lenses gives the whole group a roadmap and immediately positions you as a structured thinker.',
  },

  // ---- 6. Shopping, Buyer Psychology & Negotiation (5 Hard) ----
  {
    id: 'dm_hard_shop_1',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Total Cost of Ownership (TCO) Trap',
    difficulty: 'Hard',
    sourceTag: 'Smart Buyer Hard',
    question:
      'Printer A costs ₹5,500 with ₹2.80/page cartridge cost; Ink-Tank Printer B costs ₹12,500 with ₹0.30/page cost. At what print volume does Printer B break even and become strictly cheaper?',
    options: ['1,400 pages', '2,800 pages', '3,500 pages', '5,000 pages'],
    correctIndex: 1,
    explanation:
      'Upfront delta = ₹7,000. Savings per page = ₹2.80 - ₹0.30 = ₹2.50. Break-even = 7000 / 2.50 = 2,800 pages. Smart buyers evaluate TCO, not sticker price!',
  },
  {
    id: 'dm_hard_shop_2',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Decoy Pricing & Asymmetric Dominance',
    difficulty: 'Hard',
    sourceTag: 'Buyer Psychology Hard',
    question:
      'A SaaS plan lists Basic (₹499, 10GB), Pro (₹1,299, 100GB), and Enterprise (₹1,399, 500GB + Priority Support). Why is the ₹1,299 Pro plan priced so close to Enterprise?',
    options: [
      'A typographical error by the billing team',
      'It is an Asymmetric Dominance Decoy designed to make the ₹1,399 Enterprise plan appear like an irresistible bargain',
      'Because 100GB storage costs more than 500GB',
      'To force everyone onto the ₹499 Basic plan',
    ],
    correctIndex: 1,
    explanation:
      'Decoy Pricing inserts an inferior mid-tier option close in price to the target tier so buyers feel smart upgrading—even if they only needed the ₹499 Basic tier.',
  },
  {
    id: 'dm_hard_shop_3',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'BATNA & Concession Reciprocity',
    difficulty: 'Hard',
    sourceTag: 'Negotiation Lab Hard',
    question:
      'A vendor refuses to lower the ₹48,000 base price of a laptop citing strict brand MRP policy, yet you have a verified ₹45,500 competing quote (strong BATNA). What is the highest-leverage next move?',
    options: [
      'Walk out angrily without exploring non-price value.',
      'Accept ₹48,000 immediately with no extras.',
      'Shift from price to high-margin bundles: ask for a 2-year extended warranty, laptop bag, and zero-cost processing waiver (worth ₹4,500+ to you, low wholesale cost to the dealer).',
      'Reveal you actually have ₹55,000 budget and hope they give a discount.',
    ],
    correctIndex: 2,
    explanation:
      'When sticker price hits a policy wall, integrative negotiation trades low-cost dealer add-ons (warranty, accessories, fee waivers) that unlock superior net value.',
  },
  {
    id: 'dm_hard_shop_4',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'No-Cost EMI Hidden Math',
    difficulty: 'Hard',
    sourceTag: 'FinTech & Deals Hard',
    question:
      'A ₹30,000 smartphone advertises "6-Month No-Cost EMI" via an upfront ₹1,350 interest discount, PLUS a ₹299 processing fee + 18% GST on BOTH the fee and the bank’s monthly interest component. Which statement is true?',
    options: [
      'Your total cash outflow is strictly ₹30,000 with zero extra cost.',
      'You still pay ₹299 + GST + 18% GST on the interest component (~₹596 extra) and may forfeit instant bank cashback, making full upfront payment cheaper if cash is available.',
      'GST is waived legally on all No-Cost EMIs.',
      'The phone becomes 18% cheaper on EMI.',
    ],
    correctIndex: 1,
    explanation:
      'Banks charge 18% GST on the interest portion of every EMI installment plus processing fees, and No-Cost EMI frequently disqualifies upfront card discounts.',
  },
  {
    id: 'dm_hard_shop_5',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Seasonal Price-Cycle Timing',
    difficulty: 'Hard',
    sourceTag: 'Deal Timing Hard',
    question:
      'When do flagship electronics and air-conditioners historically hit their true lowest net prices in India?',
    options: [
      'Peak summer (April–May) for ACs and launch week for flagship smartphones',
      'Off-season clearance (Oct–Jan for ACs) and 6–9 months post-launch during Festive/Republic Day bank-stack sales with historical price-tracker verification',
      'Always on the first Monday of every month regardless of product category',
      'Only during midnight flash sales without checking MRP inflation',
    ],
    correctIndex: 1,
    explanation:
      'Counter-seasonal buying (ACs in winter) + post-launch depreciation windows verified via 90-day price-history charts avoid fake inflated-MRP discounts.',
  },

  // ---- 7. Picture Connect, Critical Thinking & AI Strategy (4 Hard) ----
  {
    id: 'dm_hard_pic_1',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'SCARE Framework Execution',
    difficulty: 'Hard',
    sourceTag: 'Picture Connect Capstone Hard',
    question:
      'In Mentor Kapil’s SCARE framework for turning an abstract picture into a boardroom recommendation, which sequence prevents jumping to premature solutions?',
    options: [
      'Solution -> Cost -> Action -> Result -> Emotion',
      'Situation -> Challenge -> Action -> Result -> Executive Takeaway (anchoring evidence before proposing action)',
      'Story -> Assumption -> Rhetoric -> Ending -> Summary',
      'Speak -> Critique -> Argue -> Repeat -> Exit',
    ],
    correctIndex: 1,
    explanation:
      'SCARE anchors objective visual observation (Situation + Challenge) before committing to Action, measurable Result, and an Executive Takeaway.',
  },
  {
    id: 'dm_hard_pic_2',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'AI Prompt Engineering · Guardrails & Grounding',
    difficulty: 'Hard',
    sourceTag: 'AI Track Hard',
    question:
      'When using an AI assistant to analyze a complex business visual or dataset for a client deck, which prompt pattern minimizes hallucination risk?',
    options: [
      '"Give me impressive stats that prove our product is #1."',
      'Specify Role, explicit Constraints ("cite only observed data; state Unknown if missing"), structured Output Schema, and ask for counter-assumptions to verify.',
      'Write a 3-word prompt and copy-paste the first response directly to the client.',
      'Ask the model to guess missing financial numbers using creative tone.',
    ],
    correctIndex: 1,
    explanation:
      'Grounded prompting defines role, strict evidence boundaries ("state Unknown if missing"), structured format, and explicit adversarial verification.',
  },
  {
    id: 'dm_hard_pic_3',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'Cognitive Bias · Survivorship Bias',
    difficulty: 'Hard',
    sourceTag: 'Critical Thinking Hard',
    question:
      'A founder studies 10 unicorn startups that dropped out of college and concludes college degrees hurt entrepreneurship. Which analytical fallacy is this?',
    options: [
      'Sunk Cost Fallacy',
      'Survivorship Bias (analyzing only visible winners while ignoring thousands of failed cases with the same trait)',
      'Halo Effect',
      'Framing Effect',
    ],
    correctIndex: 1,
    explanation:
      'Survivorship Bias draws false causal conclusions by examining only the subset that survived selection while ignoring the vast invisible denominator that failed.',
  },
  {
    id: 'dm_hard_pic_4',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'Visual Synthesis · First-Principles Connection',
    difficulty: 'Hard',
    sourceTag: 'Picture Connect Hard',
    question:
      'Two seemingly unrelated images are paired: a "Traffic Signal" and a "Hospital Triage Desk." What is the highest-value executive connection?',
    options: [
      'Both have red and green colors.',
      'Both are rule-based prioritization systems that manage scarce throughput under high concurrency to prevent catastrophic bottlenecks.',
      'Both exist inside modern cities.',
      'Both employ people in uniforms.',
    ],
    correctIndex: 1,
    explanation:
      'Surface visual matching ("red/green colors") scores low; high-level Picture Connect extracts the underlying systemic principle (priority queuing & bottleneck governance).',
  },
];

function mapMasterTrackToPillar(trackId: MasterTrackId): DailyMockPillarId {
  if (trackId === 'aptitude') return 'aptitude_logic';
  if (
    trackId === 'grammar' ||
    trackId === 'parts_of_speech' ||
    trackId === 'parts_of_grammar' ||
    trackId === 'tenses' ||
    trackId === 'punctuation' ||
    trackId === 'idioms'
  ) {
    return 'english_grammar';
  }
  if (
    trackId === 'c_lang' ||
    trackId === 'cpp_lang' ||
    trackId === 'java_lang' ||
    trackId === 'python_lang' ||
    trackId === 'dsa'
  ) {
    return 'coding_dsa';
  }
  return 'data_cloud';
}

const PILLAR_TITLE_MAP: Record<DailyMockPillarId, string> = DAILY_MOCK_PILLARS.reduce(
  (acc, p) => {
    acc[p.id] = p.title;
    return acc;
  },
  {} as Record<DailyMockPillarId, string>
);

const MASTER_TRACK_SHORT_MAP: Record<string, string> = MASTER_TRACKS.reduce(
  (acc, t) => {
    acc[t.id] = t.shortTitle;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Builds the complete unified pool across ALL topics covered in the portal,
 * separating genuine Hard MCQs from Standard/Applied MCQs.
 */
let cachedUnifiedPool: DailyMockQuestion[] | null = null;

export function getUnifiedDailyMockPool(): DailyMockQuestion[] {
  if (cachedUnifiedPool) return cachedUnifiedPool;

  const pool: DailyMockQuestion[] = [
    ...DEDICATED_HARD_MOCK_MCQS,
    ...NOV_23_ASSESSMENT_MCQS,
  ];

  // 1. All 16 Master Universe tracks (160 MCQs)
  for (const q of MASTER_MCQS) {
    const pillarId = mapMasterTrackToPillar(q.trackId);
    const trackShort = MASTER_TRACK_SHORT_MAP[q.trackId] || q.trackId;
    pool.push({
      id: `m_${q.id}`,
      pillarId,
      pillarTitle: PILLAR_TITLE_MAP[pillarId],
      topic: `${trackShort} · ${q.topic}`,
      difficulty: q.difficulty === 'Placement' ? 'Hard' : 'Standard',
      sourceTag: `Master ${trackShort} (${q.difficulty})`,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    });
  }

  // 2. All 3 Career Skills categories (45 MCQs)
  for (const q of CAREER_MCQS) {
    const catLabel =
      q.category === 'indianism'
        ? 'Indianism'
        : q.category === 'interview'
        ? 'Interview Skills'
        : 'GD Skills';
    pool.push({
      id: `c_${q.id}`,
      pillarId: 'career_comm',
      pillarTitle: PILLAR_TITLE_MAP.career_comm,
      topic: `${catLabel} · ${q.topic}`,
      difficulty: q.difficulty === 'Executive' ? 'Hard' : 'Standard',
      sourceTag: `Career ${catLabel} (${q.difficulty})`,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    });
  }

  // 3. Shopping & Negotiation MCQs (50 MCQs)
  for (const q of SHOPPING_MCQS) {
    const isHardShop =
      q.category === 'negotiation' || q.category === 'deals_timing';
    pool.push({
      id: `s_${q.id}`,
      pillarId: 'shopping_negotiation',
      pillarTitle: PILLAR_TITLE_MAP.shopping_negotiation,
      topic: `Shopping · ${q.sourceRef}`,
      difficulty: isHardShop ? 'Hard' : 'Standard',
      sourceTag: `Shopping & Deals`,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    });
  }

  // 4. Final Assessment Hard MCQs (10 MCQs — Picture Connect + AI Advanced)
  for (let i = 0; i < FINAL_MCQS.length; i++) {
    const q = FINAL_MCQS[i];
    // Split evenly so Picture Connect & AI has both Hard and Standard options
    const isHard = i < 6;
    pool.push({
      id: `f_${q.id}`,
      pillarId: 'picture_ai',
      pillarTitle: PILLAR_TITLE_MAP.picture_ai,
      topic: q.trackSource.includes('AI')
        ? 'AI Track · Applied Reasoning'
        : 'Picture Connect · Critical Reasoning',
      difficulty: isHard ? 'Hard' : 'Standard',
      sourceTag: q.trackSource,
      question: `${q.scenario} ${q.question}`,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.rationale,
    });
  }

  cachedUnifiedPool = pool;
  return pool;
}

/**
 * Deterministic PRNG (Mulberry32) seeded by dateKey so every learner taking
 * today's Daily Mock Test gets the exact same standardized 40-question paper,
 * rotating automatically every midnight.
 */
function hashDateKey(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], rand: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getTodayDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDateKeyReadable(dateKey: string): string {
  const parts = dateKey.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateKey;
  const dt = new Date(parts[0], parts[1] - 1, parts[2]);
  return dt.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Generates today's standardized 60-minute Daily Mock Paper:
 * - Exactly 40 MCQs
 * - Strictly 20 Hard MCQs (50%) + 20 Standard/Applied MCQs (50%)
 * - Guaranteed coverage across all 7 Employability Universe pillars
 */
export function generateDailyMockPaper(dateKey: string): DailyMockPaper {
  const rand = mulberry32(hashDateKey(`EUWK-DAILY-MOCK-${dateKey}`));

  if (dateKey === NOV_23_DATE_KEY) {
    const questions = seededShuffle(NOV_23_ASSESSMENT_MCQS, rand);
    return {
      dateKey,
      paperCode: NOV_23_PAPER_CODE,
      displayDate: formatDateKeyReadable(dateKey),
      editionTitle: NOV_23_EDITION_TITLE,
      isSpecialEdition: true,
      durationSeconds: DAILY_MOCK_CONFIG.durationSeconds,
      totalQuestions: questions.length,
      hardCount: questions.filter((q) => q.difficulty === 'Hard').length,
      standardCount: questions.filter((q) => q.difficulty === 'Standard').length,
      questions,
    };
  }

  const pool = getUnifiedDailyMockPool();

  const pickedHard: DailyMockQuestion[] = [];
  const pickedStandard: DailyMockQuestion[] = [];
  const usedIds = new Set<string>();

  for (const pillar of DAILY_MOCK_PILLARS) {
    const pillarHard = seededShuffle(
      pool.filter((q) => q.pillarId === pillar.id && q.difficulty === 'Hard'),
      rand
    );
    const pillarStd = seededShuffle(
      pool.filter((q) => q.pillarId === pillar.id && q.difficulty === 'Standard'),
      rand
    );

    for (const q of pillarHard.slice(0, pillar.targetHard)) {
      pickedHard.push(q);
      usedIds.add(q.id);
    }
    for (const q of pillarStd.slice(0, pillar.targetStandard)) {
      pickedStandard.push(q);
      usedIds.add(q.id);
    }
  }

  // Fallback fill if any pillar ever had fewer items than quota
  if (pickedHard.length < DAILY_MOCK_CONFIG.hardQuestions) {
    const remainingHard = seededShuffle(
      pool.filter((q) => q.difficulty === 'Hard' && !usedIds.has(q.id)),
      rand
    );
    for (const q of remainingHard) {
      if (pickedHard.length >= DAILY_MOCK_CONFIG.hardQuestions) break;
      pickedHard.push(q);
      usedIds.add(q.id);
    }
  }
  if (pickedStandard.length < DAILY_MOCK_CONFIG.standardQuestions) {
    const remainingStd = seededShuffle(
      pool.filter((q) => q.difficulty === 'Standard' && !usedIds.has(q.id)),
      rand
    );
    for (const q of remainingStd) {
      if (pickedStandard.length >= DAILY_MOCK_CONFIG.standardQuestions) break;
      pickedStandard.push(q);
      usedIds.add(q.id);
    }
  }

  const combined = seededShuffle(
    [
      ...pickedHard.slice(0, DAILY_MOCK_CONFIG.hardQuestions),
      ...pickedStandard.slice(0, DAILY_MOCK_CONFIG.standardQuestions),
    ],
    rand
  );

  const compactDate = dateKey.replace(/-/g, '');
  return {
    dateKey,
    paperCode: `EUWK-DM-${compactDate}`,
    displayDate: formatDateKeyReadable(dateKey),
    durationSeconds: DAILY_MOCK_CONFIG.durationSeconds,
    totalQuestions: combined.length,
    hardCount: combined.filter((q) => q.difficulty === 'Hard').length,
    standardCount: combined.filter((q) => q.difficulty === 'Standard').length,
    questions: combined,
  };
}

/**
 * Grades a learner's Daily Mock answers with exact Hard vs Standard split,
 * 7-pillar mastery analytics, XP award, and Mentor Kapil's daily diagnostic.
 */
export function gradeDailyMockAttempt(
  paper: DailyMockPaper,
  answers: number[]
): DailyMockGradeResult {
  const safeAnswers = paper.questions.map((_, i) =>
    typeof answers[i] === 'number' && answers[i] >= 0 && answers[i] <= 3
      ? answers[i]
      : -1
  );

  let answeredCount = 0;
  let correctCount = 0;
  let hardCorrectCount = 0;
  let standardCorrectCount = 0;

  const pillarBuckets = new Map<
    DailyMockPillarId,
    { total: number; correct: number; hardTotal: number; hardCorrect: number }
  >();
  for (const p of DAILY_MOCK_PILLARS) {
    pillarBuckets.set(p.id, { total: 0, correct: 0, hardTotal: 0, hardCorrect: 0 });
  }

  paper.questions.forEach((q, idx) => {
    const choice = safeAnswers[idx];
    const bucket = pillarBuckets.get(q.pillarId)!;
    bucket.total += 1;
    if (q.difficulty === 'Hard') bucket.hardTotal += 1;

    if (choice >= 0) {
      answeredCount += 1;
      if (choice === q.correctIndex) {
        correctCount += 1;
        bucket.correct += 1;
        if (q.difficulty === 'Hard') {
          hardCorrectCount += 1;
          bucket.hardCorrect += 1;
        } else {
          standardCorrectCount += 1;
        }
      }
    }
  });

  const totalQuestions = paper.totalQuestions || 40;
  const hardQuestionCount = paper.hardCount || 20;
  const stdQuestionCount = Math.max(1, totalQuestions - hardQuestionCount);

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const hardAccuracyPercent = Math.round(
    (hardCorrectCount / Math.max(1, hardQuestionCount)) * 100
  );
  const standardAccuracyPercent = Math.round(
    (standardCorrectCount / stdQuestionCount) * 100
  );

  const passed = scorePercent >= DAILY_MOCK_CONFIG.passPercent;
  const gradeLabel: DailyMockGradeResult['gradeLabel'] =
    scorePercent >= 85
      ? 'Distinction'
      : scorePercent >= 70
      ? 'Merit'
      : scorePercent >= 60
      ? 'Pass'
      : 'Needs Review';

  // Weighted XP: 15 XP per Hard correct + 10 XP per Standard correct (max 500 XP)
  const xpAwarded = Math.min(
    DAILY_MOCK_CONFIG.maxXpPerDay,
    hardCorrectCount * 15 + standardCorrectCount * 10
  );

  const pillarScores: DailyMockPillarScore[] = DAILY_MOCK_PILLARS.map((p) => {
    const b = pillarBuckets.get(p.id)!;
    return {
      pillarId: p.id,
      pillarTitle: p.title,
      shortTitle: p.shortTitle,
      total: b.total,
      correct: b.correct,
      hardTotal: b.hardTotal,
      hardCorrect: b.hardCorrect,
      percent: b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0,
    };
  });

  const sortedByPerf = [...pillarScores].sort((a, b) => b.percent - a.percent);
  const strongestTopic = sortedByPerf[0]?.shortTitle || 'Aptitude';
  const weakestTopic =
    sortedByPerf[sortedByPerf.length - 1]?.shortTitle || 'Coding & DSA';

  const topicSummary = pillarScores
    .map((p) => `${p.shortTitle}: ${p.correct}/${p.total} (${p.percent}%)`)
    .join(' | ')
    .slice(0, 780);

  let mentorAdvice = '';
  if (scorePercent >= 85) {
    mentorAdvice = `Outstanding execution (${scorePercent}% overall, ${hardAccuracyPercent}% on Hard MCQs). You are operating at Tier-1 placement readiness—keep sharpening ${weakestTopic} to maintain a 90%+ ceiling.`;
  } else if (scorePercent >= 70) {
    mentorAdvice = `Strong Merit performance (${scorePercent}%). Your strongest anchor is ${strongestTopic}; spend 20 focused minutes revising ${weakestTopic} and reviewing missed Hard MCQs before tomorrow's mock.`;
  } else if (scorePercent >= 60) {
    mentorAdvice = `Passed today's 60-min benchmark (${scorePercent}%). Boost your Hard MCQ accuracy (${hardAccuracyPercent}%) by revisiting Live Notes and FAANG Solved Problems in ${weakestTopic}.`;
  } else {
    mentorAdvice = `Great discipline showing up for today's 60-min mock (${scorePercent}%). Focus first on ${weakestTopic} playbooks, review all incorrect Hard explanations below, and target +10% in tomorrow's paper.`;
  }

  return {
    totalQuestions,
    hardQuestionCount,
    answeredCount,
    correctCount,
    hardCorrectCount,
    standardCorrectCount,
    scorePercent,
    hardAccuracyPercent,
    standardAccuracyPercent,
    passed,
    gradeLabel,
    xpAwarded,
    pillarScores,
    strongestTopic,
    weakestTopic,
    topicSummary,
    mentorAdvice,
  };
}

import type { DailyMockQuestion } from './dailyMockData';

export const NOV_23_DATE_KEY = '2026-11-23';
export const NOV_23_PAPER_CODE = 'EUWK-NOV23-2026';
export const NOV_23_EDITION_TITLE =
  'Nov 23, 2026 · Placement Sprint Special Assessment';

/**
 * 40 completely fresh, non-overlapping placement MCQs authored specifically for
 * Nov 23, 2026 (20 Hard / 20 Standard across all 7 Employability Universe pillars).
 */
export const NOV_23_ASSESSMENT_MCQS: DailyMockQuestion[] = [
  // =========================================================================
  // 1. Quantitative & Logical Aptitude (3 Hard + 3 Standard = 6)
  // =========================================================================
  {
    id: 'nov23_apt_h1',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Permutations & Circular Arrangements',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Quant Hard',
    question:
      '7 finalists (including 2 friends, Aarav and Meera) are seated around a circular interview roundtable. In how many distinct arrangements are Aarav and Meera NEVER seated next to each other?',
    options: ['240', '480', '504', '360'],
    correctIndex: 1,
    explanation:
      'Total circular arrangements of 7 people = (7 - 1)! = 6! = 720. Treating Aarav + Meera as 1 block gives 6 entities around a circle -> (6 - 1)! * 2! = 120 * 2 = 240 together. Never together = 720 - 240 = 480.',
  },
  {
    id: 'nov23_apt_h2',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Compound Interest & Effective Yield',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · FinTech Quant Hard',
    question:
      'The difference between Compound Interest (compounded annually) and Simple Interest on a certain sum at 12% per annum for 2 years is ₹432. What is the principal sum?',
    options: ['₹25,000', '₹30,000', '₹36,000', '₹28,000'],
    correctIndex: 1,
    explanation:
      'For 2 years, CI - SI = P * (r / 100)^2. Thus 432 = P * (12/100)^2 = P * 144 / 10000 => P = 432 * 10000 / 144 = 3 * 10000 = ₹30,000.',
  },
  {
    id: 'nov23_apt_h3',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Profit, Markup & Successive Discounts',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Commerce Hard',
    question:
      'A retailer marks up a laptop 40% above cost price and then offers two successive discounts of 15% and 10%. What is the net profit or loss percentage?',
    options: [
      '7.1% profit',
      '5.0% profit',
      '15.0% profit',
      '2.9% loss',
    ],
    correctIndex: 0,
    explanation:
      'Let CP = 100. Marked Price = 140. After 15% off -> 140 * 0.85 = 119. After another 10% off -> 119 * 0.90 = 107.1. Net profit = 7.1%.',
  },
  {
    id: 'nov23_apt_s1',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Averages & Weighted Cohorts',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Quant Standard',
    question:
      'The average test score of 24 candidates in Batch A is 72, and of 16 candidates in Batch B is 82. What is the combined average score of all 40 candidates?',
    options: ['75', '76', '77', '78'],
    correctIndex: 1,
    explanation:
      'Total score = (24 * 72) + (16 * 82) = 1728 + 1312 = 3040. Combined average = 3040 / 40 = 76.',
  },
  {
    id: 'nov23_apt_s2',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Boats & Streams',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Quant Standard',
    question:
      'A boat covers 36 km downstream in 3 hours and returns upstream covering the same 36 km in 4.5 hours. What is the speed of the stream?',
    options: ['2 km/h', '3 km/h', '4 km/h', '1.5 km/h'],
    correctIndex: 0,
    explanation:
      'Downstream speed = 36 / 3 = 12 km/h. Upstream speed = 36 / 4.5 = 8 km/h. Speed of stream = (12 - 8) / 2 = 2 km/h.',
  },
  {
    id: 'nov23_apt_s3',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Logical Series & Pattern Recognition',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Logic Standard',
    question: 'Find the missing number in the placement reasoning series: 5, 11, 24, 51, 106, ?',
    options: ['212', '215', '217', '221'],
    correctIndex: 2,
    explanation:
      'Pattern: *2 + 1 (11), *2 + 2 (24), *2 + 3 (51), *2 + 4 (106). Next term = 106 * 2 + 5 = 217.',
  },

  // =========================================================================
  // 2. Grammar, Tenses, Punctuation & Idioms (3 Hard + 3 Standard = 6)
  // =========================================================================
  {
    id: 'nov23_eng_h1',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Parallelism & Correlative Structures',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Verbal Hard',
    question:
      'Select the sentence that maintains strict grammatical parallelism across all clauses:',
    options: [
      'The onboarding guide explains not only how to configure SSO, but also configuring role-based access.',
      'The onboarding guide explains not only how to configure SSO but also how to audit role-based access.',
      'Not only the onboarding guide explains how to configure SSO, but also auditing role-based access.',
      'The onboarding guide not only explains configuring SSO but also how you should audit access.',
    ],
    correctIndex: 1,
    explanation:
      'With "not only... but also...", both elements must match syntactically: "how to configure SSO" mirrors "how to audit role-based access".',
  },
  {
    id: 'nov23_eng_h2',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Subjunctive Mood & Formal Proposals',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Grammar Hard',
    question:
      'Choose the formally accurate sentence expressing a mandatory executive recommendation:',
    options: [
      'The compliance board recommended that every API token rotates every 30 days.',
      'The compliance board recommended that every API token be rotated every 30 days.',
      'The compliance board recommended that every API token is rotated every 30 days.',
      'The compliance board recommended every API token to be rotate every 30 days.',
    ],
    correctIndex: 1,
    explanation:
      'Verbs of command or formal recommendation ("recommend that...") trigger the mandative subjunctive, using the base verb "be rotated".',
  },
  {
    id: 'nov23_eng_h3',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Restrictive vs Non-Restrictive Clauses',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Punctuation Hard',
    question:
      'A company owns 4 microservices, and ONLY the billing microservice (not the other 3) failed last night. Which punctuation & relative pronoun choice is exact?',
    options: [
      'The microservice, which handles billing, experienced a timeout.',
      'The microservice that handles billing experienced a timeout.',
      'The microservice, that handles billing, experienced a timeout.',
      'The microservice who handles billing experienced a timeout.',
    ],
    correctIndex: 1,
    explanation:
      'Because "handles billing" narrows down WHICH of the 4 microservices failed, it is a restrictive (essential) clause—use "that" with NO commas.',
  },
  {
    id: 'nov23_eng_s1',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Prepositional Precision',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Grammar Standard',
    question:
      'Choose the correct preposition: "The regional sales lead insisted ___ reviewing the pricing annexure before signing."',
    options: ['for', 'on', 'about', 'to'],
    correctIndex: 1,
    explanation:
      'Standard collocation in formal English is "insist on + gerund" ("insisted on reviewing").',
  },
  {
    id: 'nov23_eng_s2',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Corporate Idioms',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Idioms Standard',
    question:
      'When a mentor tells you to "read between the lines" during a client negotiation, what are they advising?',
    options: [
      'Check only the bold headings in the contract',
      'Understand the implied, unspoken concerns or intent behind what was literally said',
      'Skip alternate paragraphs to read faster',
      'Ask the client to rewrite the email in bullet points',
    ],
    correctIndex: 1,
    explanation:
      '"Read between the lines" means inferring hidden priorities, reluctance, or unspoken meaning from tone and subtext.',
  },
  {
    id: 'nov23_eng_s3',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Few / A Few / Little Nuance',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Parts of Speech Standard',
    question:
      'Which option conveys positive encouragement: "We still have ___ time left before the demo, so let’s polish two charts"?',
    options: ['little', 'a little', 'few', 'many'],
    correctIndex: 1,
    explanation:
      '"Time" is uncountable. "Little" implies almost none (negative), whereas "a little" indicates a small but usable amount (positive).',
  },

  // =========================================================================
  // 3. C, C++, Java, Python & DSA (4 Hard + 4 Standard = 8)
  // =========================================================================
  {
    id: 'nov23_code_h1',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'DSA · Monotonic Stack Pattern',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · FAANG DSA Hard',
    question:
      'Finding the "Next Greater Element" for every index in an unsorted array of length n can be solved optimally in what time complexity using a monotonic decreasing stack?',
    options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
    correctIndex: 2,
    explanation:
      'Each element is pushed onto the stack once and popped at most once across the entire scan, giving strict O(n) amortized and worst-case time.',
  },
  {
    id: 'nov23_code_h2',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Java · HashMap Contract (equals & hashCode)',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Java Hard',
    question:
      'In Java, you override `equals()` on a `Candidate` key class used inside a `HashMap`, but forget to override `hashCode()`. What bug occurs?',
    options: [
      'A `NullPointerException` is thrown when `put()` is called.',
      'Two logically equal `Candidate` instances may land in different hash buckets, causing `map.get(copy)` to return `null`.',
      'The JVM refuses to compile the class without `hashCode()`.',
      'All keys automatically sort alphabetically in a `TreeMap`.',
    ],
    correctIndex: 1,
    explanation:
      'Java’s contract requires equal objects to share identical `hashCode()`. Without overriding `hashCode()`, `Object.hashCode()` uses memory addresses, breaking `HashMap` lookups.',
  },
  {
    id: 'nov23_code_h3',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Python · Shallow vs Deep Copy Mutation',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Python Hard',
    question:
      'What does `a = [[1, 2], [3, 4]]; b = a.copy(); b[0].append(9); print(a[0])` output in Python?',
    options: ['[1, 2]', '[1, 2, 9]', '[[1, 2], 9]', 'TypeError'],
    correctIndex: 1,
    explanation:
      '`list.copy()` creates a SHALLOW copy: outer list `b` is new, but inner nested lists (`a[0]` and `b[0]`) still reference the same list object in memory. Use `copy.deepcopy(a)` to isolate nested objects.',
  },
  {
    id: 'nov23_code_h4',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'C++ · RAII & std::unique_ptr Ownership',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · C++ Hard',
    question:
      'Why does `std::unique_ptr<Session> p2 = p1;` fail to compile in modern C++ (C++14/17/20)?',
    options: [
      '`std::unique_ptr` deletes its copy constructor to enforce exclusive single ownership; ownership must be explicitly transferred via `std::move(p1)`.',
      '`std::unique_ptr` only works with primitive integers, not classes.',
      'Smart pointers cannot be assigned inside functions.',
      'You must call `malloc()` before constructing `unique_ptr`.',
    ],
    correctIndex: 0,
    explanation:
      'Exclusive ownership prevents double-free bugs. Transferring a `unique_ptr` requires `std::move(p1)`, which leaves `p1` as `nullptr`.',
  },
  {
    id: 'nov23_code_s1',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'C · Array Decay & sizeof',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · C Standard',
    question:
      'When an array `int nums[10]` is passed to a C function `void inspect(int arr[])`, what does `sizeof(arr)` inside `inspect` evaluate to on a 64-bit machine?',
    options: [
      '40 bytes (the full array size)',
      '8 bytes (size of an `int*` pointer because array parameters decay to pointers)',
      '4 bytes always',
      'Compile error',
    ],
    correctIndex: 1,
    explanation:
      'In C, array arguments decay to pointers to their first element; always pass `size_t len` separately to functions.',
  },
  {
    id: 'nov23_code_s2',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'DSA · Binary Search Tree Traversal',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · DSA Standard',
    question:
      'Which traversal of a valid Binary Search Tree (BST) ALWAYS visits node values in non-decreasing sorted order?',
    options: [
      'Preorder (Root, Left, Right)',
      'Inorder (Left, Root, Right)',
      'Postorder (Left, Right, Root)',
      'Level-order (BFS)',
    ],
    correctIndex: 1,
    explanation:
      'Because every left subtree holds smaller values and every right subtree holds larger values, Inorder traversal produces sorted output.',
  },
  {
    id: 'nov23_code_s3',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Python · Sets & Deduplication',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Python Standard',
    question:
      'What is the average time complexity of checking membership `if user_id in seen_ids:` when `seen_ids` is a Python `set` vs a `list` of size n?',
    options: [
      'O(n) for set, O(1) for list',
      'O(1) average for set (hash table), O(n) linear scan for list',
      'O(log n) for both',
      'O(n^2) for set',
    ],
    correctIndex: 1,
    explanation:
      'Python `set` uses a hash table for O(1) average-case lookup, whereas `list` scans sequentially in O(n).',
  },
  {
    id: 'nov23_code_s4',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Java · String Immutability & StringBuilder',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Java Standard',
    question:
      'Concatenating 50,000 log lines inside a loop with `result += line` in Java is slow (O(n^2)). What should you use instead for O(n) performance?',
    options: [
      '`new String(result + line)`',
      '`StringBuilder` with `.append(line)`',
      '`Integer.toString()`',
      'Static `final` String array',
    ],
    correctIndex: 1,
    explanation:
      '`String` is immutable, so `+=` allocates a full copy every iteration. `StringBuilder` mutates an internal resizable buffer in O(1) amortized per append.',
  },

  // =========================================================================
  // 4. Excel, Power BI, DBMS & Cloud (3 Hard + 3 Standard = 6)
  // =========================================================================
  {
    id: 'nov23_data_h1',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'DBMS · Window Functions (RANK vs DENSE_RANK)',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · SQL Hard',
    question:
      'Two candidates tie at the highest score (95, 95) and the next score is 90. What ranks do `RANK()` vs `DENSE_RANK()` assign to the 90 score?',
    options: [
      '`RANK()` gives 2; `DENSE_RANK()` gives 3',
      '`RANK()` gives 3 (skips rank 2); `DENSE_RANK()` gives 2 (no gaps)',
      'Both assign rank 2',
      'Both assign rank 3',
    ],
    correctIndex: 1,
    explanation:
      '`RANK()` leaves gaps after ties (1, 1, 3), whereas `DENSE_RANK()` produces consecutive integers (1, 1, 2).',
  },
  {
    id: 'nov23_data_h2',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Power BI · Star Schema & Bidirectional Filters',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Power BI Hard',
    question:
      'Why do Power BI data architects strongly recommend a Star Schema (one-to-many single-direction filters from Dimension -> Fact) instead of enabling Many-to-Many Bidirectional filters everywhere?',
    options: [
      'Star Schemas hide all charts in Power BI Service.',
      'Bidirectional filters across multiple fact tables create ambiguous filter paths, slow DAX engine performance, and risk unexpected circular dependency errors.',
      'Power BI cannot load CSV files unless Bidirectional filters are turned off.',
      'Single-direction filters automatically double revenue numbers.',
    ],
    correctIndex: 1,
    explanation:
      'Uncontrolled bidirectional cross-filtering introduces ambiguity between tables and degrades VertiPaq query speed; use `CROSSFILTER()` inside specific DAX measures only when needed.',
  },
  {
    id: 'nov23_data_h3',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Cloud Computing · Idempotency & Retry Storms',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Cloud Distributed Systems Hard',
    question:
      'A payment microservice times out due to transient network jitter, so the client retries 3 times. How do cloud engineers prevent charging the customer 3 times AND avoid a thundering-herd retry storm?',
    options: [
      'Disable timeouts completely and retry every 1 millisecond.',
      'Enforce an Idempotency Key on the server (`POST /charge`) combined with Exponential Backoff + Random Jitter on the client.',
      'Switch from HTTPS to unencrypted HTTP for faster packets.',
      'Store all pending charges inside browser `localStorage` only.',
    ],
    correctIndex: 1,
    explanation:
      'Idempotency keys guarantee repeat requests produce the exact same single charge, while exponential backoff with jitter spreads retry load across time.',
  },
  {
    id: 'nov23_data_s1',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'SQL · WHERE vs HAVING Execution Order',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · DBMS Standard',
    question:
      'You want to list departments whose average salary exceeds ₹9,00,000 (`AVG(salary) > 900000`). Which SQL clause MUST hold the aggregate condition?',
    options: ['WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'],
    correctIndex: 2,
    explanation:
      '`WHERE` filters individual rows BEFORE grouping and cannot reference aggregate functions like `AVG()`. `HAVING` filters groups AFTER `GROUP BY`.',
  },
  {
    id: 'nov23_data_s2',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Excel · Absolute vs Relative References',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Excel Standard',
    question:
      'In Excel, you write `=B2*$F$1` in cell C2 and drag the formula down to C10. What happens in cell C5?',
    options: [
      'It becomes `=B5*$F$4`',
      'It becomes `=B5*$F$1` (row updates for B, while $F$1 stays locked)',
      'It stays `=B2*$F$1`',
      'It returns `#REF!`',
    ],
    correctIndex: 1,
    explanation:
      'The `$` locks column F and row 1 as an absolute reference (`$F$1`), while relative reference `B2` shifts automatically down to `B5`.',
  },
  {
    id: 'nov23_data_s3',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Cloud Computing · Serverless vs Containers',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Cloud Standard',
    question:
      'Which scenario is the BEST fit for Serverless Functions (AWS Lambda / Cloud Run Functions) over always-on dedicated VMs?',
    options: [
      'An event-driven webhook or PDF invoice generator that receives sporadic bursts of traffic and sits idle overnight',
      'A bare-metal kernel driver requiring custom hardware PCI passthrough 24/7',
      'A local desktop IDE installed on a student laptop',
      'An air-gapped offline database with zero network interfaces',
    ],
    correctIndex: 0,
    explanation:
      'Serverless scales automatically from zero to handle spiky event-driven workloads, charging only for active execution milliseconds.',
  },

  // =========================================================================
  // 5. Indianism, Interview & GD Skills (3 Hard + 3 Standard = 6)
  // =========================================================================
  {
    id: 'nov23_car_h1',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Global English · Eliminating Redundant Habits',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Indianism Hard',
    question:
      'In a global client kickoff, which phrasing eliminates ALL Indianisms ("myself", "out of station", "passing out year")?',
    options: [
      '"Myself Rohan, 2026 passing out batch; our lead is out of station today."',
      '"I’m Rohan, graduating in 2026; our lead is traveling today and will join remotely."',
      '"Myself is Rohan from 2026 passout; our manager went out of station."',
      '"I am Rohan, passed out in 2026; our boss is out of station only."',
    ],
    correctIndex: 1,
    explanation:
      'Use "I’m [Name]" (never "Myself [Name]"), "graduating in [Year]" (not "passing out"), and "traveling / away / out of the office" (not "out of station").',
  },
  {
    id: 'nov23_car_h2',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Behavioral Interview · Quantifying STAR Impact',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Interview Hard',
    question:
      'Compare two Action+Result statements in a Product/Tech interview. Which clearly demonstrates measurable executive ownership?',
    options: [
      '"I worked very hard on the backend with my team and everyone liked the app."',
      '"I profiled slow SQL queries, added composite indexes on 3 join keys, and cut checkout API p95 latency from 1.8s to 290ms—lifting conversion by 6.4%."',
      '"We tried many things and finally the website became somewhat faster."',
      '"My mentor told us what code to write and we submitted it on time."',
    ],
    correctIndex: 1,
    explanation:
      'Strong candidates pair first-person ownership ("I profiled... added...") with before/after metrics (1.8s -> 290ms, +6.4% conversion).',
  },
  {
    id: 'nov23_car_h3',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'GD · Disagreement Without Confrontation',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · GD Leadership Hard',
    question:
      'A fellow candidate presents an unrealistic budget figure in a GD. How do you challenge the assumption while earning high scores for diplomacy and data orientation?',
    options: [
      '"That number makes zero sense—have you ever read an annual report?"',
      '"That’s an ambitious growth angle; however, factoring in customer-acquisition costs and a 12-month payback window, a phased regional rollout protects cash flow better."',
      'Roll your eyes and interrupt mid-sentence to change the topic.',
      'Agree blindly with the flawed number just to look polite.',
    ],
    correctIndex: 1,
    explanation:
      'Acknowledge intent ("ambitious growth angle"), introduce objective business criteria ("CAC + 12-month payback"), and offer a constructive alternative.',
  },
  {
    id: 'nov23_car_s1',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Interview · "Tell Me About Yourself"',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Interview Standard',
    question:
      'What is the ideal duration and sequence for an opening "Tell me about yourself" pitch in campus & corporate interviews?',
    options: [
      'A 6-minute chronological childhood biography starting from school marks',
      'A crisp 60–90 second Present-Past-Future arc linking your core skills, 1 quantified project impact, and why you fit this exact role',
      'Reciting your entire resume word-for-word from top to bottom',
      'Saying "Everything is already written on my CV, sir"',
    ],
    correctIndex: 1,
    explanation:
      'The Present -> Past (key evidence) -> Future (role alignment) formula keeps the interviewer engaged and sets up strong follow-up questions.',
  },
  {
    id: 'nov23_car_s2',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Indianism Fix · "Discuss About" & "Cousin Brother"',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Global English Standard',
    question: 'Which sentence is completely free of Indianisms?',
    options: [
      'Let’s discuss about the Q4 roadmap with my cousin brother.',
      'Let’s discuss the Q4 roadmap during today’s sync.',
      'We will discuss regarding the Q4 roadmap today.',
      'Kindly discuss on the Q4 roadmap.',
    ],
    correctIndex: 1,
    explanation:
      '"Discuss" is transitive and never takes "about", "regarding", or "on" after it; similarly, use "cousin" rather than "cousin brother/sister".',
  },
  {
    id: 'nov23_car_s3',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'GD · Smart Closing Summary',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · GD Standard',
    question:
      'With 45 seconds left in a Group Discussion, what makes the strongest closing summary?',
    options: [
      'Introduce 4 brand-new unrelated statistics never discussed by the group',
      'Synthesize the 2–3 core consensus pillars plus the balanced trade-off raised by the group in 25–30 seconds without declaring yourself the winner',
      'Repeat only your own first sentence three times',
      'Stop speaking and look at your phone',
    ],
    correctIndex: 1,
    explanation:
      'An impartial, structured synthesis capturing group consensus and key trade-offs signals natural leadership to evaluators.',
  },

  // =========================================================================
  // 6. Shopping, Buyer Psychology & Negotiation (2 Hard + 2 Standard = 4)
  // =========================================================================
  {
    id: 'nov23_shop_h1',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Anchoring vs Dark-Pattern Scarcity',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Buyer Audit Hard',
    question:
      'An e-commerce product shows MRP ₹19,999 struck through to ₹7,499 with a resetting "Offer ends in 04:59!" countdown timer every time you refresh in Incognito. What are the two traps combined here?',
    options: [
      'Wholesale subsidy + genuine clearance',
      'Phantom MRP Anchoring (inflated baseline to exaggerate % off) + Fake Countdown Scarcity Dark Pattern',
      'Dynamic exchange-rate hedging + loyalty cashback',
      'True stock-out protection enforced by RBI',
    ],
    correctIndex: 1,
    explanation:
      'Always audit 90-day historical price trackers and test countdown timers in incognito—fake anchors and manufactured urgency pressure impulsive checkout.',
  },
  {
    id: 'nov23_shop_h2',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: '8-Layer Deal Stacking Order',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Deal Math Hard',
    question:
      'An appliance lists at ₹40,000. You apply: (1) a ₹4,000 instant store coupon BEFORE payment, then (2) a 10% instant bank card discount (capped at ₹3,500) on the net amount, plus (3) 5% cashback reward points later. What is the card-swiped amount at checkout?',
    options: ['₹32,000', '₹32,400', '₹32,500', '₹30,780'],
    correctIndex: 2,
    explanation:
      'Step 1: ₹40,000 - ₹4,000 coupon = ₹36,000. Step 2: 10% of ₹36,000 is ₹3,600, which hits the ₹3,500 bank cap! So card swipe = ₹36,000 - ₹3,500 = ₹32,500 (reward points credit later, not at swipe).',
  },
  {
    id: 'nov23_shop_s1',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Buyer Personas · Analytical vs Impulsive',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Buyer Psychology Standard',
    question:
      'Which discipline specifically cures "Impulse Buying" during flash sales while keeping great genuine deals?',
    options: [
      'Saving 4 credit cards on one-tap checkout',
      'Applying a mandatory 24-hour "Cart Cooling Rule" + verifying total cost against your monthly needs list',
      'Buying whatever is trending #1 on social media',
      'Never comparing unit prices per gram or per month',
    ],
    correctIndex: 1,
    explanation:
      'A 24-hour cooling window breaks dopamine urgency and lets rational utility + budget checks catch unnecessary purchases.',
  },
  {
    id: 'nov23_shop_s2',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Service & Warranty Negotiation',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Smart Buyer Standard',
    question:
      'Before paying for an extended warranty add-on at checkout, what should a smart buyer check FIRST?',
    options: [
      'Only the colorful sticker on the store counter',
      'Manufacturer’s standard warranty coverage, exact exclusions (accidental vs parts), and whether your credit card or brand promo already includes an extra year',
      'Whether the salesperson gets a bonus today',
      'Skip reading terms because every warranty covers physical drops automatically',
    ],
    correctIndex: 1,
    explanation:
      'Many third-party extended warranties exclude battery/display wear or duplicate existing brand/card protection.',
  },

  // =========================================================================
  // 7. Picture Connect, Critical Thinking & AI (2 Hard + 2 Standard = 4)
  // =========================================================================
  {
    id: 'nov23_pic_h1',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'Visual Audit · Detecting Correlation vs Causation',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · Critical Thinking Hard',
    question:
      'A campus dashboard visual shows that "Students who carry reusable metal water bottles also score 18% higher in DSA tests," so an admin proposes gifting free bottles to raise coding scores. What logical error is this?',
    options: [
      'Confirmation Bias only',
      'Confounding / Correlation-vs-Causation Fallacy (an underlying habit like daily campus attendance & routine may drive both)',
      'Law of Diminishing Returns',
      'Base Rate Correctness',
    ],
    correctIndex: 1,
    explanation:
      'Visual correlations frequently hide a third confounding variable (structured routine, regular lab attendance). Solving the symptom won’t raise coding mastery.',
  },
  {
    id: 'nov23_pic_h2',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'AI Track · Visual Framing Without Hallucination',
    difficulty: 'Hard',
    sourceTag: 'Nov 23 Special · AI Prompting Hard',
    question:
      'You ask an AI model to turn an abstract visual ("A Lighthouse in Fog") into an executive engineering proposal. What makes your defense authentic on the 100-mark SCARE rubric?',
    options: [
      'Copy-paste generic motivational quotes generated by AI without naming a concrete metric or owner.',
      'Ground the metaphor in a specific observable workplace bottleneck, specify an actionable process change, quantify expected outcome, and state one trade-off/risk.',
      'Write 12 words total so the submission stays short.',
      'Ask the AI to invent fake company revenue figures to look impressive.',
    ],
    correctIndex: 1,
    explanation:
      'Top SCARE scores reward concrete Situation anchoring, practical Action, measurable Result, and candid Executive risk awareness—never empty AI fluff.',
  },
  {
    id: 'nov23_pic_s1',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'Visual Synthesis · Metaphor to Placement Skill',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · Picture Connect Standard',
    question:
      'In a placement group activity, you connect a "Compass" to "Personal Career Roadmap." Which 1-line insight demonstrates "See Beyond. Think Beyond."?',
    options: [
      '"Both are round and fit in a pocket."',
      '"A compass does not remove storms, yet keeps every daily decision oriented toward true north—just as clear career goals filter out random distractions."',
      '"A compass costs ₹100 in a stationery shop."',
      '"Both start with the letter C if you rename Roadmap."',
    ],
    correctIndex: 1,
    explanation:
      'Strong Picture Connect framing translates physical utility (directional stability amidst noise) into actionable career decision-making.',
  },
  {
    id: 'nov23_pic_s2',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'AI Literacy · Human-in-the-Loop Review',
    difficulty: 'Standard',
    sourceTag: 'Nov 23 Special · AI Standard',
    question:
      'When using AI to review your placement resume or project architecture notes, what is the essential final human check?',
    options: [
      'Leave AI placeholder brackets like `[Insert Metric Here]` inside your PDF',
      'Verify every claim, metric, library version, and architecture detail against what you actually built and can defend live in an interview',
      'Make every bullet 6 lines long with complex buzzwords you cannot explain',
      'Turn off spellcheck completely',
    ],
    correctIndex: 1,
    explanation:
      'Recruiters rapidly probe any inflated or hallucinated resume claim; human-in-the-loop verification ensures 100% defensible authenticity.',
  },
];

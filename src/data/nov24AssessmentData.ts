import type { DailyMockQuestion } from './dailyMockData';

export const NOV_24_DATE_KEY = '2026-11-24';
export const NOV_24_PAPER_CODE = 'EUWK-NOV24-2026';
export const NOV_24_EDITION_TITLE =
  'Nov 24, 2026 · Body Language & Placement Sprint Assessment';

/**
 * 40 completely fresh, non-overlapping placement MCQs authored specifically for
 * Nov 24, 2026 (20 Hard / 20 Standard across all 7 Employability Universe pillars),
 * featuring real-world Body Language & Executive Presence scenarios inside Career & Comm.
 */
export const NOV_24_ASSESSMENT_MCQS: DailyMockQuestion[] = [
  // =========================================================================
  // 1. Quantitative & Logical Aptitude (3 Hard + 3 Standard = 6)
  // =========================================================================
  {
    id: 'nov24_apt_h1',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Conditional Probability & Faulty Components',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Quant Hard',
    question:
      'Server Cluster X handles 60% of API requests with a 2% timeout rate, while Cluster Y handles 40% of requests with a 5% timeout rate. If a randomly sampled request timed out, what is the probability it came from Cluster Y?',
    options: ['62.5%', '37.5%', '50.0%', '71.4%'],
    correctIndex: 0,
    explanation:
      'P(Timeout) = (0.60 * 0.02) + (0.40 * 0.05) = 0.012 + 0.020 = 0.032. P(Y | Timeout) = 0.020 / 0.032 = 20 / 32 = 5/8 = 62.5%.',
  },
  {
    id: 'nov24_apt_h2',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Time & Work · Leaving Before Completion',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Work Hard',
    question:
      'Developer A can build a module in 20 days and Developer B in 30 days. They start together, but Developer A leaves 5 days before completion. In how many total days is the work completed?',
    options: ['12 days', '14 days', '15 days', '18 days'],
    correctIndex: 2,
    explanation:
      'LCM(20, 30) = 60 units. Rates: A = 3 u/day, B = 2 u/day. In the last 5 days alone, B finishes 5 * 2 = 10 units. The initial 50 units were completed together at 5 u/day in 10 days. Total time = 10 + 5 = 15 days.',
  },
  {
    id: 'nov24_apt_h3',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Combinations · Committee With Constraints',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · P&C Hard',
    question:
      'From 6 backend engineers and 4 data analysts, a 5-member task force must be formed containing AT LEAST 3 backend engineers. How many distinct task forces are possible?',
    options: ['120', '186', '192', '210'],
    correctIndex: 1,
    explanation:
      'Valid cases: (3B, 2D) = C(6,3)*C(4,2) = 20*6 = 120; (4B, 1D) = C(6,4)*C(4,1) = 15*4 = 60; (5B, 0D) = C(6,5)*C(4,0) = 6*1 = 6. Total = 120 + 60 + 6 = 186.',
  },
  {
    id: 'nov24_apt_s1',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Ratios & Profit Distribution',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Quant Standard',
    question:
      'Three co-founders invest ₹4,00,000, ₹6,00,000, and ₹10,00,000 in a SaaS pilot for a full year. If annual profit is ₹5,00,000, what is the middle investor’s share?',
    options: ['₹1,00,000', '₹1,50,000', '₹2,00,000', '₹2,50,000'],
    correctIndex: 1,
    explanation:
      'Investment ratio = 4 : 6 : 10 = 2 : 3 : 5 (sum = 10 parts). Middle investor gets (3/10) * ₹5,00,000 = ₹1,50,000.',
  },
  {
    id: 'nov24_apt_s2',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Percentages & Population Growth',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Quant Standard',
    question:
      'A platform’s active learners increased by 20% in Year 1 and by 25% in Year 2. What is the net percentage increase over the 2-year period?',
    options: ['45%', '50%', '48%', '55%'],
    correctIndex: 1,
    explanation:
      'Successive growth = 1.20 * 1.25 = 1.50, corresponding to a net 50% increase.',
  },
  {
    id: 'nov24_apt_s3',
    pillarId: 'aptitude_logic',
    pillarTitle: 'Quantitative & Logical Aptitude',
    topic: 'Syllogism & Logical Deduction',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Logic Standard',
    question:
      'Statements: (1) All microservices are containerized. (2) No containerized service uses manual FTP deploys. Which conclusion strictly follows?',
    options: [
      'Some microservices use manual FTP deploys',
      'No microservice uses manual FTP deploys',
      'All containerized services are microservices',
      'Manual FTP deploys are required for containers',
    ],
    correctIndex: 1,
    explanation:
      'Since every microservice belongs to the set of containerized services, and that set is completely disjoint from manual FTP deploys, no microservice uses manual FTP deploys.',
  },

  // =========================================================================
  // 2. Grammar, Tenses, Punctuation & Idioms (3 Hard + 3 Standard = 6)
  // =========================================================================
  {
    id: 'nov24_eng_h1',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Subjunctive Mood & Formal Mandates',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Grammar Hard',
    question:
      'Identify the sentence demonstrating flawless mandative subjunctive mood in a compliance policy:',
    options: [
      'The security auditor insisted that every production token is rotated monthly.',
      'The security auditor insisted that every production token be rotated monthly.',
      'The security auditor insisted that every production token was rotated monthly.',
      'The security auditor insisted that every production token would rotate monthly.',
    ],
    correctIndex: 1,
    explanation:
      'Verbs of demand or recommendation ("insist", "require", "mandate") take a base-form verb ("be rotated") in the mandative subjunctive clause.',
  },
  {
    id: 'nov24_eng_h2',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Restrictive vs Non-Restrictive Clauses',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Punctuation Hard',
    question:
      'You want to warn clients that ONLY the payment webhooks that lack HMAC signatures will be rejected (not all webhooks). Which sentence conveys that exact meaning?',
    options: [
      'The payment webhooks, which lack HMAC signatures, will be rejected tonight.',
      'The payment webhooks that lack HMAC signatures will be rejected tonight.',
      'The payment webhooks, that lack HMAC signatures, will be rejected tonight.',
      'The payment webhooks which lack HMAC signatures, will be rejected tonight.',
    ],
    correctIndex: 1,
    explanation:
      'A restrictive ("essential") relative clause uses "that" WITHOUT commas to narrow the subset; adding commas with "which" implies ALL payment webhooks lack signatures.',
  },
  {
    id: 'nov24_eng_h3',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Pronoun Case in Elliptical Comparisons',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Syntax Hard',
    question:
      'Choose the grammatically standard formal comparison: "No other analyst in our cohort modeled the cohort churn faster than ___."',
    options: ['her', 'she', 'herself', 'them'],
    correctIndex: 1,
    explanation:
      'Mentally completing the omitted verb reveals the nominative subject pronoun: "...faster than she [modeled it]."',
  },
  {
    id: 'nov24_eng_s1',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Corporate Idioms & Clarity',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Idioms Standard',
    question:
      'A manager says: "Let’s not boil the ocean on Sprint 1—let’s ship the core login flow first." What does "boil the ocean" mean?',
    options: [
      'Delay the meeting until next quarter',
      'Attempt an impossibly huge, overly ambitious scope instead of focusing on achievable priorities',
      'Delete legacy servers immediately',
      'Increase cloud billing intentionally',
    ],
    correctIndex: 1,
    explanation:
      '"Boil the ocean" means tackling an unrealistically vast scope when a focused, practical slice would deliver real value.',
  },
  {
    id: 'nov24_eng_s2',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Apostrophes & Plural Possessives',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Punctuation Standard',
    question:
      'Select the correctly punctuated plural possessive for feedback gathered from multiple learners:',
    options: [
      'The learner’s evaluations were archived after the sprint.',
      'The learners’ evaluations were archived after the sprint.',
      'The learners evaluation’s were archived after the sprint.',
      'The learner’s’ evaluations were archived after the sprint.',
    ],
    correctIndex: 1,
    explanation:
      'For a regular plural noun ending in "s" ("learners"), place the apostrophe after the "s": "learners’ evaluations."',
  },
  {
    id: 'nov24_eng_s3',
    pillarId: 'english_grammar',
    pillarTitle: 'Grammar, Tenses, Punctuation & Idioms',
    topic: 'Future Perfect Milestone Tense',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Tenses Standard',
    question:
      'Complete accurately: "By next Friday at 5 PM, the QA team ___ all regression suites across every release candidate."',
    options: [
      'will complete',
      'will have completed',
      'has completed',
      'completes',
    ],
    correctIndex: 1,
    explanation:
      'A deadline phrase ("By next Friday...") indicating completion prior to a future moment takes the Future Perfect ("will have completed").',
  },

  // =========================================================================
  // 3. C, C++, Java, Python & DSA (4 Hard + 4 Standard = 8)
  // =========================================================================
  {
    id: 'nov24_code_h1',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'DSA · Topological Sort & Cycle Detection',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Graph DSA Hard',
    question:
      'When running Kahn’s BFS topological sort on a directed graph with V vertices, how do you immediately detect that a dependency cycle exists?',
    options: [
      'At least one vertex starts with out-degree 0',
      'The total number of vertices popped and appended to the topological order is strictly less than V',
      'The graph contains more than V - 1 undirected edges',
      'Two vertices share the same initial in-degree',
    ],
    correctIndex: 1,
    explanation:
      'Nodes inside or downstream of a directed cycle never drop to in-degree 0, so Kahn’s queue empties before all V vertices are emitted.',
  },
  {
    id: 'nov24_code_h2',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'C++ · Move Semantics & std::move',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · C++ Hard',
    question:
      'What does `std::move(obj)` in C++17/20 actually execute at runtime by itself?',
    options: [
      'It immediately copies every byte of `obj` to the heap and zeroes `obj`',
      'It performs an unconditional static cast to an rvalue reference (`T&&`), enabling move constructors/assignments if the caller consumes it',
      'It triggers garbage collection on `obj` immediately',
      'It prevents any destructor from running on `obj`',
    ],
    correctIndex: 1,
    explanation:
      '`std::move` itself moves nothing at runtime—it casts an lvalue expression to `T&&` so overload resolution picks a move constructor or move assignment operator.',
  },
  {
    id: 'nov24_code_h3',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Java · HashMap Contract & Mutated Keys',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Java Internals Hard',
    question:
      'A mutable object `k` is inserted as a key into a `java.util.HashMap`, and then a field used in `k.hashCode()` and `k.equals()` is modified while `k` sits inside the map. What happens on `map.get(k)`?',
    options: [
      'HashMap automatically rehashes all entries on every field mutation',
      '`map.get(k)` computes the NEW bucket from the modified hashCode and likely returns `null`, effectively losing the entry',
      'Java throws `ConcurrentModificationException` immediately on `get()`',
      'HashMap converts keys to Strings internally so mutations have no effect',
    ],
    correctIndex: 1,
    explanation:
      'HashMap does not re-index keys when their internal fields mutate; lookup inspects the bucket corresponding to the new hashCode while the entry remains trapped in the old bucket.',
  },
  {
    id: 'nov24_code_h4',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'DSA · Monotonic Stack Nearest Greater Element',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Stack DSA Hard',
    question:
      'Computing the Next Greater Element to the right for every index in an array of length `n` using a monotonic decreasing stack takes what tight time complexity?',
    options: ['O(n^2)', 'O(n log n)', 'O(n) amortized across all pushes and pops', 'O(log n)'],
    correctIndex: 2,
    explanation:
      'Each element is pushed onto the monotonic stack at most once and popped at most once, yielding strictly O(n) total stack operations.',
  },
  {
    id: 'nov24_code_s1',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Python · Shallow vs Deep Copy',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Python Standard',
    question:
      'In Python: `a = [[1, 2], [3, 4]]; b = a.copy(); b[0].append(99)`. What is `a[0]` now?',
    options: ['[1, 2]', '[1, 2, 99]', '[[1, 2], 99]', 'Raises TypeError'],
    correctIndex: 1,
    explanation:
      '`list.copy()` creates a shallow copy: the outer list is new, but inner nested lists are shared references, so mutating `b[0]` mutates `a[0]` too.',
  },
  {
    id: 'nov24_code_s2',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'C · sizeof on Arrays vs Function Parameters',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · C Standard',
    question:
      'In C on a 64-bit machine, `void f(int a[]) { printf("%zu", sizeof(a)); }` prints `8` even when passed `int arr[10]`. Why?',
    options: [
      '`int` is always 0.8 bytes',
      'Array parameters in C functions decay to pointers (`int *`), so `sizeof(a)` returns pointer size (8 bytes on 64-bit)',
      '`sizeof` ignores array brackets inside `printf`',
      '`arr` is copied partially onto the stack',
    ],
    correctIndex: 1,
    explanation:
      'Inside a function parameter list, `int a[]` is syntactic sugar for `int *a`; hence `sizeof(a)` evaluates `sizeof(int *)`.',
  },
  {
    id: 'nov24_code_s3',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'DSA · Binary Search Precondition',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · DSA Standard',
    question:
      'Which structural property is strictly required on a search space before Binary Search guarantees correct O(log n) lookup?',
    options: [
      'Every value must be a unique prime number',
      'The array or predicate space must satisfy monotonicity (sorted order or a True/False boundary)',
      'The array length must be an exact power of 2',
      'Elements must be stored inside a singly linked list',
    ],
    correctIndex: 1,
    explanation:
      'Binary search relies on monotonicity—either sorted values or a monotonic predicate allowing half the remaining interval to be safely discarded at each step.',
  },
  {
    id: 'nov24_code_s4',
    pillarId: 'coding_dsa',
    pillarTitle: 'C, C++, Java, Python & DSA',
    topic: 'Java · String Immutability & Pool',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Java Standard',
    question:
      'In Java, why is `StringBuilder` preferred over `String` concatenation (`res += ch`) inside a 50,000-iteration loop?',
    options: [
      '`String` objects are immutable, so repeated `+=` allocates O(n) intermediate objects leading to O(n^2) total copying time',
      '`StringBuilder` automatically encrypts characters',
      '`String` cannot hold more than 1,000 characters',
      '`String` uses UDP sockets for concatenation',
    ],
    correctIndex: 0,
    explanation:
      'Repeated `+` on immutable `String` allocates and copies longer character arrays every iteration (O(n^2)), whereas `StringBuilder` appends into an expandable buffer in O(n).',
  },

  // =========================================================================
  // 4. Excel, Power BI, DBMS & Cloud Computing (3 Hard + 3 Standard = 6)
  // =========================================================================
  {
    id: 'nov24_data_h1',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'DBMS · B-Tree Composite Index Leftmost Prefix',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · SQL Tuning Hard',
    question:
      'A table has a composite B-Tree index `idx_dept_role_salary ON Employees(dept_id, role, salary)`. Which query CANNOT efficiently use this index for an index range seek?',
    options: [
      '`WHERE dept_id = 4 AND role = \'SDE\'`',
      '`WHERE dept_id = 4 AND salary > 90000` (seek on `dept_id` works)',
      '`WHERE role = \'SDE\' AND salary > 90000` (omitting `dept_id`)',
      '`WHERE dept_id = 4 ORDER BY role`',
    ],
    correctIndex: 2,
    explanation:
      'Under the Leftmost Prefix Rule, a B-Tree composite index `(dept_id, role, salary)` is sorted first by `dept_id`. Filtering without `dept_id` forces a full index/table scan.',
  },
  {
    id: 'nov24_data_h2',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Power BI · ALL vs ALLEXCEPT in Percent-of-Parent DAX',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Power BI Hard',
    question:
      'You want a Power BI measure showing each Product’s revenue share WITHIN its currently filtered Category (ignoring only Product filters, keeping Category & Region slicers active). Which denominator works?',
    options: [
      '`CALCULATE([Total Revenue], ALL(Sales))`',
      '`CALCULATE([Total Revenue], REMOVEFILTERS(DimProduct[ProductName]))`',
      '`SUMX(Sales, Sales[Amount])`',
      '`CALCULATE([Total Revenue], ALLSELECTED())` without specifying columns',
    ],
    correctIndex: 1,
    explanation:
      'Clearing filters strictly on `DimProduct[ProductName]` preserves Category and Region slicers so the denominator totals the parent Category cleanly.',
  },
  {
    id: 'nov24_data_h3',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Cloud · Idempotency Keys in Distributed APIs',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Cloud Systems Hard',
    question:
      'A mobile client retries a `POST /payments/charge` request after a transient gateway timeout. How should a cloud backend guarantee the customer is never charged twice?',
    options: [
      'Ask the user to wait 24 hours before retrying',
      'Require a client-generated UUID `Idempotency-Key` stored atomically with the payment state so duplicate retries return the original outcome',
      'Switch the endpoint to HTTP `GET` so browsers cache the charge',
      'Increase the load balancer timeout to 10 minutes',
    ],
    correctIndex: 1,
    explanation:
      'Persisting an atomic `Idempotency-Key` with the transaction state guarantees safe at-least-once network retries produce exactly-once payment side effects.',
  },
  {
    id: 'nov24_data_s1',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Excel · Conditional Aggregation',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Excel Standard',
    question:
      'Which Excel formula sums column `D2:D50` ONLY for rows where Region `B2:B50` equals `"South"` AND Status `C2:C50` equals `"Closed"`?',
    options: [
      '`=SUMIF(B2:B50, "South", D2:D50)`',
      '`=SUMIFS(D2:D50, B2:B50, "South", C2:C50, "Closed")`',
      '`=COUNTIFS(D2:D50, B2:B50, "South")`',
      '`=VLOOKUP("South", B2:D50, 3, FALSE)`',
    ],
    correctIndex: 1,
    explanation:
      '`SUMIFS(sum_range, criteria_range1, criteria1, ...)` takes the sum range first followed by pairs of criteria ranges and values.',
  },
  {
    id: 'nov24_data_s2',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'DBMS · WHERE vs HAVING Execution Order',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · SQL Standard',
    question:
      'In SQL, why does `SELECT dept, COUNT(*) FROM emp WHERE COUNT(*) > 5 GROUP BY dept` throw a syntax/semantic error?',
    options: [
      '`COUNT(*)` cannot be used inside `SELECT`',
      '`WHERE` filters individual rows BEFORE `GROUP BY` runs; aggregate conditions on groups must be placed in `HAVING`',
      '`GROUP BY` must come before `FROM`',
      'SQL does not allow numbers greater than 5 in `WHERE`',
    ],
    correctIndex: 1,
    explanation:
      'Logical query order executes `FROM -> WHERE -> GROUP BY -> HAVING -> SELECT`. Aggregate predicates require `HAVING COUNT(*) > 5`.',
  },
  {
    id: 'nov24_data_s3',
    pillarId: 'data_cloud',
    pillarTitle: 'Excel, Power BI, DBMS & Cloud',
    topic: 'Cloud · Vertical vs Horizontal Scaling',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Cloud Standard',
    question:
      'Behind an application load balancer, adding 4 more stateless compute containers during a campus drive traffic spike is an example of:',
    options: [
      'Vertical Scaling (Scaling Up)',
      'Horizontal Scaling (Scaling Out)',
      'Cold Storage Archiving',
      'DNS Cache Poisoning',
    ],
    correctIndex: 1,
    explanation:
      'Adding additional parallel instances behind a load balancer is Horizontal Scaling (scaling out), unlike upgrading CPU/RAM on a single machine (vertical scaling).',
  },

  // =========================================================================
  // 5. Indianism, Interview, Body Language & GD Skills (3 Hard + 3 Standard = 6)
  // =========================================================================
  {
    id: 'nov24_car_h1',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Body Language · Stress-Round Pacifiers & Vocal Inflection',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Body Language Hard',
    question:
      'During a tough panel cross-questioning, a candidate rubs the back of their neck, rocks slightly on their swivel chair, and ends statements with rising pitch ("uptalk"). What composite signal do interviewers read?',
    options: [
      'High technical ownership and relaxed executive authority',
      'A stress-pacifier + kinetic leakage cluster showing uncertainty, even if their technical facts are right',
      'Intentional active listening fluency',
      'Cultural politeness that guarantees bonus HR points',
    ],
    correctIndex: 1,
    explanation:
      'Trained evaluators evaluate clusters: neck-touching (pacifier), chair rocking (anxiety release), and rising terminal pitch ("uptalk") together undercut strong facts.',
  },
  {
    id: 'nov24_car_h2',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Body Language · Virtual Interview Eye-Line & Framing',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Body Language Hard',
    question:
      'In a remote final interview, you want your body language to mirror an in-person executive briefing. Which physical setup produces authentic eye contact and visible open-palm gestures simultaneously?',
    options: [
      'Keep laptop flat on desk, place interviewer window at bottom-left, sit 20 cm from screen',
      'Elevate the webcam to eye level, sit far enough back for mid-chest framing, place front window/key light in front of you, and move the interviewer tile directly beneath the webcam lens',
      'Turn off self-view and look at a second monitor 45 degrees to your right',
      'Place a bright window directly behind you to look dramatic',
    ],
    correctIndex: 1,
    explanation:
      'Eye-level lens + mid-chest framing + front lighting + top-center video placement aligns eye contact with the camera while keeping torso gestures cleanly visible.',
  },
  {
    id: 'nov24_car_h3',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Global English · Eliminating Subtler Redundancies',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Global English Hard',
    question:
      'Which status update eliminates ALL Indianisms and wordy redundancies ("good name", "discuss about", "same will be shared", "cousin brother")?',
    options: [
      'Kindly tell me your good name so we can discuss about the same and share back.',
      'May I know your name so we can discuss the API contract and share the summary by 4 PM?',
      'Please share your good name; we will discuss about it with my cousin brother.',
      'We discussed regarding the same and reverted back.',
    ],
    correctIndex: 1,
    explanation:
      '"Your name" replaces "good name", transitive "discuss X" replaces "discuss about X", and "the summary" replaces vague "the same".',
  },
  {
    id: 'nov24_car_s1',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Body Language · Lobby Entry & Handshake',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Body Language Standard',
    question:
      'When walking into an in-person interview room holding your resume folder, why do mentors advise carrying the folder in your LEFT hand?',
    options: [
      'Because interviewers only read left-handed folders',
      'So your right hand remains free, dry, and ready for an unhurried web-to-web handshake without mid-greeting juggling',
      'To hide your wristwatch completely',
      'To walk faster toward the chair',
    ],
    correctIndex: 1,
    explanation:
      'Carrying items in the left hand avoids awkward shifting or damp-palm fumbling during the crucial first 7 seconds.',
  },
  {
    id: 'nov24_car_s2',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'Body Language · GD Non-Verbal Turn-Taking',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Body Language Standard',
    question:
      'While waiting to enter a fast-paced Group Discussion, which physical cue signals collaborative readiness without offending peers?',
    options: [
      'Pointing a stiff index finger across the table at the current speaker',
      'Leaning forward slightly with an open palm raised gently near chest/wrist level while catching group eye contact at a pause',
      'Shaking your head visibly and looking straight at the moderator',
      'Folding both arms tightly and leaning back',
    ],
    correctIndex: 1,
    explanation:
      'Slight forward lean + open palm signals peaceful intent to contribute, whereas pointing or eyeing the moderator undermines collaborative leadership.',
  },
  {
    id: 'nov24_car_s3',
    pillarId: 'career_comm',
    pillarTitle: 'Indianism, Interview & GD Skills',
    topic: 'STAR Behavioral Closing Impact',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Interview Standard',
    question:
      'What turns a good STAR interview answer into a memorable hire-signal response?',
    options: [
      'Spending 80% of the time describing background context ("Situation") and rushing the ending',
      'Quantifying the "Result" (latency, hours saved, accuracy lift) plus stating one reusable lesson applied onward',
      'Saying "we did it as a team" without ever specifying your personal "Action"',
      'Reading memorized buzzwords verbatim',
    ],
    correctIndex: 1,
    explanation:
      'Hiring panels score individual ownership ("I designed/debugged...") and concrete quantified Results paired with transferable learning.',
  },

  // =========================================================================
  // 6. Shopping, Buyer Psychology & Negotiation (2 Hard + 2 Standard = 4)
  // =========================================================================
  {
    id: 'nov24_shop_h1',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Negotiation Silence & Anchoring',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Negotiation Hard',
    question:
      'After a SaaS account executive quotes ₹1,80,000/year for an enterprise license, you remain calmly silent with neutral open posture for 4 seconds. Why is strategic silence effective?',
    options: [
      'It forces the salesperson to hang up',
      'People dislike unresolved silence after making an aggressive anchor and frequently volunteer concessions, extended onboarding, or tiered discounts unprompted',
      'It violates contract law unless you shout a counter-offer immediately',
      'It automatically locks the price at ₹1,80,000',
    ],
    correctIndex: 1,
    explanation:
      'Calm post-quote silence transfers psychological pressure back to the proposer and routinely surfaces hidden flexibility without revealing your ceiling.',
  },
  {
    id: 'nov24_shop_h2',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Drip Pricing & Hidden Checkout Fees',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Buyer Psychology Hard',
    question:
      'A flight aggregator shows ₹4,200 on search results, then adds mandatory seat fee, convenience fee, and payment gateway surcharge at step 4 totaling ₹5,650. What dark pattern is this?',
    options: [
      'Loss Leader Pricing',
      'Drip Pricing (exploiting sunk-cost momentum by revealing unavoidable fees late in checkout)',
      'Freemium Upsell',
      'Dynamic Bundling',
    ],
    correctIndex: 1,
    explanation:
      'Drip Pricing hooks buyers with an artificially low headline price and leaks mandatory surcharges late in the funnel once commitment bias kicks in.',
  },
  {
    id: 'nov24_shop_s1',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Price History Verification',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Smart Buyer Standard',
    question:
      'A product displays "55% OFF Festive Lightning Deal" on day one of a sale. What should an analytical buyer inspect first?',
    options: [
      'Only the red percentage badge next to the crossed-out MRP',
      'A 90-day historical price chart to verify the MRP wasn’t inflated right before the sale',
      'The countdown clock alone',
      'Only sponsored 5-star reviews posted that morning',
    ],
    correctIndex: 1,
    explanation:
      'Checking 90-day price history catches synthetic MRP inflation immediately and reveals true net savings.',
  },
  {
    id: 'nov24_shop_s2',
    pillarId: 'shopping_negotiation',
    pillarTitle: 'Shopping, Buyer Psychology & Negotiation',
    topic: 'Warranty vs Extended Care Math',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Smart Buyer Standard',
    question:
      'A store clerk pushes a ₹2,400 extended protection plan on a ₹9,000 toaster with a 2-year brand warranty. What makes this poor expected value?',
    options: [
      'The extended plan costs 27% of replacement value and overlaps heavily with the included manufacturer warranty',
      'Toasters never work after 1 year',
      'Brand warranties cover 0 components',
      'Paying more upfront always doubles resale price',
    ],
    correctIndex: 0,
    explanation:
      'Self-insuring affordable appliances beats paying 25–30% extra for overlapping third-party protection plans loaded with exclusions.',
  },

  // =========================================================================
  // 7. Picture Connect, Critical Thinking & AI (2 Hard + 2 Standard = 4)
  // =========================================================================
  {
    id: 'nov24_pic_h1',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'Systems Thinking · Feedback Loops & Goodhart’s Law',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · Critical Thinking Hard',
    question:
      'A support team starts getting bonuses strictly for "closing tickets under 3 minutes," so agents begin closing unresolved issues prematurely and asking users to open new tickets. Which principle explains this failure?',
    options: [
      'Moore’s Law',
      'Goodhart’s Law ("When a measure becomes a target, it ceases to be a good measure")',
      'Occam’s Razor',
      'Pareto Optimality',
    ],
    correctIndex: 1,
    explanation:
      'Goodhart’s Law warns that single-metric incentives without quality counter-metrics (CSAT / First-Contact Resolution) induce metric gaming.',
  },
  {
    id: 'nov24_pic_h2',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'AI Visual Evaluation · Avoiding Confirmation Bias',
    difficulty: 'Hard',
    sourceTag: 'Nov 24 Special · AI Thinking Hard',
    question:
      'You ask an AI model to audit a workplace safety photo and generate a boardroom report. What prompt structure produces the highest reliability?',
    options: [
      '"Write 5 scary hazards you imagine might exist off-camera."',
      '"List only directly observable visual cues with exact locations, flag anything ambiguous as Unverified, and propose one prioritized mitigation per confirmed cue."',
      '"Summarize why this company is failing in one emotional paragraph."',
      '"Assume all workers are careless and draft firing notices."',
    ],
    correctIndex: 1,
    explanation:
      'Separating directly observable evidence from inference ("flag ambiguous items as Unverified") prevents hallucinated claims in executive briefs.',
  },
  {
    id: 'nov24_pic_s1',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'Picture Connect · Abstract Synthesis',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Picture Connect Standard',
    question:
      'Mentor Kapil pairs "A Lighthouse" with "Transparent Documentation." What is the clearest employability link?',
    options: [
      'Both only operate near oceans',
      'Both stay stationary as reliable reference signals so teams navigating complex storms never drift onto hidden hazards',
      'Both require expensive steel towers',
      'Both replace team communication completely',
    ],
    correctIndex: 1,
    explanation:
      'Like a lighthouse beam in dark waters, clear documentation gives distributed teams steady visibility and prevents avoidable mistakes.',
  },
  {
    id: 'nov24_pic_s2',
    pillarId: 'picture_ai',
    pillarTitle: 'Picture Connect, Critical Thinking & AI',
    topic: 'Observation Recall · Signal vs Noise',
    difficulty: 'Standard',
    sourceTag: 'Nov 24 Special · Visual Audit Standard',
    question:
      'In a 15-second flash visual observation exercise, what systematic scanning method maximizes recall accuracy?',
    options: [
      'Stare at a single bright object in the center for all 15 seconds',
      'Scan quadrant-by-quadrant (top-left -> top-right -> bottom-right -> bottom-left) while noting functional pairs and obvious missing items',
      'Close your eyes for the first 10 seconds',
      'Try to memorize exact hex color codes of the wall',
    ],
    correctIndex: 1,
    explanation:
      'Systematic quadrant scanning + functional grouping captures both foreground details and conspicuous omissions reliably.',
  },
];

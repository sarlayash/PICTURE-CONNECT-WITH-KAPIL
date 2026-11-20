import {
  SolvedCompanyProblem,
  TrackLiveNotes,
} from './masterUniverseTypes';

export const PILLAR2_LIVE_NOTES: Partial<Record<string, TrackLiveNotes>> = {
  c_lang: {
    trackId: 'c_lang',
    headline: 'Programming in C — Pointers, Memory & Output Mastery Notes',
    quickSummary:
      'C rounds at TCS, Wipro, Capgemini, Tech Mahindra, and embedded product teams test pointers, memory layout, storage classes, and undefined-behavior traps. Know where every byte lives.',
    coreBullets: [
      {
        title: 'Memory Layout (5 Segments)',
        point: 'Text (code) → Initialized Data → BSS (zero-init globals/statics) → Heap (malloc/calloc) → Stack (locals/frames).',
      },
      {
        title: 'Pointer Arithmetic Scaling',
        point: 'Incrementing `int *p` adds `sizeof(int)` (typically 4 bytes), NOT 1 byte. `arr[i]` is strictly `*(arr + i)`.',
      },
      {
        title: 'malloc vs calloc vs realloc',
        point: '`malloc` allocates uninitialized garbage; `calloc(n, sz)` zero-initializes; ALWAYS `free(p); p = NULL;` to avoid dangling pointers.',
      },
      {
        title: 'Storage Classes',
        point: '`static` local persists across function calls (initialized once); `extern` declares a global defined in another file.',
      },
      {
        title: 'struct vs union',
        point: '`struct` gives each member separate memory (plus padding alignment); `union` overlays all members in the size of the largest member.',
      },
    ],
    goldenShortcuts: [
      'Macro safety rule: ALWAYS wrap parameters and the full expression in parentheses `#define SQR(x) ((x)*(x))`.',
      'String literals live in read-only memory (`char *s = "hi"` → UB to modify; `char s[] = "hi"` → modifiable stack copy).',
      'Bit trick: `n > 0 && (n & (n - 1)) == 0` checks Power of 2 in O(1).',
    ],
    commonTraps: [
      'Returning the address of a local stack variable from a function (dangling pointer!).',
      'Using `sizeof(arr)` inside a function parameter — arrays decay to pointers (`sizeof` returns 8 bytes on 64-bit).',
      'Forgetting null terminator `\\0` when computing buffer size (`strlen(s) + 1`).',
    ],
    mentorKapilTips: [
      'In TCS NQT and Tech Mahindra output MCQs, trace `static` variables and pointer increments on rough paper step-by-step—never guess mentally.',
      'Mentioning "set pointer to NULL after free()" in a C interview immediately signals production-level discipline.',
      'Master `struct` memory padding (4-byte / 8-byte alignment)—it is one of the most repeated C interview questions.',
    ],
  },
  cpp_lang: {
    trackId: 'cpp_lang',
    headline: 'Programming in C++ — OOP, Polymorphism, STL & Smart Pointers',
    quickSummary:
      'Product companies (Amazon, Google, Microsoft, Apple) and MNC coding rounds test C++ runtime polymorphism (`vtable`), STL container Big-O guarantees, move semantics, and RAII smart pointers.',
    coreBullets: [
      {
        title: 'Virtual Functions & vtable',
        point: '`virtual` enables runtime dispatch via hidden `vptr` → `vtable`. ALWAYS declare a `virtual ~Base()` when deleting derived objects via Base*.',
      },
      {
        title: 'STL Complexity Cheat Sheet',
        point: '`vector` push_back O(1) amortized; `map/set` (Red-Black Tree) O(log N) ordered; `unordered_map/set` O(1) average hash.',
      },
      {
        title: 'RAII & Smart Pointers',
        point: '`unique_ptr` (sole ownership, zero overhead), `shared_ptr` (reference counted), `weak_ptr` (breaks cyclic shared_ptr leaks).',
      },
      {
        title: 'References vs Pointers',
        point: 'References must be initialized, cannot be null, and cannot be reseated. Pass large STL objects by `const T&` to avoid copies.',
      },
      {
        title: 'Move Semantics (C++11+)',
        point: 'Rvalue references (`T&&`) + `std::move` transfer ownership of internal heap buffers in O(1) instead of deep-copying.',
      },
    ],
    goldenShortcuts: [
      'Avoid `std::endl` in competitive/coding rounds (flushes buffer slowly); use `\'\\n\'` + `ios::sync_with_stdio(false); cin.tie(nullptr);`.',
      'Use `emplace_back` over `push_back` to construct objects directly in-place.',
      'Beware: `map[key]` INSERTS a default 0 entry if `key` doesn’t exist—use `.find()` or `.count()` for read-only checks!',
    ],
    commonTraps: [
      'Forgetting `virtual` on base class destructor → derived resources leak on `delete basePtr`.',
      'Object slicing when passing a Derived object by VALUE to a function expecting Base.',
      'Invalidating `vector` iterators by pushing elements while iterating (reallocation moves memory).',
    ],
    mentorKapilTips: [
      'Always mention `const &` parameters when writing C++ code in interviews—it shows you care about hidden copy costs.',
      'If asked "map vs unordered_map", mention BOTH average O(1) vs O(log N) AND that `unordered_map` can degrade to O(N) on hash collisions.',
      'Knowing `unique_ptr` + `weak_ptr` cyclic reference breakdown puts you miles ahead of textbook C++ candidates.',
    ],
  },
  java_lang: {
    trackId: 'java_lang',
    headline: 'Programming in Java — JVM, Collections, Strings & Streams Notes',
    quickSummary:
      'Java is the #1 enterprise backend language across TCS, Infosys, Wipro, Capgemini, Cognizant, Amazon, and fintechs. Nail JVM memory, String immutability, `equals/hashCode`, and `HashMap` internals.',
    coreBullets: [
      {
        title: 'String Immutability & Pool',
        point: 'String literals live in the String Constant Pool. Compare content with `.equals()`, NEVER `==` (which compares object references). Use `StringBuilder` inside loops.',
      },
      {
        title: 'HashMap Internals (Java 8+)',
        point: 'Buckets store LinkedList nodes, automatically converting to a Red-Black Tree when a bucket exceeds 8 nodes (TREEIFY_THRESHOLD) for O(log N) worst case.',
      },
      {
        title: 'equals() & hashCode() Contract',
        point: 'If `a.equals(b)` is true, `a.hashCode() == b.hashCode()` MUST hold. Breaking this breaks `HashMap` and `HashSet` lookups.',
      },
      {
        title: 'Abstract Class vs Interface',
        point: 'Abstract class supports instance state + constructors (single inheritance); Interface supports multiple inheritance + `default`/`static` methods.',
      },
      {
        title: 'Exceptions & Try-With-Resources',
        point: 'Checked exceptions (`IOException`) require compile-time handling; Unchecked (`NullPointerException`) extend `RuntimeException`. `finally` runs even after `return`.',
      },
    ],
    goldenShortcuts: [
      '`final` variable = constant reference; `final` method = cannot override; `final` class = cannot extend (e.g., `String`).',
      'Java is strictly PASS-BY-VALUE (for objects, the value of the reference is copied).',
      'Prefer `ConcurrentHashMap` over synchronized `Hashtable` for high-throughput multithreading.',
    ],
    commonTraps: [
      'String concatenation (`s += x`) inside a loop creates O(N²) intermediate String objects—use `StringBuilder`.',
      'Using `==` on `Integer` objects outside cached range `[-128, 127]` returns `false`!',
      'Mutating a key object after inserting it into a `HashMap` makes the entry unreachable.',
    ],
    mentorKapilTips: [
      'Every Java interviewer asks "How does HashMap work internally?" — mention hash → bucket index → equals check → Java 8 Red-Black Tree conversion at threshold 8.',
      'Be ready to write one clean Java 8 Stream pipeline (`filter`, `map`, `groupingBy`)—TCS Digital, Cognizant, and Amazon love it.',
      'Know the Integer Cache `[-128..127]` trap—it shows up constantly in Capgemini and Wipro Java output MCQs.',
    ],
  },
  python_lang: {
    trackId: 'python_lang',
    headline: 'Programming in Python — Clean Pythonic Mastery & Interview Traps',
    quickSummary:
      'Python is the #1 interview language for FAANG coding rounds, AI/ML, Data Analytics, and TCS/Wipro/Capgemini automation roles. Master mutability traps, generators, decorators, `collections`, and GIL vs multiprocessing.',
    coreBullets: [
      {
        title: 'Mutable vs Immutable & Default Arg Trap',
        point: 'Lists/dicts/sets are mutable; ints/strings/tuples are immutable. NEVER write `def f(a=[])` — use `def f(a=None): a = [] if a is None else a`.',
      },
      {
        title: 'Comprehensions & Lazy Generators',
        point: '`[x*x for x in nums]` allocates a full list; `(x*x for x in nums)` and `yield` stream lazily in O(1) memory.',
      },
      {
        title: 'Power Tools in `collections` & `itertools`',
        point: '`Counter` (O(N) frequency maps), `defaultdict(list)`, `deque` (O(1) `popleft()`), and `heapq` (min-heap; negate values for max-heap).',
      },
      {
        title: 'Decorators & Context Managers',
        point: 'Decorators wrap functions cleanly (always add `@functools.wraps(fn)`). `with open(...)` guarantees resource cleanup via `__enter__`/`__exit__`.',
      },
      {
        title: 'CPython GIL & Concurrency',
        point: 'GIL lets only 1 thread run Python bytecode at a time: use `asyncio`/`threading` for I/O-bound tasks, `multiprocessing` for CPU-bound tasks.',
      },
    ],
    goldenShortcuts: [
      '`==` checks value equality; `is` checks object identity (`id(a) == id(b)`). Always use `is None`, never `== None`.',
      'String building: NEVER `s += ch` in a loop — collect in list and do `"".join(parts)` in O(N).',
      'Sort with custom key: `items.sort(key=lambda x: (-x[1], x[0]))` (Timsort: O(N log N) stable!).',
    ],
    commonTraps: [
      'Shallow copy bug: `b = a.copy()` or `a[:]` still shares nested inner lists! Use `copy.deepcopy(a)` for nested structures.',
      'Creating a 2D grid with `[[0]*3]*3` links all 3 rows to the SAME list—always use `[[0]*3 for _ in range(3)]`!',
      'Using `list.pop(0)` in BFS (O(N) shift) instead of `collections.deque.popleft()` (O(1)).',
    ],
    mentorKapilTips: [
      'Writing `Counter`, `defaultdict`, `deque`, and `enumerate()` in Python interviews makes your code half as long and twice as readable as Java/C++.',
      'Memorize the `[[0]*n]*m` reference trap and mutable default argument `def f(x=[])`—Amazon, Google, and TCS Digital ask them nonstop.',
      'Always state Timsort is O(N log N) worst-case and STABLE—interviewers love hearing you know what powers `.sort()`.',
    ],
  },
  dsa: {
    trackId: 'dsa',
    headline: 'Data Structures & Algorithms — Pattern Recognition Cheat Sheet',
    quickSummary:
      'You don’t need 1,000 memorized questions to crack FAANG, Amazon, Microsoft, or TCS Digital. Master 8 reusable patterns that unlock 90% of real coding interview problems.',
    coreBullets: [
      {
        title: 'HashMap + Two Pointers + Sliding Window',
        point: 'Turns O(N²) subarray/pair brute force into O(N): Two Sum (HashMap), Longest Substring Without Repeats (Sliding Window), 3Sum (Sort + Two Pointers).',
      },
      {
        title: 'Binary Search on Answer Space',
        point: 'Whenever a predicate is monotonic (False…False, True…True — e.g., Koko Eating Bananas, Min Capacity), binary search the answer in O(N log Range).',
      },
      {
        title: 'Fast/Slow Pointers & Stack Patterns',
        point: 'Floyd’s Tortoise & Hare detects LinkedList cycles in O(1) space; Monotonic Stack solves Next Greater Element and Largest Histogram in O(N).',
      },
      {
        title: 'Trees & Graphs (BFS vs DFS)',
        point: 'Shortest path in unweighted graph → BFS (Queue). Cycle/topological order in DAG → Kahn’s BFS or DFS. Weighted positive shortest path → Dijkstra (Min-Heap).',
      },
      {
        title: 'Dynamic Programming (DP) Recipe',
        point: '1) Define state `dp[i]` clearly, 2) Write recurrence relation, 3) Set base cases, 4) Optimize space from O(N) → O(1) if only previous 1–2 states are needed.',
      },
    ],
    goldenShortcuts: [
      'Input size N ≤ 20 → Backtracking/Bitmask; N ≤ 10³ → O(N²) DP; N ≤ 10⁵ → O(N log N) or O(N); N ≤ 10⁹ → O(log N) or O(1) math.',
      'Top-K largest elements → Min-Heap of size K in O(N log K) time and O(K) space.',
      'Inorder traversal of a valid BST ALWAYS yields a strictly sorted sequence.',
    ],
    commonTraps: [
      'Jumping straight into code without clarifying constraints (empty array, negatives, duplicates, overflow).',
      'Using recursion without memoization on overlapping subproblems (exponential O(2^N) TLE).',
      'Forgetting `visited` set in graph BFS/DFS → infinite loop on cycles.',
    ],
    mentorKapilTips: [
      'Follow Kapil’s 4-Step FAANG Framework: 1) Clarify edge cases, 2) State brute-force complexity, 3) Optimize pattern + dry-run on 1 example, 4) Code cleanly & state Time/Space Big-O.',
      'Explain your thought process OUT LOUD—silent perfect code scores lower than collaborative problem solving at Google and Amazon.',
      'Practice dry-running edge cases (`[]`, `[1]`, all duplicates, all negatives) BEFORE saying "I am done".',
    ],
  },
};

export const PILLAR2_SOLVED_PROBLEMS: SolvedCompanyProblem[] = [
  // =========================================================================
  // C LANGUAGE — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_c_1',
    trackId: 'c_lang',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Static Variable Persistence Across Calls',
    problem:
      'What is the output of:\nint fun() { static int x = 7; return x--; }\nint main() { for(fun(); fun(); fun()) printf("%d ", fun()); }',
    solution:
      'Trace `static int x = 7` (initialized ONLY ONCE):\n1) Init `fun()`: returns 7, x → 6.\n2) Cond `fun()`: returns 6 (true), x → 5.\n3) Body `printf(fun())`: prints `5 `, x → 4.\n4) Incr `fun()`: returns 4, x → 3.\n5) Cond `fun()`: returns 3 (true), x → 2.\n6) Body `printf(fun())`: prints `2 `, x → 1.\n7) Incr `fun()`: returns 1, x → 0.\n8) Cond `fun()`: returns 0 (false) → loop terminates!\nFinal Output: `5 2`',
    keyTakeaway: 'Always trace BOTH the returned value (post-decrement) AND which of the 3 `for` slots calls the function.',
    kapilTip: 'TCS loves `for(fun(); fun(); fun())` traps—draw a 4-column table (Init / Cond / Body / Incr) so you catch 0 vs non-zero instantly!',
  },
  {
    id: 'prob_c_2',
    trackId: 'c_lang',
    company: 'Wipro NLTH',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Pointer Subtraction & Element Count',
    problem:
      'Given `int arr[] = {10, 20, 30, 40, 50}; int *p = arr; int *q = arr + 4;`, what does `printf("%ld", q - p);` print?',
    solution:
      'Output: `4`.\nReason: Pointer subtraction `q - p` returns the number of ELEMENTS (not raw bytes!) between the two pointers: `(addr(arr+4) - addr(arr)) / sizeof(int) = 16 / 4 = 4`.',
    keyTakeaway: 'Subtracting two pointers of the same type yields element distance, automatically divided by `sizeof(type)`.',
    kapilTip: 'If a question casts both pointers to `(char *)`, THEN subtraction gives raw byte distance (`16`). Watch for casts!',
  },
  {
    id: 'prob_c_3',
    trackId: 'c_lang',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Struct Alignment & sizeof() Padding Calculation',
    problem:
      'On a 64-bit system (char=1, int=4, double=8), compare `sizeof(A)` vs `sizeof(B)`:\nstruct A { char c; double d; int i; };\nstruct B { double d; int i; char c; };',
    solution:
      'struct A: `char c` (1B) + 7B padding + `double d` (8B) + `int i` (4B) + 4B tail padding = **24 bytes**.\nstruct B: `double d` (8B) + `int i` (4B) + `char c` (1B) + 3B tail padding = **16 bytes**.\nOrdering fields largest-to-smallest saves 33% RAM!',
    keyTakeaway: 'Members align to their own size boundary, and total struct size pads to a multiple of its largest member.',
    kapilTip: 'Reordering struct fields from largest to smallest is a classic systems optimization interviewers love.',
  },
  {
    id: 'prob_c_4',
    trackId: 'c_lang',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Macro Expansion Trap Without Parentheses',
    problem:
      'Predict the output:\n#define SQUARE(x) x * x\nprintf("%d", SQUARE(2 + 3));',
    solution:
      'Output: `11` (NOT 25!).\nReason: Preprocessor does literal text substitution BEFORE compilation:\n`SQUARE(2 + 3)` expands to `2 + 3 * 2 + 3` = `2 + 6 + 3 = 11`.\nFix: `#define SQUARE(x) ((x) * (x))` → `((2 + 3) * (2 + 3)) = 25`.',
    keyTakeaway: 'Macros perform blind token replacement, not function evaluation.',
    kapilTip: 'Also warn the interviewer about side effects like `SQUARE(i++)` incrementing `i` twice—prefer `static inline` functions!',
  },
  {
    id: 'prob_c_5',
    trackId: 'c_lang',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Swap Two Numbers Without a Third Variable (XOR)',
    problem:
      'Write a bug-free C snippet to swap two integers `a` and `b` without using a temporary variable, and name its edge case.',
    solution:
      '```c\nif (&a != &b) {\n  a = a ^ b;\n  b = a ^ b;\n  a = a ^ b;\n}\n```\nEdge case: If `a` and `b` alias the exact same memory address (`&a == &b`), XOR-swapping zeroes the variable out! Checking `&a != &b` prevents the bug.',
    keyTakeaway: 'XOR swap avoids arithmetic overflow (unlike `a = a + b`), but always guard against self-aliasing.',
    kapilTip: 'Pointing out the self-aliasing edge case turns a basic Cognizant question into an impressive senior-level answer.',
  },
  {
    id: 'prob_c_6',
    trackId: 'c_lang',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Custom `my_strcpy` & Buffer Overflow Prevention',
    problem:
      'Implement `strcpy` cleanly in C using pointers, and explain why production systems prefer `strncpy`/`snprintf`.',
    solution:
      '```c\nchar *my_strcpy(char *dst, const char *src) {\n  char *start = dst;\n  while ((*dst++ = *src++) != \'\\0\');\n  return start;\n}\n```\nWhy unsafe in production: `strcpy` has no destination size bound—if `src` exceeds `dst`, it corrupts adjacent stack memory (buffer overflow). Use `snprintf(dst, dst_sz, "%s", src)` instead.',
    keyTakeaway: 'Save `start` pointer before incrementing `dst`, copy the `\\0` terminator, and discuss bounds safety.',
    kapilTip: 'Adding `const` to `const char *src` immediately shows good C API hygiene.',
  },
  {
    id: 'prob_c_7',
    trackId: 'c_lang',
    company: 'Cisco / Product',
    companyTier: 'Product',
    difficulty: 'Medium',
    title: 'Detect System Endianness (Little vs Big Endian)',
    problem:
      'Write a 4-line C function to detect at runtime whether the CPU is Little Endian or Big Endian.',
    solution:
      '```c\nint isLittleEndian(void) {\n  unsigned int x = 1;\n  unsigned char *byte = (unsigned char *)&x;\n  return (*byte == 1);\n}\n```\nExplanation: For `x = 0x00000001`, Little Endian (x86/ARM) stores the least-significant byte `0x01` at the lowest address (`*byte == 1`).',
    keyTakeaway: 'Casting `&x` to `unsigned char *` inspects the exact lowest-address byte in memory.',
    kapilTip: 'Classic systems/networking question asked by Cisco, Qualcomm, Apple, and Tech Mahindra Telecom.',
  },
  {
    id: 'prob_c_8',
    trackId: 'c_lang',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Array Decay Inside Function Parameters',
    problem:
      'Why does `sizeof(a)` print `8` (or `4`) inside `void printSize(int a[10])` instead of `40`?',
    solution:
      'In C, an array parameter `int a[10]` silently decays into a pointer `int *a`. Therefore `sizeof(a)` returns `sizeof(int *)` (8 bytes on 64-bit, 4 bytes on 32-bit). Always pass array length explicitly: `void f(int *a, size_t n)`.',
    keyTakeaway: 'Arrays lose their size metadata when passed to functions—always pass `size_t n` alongside.',
    kapilTip: 'Compute array length ONLY in the declaring scope: `sizeof(arr) / sizeof(arr[0])`.',
  },
  {
    id: 'prob_c_9',
    trackId: 'c_lang',
    company: 'Apple',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Count Set Bits (Brian Kernighan’s Algorithm)',
    problem:
      'Count the number of `1` bits in an unsigned 32-bit integer faster than scanning all 32 bits.',
    solution:
      '```c\nint countSetBits(unsigned int n) {\n  int count = 0;\n  while (n) {\n    n &= (n - 1); // clears lowest set bit\n    count++;\n  }\n  return count;\n}\n```\nTime Complexity: O(k) where k = number of set bits (at most 32).',
    keyTakeaway: '`n & (n - 1)` strips the rightmost 1-bit in a single CPU instruction.',
    kapilTip: 'This exact trick solves Power-of-2 checks, Hamming Weight, and Bit-Flip Distance!',
  },
  {
    id: 'prob_c_10',
    trackId: 'c_lang',
    company: 'TCS Digital',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Dangling Pointer vs Memory Leak Fix',
    problem:
      'Identify BOTH bugs in this snippet and fix them:\nint *p = malloc(sizeof(int)); *p = 42; p = malloc(sizeof(int)); free(p); printf("%d", *p);',
    solution:
      'Bug 1 (Memory Leak): Reassigning `p = malloc(...)` without freeing the first block leaks the original 4 bytes forever.\nBug 2 (Use-After-Free / Dangling Pointer): Reading `*p` after `free(p)` is Undefined Behavior.\nFix: Free first block before reallocating, print BEFORE `free(p)`, and immediately set `p = NULL;`.',
    keyTakeaway: 'Every `malloc` must have a matching `free` along every code path, followed by `p = NULL`.',
    kapilTip: 'Mention tools like Valgrind or AddressSanitizer (`-fsanitize=address`) to impress embedded/backend interviewers.',
  },

  // =========================================================================
  // C++ — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_cpp_1',
    trackId: 'cpp_lang',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Virtual Destructor & Memory Leak Prevention',
    problem:
      'What happens when you run `Base *b = new Derived(); delete b;` if `~Base()` is NOT virtual?',
    solution:
      'Undefined Behavior — only `~Base()` runs, skipping `~Derived()`, which leaks any heap memory, file handles, or mutexes owned by `Derived`.\nFix: Always declare `virtual ~Base() = default;` in any polymorphic base class.',
    keyTakeaway: 'Rule of thumb: If a class has even ONE virtual function, its destructor MUST be virtual.',
    kapilTip: 'Asked in nearly 70% of C++ interviews at Amazon, Microsoft, and Adobe.',
  },
  {
    id: 'prob_cpp_2',
    trackId: 'cpp_lang',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Breaking Cyclic `shared_ptr` Leaks With `weak_ptr`',
    problem:
      'Node A holds `shared_ptr<Node> next` pointing to B, and B holds `shared_ptr<Node> prev` pointing back to A. Why do both leak when leaving scope, and how do you fix it?',
    solution:
      'Both nodes retain reference count = 1 pointing at each other, so neither count ever reaches 0 → permanent memory leak.\nFix: Change back-pointer to `std::weak_ptr<Node> prev;` (non-owning observer; call `prev.lock()` when safe access is needed).',
    keyTakeaway: '`shared_ptr` for ownership, `weak_ptr` for non-owning back-links or caches.',
    kapilTip: 'Also state that `std::unique_ptr` should be your DEFAULT smart pointer (zero reference-counting overhead).',
  },
  {
    id: 'prob_cpp_3',
    trackId: 'cpp_lang',
    company: 'Microsoft',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Diamond Problem & Virtual Inheritance',
    problem:
      'Class `D` inherits from both `B` and `C`, which both inherit from `A`. Why does `d.x` fail to compile, and how does C++ resolve it?',
    solution:
      '`D` contains TWO duplicate copies of `A::x` (one via `B`, one via `C`), causing an ambiguity compile error.\nFix: Use virtual inheritance: `class B : virtual public A {}; class C : virtual public A {};` so `D` shares one single `A` sub-object.',
    keyTakeaway: '`virtual public` inheritance collapses duplicate diamond base sub-objects into one shared instance.',
    kapilTip: 'Note that the most-derived class (`D`) is directly responsible for initializing the virtual base `A`.',
  },
  {
    id: 'prob_cpp_4',
    trackId: 'cpp_lang',
    company: 'TCS Digital',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'STL `vector` `size()` vs `capacity()` & `reserve()`',
    problem:
      'Why is calling `v.reserve(100000)` before a loop of 100,000 `push_back` calls faster than letting `vector` grow dynamically?',
    solution:
      'Without `reserve()`, `vector` reallocates (~1.5x–2x growth) and copies/moves all existing elements ~17 times. `v.reserve(100000)` allocates the exact contiguous buffer ONCE upfront (`capacity = 100000`, `size = 0`), avoiding all reallocations and iterator invalidations.',
    keyTakeaway: '`reserve()` changes capacity only; `resize()` actually creates default-constructed elements and changes size.',
    kapilTip: 'Never confuse `reserve(n)` with `resize(n)`—indexing `v[0]` after `reserve()` alone is Undefined Behavior!',
  },
  {
    id: 'prob_cpp_5',
    trackId: 'cpp_lang',
    company: 'Meta',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Rule of Five & Move Constructor Optimization',
    problem:
      'Why does adding a Move Constructor (`T(T&& other) noexcept`) dramatically speed up `std::vector<MyBuffer>` reallocations?',
    solution:
      'A Copy Constructor allocates fresh heap memory and deep-copies every byte. A `noexcept` Move Constructor simply steals `other.data` pointer and sets `other.data = nullptr` in O(1).\nCrucial detail: `std::vector` ONLY uses the move constructor during reallocation if it is marked `noexcept` (for strong exception safety!).',
    keyTakeaway: 'Mark Move Constructor and Move Assignment `noexcept` so STL containers actually use them.',
    kapilTip: 'Mentioning the `noexcept` requirement for `std::vector` reallocation is an instant Meta/Google green flag.',
  },
  {
    id: 'prob_cpp_6',
    trackId: 'cpp_lang',
    company: 'Wipro',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Compile-Time vs Runtime Polymorphism',
    problem:
      'Compare Function Overloading / Templates vs Virtual Function Overriding in C++.',
    solution:
      'Compile-Time (Static): Function/Operator Overloading and Templates — resolved at compile time, zero runtime overhead.\nRuntime (Dynamic): `virtual` method overriding via Base pointer/reference — resolved at runtime via `vptr → vtable` lookup.',
    keyTakeaway: 'Always use the `override` keyword in derived classes so the compiler catches signature typos.',
    kapilTip: 'Give a crisp 2-line code example of `override` in interviews to prove hands-on Modern C++ skill.',
  },
  {
    id: 'prob_cpp_7',
    trackId: 'cpp_lang',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Custom Comparator in `std::priority_queue` (Min-Heap)',
    problem:
      'By default `priority_queue<int>` is a Max-Heap. How do you declare a Min-Heap of pairs `(dist, node)` for Dijkstra’s algorithm?',
    solution:
      '```cpp\nusing P = pair<int, int>;\npriority_queue<P, vector<P>, greater<P>> minHeap;\n```\nFor a custom struct, overload `operator()` in a comparator struct (note: return `a.val > b.val` to put the SMALLER element on top!).',
    keyTakeaway: '`priority_queue` comparator returns `true` if `a` has LOWER priority than `b` (inverted vs `std::sort`).',
    kapilTip: 'That inverted comparator sign in `priority_queue` trips up tons of candidates—memorize `greater<P>` cleanly.',
  },
  {
    id: 'prob_cpp_8',
    trackId: 'cpp_lang',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Object Slicing Bug & Reference Fix',
    problem:
      'Why does `void render(Shape s) { s.draw(); }` call `Shape::draw()` even when passed a `Circle` object?',
    solution:
      'Passing `Shape s` by VALUE slices off the `Circle` derived portion and copies only the `Shape` base slice.\nFix: Pass by reference `void render(const Shape& s)` or pointer `const Shape* s` to preserve polymorphism.',
    keyTakeaway: 'Polymorphism in C++ ONLY works through references or pointers, never by value.',
    kapilTip: 'Passing by `const T&` solves BOTH object slicing AND unnecessary copy overhead simultaneously.',
  },
  {
    id: 'prob_cpp_9',
    trackId: 'cpp_lang',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Erase-Remove Idiom in `std::vector`',
    problem:
      'Remove all even numbers from `vector<int> v` in O(N) without invalidating iterators.',
    solution:
      '```cpp\n// C++11–17 Erase-Remove Idiom:\nv.erase(std::remove_if(v.begin(), v.end(),\n        [](int x){ return x % 2 == 0; }), v.end());\n// C++20 shorthand:\nstd::erase_if(v, [](int x){ return x % 2 == 0; });\n```\nNote: `std::remove_if` only shifts kept elements forward and returns the new logical end; `v.erase` actually shrinks the vector.',
    keyTakeaway: 'Never erase inside a simple range-for loop; use Erase-Remove (or C++20 `std::erase_if`) in O(N).',
    kapilTip: 'Calling `v.erase` in a loop is O(N²); Erase-Remove compacts in a single O(N) pass.',
  },
  {
    id: 'prob_cpp_10',
    trackId: 'cpp_lang',
    company: 'Adobe / Product',
    companyTier: 'Product',
    difficulty: 'Medium',
    title: 'Const Correctness: `const int*` vs `int* const`',
    problem:
      'Distinguish `const int* p`, `int* const p`, and `const int* const p`.',
    solution:
      'Read right-to-left:\n1) `const int* p` → pointer to a `const int` (data is read-only; pointer can move).\n2) `int* const p` → `const` pointer to `int` (pointer is fixed; data can change).\n3) `const int* const p` → fixed pointer to read-only data.',
    keyTakeaway: 'The Clockwise / Right-to-Left reading rule decodes any complex C/C++ pointer declaration in 2 seconds.',
    kapilTip: 'Also mark read-only member functions `const` (e.g., `int getAge() const`) so they work on `const T&` objects.',
  },

  // =========================================================================
  // JAVA — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_java_1',
    trackId: 'java_lang',
    company: 'TCS Digital',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'String Pool vs Heap `new String()` Comparison',
    problem:
      'Predict the output:\nString a = "Kapil"; String b = "Kapil"; String c = new String("Kapil");\nSystem.out.println((a == b) + " " + (a == c) + " " + a.equals(c));',
    solution:
      'Output: `true false true`.\nReason: `a` and `b` share the exact same interned reference in the String Pool (`a == b` is `true`). `new String()` forces a fresh Heap object (`a == c` is `false`). `.equals()` compares characters (`true`).',
    keyTakeaway: 'Always use `.equals()` (or `Objects.equals(a, b)` for null safety) to compare Java Strings.',
    kapilTip: 'Calling `"Kapil".equals(input)` instead of `input.equals("Kapil")` prevents `NullPointerException` automatically!',
  },
  {
    id: 'prob_java_2',
    trackId: 'java_lang',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Java 8 Streams: Top 3 Highest-Paid Employees Per Department',
    problem:
      'Given `List<Employee> emps`, write a concise Java 8 Stream pipeline to group employees by department and compute average salary per department.',
    solution:
      '```java\nMap<String, Double> avgByDept = emps.stream()\n  .collect(Collectors.groupingBy(\n      Employee::getDept,\n      Collectors.averagingDouble(Employee::getSalary)\n  ));\n```',
    keyTakeaway: '`Collectors.groupingBy` + downstream collectors (`averagingDouble`, `counting`, `maxBy`) replace 25 lines of boilerplate loops.',
    kapilTip: 'Memorize `groupingBy`, `filter`, `map`, and `Comparator.comparing`—they appear in 80% of Java backend rounds.',
  },
  {
    id: 'prob_java_3',
    trackId: 'java_lang',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Integer Cache Trap (`100 == 100` vs `200 == 200`)',
    problem:
      'Why does `Integer x = 100, y = 100; x == y` return `true`, while `Integer a = 200, b = 200; a == b` returns `false`?',
    solution:
      'JVM autoboxing (`Integer.valueOf()`) caches `Integer` instances in range `[-128, 127]`. Thus `100` reuses the same cached object, whereas `200` allocates two distinct Heap objects so `==` compares different references (`false`).',
    keyTakeaway: 'Always compare boxed wrappers (`Integer`, `Long`) with `.equals()`, never `==`.',
    kapilTip: 'One of the most famous trick MCQs in Infosys, Capgemini, and Wipro Java tests!',
  },
  {
    id: 'prob_java_4',
    trackId: 'java_lang',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'HashMap Collision & Custom Key `equals/hashCode` Bug',
    problem:
      'You put a `new Student(1, "Riya")` into a `HashMap`, overriding `equals()` but forgetting `hashCode()`. Why does `map.get(new Student(1, "Riya"))` return `null`?',
    solution:
      'Default `Object.hashCode()` derives from memory identity, so the two `Student` objects produce different hash buckets! `HashMap` looks in the wrong bucket and returns `null` without ever calling `equals()`.\nFix: Always override BOTH `equals()` and `hashCode()` using the exact same immutable fields (or use a Java 17 `record`!).',
    keyTakeaway: 'Equal objects MUST have identical hashCodes; use Java `record` for immutable data keys.',
    kapilTip: 'Mentioning Java `record` shows you stay current with modern Java 17/21 LTS.',
  },
  {
    id: 'prob_java_5',
    trackId: 'java_lang',
    company: 'Microsoft',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Thread-Safe Lazy Singleton (Double-Checked Locking)',
    problem:
      'Implement a thread-safe, low-overhead Singleton in Java and explain why `volatile` is mandatory.',
    solution:
      '```java\npublic class Config {\n  private static volatile Config instance;\n  private Config() {}\n  public static Config getInstance() {\n    if (instance == null) {\n      synchronized (Config.class) {\n        if (instance == null) instance = new Config();\n      }\n    }\n    return instance;\n  }\n}\n```\nWhy `volatile`: Prevents CPU instruction reordering so another thread never observes a half-constructed object reference.',
    keyTakeaway: '`volatile` guarantees visibility AND prevents constructor reordering in Double-Checked Locking.',
    kapilTip: 'Bonus senior note: An `enum Singleton { INSTANCE; }` is even safer against reflection and serialization attacks!',
  },
  {
    id: 'prob_java_6',
    trackId: 'java_lang',
    company: 'Wipro NLTH',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: '`finally` Block Execution With `return`',
    problem:
      'What does this method return?\ntry { return 1; } catch(Exception e) { return 2; } finally { System.out.print("Done "); }',
    solution:
      'Prints `Done ` and returns `1`.\nReason: `finally` ALWAYS executes before the method returns to the caller (unless `System.exit(0)` or JVM crash occurs). Note: Never put a `return` inside `finally`, as it silently swallows exceptions!',
    keyTakeaway: 'Use `try-with-resources` (`AutoCloseable`) instead of manual `finally` cleanup whenever possible.',
    kapilTip: 'Wipro & Tech Mahindra love asking whether `finally` runs if `try` has `return` (YES!) vs `System.exit(0)` (NO!).',
  },
  {
    id: 'prob_java_7',
    trackId: 'java_lang',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Design an Immutable Class in Java',
    problem:
      'What 5 rules guarantee a custom Java class `Employee` is genuinely immutable?',
    solution:
      '1) Declare class `final` (no subclass overriding).\n2) Make all fields `private final`.\n3) Provide NO setter methods.\n4) Deep-copy mutable inputs inside the constructor (e.g., `new Date(d.getTime())` or `List.copyOf(skills)`).\n5) Return defensive copies from getters for any mutable fields.',
    keyTakeaway: 'Defensive copying of mutable fields (`List`, `Date`) is the step 90% of candidates forget!',
    kapilTip: 'Immutable objects are inherently thread-safe and ideal as `HashMap` keys.',
  },
  {
    id: 'prob_java_8',
    trackId: 'java_lang',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Fail-Fast vs Fail-Safe Iterators (`ConcurrentModificationException`)',
    problem:
      'Why does calling `list.remove(x)` inside an enhanced `for` loop on `ArrayList` throw `ConcurrentModificationException`, and how do you fix it?',
    solution:
      '`ArrayList` uses a Fail-Fast iterator tracking `modCount`. Structural modification outside the iterator triggers `ConcurrentModificationException`.\nFix 1: Use `list.removeIf(x -> condition)` (Java 8+).\nFix 2: Use `Iterator.remove()`.\nFix 3: For concurrent reads/writes, use Fail-Safe `CopyOnWriteArrayList` or `ConcurrentHashMap`.',
    keyTakeaway: '`removeIf()` is the cleanest, O(N) way to delete elements from an `ArrayList` safely.',
    kapilTip: 'Never remove from an `ArrayList` inside a `for (T x : list)` loop—use `removeIf` every time.',
  },
  {
    id: 'prob_java_9',
    trackId: 'java_lang',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'First Non-Repeating Character in a String (O(N))',
    problem:
      'Find the first non-repeating character in `"employability"` preserving insertion order.',
    solution:
      '```java\nMap<Character, Integer> freq = new LinkedHashMap<>();\nfor (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);\nchar ans = freq.entrySet().stream()\n  .filter(e -> e.getValue() == 1)\n  .map(Map.Entry::getKey).findFirst().orElse(\'_\');\n```\nTime: O(N), Space: O(1) (at most 26/128 ASCII chars). For `"employability"`, `e` appears once → returns `\'e\'`.',
    keyTakeaway: '`LinkedHashMap` preserves insertion order while providing O(1) frequency updates via `merge()`.',
    kapilTip: 'Using `freq.merge(c, 1, Integer::sum)` looks super clean and idiomatic in live coding interviews.',
  },
  {
    id: 'prob_java_10',
    trackId: 'java_lang',
    company: 'Oracle / Product',
    companyTier: 'Product',
    difficulty: 'Medium',
    title: '`Comparable` vs `Comparator` Sorting',
    problem:
      'When should you implement `Comparable<T>` vs passing a `Comparator<T>`?',
    solution:
      '`Comparable<T>` defines ONE natural default order inside the class itself (`compareTo`).\n`Comparator<T>` defines MULTIPLE external sort orders without modifying the class (e.g., `Comparator.comparing(Emp::getSalary).reversed().thenComparing(Emp::getName)`).',
    keyTakeaway: 'Use `Integer.compare(a, b)` instead of `a - b` to prevent integer overflow bugs on negative values!',
    kapilTip: 'Calling out the `a - b` overflow bug in comparators immediately impresses product-company engineers.',
  },

  // =========================================================================
  // PYTHON — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_py_1',
    trackId: 'python_lang',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Easy',
    title: 'Group Anagrams in O(N · K)',
    problem:
      'Given `words = ["eat", "tea", "tan", "ate", "nat", "bat"]`, group all anagrams together cleanly in Python.',
    solution:
      '```python\nfrom collections import defaultdict\n\ndef group_anagrams(words):\n    groups = defaultdict(list)\n    for w in words:\n        key = [0] * 26\n        for ch in w:\n            key[ord(ch) - ord("a")] += 1\n        groups[tuple(key)].append(w)\n    return list(groups.values())\n```\nTime: O(N · K) (beats sorting each word O(N · K log K)!). Note: `tuple(key)` is hashable, unlike a list.',
    keyTakeaway: 'Using a 26-count `tuple` as a `defaultdict(list)` key avoids sorting every string.',
    kapilTip: 'Highlight WHY you converted `key` to `tuple(key)`—lists are mutable and unhashable in Python dicts!',
  },
  {
    id: 'prob_py_2',
    trackId: 'python_lang',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Mutable Default Argument & Late-Binding Closure Traps',
    problem:
      'Why does `funcs = [lambda x: x + i for i in range(3)]` make `[f(10) for f in funcs]` return `[12, 12, 12]` instead of `[10, 11, 12]`? Fix it.',
    solution:
      'Python closures capture variable `i` by REFERENCE (late binding), so when the lambdas run after the loop ends, `i` is `2` for all three.\nFix: Bind `i` eagerly as a default parameter:\n`funcs = [lambda x, i=i: x + i for i in range(3)]` → `[10, 11, 12]`.',
    keyTakeaway: 'Closures bind loop variables late; default argument `i=i` captures the current value at creation time.',
    kapilTip: 'Google and Meta Python screens love this exact late-binding closure question!',
  },
  {
    id: 'prob_py_3',
    trackId: 'python_lang',
    company: 'Meta',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Top K Frequent Elements in O(N) Bucket Sort',
    problem:
      'Given `nums = [1, 1, 1, 2, 2, 3]` and `k = 2`, return the `k` most frequent elements faster than O(N log N).',
    solution:
      '```python\nfrom collections import Counter\n\ndef top_k_frequent(nums, k):\n    counts = Counter(nums)\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for num, freq in counts.items():\n        buckets[freq].append(num)\n    res = []\n    for freq in range(len(buckets) - 1, 0, -1):\n        for num in buckets[freq]:\n            res.append(num)\n            if len(res) == k:\n                return res\n```\nTime: O(N), Space: O(N). (Or `heapq.nlargest` in O(N log k)).',
    keyTakeaway: 'Frequency can never exceed `len(nums)`, making O(N) bucket indexing faster than heap or sort.',
    kapilTip: 'Notice `[[] for _ in range(...)]` instead of `[[]] * n` — point out that you avoided the shared-list bug!',
  },
  {
    id: 'prob_py_4',
    trackId: 'python_lang',
    company: 'TCS Digital',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Memory-Efficient Streaming Log Parser (Generator)',
    problem:
      'Parse a 20 GB server log file to count lines containing `"ERROR"` without crashing RAM.',
    solution:
      '```python\ndef error_lines(filepath):\n    with open(filepath, "r", encoding="utf-8") as f:\n        for line in f:  # streams 1 line at a time\n            if "ERROR" in line:\n                yield line\n\ncount = sum(1 for _ in error_lines("server.log"))\n```\nMemory: O(1) — never calls `f.read()` or `f.readlines()`.',
    keyTakeaway: 'Iterating directly over a file object with a generator handles multi-gigabyte files in constant RAM.',
    kapilTip: 'TCS Digital, Cognizant, and Data Engineering interviews love seeing `with open(...)` + `yield` generators.',
  },
  {
    id: 'prob_py_5',
    trackId: 'python_lang',
    company: 'Netflix',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Production Timing & Retry Decorator With `@functools.wraps`',
    problem:
      'Write a clean Python decorator `@retry(times=3)` that retries a flaky network call up to 3 times before re-raising.',
    solution:
      '```python\nfrom functools import wraps\n\ndef retry(times=3):\n    def decorator(fn):\n        @wraps(fn)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, times + 1):\n                try:\n                    return fn(*args, **kwargs)\n                except Exception:\n                    if attempt == times:\n                        raise\n        return wrapper\n    return decorator\n```',
    keyTakeaway: 'Parameterized decorators need 3 nested layers: factory → decorator → wrapper (plus `@wraps(fn)`).',
    kapilTip: 'Mentioning `@wraps(fn)` preserves docstrings and function names for telemetry and logging frameworks.',
  },
  {
    id: 'prob_py_6',
    trackId: 'python_lang',
    company: 'Wipro',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Flatten an Arbitrarily Nested List Using Recursion + `yield from`',
    problem:
      'Flatten `[1, [2, [3, 4], 5], 6]` into `[1, 2, 3, 4, 5, 6]` cleanly.',
    solution:
      '```python\ndef flatten(nested):\n    for item in nested:\n        if isinstance(item, list):\n            yield from flatten(item)\n        else:\n            yield item\n\nprint(list(flatten([1, [2, [3, 4], 5], 6])))\n```',
    keyTakeaway: '`yield from` delegates cleanly to a recursive sub-generator in O(depth) stack space.',
    kapilTip: 'Clean `isinstance(item, list)` + `yield from` is a huge upgrade over messy global accumulator lists.',
  },
  {
    id: 'prob_py_7',
    trackId: 'python_lang',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Remove Duplicates While Preserving Exact Order',
    problem:
      'Remove duplicates from `["SQL", "Python", "AWS", "Python", "SQL", "Docker"]` while keeping the original first-seen order.',
    solution:
      '```python\nskills = ["SQL", "Python", "AWS", "Python", "SQL", "Docker"]\nunique_ordered = list(dict.fromkeys(skills))\n# ["SQL", "Python", "AWS", "Docker"]\n```\nTime: O(N). Since Python 3.7+, `dict` is guaranteed to preserve insertion order (unlike `set()`).',
    keyTakeaway: '`list(dict.fromkeys(seq))` is the fastest, cleanest O(N) order-preserving deduplication idiom in Python.',
    kapilTip: 'Never use `list(set(seq))` when order matters—`dict.fromkeys()` nails it in one Pythonic line!',
  },
  {
    id: 'prob_py_8',
    trackId: 'python_lang',
    company: 'Microsoft',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'O(1) LRU Cache Using `OrderedDict` (or `@lru_cache`)',
    problem:
      'Design a Least Recently Used (LRU) Cache supporting O(1) `get(key)` and `put(key, val)` in Python.',
    solution:
      '```python\nfrom collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, cap: int):\n        self.cap, self.cache = cap, OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, val: int) -> None:\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = val\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)\n```',
    keyTakeaway: '`OrderedDict` combines a HashMap + Doubly Linked List under the hood for O(1) `move_to_end` and `popitem(last=False)`.',
    kapilTip: 'Ask the interviewer: "May I use `OrderedDict`, or would you like me to implement the Doubly Linked List + dict manually?" Both options show mastery!',
  },
  {
    id: 'prob_py_9',
    trackId: 'python_lang',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Invert a Dictionary & Handle Duplicate Values Safely',
    problem:
      'Given `emp_dept = {"Riya": "AI", "Kabir": "Cloud", "Neha": "AI"}`, group employees by department (`{"AI": ["Riya", "Neha"], "Cloud": ["Kabir"]}`).',
    solution:
      '```python\nfrom collections import defaultdict\n\nby_dept = defaultdict(list)\nfor emp, dept in emp_dept.items():\n    by_dept[dept].append(emp)\nprint(dict(by_dept))\n```\nWhy not `{v: k for k, v in emp_dept.items()}`? Because duplicate values (`"AI"`) would overwrite `"Riya"`!',
    keyTakeaway: 'Always check whether values are unique before inverting a dictionary.',
    kapilTip: 'Spotting the duplicate-value overwrite edge case instantly earns bonus points in Cognizant and TechM rounds.',
  },
  {
    id: 'prob_py_10',
    trackId: 'python_lang',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Merge Two Sorted Lists Without `.sort()` (Two Pointers)',
    problem:
      'Merge `a = [1, 4, 7]` and `b = [2, 3, 8, 9]` in O(M + N) time.',
    solution:
      '```python\ndef merge_sorted(a, b):\n    i = j = 0\n    out = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i]); i += 1\n        else:\n            out.append(b[j]); j += 1\n    out.extend(a[i:])\n    out.extend(b[j:])\n    return out\n```',
    keyTakeaway: 'Two-pointer merge runs in linear O(M + N) time and forms the heart of Merge Sort and k-way merges.',
    kapilTip: 'For merging `k` sorted streams, mention `heapq.merge(*lists)` — a built-in O(N log k) lazy generator!',
  },

  // =========================================================================
  // DSA — 10 REAL FAANG & MNC PROBLEMS
  // =========================================================================
  {
    id: 'prob_dsa_1',
    trackId: 'dsa',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Easy',
    title: 'Two Sum (Single-Pass HashMap in O(N))',
    problem:
      'Given an unsorted array `nums` and `target`, return indices of two numbers that sum to `target`.',
    solution:
      '```python\ndef two_sum(nums, target):\n    seen = {}  # value -> index\n    for i, x in enumerate(nums):\n        need = target - x\n        if need in seen:\n            return [seen[need], i]\n        seen[x] = i\n```\nTime: O(N), Space: O(N). Checking `need in seen` BEFORE inserting `seen[x] = i` avoids reusing the same element twice.',
    keyTakeaway: 'Trade O(N) hash table space to eliminate the inner O(N) search loop.',
    kapilTip: 'Always mention the follow-up: "If the array is already sorted, I can solve it in O(1) extra space with Two Pointers!"',
  },
  {
    id: 'prob_dsa_2',
    trackId: 'dsa',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Longest Substring Without Repeating Characters (Sliding Window)',
    problem:
      'Given `s = "abcabcbb"`, find the length of the longest substring with all unique characters.',
    solution:
      '```python\ndef longest_unique(s):\n    last = {}\n    left = ans = 0\n    for right, ch in enumerate(s):\n        if ch in last and last[ch] >= left:\n            left = last[ch] + 1\n        last[ch] = right\n        ans = max(ans, right - left + 1)\n    return ans  # returns 3 ("abc")\n```\nTime: O(N), Space: O(min(N, charset)).',
    keyTakeaway: 'Jumping `left = last[ch] + 1` (only if `last[ch] >= left`) avoids shrinking step-by-step.',
    kapilTip: 'This is Amazon’s #1 Sliding Window classic—watch the `last[ch] >= left` guard so `left` never moves backward!',
  },
  {
    id: 'prob_dsa_3',
    trackId: 'dsa',
    company: 'Meta',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Merge Overlapping Intervals',
    problem:
      'Merge all overlapping intervals in `[[1,3], [2,6], [8,10], [15,18]]` → `[[1,6], [8,10], [15,18]]`.',
    solution:
      '```python\ndef merge_intervals(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged\n```\nTime: O(N log N) due to sorting; Space: O(N).',
    keyTakeaway: 'Sort by start time, then compare each `start` against the previous merged `end`.',
    kapilTip: 'Always use `max(merged[-1][1], end)` to handle intervals completely nested inside a wider interval like `[1,10]` & `[2,5]`!',
  },
  {
    id: 'prob_dsa_4',
    trackId: 'dsa',
    company: 'Microsoft',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Maximum Subarray Sum (Kadane’s Algorithm)',
    problem:
      'Find the contiguous subarray with the largest sum in `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`.',
    solution:
      '```python\ndef max_subarray(nums):\n    cur = best = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best  # 6 from [4, -1, 2, 1]\n```\nTime: O(N), Space: O(1).',
    keyTakeaway: 'At each element, either extend the running subarray (`cur + x`) or restart fresh at `x`.',
    kapilTip: 'Initialize `cur = best = nums[0]` (NOT `0`) so all-negative arrays like `[-5, -2, -9]` still return `-2` cleanly!',
  },
  {
    id: 'prob_dsa_5',
    trackId: 'dsa',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Valid Parentheses Stack Check',
    problem:
      'Check whether a string containing `()[]{}` is validly balanced (e.g., `"{[()]}"` → True, `"([)]"` → False).',
    solution:
      '```python\ndef is_valid(s):\n    stack, pair = [], {")": "(", "]": "[", "}": "{"}\n    for ch in s:\n        if ch in pair:\n            if not stack or stack.pop() != pair[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return not stack\n```\nTime: O(N), Space: O(N).',
    keyTakeaway: 'Closing brackets must match the MOST RECENT unmatched opening bracket (LIFO = Stack).',
    kapilTip: 'Check BOTH empty-stack on closing bracket (`")"`) AND non-empty stack at the end (`"("`)!',
  },
  {
    id: 'prob_dsa_6',
    trackId: 'dsa',
    company: 'Apple',
    companyTier: 'FAANG',
    difficulty: 'Easy',
    title: 'Detect Linked List Cycle & Find Entry Node (Floyd’s Algorithm)',
    problem:
      'Detect if a singly linked list has a cycle in O(1) extra space, and locate the cycle start node.',
    solution:
      'Phase 1: Move `slow = slow.next`, `fast = fast.next.next`. If they meet, a cycle exists; if `fast` hits `None`, no cycle.\nPhase 2 (Cycle Entry): Reset `slow = head`, advance both `slow` and `fast` by 1 step at a time—their meeting node is guaranteed to be the exact cycle entry!\nTime: O(N), Space: O(1).',
    keyTakeaway: 'Mathematical distance invariance lets Floyd’s algorithm find both cycle existence and start node with zero HashSet.',
    kapilTip: 'Always guard the loop condition with `while fast and fast.next:` to avoid NullPointerException.',
  },
  {
    id: 'prob_dsa_7',
    trackId: 'dsa',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Number of Islands (2D Grid BFS/DFS)',
    problem:
      'Count connected islands of `"1"`s (4-directional) in an M × N binary grid.',
    solution:
      '```python\ndef num_islands(grid):\n    R, C, count = len(grid), len(grid[0]), 0\n    def dfs(r, c):\n        if not (0 <= r < R and 0 <= c < C) or grid[r][c] != "1":\n            return\n        grid[r][c] = "0"  # mark visited\n        for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)):\n            dfs(r + dr, c + dc)\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == "1":\n                count += 1; dfs(r, c)\n    return count\n```\nTime: O(M · N), Space: O(M · N) worst-case recursion.',
    keyTakeaway: 'Flood-fill marks visited land cells immediately to ensure every cell is processed at most once.',
    kapilTip: 'Ask the interviewer: "Is it okay to mutate the input grid in-place, or should I keep a separate `visited` set?"',
  },
  {
    id: 'prob_dsa_8',
    trackId: 'dsa',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Course Schedule — Cycle Detection in Directed Graph (Kahn’s BFS)',
    problem:
      'Given `numCourses` and `[course, prereq]` pairs, determine if all courses can be completed (no circular dependency).',
    solution:
      'Build adjacency list `prereq -> course` and `indegree[]` array.\nPush all nodes with `indegree == 0` into a `deque`.\nPop nodes, decrement neighbors’ indegrees, push newly-0 nodes, and count processed nodes.\nReturn `processed == numCourses`.\nTime: O(V + E), Space: O(V + E).',
    keyTakeaway: 'A directed graph has a valid Topological Order if and only if it is a DAG (zero cycles).',
    kapilTip: 'Kahn’s BFS avoids recursion stack overflow on huge graphs and naturally outputs the exact course order too!',
  },
  {
    id: 'prob_dsa_9',
    trackId: 'dsa',
    company: 'Netflix',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Coin Change — Minimum Coins (Bottom-Up DP)',
    problem:
      'Given `coins = [1, 2, 5]` and `amount = 11`, find the fewest coins needed to make `amount` (or `-1` if impossible).',
    solution:
      '```python\ndef coin_change(coins, amount):\n    dp = [amount + 1] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] <= amount else -1  # 3 (5+5+1)\n```\nTime: O(amount × len(coins)), Space: O(amount).',
    keyTakeaway: 'Greedy fails on coin sets like `[1, 3, 4]` for `amount = 6` (Greedy picks 4+1+1=3; DP finds 3+3=2!).',
    kapilTip: 'Explaining WHY Greedy fails with `[1, 3, 4] -> 6` is the ultimate proof of DP intuition in interviews.',
  },
  {
    id: 'prob_dsa_10',
    trackId: 'dsa',
    company: 'Wipro / Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Binary Search in a Rotated Sorted Array (O(log N))',
    problem:
      'Search for `target = 0` in rotated sorted array `[4, 5, 6, 7, 0, 1, 2]` in O(log N) time.',
    solution:
      'At every `mid`, at least ONE half (`[lo..mid]` or `[mid..hi]`) is guaranteed strictly sorted!\n1) If `nums[lo] <= nums[mid]` (left half sorted): check if `nums[lo] <= target < nums[mid]` → go left, else right.\n2) Else (right half sorted): check if `nums[mid] < target <= nums[hi]` → go right, else left.\nTime: O(log N), Space: O(1).',
    keyTakeaway: 'Always identify which half is cleanly sorted first, then check if `target` sits inside its bounds.',
    kapilTip: 'Don’t forget the `<=` in `nums[lo] <= nums[mid]` — it handles the 2-element subarray case where `lo == mid`!',
  },
];

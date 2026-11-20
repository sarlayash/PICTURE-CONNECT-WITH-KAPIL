import aptitudeGrammarImg from '../assets/images/aptitude_grammar_studio_1795175425945.jpg';
import programmingDsaImg from '../assets/images/programming_dsa_lab_1795175426944.jpg';
import excelPowerBiImg from '../assets/images/excel_powerbi_analytics_1795175426984.jpg';
import dbmsCloudImg from '../assets/images/dbms_cloud_architecture_1795175428333.jpg';

export type MasterPillarId = 'aptitude_grammar' | 'coding_dsa' | 'data_cloud';

export type MasterTrackId =
  | 'aptitude'
  | 'grammar'
  | 'parts_of_speech'
  | 'parts_of_grammar'
  | 'tenses'
  | 'punctuation'
  | 'idioms'
  | 'c_lang'
  | 'cpp_lang'
  | 'java_lang'
  | 'python_lang'
  | 'dsa'
  | 'excel'
  | 'power_bi'
  | 'dbms'
  | 'cloud';

export interface MasterPillarDefinition {
  id: MasterPillarId;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  trackIds: MasterTrackId[];
}

export interface MasterTrackDefinition {
  id: MasterTrackId;
  pillarId: MasterPillarId;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
}

export interface MasterPlaybookCard {
  id: string;
  trackId: MasterTrackId;
  tag: string;
  conceptTitle: string;
  ruleOrFormula: string;
  example: string;
  placementTip: string;
}

export interface MasterMcq {
  id: string;
  trackId: MasterTrackId;
  topic: string;
  difficulty: 'Core' | 'Applied' | 'Placement';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  hint: string;
  explanation: string;
  xpClean: number;
  xpWithHint: number;
}

export interface TrackLiveNotes {
  trackId: MasterTrackId;
  headline: string;
  quickSummary: string;
  coreBullets: { title: string; point: string }[];
  goldenShortcuts: string[];
  commonTraps: string[];
  mentorKapilTips: string[];
}

export interface SolvedCompanyProblem {
  id: string;
  trackId: MasterTrackId;
  company: string;
  companyTier: 'FAANG' | 'MNC' | 'Product';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  problem: string;
  solution: string;
  keyTakeaway: string;
  kapilTip: string;
}

export interface MasterBadgeDefinition {
  id: string;
  title: string;
  description: string;
  criteriaLabel: string;
  accent: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'cyan';
  checkUnlocked: (stats: {
    aptitudeGrammarCorrect: number;
    codingDsaCorrect: number;
    dataCloudCorrect: number;
    dsaCorrect: number;
    pythonCorrect: number;
    verbalExtendedCorrect: number;
    totalAnswered: number;
    totalCorrect: number;
    cleanCorrect: number;
    studiedCount: number;
    completedTracksCount: number;
  }) => boolean;
}

export const MASTER_UNIVERSE_IMAGES = {
  aptitudeGrammar: aptitudeGrammarImg,
  programmingDsa: programmingDsaImg,
  excelPowerBi: excelPowerBiImg,
  dbmsCloud: dbmsCloudImg,
};

export const MASTER_UNIVERSE_META = {
  title: 'Tech, Python, Aptitude, Grammar & Data Universe',
  subtitle:
    '16 Placement Tracks · Live Crisp Notes · 160 FAANG/MNC Solved Problems · 160 Hinted MCQs · 10 PNG Badges',
  poweredBy: 'POWERED BY KAPIL',
  brand: 'EMPLOYABILITY UNIVERSE With Kapil',
  description:
    'One-stop placement mastery across Aptitude, Grammar, Parts of Speech, Parts of Grammar, Tenses, Punctuation, Idioms, C, C++, Java, Python, DSA, Excel, Power BI, DBMS & SQL, and Cloud Computing — complete with Live Crisp Notes, Mentor Kapil’s Placement Tips, and 10 real company-asked solved problems per subject.',
};

export const MASTER_PILLARS: MasterPillarDefinition[] = [
  {
    id: 'aptitude_grammar',
    number: 'PILLAR 01',
    title: 'Aptitude, Grammar, Tenses, Punctuation & Idioms',
    shortTitle: 'Aptitude & Verbal (7)',
    subtitle:
      'Aptitude · Grammar · Parts of Speech · Syntax · Tenses · Punctuation · Idioms',
    description:
      'Build unstoppable screening test speed in quantitative aptitude, core grammar, parts of speech, syntax, all 12 tenses, punctuation precision, and high-frequency placement idioms.',
    image: aptitudeGrammarImg,
    imageAlt:
      'Executive study desk with English grammar reference guide, fountain pen, brass compass, and quantitative grid notebook',
    trackIds: [
      'aptitude',
      'grammar',
      'parts_of_speech',
      'parts_of_grammar',
      'tenses',
      'punctuation',
      'idioms',
    ],
  },
  {
    id: 'coding_dsa',
    number: 'PILLAR 02',
    title: 'Programming (C · C++ · Java · Python) & DSA Lab',
    shortTitle: 'Coding & DSA (5)',
    subtitle: 'C · C++ · Java · Python · Data Structures & Algorithms',
    description:
      'Master pointers, OOP, STL, JVM internals, Pythonic engineering, and DSA patterns asked in FAANG, Amazon, TCS, Wipro, Capgemini, Cognizant, and Tech Mahindra rounds.',
    image: programmingDsaImg,
    imageAlt:
      'Software engineering workstation displaying clean code modules and binary tree algorithm visualization on an ultrawide monitor',
    trackIds: ['c_lang', 'cpp_lang', 'java_lang', 'python_lang', 'dsa'],
  },
  {
    id: 'data_cloud',
    number: 'PILLAR 03',
    title: 'Analytics, Databases & Cloud',
    shortTitle: 'Data & Cloud (4)',
    subtitle: 'Microsoft Excel · Power BI · DBMS & SQL · Cloud Computing',
    description:
      'Analyze business data with Excel and Power BI DAX, design normalized SQL schemas, and architect resilient modern cloud infrastructure.',
    image: dbmsCloudImg,
    imageAlt:
      'Modern cloud data center corridor with minimalist navy server architecture and glowing fiber optic lines',
    trackIds: ['excel', 'power_bi', 'dbms', 'cloud'],
  },
];

export const MASTER_TRACKS: MasterTrackDefinition[] = [
  {
    id: 'aptitude',
    pillarId: 'aptitude_grammar',
    number: '01.',
    title: 'Quantitative & Logical Aptitude',
    shortTitle: 'Aptitude',
    subtitle: 'Percentages · Time & Work · Probability · Logical Deduction',
    description:
      'Crack TCS NQT, Wipro, Capgemini, Cognizant & Amazon screening rounds with fast ratio shortcuts, profit-loss framing, permutation models, and logical puzzles.',
    image: aptitudeGrammarImg,
    imageAlt: 'Executive desk with analytical notebook and brass compass for quantitative aptitude',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Screening MCQs'],
  },
  {
    id: 'grammar',
    pillarId: 'aptitude_grammar',
    number: '02.',
    title: 'English Grammar Foundations',
    shortTitle: 'Grammar',
    subtitle: 'Subject-Verb Agreement · Conditionals · Voice · Modifiers',
    description:
      'Eliminate high-frequency verbal ability errors across agreement traps, conditionals, active/passive voice, articles, and misplaced modifiers.',
    image: aptitudeGrammarImg,
    imageAlt: 'Reference guide and fountain pen for structured English grammar mastery',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Verbal MCQs'],
  },
  {
    id: 'parts_of_speech',
    pillarId: 'aptitude_grammar',
    number: '03.',
    title: 'Parts of Speech Mastery',
    shortTitle: 'Parts of Speech',
    subtitle: 'Nouns · Pronouns · Verbs · Adjectives · Adverbs · Prepositions',
    description:
      'Distinguish all 8 parts of speech in real placement sentences—including gerunds, participles, conjunctive adverbs, and preposition traps.',
    image: aptitudeGrammarImg,
    imageAlt: 'Structured English linguistics notebook for parts of speech analysis',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Identification MCQs'],
  },
  {
    id: 'parts_of_grammar',
    pillarId: 'aptitude_grammar',
    number: '04.',
    title: 'Parts of Grammar & Syntax',
    shortTitle: 'Parts of Grammar',
    subtitle: 'Clauses · Phrases · Sentence Types · Parallelism · Synthesis',
    description:
      'Master structural grammar: independent vs dependent clauses, phrase functions, sentence architecture, clause synthesis, and parallelism.',
    image: aptitudeGrammarImg,
    imageAlt: 'Modern desk workspace for English syntax, clauses, and sentence structure',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Structural MCQs'],
  },
  {
    id: 'tenses',
    pillarId: 'aptitude_grammar',
    number: '05.',
    title: 'English Tenses Mastery (All 12 Tenses)',
    shortTitle: 'Tenses',
    subtitle: 'Present · Past · Future · Perfect Sequencing · Stative Verbs',
    description:
      'Master all 12 verb tenses, Present Perfect vs Simple Past triggers, Past Perfect sequencing, stative verb rules, and conditional tense harmony.',
    image: aptitudeGrammarImg,
    imageAlt: 'Structured timeline chart and executive desk for English Tenses mastery',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Tense MCQs'],
  },
  {
    id: 'punctuation',
    pillarId: 'aptitude_grammar',
    number: '06.',
    title: 'Punctuation & Business Writing Precision',
    shortTitle: 'Punctuation',
    subtitle: 'Commas · Semicolons · Colons · Apostrophes · Em-Dashes · Quotes',
    description:
      'Eliminate comma splices, master semicolon vs colon rules, nail its/it’s and possessive apostrophes, and write executive-grade business emails.',
    image: aptitudeGrammarImg,
    imageAlt: 'Editorial fountain pen and punctuation guide for professional communication',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Punctuation MCQs'],
  },
  {
    id: 'idioms',
    pillarId: 'aptitude_grammar',
    number: '07.',
    title: 'Corporate & Placement Idioms & Phrases',
    shortTitle: 'Idioms',
    subtitle: 'Workplace Idioms · Verbal Screening Phrases · Executive Framing',
    description:
      'Decode and deploy the most frequently tested idioms in TCS, Wipro, Capgemini, Cognizant, Infosys, and corporate boardroom discussions.',
    image: aptitudeGrammarImg,
    imageAlt: 'Curated vocabulary and corporate idiom playbook on an executive desk',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Idiom MCQs'],
  },
  {
    id: 'c_lang',
    pillarId: 'coding_dsa',
    number: '08.',
    title: 'Programming in C',
    shortTitle: 'C Language',
    subtitle: 'Pointers · Dynamic Memory · Structs/Unions · Storage Classes',
    description:
      'Strengthen systems fundamentals: pointer arithmetic, malloc/calloc/free lifecycle, static vs extern scope, preprocessor macros, and memory layout.',
    image: programmingDsaImg,
    imageAlt: 'Code workstation focused on C language systems programming',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Output MCQs'],
  },
  {
    id: 'cpp_lang',
    pillarId: 'coding_dsa',
    number: '09.',
    title: 'Programming in C++',
    shortTitle: 'C++',
    subtitle: 'OOP · Virtual Functions · STL · Smart Pointers · Templates',
    description:
      'Level up for product-company coding rounds with runtime polymorphism, STL containers, RAII smart pointers, references, and generic templates.',
    image: programmingDsaImg,
    imageAlt: 'Modern workstation running C++ OOP and STL code',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 OOP & STL MCQs'],
  },
  {
    id: 'java_lang',
    pillarId: 'coding_dsa',
    number: '10.',
    title: 'Programming in Java',
    shortTitle: 'Java',
    subtitle: 'JVM Internals · Collections · Interfaces · Exceptions · Streams',
    description:
      'Ace enterprise and backend Java interviews: JVM memory areas, String pool immutability, HashMap mechanics, multithreading, and Java 8+ Streams.',
    image: programmingDsaImg,
    imageAlt: 'Software engineering workstation for Java backend development',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 JVM MCQs'],
  },
  {
    id: 'python_lang',
    pillarId: 'coding_dsa',
    number: '11.',
    title: 'Programming in Python',
    shortTitle: 'Python',
    subtitle: 'Comprehensions · Generators · Decorators · OOP · GIL · Collections',
    description:
      'Write clean, interview-ready Python: mutable vs immutable traps, list/dict comprehensions, lazy generators, decorators, *args/**kwargs, and collections.',
    image: programmingDsaImg,
    imageAlt: 'Developer workstation running clean Python algorithms and data structures',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Python MCQs'],
  },
  {
    id: 'dsa',
    pillarId: 'coding_dsa',
    number: '12.',
    title: 'Data Structures & Algorithms (DSA)',
    shortTitle: 'DSA',
    subtitle: 'Big-O · Trees · Graphs · Dynamic Programming · Sliding Window',
    description:
      'Think algorithmically under interview pressure: complexity trade-offs, sliding window, linked lists, heaps, BSTs, Dijkstra/BFS/DFS, and DP.',
    image: programmingDsaImg,
    imageAlt: 'Developer display visualizing binary tree nodes and algorithm complexity',
    highlights: ['Live Crisp Notes', '10 FAANG Problems', '10 DSA MCQs'],
  },
  {
    id: 'excel',
    pillarId: 'data_cloud',
    number: '13.',
    title: 'Microsoft Excel Mastery',
    shortTitle: 'Excel',
    subtitle: 'XLOOKUP · INDEX-MATCH · Pivot Tables · Power Query · Formulas',
    description:
      'Operate like a top business analyst with XLOOKUP, dynamic arrays, Pivot Table aggregation, SUMIFS logic, absolute references, and data cleaning.',
    image: excelPowerBiImg,
    imageAlt: 'Data analytics workstation showing clean spreadsheet models and revenue charts',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Formula MCQs'],
  },
  {
    id: 'power_bi',
    pillarId: 'data_cloud',
    number: '14.',
    title: 'Microsoft Power BI',
    shortTitle: 'Power BI',
    subtitle: 'Star Schema · DAX CALCULATE · Time Intelligence · RLS',
    description:
      'Build executive BI models using Star Schema design, DAX filter context, measures vs calculated columns, Power Query M, and Row-Level Security.',
    image: excelPowerBiImg,
    imageAlt: 'Executive dashboard monitor displaying KPI cards and financial Power BI visuals',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 DAX MCQs'],
  },
  {
    id: 'dbms',
    pillarId: 'data_cloud',
    number: '15.',
    title: 'DBMS & SQL Mastery',
    shortTitle: 'DBMS & SQL',
    subtitle: 'Normalization · ACID · Joins · B+ Trees · Window Functions',
    description:
      'Design rock-solid relational schemas from 1NF to BCNF, master SQL joins and window functions, optimize queries with B+ tree indexes, and guarantee ACID.',
    image: dbmsCloudImg,
    imageAlt: 'Enterprise database server infrastructure corridor',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 SQL & ACID MCQs'],
  },
  {
    id: 'cloud',
    pillarId: 'data_cloud',
    number: '16.',
    title: 'Cloud Computing Essentials',
    shortTitle: 'Cloud Computing',
    subtitle: 'IaaS/PaaS/SaaS · IAM · VPC · Containers · Serverless · HA',
    description:
      'Understand modern cloud architecture: Shared Responsibility, IAM least privilege, VPC networking, Kubernetes containers, serverless, and multi-AZ design.',
    image: dbmsCloudImg,
    imageAlt: 'Sleek cloud computing data center corridor with illuminated fiber lines',
    highlights: ['Live Crisp Notes', '10 Company Problems', '10 Cloud MCQs'],
  },
];

export const MASTER_BADGES: MasterBadgeDefinition[] = [
  {
    id: 'mb_aptitude_grammar',
    title: 'Aptitude & Grammar Ace',
    description: 'Scored 28+ correct across Aptitude, Grammar, Parts of Speech, Syntax, Tenses, Punctuation & Idioms.',
    criteriaLabel: '≥ 28 Correct in Pillar 01',
    accent: 'blue',
    checkUnlocked: (s) => s.aptitudeGrammarCorrect >= 28,
  },
  {
    id: 'mb_coding_polyglot',
    title: 'Code & DSA Architect',
    description: 'Scored 28+ correct across C, C++, Java, Python, and Data Structures & Algorithms.',
    criteriaLabel: '≥ 28 Correct in Pillar 02',
    accent: 'violet',
    checkUnlocked: (s) => s.codingDsaCorrect >= 28,
  },
  {
    id: 'mb_data_cloud',
    title: 'Data, SQL & Cloud Analyst',
    description: 'Scored 28+ out of 40 across Excel, Power BI, DBMS & Cloud Computing.',
    criteriaLabel: '≥ 28/40 in Pillar 03',
    accent: 'emerald',
    checkUnlocked: (s) => s.dataCloudCorrect >= 28,
  },
  {
    id: 'mb_python_pro',
    title: 'Pythonic Placement Engineer',
    description: 'Mastered Python programming with at least 8/10 correct answers.',
    criteriaLabel: '≥ 8/10 in Python',
    accent: 'amber',
    checkUnlocked: (s) => s.pythonCorrect >= 8,
  },
  {
    id: 'mb_verbal_polish',
    title: 'Tenses, Punctuation & Idioms Ace',
    description: 'Scored 22+ out of 30 across Tenses, Punctuation & Corporate Idioms.',
    criteriaLabel: '≥ 22/30 Verbal Suite',
    accent: 'cyan',
    checkUnlocked: (s) => s.verbalExtendedCorrect >= 22,
  },
  {
    id: 'mb_dsa_specialist',
    title: 'DSA Problem Solver',
    description: 'Mastered Data Structures & Algorithms with at least 8/10 correct answers.',
    criteriaLabel: '≥ 8/10 in DSA',
    accent: 'cyan',
    checkUnlocked: (s) => s.dsaCorrect >= 8,
  },
  {
    id: 'mb_playbook_vault',
    title: 'Universe Playbook Scholar',
    description: 'Studied at least 20 concept playbooks across the 16 skill tracks.',
    criteriaLabel: 'Study ≥ 20 Playbooks',
    accent: 'amber',
    checkUnlocked: (s) => s.studiedCount >= 20,
  },
  {
    id: 'mb_no_hint_master',
    title: 'No-Hint Technical Sharp',
    description: 'Answered 50+ Universe MCQs correctly without revealing hints.',
    criteriaLabel: '≥ 50 Clean Correct',
    accent: 'amber',
    checkUnlocked: (s) => s.cleanCorrect >= 50,
  },
  {
    id: 'mb_halfway_explorer',
    title: 'Multi-Domain Contender',
    description: 'Completed at least 8 full subject tests (80+ MCQs) across the Universe.',
    criteriaLabel: 'Complete ≥ 8 Tracks',
    accent: 'blue',
    checkUnlocked: (s) => s.completedTracksCount >= 8,
  },
  {
    id: 'mb_universe_legend',
    title: 'Employability Universe Legend',
    description: 'Completed at least 12+ subject tests (120+ MCQs) with ≥ 90 correct answers across the Universe.',
    criteriaLabel: '12+ Tracks · ≥ 90 Correct',
    accent: 'rose',
    checkUnlocked: (s) => s.completedTracksCount >= 12 && s.totalCorrect >= 90,
  },
];

export function getMasterUniverseRank(xp: number): {
  title: string;
  nextTitle: string | null;
  nextXp: number | null;
} {
  if (xp >= 3800) {
    return {
      title: 'Full-Stack Employability Legend',
      nextTitle: null,
      nextXp: null,
    };
  }
  if (xp >= 2600) {
    return {
      title: 'Senior Placement Architect',
      nextTitle: 'Full-Stack Employability Legend',
      nextXp: 3800,
    };
  }
  if (xp >= 1400) {
    return {
      title: 'Cross-Domain Analyst & Coder',
      nextTitle: 'Senior Placement Architect',
      nextXp: 2600,
    };
  }
  if (xp >= 500) {
    return {
      title: 'Rising Technical Scholar',
      nextTitle: 'Cross-Domain Analyst & Coder',
      nextXp: 1400,
    };
  }
  return {
    title: 'Universe Explorer',
    nextTitle: 'Rising Technical Scholar',
    nextXp: 500,
  };
}

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
  | 'c_lang'
  | 'cpp_lang'
  | 'java_lang'
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
  title: 'Tech, Data, Aptitude & Grammar Universe',
  subtitle:
    '12 Placement Tracks · 72 Study Playbooks · 120 Graded Hinted MCQs · 8 PNG Badges & Certificate',
  poweredBy: 'POWERED BY KAPIL',
  brand: 'EMPLOYABILITY UNIVERSE With Kapil',
  description:
    'One-stop technical and foundational mastery across Aptitude, English Grammar, Parts of Speech, Parts of Grammar, C, C++, Java, DSA, Microsoft Excel, Power BI, DBMS & SQL, and Cloud Computing.',
};

export const MASTER_PILLARS: MasterPillarDefinition[] = [
  {
    id: 'aptitude_grammar',
    number: 'PILLAR 01',
    title: 'Aptitude & English Grammar',
    shortTitle: 'Aptitude & Grammar',
    subtitle: 'Aptitude · Grammar · Parts of Speech · Parts of Grammar',
    description:
      'Build rock-solid screening test speed in quantitative aptitude, logical reasoning, grammar accuracy, parts of speech, and sentence syntax.',
    image: aptitudeGrammarImg,
    imageAlt:
      'Executive study desk with English grammar reference guide, fountain pen, brass compass, and quantitative grid notebook',
    trackIds: ['aptitude', 'grammar', 'parts_of_speech', 'parts_of_grammar'],
  },
  {
    id: 'coding_dsa',
    number: 'PILLAR 02',
    title: 'Programming & DSA Lab',
    shortTitle: 'C · C++ · Java · DSA',
    subtitle: 'C · C++ · Java · Data Structures & Algorithms',
    description:
      'Master pointers, OOP, STL, JVM internals, time complexity, trees, graphs, and dynamic programming for technical coding rounds.',
    image: programmingDsaImg,
    imageAlt:
      'Software engineering workstation displaying clean code modules and binary tree algorithm visualization on an ultrawide monitor',
    trackIds: ['c_lang', 'cpp_lang', 'java_lang', 'dsa'],
  },
  {
    id: 'data_cloud',
    number: 'PILLAR 03',
    title: 'Analytics, Databases & Cloud',
    shortTitle: 'Excel · BI · DBMS · Cloud',
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
      'Crack campus placement screening rounds with fast ratio shortcuts, profit-loss framing, permutation-combination models, and logical puzzles.',
    image: aptitudeGrammarImg,
    imageAlt: 'Executive desk with analytical notebook and brass compass for quantitative aptitude',
    highlights: ['6 Speed Playbooks', '10 Screening MCQs', 'Shortcut Hints'],
  },
  {
    id: 'grammar',
    pillarId: 'aptitude_grammar',
    number: '02.',
    title: 'English Grammar Foundations',
    shortTitle: 'Grammar',
    subtitle: 'Tenses · Subject-Verb Agreement · Conditionals · Voice',
    description:
      'Eliminate high-frequency verbal ability errors across verb tenses, agreement traps, conditionals, active/passive voice, and modifiers.',
    image: aptitudeGrammarImg,
    imageAlt: 'Reference guide and fountain pen for structured English grammar mastery',
    highlights: ['6 Core Grammar Rules', '10 Verbal Ability MCQs', 'Error-Spotting Tips'],
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
    highlights: ['6 Word-Class Playbooks', '10 Identification MCQs', 'Usage Nuances'],
  },
  {
    id: 'parts_of_grammar',
    pillarId: 'aptitude_grammar',
    number: '04.',
    title: 'Parts of Grammar & Syntax',
    shortTitle: 'Parts of Grammar',
    subtitle: 'Clauses · Phrases · Sentence Types · Parallelism · Punctuation',
    description:
      'Master structural grammar: independent vs dependent clauses, phrase functions, sentence architecture, punctuation precision, and parallelism.',
    image: aptitudeGrammarImg,
    imageAlt: 'Modern desk workspace for English syntax, clauses, and sentence structure',
    highlights: ['6 Syntax Blueprints', '10 Structural MCQs', 'Business Writing Polish'],
  },
  {
    id: 'c_lang',
    pillarId: 'coding_dsa',
    number: '05.',
    title: 'Programming in C',
    shortTitle: 'C Language',
    subtitle: 'Pointers · Dynamic Memory · Structs/Unions · Storage Classes',
    description:
      'Strengthen systems fundamentals: pointer arithmetic, malloc/calloc/free lifecycle, static vs extern scope, preprocessor macros, and memory layout.',
    image: programmingDsaImg,
    imageAlt: 'Code workstation focused on C language systems programming',
    highlights: ['6 Systems Playbooks', '10 Output & Pointer MCQs', 'Memory Safety Hints'],
  },
  {
    id: 'cpp_lang',
    pillarId: 'coding_dsa',
    number: '06.',
    title: 'Programming in C++',
    shortTitle: 'C++',
    subtitle: 'OOP · Virtual Functions · STL · Smart Pointers · Templates',
    description:
      'Level up for product-company coding rounds with runtime polymorphism, STL containers, RAII smart pointers, references, and generic templates.',
    image: programmingDsaImg,
    imageAlt: 'Modern workstation running C++ OOP and STL code',
    highlights: ['6 Modern C++ Playbooks', '10 OOP & STL MCQs', 'vtable & RAII Rationales'],
  },
  {
    id: 'java_lang',
    pillarId: 'coding_dsa',
    number: '07.',
    title: 'Programming in Java',
    shortTitle: 'Java',
    subtitle: 'JVM Internals · Collections · Interfaces · Exceptions · Streams',
    description:
      'Ace enterprise and backend Java interviews: JVM memory areas, String pool immutability, HashMap mechanics, multithreading, and Java 8+ Streams.',
    image: programmingDsaImg,
    imageAlt: 'Software engineering workstation for Java backend development',
    highlights: ['6 Java Core Playbooks', '10 JVM & Collections MCQs', 'Enterprise Interview Prep'],
  },
  {
    id: 'dsa',
    pillarId: 'coding_dsa',
    number: '08.',
    title: 'Data Structures & Algorithms (DSA)',
    shortTitle: 'DSA',
    subtitle: 'Big-O · Trees · Graphs · Dynamic Programming · Sorting',
    description:
      'Think algorithmically under interview pressure: complexity trade-offs, sliding window, linked lists, heaps, BSTs, Dijkstra/BFS/DFS, and DP.',
    image: programmingDsaImg,
    imageAlt: 'Developer display visualizing binary tree nodes and algorithm complexity',
    highlights: ['6 Algorithm Patterns', '10 Complexity & DSA MCQs', 'Interview Intuition Hints'],
  },
  {
    id: 'excel',
    pillarId: 'data_cloud',
    number: '09.',
    title: 'Microsoft Excel Mastery',
    shortTitle: 'Excel',
    subtitle: 'XLOOKUP · INDEX-MATCH · Pivot Tables · Power Query · Formulas',
    description:
      'Operate like a top business analyst with XLOOKUP, dynamic arrays, Pivot Table aggregation, SUMIFS logic, absolute references, and data cleaning.',
    image: excelPowerBiImg,
    imageAlt: 'Data analytics workstation showing clean spreadsheet models and revenue charts',
    highlights: ['6 Analyst Playbooks', '10 Formula & Pivot MCQs', 'Real Workplace Shortcuts'],
  },
  {
    id: 'power_bi',
    pillarId: 'data_cloud',
    number: '10.',
    title: 'Microsoft Power BI',
    shortTitle: 'Power BI',
    subtitle: 'Star Schema · DAX CALCULATE · Time Intelligence · RLS',
    description:
      'Build executive BI models using Star Schema design, DAX filter context, measures vs calculated columns, Power Query M, and Row-Level Security.',
    image: excelPowerBiImg,
    imageAlt: 'Executive dashboard monitor displaying KPI cards and financial Power BI visuals',
    highlights: ['6 BI Modeling Playbooks', '10 DAX & Modeling MCQs', 'Context Transition Hints'],
  },
  {
    id: 'dbms',
    pillarId: 'data_cloud',
    number: '11.',
    title: 'DBMS & SQL Mastery',
    shortTitle: 'DBMS & SQL',
    subtitle: 'Normalization · ACID · Joins · B+ Trees · Window Functions',
    description:
      'Design rock-solid relational schemas from 1NF to BCNF, master SQL joins and window functions, optimize queries with B+ tree indexes, and guarantee ACID.',
    image: dbmsCloudImg,
    imageAlt: 'Enterprise database server infrastructure corridor',
    highlights: ['6 SQL & Schema Playbooks', '10 Query & ACID MCQs', 'Indexing & Lock Insights'],
  },
  {
    id: 'cloud',
    pillarId: 'data_cloud',
    number: '12.',
    title: 'Cloud Computing Essentials',
    shortTitle: 'Cloud Computing',
    subtitle: 'IaaS/PaaS/SaaS · IAM · VPC · Containers · Serverless · HA',
    description:
      'Understand modern cloud architecture: Shared Responsibility, IAM least privilege, VPC networking, Kubernetes containers, serverless, and multi-AZ design.',
    image: dbmsCloudImg,
    imageAlt: 'Sleek cloud computing data center corridor with illuminated fiber lines',
    highlights: ['6 Cloud Blueprints', '10 Architecture MCQs', 'AWS/Azure/GCP Concepts'],
  },
];

export const MASTER_BADGES: MasterBadgeDefinition[] = [
  {
    id: 'mb_aptitude_grammar',
    title: 'Aptitude & Grammar Ace',
    description: 'Scored 28+ out of 40 across Aptitude, Grammar, Parts of Speech & Syntax.',
    criteriaLabel: '≥ 28/40 in Pillar 01',
    accent: 'blue',
    checkUnlocked: (s) => s.aptitudeGrammarCorrect >= 28,
  },
  {
    id: 'mb_coding_polyglot',
    title: 'Code & DSA Architect',
    description: 'Scored 28+ out of 40 across C, C++, Java, and Data Structures & Algorithms.',
    criteriaLabel: '≥ 28/40 in Pillar 02',
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
    description: 'Studied at least 20 concept playbooks across the 12 skill tracks.',
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
    description: 'Completed at least 6 full subject tests (60/120 MCQs) across the Universe.',
    criteriaLabel: 'Complete ≥ 6 Tracks',
    accent: 'blue',
    checkUnlocked: (s) => s.completedTracksCount >= 6,
  },
  {
    id: 'mb_universe_legend',
    title: 'Employability Universe Legend',
    description: 'Completed all 12 subject tests (120/120 MCQs) with ≥ 75% accuracy (90+/120).',
    criteriaLabel: '12/12 Tracks · ≥ 90/120',
    accent: 'rose',
    checkUnlocked: (s) => s.totalAnswered >= 120 && s.totalCorrect >= 90,
  },
];

export function getMasterUniverseRank(xp: number): {
  title: string;
  nextTitle: string | null;
  nextXp: number | null;
} {
  if (xp >= 3000) {
    return {
      title: 'Full-Stack Employability Legend',
      nextTitle: null,
      nextXp: null,
    };
  }
  if (xp >= 2100) {
    return {
      title: 'Senior Placement Architect',
      nextTitle: 'Full-Stack Employability Legend',
      nextXp: 3000,
    };
  }
  if (xp >= 1200) {
    return {
      title: 'Cross-Domain Analyst & Coder',
      nextTitle: 'Senior Placement Architect',
      nextXp: 2100,
    };
  }
  if (xp >= 450) {
    return {
      title: 'Rising Technical Scholar',
      nextTitle: 'Cross-Domain Analyst & Coder',
      nextXp: 1200,
    };
  }
  return {
    title: 'Universe Explorer',
    nextTitle: 'Rising Technical Scholar',
    nextXp: 450,
  };
}

import { LANDING_SHOWCASE_IMAGES, PHOTO_ASSETS, PhotoAssetKey } from './imageAssets';
import shoppingStudioHero from '../assets/images/shopping_negotiation_studio_1795156085818.jpg';
import indianismHero from '../assets/images/indianism_global_english_1795156086055.jpg';
import interviewHero from '../assets/images/interview_skills_panel_1795156085569.jpg';
import gdHero from '../assets/images/gd_skills_roundtable_1795156086746.jpg';
import { MASTER_UNIVERSE_IMAGES, MasterPillarId } from './masterUniverseTypes';

export type ArtworkId =
  | 'bridge'
  | 'broken_pencil'
  | 'traffic_signal'
  | 'mirror'
  | 'ladder'
  | 'tree'
  | 'crossroads'
  | 'apple'
  | 'rocket'
  | 'hourglass'
  | 'exam'
  | 'interview'
  | 'umbrella'
  | 'camera'
  | 'business'
  | 'puzzle'
  | 'teamwork'
  | 'stethoscope'
  | 'compass'
  | 'calculator'
  | 'keyboard'
  | 'paperclip'
  | 'emotion_scene'
  | 'workplace_detective'
  | 'boardroom_decline'
  | 'memory_scene'
  | 'challenge_stop'
  | 'challenge_growth'
  | 'challenge_iceberg'
  | 'challenge_ripple'
  | 'challenge_choices'
  | 'challenge_missing_piece'
  | 'coffee_cup'
  | 'lighthouse'
  | 'mountain_peak'
  | 'notebook';

export interface ConceptPair {
  id: string;
  pictureTitle: string;
  artwork: ArtworkId;
  photoKey?: PhotoAssetKey;
  abstractConcept: string;
  explanation: string;
  reflectionPrompt: string;
}

export interface LevelDefinition {
  level: number;
  title: string;
  subtitle: string;
  skillTag: string;
  xpReward: number;
  durationLabel: string;
  timerSeconds: number;
  learningOutcome: string;
  instructions: string[];
  highlightRule?: string;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  criteriaLabel: string;
  accent: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'cyan';
  checkUnlocked: (stats: {
    completedLevels: number[];
    xp: number;
    wheelSpins: number;
    completedWheelPrompts: string[];
  }) => boolean;
}

export interface ImpossiblePair {
  id: string;
  leftTitle: string;
  leftArtwork: ArtworkId;
  rightTitle: string;
  rightArtwork: ArtworkId;
  photoKey?: PhotoAssetKey;
  possibleConnection: string;
  reasoningHint: string;
}

export interface ProfessionCard {
  id: string;
  objectName: string;
  artwork: ArtworkId;
  profession: string;
  ceoPrompt: string;
  exampleCeoIdea: string;
}

export interface WorkplaceMistake {
  id: string;
  number: number;
  category:
    | 'Workplace safety violations'
    | 'Communication failures'
    | 'Time management problems'
    | 'Professional etiquette issues'
    | 'Security risks';
  title: string;
  detail: string;
  xPercent: number;
  yPercent: number;
}

export interface BoardroomClue {
  id: string;
  dimension: 'Customers' | 'Employees' | 'Product quality' | 'Marketing' | 'Competition';
  headline: string;
  visualEvidence: string;
  strategicQuestion: string;
  xPercent: number;
  yPercent: number;
}

export interface MemoryObject {
  id: string;
  label: string;
  hardOnly?: boolean;
  isMissingHint?: boolean;
}

export interface SurpriseChallenge {
  id: string;
  number: number;
  title: string;
  artwork: ArtworkId;
  question: string;
  deepeningPrompt: string;
  employabilityLens: string;
}

export interface WheelSegment {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  promptTitle: string;
  promptQuestion: string;
  hint: string;
  artwork: ArtworkId;
  timerSeconds: number;
  xpReward: number;
}

export interface WheelDeck {
  id: 'challenges' | 'mashup' | 'ceo_pitch';
  name: string;
  subtitle: string;
  segments: WheelSegment[];
}

export interface VideoCaseStudy {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  youtubeId: string;
  youtubeUrl: string;
  xpReward: number;
  challengeTitle: string;
  summary: string;
  reflectionQuestions: string[];
  employabilityTakeaway: string;
}

export const VIDEO_CASE_STUDIES: VideoCaseStudy[] = [
  {
    id: 'video_customer_delight',
    number: '01',
    title: 'Customer Delight',
    subtitle: 'Beyond Expectation: Service, Empathy & Human Observation',
    category: 'Service Excellence · Visual Observation',
    youtubeId: 'XEMAyTjaNNE',
    youtubeUrl: 'https://www.youtube.com/watch?v=XEMAyTjaNNE',
    xpReward: 75,
    challengeTitle: 'Challenge 01 · The Invisible Extra Mile',
    summary:
      'True customer delight rarely comes from expensive discounts—it comes from noticing unspoken details and responding with authentic care before anyone asks.',
    reflectionQuestions: [
      'What subtle moment or unspoken human need transformed a routine interaction into unforgettable delight?',
      'Why does proactive, thoughtful attention build deeper trust than standard transactional service?',
      'Action Prompt: Design one zero-cost "Customer Delight" gesture you can deliver in your first 30 days on the job.',
    ],
    employabilityTakeaway:
      'Top global companies hire observers who spot human friction early and solve it gracefully.',
  },
  {
    id: 'video_ba_fuelled_by_love',
    number: '02',
    title: 'British Airways — Fuelled By Love',
    subtitle: 'Cross-Cultural Connection, Heart & Purpose-Driven Leadership',
    category: 'Global Brand Storytelling · Empathy',
    youtubeId: 'ZFb01yTR9bA',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZFb01yTR9bA',
    xpReward: 75,
    challengeTitle: 'Challenge 02 · Beyond the Uniform',
    summary:
      'Even in high-precision global aviation, what separates a memorable journey from a generic flight is genuine curiosity, respect for culture, and human warmth.',
    reflectionQuestions: [
      'Notice the expressions, small gestures, and turning point—what changed when curiosity replaced routine?',
      'Why did British Airways anchor this film around emotion and human care instead of aircraft specs or fares?',
      'Action Prompt: Connect this film to "See Beyond. Think Beyond."—how can empathy set your career apart?',
    ],
    employabilityTakeaway:
      'Technical competence opens doors; emotional intelligence and cultural empathy build lifelong influence.',
  },
];

export interface AcademyCategory {
  id:
    | 'picture-connect'
    | 'shopping-negotiation'
    | 'indianism'
    | 'interview-skills'
    | 'gd-skills'
    | 'aptitude-grammar'
    | 'coding-dsa'
    | 'data-cloud'
    | 'and-more';
  number: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string;
  image: string;
  imageAlt: string;
  targetView: 'levels' | 'shopping' | 'career' | 'universe' | 'advanced' | 'final';
  careerTab?: 'indianism' | 'interview' | 'gd';
  masterPillar?: MasterPillarId;
}

export const WORKSHOP_META = {
  title: 'EMPLOYABILITY UNIVERSE With Kapil',
  shortTitle: 'EMPLOYABILITY UNIVERSE',
  subtitle:
    'Picture Connect · Communication · Aptitude & Grammar · C, C++, Java & DSA · Excel, Power BI, DBMS & Cloud',
  institution: 'One-Stop Placement & Career Mastery Portal',
  positioning: 'See Beyond. Think Beyond. Code, Analyze & Lead Beyond.',
  poweredBy: 'Powered By Kapil',
  pillars: [
    'Picture Connect',
    'Shopping & Negotiation',
    'Indianism, Interview & GD',
    'Aptitude & English Grammar',
    'C, C++, Java & DSA',
    'Excel, Power BI, DBMS & Cloud',
  ],
  corePhilosophy:
    'True placement readiness unites visual clarity, global communication, sharp aptitude & grammar, clean algorithmic code, and modern data-cloud execution.',
  learnerPromise:
    'Your one-stop mastery portal — train across communication, negotiation, interviews, group discussions, aptitude, grammar, C/C++/Java/DSA, Excel, Power BI, DBMS, and Cloud Computing with verified badges and certificates.',
};

export const ACADEMY_CATEGORIES: AcademyCategory[] = [
  {
    id: 'picture-connect',
    number: '01.',
    title: 'Picture Connect',
    subtitle: 'Visual Intelligence · Levels 1–10 & AI Studio',
    description:
      '10 progressive visual thinking levels, 18 Spinning Wheel speaking prompts, and the 25-brief AI Prompt-to-Presentation Advanced Track.',
    highlights: 'Levels 1–10 · Spin Wheel · AI Track',
    image: PHOTO_ASSETS.crossroads.src,
    imageAlt: PHOTO_ASSETS.crossroads.alt,
    targetView: 'levels',
  },
  {
    id: 'shopping-negotiation',
    number: '02.',
    title: 'Shopping & Negotiation Skills',
    subtitle: 'Konfi-07 Deduction · Persuasion · Deal Lab',
    description:
      'Solve 42 deductive shopping riddles, master 6 negotiation case frameworks, take 20 hint-assisted MCQs, and score your deal script in the Role-Play Lab.',
    highlights: '42 Riddles · 20 MCQs · Role-Play Lab',
    image: shoppingStudioHero,
    imageAlt:
      'Two business professionals discussing a structured negotiation deal and value breakdown across a modern conference table',
    targetView: 'shopping',
  },
  {
    id: 'indianism',
    number: '03.',
    title: 'Indianism & Global English',
    subtitle: 'Workplace Clarity · 12 Playbooks · 15 MCQs',
    description:
      'Replace common Indian English habits ("revert back", "do the needful", "prepone", "pass out") with crisp, natural international business English.',
    highlights: '12 Playbooks · 15 Hinted MCQs · Badge',
    image: indianismHero,
    imageAlt:
      'Modern corporate desk with business communication notebook, fountain pen, laptop, and glass wall overlooking a global skyline',
    targetView: 'career',
    careerTab: 'indianism',
  },
  {
    id: 'interview-skills',
    number: '04.',
    title: 'Interview Skills',
    subtitle: 'STAR Method · Salary · Executive Presence',
    description:
      'Master Tell Me About Yourself, behavioral STAR storytelling, weakness framing, salary negotiation, and high-impact closing questions with a 15-MCQ test.',
    highlights: '8 Frameworks · 15 Hinted MCQs · Badge',
    image: interviewHero,
    imageAlt:
      'Confident young candidate presenting calmly to a corporate hiring panel inside a sunlit glass-walled interview room',
    targetView: 'career',
    careerTab: 'interview',
  },
  {
    id: 'gd-skills',
    number: '05.',
    title: 'GD Skills (Group Discussion)',
    subtitle: 'PESTLE Framing · Consensus · Moderation',
    description:
      'Learn how to open a GD with structure, handle dominant speakers gracefully, pivot off-track debates using PREP/PESTLE, and summarize neutrally.',
    highlights: '8 Playbooks · 15 Hinted MCQs · Badge',
    image: gdHero,
    imageAlt:
      'Six young professionals engaged in a structured corporate group discussion around a walnut conference table',
    targetView: 'career',
    careerTab: 'gd',
  },
  {
    id: 'aptitude-grammar',
    number: '06.',
    title: 'Aptitude & English Grammar',
    subtitle: 'Quant · Grammar · Parts of Speech · Syntax',
    description:
      'Ace campus placement tests across Quantitative Aptitude, Core English Grammar, Parts of Speech, and Parts of Grammar (Clauses, Phrases & Syntax).',
    highlights: '4 Tracks · 24 Playbooks · 40 MCQs',
    image: MASTER_UNIVERSE_IMAGES.aptitudeGrammar,
    imageAlt:
      'Editorial study desk with quantitative aptitude notebooks, grammar reference handbook, fountain pen, and precision calculator',
    targetView: 'universe',
    masterPillar: 'aptitude_grammar',
  },
  {
    id: 'coding-dsa',
    number: '07.',
    title: 'C, C++, Java & DSA',
    subtitle: 'Pointers · OOP · JVM · Trees, Graphs & DP',
    description:
      'Build rock-solid software engineering mastery in C, C++ STL, Java Collections & Concurrency, and Data Structures & Algorithms with 40 hinted MCQs.',
    highlights: '4 Languages/DSA · 24 Playbooks · 40 MCQs',
    image: MASTER_UNIVERSE_IMAGES.programmingDsa,
    imageAlt:
      'Modern developer desk displaying clean algorithmic code and binary tree diagrams in a sleek navy software engineering studio',
    targetView: 'universe',
    masterPillar: 'coding_dsa',
  },
  {
    id: 'data-cloud',
    number: '08.',
    title: 'Excel, Power BI, DBMS & Cloud',
    subtitle: 'XLOOKUP · DAX · SQL & ACID · AWS/Azure/GCP',
    description:
      'Master corporate analytics and infrastructure: Excel formulas & PivotTables, Power BI star schemas & DAX, DBMS normalization & SQL, and Cloud architecture.',
    highlights: '4 Tech Tracks · 24 Playbooks · 40 MCQs',
    image: MASTER_UNIVERSE_IMAGES.excelPowerBi,
    imageAlt:
      'Business intelligence workstation showing clean executive KPI dashboards, financial charts, and cloud database diagrams',
    targetView: 'universe',
    masterPillar: 'data_cloud',
  },
  {
    id: 'and-more',
    number: '09.',
    title: 'Capstone, Video Films & LOR',
    subtitle: 'Video Case Studies · 1000 XP Exam · LOR PDF',
    description:
      'Analyze Customer Delight video case films, pass the 90-minute 1000 XP Final Capstone, and download PNG Certificates & Placement LOR PDFs.',
    highlights: '2 Video Films · 1000 XP Final · LOR PDF',
    image: LANDING_SHOWCASE_IMAGES.capstoneArena.src,
    imageAlt: LANDING_SHOWCASE_IMAGES.capstoneArena.alt,
    targetView: 'final',
  },
];

export function getLearnerRank(xp: number): {
  title: string;
  nextTitle: string | null;
  minXp: number;
  nextXp: number | null;
} {
  if (xp >= 1500) {
    return {
      title: 'Visionary Strategist',
      nextTitle: null,
      minXp: 1500,
      nextXp: null,
    };
  }
  if (xp >= 1000) {
    return {
      title: 'Executive Communicator',
      nextTitle: 'Visionary Strategist',
      minXp: 1000,
      nextXp: 1500,
    };
  }
  if (xp >= 550) {
    return {
      title: 'Pattern Architect',
      nextTitle: 'Executive Communicator',
      minXp: 550,
      nextXp: 1000,
    };
  }
  if (xp >= 200) {
    return {
      title: 'Sharp Observer',
      nextTitle: 'Pattern Architect',
      minXp: 200,
      nextXp: 550,
    };
  }
  return {
    title: 'Visual Explorer',
    nextTitle: 'Sharp Observer',
    minXp: 0,
    nextXp: 200,
  };
}

export const CENTRAL_CONCEPT_PAIRS: ConceptPair[] = [
  {
    id: 'bridge-trust',
    pictureTitle: 'A Bridge',
    artwork: 'bridge',
    abstractConcept: 'Trust',
    explanation:
      'A bridge carries heavy weight across an uncertain gap only when both sides are anchored firmly—just like trust in professional relationships.',
    reflectionPrompt: 'What breaks a bridge, and how do you rebuild trust once cracked?',
  },
  {
    id: 'pencil-failure',
    pictureTitle: 'A Broken Pencil',
    artwork: 'broken_pencil',
    photoKey: 'broken_pencil',
    abstractConcept: 'Failure',
    explanation:
      'A pencil snaps under pressure, yet sharpening it gives it a fresh, finer point. Failure does not end utility—it reshapes focus.',
    reflectionPrompt: 'When did a setback sharpen your clarity?',
  },
  {
    id: 'signal-career',
    pictureTitle: 'A Traffic Signal',
    artwork: 'traffic_signal',
    abstractConcept: 'Career',
    explanation:
      'Careers are not endless green lights. Red signals force reflection, amber signals demand preparation, and green rewards readiness.',
    reflectionPrompt: 'Which light are you standing at in your career journey today?',
  },
  {
    id: 'mirror-awareness',
    pictureTitle: 'A Mirror',
    artwork: 'mirror',
    abstractConcept: 'Self-awareness',
    explanation:
      'A mirror shows reality without flattery. Growth begins when you inspect yourself honestly before asking others to trust your image.',
    reflectionPrompt: 'What does your reflection reveal that your resume hides?',
  },
  {
    id: 'ladder-ambition',
    pictureTitle: 'A Ladder',
    artwork: 'ladder',
    abstractConcept: 'Ambition',
    explanation:
      'Climbing higher requires steady rungs below you and a stable wall to lean against. Ambition without grounding collapses.',
    reflectionPrompt: 'Which wall is your ladder leaning against right now?',
  },
  {
    id: 'tree-leadership',
    pictureTitle: 'A Tree',
    artwork: 'tree',
    abstractConcept: 'Leadership',
    explanation:
      'Deep unseen roots sustain wide visible shade. True leaders weather storms quietly while creating room for others to grow beneath them.',
    reflectionPrompt: 'Do people remember your leaves, or the shelter you provide?',
  },
];

export const LEVELS: LevelDefinition[] = [
  {
    level: 1,
    title: 'One Picture, 50 Perspectives',
    subtitle: 'Divergent Interpretation',
    skillTag: 'Perspective Agility',
    xpReward: 100,
    durationLabel: '3 min focus',
    timerSeconds: 180,
    learningOutcome: 'There can be multiple valid perspectives to the exact same situation.',
    instructions: [
      'Inspect the crossroads scene carefully—notice light, pathways, posture, and contrast.',
      'Write a sharp, original interpretation of what this moment represents in career or life.',
      'Publish your perspective to the live Learner Wall and complete Level 1 to claim +100 XP.',
    ],
  },
  {
    level: 2,
    title: 'The Impossible Connection',
    subtitle: '45-Second Lateral Bridge',
    skillTag: 'Lateral Synthesis',
    xpReward: 120,
    durationLabel: '45 sec sprint',
    timerSeconds: 45,
    learningOutcome: 'Rapid lateral thinking and structured, logical justification under time pressure.',
    instructions: [
      'Study two seemingly unrelated objects side by side (e.g., Apple + Rocket).',
      'Start the 45-second sprint timer and draft a connection that is both creative and logical.',
      'Save your connection pitch to unlock Level 2 mastery and +120 XP.',
    ],
    highlightRule: 'Make the connection creative, memorable, and logically defensible.',
  },
  {
    level: 3,
    title: 'Five-Picture Story Architect',
    subtitle: 'Sequential Narrative Craft',
    skillTag: 'Structured Storytelling',
    xpReward: 130,
    durationLabel: '4 min build',
    timerSeconds: 240,
    learningOutcome: 'Structuring spontaneous ideas into a cohesive narrative arc with clear tension and resolution.',
    instructions: [
      'Review the 5 visual story cards in sequence from Scene 1 to Scene 5.',
      'Write one concise story beat for each card: Beginning, Rising Conflict, Turning Point, Resolution, and Impact.',
      'Crown your 5-part narrative with a memorable story title and claim +130 XP.',
    ],
    highlightRule: 'Your narrative must contain a clear beginning, conflict, solution, and conclusion.',
  },
  {
    level: 4,
    title: 'What Is Missing?',
    subtitle: '15-Second Visual Flash',
    skillTag: 'Observation & Inference',
    xpReward: 130,
    durationLabel: '15 sec flash',
    timerSeconds: 15,
    learningOutcome: 'Sharp observation, active recall, attention to detail, and logical inference.',
    instructions: [
      'Run the 15-second visual flash of the Executive Desk photograph, then watch it hide automatically.',
      'Record every object you noticed, spot what essential item is missing (e.g., laptop charger), and infer what happened right before.',
      'Submit your memory audit to unlock +130 XP.',
    ],
  },
  {
    level: 5,
    title: 'Picture to Profession + CEO Mindset',
    subtitle: 'Career Lens & Executive Pivot',
    skillTag: 'Executive Thinking',
    xpReward: 140,
    durationLabel: '2 min challenge',
    timerSeconds: 120,
    learningOutcome: 'Career awareness and translating everyday metaphors into strategic executive decisions.',
    instructions: [
      'Pick an everyday object card and connect it beyond its obvious profession.',
      'Accept the CEO Challenge: "What if you were the CEO? How would you apply this object to solve a real business bottleneck?"',
      'Save your CEO turnaround insight to earn +140 XP.',
    ],
  },
  {
    level: 6,
    title: 'Workplace Detective',
    subtitle: 'Find the Hidden Violations',
    skillTag: 'Workplace Readiness',
    xpReward: 150,
    durationLabel: '3 min audit',
    timerSeconds: 180,
    learningOutcome: 'Critical observation, safety vigilance, security hygiene, and professional standards.',
    instructions: [
      'Inspect the modern corporate office photograph containing 10 deliberate workplace issues.',
      'Click directly on hazards across safety, security, communication, time management, and etiquette.',
      'Discover at least 6 violations in the photo (or all 10 for perfection) and lock in +150 XP.',
    ],
  },
  {
    level: 7,
    title: 'Sell Me This Picture!',
    subtitle: 'Brand & 30-Second Pitch Studio',
    skillTag: 'Persuasive Branding',
    xpReward: 150,
    durationLabel: '30 sec pitch',
    timerSeconds: 30,
    learningOutcome: 'Marketing positioning, value framing, persuasion, and executive presence.',
    instructions: [
      'Transform an ordinary object like a minimalist titanium paperclip into a luxury flagship brand.',
      'Define your Product Name, Tagline, Target Audience, 3 Unique Selling Points, and a crisp 30-second pitch.',
      'Save your brand blueprint to earn +150 XP.',
    ],
  },
  {
    level: 8,
    title: 'Emotion Behind the Picture',
    subtitle: 'Empathy & Deepening Reasoning',
    skillTag: 'Emotional Intelligence',
    xpReward: 160,
    durationLabel: '2 min reflection',
    timerSeconds: 120,
    learningOutcome: 'Empathy, active perspective-taking, and thoughtful interpersonal communication.',
    instructions: [
      'Observe the rain-window portrait—notice posture, gaze, reflection, and quiet atmosphere.',
      'Articulate the possible emotion, context, the person’s inner perspective, and what supportive words you would offer.',
      'Explain the visual cues behind your reasoning to earn +160 XP.',
    ],
    highlightRule: 'Multiple interpretations are valid—justify your insight with reasoning rather than assumptions.',
  },
  {
    level: 9,
    title: 'Corporate Boardroom Turnaround',
    subtitle: '40% Sales Decline Analysis',
    skillTag: 'Business Strategy',
    xpReward: 180,
    durationLabel: '2 min boardroom brief',
    timerSeconds: 120,
    learningOutcome: 'Structured business communication, multi-factor root-cause analysis, and decisive strategy.',
    instructions: [
      'Inspect the dusk corporate boardroom scene showing a sudden 40% sales decline against a rising competitor line.',
      'Tap all 5 strategic clue hotspots (Customers, Employees, Product Quality, Marketing, Competition).',
      'Draft your 2-minute executive turnaround proposal and claim +180 XP.',
    ],
  },
  {
    level: 10,
    title: 'Six Pictures, One Vision',
    subtitle: 'Grand Capstone Synthesis',
    skillTag: 'Visionary Mastery',
    xpReward: 250,
    durationLabel: '5 min capstone',
    timerSeconds: 300,
    learningOutcome: 'Synthesising disparate ideas into one unforgettable leadership narrative.',
    instructions: [
      'Unite all 6 unrelated cards—Notebook, Bridge, Broken Pencil, Compass, Mountain Peak, Boardroom Chart—under one overarching vision.',
      'Craft an inspiring Capstone Theme Title and a structured 3-part keynote outline.',
      'Submit Level 10 Capstone to earn +250 XP and unlock your Official Mastery Certificate Powered By Kapil!',
    ],
  },
];

export const BADGES: BadgeDefinition[] = [
  {
    id: 'badge_first_spark',
    title: 'First Spark',
    description: 'Completed your opening visual perception mission.',
    criteriaLabel: 'Complete Level 1',
    accent: 'blue',
    checkUnlocked: ({ completedLevels }) => completedLevels.includes(1),
  },
  {
    id: 'badge_lateral_weaver',
    title: 'Lateral Weaver',
    description: 'Connected unrelated visuals with speed and logic.',
    criteriaLabel: 'Complete Levels 2 & 3',
    accent: 'violet',
    checkUnlocked: ({ completedLevels }) =>
      completedLevels.includes(2) && completedLevels.includes(3),
  },
  {
    id: 'badge_eagle_eye',
    title: 'Eagle-Eye Auditor',
    description: 'Aced flash visual recall and uncovered workplace risks.',
    criteriaLabel: 'Complete Levels 4 & 6',
    accent: 'emerald',
    checkUnlocked: ({ completedLevels }) =>
      completedLevels.includes(4) && completedLevels.includes(6),
  },
  {
    id: 'badge_brand_alchemist',
    title: 'Brand Alchemist',
    description: 'Turned everyday objects into high-value CEO & brand pitches.',
    criteriaLabel: 'Complete Levels 5 & 7',
    accent: 'amber',
    checkUnlocked: ({ completedLevels }) =>
      completedLevels.includes(5) && completedLevels.includes(7),
  },
  {
    id: 'badge_empathy_compass',
    title: 'Empathy Compass',
    description: 'Decoded human emotion and led a boardroom turnaround.',
    criteriaLabel: 'Complete Levels 8 & 9',
    accent: 'rose',
    checkUnlocked: ({ completedLevels }) =>
      completedLevels.includes(8) && completedLevels.includes(9),
  },
  {
    id: 'badge_wheel_challenger',
    title: 'Wheel Challenger',
    description: 'Tested spontaneous agility on the Spinning Wheel Studio.',
    criteriaLabel: 'Complete 3 Spinning Wheel exercises',
    accent: 'cyan',
    checkUnlocked: ({ completedWheelPrompts }) => completedWheelPrompts.length >= 3,
  },
  {
    id: 'badge_1000_club',
    title: '1,000 XP Club',
    description: 'Crossed 1,000 total XP through consistent visual mastery.',
    criteriaLabel: 'Reach 1,000+ XP',
    accent: 'amber',
    checkUnlocked: ({ xp }) => xp >= 1000,
  },
  {
    id: 'badge_grand_visionary',
    title: 'Kapil Visionary Scholar',
    description: 'Conquered every single stage from Level 1 to Level 10.',
    criteriaLabel: 'Complete all 10 Levels',
    accent: 'blue',
    checkUnlocked: ({ completedLevels }) =>
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].every((lvl) => completedLevels.includes(lvl)),
  },
];

export const ACTIVITY_1_DEFAULT_INTERPRETATIONS = [
  'Choosing a career path with conviction.',
  'Making a difficult decision under uncertainty.',
  'Leaving the comfort zone to grow.',
  'Taking personal ownership of direction.',
  'Turning confusion into structured clarity.',
];

export const IMPOSSIBLE_PAIRS: ImpossiblePair[] = [
  {
    id: 'apple-rocket',
    leftTitle: 'Apple',
    leftArtwork: 'apple',
    rightTitle: 'Rocket',
    rightArtwork: 'rocket',
    photoKey: 'apple_rocket',
    possibleConnection: 'Innovation',
    reasoningHint:
      'From Newton’s falling apple to space-age propulsion—curiosity about everyday physics fuels breakthroughs that launch humanity forward.',
  },
  {
    id: 'hourglass-exam',
    leftTitle: 'Hourglass',
    leftArtwork: 'hourglass',
    rightTitle: 'Exam',
    rightArtwork: 'exam',
    possibleConnection: 'Time management',
    reasoningHint:
      'Every grain of sand represents finite minutes—calm pacing under pressure matters just as much as raw preparation.',
  },
  {
    id: 'mirror-interview',
    leftTitle: 'Mirror',
    leftArtwork: 'mirror',
    rightTitle: 'Interview',
    rightArtwork: 'interview',
    possibleConnection: 'Self-awareness',
    reasoningHint:
      'Before an interviewer evaluates your strengths and blind spots, honest self-reflection sets authentic confidence.',
  },
  {
    id: 'umbrella-leadership',
    leftTitle: 'Umbrella',
    leftArtwork: 'umbrella',
    rightTitle: 'Tree (Leadership)',
    rightArtwork: 'tree',
    possibleConnection: 'Protection',
    reasoningHint:
      'An umbrella shields people from sudden storms without asking for credit—mirroring how resilient leaders absorb pressure.',
  },
  {
    id: 'camera-business',
    leftTitle: 'Camera',
    leftArtwork: 'camera',
    rightTitle: 'Business',
    rightArtwork: 'business',
    possibleConnection: 'Observation',
    reasoningHint:
      'Just as a photographer adjusts aperture and focus to catch subtle light, sharp businesses notice customer friction before rivals do.',
  },
  {
    id: 'puzzle-teamwork',
    leftTitle: 'Puzzle',
    leftArtwork: 'puzzle',
    rightTitle: 'Teamwork',
    rightArtwork: 'teamwork',
    possibleConnection: 'Collaboration',
    reasoningHint:
      'Identical pieces cannot lock together; initiatives thrive precisely because complementary strengths interlock into one whole picture.',
  },
];

export const STORY_ARCHITECT_CARDS: {
  step: number;
  beatLabel: string;
  id: string;
  title: string;
  artwork: ArtworkId;
  photoKey?: PhotoAssetKey;
}[] = [
  { step: 1, beatLabel: 'Beginning', id: 's1', title: 'The Crossroads', artwork: 'crossroads', photoKey: 'crossroads' },
  { step: 2, beatLabel: 'Conflict', id: 's2', title: 'A Broken Pencil', artwork: 'broken_pencil', photoKey: 'broken_pencil' },
  { step: 3, beatLabel: 'Turning Point', id: 's3', title: 'The Compass', artwork: 'compass' },
  { step: 4, beatLabel: 'Solution', id: 's4', title: 'The Titanium Clip', artwork: 'paperclip', photoKey: 'paperclip' },
  { step: 5, beatLabel: 'Conclusion', id: 's5', title: 'Launch to Orbit', artwork: 'rocket', photoKey: 'rocket' },
];

export const MEMORY_OBJECTS_STANDARD: MemoryObject[] = [
  { id: 'm1', label: 'Leather Analog Wristwatch (hands near 10:10)' },
  { id: 'm2', label: 'White Espresso Cup on Saucer with Metal Spoon' },
  { id: 'm3', label: 'Open Leather-bound Notebook with Sketches & Black Fountain Pen' },
  { id: 'm4', label: 'Tortoiseshell Reading Glasses on Right Side' },
  { id: 'm5', label: 'Vintage Brass Pocket Compass in Lower Right' },
  { id: 'm6', label: 'Closed Silver Laptop (Missing Power Charger)', isMissingHint: true },
];

export const MEMORY_OBJECTS_HARD: MemoryObject[] = [
  ...MEMORY_OBJECTS_STANDARD,
  { id: 'm7', label: 'Small Terracotta Potted Succulent', hardOnly: true },
  { id: 'm8', label: 'Stainless Espresso Spoon Beside Ceramic Saucer', hardOnly: true },
  { id: 'm9', label: 'No Smartphone Visible Anywhere on Desk', hardOnly: true, isMissingHint: true },
  { id: 'm10', label: 'No Water Bottle Beside Workspace', hardOnly: true, isMissingHint: true },
];

export const PROFESSION_CARDS: ProfessionCard[] = [
  {
    id: 'prof-stethoscope',
    objectName: 'Stethoscope',
    artwork: 'stethoscope',
    profession: 'Doctor',
    ceoPrompt:
      'What if you were the CEO? How would you use a stethoscope to solve a business problem?',
    exampleCeoIdea:
      'Run weekly organisational pulse checks by listening directly to frontline customer support conversations before churn spikes.',
  },
  {
    id: 'prof-compass',
    objectName: 'Compass',
    artwork: 'compass',
    profession: 'Project Manager',
    ceoPrompt:
      'What if you were the CEO? How would you use a compass to solve a business problem?',
    exampleCeoIdea:
      'Establish one unambiguous True North metric across every division so priorities never drift during market shifts.',
  },
  {
    id: 'prof-calculator',
    objectName: 'Calculator',
    artwork: 'calculator',
    profession: 'Financial Analyst',
    ceoPrompt:
      'What if you were the CEO? How would you use a calculator to solve a business problem?',
    exampleCeoIdea:
      'Audit unit economics across every product tier and cut silent operational bottlenecks draining quarterly margins.',
  },
  {
    id: 'prof-bridge',
    objectName: 'Bridge',
    artwork: 'bridge',
    profession: 'Civil Engineer',
    ceoPrompt:
      'What if you were the CEO? How would you use a bridge to solve a business problem?',
    exampleCeoIdea:
      'Create a structured mentorship bridge pairing senior engineers with recent graduates to halve onboarding ramp-up time.',
  },
  {
    id: 'prof-keyboard',
    objectName: 'Keyboard',
    artwork: 'keyboard',
    profession: 'Software Developer',
    ceoPrompt:
      'What if you were the CEO? How would you use a keyboard to solve a business problem?',
    exampleCeoIdea:
      'Standardise asynchronous decision memos and keyboard-first documentation so distributed teams ship faster without endless meetings.',
  },
  {
    id: 'prof-camera',
    objectName: 'Camera',
    artwork: 'camera',
    profession: 'Digital Marketer',
    ceoPrompt:
      'What if you were the CEO? How would you use a camera to solve a business problem?',
    exampleCeoIdea:
      'Shift brand storytelling away from generic corporate slogans toward authentic, unscripted customer journeys.',
  },
];

export const WORKPLACE_MISTAKES: WorkplaceMistake[] = [
  {
    id: 'wm-1',
    number: 1,
    category: 'Workplace safety violations',
    title: 'Uncovered Coffee Cup Next to Keyboard & Electronics',
    detail: 'An open coffee cup sits millimeters away from active monitors and power cables along the front desk edge.',
    xPercent: 27,
    yPercent: 58,
  },
  {
    id: 'wm-2',
    number: 2,
    category: 'Workplace safety violations',
    title: 'Blocked Emergency Exit Door',
    detail: 'Stacked cardboard archive boxes completely obstruct direct egress to the illuminated green Emergency Exit door.',
    xPercent: 80,
    yPercent: 62,
  },
  {
    id: 'wm-3',
    number: 3,
    category: 'Workplace safety violations',
    title: 'Tangled Floor Power Strip, Loose Mug & Trip Hazard',
    detail: 'An overloaded white multi-plug power strip and loose ceramic mug sit in tangled wires on the carpet beneath the desk.',
    xPercent: 28,
    yPercent: 88,
  },
  {
    id: 'wm-4',
    number: 4,
    category: 'Security risks',
    title: 'Unattended Glowing Workstation Terminal',
    detail: 'An unlocked background terminal remains powered on at the left edge with zero operator present.',
    xPercent: 6,
    yPercent: 45,
  },
  {
    id: 'wm-5',
    number: 5,
    category: 'Security risks',
    title: 'Open Archive Filing Cabinet Drawer in Walkway',
    detail: 'The bottom metal drawer of the ARCHIVES / Q4 cabinet hangs wide open into the aisle with exposed client folders.',
    xPercent: 55,
    yPercent: 71,
  },
  {
    id: 'wm-6',
    number: 6,
    category: 'Security risks',
    title: 'Unsecured Loose Folders Above Cabinet',
    detail: 'Unbound confidential paperwork and binders are stacked openly atop the archive cabinet in a shared corridor.',
    xPercent: 65,
    yPercent: 38,
  },
  {
    id: 'wm-7',
    number: 7,
    category: 'Communication failures',
    title: 'Overcrowded Q4 Strategy Whiteboard',
    detail: 'The whiteboard overflows with crisscrossing arrows, Project Omega notes, and conflicting deadlines lacking a clear owner.',
    xPercent: 24,
    yPercent: 33,
  },
  {
    id: 'wm-8',
    number: 8,
    category: 'Communication failures',
    title: 'Disruptive Corridor Standing Conversation',
    detail: 'Team members hold ad-hoc status discussions in the open walkway instead of stepping into a quiet focus zone.',
    xPercent: 48,
    yPercent: 40,
  },
  {
    id: 'wm-9',
    number: 9,
    category: 'Time management problems',
    title: 'Unbundled Desk Cable Sprawl',
    detail: 'Loose charging wires cascade down the aisle corner of the workstation, creating snag risk and workspace friction.',
    xPercent: 34,
    yPercent: 55,
  },
  {
    id: 'wm-10',
    number: 10,
    category: 'Professional etiquette issues',
    title: 'Open Backpack Left on Walkway Floor',
    detail: 'An unzipped personal backpack sits along the floor beside the desk edge, crowding the passage lane.',
    xPercent: 36,
    yPercent: 80,
  },
];

export const SELL_OBJECTS: {
  id: string;
  objectName: string;
  artwork: ArtworkId;
  photoKey?: PhotoAssetKey;
  sampleName: string;
  sampleTagline: string;
  sampleAudience: string;
  sampleUsps: [string, string, string];
  samplePitch: string;
}[] = [
  {
    id: 'sell-paperclip',
    objectName: 'A Paper Clip',
    artwork: 'paperclip',
    photoKey: 'paperclip',
    sampleName: 'ConnectPro',
    sampleTagline: 'The smallest collaboration technology in the world!',
    sampleAudience: 'High-velocity executives, architects, and hybrid product teams',
    sampleUsps: [
      'Zero-battery, instant physical alignment of critical ideas',
      'Aerospace-grade anodized spring steel engineered for 1,000+ reuses',
      'Ultra-portable micro-footprint that fits cleanly in any pocket',
    ],
    samplePitch:
      'Introducing ConnectPro — the smallest collaboration technology in the world! While apps crash and batteries die, ConnectPro unites scattered ideas in 0.2 seconds with zero Wi-Fi required.',
  },
  {
    id: 'sell-pencil',
    objectName: 'A Broken Pencil',
    artwork: 'broken_pencil',
    photoKey: 'broken_pencil',
    sampleName: 'DuoDraft',
    sampleTagline: 'Two minds, one shared blueprint.',
    sampleAudience: 'Design studios, engineering learners, and startup founders',
    sampleUsps: [
      'Precision-split form factor for rapid analog ideation',
      'Zero digital notifications for uninterrupted deep thinking',
      'Sustainable cedar craftsmanship engineered to be resharpened endlessly',
    ],
    samplePitch:
      'Meet DuoDraft — built for minds who refuse to pause when pressure snaps the ordinary. Sharpen once, sketch twice as fast.',
  },
  {
    id: 'sell-umbrella',
    objectName: 'An Umbrella',
    artwork: 'umbrella',
    sampleName: 'AeroShield',
    sampleTagline: 'Portable certainty for unpredictable days.',
    sampleAudience: 'Urban commuters and global field leaders',
    sampleUsps: [
      'Instant one-touch canopy deployment in sudden storms',
      'Wind-vented rib architecture built to resist inversion',
      'Minimalist matte silhouette suited for boardroom arrivals',
    ],
    samplePitch:
      'You cannot negotiate with sudden storms, yet with AeroShield you carry personal certainty in a single click.',
  },
];

export const BOARDROOM_CLUES: BoardroomClue[] = [
  {
    id: 'bc-customers',
    dimension: 'Customers',
    headline: 'Stacked Q4 Audit Report Client Dossiers',
    visualEvidence:
      'Thick Q4 Audit Report binders stacked unread on the foreground left of the walnut boardroom table signal urgent account friction.',
    strategicQuestion: 'How do we win back lost customer trust in the next 30 days?',
    xPercent: 32,
    yPercent: 82,
  },
  {
    id: 'bc-employees',
    dimension: 'Employees',
    headline: 'Sparse Leadership Attendance & Empty Chairs',
    visualEvidence:
      'Mostly empty black leather executive chairs line both sides of the room while the quarterly performance review flashes.',
    strategicQuestion: 'How do we re-ignite ownership and accountability across departments?',
    xPercent: 41,
    yPercent: 48,
  },
  {
    id: 'bc-quality',
    dimension: 'Product quality',
    headline: 'Handwritten Audit Notebook & Review Tablet',
    visualEvidence:
      'Open ruled field notes beside an executive pen and review tablet highlight product defects needing immediate root-cause sign-off.',
    strategicQuestion: 'What strict quality gate stops defects before customers ever see them?',
    xPercent: 56,
    yPercent: 84,
  },
  {
    id: 'bc-marketing',
    dimension: 'Marketing',
    headline: 'Sharp 40% Red Downward Sales Trajectory',
    visualEvidence:
      'The central Q4 Performance Review screen displays a steep 40% red sales decline spanning Oct through Jan.',
    strategicQuestion: 'How must we reposition our value proposition to reverse pipeline decline?',
    xPercent: 48,
    yPercent: 36,
  },
  {
    id: 'bc-competition',
    dimension: 'Competition',
    headline: 'Rising Blue Competitor B Growth Curve',
    visualEvidence:
      'Competitor B’s electric-blue growth trajectory slices decisively upward across our declining trend on the screen.',
    strategicQuestion: 'Where can we differentiate boldly instead of competing on price alone?',
    xPercent: 58,
    yPercent: 33,
  },
];

export const FINALE_SIX_PICTURES: {
  id: string;
  title: string;
  artwork: ArtworkId;
  photoKey?: PhotoAssetKey;
}[] = [
  { id: 'f1', title: 'Executive Desk', artwork: 'notebook', photoKey: 'memory_scene' },
  { id: 'f2', title: 'The Crossroads', artwork: 'crossroads', photoKey: 'crossroads' },
  { id: 'f3', title: 'Broken Pencil', artwork: 'broken_pencil', photoKey: 'broken_pencil' },
  { id: 'f4', title: 'Titanium Clip', artwork: 'paperclip', photoKey: 'paperclip' },
  { id: 'f5', title: 'Human Perspective', artwork: 'emotion_scene', photoKey: 'emotion_scene' },
  { id: 'f6', title: 'Boardroom Vision', artwork: 'boardroom_decline', photoKey: 'boardroom_decline' },
];

export const SURPRISE_CHALLENGES: SurpriseChallenge[] = [
  {
    id: 'sc-stop',
    number: 1,
    title: 'STOP',
    artwork: 'challenge_stop',
    question: 'When should you stop in your career?',
    deepeningPrompt:
      'Is stopping a sign of quitting, or strategic wisdom when values, growth, or health are compromised?',
    employabilityLens: 'Boundaries, self-respect, and intentional pivots',
  },
  {
    id: 'sc-growth',
    number: 2,
    title: 'GROWTH',
    artwork: 'challenge_growth',
    question: 'How do you grow despite challenges?',
    deepeningPrompt:
      'Concrete cracks before green shoots break through—what pressure recently forced your strongest skill to emerge?',
    employabilityLens: 'Resilience, adaptability, and grit under ambiguity',
  },
  {
    id: 'sc-iceberg',
    number: 3,
    title: 'ICEBERG',
    artwork: 'challenge_iceberg',
    question: 'What do people see versus what they don’t see about your skills?',
    deepeningPrompt:
      'Recruiters see the 10% tip (grades, certificates), yet hire for the 90% below the waterline (habits, persistence, integrity).',
    employabilityLens: 'Depth of character, preparation, and invisible effort',
  },
  {
    id: 'sc-ripple',
    number: 4,
    title: 'RIPPLE EFFECT',
    artwork: 'challenge_ripple',
    question: 'How can one small decision change your future?',
    deepeningPrompt:
      'Speaking up once, asking one thoughtful question, or mentoring one peer creates waves years later.',
    employabilityLens: 'Compound habits and everyday initiative',
  },
  {
    id: 'sc-choices',
    number: 5,
    title: 'CHOICES',
    artwork: 'challenge_choices',
    question: 'How do your choices shape your career?',
    deepeningPrompt:
      'Between comfort and stretch, short-term ease and long-term craft—which door are you choosing right now?',
    employabilityLens: 'Decision ownership and long-term agency',
  },
  {
    id: 'sc-missing',
    number: 6,
    title: 'THE MISSING PIECE',
    artwork: 'challenge_missing_piece',
    question: 'What is missing from your employability profile?',
    deepeningPrompt:
      'Technical knowledge alone rarely closes the gap—is your missing piece structured communication, curiosity, or follow-through?',
    employabilityLens: 'Honest skill-gap diagnosis and action plan',
  },
];

export const WHEEL_DECKS: WheelDeck[] = [
  {
    id: 'challenges',
    name: 'Surprise Career Challenges',
    subtitle: 'Spin one of the 6 signature Picture Connect employability reflections',
    segments: [
      {
        id: 'wh-stop',
        label: 'STOP',
        shortLabel: 'STOP',
        color: '#2563EB',
        promptTitle: 'Challenge 01 · STOP',
        promptQuestion: 'When should you stop in your career?',
        hint: 'Consider toxic habits, misaligned goals, or sunk-cost projects versus healthy persistence.',
        artwork: 'challenge_stop',
        timerSeconds: 60,
        xpReward: 60,
      },
      {
        id: 'wh-growth',
        label: 'GROWTH',
        shortLabel: 'GROWTH',
        color: '#059669',
        promptTitle: 'Challenge 02 · GROWTH',
        promptQuestion: 'How do you grow despite challenges?',
        hint: 'Identify one constraint that pushed you to become sharper and more resourceful.',
        artwork: 'challenge_growth',
        timerSeconds: 60,
        xpReward: 60,
      },
      {
        id: 'wh-iceberg',
        label: 'ICEBERG',
        shortLabel: 'ICEBERG',
        color: '#0284C7',
        promptTitle: 'Challenge 03 · ICEBERG',
        promptQuestion: 'What do people see vs. not see about your skills?',
        hint: 'Contrast visible credentials above the surface with the unseen daily habits below.',
        artwork: 'challenge_iceberg',
        timerSeconds: 60,
        xpReward: 60,
      },
      {
        id: 'wh-ripple',
        label: 'RIPPLE EFFECT',
        shortLabel: 'RIPPLE',
        color: '#7C3AED',
        promptTitle: 'Challenge 04 · RIPPLE EFFECT',
        promptQuestion: 'How can one small decision change your future?',
        hint: 'Describe one seemingly tiny habit or decision that compounds massively over time.',
        artwork: 'challenge_ripple',
        timerSeconds: 60,
        xpReward: 60,
      },
      {
        id: 'wh-choices',
        label: 'CHOICES',
        shortLabel: 'CHOICES',
        color: '#D97706',
        promptTitle: 'Challenge 05 · CHOICES',
        promptQuestion: 'How do your choices shape your career?',
        hint: 'Connect everyday micro-choices between comfort and mastery to where you want to stand in 3 years.',
        artwork: 'challenge_choices',
        timerSeconds: 60,
        xpReward: 60,
      },
      {
        id: 'wh-missing',
        label: 'MISSING PIECE',
        shortLabel: 'MISSING',
        color: '#DC2626',
        promptTitle: 'Challenge 06 · THE MISSING PIECE',
        promptQuestion: 'What is missing from your employability profile right now?',
        hint: 'Name one honest gap—such as storytelling, confidence, or execution discipline—and your next step.',
        artwork: 'challenge_missing_piece',
        timerSeconds: 60,
        xpReward: 60,
      },
    ],
  },
  {
    id: 'mashup',
    name: 'Picture Mashup Roulette',
    subtitle: '45-second solo sprint connecting two wildly unrelated visual prompts',
    segments: [
      {
        id: 'wh-apple-rocket',
        label: 'Apple + Rocket',
        shortLabel: 'APPLE · ROCKET',
        color: '#1D4ED8',
        promptTitle: 'Apple + Rocket (45s Sprint)',
        promptQuestion: 'Connect an ordinary Apple with a Space Rocket into one sharp leadership lesson.',
        hint: 'Think Newton’s curiosity, gravity, fuel, or starting small before scaling.',
        artwork: 'apple',
        timerSeconds: 45,
        xpReward: 50,
      },
      {
        id: 'wh-pencil-bridge',
        label: 'Broken Pencil + Bridge',
        shortLabel: 'PENCIL · BRIDGE',
        color: '#0F766E',
        promptTitle: 'Broken Pencil + Bridge (45s Sprint)',
        promptQuestion: 'How does a Broken Pencil connect to building a Bridge of Trust?',
        hint: 'Consider tension, repair, sharp clarity, and carrying pressure.',
        artwork: 'broken_pencil',
        timerSeconds: 45,
        xpReward: 50,
      },
      {
        id: 'wh-mirror-interview',
        label: 'Mirror + Interview',
        shortLabel: 'MIRROR · HIRING',
        color: '#6D28D9',
        promptTitle: 'Mirror + Interview (45s Sprint)',
        promptQuestion: 'Why is a Mirror the strongest preparation tool before any job Interview?',
        hint: 'Think self-awareness, body language, authenticity, and blind spots.',
        artwork: 'mirror',
        timerSeconds: 45,
        xpReward: 50,
      },
      {
        id: 'wh-camera-boardroom',
        label: 'Camera + Boardroom',
        shortLabel: 'CAMERA · DATA',
        color: '#B45309',
        promptTitle: 'Camera + Corporate Boardroom (45s Sprint)',
        promptQuestion: 'Connect a Camera lens to fixing a 40% business decline.',
        hint: 'Zoom out for market vision, zoom in on customer friction, or sharpen focus.',
        artwork: 'camera',
        timerSeconds: 45,
        xpReward: 50,
      },
      {
        id: 'wh-hourglass-crossroads',
        label: 'Hourglass + Crossroads',
        shortLabel: 'TIME · PATH',
        color: '#0369A1',
        promptTitle: 'Hourglass + Crossroads (45s Sprint)',
        promptQuestion: 'What happens when time is running out at a major career Crossroads?',
        hint: 'Indecision has a cost; decisive movement creates feedback.',
        artwork: 'hourglass',
        timerSeconds: 45,
        xpReward: 50,
      },
      {
        id: 'wh-umbrella-tree',
        label: 'Umbrella + Tree',
        shortLabel: 'SHIELD · ROOTS',
        color: '#BE123C',
        promptTitle: 'Umbrella + Deep-Rooted Tree (45s Sprint)',
        promptQuestion: 'Compare temporary protection (Umbrella) with long-term mentorship (Tree).',
        hint: 'One gives short-term shelter; the other builds enduring shelter for others.',
        artwork: 'umbrella',
        timerSeconds: 45,
        xpReward: 50,
      },
    ],
  },
  {
    id: 'ceo_pitch',
    name: 'CEO & Product Pitch Wheel',
    subtitle: 'Spin an everyday object and pitch a premium brand or CEO strategy in 30–60s',
    segments: [
      {
        id: 'wh-clip',
        label: 'Titanium Paperclip',
        shortLabel: 'PAPERCLIP',
        color: '#1E40AF',
        promptTitle: 'Brand Pitch · Titanium Paperclip',
        promptQuestion: 'Pitch this ordinary paperclip as a ₹9,999 executive productivity flagship in 30 seconds.',
        hint: 'Give it a name, tagline, and 1 unbeatable problem it solves.',
        artwork: 'paperclip',
        timerSeconds: 30,
        xpReward: 55,
      },
      {
        id: 'wh-compass-ceo',
        label: 'Brass Compass',
        shortLabel: 'COMPASS',
        color: '#047857',
        promptTitle: 'CEO Challenge · Vintage Compass',
        promptQuestion: 'As CEO during market chaos, how do you use a Compass metaphor to align 500 employees?',
        hint: 'Define your North Star metric and quarterly course correction.',
        artwork: 'compass',
        timerSeconds: 60,
        xpReward: 55,
      },
      {
        id: 'wh-stethoscope',
        label: 'Stethoscope',
        shortLabel: 'PULSE CHECK',
        color: '#4338CA',
        promptTitle: 'CEO Challenge · Stethoscope',
        promptQuestion: 'How does a CEO listen to the heartbeat of dissatisfied customers before sales drop 40%?',
        hint: 'Design a weekly customer-listening ritual.',
        artwork: 'stethoscope',
        timerSeconds: 60,
        xpReward: 55,
      },
      {
        id: 'wh-espresso',
        label: 'Espresso Cup',
        shortLabel: 'ESPRESSO',
        color: '#9A3412',
        promptTitle: 'Brand Pitch · Executive Espresso',
        promptQuestion: 'Rebrand a simple morning espresso cup into a "Deep Work Focus Ritual" product.',
        hint: 'Sell clarity and calm energy, not just roasted beans.',
        artwork: 'coffee_cup',
        timerSeconds: 30,
        xpReward: 55,
      },
      {
        id: 'wh-lighthouse',
        label: 'Lighthouse',
        shortLabel: 'LIGHTHOUSE',
        color: '#0E7490',
        promptTitle: 'CEO Challenge · Lighthouse',
        promptQuestion: 'How does your company become the Lighthouse signal in an industry crowded with noise?',
        hint: 'Focus on trust, reliability, and unmistakable clarity.',
        artwork: 'lighthouse',
        timerSeconds: 60,
        xpReward: 55,
      },
      {
        id: 'wh-keyboard-ceo',
        label: 'Mechanical Keyboard',
        shortLabel: 'KEYBOARD',
        color: '#9D174D',
        promptTitle: 'Brand Pitch · Async Keyboard',
        promptQuestion: 'Pitch a single keyboard as the antidote to pointless 2-hour video meetings.',
        hint: 'Highlight thoughtful async writing and crisp team alignment.',
        artwork: 'keyboard',
        timerSeconds: 30,
        xpReward: 55,
      },
    ],
  },
];

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
  | 'gears'
  | 'backpack'
  | 'notebook';

export interface ConceptPair {
  id: string;
  pictureTitle: string;
  artwork: ArtworkId;
  abstractConcept: string;
  explanation: string;
  discussionPrompt: string;
}

export interface SessionBlock {
  id: string;
  phase: string;
  title: string;
  startMinute: number;
  durationMinutes: number;
  targetView: 'overview' | 'activities' | 'challenges' | 'championship' | 'playbook';
  activityNumber?: number;
  summary: string;
}

export interface ImpossiblePair {
  id: string;
  leftTitle: string;
  leftArtwork: ArtworkId;
  rightTitle: string;
  rightArtwork: ArtworkId;
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

export interface ActivityDefinition {
  number: number;
  title: string;
  subtitle: string;
  durationLabel: string;
  timerSeconds: number;
  learningOutcome: string;
  instructions: string[];
  highlightRule?: string;
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

export interface RubricCriterion {
  id: 'creativity' | 'logic' | 'clarity' | 'participation' | 'confidence' | 'time';
  label: string;
  maxMarks: number;
  guidance: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  spokeCount: number;
}

export type TeamRole = 'Leader' | 'Speaker' | 'Observer' | 'Creator' | 'Presenter';

export interface RoundScore {
  id: string;
  activityTitle: string;
  judgePanel: {
    studentJudge1: number;
    studentJudge2: number;
    facultyJudge: number;
  };
  criteria: Record<RubricCriterion['id'], number>;
  total: number;
  notes: string;
  recordedAt: string;
}

export interface TeamRecord {
  id: string;
  name: string;
  members: TeamMember[];
  scores: RoundScore[];
}

export interface PrepItem {
  id: string;
  label: string;
  category: string;
  completed: boolean;
}

export const WORKSHOP_META = {
  title: 'PICTURE CONNECT WITH KAPIL',
  shortTitle: 'Picture Connect',
  subtitle: '3-Hour Experiential Learning Experience',
  institution: 'JIET Universe, Jodhpur',
  positioning: 'See Beyond. Think Beyond. Connect Beyond.',
  poweredBy: 'Powered By Kapil',
  pillars: [
    'Visual Intelligence',
    'Creative Thinking',
    'Communication',
    'Employability',
  ],
  corePhilosophy:
    'The magic is not in identifying the picture. It is in explaining the connection!',
  biggestOutcome:
    'The biggest outcome should be that even the shyest student speaks at least once, every team collaborates, and students leave realising that communication is not merely about English proficiency. It is about the ability to organise thoughts and express ideas.',
  closingCallout:
    "Let's make these three hours an experience, not just another classroom session!",
};

export const CENTRAL_CONCEPT_PAIRS: ConceptPair[] = [
  {
    id: 'bridge-trust',
    pictureTitle: 'A Bridge',
    artwork: 'bridge',
    abstractConcept: 'Trust',
    explanation:
      'A bridge carries heavy weight across an uncertain gap only when both sides are anchored firmly—just like trust in teams and relationships.',
    discussionPrompt: 'What breaks a bridge, and how do you rebuild trust once cracked?',
  },
  {
    id: 'pencil-failure',
    pictureTitle: 'A Broken Pencil',
    artwork: 'broken_pencil',
    abstractConcept: 'Failure',
    explanation:
      'A pencil snaps under pressure, yet sharpening it gives it a fresh point. Failure does not end utility—it reshapes focus.',
    discussionPrompt: 'When did a setback sharpen your clarity?',
  },
  {
    id: 'signal-career',
    pictureTitle: 'A Traffic Signal',
    artwork: 'traffic_signal',
    abstractConcept: 'Career',
    explanation:
      'Careers are not endless green lights. Red signals force reflection, amber signals demand preparation, and green rewards readiness.',
    discussionPrompt: 'Which light are you currently standing at in your career journey?',
  },
  {
    id: 'mirror-awareness',
    pictureTitle: 'A Mirror',
    artwork: 'mirror',
    abstractConcept: 'Self-awareness',
    explanation:
      'A mirror shows reality without flattery. Growth begins when you inspect yourself honestly before asking others to trust your image.',
    discussionPrompt: 'What does your reflection reveal that your resume hides?',
  },
  {
    id: 'ladder-ambition',
    pictureTitle: 'A Ladder',
    artwork: 'ladder',
    abstractConcept: 'Ambition',
    explanation:
      'Climbing higher requires steady rungs below you and a stable wall to lean against. Ambition without grounding collapses.',
    discussionPrompt: 'Which wall is your ladder leaning against right now?',
  },
  {
    id: 'tree-leadership',
    pictureTitle: 'A Tree',
    artwork: 'tree',
    abstractConcept: 'Leadership',
    explanation:
      'Deep unseen roots sustain wide visible shade. True leaders weather storms quietly while sheltering the team beneath them.',
    discussionPrompt: 'Do people remember your leaves, or the shelter you provide?',
  },
];

export const SESSION_BLUEPRINT: SessionBlock[] = [
  {
    id: 'block-opening',
    phase: 'Opening',
    title: 'Curiosity Hook & Central Concept',
    startMinute: 0,
    durationMinutes: 15,
    targetView: 'playbook',
    summary:
      'Deliver the Opening Script, divide 50+ learners into 10 teams of 5–6, assign Team Roles, and warm up with the 6 Central Concept pairings.',
  },
  {
    id: 'block-act-1',
    phase: 'Perspective',
    title: 'Activity 1: One Picture, 50 Perspectives',
    startMinute: 15,
    durationMinutes: 12,
    targetView: 'activities',
    activityNumber: 1,
    summary:
      'Project the crossroads scene; collect 10+ distinct interpretations from learners across teams.',
  },
  {
    id: 'block-act-2',
    phase: 'Agility',
    title: 'Activity 2: The Impossible Connection',
    startMinute: 27,
    durationMinutes: 15,
    targetView: 'activities',
    activityNumber: 2,
    summary:
      'Pair two unrelated pictures and challenge speakers to connect them creatively and logically in 45 seconds.',
  },
  {
    id: 'block-act-3',
    phase: 'Storytelling',
    title: 'Activity 3: Picture Story Relay',
    startMinute: 42,
    durationMinutes: 18,
    targetView: 'activities',
    activityNumber: 3,
    summary:
      '5–6 students per team weave a sequential story (beginning, conflict, solution, conclusion, title) across 5 unrelated cards.',
  },
  {
    id: 'block-act-4',
    phase: 'Observation',
    title: 'Activity 4: What Is Missing?',
    startMinute: 60,
    durationMinutes: 12,
    targetView: 'activities',
    activityNumber: 4,
    summary:
      '15-second visual flash memory drill testing observation, inference of missing items, and before/after storytelling.',
  },
  {
    id: 'block-act-5',
    phase: 'Employability',
    title: 'Activity 5: Picture to Profession + CEO Twist',
    startMinute: 72,
    durationMinutes: 15,
    targetView: 'activities',
    activityNumber: 5,
    summary:
      'Map everyday objects to careers and elevate thinking with the CEO business problem-solving twist.',
  },
  {
    id: 'block-act-6',
    phase: 'Workplace',
    title: 'Activity 6: Picture Detective – Find the Problem',
    startMinute: 87,
    durationMinutes: 15,
    targetView: 'activities',
    activityNumber: 6,
    summary:
      '3-minute team sprint to spot 8–10 deliberate safety, communication, etiquette, time, and security flaws.',
  },
  {
    id: 'block-act-7',
    phase: 'Persuasion',
    title: 'Activity 7: Sell Me This Picture! (ConnectPro)',
    startMinute: 102,
    durationMinutes: 18,
    targetView: 'activities',
    activityNumber: 7,
    summary:
      'Transform an ordinary object like a paper clip into a premium brand with tagline, 3 USPs, and a 30-second pitch.',
  },
  {
    id: 'block-act-8',
    phase: 'Empathy',
    title: 'Activity 8: Emotion Behind the Picture',
    startMinute: 120,
    durationMinutes: 12,
    targetView: 'activities',
    activityNumber: 8,
    summary:
      'Diagnose emotion, perspective, and supportive dialogue with reasoning rather than assumptions.',
  },
  {
    id: 'block-act-9',
    phase: 'Strategy',
    title: 'Activity 9: Picture to Corporate Boardroom',
    startMinute: 132,
    durationMinutes: 18,
    targetView: 'activities',
    activityNumber: 9,
    summary:
      'Investigate a 40% sales drop across 5 visual clue domains and deliver a 2-minute boardroom turnaround pitch.',
  },
  {
    id: 'block-act-10',
    phase: 'Grand Finale',
    title: 'Activity 10: Six Pictures, One Vision',
    startMinute: 150,
    durationMinutes: 20,
    targetView: 'activities',
    activityNumber: 10,
    summary:
      'Championship finale: 5 min prep, 2 min presentation, 1 min Q&A uniting 6 unrelated images into one theme.',
  },
  {
    id: 'block-closing',
    phase: 'Closing',
    title: 'Surprise Challenges, Awards & Closing Script',
    startMinute: 170,
    durationMinutes: 10,
    targetView: 'championship',
    summary:
      'Spontaneous reflection from the 6 Picture Challenges, judge scoring tally, Championship winner announcement, and Closing Script.',
  },
];

export const ACTIVITIES: ActivityDefinition[] = [
  {
    number: 1,
    title: 'One Picture, 50 Perspectives',
    subtitle: 'Divergent Interpretation',
    durationLabel: '12 min · 10 Speakers',
    timerSeconds: 180,
    learningOutcome: 'There can be multiple perspectives to the same situation.',
    instructions: [
      'Display one picture to the entire class (e.g., A person standing at a crossroads).',
      'Ask 10 different students to interpret what the picture means to them.',
      'Capture every unique lens without repeating an interpretation already shared.',
    ],
  },
  {
    number: 2,
    title: 'The Impossible Connection',
    subtitle: '45-Second Lateral Bridge',
    durationLabel: '45 sec challenge',
    timerSeconds: 45,
    learningOutcome: 'Rapid lateral thinking and structured, persuasive justification.',
    instructions: [
      'Give students two completely unrelated pictures.',
      'Challenge them to connect both pictures in 45 seconds.',
      'Make the connections creative but logical.',
    ],
    highlightRule: 'Make the connections creative but logical.',
  },
  {
    number: 3,
    title: 'Picture Story Relay',
    subtitle: 'Collaborative Team Narrative',
    durationLabel: '5–6 Students · 5 Cards',
    timerSeconds: 180,
    learningOutcome: 'Listening, spontaneous speaking, creativity and team coordination.',
    instructions: [
      'Divide students into teams of 5–6 and deal five unrelated pictures.',
      'Student 1 starts using Picture 1; Student 2 continues using Picture 2; Student 3 adds Picture 3; continue until everyone contributes.',
      'The last student gives the story a memorable title.',
    ],
    highlightRule: 'The story must have a beginning, conflict, solution and conclusion.',
  },
  {
    number: 4,
    title: 'What Is Missing?',
    subtitle: '15-Second Visual Flash',
    durationLabel: '15 sec view window',
    timerSeconds: 15,
    learningOutcome: 'Observation, memory, attention to detail and inference.',
    instructions: [
      'Show the picture for exactly 15 seconds, then hide it.',
      'Ask: What objects did you observe? What was missing? What could have happened before? What might happen next?',
      'Increase difficulty by switching to the dense scene with additional objects.',
    ],
  },
  {
    number: 5,
    title: 'Picture to Profession',
    subtitle: 'Career Lens & CEO Twist',
    durationLabel: '15 min · CEO Challenge',
    timerSeconds: 90,
    learningOutcome: 'Career awareness and professional thinking.',
    instructions: [
      'Show students pictures of everyday objects and connect them with different professions.',
      'Push beyond obvious associations into real workplace roles.',
      'Ask the CEO Twist: "What if you were the CEO? How would you use this object to solve a business problem?"',
    ],
  },
  {
    number: 6,
    title: 'Picture Detective – Find the Problem',
    subtitle: 'Workplace Audit Sprint',
    durationLabel: '3 min team audit',
    timerSeconds: 180,
    learningOutcome: 'Critical thinking and workplace readiness.',
    instructions: [
      'Display a complicated workplace scene containing 8–10 deliberate mistakes.',
      'Teams get 3 minutes to spot workplace safety violations, communication failures, time management problems, etiquette issues, and security risks.',
      'Click directly on the visual clues inside the scene to log each violation.',
    ],
  },
  {
    number: 7,
    title: 'Sell Me This Picture!',
    subtitle: 'Branding & Persuasion Pitch',
    durationLabel: '30 sec sales pitch',
    timerSeconds: 30,
    learningOutcome: 'Marketing, persuasion, branding and confidence.',
    instructions: [
      'Give every team one ordinary object or its photograph (e.g., a paper clip).',
      'Sell it to the class as a premium product (e.g., "Introducing ConnectPro – the smallest collaboration technology in the world!").',
      'Create: Product name, Tagline, Target audience, Three unique selling points, and a 30-second sales pitch.',
    ],
  },
  {
    number: 8,
    title: 'Emotion Behind the Picture',
    subtitle: 'Empathy & Reasoning',
    durationLabel: '12 min reflection',
    timerSeconds: 120,
    learningOutcome: 'Empathy, emotional intelligence and interpersonal communication.',
    instructions: [
      'Show an emotionally rich human scene.',
      'Identify: The possible emotion, the situation, the person’s perspective, and what you would say to that person.',
      'Multiple interpretations are acceptable—explain your reasoning rather than assuming.',
    ],
    highlightRule:
      'Multiple interpretations are acceptable. Students must explain their reasoning rather than assume what someone is feeling.',
  },
  {
    number: 9,
    title: 'Picture to Corporate Boardroom',
    subtitle: '40% Sales Decline Turnaround',
    durationLabel: '2 min boardroom pitch',
    timerSeconds: 120,
    learningOutcome: 'Business communication, analytical thinking and decision-making.',
    instructions: [
      'Show a picture of a business problem (e.g., a company experiencing a sudden 40% decline in sales).',
      'Inspect the 5 visual clue zones: Customers, Employees, Product quality, Marketing, and Competition.',
      'Prepare a 2-minute boardroom presentation proposing an actionable solution.',
    ],
  },
  {
    number: 10,
    title: 'Six Pictures, One Vision',
    subtitle: 'Grand Finale Championship',
    durationLabel: '5m prep · 2m pitch · 1m Q&A',
    timerSeconds: 300,
    learningOutcome: 'Leadership, storytelling, teamwork and presentation skills.',
    instructions: [
      'Give each team six unrelated pictures.',
      'Connect all six into one meaningful theme (e.g., "The Journey of an Engineer – From Classroom to Boardroom").',
      'Execute across three phases: 5 minutes preparation, 2 minutes presentation, and 1 minute Q&A.',
    ],
  },
];

export const ACTIVITY_1_DEFAULT_INTERPRETATIONS = [
  'Choosing a career.',
  'Making a difficult decision.',
  'Leaving the comfort zone.',
  'Taking responsibility.',
  'Overcoming confusion.',
];

export const IMPOSSIBLE_PAIRS: ImpossiblePair[] = [
  {
    id: 'apple-rocket',
    leftTitle: 'Apple',
    leftArtwork: 'apple',
    rightTitle: 'Rocket',
    rightArtwork: 'rocket',
    possibleConnection: 'Innovation',
    reasoningHint:
      'From Newton’s falling apple to space-age propulsion—curiosity about everyday gravity fuels breakthroughs that launch humanity forward.',
  },
  {
    id: 'hourglass-exam',
    leftTitle: 'Hourglass',
    leftArtwork: 'hourglass',
    rightTitle: 'Exam',
    rightArtwork: 'exam',
    possibleConnection: 'Time management',
    reasoningHint:
      'Every grain of sand represents minutes in the exam hall—calm pacing matters as much as preparation.',
  },
  {
    id: 'mirror-interview',
    leftTitle: 'Mirror',
    leftArtwork: 'mirror',
    rightTitle: 'Interview',
    rightArtwork: 'interview',
    possibleConnection: 'Self-awareness',
    reasoningHint:
      'Before a recruiter evaluates your strengths and blind spots, your honest self-reflection sets your confidence.',
  },
  {
    id: 'umbrella-leadership',
    leftTitle: 'Umbrella',
    leftArtwork: 'umbrella',
    rightTitle: 'Tree (Leadership)',
    rightArtwork: 'tree',
    possibleConnection: 'Protection',
    reasoningHint:
      'An umbrella shields people from sudden storms without asking for credit—mirroring how resilient leaders absorb pressure for their team.',
  },
  {
    id: 'camera-business',
    leftTitle: 'Camera',
    leftArtwork: 'camera',
    rightTitle: 'Business',
    rightArtwork: 'business',
    possibleConnection: 'Observation',
    reasoningHint:
      'Just as a photographer adjusts aperture and focus to notice hidden details, sharp businesses observe customer friction before competitors do.',
  },
  {
    id: 'puzzle-teamwork',
    leftTitle: 'Puzzle',
    leftArtwork: 'puzzle',
    rightTitle: 'Teamwork',
    rightArtwork: 'teamwork',
    possibleConnection: 'Collaboration',
    reasoningHint:
      'Identical pieces cannot lock together; teams thrive precisely because different strengths interlock into one whole picture.',
  },
];

export const STORY_RELAY_CARDS: { id: string; title: string; artwork: ArtworkId }[] = [
  { id: 's1', title: 'The Crossroads', artwork: 'crossroads' },
  { id: 's2', title: 'A Broken Pencil', artwork: 'broken_pencil' },
  { id: 's3', title: 'The Umbrella', artwork: 'umbrella' },
  { id: 's4', title: 'A Compass', artwork: 'compass' },
  { id: 's5', title: 'The Rocket', artwork: 'rocket' },
  { id: 's6', title: 'The Lighthouse', artwork: 'lighthouse' },
];

export const MEMORY_OBJECTS_STANDARD: MemoryObject[] = [
  { id: 'm1', label: 'Analog Wall Clock (stuck at 10:10)' },
  { id: 'm2', label: 'Half-empty Coffee Mug with Spoon' },
  { id: 'm3', label: 'Open Spiral Notebook' },
  { id: 'm4', label: 'Broken Pencil on Table Edge' },
  { id: 'm5', label: 'Red Sticky Note ("Call Client")' },
  { id: 'm6', label: 'Pair of Reading Glasses' },
  { id: 'm7', label: 'Desk Compass' },
  { id: 'm8', label: 'Laptop Closed (Missing Charger Cable)', isMissingHint: true },
];

export const MEMORY_OBJECTS_HARD: MemoryObject[] = [
  ...MEMORY_OBJECTS_STANDARD,
  { id: 'm9', label: 'ID Lanyard Left Near Door', hardOnly: true },
  { id: 'm10', label: 'Small Potted Succulent', hardOnly: true },
  { id: 'm11', label: 'Key Ring with Single Brass Key', hardOnly: true },
  { id: 'm12', label: 'Water Bottle Cap (Bottle Missing)', hardOnly: true, isMissingHint: true },
  { id: 'm13', label: 'Folded Boarding Pass', hardOnly: true },
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
      'Run regular "organisational pulse checks" by listening directly to frontline support staff and dissatisfied customers before churn becomes critical.',
  },
  {
    id: 'prof-compass',
    objectName: 'Compass',
    artwork: 'compass',
    profession: 'Project Manager',
    ceoPrompt:
      'What if you were the CEO? How would you use a compass to solve a business problem?',
    exampleCeoIdea:
      'Establish a clear True North metric for every department so cross-functional teams stay aligned when market priorities shift.',
  },
  {
    id: 'prof-calculator',
    objectName: 'Calculator',
    artwork: 'calculator',
    profession: 'Financial Analyst',
    ceoPrompt:
      'What if you were the CEO? How would you use a calculator to solve a business problem?',
    exampleCeoIdea:
      'Audit unit economics across every product SKU and eliminate hidden operational costs eroding quarterly margins.',
  },
  {
    id: 'prof-bridge',
    objectName: 'Bridge',
    artwork: 'bridge',
    profession: 'Civil Engineer',
    ceoPrompt:
      'What if you were the CEO? How would you use a bridge to solve a business problem?',
    exampleCeoIdea:
      'Build a structured mentorship bridge between senior engineers and campus freshers to cut onboarding ramp-up time in half.',
  },
  {
    id: 'prof-keyboard',
    objectName: 'Keyboard',
    artwork: 'keyboard',
    profession: 'Software Developer',
    ceoPrompt:
      'What if you were the CEO? How would you use a keyboard to solve a business problem?',
    exampleCeoIdea:
      'Create shared internal shortcuts and asynchronous documentation templates so global teams communicate cleanly across time zones.',
  },
  {
    id: 'prof-camera',
    objectName: 'Camera',
    artwork: 'camera',
    profession: 'Digital Marketer',
    ceoPrompt:
      'What if you were the CEO? How would you use a camera to solve a business problem?',
    exampleCeoIdea:
      'Shift brand storytelling from polished corporate claims to real behind-the-scenes customer stories that earn authentic trust.',
  },
];

export const WORKPLACE_MISTAKES: WorkplaceMistake[] = [
  {
    id: 'wm-1',
    number: 1,
    category: 'Workplace safety violations',
    title: 'Spilled Liquid Near Live Power Strip',
    detail: 'An open coffee cup spilled right beside an exposed multi-plug extension cord on the floor.',
    xPercent: 18,
    yPercent: 78,
  },
  {
    id: 'wm-2',
    number: 2,
    category: 'Workplace safety violations',
    title: 'Blocked Fire Exit Door',
    detail: 'Heavy cardboard archive boxes are stacked directly in front of the emergency exit.',
    xPercent: 86,
    yPercent: 52,
  },
  {
    id: 'wm-3',
    number: 3,
    category: 'Security risks',
    title: 'Password Sticky Note on Monitor',
    detail: 'Admin login credentials written on a bright sticky note attached to an unlocked workstation.',
    xPercent: 34,
    yPercent: 40,
  },
  {
    id: 'wm-4',
    number: 4,
    category: 'Security risks',
    title: 'Unattended Open File Cabinet & USB Drive',
    detail: 'Confidential HR folders left open with an unknown USB thumb drive plugged into a visitor terminal.',
    xPercent: 72,
    yPercent: 68,
  },
  {
    id: 'wm-5',
    number: 5,
    category: 'Communication failures',
    title: 'Contradictory Deadline Notes on Whiteboard',
    detail: 'Whiteboard shows "Launch: Tuesday" crossed out next to "Wait for Approval?" with no owner assigned.',
    xPercent: 51,
    yPercent: 24,
  },
  {
    id: 'wm-6',
    number: 6,
    category: 'Communication failures',
    title: 'Both Teammates Wearing Headphones Ignoring Alert',
    detail: 'Two colleagues are isolated in noise-cancelling headphones while an urgent client call flashes unanswered.',
    xPercent: 25,
    yPercent: 46,
  },
  {
    id: 'wm-7',
    number: 7,
    category: 'Time management problems',
    title: 'Overdue Calendar & Overlapping Meetings',
    detail: 'Wall clock reads 4:45 PM while three 2:00 PM tasks remain untouched and two overlapping meetings blink on screen.',
    xPercent: 70,
    yPercent: 21,
  },
  {
    id: 'wm-8',
    number: 8,
    category: 'Time management problems',
    title: 'Social Media Scrolling During Sprint Crunch',
    detail: 'A team member has 14 social tabs open during a critical client delivery window.',
    xPercent: 58,
    yPercent: 56,
  },
  {
    id: 'wm-9',
    number: 9,
    category: 'Professional etiquette issues',
    title: 'Feet on Conference Table & Loud Phone Call',
    detail: 'Staff member taking a personal speakerphone call with shoes propped up on the shared meeting table.',
    xPercent: 44,
    yPercent: 72,
  },
  {
    id: 'wm-10',
    number: 10,
    category: 'Professional etiquette issues',
    title: 'Overflowing Trash & Leftover Food on Shared Desk',
    detail: 'Unwrapped lunch box and overflowing bin left on a shared hot-desk before client visitors arrive.',
    xPercent: 12,
    yPercent: 53,
  },
];

export const SELL_OBJECTS: {
  id: string;
  objectName: string;
  artwork: ArtworkId;
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
    sampleName: 'ConnectPro',
    sampleTagline: 'The smallest collaboration technology in the world!',
    sampleAudience: 'High-velocity executives, architects, and hybrid project teams',
    sampleUsps: [
      'Zero-battery, instant physical alignment of critical ideas',
      'Aerospace-grade spring steel engineered for 1,000+ reuses',
      'Ultra-portable micro-footprint that fits in any pocket',
    ],
    samplePitch:
      'Introducing ConnectPro — the smallest collaboration technology in the world! While apps crash and batteries die, ConnectPro unites scattered ideas in 0.2 seconds with zero Wi-Fi required.',
  },
  {
    id: 'sell-pencil',
    objectName: 'A Broken Pencil',
    artwork: 'broken_pencil',
    sampleName: 'DuoDraft',
    sampleTagline: 'Two minds, one shared blueprint.',
    sampleAudience: 'Design studios, engineering learners, and co-founders',
    sampleUsps: [
      'Instant twin-tip sketching when split between teammates',
      'Zero digital distraction for deep problem-solving',
      'Biodegradable cedar craftsmanship',
    ],
    samplePitch:
      'Meet DuoDraft — one tool engineered to split into two creative instruments the moment collaboration begins.',
  },
  {
    id: 'sell-umbrella',
    objectName: 'An Umbrella',
    artwork: 'umbrella',
    sampleName: 'AeroShield',
    sampleTagline: 'Portable certainty for unpredictable days.',
    sampleAudience: 'Urban commuters and outdoor field leaders',
    sampleUsps: [
      'Instant canopy deployment against sun or sudden rain',
      'Wind-vented rib architecture that refuses to invert',
      'Doubles as a high-visibility safety beacon at dusk',
    ],
    samplePitch:
      'You cannot negotiate with monsoon weather, but with AeroShield you carry personal certainty in one click.',
  },
];

export const BOARDROOM_CLUES: BoardroomClue[] = [
  {
    id: 'bc-customers',
    dimension: 'Customers',
    headline: 'Rising Support Tickets & Churn',
    visualEvidence:
      'Customer satisfaction thermometer dropped to 38% with an overflowing inbox of unresolved complaints.',
    strategicQuestion: 'How do we win back lost customer trust in the next 30 days?',
    xPercent: 18,
    yPercent: 34,
  },
  {
    id: 'bc-employees',
    dimension: 'Employees',
    headline: 'Burnout & Siloed Misalignment',
    visualEvidence:
      'Key team members pulling away from the table with disconnected speech bubbles and empty desks.',
    strategicQuestion: 'How do we re-energise morale and cross-team ownership?',
    xPercent: 36,
    yPercent: 71,
  },
  {
    id: 'bc-quality',
    dimension: 'Product quality',
    headline: 'Defects & Return Spikes',
    visualEvidence:
      'Cracked gear and "Returned Batch" crates piling up beside the inspection gauge.',
    strategicQuestion: 'What immediate quality gate prevents flawed units from shipping?',
    xPercent: 52,
    yPercent: 48,
  },
  {
    id: 'bc-marketing',
    dimension: 'Marketing',
    headline: 'Stale Messaging & Low Reach',
    visualEvidence:
      'Outdated megaphone posters pointing at an empty billboard while digital channels sit dark.',
    strategicQuestion: 'How do we reposition the brand narrative for modern buyers?',
    xPercent: 72,
    yPercent: 28,
  },
  {
    id: 'bc-competition',
    dimension: 'Competition',
    headline: 'Agile Rival Taking Market Share',
    visualEvidence:
      'A sleek rival rocket curve overtaking our dipping 40% sales line on the wall chart.',
    strategicQuestion: 'Where can we differentiate instead of fighting a price war?',
    xPercent: 84,
    yPercent: 64,
  },
];

export const FINALE_SIX_PICTURES: { id: string; title: string; artwork: ArtworkId }[] = [
  { id: 'f1', title: 'Classroom Notebook', artwork: 'notebook' },
  { id: 'f2', title: 'A Bridge', artwork: 'bridge' },
  { id: 'f3', title: 'Broken Pencil', artwork: 'broken_pencil' },
  { id: 'f4', title: 'A Compass', artwork: 'compass' },
  { id: 'f5', title: 'Mountain Peak', artwork: 'mountain_peak' },
  { id: 'f6', title: 'Boardroom Chart', artwork: 'business' },
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
      'Recruiters see the 10% tip (CGPA, certificates), yet hire for the 90% below the waterline (habits, persistence, integrity).',
    employabilityLens: 'Depth of character, preparation, and invisible effort',
  },
  {
    id: 'sc-ripple',
    number: 4,
    title: 'RIPPLE EFFECT',
    artwork: 'challenge_ripple',
    question: 'How can one small decision change your future?',
    deepeningPrompt:
      'Speaking up once in class, asking one honest question, or helping one peer creates waves years later.',
    employabilityLens: 'Compound habits and everyday initiative',
  },
  {
    id: 'sc-choices',
    number: 5,
    title: 'CHOICES',
    artwork: 'challenge_choices',
    question: 'How do your choices shape your career?',
    deepeningPrompt:
      'Between comfort and stretch, short-term ease and long-term craft—which door are you choosing this semester?',
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

export const TEAM_ROLES: TeamRole[] = [
  'Leader',
  'Speaker',
  'Observer',
  'Creator',
  'Presenter',
];

export const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'creativity',
    label: 'Creativity and originality',
    maxMarks: 20,
    guidance: 'Freshness of metaphor and ability to see beyond literal objects.',
  },
  {
    id: 'logic',
    label: 'Logical connections',
    maxMarks: 20,
    guidance: 'Coherence and believability linking unrelated images to real insight.',
  },
  {
    id: 'clarity',
    label: 'Communication clarity',
    maxMarks: 20,
    guidance: 'Structured flow of ideas—not fancy vocabulary, but clear expression.',
  },
  {
    id: 'participation',
    label: 'Team participation',
    maxMarks: 15,
    guidance: 'Every member contributes and speaker roles rotate equitably.',
  },
  {
    id: 'confidence',
    label: 'Confidence and presentation',
    maxMarks: 15,
    guidance: 'Eye contact, voice projection, poise, and audience engagement.',
  },
  {
    id: 'time',
    label: 'Time management',
    maxMarks: 10,
    guidance: 'Respecting 45s / 2m / 3m / 5m limits with clean conclusions.',
  },
];

export const OPENING_SCRIPT_LINES: string[] = [
  'Good morning, everyone!',
  'Today, I am not going to teach you how to describe a picture.',
  'I am going to challenge you to see things that others might miss.',
  'A picture can be seen by 50 people, but can it create 50 different stories?',
  'Can you connect a broken pencil with leadership? Can you connect an umbrella with teamwork? Can you connect a traffic signal with your career?',
  'Welcome to PICTURE CONNECT WITH KAPIL!',
  'Remember, there are no ordinary pictures. There are extraordinary perspectives waiting to be discovered.',
];

export const CLOSING_SCRIPT_LINES: string[] = [
  'Your ability to see beyond what is visible determines how you think, communicate and solve problems.',
  'In the corporate world, you will not always receive complete information, clear instructions or straightforward problems.',
  'Your ability to observe, connect, interpret and communicate will distinguish you.',
  "Don't just look at pictures. Learn to see possibilities!",
];

export const DEFAULT_PREP_CHECKLIST: PrepItem[] = [
  {
    id: 'prep-1',
    label: 'Test projector display & Stage Mode contrast in auditorium',
    category: 'Room & AV',
    completed: false,
  },
  {
    id: 'prep-2',
    label: 'Verify 10 team tables (5–6 learners per team) for 50+ students',
    category: 'Seating & Teams',
    completed: false,
  },
  {
    id: 'prep-3',
    label: 'Appoint 2 Student Judges and 1 Faculty Judge with 100-point rubric',
    category: 'Judging Panel',
    completed: false,
  },
  {
    id: 'prep-4',
    label: 'Brief Team Leaders on rotating Speaker role every activity',
    category: 'Inclusion',
    completed: false,
  },
  {
    id: 'prep-5',
    label: 'Load Activity 4 (15s memory) & Activity 6 (workplace mistakes) cards',
    category: 'Visual Deck',
    completed: false,
  },
  {
    id: 'prep-6',
    label: 'Prepare physical ordinary objects for Activity 7 (paper clips, pencils)',
    category: 'Props',
    completed: false,
  },
  {
    id: 'prep-7',
    label: 'Rehearse Opening & Closing Scripts for maximum room curiosity',
    category: 'Facilitation',
    completed: false,
  },
];

export function createInitialTeams(): TeamRecord[] {
  const teamNames = [
    'Team 01 · Horizon',
    'Team 02 · Catalysts',
    'Team 03 · Vanguard',
    'Team 04 · Synergy',
    'Team 05 · Spark',
    'Team 06 · Mavericks',
    'Team 07 · Compass',
    'Team 08 · Keystone',
    'Team 09 · Zenith',
    'Team 10 · Pioneers',
  ];

  return teamNames.map((name, idx) => ({
    id: `team-${idx + 1}`,
    name,
    members: [
      { id: `t${idx + 1}-m1`, name: `Learner ${idx + 1}A`, role: 'Leader', spokeCount: 0 },
      { id: `t${idx + 1}-m2`, name: `Learner ${idx + 1}B`, role: 'Speaker', spokeCount: 0 },
      { id: `t${idx + 1}-m3`, name: `Learner ${idx + 1}C`, role: 'Observer', spokeCount: 0 },
      { id: `t${idx + 1}-m4`, name: `Learner ${idx + 1}D`, role: 'Creator', spokeCount: 0 },
      { id: `t${idx + 1}-m5`, name: `Learner ${idx + 1}E`, role: 'Presenter', spokeCount: 0 },
    ],
    scores: [],
  }));
}

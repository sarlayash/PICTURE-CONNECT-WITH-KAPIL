export type AdvancedThemeId =
  | 'products'
  | 'values'
  | 'abstract'
  | 'placements'
  | 'services';

export interface AdvancedChallenge {
  id: string; // e.g. '1.1'
  slug: string; // e.g. '1_1' (Firestore-safe ID)
  themeId: AdvancedThemeId;
  title: string;
  brief: string;
  questions: [string, string, string, string, string];
}

export interface AdvancedTheme {
  id: AdvancedThemeId;
  number: string;
  title: string;
  subtitle: string;
  employabilityFocus: string;
  accent: 'blue' | 'emerald' | 'violet' | 'amber' | 'cyan';
  challenges: AdvancedChallenge[];
}

export interface AdvancedBadgeDefinition {
  id: string;
  title: string;
  description: string;
  criteriaLabel: string;
  accent: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'cyan';
  checkUnlocked: (stats: {
    completedChallenges: string[];
    maxChallengeScore: number;
    avgScore: number;
    advXp: number;
  }) => boolean;
}

export interface AutoScoreResult {
  totalScore: number;
  obsScore: number; // /20
  reasonScore: number; // /25
  creativityScore: number; // /20
  actionScore: number; // /20
  commScore: number; // /15
  gradeLabel: string;
  feedback: string;
}

export const ADVANCED_META = {
  title: 'AI-POWERED PICTURE CONNECT WITH KAPIL',
  tagline: 'SEE. CREATE. CONNECT. COMMUNICATE.',
  edition: 'Advanced Track · Prompt-to-Presentation Challenge',
  poweredBy: 'POWERED BY KAPIL',
  description:
    'An experiential, AI-assisted employability studio where learners craft visual prompts, upload AI-generated or curated images, answer 125 workplace thinking questions across 25 visual challenges, receive instant 100-mark auto-scoring, and earn separate Advanced Badges & PNG Credentials without affecting Core Track XP or profiles.',
};

export const MASTER_PROMPT_ADDON =
  'Create one original, realistic and professionally useful image based on this brief. Use a believable Indian or global workplace / campus context where appropriate. Show clear visual clues, natural human expressions, inclusive representation and purposeful composition. Avoid text, captions, logos, brand names, watermarks and stereotypes. Make the image rich enough to support discussion, multiple interpretations and practical problem-solving.';

export const QUICK_PROMPT_SUFFIX =
  'Create a realistic, high-quality image with no written text, no logos and no watermarks.';

export const LEARNING_LOOP_STEPS = [
  {
    step: '1. CREATE',
    detail: 'Generate the visual using ChatGPT or Gemini.',
  },
  {
    step: '2. OBSERVE',
    detail: 'Notice details, people, context and clues.',
  },
  {
    step: '3. CONNECT',
    detail: 'Interpret meaning and identify possibilities.',
  },
  {
    step: '4. RESPOND',
    detail: 'Answer the five questions with reasoning.',
  },
  {
    step: '5. PRESENT',
    detail: 'Explain your ideas like a workplace professional.',
  },
];

export const HOW_TO_STEPS = [
  'Open ChatGPT or Gemini and choose image generation / create image.',
  'Copy one image brief from this studio and customize it or append the Master Add-On.',
  'Generate the image. If the result is unclear, refine the prompt by adding setting, people, objects, lighting and point of view.',
  'Upload your image into the challenge studio and answer all five questions in your own words; do not ask AI to do all the thinking for you.',
  'Structure a concise SCARE presentation referring to visible details, and submit for instant 100-mark auto-scoring.',
];

export const SCARE_STEPS = [
  {
    letter: 'S',
    word: 'SEE',
    instruction: 'State what is visibly present. Avoid inventing facts.',
  },
  {
    letter: 'C',
    word: 'CONNECT',
    instruction: 'Explain the relationship, pattern or meaning you notice.',
  },
  {
    letter: 'A',
    word: 'ANALYSE',
    instruction: 'Give reasons, consider risks and identify alternatives.',
  },
  {
    letter: 'R',
    word: 'RESPOND',
    instruction: 'Recommend a practical action or solution.',
  },
  {
    letter: 'E',
    word: 'EXPRESS',
    instruction: 'Deliver the message clearly, concisely and professionally.',
  },
];

export const SAMPLE_PRESENTATION =
  '“I can see a team standing around a project board. I connect this image with collaboration because the people appear to be sharing information. The challenge may be coordinating different tasks and deadlines. I would recommend a short daily check-in, clear task ownership and a shared progress tracker. This can improve visibility, reduce rework and help the team deliver reliably.”';

export const PERSONAL_REFLECTION_PROMPTS = [
  'What did I notice in an image that others may have missed?',
  'Which question challenged my assumptions the most?',
  'What did I communicate clearly, and what could I improve?',
  'Which employability skill do I need to practise next?',
  'What evidence can I add to my portfolio to demonstrate that skill?',
];

export const ADVANCED_THEMES: AdvancedTheme[] = [
  {
    id: 'products',
    number: '01',
    title: 'PRODUCTS',
    subtitle: 'From objects to opportunities',
    employabilityFocus:
      'Build product thinking, customer empathy, value proposition design, innovation and persuasive communication.',
    accent: 'blue',
    challenges: [
      {
        id: '1.1',
        slug: '1_1',
        themeId: 'products',
        title: '1.1 The Everyday Reinvented',
        brief:
          'A reusable water bottle redesigned as a smart hydration companion for busy professionals. Show the product, three visible features and a realistic workplace setting.',
        questions: [
          'Q1. Who is the primary customer, and what daily frustration does this product remove?',
          'Q2. Which visible feature creates the strongest customer benefit, and why would someone pay for it?',
          'Q3. What is one realistic limitation or risk the product team should investigate before launch?',
          'Q4. How would you position this product differently for a college student and a corporate employee?',
          'Q5. Deliver a 20-second investor pitch using one clear value proposition and a memorable tagline.',
        ],
      },
      {
        id: '1.2',
        slug: '1_2',
        themeId: 'products',
        title: '1.2 The Inclusive Product',
        brief:
          'An affordable, thoughtfully designed laptop stand that supports people of different heights and mobility needs in a shared workspace.',
        questions: [
          'Q1. Which user needs appear to have influenced the design, and whose needs may still be overlooked?',
          'Q2. How could the team test usability with a diverse group of customers before manufacturing?',
          'Q3. What trade-off might arise between affordability, durability and premium design?',
          'Q4. Suggest one measurable success metric for the first 90 days after launch.',
          'Q5. Handle this objection from a buyer: "I can get a basic stand for half the price."',
        ],
      },
      {
        id: '1.3',
        slug: '1_3',
        themeId: 'products',
        title: '1.3 The Sustainable Choice',
        brief:
          'A refillable household cleaning product system with reusable containers, clear labels and a low-waste delivery model.',
        questions: [
          'Q1. Map the customer journey from first purchase to refill; where might customers drop off?',
          'Q2. Which claim would need evidence before the company could market this as sustainable?',
          'Q3. How can the business make refilling more convenient than buying a disposable alternative?',
          'Q4. What supplier or operations challenge could interrupt the product promise?',
          'Q5. Write a short product description that is persuasive without making exaggerated environmental claims.',
        ],
      },
      {
        id: '1.4',
        slug: '1_4',
        themeId: 'products',
        title: '1.4 The Connected Desk',
        brief:
          'A compact desk device that combines task lighting, wireless charging and focus-time reminders for hybrid workers.',
        questions: [
          'Q1. Which feature should be the hero feature, and which features may be unnecessary?',
          'Q2. What data privacy concern could arise from the device’s connected functions?',
          'Q3. How would you prioritise features for a minimum viable product?',
          'Q4. Design one A/B test to discover which message attracts more first-time buyers.',
          'Q5. Present a 30-second demonstration script that turns features into outcomes.',
        ],
      },
      {
        id: '1.5',
        slug: '1_5',
        themeId: 'products',
        title: '1.5 The Local Innovation',
        brief:
          'A portable food-storage product inspired by Indian tiffin culture, designed for commuters and office teams.',
        questions: [
          'Q1. What cultural insight or user behaviour has inspired this product concept?',
          'Q2. Which two customer segments would you research first, and what would you ask them?',
          'Q3. How could the design balance leak resistance, ease of cleaning and portability?',
          'Q4. Propose a low-cost pilot to validate demand in one city or campus.',
          'Q5. Create a brand promise that feels distinctive rather than generic.',
        ],
      },
    ],
  },
  {
    id: 'values',
    number: '02',
    title: 'VALUES',
    subtitle: 'Make invisible values visible',
    employabilityFocus:
      'Strengthen ethical judgement, workplace behaviour, trust, accountability, inclusion and professional decision-making.',
    accent: 'emerald',
    challenges: [
      {
        id: '2.1',
        slug: '2_1',
        themeId: 'values',
        title: '2.1 Integrity Under Pressure',
        brief:
          'A realistic office scene: a junior analyst notices a small but deliberate alteration in a performance report before a client presentation.',
        questions: [
          'Q1. What ethical tension is present, and who could be affected by the decision?',
          'Q2. What facts should the analyst verify before raising the concern?',
          'Q3. How can the analyst challenge the issue respectfully without making an unsupported accusation?',
          'Q4. If the manager dismisses the concern, what responsible escalation route could be considered?',
          'Q5. Draft one sentence the analyst could use to communicate the concern professionally.',
        ],
      },
      {
        id: '2.2',
        slug: '2_2',
        themeId: 'values',
        title: '2.2 Ownership in Action',
        brief:
          'A project team misses a delivery milestone; one team member steps forward with a recovery plan while others review dependencies.',
        questions: [
          'Q1. What is the difference between accepting responsibility and blaming yourself for everything?',
          'Q2. Which immediate actions would restore visibility and control over the delayed work?',
          'Q3. How should the team communicate the delay to its stakeholder?',
          'Q4. What evidence would show that the recovery plan is working?',
          'Q5. Describe a time-bound ownership commitment a new employee could make in this situation.',
        ],
      },
      {
        id: '2.3',
        slug: '2_3',
        themeId: 'values',
        title: '2.3 Respect Across Differences',
        brief:
          'A diverse team meeting where colleagues have different communication styles and one person’s idea is repeatedly interrupted.',
        questions: [
          'Q1. What behaviours in the scene may prevent equal participation?',
          'Q2. How could a facilitator invite quieter members into the discussion without putting them on the spot?',
          'Q3. What is the difference between disagreement with an idea and disrespect toward a person?',
          'Q4. Suggest a team norm that makes meetings more inclusive and effective.',
          'Q5. Role-play a tactful intervention that brings the interrupted colleague back into the conversation.',
        ],
      },
      {
        id: '2.4',
        slug: '2_4',
        themeId: 'values',
        title: '2.4 Trust and Confidentiality',
        brief:
          'An employee receives a spreadsheet containing customer information and notices it has been shared in a group chat with people who may not need access.',
        questions: [
          'Q1. What is the first safe action the employee should take, and what should they avoid doing?',
          'Q2. Why is "everyone in the group is a colleague" not enough to justify access?',
          'Q3. Which details should be recorded when reporting a possible information-handling incident?',
          'Q4. How can the team prevent a similar incident through process or access controls?',
          'Q5. Explain confidentiality to a new intern in plain language, using this scenario.',
        ],
      },
      {
        id: '2.5',
        slug: '2_5',
        themeId: 'values',
        title: '2.5 Learning from Failure',
        brief:
          'A prototype fails during a demonstration; the team calmly documents what happened and prepares a revised test.',
        questions: [
          'Q1. Which response behaviours turn a failure into useful learning rather than defensiveness?',
          'Q2. What information should a blameless review capture?',
          'Q3. How would you distinguish a one-off mistake from a recurring process weakness?',
          'Q4. What small experiment could test the team’s leading explanation for the failure?',
          'Q5. Give the team a two-sentence message that maintains confidence while being honest about the setback.',
        ],
      },
    ],
  },
  {
    id: 'abstract',
    number: '03',
    title: 'ABSTRACT THINKING',
    subtitle: 'Connect ideas that seem unrelated',
    employabilityFocus:
      'Develop visual interpretation, lateral thinking, systems thinking, structured reasoning and the ability to explain ambiguity.',
    accent: 'violet',
    challenges: [
      {
        id: '3.1',
        slug: '3_1',
        themeId: 'abstract',
        title: '3.1 The Iceberg',
        brief:
          'A conceptual iceberg with a small visible tip above water and a large submerged section, styled as a clean editorial illustration.',
        questions: [
          'Q1. In a workplace, what might be visible at the surface while remaining causes stay hidden?',
          'Q2. Choose one visible problem and trace three possible underlying causes.',
          'Q3. What evidence would help distinguish a root cause from an assumption?',
          'Q4. How could a team communicate the hidden complexity without overwhelming its audience?',
          'Q5. Use the iceberg as a metaphor to explain why first impressions are incomplete.',
        ],
      },
      {
        id: '3.2',
        slug: '3_2',
        themeId: 'abstract',
        title: '3.2 The Crossroads',
        brief:
          'A person standing at a fork in a road with signposts labelled "stability", "growth", "learning" and "risk".',
        questions: [
          'Q1. Which decision criteria should a graduate use when comparing two first-job opportunities?',
          'Q2. What information is missing from the scene before a sound decision can be made?',
          'Q3. How might short-term comfort conflict with long-term skill development?',
          'Q4. Create a simple decision matrix with three criteria and explain your weighting.',
          'Q5. Give advice to a friend who is stuck between two career paths without deciding for them.',
        ],
      },
      {
        id: '3.3',
        slug: '3_3',
        themeId: 'abstract',
        title: '3.3 The Domino Effect',
        brief:
          'A chain of dominoes where one small tile triggers a larger sequence, with a subtle office or project context.',
        questions: [
          'Q1. Identify one small workplace action that could create a positive chain reaction.',
          'Q2. What could interrupt the chain, and how might the team build resilience?',
          'Q3. How does this image illustrate dependencies in a project plan?',
          'Q4. Describe a leading indicator that could warn a team before a small issue spreads.',
          'Q5. Tell a 45-second story connecting one daily habit to a major career outcome.',
        ],
      },
      {
        id: '3.4',
        slug: '3_4',
        themeId: 'abstract',
        title: '3.4 The Bridge',
        brief:
          'A bridge connecting two different landscapes, with people collaborating while crossing it.',
        questions: [
          'Q1. What two groups, systems or ideas might this bridge represent in an organisation?',
          'Q2. What skills help a graduate translate technical information for a non-technical audience?',
          'Q3. Where could a communication gap create a "broken bridge" in a project?',
          'Q4. Design one practical handover routine that keeps two departments aligned.',
          'Q5. Explain the bridge metaphor in a concise opening for a team presentation.',
        ],
      },
      {
        id: '3.5',
        slug: '3_5',
        themeId: 'abstract',
        title: '3.5 The Puzzle',
        brief:
          'A nearly completed jigsaw puzzle with one missing piece, surrounded by clues such as a resume, a laptop, a team and a target.',
        questions: [
          'Q1. What could the missing piece represent in a graduate’s employability profile?',
          'Q2. How would you identify whether the gap is technical, behavioural or experiential?',
          'Q3. Which evidence could demonstrate that the missing capability has been developed?',
          'Q4. Build a four-week micro-learning plan to close one selected gap.',
          'Q5. Explain why a qualification alone may not complete the employability puzzle.',
        ],
      },
    ],
  },
  {
    id: 'placements',
    number: '04',
    title: 'PLACEMENTS',
    subtitle: 'Rehearse the moments that shape careers',
    employabilityFocus:
      'Prepare learners for interviews, group discussions, workplace communication, problem-solving and the transition from campus to work.',
    accent: 'amber',
    challenges: [
      {
        id: '4.1',
        slug: '4_1',
        themeId: 'placements',
        title: '4.1 The Interview Room',
        brief:
          'A graduate in a professional interview facing a two-person panel; a resume and a small project portfolio are visible.',
        questions: [
          'Q1. What first impression might the candidate create through posture, preparation and listening?',
          'Q2. How should the candidate answer "Tell me about yourself" using a relevant structure?',
          'Q3. Which project evidence could support a claim about problem-solving ability?',
          'Q4. How can the candidate respond honestly when asked about a skill they have not yet mastered?',
          'Q5. Create one thoughtful question the candidate could ask the interview panel at the end.',
        ],
      },
      {
        id: '4.2',
        slug: '4_2',
        themeId: 'placements',
        title: '4.2 The Group Discussion',
        brief:
          'Eight graduates seated in a circle discussing whether companies should prioritise skills over degrees.',
        questions: [
          'Q1. What would a strong opening contribution sound like without dominating the discussion?',
          'Q2. How can a participant respectfully disagree while adding evidence or an example?',
          'Q3. What behaviours show active listening during a group discussion?',
          'Q4. How could a quieter participant enter the conversation constructively?',
          'Q5. Summarise both sides of the debate before offering a balanced conclusion.',
        ],
      },
      {
        id: '4.3',
        slug: '4_3',
        themeId: 'placements',
        title: '4.3 The First-Day Workplace',
        brief:
          'A new graduate arriving at an office reception, meeting a mentor and reviewing a simple onboarding checklist.',
        questions: [
          'Q1. What are three useful questions a new joiner could ask their manager during the first week?',
          'Q2. How should the employee clarify an instruction that seems incomplete?',
          'Q3. Which professional habits help build trust during the first 30 days?',
          'Q4. What should the employee do if they finish an assigned task earlier than expected?',
          'Q5. Draft a concise introduction the graduate could use when meeting a new team.',
        ],
      },
      {
        id: '4.4',
        slug: '4_4',
        themeId: 'placements',
        title: '4.4 The Technical Challenge',
        brief:
          'A candidate at a laptop explaining a simple software solution on a whiteboard while an interviewer listens.',
        questions: [
          'Q1. How can the candidate clarify requirements before writing or explaining a solution?',
          'Q2. What is a clear way to talk through assumptions and trade-offs?',
          'Q3. How should the candidate respond when their first approach does not work?',
          'Q4. Which evidence would make the solution easier for an interviewer to evaluate?',
          'Q5. Explain the solution to a non-technical stakeholder in two plain-language sentences.',
        ],
      },
      {
        id: '4.5',
        slug: '4_5',
        themeId: 'placements',
        title: '4.5 The Career Portfolio',
        brief:
          'A graduate presenting a portfolio containing a resume, GitHub projects, certificates, internship work and a presentation.',
        questions: [
          'Q1. Which two portfolio items provide the strongest evidence of job-relevant capability, and why?',
          'Q2. How can the learner show their individual contribution to a team project?',
          'Q3. What makes a project description measurable rather than vague?',
          'Q4. What should be removed or improved if the portfolio feels crowded?',
          'Q5. Deliver a 30-second portfolio walkthrough tailored to a specific entry-level role.',
        ],
      },
    ],
  },
  {
    id: 'services',
    number: '05',
    title: 'SERVICES',
    subtitle: 'Design experiences people remember',
    employabilityFocus:
      'Build customer orientation, service recovery, stakeholder communication, process improvement and professional empathy.',
    accent: 'cyan',
    challenges: [
      {
        id: '5.1',
        slug: '5_1',
        themeId: 'services',
        title: '5.1 The Customer Support Moment',
        brief:
          'A customer speaking with a support executive about a delayed online order; the executive listens and checks the order status.',
        questions: [
          'Q1. What should the support executive acknowledge before offering a solution?',
          'Q2. Which clarifying question would reveal the customer’s most urgent need?',
          'Q3. How can the executive avoid promising a delivery time they cannot confirm?',
          'Q4. What resolution options could be offered within company policy?',
          'Q5. Write a short closing statement that confirms the next step and ownership.',
        ],
      },
      {
        id: '5.2',
        slug: '5_2',
        themeId: 'services',
        title: '5.2 The Hospital Front Desk',
        brief:
          'A busy hospital reception where a visitor is confused about registration, directions and waiting time; staff are coordinating calmly.',
        questions: [
          'Q1. Which information should staff communicate first to reduce the visitor’s uncertainty?',
          'Q2. How can the receptionist protect privacy while helping in a crowded area?',
          'Q3. What would an empathetic response sound like if the visitor becomes frustrated?',
          'Q4. Which simple sign, queue or digital update could improve the service journey?',
          'Q5. Identify one service-quality measure that matters beyond speed alone.',
        ],
      },
      {
        id: '5.3',
        slug: '5_3',
        themeId: 'services',
        title: '5.3 The Digital Banking Service',
        brief:
          'A customer using a mobile banking app sees a failed transaction message while a service agent explains safe next steps.',
        questions: [
          'Q1. What should the agent verify before discussing transaction details?',
          'Q2. Which security advice should be given without asking the customer to reveal sensitive credentials?',
          'Q3. How can the agent explain a technical failure in plain, reassuring language?',
          'Q4. What escalation information would help the next support team investigate efficiently?',
          'Q5. Create a short message that explains the next update point without guaranteeing an outcome.',
        ],
      },
      {
        id: '5.4',
        slug: '5_4',
        themeId: 'services',
        title: '5.4 The Learning Service',
        brief:
          'A student using an online learning platform struggles to find an assignment, while a mentor guides them through the process.',
        questions: [
          'Q1. At which point in the learner journey does the confusion appear to occur?',
          'Q2. How could the mentor check understanding rather than simply repeat instructions?',
          'Q3. What product or content change might prevent the same issue for future learners?',
          'Q4. How should the team balance self-service help with human support?',
          'Q5. Design a one-question feedback prompt that would reveal whether the learner is now confident.',
        ],
      },
      {
        id: '5.5',
        slug: '5_5',
        themeId: 'services',
        title: '5.5 The Hospitality Experience',
        brief:
          'A hotel front-office team welcoming guests during a busy check-in period, with one guest needing additional assistance.',
        questions: [
          'Q1. Which small details could make the welcome feel personal and professional?',
          'Q2. How should the team prioritise requests when several guests need help at once?',
          'Q3. What should staff do if a requested room is not ready?',
          'Q4. How can departments coordinate so that a promise made at reception is fulfilled?',
          'Q5. Pitch one service improvement that could increase guest trust and repeat visits.',
        ],
      },
    ],
  },
];

export const ALL_ADVANCED_CHALLENGES: AdvancedChallenge[] = ADVANCED_THEMES.flatMap(
  (t) => t.challenges
);

export const ADVANCED_BADGES: AdvancedBadgeDefinition[] = [
  {
    id: 'adv_prompt_pioneer',
    title: 'AI Visual Pioneer',
    description: 'Completed and auto-scored your first AI-Powered visual challenge.',
    criteriaLabel: 'Complete 1 Advanced Challenge',
    accent: 'blue',
    checkUnlocked: ({ completedChallenges }) => completedChallenges.length >= 1,
  },
  {
    id: 'adv_product_architect',
    title: 'Product Strategist',
    description: 'Mastered all 5 challenges in Theme 01: Products (From objects to opportunities).',
    criteriaLabel: 'Complete all 5 Products (1.1–1.5)',
    accent: 'cyan',
    checkUnlocked: ({ completedChallenges }) =>
      ['1.1', '1.2', '1.3', '1.4', '1.5'].every((id) =>
        completedChallenges.includes(id)
      ),
  },
  {
    id: 'adv_values_guardian',
    title: 'Ethics & Values Guardian',
    description: 'Mastered all 5 challenges in Theme 02: Values (Integrity, Ownership, Inclusion).',
    criteriaLabel: 'Complete all 5 Values (2.1–2.5)',
    accent: 'emerald',
    checkUnlocked: ({ completedChallenges }) =>
      ['2.1', '2.2', '2.3', '2.4', '2.5'].every((id) =>
        completedChallenges.includes(id)
      ),
  },
  {
    id: 'adv_systems_thinker',
    title: 'Abstract Systems Thinker',
    description: 'Mastered all 5 lateral metaphors in Theme 03: Abstract Thinking.',
    criteriaLabel: 'Complete all 5 Abstract (3.1–3.5)',
    accent: 'violet',
    checkUnlocked: ({ completedChallenges }) =>
      ['3.1', '3.2', '3.3', '3.4', '3.5'].every((id) =>
        completedChallenges.includes(id)
      ),
  },
  {
    id: 'adv_placement_ace',
    title: 'Placement Interview Ace',
    description: 'Mastered all 5 workplace readiness briefs in Theme 04: Placements.',
    criteriaLabel: 'Complete all 5 Placements (4.1–4.5)',
    accent: 'amber',
    checkUnlocked: ({ completedChallenges }) =>
      ['4.1', '4.2', '4.3', '4.4', '4.5'].every((id) =>
        completedChallenges.includes(id)
      ),
  },
  {
    id: 'adv_service_designer',
    title: 'Service Experience Architect',
    description: 'Mastered all 5 empathy and recovery briefs in Theme 05: Services.',
    criteriaLabel: 'Complete all 5 Services (5.1–5.5)',
    accent: 'rose',
    checkUnlocked: ({ completedChallenges }) =>
      ['5.1', '5.2', '5.3', '5.4', '5.5'].every((id) =>
        completedChallenges.includes(id)
      ),
  },
  {
    id: 'adv_boardroom_distinction',
    title: 'Boardroom Distinction',
    description: 'Achieved an elite auto-scored evaluation of 85+ marks on a challenge.',
    criteriaLabel: 'Score 85+ / 100 on any challenge',
    accent: 'amber',
    checkUnlocked: ({ maxChallengeScore }) => maxChallengeScore >= 85,
  },
  {
    id: 'adv_grand_master',
    title: 'AI Picture Connect Grandmaster',
    description: 'Completed all 25 Visual Challenges & 125 Thinking Questions across the 5 Themes.',
    criteriaLabel: 'Complete 25 / 25 Challenges',
    accent: 'emerald',
    checkUnlocked: ({ completedChallenges }) => completedChallenges.length >= 25,
  },
];

export function getAdvancedRank(advXp: number): {
  title: string;
  nextTitle?: string;
  nextXp?: number;
} {
  if (advXp >= 3000) {
    return { title: 'AI Visual Grandmaster' };
  }
  if (advXp >= 2200) {
    return { title: 'Placement Catalyst', nextTitle: 'AI Visual Grandmaster', nextXp: 3000 };
  }
  if (advXp >= 1500) {
    return { title: 'Executive Storyteller', nextTitle: 'Placement Catalyst', nextXp: 2200 };
  }
  if (advXp >= 900) {
    return { title: 'Workforce Analyst', nextTitle: 'Executive Storyteller', nextXp: 1500 };
  }
  if (advXp >= 400) {
    return { title: 'Prompt Strategist', nextTitle: 'Workforce Analyst', nextXp: 900 };
  }
  return { title: 'AI Visual Explorer', nextTitle: 'Prompt Strategist', nextXp: 400 };
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1).length;
}

function countMatchedKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((acc, kw) => (lower.includes(kw) ? acc + 1 : acc), 0);
}

/**
 * Deterministic 100-Mark Visual Boardroom Auto-Scoring Engine.
 * Evaluates prompt craft, uploaded visual evidence, and Q1-Q5 + SCARE reasoning depth.
 */
export function scoreAdvancedSubmission(input: {
  baseBrief: string;
  promptUsed: string;
  hasImage: boolean;
  answers: [string, string, string, string, string];
  scareSummary: string;
}): AutoScoreResult {
  const { baseBrief, promptUsed, hasImage, answers, scareSummary } = input;
  const combinedAnswers = answers.join(' ').trim();
  const totalWords = countWords(combinedAnswers) + countWords(scareSummary);
  const nonEmptyCount = answers.filter((a) => countWords(a) >= 4).length;

  // 1. Observation & Evidence (0 - 20)
  let obsScore = 0;
  if (hasImage) obsScore += 8; // Visual artifact uploaded
  const obsWords = countWords(answers[0]) + countWords(answers[1]);
  obsScore += Math.min(7, Math.floor(obsWords / 7));
  const obsSignals = countMatchedKeywords(combinedAnswers + ' ' + scareSummary, [
    'see',
    'visible',
    'observe',
    'detail',
    'scene',
    'clutter',
    'customer',
    'user',
    'team',
    'evidence',
    'fact',
    'shows',
    'expression',
    'context',
  ]);
  obsScore += Math.min(5, obsSignals);
  obsScore = Math.max(0, Math.min(20, obsScore));

  // 2. Reasoning & Problem-Solving (0 - 25)
  let reasonScore = 0;
  const reasonWords =
    countWords(answers[1]) + countWords(answers[2]) + countWords(answers[3]);
  reasonScore += Math.min(13, Math.floor(reasonWords / 8));
  const reasonSignals = countMatchedKeywords(combinedAnswers, [
    'because',
    'therefore',
    'however',
    'risk',
    'trade-off',
    'tradeoff',
    'challenge',
    'cause',
    'impact',
    'metric',
    'test',
    'verify',
    'privacy',
    'cost',
    'trust',
    'dependency',
    'root',
    'alternative',
    'option',
  ]);
  reasonScore += Math.min(12, reasonSignals * 2);
  reasonScore = Math.max(0, Math.min(25, reasonScore));

  // 3. Creativity & Connection (0 - 20)
  let creativityScore = 0;
  const cleanPrompt = promptUsed.trim();
  const promptDiff = cleanPrompt.length > baseBrief.trim().length + 25;
  if (cleanPrompt.length >= 40) creativityScore += 4;
  if (promptDiff) creativityScore += 4; // Customized / enriched prompt beyond default brief
  if (hasImage) creativityScore += 4;
  const creativeSignals = countMatchedKeywords(combinedAnswers + ' ' + cleanPrompt, [
    'connect',
    'metaphor',
    'insight',
    'indian',
    'campus',
    'lighting',
    'angle',
    'perspective',
    'value',
    'unique',
    'tagline',
    'story',
    'bridge',
    'habit',
    'future',
    'empathy',
  ]);
  creativityScore += Math.min(8, creativeSignals * 2);
  creativityScore = Math.max(0, Math.min(20, creativityScore));

  // 4. Practical Action (0 - 20)
  let actionScore = 0;
  const actionWords = countWords(answers[3]) + countWords(answers[4]);
  actionScore += Math.min(10, Math.floor(actionWords / 6));
  const actionSignals = countMatchedKeywords(combinedAnswers + ' ' + scareSummary, [
    'will',
    'should',
    'recommend',
    'pilot',
    'step',
    'measure',
    'days',
    'weekly',
    'daily',
    'check',
    'confirm',
    'escalate',
    'review',
    'plan',
    'action',
    'solution',
    'deliver',
    'improve',
  ]);
  actionScore += Math.min(10, actionSignals * 2);
  actionScore = Math.max(0, Math.min(20, actionScore));

  // 5. Professional Communication & Completeness (0 - 15)
  let commScore = nonEmptyCount * 2; // Up to 10 marks for answering all 5 questions substantively
  if (countWords(scareSummary) >= 15) commScore += 3;
  else if (countWords(scareSummary) >= 5) commScore += 1;
  if (totalWords >= 90) commScore += 2;
  commScore = Math.max(0, Math.min(15, commScore));

  const totalScore = Math.max(
    0,
    Math.min(100, obsScore + reasonScore + creativityScore + actionScore + commScore)
  );

  let gradeLabel = 'Needs Stronger Evidence';
  if (totalScore >= 85) gradeLabel = 'Boardroom Distinction';
  else if (totalScore >= 70) gradeLabel = 'Industry Ready';
  else if (totalScore >= 50) gradeLabel = 'Developing Practitioner';

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hasImage) strengths.push('uploaded visual artifact');
  else improvements.push('upload your generated/curated image (+12 rubric marks)');

  if (promptDiff) strengths.push('customized AI prompt craft');
  else improvements.push('enrich the AI prompt with lighting, setting, or Master Add-On');

  if (nonEmptyCount === 5) strengths.push('all 5 thinking questions answered');
  else improvements.push(`complete all 5 questions with concrete examples (${nonEmptyCount}/5 substantial)`);

  if (countWords(scareSummary) >= 15) strengths.push('structured SCARE presentation');
  else improvements.push('add a crisp 45-second SCARE summary (See–Connect–Analyse–Respond–Express)');

  const feedback = [
    `${gradeLabel} (${totalScore}/100).`,
    strengths.length > 0 ? `Strengths: ${strengths.join(', ')}.` : '',
    improvements.length > 0 ? `Next level boost: ${improvements.join('; ')}.` : 'All dimensions meet placement-ready standard!',
  ]
    .filter(Boolean)
    .join(' ')
    .slice(0, 780);

  return {
    totalScore,
    obsScore,
    reasonScore,
    creativityScore,
    actionScore,
    commScore,
    gradeLabel,
    feedback,
  };
}

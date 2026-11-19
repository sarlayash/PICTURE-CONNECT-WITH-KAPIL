import caseFintechOutage from '../assets/images/case_fintech_outage_1795091210335.jpg';
import caseEvBatteryRecall from '../assets/images/case_ev_battery_recall_1795091209858.jpg';
import caseHospitalTriageAi from '../assets/images/case_hospital_triage_ai_1795091210462.jpg';
import caseSaasChurnWarroom from '../assets/images/case_saas_churn_warroom_1795091210363.jpg';
import caseCampusPlacementPanel from '../assets/images/case_campus_placement_panel_1795091211941.jpg';

export type CaseFieldKey =
  | 'c1a'
  | 'c1b'
  | 'c1c'
  | 'c2a'
  | 'c2b'
  | 'c2c'
  | 'c3a'
  | 'c3b'
  | 'c3c'
  | 'c4a'
  | 'c4b'
  | 'c4c'
  | 'c5a'
  | 'c5b'
  | 'c5c';

export interface FinalMcqQuestion {
  id: string;
  trackSource: 'Normal Track · 50% Hard' | 'AI Advanced Track · 50% Hard';
  scenario: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  rationale: string;
}

export interface FinalCaseQuestion {
  fieldKey: CaseFieldKey;
  label: string;
  prompt: string;
  keywords: string[];
}

export interface FinalCaseStudy {
  id: string;
  number: string;
  title: string;
  trackBlend: string;
  companyContext: string;
  imageSrc: string;
  imageAlt: string;
  scenarioBrief: string;
  quantitativeConstraints: [string, string, string];
  questions: [FinalCaseQuestion, FinalCaseQuestion, FinalCaseQuestion];
}

export interface FinalGradeResult {
  mcqScore: number; // 0..400
  caseScore: number; // 0..500
  scareScore: number; // 0..100
  totalXpAwarded: number; // 0..1000
  percentageScore: number; // 0..100
  passed: boolean;
  gradeTier: string;
  perCaseScores: number[]; // 5 numbers, each 0..100
  mcqCorrectCount: number;
  executiveFeedback: string;
}

export const FINAL_ASSESSMENT_META = {
  title: 'FINAL ASSESSMENT · 1000 XP PROCTORED CAPSTONE',
  subtitle: 'Normal Track + AI Advanced Track · 50% Elevated Rigor',
  durationMinutes: 90,
  durationSeconds: 5400,
  totalXpPool: 1000,
  passingXp: 600,
  poweredBy: 'POWERED BY KAPIL',
  description:
    'A timed 90-minute placement evaluation blending 50% harder, non-repeated executive dilemmas across Normal Track (Levels 1–10) and AI Advanced Track (5 Themes), featuring 5 new real-world visual case studies, automatic 1000 XP grading, Official Final Certificate, and downloadable PDF Letter of Recommendation (LOR) for campus & corporate placements.',
};

export const FINAL_MCQS: FinalMcqQuestion[] = [
  {
    id: 'mcq_1',
    trackSource: 'Normal Track · 50% Hard',
    scenario:
      'During a high-stakes client workshop, a teammate says: "Three users sighed when opening the checkout page, so our payment gateway code is definitely broken."',
    question:
      'Applying Picture Connect’s strict Observation vs. Assumption discipline, what is the critical flaw in this claim?',
    options: [
      'A sigh is an observable behaviour, whereas "gateway code is broken" is an untested causal inference requiring system telemetry before action.',
      'User sighs only indicate visual typography preferences and never relate to checkout friction.',
      'The team should immediately roll back the entire frontend release before reviewing logs.',
      'Three users represent statistical significance, so code refactoring should begin without audit.',
    ],
    correctIndex: 0,
    rationale:
      'Strong visual and workplace intelligence separates visible facts (user hesitation/sigh) from unverified root causes until telemetry or usability testing confirms the bottleneck.',
  },
  {
    id: 'mcq_2',
    trackSource: 'Normal Track · 50% Hard',
    scenario:
      'An enterprise prospect tells you during your final pitch: "Your productivity tool costs 35% more than a standard generic alternative with the same checklist."',
    question:
      'Which value-proposition defense turns this price objection into an executive outcome?',
    options: [
      'Offer an immediate 40% discount in week one to win the logo regardless of unit economics.',
      'Contrast upfront license cost against total cost of rework, onboarding delay, and measurable team hours saved over 90 days.',
      'Avoid discussing cost and list five extra unreleased UI icons.',
      'Agree that both tools are identical and ask the prospect to pick based on brand aesthetics.',
    ],
    correctIndex: 1,
    rationale:
      'Value-based positioning anchors price against quantified operational risk and measurable ROI rather than racing to the bottom on margin.',
  },
  {
    id: 'mcq_3',
    trackSource: 'Normal Track · 50% Hard',
    scenario:
      'A senior stakeholder rejects your cross-team rollout proposal abruptly in front of peers, stating your timeline is "completely detached from reality."',
    question:
      'Which response demonstrates Level 8 Empathy + Level 9 Boardroom Composure?',
    options: [
      'Pause, validate their delivery-risk concern, ask which specific dependency feels tightest, and propose a 2-week phased pilot metric.',
      'Defend your slide deck line by line until the stakeholder retracts their comment.',
      'Stay silent in the meeting and send a 900-word email afterwards defending every assumption.',
      'Drop the initiative immediately so team morale stays comfortable.',
    ],
    correctIndex: 0,
    rationale:
      'Constructive composure acknowledges the stakeholder’s legitimate constraint first, isolates the exact dependency, and converts friction into a bounded experiment.',
  },
  {
    id: 'mcq_4',
    trackSource: 'Normal Track · 50% Hard',
    scenario:
      'Using the 10%/90% Iceberg principle on a SaaS support team whose Average Handle Time (AHT) spiked 42% in one quarter:',
    question:
      'Which diagnostic check uncovers the submerged 90% rather than merely treating surface symptoms?',
    options: [
      'Mandate that every support agent ends customer calls strictly under 4 minutes.',
      'Correlate repeat ticket spikes against recent product releases, broken self-service articles, and unclear handoff notes from onboarding.',
      'Remove the feedback survey after calls so dissatisfaction metrics look calmer.',
      'Hire temporary staff without analyzing why ticket volume doubled.',
    ],
    correctIndex: 1,
    rationale:
      'Artificially capping call duration hides root causes. Tracing repeat tickets to upstream product/documentation defects resolves the systemic bottleneck.',
  },
  {
    id: 'mcq_5',
    trackSource: 'Normal Track · 50% Hard',
    scenario:
      'You are stepping in as interim turnaround lead with 4 months of cash runway, slipping NPS (-12), and 3 competing feature requests from sales.',
    question:
      'Which boardroom prioritization rule reflects disciplined CEO thinking?',
    options: [
      'Start all three features simultaneously so every sales rep feels heard.',
      'Freeze non-core scope, stabilize core reliability defects hurting retention first, and tie one high-confidence experiment to a 30-day revenue retention metric.',
      'Rebrand the company visual identity before fixing existing customer outages.',
      'Delegate turnaround metrics exclusively to junior interns while leadership plans next year’s conference.',
    ],
    correctIndex: 1,
    rationale:
      'Under constrained runway, retention leaks destroy acquisition ROI; stabilizing core value and committing to one measurable 30-day loop preserves survival and trust.',
  },
  {
    id: 'mcq_6',
    trackSource: 'AI Advanced Track · 50% Hard',
    scenario:
      'When generating an AI scene for a workplace ethics assessment in ChatGPT or Gemini, your first image contains illegible gibberish text on a laptop screen and stock stereotypes.',
    question:
      'Which prompt-engineering revision strictly aligns with the Master Image-Prompt Add-On?',
    options: [
      'Add bold neon captions summarizing the moral lesson across the top of the image.',
      'Specify realistic Indian/global office lighting, natural human expressions, purposeful visual clues on paper/screen geometry, and explicitly prohibit text, logos, watermarks, and stereotypes.',
      'Let AI invent both the image and all five reflection answers for your workbook.',
      'Keep the distorted image as-is because visual clarity does not affect workplace interpretation.',
    ],
    correctIndex: 1,
    rationale:
      'Purposeful composition without text, logos, or stereotypes forces genuine visual observation and supports nuanced multi-perspective interpretation.',
  },
  {
    id: 'mcq_7',
    trackSource: 'AI Advanced Track · 50% Hard',
    scenario:
      'A manager alters a minor client KPI by 2% to avoid an awkward escalation, and simultaneously a customer CSV lands in an internal project chat channel with 18 unrelated colleagues.',
    question:
      'Which dual Values action (2.1 Integrity + 2.4 Confidentiality) is non-negotiable?',
    options: [
      'Ignore the 2% shift as rounding noise, and keep the CSV in chat since everyone works at the same company.',
      'Verify raw source data privately before raising the KPI discrepancy calmly; immediately request removal of the customer CSV, log the incident, and enforce least-privilege access.',
      'Announce both issues aggressively in the public all-hands channel before checking any logs.',
      'Download a personal backup copy of the CSV onto your private phone for evidence.',
    ],
    correctIndex: 1,
    rationale:
      'Ethical governance requires factual verification prior to respectful escalation on reporting integrity, and immediate containment + least-privilege access for PII.',
  },
  {
    id: 'mcq_8',
    trackSource: 'AI Advanced Track · 50% Hard',
    scenario:
      'Two departments (Engineering & Customer Success) keep missing launch promises due to late scope surprises—creating a "Broken Bridge" and negative Domino Effect.',
    question:
      'Which combination of Leading Indicator + Handover Routine eliminates silent dependency failures?',
    options: [
      'Review missed deadlines once per quarter after customer churn reports arrive.',
      'Track "percentage of specs frozen 72h before sprint lock" as a leading indicator paired with a shared sign-off checklist covering edge cases and rollback owners.',
      'Cancel cross-team syncs completely so engineers can write code uninterrupted.',
      'Send Slack reactions instead of documenting API or customer-SLA changes.',
    ],
    correctIndex: 1,
    rationale:
      'Leading indicators warn teams before lagging customer damage hits; structured pre-handoff checklists keep cross-functional bridges intact.',
  },
  {
    id: 'mcq_9',
    trackSource: 'AI Advanced Track · 50% Hard',
    scenario:
      'During a live technical placement interview, your primary API approach hits an unexpected edge-case failure on the whiteboard while the interviewer watches closely.',
    question:
      'Which candidate response scores highest on Technical Challenge & Career Portfolio standards?',
    options: [
      'Blame the interviewer’s question phrasing and switch topics to your college CGPA.',
      'Acknowledge the failure boundary calmly, isolate why the edge case broke (e.g., null state / complexity bound), propose a fallback fix, and translate the trade-off clearly.',
      'Erase the whiteboard quickly and hope the interviewer forgets the edge case.',
      'Claim you solved a similar problem once before without sharing architecture details.',
    ],
    correctIndex: 1,
    rationale:
      'Interviewers evaluate debugging composure, boundary awareness, honest trade-off reasoning, and clarity under pressure.',
  },
  {
    id: 'mcq_10',
    trackSource: 'AI Advanced Track · 50% Hard',
    scenario:
      'A mobile-banking customer contacts support after a failed ₹24,000 rent transfer shows "Debited, Processing Timeout" minutes before their landlord deadline.',
    question:
      'Which service-recovery statement respects Digital Banking SLA & Empathy discipline?',
    options: [
      'Ask the customer for their 6-digit UPI PIN to inspect the gateway personally and promise funds will arrive within 10 minutes.',
      'Verify identity safely without credentials, acknowledge the urgency calmly, cite the official auto-reversal window without fabricating an unconfirmed instant guarantee, and provide a tracked escalation reference.',
      'Tell the customer it is a routine server error and disconnect the chat to keep handle time low.',
      'Guarantee a manual refund within 30 seconds even though settlement reconciliation runs on a 24-hour banking cycle.',
    ],
    correctIndex: 1,
    rationale:
      'Trustworthy service recovery pairs genuine empathy with strict security hygiene (never ask for PIN/OTP) and honest, verifiable SLA commitments.',
  },
];

export const FINAL_CASE_STUDIES: FinalCaseStudy[] = [
  {
    id: 'case_1',
    number: 'CASE 01',
    title: 'Midnight UPI Settlement Latency War-Room',
    trackBlend: 'Normal Level 4 Audit + Advanced Services 5.3 & Values 2.1',
    companyContext: 'PayPulse FinTech · Festival Sale Traffic Surge (11:42 PM IST)',
    imageSrc: caseFintechOutage,
    imageAlt:
      'Modern fintech war-room at night with engineers and product lead reviewing latency graphs across laptops',
    scenarioBrief:
      'At 11:42 PM during peak festive checkout volume, retry requests jump 4.2x and 3.8% of small-merchant settlements stall in "Pending" for over 18 minutes. A nervous junior stakeholder suggests temporarily hiding the live incident banner on the merchant portal until morning so brand sentiment stays clean. Inspect the war-room scene and resolve the crisis.',
    quantitativeConstraints: [
      '4.2x Retry Spike · 3.8% Pending Settlements',
      '₹14.6 Cr Hourly Merchant GMV at Risk',
      '18+ Min Settlement Confirmation Delay',
    ],
    questions: [
      {
        fieldKey: 'c1a',
        label: '1A. Visual Evidence & Hidden Risk Separation',
        prompt:
          'Separating what is visibly observable in the war-room scene from operational assumptions, what 3 immediate telemetry checks must the team verify before blaming the payment bank partner?',
        keywords: [
          'observe',
          'visible',
          'verify',
          'retry',
          'log',
          'latency',
          'queue',
          'database',
          'timeout',
          'fact',
          'data',
        ],
      },
      {
        fieldKey: 'c1b',
        label: '1B. Ethical Governance & SLA Communication',
        prompt:
          'Evaluate the suggestion to hide the incident banner until morning. How should the lead respond internally, and write a 2-sentence merchant-facing status update that preserves trust without making an unconfirmed ETA guarantee?',
        keywords: [
          'trust',
          'transparent',
          'honest',
          'merchant',
          'hide',
          'ethics',
          'sla',
          'update',
          'eta',
          'reconcile',
          'safe',
        ],
      },
      {
        fieldKey: 'c1c',
        label: '1C. Immediate Mitigation & Prevention Gate',
        prompt:
          'Propose one technical/process circuit-breaker for tonight (next 2 hours) and one measurable prevention metric to audit before the next sale peak.',
        keywords: [
          'backoff',
          'rate',
          'limit',
          'circuit',
          'alert',
          'queue',
          'metric',
          'monitor',
          'retry',
          'rollback',
          'test',
        ],
      },
    ],
  },
  {
    id: 'case_2',
    number: 'CASE 02',
    title: 'EV Battery Thermal Anomaly Before Fleet Dispatch',
    trackBlend: 'Normal Level 5 CEO & Level 7 Pitch + Advanced Products 1.2 & Values 2.2',
    companyContext: 'VoltGrid Mobility · 48 Hours Before 500-Scooter Enterprise Handover',
    imageSrc: caseEvBatteryRecall,
    imageAlt:
      'Electric vehicle battery inspection bay with thermal imaging tablet showing localized cell hotspot',
    scenarioBrief:
      'During final quality sign-off, thermal imaging detects a localized +6°C hotspot along one busbar joint inside Batch #408 battery modules (affecting ~0.4% probability under 42°C summer fast-charging). Commercial sales warns that delaying Friday’s 500-unit corporate fleet delivery triggers a ₹18 lakh late penalty and headlines.',
    quantitativeConstraints: [
      '+6°C Hotspot · 0.4% Fast-Charge Risk',
      '48 Hours to 500-Unit Fleet Dispatch',
      '₹18 Lakh Delay Penalty vs Field Recall Risk',
    ],
    questions: [
      {
        fieldKey: 'c2a',
        label: '2A. Executive Trade-Off & Risk Matrix',
        prompt:
          'Compare the 90-day financial, safety, and brand equity trade-off between shipping Batch #408 with a firmware charge-cap vs. holding dispatch for targeted busbar inspection. Which decision do you own and why?',
        keywords: [
          'safety',
          'risk',
          'cost',
          'recall',
          'brand',
          'trust',
          'delay',
          'firmware',
          'inspect',
          'trade-off',
          'customer',
        ],
      },
      {
        fieldKey: 'c2b',
        label: '2B. Ownership Communication to the Fleet Buyer',
        prompt:
          'Draft a confident, non-defensive executive briefing message to the enterprise fleet buyer explaining the delay or phased batch split while turning rigorous QA into long-term credibility.',
        keywords: [
          'phased',
          'batch',
          'quality',
          'transparent',
          'schedule',
          'owner',
          'confirm',
          'fleet',
          'deliver',
          'safety',
          'trust',
        ],
      },
      {
        fieldKey: 'c2c',
        label: '2C. Engineering & Process Success Metric',
        prompt:
          'Define one measurable manufacturing gate metric and one 30-day field telemetry check that ensures Batch #409 never repeats this thermal variance.',
        keywords: [
          'metric',
          'threshold',
          'thermal',
          'sensor',
          'audit',
          'zero',
          'defect',
          'percent',
          'days',
          'monitor',
          'checklist',
        ],
      },
    ],
  },
  {
    id: 'case_3',
    number: 'CASE 03',
    title: 'Metro Hospital Digital Triage & Privacy Bottleneck',
    trackBlend: 'Normal Level 8 Empathy + Advanced Services 5.2 & Values 2.4',
    companyContext: 'CareFirst Multi-Specialty Hub · Post-Kiosk Launch Audit',
    imageSrc: caseHospitalTriageAi,
    imageAlt:
      'Hospital digital reception coordinator calmly assisting an elderly visitor with tablet triage',
    scenarioBrief:
      'Two weeks after introducing self-service registration kiosks to cut costs, peak OPD waiting time paradoxically jumped from 14 minutes to 47 minutes. Elderly and first-time visitors abandon the touchscreens, crowd the stone reception desk loudly, and staff ask clinical symptoms aloud in earshot of 25 waiting strangers.',
    quantitativeConstraints: [
      'Wait Time Rose 14m -> 47m (+235%)',
      '61% Senior Visitor Kiosk Abandonment',
      'Zero Extra Staffing Budget This Quarter',
    ],
    questions: [
      {
        fieldKey: 'c3a',
        label: '3A. Human-Centered Service Failure Diagnosis',
        prompt:
          'From the visual scene and constraints, pinpoint why adding faster digital kiosks paradoxically increased wait time AND harmed visitor dignity. Whose needs were overlooked during design?',
        keywords: [
          'elderly',
          'accessibility',
          'language',
          'privacy',
          'anxiety',
          'bottleneck',
          'queue',
          'human',
          'empathy',
          'overlooked',
          'confusion',
        ],
      },
      {
        fieldKey: 'c3b',
        label: '3B. Zero-Headcount Privacy & Flow Redesign',
        prompt:
          'Design a practical dual-lane workflow (Digital + Assisted) and acoustic/screen privacy fix the reception team can deploy tomorrow morning with zero new hiring.',
        keywords: [
          'lane',
          'triage',
          'privacy',
          'token',
          'sms',
          'quiet',
          'card',
          'signage',
          'assisted',
          'desk',
          'volunteer',
        ],
      },
      {
        fieldKey: 'c3c',
        label: '3C. Empathetic De-Escalation Script & Quality KPI',
        prompt:
          'Write a 2-sentence empathetic response for a frustrated elderly visitor, and name one service-quality metric beyond raw speed that hospital leadership should track weekly.',
        keywords: [
          'understand',
          'help',
          'clarify',
          'comfort',
          'resolution',
          'first-contact',
          'privacy',
          'satisfaction',
          'csat',
          'abandonment',
          'confidence',
        ],
      },
    ],
  },
  {
    id: 'case_4',
    number: 'CASE 04',
    title: 'Enterprise SaaS Day-30 Churn Divergence',
    trackBlend: 'Normal Level 9 Boardroom + Advanced Abstract 3.1/3.4 & Products 1.4',
    companyContext: 'FlowStack B2B SaaS · Q3 Executive Review',
    imageSrc: caseSaasChurnWarroom,
    imageAlt:
      'Executive SaaS boardroom with diverging retention chart and cross-functional dependency cards',
    scenarioBrief:
      'New enterprise trials surged +38% QoQ after an aggressive sales sprint, yet Day-30 active account retention plunged from 74% to 51% (shown by the diverging wall curves). Sales insists onboarding complexity drives churn; Product counters that account executives promise bespoke ERP connectors that do not exist in the MVP.',
    quantitativeConstraints: [
      '+38% New Trial Volume QoQ',
      'Day-30 Retention Dropped 74% -> 51%',
      'Average Time-to-First-Value = 21 Days',
    ],
    questions: [
      {
        fieldKey: 'c4a',
        label: '4A. "Broken Bridge" Systems Analysis',
        prompt:
          'Using the Bridge & Domino Effect mental models, diagnose how misaligned incentives between Sales and Product trigger the retention plunge visible on the boardroom screen.',
        keywords: [
          'incentive',
          'expectation',
          'gap',
          'sales',
          'product',
          'bridge',
          'onboarding',
          'promise',
          'domino',
          'trust',
          'alignment',
        ],
      },
      {
        fieldKey: 'c4b',
        label: '4B. Cross-Department Handover Protocol',
        prompt:
          'Architect one concrete 48-hour Sales-to-Onboarding handover routine (and non-negotiable MVP scope guardrail) that aligns both teams without slowing deal velocity.',
        keywords: [
          'checklist',
          'handover',
          'scope',
          'sla',
          'kickoff',
          'sign-off',
          'mvp',
          'template',
          'integration',
          'owner',
          'weekly',
        ],
      },
      {
        fieldKey: 'c4c',
        label: '4C. 30-Day A/B Onboarding Experiment',
        prompt:
          'Propose one focused onboarding A/B experiment aimed at cutting Time-to-First-Value from 21 days to under 5 days, specifying control vs. variant and primary leading indicator.',
        keywords: [
          'experiment',
          'variant',
          'control',
          'activation',
          'metric',
          'day',
          'template',
          'sample',
          'percentage',
          'retention',
          'test',
        ],
      },
    ],
  },
  {
    id: 'case_5',
    number: 'CASE 05',
    title: 'Tier-1 Final Placement Panel Defense',
    trackBlend: 'Normal Level 2/3 Story + Advanced Placements 4.1/4.4/4.5',
    companyContext: 'Apex Global Hiring Assessment · Final Panel Round (3 Assessors)',
    imageSrc: caseCampusPlacementPanel,
    imageAlt:
      'Graduate candidate calmly presenting project architecture portfolio to a three-member hiring panel',
    scenarioBrief:
      'In the final placement interview pictured above, a candidate wrote on their resume: "Worked in a 4-person team to build an AI productivity app that improved efficiency." The Engineering Lead immediately asks for exact individual ownership, baseline numbers, and why one module failed during stress testing.',
    quantitativeConstraints: [
      '3-Assessor Panel (Eng · HR · Strategy)',
      '12-Minute Portfolio Audit Window',
      'Must Prove Individual Impact + Poise',
    ],
    questions: [
      {
        fieldKey: 'c5a',
        label: '5A. Converting Vague Claims into Measurable Proof',
        prompt:
          'Rewrite that generic resume bullet into a crisp, verifiable STAR/impact statement highlighting specific individual contribution, technical mechanism, and a believable before/after metric.',
        keywords: [
          'built',
          'owned',
          'reduced',
          'latency',
          'percent',
          'from',
          'to',
          'users',
          'designed',
          'measured',
          'benchmark',
        ],
      },
      {
        fieldKey: 'c5b',
        label: '5B. Honest Technical Failure & Growth Defense',
        prompt:
          'Draft how the candidate should respond honestly when the panel exposes an edge-case bug or unmastered skill—demonstrating accountability, root-cause thinking, and a concrete upskilling plan.',
        keywords: [
          'honest',
          'edge',
          'root',
          'learned',
          'fix',
          'test',
          'plan',
          'week',
          'accountability',
          'feedback',
          'gap',
        ],
      },
      {
        fieldKey: 'c5c',
        label: '5C. Executive Closing Hook & Reverse Question',
        prompt:
          'Write a memorable 2-sentence portfolio closing tailored to an entry-level analyst/engineer role PLUS one sharp question the candidate should ask the panel in the final minute.',
        keywords: [
          'impact',
          'first',
          '90',
          'days',
          'team',
          'metric',
          'role',
          'learn',
          'deliver',
          'success',
          'question',
        ],
      },
    ],
  },
];

export const FINAL_SCARE_PROMPT = {
  title: 'Part C · 60-Second Executive Placement Defense (S-C-A-R-E Synthesis · 100 XP)',
  instruction:
    'In the final round before a Hiring Director, pick ONE decision from any of the 5 case studies above and deliver a complete 60-second executive recommendation explicitly weaving together S (See the visible evidence), C (Connect the Normal & AI Advanced principles), A (Analyse risks & trade-offs), R (Recommend measurable next steps), and E (Express a concise outcome tailored to your target placement role).',
};

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1).length;
}

function countKeywordHits(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((acc, kw) => (lower.includes(kw) ? acc + 1 : acc), 0);
}

export function gradeFinalAssessment(input: {
  mcqAnswers: number[];
  caseResponses: Record<CaseFieldKey, string>;
  capstoneScare: string;
}): FinalGradeResult {
  const { mcqAnswers, caseResponses, capstoneScare } = input;

  // 1. Score Part A: 10 Non-Repeated Hard MCQs (40 XP each = 400 XP)
  let mcqCorrectCount = 0;
  FINAL_MCQS.forEach((q, idx) => {
    if (mcqAnswers[idx] === q.correctIndex) {
      mcqCorrectCount += 1;
    }
  });
  const mcqScore = mcqCorrectCount * 40; // 0..400

  // 2. Score Part B: 5 Real Case Studies (100 XP each = 500 XP)
  const perCaseScores: number[] = FINAL_CASE_STUDIES.map((cs) => {
    let casePts = 0;
    cs.questions.forEach((q) => {
      const ans = (caseResponses[q.fieldKey] || '').trim();
      const words = countWords(ans);
      if (words === 0) return;

      // Length & analytical substance (up to 18 pts per question -> 54 per case)
      let qScore = 0;
      if (words >= 35) qScore += 18;
      else if (words >= 20) qScore += 14;
      else if (words >= 10) qScore += 9;
      else if (words >= 4) qScore += 4;

      // Relevant domain reasoning signals (up to 15 pts per question -> 45 per case)
      const kwHits = countKeywordHits(ans, q.keywords);
      qScore += Math.min(15, kwHits * 3);

      // Bonus +1 on last question to round max cleanly to 33+33+34 = 100
      casePts += qScore;
    });

    // Small completeness bonus if all 3 sub-questions of the case study have >= 12 words
    const allThreeSubstantial = cs.questions.every(
      (q) => countWords(caseResponses[q.fieldKey] || '') >= 12
    );
    if (allThreeSubstantial) casePts += 4;

    return Math.max(0, Math.min(100, casePts));
  });

  const caseScore = perCaseScores.reduce((sum, s) => sum + s, 0); // 0..500

  // 3. Score Part C: Final S-C-A-R-E Executive Placement Defense (100 XP)
  const scareWords = countWords(capstoneScare);
  let scareScore = 0;
  if (scareWords >= 75) scareScore += 50;
  else if (scareWords >= 45) scareScore += 38;
  else if (scareWords >= 20) scareScore += 22;
  else if (scareWords >= 6) scareScore += 10;

  const scareStructureSignals = countKeywordHits(capstoneScare, [
    'see',
    'visible',
    'observe',
    'connect',
    'analyse',
    'analyze',
    'risk',
    'trade-off',
    'recommend',
    'respond',
    'measure',
    'metric',
    'express',
    'impact',
    'outcome',
    'days',
  ]);
  scareScore += Math.min(50, scareStructureSignals * 7);
  scareScore = Math.max(0, Math.min(100, scareScore));

  const totalXpAwarded = Math.max(
    0,
    Math.min(1000, mcqScore + caseScore + scareScore)
  );
  const percentageScore = Math.round((totalXpAwarded / 1000) * 100);
  const passed = totalXpAwarded >= FINAL_ASSESSMENT_META.passingXp;

  let gradeTier = 'Needs Review (<600 XP)';
  if (totalXpAwarded >= 850) gradeTier = 'Distinction · Placement Ready';
  else if (totalXpAwarded >= 720) gradeTier = 'Merit · Industry Capable';
  else if (totalXpAwarded >= 600) gradeTier = 'Certified · Foundational Mastery';

  const weakestCaseIdx = perCaseScores.indexOf(Math.min(...perCaseScores));
  const strongestCaseIdx = perCaseScores.indexOf(Math.max(...perCaseScores));

  const feedbackParts = [
    `${gradeTier} (${totalXpAwarded}/1000 XP · ${percentageScore}%).`,
    `Diagnostics: ${mcqCorrectCount}/10 (${mcqScore}/400 XP).`,
    `Case Studies: ${caseScore}/500 XP (Strongest: Case 0${strongestCaseIdx + 1}; Priority review: Case 0${weakestCaseIdx + 1}).`,
    `SCARE Defense: ${scareScore}/100 XP.`,
    passed
      ? 'Qualified for Official Final Assessment Certificate and Personalized Placement LOR (PDF).'
      : 'Score below 600 XP threshold; review highlighted case trade-offs and MCQ rationales with your mentor.',
  ];

  return {
    mcqScore,
    caseScore,
    scareScore,
    totalXpAwarded,
    percentageScore,
    passed,
    gradeTier,
    perCaseScores,
    mcqCorrectCount,
    executiveFeedback: feedbackParts.join(' ').slice(0, 980),
  };
}

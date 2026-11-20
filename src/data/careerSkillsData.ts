import indianismImg from '../assets/images/indianism_global_english_1795156086055.jpg';
import interviewImg from '../assets/images/interview_skills_panel_1795156085569.jpg';
import gdImg from '../assets/images/gd_skills_roundtable_1795156086746.jpg';

export type CareerCategoryId = 'indianism' | 'interview' | 'gd';

export interface CareerStudyCard {
  id: string;
  category: CareerCategoryId;
  tag: string;
  beforeOrPrompt: string;
  afterOrFramework: string;
  takeaway: string;
}

export interface CareerMcq {
  id: string;
  category: CareerCategoryId;
  topic: string;
  difficulty: 'Core' | 'Applied' | 'Executive';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  hint: string;
  explanation: string;
  xpClean: number;
  xpWithHint: number;
}

export interface CareerCategoryDefinition {
  id: CareerCategoryId;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
}

export interface CareerBadgeDefinition {
  id: string;
  title: string;
  description: string;
  criteriaLabel: string;
  accent: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'cyan';
  checkUnlocked: (stats: {
    indianismCorrect: number;
    interviewCorrect: number;
    gdCorrect: number;
    totalAnswered: number;
    totalCorrect: number;
    cleanCorrect: number;
    studiedCount: number;
  }) => boolean;
}

export const CAREER_SKILLS_META = {
  title: 'Career & Placement MCQ Academy',
  subtitle: 'Indianism · Interview Skills · GD Skills (45 Graded MCQs)',
  poweredBy: 'POWERED BY KAPIL',
  description:
    'Sharpen placement-critical communication across Global Business English (eliminating Indianisms), Executive Interview Skills, and Group Discussion (GD) Leadership—complete with visual playbooks, 45 hinted MCQs, instant rationales, XP ranks, 6 PNG Badges, and an Official PNG Certificate.',
};

export const CAREER_SKILL_CATEGORIES: CareerCategoryDefinition[] = [
  {
    id: 'indianism',
    number: '01.',
    title: 'Indianism & Global Business English',
    shortTitle: 'Indianism',
    subtitle: 'Eliminate Redundancies · Crisp Global Corporate Clarity',
    description:
      'Replace common regional English literal translations ("revert back", "prepone", "myself", "do the needful") with natural, crisp international workplace phrasing.',
    image: indianismImg,
    imageAlt:
      'Young professional presenting crisp global business communication strategies in a sunlit studio office',
    highlights: [
      '12 Before/After Indianism Playbooks',
      '15 Placement Grammar & Usage MCQs',
      'Email & Interview Polish Tips',
    ],
  },
  {
    id: 'interview',
    number: '02.',
    title: 'Interview Skills & Executive Presence',
    shortTitle: 'Interview Skills',
    subtitle: 'STAR Storytelling · Panel Diplomacy · Confidence Under Pressure',
    description:
      'Master structured self-introductions, behavioral STAR answers, authentic weakness framing, virtual/boardroom etiquette, salary diplomacy, and smart reverse questions.',
    image: interviewImg,
    imageAlt:
      'Poised job candidate speaking confidently with a two-person corporate hiring panel across a glass boardroom table',
    highlights: [
      '8 Executive Interview Frameworks',
      '15 Scenario-Based Panel MCQs',
      'STAR & Trap-Question Rationales',
    ],
  },
  {
    id: 'gd',
    number: '03.',
    title: 'GD Skills (Group Discussion Mastery)',
    shortTitle: 'GD Skills',
    subtitle: 'PESTLE Structuring · Polite Entry · Collaborative Leadership',
    description:
      'Stand out in campus & corporate Group Discussions without shouting—learn PESTLE & PREP frameworks, assertive entry phrases, active piggybacking, and crisp closing summaries.',
    image: gdImg,
    imageAlt:
      'Six university placement candidates engaged in a structured collaborative group discussion around a circular seminar table',
    highlights: [
      '8 Group Discussion Leadership Playbooks',
      '15 High-Impact GD Strategy MCQs',
      'Fish-Market & Summary Tactics',
    ],
  },
];

export const CAREER_STUDY_CARDS: CareerStudyCard[] = [
  // Indianism (12 study cards)
  {
    id: 'st_ind_01',
    category: 'indianism',
    tag: 'Redundancy',
    beforeOrPrompt: 'Avoid: "Please revert back to my email."',
    afterOrFramework: 'Use: "Please reply to my email" or "Please get back to me."',
    takeaway: '"Revert" means to return to a former state, and "back" is redundant. Global recruiters expect "reply" or "respond".',
  },
  {
    id: 'st_ind_02',
    category: 'indianism',
    tag: 'Self-Introduction',
    beforeOrPrompt: 'Avoid: "Myself Rohan Sharma from Jodhpur."',
    afterOrFramework: 'Use: "I am Rohan Sharma from Jodhpur" or "My name is Rohan Sharma."',
    takeaway: 'Never begin a sentence with a reflexive pronoun ("Myself") as the subject—it immediately lowers first-impression polish.',
  },
  {
    id: 'st_ind_03',
    category: 'indianism',
    tag: 'Vocabulary',
    beforeOrPrompt: 'Avoid: "Can we prepone the interview to 2 PM?"',
    afterOrFramework: 'Use: "Can we move the interview forward to 2 PM?" or "reschedule it earlier?"',
    takeaway: '"Prepone" is rarely understood outside South Asia. Use "bring forward" or "move earlier" for global teams.',
  },
  {
    id: 'st_ind_04',
    category: 'indianism',
    tag: 'Email Clarity',
    beforeOrPrompt: 'Avoid: "Kindly do the needful at the earliest."',
    afterOrFramework: 'Use: "Could you please approve the invoice by 4 PM today?"',
    takeaway: '"Do the needful" is archaic and vague. Modern business English names the exact action and deadline.',
  },
  {
    id: 'st_ind_05',
    category: 'indianism',
    tag: 'Education Phrase',
    beforeOrPrompt: 'Avoid: "I passed out of engineering college in 2025."',
    afterOrFramework: 'Use: "I graduated from engineering college in 2025."',
    takeaway: 'In international English, "pass out" means to faint or lose consciousness—always say "graduated from".',
  },
  {
    id: 'st_ind_06',
    category: 'indianism',
    tag: 'Polite Inquiry',
    beforeOrPrompt: 'Avoid: "What is your good name?"',
    afterOrFramework: 'Use: "May I have your name, please?" or "What is your name?"',
    takeaway: 'Literal translation of "Shubh naam". Keep greetings natural and direct in corporate introductions.',
  },
  {
    id: 'st_ind_07',
    category: 'indianism',
    tag: 'Redundancy',
    beforeOrPrompt: 'Avoid: "He is my cousin brother" / "Let us discuss about the plan."',
    afterOrFramework: 'Use: "He is my cousin" / "Let us discuss the plan."',
    takeaway: '"Cousin" is gender-neutral ("He/She" already signals gender), and "discuss" is transitive—no "about" needed.',
  },
  {
    id: 'st_ind_08',
    category: 'indianism',
    tag: 'Travel & Availability',
    beforeOrPrompt: 'Avoid: "Our manager is out of station this week."',
    afterOrFramework: 'Use: "Our manager is out of town / away on business this week."',
    takeaway: '"Out of station" is a colonial railway term. Use "out of town" or "travelling for work".',
  },
  {
    id: 'st_ind_09',
    category: 'indianism',
    tag: 'Verb Tense',
    beforeOrPrompt: 'Avoid: "I am having two years of experience."',
    afterOrFramework: 'Use: "I have two years of experience."',
    takeaway: 'Stative verbs expressing possession ("have", "know", "own") should not use the continuous "-ing" form.',
  },
  {
    id: 'st_ind_10',
    category: 'indianism',
    tag: 'Time Expression',
    beforeOrPrompt: 'Avoid: "I completed this certification three years back."',
    afterOrFramework: 'Use: "I completed this certification three years ago."',
    takeaway: 'In formal writing and interviews, prefer "ago" over "back" when anchoring past milestones.',
  },
  {
    id: 'st_ind_11',
    category: 'indianism',
    tag: 'Redundancy',
    beforeOrPrompt: 'Avoid: "Please return back the form" / "Repeat again."',
    afterOrFramework: 'Use: "Please return the form" / "Could you please repeat that?"',
    takeaway: '"Return" already means "give back", and "repeat" already means "say again". Strip duplicate modifiers.',
  },
  {
    id: 'st_ind_12',
    category: 'indianism',
    tag: 'Non-Standard Nouns',
    beforeOrPrompt: 'Avoid: "System updation / skill upgradation is pending."',
    afterOrFramework: 'Use: "A system update / skill upgrade is pending."',
    takeaway: '"Updation" and "upgradation" are non-standard coinages. Simply use "update" and "upgrade" as nouns.',
  },

  // Interview Skills (8 study cards)
  {
    id: 'st_int_01',
    category: 'interview',
    tag: 'Opening Pitch',
    beforeOrPrompt: 'Tell Me About Yourself (60–90 Seconds)',
    afterOrFramework: 'Present (Current role/degree + strength) -> Past (2 quantified projects) -> Future (Why this exact role).',
    takeaway: 'Never recite your family tree or read your resume line-by-line; connect your track record to the employer’s needs.',
  },
  {
    id: 'st_int_02',
    category: 'interview',
    tag: 'Behavioral Formula',
    beforeOrPrompt: 'STAR Method for Experience & Conflict Questions',
    afterOrFramework: 'Situation (15%) -> Task (15%) -> Action YOU took (50%) -> Measurable Result (20%).',
    takeaway: 'Panels hire what YOU personally executed—use "I" for your specific actions even inside team stories.',
  },
  {
    id: 'st_int_03',
    category: 'interview',
    tag: 'Self-Awareness',
    beforeOrPrompt: 'Answering "What Is Your Biggest Weakness?"',
    afterOrFramework: 'Pick a real, non-core skill gap + explain the concrete system you built to improve it + show recent progress.',
    takeaway: 'Cliché humblebrags ("I am a perfectionist") destroy credibility; structured self-improvement builds trust.',
  },
  {
    id: 'st_int_04',
    category: 'interview',
    tag: 'Integrity Under Pressure',
    beforeOrPrompt: 'Handling an Unknown Technical or Domain Question',
    afterOrFramework: 'Acknowledge honestly -> State related principles you DO know -> Outline how you would verify/solve it.',
    takeaway: 'Bluffing gets caught immediately by senior engineers; structured curiosity signals coachability.',
  },
  {
    id: 'st_int_05',
    category: 'interview',
    tag: 'Panel Etiquette',
    beforeOrPrompt: 'Multi-Interviewer Eye Contact Rule',
    afterOrFramework: 'Begin eye contact with the questioner, sweep naturally across every panelist during your explanation, and finish with the questioner.',
    takeaway: 'Silent panelists often hold equal hiring veto power—including them visually shows executive presence.',
  },
  {
    id: 'st_int_06',
    category: 'interview',
    tag: 'Virtual Polish',
    beforeOrPrompt: 'Online / Video Interview Framing',
    afterOrFramework: 'Camera at eye level, soft front lighting, tidy background, look into the lens when delivering key takeaways.',
    takeaway: 'Looking slightly up from a low laptop angle reduces visual authority; eye-level framing simulates an in-person desk.',
  },
  {
    id: 'st_int_07',
    category: 'interview',
    tag: 'Reverse Questions',
    beforeOrPrompt: 'When Asked: "Do You Have Any Questions for Us?"',
    afterOrFramework: 'Ask about 90-day success benchmarks, team challenges, or learning curves—NEVER say "No, everything is clear."',
    takeaway: 'Thoughtful questions prove genuine research and signal that you think like an incoming contributor.',
  },
  {
    id: 'st_int_08',
    category: 'interview',
    tag: 'Negotiation & Follow-Up',
    beforeOrPrompt: 'Salary Expectations & Post-Interview Note',
    afterOrFramework: 'Give a researched market range anchored to value; send a concise 4-line thank-you email within 24 hours referencing one discussion point.',
    takeaway: 'Preparedness on compensation and timely gratitude leave a disciplined, mature final impression.',
  },

  // GD Skills (8 study cards)
  {
    id: 'st_gd_01',
    category: 'gd',
    tag: 'Idea Generation',
    beforeOrPrompt: 'PESTLE Lens for Broad & Socio-Economic Topics',
    afterOrFramework: 'Political · Economic · Social · Technological · Legal · Environmental perspectives.',
    takeaway: 'When others repeat the same single point, PESTLE lets you introduce fresh dimensions effortlessly.',
  },
  {
    id: 'st_gd_02',
    category: 'gd',
    tag: 'Speaking Structure',
    beforeOrPrompt: 'PREP Micro-Speech (30–45 Seconds per Entry)',
    afterOrFramework: 'Point (Clear claim) -> Reason (Why it matters) -> Example/Data -> Point restated briefly.',
    takeaway: 'Structured 40-second entries outperform 3-minute rambling monologues in every placement rubric.',
  },
  {
    id: 'st_gd_03',
    category: 'gd',
    tag: 'Opening Impact',
    beforeOrPrompt: 'When & How to Initiate a Group Discussion',
    afterOrFramework: 'Initiate ONLY when you grasp the topic clearly—define key terms, share a crisp statistic or balanced lens, and invite viewpoints.',
    takeaway: 'Blindly rushing to speak first with vague filler hurts more than entering second with crystal clarity.',
  },
  {
    id: 'st_gd_04',
    category: 'gd',
    tag: 'Polite Entry',
    beforeOrPrompt: 'Breaking Into a Fast-Moving Discussion',
    afterOrFramework: 'Wait for a natural breath pause, lean slightly forward with open palms, and bridge: "Building on Ananya’s economic point..."',
    takeaway: 'Bridging from the previous speaker proves active listening—evaluators score listening as highly as speaking.',
  },
  {
    id: 'st_gd_05',
    category: 'gd',
    tag: 'Conflict Diplomacy',
    beforeOrPrompt: 'Disagreeing Without Becoming Aggressive',
    afterOrFramework: 'Validate intent + pivot with evidence: "I see why speed matters here; however, recent audit data shows..."',
    takeaway: 'Attack ideas with logic, never individuals with tone or finger-pointing.',
  },
  {
    id: 'st_gd_06',
    category: 'gd',
    tag: 'Fish-Market Rescue',
    beforeOrPrompt: 'When 4 Participants Talk Over Each Other',
    afterOrFramework: 'Keep calm posture, use a firm steady voice (never shrill shouting): "Friends, let’s take one viewpoint at a time—Rahul, please finish your point."',
    takeaway: 'Restoring order without losing composure instantly earns Leadership & Group Dynamics marks.',
  },
  {
    id: 'st_gd_07',
    category: 'gd',
    tag: 'Non-Verbal Signals',
    beforeOrPrompt: 'Where to Look During a Group Discussion',
    afterOrFramework: 'Address your fellow participants around the table—NEVER stare at the evaluator as if delivering a private speech.',
    takeaway: 'A GD is a peer problem-solving forum; nodding attentively while others speak displays maturity.',
  },
  {
    id: 'st_gd_08',
    category: 'gd',
    tag: 'Closing Mastery',
    beforeOrPrompt: 'Delivering a High-Scoring Summary',
    afterOrFramework: 'Stay unbiased, synthesize 2–3 core themes discussed by the group (even views you disagreed with), and never introduce brand-new arguments.',
    takeaway: 'A balanced 30-second synthesis cements you as the facilitator who listened to the entire room.',
  },
];

export const CAREER_MCQS: CareerMcq[] = [
  // =========================================================================
  // CATEGORY 1: INDIANISM & GLOBAL BUSINESS ENGLISH (15 MCQs)
  // =========================================================================
  {
    id: 'ind_01',
    category: 'indianism',
    topic: 'Email Redundancy',
    difficulty: 'Core',
    question:
      'Which sentence replaces the Indianism "Please revert back to me by 5 PM" in crisp global business English?',
    options: [
      'Please revert back again to me by 5 PM.',
      'Please reply to me by 5 PM.',
      'Please do the reverting by 5 PM.',
      'Kindly revert your response back before 5 PM.',
    ],
    correctIndex: 1,
    hint: '"Revert" means return to an earlier state and never needs "back". Choose the simplest global verb for answering an email.',
    explanation:
      '"Reply" or "respond" is clear, concise, and universally understood. "Revert back" is a double error: wrong verb meaning + redundant "back".',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_02',
    category: 'indianism',
    topic: 'Self-Introduction Grammar',
    difficulty: 'Core',
    question:
      'A fresher begins a placement interview with: "Myself Priya Mehta, B.Tech final year." What is the most polished global replacement?',
    options: [
      'Myself is Priya Mehta, a final-year B.Tech student.',
      'I myself am Priya Mehta from final-year B.Tech.',
      'I am Priya Mehta, a final-year B.Tech student.',
      'My good name is Priya Mehta, final-year B.Tech.',
    ],
    correctIndex: 2,
    hint: 'Reflexive pronouns ("myself") cannot act as the standalone subject of an introduction, and avoid "good name".',
    explanation:
      '"I am Priya Mehta..." or "My name is Priya Mehta..." is grammatically accurate, natural, and immediately signals professional fluency.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_03',
    category: 'indianism',
    topic: 'Scheduling Vocabulary',
    difficulty: 'Core',
    question:
      'You want to move a client call from Thursday to Tuesday. Which phrasing is standard international English?',
    options: [
      'Can we prepone the call to Tuesday?',
      'Can we bring the call forward to Tuesday?',
      'Can we early-pone the call to Tuesday?',
      'Can we pre-shift back the call to Tuesday?',
    ],
    correctIndex: 1,
    hint: '"Prepone" is regional South Asian usage. Think of the natural opposite of "push back".',
    explanation:
      'International business teams say "bring the meeting forward" or "move the meeting earlier to Tuesday".',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_04',
    category: 'indianism',
    topic: 'Actionable Email Writing',
    difficulty: 'Applied',
    question:
      'Why should you avoid closing a corporate email with "Kindly do the needful" and what should replace it?',
    options: [
      'It is too short; expand it to "Kindly do the needful work at the earliest."',
      'It is archaic and vague; replace it with the specific action and deadline required.',
      'It is only wrong for seniors; it is ideal for junior colleagues.',
      'It is fine as long as you add "please" before "kindly".',
    ],
    correctIndex: 1,
    hint: 'Strong global communication eliminates guesswork for the reader.',
    explanation:
      'Modern workplace emails state the exact deliverable—e.g., "Could you please approve the budget sheet by Wednesday at 3 PM?"',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_05',
    category: 'indianism',
    topic: 'Academic Milestones',
    difficulty: 'Core',
    question:
      'Which statement accurately describes finishing your degree to an international recruiter?',
    options: [
      'I passed out from JIET Universe in 2026.',
      'I passed away from JIET Universe in 2026.',
      'I graduated from JIET Universe in 2026.',
      'I got passed out of JIET Universe in 2026.',
    ],
    correctIndex: 2,
    hint: 'In US/UK English, "pass out" means to faint or fall unconscious!',
    explanation:
      'Always use "graduated from [institution]" rather than "passed out from", which has an unintended medical meaning globally.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_06',
    category: 'indianism',
    topic: 'Transitive Verbs',
    difficulty: 'Applied',
    question: 'Identify the grammatically clean corporate sentence with ZERO preposition Indianisms:',
    options: [
      'Let us discuss about the Q3 placement roadmap.',
      'We need to order for twenty new headsets.',
      'Let us discuss the Q3 placement roadmap.',
      'Please emphasize on the customer retention metrics.',
    ],
    correctIndex: 2,
    hint: 'Verbs like "discuss", "order", and "emphasize" directly take an object without extra prepositions.',
    explanation:
      '"Discuss the roadmap" (not "discuss about"), "order headsets" (not "order for"), and "emphasize metrics" (not "emphasize on") are clean transitive constructions.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_07',
    category: 'indianism',
    topic: 'Stative Verbs',
    difficulty: 'Applied',
    question:
      'Which option fixes the Indianism in "I am having strong analytical skills and I am knowing Python"?',
    options: [
      'I have strong analytical skills and I know Python.',
      'I am having strong analytical skills and I know Python.',
      'I have been having strong analytical skills and knowing Python.',
      'I have strong analytical skills and I am knowing Python.',
    ],
    correctIndex: 0,
    hint: 'Possession ("have") and knowledge ("know") describe states, not temporary ongoing physical actions.',
    explanation:
      'Stative verbs take the simple present tense ("I have", "I know"), avoiding the continuous "-ing" form.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_08',
    category: 'indianism',
    topic: 'Eliminating Tautologies',
    difficulty: 'Core',
    question: 'Which phrase is FREE of redundant words (tautology)?',
    options: [
      'Return back the signed NDA by Friday.',
      'Could you repeat that question again?',
      'Let us schedule the onboarding session for Monday.',
      'She is my real cousin sister from Jaipur.',
    ],
    correctIndex: 2,
    hint: 'Check each option for doubled meaning: "return + back", "repeat + again", "cousin + sister".',
    explanation:
      '"Schedule the onboarding session for Monday" is crisp and exact; the other three contain classic redundant pairings.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_09',
    category: 'indianism',
    topic: 'Travel & Out-of-Office',
    difficulty: 'Core',
    question:
      'What is the cleanest global English replacement for an out-of-office reply saying "I am out of station until Friday"?',
    options: [
      'I am away from station till Friday.',
      'I am out of town on business until Friday.',
      'I am outside the station until Friday.',
      'I am station-out until Friday.',
    ],
    correctIndex: 1,
    hint: 'Replace the railway-era phrase "out of station" with standard business travel terminology.',
    explanation:
      '"Out of town" or "travelling for work until Friday" is clear to colleagues across every country.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_10',
    category: 'indianism',
    topic: 'Non-Standard Noun Coinages',
    difficulty: 'Applied',
    question:
      'A project report states: "Database updation and server upgradation were completed." How should a global editor revise it?',
    options: [
      'Database updationing and server upgrading were completed.',
      'The database update and server upgrade are complete.',
      'Database up-dation and server up-gradation got done.',
      'The database updation was upgraded completely.',
    ],
    correctIndex: 1,
    hint: '"Update" and "upgrade" already function as standard English nouns without adding "-ation".',
    explanation:
      '"Update" and "upgrade" are proper nouns in standard English; "updation" and "upgradation" are regional coinages best avoided in formal documentation.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_11',
    category: 'indianism',
    topic: 'Time Anchors',
    difficulty: 'Core',
    question:
      'Which sentence uses the standard formal time marker instead of an Indianism?',
    options: [
      'I launched my first campus club two years back.',
      'Two years back only I launched my first campus club.',
      'I launched my first campus club two years ago.',
      'Before two years back I launched my first campus club.',
    ],
    correctIndex: 2,
    hint: 'In formal interviews and resumes, pair durations with "ago".',
    explanation:
      '"Two years ago" is crisp and formal; "two years back" is informal/regional, and "only" as an intensifier ("back only") is an Indianism.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_12',
    category: 'indianism',
    topic: 'Emphatic "Only" & "Itself"',
    difficulty: 'Executive',
    question:
      'Spot the sentence that removes the regional emphatic "only / itself" error cleanly:',
    options: [
      'He is working in Bengaluru only.',
      'We will submit the prototype today itself.',
      'We will submit the prototype by the end of today.',
      'She told me yesterday only that the client agreed.',
    ],
    correctIndex: 2,
    hint: 'Adding "only" or "itself" to stress a place or day is a direct translation of Hindi "-hi" ("aaj hi", "wahin").',
    explanation:
      'Global English conveys urgency with exact phrasing like "by the end of today" or "later today" rather than "today itself".',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_13',
    category: 'indianism',
    topic: 'Polite Requests & Tone',
    difficulty: 'Executive',
    question:
      'In an international client call, which request replaces "Please adjust with the delay" most professionally?',
    options: [
      'Please do little adjustment for this delay.',
      'Thank you for your patience; could we accommodate a 15-minute shift?',
      'Kindly adjust today only because of traffic.',
      'You must adjust with us on this schedule.',
    ],
    correctIndex: 1,
    hint: 'Combine gratitude with standard collaborative wording ("accommodate" / "bear with us").',
    explanation:
      '"Adjust with" sounds abrupt or informal globally. Thanking the stakeholder and asking to "accommodate" reflects high executive courtesy.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_14',
    category: 'indianism',
    topic: 'Residence Phrasing',
    difficulty: 'Applied',
    question:
      'An interviewer asks where you currently live. Which answer avoids the Indianism "put up"?',
    options: [
      'I am putting up in Jodhpur since four years.',
      'I stay put up near the university campus.',
      'I currently live in Jodhpur.',
      'I am putting up at Jodhpur only.',
    ],
    correctIndex: 2,
    hint: 'In standard English, "put up" means to host someone temporarily or tolerate something ("put up with").',
    explanation:
      'Use "I currently live in Jodhpur" or "I am based in Jodhpur" for clear, natural communication.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'ind_15',
    category: 'indianism',
    topic: 'Exact Word Choice',
    difficulty: 'Executive',
    question:
      'A team lead emails: "I have a small doubt regarding the API timeout." What makes a better global replacement for "doubt"?',
    options: [
      'I have a big doubt regarding the API timeout.',
      'I have a quick question about the API timeout.',
      'I am doubting the API timeout specification.',
      'Please clear my doubts back on API timeout.',
    ],
    correctIndex: 1,
    hint: 'Outside India, "doubt" implies skepticism or distrust rather than simply asking for clarification.',
    explanation:
      'Using "question" or "clarification" prevents colleagues from thinking you distrust their work—an essential nuance in global tech teams.',
    xpClean: 30,
    xpWithHint: 20,
  },

  // =========================================================================
  // CATEGORY 2: INTERVIEW SKILLS & EXECUTIVE PRESENCE (15 MCQs)
  // =========================================================================
  {
    id: 'int_01',
    category: 'interview',
    topic: 'Opening Pitch (TMAY)',
    difficulty: 'Core',
    question:
      'What is the strongest structure for answering "Tell me about yourself" in a campus or lateral job interview?',
    options: [
      'Start with your childhood hobbies, family members’ occupations, and high school percentages.',
      'Use Present–Past–Future: your current focus, 2 relevant quantified achievements, and why this role fits your trajectory.',
      'Read every single bullet point on your resume word-for-word for 5 minutes.',
      'Say "Everything is already written in my resume; please ask what you want to know."',
    ],
    correctIndex: 1,
    hint: 'Think of a 75-second executive trailer connecting who you are today to the value you bring to this role.',
    explanation:
      'Present–Past–Future keeps your introduction concise, relevant to the job description, and naturally steers the panel toward your best projects.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_02',
    category: 'interview',
    topic: 'STAR Behavioral Method',
    difficulty: 'Core',
    question:
      'In the STAR behavioral interview framework, which component should receive the LARGEST share (~50%) of your speaking time?',
    options: [
      'Situation — lengthy backstory of the company or college event.',
      'Task — repeating the problem prompt in multiple ways.',
      'Action — the exact steps, decisions, and tools YOU personally executed.',
      'Result — only naming your team’s final trophy without explaining how it happened.',
    ],
    correctIndex: 2,
    hint: 'Interviewers hire your problem-solving habits, not just the setting of the story.',
    explanation:
      'Spending ~50% on Action ("I diagnosed..., I designed..., I negotiated...") proves personal ownership and replicable skill.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_03',
    category: 'interview',
    topic: 'Weakness Framing',
    difficulty: 'Applied',
    question:
      'Which response to "What is your biggest weakness?" earns the highest credibility from senior HR panels?',
    options: [
      '"Honestly, I don’t have any weaknesses—I adapt to everything."',
      '"I am a perfectionist who works too hard and cares too much."',
      '"Early in college I hesitated to delegate during hackathons; now I use a shared milestone checklist and review checkpoints, which helped our 4-member team ship 2 days early."',
      '"I hate waking up early and sometimes miss morning deadlines."',
    ],
    correctIndex: 2,
    hint: 'Balance genuine self-awareness with an active improvement system and evidence of growth.',
    explanation:
      'Naming a real, non-disqualifying growth area plus concrete corrective habits demonstrates maturity and coachability.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_04',
    category: 'interview',
    topic: 'Handling Unknown Questions',
    difficulty: 'Applied',
    question:
      'A technical interviewer asks about a cloud service you have never used. What is the best executive response?',
    options: [
      'Guess confidently and invent technical terms hoping they move on.',
      'Say "I don’t know" and sit completely silent.',
      'State honestly that you have not worked with it yet, connect it to a related concept you know well, and explain how you would evaluate or learn it.',
      'Blame your college syllabus for not teaching modern tools.',
    ],
    correctIndex: 2,
    hint: 'Integrity + structured reasoning beats bluffing every single time.',
    explanation:
      'Senior panels test intellectual honesty. Admitting a gap calmly while showing transferable thinking proves you can learn fast on the job.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_05',
    category: 'interview',
    topic: 'Multi-Panel Eye Contact',
    difficulty: 'Core',
    question:
      'Three panelists are interviewing you, and only the middle panelist asks a question. How should you manage eye contact while answering?',
    options: [
      'Stare exclusively at the middle panelist so the others don’t distract you.',
      'Look mostly at the table or your resume folder to stay calm.',
      'Begin with the person who asked, naturally include the other two panelists as you explain key points, and close back with the questioner.',
      'Look only at the oldest person in the room since they must be the boss.',
    ],
    correctIndex: 2,
    hint: 'Every person sitting across the table votes on your offer.',
    explanation:
      'Inclusive eye contact builds rapport across the entire panel and projects poised leadership presence.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_06',
    category: 'interview',
    topic: 'Reverse Questions',
    difficulty: 'Core',
    question:
      'At the end, the hiring manager asks: "Do you have any questions for us?" Which question signals the strongest ownership?',
    options: [
      '"No sir, everything was explained in the pre-placement talk."',
      '"How many paid leaves and work-from-home days do freshers get?"',
      '"What would distinguish an exceptional performer in this role during their first 90 days?"',
      '"Did I pass this round?"',
    ],
    correctIndex: 2,
    hint: 'Great reverse questions focus on impact, performance expectations, and team priorities.',
    explanation:
      'Asking about 90-day excellence benchmarks signals ambition, role clarity, and a results-driven mindset.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_07',
    category: 'interview',
    topic: 'Explaining Academic Dips',
    difficulty: 'Applied',
    question:
      'Your semester 3 GPA dipped noticeably before recovering in semesters 4–7. How should you address it if asked?',
    options: [
      'Blame strict faculty grading and unfair exam schedules.',
      'Briefly own the root cause without excuses, highlight the study system you changed, and point to your upward GPA & project recovery.',
      'Deny that it matters because grades don’t reflect intelligence.',
      'Give an overly emotional 5-minute personal story to gain sympathy.',
    ],
    correctIndex: 1,
    hint: 'Accountability + upward trajectory turns a past dip into a resilience proof point.',
    explanation:
      'Employers forgive early setbacks when candidates show ownership, measurable turnaround, and sustained discipline afterward.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_08',
    category: 'interview',
    topic: 'Company Research',
    difficulty: 'Applied',
    question:
      'Which answer to "Why do you want to join our company?" stands out immediately to recruiters?',
    options: [
      '"Because your company is very famous and offers a great package."',
      '"I applied to every company visiting campus and yours shortlisted me first."',
      '"I studied your recent expansion into AI-driven logistics analytics; my internship in route optimization aligns directly with that roadmap, and I want to contribute to scalable operations."',
      '"My senior works here and said the cafeteria and culture are fun."',
    ],
    correctIndex: 2,
    hint: 'Connect a specific company initiative to a concrete capability you bring.',
    explanation:
      'Specificity proves genuine homework and frames your candidacy as a mutual value match rather than generic job-hunting.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_09',
    category: 'interview',
    topic: 'Team Conflict Behavioral Story',
    difficulty: 'Executive',
    question:
      'When asked "Tell me about a conflict with a teammate," what is the critical trap to avoid?',
    options: [
      'Explaining the technical or timeline disagreement objectively.',
      'Badmouthing the teammate’s personality or claiming you never have disagreements.',
      'Describing how you listened to their viewpoint before aligning on shared metrics.',
      'Sharing what preventive workflow you adopted afterward.',
    ],
    correctIndex: 1,
    hint: 'HR uses conflict questions to evaluate emotional intelligence and psychological safety.',
    explanation:
      'Attacking a past peer signals workplace toxicity, while claiming "zero conflicts ever" signals inexperience or avoidance. Focus on constructive resolution.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_10',
    category: 'interview',
    topic: 'Virtual Interview Presence',
    difficulty: 'Core',
    question:
      'Which setup creates the strongest visual impression during a video interview?',
    options: [
      'Sitting with a bright window directly behind you so you appear as a silhouette.',
      'Placing your laptop on a low desk looking up at your chin while reading off a side screen.',
      'Camera elevated to eye level, light source in front of your face, quiet background, looking toward the lens when delivering key points.',
      'Keeping your camera off until the interviewer specifically asks you to turn it on.',
    ],
    correctIndex: 2,
    hint: 'Good front lighting and eye-level camera placement replicate natural in-person eye contact.',
    explanation:
      'Eye-level framing and front illumination maximize facial clarity, warmth, and executive composure on video calls.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_11',
    category: 'interview',
    topic: '5-Year Career Vision',
    difficulty: 'Applied',
    question:
      'How should you respond to "Where do you see yourself in 5 years?" during an entry-level placement interview?',
    options: [
      '"Running my own startup after learning your business secrets for 1 year."',
      '"Sitting in your chair as the hiring manager."',
      '"Mastering core execution in years 1–2, owning end-to-end client or product modules by year 3, and mentoring junior hires while growing with the organization."',
      '"I haven’t thought that far ahead; I just take life one day at a time."',
    ],
    correctIndex: 2,
    hint: 'Show realistic ambition tied to skill mastery and long-term contribution inside the company.',
    explanation:
      'Employers invest heavily in training freshers; framing growth in progressive mastery and team impact reassures them of retention and drive.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_12',
    category: 'interview',
    topic: 'Stress Interview Composure',
    difficulty: 'Executive',
    question:
      'Mid-answer, a panelist abruptly interrupts with: "That sounds textbook—are you sure you actually built this project?" What is the smartest response?',
    options: [
      'Raise your voice defensively and accuse them of doubting your hard work.',
      'Apologize repeatedly and abandon your explanation.',
      'Stay calm, smile slightly, and walk through one specific architectural trade-off or bug you personally debugged with exact numbers.',
      'Change the subject to a different project on your resume.',
    ],
    correctIndex: 2,
    hint: 'Stress interviewers test emotional regulation AND hands-on authenticity simultaneously.',
    explanation:
      'Calm composure paired with granular, real-world debugging evidence immediately validates ownership and resilience under pressure.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_13',
    category: 'interview',
    topic: 'Compensation Diplomacy',
    difficulty: 'Executive',
    question:
      'When HR asks early for your expected CTC / salary range, which approach reflects executive negotiation poise?',
    options: [
      'Demand double the market rate without justification to look confident.',
      'Say "Give me anything you like, I just need a job."',
      'Share a researched, realistic market range aligned with the role’s responsibilities while expressing primary focus on role scope and total growth.',
      'Refuse to discuss compensation at all and end the conversation.',
    ],
    correctIndex: 2,
    hint: 'Avoid both desperation ("anything") and ungrounded extremes—anchor to market data and role scope.',
    explanation:
      'A researched band signals commercial awareness without pricing yourself out prematurely or undervaluing your skills.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_14',
    category: 'interview',
    topic: 'Non-Verbal Etiquette',
    difficulty: 'Core',
    question:
      'Which body-language cluster communicates calm confidence in an in-person interview?',
    options: [
      'Crossed arms tightly over chest, leaning far back, tapping foot rapidly.',
      'Upright relaxed posture, open hands resting naturally, steady warm eye contact, and measured vocal pace.',
      'Slouching forward over the interviewer’s desk while staring unblinkingly.',
      'Constantly checking your smartwatch and fiddling with a clicking pen.',
    ],
    correctIndex: 1,
    hint: 'Open posture and calm pacing reduce nervous energy and signal trustworthiness.',
    explanation:
      'Relaxed upright posture, open gestures, and steady pacing project composure before you even finish your opening sentence.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'int_15',
    category: 'interview',
    topic: 'Post-Interview Follow-Up',
    difficulty: 'Applied',
    question:
      'What makes a post-interview thank-you email genuinely memorable within 24 hours of the conversation?',
    options: [
      'Sending a copy-pasted 1-line "Thanks for interviewing me, please select me."',
      'Messaging the interviewer on personal social media every two hours for results.',
      'A concise 4-line note thanking the panel, referencing one specific challenge discussed, and reiterating how your relevant skill adds value.',
      'Sending a 3-page essay covering every topic you forgot to mention.',
    ],
    correctIndex: 2,
    hint: 'Brief, personalized, and value-anchored beats generic or pushy follow-ups.',
    explanation:
      'Recalling one concrete point from the interview proves active listening and leaves a polished executive closing impression.',
    xpClean: 30,
    xpWithHint: 20,
  },

  // =========================================================================
  // CATEGORY 3: GD SKILLS — GROUP DISCUSSION MASTERY (15 MCQs)
  // =========================================================================
  {
    id: 'gd_01',
    category: 'gd',
    topic: 'Initiating Strategy',
    difficulty: 'Core',
    question:
      'When is it actually advantageous to speak FIRST (initiate) in a placement Group Discussion?',
    options: [
      'Always—even if you do not understand the topic, speaking first guarantees selection.',
      'Only when you clearly understand the topic and can frame its scope, key definition, or a balanced opening lens concisely.',
      'Never—evaluators penalize anyone who speaks in the first two minutes.',
      'Only when you want to read out a memorized motivational quote unrelated to the prompt.',
    ],
    correctIndex: 1,
    hint: 'High risk, high reward: initiating helps ONLY when paired with clarity and structure.',
    explanation:
      'Initiating with a crisp definition or contextual anchor earns leadership credit; initiating with vague filler hurts your score immediately.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_02',
    category: 'gd',
    topic: 'PESTLE Multi-Angle Thinking',
    difficulty: 'Core',
    question:
      'In a GD on "Should AI Tools Be Permitted in University Exams?", how does the PESTLE framework elevate your contribution?',
    options: [
      'It forces you to repeat the same ethical argument five times louder.',
      'It helps you introduce distinct untouched angles—like Legal integrity, Economic workforce readiness, and Technological assessment design.',
      'It tells you which seat to choose at the discussion table.',
      'It is only meant for marketing case studies, never campus GDs.',
    ],
    correctIndex: 1,
    hint: 'PESTLE stands for Political, Economic, Social, Technological, Legal, Environmental.',
    explanation:
      'Using PESTLE prevents repetitive points and showcases wide-angle analytical breadth when the group gets stuck on one dimension.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_03',
    category: 'gd',
    topic: 'Polite Entry & Active Listening',
    difficulty: 'Core',
    question:
      'Which opening phrase best demonstrates active listening when entering a live Group Discussion?',
    options: [
      '"Stop talking, it is my turn to speak now!"',
      '"Whatever everyone said before is wrong; listen to the real point."',
      '"Building on Meera’s point about rural connectivity, we should also look at last-mile digital literacy..."',
      '"Good morning sir, today I will give a speech on this topic."',
    ],
    correctIndex: 2,
    hint: 'Look for bridging language ("Building on...") that connects your idea to the group’s flow.',
    explanation:
      'Referencing a peer’s idea before adding your own dimension signals collaborative teamwork and active listening—two top GD rubric criteria.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_04',
    category: 'gd',
    topic: 'Fish-Market Rescue',
    difficulty: 'Applied',
    question:
      'Four candidates begin shouting simultaneously, turning the GD into a chaotic "fish market". What earns maximum leadership points?',
    options: [
      'Shout louder than all four so your voice overpowers the room.',
      'Stay completely silent for the entire remaining 12 minutes.',
      'Wait for a micro-pause, use calm assertive body language and a steady voice: "Friends, let’s listen to one point at a time so we cover more ground—Arjun, please finish your thought."',
      'Look at the evaluator and complain that your group is undisciplined.',
    ],
    correctIndex: 2,
    hint: 'True moderators de-escalate noise with composure rather than adding more volume.',
    explanation:
      'Restoring structure calmly without aggression immediately marks you as a mature facilitator and team leader.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_05',
    category: 'gd',
    topic: 'PREP Micro-Speech',
    difficulty: 'Applied',
    question:
      'In a 15-minute GD with 8 candidates, what is the ideal speaking cadence using the PREP framework?',
    options: [
      'Deliver one uninterrupted 6-minute monologue and then tune out.',
      'Make 3–4 crisp, structured 35–45 second entries (Point → Reason → Example → Point) spaced naturally through the discussion.',
      'Speak only a single 5-second "I agree" near the end.',
      'Interrupt after every single sentence another participant speaks.',
    ],
    correctIndex: 1,
    hint: 'Balance quality, brevity, and consistent presence without hogging airtime.',
    explanation:
      '3–4 concise, well-evidenced entries prove sustained engagement while respecting equal airtime for the group.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_06',
    category: 'gd',
    topic: 'Constructive Disagreement',
    difficulty: 'Applied',
    question:
      'A teammate shares a weak, unsupported claim that contradicts real industry data. How should you counter it?',
    options: [
      '"That makes zero sense—clearly you didn’t read the news."',
      'Laugh sarcastically and shake your head while pointing a finger at them.',
      '"I appreciate the concern about upfront cost; however, NASSCOM’s recent report shows upskilling reduces attrition by over 20%."',
      'Agree with them blindly just to look friendly.',
    ],
    correctIndex: 2,
    hint: 'Acknowledge the person’s intent first, then introduce objective evidence.',
    explanation:
      'Respectful evidence-based disagreement demonstrates critical thinking and emotional intelligence simultaneously.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_07',
    category: 'gd',
    topic: 'Eye Contact & Address',
    difficulty: 'Core',
    question:
      'During a Group Discussion, where should your eye contact be directed when you speak?',
    options: [
      'Fixed directly on the evaluator/moderator the entire time.',
      'Sweeping naturally across all fellow group members around the table.',
      'Downward at your notepad so you never lose your written script.',
      'Only at the single person sitting directly opposite you.',
    ],
    correctIndex: 1,
    hint: 'Remember: a GD is a peer conversation, not a one-way stage speech to a judge.',
    explanation:
      'Looking at the evaluator breaks group dynamics; engaging every peer around the table displays genuine collaborative presence.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_08',
    category: 'gd',
    topic: 'Inclusive Group Dynamics',
    difficulty: 'Applied',
    question:
      'Noticeably quiet candidate #6 has tried twice to speak but keeps getting cut off by loud speakers. What is an executive leadership move?',
    options: [
      'Ignore them—fewer speakers means more airtime for you.',
      'At the next pause, invite them naturally: "I noticed Neha wanted to add a perspective—Neha, would you like to share your view?"',
      'Tell the room "Neha hasn’t spoken yet, she will fail if she stays quiet."',
      'Answer on Neha’s behalf without asking her.',
    ],
    correctIndex: 1,
    hint: 'Empowering quiet voices gracefully without embarrassing them is a signature leadership trait.',
    explanation:
      'Passing the floor courteously proves you care about collective decision quality rather than self-centered dominance.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_09',
    category: 'gd',
    topic: 'Handling Abstract Topics',
    difficulty: 'Executive',
    question:
      'The evaluator announces an abstract GD topic: "Zero Is More Powerful Than One." What is the best first move during your 2-minute prep?',
    options: [
      'Argue literally about elementary arithmetic for 15 minutes.',
      'Anchor the metaphor into 2–3 real-world business/life lenses (e.g., starting from scratch / innovation, binary computing, humility & rebooting after failure).',
      'Say the topic is philosophical nonsense and ask for a current-affairs topic.',
      'Wait silently until someone else invents the meaning.',
    ],
    correctIndex: 1,
    hint: 'Abstract GDs test lateral creativity and your ability to ground metaphors in concrete workplace reality.',
    explanation:
      'Translating an abstract phrase into tangible domains (technology, leadership humility, zero-based budgeting) immediately unlocks rich discussion.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_10',
    category: 'gd',
    topic: 'Point Stolen Recovery',
    difficulty: 'Applied',
    question:
      'The speaker right before you says the EXACT point you prepared in your notes. What should you do?',
    options: [
      'Repeat the exact same point anyway so the evaluator knows you thought of it too.',
      'Say "Hey, you stole my point!" and visibly look annoyed.',
      'Validate their point briefly, then deepen it with a fresh real-world case example, counter-risk, or next-step solution.',
      'Give up and stop participating in the GD.',
    ],
    correctIndex: 2,
    hint: 'Value addition beats repetition—turn a shared idea into deeper insight.',
    explanation:
      'Piggybacking with fresh evidence or an implementation caveat shows agility and moves the group conversation forward.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_11',
    category: 'gd',
    topic: 'Handling Aggressive Interruptions',
    difficulty: 'Executive',
    question:
      'Another candidate cuts you off aggressively mid-sentence while you are delivering a key statistic. What is the most composed response?',
    options: [
      'Snap back: "Don’t you have basic manners? Let me speak!"',
      'Immediately stop mid-word and never attempt to finish your point.',
      'Maintain calm eye contact, hold a slight open-palm gesture, and say steadily: "Give me just ten seconds to complete this figure, then I’d love to hear your view."',
      'Talk faster and louder over them until both of you are incomprehensible.',
    ],
    correctIndex: 2,
    hint: 'Firmness + politeness ("10 seconds to finish, then your view") projects assertive authority.',
    explanation:
      'Setting a polite boundary with a brief time anchor keeps your composure intact and wins respect from both peers and evaluators.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_12',
    category: 'gd',
    topic: 'Steering Back On Track',
    difficulty: 'Applied',
    question:
      'Halfway through a GD on "Remote Work vs. Office Culture," the group drifts into debating city traffic fines. How do you add high value?',
    options: [
      'Join the traffic-fine debate passionately since everyone seems excited.',
      'Gently bridge back to the core prompt: "Commute friction is definitely a major factor—bringing that back to remote vs. office culture, hybrid policies can directly solve..."',
      'Announce rudely that everyone has gone off-topic and lost marks.',
      'Wait passively for the evaluator to intervene.',
    ],
    correctIndex: 1,
    hint: 'Bridge from the tangent back to the core topic without sounding bossy.',
    explanation:
      'Tactfully re-anchoring a drifting group demonstrates focus, goal orientation, and diplomatic facilitation.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_13',
    category: 'gd',
    topic: '2-Minute Prep & Note-Taking',
    difficulty: 'Core',
    question:
      'How should you use your notepad during the 2-minute preparation window and during the live GD?',
    options: [
      'Write full paragraphs word-for-word and read directly off the paper.',
      'Jot down 4–5 crisp keywords/angles during prep, and briefly note strong peer points during the GD to build links and summarize accurately.',
      'Avoid touching the notepad because taking notes looks unprepared.',
      'Doodle while others speak so you look relaxed.',
    ],
    correctIndex: 1,
    hint: 'Keywords keep your delivery natural while tracking group themes for a winning summary.',
    explanation:
      'Brief bullet keywords preserve natural eye contact while giving you accurate material to bridge arguments and deliver an authoritative conclusion.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_14',
    category: 'gd',
    topic: 'Delivering the Final Summary',
    difficulty: 'Executive',
    question:
      'Which rule is NON-NEGOTIABLE when you volunteer to summarize the Group Discussion in the final 45 seconds?',
    options: [
      'Introduce two brand-new arguments you forgot to share earlier.',
      'Highlight only the points that supported your personal side.',
      'Synthesize the key themes from BOTH sides neutrally, reflect group consensus/trade-offs, and avoid adding brand-new points.',
      'Name who spoke the best and who spoke the worst in the room.',
    ],
    correctIndex: 2,
    hint: 'A summary represents the collective room—balanced, concise, and free of new tangents.',
    explanation:
      'An impartial synthesis that captures the group’s major viewpoints and actionable takeaway is one of the highest-scoring moves in any GD.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'gd_15',
    category: 'gd',
    topic: 'Recruiter Evaluation Pillars',
    difficulty: 'Core',
    question:
      'Which four core dimensions do corporate placement panels consistently evaluate in a Group Discussion?',
    options: [
      'Loudest volume, fastest speaking speed, accent imitation, and longest monologue.',
      'Content depth, Communication clarity, Group Dynamics / Listening, and Constructive Leadership.',
      'Winning an argument by making everyone else surrender, plus memorizing dictionary words.',
      'Sitting closest to the evaluator, wearing bright colors, and speaking first no matter what.',
    ],
    correctIndex: 1,
    hint: 'Panels look for future colleagues who think clearly, communicate crisply, and elevate the whole team.',
    explanation:
      'Content, Communication, Group Dynamics, and Leadership form the universal corporate GD rubric—never sheer volume or aggression.',
    xpClean: 30,
    xpWithHint: 20,
  },
];

export const CAREER_BADGES: CareerBadgeDefinition[] = [
  {
    id: 'cb_indianism_pro',
    title: 'Global English Purist',
    description: 'Scored at least 11/15 on the Indianism & Global Business English MCQ Test.',
    criteriaLabel: 'Indianism MCQ ≥ 11/15',
    accent: 'blue',
    checkUnlocked: (s) => s.indianismCorrect >= 11,
  },
  {
    id: 'cb_interview_ace',
    title: 'Executive Interview Ace',
    description: 'Scored at least 11/15 on the Interview Skills & Presence MCQ Test.',
    criteriaLabel: 'Interview MCQ ≥ 11/15',
    accent: 'emerald',
    checkUnlocked: (s) => s.interviewCorrect >= 11,
  },
  {
    id: 'cb_gd_catalyst',
    title: 'GD Roundtable Catalyst',
    description: 'Scored at least 11/15 on the Group Discussion (GD) Skills MCQ Test.',
    criteriaLabel: 'GD Skills MCQ ≥ 11/15',
    accent: 'violet',
    checkUnlocked: (s) => s.gdCorrect >= 11,
  },
  {
    id: 'cb_playbook_scholar',
    title: 'Placement Playbook Scholar',
    description: 'Studied at least 10 career playbooks across Indianism, Interview & GD vaults.',
    criteriaLabel: 'Study ≥ 10 Playbooks',
    accent: 'cyan',
    checkUnlocked: (s) => s.studiedCount >= 10,
  },
  {
    id: 'cb_no_hint_sharp',
    title: 'No-Hint Placement Strategist',
    description: 'Answered 25 or more career MCQs correctly without revealing hints.',
    criteriaLabel: '≥ 25 Correct Without Hints',
    accent: 'amber',
    checkUnlocked: (s) => s.cleanCorrect >= 25,
  },
  {
    id: 'cb_all_rounder',
    title: 'Placement Ready All-Rounder',
    description: 'Completed all 45 MCQs across Indianism, Interview & GD with ≥ 80% accuracy (36+/45).',
    criteriaLabel: '45/45 Done · ≥ 36 Correct',
    accent: 'rose',
    checkUnlocked: (s) => s.totalAnswered >= 45 && s.totalCorrect >= 36,
  },
];

export function getCareerSkillsRank(xp: number): {
  title: string;
  nextTitle: string | null;
  nextXp: number | null;
} {
  if (xp >= 1200) {
    return { title: 'Placement Ready Executive', nextTitle: null, nextXp: null };
  }
  if (xp >= 850) {
    return {
      title: 'Panel & Roundtable Leader',
      nextTitle: 'Placement Ready Executive',
      nextXp: 1200,
    };
  }
  if (xp >= 450) {
    return {
      title: 'Articulate Campus Contender',
      nextTitle: 'Panel & Roundtable Leader',
      nextXp: 850,
    };
  }
  if (xp >= 150) {
    return {
      title: 'Rising Communicator',
      nextTitle: 'Articulate Campus Contender',
      nextXp: 450,
    };
  }
  return {
    title: 'Career Skills Initiate',
    nextTitle: 'Rising Communicator',
    nextXp: 150,
  };
}

export interface CareerCategoryScoreSummary {
  category: CareerCategoryId;
  total: number;
  answered: number;
  correct: number;
  hintsUsed: number;
  accuracyPct: number;
  completed: boolean;
}

export function computeCareerCategoryStats(params: {
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
}): Record<CareerCategoryId, CareerCategoryScoreSummary> {
  const answeredSet = new Set(params.answeredMcqs);
  const correctSet = new Set(params.correctMcqs);
  const hintSet = new Set(params.hintUsedMcqs);

  const buildFor = (cat: CareerCategoryId): CareerCategoryScoreSummary => {
    const items = CAREER_MCQS.filter((q) => q.category === cat);
    const answered = items.filter((q) => answeredSet.has(q.id)).length;
    const correct = items.filter((q) => correctSet.has(q.id)).length;
    const hintsUsed = items.filter((q) => hintSet.has(q.id)).length;
    return {
      category: cat,
      total: items.length,
      answered,
      correct,
      hintsUsed,
      accuracyPct: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      completed: answered >= items.length && items.length > 0,
    };
  };

  return {
    indianism: buildFor('indianism'),
    interview: buildFor('interview'),
    gd: buildFor('gd'),
  };
}

export function computeCareerBadges(params: {
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
  studiedTopics: string[];
}): string[] {
  const catStats = computeCareerCategoryStats(params);
  const hintSet = new Set(params.hintUsedMcqs);
  const cleanCorrect = params.correctMcqs.filter((id) => !hintSet.has(id)).length;

  return CAREER_BADGES.filter((b) =>
    b.checkUnlocked({
      indianismCorrect: catStats.indianism.correct,
      interviewCorrect: catStats.interview.correct,
      gdCorrect: catStats.gd.correct,
      totalAnswered: params.answeredMcqs.length,
      totalCorrect: params.correctMcqs.length,
      cleanCorrect,
      studiedCount: params.studiedTopics.length,
    })
  )
    .map((b) => b.id)
    .slice(0, 12);
}

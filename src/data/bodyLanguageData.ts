export type BodyLanguageVisualKey =
  | 'interview_posture'
  | 'handshake_entrance'
  | 'virtual_camera'
  | 'gd_listening'
  | 'boardroom_presence';

export interface BodyLanguageChannelCue {
  channel:
    | 'Eye Contact'
    | 'Posture & Spine'
    | 'Hands & Gestures'
    | 'Spatial & Framing'
    | 'Vocal Pace & Micro-Expressions'
    | 'Micro-Expressions & Pacifiers';
  mistakeSignal: string;
  executiveSignal: string;
  recruiterTakeaway: string;
}

export interface BodyLanguageScenario {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  setting: string;
  imageKey: BodyLanguageVisualKey;
  stakes: string;
  goldenRule: string;
  channels: BodyLanguageChannelCue[];
  challenge: {
    prompt: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  };
}

export interface BodyLanguageMcq {
  id: string;
  topic: string;
  difficulty: 'Core' | 'Applied' | 'Executive';
  scenario: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  hint: string;
  explanation: string;
  xpClean: number;
  xpWithHint: number;
}

export interface BodyLanguageBadge {
  id: string;
  title: string;
  description: string;
  criteriaLabel: string;
  accent: 'teal' | 'blue' | 'amber' | 'violet';
  checkUnlocked: (stats: {
    exploredScenarios: string[];
    solvedChallenges: string[];
    answeredMcqs: string[];
    correctMcqs: string[];
  }) => boolean;
}

export const BODY_LANGUAGE_META = {
  title: 'Body Language & Executive Presence Studio',
  subtitle:
    'Decode 55% Visual Signals Across Interviews, Handshakes, Virtual Cameras, Group Discussions & Stress Rounds',
  totalScenarios: 6,
  totalMcqs: 15,
};

export const BODY_LANGUAGE_SCENARIOS: BodyLanguageScenario[] = [
  {
    id: 'bl_scen_entrance',
    number: '01',
    title: 'First 7 Seconds: Lobby Walk-In & Handshake Protocol',
    subtitle: 'Reception Entry · Greeting the Panel · Cultural Adaptation',
    setting: 'Corporate Lobby & Interview Room Threshold',
    imageKey: 'handshake_entrance',
    stakes:
      'Interviewers form a rapid trust & energy impression in the first 7 seconds—before you finish saying "Good morning."',
    goldenRule:
      'Walk with unhurried vertical carriage, phone tucked out of sight, smile as eye contact connects, and wait for the host to initiate hand or Namaste greeting.',
    channels: [
      {
        channel: 'Eye Contact',
        mistakeSignal:
          'Looking down at shoes or scanning ceiling corners while entering and rushing straight toward the chair.',
        executiveSignal:
          'Making brief, warm eye contact with the reception host and lead interviewer the moment the door opens.',
        recruiterTakeaway:
          'Signals openness, composure, and immediate situational awareness.',
      },
      {
        channel: 'Posture & Spine',
        mistakeSignal:
          'Hunched shoulders carrying an overstuffed backpack slung across the front chest.',
        executiveSignal:
          'Shoulders gently rolled back, chin parallel to the floor, portfolio held neatly in the left hand so the right hand stays free and dry.',
        recruiterTakeaway:
          'Holding your folder in your left hand avoids awkward mid-greeting juggling.',
      },
      {
        channel: 'Hands & Gestures',
        mistakeSignal:
          'Either a limp "dead-fish" fingertips-only clasp or an aggressive bone-crushing grip twisting their palm downward.',
        executiveSignal:
          'Full web-to-web vertical palm contact matching the interviewer’s pressure for 2 crisp pumps, or a respectful chest-level Namaste if preferred.',
        recruiterTakeaway:
          'Balanced mutual palm alignment signals peer professionalism rather than dominance or timidity.',
      },
      {
        channel: 'Spatial & Framing',
        mistakeSignal:
          'Sitting down abruptly without waiting to be offered a seat or invading within 45 cm of the panel’s notes.',
        executiveSignal:
          'Pausing politely beside the guest chair until invited ("Please have a seat"), then settling smoothly.',
        recruiterTakeaway:
          'Respecting personal & professional zones shows executive etiquette.',
      },
    ],
    challenge: {
      prompt:
        'You walk into a 3-person campus panel holding your resume folder in your right hand. The hiring lead stands up and extends a hand. What is the cleanest instant adjustment?',
      options: [
        'Quickly shake with your left hand so you do not have to move the folder',
        'Shift the folder smoothly to your left hand before reaching, offer a vertical web-to-web right handshake with eye contact, and say "Good morning"',
        'Place the folder on the interviewer’s laptop keyboard first, then shake hands',
        'Avoid eye contact and sit down immediately before anyone offers a chair',
      ],
      correctIndex: 1,
      explanation:
        'Always carry your portfolio in your left hand from the corridor; if caught mid-stride, smoothly transfer it to your left hand so your right hand offers a clean web-to-web handshake accompanied by steady eye contact.',
    },
  },
  {
    id: 'bl_scen_interview',
    number: '02',
    title: '1-on-1 & Panel Interview: Seated Posture & Eye Triangle',
    subtitle: 'Anchor the Core · 70/30 Eye Rule · Above-Table Hands',
    setting: 'In-Person HR & Technical Conference Room',
    imageKey: 'interview_posture',
    stakes:
      'Slumping into the backrest reads as low drive; leaning stiffly on elbows reads as intrusive. Balanced alignment projects calm readiness.',
    goldenRule:
      'Sit back 85% into the chair with a straight unsupported upper spine, slight 5-degree forward lean of interest, and hands resting naturally above table height.',
    channels: [
      {
        channel: 'Eye Contact',
        mistakeSignal:
          'Staring unblinkingly at one panelist (creepy) or looking at the ceiling/floor whenever thinking of a technical example.',
        executiveSignal:
          'Hold 60–70% warm eye contact across the upper-eye triangle; in multi-person panels, open with the questioner and sweep smoothly to each member.',
        recruiterTakeaway:
          'Sweeping multi-panel eye contact makes every evaluator feel included in your answer.',
      },
      {
        channel: 'Posture & Spine',
        mistakeSignal:
          'Sliding down with ankles stretched forward into the aisle, or twisting chair left-right nervously on a swivel base.',
        executiveSignal:
          'Feet planted flat or ankles neatly crossed beneath the knees; swivel chair locked facing the panel squarely.',
        recruiterTakeaway:
          'Swivel rocking leaks anxiety visually even when your words sound confident.',
      },
      {
        channel: 'Hands & Gestures',
        mistakeSignal:
          'Hiding hands clenched under the table, clicking a ballpoint pen repeatedly, or crossing arms tightly across the chest.',
        executiveSignal:
          'Rest forearms lightly on the desk edge and use measured open-palm gestures within the "power box" (navel to collarbone) when explaining impact.',
        recruiterTakeaway:
          'Visible open palms trigger subconscious trust; pen clicking destroys listener focus.',
      },
      {
        channel: 'Vocal Pace & Micro-Expressions',
        mistakeSignal:
          'Nodding frantically like a metronome to please the interviewer or keeping a frozen blank stare.',
        executiveSignal:
          'Slow thoughtful 1-second pause before answering tough questions, paired with subtle relaxed eyebrows and composed breathing.',
        recruiterTakeaway:
          'A calm 1-second pause before speaking communicates seniority and structured thought.',
      },
    ],
    challenge: {
      prompt:
        'During a 4-member panel interview, Member #2 asks a deep architectural question. Whom should you look at while answering?',
      options: [
        'Stare exclusively at Member #2 for the entire 90-second answer and ignore everyone else',
        'Look only at the table notes so you don’t lose your train of thought',
        'Begin with Member #2 for the first 3–4 seconds, naturally sweep warm eye contact across Members #1, #3, and #4 as you explain, and land back on Member #2 to close',
        'Look slightly above everyone’s heads toward the back wall',
      ],
      correctIndex: 2,
      explanation:
        'Starting and ending with the questioner respects their prompt, while sweeping smoothly across the remaining panel members engages the entire room and earns higher team-fit ratings.',
    },
  },
  {
    id: 'bl_scen_virtual',
    number: '03',
    title: 'Virtual & Hybrid Interview: Webcam Lens, Framing & Key Light',
    subtitle: 'Camera Elevation · Headroom Geometry · Desk Micro-Signals',
    setting: 'Remote Video Interview (Zoom / Meet / Teams)',
    imageKey: 'virtual_camera',
    stakes:
      'Low laptop cameras force interviewers to look up your nostrils while dark backlighting turns your expression into a silhouette.',
    goldenRule:
      'Raise the laptop on a stand or sturdy books so the webcam sits at eye level, face natural daylight, and look into the camera lens—not the bottom-corner self-view.',
    channels: [
      {
        channel: 'Eye Contact',
        mistakeSignal:
          'Watching your own tiny video tile or staring down at the screen center so to the interviewer you appear to be looking down.',
        executiveSignal:
          'Move the interviewer’s video window directly beneath the webcam lens and glance cleanly at the green camera dot on key takeaways.',
        recruiterTakeaway:
          'Lens alignment mimics true in-person eye contact across video calls.',
      },
      {
        channel: 'Spatial & Framing',
        mistakeSignal:
          'Tight forehead crop cutting off your chin, or sitting 2 meters away with clutter/unmade bed behind you.',
        executiveSignal:
          'Frame from mid-chest/ribs up (so open hand gestures stay visible) with 10% headroom above your hair and a clean, distraction-free backdrop.',
        recruiterTakeaway:
          'Mid-chest framing ensures your hand gestures aren’t awkwardly cropped off-screen.',
      },
      {
        channel: 'Posture & Spine',
        mistakeSignal:
          'Slouching with chin propped in hand, leaning face inches from screen, or swiveling desk chair back and forth.',
        executiveSignal:
          'Seat height balanced at arm’s length from screen, chest upright, slight forward engagement on key points.',
        recruiterTakeaway:
          'Leaning nose-close to a laptop makes screen gestures feel jarring on 4K monitors.',
      },
      {
        channel: 'Hands & Gestures',
        mistakeSignal:
          'Typing noisy notes mid-conversation without warning or fidgeting with earbuds/necklace near the mic.',
        executiveSignal:
          'Keep gestures smooth and moderate inside frame width; keep a physical pen & notepad just beside the laptop and briefly mention "I’m jotting that down."',
        recruiterTakeaway:
          'Mechanical keyboard clatter during someone else’s explanation signals distraction.',
      },
    ],
    challenge: {
      prompt:
        'You have a critical final-round Google Meet interview in 15 minutes at home. Your window is directly behind your chair, making your face dark on preview. What is the single highest-impact fix?',
      options: [
        'Turn on a blurry virtual beach background and sit in the same spot',
        'Rotate your desk setup so you face the natural window light (key light in front of you) and elevate the laptop to eye level on books or a stand',
        'Zoom the camera in so only your eyes and forehead show',
        'Turn off your camera completely and say Wi-Fi is slow',
      ],
      correctIndex: 1,
      explanation:
        'Facing the window turns harsh silhouette backlighting into flattering, crisp front key lighting, and elevating the webcam to eye level instantly boosts virtual executive presence.',
    },
  },
  {
    id: 'bl_scen_gd',
    number: '04',
    title: 'Group Discussion Roundtable: Open-Palm Entry & Active Listening',
    subtitle: 'Non-Verbal Turn-Taking · Peer Alliance · Anti-Aggression Cues',
    setting: '6-to-10 Candidate Placement Group Discussion',
    imageKey: 'gd_listening',
    stakes:
      'Evaluators watch GD candidates EVEN MORE closely during the 80% of time they are NOT speaking—crossed arms, eye-rolls, or finger-pointing trigger instant deductions.',
    goldenRule:
      'Use open upward palms to invite ideas, avoid aggressive index-finger pointing, and demonstrate visible listening via steady head tracking and brief note jotting.',
    channels: [
      {
        channel: 'Hands & Gestures',
        mistakeSignal:
          'Stabbing the air with a pointed index finger ("You are completely wrong!") or leaning back with arms tightly folded across the chest.',
        executiveSignal:
          'Raise an open palm slightly from wrist level to signal entry, and pivot your palms upward/together when building consensus across teammates.',
        recruiterTakeaway:
          'Finger pointing registers as hostility; open palms register as collaborative leadership.',
      },
      {
        channel: 'Eye Contact',
        mistakeSignal:
          'Staring repeatedly at the moderator/evaluator for approval ("Are you noticing me?") instead of addressing peers.',
        executiveSignal:
          'Address the roundtable peers directly—including quieter participants on the far side—never looking at the evaluator mid-debate.',
        recruiterTakeaway:
          'Looking at the moderator breaks GD realism and signals validation-seeking.',
      },
      {
        channel: 'Vocal Pace & Micro-Expressions',
        mistakeSignal:
          'Smirking, shaking head impatiently, or sighing loudly while a rival candidate speaks.',
        executiveSignal:
          'Neutral attentive face, subtle slow nods when a peer makes a valid data point, and jotting keywords to cite them by name later.',
        recruiterTakeaway:
          'Citing a peer ("Building on Ananya’s supply-chain point...") proves active listening.',
      },
      {
        channel: 'Posture & Spine',
        mistakeSignal:
          'Sprawling elbows onto neighbors’ notepad space or turning sideways away from half the table.',
        executiveSignal:
          'Squared comfortable posture centered to the table, slight lean forward when preparing to contribute cleanly.',
        recruiterTakeaway:
          'A slight 5-degree forward lean visually signals to peers that you are ready to enter smoothly.',
      },
    ],
    challenge: {
      prompt:
        'During a heated GD, a loud candidate keeps talking over everyone while looking only at the moderator. How do you distinguish yourself non-verbally and verbally?',
      options: [
        'Slap the table twice and point your index finger to demand silence',
        'Lean back, cross your arms, and shake your head visibly so the evaluator notices their rudeness',
        'Maintain calm open posture, wait for a half-second breath pause, raise an open palm toward the center, make eye contact with the group, and summarize both sides concisely',
        'Look straight at the moderator and ask them to deduct marks from the loud candidate',
      ],
      correctIndex: 2,
      explanation:
        'Calm open posture + a subtle open-palm gesture + addressing peers (never tattling to the moderator) showcases rare emotional maturity and facilitation leadership.',
    },
  },
  {
    id: 'bl_scen_stress',
    number: '05',
    title: 'Stress Round & Boardroom Q&A: Steepled Poise Under Challenge',
    subtitle: 'Handling Skepticism · Eliminating Pacifiers · Grounded Stance',
    setting: 'Senior Leadership / Stress Interview / Capstone Defense',
    imageKey: 'boardroom_presence',
    stakes:
      'When an interviewer deliberately challenges your project or asks a sharp "Why should we hire you over 500 others?", nervous pacifiers spike.',
    goldenRule:
      'Resist defensive arm-crossing or neck-touching. Drop your shoulders on an exhale, ground both feet, keep fingers relaxed or lightly steepled at waist height, and slow vocal speed by 15%.',
    channels: [
      {
        channel: 'Micro-Expressions & Pacifiers',
        mistakeSignal:
          'Self-soothing pacifiers—rubbing back of the neck, touching earlobes, biting lower lip, or forced nervous giggling under critique.',
        executiveSignal:
          'Unhurried neutral stillness—receive the hard objection silently for 1 full beat, steady breathing, no defensive flinch.',
        recruiterTakeaway:
          'Touching the neck or face under tough questions exposes acute stress.',
      },
      {
        channel: 'Hands & Gestures',
        mistakeSignal:
          'Wringing hands tightly, cracking knuckles, or defensively clutching folder against chest like a shield.',
        executiveSignal:
          'Light fingertip-to-fingertip steepling at waist/table level (never blocking your face) or resting one hand calmly atop your open notes.',
        recruiterTakeaway:
          'Measured waist-level steepling communicates calm conviction without arrogance.',
      },
      {
        channel: 'Posture & Spine',
        mistakeSignal:
          'Shifting weight endlessly foot-to-foot while standing or shrinking shoulders inward when challenged.',
        executiveSignal:
          'Feet planted hip-width apart (when standing) or spine anchored evenly (when seated), shoulders level and un-tensed.',
        recruiterTakeaway:
          'A grounded, motionless lower body makes every word carry twice the authority.',
      },
      {
        channel: 'Vocal Pace & Micro-Expressions',
        mistakeSignal:
          'Rushing defensively at 220 words/min with rising pitch ("uptalk") that makes statements sound like nervous questions.',
        executiveSignal:
          'Downward pitch inflection at the end of sentences, deliberate pauses between evidence points, and even breathing.',
        recruiterTakeaway:
          'Downward intonation signals certainty; rising intonation under challenge undermines strong logic.',
      },
    ],
    challenge: {
      prompt:
        'An executive panelist frowns and says sharply: "Your project metrics look inflated—why shouldn’t I doubt this result?" Which immediate non-verbal response shows executive composure?',
      options: [
        'Immediately cross your arms, lean back defensively, and speak faster to defend yourself',
        'Rub the back of your neck, chuckle nervously, and say "Maybe it’s a small mistake, sorry"',
        'Exhale calmly, keep shoulders open and uncrossed, pause for 1 second with steady eye contact, and walk through the exact verification methodology in a measured downward tone',
        'Look down at your shoes until they move to the next question',
      ],
      correctIndex: 2,
      explanation:
        'Pause + relaxed open shoulders + calm eye contact + measured downward vocal inflection proves you do not rattle under executive pressure.',
    },
  },
  {
    id: 'bl_scen_negotiation',
    number: '06',
    title: 'Offer & Salary Negotiation: Mirroring, Silence & Value Framing',
    subtitle: 'HR Offer Table · Strategic Pause · Collaborative Body Alignment',
    setting: 'Final HR Compensation & Role Alignment Conversation',
    imageKey: 'interview_posture',
    stakes:
      'Over-eager nodding gives away anchoring leverage immediately, while rigid cross-armed resistance turns a mutual offer discussion adversarial.',
    goldenRule:
      'Stay warmly uncrossed, write down the initial offer calmly rather than reacting emotionally, hold 2 seconds of comfortable silence, and gesture collaboratively toward shared goals.',
    channels: [
      {
        channel: 'Vocal Pace & Micro-Expressions',
        mistakeSignal:
          'Flashing wide-eyed shock or instantly grinning and nodding yes before hearing the full variable/fixed split.',
        executiveSignal:
          'Composed, appreciative nod while jotting the exact numbers in your notebook, letting a calm 2-second pause breathe before responding.',
        recruiterTakeaway:
          'A calm 2-second pause after an offer often prompts HR to voluntarily share flexibility on joining bonus or bands.',
      },
      {
        channel: 'Posture & Spine',
        mistakeSignal:
          'Pushing chair backward aggressively or folding arms tightly to signal "take it or leave it" hostility.',
        executiveSignal:
          'Relaxed upright torso tilted slightly collaboratively toward the shared offer sheet, projecting "We are solving this together."',
        recruiterTakeaway:
          'Collaborative alignment keeps goodwill high even while negotiating higher total compensation.',
      },
      {
        channel: 'Hands & Gestures',
        mistakeSignal:
          'Empty-handed fidgeting or tapping fingers impatiently on the desk while HR calculates bands.',
        executiveSignal:
          'One hand resting calmly beside your pen on the offer sheet, subtle open-palm gestures when linking role scope to market benchmarks.',
        recruiterTakeaway:
          'Structured note-taking anchors the discussion in objective value rather than emotion.',
      },
      {
        channel: 'Eye Contact',
        mistakeSignal:
          'Breaking eye contact and looking sideways nervously the moment you state your target compensation range.',
        executiveSignal:
          'State your researched range clearly while holding natural, warm, relaxed eye contact—then stop talking cleanly.',
        recruiterTakeaway:
          'Holding calm eye contact after stating your number prevents nervous self-discounting ("...or whatever works for you!").',
      },
    ],
    challenge: {
      prompt:
        'The HR Lead states a base salary 12% below your researched benchmark and watches your face closely. What non-verbal move preserves both goodwill and negotiating leverage?',
      options: [
        'Immediately cross your arms, sigh loudly, and shake your head "No"',
        'Smile nervously, nod fast, and accept on the spot so you don’t seem greedy',
        'Hold a calm neutral smile, write the figure down neatly, pause 2 seconds with relaxed open posture, and then ask calmly with steady eye contact how variable/joining components bridge to market range',
        'Pull out your phone and compare salaries on an app mid-sentence',
      ],
      correctIndex: 2,
      explanation:
        'Jotting the offer + a relaxed 2-second pause + open posture + direct warm eye contact keeps negotiations rational, respectful, and effective.',
    },
  },
];

export const BODY_LANGUAGE_MCQS: BodyLanguageMcq[] = [
  {
    id: 'bl_q1',
    topic: 'First 7 Seconds & Lobby Etiquette',
    difficulty: 'Core',
    scenario: 'You are waiting in the lobby outside the interview room with your folder and backpack.',
    question:
      'Which hand should hold your portfolio folder as you approach the interviewer to greet them?',
    options: [
      'Your right hand, so you can show the resume faster',
      'Your left hand, keeping your right hand dry, relaxed, and immediately ready for a smooth handshake',
      'Pinched under your chin while checking your phone',
      'Balanced on top of your laptop with both hands',
    ],
    correctIndex: 1,
    hint: 'Think about avoiding awkward fumbling during the first 3 seconds.',
    explanation:
      'Keeping your portfolio in your left hand ensures your right hand is free, dry, and unhurried for a balanced handshake or smooth greeting.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q2',
    topic: 'Handshake Mechanics',
    difficulty: 'Core',
    scenario: 'The hiring manager extends their right hand for an in-person greeting.',
    question:
      'Which handshake execution communicates mutual confidence and respect without aggression?',
    options: [
      'Extending only your four fingertips lightly ("limp clasp")',
      'Rotating your palm face-down on top of their hand to establish dominance',
      'Full web-to-web vertical palm alignment matching their firmness for 2 brief pumps with warm eye contact',
      'Squeezing at maximum strength for 8 seconds',
    ],
    correctIndex: 2,
    hint: 'Notice the alignment between thumb-index webs and palm angle.',
    explanation:
      'Vertical web-to-web palm alignment with matched pressure for 1–2 pumps communicates balanced equality and composure.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q3',
    topic: 'Eye Contact Calibration',
    difficulty: 'Core',
    scenario: 'A 1-on-1 behavioral interview with an Engineering Manager.',
    question:
      'What eye-contact ratio and focal zone builds maximum trust without feeling like an intense stare?',
    options: [
      '100% unblinking stare directly into one pupil',
      '60–70% relaxed gaze centered on the upper-eye/bridge triangle, with brief natural upward/side thinking glances',
      '20% glance at the interviewer and 80% down at your resume',
      'Looking steadily at their left shoulder',
    ],
    correctIndex: 1,
    hint: 'Natural dialogue blends listening focus with brief thinking breaks.',
    explanation:
      'Roughly 60–70% gentle eye-triangle contact paired with occasional natural thinking glances reads as authentic confidence rather than robotic staring or evasion.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q4',
    topic: 'Panel Sweep Technique',
    difficulty: 'Applied',
    scenario: 'Three interviewers sit across a conference table; the person on the left asks a question.',
    question:
      'How should you distribute eye contact while delivering a 60-second STAR answer?',
    options: [
      'Look strictly at the person on the left and ignore the other two',
      'Look only at the most senior-looking person in the middle',
      'Open on the questioner for 3–4 seconds, smoothly include the other two panelists across the body of your answer, and return to the questioner to finish',
      'Alternate looking left-right rapidly every 1 second like watching tennis',
    ],
    correctIndex: 2,
    hint: 'Treat the panel as one unified conversation while honoring who asked.',
    explanation:
      'Anchoring on the questioner at the start and end while naturally sweeping across each colleague builds rapport with every decision-maker at the table.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q5',
    topic: 'Seated Chair & Foot Grounding',
    difficulty: 'Core',
    scenario: 'You are seated on a rolling swivel chair across from an HR panel.',
    question:
      'Which lower-body habit silently undermines candidate credibility on video or glass-walled tables?',
    options: [
      'Planting both feet firmly on the floor',
      'Restlessly swiveling left-right, bouncing one knee, or hooking feet nervously behind chair legs',
      'Crossing ankles neatly beneath your knees',
      'Sitting upright with lower back supported',
    ],
    correctIndex: 1,
    hint: 'Restless lower-body motion translates straight into upper-torso wobble.',
    explanation:
      'Swiveling and knee-bouncing broadcast suppressed anxiety. Grounding your feet or ankles keeps your torso steady and poised.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q6',
    topic: 'Virtual Interview Camera Geometry',
    difficulty: 'Applied',
    scenario: 'Preparing your laptop 20 minutes before a remote video screening.',
    question:
      'Where should your webcam lens be positioned relative to your eyes and lighting?',
    options: [
      'Flat on the desk looking upward at your ceiling, with a bright window behind you',
      'Elevated on a stand/books to exact eye level, with soft key light facing you and framing from mid-chest up',
      'Two inches from your forehead pointing sharply downward',
      'Placed on a side desk 45 degrees away from your monitor',
    ],
    correctIndex: 1,
    hint: 'Avoid "looking down at the panel" and avoid backlit silhouettes.',
    explanation:
      'Eye-level webcam elevation + front key lighting + mid-chest framing matches natural eye-level conversation and keeps hand gestures visible.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q7',
    topic: 'Virtual Eye-Line Trick',
    difficulty: 'Applied',
    scenario: 'On Zoom/Meet, the interviewer video tile sits at the bottom-right corner of your monitor.',
    question:
      'To make the interviewer feel you are looking them in the eye on their screen, what should you adjust?',
    options: [
      'Keep their window in the bottom-right corner so you glance sideways the whole time',
      'Drag their video window to the top-center directly beneath the webcam lens and look into the lens on key points',
      'Look strictly at your keyboard while speaking',
      'Maximize your own self-view full screen',
    ],
    correctIndex: 1,
    hint: 'Shrink the angle between the face you are watching and the physical camera sensor.',
    explanation:
      'Placing the interviewer’s window top-center right under your webcam aligns your natural gaze closely with the camera lens.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q8',
    topic: 'Hand Visibility & Power Box',
    difficulty: 'Applied',
    scenario: 'Explaining a complex database migration you led during a technical round.',
    question:
      'Where should your hands be positioned while listening and speaking in an interview?',
    options: [
      'Hidden tightly clasped under the table on your lap the entire time',
      'Resting comfortably above the table edge, using purposeful open-palm gestures in the chest-to-navel zone',
      'Waving wildly above your head near the ceiling lights',
      'Clicking a retractable pen rapidly to keep rhythm',
    ],
    correctIndex: 1,
    hint: 'Visible open hands correlate strongly with perceived honesty and clarity.',
    explanation:
      'Keeping hands visible above table height and gesturing calmly within the torso "power box" enhances verbal clarity and signals transparency.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q9',
    topic: 'GD Non-Verbal Turn-Taking',
    difficulty: 'Applied',
    scenario: 'Inside an 8-candidate Group Discussion where two speakers dominate.',
    question:
      'Which non-verbal cue is perceived positively when entering a GD discussion?',
    options: [
      'Pointing an index finger directly at a speaker and saying "Stop talking"',
      'Standing up abruptly and banging the table',
      'Leaning forward slightly with an open palm raised modestly from wrist height, catching group eye contact on a breath pause',
      'Slouching back with folded arms until the moderator points at you',
    ],
    correctIndex: 2,
    hint: 'Notice the difference between aggressive pointing and inviting open palms.',
    explanation:
      'A subtle forward lean plus an open palm signals polite intent to contribute without escalating hostility.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q10',
    topic: 'GD Silent-Time Evaluation',
    difficulty: 'Executive',
    scenario: 'A peer has been speaking for 45 seconds in a Group Discussion; you are waiting for your turn.',
    question:
      'What behavior during those 45 seconds earns positive evaluator marks even before you speak?',
    options: [
      'Staring straight at the moderator to show impatience with the current speaker',
      'Rolling your eyes and mouthing "wrong" to your neighbor',
      'Maintaining attentive posture toward the speaker, nodding subtly at strong points, and noting keywords to reference them by name',
      'Flipping through unrelated pages ignoring the speaker',
    ],
    correctIndex: 2,
    hint: 'Active listening is visibly scored in campus and IIM/corporate GDs.',
    explanation:
      'Attentive orientation, composed expressions, and referencing a peer’s point later prove collaborative maturity.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q11',
    topic: 'Decoding Stress Pacifiers',
    difficulty: 'Executive',
    scenario: 'An interviewer challenges a gap in your resume with a skeptical tone.',
    question:
      'Which physical habit is a classic "stress pacifier" that signals heightened discomfort to trained interviewers?',
    options: [
      'Taking a calm 1-second breath pause before replying',
      'Repeatedly rubbing the back of your neck, touching your throat/collar, or covering your mouth while speaking',
      'Resting forearms lightly on the desk',
      'Looking steadily while summarizing your actions',
    ],
    correctIndex: 1,
    hint: 'Self-soothing gestures around the neck, face, and suprasternal notch spike under threat.',
    explanation:
      'Neck-rubbing, collar-tugging, and mouth-shielding are unconscious self-pacifying behaviors that undercut verbal confidence.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q12',
    topic: 'Vocal Cadence & Inflection',
    difficulty: 'Executive',
    scenario: 'You state: "My architecture reduced API latency by 42%."',
    question:
      'Why does "uptalk" (ending declarative sentences with a rising question-like pitch) hurt placement impact?',
    options: [
      'Microphones cannot record rising pitches',
      'Rising terminal inflection subconsciously makes factual achievements sound uncertain or like you are begging for validation',
      'It makes your answer shorter',
      'It is only allowed in Python technical rounds',
    ],
    correctIndex: 1,
    hint: 'Compare "I led the project?" vs "I led the project."',
    explanation:
      'Declarative downward pitch inflection communicates ownership and conviction; rising inflection makes verified impact sound tentative.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q13',
    topic: 'Steepling & Authority Balance',
    difficulty: 'Executive',
    scenario: 'Presenting your capstone Q&A defense to senior leadership.',
    question:
      'How do you use the "steepled hands" gesture correctly without appearing arrogant or blocking your face?',
    options: [
      'Hold tightly steepled hands directly in front of your nose and mouth',
      'Point steepled fingers directly at the interviewer’s chest',
      'Keep fingers loosely touching at waist or conference-table height while relaxed and speaking calmly',
      'Hold steepled hands high above your head',
    ],
    correctIndex: 2,
    hint: 'Height determines whether steepling reads as poise or pomposity.',
    explanation:
      'Loose waist- or desk-level steepling signals calm, collected thought; face-level steepling creates a physical barrier and looks pompous.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q14',
    topic: 'Salary Negotiation Micro-Signals',
    difficulty: 'Executive',
    scenario: 'HR shares an initial compensation figure slightly below your expectation.',
    question:
      'After HR finishes stating the offer, what should your immediate 2-second non-verbal action be?',
    options: [
      'Flinch visibly and push your chair back',
      'Nervously laugh and say "Actually anything is okay if you can’t increase it"',
      'Maintain a composed slight smile, write the exact figure down calmly, hold 2 seconds of poised silence, and keep posture collaboratively open',
      'Cross both arms tightly and stare at the ceiling',
    ],
    correctIndex: 2,
    hint: 'Emotional reactivity or hasty self-discounting destroys leverage.',
    explanation:
      'Writing down the figure + holding 2 seconds of calm open silence projects poised professionalism and gives space for thoughtful value negotiation.',
    xpClean: 30,
    xpWithHint: 20,
  },
  {
    id: 'bl_q15',
    topic: 'Crossed Arms & Context Reading',
    difficulty: 'Applied',
    scenario: 'During your presentation, an interviewer briefly folds their arms and tilts their head to one side.',
    question:
      'What is the wisest executive reading—and response—to a single isolated closed cue?',
    options: [
      'Assume immediately they hate you and rush through your remaining slides',
      'Stop talking and ask "Why are you closing your body language?"',
      'Read gesture clusters rather than single cues (they may just be cold or thinking deeply); continue smoothly with open palms and invite a clarifying question',
      'Fold your own arms tightly to mirror them defensively',
    ],
    correctIndex: 2,
    hint: 'Never over-react to one isolated body signal without context.',
    explanation:
      'Trained communicators evaluate clusters (face, tension, lean, tone) rather than one isolated posture like folded arms, which often signals cold air-conditioning or deep concentration.',
    xpClean: 30,
    xpWithHint: 20,
  },
];

export const BODY_LANGUAGE_BADGES: BodyLanguageBadge[] = [
  {
    id: 'bl_badge_first_7',
    title: 'First 7 Seconds Ace',
    description: 'Inspected all 6 executive body language scenarios and cue breakdowns.',
    criteriaLabel: 'Explore all 6 Visual Scenarios',
    accent: 'teal',
    checkUnlocked: ({ exploredScenarios }) =>
      BODY_LANGUAGE_SCENARIOS.every((s) => exploredScenarios.includes(s.id)),
  },
  {
    id: 'bl_badge_cue_solver',
    title: 'Signal Tactician',
    description: 'Solved every real-world placement adjustment challenge across all 6 scenarios.',
    criteriaLabel: 'Solve all 6 Scenario Challenges',
    accent: 'blue',
    checkUnlocked: ({ solvedChallenges }) =>
      BODY_LANGUAGE_SCENARIOS.every((s) => solvedChallenges.includes(s.id)),
  },
  {
    id: 'bl_badge_presence_master',
    title: 'Executive Presence',
    description: 'Completed all 15 Body Language scenario MCQs with strong placement accuracy.',
    criteriaLabel: 'Answer all 15 MCQs (11+ Correct)',
    accent: 'violet',
    checkUnlocked: ({ answeredMcqs, correctMcqs }) =>
      answeredMcqs.length >= 15 && correctMcqs.length >= 11,
  },
  {
    id: 'bl_badge_boardroom_gold',
    title: 'Kapil Non-Verbal Fellow',
    description: 'Mastered scenarios, action challenges, and 15/15 graded MCQs together.',
    criteriaLabel: 'Complete 6 Scenarios + Challenges + 15 MCQs',
    accent: 'amber',
    checkUnlocked: ({
      exploredScenarios,
      solvedChallenges,
      answeredMcqs,
      correctMcqs,
    }) =>
      exploredScenarios.length >= 6 &&
      solvedChallenges.length >= 6 &&
      answeredMcqs.length >= 15 &&
      correctMcqs.length >= 12,
  },
];

export function computeBodyLanguageBadges(stats: {
  exploredScenarios: string[];
  solvedChallenges: string[];
  answeredMcqs: string[];
  correctMcqs: string[];
}): string[] {
  return BODY_LANGUAGE_BADGES.filter((b) => b.checkUnlocked(stats)).map(
    (b) => b.id
  );
}

export function getBodyLanguageRank(xp: number): {
  title: string;
  nextTitle: string | null;
  minXp: number;
  nextXp: number | null;
} {
  if (xp >= 650) {
    return {
      title: 'Boardroom Presence Laureate',
      nextTitle: null,
      minXp: 650,
      nextXp: null,
    };
  }
  if (xp >= 450) {
    return {
      title: 'Executive Signal Strategist',
      nextTitle: 'Boardroom Presence Laureate',
      minXp: 450,
      nextXp: 650,
    };
  }
  if (xp >= 250) {
    return {
      title: 'Interview Poise Specialist',
      nextTitle: 'Executive Signal Strategist',
      minXp: 250,
      nextXp: 450,
    };
  }
  return {
    title: 'Non-Verbal Observer',
    nextTitle: 'Interview Poise Specialist',
    minXp: 0,
    nextXp: 250,
  };
}

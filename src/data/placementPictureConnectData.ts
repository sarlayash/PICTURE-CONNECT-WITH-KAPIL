import { PhotoAssetKey } from './imageAssets';
import {
  ArtworkId,
  BOARDROOM_CLUES,
  BoardroomClue,
  MEMORY_OBJECTS_HARD,
  MEMORY_OBJECTS_STANDARD,
  MemoryObject,
  WORKPLACE_MISTAKES,
  WorkplaceMistake,
} from './workshopData';

// =============================================================================
// LEVEL 1: +5 Placement-Oriented Perspective Scenes (4 Original + 5 New = 9)
// =============================================================================
export interface Level1Scene {
  id: string;
  title: string;
  artwork: ArtworkId;
  photoKey: PhotoAssetKey;
  placementContext: string;
  interviewAngle: string;
  isPlacementNew?: boolean;
}

export const LEVEL1_PLACEMENT_SCENES: Level1Scene[] = [
  {
    id: 'l1-orig-crossroads',
    title: 'A Person Standing at a Crossroads',
    artwork: 'crossroads',
    photoKey: 'crossroads',
    placementContext: 'Career Specialization Choice',
    interviewAngle: 'How do you decide between a high-paying service offer vs a steep-learning product startup?',
  },
  {
    id: 'l1-orig-pencil',
    title: 'A Broken Pencil',
    artwork: 'broken_pencil',
    photoKey: 'broken_pencil',
    placementContext: 'Bounce-Back After Rejection',
    interviewAngle: 'Tell me about a time a setback sharpened your technical or personal preparation.',
  },
  {
    id: 'l1-orig-paperclip',
    title: 'A Titanium Paperclip',
    artwork: 'paperclip',
    photoKey: 'paperclip',
    placementContext: 'Simplicity & Cross-Team Alignment',
    interviewAngle: 'How do you keep a project team aligned when requirements change mid-sprint?',
  },
  {
    id: 'l1-orig-window',
    title: 'A Rain-Streaked Window Reflection',
    artwork: 'emotion_scene',
    photoKey: 'emotion_scene',
    placementContext: 'Composure Under Pressure',
    interviewAngle: 'How do you stay calm and reflective during high-stakes placement weeks?',
  },
  // +5 NEW Placement-Oriented Images
  {
    id: 'l1-pl-whiteboard',
    title: 'Technical Whiteboard Round (DSA & System Design)',
    artwork: 'keyboard',
    photoKey: 'placement_whiteboard_dsa',
    placementContext: 'FAANG / Product Technical Interview',
    interviewAngle: 'Think aloud: what separates an engineer who draws clean trade-offs from one who codes in silence?',
    isPlacementNew: true,
  },
  {
    id: 'l1-pl-resume',
    title: 'The 6-Second ATS Resume & Portfolio Desk',
    artwork: 'notebook',
    photoKey: 'placement_resume_desk',
    placementContext: 'Recruiter Screening & Proof of Work',
    interviewAngle: 'In a 6-second recruiter scan, what story does your desk and resume project before you even speak?',
    isPlacementNew: true,
  },
  {
    id: 'l1-pl-gd',
    title: 'Group Discussion Roundtable Under Observation',
    artwork: 'teamwork',
    photoKey: 'placement_gd_roundtable',
    placementContext: 'Campus GD Elimination Round',
    interviewAngle: 'Is the loudest speaker leading this table, or the person who synthesizes everyone’s points?',
    isPlacementNew: true,
  },
  {
    id: 'l1-pl-offer',
    title: 'The Sealed Offer Letter & Brass Compass',
    artwork: 'compass',
    photoKey: 'placement_offer_envelope',
    placementContext: 'Offer Evaluation & Career Direction',
    interviewAngle: 'When two job offers arrive, what matters more—immediate CTC or 3-year skill compounding?',
    isPlacementNew: true,
  },
  {
    id: 'l1-pl-lobby',
    title: 'Five Minutes Before the Final HR Round',
    artwork: 'interview',
    photoKey: 'placement_waiting_corridor',
    placementContext: 'Executive Presence & First Impressions',
    interviewAngle: 'What mental framing transforms pre-interview anxiety into composed executive curiosity?',
    isPlacementNew: true,
  },
  // +5 MORE Placement-Oriented Images (Batch 2)
  {
    id: 'l1-pl-career-fair',
    title: 'Campus Career Fair & 30-Second Recruiter Handoff',
    artwork: 'business',
    photoKey: 'placement_career_fair',
    placementContext: 'Campus Hiring Drive & Elevator Pitch',
    interviewAngle: 'With 200 students in line behind you, what opening sentence makes a recruiter star your resume immediately?',
    isPlacementNew: true,
  },
  {
    id: 'l1-pl-code-review',
    title: 'Live Pair-Programming & Pull Request Code Review',
    artwork: 'keyboard',
    photoKey: 'placement_code_review',
    placementContext: 'Engineering Craft & Receiving Critique',
    interviewAngle: 'When a senior engineer spots a flaw in your code, how do you respond without ego and level up fast?',
    isPlacementNew: true,
  },
  {
    id: 'l1-pl-hackathon',
    title: 'Campus Hackathon Sprint With 3 Hours Left',
    artwork: 'teamwork',
    photoKey: 'placement_hackathon_sprint',
    placementContext: 'Agile Delivery & Proof of Work',
    interviewAngle: 'With 3 hours on the clock and half the features unfinished, what do you cut so the live demo shines?',
    isPlacementNew: true,
  },
  {
    id: 'l1-pl-mentor-coffee',
    title: 'Alumni & Executive Mentorship Coffee Chat',
    artwork: 'coffee_cup',
    photoKey: 'placement_networking_coffee',
    placementContext: 'Warm Referrals & Career Curiosity',
    interviewAngle: 'What thoughtful question earns a genuine referral instead of a transactional "please refer me" message?',
    isPlacementNew: true,
  },
  {
    id: 'l1-pl-day1-desk',
    title: 'Day-1 Corporate Onboarding Desk & Access Badge',
    artwork: 'ladder',
    photoKey: 'placement_onboarding_day1',
    placementContext: 'First 90 Days & High-Ownership Launch',
    interviewAngle: 'Getting placed is Day 0—what habits in your first 90 days separate fast-track performers from average hires?',
    isPlacementNew: true,
  },
];

// =============================================================================
// LEVEL 2: +5 Placement-Oriented Impossible Connection Pairs
// =============================================================================
export interface PlacementImpossiblePair {
  id: string;
  leftTitle: string;
  leftArtwork: ArtworkId;
  leftPhotoKey?: PhotoAssetKey;
  rightTitle: string;
  rightArtwork: ArtworkId;
  rightPhotoKey?: PhotoAssetKey;
  photoKey?: PhotoAssetKey;
  possibleConnection: string;
  reasoningHint: string;
  placementRound: string;
  isPlacementNew?: boolean;
}

export const LEVEL2_PLACEMENT_EXTRA_PAIRS: PlacementImpossiblePair[] = [
  {
    id: 'pl-resume-lighthouse',
    leftTitle: 'ATS Resume Desk',
    leftArtwork: 'notebook',
    leftPhotoKey: 'placement_resume_desk',
    rightTitle: 'Lighthouse',
    rightArtwork: 'lighthouse',
    rightPhotoKey: 'lighthouse',
    possibleConnection: 'Signal Clarity in Recruiter Screening',
    reasoningHint:
      'Amid 1,000 crowded applications, quantified impact metrics on a 1-page resume act like a lighthouse beacon—cutting straight through hiring noise in 6 seconds.',
    placementRound: 'ATS & Shortlisting Round',
    isPlacementNew: true,
  },
  {
    id: 'pl-whiteboard-bridge',
    leftTitle: 'DSA Whiteboard',
    leftArtwork: 'keyboard',
    leftPhotoKey: 'placement_whiteboard_dsa',
    rightTitle: 'Suspension Bridge',
    rightArtwork: 'bridge',
    rightPhotoKey: 'bridge',
    possibleConnection: 'Engineering-to-Business Communication Bridge',
    reasoningHint:
      'A brilliant algorithm fails in a FAANG interview unless you bridge low-level complexity with clear spoken architecture—connecting logic on the board to interviewer trust.',
    placementRound: 'FAANG Technical & System Design',
    isPlacementNew: true,
  },
  {
    id: 'pl-offer-compass',
    leftTitle: 'Offer Envelope',
    leftArtwork: 'business',
    leftPhotoKey: 'placement_offer_envelope',
    rightTitle: 'Brass Compass',
    rightArtwork: 'compass',
    rightPhotoKey: 'compass',
    possibleConnection: 'Role Trajectory Over Short-Term CTC',
    reasoningHint:
      'A job offer gives momentum, but a career compass decides direction—top graduates evaluate mentorship, tech stack, and growth curve before signing.',
    placementRound: 'HR Offer & Negotiation Round',
    isPlacementNew: true,
  },
  {
    id: 'pl-virtual-camera',
    leftTitle: 'Virtual Interview Desk',
    leftArtwork: 'interview',
    leftPhotoKey: 'placement_virtual_interview',
    rightTitle: 'Rangefinder Camera',
    rightArtwork: 'camera',
    rightPhotoKey: 'camera',
    possibleConnection: 'Framing Executive Presence Remotely',
    reasoningHint:
      'In remote interviews for TCS, Amazon, or global startups, eye-level camera framing, clean lighting, and crisp audio control 55% of perceived confidence.',
    placementRound: 'Remote Video Interview Round',
    isPlacementNew: true,
  },
  {
    id: 'pl-coding-puzzle',
    leftTitle: 'Coding Assessment Lab',
    leftArtwork: 'keyboard',
    leftPhotoKey: 'placement_dsa_lab',
    rightTitle: 'Interlocking Puzzle',
    rightArtwork: 'puzzle',
    rightPhotoKey: 'puzzle',
    possibleConnection: 'Modular Code & Team Ownership',
    reasoningHint:
      'Production software is never a solo puzzle piece—clean interfaces, readable naming, and unit tests allow your code to lock cleanly into a 50-engineer codebase.',
    placementRound: 'Online Coding & Managerial Round',
    isPlacementNew: true,
  },
  // +5 MORE Placement-Oriented Pairs (Batch 2)
  {
    id: 'pl-careerfair-ripple',
    leftTitle: 'Campus Career Fair',
    leftArtwork: 'business',
    leftPhotoKey: 'placement_career_fair',
    rightTitle: 'Ripple Effect',
    rightArtwork: 'challenge_ripple',
    rightPhotoKey: 'challenge_ripple',
    possibleConnection: 'Compounding Value of One Memorable 30-Second Intro',
    reasoningHint:
      'One crisp, well-researched booth conversation at a campus drive creates expanding ripples—turning a brief handshake into a fast-track shortlist and team referral.',
    placementRound: 'Campus Networking & Pre-Placement Talk',
    isPlacementNew: true,
  },
  {
    id: 'pl-codereview-mirror',
    leftTitle: 'Pair Code Review',
    leftArtwork: 'keyboard',
    leftPhotoKey: 'placement_code_review',
    rightTitle: 'Mirror Lens',
    rightArtwork: 'mirror',
    rightPhotoKey: 'mirror',
    possibleConnection: 'Objective Feedback Without Ego',
    reasoningHint:
      'A senior engineer reviewing your pull request acts like a clean mirror—exposing edge cases and blind spots early so your engineering standard scales rapidly.',
    placementRound: 'Technical Bar-Raiser & Internship PPO',
    isPlacementNew: true,
  },
  {
    id: 'pl-hackathon-rocket',
    leftTitle: 'Hackathon Sprint',
    leftArtwork: 'teamwork',
    leftPhotoKey: 'placement_hackathon_sprint',
    rightTitle: 'Orbital Rocket',
    rightArtwork: 'rocket',
    rightPhotoKey: 'rocket',
    possibleConnection: 'Constraint-Driven Prototyping Velocity',
    reasoningHint:
      'Just like a launch countdown eliminates dead weight, a 24-hour hackathon strips away perfectionism and forces teams to ship working user value fast.',
    placementRound: 'Product & Startup Hiring Hackathon',
    isPlacementNew: true,
  },
  {
    id: 'pl-mentor-tree',
    leftTitle: 'Alumni Mentor Chat',
    leftArtwork: 'coffee_cup',
    leftPhotoKey: 'placement_networking_coffee',
    rightTitle: 'Deep-Rooted Oak',
    rightArtwork: 'tree',
    rightPhotoKey: 'tree',
    possibleConnection: 'Long-Term Mentorship Roots Before Career Growth',
    reasoningHint:
      'Careers do not grow in isolation—investing in genuine mentor relationships builds deep industry roots that steady you through rejections and pivots.',
    placementRound: 'Referral & Informational Interview',
    isPlacementNew: true,
  },
  {
    id: 'pl-day1-ladder',
    leftTitle: 'Day-1 Onboarding Desk',
    leftArtwork: 'notebook',
    leftPhotoKey: 'placement_onboarding_day1',
    rightTitle: 'Ascent Ladder',
    rightArtwork: 'ladder',
    rightPhotoKey: 'ladder',
    possibleConnection: 'Strong Onboarding Fundamentals Power Fast Promotions',
    reasoningHint:
      'Your Day-1 desk is the bottom rung of a corporate ladder—documenting workflows, asking smart questions, and owning small tickets earns rapid trust.',
    placementRound: 'HR Final & 90-Day Impact Question',
    isPlacementNew: true,
  },
];

// =============================================================================
// LEVEL 3: +5 Placement STAR Story Architect Cards (Second Full 5-Image Deck)
// =============================================================================
export interface StoryCardItem {
  step: number;
  beatLabel: string;
  id: string;
  title: string;
  artwork: ArtworkId;
  photoKey: PhotoAssetKey;
  placementTip?: string;
}

export const LEVEL3_PLACEMENT_STAR_CARDS: StoryCardItem[] = [
  {
    step: 1,
    beatLabel: 'Situation',
    id: 'ps1',
    title: 'ATS Resume & Prep Desk',
    artwork: 'notebook',
    photoKey: 'placement_resume_desk',
    placementTip: 'Set the stakes: target company, skill gap, or project deadline.',
  },
  {
    step: 2,
    beatLabel: 'Technical Test',
    id: 'ps2',
    title: 'Whiteboard DSA Round',
    artwork: 'keyboard',
    photoKey: 'placement_whiteboard_dsa',
    placementTip: 'Describe the hardest technical bottleneck or edge case you faced.',
  },
  {
    step: 3,
    beatLabel: 'Team Dynamics',
    id: 'ps3',
    title: 'GD Roundtable Debate',
    artwork: 'teamwork',
    photoKey: 'placement_gd_roundtable',
    placementTip: 'Show how you led with empathy, data, and consensus—not volume.',
  },
  {
    step: 4,
    beatLabel: 'Composure',
    id: 'ps4',
    title: 'Final HR Lobby',
    artwork: 'interview',
    photoKey: 'placement_waiting_corridor',
    placementTip: 'Highlight your calm decision under stress or tough panel follow-up.',
  },
  {
    step: 5,
    beatLabel: 'Result & Offer',
    id: 'ps5',
    title: 'Sealed Offer Letter',
    artwork: 'compass',
    photoKey: 'placement_offer_envelope',
    placementTip: 'Close with a quantified outcome (%, time saved, offer won).',
  },
];

// +5 MORE Level 3 Story Cards: Full 5-Card PPO & Day-1 Career Launch Arc
export const LEVEL3_PLACEMENT_LAUNCH_CARDS: StoryCardItem[] = [
  {
    step: 1,
    beatLabel: 'First Spark',
    id: 'pl1',
    title: 'Campus Career Fair Booth',
    artwork: 'business',
    photoKey: 'placement_career_fair',
    placementTip: 'Open with how you initiated the opportunity or spotted a real company need.',
  },
  {
    step: 2,
    beatLabel: 'Build Under Clock',
    id: 'pl2',
    title: 'Hackathon Prototype Sprint',
    artwork: 'teamwork',
    photoKey: 'placement_hackathon_sprint',
    placementTip: 'Show your bias for action: building, testing, and scoping an MVP under deadline.',
  },
  {
    step: 3,
    beatLabel: 'Feedback Loop',
    id: 'pl3',
    title: 'Senior Code Review',
    artwork: 'keyboard',
    photoKey: 'placement_code_review',
    placementTip: 'Share a tough critique you embraced and turned into cleaner architecture.',
  },
  {
    step: 4,
    beatLabel: 'Mentor Wisdom',
    id: 'pl4',
    title: 'Alumni Coffee Chat',
    artwork: 'coffee_cup',
    photoKey: 'placement_networking_coffee',
    placementTip: 'Explain how seeking external perspective sharpened your career or product strategy.',
  },
  {
    step: 5,
    beatLabel: 'Day-1 Launch',
    id: 'pl5',
    title: 'Corporate Onboarding Desk',
    artwork: 'ladder',
    photoKey: 'placement_onboarding_day1',
    placementTip: 'Conclude with your 90-day ownership plan and the value you brought to the team.',
  },
];

// =============================================================================
// LEVEL 4: +5 Placement-Oriented 15-Second Visual Flash Scenes (Total 6)
// =============================================================================
export interface MemoryFlashScene {
  id: string;
  label: string;
  shortLabel: string;
  artwork: ArtworkId;
  photoKey: PhotoAssetKey;
  promptHint: string;
  standardItems: MemoryObject[];
  hardItems: MemoryObject[];
  isPlacementNew?: boolean;
}

export const LEVEL4_FLASH_SCENES: MemoryFlashScene[] = [
  {
    id: 'mem-exec-desk',
    label: 'Executive Desk (Classic)',
    shortLabel: '01 · Exec Desk',
    artwork: 'memory_scene',
    photoKey: 'memory_scene',
    promptHint: 'Observe every item on the oak desk and identify which essential laptop accessory is missing.',
    standardItems: MEMORY_OBJECTS_STANDARD,
    hardItems: MEMORY_OBJECTS_HARD,
  },
  {
    id: 'mem-resume-desk',
    label: 'Campus Placement Prep Desk',
    shortLabel: '02 · Resume Desk',
    artwork: 'notebook',
    photoKey: 'placement_resume_desk',
    promptHint: 'Audit a candidate’s morning interview desk for preparedness—and spot what critical backup is missing.',
    standardItems: [
      { id: 'mr1', label: 'Navy Leather Folio with One-Page CS Resume Inside' },
      { id: 'mr2', label: 'Closed Silver Laptop on Top Right Corner' },
      { id: 'mr3', label: 'University Student ID Card on Blue Lanyard' },
      { id: 'mr4', label: 'Open "Campus Placement Prep" Notebook ("Mock Interview 10am")' },
      { id: 'mr5', label: 'Black Leather Analog Watch Above Folio' },
      { id: 'mr6', label: 'Missing: Laptop Power Charger & Extra Printed Resume Copies', isMissingHint: true },
    ],
    hardItems: [
      { id: 'mr1', label: 'Navy Leather Folio with One-Page CS Resume Inside' },
      { id: 'mr2', label: 'Closed Silver Laptop on Top Right Corner' },
      { id: 'mr3', label: 'University Student ID Card on Blue Lanyard' },
      { id: 'mr4', label: 'Open "Campus Placement Prep" Notebook ("Mock Interview 10am")' },
      { id: 'mr5', label: 'Black Leather Analog Watch Above Folio' },
      { id: 'mr6', label: 'Missing: Laptop Power Charger & Extra Printed Resume Copies', isMissingHint: true },
      { id: 'mr7', label: 'Two Black Pens (One Beside Laptop, One on Open Notebook)', hardOnly: true },
      { id: 'mr8', label: 'Duplicate Bullet "STAR Method" Written Twice in Notebook', hardOnly: true, isMissingHint: true },
      { id: 'mr9', label: 'No Water Bottle or Breath-Freshening Kit Visible', hardOnly: true, isMissingHint: true },
      { id: 'mr10', label: 'No Backup USB / Printed Portfolio Architecture Diagram', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
  {
    id: 'mem-virtual-desk',
    label: 'Virtual Video Interview Setup',
    shortLabel: '03 · Virtual Setup',
    artwork: 'interview',
    photoKey: 'placement_virtual_interview',
    promptHint: 'Inspect this WFH video interview setup for camera height, lighting, distractions, and missing failover.',
    standardItems: [
      { id: 'mv1', label: 'Silver Laptop Raised to Eye Level on Aluminum Stand' },
      { id: 'mv2', label: 'Compact Square Key Light to Left of Laptop' },
      { id: 'mv3', label: 'Matte-Black Condenser Microphone on Right of Desk' },
      { id: 'mv4', label: '"JOB READY" Ceramic Mug & Potted Plant Near Left Edge' },
      { id: 'mv5', label: 'Smartphone Lying Face-Up on Left Side of Desk (Distraction Risk)' },
      { id: 'mv6', label: 'Missing: Wired Ethernet Backup & Phone Removed From Reach', isMissingHint: true },
    ],
    hardItems: [
      { id: 'mv1', label: 'Silver Laptop Raised to Eye Level on Aluminum Stand' },
      { id: 'mv2', label: 'Compact Square Key Light to Left of Laptop' },
      { id: 'mv3', label: 'Matte-Black Condenser Microphone on Right of Desk' },
      { id: 'mv4', label: '"JOB READY" Ceramic Mug & Potted Plant Near Left Edge' },
      { id: 'mv5', label: 'Smartphone Lying Face-Up on Left Side of Desk (Distraction Risk)' },
      { id: 'mv6', label: 'Missing: Wired Ethernet Backup & Phone Removed From Reach', isMissingHint: true },
      { id: 'mv7', label: 'Over-Ear Headphones Hanging on Curved Wooden Stand', hardOnly: true },
      { id: 'mv8', label: 'Wireless White Keyboard & Mouse on Grey Felt Mat', hardOnly: true },
      { id: 'mv9', label: 'Open Ruled Notebook with Pen Ready for Live Notes', hardOnly: true },
      { id: 'mv10', label: 'Missing: Printed Resume Sheet for Quick Glance Reference', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
  {
    id: 'mem-whiteboard-dsa',
    label: 'FAANG Whiteboard Technical Room',
    shortLabel: '04 · DSA Board',
    artwork: 'keyboard',
    photoKey: 'placement_whiteboard_dsa',
    promptHint: 'Scan the Binary Tree & Microservices whiteboard for technical details—and spot what engineers forget!',
    standardItems: [
      { id: 'mw1', label: 'Binary Tree Diagram Drawn on Left Half (Root 40)' },
      { id: 'mw2', label: 'Microservices Architecture on Right (Load Balancer → API Gateway)' },
      { id: 'mw3', label: 'Interviewer Taking Notes on Left with Open Notebooks' },
      { id: 'mw4', label: 'Candidate Seated on Right Beside Laptop & Coffee Mug' },
      { id: 'mw5', label: 'Marker Tray with Blue, Black, Green Markers & Eraser' },
      { id: 'mw6', label: 'Missing: Time/Space Complexity (Big-O) & Edge-Case Dry Run', isMissingHint: true },
    ],
    hardItems: [
      { id: 'mw1', label: 'Binary Tree Diagram Drawn on Left Half (Root 40)' },
      { id: 'mw2', label: 'Microservices Architecture on Right (Load Balancer → API Gateway)' },
      { id: 'mw3', label: 'Interviewer Taking Notes on Left with Open Notebooks' },
      { id: 'mw4', label: 'Candidate Seated on Right Beside Laptop & Coffee Mug' },
      { id: 'mw5', label: 'Marker Tray with Blue, Black, Green Markers & Eraser' },
      { id: 'mw6', label: 'Missing: Time/Space Complexity (Big-O) & Edge-Case Dry Run', isMissingHint: true },
      { id: 'mw7', label: 'Duplicate BST Value Bug: Node 10 Under 30 & Node 70 Under 70', hardOnly: true, isMissingHint: true },
      { id: 'mw8', label: 'Two Database Cylinders Connected Below Services & Analytics', hardOnly: true },
      { id: 'mw9', label: 'Missing: Cache Layer (Redis) or Failover Replica Annotation', hardOnly: true, isMissingHint: true },
      { id: 'mw10', label: 'No Visible Room Clock / Timer for Pacing the 45-Min Round', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
  {
    id: 'mem-gd-table',
    label: 'Campus Group Discussion Room',
    shortLabel: '05 · GD Table',
    artwork: 'teamwork',
    photoKey: 'placement_gd_roundtable',
    promptHint: 'Observe posture, notebooks, seating, and group engagement during a live corporate GD round.',
    standardItems: [
      { id: 'mg1', label: 'Six Young Professionals Seated Around Walnut Conference Table' },
      { id: 'mg2', label: 'Structured Smart-Formal Corporate Attire Across Participants' },
      { id: 'mg3', label: 'Notebooks and Pens Open for Tracking Peer Arguments' },
      { id: 'mg4', label: 'Active Eye Contact & Inclusive Hand Gestures Across Table' },
      { id: 'mg5', label: 'Modern Bright Glass Meeting Room Setting' },
      { id: 'mg6', label: 'Missing: Visible Countdown Timer & Shared Summary Sheet', isMissingHint: true },
    ],
    hardItems: [
      { id: 'mg1', label: 'Six Young Professionals Seated Around Walnut Conference Table' },
      { id: 'mg2', label: 'Structured Smart-Formal Corporate Attire Across Participants' },
      { id: 'mg3', label: 'Notebooks and Pens Open for Tracking Peer Arguments' },
      { id: 'mg4', label: 'Active Eye Contact & Inclusive Hand Gestures Across Table' },
      { id: 'mg5', label: 'Modern Bright Glass Meeting Room Setting' },
      { id: 'mg6', label: 'Missing: Visible Countdown Timer & Shared Summary Sheet', isMissingHint: true },
      { id: 'mg7', label: 'Balanced Seating Spacing Allowing 360-Degree Eye Contact', hardOnly: true },
      { id: 'mg8', label: 'No Smartphones Distracting Participants on Table', hardOnly: true },
      { id: 'mg9', label: 'Missing: Moderator Name Tents for First-Name Addressing', hardOnly: true, isMissingHint: true },
      { id: 'mg10', label: 'Missing: Printed Case Prompt Handout in Center of Table', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
  {
    id: 'mem-offer-desk',
    label: 'Final Offer & Decision Desk',
    shortLabel: '06 · Offer Desk',
    artwork: 'compass',
    photoKey: 'placement_offer_envelope',
    promptHint: 'Recall the items around this sealed offer letter—and what due-diligence document is missing before signing!',
    standardItems: [
      { id: 'mo1', label: 'Cream Offer Letter Envelope with Navy Wax Seal' },
      { id: 'mo2', label: 'Black & Silver Fountain Pen Beside Envelope' },
      { id: 'mo3', label: 'Vintage Brass Pocket Compass on Lower Right' },
      { id: 'mo4', label: 'Open Silver Laptop Displaying Offer Text' },
      { id: 'mo5', label: 'Closed Dark Leather Journal & Ceramic Mug in Background' },
      { id: 'mo6', label: 'Missing: CTC Fixed-vs-Variable Breakdown & Role Comparison Sheet', isMissingHint: true },
    ],
    hardItems: [
      { id: 'mo1', label: 'Cream Offer Letter Envelope with Navy Wax Seal' },
      { id: 'mo2', label: 'Black & Silver Fountain Pen Beside Envelope' },
      { id: 'mo3', label: 'Vintage Brass Pocket Compass on Lower Right' },
      { id: 'mo4', label: 'Open Silver Laptop Displaying Offer Text' },
      { id: 'mo5', label: 'Closed Dark Leather Journal & Ceramic Mug in Background' },
      { id: 'mo6', label: 'Missing: CTC Fixed-vs-Variable Breakdown & Role Comparison Sheet', isMissingHint: true },
      { id: 'mo7', label: 'Golden Hour Natural Light Streaming From Left Window', hardOnly: true },
      { id: 'mo8', label: 'Bookmark Ribbon Inside Closed Strategy Journal', hardOnly: true },
      { id: 'mo9', label: 'Missing: Joining Bonus / Bond Clause Checklist', hardOnly: true, isMissingHint: true },
      { id: 'mo10', label: 'Missing: Written Mentor Feedback or Alumni Reference Notes', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
  // +5 MORE Level 4 Visual Flash Recall Scenes (Batch 2)
  {
    id: 'mem-career-fair',
    label: 'Campus Career Fair Atrium',
    shortLabel: '07 · Career Fair',
    artwork: 'business',
    photoKey: 'placement_career_fair',
    promptHint: 'Observe the corporate booths, student attire, resume handoff, and spot what networking essentials are missing.',
    standardItems: [
      { id: 'mcf1', label: 'Student Handing Brown Leather Portfolio to Recruiter at Booth' },
      { id: 'mcf2', label: '"NEXUS ENGINEERING" & "BUILDING FUTURES" Booth Banners on Left' },
      { id: 'mcf3', label: '"TECHCORP" & "TECHINNOVATE" Corporate Booth Signage Down the Hall' },
      { id: 'mcf4', label: 'Candidates Wearing Formal Navy Suits & Printed Name Badges' },
      { id: 'mcf5', label: 'Bright Glass-Skylight University Atrium Filled With Recruiters' },
      { id: 'mcf6', label: 'Missing: QR LinkedIn/Portfolio Card & Follow-Up Pen for Booth Notes', isMissingHint: true },
    ],
    hardItems: [
      { id: 'mcf1', label: 'Student Handing Brown Leather Portfolio to Recruiter at Booth' },
      { id: 'mcf2', label: '"NEXUS ENGINEERING" & "BUILDING FUTURES" Booth Banners on Left' },
      { id: 'mcf3', label: '"TECHCORP" & "TECHINNOVATE" Corporate Booth Signage Down the Hall' },
      { id: 'mcf4', label: 'Candidates Wearing Formal Navy Suits & Printed Name Badges' },
      { id: 'mcf5', label: 'Bright Glass-Skylight University Atrium Filled With Recruiters' },
      { id: 'mcf6', label: 'Missing: QR LinkedIn/Portfolio Card & Follow-Up Pen for Booth Notes', isMissingHint: true },
      { id: 'mcf7', label: 'Recruiter Wearing Navy Lanyard Badge Behind Table', hardOnly: true },
      { id: 'mcf8', label: 'Two-Handed Professional Portfolio Presentation Across Booth', hardOnly: true },
      { id: 'mcf9', label: 'Missing: Printed Target-Company Priority Checklist in Hand', hardOnly: true, isMissingHint: true },
      { id: 'mcf10', label: 'Missing: Visible Booth QR Code for Instant ATS Registration', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
  {
    id: 'mem-code-review',
    label: 'Live Pair Code Review Workstation',
    shortLabel: '08 · Code Review',
    artwork: 'keyboard',
    photoKey: 'placement_code_review',
    promptHint: 'Scan the dual monitors, desk tools, and pair-review posture—then catch what engineering hygiene is missing.',
    standardItems: [
      { id: 'mcr1', label: 'Dual Monitors Showing Dark-Mode Code Diffs & Green Test Lines' },
      { id: 'mcr2', label: 'Senior Engineer Pointing With Pen to Specific Line on Screen' },
      { id: 'mcr3', label: 'Junior Developer Holding Pen Over Open Grid Notebook' },
      { id: 'mcr4', label: 'Compact Mechanical Keyboard With Orange Escape Key' },
      { id: 'mcr5', label: 'Ceramic "PYTHON COFFEE" Mug & Clear Water Glass on Desk' },
      { id: 'mcr6', label: 'Missing: Written PR Checklist & Coaster Away From Electronics', isMissingHint: true },
    ],
    hardItems: [
      { id: 'mcr1', label: 'Dual Monitors Showing Dark-Mode Code Diffs & Green Test Lines' },
      { id: 'mcr2', label: 'Senior Engineer Pointing With Pen to Specific Line on Screen' },
      { id: 'mcr3', label: 'Junior Developer Holding Pen Over Open Grid Notebook' },
      { id: 'mcr4', label: 'Compact Mechanical Keyboard With Orange Escape Key' },
      { id: 'mcr5', label: 'Ceramic "PYTHON COFFEE" Mug & Clear Water Glass on Desk' },
      { id: 'mcr6', label: 'Missing: Written PR Checklist & Coaster Away From Electronics', isMissingHint: true },
      { id: 'mcr7', label: 'Wireless Ergonomic Mouse Positioned Right of Keyboard', hardOnly: true },
      { id: 'mcr8', label: 'Hand-Drawn Flow Diagram Sketched Inside Open Notebook', hardOnly: true },
      { id: 'mcr9', label: 'Missing: Edge-Case Latency Benchmark Metrics Visible on Second Screen', hardOnly: true, isMissingHint: true },
      { id: 'mcr10', label: 'Missing: Headphones for Pair Switching With Remote Teammates', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
  {
    id: 'mem-hackathon-sprint',
    label: 'Campus Hackathon Sprint Table',
    shortLabel: '09 · Hackathon',
    artwork: 'teamwork',
    photoKey: 'placement_hackathon_sprint',
    promptHint: 'Memorize the countdown clock, kanban columns, wireframes, and hardware—and spot what judges will ask for!',
    standardItems: [
      { id: 'mhk1', label: 'Digital Countdown Clock Showing "03:14:45" Remaining' },
      { id: 'mhk2', label: 'Glass Wall Kanban Board With "TO DO", "IN PROGRESS", "DONE" Columns' },
      { id: 'mhk3', label: 'Four Laptops Showing UI Wireframes & Dark-Mode Code Editor' },
      { id: 'mhk4', label: 'Small Robotics Hardware Prototype Centered on Wooden Table' },
      { id: 'mhk5', label: 'Whiteboard Architecture Sketch Mounted Behind Left Team Members' },
      { id: 'mhk6', label: 'Missing: Pitch Slide Deck & Backup Recorded Demo Video', isMissingHint: true },
    ],
    hardItems: [
      { id: 'mhk1', label: 'Digital Countdown Clock Showing "03:14:45" Remaining' },
      { id: 'mhk2', label: 'Glass Wall Kanban Board With "TO DO", "IN PROGRESS", "DONE" Columns' },
      { id: 'mhk3', label: 'Four Laptops Showing UI Wireframes & Dark-Mode Code Editor' },
      { id: 'mhk4', label: 'Small Robotics Hardware Prototype Centered on Wooden Table' },
      { id: 'mhk5', label: 'Whiteboard Architecture Sketch Mounted Behind Left Team Members' },
      { id: 'mhk6', label: 'Missing: Pitch Slide Deck & Backup Recorded Demo Video', isMissingHint: true },
      { id: 'mhk7', label: 'Two Disposable Coffee Cups Sitting Near Laptops on Table', hardOnly: true },
      { id: 'mhk8', label: 'Open Sketched Wireframe Notebook in Foreground Center', hardOnly: true },
      { id: 'mhk9', label: 'Missing: Power Extension Strip & Chargers Plugged In', hardOnly: true, isMissingHint: true },
      { id: 'mhk10', label: 'Missing: Clear Speaker Role Assignment for 3-Min Judge Q&A', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
  {
    id: 'mem-mentor-coffee',
    label: 'Alumni Mentorship Coffee Chat',
    shortLabel: '10 · Mentor Chat',
    artwork: 'coffee_cup',
    photoKey: 'placement_networking_coffee',
    promptHint: 'Observe the notebook, body language, and table setup during an executive informational interview.',
    standardItems: [
      { id: 'mmc1', label: 'Closed Linen "CAREER NOTES" Book Resting on Foreground Left' },
      { id: 'mmc2', label: 'Graduate Taking Active Handwritten Notes With Silver Pen' },
      { id: 'mmc3', label: 'Executive Mentor in Navy Blazer Gesturing With Open Palm' },
      { id: 'mmc4', label: 'Two Ceramic Coffee Cups (Dark Navy Espresso & Cream Latte)' },
      { id: 'mmc5', label: 'Sunlit Glass Atrium Framed With Indoor Greenery & Skyline' },
      { id: 'mmc6', label: 'Missing: Printed 1-Page Bio/Resume & Follow-Up Action Calendar', isMissingHint: true },
    ],
    hardItems: [
      { id: 'mmc1', label: 'Closed Linen "CAREER NOTES" Book Resting on Foreground Left' },
      { id: 'mmc2', label: 'Graduate Taking Active Handwritten Notes With Silver Pen' },
      { id: 'mmc3', label: 'Executive Mentor in Navy Blazer Gesturing With Open Palm' },
      { id: 'mmc4', label: 'Two Ceramic Coffee Cups (Dark Navy Espresso & Cream Latte)' },
      { id: 'mmc5', label: 'Sunlit Glass Atrium Framed With Indoor Greenery & Skyline' },
      { id: 'mmc6', label: 'Missing: Printed 1-Page Bio/Resume & Follow-Up Action Calendar', isMissingHint: true },
      { id: 'mmc7', label: 'Zero Phones Placed on Table—100% Undivided Presence', hardOnly: true },
      { id: 'mmc8', label: 'Direct Attentive Eye Contact From Graduate While Listening', hardOnly: true },
      { id: 'mmc9', label: 'Missing: Business Card or LinkedIn QR Ready for Post-Chat Sync', hardOnly: true, isMissingHint: true },
      { id: 'mmc10', label: 'Missing: Written Top-3 Questions Highlighted at Top of Page', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
  {
    id: 'mem-day1-desk',
    label: 'Day-1 Corporate Onboarding Desk',
    shortLabel: '11 · Day-1 Desk',
    artwork: 'ladder',
    photoKey: 'placement_onboarding_day1',
    promptHint: 'Audit this brand-new employee workstation on Day 1—and spot what essential onboarding item is missing!',
    standardItems: [
      { id: 'md1', label: 'Open Silver Laptop Showing "Welcome to TechCorp" Onboarding Portal' },
      { id: 'md2', label: 'Navy Lanyard With Printed Employee Photo ID Badge on Left' },
      { id: 'md3', label: 'Hardcover Navy "WELCOME TO THE TEAM" Onboarding Guide on Right' },
      { id: 'md4', label: 'Wireless Compact Keyboard, Dark Mouse & Gold Pen' },
      { id: 'md5', label: 'Matte-Navy "TC" Coffee Mug & Potted Green Plant Near Window' },
      { id: 'md6', label: 'Missing: Personal Notebook for 30-60-90 Day Notes & Headset', isMissingHint: true },
    ],
    hardItems: [
      { id: 'md1', label: 'Open Silver Laptop Showing "Welcome to TechCorp" Onboarding Portal' },
      { id: 'md2', label: 'Navy Lanyard With Printed Employee Photo ID Badge on Left' },
      { id: 'md3', label: 'Hardcover Navy "WELCOME TO THE TEAM" Onboarding Guide on Right' },
      { id: 'md4', label: 'Wireless Compact Keyboard, Dark Mouse & Gold Pen' },
      { id: 'md5', label: 'Matte-Navy "TC" Coffee Mug & Potted Green Plant Near Window' },
      { id: 'md6', label: 'Missing: Personal Notebook for 30-60-90 Day Notes & Headset', isMissingHint: true },
      { id: 'md7', label: 'Floor-to-Ceiling City Skyline Window Behind Desk', hardOnly: true },
      { id: 'md8', label: 'Onboarding Schedule Timeline Open on Center Browser Tab', hardOnly: true },
      { id: 'md9', label: 'Missing: Second External Monitor or Laptop Riser for Ergonomics', hardOnly: true, isMissingHint: true },
      { id: 'md10', label: 'Missing: IT Security YubiKey / Hardware 2FA Setup Checklist', hardOnly: true, isMissingHint: true },
    ],
    isPlacementNew: true,
  },
];

// =============================================================================
// LEVEL 5: +5 Placement-Oriented Profession & Hiring-Manager Cards
// =============================================================================
export interface PlacementProfessionCard {
  id: string;
  objectName: string;
  artwork: ArtworkId;
  photoKey?: PhotoAssetKey;
  profession: string;
  ceoPrompt: string;
  exampleCeoIdea: string;
  targetCompanies?: string;
  isPlacementNew?: boolean;
}

export const LEVEL5_PLACEMENT_EXTRA_PROFESSIONS: PlacementProfessionCard[] = [
  {
    id: 'prof-pl-whiteboard',
    objectName: 'DSA Whiteboard',
    artwork: 'keyboard',
    photoKey: 'placement_whiteboard_dsa',
    profession: 'SDE-1 / Systems Architect (Amazon · Google · Microsoft)',
    ceoPrompt:
      'As CTO / Hiring Manager, how would you use a 20-minute whiteboard architecture ritual to stop costly production bugs before code is even written?',
    exampleCeoIdea:
      'Mandate a 1-page visual data-flow & edge-case review before every sprint so junior and senior engineers catch scalability bottlenecks 10x cheaper than in production.',
    targetCompanies: 'Amazon · Google · Microsoft · Atlassian',
    isPlacementNew: true,
  },
  {
    id: 'prof-pl-analytics',
    objectName: 'BI Dashboard',
    artwork: 'calculator',
    photoKey: 'placement_bi_analytics',
    profession: 'Data & Business Analyst (Deloitte · TCS · Capgemini)',
    ceoPrompt:
      'As VP of Strategy, how do you turn raw Power BI / Excel charts into a 3-minute decision dashboard that non-technical leaders actually act on?',
    exampleCeoIdea:
      'Replace 25 vanity KPIs with 3 North-Star exception alerts (Margin Leakage, Regional Churn, Delivery SLA) paired with a single owner and weekly action plan.',
    targetCompanies: 'Deloitte · ZS · TCS · Wipro · Cognizant',
    isPlacementNew: true,
  },
  {
    id: 'prof-pl-cloud',
    objectName: 'Cloud Cluster',
    artwork: 'compass',
    photoKey: 'placement_cloud_dbms',
    profession: 'Cloud & DevOps Engineer (AWS · Azure · GCP)',
    ceoPrompt:
      'As Engineering VP during a festival traffic surge (10x load), how does a cloud-resilience mindset keep checkout latency under 200ms without overspending?',
    exampleCeoIdea:
      'Combine auto-scaling stateless containers, read-replica SQL sharding, and circuit-breaker fallbacks so peak demand scales seamlessly while idle hours scale down automatically.',
    targetCompanies: 'AWS · Infosys · Accenture · TechM · Flipkart',
    isPlacementNew: true,
  },
  {
    id: 'prof-pl-panel',
    objectName: 'Hiring Panel',
    artwork: 'interview',
    photoKey: 'placement_interview_panel',
    profession: 'Associate Product Manager (APM) / Talent Leader',
    ceoPrompt:
      'As Chief People Officer, how would you redesign campus interviews so you spot high-potential problem solvers instead of candidates who merely memorized answers?',
    exampleCeoIdea:
      'Replace trick definitions with a 15-minute real customer case + live collaborative debugging round scored on structured thinking, curiosity, and ownership.',
    targetCompanies: 'Flipkart · Swiggy · Razorpay · Adobe',
    isPlacementNew: true,
  },
  {
    id: 'prof-pl-negotiation',
    objectName: 'Deal Table',
    artwork: 'bridge',
    photoKey: 'placement_negotiation_studio',
    profession: 'Management Consultant / B2B Solutions Strategist',
    ceoPrompt:
      'As CEO facing a major enterprise client demanding a 30% discount, how do you protect margins while strengthening long-term partnership trust?',
    exampleCeoIdea:
      'Anchor on measurable ROI rather than price—offer phased milestone billing and dedicated onboarding outcomes in exchange for a multi-year commitment at full list value.',
    targetCompanies: 'McKinsey · BCG · EY · KPMG · Salesforce',
    isPlacementNew: true,
  },
  // +5 MORE Level 5 Placement Role Cards (Batch 2)
  {
    id: 'prof-pl-career-fair',
    objectName: 'Career Fair Booth',
    artwork: 'business',
    photoKey: 'placement_career_fair',
    profession: 'Campus Recruiter / Talent Acquisition Lead',
    ceoPrompt:
      'As Head of University Hiring reviewing 500 students in one day, how do you redesign your 90-second booth screen to spot high-grit builders over rehearsed scripts?',
    exampleCeoIdea:
      'Ask every candidate one unexpected question—"Show me the hardest bug or setback in your top project and what you changed"—rewarding authenticity and problem ownership.',
    targetCompanies: 'Google · Microsoft · TCS · Infosys · Accenture',
    isPlacementNew: true,
  },
  {
    id: 'prof-pl-code-review',
    objectName: 'Code Review Desk',
    artwork: 'keyboard',
    photoKey: 'placement_code_review',
    profession: 'Staff Software Engineer / Tech Lead',
    ceoPrompt:
      'As VP of Engineering scaling from 20 to 200 developers, how do you turn code reviews from a slow bottleneck into your fastest mentorship engine?',
    exampleCeoIdea:
      'Automate style/linting in CI, enforce small under-250-line PRs with clear test plans, and coach seniors to ask "why" questions that teach architectural taste.',
    targetCompanies: 'Amazon · Uber · Atlassian · Swiggy · Zomato',
    isPlacementNew: true,
  },
  {
    id: 'prof-pl-hackathon',
    objectName: 'Hackathon Table',
    artwork: 'teamwork',
    photoKey: 'placement_hackathon_sprint',
    profession: 'Startup Founder / Innovation Lead',
    ceoPrompt:
      'As CEO running an internal 48-hour product sprint, how do you ensure winning prototypes actually ship to real customers instead of dying in slide decks?',
    exampleCeoIdea:
      'Require every hackathon pitch to include 3 real user interviews, a live clickable workflow, and an assigned executive sponsor committed to a 30-day pilot budget.',
    targetCompanies: 'Razorpay · CRED · Zerodha · PhonePe · Startups',
    isPlacementNew: true,
  },
  {
    id: 'prof-pl-global-english',
    objectName: 'Global Comms Desk',
    artwork: 'interview',
    photoKey: 'placement_global_english',
    profession: 'Global Delivery Manager / Client Partner',
    ceoPrompt:
      'As Managing Director leading offshore teams serving US/EU Fortune 500 clients, how do you eliminate costly miscommunication across time zones?',
    exampleCeoIdea:
      'Institute concise global English norms—BLUF (Bottom Line Up Front) status emails, clear action-owner deadlines, and zero-jargon risk flags 48 hours before milestones.',
    targetCompanies: 'Wipro · Capgemini · Cognizant · TechM · HCL',
    isPlacementNew: true,
  },
  {
    id: 'prof-pl-onboarding',
    objectName: 'Day-1 Desk',
    artwork: 'ladder',
    photoKey: 'placement_onboarding_day1',
    profession: 'Engineering Manager / Graduate Program Director',
    ceoPrompt:
      'As COO onboarding 300 campus hires each July, how do you help fresh graduates ship meaningful value in their first 30 days instead of feeling lost?',
    exampleCeoIdea:
      'Assign every graduate a Day-1 buddy, a curated starter ticket merged in Week 1, and a structured 30-60-90 day scorecard reviewed weekly with their manager.',
    targetCompanies: 'Adobe · Cisco · SAP · Goldman Sachs · JPMorgan',
    isPlacementNew: true,
  },
];

// =============================================================================
// LEVEL 6: +5 Placement-Oriented Interactive Audit Scenes (Total 6 Scenes)
// =============================================================================
export interface WorkplaceAuditScene {
  id: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  artwork: ArtworkId;
  photoKey: PhotoAssetKey;
  mistakes: WorkplaceMistake[];
  isPlacementNew?: boolean;
}

export const LEVEL6_AUDIT_SCENES: WorkplaceAuditScene[] = [
  {
    id: 'audit-office-classic',
    shortLabel: '01 · Office (10)',
    title: 'Corporate Office Audit (Classic)',
    subtitle: 'Flag workplace safety, security, communication, and etiquette violations across the office.',
    artwork: 'workplace_detective',
    photoKey: 'workplace_detective',
    mistakes: WORKPLACE_MISTAKES,
  },
  {
    id: 'audit-whiteboard-dsa',
    shortLabel: '02 · DSA Round (5)',
    title: 'Technical Whiteboard Interview Audit',
    subtitle: 'Spot 5 real engineering & interview mistakes inside this FAANG-style technical round.',
    artwork: 'workplace_detective',
    photoKey: 'placement_whiteboard_dsa',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'dsa-m1',
        number: 1,
        category: 'Communication failures',
        title: 'BST Invariant Bug: Node "10" Placed Under Left-Right Subtree (30)',
        detail: 'In a valid Binary Search Tree rooted at 40, a node of value 10 cannot appear in the right subtree of 20 (under 30). Always dry-run invariants aloud!',
        xPercent: 33,
        yPercent: 41,
      },
      {
        id: 'dsa-m2',
        number: 2,
        category: 'Communication failures',
        title: 'Duplicate Leaf Bug: Node "70" Placed Directly Under Node "70"',
        detail: 'The rightmost branch repeats 70 beneath 70 without stating duplicate-handling rules. Clarify edge cases and duplicate constraints with the interviewer first.',
        xPercent: 45,
        yPercent: 42,
      },
      {
        id: 'dsa-m3',
        number: 3,
        category: 'Security risks',
        title: 'Single Point of Failure in Database Layer',
        detail: 'The microservices flow routes all Services and Analytics directly into a single un-replicated DB cylinder without caching, failover, or read replicas.',
        xPercent: 61,
        yPercent: 48,
      },
      {
        id: 'dsa-m4',
        number: 4,
        category: 'Time management problems',
        title: 'Missing Big-O Time & Space Complexity Annotations',
        detail: 'Neither the tree traversal nor API Gateway architecture notes O(h) / latency targets or QPS estimates—an instant rubric gap in Amazon/Google rounds.',
        xPercent: 52,
        yPercent: 18,
      },
      {
        id: 'dsa-m5',
        number: 5,
        category: 'Professional etiquette issues',
        title: 'Open Coffee Mug Close to Laptop During Live Demo',
        detail: 'Placing an uncovered mug directly beside the interview laptop risks a mid-round spill distraction during live coding.',
        xPercent: 69,
        yPercent: 75,
      },
    ],
  },
  {
    id: 'audit-virtual-interview',
    shortLabel: '03 · Virtual (5)',
    title: 'Remote Video Interview Setup Audit',
    subtitle: 'Spot 5 subtle remote-interview pitfalls that cost candidates offers on Zoom/Teams/Meet.',
    artwork: 'workplace_detective',
    photoKey: 'placement_virtual_interview',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'virt-m1',
        number: 1,
        category: 'Professional etiquette issues',
        title: 'Smartphone Placed Face-Up Within Immediate Reach',
        detail: 'Even on vibrate, incoming notifications draw your eyes downward—breaking interviewer eye contact and signaling distraction.',
        xPercent: 26,
        yPercent: 74,
      },
      {
        id: 'virt-m2',
        number: 2,
        category: 'Workplace safety violations',
        title: 'Open Ceramic Mug Right Next to Key Light & Laptop Power',
        detail: 'An uncovered mug directly beside studio lighting cables and keyboard risks knocking liquid onto equipment mid-answer.',
        xPercent: 33,
        yPercent: 66,
      },
      {
        id: 'virt-m3',
        number: 3,
        category: 'Security risks',
        title: 'Full Browser Dock & Extra Tabs Visible During Screen-Share',
        detail: 'Leaving dozens of apps/bookmarks visible in the taskbar risks exposing private notifications or non-work tabs if asked to share screen.',
        xPercent: 52,
        yPercent: 46,
      },
      {
        id: 'virt-m4',
        number: 4,
        category: 'Communication failures',
        title: 'Condenser Microphone Positioned Far to the Right',
        detail: 'Placing a directional mic off to the far right causes echo and volume drop whenever you turn toward the camera or notes.',
        xPercent: 71,
        yPercent: 62,
      },
      {
        id: 'virt-m5',
        number: 5,
        category: 'Time management problems',
        title: 'Strong Side-Window Backlight Fluctuation Risk',
        detail: 'Relying on unshaded bright daylight beside a warm key light creates uneven exposure if cloud cover shifts during a 60-minute panel.',
        xPercent: 14,
        yPercent: 34,
      },
    ],
  },
  {
    id: 'audit-resume-desk',
    shortLabel: '04 · Resume (5)',
    title: 'ATS Resume & Pre-Interview Prep Audit',
    subtitle: 'Catch 5 resume and interview-morning mistakes before walking into the placement room.',
    artwork: 'workplace_detective',
    photoKey: 'placement_resume_desk',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'res-m1',
        number: 1,
        category: 'Communication failures',
        title: 'Repeated Bullet ("STAR Method" Listed Twice in Prep Notes)',
        detail: 'Duplicate or rushed bullet notes signal shallow preparation—proofread both your resume and quick-reference sheets word by word.',
        xPercent: 84,
        yPercent: 71,
      },
      {
        id: 'res-m2',
        number: 2,
        category: 'Communication failures',
        title: 'Dense Un-Bolded Resume Paragraphs Slow 6-Second Scan',
        detail: 'Recruiters skim for bold quantified metrics (e.g., "Reduced latency 38%"). Dense gray text blocks hide your top placement wins.',
        xPercent: 52,
        yPercent: 48,
      },
      {
        id: 'res-m3',
        number: 3,
        category: 'Time management problems',
        title: 'Only One Resume Copy Inside Portfolio Folder',
        detail: 'Always carry 3 crisp printed copies in your folder—campus panels frequently include 2–3 surprise interviewers.',
        xPercent: 28,
        yPercent: 45,
      },
      {
        id: 'res-m4',
        number: 4,
        category: 'Workplace safety violations',
        title: 'No Laptop Charger Packed for Live Project Demo',
        detail: 'Bringing a laptop to demonstrate your GitHub/capstone without its charger risks a dead battery during afternoon rounds.',
        xPercent: 80,
        yPercent: 27,
      },
      {
        id: 'res-m5',
        number: 5,
        category: 'Security risks',
        title: 'University ID Badge Left Detached Beside Folder',
        detail: 'Forgetting your photo ID lanyard at the desk delays campus placement hall entry and verification check-in.',
        xPercent: 49,
        yPercent: 82,
      },
    ],
  },
  {
    id: 'audit-campus-panel',
    shortLabel: '05 · Panel (5)',
    title: 'Campus Placement Panel Room Audit',
    subtitle: 'Identify 5 high-impact body-language, preparation, and etiquette checkpoints in a live panel.',
    artwork: 'workplace_detective',
    photoKey: 'placement_campus_panel',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'pan-m1',
        number: 1,
        category: 'Communication failures',
        title: 'Eye Contact Locked Only on One Panelist',
        detail: 'When answering a 3-member hiring panel, engage the questioner first, then sweep naturally to every panelist so all decision-makers feel included.',
        xPercent: 32,
        yPercent: 42,
      },
      {
        id: 'pan-m2',
        number: 2,
        category: 'Professional etiquette issues',
        title: 'Cluttered Papers Spread Across Shared Interview Table',
        detail: 'Keep your portfolio closed neatly in front of you; spreading loose sheets across the interviewer’s zone looks disorganized.',
        xPercent: 52,
        yPercent: 68,
      },
      {
        id: 'pan-m3',
        number: 3,
        category: 'Time management problems',
        title: 'Rambling Past 90 Seconds on "Tell Me About Yourself"',
        detail: 'Unstructured 4-minute answers lose recruiter attention—use Past-Present-Future framing capped crisply at 75–90 seconds.',
        xPercent: 68,
        yPercent: 44,
      },
      {
        id: 'pan-m4',
        number: 4,
        category: 'Communication failures',
        title: 'Skipping Clarifying Questions Before Answering Case Prompt',
        detail: 'Jumping into solutions without confirming constraints or target metrics signals impulsive thinking in consulting/product panels.',
        xPercent: 48,
        yPercent: 35,
      },
      {
        id: 'pan-m5',
        number: 5,
        category: 'Professional etiquette issues',
        title: 'Ending the Interview With "No Questions From My Side"',
        detail: 'Always prepare 2 sharp role-specific questions about 90-day impact or team architecture to demonstrate genuine ownership.',
        xPercent: 78,
        yPercent: 64,
      },
    ],
  },
  {
    id: 'audit-gd-roundtable',
    shortLabel: '06 · GD Room (5)',
    title: 'Group Discussion Elimination Audit',
    subtitle: 'Spot 5 classic GD rejection triggers across airtime, listening, and structured framing.',
    artwork: 'workplace_detective',
    photoKey: 'placement_gd_roundtable',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'gd-m1',
        number: 1,
        category: 'Communication failures',
        title: 'Interrupting Mid-Sentence Instead of Building on Points',
        detail: 'Evaluators penalize aggressive crosstalk. Wait for a breath pause and bridge: "Building on Priya’s economic angle..."',
        xPercent: 28,
        yPercent: 45,
      },
      {
        id: 'gd-m2',
        number: 2,
        category: 'Professional etiquette issues',
        title: 'Pointing Fingers Across the Table During Disagreement',
        detail: 'Use open-palm gestures and neutral framing—sharp finger-pointing reads as confrontational under corporate assessment.',
        xPercent: 50,
        yPercent: 54,
      },
      {
        id: 'gd-m3',
        number: 3,
        category: 'Time management problems',
        title: 'Failing to Track the Final 2-Minute Summary Window',
        detail: 'Unmonitored debates end abruptly with zero consensus. Volunteering a crisp 30-second balanced summary earns top leadership marks.',
        xPercent: 72,
        yPercent: 42,
      },
      {
        id: 'gd-m4',
        number: 4,
        category: 'Communication failures',
        title: 'Ignoring a Quiet Participant Trying to Enter',
        detail: 'Inviting a silent teammate ("I’d love to hear Rohan’s view on the technical risk") demonstrates instant executive maturity.',
        xPercent: 62,
        yPercent: 65,
      },
      {
        id: 'gd-m5',
        number: 5,
        category: 'Communication failures',
        title: 'Sharing Opinions Without PESTLE Structure or Data',
        detail: 'Anchor at least one contribution in Political, Economic, Social, Technological, Legal, or Environmental evidence rather than vague anecdotes.',
        xPercent: 40,
        yPercent: 70,
      },
    ],
  },
  // +5 MORE Level 6 Placement Audit Scenes (Batch 2 — 25 New Hotspots!)
  {
    id: 'audit-career-fair',
    shortLabel: '07 · Career Fair (5)',
    title: 'Campus Career Fair Networking Audit',
    subtitle: 'Catch 5 subtle campus-drive mistakes that stop students from converting booth chats into interview calls.',
    artwork: 'workplace_detective',
    photoKey: 'placement_career_fair',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'cf-m1',
        number: 1,
        category: 'Communication failures',
        title: 'Asking "What Does Your Company Do?" Right Beside Banner',
        detail: 'Never walk up cold to a recruiter booth—read the company’s roles and tech stack beforehand so your opener proves genuine research.',
        xPercent: 14,
        yPercent: 52,
      },
      {
        id: 'cf-m2',
        number: 2,
        category: 'Professional etiquette issues',
        title: 'Handing Over an Unprinted or Crumpled Resume',
        detail: 'Hand over a crisp 1-page resume facing right-side-up toward the recruiter while stating your target role and top quantified project.',
        xPercent: 49,
        yPercent: 60,
      },
      {
        id: 'cf-m3',
        number: 3,
        category: 'Time management problems',
        title: 'Monopolizing a Recruiter for 8 Minutes While Queue Builds',
        detail: 'Respect booth traffic—deliver a tight 60-second pitch, ask 1 smart role question, collect next steps, and let peers step forward.',
        xPercent: 79,
        yPercent: 63,
      },
      {
        id: 'cf-m4',
        number: 4,
        category: 'Communication failures',
        title: 'Forgetting to Note Recruiter Name for 24-Hour Follow-Up',
        detail: 'Check the recruiter’s badge and jot 2 keywords immediately after stepping away so your LinkedIn thank-you note feels personal.',
        xPercent: 34,
        yPercent: 62,
      },
      {
        id: 'cf-m5',
        number: 5,
        category: 'Professional etiquette issues',
        title: 'Skipping Mid-Sized High-Growth Booths Only for Famous Logos',
        detail: 'The crowded famous booth isn’t your only path—adjacent engineering booths often have higher conversion rates and faster interviews.',
        xPercent: 62,
        yPercent: 48,
      },
    ],
  },
  {
    id: 'audit-code-review',
    shortLabel: '08 · Code Review (5)',
    title: 'Pair-Programming & PR Code Review Audit',
    subtitle: 'Spot 5 real software engineering & etiquette mistakes during a technical review or PPO internship check-in.',
    artwork: 'workplace_detective',
    photoKey: 'placement_code_review',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'cr-m1',
        number: 1,
        category: 'Communication failures',
        title: 'Submitting 600-Line Unsplit Pull Request Without Summary',
        detail: 'Giant unfocused diffs overwhelm reviewers and hide logic bugs. Keep PRs atomic with clear before/after test evidence.',
        xPercent: 17,
        yPercent: 48,
      },
      {
        id: 'cr-m2',
        number: 2,
        category: 'Security risks',
        title: 'Missing Unit Tests for Edge-Case Null & Timeout Inputs',
        detail: 'Green happy-path checks are not enough—senior reviewers always look for negative tests, boundary inputs, and safe error handling.',
        xPercent: 38,
        yPercent: 42,
      },
      {
        id: 'cr-m3',
        number: 3,
        category: 'Workplace safety violations',
        title: 'Open Coffee Mug & Uncovered Water Glass Beside Keyboard',
        detail: 'Liquids positioned directly between the monitor base and mechanical keyboard risk hardware damage during active desk discussions.',
        xPercent: 43,
        yPercent: 64,
      },
      {
        id: 'cr-m4',
        number: 4,
        category: 'Professional etiquette issues',
        title: 'Getting Defensive Instead of Writing Down Action Items',
        detail: 'Great junior engineers separate identity from code—actively logging review suggestions in a notebook signals coachability and PPO readiness.',
        xPercent: 56,
        yPercent: 83,
      },
      {
        id: 'cr-m5',
        number: 5,
        category: 'Time management problems',
        title: 'Skipping Clarification on "Why" Behind Senior’s Refactor',
        detail: 'Blindly applying edits without understanding performance or readability trade-offs causes you to repeat the exact same mistake next sprint.',
        xPercent: 74,
        yPercent: 50,
      },
    ],
  },
  {
    id: 'audit-hackathon',
    shortLabel: '09 · Hackathon (5)',
    title: 'Campus Hackathon & Capstone Demo Audit',
    subtitle: 'Identify 5 fatal sprint mistakes that derail promising student teams right before judge demos.',
    artwork: 'workplace_detective',
    photoKey: 'placement_hackathon_sprint',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'hk-m1',
        number: 1,
        category: 'Time management problems',
        title: 'Still Adding New Features With 03:14:45 Left on Clock',
        detail: 'Feature-freeze at the 3-hour mark! Shift focus to integration testing, live deployment stability, and rehearsing your 3-minute pitch.',
        xPercent: 40,
        yPercent: 82,
      },
      {
        id: 'hk-m2',
        number: 2,
        category: 'Communication failures',
        title: 'Overcrowded "IN PROGRESS" Column With Zero Code Freeze',
        detail: 'Too many work-in-progress sticky notes mean nothing is demo-ready. Finish one end-to-end user journey completely first.',
        xPercent: 61,
        yPercent: 18,
      },
      {
        id: 'hk-m3',
        number: 3,
        category: 'Security risks',
        title: 'Unrehearsed Hardware/API Live Demo With No Video Backup',
        detail: 'Conference Wi-Fi and live sensors fail under pressure—always record a crisp 60-second fallback video of your working prototype.',
        xPercent: 44,
        yPercent: 68,
      },
      {
        id: 'hk-m4',
        number: 4,
        category: 'Communication failures',
        title: 'Splitting Into Two Silos Across the Table',
        detail: 'Frontend and backend sub-teams working separately without API contract checks cause painful integration crashes at the final hour.',
        xPercent: 22,
        yPercent: 56,
      },
      {
        id: 'hk-m5',
        number: 5,
        category: 'Workplace safety violations',
        title: 'Open Coffee Cups Perched Directly Beside Team Laptops',
        detail: 'During fatigued sprint hours, one accidental elbow knock can wipe out the team’s demo machine—keep drinks at table corners.',
        xPercent: 62,
        yPercent: 59,
      },
    ],
  },
  {
    id: 'audit-mentor-coffee',
    shortLabel: '10 · Mentor Chat (5)',
    title: 'Informational Networking & Referral Audit',
    subtitle: 'Spot 5 networking mistakes that either build lasting executive sponsors or burn warm alumni bridges.',
    artwork: 'workplace_detective',
    photoKey: 'placement_networking_coffee',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'mc-m1',
        number: 1,
        category: 'Professional etiquette issues',
        title: 'Asking for a Job Referral in the First 2 Minutes',
        detail: 'Lead with genuine curiosity about the mentor’s career path and team challenges—referrals emerge naturally when trust is built first.',
        xPercent: 72,
        yPercent: 55,
      },
      {
        id: 'mc-m2',
        number: 2,
        category: 'Communication failures',
        title: 'Arriving Without 3 Specific Questions Written Down',
        detail: 'Vague prompts like "Tell me about your company" waste senior leaders’ time. Prepare sharp questions tied to their recent projects.',
        xPercent: 32,
        yPercent: 80,
      },
      {
        id: 'mc-m3',
        number: 3,
        category: 'Time management problems',
        title: 'Running Past the Agreed 20-Minute Coffee Slot',
        detail: 'Watch the clock proactively: "I want to respect your 10:30 meeting—one last question before we wrap." Executives remember time discipline.',
        xPercent: 54,
        yPercent: 78,
      },
      {
        id: 'mc-m4',
        number: 4,
        category: 'Communication failures',
        title: 'Failing to Send a 3-Line Action Update 2 Weeks Later',
        detail: '95% of students disappear after coffee. Sending a brief note—"I applied your SQL portfolio tip and landed two interviews!"—creates a lifelong champion.',
        xPercent: 24,
        yPercent: 90,
      },
      {
        id: 'mc-m5',
        number: 5,
        category: 'Professional etiquette issues',
        title: 'Talking Non-Stop Instead of Listening 70% of the Time',
        detail: 'Informational interviews are for learning—aim for 70% attentive listening and 30% crisp, relevant storytelling.',
        xPercent: 31,
        yPercent: 52,
      },
    ],
  },
  {
    id: 'audit-day1-desk',
    shortLabel: '11 · Day-1 Desk (5)',
    title: 'Corporate Day-1 Onboarding & Security Audit',
    subtitle: 'Spot 5 corporate security, etiquette, and career-launch pitfalls new campus hires overlook in Week 1.',
    artwork: 'workplace_detective',
    photoKey: 'placement_onboarding_day1',
    isPlacementNew: true,
    mistakes: [
      {
        id: 'd1-m1',
        number: 1,
        category: 'Security risks',
        title: 'Posting a Photo of Your Employee ID Badge & Laptop Screen Online',
        detail: 'Celebrating Day 1 on LinkedIn with your visible badge barcode or internal onboarding portal violates corporate InfoSec policies immediately.',
        xPercent: 29,
        yPercent: 76,
      },
      {
        id: 'd1-m2',
        number: 2,
        category: 'Security risks',
        title: 'Leaving Corporate Laptop Unlocked When Stepping Away',
        detail: 'Always lock your workstation (Win+L / Ctrl+Cmd+Q) even for a 30-second coffee break—IT security audits check unattended screens.',
        xPercent: 50,
        yPercent: 40,
      },
      {
        id: 'd1-m3',
        number: 3,
        category: 'Time management problems',
        title: 'Skimming the Onboarding Handbook Without Booking 1:1 Intros',
        detail: 'Schedule short 15-minute coffee chats with 5 teammates in Week 1 to map system owners, communication norms, and unwritten team expectations.',
        xPercent: 72,
        yPercent: 66,
      },
      {
        id: 'd1-m4',
        number: 4,
        category: 'Workplace safety violations',
        title: 'Open Coffee Mug Perched Right Above Paper Guide & Mouse',
        detail: 'Keep beverages on a stable coaster clear of your company handbook, mouse sweep zone, and brand-new laptop.',
        xPercent: 74,
        yPercent: 51,
      },
      {
        id: 'd1-m5',
        number: 5,
        category: 'Communication failures',
        title: 'Staying Silent When Blocked for More Than 30 Minutes',
        detail: 'Use the 30-minute rule: investigate thoroughly, document 2 things you tried, then ask a crisp question in Slack/Teams instead of spinning silently for days.',
        xPercent: 50,
        yPercent: 82,
      },
    ],
  },
];

// =============================================================================
// LEVEL 7: +5 Placement-Oriented 30-Second Pitch Challenges
// =============================================================================
export interface PlacementSellObject {
  id: string;
  objectName: string;
  artwork: ArtworkId;
  photoKey: PhotoAssetKey;
  sampleName: string;
  sampleTagline: string;
  sampleAudience: string;
  sampleUsps: [string, string, string];
  samplePitch: string;
  isPlacementNew?: boolean;
}

export const LEVEL7_PLACEMENT_EXTRA_SELL_OBJECTS: PlacementSellObject[] = [
  {
    id: 'sell-pl-resume',
    objectName: '1-Page ATS Resume',
    artwork: 'notebook',
    photoKey: 'placement_resume_desk',
    sampleName: '60-Second Personal Pitch',
    sampleTagline: 'From raw coursework to Day-1 production impact.',
    sampleAudience: 'Campus Hiring Managers & Technical Recruiters',
    sampleUsps: [
      'Quantified outcomes (38% faster API, 99.4% accuracy) over vague duties',
      'Live deployed portfolio & GitHub proof backing every single bullet',
      'Cross-functional communication bridging code, data, and customer value',
    ],
    samplePitch:
      'I’m a final-year engineer who turns messy problems into measurable systems. In my capstone, I rebuilt a sluggish query pipeline cutting response time by 42% for 1,200 test users—and I’m ready to bring that same ownership from Week 1.',
    isPlacementNew: true,
  },
  {
    id: 'sell-pl-whiteboard',
    objectName: 'System Architecture',
    artwork: 'keyboard',
    photoKey: 'placement_whiteboard_dsa',
    sampleName: 'ScaleGuard Architecture',
    sampleTagline: 'Zero-downtime design explained in 30 seconds.',
    sampleAudience: 'Staff Engineers & FAANG System Design Panels',
    sampleUsps: [
      'Decoupled API Gateway & caching layer absorbing 10x festival spikes',
      'Explicit O(log n) indexing & graceful fallback on downstream failure',
      'Clear cost-vs-latency trade-off justified with concrete numbers',
    ],
    samplePitch:
      'Instead of scaling one monolith blindly, ScaleGuard splits read-heavy traffic through a Redis cache and stateless microservices—keeping p99 latency under 150ms while trimming cloud spend by 28%.',
    isPlacementNew: true,
  },
  {
    id: 'sell-pl-bi',
    objectName: 'BI KPI Dashboard',
    artwork: 'calculator',
    photoKey: 'placement_bi_analytics',
    sampleName: 'PulseView Executive BI',
    sampleTagline: 'Turn 50,000 spreadsheet rows into one Monday decision.',
    sampleAudience: 'Non-Technical VPs, Business Analysts & Consulting Panels',
    sampleUsps: [
      'Automates 8 hours of weekly Excel reconciliation into live DAX refreshes',
      'Flags regional margin drops automatically before quarter-end closes',
      'Built for 10-second executive comprehension with drill-down evidence',
    ],
    samplePitch:
      'Executives don’t have time to hunt through 14 tabs. PulseView distills 50,000 rows into three live exception alerts—helping regional managers recover 6% leaked margin in the very first month.',
    isPlacementNew: true,
  },
  {
    id: 'sell-pl-cloud',
    objectName: 'Cloud & SQL Stack',
    artwork: 'compass',
    photoKey: 'placement_cloud_dbms',
    sampleName: 'CloudVault Resilient DB',
    sampleTagline: 'ACID integrity meets elastic global scale.',
    sampleAudience: 'Cloud Architects, FinTech CTOs & MNC Tech Leads',
    sampleUsps: [
      '3NF normalized core ledger eliminating update anomalies under load',
      'Automated multi-AZ failover guaranteeing 99.95% service continuity',
      'Least-privilege IAM rules auditing every single production query',
    ],
    samplePitch:
      'In fintech and enterprise apps, one corrupted transaction destroys trust. CloudVault pairs strict ACID SQL guarantees with multi-zone cloud failover so teams ship fast without risking data integrity.',
    isPlacementNew: true,
  },
  {
    id: 'sell-pl-offer',
    objectName: 'Your Offer Value Case',
    artwork: 'business',
    photoKey: 'placement_offer_envelope',
    sampleName: 'Win-Win Offer Proposal',
    sampleTagline: 'Justifying top-band value with calm, objective proof.',
    sampleAudience: 'HR Business Partners & Compensation Committees',
    sampleUsps: [
      'Benchmarked calmly against market role bands and verified certifications',
      'Ties compensation directly to Day-30 & Day-90 measurable deliverables',
      'Collaborative, grateful tone that strengthens trust before Day 1',
    ],
    samplePitch:
      'I’m genuinely excited about joining this engineering team. Given my full-stack internship, cloud certification, and readiness to own onboarding tickets in Month 1, I’d love to explore aligning the base package closer to the upper graduate band.',
    isPlacementNew: true,
  },
  // +5 MORE Level 7 Placement Pitch Challenges (Batch 2)
  {
    id: 'sell-pl-career-fair',
    objectName: 'Career Fair 30s Pitch',
    artwork: 'business',
    photoKey: 'placement_career_fair',
    sampleName: '30-Second Booth Hook',
    sampleTagline: 'Turn a crowded booth handshake into a shortlist star.',
    sampleAudience: 'Campus Recruiters & Visiting Engineering Leads',
    sampleUsps: [
      'Opens immediately with target role + strongest quantified proof',
      'Connects one specific project directly to the company’s live product',
      'Closes with a confident, low-friction next-step question',
    ],
    samplePitch:
      'Hi, I’m a final-year CS student specializing in Python backend systems. Last semester I built an automated inventory API that cut query latency by 45%—I noticed your team is scaling real-time order routing, and I’d love to share how I can contribute to your graduate engineering cohort.',
    isPlacementNew: true,
  },
  {
    id: 'sell-pl-hackathon',
    objectName: 'Hackathon MVP Demo',
    artwork: 'teamwork',
    photoKey: 'placement_hackathon_sprint',
    sampleName: '24-Hour Working Prototype',
    sampleTagline: 'Real user pain solved before the timer hits zero.',
    sampleAudience: 'Hackathon Judges, Startup Founders & Hiring Managers',
    sampleUsps: [
      'Starts with a relatable 1-sentence user problem—not tech buzzwords',
      'Demonstrates one crisp live end-to-end flow with measurable impact',
      'Clearly states technical trade-offs and the next 30-day roadmap',
    ],
    samplePitch:
      'Small clinics lose 3 hours daily to manual triage sheets. In 24 hours, our team built a voice-to-structured-intake web app that flags urgent vitals in 4 seconds—tested with 2 local nurses and ready to deploy on standard tablets.',
    isPlacementNew: true,
  },
  {
    id: 'sell-pl-codereview',
    objectName: 'Clean Pull Request',
    artwork: 'keyboard',
    photoKey: 'placement_code_review',
    sampleName: 'Production-Grade Code Craft',
    sampleTagline: 'Readable, tested code your teammates love inheriting.',
    sampleAudience: 'Senior Engineers, Tech Leads & Internship PPO Evaluators',
    sampleUsps: [
      'Self-documenting naming, modular functions, and zero dead code',
      'Automated edge-case unit tests proving zero regression risk',
      'Clear PR summary documenting benchmarks and rollback safety',
    ],
    samplePitch:
      'Anyone can make code pass once; engineers write code a teammate can debug at 2 AM. This PR isolates the retry logic into a pure helper with 96% branch coverage—cutting timeout errors by 60% while keeping review time under 5 minutes.',
    isPlacementNew: true,
  },
  {
    id: 'sell-pl-english',
    objectName: 'Global Executive English',
    artwork: 'interview',
    photoKey: 'placement_global_english',
    sampleName: 'Client-Ready Articulation',
    sampleTagline: 'Zero fillers, crisp global clarity on every call.',
    sampleAudience: 'Global Client Partners, HR Panels & Consulting Interviews',
    sampleUsps: [
      'Replaces regional filler phrases with crisp, natural global idioms',
      'Leads every update with BLUF (Bottom Line Up Front) structure',
      'Balances warm diplomacy with exact timelines and clear ownership',
    ],
    samplePitch:
      'Global teams run on clarity. Instead of burying blockers in long paragraphs, I open every stakeholder update with the headline outcome, two supporting metrics, and the exact decision needed—saving clients 20 minutes per call.',
    isPlacementNew: true,
  },
  {
    id: 'sell-pl-credentials',
    objectName: 'Verified Credentials & LOR',
    artwork: 'compass',
    photoKey: 'placement_credentials_portfolio',
    sampleName: 'Proof-Backed Skill Portfolio',
    sampleTagline: 'Verified execution—not unverified resume claims.',
    sampleAudience: 'Recruiters, Background Verification & Hiring Committees',
    sampleUsps: [
      'Pairs every listed skill with verified assessments and scored mocks',
      'Includes mentor-endorsed Letter of Recommendation highlighting work ethic',
      'Organized as a single scannable portfolio link ready for instant audit',
    ],
    samplePitch:
      'Every candidate lists Python, SQL, and communication on their resume. My portfolio backs each claim with verified capstone scores, live repositories, and a mentor LOR documenting my consistency across 60-minute timed assessments.',
    isPlacementNew: true,
  },
];

// =============================================================================
// LEVEL 8: +5 Placement-Oriented Empathy & Behavioral EQ Scenes (Total 6)
// =============================================================================
export interface Level8EmpathyScene {
  id: string;
  shortLabel: string;
  title: string;
  artwork: ArtworkId;
  photoKey: PhotoAssetKey;
  cuePrompt: string;
  placementQuestion: string;
  isPlacementNew?: boolean;
}

export const LEVEL8_EMPATHY_SCENES: Level8EmpathyScene[] = [
  {
    id: 'emp-window',
    shortLabel: '01 · Rain Window',
    title: 'Quiet Fatigue at the Twilight Window (Classic)',
    artwork: 'emotion_scene',
    photoKey: 'emotion_scene',
    cuePrompt: 'Notice the gaze, hand posture, rain-streaked glass, and quiet evening workspace. Base your empathy on visible evidence.',
    placementQuestion: 'HR EQ Question: How do you notice and support a burned-out teammate before a critical sprint deadline?',
  },
  {
    id: 'emp-lobby',
    shortLabel: '02 · HR Lobby',
    title: 'Five Minutes Before the Final HR Panel',
    artwork: 'interview',
    photoKey: 'placement_waiting_corridor',
    cuePrompt: 'Observe the upright posture, gentle composed smile, clasped hands over the leather portfolio, and sunlit glass corridor.',
    placementQuestion: 'HR EQ Question: Tell me about a high-stakes moment when you felt nervous inside yet projected calm confidence.',
    isPlacementNew: true,
  },
  {
    id: 'emp-panel',
    shortLabel: '03 · Hiring Panel',
    title: 'Presenting to a 3-Member Hiring Panel',
    artwork: 'interview',
    photoKey: 'placement_interview_panel',
    cuePrompt: 'Observe the candidate’s open posture, active gestures, and the attentive facial cues of all three recruiters listening.',
    placementQuestion: 'HR EQ Question: How do you adapt your explanation mid-interview when you notice a panelist looks skeptical?',
    isPlacementNew: true,
  },
  {
    id: 'emp-gd',
    shortLabel: '04 · GD Dynamics',
    title: 'Reading the Room in a Corporate Group Discussion',
    artwork: 'teamwork',
    photoKey: 'placement_gd_roundtable',
    cuePrompt: 'Notice who is speaking, who is leaning forward to listen, and how subtle eye contact builds psychological safety around the table.',
    placementQuestion: 'HR EQ Question: Describe a time you helped a quiet team member’s best idea get heard in a loud meeting.',
    isPlacementNew: true,
  },
  {
    id: 'emp-outage',
    shortLabel: '05 · War Room',
    title: 'High-Pressure Production Outage War Room',
    artwork: 'boardroom_decline',
    photoKey: 'placement_case_fintech',
    cuePrompt: 'Notice the urgency in the room, glowing alert screens, and the emotional weight engineers feel when live customers are impacted.',
    placementQuestion: 'HR EQ Question: When a production release breaks under deadline pressure, how do you replace blame with calm ownership?',
    isPlacementNew: true,
  },
  {
    id: 'emp-procurement',
    shortLabel: '06 · Client Table',
    title: 'Decoding Hesitation in a Client Negotiation',
    artwork: 'bridge',
    photoKey: 'placement_b2b_procurement',
    cuePrompt: 'Notice posture, eyebrow focus, and document review pace—hidden objections often show in body language before words.',
    placementQuestion: 'HR EQ Question: How do you uncover a stakeholder’s real unspoken concern without making them defensive?',
    isPlacementNew: true,
  },
  // +5 MORE Level 8 Placement EQ Scenes (Batch 2)
  {
    id: 'emp-career-fair',
    shortLabel: '07 · Career Fair',
    title: 'Standing Out With Warmth at a Packed Career Fair',
    artwork: 'business',
    photoKey: 'placement_career_fair',
    cuePrompt: 'Notice the warm smile, two-handed portfolio exchange, and relaxed eye contact amidst a crowded, exhausting recruitment hall.',
    placementQuestion: 'HR EQ Question: Recruiters speak to 150 tired students a day—how do you read their energy and make the conversation effortless for them?',
    isPlacementNew: true,
  },
  {
    id: 'emp-code-review',
    shortLabel: '08 · Code Review',
    title: 'Receiving Direct Critique During a Code Review',
    artwork: 'keyboard',
    photoKey: 'placement_code_review',
    cuePrompt: 'Observe the open body posture, shared smiles, pen-in-hand note-taking, and collaborative focus on the code—not the person.',
    placementQuestion: 'HR EQ Question: Tell me about a time a senior gave you blunt technical feedback—how did you manage your emotional reaction?',
    isPlacementNew: true,
  },
  {
    id: 'emp-hackathon',
    shortLabel: '09 · Hackathon',
    title: 'Managing Team Stress With 3 Hours Left in a Hackathon',
    artwork: 'teamwork',
    photoKey: 'placement_hackathon_sprint',
    cuePrompt: 'Notice the intense focus, leaning posture, countdown clock, and teammate pointing to align priorities under exhaustion.',
    placementQuestion: 'HR EQ Question: Describe a time your project team clashed under a tight deadline—how did you restore calm and alignment?',
    isPlacementNew: true,
  },
  {
    id: 'emp-mentor-coffee',
    shortLabel: '10 · Mentor Chat',
    title: 'Active Listening in an Executive Mentorship Chat',
    artwork: 'coffee_cup',
    photoKey: 'placement_networking_coffee',
    cuePrompt: 'Observe the graduate’s undivided attention, poised note-taking, and how open listening encourages the mentor to share candid advice.',
    placementQuestion: 'HR EQ Question: How do you show genuine respect and intellectual curiosity when seeking advice from senior leaders?',
    isPlacementNew: true,
  },
  {
    id: 'emp-day1-nerves',
    shortLabel: '11 · Day-1 Nerves',
    title: 'Overcoming Imposter Syndrome on Day 1 at a New Company',
    artwork: 'ladder',
    photoKey: 'placement_onboarding_day1',
    cuePrompt: 'Picture sitting at this spotless skyline desk on your very first morning—excited by the badge, yet quietly wondering if you belong.',
    placementQuestion: 'HR EQ Question: How do you stay confident and ask smart questions when joining a high-performing team where everyone knows more than you?',
    isPlacementNew: true,
  },
];

// =============================================================================
// LEVEL 9: +5 Placement Case Interview Scenes (Total 6 Interactive Cases)
// =============================================================================
export interface BoardroomCaseScene {
  id: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  artwork: ArtworkId;
  photoKey: PhotoAssetKey;
  clues: BoardroomClue[];
  placeholderBrief: string;
  isPlacementNew?: boolean;
}

export const LEVEL9_CASE_SCENES: BoardroomCaseScene[] = [
  {
    id: 'case-sales-decline',
    shortLabel: '01 · Sales -40%',
    title: 'Corporate Boardroom Turnaround (40% Sales Decline)',
    subtitle: 'Classic executive turnaround balancing Customers, Employees, Product Quality, Marketing, and Competition.',
    artwork: 'boardroom_decline',
    photoKey: 'boardroom_decline',
    clues: BOARDROOM_CLUES,
    placeholderBrief:
      '1. Immediate 14-day quality & customer stabilisation...\n2. Team alignment & accountability...\n3. Differentiation vs rival...',
  },
  {
    id: 'case-fintech-upi',
    shortLabel: '02 · FinTech Outage',
    title: 'FinTech Payment Outage Crisis (Festival Peak)',
    subtitle: 'Amazon / Razorpay / Paytm style case: 18% UPI payment failures during Diwali peak hour.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_case_fintech',
    isPlacementNew: true,
    placeholderBrief:
      '1. Immediate 15-minute traffic circuit-breaker & merchant status page...\n2. Root-cause fix on payment gateway retries & DB pool...\n3. 30-day trust recovery & SLA credit plan...',
    clues: [
      {
        id: 'ft-customers',
        dimension: 'Customers',
        headline: '18% Failed Checkouts & Duplicate Debit Complaints',
        visualEvidence: 'Support queues spike as festival shoppers see pending UPI debits without instant order confirmation.',
        strategicQuestion: 'What proactive communication and auto-refund SLA calms customer panic within 30 minutes?',
        xPercent: 22,
        yPercent: 52,
      },
      {
        id: 'ft-employees',
        dimension: 'Employees',
        headline: 'On-Call Engineers Overloaded Across Parallel War-Room Chats',
        visualEvidence: 'Multiple engineers are debugging the same gateway logs without a single Incident Commander.',
        strategicQuestion: 'How do you assign clear Incident Commander, Comms Lead, and Rollback Owner roles immediately?',
        xPercent: 42,
        yPercent: 66,
      },
      {
        id: 'ft-quality',
        dimension: 'Product quality',
        headline: 'Unthrottled Retry Storm Exhausting Database Connections',
        visualEvidence: 'Telemetry graphs show a sudden vertical latency wall triggered by aggressive client retries.',
        strategicQuestion: 'How do exponential backoff, idempotency keys, and read-replicas prevent cascading outages?',
        xPercent: 54,
        yPercent: 32,
      },
      {
        id: 'ft-marketing',
        dimension: 'Marketing',
        headline: 'Trending Negative Hashtags During Prime Festival Sale',
        visualEvidence: 'Brand sentiment dips on social feeds while promotional push notifications are still firing.',
        strategicQuestion: 'Why must marketing pause promo blasts immediately and publish transparent live status updates?',
        xPercent: 72,
        yPercent: 44,
      },
      {
        id: 'ft-competition',
        dimension: 'Competition',
        headline: 'Merchants Routing Checkout Volume to Rival Gateways',
        visualEvidence: 'Enterprise e-commerce clients enable secondary payment rails to protect festival GMV.',
        strategicQuestion: 'How do you win back primary routing share via a transparent post-mortem and uptime guarantee?',
        xPercent: 78,
        yPercent: 72,
      },
    ],
  },
  {
    id: 'case-saas-churn',
    shortLabel: '03 · SaaS Churn',
    title: 'Enterprise SaaS 28% Renewal Churn War-Room',
    subtitle: 'McKinsey / Deloitte / SaaS PM case: mid-market accounts churning after a nimble AI rival launches.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_case_saas',
    isPlacementNew: true,
    placeholderBrief:
      '1. Segment top 20 at-risk accounts & fix 14-day onboarding friction...\n2. Ship high-ROI workflow automation vs rival...\n3. Restructure outcome-based annual renewal tiers...',
    clues: [
      {
        id: 'sa-customers',
        dimension: 'Customers',
        headline: 'Mid-Market Accounts Using Less Than 30% of Paid Seats',
        visualEvidence: 'Adoption heatmaps show dormant licenses 60 days after contract signature.',
        strategicQuestion: 'How do you redesign the first 14 days of onboarding to trigger an immediate "Aha!" ROI moment?',
        xPercent: 25,
        yPercent: 46,
      },
      {
        id: 'sa-employees',
        dimension: 'Employees',
        headline: 'Sales & Customer Success Operating on Conflicting Incentives',
        visualEvidence: 'Account executives close ill-fit logos while CSMs inherit impossible customization promises.',
        strategicQuestion: 'How do you align Sales commissions with 90-day activation and net dollar retention?',
        xPercent: 40,
        yPercent: 72,
      },
      {
        id: 'sa-quality',
        dimension: 'Product quality',
        headline: 'Legacy Reporting Workflow Requires 9 Manual Clicks',
        visualEvidence: 'Usage drop-off clusters sharply around manual CSV exports and slow dashboard filters.',
        strategicQuestion: 'Which single high-frequency workflow should engineering automate first in a 30-day sprint?',
        xPercent: 55,
        yPercent: 35,
      },
      {
        id: 'sa-marketing',
        dimension: 'Marketing',
        headline: 'Messaging Emphasizes Feature Count Instead of Measurable ROI',
        visualEvidence: 'Renewal decks list 40 minor releases rather than hours and dollars saved per department.',
        strategicQuestion: 'How do you arm every champion with an automated 1-page Executive Value Scorecard before renewal?',
        xPercent: 70,
        yPercent: 54,
      },
      {
        id: 'sa-competition',
        dimension: 'Competition',
        headline: 'AI-Native Competitor Undercutting Entry Pricing by 35%',
        visualEvidence: 'Rival captures fast-growing teams with 5-minute self-serve setup and AI summaries.',
        strategicQuestion: 'Where does your enterprise compliance, integrations, and security moat beat a cheaper newcomer?',
        xPercent: 78,
        yPercent: 30,
      },
    ],
  },
  {
    id: 'case-ev-recall',
    shortLabel: '04 · EV Recall',
    title: 'EV Battery Supply-Chain & Quality Recall Case',
    subtitle: 'Operations & Consulting placement case: thermal defect found in 4% of Q3 battery packs.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_case_ev',
    isPlacementNew: true,
    placeholderBrief:
      '1. Voluntary safety-first recall & OTA thermal cap within 24 hours...\n2. Supplier batch quarantine & dual-sourcing quality audit...\n3. Transparent owner communication & extended warranty trust plan...',
    clues: [
      {
        id: 'ev-customers',
        dimension: 'Customers',
        headline: 'Owner Safety Anxiety Across 12,000 Delivered Vehicles',
        visualEvidence: 'Affected batch telemetry flags elevated cell temperatures during fast charging.',
        strategicQuestion: 'How do you communicate a proactive safety inspection so owners trust your integrity even more?',
        xPercent: 24,
        yPercent: 58,
      },
      {
        id: 'ev-employees',
        dimension: 'Employees',
        headline: 'Service Centers Under-Staffed for Sudden Recall Bay Surge',
        visualEvidence: 'Workshop schedules back up 3 weeks if inspections aren’t triaged via mobile diagnostics.',
        strategicQuestion: 'How do you deploy mobile technician vans and prioritize high-risk VIN batches first?',
        xPercent: 45,
        yPercent: 72,
      },
      {
        id: 'ev-quality',
        dimension: 'Product quality',
        headline: 'Single Tier-2 Cell Supplier Skipped Thermal Burn-In Check',
        visualEvidence: 'Line audit traces 100% of defects to one production shift at a secondary vendor.',
        strategicQuestion: 'What automated inline sensor gate and supplier penalty clause prevents recurrence?',
        xPercent: 54,
        yPercent: 36,
      },
      {
        id: 'ev-marketing',
        dimension: 'Marketing',
        headline: 'Rumors Outpacing Official Engineering Facts Online',
        visualEvidence: 'Viral clips exaggerate isolated incidents into fleet-wide fear.',
        strategicQuestion: 'Why does a CEO-led transparent video with third-party safety test data beat legal silence?',
        xPercent: 74,
        yPercent: 46,
      },
      {
        id: 'ev-competition',
        dimension: 'Competition',
        headline: 'Rival Automakers Launching "Zero-Recall Reliability" Ads',
        visualEvidence: 'Competing showrooms target hesitant EV buyers with trade-in bonuses.',
        strategicQuestion: 'How can an industry-leading 8-year battery warranty turn a recall into long-term brand authority?',
        xPercent: 80,
        yPercent: 70,
      },
    ],
  },
  {
    id: 'case-hospital-ai',
    shortLabel: '05 · Health AI',
    title: 'Hospital AI Triage Rollout Resistance Case',
    subtitle: 'Product & Analytics case: 94% accurate AI triage tool sees only 22% nurse/doctor adoption.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_case_hospital',
    isPlacementNew: true,
    placeholderBrief:
      '1. Shadow ER clinicians to remove workflow clicks & add explainability...\n2. Pair human-in-the-loop sign-off with clinical champions...\n3. Prove 18-minute ER wait-time drop in one pilot wing before scaling...',
    clues: [
      {
        id: 'hp-customers',
        dimension: 'Customers',
        headline: 'Emergency Patients Experiencing 45-Minute Triage Queues',
        visualEvidence: 'Intake bottlenecks delay urgent screening despite high-accuracy AI models running idle.',
        strategicQuestion: 'How do you measure success by patient wait-time reduction rather than model F1 score alone?',
        xPercent: 24,
        yPercent: 48,
      },
      {
        id: 'hp-employees',
        dimension: 'Employees',
        headline: 'Clinicians Distrust "Black-Box" Risk Scores Without Reasons',
        visualEvidence: 'Experienced nurses override alerts when the screen shows a number without vital-sign explanations.',
        strategicQuestion: 'How does explainable UI ("Flagged: SpO2 trend + heart rate") convert skepticism into partnership?',
        xPercent: 46,
        yPercent: 60,
      },
      {
        id: 'hp-quality',
        dimension: 'Product quality',
        headline: 'False-Positive Alarm Fatigue During Night Shifts',
        visualEvidence: 'Over-sensitive thresholds trigger 30 low-priority alerts per hour, causing staff to mute notifications.',
        strategicQuestion: 'How do you recalibrate precision-vs-recall thresholds with senior ER physicians?',
        xPercent: 58,
        yPercent: 34,
      },
      {
        id: 'hp-marketing',
        dimension: 'Marketing',
        headline: 'Tool Positioned as "AI Replacement" Instead of "Co-Pilot"',
        visualEvidence: 'Internal rollout memos triggered fear rather than highlighting paperwork reduction for doctors.',
        strategicQuestion: 'How do you reframe the rollout around saving clinicians 90 minutes of charting per shift?',
        xPercent: 74,
        yPercent: 44,
      },
      {
        id: 'hp-competition',
        dimension: 'Competition',
        headline: 'Rival EHR Vendor Bundling Native Basic Triage Free',
        visualEvidence: 'Hospital CFOs question paying separately unless clinical speed & safety ROI is undeniable.',
        strategicQuestion: 'What 60-day pilot KPI proves undeniable clinical and financial superiority over generic EHR tools?',
        xPercent: 78,
        yPercent: 74,
      },
    ],
  },
  {
    id: 'case-campus-hiring',
    shortLabel: '06 · Hiring Drop-Off',
    title: 'Campus Hiring Offer Drop-Off Crisis (38% Decline Rate)',
    subtitle: 'HR & Business Strategy case: top engineering graduates declining offers before joining.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_campus_panel',
    isPlacementNew: true,
    placeholderBrief:
      '1. Cut interview-to-offer turnaround from 21 days to 72 hours...\n2. Pair each select with an engineering buddy & clear project track...\n3. Differentiate on real learning velocity, mentorship & transparent growth...',
    clues: [
      {
        id: 'ch-customers',
        dimension: 'Customers',
        headline: 'Top Candidates Accepting Faster Competing Product Offers',
        visualEvidence: 'Exit surveys show 60% of dropouts received rival offers while waiting 3 weeks for HR feedback.',
        strategicQuestion: 'How do you compress campus evaluation and offer release into a 48–72 hour experience?',
        xPercent: 26,
        yPercent: 52,
      },
      {
        id: 'ch-employees',
        dimension: 'Employees',
        headline: 'Panelists Running Unstructured, Repetitive Interviews',
        visualEvidence: 'Candidates report answering identical basic questions across three different rounds.',
        strategicQuestion: 'How do you standardize scorecards so every round tests a distinct skill and sells the team culture?',
        xPercent: 46,
        yPercent: 40,
      },
      {
        id: 'ch-quality',
        dimension: 'Product quality',
        headline: 'Vague Job Descriptions With Zero First-Year Role Clarity',
        visualEvidence: 'Offers say "Graduate Engineer Trainee" without clarifying tech stack, domain, or mentorship.',
        strategicQuestion: 'How does publishing a clear 90-day onboarding roadmap & team showcase lift offer acceptance?',
        xPercent: 58,
        yPercent: 68,
      },
      {
        id: 'ch-marketing',
        dimension: 'Marketing',
        headline: 'Six-Month Silence Between Offer Letter & Joining Date',
        visualEvidence: 'Zero engagement between October selection and July onboarding causes cold feet.',
        strategicQuestion: 'Design a low-cost pre-joining mentorship & hackathon track that keeps selects excited to join.',
        xPercent: 74,
        yPercent: 45,
      },
      {
        id: 'ch-competition',
        dimension: 'Competition',
        headline: 'Startups Offering Higher Base Cash With Steep Learning',
        visualEvidence: 'Rivals highlight rapid ownership and direct founder exposure on campus.',
        strategicQuestion: 'How do you pitch total career compounding—global scale, stability, certifications, and rotation tracks?',
        xPercent: 78,
        yPercent: 72,
      },
    ],
  },
  // +5 MORE Level 9 Placement Case Interview Scenes (Batch 2)
  {
    id: 'case-career-fair-roi',
    shortLabel: '07 · Fair Funnel',
    title: 'Campus Career Fair Conversion Drop (420 Resumes → 2 Hires)',
    subtitle: 'HR Analytics & Consulting case: ₹18L spent across 6 college fairs yielded only 2 qualified offers.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_career_fair',
    isPlacementNew: true,
    placeholderBrief:
      '1. Replace passive paper resume collection with QR skill mini-challenges...\n2. Train booth engineers on standardized 90-second rubrics...\n3. Run pre-fair coding workshops on campus to pre-qualify top 10%...',
    clues: [
      {
        id: 'cf-customers',
        dimension: 'Customers',
        headline: 'Top 5% Students Skipping Crowded Booth Lines',
        visualEvidence: 'High-achieving candidates see 25-minute queues with generic swag and walk directly to faster startup booths.',
        strategicQuestion: 'How do you create a fast-track portfolio/GitHub QR lane for prepared candidates?',
        xPercent: 54,
        yPercent: 58,
      },
      {
        id: 'cf-employees',
        dimension: 'Employees',
        headline: 'Booth Staff Giving Inconsistent Role Descriptions',
        visualEvidence: 'Two recruiters at the same table describe completely different tech stacks and growth tracks.',
        strategicQuestion: 'What 1-page Booth Playbook and pre-drive calibration keeps every panelist aligned?',
        xPercent: 34,
        yPercent: 58,
      },
      {
        id: 'cf-quality',
        dimension: 'Product quality',
        headline: 'Zero Standardized Scoring on Collected Paper Resumes',
        visualEvidence: '420 folders return to HQ with scribbled stars and no structured notes—causing 2-week screening delays.',
        strategicQuestion: 'How does a 3-point mobile ATS rubric tag top prospects for next-day interviews?',
        xPercent: 49,
        yPercent: 60,
      },
      {
        id: 'cf-marketing',
        dimension: 'Marketing',
        headline: 'Generic "We Are Hiring" Banners Failing to Differentiate',
        visualEvidence: 'Students cannot tell what real engineering problems the company solves compared to 20 neighboring booths.',
        strategicQuestion: 'How does showcasing one real architecture problem or product demo magnetize the right talent?',
        xPercent: 14,
        yPercent: 48,
      },
      {
        id: 'cf-competition',
        dimension: 'Competition',
        headline: 'Rival Tech Firms Hosting Pre-Fair Hackathons With Spot Interviews',
        visualEvidence: 'Competitors lock in top campus talent 48 hours before the general career fair even opens.',
        strategicQuestion: 'Design a low-cost pre-fair campus workshop that builds a warm shortlist early.',
        xPercent: 78,
        yPercent: 52,
      },
    ],
  },
  {
    id: 'case-pr-production-bug',
    shortLabel: '08 · Prod Bug',
    title: 'Post-Release Regression Outage From Skipped Code Review',
    subtitle: 'Engineering Manager / SDE-2 case: rushed Friday deployment broke checkout discounts for 90,000 users.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_code_review',
    isPlacementNew: true,
    placeholderBrief:
      '1. Immediate feature-flag rollback & customer price-adjustment credit...\n2. Blameless post-mortem enforcing mandatory CI coverage + 2-reviewer rule...\n3. Eliminate Friday high-risk deploys via canary rollouts...',
    clues: [
      {
        id: 'pr-customers',
        dimension: 'Customers',
        headline: '90,000 Carts Charged Full Price Instead of Promo Discount',
        visualEvidence: 'Customer support tickets triple within 40 minutes of the Friday evening deploy.',
        strategicQuestion: 'How do you automate proactive wallet refunds before customers even file chargebacks?',
        xPercent: 20,
        yPercent: 46,
      },
      {
        id: 'pr-employees',
        dimension: 'Employees',
        headline: 'Junior Developer Pressured to Rubber-Stamp Without Senior Review',
        visualEvidence: 'Unrealistic sprint deadlines encouraged "LGTM" approvals without running local edge-case checks.',
        strategicQuestion: 'How do you foster a blameless engineering culture where anyone can halt a risky release?',
        xPercent: 66,
        yPercent: 42,
      },
      {
        id: 'pr-quality',
        dimension: 'Product quality',
        headline: 'No Automated Integration Test on Checkout Promo Pipeline',
        visualEvidence: 'Unit tests passed in isolation, but staging lacked real coupon-stacking test fixtures.',
        strategicQuestion: 'Which 3 CI/CD quality gates and canary rollout steps guarantee this bug never repeats?',
        xPercent: 40,
        yPercent: 40,
      },
      {
        id: 'pr-marketing',
        dimension: 'Marketing',
        headline: 'Flash Sale Ads Driving Peak Traffic Straight Into Broken Checkout',
        visualEvidence: 'Paid social campaigns remained active for 90 minutes while checkout failed.',
        strategicQuestion: 'How do you link automated error-rate alerts directly to marketing pause triggers?',
        xPercent: 78,
        yPercent: 64,
      },
      {
        id: 'pr-competition',
        dimension: 'Competition',
        headline: 'Rival Marketplace Highlighting "Instant Transparent Pricing"',
        visualEvidence: 'Price-sensitive shoppers cross-check competitor apps the moment a promo code fails.',
        strategicQuestion: 'How does an extra 5% apology voucher turn frustrated buyers into repeat loyalists?',
        xPercent: 52,
        yPercent: 78,
      },
    ],
  },
  {
    id: 'case-hackathon-mvp',
    shortLabel: '09 · MVP Pivot',
    title: 'Startup MVP Launch Stalled After Winning Campus Hackathon',
    subtitle: 'Product Management case: viral hackathon prototype gets 5,000 signups but only 4% Day-7 retention.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_hackathon_sprint',
    isPlacementNew: true,
    placeholderBrief:
      '1. Interview 20 churned signups to isolate the #1 onboarding drop-off...\n2. Cut 4 gimmick features and double down on 1 daily habit workflow...\n3. Stabilize core performance & add weekly value-recap nudges...',
    clues: [
      {
        id: 'mv-customers',
        dimension: 'Customers',
        headline: '82% of Users Drop Off Before Completing Setup Screen 2',
        visualEvidence: 'Funnel analytics show new users abandoning a 7-field manual onboarding form.',
        strategicQuestion: 'How do you deliver first value in under 60 seconds with zero mandatory setup friction?',
        xPercent: 20,
        yPercent: 72,
      },
      {
        id: 'mv-employees',
        dimension: 'Employees',
        headline: 'Founding Team Split Between Building Cool AI vs Fixing Bugs',
        visualEvidence: 'Kanban board overflows with experimental tasks while top user bug reports sit untouched.',
        strategicQuestion: 'How do you use RICE prioritization to align 4 student builders around one North-Star retention KPI?',
        xPercent: 58,
        yPercent: 22,
      },
      {
        id: 'mv-quality',
        dimension: 'Product quality',
        headline: 'Hackathon Prototype Crashes Under 100 Concurrent Mobile Users',
        visualEvidence: 'Hardcoded API calls and unindexed queries freeze the UI during campus lunch hours.',
        strategicQuestion: 'What lightweight reliability sprint stabilizes the MVP without over-engineering?',
        xPercent: 54,
        yPercent: 70,
      },
      {
        id: 'mv-marketing',
        dimension: 'Marketing',
        headline: 'Launch Video Over-Promised Features Still in Mockup Stage',
        visualEvidence: 'Demo hype created high curiosity signups followed by immediate disappointment.',
        strategicQuestion: 'How do you reposition messaging around one rock-solid, immediately working superpower?',
        xPercent: 34,
        yPercent: 28,
      },
      {
        id: 'mv-competition',
        dimension: 'Competition',
        headline: 'Incumbent App Cloned the Core Feature in Two Weeks',
        visualEvidence: 'Established platform added a basic version natively for all existing users.',
        strategicQuestion: 'How do you build a defensible niche workflow or community moat incumbents ignore?',
        xPercent: 80,
        yPercent: 58,
      },
    ],
  },
  {
    id: 'case-client-sla',
    shortLabel: '10 · SLA Crisis',
    title: 'Global IT Client Escalation & Contract Renewal Threat',
    subtitle: 'TCS / Infosys / Capgemini / Deloitte style case: US retail client threatens to cancel $4M annual account.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_urgent_sla',
    isPlacementNew: true,
    placeholderBrief:
      '1. Executive apology + daily 15-min transparent recovery standups...\n2. Dedicated tiger team clearing top 10 SLA tickets within 72 hours...\n3. Weekly executive health scorecard & proactive automation value-add...',
    clues: [
      {
        id: 'sl-customers',
        dimension: 'Customers',
        headline: 'Client VP Surprised by Delayed Release Only 2 Days Before Launch',
        visualEvidence: 'Weekly status reports stayed "Green" until an abrupt "Red" escalation destroyed executive trust.',
        strategicQuestion: 'Why does flagging an Amber risk 10 days early with two mitigation options protect client relationships?',
        xPercent: 26,
        yPercent: 48,
      },
      {
        id: 'sl-employees',
        dimension: 'Employees',
        headline: 'High Attrition Left Unfamiliar Freshers Handling Complex Tickets',
        visualEvidence: 'Knowledge transfer docs were outdated after two senior leads rotated off the project.',
        strategicQuestion: 'How do you deploy a shadow-buddy KT matrix and senior architecture review for 30 days?',
        xPercent: 48,
        yPercent: 62,
      },
      {
        id: 'sl-quality',
        dimension: 'Product quality',
        headline: 'Ticket Reopen Rate Hit 26% Due to Rushed Fixes',
        visualEvidence: 'Engineers closed tickets to beat SLA clocks without verifying root cause in production logs.',
        strategicQuestion: 'How do you shift team incentives from raw ticket speed to First-Time-Right resolution?',
        xPercent: 58,
        yPercent: 36,
      },
      {
        id: 'sl-marketing',
        dimension: 'Marketing',
        headline: 'Team Communicated Technical Jargon Instead of Business Impact',
        visualEvidence: 'Client CFO saw database logs instead of store-uptime metrics and revenue protected.',
        strategicQuestion: 'Rewrite a technical recovery update into a crisp 3-bullet executive business summary.',
        xPercent: 74,
        yPercent: 46,
      },
      {
        id: 'sl-competition',
        dimension: 'Competition',
        headline: 'Rival SI Vendor Pitching 15% Lower Billing Rates to Client',
        visualEvidence: 'Competitor is offering a zero-cost transition audit to displace your incumbent team.',
        strategicQuestion: 'How do you retain the renewal via proactive AI automation savings rather than cutting rates?',
        xPercent: 78,
        yPercent: 72,
      },
    ],
  },
  {
    id: 'case-90day-attrition',
    shortLabel: '11 · 90-Day Churn',
    title: 'First-90-Day Campus Hire Attrition Spike (24% Early Exits)',
    subtitle: 'People Ops & Strategy case: nearly 1 in 4 newly onboarded graduates quit before Month 3.',
    artwork: 'boardroom_decline',
    photoKey: 'placement_onboarding_day1',
    isPlacementNew: true,
    placeholderBrief:
      '1. Fix Day-1 IT access & pair every graduate with an active peer buddy...\n2. Define clear 30-60-90 day learning milestones + Week-2 manager check-in...\n3. Align campus recruitment promises with real day-to-day project work...',
    clues: [
      {
        id: 'ob-customers',
        dimension: 'Customers',
        headline: 'New Hires Waiting 14 Days for Laptop & Repo Access',
        visualEvidence: 'Graduates spend their first two weeks idle waiting on IT approvals, killing initial enthusiasm.',
        strategicQuestion: 'How do you automate pre-Day-1 provisioning so every new hire ships a starter task in Week 1?',
        xPercent: 50,
        yPercent: 42,
      },
      {
        id: 'ob-employees',
        dimension: 'Employees',
        headline: 'Busy Managers Skipping Weekly 1:1 Check-Ins With Freshers',
        visualEvidence: 'Exit interviews reveal 70% of early leavers felt invisible and unsure how performance was judged.',
        strategicQuestion: 'What lightweight 20-minute Week-2/4/8 feedback rubric builds psychological safety fast?',
        xPercent: 28,
        yPercent: 74,
      },
      {
        id: 'ob-quality',
        dimension: 'Product quality',
        headline: 'Mismatch Between Campus Pitch ("AI Product") & Actual Bench Tasks',
        visualEvidence: 'Recruited developers were placed on manual data-entry sheets for 60 days without context.',
        strategicQuestion: 'How do you set honest role expectations and create structured project rotation tracks?',
        xPercent: 72,
        yPercent: 66,
      },
      {
        id: 'ob-marketing',
        dimension: 'Marketing',
        headline: 'Negative Glassdoor & Campus Alumni Reviews Spreading Quickly',
        visualEvidence: 'Early exits warn next year’s senior batch, hurting brand reputation on tier-1 campuses.',
        strategicQuestion: 'How do you turn current Month-6 thriving graduates into authentic campus ambassadors?',
        xPercent: 76,
        yPercent: 32,
      },
      {
        id: 'ob-competition',
        dimension: 'Competition',
        headline: 'Rival Employers Poaching Disengaged Freshers With Clear Mentorship',
        visualEvidence: 'Competitors target LinkedIn profiles showing "Trainee" with structured SDE-1 accelerator offers.',
        strategicQuestion: 'Design a 90-day certification + capstone showcase that makes your graduate program un-poachable.',
        xPercent: 50,
        yPercent: 84,
      },
    ],
  },
];

// =============================================================================
// LEVEL 10: +5 Placement Mastery Vision Cards (6 Original + 5 New = 11 Cards)
// =============================================================================
export interface FinaleCardItem {
  id: string;
  title: string;
  placementPillar: string;
  artwork: ArtworkId;
  photoKey: PhotoAssetKey;
  isPlacementNew?: boolean;
}

export const LEVEL10_PLACEMENT_BONUS_CARDS: FinaleCardItem[] = [
  {
    id: 'fp1',
    title: 'ATS Resume & Prep',
    placementPillar: 'Shortlist Readiness',
    artwork: 'notebook',
    photoKey: 'placement_resume_desk',
    isPlacementNew: true,
  },
  {
    id: 'fp2',
    title: 'DSA Whiteboard',
    placementPillar: 'Technical Mastery',
    artwork: 'keyboard',
    photoKey: 'placement_whiteboard_dsa',
    isPlacementNew: true,
  },
  {
    id: 'fp3',
    title: 'GD Roundtable',
    placementPillar: 'Structured Speaking',
    artwork: 'teamwork',
    photoKey: 'placement_gd_roundtable',
    isPlacementNew: true,
  },
  {
    id: 'fp4',
    title: 'Virtual Presence',
    placementPillar: 'Remote Executive Poise',
    artwork: 'interview',
    photoKey: 'placement_virtual_interview',
    isPlacementNew: true,
  },
  {
    id: 'fp5',
    title: 'Offer & Direction',
    placementPillar: 'Career Launchpad',
    artwork: 'compass',
    photoKey: 'placement_offer_envelope',
    isPlacementNew: true,
  },
  // +5 MORE Level 10 Placement Mastery Vision Cards (Batch 2 — 16 Total)
  {
    id: 'fp6',
    title: 'Career Fair Pitch',
    placementPillar: '30-Sec First Impression',
    artwork: 'business',
    photoKey: 'placement_career_fair',
    isPlacementNew: true,
  },
  {
    id: 'fp7',
    title: 'Hackathon MVP',
    placementPillar: 'Proof of Execution',
    artwork: 'teamwork',
    photoKey: 'placement_hackathon_sprint',
    isPlacementNew: true,
  },
  {
    id: 'fp8',
    title: 'Code Review Craft',
    placementPillar: 'Coachable Engineering',
    artwork: 'keyboard',
    photoKey: 'placement_code_review',
    isPlacementNew: true,
  },
  {
    id: 'fp9',
    title: 'Mentor Network',
    placementPillar: 'Warm Industry Roots',
    artwork: 'coffee_cup',
    photoKey: 'placement_networking_coffee',
    isPlacementNew: true,
  },
  {
    id: 'fp10',
    title: 'Day-1 Onboarding',
    placementPillar: '90-Day Ownership',
    artwork: 'ladder',
    photoKey: 'placement_onboarding_day1',
    isPlacementNew: true,
  },
];

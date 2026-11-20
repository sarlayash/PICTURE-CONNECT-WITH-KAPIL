export interface SolvedShoppingRiddle {
  id: string;
  qNumbers: string;
  category: 'Home & Lifestyle' | 'Knowledge & Tools' | 'Rebus & Lateral' | 'Electronics & Apparel';
  riddlePrompt: string;
  solvedItem: string;
  deductionLogic: string;
  negotiationHook: string;
}

export interface SolvedNegotiationCase {
  id: string;
  title: string;
  pillarFocus: string;
  scenario: string;
  poorApproach: string;
  solvedDialogue: string;
  keyTakeaway: string;
}

export interface ShoppingMcqItem {
  id: string;
  category: 'riddle' | 'negotiation';
  sourceRef: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  hint: string;
  explanation: string;
  xpClean: number;
  xpWithHint: number;
}

export interface ShoppingBadgeDefinition {
  id: string;
  title: string;
  description: string;
  criteriaLabel: string;
  accent: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'cyan';
  checkUnlocked: (stats: {
    studiedCount: number;
    answeredCount: number;
    correctCount: number;
    cleanCorrectCount: number;
    riddleCorrectCount: number;
    roleplayScore: number;
    completedModule: boolean;
  }) => boolean;
}

export interface RoleplayEvaluation {
  totalScore: number;
  courteousScore: number; // /20
  logicScore: number; // /20
  persuasionScore: number; // /20
  convincingScore: number; // /20
  precisionScore: number; // /20
  feedback: string;
}

export const SHOPPING_MODULE_META = {
  title: 'Shopping & Negotiation Skills',
  subtitle: 'FACE Konfi-07 Role Play · Persuasion, Logic & Precision Lab',
  poweredBy: 'POWERED BY KAPIL',
  description:
    'Master deductive shopping-list decoding from the official FACE Konfi-07 Role Play sheets alongside commercial & campus negotiation skills—featuring 38 solved examples, 20 hint-assisted MCQs, an interactive Negotiation Role-Play Lab, 6 downloadable PNG badges, XP ranks, and an official PNG Certificate.',
  worksheetPages: [
    {
      label: 'Konfi-07 Sheet 1 (Questions 1–21)',
      src: '/assets/aistudio/WhatsApp_Image_2026-11-20_at_9.44.50_AM_32110800.jpeg',
    },
    {
      label: 'Konfi-07 Sheet 2 (Questions 22–42)',
      src: '/assets/aistudio/WhatsApp_Image_2026-11-20_at_9.44.51_AM_25a34b0b.jpeg',
    },
  ],
  skillPillars: [
    'Courteousness',
    'Logical Thinking',
    'Persuasion',
    'Convincing',
    'Precision in Communication',
  ],
};

// Complete solved bank covering all 42 questions across Konfi-07 Sheet 1 & Sheet 2
export const SOLVED_KONFI_RIDDLES: SolvedShoppingRiddle[] = [
  {
    id: 'ex_r01',
    qNumbers: 'Q1',
    category: 'Home & Lifestyle',
    riddlePrompt: 'The more I dry, the wetter I become?',
    solvedItem: 'Towel',
    deductionLogic:
      'A bath or kitchen towel absorbs moisture each time it dries another surface, becoming progressively wetter itself.',
    negotiationHook:
      'In role-play shopping, specify exact GSM weight and fabric absorbency rather than asking vaguely for "a good towel."',
  },
  {
    id: 'ex_r02',
    qNumbers: 'Q2',
    category: 'Home & Lifestyle',
    riddlePrompt:
      "I don't go out and play, I just stay home all day, I'm nice - you might agree, but mostly your feet just rub me?",
    solvedItem: 'Doormat / Carpet Rug',
    deductionLogic:
      'Stays indoors/at the threshold all day specifically for people to wipe or rub their feet upon entering.',
    negotiationHook:
      'Anchor on durability (non-slip backing & bristle density) before countering the seller’s quoted price.',
  },
  {
    id: 'ex_r03',
    qNumbers: 'Q3',
    category: 'Knowledge & Tools',
    riddlePrompt: "Stiff is my spine and my body is pale, but I'm always ready to tell a tale?",
    solvedItem: 'Book',
    deductionLogic:
      'A hardcover or paperback book has a bound "spine", pale paper pages ("body"), and holds stories ("tales").',
    negotiationHook:
      'Combine multiple reading items (Book + Dictionary + Newspaper) into a single stationery bundle discount.',
  },
  {
    id: 'ex_r04',
    qNumbers: 'Q4 · Q28',
    category: 'Electronics & Apparel',
    riddlePrompt: 'What has a ring, but no finger?',
    solvedItem: 'Telephone / Phone',
    deductionLogic:
      'A telephone produces an audible "ring" when receiving a call despite having no physical finger.',
    negotiationHook:
      'Ask precisely for warranty tenure and replacement coverage before accepting a sticker-price bundle.',
  },
  {
    id: 'ex_r05',
    qNumbers: 'Q5',
    category: 'Home & Lifestyle',
    riddlePrompt: 'I have a neck, but no head, but I still wear a cap?',
    solvedItem: 'Bottle',
    deductionLogic:
      'A water or beverage bottle tapers into a bottle "neck" topped with a screw "cap" without having a head.',
    negotiationHook:
      'Request volume-tier pricing (pack of 6 or insulated steel upgrade) with a polite win-win rationale.',
  },
  {
    id: 'ex_r06',
    qNumbers: 'Q6',
    category: 'Home & Lifestyle',
    riddlePrompt:
      "Some take me in the morning, others take me in the evening, but one thing you should know - that when I'm 'taken', I don't really go anywhere?",
    solvedItem: 'Photograph / Bath (Shower)',
    deductionLogic:
      'Idiomatic wordplay on "take": you "take a bath/shower" or "take a photograph" morning or evening without physically transporting the concept away.',
    negotiationHook:
      'Demonstrates Precision in Communication—clarify exact product category (toiletries vs. photo print) with the shopkeeper immediately so zero time is wasted.',
  },
  {
    id: 'ex_r07',
    qNumbers: 'Q7',
    category: 'Knowledge & Tools',
    riddlePrompt:
      'My words number quite many (like pen, pent, and penny); my title you will discover, is explained under my cover?',
    solvedItem: 'Dictionary',
    deductionLogic:
      'Contains thousands of alphabetically ordered words (pen, pent, penny) and even defines the word "dictionary" inside itself.',
    negotiationHook:
      'Cite an alternative online resource politely (BATNA) to negotiate either an updated edition or a student discount.',
  },
  {
    id: 'ex_r08',
    qNumbers: 'Q8',
    category: 'Knowledge & Tools',
    riddlePrompt: 'I start with an "e", I end with an "e", but I usually contain only one letter?',
    solvedItem: 'Envelope',
    deductionLogic:
      'Spelled E-n-v-e-l-o-p-E (starts and ends with "e") and literally holds one mailed "letter" inside.',
    negotiationHook:
      'Order in boxes of 50 or 100 while bundling pens/paper to drop unit cost cleanly.',
  },
  {
    id: 'ex_r09',
    qNumbers: 'Q9',
    category: 'Knowledge & Tools',
    riddlePrompt: "I'm so simple that I only point; yet I guide people all over the world?",
    solvedItem: 'Compass',
    deductionLogic:
      'A magnetic compass has only a needle that points North, guiding travelers globally.',
    negotiationHook:
      'Focus on calibration accuracy—precision tools sell on trust, not just lowest rupee.',
  },
  {
    id: 'ex_r10',
    qNumbers: 'Q10',
    category: 'Home & Lifestyle',
    riddlePrompt:
      "Although I may have eyes, I can't see. At one time there was a dearth of me in Ireland and people went hungry?",
    solvedItem: 'Potato',
    deductionLogic:
      'Potatoes sprout buds called "eyes" and were the staple crop during the 1845–1852 Irish Potato Famine.',
    negotiationHook:
      'In perishable goods bargaining, inspect quality (zero sprouts/bruises) first, then negotiate weight rate for 2kg+.',
  },
  {
    id: 'ex_r11',
    qNumbers: 'Q11 · Q38',
    category: 'Knowledge & Tools',
    riddlePrompt: "What's black and white and read all over?",
    solvedItem: 'Newspaper',
    deductionLogic:
      'Homophone pun on "red" vs. "read": printed in black ink on white paper and "read" throughout.',
    negotiationHook:
      'Use multi-month subscription commitments as leverage for free weekend supplements.',
  },
  {
    id: 'ex_r12',
    qNumbers: 'Q12 · Q41',
    category: 'Rebus & Lateral',
    riddlePrompt: "If you were 'able', you'd add a 'T'?",
    solvedItem: 'Table',
    deductionLogic:
      'Wordplay transformation: prefixing the letter "T" to "able" forms "Table".',
    negotiationHook:
      'Pair Q12 (Table) + Q33 (Chair) when pitching a dining/study furniture set discount to the seller.',
  },
  {
    id: 'ex_r13',
    qNumbers: 'Q13',
    category: 'Knowledge & Tools',
    riddlePrompt: 'Look for a rainbow in a box?',
    solvedItem: 'Crayons / Color Paint Box',
    deductionLogic:
      'A crayon or watercolor box contains the full rainbow spectrum of colors neatly packed.',
    negotiationHook:
      'Negotiate brand-neutral value by asking for a 24-shade box at the 16-shade retail margin when buying school kits.',
  },
  {
    id: 'ex_r14',
    qNumbers: 'Q14 · Q36',
    category: 'Electronics & Apparel',
    riddlePrompt: 'Keys open my door, but mine only make a sound? / I have keys but open no lock.',
    solvedItem: 'Piano / Keyboard',
    deductionLogic:
      'Musical keyboards and computer keyboards feature "keys" that produce sound or text rather than unlocking physical doors.',
    negotiationHook:
      'Test key responsiveness on-site and negotiate a complimentary stand or dust cover instead of demanding an unrealistic cash cut.',
  },
  {
    id: 'ex_r15',
    qNumbers: 'Q15',
    category: 'Rebus & Lateral',
    riddlePrompt:
      "I'm an insect, and the first half of my name reveals another insect; also some famous group of musicians had a similar name?",
    solvedItem: 'Beetle',
    deductionLogic:
      '"Bee" (first half insect) + "tle" = Beetle; echoes the legendary British band *The Beatles* (or miniature toy/collectible Beetle model).',
    negotiationHook:
      'Clarify with the role-play vendor whether the supplement list item refers to a toy/decor collectible or pest-safe garden item.',
  },
  {
    id: 'ex_r16',
    qNumbers: 'Q16',
    category: 'Electronics & Apparel',
    riddlePrompt:
      "I may be black, and may be white, or any color in between. I'm small and made of plastic, not round but very light; when I'm moved up and down, I'm used to create sound?",
    solvedItem: 'Guitar Pick (Plectrum)',
    deductionLogic:
      'Triangular teardrop plastic accessory moved up and down across guitar strings to create musical sound.',
    negotiationHook:
      'Small high-margin accessories (like guitar picks) are prime zero-cost add-ons to request when closing a bigger music or electronics purchase.',
  },
  {
    id: 'ex_r17',
    qNumbers: 'Q17',
    category: 'Home & Lifestyle',
    riddlePrompt: 'I get bigger when I eat, but die weaker when I drink?',
    solvedItem: 'Fire / Charcoal Lighter / Stove Flame',
    deductionLogic:
      'Fire grows larger as it consumes ("eats") fuel/wood, yet weakens and extinguishes when doused with water ("drinks").',
    negotiationHook:
      'Pair with Q23 (Charcoal) to ask the store owner for a matched BBQ/camp starter kit discount.',
  },
  {
    id: 'ex_r18',
    qNumbers: 'Q18 · Q25',
    category: 'Home & Lifestyle',
    riddlePrompt: 'What invention lets you look right through a wall?',
    solvedItem: 'Window',
    deductionLogic:
      'A glass window sits embedded inside a solid wall and allows clear sight right through it.',
    negotiationHook:
      'Negotiate installation + frame sealing together rather than glass panes alone to prevent hidden contractor markups.',
  },
  {
    id: 'ex_r19',
    qNumbers: 'Q19',
    category: 'Home & Lifestyle',
    riddlePrompt:
      'People climb me, cut me and burn me, they show me no respect! My rings are not of gold, but they do tell my age?',
    solvedItem: 'Tree (Wood / Timber / Sapling)',
    deductionLogic:
      'Trees are climbed, felled, and burned as firewood, and their cross-sectional growth rings reveal their exact age in years.',
    negotiationHook:
      'Ask politely for sustainably sourced sapling or seasoned timber proof—values-driven buyers win credibility fast.',
  },
  {
    id: 'ex_r20',
    qNumbers: 'Q20',
    category: 'Home & Lifestyle',
    riddlePrompt: 'What is higher without the head, than with it?',
    solvedItem: 'Pillow',
    deductionLogic:
      'A fluffy pillow compresses flat when your head rests on it and puffs up higher the moment your head lifts off.',
    negotiationHook:
      'Bundle Pillow (Q20) + Bed (Q31) + Towel (Q1) for a full dorm/home-linen package discount.',
  },
  {
    id: 'ex_r21',
    qNumbers: 'Q21',
    category: 'Home & Lifestyle',
    riddlePrompt: 'I grow shorter, as I grow older?',
    solvedItem: 'Candle (or Pencil)',
    deductionLogic:
      'A lit candle melts downward and becomes physically shorter every hour it burns.',
    negotiationHook:
      'Verify burn-time hours and pack count carefully before locking a bulk festive purchase.',
  },
  {
    id: 'ex_r22',
    qNumbers: 'Q22 · Q24 · Q42',
    category: 'Electronics & Apparel',
    riddlePrompt:
      "I have a face that doesn't frown, I have hands that do not wave... What has hands but can't feel / can't clap?",
    solvedItem: 'Clock / Watch',
    deductionLogic:
      'A clock has a dial "face" and hour/minute "hands" that move continuously around the dial without feeling or clapping.',
    negotiationHook:
      'Ask politely whether the battery and 1-year movement warranty are included in the quoted rate.',
  },
  {
    id: 'ex_r23',
    qNumbers: 'Q23',
    category: 'Home & Lifestyle',
    riddlePrompt:
      "When you buy me I'm black, when you use me I'm red, and when you throw me away I'm gray?",
    solvedItem: 'Charcoal',
    deductionLogic:
      'Charcoal briquettes are sold black, glow red-hot during burning, and turn into gray ash afterward.',
    negotiationHook:
      'Specify moisture-sealed bags so you are not paying per-kilogram for damp dust.',
  },
  {
    id: 'ex_r24',
    qNumbers: 'Q26',
    category: 'Electronics & Apparel',
    riddlePrompt:
      'I have a sound that goes beep, and while the time I do keep, my main function is to heat!',
    solvedItem: 'Microwave Oven',
    deductionLogic:
      'A microwave displays a digital clock, beeps when finished, and exists primarily to heat food quickly.',
    negotiationHook:
      'High-ticket appliance! Anchor on capacity (20L vs 28L), ask for microwave-safe starter bowls free, and verify extended warranty.',
  },
  {
    id: 'ex_r25',
    qNumbers: 'Q27',
    category: 'Electronics & Apparel',
    riddlePrompt: "What has a tongue that can't taste, eyes that can't see and a sole that will never die?",
    solvedItem: 'Shoe',
    deductionLogic:
      'Shoes have a cushioned "tongue", lace "eyelets", and a rubber/leather "sole" (pun on immortal soul).',
    negotiationHook:
      'Check exact UK/EU sizing and exchange window before closing the purchase within your role-play time limit.',
  },
  {
    id: 'ex_r26',
    qNumbers: 'Q29',
    category: 'Electronics & Apparel',
    riddlePrompt: 'It might rain, come find some shelter.',
    solvedItem: 'Umbrella',
    deductionLogic:
      'Portable rain shelter carried specifically when clouds or rain threaten.',
    negotiationHook:
      'Test rib-joint wind resistance first; point out minor stitching flaws courteously to earn a 10–15% markdown.',
  },
  {
    id: 'ex_r27',
    qNumbers: 'Q30',
    category: 'Home & Lifestyle',
    riddlePrompt: "Tear off my skin and I won't cry, but you will.",
    solvedItem: 'Onion',
    deductionLogic:
      'Peeling an onion releases syn-propanethial-S-oxide gas that triggers tears in the cook’s eyes.',
    negotiationHook:
      'Use freshness & zero-bruise inspection as your logical basis for paying grade-A market rate.',
  },
  {
    id: 'ex_r28',
    qNumbers: 'Q31',
    category: 'Home & Lifestyle',
    riddlePrompt: "When the sun has set and your eyes feel like lead, you go here because it's time for...",
    solvedItem: 'Bed',
    deductionLogic:
      'Heavy eyelids after sunset signal bedtime—heading directly to a bed.',
    negotiationHook:
      'Bundle frame + mattress delivery fees so transport costs do not wipe out your negotiated discount.',
  },
  {
    id: 'ex_r29',
    qNumbers: 'Q32 · Q35',
    category: 'Electronics & Apparel',
    riddlePrompt:
      'This is where wet clothes become dry (Q32) / Round and Round for a spin, I help you keep things neat as a pin (Q35).',
    solvedItem: 'Clothes Dryer (Q32) & Washing Machine (Q35)',
    deductionLogic:
      'Laundry appliances: the washing machine spins round and round to clean clothes, and the dryer removes remaining moisture.',
    negotiationHook:
      'Negotiating both Q32 + Q35 + Q26 together gives immense combo-purchase leverage (ask for free installation + pipe kit + 12% combo discount).',
  },
  {
    id: 'ex_r30',
    qNumbers: 'Q33 (Visual Rebus)',
    category: 'Rebus & Lateral',
    riddlePrompt: '[Clock Icon] − [Padlock Icon] + [Arrow pointing to Girl’s Hair]',
    solvedItem: 'Chair',
    deductionLogic:
      'Step 1: CLOCK minus LOCK leaves the letter "C". Step 2: Add "HAIR" (arrow points to hair). Step 3: C + HAIR = CHAIR!',
    negotiationHook:
      'Pair Q33 (Chair) with Q12/Q41 (Table) during the shopping round to buy a complete study desk set under budget.',
  },
  {
    id: 'ex_r31',
    qNumbers: 'Q34 · Q37',
    category: 'Home & Lifestyle',
    riddlePrompt:
      'What has 4 legs but cannot run (Q34) / What turns everything around but does not move? (Q37)',
    solvedItem: 'Table / Chair (Q34) & Mirror (Q37)',
    deductionLogic:
      'A table or chair stands stationary on 4 legs (Q34); a mirror laterally reverses ("turns around") every reflection without moving (Q37).',
    negotiationHook:
      'Ensure crack-free glass inspection on delivery for the Mirror and sturdy wobble-check for the Table/Chair before handing over payment.',
  },
  {
    id: 'ex_r32',
    qNumbers: 'Q39 · Q40',
    category: 'Home & Lifestyle',
    riddlePrompt:
      'The more it runs the cooler it becomes (Q39) / It is white but it turns yellow when falls on the floor (Q40).',
    solvedItem: 'Fan / Air Conditioner (Q39) & Egg (Q40)',
    deductionLogic:
      'A fan or AC cools the room the longer it runs (Q39); an egg has a white shell and spills a yellow yolk when dropped (Q40).',
    negotiationHook:
      'For Q39 (Fan/AC), anchor on energy star rating & copper condenser; for Q40 (Egg tray), verify zero hairline cracks before packing.',
  },
];

export const SOLVED_NEGOTIATION_CASES: SolvedNegotiationCase[] = [
  {
    id: 'ex_n01',
    title: '01. Courteous Counter-Anchoring on Inflated Sticker Price',
    pillarFocus: 'Courteousness + Logical Thinking',
    scenario:
      'A vendor quotes ₹9,500 for a 20L Microwave (Q26) whose verified market price is ₹7,200, and the role-play clock has 4 minutes remaining.',
    poorApproach:
      '"That price is a total rip-off! Everyone knows this costs ₹7,000, give it to me for ₹6,500 right now or I’m leaving."',
    solvedDialogue:
      '"Thank you for walking me through the 20L model—the timer and heating specs match what I need. Across two campus-area stores this model retails around ₹7,100–₹7,300. If we settle at ₹7,000 today and include the starter glass bowl, I can finalize payment immediately and wrap up before my deadline."',
    keyTakeaway:
      'Praise the product fit first (Courteousness), cite calm market evidence (Logic), and propose an immediate close.',
  },
  {
    id: 'ex_n02',
    title: '02. Multi-Item Bundle Leverage (Konfi-07 Shopping List)',
    pillarFocus: 'Persuasion + Convincing',
    scenario:
      'You decoded 4 items on your shopping list: Table (Q12), Chair (Q33 Rebus), Pillow (Q20), and Towel (Q1). Single-item discounts are capped at 5%.',
    poorApproach:
      'Haggling separately on each rupee of the Towel, then separately on the Pillow, exhausting goodwill.',
    solvedDialogue:
      '"I need all four items—your study Table, Chair, Pillow, and Towel—right now in one bill. Rather than negotiating item-by-item, if you give me a flat 15% combo discount on the ₹12,000 basket, you get an assured ₹10,200 single-ticket sale right now."',
    keyTakeaway:
      'Guaranteeing total basket revenue convinces sellers far better than nickel-and-diming a single product.',
  },
  {
    id: 'ex_n03',
    title: '03. Precision in Communication When Inventory Is Unclear',
    pillarFocus: 'Precision in Communication',
    scenario:
      'You decoded Q16 ("plastic, light, up and down to create sound" = Guitar Pick) and Q6, and need the shopkeeper to confirm stock within 60 seconds.',
    poorApproach:
      '"Do you have that small plastic music thing or something for morning/evening? Hurry up please."',
    solvedDialogue:
      '"Quick check—do you have medium-gauge 0.71mm nylon guitar picks (pack of 5) and hardcover lined notebooks (A5, 200 pages) in stock right now? A yes/no lets me place the order immediately."',
    keyTakeaway:
      'Exact nouns, specifications, and binary questions eliminate ambiguity and save precious role-play negotiation time.',
  },
  {
    id: 'ex_n04',
    title: '04. Non-Monetary Value Trade-Off When Price Floor Is Firm',
    pillarFocus: 'Logical Thinking + Convincing',
    scenario:
      'The seller refuses to drop the Washing Machine (Q35) below ₹16,500 because it is their rigid cost floor.',
    poorApproach:
      'Repeating "Please ₹15,000" five times until both sides stall in deadlock.',
    solvedDialogue:
      '"I respect your ₹16,500 floor price. If I confirm ₹16,500 right now, can you include free same-day doorstep delivery, the inlet hose kit, and a complimentary 1-year extended motor warranty? That saves me ₹1,400 out of pocket while keeping your margin intact."',
    keyTakeaway:
      'When price hits a hard wall, trade on delivery, warranty, or accessories (value-expansion bargaining).',
  },
  {
    id: 'ex_n05',
    title: '05. Polite BATNA Leverage Without Threatening the Seller',
    pillarFocus: 'Courteousness + Persuasion',
    scenario:
      'Another stall across the hall offered the same Window + Mirror hardware set for 10% less, but this vendor has faster availability.',
    poorApproach:
      '"The guy opposite is way cheaper than you, match him or lose the customer."',
    solvedDialogue:
      '"I genuinely prefer buying from your counter because your mirror inspection and packaging are spotless. The neighboring stall quoted ₹4,500 for the identical set—if you can get close to ₹4,600 with bubble-wrap protection included, I will buy from you right here."',
    keyTakeaway:
      'Never weaponize your BATNA aggressively—frame your desire to buy *from them* if the gap can be narrowed.',
  },
  {
    id: 'ex_n06',
    title: '06. Campus Placement Offer & Role Scope Persuasion',
    pillarFocus: 'All 5 Konfi-07 Pillars Applied to Career',
    scenario:
      'HR offers ₹4.2 LPA fixed when your documented internships and capstone projects justify ₹5.0 LPA.',
    poorApproach:
      '"My friends got ₹5.5 LPA so ₹4.2 LPA is too low for me."',
    solvedDialogue:
      '"Thank you sincerely for the Analyst offer—I am excited to join the team. Given my live SQL/Python product sprint and verified Capstone honors, benchmarks for this scope sit near ₹5.0 LPA. If the ₹4.2 LPA base is fixed for this band, could we explore a ₹60k–₹80k joining/performance milestone bonus at 6 months?"',
    keyTakeaway:
      'The exact same 5 FACE Konfi-07 pillars—Courteousness, Logic, Persuasion, Convincing, Precision—elevate campus placement negotiations.',
  },
];

export const SHOPPING_MCQS: ShoppingMcqItem[] = [
  {
    id: 'sn_q01',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q33 Visual Rebus',
    question:
      'Decode the FACE Konfi-07 Visual Rebus (#33): [Clock] − [Padlock] + [Arrow pointing to Girl’s Hair] = ?',
    options: ['Clockwork', 'Chair', 'Hairpin', 'Locket'],
    correctIndex: 1,
    hint: 'Subtract the letters "LOCK" from the word "CLOCK", then combine the single remaining letter with "HAIR".',
    explanation:
      'CLOCK − LOCK = "C". Adding "HAIR" forms C + HAIR = CHAIR, which pairs directly with Table (Q12/Q34) on the shopping list.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q02',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q15',
    question:
      'Solve Q15 for your shopping list: "I\'m an insect, and the first half of my name reveals another insect; also some famous group of musicians had a similar name?"',
    options: ['Butterfly', 'Beetle', 'Dragonfly', 'Grasshopper'],
    correctIndex: 1,
    hint: 'Split the insect name: the first 3 letters spell an insect that makes honey, and a legendary 1960s rock band shared a homophone of this name.',
    explanation:
      '"Bee" (first half insect) + "tle" = Beetle, famously echoed by The Beatles.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q03',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q10',
    question:
      'Solve Q10: "Although I may have eyes, I can\'t see. At one time there was a dearth of me in Ireland and people went hungry?"',
    options: ['Needle', 'Potato', 'Storm', 'Coconut'],
    correctIndex: 1,
    hint: 'Think of a staple kitchen vegetable with sprouting buds called "eyes" tied to the historic 1845 Irish famine.',
    explanation:
      'Potatoes develop sprout "eyes" and caused mass hunger during the 1840s Irish Potato Famine.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q04',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q16',
    question:
      'Solve Q16: "I may be black, and may be white, or any color in between. I\'m small and made of plastic, not round but very light; when I\'m moved up and down, I\'m used to create sound?"',
    options: ['Guitar Pick (Plectrum)', 'Light Switch', 'Plastic Ruler', 'Cassette Tape'],
    correctIndex: 0,
    hint: 'It is a tiny triangular/teardrop accessory strummed up and down across strings.',
    explanation:
      'A guitar pick (plectrum) is thin, colorful plastic moved up and down across strings to produce music.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q05',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q26',
    question:
      'Solve Q26: "I have a sound that goes beep, and while the time I do keep, my main function is to heat!"',
    options: ['Toaster', 'Microwave Oven', 'Digital Watch', 'Electric Kettle'],
    correctIndex: 1,
    hint: 'Unlike a watch, it heats food; unlike a basic toaster or kettle, it has a built-in digital clock display and beeps when done.',
    explanation:
      'A Microwave Oven displays the time on its digital panel, beeps on cycle completion, and heats food.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q06',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q23',
    question:
      'Solve Q23: "When you buy me I\'m black, when you use me I\'m red, and when you throw me away I\'m gray?"',
    options: ['Matchstick', 'Charcoal', 'Ink Cartridge', 'Pencil Lead'],
    correctIndex: 1,
    hint: 'Used for grilling or heating: solid black out of the bag, glowing embers while burning, and pale ash afterward.',
    explanation:
      'Charcoal transitions from black briquettes to red glowing embers and finally gray ash.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q07',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q19',
    question:
      'Solve Q19: "People climb me, cut me and burn me, they show me no respect! My rings are not of gold, but they do tell my age?"',
    options: ['Ladder', 'Tree', 'Mountain', 'Brass Bell'],
    correctIndex: 1,
    hint: 'Its concentric wooden cross-section patterns count every year of growth.',
    explanation:
      'A Tree has annual growth rings that tell its age, yet people climb, chop, and burn its wood.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q08',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q27',
    question:
      'Solve Q27: "What has a tongue that can\'t taste, eyes that can\'t see and a sole that will never die?"',
    options: ['Needle', 'Shoe', 'Fish', 'Violin'],
    correctIndex: 1,
    hint: 'Think of footwear anatomy: laces thread through metal "eyes", a flap sits under the laces, and rubber forms the bottom.',
    explanation:
      'A Shoe features eyelets ("eyes"), an upper flap ("tongue"), and a bottom "sole" (wordplay on soul).',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q09',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q8 & Q12',
    question:
      'Combine Q8 ("starts & ends with e, contains one letter") and Q12 ("If you were \'able\', you\'d add a \'T\'"). Which pair belongs in your basket?',
    options: [
      'Eraser &Tablet',
      'Envelope & Table',
      'Eye & Tea',
      'Earring & Stable',
    ],
    correctIndex: 1,
    hint: 'One holds a mailed piece of paper ("letter") inside, and adding the letter T before "able" builds a piece of furniture.',
    explanation:
      'Envelope (starts/ends with "e", holds a letter) + Table ("T" + "able") are both canonical Konfi-07 items.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q10',
    category: 'riddle',
    sourceRef: 'Konfi-07 · Q35 & Q37',
    question:
      'Pair Q35 ("Round and Round for a spin, I help you keep things neat as a pin") with Q37 ("What turns everything around but does not move?"):',
    options: [
      'Ceiling Fan & Compass',
      'Washing Machine & Mirror',
      'Wheel & Turntable',
      'Blender & Window',
    ],
    correctIndex: 1,
    hint: 'The first appliance spins laundry clean; the second hangs still on a wall yet reverses left and right.',
    explanation:
      'Q35 is a Washing Machine (spins clothes neat and clean) and Q37 is a Mirror (flips/turns every image around while staying still).',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q11',
    category: 'negotiation',
    sourceRef: 'Konfi-07 Pillar · Courteousness',
    question:
      'In the Shopping Role Play, the seller opens with a price 40% above market rate. Which opening response best balances Courteousness and Anchoring?',
    options: [
      '"Are you serious? Nobody buys at this inflated rate!"',
      '"Thank you for showing me this piece—its build fits my list well. Based on current retail near ₹1,200, could we work around ₹1,150 if I buy two?"',
      '"Tell me your absolute lowest price right now or I won’t talk."',
      '"Okay, I will pay full ₹1,680 just so I don’t look rude."',
    ],
    correctIndex: 1,
    hint: 'Protect rapport first (never insult the seller), then immediately introduce a calm, evidence-backed counter-anchor.',
    explanation:
      'Appreciating the seller’s product maintains Courteousness while citing a benchmark + bulk incentive anchors the negotiation rationally.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q12',
    category: 'negotiation',
    sourceRef: 'Konfi-07 Pillar · Precision in Communication',
    question:
      'You have 3 minutes left in the allotted shopping role-play time and still need 3 specific items. Which request shows highest Precision in Communication?',
    options: [
      '"Give me some study things, kitchen stuff, and something for rain quickly."',
      '"Do you carry an automatic folding Umbrella, a 20L Microwave, and an A5 Pocket Dictionary in stock right now—and what is your combined cash price?"',
      '"What are all the products available in your store today?"',
      '"Give me a huge discount first, then I will tell you what I want."',
    ],
    correctIndex: 1,
    hint: 'Eliminate open-ended vagueness: name the exact items, specs, and desired decision metric in one crisp sentence.',
    explanation:
      'Naming exact items, specs, and asking for a combined bundle price enables an immediate yes/no trade without wasted dialogue.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q13',
    category: 'negotiation',
    sourceRef: 'Negotiation Strategy · BATNA',
    question:
      'In negotiation, what does BATNA stand for, and how should a buyer use it?',
    options: [
      'Best Alternative To a Negotiated Agreement — your backup option used to evaluate offers without bluffing',
      'Buyer Always Takes New Advantage — demanding extra free items after signing',
      'Basic Anchor Target Negotiation Amount — the highest price you are willing to pay publicly',
      'Bid Acceptance Terms & Net Allowance — a legal invoice clause',
    ],
    correctIndex: 0,
    hint: 'Think about what gives you quiet confidence to walk away respectfully if a seller refuses fair terms.',
    explanation:
      'BATNA (Best Alternative To a Negotiated Agreement) protects you from accepting bad terms and gives calm, credible leverage.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q14',
    category: 'negotiation',
    sourceRef: 'Negotiation Strategy · ZOPA',
    question:
      'You are willing to pay at most ₹5,000 for a Study Table + Chair set (Q12 + Q33). The vendor’s secret minimum cost floor is ₹4,200. What is the ZOPA?',
    options: [
      '₹0 to ₹4,200',
      '₹4,200 to ₹5,000 (the ₹800 overlap where a mutually beneficial deal can close)',
      '₹5,000 to ₹6,000',
      'Only exactly ₹4,200',
    ],
    correctIndex: 1,
    hint: 'ZOPA is the "Zone of Possible Agreement"—the overlap between seller minimum and buyer maximum.',
    explanation:
      'Any agreement between ₹4,200 and ₹5,000 makes both buyer and seller better off than walking away.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q15',
    category: 'negotiation',
    sourceRef: 'Konfi-07 Pillar · Convincing & Trade-offs',
    question:
      'The seller states firmly: "I cannot drop my Washing Machine price of ₹16,000 by a single rupee." What is the smartest Convincing move?',
    options: [
      'Repeat "₹14,500 please" louder until they give in',
      'Propose a non-cash value trade: "At ₹16,000 full tag, please include same-day delivery, hose installation, and a dust cover free"',
      'Insult the brand quality to force a price drop',
      'Walk out immediately without exploring add-ons',
    ],
    correctIndex: 1,
    hint: 'When direct cash margin is frozen, expand the pie with low-cost/high-value accessories or services.',
    explanation:
      'Non-monetary concessions (delivery, installation, warranty, accessories) cost the seller less than their retail value to the buyer.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q16',
    category: 'negotiation',
    sourceRef: 'Konfi-07 Pillar · Logical Thinking',
    question:
      'A shopkeeper offers "25% off" only if you double your quantity of Candles (Q21) and Envelopes (Q8) beyond what you actually need. What should Logical Thinking check first?',
    options: [
      'Always take the bigger percentage badge regardless of total cash spend',
      'Verify total cash outflow, storage spoilage/waste, and whether a smaller 12% bundle on needed items leaves more net budget',
      'Ignore unit price and decide purely on color packaging',
      'Buy double now and assume you can resell them later',
    ],
    correctIndex: 1,
    hint: 'Discount percentage can be a trap if excess inventory increases total out-of-pocket cost or creates waste.',
    explanation:
      'True value depends on net cash spent vs. actual utility needed—never chase a percentage illusion that breaks your budget.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q17',
    category: 'negotiation',
    sourceRef: 'Konfi-07 · Seller Perspective & Persuasion',
    question:
      'Now flip roles—YOU are the seller in the FACE Konfi-07 Role Play. A buyer asks for a 30% discount on a Microwave. How do you persuade them back up courteously?',
    options: [
      '"Impossible, go shop somewhere cheaper."',
      'Reframe around value + conditional concession: "This model includes a 2-year magnetron warranty & ceramic plate worth ₹1,800; I can trim 8% if you pair a toaster or pay upfront"',
      'Say nothing and stare silently for 60 seconds',
      'Drop the entire 30% immediately before testing their real budget',
    ],
    correctIndex: 1,
    hint: 'Top negotiators never make unreciprocated concessions—tie any concession to a concrete buyer commitment.',
    explanation:
      'Conditional "If you do X, I can offer Y" framing protects seller margin while preserving buyer respect.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q18',
    category: 'negotiation',
    sourceRef: 'Negotiation Strategy · Handling Deadlock',
    question:
      'Both you and the seller are stuck ₹300 apart with 60 seconds left on the clock. Which collaborative closing tactic breaks deadlock cleanly?',
    options: [
      'Offer a principled split or add a low-cost Konfi-07 item (like a Guitar Pick / Pen Pack) to bridge the ₹300 gap smoothly',
      'Refuse to speak until the seller surrenders all ₹300',
      'Change your entire shopping list to restart from zero',
      'Claim you forgot your wallet and ask for credit',
    ],
    correctIndex: 0,
    hint: 'Look for a fair split-the-difference or small add-on bridge that lets both sides save face.',
    explanation:
      'Bridging a small gap with a principled split or symbolic add-on closes the deal inside the deadline without resentment.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q19',
    category: 'negotiation',
    sourceRef: 'Placement Application · Offer Discussion',
    question:
      'During a placement HR round, the recruiter asks for your salary expectations before sharing the role’s budget band. What is the sharpest reply?',
    options: [
      '"Give me whatever you usually pay freshers."',
      '"At least ₹12 LPA or I won’t join."',
      '"I value the learning curve in this Analyst role first—based on campus benchmarks for similar scope, I’m targeting ₹5.5–₹6.5 LPA, though I’d love to hear your team’s range and total growth components."',
      '"I can’t answer until I see my joining bonus."',
    ],
    correctIndex: 2,
    hint: 'Combine polite enthusiasm for the role, a reasoned market range, and a question inviting the recruiter’s band.',
    explanation:
      'Courteous enthusiasm + researched benchmark range + openness to total compensation shows placement maturity.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q20',
    category: 'negotiation',
    sourceRef: 'Konfi-07 Synthesis · All 5 Skill Pillars',
    question:
      'Why does the FACE Konfi-07 Shopping Role Play pair tricky riddles (like Clock − Lock + Hair = Chair) with live time-limited buying?',
    options: [
      'Purely to test fast arithmetic speed without any communication',
      'Because real workplace negotiation requires rapid accurate decoding (Logic + Precision) *before* persuasive, courteous execution under deadline pressure',
      'To force learners to memorize dictionary definitions word for word',
      'So buyers try to trick vendors into losing money',
    ],
    correctIndex: 1,
    hint: 'Think about the 5 pillars printed at the top of Sheet 1: what happens if you negotiate persuasively for the *wrong* decoded product?',
    explanation:
      'In real business and placements, high persuasion on the wrong requirement fails—accurate problem decoding + courteous, precise persuasion wins together.',
    xpClean: 40,
    xpWithHint: 25,
  },
];

export const NEGOTIATION_LAB_SCENARIO = {
  title: 'Konfi-07 Final Bargaining Role-Play Simulation',
  prompt:
    'You decoded 3 urgent items from your Konfi-07 sheet: (1) Microwave Oven (Q26), (2) Study Chair (Q33 Rebus), and (3) Dictionary (Q7). The vendor quotes ₹11,800 total, refuses pure cash cuts below ₹10,500, and your hard budget cap is ₹10,400 with only 3 minutes left. Write your complete courteous, logical, and persuasive closing script to win the bundle inside budget (or secure extra warranty/freebies that offset the gap).',
  targetItems: ['Microwave Oven (Q26)', 'Chair (Q33 Rebus)', 'Dictionary (Q7)'],
  rubricChecklist: [
    'Courteous greeting / appreciation of quality or vendor time',
    'Logical benchmark or budget rationale (₹10,400 limit / market check)',
    'Persuasive single-basket close or conditional ("If I pay now...") framing',
    'Convincing trade-off concession (free delivery, warranty, or add-on item)',
    'Precision naming exact items (Microwave, Chair, Dictionary) and exact numbers',
  ],
};

export function evaluateNegotiationRoleplay(draft: string): RoleplayEvaluation {
  const clean = draft.trim();
  const lower = clean.toLowerCase();
  const words = clean.split(/\s+/).filter(Boolean).length;

  const hasSignals = (terms: string[]) =>
    terms.reduce((cnt, t) => (lower.includes(t) ? cnt + 1 : cnt), 0);

  // 1. Courteousness /20
  const politeHits = hasSignals([
    'thank',
    'appreciate',
    'please',
    'respect',
    'understand',
    'grateful',
    'kindly',
    'quality',
    'pleasure',
    'valued',
  ]);
  const courteousScore = Math.min(20, (words >= 18 ? 6 : 2) + politeHits * 5);

  // 2. Logical Thinking /20
  const logicHits = hasSignals([
    'budget',
    'market',
    'benchmark',
    'compare',
    'margin',
    'total',
    'value',
    'cost',
    '10400',
    '10,400',
    '10500',
    '10,500',
    '11800',
    '11,800',
  ]);
  const logicScore = Math.min(20, (words >= 20 ? 6 : 2) + logicHits * 4);

  // 3. Persuasion /20
  const persuasionHits = hasSignals([
    'bundle',
    'combo',
    'together',
    'today',
    'immediately',
    'now',
    'assured',
    'both',
    'win-win',
    'mutual',
    'if ',
  ]);
  const persuasionScore = Math.min(20, (words >= 25 ? 6 : 2) + persuasionHits * 4);

  // 4. Convincing Trade-Off /20
  const tradeoffHits = hasSignals([
    'warranty',
    'delivery',
    'free',
    'include',
    'cover',
    'cash',
    'upfront',
    'guarantee',
    'bowl',
    'discount',
    'concession',
    'complimentary',
  ]);
  const convincingScore = Math.min(20, (words >= 25 ? 5 : 2) + tradeoffHits * 5);

  // 5. Precision in Communication /20
  const precisionHits = hasSignals([
    'microwave',
    'chair',
    'dictionary',
    '₹',
    'rs',
    'rupee',
    '10,',
    '20l',
    'minute',
  ]);
  const precisionScore = Math.min(20, (words >= 20 ? 5 : 2) + precisionHits * 4);

  const totalScore = Math.min(
    100,
    courteousScore + logicScore + persuasionScore + convincingScore + precisionScore
  );

  const weakest = [
    { name: 'Courteousness', score: courteousScore },
    { name: 'Logical Thinking', score: logicScore },
    { name: 'Persuasion', score: persuasionScore },
    { name: 'Convincing Trade-off', score: convincingScore },
    { name: 'Precision', score: precisionScore },
  ].sort((a, b) => a.score - b.score)[0];

  const feedback =
    totalScore >= 80
      ? `Executive-ready negotiation (${totalScore}/100)! Balanced polite rapport, clear numbers, and mutually beneficial trade-offs.`
      : totalScore >= 60
      ? `Solid negotiation (${totalScore}/100). Next upgrade: sharpen ${weakest.name} with specific item names, rupee anchors, or an add-on trade-off.`
      : `Developing script (${totalScore}/100). Strengthen ${weakest.name}—name Microwave, Chair & Dictionary explicitly, cite your ₹10,400 cap, and offer a win-win trade.`;

  return {
    totalScore,
    courteousScore,
    logicScore,
    persuasionScore,
    convincingScore,
    precisionScore,
    feedback,
  };
}

export function getShoppingRank(shopXp: number): { title: string; nextXp: number } {
  if (shopXp >= 900) return { title: 'Master Deal Architect', nextXp: 1200 };
  if (shopXp >= 700) return { title: 'Persuasion Strategist', nextXp: 900 };
  if (shopXp >= 450) return { title: 'Tactical Buyer', nextXp: 700 };
  if (shopXp >= 200) return { title: 'Konfi-07 Clue Decoder', nextXp: 450 };
  return { title: 'Window Shopper', nextXp: 200 };
}

export const SHOPPING_BADGES: ShoppingBadgeDefinition[] = [
  {
    id: 'sn_example_explorer',
    title: 'Konfi-07 Scholar',
    description: 'Reviewed and marked at least 6 solved Konfi-07 examples or negotiation cases.',
    criteriaLabel: 'Study 6+ Solved Examples',
    accent: 'blue',
    checkUnlocked: ({ studiedCount }) => studiedCount >= 6,
  },
  {
    id: 'sn_riddle_decoder',
    title: 'Riddle & Rebus Ace',
    description: 'Correctly decoded at least 8 of 10 Konfi-07 shopping-list riddle MCQs.',
    criteriaLabel: '8+ Riddle MCQs Correct',
    accent: 'violet',
    checkUnlocked: ({ riddleCorrectCount }) => riddleCorrectCount >= 8,
  },
  {
    id: 'sn_sharp_instinct',
    title: 'Zero-Hint Tactician',
    description: 'Solved at least 10 MCQs accurately without revealing hints first.',
    criteriaLabel: '10+ Clean Solves (No Hint)',
    accent: 'amber',
    checkUnlocked: ({ cleanCorrectCount }) => cleanCorrectCount >= 10,
  },
  {
    id: 'sn_persuasion_pro',
    title: 'Courteous Persuader',
    description: 'Earned 70/100 or higher in the interactive Negotiation Role-Play Lab.',
    criteriaLabel: 'Role-Play Score >= 70/100',
    accent: 'rose',
    checkUnlocked: ({ roleplayScore }) => roleplayScore >= 70,
  },
  {
    id: 'sn_precision_closer',
    title: 'Precision Closer',
    description: 'Achieved 75%+ overall accuracy across all 20 Shopping & Negotiation MCQs.',
    criteriaLabel: '15+/20 MCQs Correct',
    accent: 'cyan',
    checkUnlocked: ({ answeredCount, correctCount }) =>
      answeredCount >= 20 && correctCount >= 15,
  },
  {
    id: 'sn_certified_negotiator',
    title: 'Shopping & Negotiation Master',
    description: 'Completed all 20 MCQs and submitted the Negotiation Role-Play Lab.',
    criteriaLabel: 'Complete Full Module',
    accent: 'emerald',
    checkUnlocked: ({ completedModule }) => completedModule,
  },
];

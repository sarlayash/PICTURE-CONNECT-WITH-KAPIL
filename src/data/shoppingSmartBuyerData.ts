import buyerAnalyticalImg from '../assets/images/buyer_analytical_researcher_1795222885096.jpg';
import buyerBargainImg from '../assets/images/buyer_bargain_deal_hunter_1795222884611.jpg';
import buyerImpulseImg from '../assets/images/buyer_impulse_trendsetter_1795222904744.jpg';
import buyerLoyalistImg from '../assets/images/buyer_brand_loyalist_vip_1795222885873.jpg';
import buyerB2bImg from '../assets/images/buyer_b2b_procurement_1795222885733.jpg';
import buyerUrgentImg from '../assets/images/buyer_urgent_service_seeker_1795222884947.jpg';

export type BuyerArchetypeId =
  | 'analytical'
  | 'bargain_hunter'
  | 'impulse'
  | 'brand_loyalist'
  | 'b2b_procurement'
  | 'urgent_service';

export interface BuyerArchetypeProfile {
  id: BuyerArchetypeId;
  title: string;
  tagline: string;
  image: string;
  imageAlt: string;
  psychology: string;
  keyTriggers: string[];
  blindSpotTrap: string;
  smartBuyingRule: string;
  sellerStrategy: string;
  accent: 'blue' | 'emerald' | 'rose' | 'amber' | 'violet' | 'cyan';
}

export interface DomainTimingGuide {
  domain: string;
  bestTimeToBuy: string;
  avoidBuyingWhen: string;
  typicalSavings: string;
  goldenTrick: string;
}

export interface DealStackRule {
  step: string;
  title: string;
  detail: string;
}

export interface DarkPatternAlert {
  pattern: string;
  howItTricks: string;
  counterMove: string;
}

export interface SolvedBuyerDomainExample {
  id: string;
  number: string;
  domain: string;
  domainGroup:
    | 'Tech & Appliances'
    | 'Lifestyle & Retail'
    | 'Travel, Auto & Home'
    | 'Finance, Health & Services'
    | 'Career, SaaS & B2B';
  productOrService: string;
  buyerType: BuyerArchetypeId;
  whenToBuy: string;
  scenario: string;
  commonTrap: string;
  solvedAction: string;
  savingsMath: string;
  proTip: string;
}

export interface ExtendedShoppingMcq {
  id: string;
  category: 'buyer_types' | 'domains' | 'deals_timing';
  sourceRef: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  hint: string;
  explanation: string;
  xpClean: number;
  xpWithHint: number;
}

export const BUYER_ARCHETYPES: BuyerArchetypeProfile[] = [
  {
    id: 'analytical',
    title: '01. The Analytical Researcher',
    tagline: 'Specs, Total Cost of Ownership (TCO) & verified benchmarks first',
    image: buyerAnalyticalImg,
    imageAlt: 'Analytical buyer comparing laptop specifications and price charts on a tablet in an electronics store',
    psychology:
      'Driven by logic, side-by-side spec sheets, independent reviews, warranty length, and long-term cost per use rather than flashy ads.',
    keyTriggers: [
      'Transparent spec comparisons & independent test data',
      'Energy efficiency, resale value & total 5-year TCO math',
      'Written warranty terms & zero hidden fees',
    ],
    blindSpotTrap:
      'Analysis paralysis — delaying so long that a genuine seasonal clearance sells out or a needed tool loses productivity value.',
    smartBuyingRule:
      'Shortlist 3 models max, set a 48-hour decision deadline, and compare 3-year Total Cost of Ownership instead of sticker price alone.',
    sellerStrategy:
      'Share verifiable spec sheets, unit-economics ROI, and exact warranty SLA instead of emotional hype.',
    accent: 'blue',
  },
  {
    id: 'bargain_hunter',
    title: '02. The Savvy Deal & Bargain Hunter',
    tagline: 'Seasonal sale calendars, coupon stacking & lowest effective net price',
    image: buyerBargainImg,
    imageAlt: 'Savvy Indian deal hunter checking festival cashback discounts on a smartphone inside a modern shopping mall',
    psychology:
      'Motivated by winning the smartest deal — tracks historical prices, combines bank offers + exchange bonuses + cashback portals, and never pays full MRP.',
    keyTriggers: [
      'Verified price drops against 90-day price history',
      'Stackable coupons, bank instant discounts & loyalty rewards',
      'Bundle value where net rupee per unit drops sharply',
    ],
    blindSpotTrap:
      'Falling for fake "70% OFF" inflated MRP tags or buying unnecessary bulk items solely because the discount percentage looks huge.',
    smartBuyingRule:
      'Verify 6-month price history before trusting any sale banner, and judge every offer by net rupee spent vs actual utility.',
    sellerStrategy:
      'Offer structured bundle pricing, loyalty tiers, or value-added accessories rather than eroding core brand credibility.',
    accent: 'emerald',
  },
  {
    id: 'impulse',
    title: '03. The Impulse & Lifestyle Trendsetter',
    tagline: 'Aesthetic emotion, social proof, limited drops & instant gratification',
    image: buyerImpulseImg,
    imageAlt: 'Lifestyle trendsetter browsing curated jackets and sneakers in a modern minimalist boutique',
    psychology:
      'Reacts quickly to visual appeal, influencer launches, flash countdown timers, and the excitement of owning the latest trend first.',
    keyTriggers: [
      'Scarcity cues ("Only 2 left", limited-edition colorways)',
      'Instant checkout frictionless apps & Buy-Now-Pay-Later (BNPL)',
      'Social validation & aesthetic showroom lighting',
    ],
    blindSpotTrap:
      'Buyer’s remorse, paying full launch MRP weeks before End-of-Season markdowns, and accumulating high-interest BNPL/credit card balances.',
    smartBuyingRule:
      'Apply the 48-Hour Cooling-Off Rule for any non-essential item above ₹1,500 and calculate "Cost Per Wear / Use" before swiping.',
    sellerStrategy:
      'Build trust through honest sizing, easy exchange windows, and curated styling combos that prevent post-purchase regret.',
    accent: 'rose',
  },
  {
    id: 'brand_loyalist',
    title: '04. The Brand Loyalist & Quality VIP',
    tagline: 'Trusted craftsmanship, seamless service ecosystem & zero-hassle reliability',
    image: buyerLoyalistImg,
    imageAlt: 'Brand-loyal customer consulting a showroom specialist over a watch and warranty brochure',
    psychology:
      'Prioritizes proven durability, authentic authorized service centers, consistent user experience, and peace of mind over chasing the cheapest unknown brand.',
    keyTriggers: [
      'Authorized dealer authenticity & seamless service network',
      'VIP loyalty perks, trade-in upgrades & concierge support',
      'Superior build materials & long-term resale value',
    ],
    blindSpotTrap:
      'Overpaying a "brand tax" when a competing flagship offers identical core hardware or neglecting to negotiate dealer-level add-ons.',
    smartBuyingRule:
      'Stay loyal to reliable brands, but still buy during authorized festive/corporate discount windows and ask for complimentary care plans.',
    sellerStrategy:
      'Reward repeat history with early-access launches, complimentary maintenance, and white-glove delivery.',
    accent: 'amber',
  },
  {
    id: 'b2b_procurement',
    title: '05. The B2B & Bulk Procurement Buyer',
    tagline: 'Multi-vendor RFQs, GST input credit, SLAs & volume contract terms',
    image: buyerB2bImg,
    imageAlt: 'Corporate procurement manager reviewing vendor contracts and SLA quotes across a glass conference table',
    psychology:
      'Purchases on behalf of a company, campus club, startup, or family event — optimizes volume rates, payment credit periods, GST invoices, and strict delivery SLAs.',
    keyTriggers: [
      'Minimum 3 written competitive quotes (RFQ comparison)',
      'GST tax invoice compliance & 30–60 day credit terms',
      'Written penalty clauses for late delivery or defective batches',
    ],
    blindSpotTrap:
      'Choosing the cheapest vendor without auditing delivery reliability, after-sales SLA, or hidden transport/installation surcharges.',
    smartBuyingRule:
      'Never sign on verbal promises — lock unit price, GST breakup, delivery date, replacement SLA, and payment milestones in writing.',
    sellerStrategy:
      'Present tiered volume slabs, clear SLA guarantees, GST billing readiness, and dedicated account support.',
    accent: 'violet',
  },
  {
    id: 'urgent_service',
    title: '06. The Need-Based & Urgent Service Seeker',
    tagline: 'Immediate problem resolution, transparent rate cards & verified safety',
    image: buyerUrgentImg,
    imageAlt: 'Need-based customer reviewing a transparent service checklist for travel, home repair, and insurance with an advisor',
    psychology:
      'Buys because an immediate real-life need occurred — flight booking, medical test, AC breakdown, rental lease, or urgent repair — valuing speed and clarity.',
    keyTriggers: [
      'Upfront standardized rate card with zero surprise add-ons',
      'Verified technician/provider reviews & fast turnaround',
      'Clear cancellation, refund & service warranty policy',
    ],
    blindSpotTrap:
      'Panic-paying 2×–3× inflated emergency fees, skipping rate comparisons, or signing unverified service agreements with hidden charges.',
    smartBuyingRule:
      'Even in urgent situations, take 3 minutes to confirm an all-inclusive written estimate (parts + labor + tax) before authorizing work.',
    sellerStrategy:
      'Lead with transparent itemized pricing, exact ETA, and a written post-service warranty to earn instant trust.',
    accent: 'cyan',
  },
];

export const BUYER_ARCHETYPE_MAP: Record<BuyerArchetypeId, BuyerArchetypeProfile> =
  BUYER_ARCHETYPES.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<BuyerArchetypeId, BuyerArchetypeProfile>);

export const DOMAIN_TIMING_CALENDAR: DomainTimingGuide[] = [
  {
    domain: 'Smartphones, Laptops & Consumer Tech',
    bestTimeToBuy: 'Oct–Nov (Festive Mega Sales), Jan (Republic Day), Jul–Aug (Back-to-School) & 2–4 weeks after next-gen launch',
    avoidBuyingWhen: 'Launch week at full MRP unless bundled with genuine bank + exchange bonus',
    typicalSavings: '15% – 35% net off',
    goldenTrick: 'Compare previous-generation flagship right after the new model drops — 95% of performance at 30% lower cost.',
  },
  {
    domain: 'ACs, Coolers, Geysers & Home Appliances',
    bestTimeToBuy: 'Off-Season: Oct–Feb for ACs & Refrigerators; Apr–Jun for Geysers & Room Heaters',
    avoidBuyingWhen: 'Peak heatwave (Apr–May for ACs) or peak winter (Dec–Jan for heaters)',
    typicalSavings: '20% – 32% + free installation',
    goldenTrick: 'Always compute 5-year electricity cost (BEE 5-Star vs 3-Star) — an extra ₹5,000 upfront often saves ₹15,000+ in power bills.',
  },
  {
    domain: 'Fashion, Apparel & Footwear',
    bestTimeToBuy: 'End-of-Season Sales (EOSS): January (winter clearance) & July (summer clearance) + mid-week flash drops',
    avoidBuyingWhen: 'New collection drop weeks or peak wedding/festival rush days',
    typicalSavings: '40% – 65% off',
    goldenTrick: 'Buy evergreen interview staples (navy blazer, white Oxford shirt, leather formal shoes) during EOSS rather than 2 days before placement.',
  },
  {
    domain: 'Flights, Hotels & Business Travel',
    bestTimeToBuy: 'Domestic flights: 3–6 weeks ahead; International: 2–4 months ahead; Mid-week Tue/Wed departures',
    avoidBuyingWhen: 'Last 7 days before departure, long-weekend Fridays, or festival eve',
    typicalSavings: '25% – 45% off',
    goldenTrick: 'Compare OTA fare vs airline direct portal — airline direct often includes free seat/meal waivers or smoother refund rules.',
  },
  {
    domain: 'Cars, Two-Wheelers & EVs',
    bestTimeToBuy: 'Quarter-ends (Mar, Jun, Sep, Dec), Year-end Dec clearance (MY stock), and pre-facelift clearance',
    avoidBuyingWhen: 'First 60 days of a hyped new launch with long waiting lists and mandatory dealer accessory packs',
    typicalSavings: '₹25,000 – ₹1.5 Lakh+',
    goldenTrick: 'Unbundle dealer insurance & optional accessories — matching an external IRDAI insurance quote saves 35%–50% on year-1 insurance instantly.',
  },
  {
    domain: 'Groceries, FMCG & Quick Commerce',
    bestTimeToBuy: 'Month-start pantry restock (1st–7th super-saver days) & local mandis for fresh produce early morning',
    avoidBuyingWhen: 'Late-night impulse single-item quick-commerce orders loaded with handling + surge + small-cart fees',
    typicalSavings: '12% – 25% monthly',
    goldenTrick: 'Always check "Price per 100g / per kg / per litre" — smaller promo packs frequently cost MORE per kg than standard packs (shrinkflation).',
  },
  {
    domain: 'Healthcare, Pharmacy & Diagnostics',
    bestTimeToBuy: 'Preventive annual full-body checkup bundles, Jan Aushadhi / quality generic salt equivalents, NABL-accredited labs',
    avoidBuyingWhen: 'Ad-hoc individual walk-in lab tests without comparing NABL package rates or insurer cashless network',
    typicalSavings: '30% – 70% on medicines & labs',
    goldenTrick: 'Match the exact chemical composition (salt + mg) with your doctor’s consent — quality generics deliver identical efficacy at a fraction of branded cost.',
  },
  {
    domain: 'SaaS, Cloud, EdTech & Subscriptions',
    bestTimeToBuy: 'Black Friday / Cyber Monday (Nov), Student/Academic ID verification (.edu/.ac.in), Annual billing vs Monthly',
    avoidBuyingWhen: 'Auto-renewing monthly plans without usage audits or paying retail when GitHub Student / campus packs exist',
    typicalSavings: '30% – 100% (student tiers)',
    goldenTrick: 'Audit recurring UPI/card autopay mandates every quarter and cancel dormant subscriptions before renewal date.',
  },
  {
    domain: 'Real Estate, Rentals & Furniture',
    bestTimeToBuy: 'Financial year-end (Feb–Mar) or monsoon slow months (Jul–Aug) for rentals/property; Festive combos for furniture',
    avoidBuyingWhen: 'Peak academic admission rush (Jun–Jul near colleges) without inspecting lease clauses',
    typicalSavings: '8% – 18% on rent/closing costs',
    goldenTrick: 'Always negotiate on RERA Carpet Area (not Super Built-Up Area) and cap annual rent escalation at 5%–7% in writing.',
  },
  {
    domain: 'Jewellery, Gold & Festive Gifting',
    bestTimeToBuy: 'Non-wedding lean months (Mar, Jul, Aug) when jewellers offer 25%–50% off making charges',
    avoidBuyingWhen: 'Dhanteras / Akshaya Tritiya evening rush without pre-locking gold rate or auditing making/wastage charges',
    typicalSavings: '8% – 15% on total bill',
    goldenTrick: 'Verify 6-digit BIS HUID Hallmark on every piece, separate metal rate from making charges, and ask for a 100% buyback policy in writing.',
  },
];

export const DEAL_STACKING_MECHANICS: DealStackRule[] = [
  {
    step: 'Layer 01',
    title: 'Price History Verification First',
    detail: 'Check 90-day / 1-year historical price charts (Keepa / PriceHistory) to verify the "sale price" is truly below normal street price and not a pre-sale MRP hike.',
  },
  {
    step: 'Layer 02',
    title: 'Base Seasonal / Store Coupon',
    detail: 'Apply brand-site welcome codes, corporate/student ID discounts (UNiDAYS, SheerID, company email), or cart-threshold flat coupons.',
  },
  {
    step: 'Layer 03',
    title: 'Instant Bank / Co-Branded Card Offer',
    detail: 'Stack 5%–10% instant bank discounts (often capped at ₹1,500–₹5,000 per card) — check minimum cart threshold so you don’t miss the slab by ₹100.',
  },
  {
    step: 'Layer 04',
    title: 'Exchange Bonus + Old Device Value',
    detail: 'Combine fair resale value of an older smartphone/appliance with brand "Exchange Bonus" (often ₹3,000–₹8,000 extra above base resale).',
  },
  {
    step: 'Layer 05',
    title: 'Cashback Portals & Gift Voucher Stacking',
    detail: 'Route checkout through verified cashback portals or buy discounted brand gift vouchers (3%–8% off) via bank reward portals before applying at checkout.',
  },
  {
    step: 'Layer 06',
    title: 'No-Cost EMI Hidden Math Audit',
    detail: 'Never assume "No-Cost EMI" is truly ₹0 extra — banks still charge ₹199–₹299 processing fee PLUS 18% GST on the interest component every month!',
  },
  {
    step: 'Layer 07',
    title: 'GST Invoice & Open-Box Delivery Check',
    detail: 'For B2B/freelance purchases, enter GSTIN for up to 18% Input Tax Credit. For high-value tech, insist on Open-Box Delivery & record an unboxing video before sharing OTP.',
  },
  {
    step: 'Layer 08',
    title: 'Total Cost of Ownership (TCO) Final Gate',
    detail: 'Add 3-year power consumption, ink/filter refills, extended warranty, and resale value before deciding — a "cheap" inkjet printer with ₹2,000 cartridges costs more than an InkTank.',
  },
];

export const DARK_PATTERN_ALERTS: DarkPatternAlert[] = [
  {
    pattern: 'Fake MRP Inflation ("70% OFF!")',
    howItTricks: 'Seller raises the crossed-out MRP right before a mega sale so the regular ₹1,999 item looks like a steep cut from ₹6,999.',
    counterMove: 'Ignore percentage banners completely; check 6-month historical average price and compare across 2 rival platforms.',
  },
  {
    pattern: 'Drip Pricing & Junk Fees at Final Step',
    howItTricks: 'Flights, tickets, and delivery apps advertise a low base price, then silently add convenience fee, platform fee, packaging, and surge at checkout.',
    counterMove: 'Always compare final payable checkout totals (inclusive of all taxes & fees) across platforms before paying.',
  },
  {
    pattern: 'Pre-Checked Basket Sneaking',
    howItTricks: 'Checkout screens pre-tick travel insurance, extended warranty, charity donations, or priority boarding without asking.',
    counterMove: 'Scan every itemized checkbox on the payment summary screen and untick unwanted add-ons before clicking Pay.',
  },
  {
    pattern: 'Artificial Scarcity & Resetting Timers',
    howItTricks: '"Only 1 left in stock!" or "Offer expires in 04:59" triggers FOMO so you skip comparing alternatives.',
    counterMove: 'Refresh in another tab or wait 24 hours — legitimate value stays logical without panic pressure.',
  },
  {
    pattern: 'Decoy Pricing ("Middle Tier Trap")',
    howItTricks: 'Menus/SaaS show Small (₹299), Medium (₹499), and Large (₹529) solely to nudge you from ₹299 up to ₹529 when you only needed Small.',
    counterMove: 'Decide your exact required capacity BEFORE looking at the pricing tiers.',
  },
  {
    pattern: 'Replacement-Only vs Full Refund Policy',
    howItTricks: 'Marketplaces replace "7-Day Return" with "7-Day Service Center Replacement Only" on electronics, locking you into repair queues.',
    counterMove: 'Read the return/replacement line directly under the Buy button before placing any electronics order.',
  },
];

export const MENTOR_KAPIL_BUYER_RULES: string[] = [
  'Rule 1 — Decode Your Need Before Seeing Any Ad: Write exact must-have specs and hard rupee cap BEFORE opening an app or entering a store.',
  'Rule 2 — Buy Value, Not Discount Percentages: Saving 50% on something you don’t need is still 100% wasted money.',
  'Rule 3 — Timing Beats Haggling: Buying an AC in November or winter wear in January often saves more effortlessly than 30 minutes of tough bargaining.',
  'Rule 4 — Always Compute Total Cost of Ownership (TCO): Factor electricity, consumables, warranty, and resale value — not just Day-1 sticker price.',
  'Rule 5 — Courteous Precision Wins Every Deal: Whether negotiating with a shopkeeper, car dealer, SaaS vendor, or HR recruiter, calm market proof + polite firmness outperforms aggression every time.',
];

export const SHOPPING_NOTES_CHEAT_SHEET = `EMPLOYABILITY UNIVERSE WITH KAPIL — SMART SHOPPING & DEAL MASTERY CHEAT SHEET
================================================================================
1. SIX BUYER ARCHETYPES
- Analytical Researcher: Compares specs, TCO & warranties. Watch out for analysis paralysis.
- Bargain / Deal Hunter: Stacks sales, coupons & cashback. Watch out for fake MRP & unnecessary bulk buys.
- Impulse Trendsetter: Driven by aesthetics & FOMO. Use 48-Hour Cooling-Off Rule & Cost-Per-Use math.
- Brand Loyalist / VIP: Prioritizes reliability & service network. Still buy during authorized promo windows.
- B2B / Bulk Procurement: Uses 3-quote RFQs, GST credit, credit terms & written SLAs.
- Urgent / Need-Based Seeker: Needs fast resolution. Always demand an itemized written quote first.

2. WHEN TO BUY (ANNUAL TIMING CALENDAR)
- Tech & Laptops: Oct-Nov festive sales, Jan Republic Day, Jul-Aug Back-to-School, post-new-gen drop.
- ACs & Appliances: Off-season (Oct-Feb for ACs; Apr-Jun for geysers) + check BEE 5-Star TCO.
- Fashion & Footwear: End-of-Season Sales (Jan & Jul) for 40-65% off evergreen staples.
- Flights & Travel: Domestic 3-6 wks ahead; International 2-4 mos ahead; Tue/Wed departures.
- Cars & EVs: Quarter-ends (Mar/Jun/Sep/Dec), Dec MY clearance + unbundle dealer insurance.
- SaaS & Courses: Black Friday (Nov), Student ID packs (.edu/.ac.in), annual billing (20-40% less).

3. 8-STEP DEAL STACKING FORMULA
Price History Check -> Base Sale / Corporate Coupon -> Instant Bank Card Discount -> Exchange Bonus -> Cashback / Discounted Gift Voucher -> No-Cost EMI GST Audit -> GST Invoice + Open-Box Delivery -> 3-Year TCO Verification.

4. MENTOR KAPIL'S GOLDEN RULE
"Never buy a percentage badge. Buy verified utility at the lowest Total Cost of Ownership — with courteous precision and written terms."`;

export const SOLVED_BUYER_DOMAIN_EXAMPLES: SolvedBuyerDomainExample[] = [
  {
    id: 'ex_b01',
    number: 'Case 01',
    domain: 'Electronics & Laptops',
    domainGroup: 'Tech & Appliances',
    productOrService: 'Coding & Placement Laptop (16GB RAM / 512GB SSD)',
    buyerType: 'analytical',
    whenToBuy: 'Jul–Aug Back-to-School or Oct Festive Sale',
    scenario:
      'A B.Tech student needs a reliable coding laptop under ₹60,000. Retail showroom pushes a ₹64,990 8GB RAM flashy model with a "free" ₹2,000 bag.',
    commonTrap:
      'Buying a soldered 8GB RAM laptop for looks or accepting an overpriced showroom bundle without checking student discounts.',
    solvedAction:
      'Compare 3 models with 16GB RAM + SSD + matte IPS screen. Use verified college ID on brand official store (7% student discount) + ₹4,000 instant bank card offer + 2-year accidental damage pack at ₹1,999 promo.',
    savingsMath: '₹64,990 → ₹54,490 net (₹10,500 saved + double RAM & 2-yr warranty)',
    proTip:
      'Always verify whether RAM is upgradeable and check local authorized service center turnaround time before finalizing any laptop.',
  },
  {
    id: 'ex_b02',
    number: 'Case 02',
    domain: 'Smartphones',
    domainGroup: 'Tech & Appliances',
    productOrService: 'Previous-Gen Flagship 5G Smartphone',
    buyerType: 'bargain_hunter',
    whenToBuy: 'Oct–Nov Festive Sale or 3 weeks after successor launches',
    scenario:
      'New flagship launches at ₹79,999. Last year’s flagship (same camera sensor & 5 years of OS updates left) drops during the October sale.',
    commonTrap:
      'Pre-ordering launch-day MRP on a 12-month EMI and losing ₹18,000 in depreciation within 90 days.',
    solvedAction:
      'Verify 1-year price graph, buy previous-gen flagship at ₹51,999 sale price, stack ₹3,500 bank instant discount + ₹11,000 old phone exchange + ₹4,000 brand exchange bonus, and verify IMEI during Open-Box Delivery.',
    savingsMath: '₹79,999 new MRP → ₹33,499 net effective (₹46,500 saved)',
    proTip:
      'Inspect physical screen, camera lenses, and verify serial number on the brand warranty portal BEFORE sharing your Open-Box Delivery OTP.',
  },
  {
    id: 'ex_b03',
    number: 'Case 03',
    domain: 'Home Appliances (AC)',
    domainGroup: 'Tech & Appliances',
    productOrService: '1.5 Ton Inverter Split Air Conditioner',
    buyerType: 'analytical',
    whenToBuy: 'November – February (Off-Season Clearance)',
    scenario:
      'Family debates between a ₹33,000 3-Star AC bought in peak May heat vs a ₹39,500 5-Star Inverter AC bought in January.',
    commonTrap:
      'Waiting until May heatwave (prices +₹5,000 higher, 10-day installation delay) and ignoring annual electricity unit consumption (ISEER rating).',
    solvedAction:
      'Buy 5-Star (ISEER 5.2) copper-condenser AC in January off-season at ₹36,500 with bank discount + negotiated free standard installation. At 8 hrs/day × 6 months, 5-Star saves ~320 kWh/year (~₹2,880/yr).',
    savingsMath: '₹3,000 off-season cut + ₹14,400 power saved over 5 yrs = ₹17,400 TCO win',
    proTip:
      'Ask upfront for copper pipe extra-meter rate, outdoor bracket cost, and stabilizer requirement so installation day has zero surprise bills.',
  },
  {
    id: 'ex_b04',
    number: 'Case 04',
    domain: 'Fashion & Placement Wardrobe',
    domainGroup: 'Lifestyle & Retail',
    productOrService: 'Interview Blazer, Formal Shirts & Trousers',
    buyerType: 'impulse',
    whenToBuy: 'January or July End-of-Season Sale (EOSS)',
    scenario:
      'A final-year student buys a ₹9,800 branded formal outfit 2 days before campus placement drive at full MRP.',
    commonTrap:
      'Last-minute panic buying at full MRP or buying trendy slim-fit fast fashion that wrinkles and loses shape after two washes.',
    solvedAction:
      'Buy classic navy/charcoal blazer + 2 wrinkle-resistant cotton shirts during July EOSS at 50% off, then spend ₹600 at a local master tailor for razor-sharp custom fitting.',
    savingsMath: '₹9,800 → ₹5,500 tailored total (₹4,300 saved + bespoke fit)',
    proTip:
      'A ₹4,500 blazer tailored for ₹600 looks more executive in an interview panel than a ₹12,000 ill-fitting off-the-rack suit.',
  },
  {
    id: 'ex_b05',
    number: 'Case 05',
    domain: 'Footwear & Sneakers',
    domainGroup: 'Lifestyle & Retail',
    productOrService: 'Daily Running & Formal Comfort Shoes',
    buyerType: 'impulse',
    whenToBuy: 'EOSS Clearance & Brand Factory Outlet Restocks',
    scenario:
      'Shopper sees a flashy "Limited Drop" sneaker promoted by influencers at ₹11,999 with a 15-minute countdown timer.',
    commonTrap:
      'Succumbing to artificial FOMO countdowns and paying hype markup without checking insole cushioning or seller authenticity.',
    solvedAction:
      'Apply 48-Hour Cooling Rule. Check authorized brand store / verified seller during EOSS for last-season colorway of the exact same foam midsole technology at 45% off + ₹500 app coupon.',
    savingsMath: '₹11,999 → ₹6,099 (₹5,900 saved for identical comfort tech)',
    proTip:
      'Shop for shoes in the late afternoon or evening when feet are naturally slightly expanded — it prevents tight-toe mistakes.',
  },
  {
    id: 'ex_b06',
    number: 'Case 06',
    domain: 'Groceries & Quick Commerce',
    domainGroup: 'Lifestyle & Retail',
    productOrService: 'Monthly Household Staples & Fresh Produce',
    buyerType: 'bargain_hunter',
    whenToBuy: '1st–7th Monthly Super-Saver Window + Morning Local Market',
    scenario:
      'Young professional orders small grocery items 18 times a month on 10-minute delivery apps, paying ₹35–₹60 per order in handling, rain surge, and small-cart fees.',
    commonTrap:
      'Ignoring hidden per-order fees (₹800+/month) and falling for "₹99 promo pack" 400g pouches that cost more per kg than standard 1kg packs.',
    solvedAction:
      'Consolidate non-perishable staples into 2 monthly scheduled bulk orders (zero small-cart fee + 10% super-saver bank cashback), audit price-per-kg on every label, and buy fresh fruits/veg locally.',
    savingsMath: '₹1,450/month saved = ₹17,400/year retained effortlessly',
    proTip:
      'Check manufacturing date & unit price (₹/100g) on every "Offer Pack" — shrinkflation hides silent 12%–18% price hikes.',
  },
  {
    id: 'ex_b07',
    number: 'Case 07',
    domain: 'Domestic & International Flights',
    domainGroup: 'Travel, Auto & Home',
    productOrService: 'Round-Trip Interview / Family Airfare',
    buyerType: 'urgent_service',
    whenToBuy: 'Domestic: 3–6 weeks ahead · International: 2–4 months ahead',
    scenario:
      'Candidate needs to fly Bengaluru–Delhi for a final interview next month; OTA shows ₹6,400 base fare that jumps to ₹7,380 with "convenience fee" + pre-checked travel insurance.',
    commonTrap:
      'Leaving pre-checked add-ons selected and booking blindly on an OTA without checking airline direct student/corporate fares.',
    solvedAction:
      'Compare Google Flights calendar across +/-2 days, pick a Wednesday departure, untick pre-checked insurance/seat add-ons, and check Airline Direct Student Fare (free extra baggage + lower cancellation fee) or stack zero-convenience-fee bank coupon.',
    savingsMath: '₹7,380 → ₹5,190 final payable (₹2,190 saved + 10kg extra student baggage)',
    proTip:
      'Always compare the FINAL checkout screen (after convenience fees), never the search-results teaser fare.',
  },
  {
    id: 'ex_b08',
    number: 'Case 08',
    domain: 'Hotels & Business Stays',
    domainGroup: 'Travel, Auto & Home',
    productOrService: '3-Night Metro Business Hotel Stay',
    buyerType: 'brand_loyalist',
    whenToBuy: '2–3 weeks prior with Free Cancellation locked early',
    scenario:
      'Booking portal lists a 4-star hotel at ₹5,800/night + 12% GST, non-refundable.',
    commonTrap:
      'Locking a non-refundable rate early or forgetting that hotels pay 15%–22% commission to OTAs and prefer direct bookings.',
    solvedAction:
      'Join the hotel’s free loyalty program, call the hotel reservation desk politely referencing the online quote, and ask for a direct-rate match with complimentary breakfast & late 2 PM checkout.',
    savingsMath: '₹19,488 → ₹16,500 direct + ₹2,400 free breakfast & flexible cancellation',
    proTip:
      'Book a "Free Cancellation" rate early, then re-check 7 days before arrival — if rates drop, cancel and rebook at the lower price.',
  },
  {
    id: 'ex_b09',
    number: 'Case 09',
    domain: 'Automobiles & EVs',
    domainGroup: 'Travel, Auto & Home',
    productOrService: 'Compact SUV / Electric Two-Wheeler Purchase',
    buyerType: 'analytical',
    whenToBuy: 'Quarter-End (Mar / Jun / Sep / Dec) or Dec Model-Year Clearance',
    scenario:
      'Showroom gives an "On-Road Quote" of ₹11.45 Lakh bundling ₹58,000 dealer insurance, ₹24,000 mandatory-sounding accessories, and ₹9,500 "handling/logistics charge".',
    commonTrap:
      'Accepting the dealer’s bundled on-road sheet without separating Ex-Showroom, RTO, Insurance, and optional Accessories.',
    solvedAction:
      'Request quotes from 3 dealers on the 25th of a quarter-end month. Politely refuse illegal "handling charges" (prohibited by Indian courts/RTO rules), present a ₹29,000 matching Zero-Dep insurance quote from an IRDAI insurer for dealer price-match, and pick only needed accessories.',
    savingsMath: '₹29,000 insurance + ₹9,500 handling + ₹18,000 accessories + ₹25,000 quarter-end = ₹81,500 saved',
    proTip:
      'Always perform a daylight Pre-Delivery Inspection (PDI) checking VIN manufacturing month, odometer (<50 km), paint, and electronics BEFORE approving RTO registration.',
  },
  {
    id: 'ex_b10',
    number: 'Case 10',
    domain: 'Real Estate & City Rentals',
    domainGroup: 'Travel, Auto & Home',
    productOrService: '1BHK/2BHK Rental Apartment for First Job',
    buyerType: 'urgent_service',
    whenToBuy: 'Off-Peak Months (Aug–Nov or Feb–Mar); avoid Jun–Jul fresh-grad rush',
    scenario:
      'Fresh graduate relocating for IT job is asked for 10 months’ security deposit, 1-month brokerage, 10% annual rent hike, and "1-month painting charge" deduction.',
    commonTrap:
      'Signing a generic landlord template verbally promising "we’ll settle deposit fairly later" without documenting existing apartment wear-and-tear.',
    solvedAction:
      'Shortlist owner-direct listings first, negotiate security deposit from 10 months down to 4–5 months by offering a verified corporate offer letter & 11-month lock-in, cap annual escalation at 5%–7%, and shoot a timestamped walkthrough video on Move-In Day attached to email.',
    savingsMath: '₹25,000 brokerage avoided + ₹1.1 Lakh capital unlocked from lower deposit',
    proTip:
      'When buying property, calculate price strictly on RERA Carpet Area (usable floor area), never on inflated "Super Built-Up Area".',
  },
  {
    id: 'ex_b11',
    number: 'Case 11',
    domain: 'Healthcare & Pharmacy',
    domainGroup: 'Finance, Health & Services',
    productOrService: 'Monthly Prescription Medicines & Blood Diagnostics',
    buyerType: 'urgent_service',
    whenToBuy: 'Scheduled Monthly Refill & Preventive Annual Health Package',
    scenario:
      'Family spends ₹4,800/month on branded chronic prescriptions and ₹3,600 on walk-in individual blood tests.',
    commonTrap:
      'Paying full retail MRP at hospital-adjacent pharmacies without comparing equivalent salt generics or NABL-accredited diagnostic bundles.',
    solvedAction:
      'Consult doctor to verify exact generic salt/dosage equivalents from Jan Aushadhi or reputable Indian pharma generics, and book a comprehensive NABL-accredited home-collection diagnostic package instead of individual walk-in tests.',
    savingsMath: '₹4,800 → ₹1,900/mo on meds + ₹1,800 saved on labs (~₹36,600/yr saved)',
    proTip:
      'Never compromise on lab accreditation — always check for NABL certification on diagnostic reports and expiry/batch numbers on every medicine strip.',
  },
  {
    id: 'ex_b12',
    number: 'Case 12',
    domain: 'Health & Term Insurance',
    domainGroup: 'Finance, Health & Services',
    productOrService: '₹10 Lakh Family Floater Health Insurance Policy',
    buyerType: 'analytical',
    whenToBuy: 'In your early 20s (lowest lifetime premium & zero pre-existing wait risk)',
    scenario:
      'Buyer compares two ₹10L health policies: Plan A is ₹1,800/year cheaper, but hides a "1% room-rent cap" and 20% co-pay clause.',
    commonTrap:
      'Choosing the cheapest annual premium without reading the Room-Rent Sub-limit — exceeding a 1% cap triggers proportionate deductions across the ENTIRE hospital bill!',
    solvedAction:
      'Choose Plan B with No Room-Rent Cap, Zero Co-Pay, Restoration Benefit, short PED waiting period, and >95% Claim Settlement Ratio (CSR) + cashless network near home; pay 2–3 year multi-year tenure for a 10%–12% upfront discount.',
    savingsMath: 'Protects against ₹2.5L–₹4L hidden proportionate claim cuts + 12% multi-year premium savings',
    proTip:
      'Always disclose every medical condition honestly on the proposal form — non-disclosure is the #1 reason claims get legally rejected.',
  },
  {
    id: 'ex_b13',
    number: 'Case 13',
    domain: 'EdTech, Courses & Certifications',
    domainGroup: 'Career, SaaS & B2B',
    productOrService: 'Cloud / Data Analytics Certification & Prep Track',
    buyerType: 'analytical',
    whenToBuy: 'Official Exam Voucher Promos, Student Discounts & Quarter-End',
    scenario:
      'Aggressive sales caller pressures a student to pay ₹1.2 Lakh via instant NBFC education loan "valid only until 6 PM tonight" for a generic bootcamp.',
    commonTrap:
      'Signing a high-interest loan under fake deadline urgency without verifying refund clauses, syllabus depth, or alumni placement outcomes.',
    solvedAction:
      'Decline same-day pressure politely. Audit syllabus against free official docs + structured portal practice, contact 3 verified alumni on LinkedIn, and apply official 50% academic/voucher discounts for recognized global certs (AWS, Azure, Google Cloud).',
    savingsMath: '₹1,20,000 loan trap avoided → ₹12,500 verified global certification + self-paced mastery',
    proTip:
      'Any legitimate educator respects a 48-hour decision window and shares written refund/placement terms upfront.',
  },
  {
    id: 'ex_b14',
    number: 'Case 14',
    domain: 'SaaS & Cloud Tools',
    domainGroup: 'Career, SaaS & B2B',
    productOrService: 'Developer IDE, Cloud Hosting & Design Suite',
    buyerType: 'b2b_procurement',
    whenToBuy: 'Black Friday (Nov), Annual Billing, or GitHub Student Developer Pack',
    scenario:
      'A 6-member student startup pays $20/seat/month across 4 SaaS tools ($480/month = $5,760/yr) on personal cards with zero consolidation.',
    commonTrap:
      'Paying monthly retail billing on inactive seats and missing free startup credits (AWS Activate, Google Cloud for Startups, GitHub Education).',
    solvedAction:
      'Verify academic/startup eligibility for free cloud credits, trim unused seats, switch active core tools to annual billing (25%–35% off), and email SaaS sales for an early-stage/educational tier.',
    savingsMath: '$5,760/yr → $1,680/yr ($4,080/yr saved — 71% burn reduction)',
    proTip:
      'SaaS account managers have end-of-quarter quota targets — emailing on the 24th–28th of Mar/Jun/Sep/Dec unlocks 20%–40% startup discounts routinely.',
  },
  {
    id: 'ex_b15',
    number: 'Case 15',
    domain: 'Banking, Credit Cards & No-Cost EMI',
    domainGroup: 'Finance, Health & Services',
    productOrService: '₹60,000 Electronics Checkout via "No-Cost EMI"',
    buyerType: 'bargain_hunter',
    whenToBuy: 'Full-swipe during instant bank discount window (pay 100% on statement due date)',
    scenario:
      'Checkout offers either ₹4,000 instant discount on full card payment OR "6-Month No-Cost EMI" with ₹299 processing fee.',
    commonTrap:
      'Believing "No-Cost EMI" costs ₹0 extra — forfeiting ₹4,000 instant cash discount, forfeiting reward points, AND paying ₹299 + 18% GST on bank interest (~₹520).',
    solvedAction:
      'Calculate exact effective outflow: Full payment = ₹56,000 (plus ₹1,120 card rewards = ₹54,880 net). "No-Cost EMI" = ₹60,000 + ₹299 + ₹520 GST = ₹60,819. Pay in full only if cash is already saved; never revolve credit card debt at 36%–42% APR.',
    savingsMath: '₹60,819 vs ₹54,880 = ₹5,939 hidden cost exposed & saved',
    proTip:
      'Never pay only "Minimum Amount Due" on a credit card — it triggers 3%+ monthly interest on the entire balance from day one.',
  },
  {
    id: 'ex_b16',
    number: 'Case 16',
    domain: 'Telecom & Home Broadband',
    domainGroup: 'Finance, Health & Services',
    productOrService: '300 Mbps Fiber Broadband + Mobile Postpaid/Prepaid Plan',
    buyerType: 'bargain_hunter',
    whenToBuy: 'Semi-Annual / Annual Prepaid Plans (save 1–2 months + free router)',
    scenario:
      'Household pays ₹1,199/mo + 18% GST for a 300 Mbps plan when 3 devices only use 75 Mbps peak, plus paying separately for 2 OTT apps already bundled in cheaper plans.',
    commonTrap:
      'Over-buying headline Mbps speeds you never saturate while ignoring FUP limits, upload speeds, and free installation on 6-month plans.',
    solvedAction:
      'Audit real peak bandwidth (100 Mbps easily runs four 4K streams simultaneously). Switch to a ₹799/mo 100 Mbps annual fiber plan (1 month free + free dual-band router + bundled OTT) and move unused postpaid lines to annual prepaid.',
    savingsMath: '₹6,400/year saved on broadband + ₹3,200/year on OTT/mobile = ₹9,600/yr',
    proTip:
      'Before cancelling an existing broadband provider, call their retention desk — they routinely offer 15%–25% loyalty discounts or speed upgrades to keep you.',
  },
  {
    id: 'ex_b17',
    number: 'Case 17',
    domain: 'Furniture & Work-From-Home Setup',
    domainGroup: 'Travel, Auto & Home',
    productOrService: 'Ergonomic Office Chair & Solid-Wood Study Desk',
    buyerType: 'brand_loyalist',
    whenToBuy: 'Oct Festive Sales or Local Furniture Hub Direct Workshops',
    scenario:
      'Online listing sells a glossy "Executive Desk" at ₹14,999 made of thin particle board that swells in monsoon humidity, plus ₹1,800 assembly charge.',
    commonTrap:
      'Confusing low-density particle board / MDF with Sheesham solid wood or BWP plywood, and skipping weight-capacity/lumbar-support specs on chairs.',
    solvedAction:
      'Check exact core material (Sheesham/Teak or 18mm plywood vs particle board) and BIFMA-certified hydraulic gas-lift + 3-year mechanism warranty on ergonomic chairs. Bundle desk + chair from one supplier for free doorstep delivery & assembly.',
    savingsMath: 'Saves ₹14,999 early replacement cost + ₹2,800 combo & free assembly win',
    proTip:
      'Test ergonomic chair seat depth, adjustable lumbar support, and breathable mesh — back health is a 5-year career productivity investment.',
  },
  {
    id: 'ex_b18',
    number: 'Case 18',
    domain: 'Jewellery & Gold Buying',
    domainGroup: 'Lifestyle & Retail',
    productOrService: '22K Hallmarked Gold Jewellery for Family Occasion',
    buyerType: 'brand_loyalist',
    whenToBuy: 'Non-Wedding Months (Mar, Jul, Aug) — Making-Charge Discounts',
    scenario:
      'Store quotes a flat ₹1,42,000 "lump-sum price" for a 15g 22K necklace without separating daily gold rate, stone weight, wastage, and making charges.',
    commonTrap:
      'Paying 22K gold price for studded semi-precious stones/beads (gross weight instead of net gold weight) and 22% unnegotiated making charges.',
    solvedAction:
      'Demand an itemized invoice: Net 22K gold weight × today’s IBJA/city rate + negotiated making charges (trimmed from 18% to 11% during lean month) + 3% GST, and verify the 6-digit BIS HUID Hallmark live inside the BIS Care App.',
    savingsMath: '₹9,800 saved on making charges + 100% purity & resale value verified',
    proTip:
      'For pure investment, Sovereign Gold Bonds / Gold ETFs beat jewellery because they have zero making/wastage loss.',
  },
  {
    id: 'ex_b19',
    number: 'Case 19',
    domain: 'Fitness & Gym Memberships',
    domainGroup: 'Lifestyle & Retail',
    productOrService: 'Annual Gym & Wellness Studio Membership',
    buyerType: 'impulse',
    whenToBuy: 'Late Month (25th–30th) or Summer/Monsoon (avoid Jan 1st rush!)',
    scenario:
      'New Year resolution shopper signs up on Jan 2nd at ₹24,000/year with zero trial and discovers the gym is overcrowded at 7 PM.',
    commonTrap:
      'Paying full annual fee in January peak rush without testing evening crowd density or asking for travel-freeze clauses.',
    solvedAction:
      'Take a 3-day trial pass at YOUR actual workout hour (e.g., 7 PM). Negotiate on the 28th of the month (sales quota closing) for ₹15,500 annual rate + waived ₹2,500 admission fee + 45-day travel freeze clause in writing.',
    savingsMath: '₹24,000 + ₹2,500 → ₹15,500 (₹11,000 saved + 45-day membership freeze)',
    proTip:
      'Always visit the gym during the exact hour you plan to work out before paying a single rupee.',
  },
  {
    id: 'ex_b20',
    number: 'Case 20',
    domain: 'Event, Wedding & Catering Services',
    domainGroup: 'Career, SaaS & B2B',
    productOrService: '250-Guest Family Function / Campus Fest Catering & Venue',
    buyerType: 'b2b_procurement',
    whenToBuy: '4–6 months ahead or Weekday / Off-Season Dates',
    scenario:
      'Venue quotes ₹1,100/plate verbally, then adds ₹45,000 generator backup, ₹35,000 DJ/sound royalty, ₹25,000 corkage, and 18% GST at final billing.',
    commonTrap:
      'Booking on per-plate teaser rate without an all-inclusive written annexure covering minimum guarantee, extra plates, power backup, and decor.',
    solvedAction:
      'Collect 3 itemized written proposals. Lock an all-inclusive per-plate rate with generator, basic lighting, valet, and 10% buffer plate tolerance included; tie payment to 30% booking / 40% pre-event / 30% post-delivery checklist.',
    savingsMath: '₹1,05,000 hidden venue surcharges eliminated via written SLA',
    proTip:
      'Never pay 100% upfront to event vendors — keeping 20%–30% for post-event sign-off ensures punctual, high-quality execution.',
  },
  {
    id: 'ex_b21',
    number: 'Case 21',
    domain: 'Home Repair & Appliance Servicing',
    domainGroup: 'Travel, Auto & Home',
    productOrService: 'Washing Machine Motor / RO Water Purifier Service',
    buyerType: 'urgent_service',
    whenToBuy: 'Scheduled Preventive Maintenance (before summer/monsoon peak)',
    scenario:
      'Unverified technician quotes ₹4,800 claiming "motherboard + gas refill required" within 2 minutes of opening an AC that only had a clogged filter and ₹350 capacitor fault.',
    commonTrap:
      'Approving major part replacement on the first verbal claim without inspecting the old part or getting a second opinion.',
    solvedAction:
      'Book via brand authorized service or verified platform with a published rate card. Ask the technician to show the faulty component test reading, demand a 90-day written repair warranty, and keep the replaced old part.',
    savingsMath: '₹4,800 fake quote → ₹950 genuine capacitor + jet service (₹3,850 saved)',
    proTip:
      'For RO purifiers, check TDS meter reading before & after filter change — genuine service always verifies output TDS (50–150 ppm).',
  },
  {
    id: 'ex_b22',
    number: 'Case 22',
    domain: 'B2B Corporate & Campus Bulk Procurement',
    domainGroup: 'Career, SaaS & B2B',
    productOrService: '300 Custom T-Shirts, Badges & Kits for Campus Summit',
    buyerType: 'b2b_procurement',
    whenToBuy: '4–5 weeks before event (eliminates 30% rush printing surcharges)',
    scenario:
      'Student council orders 300 event hoodies from the first vendor found on Instagram 5 days before fest at ₹750/piece; prints peel and 40 arrive late.',
    commonTrap:
      'Skipping physical fabric GSM sample approval, ordering last minute, and failing to include a late-delivery penalty clause.',
    solvedAction:
      'Issue a crisp 1-page RFQ (280 GSM cotton fleece, screen-print spec, exact size breakdown) to 4 verified wholesale manufacturers 4 weeks early. Approve 1 physical pre-production sample, negotiate volume slab down to ₹490/pc + GST invoice, and hold 40% payment until full count & quality check.',
    savingsMath: '₹2,25,000 → ₹1,47,000 (₹78,000 saved + zero defective pieces)',
    proTip:
      'In every B2B bulk order, the "Golden Sample" rule applies: sign and keep one approved physical sample to compare against final bulk delivery.',
  },
  {
    id: 'ex_b23',
    number: 'Case 23',
    domain: 'Refurbished & Pre-Owned Tech',
    domainGroup: 'Tech & Appliances',
    productOrService: 'Certified Refurbished Business Laptop (ThinkPad / MacBook)',
    buyerType: 'bargain_hunter',
    whenToBuy: 'Corporate Lease Refresh Cycles (Apr & Oct)',
    scenario:
      'Learner on a ₹28,000 budget is torn between a sluggish brand-new plastic Celeron laptop vs a certified refurbished enterprise Core i5/16GB/SSD laptop.',
    commonTrap:
      'Buying from an anonymous classifieds seller without testing battery cycle count, BIOS lock (MDM), dead pixels, or keyboard keys.',
    solvedAction:
      'Buy from a certified refurbisher offering a 6–12 month warranty + 7-day refund window. Run a 5-point hardware audit: battery health (>80%), BIOS/MDM unlocked, SSD SMART health, all USB/HDMI ports, and genuine charger.',
    savingsMath: 'Gets ₹85,000 enterprise durability for ₹26,500 (3× faster than new budget laptop)',
    proTip:
      'Always check for Corporate MDM / Computrace lock in BIOS before paying for any pre-owned business laptop.',
  },
  {
    id: 'ex_b24',
    number: 'Case 24',
    domain: 'Dining, Cafes & Food Delivery',
    domainGroup: 'Lifestyle & Retail',
    productOrService: 'Weekend Group Dinner & Office Lunch Orders',
    buyerType: 'impulse',
    whenToBuy: 'Pre-Booked Table Deals (EazyDiner/District/Zomato Gold) & Direct Takeaway',
    scenario:
      'Ordering ₹1,200 restaurant menu items on a food delivery app costs ₹1,680 after 25% menu inflation, ₹80 packaging, ₹65 delivery, platform fee, and GST.',
    commonTrap:
      'Assuming a "₹120 OFF coupon" makes delivery cheap when menu prices on the app are already marked up 20%–30% above dine-in rates.',
    solvedAction:
      'For nearby spots, order direct takeaway (zero markup + zero delivery fee). For group dining out, pre-book a verified table discount (15%–25% off) + stack a dining credit card cashback (10%), and audit the bill for optional "Service Charge" (voluntary per CCPA guidelines).',
    savingsMath: '₹1,680 → ₹1,080 net (₹600 saved per outing = ~₹28,000/year)',
    proTip:
      'In India, restaurant "Service Charge" is strictly voluntary by CCPA guidelines — you can courteously request its removal if service wasn’t extraordinary.',
  },
  {
    id: 'ex_b25',
    number: 'Case 25',
    domain: 'Freelance, Coaching & Agency Services',
    domainGroup: 'Career, SaaS & B2B',
    productOrService: 'Portfolio Website / Resume Branding / Video Editing Service',
    buyerType: 'b2b_procurement',
    whenToBuy: 'Off-Peak Project Windows with Milestone Scope Lock',
    scenario:
      'Startup founder hires an agency verbally for "a complete website" at ₹45,000; 3 weeks later, agency demands ₹25,000 extra for mobile responsiveness, SEO tags, and source files.',
    commonTrap:
      'Ambiguous scope ("complete website") without listing exact deliverables, revision rounds, timeline, and IP/source-code ownership.',
    solvedAction:
      'Draft a crisp 1-page Statement of Work (SOW): exact page count, mobile responsiveness, 2 included revision cycles, full source-code & domain ownership transfer, and 30/40/30 milestone payments tied to live preview sign-off.',
    savingsMath: '₹25,000 scope-creep dispute prevented + 100% IP ownership secured',
    proTip:
      'Clarity in a 1-page SOW protects BOTH buyer and service provider — great negotiation builds fair partnerships, never traps.',
  },
];

// 30 Brand-New Graded MCQs (indices 20..49) -> Total Shopping Skills Quiz = 50 MCQs!
export const EXTENDED_SHOPPING_MCQS: ExtendedShoppingMcq[] = [
  // ================= BUYER TYPES & CUSTOMER PSYCHOLOGY (10 MCQs: sn_q21 - sn_q30) =================
  {
    id: 'sn_q21',
    category: 'buyer_types',
    sourceRef: 'Buyer Types · Analytical Researcher',
    question:
      'A customer arrives at an electronics store with a spreadsheet comparing processor benchmarks, 5-year power usage, and warranty SLAs. Which buyer archetype is this, and what persuades them most effectively?',
    options: [
      'Impulse Trendsetter — persuade with a 10-minute flash countdown',
      'Analytical Researcher — persuade with verifiable specs, TCO math, and written warranty proof',
      'Urgent Service Seeker — skip all specs and rush them to billing',
      'Bargain Hunter — inflate MRP first and offer a fake 60% off sticker',
    ],
    correctIndex: 1,
    hint: 'Match the buyer who brings data and benchmarks with evidence-based communication rather than urgency tricks.',
    explanation:
      'Analytical Researchers trust verifiable data, Total Cost of Ownership (TCO) calculations, and transparent written warranty terms over emotional hype.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q22',
    category: 'buyer_types',
    sourceRef: 'Buyer Types · Impulse Control',
    question:
      'Which practical habit best protects an Impulse / Trendsetter Buyer from buyer’s remorse during flashy social-media sales?',
    options: [
      'Enabling 1-click Buy-Now-Pay-Later (BNPL) on all shopping apps',
      'Applying the 48-Hour Cooling-Off Rule and computing Cost-Per-Use before checkout',
      'Buying immediately whenever a red countdown timer appears',
      'Purchasing two extra units to unlock free shipping',
    ],
    correctIndex: 1,
    hint: 'Impulse buying relies on emotional speed — introducing deliberate delay breaks the dopamine trigger.',
    explanation:
      'Waiting 48 hours and evaluating Cost-Per-Use (Price ÷ Expected Uses) eliminates 70%+ of regretted impulse purchases.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q23',
    category: 'buyer_types',
    sourceRef: 'Buyer Types · Bargain Hunter Blind Spot',
    question:
      'What is the #1 hidden trap that even experienced Bargain & Deal Hunters frequently fall into?',
    options: [
      'Comparing prices across two competing stores',
      'Buying unnecessary items or oversized packs purely because the "60% OFF" percentage badge feels irresistible',
      'Checking 6-month historical price trackers',
      'Using bank cashback on planned essentials',
    ],
    correctIndex: 1,
    hint: 'Remember Mentor Kapil’s Rule 2: saving 50% on something you never needed is still a net loss.',
    explanation:
      'Chasing discount percentages instead of net utility causes overspending — true deal mastery measures total cash saved on planned needs.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q24',
    category: 'buyer_types',
    sourceRef: 'Buyer Types · Brand Loyalist VIP',
    question:
      'A Brand Loyalist loves a trusted appliance brand’s service network but doesn’t want to overpay a "brand tax." What is their smartest buying move?',
    options: [
      'Switch blindly to an unverified brand with zero local service centers',
      'Stay with the trusted brand, buy during authorized festive/corporate discount windows, and negotiate complimentary care/installation add-ons',
      'Pay full launch MRP without asking for loyalty or card benefits',
      'Buy from an unauthorized grey-market seller with no brand warranty',
    ],
    correctIndex: 1,
    hint: 'You don’t have to sacrifice brand reliability to buy smart — combine authorized channels with timing and value add-ons.',
    explanation:
      'Brand Loyalists maximize value by buying genuine authorized stock during promo windows and leveraging VIP loyalty perks or complimentary care plans.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q25',
    category: 'buyer_types',
    sourceRef: 'Buyer Types · B2B Procurement',
    question:
      'In B2B & Campus Bulk Procurement (e.g., 300 event hoodies or office laptops), what is the "Golden Sample" & 3-Quote RFQ discipline?',
    options: [
      'Paying 100% advance to the cheapest Instagram vendor without seeing fabric quality',
      'Collecting 3 written quotes, approving & signing one physical sample before mass production, and tying final payment to delivery SLA & GST invoice',
      'Changing product specs verbally after delivery arrives',
      'Ignoring GST invoices to avoid paperwork',
    ],
    correctIndex: 1,
    hint: 'Professional procurement locks quality benchmarks physically and financially before mass production.',
    explanation:
      '3-quote competitive bidding + a signed physical Golden Sample + milestone SLA payment eliminates quality drops and delivery delays.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q26',
    category: 'buyer_types',
    sourceRef: 'Buyer Types · Urgent Service Seeker',
    question:
      'Your AC stops cooling on a 44°C afternoon and you are an Urgent / Need-Based Buyer. What 3-minute step protects you from paying 3× inflated emergency charges?',
    options: [
      'Let an unverified caller replace parts first and ask the price afterward',
      'Request an upfront, itemized written rate card (inspection + parts + labor + warranty) from a verified provider before authorizing work',
      'Refuse all repairs and immediately buy a brand-new AC',
      'Pay full cash upfront without any service warranty slip',
    ],
    correctIndex: 1,
    hint: 'Urgency does not require abandoning basic price transparency.',
    explanation:
      'Confirming an itemized rate card and 30–90 day repair warranty before work starts prevents sudden surprise billing.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q27',
    category: 'buyer_types',
    sourceRef: 'Retail Behavior · Showrooming vs Webrooming',
    question:
      'What is the difference between "Showrooming" and "Webrooming" in modern omnichannel shopping?',
    options: [
      'Showrooming = inspecting a product physically in-store then buying cheaper online; Webrooming = researching specs/reviews online then buying in-store for instant pickup or local price-match',
      'Showrooming is only for luxury cars; Webrooming is only for groceries',
      'Both mean refusing to compare prices',
      'Showrooming means returning used items; Webrooming means buying refurbished tech',
    ],
    correctIndex: 0,
    hint: 'Look at where the browsing happens first: Showroom first vs Web first.',
    explanation:
      'Smart buyers use both ethically — Webrooming saves time with researched specs, while asking local stores to match verified online prices often earns instant pickup + local support.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q28',
    category: 'buyer_types',
    sourceRef: 'Buyer Psychology · Decoy Effect',
    question:
      'A coffee shop lists Small (₹180), Medium (₹280), and Large (₹299). Why is the ₹280 Medium size placed there?',
    options: [
      'Because Medium cups cost more to manufacture than Large cups',
      'It is a behavioral "Decoy" designed to make Large (₹299) look like an irresistible bargain so you upgrade from Small (₹180)',
      'Because the store ran out of Medium lids',
      'To reward Bargain Hunters with free coffee',
    ],
    correctIndex: 1,
    hint: 'Notice the tiny ₹19 gap between Medium and Large versus the huge ₹100 gap between Small and Medium.',
    explanation:
      'Decoy Pricing manipulates relative perception so shoppers upgrade spending. Decide your actual needed portion BEFORE checking tier prices.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q29',
    category: 'buyer_types',
    sourceRef: 'Buyer Types · Analysis Paralysis',
    question:
      'An Analytical Buyer has spent 4 weeks reading 120 reviews for a ₹3,000 study desk lamp, missing a genuine 30% festive discount and straining their eyes nightly. What fix solves this blind spot?',
    options: [
      'Read 100 more reviews until perfection is proven',
      'Set a "Good-Enough Threshold": shortlist top 3 verified options, lock a 48-hour decision deadline, and factor time-cost into value',
      'Buy the most expensive designer lamp immediately',
      'Never read any product reviews ever again',
    ],
    correctIndex: 1,
    hint: 'Time and productivity also have real rupee value — cap research proportional to item price.',
    explanation:
      'Smart analytical buyers scale research effort to item cost: spend hours on a ₹10 Lakh car, not 4 weeks on a ₹3,000 accessory.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q30',
    category: 'buyer_types',
    sourceRef: 'Consultative Selling & Communication',
    question:
      'In a placement sales or client-advisory interview, how should you adapt your pitch when facing a B2B Procurement Lead versus a Lifestyle Trendsetter?',
    options: [
      'Deliver the exact same memorized script to every customer',
      'Lead with ROI, volume SLAs, GST/credit terms for the B2B Lead; lead with aesthetics, curation, social proof & easy exchange reassurance for the Trendsetter',
      'Offer emotional compliments to the B2B Lead and tax spreadsheets to the Trendsetter',
      'Focus solely on slashing your price by 40% for both',
    ],
    correctIndex: 1,
    hint: 'Great communicators align evidence to the specific buyer’s decision trigger.',
    explanation:
      'Recognizing buyer psychology is a top employability superpower across sales, consulting, product management, and stakeholder negotiation.',
    xpClean: 40,
    xpWithHint: 25,
  },

  // ================= REAL PRODUCTS, SERVICES & EVERY DOMAIN (10 MCQs: sn_q31 - sn_q40) =================
  {
    id: 'sn_q31',
    category: 'domains',
    sourceRef: 'Domain · Appliances & TCO',
    question:
      'A 1.5-Ton 3-Star AC costs ₹33,000 while a 5-Star Inverter AC costs ₹39,000 and saves ₹3,000/year in electricity. Over 6 years of heavy use, which has the lower Total Cost of Ownership (TCO)?',
    options: [
      'The 3-Star AC because its Day-1 sticker price is ₹6,000 lower',
      'The 5-Star AC — it recovers the ₹6,000 upfront difference in 2 years and saves ₹12,000 net over the next 4 years',
      'Both cost the exact same over 6 years',
      'Neither — star ratings do not affect electricity bills',
    ],
    correctIndex: 1,
    hint: 'Compare upfront gap (₹6,000) against 6-year electricity savings (6 × ₹3,000 = ₹18,000).',
    explanation:
      'Payback period is ₹6,000 ÷ ₹3,000 = 2 years; over 6 years the 5-Star AC delivers ₹12,000 pure net savings plus higher resale value.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q32',
    category: 'domains',
    sourceRef: 'Domain · Groceries & Shrinkflation',
    question:
      'Brand A sells a "Special Offer Pack" of 400g oats for ₹96, while the regular 1kg pack is ₹210. Which pack actually gives the better deal per kilogram?',
    options: [
      'The 400g Offer Pack because ₹96 is a smaller number',
      'The regular 1kg pack (₹210/kg vs ₹240/kg effective rate on the 400g pack — 12.5% cheaper!)',
      'Both have the exact same unit rate',
      'The 400g pack because it says "Special Offer"',
    ],
    correctIndex: 1,
    hint: 'Compute price per 1kg: (₹96 ÷ 400) × 1000 = ₹240/kg vs ₹210/kg.',
    explanation:
      'Always compare Unit Price (₹/kg or ₹/100ml). Promo pouches frequently disguise shrinkflation at a higher effective per-kg rate.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q33',
    category: 'domains',
    sourceRef: 'Domain · Automobiles & On-Road Quotes',
    question:
      'When negotiating a new car or EV on-road quote at a dealership, which two line items offer the fastest legitimate savings?',
    options: [
      'Refusing mandatory Road Tax (RTO) and GST',
      'Unbundling inflated dealer insurance (matching an IRDAI quote) and removing illegal "handling charges" & unwanted dealer accessory kits',
      'Skipping the Pre-Delivery Inspection (PDI) for a faster handover',
      'Paying extra cash under the table',
    ],
    correctIndex: 1,
    hint: 'RTO and GST are statutory government levies, whereas insurance, accessories, and handling charges are dealer-controlled.',
    explanation:
      'Dealers routinely mark up year-1 insurance by 40%–60% and bundle optional accessories — politely unbundling these saves ₹35,000–₹80,000+ cleanly.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q34',
    category: 'domains',
    sourceRef: 'Domain · Health Insurance Clauses',
    question:
      'Why can choosing a slightly cheaper health insurance policy with a "1% Room-Rent Cap" turn financially devastating during hospitalization?',
    options: [
      'It only affects hospital canteen food bills',
      'If you pick a room above the 1% limit, the insurer applies proportionate deductions across the ENTIRE bill (doctor fees, surgery, diagnostics) — not just the room difference',
      'It prevents you from ever renewing the policy',
      'It doubles your annual tax',
    ],
    correctIndex: 1,
    hint: 'Hospital procedures are often linked to room category — exceeding the cap triggers "proportionate deduction" across all linked charges.',
    explanation:
      'Always prefer "No Room-Rent Cap" policies; saving ₹1,500 on premium can otherwise cost ₹2–₹4 Lakh out-of-pocket during a major claim.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q35',
    category: 'domains',
    sourceRef: 'Domain · Real Estate & Rentals',
    question:
      'When evaluating a new residential apartment, which area metric represents the ACTUAL usable interior floor space legally protected under RERA?',
    options: [
      'Super Built-Up Area (includes lobby, stairs & loading factor)',
      'RERA Carpet Area (actual usable floor area inside apartment walls)',
      'Marketing Brochure Area',
      'Parking-Inclusive Gross Area',
    ],
    correctIndex: 1,
    hint: 'Think of where you can physically lay a wall-to-wall carpet inside the home.',
    explanation:
      'Under RERA, developers must quote and sell strictly on Carpet Area — comparing price per sq.ft. on Carpet Area exposes 25%–35% "loading" illusions.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q36',
    category: 'domains',
    sourceRef: 'Domain · Gold & Jewellery Buying',
    question:
      'Before paying for 22K gold jewellery in India, what 3-step verification protects you from purity loss and overcharging?',
    options: [
      'Trust the verbal assurance and accept a lump-sum estimate without a bill',
      'Verify the 6-digit BIS HUID Hallmark in the BIS Care App, confirm NET gold weight (excluding stones/beads), and negotiate making charges separately on an itemized GST bill',
      'Pay 22K gold rate on the total gross weight including plastic beads',
      'Skip GST invoice to save 3% tax',
    ],
    correctIndex: 1,
    hint: 'Purity (HUID), Net Weight, and itemized Making Charges + GST invoice are the 3 pillars of safe gold buying.',
    explanation:
      'BIS HUID verifies exact karat purity, net-weight billing stops you from paying gold rates for stones, and itemized bills preserve 100% exchange value.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q37',
    category: 'domains',
    sourceRef: 'Domain · Healthcare & Pharmacy',
    question:
      'How can a household legitimately reduce recurring chronic prescription expenses by 40%–70% without compromising clinical safety?',
    options: [
      'Skipping alternate doses of prescribed medicine',
      'Asking the prescribing doctor about bioequivalent quality generic medicines matching the exact active chemical salt & dosage (e.g., Jan Aushadhi / reputable Indian generics)',
      'Buying expired discounted strips',
      'Self-prescribing unverified remedies online',
    ],
    correctIndex: 1,
    hint: 'Active pharmaceutical composition (salt + mg) determines efficacy, not brand marketing spend.',
    explanation:
      'Doctor-approved quality generics contain the identical active pharmaceutical ingredient at a fraction of branded marketing costs.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q38',
    category: 'domains',
    sourceRef: 'Domain · Refurbished & Pre-Owned Tech',
    question:
      'Before purchasing a certified refurbished business laptop for coding, which critical hardware/security check must you NEVER skip?',
    options: [
      'Checking whether the sticker logo looks shiny',
      'Verifying BIOS/MDM is unlocked (no corporate lock), battery health >80%, SSD health, all ports, and a written 6–12 month seller warranty',
      'Paying full cash in a parking lot with no invoice',
      'Ignoring battery wear since chargers always work',
    ],
    correctIndex: 1,
    hint: 'A corporate MDM-locked laptop can remotely lock itself the moment it connects to Wi-Fi!',
    explanation:
      'Checking BIOS/MDM lock, battery cycles, SSD health, and warranty turns refurbished enterprise laptops into unbeatable value machines.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q39',
    category: 'domains',
    sourceRef: 'Domain · SaaS, EdTech & Freelance Services',
    question:
      'You hire a freelance developer or agency for a ₹35,000 portfolio/startup website. What single document prevents "scope creep" surprise fees and secures your source-code ownership?',
    options: [
      'A casual WhatsApp voice note saying "make it look cool"',
      'A crisp 1-page Statement of Work (SOW) specifying exact deliverables, revision limits, milestone payments, and full IP/source-code handover',
      'Paying 100% upfront on Day 1 to build goodwill',
      'Leaving deadlines open-ended',
    ],
    correctIndex: 1,
    hint: 'Clear written scope + milestone payment protects both buyer and creator.',
    explanation:
      'A 1-page SOW eliminates ambiguity over mobile responsiveness, revision counts, deadlines, and IP ownership.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q40',
    category: 'domains',
    sourceRef: 'Domain · Dining & Consumer Rights',
    question:
      'Your group dinner bill at a restaurant automatically includes a 10% "Service Charge" on top of GST, even though service was slow. Under Indian CCPA consumer guidelines, what is your right?',
    options: [
      'Service Charge is a mandatory government tax like GST and cannot be questioned',
      'Service Charge is strictly voluntary — you can politely ask the manager to remove it from the bill',
      'You must pay double GST if you ask to remove it',
      'Only VIP members can refuse Service Charge',
    ],
    correctIndex: 1,
    hint: 'Do not confuse statutory GST (tax paid to government) with optional restaurant Service Charge (tip).',
    explanation:
      'GST is a legal tax, whereas Service Charge is an optional gratuity that consumers have every right to politely decline if unsatisfied.',
    xpClean: 40,
    xpWithHint: 25,
  },

  // ================= WHEN TO BUY, BEST DEALS & TIPS/TRICKS (10 MCQs: sn_q41 - sn_q50) =================
  {
    id: 'sn_q41',
    category: 'deals_timing',
    sourceRef: 'When to Buy · Seasonal Calendar',
    question:
      'Which pairing correctly matches the BEST off-season buying window to maximize effortless savings?',
    options: [
      'Buy ACs in May heatwave and winter jackets in December',
      'Buy ACs in Oct–Feb (off-season), winter apparel in January EOSS, and laptops during Jul–Aug Back-to-School or Oct Festive Mega Sales',
      'Buy flights 12 hours before takeoff for lowest fares',
      'Buy gym memberships on January 2nd during peak demand',
    ],
    correctIndex: 1,
    hint: 'Retailers slash margins when inventory demand is lowest and hike prices during peak seasonal urgency.',
    explanation:
      'Counter-seasonal timing routinely unlocks 20%–50% savings with zero stressful bargaining.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q42',
    category: 'deals_timing',
    sourceRef: 'Best Deals · Price History Verification',
    question:
      'A wireless headset shows "MEGA SALE: 65% OFF — Now ₹2,499 (MRP ₹7,199)". What is the smartest 10-second verification step before clicking Buy?',
    options: [
      'Trust the 65% badge immediately before stock runs out',
      'Check a 90-day / 1-year price history tracker (Keepa / PriceHistory) to verify if ₹2,499 is genuinely below its normal everyday selling price',
      'Sort reviews by newest only',
      'Add two units to maximize the 65% discount',
    ],
    correctIndex: 1,
    hint: 'Crossed-out MRPs are frequently inflated — historical selling price reveals the real truth.',
    explanation:
      'If an item sold at ₹2,299 all year and is "65% OFF at ₹2,499" during a sale, the price tracker exposes the illusion immediately.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q43',
    category: 'deals_timing',
    sourceRef: 'Best Deals · Deal-Stacking Order',
    question:
      'Which sequence represents the highest-savings "Deal-Stacking" workflow for a ₹50,000 electronics purchase?',
    options: [
      'Pay full MRP on Debit Card during launch week',
      'Verify Price History → Wait for Seasonal Sale Price → Apply Store/Student Coupon → Stack Instant Bank Card Discount + Exchange Bonus → Verify Open-Box Delivery',
      'Use only Cash-on-Delivery and ignore all coupons',
      'Split into 24-month high-interest EMI immediately',
    ],
    correctIndex: 1,
    hint: 'Smart buyers layer independent discount buckets (base sale + coupon + bank + exchange) legally in sequence.',
    explanation:
      'Stacking 3–4 independent discount layers commonly cuts effective net cost by 22%–38% on planned big-ticket purchases.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q44',
    category: 'deals_timing',
    sourceRef: 'Tips & Tricks · No-Cost EMI Hidden Math',
    question:
      'Why is "No-Cost EMI" on credit cards rarely truly zero extra cost in India?',
    options: [
      'Because banks double the product MRP',
      'Because banks charge a processing fee (₹199–₹299 + GST) AND 18% GST on the monthly interest portion, while you often forfeit upfront cash discounts & reward points',
      'Because RBI bans EMI on electronics',
      'Because delivery becomes slower on EMI',
    ],
    correctIndex: 1,
    hint: 'Even when the merchant discounts the interest upfront, the bank still bills GST on the interest component every month.',
    explanation:
      'Always compare net total EMI outflow (including processing fee + 18% GST on interest + lost cash discount) against full payment.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q45',
    category: 'deals_timing',
    sourceRef: 'Anti-Scam · Dark Patterns',
    question:
      'A flight booking site advertises ₹3,899 on search, then quietly pre-ticks ₹499 travel insurance, ₹399 priority check-in, and adds a ₹650 convenience fee on the final pay button. Which dark patterns are combined here?',
    options: [
      'Open-Box Delivery & GST Input Credit',
      'Drip Pricing + Basket Sneaking (pre-checked unwanted add-ons)',
      'Price-Match Guarantee + Loyalty Stacking',
      'Unit-Price Transparency',
    ],
    correctIndex: 1,
    hint: 'Slowly dripping mandatory fees at the final step + sneaking pre-checked items into your basket.',
    explanation:
      'Spotting Drip Pricing and Basket Sneaking saves thousands of rupees every year across flights, movie tickets, and food/delivery apps.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q46',
    category: 'deals_timing',
    sourceRef: 'Delivery Safety · Open-Box Protocol',
    question:
      'You ordered a ₹58,000 smartphone online with "Open-Box Delivery." When should you share the delivery OTP with the courier?',
    options: [
      'Over the phone before the delivery executive even arrives',
      'ONLY after opening the sealed box in front of the executive, inspecting the physical device/accessories, verifying the serial/IMEI, and recording an unboxing video',
      'Before opening the outer brown cardboard parcel',
      'Never share OTP even after verifying everything works perfectly',
    ],
    correctIndex: 1,
    hint: 'Once you hand over the Open-Box OTP, the platform treats the physical item as verified and accepted.',
    explanation:
      'Sharing OTP prematurely forfeits physical damage/wrong-item protection. Inspect thoroughly first, then share the OTP.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q47',
    category: 'deals_timing',
    sourceRef: 'Tips & Tricks · Return vs Replacement Trap',
    question:
      'Before buying electronics online, why must you inspect whether the listing says "7-Day Refundable Return" versus "7-Day Service Center Replacement"?',
    options: [
      'Both phrases mean you get instant cash back at your doorstep',
      '"Service Center Replacement" means you cannot return the item to the marketplace for a refund — you must visit the brand service center for inspection/repair',
      '"Service Center Replacement" gives you 2 free accessories',
      'Return policies do not apply to phones or laptops',
    ],
    correctIndex: 1,
    hint: 'Read the exact words under the Buy button — marketplace refund vs brand service-center visit are vastly different experiences.',
    explanation:
      'Knowing the exact post-purchase recourse prevents getting stuck in multi-week service center queues on a DOA (dead-on-arrival) device.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q48',
    category: 'deals_timing',
    sourceRef: 'Smart Finance · Credit Card Rule',
    question:
      'What is the single golden rule that turns a cashback credit card into a wealth-building shopping tool instead of a debt trap?',
    options: [
      'Pay only the Minimum Amount Due each month to keep cash in savings',
      'Spend strictly within existing cash budget and set Auto-Pay for 100% of the Total Statement Due every single billing cycle (zero 36%–42% APR interest)',
      'Max out 100% of the credit limit every month',
      'Withdraw ATM cash using the credit card during sales',
    ],
    correctIndex: 1,
    hint: 'A 5% cashback reward is completely wiped out if you pay 36%–42% annual interest even once.',
    explanation:
      'Paying 100% of the Total Due on time captures 5%–10% rewards + strong CIBIL score at literally zero interest cost.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q49',
    category: 'deals_timing',
    sourceRef: 'Travel Timing · Booking Strategy',
    question:
      'You know 8 weeks in advance that you must travel for a family wedding or corporate summit. Which flight-and-hotel booking strategy wins both lowest cost and zero regret?',
    options: [
      'Wait until 3 days before departure hoping for a last-minute drop',
      'Book domestic flight 3–6 weeks ahead (mid-week check) AND lock a Free-Cancellation hotel rate early, then re-check 7 days prior to rebook if rates dip',
      'Book non-refundable flights & hotels on the peak Friday night before travel',
      'Book strictly through an unverified social-media travel page',
    ],
    correctIndex: 1,
    hint: 'Flights usually rise sharply inside the final 14 days, while Free-Cancellation hotels give you a risk-free price-drop option.',
    explanation:
      'Early flight booking + refundable hotel price-watching captures the optimal fare window while keeping flexibility intact.',
    xpClean: 40,
    xpWithHint: 25,
  },
  {
    id: 'sn_q50',
    category: 'deals_timing',
    sourceRef: 'Mentor Kapil’s Master Synthesis · Smart Buyer Edge',
    question:
      'Why do top recruiters and mentors view Smart Shopping & Commercial Negotiation Mastery as a high-value employability skill?',
    options: [
      'Because companies only hire people who shop every weekend',
      'Because mastering buyer psychology, TCO math, timing, dark-pattern detection, and courteous written negotiation translates directly into sharper procurement, product, client sales, and salary negotiation decisions',
      'Because it helps you memorize retail mall addresses',
      'Because aggressive haggling wins corporate promotions',
    ],
    correctIndex: 1,
    hint: 'Connect everyday commercial decision-making (TCO, buyer personas, written SLAs, courteous anchoring) to workplace leadership.',
    explanation:
      'Every company is simultaneously a buyer (vendors, SaaS, talent) and a seller (customers, enterprise clients) — commercial intelligence sets top professionals apart from Day One.',
    xpClean: 40,
    xpWithHint: 25,
  },
];

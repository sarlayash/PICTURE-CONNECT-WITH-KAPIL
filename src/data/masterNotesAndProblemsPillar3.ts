import {
  SolvedCompanyProblem,
  TrackLiveNotes,
} from './masterUniverseTypes';

export const PILLAR3_LIVE_NOTES: Partial<Record<string, TrackLiveNotes>> = {
  excel: {
    trackId: 'excel',
    headline: 'Microsoft Excel — Analyst Formulas, Lookups & Pivot Notes',
    quickSummary:
      'Business Analyst, Operations, and Finance rounds at Amazon, Deloitte, Accenture, TCS, Wipro, and Capgemini test `XLOOKUP`, `INDEX-MATCH`, `SUMIFS`, Pivot Tables, and dynamic cleaning formulas.',
    coreBullets: [
      {
        title: 'XLOOKUP Beats VLOOKUP',
        point: '`=XLOOKUP(lookup, lookup_arr, return_arr, "Not Found")` searches left OR right, defaults to EXACT match, and doesn’t break when columns are inserted.',
      },
      {
        title: 'INDEX + MATCH Classic Power',
        point: '`=INDEX(ReturnCol, MATCH(Key, LookupCol, 0))` works in all Excel versions, handles left-lookups, and supports 2D row+column matrix lookups.',
      },
      {
        title: 'Conditional Aggregations',
        point: '`SUMIFS(sum_range, crit_range1, crit1, ...)`, `COUNTIFS`, and `AVERAGEIFS` compute multi-condition KPIs cleanly without helper columns.',
      },
      {
        title: 'Cell Reference Locking (`F4`)',
        point: '`$A$1` locks row & column; `$A1` locks column only; `A$1` locks row only—essential for dragging formulas across financial models.',
      },
      {
        title: 'Pivot Tables & Power Query',
        point: 'Use Power Query (Get & Transform) for repeatable ETL cleaning (unpivot, trim, merge), then Pivot Tables + Slicers for interactive executive summaries.',
      },
    ],
    goldenShortcuts: [
      'Always wrap fragile division or lookups in `IFERROR(formula, 0)` so `#DIV/0!` or `#N/A` never pollutes dashboards.',
      'Convert raw ranges into Excel Tables (`Ctrl + T`) so formulas and Pivot Tables auto-expand when new rows arrive.',
      'Dynamic Arrays (Excel 365): `FILTER()`, `UNIQUE()`, and `SORT()` build live self-updating views in 1 formula.',
    ],
    commonTraps: [
      'Leaving `VLOOKUP` 4th argument blank — it defaults to `TRUE` (approximate match) and returns silently wrong numbers!',
      'Using `COUNT()` on text columns (counts numbers ONLY — use `COUNTA()` for non-empty cells!).',
      'Trailing hidden spaces breaking exact lookups — clean with `TRIM(CLEAN(A2))`.',
    ],
    mentorKapilTips: [
      'In Deloitte, Amazon BA, and Capgemini Excel case studies, NEVER hardcode numbers inside formulas—always reference input assumption cells cleanly.',
      'Knowing `INDEX-MATCH` + `XLOOKUP` + `SUMIFS` + `Pivot Calculated Fields` covers 95% of corporate Excel tests.',
      'Press `Alt + =` (AutoSum), `Ctrl + Shift + L` (Filter), and `F4` (Lock `$`) during live screens—speed impresses analysts immediately.',
    ],
  },
  power_bi: {
    trackId: 'power_bi',
    headline: 'Microsoft Power BI — Star Schema, DAX & Context Cheat Sheet',
    quickSummary:
      'Power BI interviews at Microsoft, Deloitte, TCS, Cognizant, Capgemini, and Accenture revolve around Star Schema modeling, `CALCULATE()` filter context, Measures vs Calculated Columns, and Time Intelligence.',
    coreBullets: [
      {
        title: 'Star Schema Modeling (Golden Rule)',
        point: 'One central FACT table (transactions/metrics) surrounded by clean DIMENSION tables (Date, Customer, Product) via One-to-Many (`1:*`) single-direction relationships.',
      },
      {
        title: 'Measures vs Calculated Columns',
        point: 'Calculated Columns run at refresh time and consume RAM (Row Context). Measures calculate dynamically on the fly per visual filter (Filter Context) — ALWAYS prefer Measures for aggregations!',
      },
      {
        title: 'CALCULATE() — The King of DAX',
        point: '`CALCULATE(<expression>, <filter1>, ...)` is the ONLY DAX function that modifies Filter Context (and performs Context Transition from Row → Filter).',
      },
      {
        title: 'Time Intelligence Requires a Date Table',
        point: 'Always mark a continuous dedicated Calendar table ("Mark as Date Table") for `TOTALYTD`, `SAMEPERIODLASTYEAR`, and `DATEADD` to work accurately.',
      },
      {
        title: 'Row-Level Security (RLS)',
        point: 'Restrict data per logged-in user via `USERPRINCIPALNAME()` in Manage Roles so regional managers see ONLY their own territory.',
      },
    ],
    goldenShortcuts: [
      'Use `DIVIDE(Numerator, Denominator, 0)` instead of `/` to handle divide-by-zero safely without `IFERROR` overhead.',
      '`ALL()` removes all filters; `ALLEXCEPT(Table, Col)` keeps ONLY specified column filters; `ALLSELECTED()` respects visual slicers.',
      'Use `VAR ... RETURN` inside DAX measures for readability AND to evaluate expensive sub-expressions only once.',
    ],
    commonTraps: [
      'Enabling Bi-Directional (`Both`) cross-filtering everywhere — causes ambiguous paths and severe performance degradation.',
      'Importing raw wide flat CSVs without splitting into Star Schema Fact & Dimensions.',
      'Using `SUMX` row-by-row iterators when a fast columnar `SUM()` works directly.',
    ],
    mentorKapilTips: [
      'Every Power BI interviewer asks: "Difference between Measure and Calculated Column?" — answer with RAM vs CPU, Refresh-time vs Query-time, and Row vs Filter context.',
      'Explain `ALL()` vs `ALLSELECTED()` with a "% of Total Sales" example—that single answer closes most BI technical rounds.',
      'Always keep Power Query transformations (ETL) upstream in M before writing heavy DAX downstream.',
    ],
  },
  dbms: {
    trackId: 'dbms',
    headline: 'DBMS & SQL Mastery — Normalization, ACID, Indexes & Window Functions',
    quickSummary:
      'SQL + DBMS is tested in almost EVERY tech & analyst interview (FAANG, Amazon, TCS, Wipro, Capgemini, Cognizant, Deloitte). Master Joins, Window Functions (`DENSE_RANK`), Normalization (1NF–BCNF), ACID, and B+ Trees.',
    coreBullets: [
      {
        title: 'SQL Execution Order (CRITICAL!)',
        point: '`FROM / JOIN` → `WHERE` (row filter) → `GROUP BY` → `HAVING` (group filter) → `SELECT` → `DISTINCT` → `ORDER BY` → `LIMIT`. That’s why `WHERE` cannot use `SELECT` aliases!',
      },
      {
        title: 'Window Functions (`OVER`)',
        point: '`ROW_NUMBER()` (1,2,3,4), `RANK()` (1,2,2,4 — skips), `DENSE_RANK()` (1,2,2,3 — no gaps), `LAG()`/`LEAD()` — compute rankings/running totals WITHOUT collapsing rows.',
      },
      {
        title: 'Normalization Ladder',
        point: '1NF (atomic cells) → 2NF (no partial dependency on composite PK) → 3NF (no transitive non-key → non-key dependency) → BCNF (every determinant is a superkey).',
      },
      {
        title: 'ACID Transactions',
        point: 'Atomicity (all or nothing), Consistency (valid invariants), Isolation (concurrent txns don’t corrupt — Read Committed / Serializable), Durability (committed survives crash via WAL).',
      },
      {
        title: 'Indexing & B+ Trees',
        point: 'B+ Tree indexes speed up `WHERE`/`JOIN`/`ORDER BY` from O(N) scan to O(log N), keeping all data pointers in linked leaf nodes for blazing fast range queries (`BETWEEN`).',
      },
    ],
    goldenShortcuts: [
      'Nth Highest Salary → ALWAYS use `DENSE_RANK() OVER (ORDER BY salary DESC)` inside a CTE (`WITH ranked AS (...)`).',
      '`DELETE` (DML, row-by-row, rollbackable) vs `TRUNCATE` (DDL, fast deallocation, resets identity) vs `DROP` (removes table structure completely).',
      'Find unmatched rows cleanly: `LEFT JOIN B ON A.id = B.id WHERE B.id IS NULL`.',
    ],
    commonTraps: [
      'Putting a filter on the right table of a `LEFT JOIN` inside `WHERE` — silently turns it into an `INNER JOIN`! Put it inside `ON`.',
      'Comparing `col = NULL` instead of `col IS NULL` (in SQL, `NULL = NULL` evaluates to UNKNOWN, never TRUE!).',
      'Over-indexing write-heavy tables slows down `INSERT`/`UPDATE`/`DELETE` because every index must be updated.',
    ],
    mentorKapilTips: [
      'Writing SQL with clean CTEs (`WITH ... AS (...)`) instead of nested subqueries instantly marks you as a top-tier SQL engineer at Amazon and Meta.',
      'Be ready to explain `RANK()` vs `DENSE_RANK()` vs `ROW_NUMBER()` on tied salaries `[100, 90, 90, 80]` — asked in 9 out of 10 SQL interviews!',
      'Always mention `EXPLAIN ANALYZE` when asked how you debug a slow production SQL query.',
    ],
  },
  cloud: {
    trackId: 'cloud',
    headline: 'Cloud Computing — Architecture, IAM, Networking & Scaling Notes',
    quickSummary:
      'Cloud rounds at Amazon (AWS), Microsoft (Azure), Google (GCP), TCS, Infosys, Capgemini, Cognizant, and Tech Mahindra test IaaS/PaaS/SaaS, Shared Responsibility, VPC networking, Containers, Serverless, and High Availability.',
    coreBullets: [
      {
        title: 'IaaS vs PaaS vs SaaS',
        point: 'IaaS = raw compute/network (EC2, Azure VM); PaaS = managed runtime/DB (App Engine, Elastic Beanstalk, Cloud SQL); SaaS = finished app (Gmail, Salesforce).',
      },
      {
        title: 'Shared Responsibility Model',
        point: 'Cloud provider secures security OF the cloud (hardware, data centers, hypervisor); YOU secure security IN the cloud (IAM roles, encryption, firewall rules, app code).',
      },
      {
        title: 'Scaling & High Availability',
        point: 'Vertical scaling = bigger machine (has ceiling, single point of failure). Horizontal scaling = Auto-Scaling Group behind a Load Balancer across 2+ Availability Zones (Multi-AZ).',
      },
      {
        title: 'Containers vs VMs vs Serverless',
        point: 'VMs virtualize full Guest OS (heavy, slow boot); Docker Containers share Host OS kernel (lightweight, seconds); Serverless (AWS Lambda/Cloud Functions) scales to zero & bills strictly per execution.',
      },
      {
        title: 'VPC & IAM Least Privilege',
        point: 'Put web Load Balancers in Public Subnets and Databases strictly in Private Subnets (no public IP). Grant IAM Roles minimal permissions—never embed root keys in code.',
      },
    ],
    goldenShortcuts: [
      'Object Storage (S3 / GCS) = cheap, 11-nines durability for images/videos/backups; Block Storage (EBS) = low-latency disk attached to a VM.',
      'CDN (CloudFront / Cloud CDN) caches static assets at global Edge locations near users to slash latency.',
      'RTO = max tolerable downtime; RPO = max tolerable data loss window (minutes/hours).',
    ],
    commonTraps: [
      'Confusing Availability Zones (isolated data centers inside ONE region, low latency) with Regions (separate geographic areas like Mumbai vs Frankfurt).',
      'Leaving S3 buckets public or using IAM root credentials for daily deployments.',
      'Using Serverless Lambda for long-running 4-hour stateful workloads (Lambda has a 15-minute execution timeout!).',
    ],
    mentorKapilTips: [
      'When asked to design any cloud app in an interview, draw: `Users → CDN → Load Balancer → Auto-Scaling App (Multi-AZ) → Cache (Redis) → Private Managed DB (Primary + Read Replica)`.',
      'Always mention Cost Optimization (auto-scaling, Spot instances, S3 lifecycle tiers) — AWS and Deloitte architects love cost-aware engineers.',
      'Know the exact difference between Security Groups (stateful, instance-level) and NACLs (stateless, subnet-level).',
    ],
  },
};

export const PILLAR3_SOLVED_PROBLEMS: SolvedCompanyProblem[] = [
  // =========================================================================
  // EXCEL — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_xl_1',
    trackId: 'excel',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Left-Lookup Employee Name From Employee ID (ID on Right)',
    problem:
      'Column A has `Employee Name`, Column C has `Employee ID`. Why does `VLOOKUP` fail here, and how do you solve it cleanly?',
    solution:
      'Why VLOOKUP fails: It can ONLY look up in the leftmost column and return values to the RIGHT.\nSolution 1 (Modern): `=XLOOKUP(E2, C:C, A:A, "ID Not Found")`\nSolution 2 (Universal): `=INDEX(A:A, MATCH(E2, C:C, 0))`',
    keyTakeaway: '`XLOOKUP` and `INDEX-MATCH` look in ANY direction and stay immune to column insertions.',
    kapilTip: 'In Deloitte and Accenture case rounds, using `XLOOKUP` or `INDEX-MATCH` immediately signals analyst maturity.',
  },
  {
    id: 'prob_xl_2',
    trackId: 'excel',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Multi-Criteria Revenue Summary With `SUMIFS`',
    problem:
      'Calculate total Revenue (Col D) where Region (Col A) = `"North"`, Category (Col B) = `"Electronics"`, and Order Date (Col C) is in 2026.',
    solution:
      '`=SUMIFS(D:D, A:A, "North", B:B, "Electronics", C:C, ">=2026-01-01", C:C, "<=2026-12-31")`\nNote: In `SUMIFS`, the `sum_range` comes FIRST (unlike `SUMIF` where it comes last!).',
    keyTakeaway: 'Date ranges in `SUMIFS` take two criteria on the same date column (`>=start` and `<=end`).',
    kapilTip: 'Replace hardcoded `"North"` with cell references like `$G$2` so managers can toggle filters dynamically!',
  },
  {
    id: 'prob_xl_3',
    trackId: 'excel',
    company: 'TCS',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: '2D Matrix Lookup (Product × Month Price Table)',
    problem:
      'Products are in `A2:A20`, Months (`Jan–Dec`) are in `B1:M1`, and prices are in `B2:M20`. Look up the price for Product in `P2` and Month in `Q2`.',
    solution:
      '`=INDEX($B$2:$M$20, MATCH(P2, $A$2:$A$20, 0), MATCH(Q2, $B$1:$M$1, 0))`\nFirst `MATCH` locates the row index; second `MATCH` locates the column index inside `INDEX`.',
    keyTakeaway: 'Double `INDEX(range, MATCH(row), MATCH(col))` turns any 2D pricing matrix into an instant dynamic lookup.',
    kapilTip: 'You can also nest `XLOOKUP(P2, $A$2:$A$20, XLOOKUP(Q2, $B$1:$M$1, $B$2:$M$20))` in Excel 365!',
  },
  {
    id: 'prob_xl_4',
    trackId: 'excel',
    company: 'Accenture',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Clean Messy CRM Names & Extract Domain From Email',
    problem:
      'Cell A2 contains `"  kapil.narula@COMPANY.com  "`. Normalize it cleanly and extract only `"company.com"`.',
    solution:
      'Clean full string: `=LOWER(TRIM(A2))`\nExtract domain (Excel 365): `=TEXTAFTER(LOWER(TRIM(A2)), "@")`\nUniversal formula: `=MID(LOWER(TRIM(A2)), FIND("@", LOWER(TRIM(A2))) + 1, 255)`',
    keyTakeaway: 'Always combine `TRIM()` with `LOWER()` before joining or deduplicating CRM emails.',
    kapilTip: 'Hidden leading/trailing spaces are the #1 reason `VLOOKUP` returns `#N/A` on seemingly matching text!',
  },
  {
    id: 'prob_xl_5',
    trackId: 'excel',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Duplicate Detection Flag Without Deleting Rows',
    problem:
      'Flag every duplicate Invoice ID in Column A with `"Duplicate"` while leaving the FIRST occurrence marked `"Original"`.',
    solution:
      'In B2 (copied down):\n`=IF(COUNTIF($A$2:A2, A2) > 1, "Duplicate", "Original")`\nTrick: Expanding range `$A$2:A2` anchors the top row (`$A$2`) and lets the bottom row grow dynamically (`A2`, `A3`, `A4`...).',
    keyTakeaway: 'Mixed anchored expanding ranges (`$A$2:A2`) track running counts and first occurrences effortlessly.',
    kapilTip: 'This exact expanding-range trick also builds running cumulative totals: `=SUM($C$2:C2)`!',
  },
  {
    id: 'prob_xl_6',
    trackId: 'excel',
    company: 'Wipro',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Prevent `#DIV/0!` Errors in Margin % Reports',
    problem:
      'Compute `Gross Margin % = (Revenue - Cost) / Revenue` cleanly when some new SKUs have `Revenue = 0`.',
    solution:
      '`=IFERROR((B2 - C2) / B2, 0)` (or `=IF(B2=0, 0, (B2-C2)/B2)`).\nBonus: `IF(B2=0, ...)` is even cleaner because it doesn’t mask real `#NAME?` or `#REF!` bugs.',
    keyTakeaway: 'Eliminate `#DIV/0!` before feeding ranges into `AVERAGE()` or Charts (which break on error cells).',
    kapilTip: 'Financial controllers prefer `IF(B2=0, 0, ...)` over blind `IFERROR` so genuine formula mistakes stay visible.',
  },
  {
    id: 'prob_xl_7',
    trackId: 'excel',
    company: 'Cognizant',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Count Unique Customers in a Transaction Table',
    problem:
      'Column A has 50,000 order rows with repeated Customer IDs. Count distinct active customers.',
    solution:
      'Excel 365: `=COUNTA(UNIQUE(A2:A50001))`\nPivot Table way: Insert Pivot → check **"Add this data to the Data Model"** → drag Customer ID to Values → Value Field Settings → **Distinct Count**.',
    keyTakeaway: 'Standard Pivot Tables lack Distinct Count until you check "Add to Data Model" (Power Pivot).',
    kapilTip: 'Mentioning the Data Model Distinct Count trick proves real corporate Pivot Table mastery!',
  },
  {
    id: 'prob_xl_8',
    trackId: 'excel',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Dynamic Top-5 Sales Filter With Excel 365 Arrays',
    problem:
      'Auto-list all rows from `A2:D500` where Region (Col B) = `"West"` AND Sales (Col D) > `50000`, sorted highest-to-lowest.',
    solution:
      '`=SORT(FILTER(A2:D500, (B2:B500="West") * (D2:D500>50000), "No Matches"), 4, -1)`\nNote: In `FILTER()`, `*` represents logical AND, while `+` represents logical OR. `4, -1` sorts by 4th column descending.',
    keyTakeaway: 'Boolean multiplication `(cond1)*(cond2)` inside `FILTER()` enables multi-condition live dashboards.',
    kapilTip: 'Remember: `AND()` inside `FILTER()` collapses to 1 value and breaks—ALWAYS use `*` for AND and `+` for OR!',
  },
  {
    id: 'prob_xl_9',
    trackId: 'excel',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Tiered Commission Calculation With Approximate `XLOOKUP`',
    problem:
      'Sales Tiers: `0 → 2%`, `50,000 → 5%`, `100,000 → 8%`, `250,000 → 12%` (in `G2:H5`). Compute commission rate for sales in `B2` without nested `IF`s.',
    solution:
      '`=XLOOKUP(B2, $G$2:$G$5, $H$2:$H$5, 0, -1)`\nSetting `match_mode = -1` finds an exact match or the next SMALLER bracket cleanly—far easier to audit than 5 nested `IF`s!',
    keyTakeaway: 'Replace ugly nested `IF` slabs with a clean lookup table + approximate match (`-1`).',
    kapilTip: 'Lookup tables let business managers change commission brackets in 1 cell without touching formulas.',
  },
  {
    id: 'prob_xl_10',
    trackId: 'excel',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Unpivoting Wide Monthly Columns in Power Query',
    problem:
      'A finance sheet has columns `Product | Jan | Feb | Mar | ... | Dec`. Why does this break Pivot Tables, and how do you fix it cleanly?',
    solution:
      'Wide month columns prevent date slicing and YTD calculations.\nFix in Power Query: Load table → select `Product` column → right-click → **Unpivot Other Columns** → rename to `Month` and `Revenue` → Close & Load.\nResult: Clean 3-column normalized table ready for Pivot Tables & Power BI!',
    keyTakeaway: 'Always store raw data in tall/normalized format; use Pivot Tables for wide display.',
    kapilTip: 'Power Query Unpivot is a 10-second superpower that saves analysts hours every single month.',
  },

  // =========================================================================
  // POWER BI — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_pbi_1',
    trackId: 'power_bi',
    company: 'Microsoft',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: '% of Total Sales vs % of Filtered Visual Sales (`ALL` vs `ALLSELECTED`)',
    problem:
      'Write a DAX measure for each product’s share of (a) Grand Total Revenue ignoring all slicers, and (b) Selected Revenue respecting active slicers.',
    solution:
      '```dax\n% of Grand Total =\nDIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Products)))\n\n% of Slicer Total =\nDIVIDE([Total Sales], CALCULATE([Total Sales], ALLSELECTED(Products)))\n```',
    keyTakeaway: '`ALL()` clears every filter; `ALLSELECTED()` clears only the current row filter while honoring external slicers.',
    kapilTip: 'Always use `DIVIDE()` instead of `/` so blank segments return clean blanks/zeros instead of `Infinity`.',
  },
  {
    id: 'prob_pbi_2',
    trackId: 'power_bi',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Year-over-Year (YoY) Revenue Growth % Measure',
    problem:
      'Write a clean DAX measure for YoY Revenue Growth % using variables (`VAR`).',
    solution:
      '```dax\nYoY Growth % =\nVAR CurrentSales = [Total Sales]\nVAR PriorYearSales =\n    CALCULATE([Total Sales], SAMEPERIODLASTYEAR(DimDate[Date]))\nRETURN\n    DIVIDE(CurrentSales - PriorYearSales, PriorYearSales)\n```',
    keyTakeaway: 'Variables (`VAR`) make DAX clean, debuggable, and evaluate `PriorYearSales` only ONCE instead of twice.',
    kapilTip: 'Remind the interviewer that `DimDate` MUST be a continuous calendar marked as Date Table for `SAMEPERIODLASTYEAR` to work.',
  },
  {
    id: 'prob_pbi_3',
    trackId: 'power_bi',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: 'Handle Multiple Dates (Order Date & Ship Date) via `USERELATIONSHIP`',
    problem:
      '`FactOrders` has BOTH `OrderDate` (active relationship to `DimDate`) and `ShipDate` (inactive relationship). How do you calculate Shipped Sales without duplicating the Date table?',
    solution:
      '```dax\nShipped Sales =\nCALCULATE(\n    [Total Sales],\n    USERELATIONSHIP(FactOrders[ShipDate], DimDate[Date])\n)\n```\n`USERELATIONSHIP` temporarily activates the inactive relationship strictly during that measure’s evaluation.',
    keyTakeaway: 'Keep one single `DimDate` with 1 active + N inactive relationships activated on demand via `USERELATIONSHIP`.',
    kapilTip: 'This is a signature senior Power BI modeling pattern asked at Amazon, Microsoft, and Deloitte!',
  },
  {
    id: 'prob_pbi_4',
    trackId: 'power_bi',
    company: 'TCS',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Measure vs Calculated Column — Total Revenue Trap',
    problem:
      'Why is `SUM(Sales[Qty]) * SUM(Sales[Price])` WRONG for Total Revenue, and what is the right DAX?',
    solution:
      '`SUM(Qty) * SUM(Price)` multiplies total units across all products by the sum of all unit prices (wildly inflated!).\nCorrect Measure (Iterator): `Total Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])`.\n`SUMX` multiplies row-by-row and then sums the results without needing a RAM-heavy calculated column.',
    keyTakeaway: 'Use `SUMX` whenever you must perform row-level math before aggregating.',
    kapilTip: 'Also warn: avoid creating a Calculated Column `LineTotal = Qty * Price` on 50M-row tables—`SUMX` keeps the VertiPaq model lean!',
  },
  {
    id: 'prob_pbi_5',
    trackId: 'power_bi',
    company: 'Accenture',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Dynamic Row-Level Security (RLS) by Logged-In Email',
    problem:
      'Configure Power BI so 200 regional managers share ONE report, yet each sees ONLY their assigned region.',
    solution:
      '1) Maintain a `UserSecurity(Email, Region)` mapping table linked to `DimRegion`.\n2) In Modeling → Manage Roles, add DAX filter on `UserSecurity`:\n`[Email] = USERPRINCIPALNAME()`\n3) Publish to Power BI Service and assign the AD security group to that role (remember: RLS only applies to **Viewer** workspace permission, not Admin/Member!).',
    keyTakeaway: 'Dynamic RLS uses `USERPRINCIPALNAME()` + a mapping table instead of creating 200 hardcoded static roles.',
    kapilTip: 'Calling out that RLS does NOT restrict Workspace Admins/Members/Contributors is a classic Accenture trick check!',
  },
  {
    id: 'prob_pbi_6',
    trackId: 'power_bi',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: '30-Day Rolling Average Revenue in DAX',
    problem:
      'Write a DAX measure to compute the trailing 30-day moving average of daily sales.',
    solution:
      '```dax\nRolling 30D Avg =\nAVERAGEX(\n    DATESINPERIOD(DimDate[Date], MAX(DimDate[Date]), -30, DAY),\n    [Total Sales]\n)\n```',
    keyTakeaway: '`DATESINPERIOD` constructs a sliding calendar window anchored at the current visual’s `MAX(Date)`.',
    kapilTip: 'Pair rolling averages with daily bars on a combo chart to smooth noisy daily volatility for executives.',
  },
  {
    id: 'prob_pbi_7',
    trackId: 'power_bi',
    company: 'Cognizant',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Import Mode vs DirectQuery vs Composite Mode',
    problem:
      'A client has a 10M-row SQL warehouse needing sub-second dashboards. Should you choose Import or DirectQuery?',
    solution:
      '**Import Mode** (recommended!). Power BI’s VertiPaq columnar compression easily compresses 10M rows into ~150–300 MB in memory, delivering sub-second visuals and full DAX support.\nChoose DirectQuery ONLY for strict real-time seconds-old data or multi-billion-row tables exceeding capacity limits (or Composite/Hybrid mode with Aggregations).',
    keyTakeaway: 'Import Mode is fastest due to VertiPaq in-memory columnar storage; DirectQuery pushes live SQL per click.',
    kapilTip: 'Mentioning **Query Folding** in Power Query (pushing filters back to SQL before import) earns huge credit.',
  },
  {
    id: 'prob_pbi_8',
    trackId: 'power_bi',
    company: 'Wipro',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Customer Ranking With `RANKX` (Handling Ties Cleanly)',
    problem:
      'Rank every customer by Total Sales inside a table visual without every row showing `1`.',
    solution:
      '```dax\nCustomer Rank =\nRANKX(ALLSELECTED(DimCustomer[CustomerName]), [Total Sales], , DESC, DENSE)\n```\nWhy rows show `1` if you forget `ALLSELECTED`: Without removing the current row’s customer filter, each customer is ranked solely against themselves!',
    keyTakeaway: 'Always wrap the first argument of `RANKX` in `ALL()` or `ALLSELECTED()` to rank across peers.',
    kapilTip: 'Spotting the "every row shows 1" bug proves you have actually built real Power BI dashboards!',
  },
  {
    id: 'prob_pbi_9',
    trackId: 'power_bi',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Cumulative Running Total (YTD) in DAX',
    problem:
      'Calculate Year-to-Date cumulative sales for any selected fiscal or calendar date.',
    solution:
      '```dax\nSales YTD = TOTALYTD([Total Sales], DimDate[Date])\n-- For Indian Fiscal Year ending March 31:\nSales FYTD = TOTALYTD([Total Sales], DimDate[Date], "3/31")\n```',
    keyTakeaway: 'Adding `"3/31"` as the 3rd parameter in `TOTALYTD` switches effortlessly to Indian April–March fiscal years.',
    kapilTip: 'Knowing the `"3/31"` fiscal-year parameter is a huge standout detail for Indian enterprise BI interviews!',
  },
  {
    id: 'prob_pbi_10',
    trackId: 'power_bi',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Optimizing a Slow Power BI Report (4-Point Checklist)',
    problem:
      'An executive Power BI page takes 18 seconds to load. How do you diagnose and optimize it?',
    solution:
      '1) Run **Performance Analyzer** in Power BI Desktop to isolate whether DAX Query or Visual Rendering is slow.\n2) Remove unused high-cardinality columns (GUIDs, exact timestamps) and disable **Auto Date/Time** to shrink VertiPaq RAM.\n3) Convert Snowflake/flat tables to a clean **Star Schema** with single-direction relationships.\n4) Reduce visuals per page (< 8–10) and replace heavy `FILTER(FactTable, ...)` with column predicates inside `CALCULATE`.',
    keyTakeaway: 'Never filter an entire Fact table inside `CALCULATE` — filter Dimension columns instead.',
    kapilTip: 'Mentioning Performance Analyzer + disabling Auto Date/Time shows genuine production BI experience.',
  },

  // =========================================================================
  // DBMS & SQL — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_sql_1',
    trackId: 'dbms',
    company: 'Amazon',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Second Highest Salary Per Department (Handling Ties)',
    problem:
      'Given `Employees(id, name, dept, salary)`, return the 2nd highest distinct salary in EACH department.',
    solution:
      '```sql\nWITH ranked AS (\n  SELECT name, dept, salary,\n         DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk\n  FROM Employees\n)\nSELECT dept, name, salary\nFROM ranked\nWHERE rnk = 2;\n```',
    keyTakeaway: '`DENSE_RANK()` handles ties properly (`100, 100, 90` → `90` gets rank `2`, unlike `RANK()` which gives `3`!).',
    kapilTip: 'This is arguably the #1 most-asked SQL interview query across Amazon, TCS, Infosys, and Deloitte.',
  },
  {
    id: 'prob_sql_2',
    trackId: 'dbms',
    company: 'Meta',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Find Customers Who Never Placed an Order',
    problem:
      'Given `Customers(id, name)` and `Orders(id, customer_id)`, find customers with zero orders.',
    solution:
      '```sql\nSELECT c.id, c.name\nFROM Customers c\nLEFT JOIN Orders o ON c.id = o.customer_id\nWHERE o.customer_id IS NULL;\n```\n(Alternative: `WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.customer_id = c.id)` — safer than `NOT IN` when NULLs exist!).',
    keyTakeaway: 'Avoid `NOT IN (subquery)` if the subquery can ever return `NULL` — it silently returns 0 rows!',
    kapilTip: 'Explaining the `NOT IN` + `NULL` trap immediately elevates you to senior SQL territory.',
  },
  {
    id: 'prob_sql_3',
    trackId: 'dbms',
    company: 'Google',
    companyTier: 'FAANG',
    difficulty: 'Hard',
    title: '7-Day Rolling Revenue Using SQL Window Frames',
    problem:
      'Given `DailySales(sale_date, revenue)` with one row per day, calculate a 7-day rolling sum of revenue.',
    solution:
      '```sql\nSELECT sale_date, revenue,\n       SUM(revenue) OVER (\n         ORDER BY sale_date\n         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n       ) AS rolling_7d_rev\nFROM DailySales;\n```',
    keyTakeaway: 'Use `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` for consecutive rows, or `RANGE BETWEEN INTERVAL \'6 days\' PRECEDING AND CURRENT ROW` if dates have gaps!',
    kapilTip: 'Distinguishing `ROWS` vs `RANGE` when calendar dates have missing days is a classic Google/Meta bar-raiser.',
  },
  {
    id: 'prob_sql_4',
    trackId: 'dbms',
    company: 'TCS NQT',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Find & Delete Duplicate Emails Keeping Lowest ID',
    problem:
      'In `Users(id, email)`, find duplicate emails and delete duplicates while preserving the smallest `id`.',
    solution:
      '```sql\n-- Find duplicates:\nSELECT email, COUNT(*) FROM Users GROUP BY email HAVING COUNT(*) > 1;\n\n-- Delete duplicates (keeping lowest id):\nDELETE FROM Users\nWHERE id NOT IN (\n  SELECT min_id FROM (SELECT MIN(id) AS min_id FROM Users GROUP BY email) t\n);\n```',
    keyTakeaway: '`WHERE` filters raw rows before grouping; `HAVING` filters aggregated groups after `GROUP BY`.',
    kapilTip: 'Also know the Window Function version: delete rows where `ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) > 1`.',
  },
  {
    id: 'prob_sql_5',
    trackId: 'dbms',
    company: 'Wipro',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Self-Join: Employees Earning More Than Their Manager',
    problem:
      'Given `Emp(id, name, salary, manager_id)`, list employees who earn strictly more than their direct manager.',
    solution:
      '```sql\nSELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS mgr_salary\nFROM Emp e\nJOIN Emp m ON e.manager_id = m.id\nWHERE e.salary > m.salary;\n```',
    keyTakeaway: 'Self-joins alias the same table twice (`e` for employee, `m` for manager) to compare hierarchical rows.',
    kapilTip: 'Always double-check join direction: `e.manager_id = m.id` (NOT `e.id = m.manager_id`!).',
  },
  {
    id: 'prob_sql_6',
    trackId: 'dbms',
    company: 'Microsoft',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Month-over-Month (MoM) Growth Using `LAG()`',
    problem:
      'Given `MonthlyRev(month_start, rev)`, compute MoM % change compared to the previous month.',
    solution:
      '```sql\nSELECT month_start, rev,\n       ROUND(100.0 * (rev - LAG(rev) OVER (ORDER BY month_start))\n             / NULLIF(LAG(rev) OVER (ORDER BY month_start), 0), 2) AS mom_pct\nFROM MonthlyRev;\n```',
    keyTakeaway: '`LAG(col, 1)` fetches the previous row cleanly without an expensive self-join; `NULLIF(x, 0)` prevents divide-by-zero.',
    kapilTip: 'Using `NULLIF(denom, 0)` and `100.0` (avoiding integer division truncation!) shows production SQL discipline.',
  },
  {
    id: 'prob_sql_7',
    trackId: 'dbms',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: '3NF vs BCNF Normalization Diagnosis',
    problem:
      'Table `Enroll(Student, Subject, Professor)` has rules: `(Student, Subject) -> Professor` and each Professor teaches ONLY one Subject (`Professor -> Subject`). Is it in 3NF? Is it in BCNF?',
    solution:
      'Candidate Key: `(Student, Subject)`.\n- **3NF?** YES — in `Professor -> Subject`, `Subject` is a PRIME attribute (part of candidate key).\n- **BCNF?** NO — `Professor` is NOT a superkey, yet it determines `Subject` (causes update anomalies!).\nFix for BCNF: Split into `ProfSubject(Professor, Subject)` and `StudentProf(Student, Professor)`.',
    keyTakeaway: 'BCNF is stricter than 3NF: for EVERY non-trivial dependency `X -> Y`, `X` MUST be a superkey.',
    kapilTip: 'Keep this exact 3-column `(Student, Subject, Professor)` example memorized—it answers every BCNF interview question cleanly!',
  },
  {
    id: 'prob_sql_8',
    trackId: 'dbms',
    company: 'Cognizant GenC',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Composite Index Leftmost Prefix Rule',
    problem:
      'You create `INDEX idx_user_date ON Orders(user_id, order_date)`. Which queries use the index: (A) `WHERE user_id = 5`, (B) `WHERE user_id = 5 AND order_date > \'2026-01-01\'`, (C) `WHERE order_date > \'2026-01-01\'`?',
    solution:
      '(A) USES index (matches leftmost column `user_id`).\n(B) USES full composite index.\n(C) CANNOT use the B+ Tree efficiently (skips leftmost prefix `user_id` → full scan!).',
    keyTakeaway: 'Like a phonebook sorted by `(LastName, FirstName)`, a composite index only accelerates lookups starting from the LEFTMOST column.',
    kapilTip: 'Put equality columns (`user_id = 5`) FIRST and range columns (`order_date > ...`) SECOND in composite indexes!',
  },
  {
    id: 'prob_sql_9',
    trackId: 'dbms',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Concurrency Anomalies & Transaction Isolation Levels',
    problem:
      'Distinguish Dirty Read, Non-Repeatable Read, and Phantom Read, and name the default PostgreSQL/Oracle isolation level.',
    solution:
      '- **Dirty Read**: Reading uncommitted changes that later roll back (blocked by Read Committed+).\n- **Non-Repeatable Read**: Re-reading the same row sees updated values from another committed txn (blocked by Repeatable Read+).\n- **Phantom Read**: Re-running a range query sees newly inserted rows (blocked by Serializable).\nDefault in PostgreSQL/Oracle: **Read Committed** (MySQL InnoDB default: **Repeatable Read**).',
    keyTakeaway: 'Higher isolation increases consistency but increases lock contention/abort rates.',
    kapilTip: 'Knowing MVCC (Multi-Version Concurrency Control) lets readers never block writers in PostgreSQL/InnoDB!',
  },
  {
    id: 'prob_sql_10',
    trackId: 'dbms',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Conditional Aggregation Pivot in Pure SQL (`CASE WHEN`)',
    problem:
      'In one query, count `Pending`, `Shipped`, and `Cancelled` orders per region from `Orders(region, status)`.',
    solution:
      '```sql\nSELECT region,\n       SUM(CASE WHEN status = \'Pending\'   THEN 1 ELSE 0 END) AS pending_cnt,\n       SUM(CASE WHEN status = \'Shipped\'   THEN 1 ELSE 0 END) AS shipped_cnt,\n       SUM(CASE WHEN status = \'Cancelled\' THEN 1 ELSE 0 END) AS cancelled_cnt\nFROM Orders\nGROUP BY region;\n```',
    keyTakeaway: '`SUM(CASE WHEN ... THEN 1 ELSE 0 END)` computes multiple segmented KPIs in a single table scan!',
    kapilTip: 'Single-pass conditional aggregation is dramatically faster than running 3 separate `WHERE` queries.',
  },

  // =========================================================================
  // CLOUD COMPUTING — 10 REAL COMPANY PROBLEMS
  // =========================================================================
  {
    id: 'prob_cld_1',
    trackId: 'cloud',
    company: 'Amazon (AWS)',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Design a Highly Available 3-Tier Web Architecture',
    problem:
      'Design an e-commerce web app on AWS that survives a complete data center outage with zero manual intervention.',
    solution:
      '1) **Edge**: Route 53 DNS + CloudFront CDN + WAF.\n2) **Public Subnets (2+ AZs)**: Application Load Balancer (ALB) + NAT Gateways.\n3) **Private App Subnets (2+ AZs)**: EC2/ECS Auto-Scaling Group.\n4) **Private DB Subnets (2+ AZs)**: Amazon RDS Multi-AZ (synchronous standby failover) + ElastiCache Redis for hot reads.',
    keyTakeaway: 'Eliminate every Single Point of Failure (SPOF) by spanning Load Balancers, Compute, and DB across ≥ 2 Availability Zones.',
    kapilTip: 'Always place Application & Database servers in PRIVATE subnets—only the Load Balancer belongs in Public subnets!',
  },
  {
    id: 'prob_cld_2',
    trackId: 'cloud',
    company: 'Google (GCP)',
    companyTier: 'FAANG',
    difficulty: 'Medium',
    title: 'Docker Containers vs Virtual Machines vs Serverless',
    problem:
      'When should an engineering team pick Cloud Run / AWS Lambda (Serverless) vs Kubernetes (GKE/EKS) vs VMs?',
    solution:
      '- **Serverless (Lambda / Cloud Run)**: Spiky, event-driven APIs, image thumbnails, cron jobs — scales to 0, pay per ms, zero server patching.\n- **Kubernetes (GKE/EKS)**: Complex multi-service microservices needing fine-grained networking, sidecars, GPU pods, or cloud portability.\n- **VMs (EC2 / Compute Engine)**: Legacy OS-bound monoliths or custom kernel tuning.',
    keyTakeaway: 'Start simple (Managed PaaS/Serverless) before paying the operational complexity tax of Kubernetes.',
    kapilTip: 'Also mention Serverless **Cold Starts** and how Provisioned Concurrency mitigates latency spikes.',
  },
  {
    id: 'prob_cld_3',
    trackId: 'cloud',
    company: 'Microsoft (Azure)',
    companyTier: 'FAANG',
    difficulty: 'Easy',
    title: 'Shared Responsibility Model Security Audit',
    problem:
      'A company accidentally exposed customer CSVs in an unencrypted public S3/Blob bucket. Who is legally and technically responsible—the Cloud Provider or the Customer?',
    solution:
      'The **Customer**! Under the Shared Responsibility Model:\n- Provider secures physical data centers, hardware, network fabric, and virtualization.\n- Customer owns IAM policies, bucket permissions, data encryption, OS patching (on IaaS), and application security.',
    keyTakeaway: 'Cloud providers secure the infrastructure; customers always own their data and IAM configuration.',
    kapilTip: 'Always enable "Block Public Access" + Server-Side Encryption (KMS) + IAM Least Privilege by default.',
  },
  {
    id: 'prob_cld_4',
    trackId: 'cloud',
    company: 'TCS',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Decouple Spike Traffic With Message Queues (SQS / PubSub)',
    problem:
      'During a Diwali flash sale, order volume jumps 50x and overwhelms the downstream Payment & Invoice database. How do you stop orders from dropping?',
    solution:
      'Insert a managed asynchronous **Message Queue** (AWS SQS / Google Pub/Sub / Kafka) between the Order API and Worker services.\n1) Checkout API validates and pushes order to Queue in 10ms.\n2) Auto-scaling Workers pull messages at the DB’s sustainable write rate.\n3) Configure a **Dead-Letter Queue (DLQ)** for poison messages that fail 3 retries.',
    keyTakeaway: 'Queues absorb sudden traffic bursts (load leveling) and decouple producer speed from consumer capacity.',
    kapilTip: 'Mentioning **Dead-Letter Queues (DLQ)** and **Idempotency Keys** (preventing double charges!) is pure gold.',
  },
  {
    id: 'prob_cld_5',
    trackId: 'cloud',
    company: 'Capgemini',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Security Groups vs Network ACLs (VPC Networking)',
    problem:
      'Compare Security Groups and NACLs in cloud VPC security.',
    solution:
      '- **Security Groups (Instance-level)**: **Stateful** (allowed inbound automatically permits return outbound); supports ALLOW rules only.\n- **NACLs (Subnet-level)**: **Stateless** (must explicitly allow BOTH inbound and ephemeral outbound); supports both ALLOW and explicit DENY (e.g., blocking a malicious IP range).',
    keyTakeaway: 'Security Groups = stateful instance firewall; NACLs = stateless subnet firewall supporting explicit DENY.',
    kapilTip: 'Classic Capgemini, AWS SAA, and Infosys Cloud interview differentiator—memorize Stateful vs Stateless!',
  },
  {
    id: 'prob_cld_6',
    trackId: 'cloud',
    company: 'Wipro',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'Cloud Storage Selection (Object vs Block vs File)',
    problem:
      'Match the best storage tier for: (1) OS boot volume for a VM, (2) 100 TB of user-uploaded MP4 videos, (3) Shared Linux filesystem mounted across 15 app servers.',
    solution:
      '1) VM Boot Disk → **Block Storage** (AWS EBS / Persistent Disk) — low-latency random I/O.\n2) 100 TB MP4 Videos → **Object Storage** (AWS S3 / GCS) + CDN — limitless scale, 99.999999999% durability.\n3) Shared Mount → **Managed File Storage** (AWS EFS / Filestore) — POSIX NFS shared simultaneously across VMs.',
    keyTakeaway: 'Block = single VM disk; File = multi-VM shared folder; Object = web-scale unstructured blobs.',
    kapilTip: 'Add S3 Lifecycle Policies (Standard → Infrequent Access → Glacier) to highlight automatic cloud cost savings.',
  },
  {
    id: 'prob_cld_7',
    trackId: 'cloud',
    company: 'Cognizant',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Zero-Downtime Deployment Strategies (Blue-Green vs Canary)',
    problem:
      'How do you deploy v2.0 of a payment microservice safely with instant rollback capability?',
    solution:
      '- **Blue-Green**: Spin up an identical Green environment running v2.0, smoke-test it, then flip the Load Balancer/DNS from Blue → Green. Instant rollback = flip back to Blue.\n- **Canary**: Route 5% of live traffic to v2.0 first, monitor error rate & p99 latency, then gradually ramp 25% → 50% → 100%.',
    keyTakeaway: 'Canary limits blast radius to a tiny % of users; Blue-Green gives instant full-environment rollback.',
    kapilTip: 'In interviews, always pair deployment strategy with automated health checks and CloudWatch/Prometheus alerts.',
  },
  {
    id: 'prob_cld_8',
    trackId: 'cloud',
    company: 'Tech Mahindra',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Disaster Recovery: RTO vs RPO & DR Tiers',
    problem:
      'A banking client requires RTO < 5 minutes and RPO < 1 minute. Why is "Backup & Restore" insufficient?',
    solution:
      '- **RTO** (Recovery Time Objective) = max allowed downtime (< 5 min).\n- **RPO** (Recovery Point Objective) = max allowed data loss (< 1 min).\nBackup & Restore takes hours to provision servers and restore snapshots (high RTO/RPO). Meeting < 5 min RTO / < 1 min RPO requires **Warm Standby** or **Multi-Region Active-Active** with continuous async replication.',
    keyTakeaway: 'Lower RTO/RPO directly trades off against higher standby infrastructure cost.',
    kapilTip: 'Remember: **T** in RTO = **Time** to recover; **P** in RPO = **Point** in time of last saved data!',
  },
  {
    id: 'prob_cld_9',
    trackId: 'cloud',
    company: 'Infosys',
    companyTier: 'MNC',
    difficulty: 'Easy',
    title: 'IAM Roles vs Hardcoded Access Keys',
    problem:
      'An EC2 app server needs to read files from an S3 bucket. Why should you NEVER put IAM Access Keys in `.env` or GitHub?',
    solution:
      'Static access keys never expire automatically and can leak via Git commits or logs, compromising the entire account.\nBest Practice: Attach an **IAM Role** directly to the EC2/ECS/Cloud Run compute instance—the cloud metadata service rotates short-lived temporary credentials automatically with zero hardcoded secrets!',
    keyTakeaway: 'Prefer IAM Roles + Managed Secret Managers (AWS Secrets Manager / GCP Secret Manager) over static keys.',
    kapilTip: 'Saying "zero hardcoded credentials, temporary STS tokens via IAM Roles" makes cloud security interviewers smile.',
  },
  {
    id: 'prob_cld_10',
    trackId: 'cloud',
    company: 'Deloitte',
    companyTier: 'MNC',
    difficulty: 'Medium',
    title: 'Cloud FinOps: Cutting Monthly Cloud Bill by 40%',
    problem:
      'A startup’s AWS/Azure bill doubled unexpectedly. Give 4 immediate FinOps actions to slash cost without hurting reliability.',
    solution:
      '1) **Right-size** over-provisioned VMs/DBs using 30-day CPU/RAM utilization metrics.\n2) Commit steady baseline workloads to **Savings Plans / Reserved Instances** (30–60% discount) and use **Spot Instances** for stateless batch/CI jobs (up to 80% off).\n3) Auto-shutdown Dev/QA environments overnight & weekends.\n4) Delete unattached EBS disks, old snapshots, and apply S3 Intelligent-Tiering.',
    keyTakeaway: 'FinOps combines right-sizing, commitment discounts, non-prod scheduling, and storage lifecycle automation.',
    kapilTip: 'Cloud architects who speak BOTH reliability AND cost optimization get promoted fastest!',
  },
];

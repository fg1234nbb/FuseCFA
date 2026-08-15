// ====================================================================
// QUESTION BANK — fully static, loaded straight into the app. No
// server, no API call at runtime. To add more content, edit the
// arrays below directly.
//
// Every question has a stable `id` (e.g. "L2-07") used to track
// per-question completion — see "overall stats" further down this
// file. When you paste in newly-generated questions, leave the `id`
// field out entirely; just run:
//
//   node scripts/add-question-ids.js
//
// This assigns IDs only to questions missing one, continuing the
// numbering after whatever's already there. It's safe to re-run any
// time — existing IDs are never touched or renumbered, so nobody's
// saved progress (which is keyed by these IDs) gets scrambled.
// ====================================================================
// HOW TO GENERATE MORE QUESTIONS WITH CLAUDE
// ====================================================================
// Copy everything between the dashed lines into a Claude conversation,
// fill in the two [bracketed] parts, and paste the returned array
// straight into QUESTIONS_BY_LEVEL below (append to an existing level,
// or add a new one) — then run `node scripts/add-question-ids.js`.
//
// --------------------- COPY FROM HERE ---------------------
// Write 10 original CFA Level [I/II/III] practice questions as a
// JavaScript array of objects, in exactly this format:
//
// {
//   topic: "TOPIC NAME IN CAPS",
//   vignette: "A one-to-two sentence scenario that sets up the question.",
//   stem: "The question itself, one sentence. If one term is the crux
//          of the question, wrap it in <em>...</em>.",
//   options: ["option A text", "option B text", "option C text"],
//   correct: 0,
//   explain: "One or two sentences on WHY the correct answer is
//             correct — assume the reader just got it wrong and
//             needs the actual reasoning, not just a restated formula."
// }
//
// Do NOT include an "id" field — that's assigned automatically by
// running `node scripts/add-question-ids.js` after pasting.
//
// Rules:
// - Exactly 3 answer options per question (real CFA item-set format).
// - Make the wrong options genuinely tempting, not obviously wrong:
//   numerator/denominator swaps, sign errors, a similar-sounding but
//   different concept, a plausible-but-wrong causal story.
// - One vignette, one clear question — no compound/multi-part stems.
// - Cover this topic area: [e.g. "Fixed Income — spot rates, forward
//   rates, and the term structure" or "Ethics — Standard III loyalty,
//   prudence, and care"]
// - Return ONLY the JavaScript array. No preamble, no explanation,
//   no markdown code fences — just the array literal.
// --------------------- TO HERE ---------------------
// ====================================================================

export const LEVEL_INFO = {
  1: 'Foundations across all 10 official Level I topics — quant, FSA, equity, fixed income, and ethics.',
  2: 'Vignette-driven analysis across all 10 official Level II topics — from equity and fixed income to ethics and portfolio management.',
  3: '5 Core topics everyone is tested on, plus a taste of all 3 Specialized Pathways (Portfolio Management, Private Wealth, Private Markets) — in reality you\u2019d only study the one you register for.',
};

export const QUESTIONS_BY_LEVEL = {
  1: [
    {
      id: 'L1-01',
      topic: 'FSA',
      vignette: 'An analyst reviews a company that spent $2,400,000 on new equipment. Management capitalized the cost rather than expensing it.',
      stem: 'All else equal, capitalizing this cost affects the <em>fixed asset turnover ratio</em> (Net Revenue ÷ Average Net Fixed Assets) by:',
      options: [
        'Increasing the numerator, raising the ratio',
        'Increasing the denominator, lowering the ratio',
        'Leaving the ratio unchanged',
      ],
      correct: 1,
      explain: 'CapEx is capitalized onto the balance sheet as PP&E — it grows the denominator (average net fixed assets), not revenue. A bigger denominator means a lower ratio, all else equal.',
    },
    {
      id: 'L1-02',
      topic: 'QUANT',
      vignette: 'A candidate needs the standard error of a sample mean for a hypothesis test, given sample standard deviation s and sample size n.',
      stem: 'The standard error of the sample mean is calculated as:',
      options: ['s ÷ √n', 's² ÷ n', 's × √n'],
      correct: 0,
      explain: 'Standard error of the mean = s ÷ √n. It shrinks as sample size grows, since larger samples pin down the mean more precisely.',
    },
    {
      id: 'L1-03',
      topic: 'FIXED INCOME',
      vignette: "A bond's yield to maturity rises sharply after a central bank surprise.",
      stem: "All else equal, as YTM increases, a bond's Macaulay duration:",
      options: ['Increases', 'Decreases', 'Is unaffected by yield changes'],
      correct: 1,
      explain: 'Higher yields discount distant cash flows more heavily, shrinking their weight in the duration calculation — so duration falls as YTM rises.',
    },
    {
      id: 'L1-04',
      topic: 'DERIVATIVES',
      vignette: 'An investor holds the long side of a forward contract with forward price F0(T). At expiration, the spot price is ST.',
      stem: 'The payoff to the long forward position at expiration equals:',
      options: ['ST − F0(T)', 'F0(T) − ST', 'ST × F0(T)'],
      correct: 0,
      explain: 'Long forward payoff = ST − F0(T). The long side profits when the spot price finishes above the price they locked in.',
    },
    {
      id: 'L1-05',
      topic: 'FSA',
      vignette: 'Under the indirect method, a firm starts with net income and reconciles it to cash flow from operations.',
      stem: 'Depreciation expense is added back to net income when computing CFO because it:',
      options: [
        'Represents actual cash paid out during the period',
        'Is a non-cash expense that had reduced net income',
        "Increases the company's fixed asset base",
      ],
      correct: 1,
      explain: "Depreciation lowers net income but involves zero cash outflow in the period — so it's added back to reconcile to actual cash generated.",
    },
    {
      id: 'L1-06',
      topic: 'PORTFOLIO MGMT',
      vignette: 'An analyst compares two portfolios using risk-adjusted return, given portfolio return Rp, risk-free rate Rf, and portfolio std. dev. σp.',
      stem: 'The Sharpe ratio is calculated as:',
      options: ['(Rp − Rf) ÷ σp', '(Rp − benchmark return) ÷ σp', 'σp ÷ (Rp − Rf)'],
      correct: 0,
      explain: 'Sharpe ratio = (Rp − Rf) ÷ σp — excess return over the risk-free rate, per unit of total risk.',
    },
    {
      id: 'L1-07',
      topic: 'FSA',
      vignette: 'In a period of rising input prices, a firm switches its inventory method from FIFO to LIFO.',
      stem: 'All else equal, this switch:',
      options: [
        'Increases reported COGS and decreases net income',
        'Decreases reported COGS and increases net income',
        'Has no effect on COGS or net income',
      ],
      correct: 0,
      explain: 'LIFO assigns the most recently purchased (higher-cost) units to COGS first, so in rising prices COGS rises and net income falls versus FIFO.',
    },
    {
      id: 'L1-08',
      topic: 'ECONOMICS',
      vignette: 'Nominal GDP grew 6% over the year, while the GDP deflator grew 4% over the same period.',
      stem: 'Real GDP growth for the year is approximately:',
      options: ['10%', '2%', '1.5%'],
      correct: 1,
      explain: 'Real GDP growth ≈ nominal GDP growth − inflation (GDP deflator growth): 6% − 4% = 2%.',
    },
    {
      id: 'L1-09',
      topic: 'CORPORATE ISSUERS',
      vignette: "A firm's capital structure is 40% debt and 60% equity, measured at market value.",
      stem: 'In the WACC calculation, the after-tax cost of debt is multiplied by:',
      options: ['0.60', '0.40', '1.00'],
      correct: 1,
      explain: "Each capital component's cost is weighted by its share of the firm's market-value capital structure — debt's weight here is 40%.",
    },
    {
      id: 'L1-10',
      topic: 'ETHICS',
      vignette: "An analyst accepts a corporate-sponsored trip to a company's headquarters, paid for entirely by that company, before initiating research coverage.",
      stem: 'Under the Code and Standards, this is best described as:',
      options: [
        'Always a violation, regardless of disclosure',
        "Permitted only if paid for by the analyst's own firm, or fully disclosed",
        'Permitted with no restriction, since due-diligence trips are standard',
      ],
      correct: 1,
      explain: "Standard I(B) doesn't ban issuer-paid trips outright, but members should limit acceptance or have their own firm cover travel where practical — and at minimum disclose the benefit to avoid impaired objectivity.",
    },
    {
      id: 'L1-11',
      topic: 'EQUITY INVESTMENTS',
      vignette: 'An analyst is valuing a stable, mature company expected to pay a constant dividend growth rate indefinitely, using the Gordon Growth Model.',
      stem: "The stock's estimated value is calculated as next year's expected dividend divided by:",
      options: [
        'The required rate of return minus the growth rate',
        'The growth rate minus the required rate of return',
        'The required rate of return plus the growth rate',
      ],
      correct: 0,
      explain: 'Gordon Growth Model: V0 = D1 ÷ (r − g). Reversing the subtraction (g − r) would produce a negative denominator whenever r > g — which the model requires to make economic sense — a common sign-flip trap.',
    },
    {
      id: 'L1-12',
      topic: 'ALTERNATIVE INVESTMENTS',
      vignette: 'A hedge fund charges a 2% management fee and a 20% performance fee, with the performance fee calculated only on gains above a stated minimum required return.',
      stem: 'This minimum required return, below which no performance fee is charged, is best described as a:',
      options: ['High-water mark', 'Hurdle rate', 'Redemption gate'],
      correct: 1,
      explain: "A hurdle rate is the minimum return a fund must clear before performance fees apply to gains above it. A high-water mark is a related but different protection — it stops a manager being paid twice for the same gains after a loss — and a redemption gate restricts investor withdrawals; it isn't a fee-structure feature at all.",
    },
  ],

  2: [
    {
      id: 'L2-01',
      topic: 'FSA',
      vignette: 'A firm uses straight-line depreciation for financial reporting but accelerated depreciation for tax purposes.',
      stem: "Early in the asset's life, this mismatch creates a deferred tax:",
      options: [
        'Asset, because taxes paid now exceed reported tax expense',
        'Liability, because reported tax expense exceeds taxes actually paid',
        "Neither — depreciation method choice doesn't affect taxes",
      ],
      correct: 1,
      explain: 'Accelerated tax depreciation lowers taxable income more than book depreciation lowers pretax income early on — taxes paid are less than tax expense reported, creating a deferred tax liability that reverses later.',
    },
    {
      id: 'L2-02',
      topic: 'EQUITY INVESTMENTS',
      vignette: 'An analyst has calculated FCFF and now needs FCFE, given after-tax interest expense and net borrowing figures.',
      stem: 'To convert FCFF to FCFE, the analyst should:',
      options: [
        'Subtract after-tax interest expense and add net borrowing',
        'Add after-tax interest expense and subtract net borrowing',
        'Subtract net income and add depreciation',
      ],
      correct: 0,
      explain: "FCFE = FCFF − Interest×(1−tax rate) + Net Borrowing. FCFF covers all capital providers, so debt-holders' claim is carved out and net new borrowing added back to isolate equity's share.",
    },
    {
      id: 'L2-03',
      topic: 'FIXED INCOME',
      vignette: 'A bond portfolio manager is assessing interest rate risk for a bond that is callable by the issuer.',
      stem: 'Effective duration, rather than modified duration, is the appropriate measure here because effective duration:',
      options: [
        'Assumes cash flows stay fixed regardless of yield changes',
        'Accounts for how expected cash flows change as yields change, given the embedded option',
        'Is always numerically larger than modified duration',
      ],
      correct: 1,
      explain: "Modified duration assumes fixed cash flows. A callable bond's cash flows shift with rates (more likely to be called when rates fall) — effective duration captures that using an option-pricing model.",
    },
    {
      id: 'L2-04',
      topic: 'DERIVATIVES',
      vignette: 'Two counterparties enter a plain vanilla interest rate swap. One pays a fixed rate and receives floating.',
      stem: 'The fixed-rate payer profits over the life of the swap when floating rates:',
      options: ['Rise above the fixed rate', 'Fall below the fixed rate', 'Remain exactly at the fixed rate'],
      correct: 0,
      explain: "The fixed-rate payer receives floating and pays fixed, so they benefit when floating rates rise above the fixed rate they're locked into paying.",
    },
    {
      id: 'L2-05',
      topic: 'QUANT',
      vignette: 'A regression estimates stock returns using two independent variables, X1 and X2.',
      stem: 'The coefficient on X1 represents the expected change in Y for a one-unit change in X1:',
      options: ['Holding X2 constant', 'Assuming X2 changes proportionally too', 'Regardless of the value of X2'],
      correct: 0,
      explain: 'Each slope coefficient in multiple regression is a partial effect — the expected change in Y per unit change in that variable, holding the other independent variables constant.',
    },
    {
      id: 'L2-06',
      topic: 'FSA',
      vignette: 'A firm records a goodwill impairment charge during the year.',
      stem: 'All else equal, this charge:',
      options: [
        'Reduces net income and total assets, but does not change cash flow from operations',
        'Reduces net income and increases cash flow from operations',
        'Affects only the income statement, with no balance sheet impact',
      ],
      correct: 0,
      explain: "Impairment is a non-cash charge — it lowers net income and the carrying value of goodwill, but since it's added back to net income under the indirect method, CFO itself is unaffected.",
    },
    {
      id: 'L2-07',
      topic: 'ALTERNATIVE INVESTMENTS',
      vignette: "A private equity fund is three years into its life. Reported IRR is currently negative.",
      stem: 'This early negative IRR is best explained by:',
      options: [
        'Management fees and initial costs hitting before portfolio companies are marked up or exited',
        'Private equity investments reliably losing money in their first three years',
        'GPs deliberately understating valuations to reduce LP fees',
      ],
      correct: 0,
      explain: "The 'J-curve' reflects fees and called capital landing early, before investments mature and are marked up or realized — reported returns dip before recovering as exits occur.",
    },
    {
      id: 'L2-08',
      topic: 'FIXED INCOME',
      vignette: "A fixed income analyst wants to measure a bond portfolio's exposure to a twist in the yield curve, not just a parallel shift.",
      stem: 'For this purpose, the analyst should rely most on:',
      options: ['Effective duration', 'Key rate duration', 'Modified duration'],
      correct: 1,
      explain: 'Effective duration captures parallel-shift sensitivity well, but key rate duration isolates sensitivity to a single point on the curve — essential for non-parallel (twist/steepening) yield curve risk.',
    },
    {
      id: 'L2-09',
      topic: 'EQUITY INVESTMENTS',
      vignette: "An analyst is estimating a stock's justified forward P/E and revises the required rate of return on equity (r) upward.",
      stem: 'All else equal, this revision moves the justified forward P/E:',
      options: [
        'Higher, since discounting becomes less punitive',
        'Lower, since future cash flows are discounted more heavily',
        'It has no effect on justified P/E',
      ],
      correct: 1,
      explain: 'Justified P/E = (1−b) ÷ (r − g). A higher r increases the denominator, lowering the justified P/E — investors pay less per dollar of earnings when they demand a higher return.',
    },
    {
      id: 'L2-10',
      topic: 'CORPORATE ISSUERS',
      vignette: 'A firm is raising new equity capital and must account for flotation costs in its analysis.',
      stem: 'The preferred CFA-curriculum treatment of flotation costs is to:',
      options: [
        'Adjust the initial investment outlay in the NPV analysis, not the cost of capital',
        'Add flotation costs directly into the cost of equity formula as a permanent increase to r',
        "Ignore flotation costs, since they don't affect firm value",
      ],
      correct: 0,
      explain: "Flotation costs are a one-time cash outflow at the project's initiation, not a perpetual cost — so they adjust the investment outlay rather than permanently inflating the cost of capital.",
    },
    {
      id: 'L2-11',
      topic: 'ECONOMICS',
      vignette: 'The USD/EUR spot exchange rate (US dollars per euro) is 1.1000. The one-year interest rate is 5% in the US and 2% in the eurozone.',
      stem: 'Assuming covered interest rate parity holds, the one-year forward USD/EUR rate is closest to:',
      options: ['1.0680', '1.1324', '1.1000'],
      correct: 1,
      explain: 'Covered interest rate parity: F = S × (1 + i_price currency) ÷ (1 + i_base currency) = 1.10 × 1.05 ÷ 1.02 ≈ 1.1324. The USD carries the higher interest rate, so it must trade at a forward discount against the EUR — more USD are needed to buy one EUR forward than spot. Putting the rates in the wrong order (EUR on top) gives 1.0680 instead, the classic reversed-ratio trap.',
    },
    {
      id: 'L2-12',
      topic: 'PORTFOLIO MANAGEMENT',
      vignette: "An asset's contribution to total portfolio risk depends on its weight in the portfolio, its own volatility, and its correlation with the rest of the holdings.",
      stem: "An asset's contribution to total portfolio variance is calculated as its portfolio weight multiplied by:",
      options: [
        'Its own variance only',
        'Its covariance with the portfolio',
        "The portfolio's total variance",
      ],
      correct: 1,
      explain: "Contribution to portfolio variance = weight × covariance of that asset with the portfolio, not the asset's own standalone variance. This is why a volatile asset with low or negative correlation to the rest of the portfolio can contribute little — or even negative — risk despite a high standalone variance.",
    },
    {
      id: 'L2-13',
      topic: 'ETHICS',
      vignette: 'A firm claims GIPS compliance and presents a composite that includes only its best-performing discretionary accounts, excluding accounts that underperformed during the same period.',
      stem: 'This practice violates the GIPS requirement that composites:',
      options: [
        'Include all actual, fee-paying, discretionary portfolios that fit the composite\u2019s defined strategy',
        'Only include accounts with at least a three-year track record',
        'Exclude any account below a minimum asset size',
      ],
      correct: 0,
      explain: 'GIPS requires composites to include all actual, fee-paying, discretionary portfolios managed to that strategy. Cherry-picking only the top performers to inflate composite returns is exactly the survivorship-style bias composite construction rules are designed to prevent.',
    },
  ],

  3: [
    {
      id: 'L3-01',
      topic: 'ASSET ALLOCATION',
      vignette: "A portfolio manager deviates from the policy portfolio's target weights based on a short-term view that equities are undervalued.",
      stem: 'This action is best described as:',
      options: ['Strategic asset allocation', 'Tactical asset allocation', 'Rebalancing to policy weights'],
      correct: 1,
      explain: 'Tactical asset allocation involves deliberate short-term deviations from the strategic (policy) weights to exploit perceived mispricing — distinct from simply rebalancing back to target.',
    },
    {
      id: 'L3-02',
      topic: 'PRIVATE WEALTH (PATHWAY)',
      vignette: 'A client has high willingness to take risk (comfortable with volatility) but low ability to take risk (limited human capital, short horizon, thin liquid reserves).',
      stem: 'When willingness and ability conflict, the IPS risk tolerance should generally be set based on:',
      options: [
        "The higher of the two, reflecting the client's true preference",
        'The lower of the two — ability to take risk',
        'An average of willingness and ability',
      ],
      correct: 1,
      explain: "When the two conflict, the more conservative figure — usually ability — generally governs, since stated comfort with risk doesn't override an objective shortfall in capacity to bear losses.",
    },
    {
      id: 'L3-03',
      topic: 'PERFORMANCE MEASUREMENT',
      vignette: "A portfolio's active return versus its benchmark is decomposed into allocation effect and selection effect.",
      stem: 'Allocation effect measures the value added by:',
      options: [
        'Choosing which securities to hold within a sector, versus the benchmark',
        "Overweighting or underweighting sectors relative to the benchmark's sector weights",
        'The total difference between portfolio and benchmark return',
      ],
      correct: 1,
      explain: 'Allocation effect isolates the impact of over/underweighting sectors versus the benchmark; selection effect isolates security choice within each sector.',
    },
    {
      id: 'L3-04',
      topic: 'PORTFOLIO CONSTRUCTION',
      vignette: "A pension plan wants to immunize its bond portfolio against interest rate risk relative to its liabilities.",
      stem: 'Classical immunization is achieved primarily by matching:',
      options: [
        "The portfolio's yield to the plan's discount rate",
        "The portfolio's duration (and convexity) to the liabilities' duration",
        "The portfolio's credit rating to the liabilities' risk profile",
      ],
      correct: 1,
      explain: 'Matching asset duration (and ideally convexity) to liability duration means a parallel yield shift moves asset and liability present values by roughly equal amounts.',
    },
    {
      id: 'L3-05',
      topic: 'PRIVATE WEALTH (PATHWAY)',
      vignette: 'A client feels the pain of a $10,000 loss more intensely than the pleasure of an equivalent $10,000 gain.',
      stem: 'This describes:',
      options: ['Risk aversion', 'Loss aversion', 'Regret aversion'],
      correct: 1,
      explain: 'Loss aversion (from prospect theory) is specifically the asymmetry between the pain of losses and the pleasure of equivalent gains — distinct from general risk aversion, which concerns dislike of variance itself.',
    },
    {
      id: 'L3-06',
      topic: 'PRIVATE WEALTH (PATHWAY)',
      vignette: "A private wealth advisor is distinguishing between a client's core capital and excess capital.",
      stem: 'Core capital is best described as the capital needed to:',
      options: [
        'Fund lifetime spending needs with a high probability of not being depleted',
        "Maximize the client's total expected portfolio return",
        'Cover only the next 12 months of expenses',
      ],
      correct: 0,
      explain: "Core capital is the amount needed to sustain the client's spending goals for life; anything beyond it is 'excess capital,' which can be invested more aggressively or allocated to legacy goals.",
    },
    {
      id: 'L3-07',
      topic: 'PORTFOLIO CONSTRUCTION',
      vignette: 'A manager compares a percentage-of-portfolio (tolerance-band) rebalancing approach to a calendar rebalancing approach.',
      stem: 'Compared to calendar rebalancing, percentage-of-portfolio rebalancing generally results in:',
      options: [
        'Less frequent trading, regardless of market volatility',
        'Trading that responds directly to volatility — more often in volatile periods',
        'Identical trading frequency to calendar rebalancing',
      ],
      correct: 1,
      explain: 'Tolerance-band rebalancing triggers on actual drift, so it naturally trades more often when markets are volatile and drift happens faster — unlike calendar rebalancing, which trades on a fixed schedule regardless of drift.',
    },
    {
      id: 'L3-08',
      topic: 'ASSET ALLOCATION',
      vignette: 'A US-based investor holds unhedged foreign bonds. Over the holding period, the foreign currency depreciates against the dollar.',
      stem: 'All else equal, this currency move:',
      options: [
        "Increases the investor's total return in USD terms",
        "Decreases the investor's total return in USD terms",
        'Has no effect, since bond returns are independent of currency',
      ],
      correct: 1,
      explain: 'An unhedged foreign-currency depreciation reduces the USD value of foreign cash flows and principal, dragging down the USD-denominated total return, all else equal.',
    },
    {
      id: 'L3-09',
      topic: 'PERFORMANCE MEASUREMENT',
      vignette: 'An analyst is choosing a risk-adjusted performance measure for a portfolio that uses short-option strategies with significant negative return skew.',
      stem: 'The Sharpe ratio is a less appropriate measure here mainly because it:',
      options: [
        'Cannot be calculated when returns are non-normal',
        'Relies on standard deviation, which understates risk for strategies with fat tails or negative skew',
        "Requires a benchmark, which short-option strategies don't have",
      ],
      correct: 1,
      explain: "Sharpe ratio relies on standard deviation as the risk measure, which understates risk for strategies with fat tails or negative skew — it doesn't penalize tail risk the way it should.",
    },
    {
      id: 'L3-10',
      topic: 'PRIVATE WEALTH (PATHWAY)',
      vignette: "A client's IPS specifies an unusually large liquidity requirement for a one-time expense due in 18 months.",
      stem: 'This constraint most directly affects:',
      options: [
        "The client's return objective, which should be increased to compensate",
        'The strategic asset allocation, which should reserve sufficient low-volatility, liquid assets',
        "The client's tax status, which must be revised",
      ],
      correct: 1,
      explain: 'A near-term, sizeable liquidity need should be carved into safe, liquid assets (e.g., short-duration bonds/cash) so the money is available when needed, rather than sitting in volatile risk assets.',
    },
    {
      id: 'L3-11',
      topic: 'DERIVATIVES & RISK MGMT',
      vignette: 'A portfolio manager wants to reduce the beta of a $50 million equity portfolio from 1.0 to 0.6 using S&P 500 index futures (beta = 1.0, contract value = $250,000) without selling any stock.',
      stem: 'The number of futures contracts the manager should sell is closest to:',
      options: ['40', '80', '200'],
      correct: 1,
      explain: 'Contracts to sell = (target beta − current beta) ÷ futures beta × (portfolio value ÷ futures price) = (0.6 − 1.0) ÷ 1.0 × ($50,000,000 ÷ $250,000) = −0.4 × 200 = −80, i.e., sell 80 contracts. Using the full portfolio-to-futures ratio alone (200) would fully hedge the portfolio to a beta of zero, not scale it down to the target 0.6.',
    },
    {
      id: 'L3-12',
      topic: 'ETHICS',
      vignette: "A portfolio manager, without updating a retired client's investment policy statement, shifts the portfolio into a concentrated position in speculative technology stocks because the manager is personally confident in the sector.",
      stem: 'This action most likely violates:',
      options: [
        'Standard III(C) – Suitability',
        'Standard V(A) – Diligence and Reasonable Basis',
        'Standard I(C) – Misrepresentation',
      ],
      correct: 0,
      explain: "Standard III(C) requires recommendations and actions to be suitable for the client's documented objectives, risk tolerance, and constraints. A concentrated, speculative allocation for a retiree — without updating the IPS to reflect any real change in objectives — is a suitability breach, not a diligence or misrepresentation issue.",
    },
    {
      id: 'L3-13',
      topic: 'PORTFOLIO MGMT (PATHWAY)',
      vignette: 'An institutional portfolio manager compares a full replication approach to a stratified sampling approach for tracking a broad equity index.',
      stem: 'Compared to full replication, stratified sampling generally results in:',
      options: [
        'Lower tracking error but higher transaction costs',
        'Higher tracking error but lower transaction costs',
        'Identical tracking error and transaction costs',
      ],
      correct: 1,
      explain: 'Stratified sampling holds a representative subset of index constituents rather than every security, cutting transaction and rebalancing costs — but that approximation introduces tracking error that full replication (holding every constituent) avoids.',
    },
    {
      id: 'L3-14',
      topic: 'PRIVATE MARKETS (PATHWAY)',
      vignette: 'A private equity fund evaluates a leveraged buyout target using higher debt levels than are typical for the target\u2019s industry peers.',
      stem: 'All else equal, increasing leverage in an LBO primarily increases equity returns by:',
      options: [
        'Reducing the total purchase price of the target',
        'Reducing the amount of equity capital required, magnifying returns on that smaller equity base',
        'Eliminating the need for an exit strategy',
      ],
      correct: 1,
      explain: 'Higher leverage means debt funds more of the purchase price, so the sponsor commits less equity capital. If the deal performs, that smaller equity base earns a proportionally larger return — the classic leverage effect — though it also raises financial risk if performance disappoints.',
    },
  ],
};

export const QUICKSHEETS = {
  1: {
    label: 'Quicksheet · Fixed Asset Turnover',
    formula: 'Net Revenue ÷ Average Net Fixed Assets',
    note: 'Capitalizing a cost (vs. expensing it) pushes it onto the balance sheet, not the income statement — it inflates the denominator, so the ratio falls. Same logic hits ROA and asset turnover generally.',
  },
  2: {
    label: 'Quicksheet · FCFF → FCFE',
    formula: 'FCFE = FCFF − Int×(1−t) + Net Borrowing',
    note: "FCFF belongs to all capital providers. Carve out debt-holders' after-tax claim, then add back net new borrowing to isolate what's left for equity.",
  },
  3: {
    label: 'Quicksheet · Ability vs. Willingness',
    formula: 'Risk tolerance = min(Ability, Willingness) — when they conflict',
    note: 'A client can want more risk than they can actually afford to take. When the two disagree, ability (the objective constraint) usually governs the IPS.',
  },
};

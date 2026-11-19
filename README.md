# AI Fake News Hub & Verification Platform
### Official YSSE Department of IT — Implementation Architecture

An enterprise-grade, deterministic fact-checking, hallucination detection, and AI verification ecosystem combining a multi-sheet relational data ledger with the **VeritasAI Verification Engine**, the **Week 6 Deep Journalistic Fact-Checking Module**, and the **Week 7 AI Output Classification & Human Review Hub**.

---

## 1. System Architecture Overview

```
                                      +---------------------------------------------+
                                      |    Multi-Channel Ingestion Pipeline         |
                                      | (Google Forms / Veritas Ingestion API / UI) |
                                      +----------------------+----------------------+
                                                             |
                                                             v
+-------------------------------------------------------------------------------------------------------------------+
|                                  Core Relational Data Hub (5-Sheet Architecture)                                   |
|                                                                                                                   |
|  [Sheet 1: Claim_Verification] <====(1:N FK)====> [Sheet 2: Source_Verification]                                  |
|  - Claim ID (PK: CLM001...)                       - Source ID (PK: SRC001...)                                     |
|  - Date, Claim, Category                          - Claim ID (FK -> Claim_Verification)                           |
|  - AI Tool, Prompts & Responses                   - Source Title, Publisher, URL, Source Type                     |
|  - Verification Status, Evidence, Reviewer        - Source Status, Empirical Findings                             |
|                                                                                                                   |
|  [Sheet 3: AI_Response_Comparison]               [Sheet 4: Fake_News_Investigation]   [Sheet 5: Bias_Analysis]     |
|  - Cross-Model Benchmarking                       - Fictional Dossiers & Rewrites      - Tripartite Multi-Angle     |
|  - GPT-4o vs Gemini vs DeepSeek                   - Claims Extracted & Disproven       - Ideological & Loaded Lex  |
+------------------------------------------------------------+------------------------------------------------------+
                                                             |
                                                             v
+------------------------------------------------------------+------------------------------------------------------+
|                     Looker Studio Business Intelligence Layer & Live KPI Engine                                   |
|  - Total Claims Submitted:  =COUNTA(Claim_Verification!A2:A)       (N = 32, threshold >= 30)                      |
|  - Total Verified:          =COUNTIF(Claim_Verification!H2:H, "Verified")                                        |
|  - Total False:             =COUNTIF(Claim_Verification!H2:H, "False")                                           |
|  - Total Misleading:        =COUNTIF(Claim_Verification!H2:H, "Misleading")                                      |
|  - Total Unverifiable:      =COUNTIF(Claim_Verification!H2:H, "Unverifiable")                                    |
|  - Total Pending:           =COUNTIF(Claim_Verification!H2:H, "Pending")                                         |
|  - Fabricated Sources:      =COUNTIF(Source_Verification!H2:H, "Fabricated Source")  (N = 24, threshold >= 20)    |
|  Visualizations: Status Donut, Model Grouped Bars, Domain Hallucinations, Cumulative Time Series, Source Ledger    |
+-------------------------------------------------------------------------------------------------------------------+
                                                             |
                                                             v
+-------------------------------------------------------------------------------------------------------------------+
|                                VeritasAI Verification Engine (Interactive Module)                                 |
|  Stage 1: Claim Ingestion & Metadata (Category, AI Model, Verbatim Generation)                                    |
|  Stage 2: Sentence Decomposer (Factual / Opinion / Statistical / Contextual categorization & flagging)           |
|  Stage 3: 100-Point VQI Rubric Scoring (Factual, Reliability, Statistical, Context, Bias, Recency, Sufficiency)   |
|  Stage 4: Real-Time Thresholds & Non-Compensatory Safety Overrides (HARD_FALSE, HARD_UNVERIFIABLE, HIGH_RISK)     |
|  Stage 5: Evidence Archival Ledger (Primary DOI / Academic Literature Corroboration)                              |
|  Stage 6: Adjudication Verdict & Radar Analysis Profile                                                           |
|  Stage 7: Forensic Audit Dossier & JSON Ledger Export                                                             |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 2. 5-Sheet Relational Database Specifications

All production CSV files are located in `/data-templates` and are directly importable into Google Sheets:

### Table 1: `Claim_Verification` (Master Claims Registry — 32 Adjudicated Claims)
- **Primary Key**: `Claim ID` (format `CLM001` through `CLM032`)
- **Attributes**: `Date`, `Claim`, `Category`, `AI Tool`, `Original Prompt`, `AI Response`, `Verification Status`, `Evidence Summary`, `Confidence`, `Reviewer`.
- **Validation Domains**:
  - `Category`: `Science`, `Business`, `History`, `Technology`, `Public Health`, `General Knowledge`
  - `AI Tool`: `ChatGPT`, `Gemini 3.8 Flash`, `DeepSeek`
  - `Verification Status`: `Pending`, `Verified`, `False`, `Misleading`, `Unverifiable`
  - `Confidence`: `High`, `Medium`, `Low`

### Table 2: `Source_Verification` (Bibliographic & Archival Ledger — 24 Verified Sources)
- **Primary Key**: `Source ID` (format `SRC001` through `SRC024`)
- **Foreign Key**: `Claim ID` referencing `Claim_Verification.Claim ID`
- **Attributes**: `Source Title`, `Publisher`, `URL` (resolving DOI/gov links), `Source Type`, `Publication Date`, `Source Status`, `Evidence Notes`.
- **Validation Domains**:
  - `Source Type`: `Government/Statute`, `Q1 Academic`, `Multilateral Agency`, `News Registry`
  - `Source Status`: `Verified`, `Real but Misrepresented`, `Fabricated Source`, `Unable to Verify`

### Table 3: `AI_Response_Comparison` (Cross-Model Benchmarking — 10 Test Cases)
- **Primary Key**: `Test ID` (`TEST001` - `TEST010`)
- **Attributes**: `Question`, `ChatGPT Response`, `Gemini Response`, `DeepSeek Response`, `Differences`, `Incorrect Claims`, `Final Finding`.
- Evaluates model hallucinations, conflated population metrics, fabricated citations, and obsolete statutes.

### Table 4: `Fake_News_Investigation` (Deconstruction Dossiers — 8 Full Dossiers)
- **Primary Key**: `News ID` (`NEWS001` - `NEWS008`)
- **Attributes**: `Headline`, `News Category`, `Original AI-generated Article` (150-200 words, flagged `[FICTIONAL]`), `Number of Claims`, `False Claims Found`, `Misleading Claims Found`, `Corrected Headline`, `Corrected Article`, `Investigation Report`, `Final Status` (`Debunked` / `Fabricated`).

### Table 5: `Bias_Analysis` (Multi-Perspective Evaluation — 10 Complex Cases)
- **Primary Key**: `Analysis ID` (`BIAS001` - `BIAS010`)
- **Attributes**: `Question`, `AI Tool`, `Response`, `One-sided Arguments`, `Missing Perspectives`, `Unsupported Assumptions`, `Emotionally Loaded Language`, `Bias Level` (`Low`, `Medium`, `High`), `Researcher's Conclusion`.

---

## 3. Looker Studio BI Layer & KPI Formulas

The platform embeds real-time KPI metrics and calculations matching exact Google Sheets formula syntax:

| Metric | Google Sheets Formula | Result | Threshold Met |
| :--- | :--- | :---: | :---: |
| **Total Claims Submitted** | `=COUNTA(Claim_Verification!A2:A)` | **32** | Passed (Min 30) |
| **Total Verified** | `=COUNTIF(Claim_Verification!H2:H, "Verified")` | **10** | Dynamic |
| **Total False** | `=COUNTIF(Claim_Verification!H2:H, "False")` | **8** | Dynamic |
| **Total Misleading** | `=COUNTIF(Claim_Verification!H2:H, "Misleading")` | **6** | Dynamic |
| **Total Unverifiable** | `=COUNTIF(Claim_Verification!H2:H, "Unverifiable")` | **4** | Dynamic |
| **Total Pending** | `=COUNTIF(Claim_Verification!H2:H, "Pending")` | **4** | Dynamic |
| **Total Fabricated Sources** | `=COUNTIF(Source_Verification!H2:H, "Fabricated Source")` | **5** | Independent (Min 20 sources recorded: 24 total) |

### Embedded Visualizations
1. **Donut Chart**: Proportion of Claims by Verification Status with center counter.
2. **Grouped Bar Chart**: Comparative accuracy and error distribution across ChatGPT, Gemini 3.8 Flash, and DeepSeek.
3. **Stacked Bar Chart**: Hallucination and distortion rate categorized across knowledge domains.
4. **Time Series Area Chart**: Cumulative velocity of adjudicated claims processed over time.
5. **Source Breakdown Chart**: Quality proportion of primary literature (Verified vs Fabricated vs Misrepresented).
6. **Interactive Data Table**: Sortable, searchable, paginated ledger with status badges and confidence ratings.

---

## 4. VeritasAI 100-Point VQI Rubric & Safety Overrides

The VeritasAI Engine implements a non-compensatory scoring rubric:

### Criterion Point Allocations (100 Points Total)
- **Factual Accuracy (FA)**: Max 25 points
- **Source Reliability (SR)**: Max 20 points
- **Statistical Accuracy (SA)**: Max 15 points
- **Contextual Accuracy (CA)**: Max 15 points
- **Bias Assessment (BA)**: Max 10 points
- **Information Recency (IR)**: Max 5 points
- **Evidence Sufficiency (ES)**: Max 10 points

### Non-Compensatory Safety Overrides
- **Hard FALSE Override**: If `Factual Accuracy < 10`, verdict is **forced to "False"** regardless of the total VQI score.
- **Hard UNVERIFIABLE Override**: If `Evidence Sufficiency < 4`, verdict is **forced to "Unverifiable"** (unless already False).
- **High-Risk Domain Gateway**: If Category is tagged as `Public Health`, `Legal/Statute`, or `Critical Infrastructure`, claim **cannot achieve "Verified"** unless `Factual Accuracy >= 22` AND `Source Reliability >= 18`.
- **General Boundaries**:
  - `Verified`: `VQI >= 85` AND `Factual Accuracy >= 22` AND `Source Reliability >= 16`.
  - `Misleading`: `VQI in [50, 84]` AND `Factual Accuracy >= 12` AND `Contextual Accuracy < 8`.
  - `False`: `Factual Accuracy < 10` OR `VQI < 50`.
  - `Unverifiable`: `Evidence Sufficiency < 4` OR conflicting/inaccessible data.

---

## 5. Getting Started & Running the Platform

### Prerequisites
- Node.js 18+ (tested on Node.js v20 and v25)
- npm or pnpm

### Installation
```bash
cd ai-fake-news-hub
npm install
```

### Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm run start
```

---

## 6. Directory Structure

```
ai-fake-news-hub/
├── data-templates/                       # Production-ready datasets (Week 5, 6 & 7)
│   ├── Claim_Verification.csv            # Week 5 Master Claims (32 rows)
│   ├── Source_Verification.csv           # Week 5 Source Ledger (24 rows)
│   ├── AI_Response_Comparison.csv        # Week 5 Model Comparison (10 rows)
│   ├── Fake_News_Investigation.csv       # Week 5 Dossiers (8 rows)
│   ├── Bias_Analysis.csv                 # Week 5 Bias Cases (10 rows)
│   ├── Week6_News_Selection.csv          # Week 6 Articles (5 dossiers)
│   ├── Week6_Claims_50.csv               # Week 6 Extracted Claims (50 rows)
│   ├── Week6_Evidence_Repository.csv     # Week 6 Evidence (50 rows)
│   ├── Week6_AI_vs_Human_Comparison.csv  # Week 6 Model Audits (50 rows)
│   ├── Week6_AI_Errors_Audit.csv         # Week 6 Documented Errors (10 rows)
│   ├── Week6_Source_Reliability.csv      # Week 6 10-pt Rubric Metrics
│   ├── Week7_Classification_30.csv       # Week 7 30 Claims Classification
│   ├── Week7_Human_Review.csv            # Week 7 Human Adjudication Audit
│   ├── Week7_JSON_Dataset.json           # Week 7 Full Structured JSON Archive
│   └── Week7_System_Testing_TC10.csv     # Week 7 TC01-TC10 Validation Ledger
├── src/
│   ├── app/
│   │   ├── globals.css                   # Styling (Inter typography, badges, cards, tabs)
│   │   ├── layout.tsx                    # Root HTML layout & fonts
│   │   └── page.tsx                      # Main ecosystem view coordinator & tab routing
│   ├── components/
│   │   ├── Sidebar.tsx                   # Ecosystem navigation & dataset metrics
│   │   ├── week7/                        # Week 7 AI Classification Hub & Review Platform
│   │   │   └── Week7ClassificationHub.tsx
│   │   ├── week6/                        # Week 6 News Investigation & Fact-Checking Hub
│   │   │   └── Week6InvestigationHub.tsx
│   │   ├── dashboard/                    # Looker Studio BI Dashboard components
│   │   │   ├── KPICards.tsx
│   │   │   ├── DonutChart.tsx
│   │   │   ├── BarCharts.tsx
│   │   │   ├── TimeSeriesChart.tsx
│   │   │   ├── SourceBreakdown.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── DashboardView.tsx
│   │   ├── veritas/                      # VeritasAI 7-Stage Interactive Pipeline
│   │   │   ├── SentenceDecomposer.tsx
│   │   │   ├── CriterionSliders.tsx
│   │   │   ├── ThresholdBar.tsx
│   │   │   ├── OverrideAlerts.tsx
│   │   │   ├── EvidenceCitationForm.tsx
│   │   │   ├── BenchmarkCases.tsx
│   │   │   ├── AuditExport.tsx
│   │   │   └── VeritasEngine.tsx
│   │   ├── database/                     # Relational Schema Interactive Hub
│   │   │   └── DatabaseView.tsx
│   │   └── testing/                      # Interactive Validation Suite (TC01-TC05)
│   │       └── TestRunnerView.tsx
│   ├── data/                             # Typed datasets strictly conforming to interfaces
│   │   ├── claimVerification.ts          (32 Week 5 records)
│   │   ├── sourceVerification.ts         (24 Week 5 records)
│   │   ├── aiResponseComparison.ts       (10 records)
│   │   ├── fakeNewsInvestigation.ts      (8 dossiers)
│   │   ├── biasAnalysis.ts               (10 analyses)
│   │   ├── benchmarkCases.ts             (5 test suites)
│   │   ├── week6Investigation.ts         (5 Articles, 50 Claims, 50 Evidence, 10 Errors)
│   │   └── week7ClassificationData.ts    (30 Claims, 10 Test Cases, Metrics)
│   └── lib/
│       ├── types.ts                      # TypeScript relational contracts (Week 5 + Week 6)
│       ├── vqiEngine.ts                  # Deterministic VQI mathematical logic & overrides
│       └── week7Types.ts                 # TypeScript definitions for Week 7 classification
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 7. Week 6 Extension: AI + Human Fact-Checking Integration

In Week 6, the platform was expanded to support real-world journalistic fact-checking across five domains (*Politics & Public Affairs*, *Business & Economics*, *Science & Technology*, *Health & Education*, and *International Affairs*) with full human-in-the-loop adjudication via `Week6InvestigationHub.tsx` (`?tab=week6`).

### Implemented Week 6 Modules
1. **7.1 Claim Verification Database (`Week6_Claims_50.csv`):** 50 extracted factual claims (`CLM001`–`CLM050`) linked to articles `ART01`–`ART05`, searchable by category, article, and final verdict (`Verified`, `False`, `Misleading`, `Partially True`, `Unverifiable`), with one-click CSV export.
2. **7.2 & 7.4 Source & Evidence Repository (`Week6_Evidence_Repository.csv`):** 50 documentary evidence records (`EVI001`–`EVI050`) storing canonical URLs, publication dates, access timestamps (`2026-11-11`), verbatim excerpts, supporting/contradicting classifications, and the **10-Point Source Reliability Scoring Rubric** (`Authority 2 + Authenticity 2 + Relevance 2 + Transparency 2 + Recency 2`).
3. **7.3 AI vs. Human Comparison Engine (`Week6_AI_vs_Human_Comparison.csv`):** Side-by-side audit comparing **ChatGPT (GPT-4o)**, **Google Gemini (1.5 Pro)**, and **DeepSeek (V3/R1)** against ground-truth human verdicts, highlighting the **20.0% AI–Human Disagreement Rate (10/50)** and cataloging **10 Documented AI Errors (`ERR01`–`ERR10`)**.
4. **7.5 News Investigation Records (`Week6_News_Selection.csv`):** Complete dossiers for all 5 articles (`ART01`–`ART05`) including pre-AI Q1–Q6 credibility audits, overall verdicts, and side-by-side **Original Misleading Text vs. Corrected Factual Rewrites**.
5. **7.6 Updated Verification Dashboard:** Live KPI tracking for all 8 required indicators:
   - Total News Articles Investigated: **5**
   - Total Factual Claims Extracted: **50**
   - Independently Verified Claims: **37 (74.0%)**
   - Claims Classified as False: **9 (18.0%)**
   - Misleading Claims: **3 (6.0%)**
   - Partially True Claims: **1 (2.0%)**
   - Unverifiable Claims: **0 (0.0%)**
   - AI–Human Disagreement Rate: **20.0% (10 Discrepancies)**
6. **7.7 Interactive Platform Demonstration:** Built-in 5-stage ingestion simulator allowing reviewers to submit a new article, record multi-model AI assessments, attach primary documentary evidence, commit a human verdict, and observe real-time KPI updates across the dashboard.

---

## 8. Week 7 Extension: AI Output Classification, Parallel Inference & Human Review Hub

In Week 7, the ecosystem was expanded with a dedicated **AI Output Classification & Systematic Verification Pipeline** accessible directly via `Week7ClassificationHub.tsx` (`?tab=week7`). The module delivers enterprise-grade verification, multi-model consensus adjudication, calibrated confidence estimation, and rigorous human-in-the-loop review.

### 8.1 30-Claim Multi-Model Classification Ledger (`Week7_Classification_30.csv`)
- **30 Evaluated Claims (`CLM-01` to `CLM-30`)** spanning 5 core domains:
  - *Politics & Public Affairs* (`CLM-01` – `CLM-05`)
  - *Economy & International Finance* (`CLM-06` – `CLM-10`)
  - *Science, Technology & AI* (`CLM-11` – `CLM-15`)
  - *Health, Environment & Agriculture* (`CLM-16` – `CLM-20`)
  - *Social Trends & Human Rights* (`CLM-21` – `CLM-30`)
- **Parallel Multi-Model Inference**:
  - Independent classification by **GPT-4o** and **Gemini 1.5 Pro** into canonical labels: `Real`, `Fake`, `Suspicious`.
  - Continuous confidence scoring (0–100%) mapped into 3 standardized confidence bands:
    - **High**: 80% – 100%
    - **Medium**: 50% – 79%
    - **Low**: 0% – 49%
  - Explicit uncertainty factor tagging (`unverified_social_media`, `conflicting_casualty_logs`, `counterfactual_historical_claim`, `unsubstantiated_cure_claim`, `no_consensus_on_threshold`, etc.).

### 8.2 Human Review & Disagreement Adjudication (`Week7_Human_Review.csv`)
- **Audit Workflow**: Tracks human expert adjudication against multi-model AI consensus across all 30 claims.
  - Review status tracking: **Approved (22 claims, 73.3%)**, **Corrected (5 claims, 16.7%)**, **Escalated (2 claims, 6.7%)**, **Unresolved (1 claim, 3.3%)**.
  - Ground-truth human verdict distribution: **12 Real (40.0%)**, **13 Fake (43.3%)**, **5 Suspicious (16.7%)**.
  - **AI–Human Agreement Rate**: **73.3% (22/30)**.
  - **Identified Discrepancies (8/30, 26.7%)**: Categorized under formal taxonomies:
    - *Over-optimistic AI gullibility on unratified agreements* (e.g. `CLM-05`)
    - *Under-detection of institutional caveats and statistical qualifiers* (e.g. `CLM-09`, `CLM-14`)
    - *Premature falsification of emerging unverified claims without counter-evidence* (e.g. `CLM-27`)
    - *Complex technical nuances requiring specialist referral* (e.g. `CLM-15`)

### 8.3 Structured JSON Verification Dataset (`Week7_JSON_Dataset.json`)
- Production-ready schema housing complete records:
  - Claim identification, publisher, publication date, and primary source URL.
  - Full model inference outputs (model name, prediction, confidence score, confidence band, explanation, and uncertainty tags).
  - Primary evidence linkage with credibility ratings (1–10 scale) and verbatim supporting/refuting excerpts.
  - Human review audit trails (final human category, reviewer identity, timestamp, review status, and reasoning).

### 8.4 System Quality & Functional Validation Suite (`Week7_System_Testing_TC10.csv`)
- 10 rigorous end-to-end verification test cases verified within the interactive UI:
  - **TC-01**: Standard Factual Text Ingestion & Mandatory Schema Compliance
  - **TC-02**: Dual-Model Parallel Classification & Concordance Verification
  - **TC-03**: Calibrated Confidence Band Categorization & Thresholding
  - **TC-04**: Uncertainty Reason Tagging & Epistemic Warning Generation
  - **TC-05**: Primary Evidence Retrieval & Institutional Hyperref Linkage
  - **TC-06**: Human Review Approval Workflow & Reactive State Update
  - **TC-07**: Human Review Correction Override & Confusion Matrix Recalculation
  - **TC-08**: Specialist Escalation Routing for Frontier Scientific Claims
  - **TC-09**: Unresolved Claim Preservation (Safeguard: Absence of Proof ≠ Proof of Falsity)
  - **TC-10**: Dashboard Metric Aggregation & Derivation Consistency (100% Mathematical Parity)

### 8.5 Interactive Classification Platform Features
- **Live Confusion Matrix**: Visual comparison grid mapping Multi-Model AI Consensus (`Real` / `Fake` / `Suspicious`) against Final Human Adjudications with interactive cell drilldowns.
- **Dynamic Category & Confidence Filtering**: Instant search across 30 records with badge filters by Review Status, Domain, Confidence Band, and Disagreement toggles.
- **In-Browser Interactive Test Runner**: Built-in test execution engine with status badges, latency tracking, diff inspectors, and downloadable CSV audit dossiers.
- **Claim Submission Simulator**: Interactive form to input new claims, select categories, simulate multi-model inference, and inspect uncertainty factors in real time.



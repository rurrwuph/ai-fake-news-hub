# AI Fake News Hub & Verification Platform
### Official YSSE Department of IT — Implementation Architecture

An enterprise-grade, deterministic fact-checking, hallucination detection, and AI verification ecosystem combining a **5-sheet relational data ledger** (Google Sheets / Looker Studio architecture) with the **VeritasAI Verification Engine** (a deterministic, client-side React/Next.js single-page interactive pipeline).

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
├── data-templates/               # 5 production-ready CSV files for Google Sheets
│   ├── Claim_Verification.csv
│   ├── Source_Verification.csv
│   ├── AI_Response_Comparison.csv
│   ├── Fake_News_Investigation.csv
│   └── Bias_Analysis.csv
├── src/
│   ├── app/
│   │   ├── globals.css           # Professional styling (Inter, custom badges, cards)
│   │   ├── layout.tsx            # Root HTML layout
│   │   └── page.tsx              # Main ecosystem view coordinator
│   ├── components/
│   │   ├── Sidebar.tsx           # Collapsible ecosystem navigation & table counters
│   │   ├── dashboard/            # Looker Studio BI Dashboard components
│   │   │   ├── KPICards.tsx
│   │   │   ├── DonutChart.tsx
│   │   │   ├── BarCharts.tsx
│   │   │   ├── TimeSeriesChart.tsx
│   │   │   ├── SourceBreakdown.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── DashboardView.tsx
│   │   ├── veritas/              # VeritasAI 7-Stage Interactive Pipeline
│   │   │   ├── SentenceDecomposer.tsx
│   │   │   ├── CriterionSliders.tsx
│   │   │   ├── ThresholdBar.tsx
│   │   │   ├── OverrideAlerts.tsx
│   │   │   ├── EvidenceCitationForm.tsx
│   │   │   ├── BenchmarkCases.tsx
│   │   │   ├── AuditExport.tsx
│   │   │   └── VeritasEngine.tsx
│   │   └── database/             # 5-Sheet Relational Schema Interactive Hub
│   │       └── DatabaseView.tsx
│   ├── data/                     # Typed datasets strictly conforming to interfaces
│   │   ├── claimVerification.ts  (32 records)
│   │   ├── sourceVerification.ts (24 records)
│   │   ├── aiResponseComparison.ts (10 records)
│   │   ├── fakeNewsInvestigation.ts (8 dossiers)
│   │   ├── biasAnalysis.ts       (10 analyses)
│   │   └── benchmarkCases.ts     (5 test suites)
│   └── lib/
│       ├── types.ts              # TypeScript relational contracts
│       └── vqiEngine.ts          # Deterministic VQI mathematical logic & overrides
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```


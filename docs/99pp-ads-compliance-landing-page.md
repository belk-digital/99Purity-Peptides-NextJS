# 99 Purity Peptides — Google Ads Compliance Landing Page
### Build Spec & Copy — Hand off directly to Antigravity

---

## 0. Prompt for Antigravity

> Build a single, standalone Next.js page at the route `/research-inquiry` on the existing 99puritypeptides.com site (no subdomain). This page must be **fully isolated** from the rest of the site: it does NOT import or render the shared site header, nav, or footer — build a page-local header (logo + page title only, no nav links) and a minimal page-local footer (see §2.8). No component on this page may link to `/shop`, `/product/*`, `/cart`, `/checkout`, `/affiliates`, or any other page on the main site, and no other page on the main site should link to this one except a single low-visibility footer or contact-menu entry if the client requests it. This page exists to pass Google Ads restricted-category review for a research-compound supplier and must contain **zero** product names, dosages, pricing, "buy/shop/order" CTAs, or outbound links to the transactional store. The only interactive element is a lead-capture form that submits to an API route (`/api/research-inquiry`) and stores/forwards submissions (POST to email or a webhook — leave a `TODO` for the endpoint). Use the copy, section order, and form schema exactly as specified below. Style: dark clinical/biotech aesthetic consistent with the existing 99 Purity Peptides brand (deep charcoal/black background, teal accent, clean sans-serif, generous whitespace). Fully responsive. No tracking pixels beyond a single placeholder for Google Ads conversion tag (`TODO: insert conversion ID`).
>
> **Page URL:** `https://99puritypeptides.com/research-inquiry`

---

## 1. Compliance Rules (non-negotiable — apply to every section)

- ❌ No peptide, compound, or blend names anywhere (not in visible text, alt text, meta tags, schema, or form dropdowns)
- ❌ No pricing, "$", "from $X", or promotional/discount language
- ❌ No "Shop," "Buy," "Order," "Add to Cart," "Checkout" — use **"Explore"** for browsing/education CTAs and **"Submit"** or **"Request"** for the form CTA
- ❌ No therapeutic, diagnostic, or human-use language (no "treats," "helps you," "results," "weight loss," etc.)
- ❌ No outbound links to `/shop`, `/product/*`, cart, or checkout
- ✅ Every mention of the category must carry RUO framing (research use only)
- ✅ FDA/RUO disclaimer must appear above the fold or in the hero region, not just buried in the footer
- ✅ Age/professional-affiliation gate on the form (self-attestation checkbox)

---

## 2. Page Copy

### 2.1 Meta / SEO Tags
```
Title: Research Compound Sourcing for Laboratories | 99 Purity Peptides
Meta Description: US-based, third-party lab-verified research compounds for accredited laboratories and institutions. Research use only. Submit your requirements to connect with our research supply team.
```

### 2.2 Hero Section
```
Eyebrow: FOR RESEARCH & LABORATORY USE ONLY

Headline: Verified-Purity Research Compounds, Sourced for Serious Labs.

Subheadline: We supply accredited research institutions and laboratories with
third-party HPLC/MS-verified compounds, full chain-of-custody documentation,
and batch-specific certificates of analysis. Not for human or veterinary use.

CTA button: Submit Your Research Requirements  → scrolls to #inquiry-form

Micro-disclaimer (small text, directly under CTA):
"Products discussed are for research and laboratory use only. Not evaluated
by the FDA. Not intended for human or animal use, diagnosis, treatment, or
consumption."
```

### 2.3 Trust / Quality Section
```
Section heading: Why Research Teams Source Through Us

Three-column layout:

1. Independently Verified
   Every batch is tested by accredited third-party U.S. laboratories before
   it reaches inventory — no reliance on manufacturer claims.

2. Full Documentation
   Certificates of analysis, HPLC chromatograms, and mass spectrometry
   identity data are available for every batch, supporting reproducible
   research protocols.

3. U.S.-Based Supply Chain
   Manufactured and processed domestically under controlled quality
   systems, with cold-chain logistics from batch to bench.
```

### 2.4 Research Categories (generic — no compound names)
```
Section heading: Research Areas We Support

Explore the categories our laboratory partners most frequently source for.
This section is informational only — submit the form below to discuss your
specific research requirements with our team.

Grid of 6 cards (icon + label + one-line description, non-clickable or
linking only to an on-page anchor, never to /shop):

- Metabolic & Endocrine Research
  Compounds studied in metabolic signaling and hormone-axis research models.

- Tissue & Recovery Research
  Compounds used in models of tissue repair, regeneration, and inflammatory
  response.

- Cognitive & Neurological Research
  Compounds studied in models of neuroprotection, stress response, and
  cognitive performance.

- Dermal & Connective Tissue Research
  Compounds used in dermal remodeling and connective-tissue research models.

- Longevity & Cellular Research
  Compounds studied in mitochondrial function and cellular aging research.

- Custom & Blend Formulations
  Multi-compound research formulations developed to your lab's protocol
  specifications.
```

### 2.5 Process Section
```
Section heading: How It Works

1. Submit Your Requirements
   Tell us about your institution, research focus, and what you need.

2. We Review & Respond
   Our team confirms availability, documentation, and lead times.

3. Documentation-First Fulfillment
   Every shipment ships with full COA and chain-of-custody records.
```

### 2.6 Compliance / RUO Statement (standalone block, not just footer)
```
Section heading: Research Use Only — Please Read

The content on this page has not been evaluated or approved by the U.S.
Food and Drug Administration (FDA). Products referenced are offered
exclusively for research and laboratory purposes and are not intended to
diagnose, treat, cure, or prevent any disease. 99 Purity Peptides is not a
compounding pharmacy and does not operate as a chemical compounding
facility as defined under Section 503A of the Federal Food, Drug, and
Cosmetic Act. Products are not for human or veterinary use and are not
intended for ingestion, injection, or any form of administration. By
submitting the form below, you confirm you are inquiring on behalf of a
laboratory, research institution, or accredited organization for research
purposes only.
```

### 2.7 Lead Capture Form — `#inquiry-form`
```
Section heading: Tell Us What Your Research Requires

Form fields:
1. Full Name (text, required)
2. Email Address (email, required)
3. Phone Number (tel, optional)
4. Organization / Institution Name (text, required)
5. Role (select, required)
   Options: Principal Investigator, Lab Technician, Research Scientist,
   Procurement/Purchasing, Academic/University Affiliate, Other
6. Research Area of Interest (multi-select or dropdown, required)
   Options mirror the 6 category cards above (Metabolic & Endocrine,
   Tissue & Recovery, Cognitive & Neurological, Dermal & Connective
   Tissue, Longevity & Cellular, Custom/Blend) + "Not sure / need guidance"
7. Describe Your Requirements (textarea, required)
   Placeholder: "Tell us about your research protocol, quantities, timeline,
   or documentation needs."
8. Attestation checkbox (required):
   "I confirm I am 21 years of age or older and am submitting this inquiry
   on behalf of a laboratory, research institution, or accredited
   organization for research use only."
9. Submit button label: "Submit Requirements"

Post-submit confirmation message:
"Thank you. A member of our research supply team will follow up within
1–2 business days to confirm details and documentation."
```

### 2.8 Footer
```
Minimal footer only — no shop/product links.

- Company name + © year
- Link: Privacy Policy
- Link: Terms of Service
- Link: Medical Disclaimer
- Contact email (support@99puritypeptides.com)
- One-line disclaimer repeat: "For research and laboratory use only. Not
  for human or veterinary use."
```

---

## 3. Explicit Do-Not-Include List (for Antigravity's own QA pass)

- No `/shop`, `/product/*`, `/cart`, `/checkout` links or redirects
- No dollar signs or numeric pricing anywhere in DOM, including hidden schema/JSON-LD
- No compound names in image filenames, alt text, or CSS class names
- No third-party review widgets pulled from the main store (avoid inherited testimonials referencing specific compounds, e.g. "their Tirzepatide is top tier")
- No military-discount / ID-upload block
- No blog/article links that lead back into compound-specific content

---

## 4. Notes for Belk Digital

- **Root-domain tradeoff:** this page now lives at `99puritypeptides.com/research-inquiry` rather than a separate subdomain. That's fine, but it means the page's safety depends entirely on real isolation — no shared nav/footer component, no internal links in or out except the one entry point you choose to expose. If `/shop` or the domain overall ever catches an Ads policy strike, this page goes down with it since review happens at the domain level.
- Point Ads campaigns at `https://99puritypeptides.com/research-inquiry` directly, not at the homepage — that keeps the click path a reviewer sees limited to this page.
- Form submissions should route to a queue your sales/support team can quickly triage rather than public-facing chat — keeps PII off any page that gets crawled or cached.
- Once this page is approved and running, it's worth auditing the *existing* `/shop` testimonials and blog content against the same do-not-include list — several current product cards and reviews already carry pricing and compound-specific claims that would fail this bar.

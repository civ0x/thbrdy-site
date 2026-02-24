# Research Prompt: The Research-to-Product Transition Problem

## Core Question

Why do research organizations — across technology, pharmaceuticals, defense, materials science, and other R&D-intensive industries — systematically fail to convert research breakthroughs into shipped products, and what mechanisms have actually worked to fix this?

## What I Need

A comprehensive, cross-domain research report that treats this as a structural problem in organizational design, not a management consulting question. I want competing explanations, empirical evidence, historical cases, and theoretical frameworks — not prescriptive advice.

## Specific Research Threads

### 1. Competing Diagnoses

The standard explanation for the "valley of death" between research and commercialization is a funding gap. But there are at least five competing structural diagnoses:

- **Funding gap** (Branscomb & Auerswald 2003): Capital markets can't evaluate early-stage technical risk, creating a dead zone between grant funding and VC.
- **Information asymmetry / legibility problem**: Research value is expressed in vocabularies (benchmarks, citations, novelty) that product decision-makers can't evaluate, and vice versa.
- **Incentive misalignment**: Researchers are rewarded for publications and novelty; product teams are rewarded for revenue and reliability. These incentives point in different directions.
- **Organizational structure**: Sequential evaluation mechanisms (TRL, stage-gate) decompose a coupled optimization problem into uncoupled subproblems, losing the interaction effects between them.
- **Epistemic incommensurability** (Gulbrandsen): Academic and commercial knowledge production operate with fundamentally different criteria for truth and value — not just different vocabularies but different epistemologies.

**Research question**: What does the empirical evidence say about which of these diagnoses is primary vs. secondary? Are there large-N studies that have attempted to decompose the failure modes? What does the pharma industry's extensive failure-mode data (which is far richer than tech's) tell us about root causes?

### 2. Cross-Domain Evidence

I want cases from domains beyond technology companies:

- **Pharmaceutical R&D**: The drug development pipeline has the most extensively studied valley of death. What do decades of Phase I/II/III failure data tell us about the structural causes? How has the industry's approach evolved? What's the current thinking on translational science failures?
- **Defense/intelligence**: DARPA has arguably the best track record of any organization at transitioning research to operational capability. What specific mechanisms does DARPA use? How does DARPA's model differ from corporate R&D labs? What about the broader DoD transition problem (DARPA invents it, but the services don't adopt it)?
- **Materials science / advanced manufacturing**: Manufacturing Readiness Levels (MRL) were developed alongside TRL. How do they compare? What does the manufacturing sector's experience with scale-up failures tell us?
- **Agricultural research**: The Green Revolution is one of the most successful research-to-deployment transitions in history. What organizational mechanisms enabled it? How did CGIAR centers bridge the gap between crop science research and farmer adoption?
- **Energy / climate tech**: The "valley of death" in clean energy is heavily studied. What mechanisms (ARPA-E, DOE loan programs, etc.) have worked? What's the evidence on their effectiveness?
- **Academic technology transfer**: What do we know from 40+ years of Bayh-Dole Act data about university-to-industry technology transfer? What are the actual success rates? What predicts success?

### 3. Mechanisms That Have Worked (Beyond the Obvious)

I'm aware of Amazon's Working Backwards/PR/FAQ, stage-gate processes, and TRL. I want to find mechanisms I *haven't* thought of:

- **Toyota's Set-Based Concurrent Engineering (SBCE)**: How does Toyota's approach to exploring multiple design alternatives simultaneously compare to point-based sequential optimization? What's the evidence on its effectiveness for research transition specifically?
- **Lockheed's Skunk Works model**: What specific organizational mechanisms enabled rapid prototype-to-product transitions? How replicable is the model outside defense?
- **Bell Labs' "dual ladder" and co-location model**: What specifically made Bell Labs effective at commercializing research? Was it co-location, shared incentives, the monopoly structure of AT&T, or something else?
- **Israel's defense-to-commercial pipeline (Unit 8200, defense R&D → startup ecosystem)**: What institutional mechanisms enable this consistently?
- **China's approach**: How do Chinese technology companies (Huawei, ByteDance, BYD) handle research-to-product transition? Is there a structurally different model, or is it the same problems with different solutions?
- **Open source as transition mechanism**: When does open-sourcing research (PyTorch, TensorFlow, Linux) serve as an effective transition mechanism, and when does it fail?
- **The "embedded scientist" model**: Some organizations embed researchers directly in product teams rather than maintaining separate labs. What's the evidence on effectiveness vs. innovation quality?

### 4. Theoretical Frameworks

I want to understand how different intellectual traditions diagnose and address this problem:

- **Organization theory**: What do March (exploration vs. exploitation), Christensen (innovator's dilemma), Tushman & O'Reilly (ambidextrous organizations), and Henderson & Clark (architectural innovation) say about research-product transitions specifically?
- **Sociology of science**: How do Latour (actor-network theory), Galison (trading zones), and Knorr-Cetina (epistemic cultures) frame the boundary between research and application? Is there useful work on "boundary objects" (Star & Griesemer 1989) that mediate between communities with different epistemologies?
- **Economics of innovation**: Arrow (1962) on information and invention, Nelson & Winter on evolutionary economics, Teece on dynamic capabilities and profiting from innovation. What do these frameworks predict about when and why transition fails?
- **Design theory**: Schön's "reflective practitioner," Simon's "sciences of the artificial," and contemporary design thinking. How does the design tradition frame the relationship between research knowledge and practical application?
- **Military/intelligence theory**: Boyd's OODA loop, the concept of "operational art" bridging strategy and tactics, and the Goldwater-Nichols joint operations framework. Are there structural parallels to the research-product transition?
- **James C. Scott's legibility framework**: Has anyone applied Scott's concept of legibility (from *Seeing Like a State*) to R&D management, innovation systems, or technology transfer specifically? If not, why not — is it because the framework doesn't apply, or because the communities haven't cross-pollinated?

### 5. The AI Lab Problem Specifically

The contemporary AI industry faces this problem acutely. Research for:

- **How are current AI labs structured?** Compare Anthropic, OpenAI, Google DeepMind, Meta FAIR, Microsoft Research, and smaller labs (Cohere, Mistral, xAI). What organizational structures are they using? Who has merged research and product? Who keeps them separate? What are the early results?
- **Historical precedents**: How did earlier waves of AI research (expert systems in the 1980s, machine learning in the 2000s) handle the research-to-product transition? What failed and why?
- **The "scaling as product" question**: Does the current paradigm (scaling compute → better models → better products) eliminate the traditional valley of death by making the research output directly deployable? Or does it just move the valley to a different location (e.g., from "research to product" to "general capability to specific application")?
- **Constitutional AI as a case study**: Anthropic's Constitutional AI appears to be a rare example where research and product objectives naturally align. Is this actually true, or is it more complicated? What are the limits of this alignment?

### 6. Counterarguments and Edge Cases

Steelman the case against integrated research-to-product transition:

- **When is separation optimal?** What evidence exists that maintaining distance between research and product *improves* research quality or innovation outcomes? Consider: Xerox PARC produced revolutionary research *because* of its autonomy, not despite it. Deep learning research in the 2000s had no obvious product application and would have been killed by any market-aware evaluation.
- **The "premature commercialization" failure mode**: Are there documented cases where forcing research toward product too early destroyed the research's long-term value?
- **Coordination costs**: What's the empirical evidence on the overhead costs of joint evaluation? At what organizational scale does the coordination cost exceed the value of captured coupling?
- **Selection bias in success stories**: Bell Labs had a government-granted monopoly. DARPA has no profit motive. Amazon's PR/FAQ works in a specific cultural context. How generalizable are the mechanisms that "worked"?

### 7. Quantitative Evidence

Where possible, I want numbers:

- What are actual success rates for research-to-product transitions across different industries?
- What's the typical timeline from research breakthrough to shipped product?
- Are there studies measuring the economic cost of failed transitions?
- What's the evidence on which interventions actually move the needle (with effect sizes, not just anecdotes)?

## Output Format

Structure the report as:

1. **Executive synthesis**: The 3-5 most important findings that would change how a practitioner thinks about this problem.
2. **Competing diagnoses**: Present the major theoretical explanations with their strongest evidence.
3. **Cross-domain evidence**: Organized by industry/domain, with specific mechanisms, outcomes, and what generalizes.
4. **Mechanisms that work**: Ranked by strength of evidence, with honest assessment of generalizability.
5. **Counterarguments**: The strongest case against integrated transition mechanisms.
6. **Open questions**: What the literature doesn't yet answer.
7. **Sources**: Full citations for everything referenced.

Prioritize empirical evidence over theoretical argument. Prioritize specific mechanisms over general advice. Prioritize findings that are surprising or counterintuitive over findings that confirm conventional wisdom.

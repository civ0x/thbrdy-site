# Co-Regulation Research Program

*Decision document — February 23, 2026*
*Author: Thomas (internal planning)*

---

## What this document decides

This is a staged research program for building and validating a real-time physiological co-regulation platform on Apple hardware. Two people's autonomic nervous systems are linked through technology: Person A's physiological state (heart rate, breathing rhythm, arousal trajectory) is sensed via Apple Watch, transmitted to Person B, and rendered as generative spatial audio (AirPods Pro) and haptic patterns (iPhone/Watch) — producing co-regulation effects analogous to in-person nervous system entrainment.

The program is structured as a sequence of bets with explicit kill criteria at each gate. Each phase answers one question, costs a known amount, and produces a go/no-go decision for the next phase. The document is designed to help me decide whether to commit the next 4–8 weeks to Phase 0, and what I'd need to see to keep going.

**The existential question this program ultimately answers:** Does technology-mediated co-regulation produce clinically meaningful effects beyond placebo, and can it be delivered through consumer Apple hardware?

---

## Strategic positioning: Notice extension vs. separate program

This concept can live in two places. The right answer depends on what Phase 0 and Phase 1 reveal, but the choice has architectural, branding, and resource implications that need to be legible now.

### Option A: Co-regulation as a Notice feature

Notice already captures individual autonomic state. Co-regulation extends this to dyadic awareness — from "notice your own state" to "notice each other's states." The philosophical continuity is strong: Jhourney's retreat curriculum already emphasizes relational practice (mettā, tonglen, group sits). The Jhourney community provides an immediate test population of serious practitioners in existing dyadic relationships (practice partners, couples who met through retreats).

This option reuses the existing Watch sensing pipeline, SwiftData persistence layer, and privacy architecture. The co-regulation session becomes a new mode alongside Frame Snap — same app, different interaction pattern. Distribution, TestFlight infrastructure, and beta community are already in place.

The risk: co-regulation demands a fundamentally different UX paradigm (continuous session vs. momentary capture), a bilateral networking layer Notice doesn't have, and real-time audio/haptic rendering that doesn't exist in the current codebase. Bolting this onto Notice could distort the product's core simplicity.

### Option B: Separate research program (Notice as proof of capability)

The co-regulation concept is novel enough to stand alone — no existing product occupies this design space, the patent landscape is open, and the clinical pathway (if pursued) requires its own regulatory identity. A separate program allows unconstrained design without backward-compatibility obligations to Notice.

Notice serves as evidence that the builder (me) can ship an Apple Watch biofeedback app with real users, and as a reusable component library (HealthKit integration, WatchConnectivity, SwiftData patterns). But the co-regulation app would be its own entity.

The risk: splitting attention across two products with $30K runway. A new app means new TestFlight setup, new App Store identity, new onboarding — overhead that doesn't exist when extending Notice.

### Decision criteria (to be evaluated after Phase 0)

Choose Option A if:
- The bilateral streaming layer integrates cleanly into Notice's existing architecture
- The Jhourney community shows strong pull for dyadic practice features
- The UX can be cleanly separated (co-regulation as a distinct "mode" rather than a redesign of the core loop)

Choose Option B if:
- The co-regulation session UX is fundamentally incompatible with Notice's momentary-capture paradigm
- Phase 1 study design requires a clean, minimal app without Notice's other features (confound reduction)
- The IP/patent opportunity is strong enough to warrant a distinct product identity

**For Phase 0, this choice doesn't matter.** The technical PoC is a standalone prototype regardless. The positioning decision is deferred to the Phase 0 → Phase 1 gate.

---

## Phase 0: Technical proof-of-concept

**Question answered:** Can Apple hardware deliver bilateral physiological signal transmission with sufficient fidelity and low enough latency to produce perceptible entrainment between two people in the same room?

**Duration:** 4–6 weeks
**Cost:** My time only. No external dependencies.
**Deliverable:** Working prototype on two sets of Apple Watch + iPhone + AirPods Pro, with measured latency and a subjective self-report from 3–5 dyad sessions.

### What exists (reusable from Notice)

Notice's current codebase provides approximately 60% of the Phase 0 sensing pipeline:

- `HKWorkoutSession` initialization and lifecycle management (currently used for mindfulness workout type)
- `HKAnchoredObjectQuery` for heart rate observation during active workout sessions (~0.2 Hz / one sample per ~5 seconds)
- `WCSession` bidirectional communication (Watch → iPhone via `sendMessage` with `transferUserInfo` fallback)
- `FrameSnap` data model (`Codable`, `Sendable`) with heart rate and HRV fields
- `PhoneConnectivityService` with `WCSessionDelegate` implementation
- HealthKit authorization flow and entitlements on both targets
- SwiftData persistence layer (for session logging)

### What needs building

**1. Breathing rate derivation from accelerometer data**

Apple Watch doesn't expose respiratory rate during waking hours. But the accelerometer is available at 50–100 Hz during an active `HKWorkoutSession` via CoreMotion's `CMMotionManager.startAccelerometerUpdates(to:withHandler:)`. Respiratory chest-wall and wrist micro-movements produce a detectable signal in the 0.1–0.5 Hz band (6–30 breaths/min).

The Breeze prototype (Frey et al., CHI 2018) validated this approach using a simple IMU at 24 Hz. The algorithm:
- Bandpass filter raw accelerometer Z-axis at 0.1–0.5 Hz (4th-order Butterworth)
- Peak detection on filtered signal with adaptive threshold
- Smooth with 3-breath rolling average to reduce false positives
- Output: estimated breaths-per-minute at ~1 Hz update rate

This is the single most important new component. If breathing rate can't be reliably derived from the Watch accelerometer on-wrist, the primary co-regulation channel (breathing-pace entrainment) is blocked.

**Build approach:** Start with offline validation. Record 5 minutes of raw accelerometer data while breathing at known rates (paced by metronome at 4, 6, 8, 10, 12 breaths/min). Process offline in a Swift playground. Measure accuracy against ground truth before integrating into the real-time pipeline.

**Kill criterion:** If breathing rate estimation error exceeds ±2 breaths/min at rates between 4–12 BPM across 3+ recording sessions, this channel is not viable with Watch accelerometer data alone. Fallback: use heart rate trend only (viable but weaker signal).

**2. Bilateral networking layer**

Two iPhones need to exchange physiological data in real-time. Three options, in order of preference:

*MultipeerConnectivity (local, same-room):* Peer-to-peer over Wi-Fi/Bluetooth. No server required. Latency: 20–80ms. Ideal for Phase 0 same-room testing. Limitation: requires physical proximity (practical for co-located sessions, inadequate for remote co-regulation).

*WebSocket relay (remote):* iPhone → server → iPhone via persistent WebSocket connection. Latency: 50–200ms depending on server location. Required for remote co-regulation. Adds server dependency and operational cost. Use a lightweight Vapor or Node relay deployed to Fly.io.

*Nearby Interaction (UWB):* Ultra-wideband on iPhone 11+ and Apple Watch Ultra 2. Provides precise distance and direction between devices. Interesting for spatial audio positioning (rendering the partner's "presence" at their actual physical location in the room) but doesn't solve data transport — still need MultipeerConnectivity or WebSocket for the physiological data channel.

**Phase 0 decision:** Build on MultipeerConnectivity for same-room PoC. Abstract the transport layer behind a protocol so WebSocket can be swapped in later without touching the rendering pipeline.

Data format: A lightweight struct transmitted at 1 Hz containing current heart rate (BPM), estimated breathing rate (BPM), breathing phase (inhale/exhale/unknown as a 0–1 continuous value from the bandpass-filtered signal), and a 30-second HRV trend (ascending/descending/stable). Total payload: <100 bytes per message. MultipeerConnectivity handles this trivially.

**3. Generative spatial audio rendering (AirPods Pro)**

This is the primary co-regulation output channel. The rendering pipeline:

```
Partner's physiological data (1 Hz)
  → Interpolation/smoothing (60 Hz parameter updates)
    → AVAudioSourceNode (sample-by-sample synthesis at 48 kHz)
      → AVAudioEnvironmentNode (HRTF spatialization)
        → AirPods Pro (with head tracking via CMHeadphoneMotionManager)
```

The audio must be generative — not pre-recorded clips triggered by state changes, but continuously evolving sound that embodies the partner's autonomic rhythm. Design principles:

*Breathing-pace entrainment (primary channel):* A slowly oscillating tone or filtered-noise texture whose volume, spectral brightness, or spatial position cycles at the partner's breathing rate. The listener's nervous system should entrain to this rhythm without conscious effort, analogous to how breathing synchronizes between people sharing a room. Target: the listener's breathing rate converges toward the transmitted rate within 2–5 minutes.

*Arousal trajectory (secondary channel):* Spectral warmth/coolness that shifts over 30–60 second windows to reflect the partner's HRV trend. High vagal tone → warm, resonant, harmonically rich. Low vagal tone / sympathetic activation → brighter, slightly edgier spectrum. This operates below conscious attention — the listener shouldn't be "reading" the sound, but should feel a tonal quality shift.

*Spatial presence:* Head-tracking data from `CMHeadphoneMotionManager` allows the audio source to remain fixed in world space (e.g., "the partner's breathing is always to my right, regardless of head turn"). This creates a persistent sense of the partner's location in the listener's perceptual field.

**Technical implementation notes:**
- `AVAudioSourceNode` render callback must be real-time safe: no allocation, no locks, no Objective-C message dispatch. All parameter updates via atomic stores read by the audio thread.
- `AVAudioEnvironmentNode` handles HRTF and head-tracking integration. Set `listenerAngularOrientation` from `CMHeadphoneMotionManager` attitude data.
- Start with a single-oscillator design: sine wave at a calming fundamental (e.g., 220 Hz) with amplitude modulated by the partner's breathing phase. Add harmonic complexity in iteration.
- AirPods Pro spatial audio with head tracking introduces ~40–80ms latency. Acceptable for breathing-pace entrainment (3–10 second cycles).

**4. Dynamic haptic rendering (iPhone)**

Secondary output channel via Core Haptics on the receiving iPhone. `CHHapticEngine` with `CHHapticPatternPlayer` for continuous patterns, modulated in real-time via `CHHapticDynamicParameter`.

Design: A gentle pulsing pattern synchronized to the partner's breathing — subtle expansion on inhale, settling on exhale. Intensity mapped to the partner's heart rate (higher HR → slightly more intensity, creating an ambient awareness of arousal level). The haptic should feel like a hand resting on the iPhone — alive, rhythmic, warm.

Technical constraint: Core Haptics is iPhone-only. The Watch Taptic Engine supports only 9 predefined `WKHapticType` patterns with no dynamic modulation. For Phase 0, haptics are iPhone-only. The user holds the phone or places it against their body (chest, abdomen, thigh).

**5. Session orchestration and logging**

A minimal UI that:
- Discovers and connects to a partner via MultipeerConnectivity
- Starts synchronized `HKWorkoutSession` on both Watches (mindfulness type)
- Begins bilateral physiological data streaming
- Activates spatial audio and haptic rendering on both iPhones
- Logs all transmitted/received data with timestamps for post-session analysis
- Ends session and saves logs to SwiftData

### Phase 0 architecture diagram

```
┌─────────────────────────────────────────────────────────┐
│  PERSON A                                               │
│                                                         │
│  Apple Watch                    iPhone A                │
│  ┌──────────────┐              ┌──────────────────────┐ │
│  │ HKWorkout    │  WCSession   │ CoRegSession         │ │
│  │  Session     │─────────────→│  Manager             │ │
│  │              │              │                      │ │
│  │ HR @ 0.2 Hz  │              │ ┌──────────────────┐ │ │
│  │ Accel @50 Hz │              │ │ Breathing Rate   │ │ │
│  │  (raw)       │              │ │ Estimator        │ │ │
│  └──────────────┘              │ │ (bandpass+peak)  │ │ │
│                                │ └──────────────────┘ │ │
│                                │          │           │ │
│                                │          ▼           │ │
│                                │ ┌──────────────────┐ │ │
│                                │ │ PhysioPacket     │ │ │
│                                │ │ {hr, breathRate, │ │ │
│                                │ │  breathPhase,    │ │ │
│                                │ │  hrvTrend}       │ │ │
│                                │ └────────┬─────────┘ │ │
│                                │          │           │ │
│                                └──────────┼───────────┘ │
└───────────────────────────────────────────┼─────────────┘
                                            │
                              MultipeerConnectivity
                                   (20-80ms)
                                            │
┌───────────────────────────────────────────┼─────────────┐
│  PERSON B                                 │             │
│                                           ▼             │
│  iPhone B                   AirPods Pro B               │
│  ┌──────────────────────┐  ┌────────────────────┐       │
│  │ CoRegSession         │  │ Spatial Audio      │       │
│  │  Manager             │  │                    │       │
│  │                      │  │ AVAudioSourceNode  │       │
│  │ ┌──────────────────┐ │  │  (48kHz synthesis) │       │
│  │ │ Haptic Renderer  │ │  │                    │       │
│  │ │ CHHapticEngine   │ │  │ AVAudioEnvironment │       │
│  │ │ (breath-synced)  │ │  │  Node (HRTF +      │       │
│  │ └──────────────────┘ │  │  head tracking)    │       │
│  │                      │  └────────────────────┘       │
│  │ ┌──────────────────┐ │                               │
│  │ │ Session Logger   │ │  Apple Watch B                │
│  │ │ (SwiftData)      │ │  ┌──────────────┐            │
│  │ └──────────────────┘ │  │ HKWorkout    │            │
│  └──────────────────────┘  │  Session     │            │
│                            │ (sensing B's │            │
│                            │  own data)   │            │
│                            └──────────────┘            │
└─────────────────────────────────────────────────────────┘

Note: Both directions simultaneously. Each person senses
AND receives. The diagram shows one direction for clarity.
```

### End-to-end latency budget (Phase 0 target)

| Segment | Target | Measured by |
|---|---|---|
| Watch accelerometer → iPhone (WCSession) | <500ms | Timestamp delta in logs |
| Breathing rate estimation (filtering + peak detection) | <100ms | Processing time measurement |
| MultipeerConnectivity transmission | <80ms | Round-trip / 2 |
| Audio parameter interpolation → AirPods render | <100ms | AVAudioSourceNode callback timing |
| **Total (breathing rhythm channel)** | **<800ms** | End-to-end timestamp correlation |
| Heart rate channel (HealthKit → render) | <6s | Acceptable for trend, not beat-sync |

The 800ms target for breathing rhythm is well within the ~3–10 second cycle time. The listener perceives a continuously evolving rhythm, not discrete events, so sub-second latency is perceptually transparent.

### Phase 0 success criteria

**Technical (all must pass):**
- Breathing rate estimation from Watch accelerometer achieves ±2 BPM accuracy at 4–12 BPM range (validated against paced breathing ground truth)
- End-to-end breathing rhythm latency <1 second measured in logs
- Spatial audio renders continuously for 20+ minutes without glitches, dropouts, or audio thread priority inversion
- MultipeerConnectivity maintains stable connection for 20+ minutes (no silent disconnections requiring restart)
- Both Watches maintain workout session and sensor streaming for full session duration

**Experiential (subjective, from 3–5 dyad sessions with practice partners):**
- At least 1 participant per session reports noticing something different about their breathing during the session (without being told about breathing entrainment)
- Post-session breathing rate data shows convergence trend (participants' rates move toward each other) in at least 2 of 5 sessions
- The experience feels "alive" rather than "mechanical" — the audio is something you'd want to sit with, not something you'd want to turn off

### Phase 0 kill criteria

Stop and do not proceed to Phase 1 if:
- Breathing rate cannot be reliably derived from Watch accelerometer (error >±3 BPM consistently), AND no viable alternative sensing path exists within the Apple ecosystem
- WatchConnectivity proves too unreliable for sustained streaming (>20% session failure rate from communication drops)
- The spatial audio rendering is perceptually unpleasant or anxiety-inducing in >50% of test sessions (the Xu et al. finding about interoceptive accuracy suggests this is a real risk)
- The full pipeline battery draw makes sessions shorter than 30 minutes on Series 9

### Phase 0 build plan

**Weeks 1–2: Sensing pipeline**
- Implement accelerometer-based breathing rate estimation in a standalone Swift playground
- Validate against paced breathing at 4, 6, 8, 10, 12 BPM (5 min each)
- If validation passes, integrate into Watch app alongside existing HR pipeline
- Package as `PhysioPacket` struct, transmit via WCSession at 1 Hz

**Weeks 2–3: Networking + rendering**
- Implement MultipeerConnectivity discovery and session management
- Build `AVAudioSourceNode` → `AVAudioEnvironmentNode` rendering pipeline
- Start with minimal audio design: amplitude-modulated sine, breathing-synced
- Implement `CMHeadphoneMotionManager` for head-tracked spatial positioning
- Build Core Haptics breathing-synced pattern on iPhone

**Weeks 3–4: Integration + session orchestration**
- Wire sensing → networking → rendering into a single session flow
- Build minimal UI (connect → start → visualize partner data → stop)
- Implement session logging (all transmitted/received packets with timestamps)
- Deploy to two device sets

**Weeks 4–6: Dyad testing + iteration**
- Run 3–5 sessions with practice partners from Jhourney community
- Measure latency, breathing rate convergence, subjective experience
- Iterate on audio design based on experiential feedback
- Document findings and decide Phase 1 go/no-go

---

## Phase 1: Mechanism validation study

**Question answered:** Does bilateral physiological feedback produce greater autonomic synchrony and subjective co-regulation than sham feedback, when delivered through Apple hardware?

**Duration:** 6–9 months (design + IRB + recruitment + data collection + analysis)
**Cost:** $20K–60K depending on partnership structure (see resource analysis below)
**Deliverable:** Peer-reviewed manuscript-quality data answering whether the effect is real.

**This phase requires an academic collaborator.** I contribute the technology platform and study app. The collaborator contributes IRB approval, lab space, research-grade physiological recording equipment (for ground truth validation against Watch-derived measures), statistical analysis expertise, and publication credibility.

### Study design

**Design:** Randomized, single-blind, sham-controlled crossover.

**Participants:** 30 dyads (60 individuals). Power analysis: assuming medium effect size (Cohen's d = 0.5) for respiratory synchrony difference between real and sham conditions, α = 0.05, power = 0.80, crossover design → 30 dyads provides adequate power. Recruit from three populations: romantic couples (n=10 dyads), meditation practice partners (n=10 dyads, recruited via Jhourney), and stranger dyads (n=10, to test whether pre-existing relationship modulates the effect).

**Conditions (within-subjects, counterbalanced):**

*Real feedback:* Each participant receives their partner's actual physiological data rendered as spatial audio and haptics per the Phase 0 pipeline. Bilateral and simultaneous.

*Sham feedback:* Each participant receives physiologically plausible but uncorrelated data. The sham signal is generated from the partner's baseline recording (captured during a solo calibration period) with added noise and temporal shuffling. Preserves the experience of "receiving a signal" without actual real-time coupling. Participants are told they may receive real or sham feedback in each session; they are not told which.

*Baseline (no feedback):* Both participants sit together in the same room with no audio or haptic feedback. Establishes natural co-regulation baseline for comparison.

**Protocol per dyad:**
1. Informed consent and baseline questionnaire (IOS — Inclusion of Other in Self scale; ECR-R — Experiences in Close Relationships for couples; MAIA-2 for interoceptive awareness baseline)
2. Solo calibration: 5 minutes of quiet sitting, each person alone, recording physiological baseline
3. Three sessions (one per condition), separated by 48+ hours, counterbalanced order:
   - 5-minute solo baseline recording (seated, eyes closed)
   - 20-minute co-regulation session (seated side by side, eyes closed, wearing AirPods Pro)
   - 5-minute post-session quiet period
   - Post-session questionnaire: subjective connectedness (VAS scale), perceived breathing synchrony (VAS), emotional state (PANAS short form), and a free-text experiential report
4. Debriefing interview after final session: Could you tell which sessions were real vs. sham? What did you notice?

**Primary outcome measures:**
- Respiratory synchrony: phase-locking value (PLV) of breathing signals between partners, computed from respiratory belt (ground truth) and Watch-derived estimates. Real > Sham > Baseline predicted.
- HRV coherence: cross-spectral coherence of RR interval time series in the 0.04–0.15 Hz band (LF range, where RSA operates). Computed from research-grade ECG.

**Secondary outcome measures:**
- Subjective connectedness (VAS) across conditions
- PANAS positive affect change from pre to post
- Participant blinding assessment (can they identify real vs. sham?)
- Watch-derived breathing rate accuracy vs. respiratory belt ground truth (validates Phase 0 algorithm in a larger sample)
- Heart rate synchrony (cross-correlation of HR time series)

**Analysis plan:**
- Primary: Linear mixed-effects model with condition (real/sham/baseline) as fixed effect, dyad as random effect, session order as covariate. Primary contrast: real vs. sham PLV.
- Secondary: Moderation analysis — does relationship type (couple/practice partner/stranger), interoceptive awareness (MAIA-2 baseline), or relationship closeness (IOS) moderate the co-regulation effect?
- Blinding assessment: If >70% of participants correctly identify real vs. sham, the sham is inadequate and the study can't distinguish entrainment from expectation effects.

### Where to find a collaborator

The ideal collaborator runs a psychophysiology or interpersonal neuroscience lab with existing IRB infrastructure and physiological recording capability (respiratory belt, ECG). Priority targets:

- **UCSF Osher Center for Integrative Health** — contemplative science focus, strong Apple ecosystem familiarity, Bay Area proximity
- **Stanford SPARQ / CCARE** — compassion and co-regulation research, familiarity with dyadic physiology methods
- **UC Berkeley Greater Good Science Center** — interpersonal emotion research
- **Jocelyn Sze's lab (UCSF)** or **Sarina Saturn's (U of Portland)** — both study interpersonal physiology and emotion regulation
- **Jhourney network adjacency** — Jhourney community members at DeepMind, OpenAI, and Anthropic may have connections to academic psychophysiology researchers interested in technology-augmented contemplative practice

The pitch to a collaborator: "I've built the technology platform and validated the sensing pipeline. You bring the research infrastructure. We share first-authorship and define the research agenda together. The platform and study app are provided at no cost. This is a novel research paradigm with no prior sham-controlled studies — first-mover advantage for a high-impact publication."

### Phase 1 go/no-go criteria

**Go to Phase 2 if:**
- Real feedback produces significantly greater respiratory PLV than sham (p < 0.05, primary outcome)
- Effect size is medium or larger (Cohen's d ≥ 0.5)
- Blinding holds (≤60% correct identification of real vs. sham)
- Subjective reports directionally support the physiological data

**Kill the program if:**
- No significant difference between real and sham on respiratory PLV
- Blinding fails (most participants easily distinguish conditions), suggesting the effect is expectation-driven
- Adverse experiential reports in >20% of real-feedback sessions (anxiety, discomfort, dysregulation)

**Pivot if:**
- Effect is present but only in specific populations (e.g., couples but not strangers) → narrow the target population for Phase 2
- Effect is present for breathing synchrony but not HRV coherence → the mechanism is behavioral (breathing entrainment) rather than autonomic (vagal co-regulation). Still clinically interesting but requires reframing the theoretical model.

---

## Phase 2: Dose-response and ecological validity (sketched)

**Question:** How much co-regulation exposure produces lasting effects, and does it work outside the lab?

**Only pursued if Phase 1 shows a real effect.** This phase moves from controlled lab sessions to at-home use over weeks. The critical unknowns: Does the effect persist after sessions end? Does it accumulate with repeated use? Does it work remotely (WebSocket relay) or only in-person (MultipeerConnectivity)?

**Design sketch:** 60 dyads randomized to co-regulation app (3x/week for 6 weeks) vs. individual HRV biofeedback app (same dose, same device setup, no partner signal). Pre/post validated clinical measures: Couples Satisfaction Index (CSI-32) for romantic dyads, Social Connectedness Scale (SCS) for all dyads, GAD-7 and PHQ-9 for mental health secondary outcomes. This is the study that generates the clinical outcome data needed for any future regulatory or reimbursement argument.

**Cost estimate:** $80K–200K (participant compensation, research coordinator salary, server infrastructure for remote sessions, data analysis).

**Funding sources:** NIH NIMH R21 Exploratory/Developmental grant ($275K over 2 years, perfect fit for novel digital mental health intervention). NCCIH R21 for contemplative practice and technology. Private foundation grants (Mind & Life Institute, Templeton Foundation). Phase 1 publication is the prerequisite for any of these applications.

---

## Phase 3: Clinical pathway and regulatory decision (sketched)

**Only pursued if Phase 2 demonstrates durable clinical outcomes.** This is the fork where the program either becomes a wellness product (fast, cheap, limited claims) or pursues FDA clearance (slow, expensive, clinical claims).

**Wellness path:** FDA's January 2026 General Wellness guidance allows non-invasive wearable biofeedback products to avoid regulation if they claim only general wellness benefits. Claims like "promotes relaxation and connection" are permissible. This path costs nothing in regulatory fees, takes weeks to implement, and allows immediate commercial launch. It forecloses disease-specific claims and DMHT reimbursement codes.

**Clinical path (De Novo):** If Phase 2 data shows clinically significant improvements on validated measures (e.g., CSI-32 improvement ≥ MCID, GAD-7 reduction ≥ 4 points), a De Novo classification submission becomes viable. NightWare (Apple Watch app for nightmare disorder, DEN200033) is the procedural precedent; Freespira (respiratory biofeedback for panic/PTSD) is the mechanistic precedent. Estimated cost: $1.5–4M over 2–3 years, including a 100–200 participant pivotal RCT with sham control and 8–12 week follow-up.

**The Pear Therapeutics lesson:** Regulatory clearance is necessary but nowhere near sufficient. Pear obtained the first-ever standalone DTx De Novo classification in 2017 and filed bankruptcy in 2023 because payers wouldn't reimburse. The clinical path only makes sense with a reimbursement strategy validated before filing. The new CMS DMHT codes (G0552–G0554, effective January 2025) provide a pathway but at modest rates (~$20/20 minutes). The alternative is B2B licensing to health systems or EAPs rather than direct-to-consumer.

---

## Resource reality

### What I can do alone

| Activity | Cost | Timeline |
|---|---|---|
| Phase 0 technical PoC | My time only | 4–6 weeks |
| Phase 0 dyad testing (Jhourney friends) | $0 (reciprocal) | 2 weeks |
| Patent prior art search (provisional filing) | $2K–5K (attorney) | 2–4 weeks |
| Phase 1 study app development | My time only | 2–3 weeks |

### What requires partners

| Activity | Partner needed | Cost to me | Cost to partner |
|---|---|---|---|
| Phase 1 study execution | Academic lab (IRB, equipment, analysis) | $0–20K (participant compensation, depending on grant) | Lab time, grad student effort |
| Phase 1 with full funding | NIMH R21 or equivalent | Time for grant writing | Standard indirect costs |
| Phase 2 multi-week study | Same or new academic partner + grant funding | Time | $80K–200K (grant-funded) |
| Phase 3 De Novo submission | Regulatory consultant + CRO | $1.5–4M (investor-funded) | N/A |

### Runway constraint

With $30K remaining, the only phase I can self-fund is Phase 0 + Phase 1 app development. Phase 1 execution requires either a grant, an academic partner absorbing costs, or external funding. This is an appropriate constraint — Phase 0 is the cheapest possible test of the hardest technical questions, and its output (working prototype + preliminary data) is exactly what's needed to recruit a collaborator or write a grant.

---

## IP considerations

The patent landscape is surprisingly open. No granted US patent covers the complete pipeline of continuous autonomic sensing → real-time interpersonal transmission → haptic or spatial audio co-regulation feedback. Apple holds patents on biometric-to-haptic conversion (US20160023245) and radar-based heartbeat detection (US12,282,084), but neither covers interpersonal co-regulation.

If Phase 0 produces a working prototype, a provisional patent application covering the bilateral physiological sensing + generative audio/haptic co-regulation rendering pipeline would be timely. A provisional costs $2K–5K with a patent attorney, buys 12 months of priority date, and requires no formal claims. It's cheap insurance with meaningful upside if the research validates the concept.

---

## Decision framework

**Decision 1 (now): Should I build Phase 0?**

Arguments for:
- The technical build is 4–6 weeks and reuses 60% of existing Notice infrastructure
- It answers the hardest technical questions (breathing rate from accelerometer, spatial audio rendering quality, pipeline latency) before any commitment to clinical research
- The prototype itself is a compelling artifact for recruiting academic collaborators, writing grants, or pitching investors — it's a demo, not a slide deck
- The Jhourney community provides immediate dyad test partners
- The competitive space is empty — no one else is building this on consumer hardware
- Win or lose, the accelerometer breathing-rate algorithm and spatial audio rendering pipeline have standalone value (could fold back into Notice for individual breathing biofeedback)

Arguments against:
- Notice beta just launched. Splitting attention during the critical early-feedback period risks both products
- $30K runway means every week of builder time has high opportunity cost
- The science supporting technology-mediated co-regulation is promising but unproven — the entire program could dead-end at Phase 1 if the sham-controlled study shows no effect
- The clinical and commercial pathway is long, expensive, and littered with failed DTx companies

**My current read:** The Phase 0 build is a good bet. It's cheap (time only), fast (4–6 weeks), answers the right questions, and produces something tangible regardless of whether the research program continues. The breathing-rate algorithm and spatial audio pipeline have value independent of co-regulation. The worst case is I learn a lot about CoreMotion, AVAudioEngine, and MultipeerConnectivity — all useful for Notice.

The question isn't whether to build Phase 0. It's whether to start it now (before Notice beta feedback crystallizes) or defer 4–6 weeks until the Notice beta has generated enough user data to inform the next Notice development cycle. During a "waiting for feedback" lull, Phase 0 is high-leverage use of time.

**Decision 2 (after Phase 0): Should I pursue Phase 1?**

Depends entirely on Phase 0 outcomes against the criteria above. If the technical PoC works and the experiential response is intriguing, the next move is recruiting an academic collaborator — which is a networking task, not a building task, and can run in parallel with ongoing Notice development.

**Decision 3 (after Phase 1): What is this?**

This is where the positioning question (Notice extension vs. separate program) resolves. If the mechanism validates and the clinical outcome data is promising, this becomes either a Notice feature for the Jhourney community or a standalone product with a distinct clinical and commercial identity. That decision will be obvious by then — it's not worth agonizing over now.

---

## References (key papers for Phase 1 design)

- Palumbo RV et al. (2017). "Interpersonal Autonomic Physiology: A Systematic Review of the Literature." *Personality and Social Psychology Review*, 21(2), 99–141. — The foundational review establishing that physiological linkage occurs across HR, SC, respiration, and HRV in diverse dyads.
- Feldman R (2007). "Parent-infant synchrony and the construction of shared timing." *Journal of Child Psychology and Psychiatry*, 48(3-4), 329–354. — Bio-behavioral synchrony framework.
- Frey J et al. (2018). "Breeze: Sharing Biofeedback Through Wearable Technologies." *CHI 2018*. — Most directly relevant prototype: wearable-mediated breathing sharing between dyads.
- Bögels S et al. (2022). "The role of reciprocity in dynamic interpersonal coordination of physiological rhythms." *Cognition*, 225, 105104. — Real-time physiological feedback between participants; shows bidirectional interaction produces greater synchrony.
- Goldstein P et al. (2017). "The role of touch in regulating inter-partner physiological coupling during empathy for pain." *Scientific Reports*, 7, 3252. — Touch increases respiratory and cardiac coupling between romantic partners.
- Xu X et al. (2021). "The effect of haptic stimulation simulating heartbeats on the regulation of physiological responses and prosocial behavior under stress." *Biological Psychology*, 165, 108199. — Critical finding: haptic heartbeat effects depend on interoceptive accuracy.
- Porges SW (2007). "The polyvagal perspective." *Biological Psychology*, 74(2), 116–143. — Theoretical framework for co-regulation via ventral vagal complex.
- Lehrer PM & Gevirtz R (2014). "Heart rate variability biofeedback: how and why does it work?" *Frontiers in Psychology*, 5, 756. — Resonance frequency breathing mechanism.
- Goessl VC et al. (2017). "The effect of heart rate variability biofeedback training on stress and anxiety: a meta-analysis." *Psychological Medicine*, 47(15), 2578–2586. — Hedges' g = 0.83 for individual HRV biofeedback.
- Kleinbub JR et al. (2020). "Interpersonal Biofeedback in Psychodynamic Psychotherapy." *Frontiers in Psychology*, 11, 1655. — Proposed (but not deployed) interpersonal biofeedback system for therapy.

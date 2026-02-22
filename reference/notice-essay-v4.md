# You're Already Feeling Something You Haven't *Noticed* Yet

On interoception, contemplative practice, biometric feedback, and building a tool that tries to become unnecessary.

**Design Hypothesis:** Structured self-report plus biometric feedback plus contextually intelligent AI reflection can train interoceptive awareness outside retreat conditions — helping you notice what your body already knows, in the middle of a life.

---

## The Gap — What the Body Knows Before You Do

Your body knows things before you do. Right now, as you read this, your heart rate carries information about how you're meeting this moment. Your HRV encodes something about your autonomic state. Your gut is doing something. You're probably not aware of any of it.

This isn't a failure of attention. It's the normal human condition. Research on interoception — the felt sense of your own body — shows that most people are surprisingly poor at reading their own physiological signals in real time. Bud Craig's work on the insular cortex explains the mechanism: conscious awareness genuinely lags behind physiological reality. You're stressed before you know you're stressed. The body leads; the story follows.

This creates a gap between three existing product categories. Meditation apps (Headspace, Calm, Waking Up) handle contemplative experiences but not moment-of-capture logging. Mood trackers (How We Feel, Daylio) handle labeling but miss biometric integration and contemplative depth. Health platforms (Oura, WHOOP) excel at biometric-behavioral correlation but lack emotional granularity and philosophical grounding. None of them train the underlying capacity — the ability to read your own states in real time.

---

## The Traditions — Different Paths to the Same Capacity

Contemplative traditions have been training this capacity for millennia — noting practice (Mahasi Sayadaw), somatic-phenomenological methods (Gendlin's Focusing), jhana through embodied emotional awareness (Brasington, Armstrong), sensory decomposition (Shinzen Young's "See Hear Feel"). Different methods, same target: noticing what's arising in your experience without collapsing into reactivity.

For me, the thing that cracked this open was a Jhourney jhana retreat. Emmett Shear and the Jhourney community taught me to feel things I'd been walking around with my whole life but couldn't name — to distinguish between what was arising and how I was relating to it. Their framework of recursive self-acceptance, the window of tolerance, the insight that you can't anxiously monitor your way to wellbeing — these became the design foundations.

I came back from retreat and nothing existed that held what I'd learned. The meditation apps wanted me to follow guided sessions. The mood trackers wanted me to rate my day on a scale. The health platforms wanted to show me a readiness score. None of them asked the question the practice had taught me to ask: *what are you actually feeling in your body right now, and how are you meeting it?*

So I built the thing I wanted.

---

## What I Built — About 24 Hours of Work

Notice is live on TestFlight with beta testers from the Jhourney community. I designed and built it in roughly three working days of effort — not contiguous, and not linear. It was my first iOS app. I had zero Swift experience going in. The primary development tool was the Claude Agent SDK running natively in Xcode 26.3.

I want to be clear about something: I wasn't building for a market. I was building for myself. The conversations I had with other practitioners along the way — and the beta testing with the Jhourney community — were a form of external dialogue to help me reason through design decisions, not customer discovery in the conventional sense. The people I talked to share the problem because they share the practice. But the taste and the vision for what this should feel like were mine.

The build was iterative loops of research, design, build, ship, learn, repeat.

### First loop: Research → design → working beta

I started by translating research into documents that would guide both me and the AI agent. A 6,000-word foundation document converting neuroscience (Craig, Barrett, Garfinkel) and contemplative frameworks (Jhourney's Dam Model, frame-dependence philosophy) into specific design constraints. A CLAUDE.md encoding architectural guidelines, anti-patterns, and scope tiers. A DECISIONS.md logging every open question with evidence and options.

These aren't documentation for documentation's sake. They're prompt engineering for an agentic development workflow. The CLAUDE.md was more consequential than any Swift file the agent would produce. The system prompt for the AI reflection layer — encoding ten constraints drawn from contemplative philosophy — was the highest-leverage artifact in the entire product.

Then I built. Xcode 26.3's Claude Agent integration turned hours of building into a complete application. The agent could see Xcode Previews, reason across the full project structure, search Apple's documentation, and iterate autonomously. I gave it goals and design constraints; it produced working code. By the end of the first working day, I had a running app on my Watch and phone: tap to snap, biometric capture, emotion picker, Claude streaming reflections, SwiftData persistence. I pushed a beta to my own devices.

### Second loop: Using it → more research → external beta

Using the app on my own wrist surfaced questions the research hadn't answered. I went back to the literature on experience sampling method and worked through the cold start problem — what should Claude say when it has three snaps of context instead of thirty? This produced the snap depth awareness tiers: sparse (1–3 snaps, validate the noticing act), thin (4–15, hold emerging patterns lightly), rich (20+ snaps, full pattern vocabulary). Each tier with distinct Claude behavior calibrated to the evidence available.

I refined the visual identity — warm amber, SF Pro for UI text, New York serif for contemplative reflections, cream containers for Claude's responses — and stress-tested Watch-to-phone communication on real hardware. Then I pushed an external beta to the Jhourney community through TestFlight. Not to validate a hypothesis, but because these are the people who would actually use this, and talking to them sharpens my thinking.

### Third loop: Conversations → new capabilities → ship again

Conversations with practitioners surfaced things I recognized from my own experience but hadn't prioritized. People wanted to snap from their phone without needing a Watch — because the moment you notice something, you shouldn't have to context-switch to a device. And the debrief felt too structured for moments when you just want to describe what's in your body without picking from a grid.

This loop produced the phone-initiated snap, voice snap through Siri and AirPods (describe what you're noticing and the transcription flows into the debrief), and a redesigned emotion taxonomy — from 16 words in active/still groupings to 18 labels organized by felt-sense texture (Alive, Settled, Open, Heavy, Stirred, Tight), where the groupings reflect somatic quality rather than valence categories.

I also integrated Apple's on-device Foundation Models for the felt-sense interpreter: describe "tight jaw, shoulders up, buzzy" and the on-device model suggests the *Stirred* texture group with matching labels — before the data ever leaves the device. A separate context assembler orchestrates HealthKit, EventKit, CoreLocation, and SwiftData tool calls to enrich Claude's reflections with situational awareness, all on-device.

### What this demonstrates

The total was about 24 hours of effort. The enabling constraint was that I'd invested heavily in the design documents — not as a sequential phase, but as the primary artifact that made everything downstream possible. Each loop started with research and design updates to the foundation doc, CLAUDE.md, and DECISIONS.md; then the agent built against those constraints.

The quality of agentic output is bounded by the quality of input context. The gap between "I understand this problem deeply" and "I can ship a working solution in an unfamiliar stack" has collapsed — but only if you do the design work. The agent doesn't replace product thinking. It removes the bottleneck between product thinking and shipped code.

---

## The Core Interaction — The Frame Snap

**Tap** — Notice a shift on your Watch, or tap a button on your phone. **Capture** — HR, HRV, location, calendar context. **Name** — Describe the felt sense in your body, select an emotion label, set intensity. **Reflect** — See your biometric data *after* your subjective read, then receive a contemplative AI reflection.

The critical design decision: you commit your subjective assessment before you see the biometric data. You say "I feel tense" and then discover your HRV is 22ms below your weekly average. Over time, that feedback loop trains calibration between felt sense and physiology. The data validates your noticing rather than replacing it.

The interaction design is grounded in Barrett's constructed emotion theory — emotions aren't pre-formed things you detect but constructions from raw affect plus whatever conceptual frame you bring. The same physiological activation becomes anxiety or excitement depending on how you meet it. The emotion picker isn't a labeling exercise; it's the instrument through which users practice constructing their experience more deliberately.

---

## The Architecture — Privacy by Design, AI at Two Scales

### On-Device: The Read

Apple Foundation Models (~3B parameters) run entirely on-device. Free, offline, no API keys. At snap time, the on-device model orchestrates tool calls — HealthKit for biometric trends, EventKit for calendar context, CoreLocation for semantic location, SwiftData for recent snap patterns — and assembles a structured context snapshot. A separate felt-sense interpreter takes the user's free-text body description and suggests matching emotion labels.

All of this stays on the device.

### The Privacy Boundary

Raw health data, calendar entries, contact names, GPS coordinates — none of it crosses to the cloud. Only a structured, de-identified summary goes upstream: "User snapped 'tense' before a work meeting. HRV below weekly average. Third similar pattern this week."

Every context source beyond HealthKit is independently optional. No permission wall at onboarding. Calendar, location, and contacts are offered progressively after the user has experienced value from basic snaps.

### Cloud: The Reflection

Claude API (Sonnet) handles longitudinal pattern analysis and contemplative reframing. The system prompt encodes ten constraints from the contemplative foundations: curiosity over correction, process over outcome, recursive self-acceptance, window of tolerance awareness, frame navigation not prescription. It never pathologizes. It validates subjective experience over objective data. It surfaces absence and detects emotional rigidity. The voice is warm, concise, grounded — a wise friend who noticed something, not a therapist chatbot.

---

## Honest Limits

I don't know if this will work. The hypothesis is testable but unproven. The contemplative traditions are unanimous that you can't strive your way to awareness. The hardest design problem might be building a tool that embodies non-striving.

What I'm watching: Do users snap less over time (scaffolding working) or more (dependency)? Does emotion label diversity increase (granularity developing) or narrow (habit)? Do users start qualifying their labels — "picked anxious but it's more like anticipation" — signaling their felt sense outgrowing the taxonomy? These are the behavioral proxies for the capacity I'm trying to train.

But honestly, the metrics I trust most are simpler than that. When I tap my Watch and describe what's in my chest, and the reflection that comes back names something I hadn't quite articulated — that's the product working. I built this because I wanted it to exist. If other people find it useful, that's a consequence of the problem being shared, not of building for an audience.

Most of us walk through our days only partially aware of the states that drive our decisions. The body is always signaling. The contemplative traditions have known this forever. Maybe there's a way to meet that ancient insight with modern sensing and thoughtful AI, and help people learn to listen — not on a cushion in silence, but in the middle of a life.

---

*Notice is in beta on TestFlight. Designed and built in about 24 hours of work with Claude — as both the development tool and the product's intelligence layer.*

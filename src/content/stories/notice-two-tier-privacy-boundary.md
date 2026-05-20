---
project: notice
shape: design-decision
agentRelevance: agent
tagline: Two-tier AI is a privacy boundary the regulator can audit
questions:
  - "When have you had to decide between on-device and cloud inference?"
  - "How do you handle privacy in an AI-integrated product when the regulatory environment matters?"
  - "Talk about a design where multiple kinds of constraints — technical, regulatory, product — all had to be satisfied at once."
handles:
  - "Notice's privacy story is architecturally enforced, not policy-enforced — and the architecture fell out of the intersection of the regulatory environment and the platform constraints, not from a privacy preference."
  - "The interesting thing in the two-tier design is that the 3B on-device model is doing real work — it's orchestrating four tool calls and producing the structured summary. Claude only ever sees the summary."
  - "The Cloudflare proxy is opaque — never deserializes request bodies — and that's not paranoia, it's HBNR compliance."
---

## Project orientation

Notice is an Apple Watch and iPhone app for interoceptive awareness — the user taps when they notice an internal state shift, the app captures heart rate, HRV, calendar context, location, and the user adds an emotion label. Then it generates a contemplative reflection on the pattern over time. The reflection layer is the load-bearing AI work.

## Opener

The first hard question was where the AI actually runs. Two real constraints pushed in opposite directions. The technical one: Apple Foundation Models aren't available on watchOS at all, so any on-device inference has to happen on the iPhone — and Foundation Models is a ~3B model, which is fine for tool orchestration but won't carry a longitudinal reflection well. The regulatory one: Notice combines biometric data with emotional self-reports, which qualifies as health information under the FTC's 2024 Health Breach Notification Rule. Any disclosure to a third party — including for inference — has to be architecturally bounded. So I split the work into two tiers. The on-device model reads everything raw and orchestrates four tools — HealthKit, EventKit, CoreLocation, Contacts — to assemble a structured summary. The cloud model, Claude, only ever sees that summary. No raw biometric values cross the boundary, no absolute timestamps, no location coordinates, no contact names. The Cloudflare Worker that proxies to the Anthropic API is opaque — it never deserializes request or response bodies, so there's no logging surface that could capture pre-summarization data.

## Punchline

The two-tier split isn't a latency optimization; it's a privacy boundary the regulator can audit and the marketing team can name without lying.

## Arc beats

- *Context.* AI-integrated app combining biometrics with emotional self-reports — FTC HBNR territory at $53K per violation, plus FDA's General Wellness Guidance keeps Notice out of FDA jurisdiction only if disease claims stay absent.
- *Constraint stack.* Foundation Models unavailable on watchOS; HRV not measurable on demand on Apple Watch; background CPU budget 4 seconds; complications max 4 updates per hour; Apple's November 2025 guidelines require explicit disclosure for third-party AI as a "pop-up or clearly visible interaction."
- *Options.* All-cloud with bundled key (simple but ships a regulatory exposure on every device); all-on-device with a small model (privacy clean but loses longitudinal reflection quality); two-tier with on-device summarization and cloud reflection on summaries only (more architecture, but the privacy claim is enforceable).
- *Choice.* Two-tier. The on-device Foundation Models session orchestrates tool calls and produces a structured `FrameSnapContext` with biometric trends ("HRV below your 4-snap average") and semantic context ("at office, standup in 15 min") — no raw values. The Claude API receives only that summary plus the user's debrief (emotion label, intensity, optional note).
- *Tradeoffs.* The 3B model has to reliably orchestrate three to four tool calls under a real time budget; that's a known empirical risk (D2 on FM fallback hardening). A Cloudflare Worker proxy with DeviceCheck validation replaces the bundled key — every beta build that shipped with a key in the binary was an exposure window.
- *Lesson.* When the regulatory framing and the architectural framing point at the same boundary, encode the boundary structurally — opaque passthrough at the proxy, structured-summary-only at the payload, explicit field separation for incompatible HRV metrics from different devices. The constraint becomes a feature you can name.

## Verify

- [VERIFY] CLAUDE.md §"Research-Informed Constraints — Regulatory" for FTC HBNR ($53K/violation), FDA General Wellness Guidance, Apple November 2025 disclosure guidelines.
- [VERIFY] CLAUDE.md §"Two-Tier AI Design" and §"Privacy Architecture" for on-device tool list (HealthKit, EventKit, CoreLocation, Contacts), Tier 2 receives structured summaries only.
- [VERIFY] notice-foundation-v3.md §5 for tool list and `FrameSnapContext` shape.
- [VERIFY] notice-api-proxy-session.md §"Workstream 1" for "opaque passthrough — never parse/log bodies."
- [VERIFY] DECISIONS.md D6 for the tiered consent flow that complements this architecture.
- [VERIFY] Confirm before deploying: the 3B on-device tool orchestration is shipping and validated on TestFlight; the proxy is live at api.notice.tools.

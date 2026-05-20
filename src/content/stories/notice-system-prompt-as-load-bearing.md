---
project: notice
shape: problem-and-method
agentRelevance: agent
tagline: The system prompt is load-bearing code, not documentation
questions:
  - "How do you design a system prompt that has to embody a specific philosophy or voice, not just answer questions?"
  - "What makes a system prompt high-quality, in your experience?"
  - "When you're building on top of a large model, what's the highest-leverage artifact?"
handles:
  - "The system prompt is the load-bearing artifact in an AI-integrated product, and most people underwrite it because they think of it as a sidecar to the code."
  - "The way I think about it is: the system prompt has to encode the philosophy structurally enough that the model holds it across thousands of generations, not just on the first one."
  - "I treat the system prompt the way you'd treat a schema — versioned, reviewed, with an explicit subagent for fresh-eyes review of any copy that has to live next to it."
---

## Project orientation

Notice helps users develop interoceptive awareness — the felt sense of their internal state — by pairing subjective noticing with biometric data over time. The AI's job is to generate contemplative reflections on what the user notices. The voice is specific: Jhourney contemplative tradition, oriented toward how the user is meeting their experience rather than what the experience is.

## Opener

Most of what I do on Notice happens in Swift, but the highest-leverage artifact in the whole codebase is a markdown file. The system prompt is what makes Claude a contemplative reflection partner instead of a wellness chatbot, and every line in it is doing work. I designed it around a single governing principle from the contemplative tradition I'm drawing on — orient toward relation, not object; how the user is meeting their experience, not what the experience is. Then I wrote ten design constraints that operationalize the principle: curiosity over correction, process over outcome, never pathologize, mapping not intervention. Then I encoded a pattern vocabulary the model can actually reach for — suppression-explosion oscillation, narrow range, absence, rigidity, scaffolding decay, divergence — with worked examples for each. The reflection styles get explicit length budgets and orientation: brief at snap time orients toward conductivity, exploratory at debrief orients toward curiosity, weekly orients toward pattern of relation. The privacy architecture gets named: Claude receives structured summaries, never raw data, and the prompt tells Claude how to acknowledge that when the user asks.

## Punchline

The system prompt is the spine. If you treat it like documentation, you'll get a chatbot. If you treat it like load-bearing code, you can encode a philosophy structurally enough that the model holds it across thousands of reflections.

## Arc beats

- *Problem framing.* For an AI-integrated product where voice and orientation matter — not just facts — the model's behavior is almost entirely determined by the system prompt. Tone-of-voice instructions don't do the work. Structural encoding does.
- *Worked example.* Notice's system prompt is about 250 lines and contains: role + privacy boundary; one governing principle; three reflection styles with length and orientation per style; ten design constraints; six-entry pattern vocabulary table; voice and register; what Claude receives and what it never sees; epistemic humility; edge cases (user in crisis, asks for medical advice, optimization-mode usage); request format and response format.
- *Method.* Every constraint pairs a "do this" with a "not this" — concrete contrast pulls the model toward the intended behavior far more reliably than positive framing alone. The pattern vocabulary table maps "what it looks like in snap data" to "how to reflect it," because the model needs the recognition handle and the response template paired.
- *Technical layer.* The prompt is what makes the regulatory constraints survive contact with generation: "never pathologize" is encoded structurally so a thousand reflections later, the model still won't say "your stress levels are concerning."
- *Analog.* It's the same move as treating the schema as the source of truth instead of letting the code's runtime assumptions sprawl — except the schema here is the system prompt, and the runtime is the model's generation.

## Verify

- [VERIFY] docs/notice-claude-system-prompt-v1.md: governing principle, three reflection styles with length budgets, ten design constraints, pattern vocabulary table with six entries (suppression-explosion / narrow range / absence / rigidity / scaffolding decay / divergence).
- [VERIFY] notice-foundation-v3.md §6 for the philosophical lineage of the constraints (Shear frame-dependence, Jhourney object-vs-relation).
- [VERIFY] HARNESS_AUDIT_EXECUTION.md §"copy-reviewer" subagent: "AI reflections orient toward relation, never object" enforced as a fresh-eyes review pass.
- [VERIFY] Confirm before deploying: the prompt is v1 and shipping in TestFlight; iteration is ongoing.

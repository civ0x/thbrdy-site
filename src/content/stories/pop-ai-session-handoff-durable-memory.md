---
project: pop-ai
shape: problem-and-method
agentRelevance: agent
tagline: Chat history isn't memory — the doc is the memory
questions:
  - "How do you handle long-running work that spans multiple sessions?"
  - "Where does state live in your workflows — in chat, in docs, somewhere else?"
  - "What goes in a handoff and what doesn't?"
handles:
  - "I treat session handoffs the way you'd treat a checkpoint — capture state in a form the next process can resume from."
  - "When work spans sessions, the doc is the memory. Chat is the working memory of one session, and that's all."
  - "The most under-rated artifact in agent workflows is the handoff."
---

## Project orientation

PopAi is a weekly newsletter I write. A given essay can take three or four sessions across multiple skills — architecture review, flow review, sentence clarity, audience calibration. Each session is a separate agent invocation; I needed a way to carry decisions across them without depending on chat history.

## Opener

The trust-boundary essay went through four editorial passes. Each one is a different skill — architecture, flow, sentence clarity, audience calibration. Each one is a separate session. Between the last edit pass and the next task — converting selected footnotes to inline hyperlinks for Substack — I wrote a handoff document. Not a summary of the conversation. A launch point. Current state in three sentences. The decisions already made, as a table — which footnotes become inline links, which stay as footnotes, why. What's actually been done, as a list. What remains. And a voice calibration note pointing at the artifacts the next session needs to read to stay in register.

## Punchline

Chat history is not memory — the doc is the memory, and the handoff is the protocol for transferring it.

## Arc beats

- Problem framing: a long task crosses session boundaries because the harness is built around discrete agent invocations, not continuous threads. State carried in chat is one summarization-by-the-next-session away from being silently lossy.
- Worked example: trust-boundary essay handoff between the editorial-pass sequence and the link-placement task. Decisions about footnote-to-link conversion captured as a structured table, not narrative — so the next session can act on them without re-deriving the judgment.
- Method: every handoff has a fixed shape — Current State (where things are in two or three sentences); Next Move (the immediate task, specified concretely); What's Done (so the next session doesn't redo it); What Remains (so the scope is bounded); and any voice or calibration notes that travel with the work.
- Technical layer: the handoff doc is durable; the chat is consumable. The doc is what the next session reads first. The doc gets updated, not appended to.
- Analog: same discipline as a checkpoint in a long-running computation. The checkpoint isn't a log — it's the state from which work can be resumed without replay.

## Verify

- [VERIFY] Artifact: `trust-boundary-essay-handoff.md` — Current State, Next Move (with structured table of link conversion decisions), What's Done, What Remains After Links, Voice Calibration Note.
- [VERIFY] Evidence of session sequence: four editorial passes named in opening — "architecture review, flow/coherence, sentence clarity, and audience calibration" — each corresponds to a distinct skill in the available skills set.
- [VERIFY] Structured decisions, not narrative: the link-conversion table (current footnote → anchor text → what to link) is the strongest evidence that handoffs encode decisions in a form the next session can act on.
- [VERIFY] Your user preferences phrase this as "durable project state lives in versioned documents, not chat history" — direct quote available if pressed.
- [CONJECTURE] The "checkpoint" analog is yours to deploy — strength of analogy is `[CONJECTURE]` for an interviewer's taste, not a fact in artifacts.

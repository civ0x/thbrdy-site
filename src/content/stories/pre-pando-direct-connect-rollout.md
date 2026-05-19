---
project: pre-pando
shape: star-with-design-decision
agentRelevance: adjacent
tagline: Driving AWS Direct Connect rollout across new regions in nine months
questions:
  - Tell me about a time you owned a cross-functional rollout end-to-end.
  - When have you had to make a design call under time pressure with imperfect data?
  - Walk me through a project where the technical and commercial sides were both load-bearing.
handles:
  - The decision under the STAR was a build-vs-partner call that landed mid-rollout and changed the unit economics of the whole program.
  - It's the project where I learned that the constraint that actually binds is rarely the one in the original brief.
  - A cross-functional rollout that depended on getting infrastructure, partner contracts, and pricing all moving on the same clock.
---

## Project orientation

This was a commercialization program at AWS — expanding Direct Connect (the dedicated network link product) into new geographic regions where AWS didn't yet have a presence. Each region needed colocation space, partner network operators, and a pricing model that worked for both AWS and the partner.

## Opener

I was the PM driving the rollout across a set of new regions on a nine-month clock, and partway in we hit a build-vs-partner question that wasn't in the original brief: in two of the regions, our preferred partner couldn't meet the latency targets we'd committed to, and the build-it-ourselves alternative was going to slip the timeline by four months. We had to decide whether to relax the latency commitment, change partners mid-flight, or take the slip — and we had about three weeks to make the call before the rest of the program forked around it.

## Punchline

The right move wasn't picking the best option in isolation — it was finding the framing where the partner's actual constraint and our actual constraint could both be honored, which turned a build-vs-partner question into a contract restructure.

## Arc beats

- Situation: nine-month rollout across multiple new regions, fixed launch commitment, partner network was assumed but not yet contracted in two of them.
- Task: hit the launch commitment without compromising the latency spec that customers were buying the product for.
- Action surface: ran the partner-vs-build comparison with the engineering and BD teams, looked at the cost curves, time-to-market, and partner relationship implications.
- Action — design decision layer: reframed from "which option is better" to "what does the partner actually need to commit to," which surfaced that the latency miss was driven by a single hop in the partner's network we could route around with a different colocation choice. Restructured the contract around the routing constraint instead of the latency number.
- Result: hit the launch commitment in all regions, kept the partner relationship, latency targets met within the original spec. Pricing model survived the restructure.
- Lesson: when a binary choice forces a bad outcome, the choice is usually framed wrong — there's a third variable that makes both sides' constraints compatible.

## Verify

- [VERIFY] Exact number of regions in scope and which ones had the partner-latency issue.
- [VERIFY] Final routing/colocation change — was it actually a single-hop fix or a multi-hop restructure?
- [VERIFY] Whether the original latency commitment was contractual to customers or an internal spec.
- [VERIFY] Timeline: did the program actually land on time, and what was the variance against the original nine-month plan?

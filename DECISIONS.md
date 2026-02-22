# Decisions

## 001: React islands for interactive essays
**Date:** 2025-02-21
**Decision:** Permit React components hydrated via Astro islands for interactive essay visualizations. All other pages use vanilla JS only.
**Rationale:** Two substantial prototypes (ab-essay.jsx, learned-compilation-essay.jsx) already exist as React. Rewriting to vanilla JS is effort with no user-facing benefit. Astro's partial hydration scopes the React runtime to pages that use it — zero JS ships on pages that don't use React.
**Constraint:** React is only permitted in `src/components/` for essay visualizations. No React in layouts, page chrome, or navigation.

## 002: Astro over Hugo
**Date:** 2025-02-21
**Decision:** Use Astro as the static site generator.
**Rationale:** Outputs pure static HTML with no JS runtime by default, so existing vanilla JS (mandala canvas, scroll reveal, IntersectionObserver) drops in unchanged. Native Markdown content collections with frontmatter validation. Component model (`.astro` files) is enhanced HTML — closer to what Thomas already knows than Hugo's Go templates. Supports React islands for the essay prototypes without forcing a framework on the whole site.
**Alternatives considered:** Hugo (faster builds, more opinionated, but Go templating is a new mental model with less payoff).

## 003: Fresh repo, not in-place migration
**Date:** 2025-02-21
**Decision:** Initialize `thbrdy-site/` as a new directory rather than converting the existing static file folder.
**Rationale:** Clean git history representing the actual project structure. No risk of accidental manual deploys conflicting with the new CI/CD pipeline. Old folder preserved as read-only reference for Phase 2 migration.

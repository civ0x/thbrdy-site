# Session 2q: Move Ensō Above Essay Title

## Problem

The ensō + "Notice" label is currently in the MDX content, which renders below the title. It needs to be between the "Essay" divider and the `<h1>` title, which are in `PostLayout.astro`.

## Task

### 1. Remove the ensō from the MDX

In `src/content/writing/notice.mdx`, delete the `<div>` block with the ensō image and "Notice" label that was added at the top of the content (between the imports and the Design Hypothesis paragraph).

### 2. Add a conditional ensō to PostLayout.astro

In `src/layouts/PostLayout.astro`, add the ensō between the section divider and the header — but only when `connected_project` is `"Notice"`.

Insert this block after the closing `</div>` of `.section-divider` (after line 27) and before `<header class="post__header">` (line 29):

```astro
{connected_project === "Notice" && (
  <div class="post__project-icon">
    <img src="/images/enso-transparent.png" alt="" width="48" height="48" />
    <span>Notice</span>
  </div>
)}
```

### 3. Add styles for the project icon

In the `<style>` block of PostLayout.astro, add:

```css
.post__project-icon {
  text-align: center;
  margin: 0 0 1.5rem;
}

.post__project-icon img {
  display: block;
  margin: 0 auto 4px;
  object-fit: contain;
}

.post__project-icon span {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
```

## Do not change anything else
- Do not modify the Venn component
- Do not change any other layout files or components

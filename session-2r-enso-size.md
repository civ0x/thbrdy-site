# Session 2r: Adjust Ensō Header Sizing

In `src/layouts/PostLayout.astro`, two changes:

### 1. Increase ensō image size

Change the `<img>` from `width="48" height="48"` to `width="64" height="64"`.

### 2. Increase "Notice" text and tighten spacing

In the `<style>` block, update `.post__project-icon` and its children:

```css
.post__project-icon {
  text-align: center;
  margin: 0 0 1.5rem;
}

.post__project-icon img {
  display: block;
  margin: 0 auto 2px;
  object-fit: contain;
}

.post__project-icon span {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}
```

Changes: `img` margin-bottom from `4px` to `2px` (tighter gap between image and text). `span` font-size from `14px` to `1.25rem` (bigger than body 1.15rem, smaller than h2 1.6rem).

Do not change anything else.

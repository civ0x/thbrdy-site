# Session Prompt: Add twitter:site Meta Tag

## Mission

Add `twitter:site` meta tag to `Base.astro` so Twitter associates cards with @thbrdy.

## The Fix

In `src/layouts/Base.astro`, add one line after the existing `twitter:image` meta tag (line 50):

```html
<meta name="twitter:site" content="@thbrdy" />
```

## Verification

- [ ] `npm run build` succeeds
- [ ] View source of any page confirms `<meta name="twitter:site" content="@thbrdy" />` present in `<head>`

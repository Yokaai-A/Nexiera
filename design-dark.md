# NEXIERA — Dark Mode Design Rules

Dark-mode companion to the light-mode `design.md`. Preserve NEXIERA's academic, contemporary, typography-led identity. Build a readable education marketplace—not a generic dark SaaS dashboard.

## 1. Design direction

- Character: academic, contemporary, focused, and approachable.
- Approach: flat, typography-led, grid-based, information-first.
- Dark mode must feel intentionally designed, not like every light color was simply inverted.
- Preserve the light theme's layout, hierarchy, component behavior, and brand identity.
- Prioritize readability for class descriptions, schedules, prices, forms, and tutor information.
- Do not make every section a separate dark card. Add surfaces only when they help establish hierarchy.

## 2. Color palette

Use these exact solid colors as the starting palette.

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#111318` | Main page background |
| `--color-surface` | `#191C23` | Inputs, menus, and distinct content surfaces |
| `--color-surface-raised` | `#20242D` | A surface needing slightly stronger separation |
| `--color-cobalt` | `#78A0FF` | Links, selected navigation, focus, and interactive accents |
| `--color-cobalt-strong` | `#2457C5` | Optional solid primary-button fill; verify contrast |
| `--color-text` | `#F3F4F6` | Main text and headings |
| `--color-text-secondary` | `#B1B7C3` | Supporting text and metadata |
| `--color-border` | `#343945` | Thin dividers and input borders |
| `--color-disabled` | `#777F8D` | Disabled controls, where appropriate |

### Color rules

- Let `--color-bg` dominate the page; avoid a stack of cards.
- Use `--color-surface` for functional surfaces such as inputs, dropdowns, menus, and selected areas.
- Use `--color-surface-raised` sparingly. Do not create many near-identical layers.
- Use `--color-text` for primary content and `--color-text-secondary` for descriptions and metadata.
- Use cobalt accents only for links, focus, selected states, and important actions.
- Prefer `#78A0FF` for links on dark backgrounds because it is lighter than the light-theme cobalt.
- Primary buttons may use a solid cobalt fill with a contrasting text color; verify actual contrast.
- Do not use gradients, glow, glass effects, or color-blended overlays.
- Do not use pure black (`#000000`) as the default background.
- Do not assign a different bright color to every category.
- Keep success, warning, and error colors meaningful and restrained, never decorative.
- Verify contrast in the rendered UI; do not assume every pairing is accessible just because it looks balanced.

## 3. Typography

Use **IBM Plex Sans** as the primary font, matching the light-mode system.

- Load weights `400`, `500`, `600`, and `700` only.
- `400`: body copy and descriptions.
- `500`: navigation, labels, metadata, and controls.
- `600`: class titles and section headings.
- `700`: main page headline or a small number of key emphases.
- Keep the same type scale in light and dark modes.
- Do not reduce font sizes just because the background is dark.
- Use line height around `1.5` for body text and `1.1–1.25` for headings.
- Avoid excessive all-caps text, letter spacing, or bolding every element.

| Role | Desktop size | Weight |
|---|---:|---:|
| Hero headline | 48–60 px | 600–700 |
| Page title | 36–44 px | 600 |
| Section heading | 24–32 px | 600 |
| Class/listing title | 18–22 px | 600 |
| Body text | 16 px | 400 |
| Supporting text | 14 px | 400 |
| Metadata | 13–14 px | 500 |
| Buttons/navigation | 14–16 px | 500 |

## 4. Layout and spacing

- Keep the same grid, content width, spacing scale, and alignment as light mode.
- Suggested desktop content max-width: `1120–1200px`.
- Suggested side padding: desktop `32px`, tablet `24px`, mobile `16–20px`.
- Use a spacing scale: `4, 8, 12, 16, 24, 32, 48, 64px`.
- Use whitespace and alignment—not shadows—to separate sections.
- Do not surround every section with a surface background.
- Keep mobile hierarchy and touch targets usable.

## 5. Components

### Buttons
- Use compact rectangular buttons with a `4–6px` radius.
- Primary: solid cobalt fill; verify text contrast.
- Secondary: transparent or surface background, light text, and a thin border.
- Tertiary: text link using `--color-cobalt`.
- No pill buttons, gradients, glow, or decorative shadows.
- Show hover, active, focus, and disabled states without flashy effects.

### Cards and class listings
- Do not put every item inside a card.
- Prefer clean lists with thin borders or dividers when that improves scanning.
- When cards are needed, use `--color-surface`, a subtle border, and a `4–8px` radius.
- No decorative shadows; avoid nesting cards inside other cards.
- Make class details easy to scan: title, tutor/organizer, schedule, format, and price when available.
- Use plain text for categories and metadata. Use badges only for meaningful status.

### Forms and inputs
- Use `--color-surface` for inputs, with light text and a visible border.
- Keep placeholder text readable but secondary.
- Labels must remain visible; placeholders are not labels.
- Use `--color-cobalt` for keyboard focus.
- Error and success states must include text or an icon in addition to color.

### Navigation
- Use straightforward text navigation with clear spacing.
- Mark the active page with cobalt text, a thin underline, or another restrained indicator.
- Do not put every navigation item in a pill or filled container.
- Keep the main action distinct but not oversized.

### Dividers
- Use `--color-border` for thin separators only where they clarify structure.
- Do not draw a line around every element.

## 6. Shape, depth, and effects

Strict rules:
- **No gradients.**
- **No glow or neon effects.**
- **No glassmorphism or translucent blurred panels.**
- **No decorative shadows.**
- **No pill-shaped buttons or badges by default.**
- **No excessive rounded corners.**
- No floating blobs, random abstract shapes, or decorative orbs.
- No gratuitous animation.

Prefer solid fills, thin borders, deliberate whitespace, clear typography, and meaningful interaction states. Do not use shadows to compensate for weak hierarchy.

## 7. Imagery and icons

- Use imagery only when it supports learning, classes, tutors, or campus communities.
- Avoid generic 3D illustrations, glowing objects, and decorative AI-looking backgrounds.
- Use one consistent icon family with simple line icons.
- Icons must have a purpose; do not add one to every label by default.
- Ensure icons remain legible against dark surfaces.
- Do not use emoji as a replacement for a consistent icon system.

## 8. Interaction and accessibility

- Provide visible hover, focus, active, disabled, and error states.
- Keep transitions subtle and functional, typically `120–180ms`.
- Respect reduced-motion preferences.
- Do not rely on color alone to communicate status.
- Check contrast in the actual rendered interface, especially secondary text and cobalt buttons.
- Preserve semantic HTML, keyboard navigation, and accessible focus indicators.
- Use secondary text for lower-priority content rather than pure white everywhere.

## 9. Light/dark consistency

- Keep component dimensions, font family, type scale, layout, and interaction patterns consistent across themes.
- Change color tokens, borders, and surface levels—not the entire design language.
- Do not add decorative elements to dark mode that do not exist in light mode.
- Use semantic tokens instead of hardcoding colors in each component.
- Support system preference if appropriate, and allow theme selection if the product has a theme setting.
- Avoid a flash of the wrong theme during page load if theme persistence is implemented.

## 10. Anti-patterns

Do not generate:
- Purple-to-blue gradient hero sections, gradient text, or gradient buttons.
- Neon borders, glow, or glass effects.
- Every class as a raised, shadowed card.
- Large floating mock dashboards or fake analytics.
- Repeated rows of pill badges.
- Tiny, low-contrast grey text.
- Pure-black backgrounds with blinding white text everywhere.
- Random accent colors for every category.
- Decorative counters, testimonials, or metrics that are not real.
- Distracting animations.

## 11. Instructions for AI coding tools

Before changing the UI:
1. Inspect the app structure, routes, components, and light-mode tokens.
2. Preserve existing behavior, data flow, and content.
3. Map semantic tokens to the dark palette; do not duplicate entire components unnecessarily.
4. Keep changes scoped to theme support unless a broader redesign is explicitly requested.
5. Do not invent features, course details, ratings, testimonials, or metrics.
6. Reuse shared components and tokens.
7. Test desktop and mobile, keyboard focus, contrast, forms, dropdowns, and overflow.
8. Verify default, hover, active, focus, disabled, error, and selected states.
9. If themes are not supported yet, propose the smallest maintainable implementation instead of rewriting the app.

## 12. CSS token starter

```css
:root[data-theme="dark"] {
  color-scheme: dark;

  --color-bg: #111318;
  --color-surface: #191C23;
  --color-surface-raised: #20242D;
  --color-cobalt: #78A0FF;
  --color-cobalt-strong: #2457C5;
  --color-text: #F3F4F6;
  --color-text-secondary: #B1B7C3;
  --color-border: #343945;
  --color-disabled: #777F8D;

  --font-sans: "IBM Plex Sans", sans-serif;

  --radius-control: 4px;
  --radius-card: 6px;
  --shadow-none: none;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  --content-max: 1180px;
}
```

This file is the dark-mode companion to the light-mode `design.md`. Do not add effects or colors merely to make dark mode feel more “premium”; readability, hierarchy, and useful interactions come first.

# NEXIERA — Design Rules

A practical visual system for NEXIERA. Follow these rules when creating or modifying UI. The goal is a clear, credible education marketplace—not a generic AI-generated SaaS template.

## 1. Design direction

- **Character:** academic, contemporary, direct, and approachable.
- **Visual approach:** typography-led, grid-based, information-first, flat.
- Make decisions based on usability and content hierarchy, not decoration.
- Use whitespace, alignment, typography, and thin rules to create structure.
- Do not imitate a generic dashboard or landing-page template.
- Do not add decorative elements unless they communicate something useful.

## 2. Color palette

Use these exact solid colors as the starting palette. Do not introduce gradients.

| Token | Hex | Intended use |
|---|---|---|
| `--color-white` | `#FFFFFF` | Main page background, open space, and surfaces |
| `--color-cobalt` | `#2457C5` | Primary action, active navigation, links, selected controls |
| `--color-ink` | `#20232B` | Main text, headings, navigation, and strong icons |
| `--color-mist` | `#E5E9F0` | Subtle section separation, disabled surfaces, quiet borders |
| `--color-muted` | `#626B78` | Secondary text and metadata |
| `--color-border` | `#D9DEE7` | Thin dividers and input borders |

### Color rules

- White should dominate the interface.
- Ink is the default text color.
- Cobalt is an accent with meaning, not a background decoration. Use it selectively.
- Use cobalt for the main CTA and important interactive states; do not make every section blue.
- Use Mist for subtle backgrounds only when separation is needed.
- Use muted text for secondary information, but keep it readable.
- Use solid fills only: no gradients, glow, glassmorphism, or color-blended overlays.
- Do not assign a different bright color to every category.
- Do not use cobalt text on cobalt backgrounds. For primary buttons, use white text on cobalt.
- Keep status colors (success, warning, error) semantically distinct and restrained. Do not use them as decoration.
- Check text contrast for accessibility, especially small text and button labels.

## 3. Typography

### Primary font: IBM Plex Sans

Use **IBM Plex Sans** throughout the product for a consistent, functional, editorial interface.

- Load weights `400`, `500`, `600`, and `700` only.
- Use `400` for body copy and descriptions.
- Use `500` for navigation, labels, and controls.
- Use `600` for card titles and section headings.
- Use `700` sparingly for the main page headline or a key emphasis.
- Do not use extra-light weights or bold every element.
- Do not use more than one font family unless a deliberate editorial treatment is approved.

### Suggested type scale

| Role | Desktop size | Weight | Notes |
|---|---:|---:|---|
| Hero headline | 48–60 px | 600–700 | Short, clear, preferably 2–3 lines maximum |
| Page title | 36–44 px | 600 | One clear title per page |
| Section heading | 24–32 px | 600 | Distinct hierarchy below page title |
| Card/class title | 18–22 px | 600 | Keep titles readable and scannable |
| Body text | 16 px | 400 | Default paragraph size |
| Supporting text | 14 px | 400 | Descriptions and secondary details |
| Metadata | 13–14 px | 500 | Schedule, format, organizer; avoid tiny text |
| Button/navigation | 14–16 px | 500 | Clear and direct |

- Use a comfortable line height: about `1.5` for body text and `1.1–1.25` for headings.
- Avoid oversized headings everywhere. Large type is reserved for primary page messages.
- Avoid excessive letter spacing, all-caps paragraphs, and decorative font treatments.
- Keep headings concise and descriptive.

## 4. Layout and spacing

- Use a consistent content grid and align page sections to the same container.
- Suggested desktop max content width: `1120–1200px`.
- Suggested desktop side padding: `32px`; tablet: `24px`; mobile: `16–20px`.
- Use a spacing scale based on multiples of `4px` (4, 8, 12, 16, 24, 32, 48, 64).
- Let content determine section height; do not fill empty areas with decoration.
- Prefer clear section spacing over extra containers.
- Avoid random alignment changes between sections.
- Design mobile layouts intentionally; do not simply shrink the desktop layout.

## 5. Components

### Buttons
- Use compact rectangular buttons with a small radius of `4–6px`.
- Primary button: cobalt fill with white text.
- Secondary button: white background, ink text, thin border.
- Tertiary action: plain text link.
- Do not use pill-shaped buttons.
- Do not add gradients, glow, or large shadows to buttons.
- Keep labels action-oriented: e.g. “Cari kelas”, “Buat kelas”, “Daftar”.

### Cards and listings
- Do not put every piece of content inside a card.
- For class discovery, use a clean listing or restrained card layout based on what best supports scanning.
- Prefer white surfaces, thin borders, and clear spacing.
- If cards are used, use a radius of `4–8px`; avoid exaggerated rounding.
- No decorative card shadows. Use borders and spacing for separation.
- Do not wrap cards in additional cards.
- Avoid making every card identical if the content hierarchy calls for a featured listing.
- Show useful class information: title, organizer/tutor, schedule, format, and price when available.
- Do not add badges merely to fill space. Use simple text labels for category and metadata.
- Only use a badge or status marker when it communicates a meaningful state.

### Forms and inputs
- Use white inputs with a thin border.
- Use a visible, accessible focus state using cobalt.
- Labels should sit clearly above fields; do not rely on placeholder text as the only label.
- Keep error messages close to the relevant field and explain how to fix the issue.
- Avoid oversized rounded search bars.

### Navigation
- Use straightforward text navigation with clear spacing.
- Indicate the active page with cobalt text, a thin underline, or another restrained marker.
- Do not put every navigation item inside a pill.
- Keep the primary action visually distinct without making the navbar overly decorated.

### Dividers
- Use thin, low-contrast rules (`--color-border`) to separate content where useful.
- Do not add dividers to every element; use them to clarify structure.

## 6. Shape, depth, and effects

These are strict rules:

- **No gradients.**
- **No glow or neon effects.**
- **No glassmorphism.**
- **No decorative shadows.**
- **No pill badges or pill buttons by default.**
- **No excessive rounded corners.**
- No floating blobs, random abstract shapes, or decorative orbs.
- No oversized emoji used as UI decoration.
- No gratuitous animation or scroll-triggered effects.
- Do not use gradients or shadows to make a weak layout appear polished.

Prefer:
- flat color,
- thin borders,
- consistent alignment,
- meaningful whitespace,
- strong typography,
- clear interaction states.

## 7. Imagery and icons

- Use imagery only when it supports learning, classes, tutors, or campus community.
- Prefer genuine, relevant photography or purposeful illustrations over generic AI-looking 3D blobs.
- Avoid random stock illustrations, floating 3D objects, and decorative AI-generated gradients.
- Use one consistent icon family with simple line icons.
- Icons must have a function; do not add icons to every label automatically.
- Do not use emoji as a replacement for a coherent icon system.

## 8. Interaction and accessibility

- Interactive elements must have visible hover, focus, active, disabled, and error states where relevant.
- Keep transitions subtle and functional, typically `120–180ms`.
- Respect reduced-motion preferences.
- Never rely on color alone to convey status.
- Keep text readable and controls usable on mobile.
- Preserve semantic HTML and keyboard accessibility.

## 9. Responsive behavior

- Desktop: use the full content grid and balanced whitespace.
- Tablet: reduce columns and spacing while preserving hierarchy.
- Mobile: prioritize search, class information, and the main action; stack content logically.
- Avoid horizontal overflow and tiny metadata.
- Do not create a separate visual style for mobile; it should be the same design system adapted to the screen.

## 10. Content and UI copy

- Use direct, human language.
- Avoid generic marketing clichés such as “Unlock your potential,” “Transform your journey,” or “Your future starts here.”
- Prefer specific copy about finding classes, learning skills, meeting tutors, and sharing knowledge.
- Keep labels short and consistent: “Cari kelas”, “Buat kelas”, “Jadwal”, “Format”, “Harga”, “Penyelenggara”.
- Avoid unnecessary capitalization and excessive exclamation marks.

## 11. Anti-patterns: do not generate these

- Gradient hero backgrounds or gradient text.
- Blue-purple gradient blobs.
- Neon outlines, glow, or glass effects.
- Rows of pill-shaped category badges.
- Every section inside a rounded white card with a shadow.
- Oversized rounded CTA buttons.
- Decorative stats counters with no real product value.
- Generic three-feature sections with identical icon circles unless they serve a real purpose.
- Floating mock dashboards that do not represent real NEXIERA functionality.
- Excessive centered text and symmetrical sections used by default.
- Random decorative icons or illustrations to fill whitespace.
- Unnecessary animation that distracts from finding or creating classes.

## 12. Implementation guidance for AI coding tools

Before changing UI:
1. Inspect the existing routes, components, and design tokens.
2. Preserve existing functionality and data flow.
3. Identify the page's primary user task.
4. Apply these rules consistently rather than redesigning every component independently.
5. Do not invent features, metrics, reviews, course details, or testimonials.
6. Reuse shared components and tokens instead of introducing one-off styles.
7. Keep changes scoped; do not rewrite unrelated code.
8. After implementation, check desktop and mobile layouts, contrast, focus states, and overflow.

When asked to improve a page, make the smallest set of changes that produces a clear improvement. If a design choice conflicts with usability or accessibility, prioritize usability and accessibility while keeping the visual direction.

## 13. CSS token starter

```css
:root {
  --color-white: #FFFFFF;
  --color-cobalt: #2457C5;
  --color-ink: #20232B;
  --color-mist: #E5E9F0;
  --color-muted: #626B78;
  --color-border: #D9DEE7;

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

Treat this document as the visual baseline for NEXIERA. Do not add visual effects or new colors just to make a page look more “modern.” Modernity should come from clarity, consistency, typography, and useful interactions.

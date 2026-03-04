# CLAUDE.md — Citadel Project Business Website

## Project Overview

Static institutional website for **Citadel Project Business**, a Brazilian multidisciplinary engineering firm specializing in Industry 4.0 solutions (electrical, mechanical, and industrial safety projects). The site serves as a lead-generation and brand-presence platform targeting clients in the mining, steel, and industrial sectors.

- **Language**: Portuguese (pt-BR) — all content, comments, and user-facing text must remain in Portuguese
- **Stack**: Vanilla HTML5 / CSS3 / JavaScript — no frameworks, no build tools, no package manager
- **Deployment**: 100% static; works by opening `index.html` directly in a browser or hosting on any static server (GitHub Pages, Netlify, Vercel, FTP)

---

## Repository Structure

```
citadel-website/
├── index.html          # Single-page application — all content lives here
├── style.css           # Full design system: tokens, layout, components, responsive rules
├── app.js              # All interactivity: nav, scroll, animations, forms, chatbot modal
├── logo.jpg            # Company logo (used in navbar and footer)
├── README.md           # Project overview for humans
└── CLAUDE.md           # This file — guidance for AI assistants
```

There are no subdirectories, no build artifacts, and no configuration files. All assets are flat in the root.

---

## Architecture

### `index.html`
Single HTML file containing the full page structure. Sections map 1-to-1 with `id` anchors used for in-page navigation:

| Section ID     | Purpose                                      |
|----------------|----------------------------------------------|
| `#inicio`      | Hero — headline, subtitle, CTA button        |
| `#servicos`    | Services grid — 4 service cards              |
| `#projetos`    | Project portfolio — 3 featured project cards |
| `#materiais`   | Lead magnet — e-book download form           |
| `#sobre`       | About — mission, vision, values              |
| *(no id)*      | Testimonials — auto-scrolling slider         |
| *(no id)*      | Final CTA banner                             |
| `#contato`     | Contact form + contact info                  |
| *(footer)*     | Footer — logo, nav links, social icons       |

Two additional floating elements exist outside the section flow:
- `.chatbot-button` — fixed floating action button
- `#chatbot-modal` — modal wrapper containing the Super Agentes AI iframe

**External dependencies loaded via CDN (no local copies):**
- Google Fonts: `Poppins` (300, 400, 500, 600, 700)
- Font Awesome 6.0.0 — all icons use `fas`/`fab` classes

### `style.css`
Implements a full **design token system** using CSS custom properties on `:root`. Tokens are organized in layers:

1. **Primitive tokens** — raw color values (e.g., `--color-teal-500`, `--color-slate-900`)
2. **RGB variants** — same values as `r, g, b` triplets for use with `rgba()` (e.g., `--color-teal-500-rgb`)
3. **Semantic tokens** — role-based aliases (e.g., `--color-primary`, `--color-background`, `--color-text`)
4. **Spacing tokens** — `--space-0` through `--space-32`
5. **Typography tokens** — `--font-size-xs` through `--font-size-4xl`, weight, line-height
6. **Border radius tokens** — `--radius-sm` through `--radius-full`
7. **Shadow tokens** — `--shadow-xs` through `--shadow-lg`
8. **Animation tokens** — `--duration-fast`, `--duration-normal`, `--ease-standard`
9. **Layout tokens** — `--container-sm` through `--container-xl`

**Theme support:** Dark mode is handled two ways:
- `@media (prefers-color-scheme: dark)` — automatic OS-based switching
- `[data-color-scheme="dark"]` / `[data-color-scheme="light"]` — manual switching via `data-color-scheme` attribute on a parent element

The site-specific brand variables (used by components) reference the semantic tokens:

| Variable                    | Light value         | Dark value         |
|-----------------------------|---------------------|--------------------|
| `--color-primary-blue`      | `#002147`           | —                  |
| `--color-orange`            | `#FF6B00`           | —                  |

### `app.js`
Plain JavaScript, no modules, no transpilation. All DOM queries run at script parse time (script is loaded at end of `<body>`). Key responsibilities:

| Feature                    | Implementation detail                                              |
|----------------------------|--------------------------------------------------------------------|
| Mobile hamburger menu      | Toggle `.active` on `#hamburger` and `#nav-menu`                  |
| Smooth scroll (links)      | `querySelectorAll('a[href^="#"]')` + `window.scrollTo`            |
| `scrollToSection(id)`      | Global function called from `onclick` attributes in HTML          |
| Scroll-triggered animations| `IntersectionObserver` adds `.fade-in` to `.section` elements     |
| Card entrance animation    | Separate `animateOnScroll()` using `getBoundingClientRect`         |
| Testimonials auto-scroll   | `setInterval(nextTestimonial, 5000)` every 5 s                     |
| Testimonials drag scroll   | Mouse + touch event listeners on `#testimonials-slider`           |
| Navbar transparency        | `scroll` listener changes `backgroundColor` at `scrollY > 50`    |
| Chatbot modal              | Toggle `display: block/none` on `#chatbot-modal`                  |
| Form submission            | `preventDefault`, inline validation, `showMessage()` toast        |
| Inline form validation     | `input` event listener with `validateEmail()` / `validatePhone()` |
| Toast notifications        | `showMessage(text, type)` creates/animates a fixed DOM element    |
| Keyboard accessibility     | `keydown`: Escape closes modal, arrow keys navigate testimonials  |

---

## Design Conventions

### Colors
Always use CSS variables — never hardcode hex/rgb values in new rules.

```css
/* Good */
color: var(--color-text);
background: var(--color-primary);

/* Bad */
color: #002147;
background: #21808d;
```

Brand palette for site-specific components (navbar, hero, CTAs):
- **Primary Blue**: `#002147` — navbar, hero overlay, footers
- **Orange**: `#FF6B00` — CTA buttons (`.btn-primary`), accents
- **Light Gray**: `#F5F5F5` — section backgrounds
- **Text dark**: `#333` — headings
- **Text medium**: `#666` — body copy
- **Text light**: `#999` — secondary text

### Typography
- Font family: `Poppins` (loaded from Google Fonts)
- Use token variables for font sizes: `var(--font-size-base)`, `var(--font-size-lg)`, etc.

### Layout
- All sections use `.container` (max-width ~1200 px, `padding: 0 20px`, `margin: 0 auto`)
- Sections add `.section` class which has vertical padding
- Grids use CSS Grid (`display: grid`, `grid-template-columns: repeat(auto-fit, ...)`)

### Responsive breakpoints (defined in `style.css`)
- Mobile first; breakpoints at approximately `768px` and `1024px`
- Hamburger menu appears below `768px`
- Grid columns collapse to single column on mobile

---

## Development Workflow

### Running Locally
No build step required:
```bash
# Open directly in browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# Or serve with any static server
npx serve .
python3 -m http.server 8080
```

### Making Changes
1. Edit `index.html`, `style.css`, or `app.js` directly
2. Refresh the browser — no compilation needed
3. Test at multiple viewport widths (mobile ~375 px, tablet ~768 px, desktop ~1280 px)

### No Linting or Testing Infrastructure
There is no ESLint, Prettier, Jest, or CI pipeline configured. Keep code consistent with existing style:
- 4-space indentation in JS
- 2-space indentation in CSS
- Use `const`/`let`, arrow functions, template literals in JS
- Prefer `addEventListener` over inline handlers (except `scrollToSection` calls already in HTML)

---

## Chatbot Integration

The AI chatbot is powered by **Super Agentes AI** and embedded as an `<iframe>`:

```html
<iframe src="https://dash.superagentes.ai/agents/cmc26zkpm002n9vzhoys499eb/iframe"
        width="100%" height="100%" frameborder="0"
        allow="clipboard-write"
        title="Assistente Virtual Citadel">
</iframe>
```

The agent ID is `cmc26zkpm002n9vzhoys499eb`. To change the chatbot agent, update the `src` URL with the new agent ID from the Super Agentes AI dashboard.

---

## Forms

Both forms currently use **client-side-only** handling — there is no backend or third-party form service connected. Submissions show a toast notification but do not send data anywhere.

| Form               | Element ID          | Fields                                     |
|--------------------|---------------------|--------------------------------------------|
| Materials (e-book) | `#materials-form`   | nome (text), email, empresa (text)         |
| Contact            | `#contact-form`     | nome, empresa, email, telefone, mensagem   |

To connect a real backend, replace the `showSuccessMessage(...)` call in each form's `submit` handler in `app.js` with a `fetch()` POST to the desired endpoint.

---

## Project Images

Project cards in `#projetos` currently use placeholder images from `via.placeholder.com`. Replace these `src` attributes with real project photos when available:

```html
<!-- Current placeholder -->
<img src="https://via.placeholder.com/400x250?text=Projeto+1" alt="Upgrade Elétrico Mina X">

<!-- Replace with -->
<img src="images/projeto-mina-x.jpg" alt="Upgrade Elétrico Mina X">
```

Similarly, the About section uses a placeholder for the team photo.

---

## Zip Archives

Two zip files exist at the repo root (`citadel-site.zip`, `exported-assets.zip`). These are upload artifacts and are not referenced by the site. Do not modify or depend on them.

---

## Key Constraints for AI Assistants

- **No framework introductions** without explicit request — the project intentionally uses vanilla JS/CSS
- **No build tooling** (webpack, vite, etc.) without explicit request
- **No npm/package.json** — there are no dependencies to install
- **Preserve Portuguese** — all user-facing content must remain in pt-BR
- **Use CSS variables** — never hardcode color or spacing values
- **Single HTML file** — do not split into multiple pages/routes without explicit request
- **No `name` attributes on form inputs** — the materials form inputs currently lack `name` attributes; be aware when adding backend integration
- **`scrollToSection` is a global function** — it is called from `onclick` in HTML; do not scope or rename it without updating all HTML callers

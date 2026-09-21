# schatten. — Curiosity, engineered.

An editorial engineering fieldbook at **[schatten007.github.io](https://schatten007.github.io)**.

Applied AI, useful automation, and the systems behind them. Built with Astro, typed Markdown collections, custom CSS, and a small amount of browser JavaScript.

## Run locally

Requires Node.js 22.12+ (Node 24 is used in CI).

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321`. Pages and content reload as you edit.

## Add a project

1. Copy `docs/project-template.md` into `src/content/projects/my-project.md`.
2. Set `draft: false` when it is ready. Update the title, category, source links, tags, and architecture steps.
3. Write the case study in Markdown. Keep results tied to evidence and distinguish a next step from completed work.
4. Run `npm run check` and `npm run build`.
5. Commit and push to `main` to publish.

The case-study route, work index, category filter, and search entry are automatic. `featured: true` includes a project in the home-page selection; the home page shows the first three featured projects by `order`. `visual: generic` provides a ready-to-use exhibit, so new work does not require new illustration code.

**Content locations**

| Change | File |
| --- | --- |
| Public name, handle, email, links | `src/data/site.ts` |
| Experience, education, skills, credentials | `src/data/career.ts` |
| Projects | `src/content/projects/*.md` |
| Notes | `src/content/notes/*.md` |
| Home-page copy | `src/pages/index.astro` |
| Colors, typography, responsive styles | `src/styles/global.css` |
| Project artwork | `src/components/ProjectArt.astro` |
| Browser-local schema explainer | `src/scripts/lab.ts` |
| Metadata & navigation | `src/layouts/Base.astro` |

Only published content (`draft: false`) appears in the site. Frontmatter is validated at build time in `src/content.config.ts`. A note's `relatedProject` is the project's filename without `.md`.

## Add a note

Copy `docs/note-template.md` to `src/content/notes/my-note.md`, fill in the metadata, and write. The notebook and search update automatically; the newest two notes appear on the home page.

## Refresh the PDF and social image

The CV page has a print stylesheet. Its downloadable PDF and the social preview PNG are committed generated assets. After changing career data, refresh them with a local dev server running:

```sh
npx playwright install chromium
node scripts/export-assets.mjs
```

Then rebuild. `public/social-card.svg` is the editable source for the social image. The on-page “Print / save PDF” button always uses the current CV page.

## Verify

```sh
npx playwright install chromium
npm run verify
```

Checks include Astro/TypeScript diagnostics, the static build, and Playwright desktop/mobile flows for navigation, filtering, keyboard search, schema fixtures, reduced motion, no-JavaScript reading, print CV, internal reading links, and automated accessibility checks. Playwright always serves the production build on port 4322, separately from the development server. Failure artifacts are in `test-results/`; the HTML report is in `playwright-report/`.

## Publish

GitHub Pages uses **GitHub Actions** as its source. `.github/workflows/deploy.yml` checks, builds, runs the browser suite, and publishes `dist/` on a successful push to `main`. Pull requests run checks without publishing.

The site is a user Pages repository (`schatten007.github.io`), so it uses `/` paths and no repository base prefix. To move to a custom domain, update `astro.config.mjs`, `src/data/site.ts`, and `public/robots.txt`, then configure the domain in Pages.

**Rollback:** use `git revert <bad-commit>` and push the resulting revert commit to `main`. The same workflow rebuilds and deploys the previous content. Verify the home page and the affected route after deployment.

## Content provenance

Launch projects are based on these public snapshots:

- [CV Tailor — 20 Sep 2026](https://github.com/schatten007/cv-tailor/tree/4f5031617853fea08f66697f30c1b65ab41fb133)
- [SchemaSentinel — 15 Sep 2026](https://github.com/schatten007/SchemaSentinel/tree/1c222db3ee948c3cfa7e046c0d6daac74e7f03cd)
- [EU Tech Labour Observatory — 6 Sep 2026](https://github.com/schatten007/EU-Tech-Labor-Observatory/tree/8ca23914700c199c90e8b39ba2fc4e25475eff95)

Repository evaluation figures are attributed in the case studies. The project exhibits are conceptual illustrations. The Observatory artwork is not a live data feed, and the schema lab is a teaching model rather than the full validator. Launch notes are explanatory write-ups of those project decisions.

The supplied source CV remains local and is ignored by Git. The public profile uses initials and GitHub contact. There are no runtime API keys, analytics scripts, or third-party font requests.

## Design

Warm charcoal, parchment, and electric chartreuse. Manrope for the structure; Instrument Serif for the curiosity. Original project exhibits, numbered sections, a controllable wireframe torus, and real content in static HTML. Design requirements live in `specs/portfolio.spec.md`.

# Schatten — an engineering fieldbook

## Direction

**Curiosity, engineered.** A visually distinctive, evidence-led portfolio for applied AI and automation opportunities. Secondary strengths: systems thinking, data engineering, client delivery, and computer science. Public identity: **schatten / H. A.**

The visual language is an editorial fieldbook crossed with a systems exhibit: warm charcoal, parchment, electric chartreuse, generous typography, fine rules, numbered sections, technical annotations, and one original kinetic wireframe sculpture. Project artwork explains the work instead of using stock imagery. The sculpture is a small, controllable graphic, not a prerequisite for accessing content.

## Confirmed scope

- Build and publish at `https://schatten007.github.io`.
- Prioritize creative presentation and the ability to add old and new work later.
- Curate recent public repositories: CV Tailor, SchemaSentinel, EU Tech Labour Observatory.
- Source career facts from the supplied CV; use initials and GitHub contact.
- Use Astro with validated Markdown collections and self-hosted fonts.

## Information architecture

- `/`: introduction, selected work, interactive lab invitation, latest notes, compact profile, contact.
- `/work/`: filterable project index.
- `/work/{slug}/`: problem, implementation, architecture, evidence, limits, next steps.
- `/lab/`: a working, clearly scoped schema-failure explainer.
- `/notes/`, `/notes/{slug}/`: short technical notes grounded in the public projects.
- `/about/`: profile, experience, education, credentials, working principles.
- `/cv/`: readable and printable career summary.
- `/404.html`: helpful recovery page.

## Functional requirements (EARS)

1. The site shall render all reading content and navigation as static HTML.
2. When a visitor selects a work category, the work index shall show matching projects and announce the result count.
3. When a visitor activates search or presses Ctrl/Cmd+K, the site shall open a keyboard-accessible search dialog covering projects, notes, and core pages.
4. When a visitor changes a lab fixture, the explainer shall show that fixture and reset the previous result.
5. When a visitor runs a fixture, the lab shall report the fixture's documented outcome and scope without claiming to run the full SchemaSentinel CLI.
6. When a visitor pauses motion, the sculpture shall stop and the choice shall persist when local storage is available.
7. Where reduced motion is requested, the site shall start with motion disabled.
8. When a Markdown project is added with valid metadata, the build shall create its case study, index entry, and search entry automatically.
9. When a visitor prints the CV page, the site shall produce a clean, light, navigation-free document.
10. When changes are pushed to main, GitHub Actions shall check, build, test, and publish the static site.

## Non-functional requirements

- Usable from 360px to large desktop widths without horizontal page overflow.
- WCAG AA color contrast; visible keyboard focus; native links, buttons, and dialogs; labeled controls.
- No critical or serious automated accessibility violations in the tested primary routes.
- No runtime GitHub API dependency, analytics, third-party scripts, or exposed credentials.
- Fonts served from the site; one small canvas animation that pauses offscreen and in background tabs.
- Project claims tied to dated repository snapshots; illustrative graphics clearly identified.
- Source CV document excluded from version control and build output.

## Acceptance criteria

- Given JavaScript is disabled, when a reader opens a project, then its narrative, source links, and navigation remain usable.
- Given a keyboard user, when search is opened and dismissed, then focus returns to the opening control and Escape closes the dialog.
- Given a work category, when it is selected, then only matching cards remain and the selected button reports its state.
- Given each curated lab fixture, when it runs, then the correct distinct failure/pass/unsupported outcome is shown.
- Given a mobile viewport, when any primary page is opened, then its content fits the screen and its menu can be operated.
- Given an invalid project frontmatter value, when the site builds, then schema validation fails rather than silently publishing it.
- Given the published URL, when the deployment finishes, then the home, one case study, and lab return successful responses.

## Error handling

| Condition | Behavior |
| --- | --- |
| No search result | Show a useful empty state; retain navigation options. |
| Storage unavailable | Motion controls continue working for the current page. |
| Canvas unavailable | Leave the static wireframe fallback visible. |
| JavaScript disabled | Reading works; interactive controls are hidden and lab offers source examples. |
| Unknown route | Return branded 404 with links to home and work. |
| Invalid Markdown metadata | Fail the build with a schema error. |
| Failed CI check | Do not publish. |

## Implementation checklist

- [x] Create shared design tokens, layouts, and navigation.
- [x] Build the original wireframe exhibit and project artwork.
- [x] Add project and note collections with sourced launch entries.
- [x] Implement filtering, search, the schema explainer, and print CV.
- [x] Add metadata, social preview, sitemap, and favicon.
- [x] Verify build, keyboard paths, mobile, no-JS reading, reduced motion, and accessibility.
- [x] Publish with GitHub Actions and verify the public URL.
- [x] Document content editing and rollback.

## Launch verification — 21 September 2026

- 12 static pages built; Astro check: 0 errors, warnings, or hints.
- 20 Playwright checks passed across desktop and mobile, locally and in GitHub Actions.
- Primary routes passed the automated serious/critical accessibility checks.
- Published successfully in [GitHub Actions run 35597965127](https://github.com/schatten007/schatten007.github.io/actions/runs/35597965127).
- Live home, CV Tailor, SchemaSentinel, lab, notes, about, PDF, social image, and sitemap returned HTTP 200.
- Live browser confirmed that the home-page sculpture initializes.

---
title: The chart is not the database.
description: A small architectural boundary that makes an analytical dashboard easier to trust.
category: Data systems
date: 2026-09-20
readingTime: 3 min
relatedProject: labour-observatory
---

A frontend can calculate almost anything. That does not mean it should.

In an analytical product, an innocent-looking client-side transformation can introduce a second definition of a metric. The backend counts one population. The chart filters another. A tooltip divides by a third. All three numbers may look reasonable.

## Give the UI one job

The EU Tech Labour Observatory uses a useful constraint: the application renders a checked export. If a figure is not in that export, the interface does not manufacture it.

The collection and transformation pipeline owns the source scope, mappings, denominators, and quality checks. The frontend owns the explanation and presentation.

```text
source → checked transformations → published contract → display
```

This creates a shared definition that can feed both an interactive dashboard and a no-JavaScript audit page.

## Missing is a legitimate state

The German source used by the project does not provide a structured occupation field. The dashboard therefore cannot publish a structured occupation ranking for that source.

There is a tempting shortcut: classify job titles and fill the empty panel. That would create a new model, with a new error profile, inside a product that otherwise reports source observations. It is a different feature and needs a different explanation.

Displaying “not available from this source” preserves the distinction.

## Carry the denominator

A ranking without its scope invites the reader to supply one. “Top regions” sounds national even when the data comes from a bounded sample. Keeping the denominator and sampling caveat beside the chart reduces that ambiguity.

The same principle applies to missing values: dropping unresolved rows quietly changes the population. Keeping them visible makes the transformation inspectable.

**Practical rule:** make the data contract carry enough context that the UI cannot accidentally tell a stronger story than the source.

Source: [EU Tech Labour Observatory's two-surface design and methodology](https://github.com/schatten007/EU-Tech-Labor-Observatory/tree/8ca23914700c199c90e8b39ba2fc4e25475eff95).

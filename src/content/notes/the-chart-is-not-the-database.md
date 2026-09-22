---
title: Let the dashboard display the answer
description: Why the Observatory calculates its metrics before they reach the frontend.
category: Data systems
date: 2026-09-20
readingTime: 3 min
relatedProject: labour-observatory
---

It’s easy to add a calculation to a chart component. A filter here, a percentage there. The awkward part comes when the UI and the data pipeline end up with different definitions of the same metric.

The Observatory handles that by publishing a checked export. The React app displays the numbers in that file.

## One place for the calculation

The pipeline owns the source scope, reference mappings, denominators, and checks. The frontend handles layout and explanation.

```text
source → checked transforms → published file → screen
```

Both the dashboard and the plain HTML page use the checked data. If they disagree, there are fewer places to investigate: the export version, the publishing step, or the rendering code. The UI has no separate metric calculation to reconcile.

## What happens to a missing field?

The German source used by the project has no structured occupation field. So the occupation panel says the field is unavailable.

Inferring occupations from job titles would be possible, but it would add a classifier and its errors to a product that reports source observations. It would need its own evaluation and a clear label in the UI.

For this version, the empty state explains what the source provides.

## Keep the population visible

A chart titled “Top regions” leaves an important question unanswered: top regions out of which data?

The German figures come from a capped draw over a fixed panel of 400 regions. They describe that collection, rather than national totals. Putting the scope beside the chart gives the reader that context before they interpret the ranking.

Unresolved values also stay visible. Dropping them would change the denominator and make the chart harder to compare with the source.

Source: [The Observatory’s application rules and methodology](https://github.com/schatten007/EU-Tech-Labor-Observatory/tree/8ca23914700c199c90e8b39ba2fc4e25475eff95).

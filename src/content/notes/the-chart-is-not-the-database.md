---
title: The chart is not the database.
description: Why the dashboard in my labour project only shows numbers from a checked export.
category: Data systems
date: 2026-09-20
readingTime: 3 min
relatedProject: labour-observatory
---

The frontend can compute anything. That is the problem.

I once had three versions of one metric: the backend counted one group, the chart filtered another, and the tooltip divided by a third. All three looked reasonable. None of them matched.

## Give the UI one job

In the labour project, the React app only renders a checked export. If a number is not in that export, it is not on screen.

The pipeline owns sources, mappings, denominators, and checks. The frontend owns wording and layout.

```text
source → checked transforms → published file → screen
```

One definition feeds both the dashboard and the plain HTML page. When they disagree, I know the export is stale, not that someone redefined a metric in a component.

## Missing is a real state

The German source has no occupation field. So the German occupation panel says so. It would be easy to guess from job titles and fill the empty box. That guess would be a new model with its own error rate, hiding inside a product that otherwise reports what sources said.

“Not available from this source” is the accurate chart.

## Keep the denominator next to the number

“Top regions” sounds national even when the data is a capped sample across 400 regions. I keep the scope and the caveat next to the chart, not in a separate methods page nobody opens.

Same with missing rows. Dropping them quietly changes the group you counted. Showing them keeps the transform honest.

**What I do now:** the export has to carry enough context that the UI cannot accidentally tell a stronger story than the source.

Source: [The observatory’s app rules and methodology](https://github.com/schatten007/EU-Tech-Labor-Observatory/tree/8ca23914700c199c90e8b39ba2fc4e25475eff95).

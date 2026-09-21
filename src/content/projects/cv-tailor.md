---
title: CV Tailor
subtitle: Better applications. Same actual human.
description: An evidence-led AI toolkit that turns a job description and real career history into a focused application. Every claim has to come from somewhere.
category: Automation
tags: [Python, OpenCode, AI workflows, Playwright]
date: 2026-09-20
order: 1
featured: true
status: Open-source toolkit
repo: https://github.com/schatten007/cv-tailor
source: https://github.com/schatten007/cv-tailor/tree/4f5031617853fea08f66697f30c1b65ab41fb133
visual: tailor
accent: lime
evidence: '06'
evidenceLabel: focused, independently usable skills
takeaway: Give the model a useful job. Give the workflow a clear boundary.
architecture:
  - title: Gather
    detail: Career evidence + role requirements
  - title: Map
    detail: Match requirements to supported facts
  - title: Compose
    detail: Tailored, ATS-readable documents
  - title: Review
    detail: Human review before submission
---

## The problem

Tailoring an application is a surprisingly fragmented workflow: read the role, find the relevant experience, research the company, write the documents, then repeat much of the work in a portal. A language model can help with the writing. It can also make a candidate sound more qualified than their evidence supports.

CV Tailor makes the evidence boundary part of the workflow itself.

## What I built

An open-source skill toolkit for OpenCode, with six focused capabilities: role-specific CV tailoring, master CV maintenance, company research, cover letters, interview preparation, and browser-assisted application forms. Each companion skill is independently usable and activates on an explicit request.

The default tailoring flow maps a role's requirements to the candidate's supplied experience. Missing facts stay visible rather than becoming invented achievements. German and DACH application conventions are first-class concerns, alongside international and technical roles.

Python helpers handle local document generation and staging. The browser-assisted flow uses a browser MCP and leaves the final application submission to the person applying.

## The interesting engineering decision

The workflow separates **what the assistant can write** from **what the automation can do**.

- Document helpers operate on local files and make no network calls.
- Browser control lives in a separate integration.
- Companion skills do not silently activate one another.
- The application workflow ends at review, with a testable submission boundary.

That separation makes it easier to inspect a failure: a document problem, a missing career fact, and a browser-state problem are different things with different recovery paths.

## Evidence you can inspect

The public repository contains the skill definitions, JSON contracts, reference material, Python helpers, and a synthetic browser fixture. The browser suite exercises the review-only workflow and checks that the fixture's submission count remains zero.

The Python test configuration enforces a 90% coverage threshold for the selected helper modules. That is a configured quality gate, not a claim here that every possible portal or document format has been tested.

## Scope and next steps

The toolkit supports an application workflow; it does not guarantee an interview or identical parsing across every ATS. Browser integrations also depend on the actual portal and the user's session.

A useful next evaluation would compare generated documents against a fixed set of role requirements and candidate facts, then check both unsupported claims and omitted relevant evidence. Those are separate failure modes, and both deserve a score.

*Case study based on the public repository snapshot from 20 September 2026. No application-success or time-saved metrics are claimed.*

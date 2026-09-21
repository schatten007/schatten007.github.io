---
title: CV Tailor
subtitle: Better applications. Same actual human.
description: OpenCode skills that tailor a CV to a job ad without inventing experience. Six small skills, each doing one job.
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
evidenceLabel: small skills you can use separately
takeaway: I gave the model a small job and kept the final decision with the person applying.
architecture:
  - title: Gather
    detail: Job ad plus the history you supply
  - title: Map
    detail: Requirements matched to facts you gave
  - title: Compose
    detail: Clean drafts an ATS can read
  - title: Review
    detail: You check everything before it goes out
---

## The problem

A job ad asks for one thing. Your CV has another. The portal wants it all in a third format. Most of the work is copying facts between boxes, and that is exactly where a language model starts inventing details to fill the gaps.

I wanted the help with the writing without the invented details.

## What I built

CV Tailor is a set of OpenCode skills. The main one tailors a CV to a single job ad. Five smaller ones handle the rest: keeping a master CV, researching a company, writing a cover letter, preparing for interviews, and filling in web forms. Each one only runs when you ask for it.

The tailoring step compares the ad against the history you paste in. Anything without support stays marked as missing. I also put in the German application conventions I kept running into, like the tabular CV and the Anschreiben, alongside the international format.

The Python helpers only touch local files and never call the network. Browser work goes through a separate MCP integration. The form filler stops at the review screen. Submitting is always your click, not its.

## The interesting engineering decision

I split **writing words** from **doing things**.

- Writing and formatting stays in local helpers.
- Browser control lives in its own integration.
- Skills do not trigger each other behind your back.
- The application flow ends at review, and a test checks that boundary.

When something goes wrong, I know where to look. A bad document, a missing fact, and a browser hiccup look different and get fixed differently.

## Evidence you can inspect

The repo has the skill files, JSON schemas, reference notes, Python helpers, and a fake local portal for testing. The browser test walks through a full application and asserts the fake portal’s submission counter stays at zero.

The Python config sets a 90% coverage bar for the helper modules. That is a setting in the repo, not proof that every real portal works. I have not tested every ATS or every form layout.

## Scope and next steps

This helps you prepare an application. It does not get you an interview, and it cannot make two parsers agree. Real portals also change, and your browser session matters.

What I would test next: take a fixed set of ads and histories, generate documents, and score two things separately. How many claims lack support. And how much relevant history got left out. Those fail in different ways, so they need different scores.

*Write-up based on the public repo on 20 September 2026. I claim no placement rates or time saved.*

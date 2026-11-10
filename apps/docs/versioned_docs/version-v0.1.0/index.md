---
title: Steward demo guide
sidebar_position: 1
slug: /
description: What the Steward demo is, what is real and what is simulated, and how long it takes.
---

# Steward demo guide

Steward is an open-source system for managing policies and procedures. People write them, submit them for approval, approvers approve or reject them, and published documents are read, versioned and printed.

This guide helps you try the demo. You do not need to know Steward first.

<Screenshot slot="index-1" alt="The staff home page, My work" />

1. The left navigation: Library, Templates, Approvals and the other staff pages.
2. The "My work" page, which lists what is waiting on the signed-in person.

## What the demo is

A fresh Steward install with test data only: the standard categories, templates and approval workflows, and eight test people. There are no documents yet. You create the first ones.

The start state is:

- **Categories:** Finance (with Expenses and Purchasing), People (with Leave and Conduct), Information (with Records and Devices, and Phones under Devices) and Workplace (with Facilities and Travel).
- **Templates:** Standard Policy, Step-by-step Procedure and Short notice.
- **Approval workflows:** Finance sign-off, Standard 2-stage, Legacy sign-off and Policy committee.

## What is real and what is simulated

| Real                                                                    | Simulated                                                           |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Creating, editing and saving documents                                  | The AI features (draft generation, review, rewrite, summaries, Ask) |
| Submitting for approval, approving, rejecting, comments and suggestions | Email: no messages are sent                                         |
| Versions, history, compare, print                                       | Single sign-on and second-factor codes                              |
| Appendices, definitions, references, contacts                           |                                                                     |
| Categories, templates and workflows in the admin app                    |                                                                     |

The AI results are made-up text. They show where AI fits in the flow, not what it would write.

## How long it takes

About 45 to 60 minutes to do everything. About 20 minutes covers the main path: write a policy, submit it, approve it, read it.

## A suggested first path

1. Sign in as Bob (author), with the Dev quick login (it is only in the demo, never in a production Steward). See [Signing in](./signing-in.md).
2. Create a policy and write in it. See [Policies and procedures](./policies-and-procedures.md).
3. Submit it for approval.
4. Sign out and sign in as Charlie (approver). Approve it. See [Approvals](./approvals.md).
5. Sign in as Erin (reader) and read it. See [Reading and history](./reading-and-history.md).

## The pages

- [Signing in](./signing-in.md): the link, the two apps, the eight test people.
- [Policies and procedures](./policies-and-procedures.md): create, write, save, submit, withdraw.
- [Approvals](./approvals.md): approve, reject, comments and suggestions.
- [Appendices](./appendices.md): add, rename, reorder, retire, restore.
- [Definitions, references and contacts](./library.md): attach reusable items to a document.
- [Reading and history](./reading-and-history.md): the reader, versions, compare, print, acknowledgement.
- [Admin](./admin.md): categories, templates, workflows, who can do what.
- [Things to know](./things-to-know.md): limits of the demo and how to give feedback.

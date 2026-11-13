---
title: The demo
sidebar_position: 1
description: What the Steward demo is, what is real and what is simulated, how long it takes, and where the rest of the demo guide is.
---

# The demo

This part of the documentation is only about the demo. It helps you try Steward without knowing it first. The [user guide](../user/index.md) and the [admin guide](../admin/index.md) describe Steward itself.

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
2. Create a policy and write in it. See [Policies and procedures](../user/policies-and-procedures.md).
3. Submit it for approval.
4. Sign out and sign in as Charlie (approver). Approve it. See [Approvals](../user/approvals.md).
5. Sign in as Erin (reader) and read it. See [Reading and history](../user/reading-and-history.md).

## Who to sign in as

| To try                                                                                                                                                        | Sign in as         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| [Writing and the editor](../user/policies-and-procedures.md), [appendices](../user/appendices.md), [definitions, references and contacts](../user/library.md) | Bob (author)       |
| [Approving, rejecting and commenting](../user/approvals.md)                                                                                                   | Charlie (approver) |
| [Reading, history, print and acknowledgement](../user/reading-and-history.md)                                                                                 | Erin (reader)      |
| The [admin guide](../admin/index.md), categories, templates, workflows                                                                                        | Alice (site admin) |

## About the pictures

The pictures in the guides were taken from a sample organisation with documents in every state, in light mode. Your demo may hold fewer documents, so a list on your screen can be shorter than the one in the picture.

## The demo pages

- [Signing in](./signing-in.md): the link, the Dev quick login and the eight test people.
- [Things to know](./things-to-know.md): limits of the demo and how to give feedback.

## The guides

- [User guide](../user/index.md)
- [Admin guide](../admin/index.md)

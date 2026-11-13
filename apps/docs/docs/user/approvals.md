---
title: Approvals
sidebar_position: 4
description: Approve, reject or send comments as an approver, and what the author sees.
---

# Approvals

You are an approver. First an author must [submit a document](./policies-and-procedures.md).

## The Approvals screen

<Screenshot slot="approvals-1" alt="The Approvals screen" />

1. **Approvals** in the left navigation, with a count of what is waiting.
2. The **Pending** list: drafts waiting for your decision.
3. **Coming to you**: later stages where you are an approver. Use **Preview**.
4. The **Review** button on a row.

**Steps:**

1. Choose **Approvals**.
2. Choose **Review** on the document.

## Decide

<Screenshot slot="approvals-2" alt="The review page" />

1. The approval flow bar: Submitted, each stage, Publish.
2. The tabs. **Proposed Publish** shows the document; a revision also has **Changes vs the current published version**.

The decision area is at the bottom of the page, below the document and its comments.

<Screenshot slot="approvals-6" alt="The decision area" />

1. **Your decision**.
2. The **Decision comment** box. A comment is required to approve, reject or send comments.
3. **Send comments**, **Reject** and **Approve**.

**Steps:**

1. Read the document on the **Proposed Publish** tab.
2. Write in **Decision comment**. A comment is required to approve, reject or send comments.
3. Choose **Approve**, **Reject** or **Send comments**.
4. Confirm in the dialog ("Approve this version" or "Reject this version").

| Button            | What happens                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Approve**       | Your approval and comment are recorded. When the stage is satisfied the run moves on. The last approval publishes the document. |
| **Reject**        | Your rejection is recorded and the author is told changes were requested.                                                       |
| **Send comments** | Your comments go to the author without a decision.                                                                              |

## Comments and suggestions

<Screenshot slot="approvals-3" alt="Comment card with Suggest a change" />

1. The words you selected.
2. The comment box.
3. The **Suggest a change** tick box.
4. The **Suggested text** box ("The words to use instead").
5. The **Comment** button that sends it.

**Steps:**

1. Select words in the document.
2. Choose **Comment** and write your note.
3. Tick **Suggest a change** to propose replacement words, and fill in the suggested text.
4. Choose **Comment**.

The author replies. A suggestion goes back and forth in rounds. The author can reply with **Change it** (take your text), **Remove the note**, **Counter** (send different text). You can **Accept** a counter, or end with **Not agreed** and a reason. The proposer can **Withdraw**. Each thread is between the author and one approver. You see only your own threads. The author sees all of them. Appendices take no comments.

Comments on this version go to the author along with your decision.

## Quorum and veto

Each workflow stage has a rule for how many approvers must approve: **One** (the first approval moves it on), **Quorum** (a majority) or **All**. Inside a quorum stage your rejection is recorded against your name, but the version stays in review until the quorum decides.

A **veto approver** is different. Their single rejection ends the version as rejected, even inside a quorum. Veto is off by default. Turn on **Allow veto approvers** in the workflow. See [Admin](../admin/index.md).

## What the author sees

<Screenshot slot="approvals-5" alt="A draft that has changes requested" />

1. The status badge, here **Changes requested**.
2. The note to address the feedback and submit again.
3. **History & approvals** in the **Actions** menu.
4. **Submit for approval**, for the next round.

The author sees the document's status (In review, Rejected, or Changes requested), your comments, and the history under **History & approvals**. A rejected or commented draft shows "Changes requested" with a note to address the feedback and resubmit.

## Changes since you last reviewed

If the author edits after you looked, a tab **Changes since you last reviewed** appears.

<Screenshot slot="approvals-4" alt="Changes since you last reviewed" />

1. The **Changes since you last reviewed** tab.
2. The changes: added text is underlined and green, removed text is struck through, with a count of each.

**Steps:**

1. Open the tab.
2. Read the changes.
3. Choose **Mark as reviewed**.

:::note
To see this tab, Bob has to edit after submitting. The editor stays open while a document is in review, so this works. (The submit dialog says otherwise; see [Policies and procedures](./policies-and-procedures.md#submit-for-approval).)
:::

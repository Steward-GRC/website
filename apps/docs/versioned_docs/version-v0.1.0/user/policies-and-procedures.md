---
title: Policies and procedures
sidebar_position: 3
description: Create a policy or procedure, write in the editor, save, run the simulated AI review, submit for approval and withdraw.
---

# Policies and procedures

A policy is a rule people must follow and can require acknowledgement. A procedure is a set of steps and never needs acknowledgement.

## Create one

<Screenshot slot="policies-and-procedures-1" alt="The Library page with the New policy button" />

1. The **Library** item in the left navigation.
2. The **New policy** button. Procedures have their own **Library**, with **New procedure**.
3. The list of documents. A category with nothing in it says "No policies match these filters".

**Steps:**

1. Choose **Library** in the left navigation.
2. Choose **New policy** (or **New procedure**).
3. Fill in the draft details: **Title**, **Category**, **Subcategory** and **Template**. Also **Sensitivity** (**Standard** or **Sensitive**).
4. Choose **Create policy** (or **Create procedure**).

<Screenshot slot="policies-and-procedures-2" alt="The new policy form" />

1. The **Title** box.
2. The **Category** box. Some categories only hold other categories, or only policies, or only procedures; the form tells you if your choice cannot hold the document.
3. The **Subcategory** box.
4. The **Template** box. **No template (freeform)** gives you a blank document.
5. The text "Set by the category: authors use this template." when the template is locked.

A title and a category are required.

### Locked templates

An admin can lock a category's template. Then the **Template** box shows the locked one and you cannot choose another. To lock one, an admin turns on **Authors must use this template** for a category. See [Admin](../admin/index.md).

### A path that works

Choose a category that has an approval workflow and a person who can approve in it. In the sample data that is Finance or one of its subcategories, with the **Standard Policy** template. Finance, Expenses, Purchasing, People, Leave, Conduct, Records, Information and Devices all use the Finance sign-off workflow (Charlie approves); Facilities uses Standard 2-stage. Phones, Workplace and Travel have no workflow, so **Submit for approval** says it cannot go for review. Expenses holds policies only, and Workplace only holds other categories.

## Write in the editor

<Screenshot slot="policies-and-procedures-3" alt="The draft editor" />

1. The document area. Start writing, or press `/` for blocks.
2. The **Actions** menu, which holds the AI items, **Withdraw from review** and **Discard draft**.
3. The **Submit for approval** button.
4. The save status: **Saved**, **Saving…** or **Unsaved changes**.
5. The **Required sections** panel.
6. The **Appendices** panel.
7. The **Next version** panel.

The editor has a toolbar for selected text and a `/` menu for blocks such as a callout, a table, an image or a file. Both are described on [The editor](./editor.md). Select text and choose **Comment** to leave a note; see [Approvals](./approvals.md).

A new draft from a template opens with each template section as a heading, in order. If you delete one, it is added back when the draft opens again.

### Save status

Your work autosaves. The status reads **Saving…**, then **Saved**, or **Unsaved changes**. If autosave fails you are told to use **Save draft**. You can always choose **Save draft**.

### Required sections

The **Required sections** panel shows, for example, "2 of 3", and marks empty required sections as "empty". **Reset required sections** puts back headings you removed. You cannot send the draft for approval while a required section is empty, and you cannot send a document with no text at all.

## The AI items (simulated)

The AI items are in the **Actions** menu: **Generate a draft…** (or **Improve draft…** once there is text), **Rewrite a section…** and **Review draft**. While a document is in review, the menu says AI is not available.

<Screenshot slot="policies-and-procedures-4" alt="The AI review sheet" />

1. The **AI review** sheet. Findings are marked **Blocker**, **Warning** or **Note**, and each says it is simulated.
2. The **Jump to** links that take you to the section.
3. **Re-run review**.

Choose **Actions**, then **Review draft**. The sheet is a gap check before you submit. Findings are advice and change nothing. If nothing is found it says "No gaps found". In the demo the results are made up; see [Things to know](../demo/things-to-know.md). **Generate a draft…** fills only sections that are still empty. **Rewrite a section…** shows a suggestion with **Apply to draft** and **Discard**.

## Submit for approval

1. Make sure no required section is empty.
2. Choose **Submit for approval**.
3. Read the dialog "Submit for approval?". It names the document and the workflow it goes to. For a revision of a published document it also shows the next version and lets you pick **Major**, **Minor** or **Fix**.
4. Choose **Submit for approval** again, or **Keep editing** to go back.

<Screenshot slot="policies-and-procedures-5" alt="The submit dialog" />

1. The document and the workflow it goes to.
2. The version block with **Major**, **Minor** and **Fix**. It appears for a revision of a published document.
3. **Keep editing**.
4. **Submit for approval**.

After you submit, approvers see it in **Approvals**. It publishes when the last stage approves. The dialog says you cannot edit while it is in review, but the page message after submitting says you can keep editing. The page message is right: you can keep editing, and each approver sees what changed since they looked. (The dialog wording is a known mistake.)

If submitting is refused, no approval workflow applies to its category, or a stage has no approver. Ask an admin.

## Withdraw

<Screenshot slot="policies-and-procedures-6" alt="The Withdraw from review dialog" />

1. The "Withdraw from review?" dialog.
2. **Withdraw**.
3. **Keep in review**.

**Steps:**

1. Open **Actions**.
2. Choose **Withdraw from review…**.
3. Choose **Withdraw**. The approvers stop reviewing it and it goes back to Draft. Your changes stay.

**Discard draft…** in the same menu deletes the draft. A published version stays live.

## Find your drafts

<Screenshot slot="policies-and-procedures-7" alt="My drafts" />

1. **My drafts**, the page you are on.
2. The **New** button.
3. The list of drafts, with the document number, title and when it was updated.

**My drafts** lists everything with a saved draft. There is also **Import policies from a CSV** for creating many drafts at once.

---
title: Signing in
sidebar_position: 2
description: How to open the demo, the staff and admin apps, and the eight test people.
---

# Signing in

## Opening the demo

1. Open the private link you were sent. It opens the demo once and remembers you for 30 days. [to check in the demo] The 30 days is the demo host's setting, not Steward's.
2. After that, go to the demo address as you normally would. You do not need the link again on the same browser.

If you open a private window or a second browser (you will need this for two people editing together), you may need the link again.

## Two apps

| App       | Address                               | Who it is for                                                   |
| --------- | ------------------------------------- | --------------------------------------------------------------- |
| Staff app | the demo address root                 | Everyone: library, drafting, approvals, reading                 |
| Admin app | the same address followed by `/admin` | Admins only: categories, templates, workflows, users, libraries |

The apps are linked. The staff app has an **Admin** link in its header for people who may use it. Someone without admin rights who opens `/admin` sees "Admins only".

## Signing in as a test person

<Screenshot slot="signing-in-1" alt="The staff sign-in page with the Dev quick login box" />

1. The **Dev quick login** box under the sign-in form, marked DEV.
2. The dropdown with the placeholder **Sign in as a test user**.
3. The username and password form. You do not need it.

4. Open the sign-in page.
5. Under the form, open the **Dev quick login** dropdown.
6. Choose a person. You are signed in at once.
7. To switch person, use **Sign out** in the account menu, then pick someone else.

Every page then shows a thin bar, "Dev login, test users only".

:::note
The Dev quick login dropdown does not ask for a second sign-in code, for anyone. The username and password form does for some people: Alice and Charlie get a code step, and Dave is asked to enrol an authenticator app. Any six digits except `000000` are accepted.
:::

The admin sign-in page has the same dropdown.

<Screenshot slot="signing-in-2" alt="The admin sign-in page" />

1. The Admin tag on the sign-in page.
2. The same **Dev quick login** dropdown.

## The eight test people

| Name             | Username | Role                                 | What they can do                                                                              |
| ---------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| Alice Admin      | alice    | Site admin (the root admin)          | Everything, including the admin app. Reads sensitive documents only after a break-glass step. |
| Bob Author       | bob      | Author                               | Writes drafts, submits them for approval, edits appendices.                                   |
| Charlie Approver | charlie  | Approver                             | Approves or rejects. Sole approver in the Finance sign-off workflow in the sample data.       |
| Dave Officer     | dave     | Privacy officer and compliance admin | Compliance screens and the admin app. Not needed for the main path.                           |
| Erin Reader      | erin     | Reader                               | Reads published, non-sensitive documents and acknowledges policies.                           |
| Frank Disabled   | frank    | None                                 | Disabled on purpose. Signing in as Frank fails.                                               |
| Grace Templates  | grace    | Template admin                       | Works with templates. [to check in the demo] Which Templates page she can open.               |
| Heidi Manager    | heidi    | Group manager                        | Manages a group (Facilities team in the sample data). Has no author or approver role.         |

Everyone is also a reader. Which categories a person may write in or approve for is set per category in **Access** in the admin app. In the fresh demo, Bob may author, and Charlie may approve, in Finance, People, Information and Workplace and everything under them.

:::tip
For the main path use Bob (author), Charlie (approver) and Erin (reader). Use Alice for anything in the admin app.
:::

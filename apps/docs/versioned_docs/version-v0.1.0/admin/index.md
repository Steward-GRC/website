---
title: Admin
sidebar_position: 8
description: Categories, templates, workflows and who can do what in the admin app.
---

# Admin

Open the admin app (the Steward address followed by `/admin`). Admin pages are for site, template and compliance admins. Others see "Admins only".

The admin menu groups: **Overview**, **Categories**, **Structure**, **Policies**, **Assurance**, **People**, **System**. Some pages may say "Coming soon". That is expected.

## Categories

<Screenshot slot="admin-1" alt="A category in the admin app" />

1. The category tree on the left, with **Filter categories**.
2. **Name** and **Slug**.
3. **Default template**, and the **Authors must use this template** tick box that locks it.
4. **Default workflow**.
5. **Acknowledgement audience**.
6. **Documents this category holds**.
7. **Save**.

**Steps:**

1. Choose **Directory** under Categories.
2. Click a category to open it.
3. Change the defaults and choose **Save**.

**Slug** sets the document number prefix, for example POL-FINANCE-000001. A category that has no default template cannot be locked.

To lock a template:

1. Open a category that has a **Default template**.
2. Tick **Authors must use this template**.
3. Choose **Save**.
4. As an author, start a new policy in that category. The **Template** box shows the locked template.

<Screenshot slot="admin-4" alt="The Access page and the Simulator" />

1. **Filter categories**: the list of categories.
2. **Read** for a person or group: **Allow**, **Deny** or blank.
3. **Approve**: the same choices.
4. **+ Add rule**.
5. The **Simulator**: pick a person and see what they can do before you save.

**Access** (under Categories) sets, per category and top to bottom, who can **Read**, **Acknowledge**, **Approve** and **Author**, as **Allow**, **Deny** or **Blank**. Blank means denied unless an ancestor allows it. The **Simulator** shows what a chosen person can do before you save.

## Templates

<Screenshot slot="admin-2" alt="A template" />

1. The three steps: **Sections**, **Review** and **Publish**.
2. A section's **Required** switch.
3. **Next: Review**.
4. **Version history**, with the draft.

A template is a list of sections. Each is **Required** or **Optional**.

1. Choose **Templates**, then a template.
2. If the template has no draft yet, choose **Create version**. An open draft shows its sections and a **Version history** below.
3. Add, rename, move or indent sections. Use the switch on a section to make it required.
4. Choose **Next: Review** to see the changes, then publish the version.

A published version is used for new documents. Existing documents keep the structure they started with. **Retire** hides a template from new documents. Which person can open **Templates** in the admin app is set by their permissions; see [Who can do what](#who-can-do-what).

## Workflows

<Screenshot slot="admin-3" alt="A workflow" />

1. The stage name.
2. The quorum choice: **One**, **Quorum** or **All**.
3. **+ Add approver**.
4. **Due** in working days.
5. **Allow veto approvers**, and who may veto.
6. **Save workflow**.

- A workflow is a chain of stages. Each runs after the previous one approves.
- Every stage needs at least one approver, or the workflow cannot be used.
- A final stage can be marked **Always last**.
- **Allow veto approvers**: a veto approver's single rejection ends the version as rejected even inside a quorum.

1. Choose **Workflows**, then **+ New workflow** (or open one and **Duplicate workflow**).
2. Name it, add stages and approvers, and choose the quorum.
3. Choose **Save workflow**.
4. In **Categories**, set it as the **Default workflow** of a category.

## Who can do what

What a person can reach in the admin app depends on their role: a site admin reaches all of it, and template, compliance and group-manager roles reach the parts that match their work. Others see "Admins only". The **Access** simulator, above, shows what a chosen person can do in a category before you save.

<Screenshot slot="admin-5" alt="Users and roles" />

1. **People** in the admin menu.
2. The list, with **Roles** and **Groups**.
3. A person to open.
4. **Search users**.

**Users & roles** (under People) lists everyone with **Roles** and **Groups**. Open a person to see Profile, Security, Roles & access and Advanced. **Act as** lets an admin see what another person sees for up to 30 minutes.

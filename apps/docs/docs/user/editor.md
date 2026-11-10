---
title: The editor
sidebar_position: 4
description: What the toolbar and the / menu give you in the editor, what each one does and looks like, how to write with it, and how the editor works in review.
---

# The editor

The editor is where you write a policy, a procedure, an appendix and a template section. This page covers its two controls in detail: the **toolbar** that appears over selected text, and the **/ menu** that adds blocks. It ends with how the editor works during review.

Open a draft to try everything below.

## Where you meet the editor

| Where                                       | What you can do                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| A draft of a policy or procedure            | Everything on this page. Several people can edit together.                                  |
| An appendix                                 | The same editor, on the appendix page.                                                      |
| A template section (admin app)              | The same editor, for the text a section starts with. Nobody else edits at the same time.    |
| The approver's copy of a document in review | Read only. Selecting text offers **Comment** and nothing else. See [In review](#in-review). |
| The reader                                  | A page, not an editor. No toolbar, no menu.                                                 |

## Writing

An empty line says "Start writing, or press / for blocks". Type to write. Your work saves by itself; see [Policies and procedures](./policies-and-procedures.md#save-status).

A draft from a template opens with each template section as a heading. Write under the heading. If you delete a heading, it is put back when the draft opens again.

Three ways to format:

- Select text and use the **toolbar** that appears over it.
- Use a keyboard shortcut.
- On an empty line, press the **+** button or type `/` to add a **block**.

## The toolbar

<Screenshot slot="editor-1" alt="The toolbar over selected text" />

1. **Bold**, **Italic**, **Underline**, **Subscript** and **Superscript**.
2. **Highlight**.
3. **Clear formatting**.
4. The heading buttons, **Heading 1** to **Heading 5**.
5. **Bulleted list** and **Numbered list**.
6. **Align left**, **Align center** and **Align right**.
7. **Link**.
8. **Rework selected text with AI**, when AI is on.

Select some words and the toolbar appears over them. A button looks pressed when the selection already has that format; press it again to take the format off. On Windows and Linux use **Ctrl** where a shortcut says **Cmd**.

| Button                                  | What it does                                                                                                                                                                                                                                   | Shortcut          |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **Bold**                                | Makes the selected text bold.                                                                                                                                                                                                                  | Cmd+B             |
| **Italic**                              | Makes it italic.                                                                                                                                                                                                                               | Cmd+I             |
| **Underline**                           | Underlines it.                                                                                                                                                                                                                                 | Cmd+U             |
| **Subscript**                           | Lowers it below the line, as in H2O. It excludes superscript.                                                                                                                                                                                  | Cmd+,             |
| **Superscript**                         | Raises it above the line, as in m2. It excludes subscript.                                                                                                                                                                                     | Cmd+.             |
| **Highlight**                           | Marks the text with a soft yellow. There is one colour and no picker: press it to highlight, press it again to remove it.                                                                                                                      |                   |
| **Clear formatting**                    | Takes every format off the selected text.                                                                                                                                                                                                      | Cmd+\\            |
| **Heading 1** to **Heading 5**          | Turns the line into a heading of that level. Headings stop at level 5; a deeper one that is pasted becomes level 5. The headings are what the reader's **On this page** outline lists.                                                         |                   |
| **Bulleted list** and **Numbered list** | Turns the lines into a list. Press again to go back to paragraphs. Tab and Shift+Tab indent and outdent inside a list.                                                                                                                         |                   |
| **Align left**, **center**, **right**   | Aligns the paragraph, heading or list item you are in.                                                                                                                                                                                         | Cmd+Shift+L, E, R |
| **Link**                                | Adds a web link to the selected text.                                                                                                                                                                                                          |                   |
| **Rework selected text with AI**        | Opens a small card with **Rewrite** and **Clarify** for the selected text. It appears only when AI is on, you can edit, and the document is not in review. In the demo the result is made up; see [Things to know](../demo/things-to-know.md). |                   |

The toolbar is deliberately short. It has no font, size or colour choices, no strikethrough, no inline code and no quote, so documents look the same whoever writes them.

**Keyboard.** **Alt+F10** moves focus from the text to the toolbar. The arrow keys move between buttons, Enter or Space presses one, and Escape goes back to the text with your selection kept.

## The / menu

<Screenshot slot="editor-2" alt="The / menu on an empty line" />

1. The **+** button that appears on an empty line.
2. The menu of blocks.
3. A block's name and the word you type to find it, for example `/callout`.

There are three ways to add a block:

- Press the **+** button on an empty line and pick a block.
- Type `/` on an empty line, then a few letters of the name. Up and Down choose, Enter adds, Escape closes the menu.
- Drag a file onto the editor. It makes the matching block for the file (an image, a video or a file) and uploads it.

Select a block by clicking it or moving onto it with the arrow keys. **Enter** adds a paragraph after it. **Ctrl+Enter** (**Cmd+Enter** on a Mac) opens or closes its settings. The editor keeps an empty line above the first block and below the last, so there is always somewhere to put the cursor.

| Block            | Type            | What it is for                                     |
| ---------------- | --------------- | -------------------------------------------------- |
| **Callout**      | `/callout`      | A coloured box that stands out.                    |
| **Toggle**       | `/toggle`       | Text that opens and closes.                        |
| **Toggle group** | `/toggle-group` | A stack of toggles, such as questions and answers. |
| **Button**       | `/button`       | A link people are asked to follow.                 |
| **Divider**      | `/hr`, or `---` | A line between two parts.                          |
| **Table**        | `/table`        | Rows and columns of text.                          |
| **Image**        | `/image`        | One picture.                                       |
| **File**         | `/file`         | A document people download.                        |
| **Video**        | `/video`        | A video you upload.                                |

### Callout, toggle, button and divider

<Screenshot slot="editor-3" alt="A callout, a toggle, a button and a divider" />

1. A **Callout**.
2. A **Toggle**, open.
3. A **Button**.
4. A **Divider**.

- **Callout.** Text inside a box. Choose one of five colours: **Info**, **Success**, **Warning**, **Danger** or **Neutral**. The colour comes from a short list, never a colour wheel, and it follows light and dark mode. Do not rely on the colour alone: say in words what the note means.
- **Toggle.** A short header that is always visible and a body that opens and closes when you press the arrow beside the header. Keep the header a clear question or label.
- **Toggle group.** Toggles stacked in one outline with a line between them. A new group has two. **Add a toggle** adds another and the cross on an item removes it.
- **Button.** A **label** and a **link**, both required. Only `http`, `https` and `mailto` links are kept; other links are refused. Choose left, centre or right. Make the label say where the link goes, such as "Read the report".
- **Divider.** A line. It has nothing to set; select it and press Backspace or Delete to remove it.

### Table

<Screenshot slot="editor-4" alt="A table with its toolbar" />

1. The table, drawn with a dashed grid while you write and a solid one for the reader.
2. The table toolbar, above the table while the cursor is in it.
3. The header row.
4. A selected range of cells.

A table starts 3 by 3 with a header row. While the cursor is in it, the table toolbar lets you add, move and delete rows and columns, turn the header row and column on and off, merge and split cells, shade cells from the short colour list, align text across and down, set widths and heights, draw borders, band rows and columns, and add a caption. Drag across cells to select a range. Paste cells copied from a spreadsheet and they fill the table, adding the rows and columns they need.

**Tab** and **Shift+Tab** move between cells. **Alt+F10** moves focus to the table toolbar, and Escape returns to the cell.

### Image, file and video

<Screenshot slot="editor-5" alt="An image block and a file block" />

1. An **Image**, with its caption and alt text.
2. The image's settings.
3. A **File**, with its title, description, name and size.

- **Image.** Add one with `/image`, by dragging a picture in, or by typing `/image` followed by the address of a picture that is already online. A picture you add opens the **image editor** first, to crop (free, original, 1:1, 4:3 or 16:9) and rotate in 90 degree steps; nothing is sent until you confirm. Each image has an **alt text**, the description for people who cannot see it (write one for every picture that carries meaning), and a **caption**. Its settings add a link on the picture, a width of regular, wide or full, and a figure label such as "Figure 2". PNG, JPEG, GIF and WebP are accepted.
- **File.** A download. It shows a **title**, a **description**, and the file's name and size, with a picture for the file's type. Accepted types are PDF, Word, Excel, PowerPoint, OpenDocument, CSV, RTF, text, Markdown, image and video files, up to 10 MB. HTML, SVG, scripts, programs, archives and Office files with macros are refused.
- **Video.** A video you upload (MP4, M4V, MOV or WebM), played in the browser's own player. It needs a **transcript** in text or a **WebVTT (`.vtt`) captions file**; until you add one the block shows a reminder.

## Find, replace and the shortcut list

<Screenshot slot="editor-6" alt="The find and replace bar" />

1. The find box, with the number of matches.
2. **Previous** and **Next**.
3. **Match case**.
4. The replace box, with **Replace** and **Replace all**.

Press **Cmd+F** (**Ctrl+F**) in the editor to open the bar over it. Type to find; Enter and Shift+Enter step through the matches and the count reads like "2 of 5". The search is plain text, not a pattern, and a match can run across bold or italic text. **Replace all** is one step in the undo history. Escape closes the bar and returns to the text.

<Screenshot slot="editor-7" alt="The list of keyboard shortcuts" />

1. The groups of shortcuts.
2. The keys for your computer.

Press **Cmd+/** (**Ctrl+/**) for a list of every shortcut that is on in this editor. Escape closes it.

## Pasting

Text pasted from Word, Google Docs or a web page is cleaned first: fonts, sizes, colours and spacing go, and Word's lists become real bulleted and numbered lists. Headings, safe links, tables and pictures stay. Plain text written in Markdown, such as a line starting with `#` or `-`, becomes a heading or a list.

## In review

The same editor is used on both sides of a review. Approving, rejecting and sending comments are covered in [Approvals](./approvals.md); this is how the editor behaves.

**As the author (Bob)**

1. Fill in the required sections and choose **Submit for approval**. See [Policies and procedures](./policies-and-procedures.md#submit-for-approval).
2. The document goes into review. You can keep editing: each approver sees what changed since they last looked. **Rework selected text with AI** is not offered while a document is in review.
3. When an approver comments, the words they chose are highlighted in your text. Open the comment to read it, reply, or resolve it. A suggestion goes back and forth in rounds (see [Approvals](./approvals.md#comments-and-suggestions)).
4. To write to an approver yourself, select text and choose **Comment**. If there is more than one approver, it asks which one.

**As the approver (Charlie)**

<Screenshot slot="editor-8" alt="The approver's toolbar, with only Comment" />

1. The document, read only. You cannot change the text.
2. Text you have selected.
3. The toolbar, with **Comment** and nothing else.

4. Open the document from **Approvals** with **Review**.
5. Select the words you want to comment on. The toolbar shows **Comment**.
6. Choose **Comment**, write your note, and tick **Suggest a change** if you want to propose replacement words.
7. Choose **Comment** again to send it. The author sees it on the same words.
8. Decide with **Approve**, **Reject** or **Send comments**.

**Seeing what changed.** On a revision of a published document, the **View** switch above the editor changes between **Unified** and **Diff**, which shows your edits against the published text as they are made. An approver who looked earlier sees the **Changes since you last reviewed** tab.

// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Numbered callouts drawn over a page just before the screenshot: an outline
// round the element and a numbered disc at its corner. The numbers match the
// list under the picture in the guide.
const COLOUR = "#d9480f";

export const drawCallouts = async (page, boxes) => {
  await page.evaluate(
    ({ boxes, colour }) => {
      const root = document.createElement("div");
      root.id = "__callouts";
      root.style.cssText =
        "position:fixed;inset:0;z-index:2147483647;pointer-events:none";
      const size = 24;
      for (const b of boxes) {
        if (b.outline) {
          const frame = document.createElement("div");
          frame.style.cssText = `position:fixed;left:${b.x - 3}px;top:${b.y - 3}px;width:${b.width + 6}px;height:${b.height + 6}px;border:2px solid ${colour};border-radius:6px;box-sizing:border-box`;
          root.append(frame);
        }
        let left = b.x - size / 2 - 3;
        let top = b.y - size / 2 - 3;
        if (b.side === "tr") left = b.x + b.width - size / 2 + 3;
        if (b.side === "l") {
          left = b.x - size - 6;
          top = b.y + b.height / 2 - size / 2;
        }
        if (b.side === "r") {
          left = b.x + b.width + 6;
          top = b.y + b.height / 2 - size / 2;
        }
        left = Math.max(2, Math.min(left, innerWidth - size - 2));
        top = Math.max(2, Math.min(top, innerHeight - size - 2));
        const disc = document.createElement("div");
        disc.textContent = String(b.n);
        disc.style.cssText = `position:fixed;left:${left}px;top:${top}px;width:${size}px;height:${size}px;border-radius:50%;background:${colour};color:#fff;font:700 14px/${size}px system-ui,sans-serif;text-align:center;box-shadow:0 0 0 2px #fff`;
        root.append(disc);
      }
      document.body.append(root);
    },
    { boxes, colour: COLOUR },
  );
};

export const clearCallouts = (page) =>
  page.evaluate(() => document.querySelector("#__callouts")?.remove());

// Resolves each item's locator to a box. An item that cannot be found fails
// the slot, so a changed screen is noticed instead of shipping a wrong number.
export const resolveBoxes = async (page, items) => {
  const boxes = [];
  for (const item of items) {
    const locator =
      typeof item.loc === "string" ? page.locator(item.loc) : item.loc;
    const target = locator.filter({ visible: true }).first();
    await target.waitFor({ state: "visible", timeout: 5000 }).catch(() => {
      throw new Error(`callout ${item.n} not found`);
    });
    const box = await target.boundingBox();
    boxes.push({
      n: item.n,
      ...box,
      outline: item.outline !== false,
      side: item.side ?? "tl",
    });
  }
  return boxes;
};

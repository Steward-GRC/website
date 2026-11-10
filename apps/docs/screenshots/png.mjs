// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Strips every ancillary chunk (text, time, colour profile, EXIF, C2PA) from a
// PNG, keeping only what draws the picture.
const SIGNATURE = Buffer.from("89504e470d0a1a0a", "hex");
const KEEP = new Set(["IDAT", "IEND", "IHDR", "PLTE", "tRNS"]);

export const chunkTypes = (png) => {
  if (!png.subarray(0, 8).equals(SIGNATURE)) throw new Error("not a PNG");
  const types = [];
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    types.push(png.toString("latin1", offset + 4, offset + 8));
    offset += 12 + length;
  }
  return types;
};

export const stripPng = (png) => {
  if (!png.subarray(0, 8).equals(SIGNATURE)) throw new Error("not a PNG");
  const parts = [SIGNATURE];
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("latin1", offset + 4, offset + 8);
    if (KEEP.has(type)) parts.push(png.subarray(offset, offset + 12 + length));
    offset += 12 + length;
  }
  return Buffer.concat(parts);
};

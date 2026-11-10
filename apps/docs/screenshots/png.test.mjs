// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
import assert from "node:assert/strict";
import { test } from "node:test";
import { deflateSync } from "node:zlib";

import { chunkTypes, stripPng } from "./png.mjs";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 3_988_292_384 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buffer) => {
  let c = 4_294_967_295;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 4_294_967_295) >>> 0;
};
const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc(body), 8 + data.length);
  return out;
};
const header = Buffer.alloc(13);
header.writeUInt32BE(1, 0);
header.writeUInt32BE(1, 4);
header[8] = 8;
header[9] = 2;
const png = (extra) =>
  Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    chunk("IHDR", header),
    ...extra,
    chunk("IDAT", deflateSync(Buffer.from([0, 255, 255, 255]))),
    chunk("IEND", Buffer.alloc(0)),
  ]);

test("text, time, EXIF and C2PA chunks are removed and the picture stays", () => {
  const dirty = png([
    chunk("tEXt", Buffer.from("Software\0x")),
    chunk("tIME", Buffer.alloc(7)),
    chunk("eXIf", Buffer.alloc(4)),
    chunk("caBX", Buffer.alloc(4)),
  ]);
  assert.deepEqual(chunkTypes(dirty), [
    "IHDR",
    "tEXt",
    "tIME",
    "eXIf",
    "caBX",
    "IDAT",
    "IEND",
  ]);
  assert.deepEqual(chunkTypes(stripPng(dirty)), ["IHDR", "IDAT", "IEND"]);
});

test("a file that is not a PNG is refused", () => {
  assert.throws(() => stripPng(Buffer.from("nope nope nope")), /not a PNG/);
});

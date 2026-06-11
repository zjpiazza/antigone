import sharp from "sharp";
import { readFile } from "node:fs/promises";
import type { ProcessedImage } from "./types.js";

const MAX_DIMENSION = 2048;

export async function loadImage(source: string): Promise<ProcessedImage> {
  const buffer = await fetchImageBuffer(source);
  return processBuffer(buffer);
}

async function fetchImageBuffer(source: string): Promise<Buffer> {
  if (source.startsWith("data:")) {
    const match = source.match(/^data:[^;]+;base64,(.+)$/);
    if (!match?.[1]) throw new Error("Invalid data URI");
    return Buffer.from(match[1], "base64");
  }

  if (source.startsWith("http://") || source.startsWith("https://")) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  return readFile(source);
}

async function processBuffer(buffer: Buffer): Promise<ProcessedImage> {
  let image = sharp(buffer);
  let metadata = await image.metadata();

  const needsResize =
    (metadata.width && metadata.width > MAX_DIMENSION) ||
    (metadata.height && metadata.height > MAX_DIMENSION);

  if (needsResize) {
    buffer = await image
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();
    image = sharp(buffer);
    metadata = await image.metadata();
  }

  const format = metadata.format ?? "unknown";
  const mimeType = `image/${format === "jpg" ? "jpeg" : format}`;

  return {
    data: buffer,
    base64: buffer.toString("base64"),
    mimeType,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    format,
  };
}

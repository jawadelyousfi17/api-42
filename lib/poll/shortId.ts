import { randomBytes } from "crypto";

const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHABET_LENGTH = ALPHABET.length;

export function generateShortId(length = 8): string {
  if (!Number.isInteger(length) || length < 4 || length > 32) {
    throw new Error(
      "generateShortId: length must be an integer between 4 and 32",
    );
  }

  // Rejection-sampling to avoid modulo bias.
  const out: string[] = [];
  while (out.length < length) {
    const bytes = randomBytes(length);
    for (const byte of bytes) {
      // 62 * 4 = 248, so values 0..247 can be mapped uniformly to 0..61
      if (byte < 248) {
        out.push(ALPHABET[byte % ALPHABET_LENGTH]);
        if (out.length === length) return out.join("");
      }
    }
  }

  return out.join("");
}

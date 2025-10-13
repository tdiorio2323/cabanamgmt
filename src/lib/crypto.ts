import { randomBytes } from "crypto";

export function generateCode(length = 12) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(length);
  let output = "";

  for (let i = 0; i < length; i += 1) {
    const byte = bytes[i];
    if (byte === undefined) continue;
    const index = byte % alphabet.length;
    output += alphabet[index];
  }

  return output;
}

import { describe, it, expect } from "vitest";
import { validatePasswordStrength } from "./validatePasswordStrength";

describe("validatePasswordStrength", () => {
  it("returns undefined for a fully valid password", () => {
    expect(validatePasswordStrength("Abcdef1!")).toBeUndefined();
    expect(validatePasswordStrength("MyP@ssw0rd")).toBeUndefined();
    expect(validatePasswordStrength("C0mpl3x!Pass")).toBeUndefined();
  });

  // --- Length ---
  it("rejects passwords shorter than 8 characters", () => {
    expect(validatePasswordStrength("Ab1!")).toBe("Password must be at least 8 characters");
    expect(validatePasswordStrength("Ab1!xyz")).toBe("Password must be at least 8 characters");
  });

  it("accepts passwords with exactly 8 characters", () => {
    expect(validatePasswordStrength("Abcde1!x")).toBeUndefined();
  });

  it("rejects passwords without uppercase letter", () => {
    expect(validatePasswordStrength("abcdef1!")).toBe("Password must contain an uppercase letter");
  });

  it("rejects passwords without lowercase letter", () => {
    expect(validatePasswordStrength("ABCDEF1!")).toBe("Password must contain a lowercase letter");
  });

  it("rejects passwords without a number", () => {
    expect(validatePasswordStrength("Abcdefg!")).toBe("Password must contain a number");
  });

  it("rejects passwords without a special character", () => {
    expect(validatePasswordStrength("Abcdefg1")).toBe("Password must contain a special character");
  });

  it("accepts various special characters", () => {
    const specials = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "-",
      "+",
      "=",
      "[",
      "]",
      "{",
      "}",
      ";",
      ":",
      "'",
      '"',
      "\\",
      "|",
      ",",
      ".",
      "<",
      ">",
      "/",
      "?",
      "_",
    ];
    for (const s of specials) {
      expect(
        validatePasswordStrength(`Abcdef1${s}`),
        `should accept special char: ${s}`,
      ).toBeUndefined();
    }
  });

  it("returns length error first even when other rules fail", () => {
    expect(validatePasswordStrength("abc")).toBe("Password must be at least 8 characters");
  });

  it("checks rules in order: length → uppercase → lowercase → number → special", () => {
    expect(validatePasswordStrength("abcdefgh")).toBe("Password must contain an uppercase letter");
    expect(validatePasswordStrength("ABCDEFGH")).toBe("Password must contain a lowercase letter");
    expect(validatePasswordStrength("Abcdefgh")).toBe("Password must contain a number");
    expect(validatePasswordStrength("Abcdefg1")).toBe("Password must contain a special character");
  });
});

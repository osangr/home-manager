import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatters";

describe("formatCurrency", () => {
  it("should format a positive amount correctly", () => {
    const result = formatCurrency(1000);
    const normalized = result.replace(/\s+/g, " ");
    expect(normalized).toBe("1000 €");
  });

  it("should round amounts with decimals", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("1235");
    expect(result).toContain("€");
  });

  it("should round down when < .5", () => {
    const result = formatCurrency(1234.49);
    expect(result).toContain("1234");
    expect(result).toContain("€");
  });

  it("should handle zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
    expect(result).toContain("€");
  });

  it("should handle negative amounts", () => {
    const result = formatCurrency(-500);
    expect(result).toContain("-500");
    expect(result).toContain("€");
  });

  it("should handle null and undefined", () => {
    expect(formatCurrency(null)).toBe("0€");
    expect(formatCurrency(undefined)).toBe("0€");
  });
});

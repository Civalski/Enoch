import { describe, expect, it } from "vitest";
import { calendarMonthKey, formatMonthLabelPt, lastNCalendarMonths } from "./donations-months";

describe("lastNCalendarMonths", () => {
  it("returns six months oldest-first ending at ref", () => {
    const ref = new Date(2026, 3, 15);
    const got = lastNCalendarMonths(6, ref);
    expect(got).toEqual([
      { year: 2025, month: 10 },
      { year: 2025, month: 11 },
      { year: 2026, month: 0 },
      { year: 2026, month: 1 },
      { year: 2026, month: 2 },
      { year: 2026, month: 3 },
    ]);
  });
});

describe("calendarMonthKey", () => {
  it("zero-pads month", () => {
    expect(calendarMonthKey(2026, 0)).toBe("2026-01");
    expect(calendarMonthKey(2026, 11)).toBe("2026-12");
  });
});

describe("formatMonthLabelPt", () => {
  it("uses Portuguese month name and year", () => {
    expect(formatMonthLabelPt(2026, 3)).toBe("Abril/2026");
  });
});

const {
  SUPPORTED_OPERATIONS,
  calculate,
  normalizeOperation,
  parseNumber,
} = require("../calculator");

describe("SUPPORTED_OPERATIONS", () => {
  test("includes the four basic arithmetic operations", () => {
    expect(Object.keys(SUPPORTED_OPERATIONS)).toEqual(["+", "-", "*", "/"]);
    expect(SUPPORTED_OPERATIONS["+"] .label).toBe("addition");
    expect(SUPPORTED_OPERATIONS["-"].label).toBe("subtraction");
    expect(SUPPORTED_OPERATIONS["*"].label).toBe("multiplication");
    expect(SUPPORTED_OPERATIONS["/"].label).toBe("division");
  });
});

describe("normalizeOperation", () => {
  test.each([
    ["+", "+"],
    ["-", "-"],
    ["*", "*"],
    ["/", "/"],
    ["add", "+"],
    ["addition", "+"],
    ["subtract", "-"],
    ["subtraction", "-"],
    ["multiply", "*"],
    ["multiplication", "*"],
    ["divide", "/"],
    ["division", "/"],
    ["x", "*"],
    ["X", "*"],
    ["×", "*"],
  ])('normalizes "%s" to "%s"', (input, expected) => {
    expect(normalizeOperation(input)).toBe(expected);
  });

  test("returns unknown operations unchanged", () => {
    expect(normalizeOperation("%")).toBe("%");
  });
});

describe("parseNumber", () => {
  test.each([
    ["2", "first number", 2],
    ["-4", "second number", -4],
    ["3.5", "value", 3.5],
    ["0", "value", 0],
  ])('parses "%s" as %p', (input, label, expected) => {
    expect(parseNumber(input, label)).toBe(expected);
  });

  test("throws a clear error for invalid input", () => {
    expect(() => parseNumber("abc", "first number")).toThrow(
      'Invalid first number "abc". Please provide a valid number.'
    );
  });
});

describe("calculate", () => {
  test.each([
    [2, "+", 3, 5],
    [10, "-", 4, 6],
    [45, "*", 2, 90],
    [20, "/", 5, 4],
  ])("returns the image example result for %p %s %p", (left, operation, right, expected) => {
    expect(calculate(left, operation, right)).toBe(expected);
  });

  test.each([
    [7, "+", 8, 15],
    [-10, "-", -5, -5],
    [2.5, "*", 4, 10],
    [9, "/", 2, 4.5],
  ])("handles additional arithmetic cases for %p %s %p", (left, operation, right, expected) => {
    expect(calculate(left, operation, right)).toBe(expected);
  });

  test.each([
    [6, "add", 4, 10],
    [8, "subtraction", 3, 5],
    [7, "x", 6, 42],
    [18, "division", 3, 6],
  ])("supports operation aliases for %p %s %p", (left, operation, right, expected) => {
    expect(calculate(left, operation, right)).toBe(expected);
  });

  test("throws for division by zero", () => {
    expect(() => calculate(8, "/", 0)).toThrow("Division by zero is not allowed.");
  });

  test("throws for unsupported operations", () => {
    expect(() => calculate(8, "%", 2)).toThrow(
      'Unsupported operation "%". Use one of: +, -, *, /.'
    );
  });
});

const {
  SUPPORTED_OPERATIONS,
  calculate,
  modulo,
  normalizeOperation,
  parseNumber,
  power,
  squareRoot,
} = require("../calculator");

describe("SUPPORTED_OPERATIONS", () => {
  test("includes the supported arithmetic operations", () => {
    expect(Object.keys(SUPPORTED_OPERATIONS)).toEqual(["+", "-", "*", "/", "%", "^", "sqrt"]);
    expect(SUPPORTED_OPERATIONS["+"] .label).toBe("addition");
    expect(SUPPORTED_OPERATIONS["-"].label).toBe("subtraction");
    expect(SUPPORTED_OPERATIONS["*"].label).toBe("multiplication");
    expect(SUPPORTED_OPERATIONS["/"].label).toBe("division");
    expect(SUPPORTED_OPERATIONS["%"].label).toBe("modulo");
    expect(SUPPORTED_OPERATIONS["^"].label).toBe("exponentiation");
    expect(SUPPORTED_OPERATIONS.sqrt.label).toBe("square root");
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
    ["modulo", "%"],
    ["remainder", "%"],
    ["power", "^"],
    ["exponentiation", "^"],
    ["exponent", "^"],
    ["**", "^"],
    ["sqrt", "sqrt"],
    ["squareroot", "sqrt"],
    ["root", "sqrt"],
  ])('normalizes "%s" to "%s"', (input, expected) => {
    expect(normalizeOperation(input)).toBe(expected);
  });

  test("returns canonical operations unchanged", () => {
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

describe("operation helpers", () => {
  test("modulo returns the remainder", () => {
    expect(modulo(10, 3)).toBe(1);
  });

  test("modulo throws for division by zero", () => {
    expect(() => modulo(10, 0)).toThrow("Modulo by zero is not allowed.");
  });

  test("power raises the base to the exponent", () => {
    expect(power(2, 5)).toBe(32);
  });

  test("squareRoot returns the square root", () => {
    expect(squareRoot(81)).toBe(9);
  });

  test("squareRoot throws for negative numbers", () => {
    expect(() => squareRoot(-1)).toThrow("Square root of a negative number is not allowed.");
  });
});

describe("calculate", () => {
  test.each([
    [2, "+", 3, 5],
    [10, "-", 4, 6],
    [45, "*", 2, 90],
    [20, "/", 5, 4],
    [10, "%", 3, 1],
    [2, "^", 4, 16],
    [81, "sqrt", undefined, 9],
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
    [10, "modulo", 4, 2],
    [3, "**", 3, 27],
    [49, "root", undefined, 7],
  ])("supports operation aliases for %p %s %p", (left, operation, right, expected) => {
    expect(calculate(left, operation, right)).toBe(expected);
  });

  test("throws for division by zero", () => {
    expect(() => calculate(8, "/", 0)).toThrow("Division by zero is not allowed.");
  });

  test("throws for modulo by zero", () => {
    expect(() => calculate(8, "%", 0)).toThrow("Modulo by zero is not allowed.");
  });

  test("throws for square root of a negative number", () => {
    expect(() => calculate(-9, "sqrt")).toThrow("Square root of a negative number is not allowed.");
  });

  test("throws for unsupported operations", () => {
    expect(() => calculate(8, "unknown", 2)).toThrow(
      'Unsupported operation "unknown". Use one of: +, -, *, /, %, ^, sqrt.'
    );
  });
});

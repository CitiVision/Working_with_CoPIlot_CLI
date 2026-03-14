const {
  SUPPORTED_OPERATIONS,
  calculate,
  normalizeOperation,
  parseNumber,
} = require("../calculator");

describe("SUPPORTED_OPERATIONS", () => {
  test("includes all supported arithmetic operations", () => {
    expect(Object.keys(SUPPORTED_OPERATIONS)).toEqual(["+", "-", "*", "/", "%", "**", "sqrt"]);
    expect(SUPPORTED_OPERATIONS["+"].label).toBe("addition");
    expect(SUPPORTED_OPERATIONS["-"].label).toBe("subtraction");
    expect(SUPPORTED_OPERATIONS["*"].label).toBe("multiplication");
    expect(SUPPORTED_OPERATIONS["/"].label).toBe("division");
    expect(SUPPORTED_OPERATIONS["%"].label).toBe("modulo");
    expect(SUPPORTED_OPERATIONS["**"].label).toBe("exponentiation");
    expect(SUPPORTED_OPERATIONS["sqrt"].label).toBe("square root");
  });
});

describe("normalizeOperation", () => {
  test.each([
    ["+", "+"],
    ["-", "-"],
    ["*", "*"],
    ["/", "/"],
    ["%", "%"],
    ["**", "**"],
    ["sqrt", "sqrt"],
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
    ["mod", "%"],
    ["modulo", "%"],
    ["remainder", "%"],
    ["pow", "**"],
    ["power", "**"],
    ["exponent", "**"],
    ["exponentiation", "**"],
    ["squareroot", "sqrt"],
    ["√", "sqrt"],
  ])('normalizes "%s" to "%s"', (input, expected) => {
    expect(normalizeOperation(input)).toBe(expected);
  });

  test("returns unknown operations unchanged", () => {
    expect(normalizeOperation("unknown")).toBe("unknown");
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
  // Basic arithmetic operations
  test.each([
    [2, "+", 3, 5],
    [10, "-", 4, 6],
    [45, "*", 2, 90],
    [20, "/", 5, 4],
  ])("returns the correct result for %p %s %p", (left, operation, right, expected) => {
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
    expect(() => calculate(8, "@@", 2)).toThrow(
      'Unsupported operation "@@". Use one of: +, -, *, /, %, **, sqrt.'
    );
  });

  // Modulo operation
  describe("modulo", () => {
    test.each([
      [10, "%", 3, 1],
      [15, "%", 4, 3],
      [20, "%", 5, 0],
      [7, "%", 2, 1],
    ])("calculates modulo: %p %% %p = %p", (left, operation, right, expected) => {
      expect(calculate(left, operation, right)).toBe(expected);
    });

    test("supports modulo alias 'mod'", () => {
      expect(calculate(10, "mod", 3)).toBe(1);
    });

    test("supports modulo alias 'modulo'", () => {
      expect(calculate(17, "modulo", 5)).toBe(2);
    });

    test("supports modulo alias 'remainder'", () => {
      expect(calculate(13, "remainder", 4)).toBe(1);
    });

    test("throws for modulo by zero", () => {
      expect(() => calculate(8, "%", 0)).toThrow("Modulo by zero is not allowed.");
    });
  });

  // Power / exponentiation operation
  describe("power (exponentiation)", () => {
    test.each([
      [2, "**", 10, 1024],
      [3, "**", 3, 27],
      [5, "**", 2, 25],
      [2, "**", 0, 1],
    ])("calculates power: %p ** %p = %p", (left, operation, right, expected) => {
      expect(calculate(left, operation, right)).toBe(expected);
    });

    test("supports power alias 'pow'", () => {
      expect(calculate(2, "pow", 8)).toBe(256);
    });

    test("supports power alias 'power'", () => {
      expect(calculate(3, "power", 4)).toBe(81);
    });

    test("supports power alias 'exponent'", () => {
      expect(calculate(4, "exponent", 3)).toBe(64);
    });

    test("supports power alias 'exponentiation'", () => {
      expect(calculate(5, "exponentiation", 3)).toBe(125);
    });

    test("handles negative exponent", () => {
      expect(calculate(2, "**", -1)).toBe(0.5);
    });

    test("handles fractional exponent", () => {
      expect(calculate(4, "**", 0.5)).toBe(2);
    });
  });

  // Square root operation
  describe("square root", () => {
    test.each([
      [4, "sqrt", undefined, 2],
      [9, "sqrt", undefined, 3],
      [16, "sqrt", undefined, 4],
      [25, "sqrt", undefined, 5],
      [0, "sqrt", undefined, 0],
    ])("calculates square root of %p = %p", (left, operation, right, expected) => {
      expect(calculate(left, operation, right)).toBe(expected);
    });

    test("calculates square root of a non-perfect square", () => {
      expect(calculate(2, "sqrt")).toBeCloseTo(1.4142, 4);
    });

    test("supports square root alias '√'", () => {
      expect(calculate(36, "√")).toBe(6);
    });

    test("supports square root alias 'squareroot'", () => {
      expect(calculate(49, "squareroot")).toBe(7);
    });

    test("throws for square root of a negative number", () => {
      expect(() => calculate(-1, "sqrt")).toThrow(
        "Square root of a negative number is not allowed."
      );
    });
  });
});

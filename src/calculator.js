#!/usr/bin/env node

/**
 * Supported calculator operations:
 * - addition (+)
 * - subtraction (-)
 * - multiplication (*)
 * - division (/)
 * - modulo (%)
 * - exponentiation (^)
 * - square root (sqrt)
 */
function modulo(a, b) {
  if (b === 0) {
    throw new Error("Modulo by zero is not allowed.");
  }

  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error("Square root of a negative number is not allowed.");
  }

  return Math.sqrt(n);
}

const SUPPORTED_OPERATIONS = {
  "+": {
    label: "addition",
    calculate: (left, right) => left + right,
  },
  "-": {
    label: "subtraction",
    calculate: (left, right) => left - right,
  },
  "*": {
    label: "multiplication",
    calculate: (left, right) => left * right,
  },
  "/": {
    label: "division",
    calculate: (left, right) => {
      if (right === 0) {
        throw new Error("Division by zero is not allowed.");
      }

      return left / right;
    },
  },
  "%": {
    label: "modulo",
    calculate: modulo,
  },
  "^": {
    label: "exponentiation",
    calculate: power,
  },
  sqrt: {
    label: "square root",
    calculate: (value) => squareRoot(value),
  },
};

function normalizeOperation(operation) {
  const aliases = {
    add: "+",
    addition: "+",
    subtract: "-",
    subtraction: "-",
    multiply: "*",
    multiplication: "*",
    divide: "/",
    division: "/",
    x: "*",
    X: "*",
    "×": "*",
    modulo: "%",
    remainder: "%",
    power: "^",
    exponentiation: "^",
    exponent: "^",
    "**": "^",
    sqrt: "sqrt",
    squareroot: "sqrt",
    root: "sqrt",
  };

  return aliases[operation] || operation;
}

function parseNumber(value, label) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Invalid ${label} "${value}". Please provide a valid number.`);
  }

  return parsedValue;
}

function calculate(left, operation, right) {
  const normalizedOperation = normalizeOperation(operation);
  const selectedOperation = SUPPORTED_OPERATIONS[normalizedOperation];

  if (!selectedOperation) {
    throw new Error(
      `Unsupported operation "${operation}". Use one of: ${Object.keys(SUPPORTED_OPERATIONS).join(", ")}.`
    );
  }

  return selectedOperation.calculate(left, right);
}

function printUsage() {
  console.log("Usage: node src/calculator.js <number> <operation> <number>");
  console.log("   or: node src/calculator.js sqrt <number>");
  console.log("Example: node src/calculator.js 8 + 2");
  console.log("Example: node src/calculator.js sqrt 9");
  console.log("Supported operations: +, -, *, /, %, ^, sqrt");
}

function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2 && args.length !== 3) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    let result;

    if (args.length === 2) {
      const [operationInput, valueInput] = args;

      if (normalizeOperation(operationInput) !== "sqrt") {
        throw new Error(
          'Unary usage is only supported for "sqrt". Use: node src/calculator.js sqrt <number>.'
        );
      }

      const value = parseNumber(valueInput, "value");
      result = calculate(value, operationInput);
    } else {
      const [leftInput, operationInput, rightInput] = args;

      if (normalizeOperation(operationInput) === "sqrt") {
        throw new Error('Square root uses unary input. Use: node src/calculator.js sqrt <number>.');
      }

      const left = parseNumber(leftInput, "first number");
      const right = parseNumber(rightInput, "second number");
      result = calculate(left, operationInput, right);
    }

    console.log(result);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  SUPPORTED_OPERATIONS,
  calculate,
  modulo,
  normalizeOperation,
  parseNumber,
  power,
  squareRoot,
};

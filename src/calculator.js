#!/usr/bin/env node

/**
 * Supported calculator operations:
 * - addition (+)
 * - subtraction (-)
 * - multiplication (*)
 * - division (/)
 * - modulo (%)
 * - exponentiation (**)
 * - square root (sqrt)
 */
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
    calculate: (left, right) => {
      if (right === 0) {
        throw new Error("Modulo by zero is not allowed.");
      }

      return left % right;
    },
  },
  "**": {
    label: "exponentiation",
    calculate: (left, right) => left ** right,
  },
  sqrt: {
    label: "square root",
    calculate: (left) => {
      if (left < 0) {
        throw new Error("Square root of a negative number is not allowed.");
      }

      return Math.sqrt(left);
    },
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
    mod: "%",
    modulo: "%",
    remainder: "%",
    pow: "**",
    power: "**",
    exponent: "**",
    exponentiation: "**",
    "square root": "sqrt",
    squareroot: "sqrt",
    "√": "sqrt",
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
  console.log("Usage: node src/calculator.js <number> <operation> [number]");
  console.log("Example: node src/calculator.js 8 + 2");
  console.log("Example: node src/calculator.js 9 sqrt");
  console.log("Supported operations: +, -, *, /, %, **, sqrt");
}

function main() {
  const [leftInput, operationInput, rightInput] = process.argv.slice(2);

  if (!leftInput || !operationInput) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    const left = parseNumber(leftInput, "first number");
    const normalizedOp = normalizeOperation(operationInput);

    // sqrt only needs one operand
    if (normalizedOp === "sqrt") {
      const result = calculate(left, operationInput);
      console.log(result);
      return;
    }

    if (!rightInput) {
      printUsage();
      process.exitCode = 1;
      return;
    }

    const right = parseNumber(rightInput, "second number");
    const result = calculate(left, operationInput, right);

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
  normalizeOperation,
  parseNumber,
};

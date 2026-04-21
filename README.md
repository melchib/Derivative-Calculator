# Derivative Calculator
A web-based symbolic differentiation calculator that parses and evaluates algebraic expressions in real time. Originally developed in Java as a console application and later rewritten in JavaScript with an interactive frontend.

## Features
  Differentiates polynomial expressions in terms of x
  Implements core calculus rules:
    Product rule
    Quotient rule
    Chain rule (nested expressions supported)
  Live update mode with debounced input handling for real-time feedback
  Toggle between live and manual evaluation
  Syntax validation with delayed error messaging
  LaTeX-rendered output using MathJax for clear mathematical display

## How It Works
  Parses input expressions using regular expressions and string tokenization
  Breaks expressions into individual terms and function components
  Applies differentiation rules programmatically (power, product, quotient)
  Reconstructs the derivative as a formatted LaTeX string for display

The differentiation engine uses a rule-based approach similar to symbolic algebra systems, applying transformations based on detected expression structure.

## Technologies
  JavaScript (core logic and frontend behavior)
  HTML/CSS (user interface)
  MathJax (mathematical rendering)
  Java (original prototype)

## Notable Implementation Details
  Implemented input debouncing to prevent excessive recomputation during typing
  Built custom expression parser using regex and string manipulation
  Designed modular rule handlers (doProductRule, doQuotientRule, etc.)
  Added graceful error handling with delayed feedback to improve UX

## Future Improvements
  Support for:
  Trigonometric functions
  Inverse trigonometric functions
  Logarithmic and exponential functions
  Expression simplification engine
  Improved parsing using a full expression tree (AST)

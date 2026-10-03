
# Engineering Instructions

## Development workflow

When implementing or modifying a feature:

1. Inspect the relevant existing code before making changes.
2. Follow existing architecture and project conventions.
3. Prefer reusable components and maintainable solutions.
4. Avoid unnecessary dependencies and abstractions.
5. Run relevant tests and verification commands.
6. Never create Git commits unless explicitly requested.

## Mandatory implementation report

After completing any feature or substantial code change, provide:

### 1. Files changed
List the modified files and explain why each was changed.

### 2. Implementation explanation
Explain the relevant frontend and backend logic.
Highlight important functions, services, and components.

### 3. Data flow
Where applicable, explain:
UI -> API -> Authentication -> Business Logic -> Database -> Response

### 4. Engineering considerations
Identify potential security, performance, reliability,
and maintainability concerns.

### 5. Verification
List tests and commands actually executed, their results,
and anything that could not be tested.
Never claim tests passed unless they actually ran.

### 6. Architectural decisions
Explain new dependencies, design decisions, and trade-offs.

## Educational requirements

Assume the developer wants to understand and maintain
the code independently.

Keep explanations concise but educational.
Reference actual files and functions rather than
giving generic explanations.

Never hide known bugs, failing tests, or incomplete work.



## Automatic implementation review

After completing any feature implementation or
significant code modification:

1. Follow the implementation-review skill when available.
2. Review the actual code changes and relevant Git diff.
3. Provide the mandatory implementation report.
4. Explain important code changes and architectural decisions.
5. Report test results and any remaining risks.

Do this automatically without requiring the user
to invoke the skill manually.

For simple questions or explanations that do not
modify code, skip the implementation review.

# @atomist/tree-path

[![npm version](https://badge.fury.io/js/%40atomist%2Ftree-path.svg)](https://badge.fury.io/js/%40atomist%2Ftree-path)

[Node][node] module `@atomist/tree-path-ts` defining trees and path
expressions.  These capabilities were created for use in
[Atomist][atomist] code transformations, including those used to
transform seed projects into new projects.

XPath-like path expressions can be executed against any implementation
of the simple `TreeNode` interface.  This is typically used to expose
ASTS: for example, those resulting from ANTLR grammars,
[microgrammars][] or a standalone parser such as the TypeScript
compiler's parser.  The ability to skip levels in navigating path
expressions (e.g., via `//`) is invaluable in ignoring irrelevant
levels of language ASTs, which tend to be noisy.

For example, find all variable names in a TypeScript file (using
TypeScript AST integration in [automation-client][]:

```typescript
const variableNames = evaluateScalarValue(
	sourceFile,
	"//VariableDeclaration/Identifier");
```

[microgrammars]: https://github.com/atomist/microgrammar (Atomist Microgrammar Node.js Package)
[automation-client]: https://github.com/atomist/automation-client-ts (Atomist Automation Client)

## Concepts

For more information, please read [Tree and path expression
overview](docs/PathExpressions.md).

## Support

General support questions should be discussed in the `#support`
channel in the [Atomist community Slack workspace][slack].

If you find a problem, please create an [issue][].

[issue]: https://github.com/atomist/tree-path-ts/issues

## Development

You will need to install [node][] to build and test this project.

[node]: https://nodejs.org/ (Node.js)

### Build and test

Use the following package scripts to build, test, and perform other
development tasks.

Command | Reason
------- | ------
`npm install` | install project dependencies
`npm run build` | compile, test, lint, and generate docs
`npm start` | start the Atomist API client
`npm run autostart` | run the client, refreshing when files change
`npm run lint` | run TSLint against the TypeScript
`npm run compile` | generate types from GraphQL and compile TypeScript
`npm test` | run tests
`npm run autotest` | run tests every time a file changes
`npm run clean` | remove files generated during the build

### Release

Releases are managed by the [Atomist SDM][atomist-sdm].  Press the
release button in the Atomist dashboard or Slack.

[atomist-sdm]: https://github.com/atomist/atomist-sdm (Atomist Software Delivery Machine)

---

Created by [Atomist][atomist].
Need Help?  [Join our Slack workspace][slack].

[atomist]: https://atomist.com/ (Atomist - How Teams Deliver Software)
[slack]: https://join.atomist.com/ (Atomist Community Slack)

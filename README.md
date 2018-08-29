# @atomist/tree-path

[![atomist sdm goals](http://badge.atomist.com/T29E48P34/atomist/tree-path-ts/ba33dd78-8d0e-41a3-9556-fca70a98289b)](https://app.atomist.com/workspace/T29E48P34)
[![npm version](https://img.shields.io/npm/v/@atomist/tree-path.svg)](https://www.npmjs.com/package/@atomist/tree-path)

[Node.js][node] module `@atomist/tree-path-ts` defining trees and path
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
	"//VariableDeclaration/Identifier"
);
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

You will need to install [Node.js][node] to build and test this
project.

[node]: https://nodejs.org/ (Node.js)

### Build and test

Install dependencies.

```
$ npm install
```

Use the `build` package script to compile, test, lint, and build the
documentation.

```
$ npm run build
```

### Release

Releases are handled via the [Atomist SDM][atomist-sdm].  Just press
the 'Approve' button in the Atomist dashboard or Slack.

[atomist-sdm]: https://github.com/atomist/atomist-sdm (Atomist Software Delivery Machine)

---

Created by [Atomist][atomist].
Need Help?  [Join our Slack workspace][slack].

[atomist]: https://atomist.com/ (Atomist - How Teams Deliver Software)
[slack]: https://join.atomist.com/ (Atomist Community Slack)

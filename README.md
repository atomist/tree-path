# @atomist/tree-path

[![Build Status](https://travis-ci.org/atomist/tree-path-ts.svg?branch=master)](https://travis-ci.org/atomist/tree-path-ts)

[Node][node] module [`@atomist/tree-path-ts`] defining trees and path expressions.  
Primarily intended for use in Atomist client automations, for consistent execution against any AST.

XPath-like path expressions can be executed against any implementation of the simple `TreeNode` interface.
This is typically used to expose ASTS: for example, those resulting from ANTLR grammars,
 [microgrammars](https://github.com/atomist/microgrammar) or a
standalone parser such as the TypeScript compiler's parser. The ability to skip levels in navigating path expressions (e.g. via `//`) is invaluable in ignoring irrelevant levels of language ASTs, which tend to be noisy.

For example, find all variable names in a TypeScript file (using TypeScript AST integration in [automation-client](https://github.com/atomist/automation-client-ts):

```typescript
const variableNames = evaluateScalarValue(
	sourceFile, 
	"//VariableDeclaration/Identifier");
```


[node]: https://nodejs.org/ (Node.js)
[automation-client]: https://www.npmjs.com/package/@atomist/tree-path-ts

## Concepts


For more information, please read [Tree and path expression overview](docs/PathExpressions.md).

## Support

General support questions should be discussed in the `#support`
channel on our community Slack team
at [atomist-community.slack.com][slack].

If you find a problem, please create an [issue][].

[issue]: https://github.com/atomist/tree-path-ts/issues

## Development

You will need to install [node][] to build and test this project.

### Build and Test

Command | Reason
------- | ------
`npm install` | to install all the required packages
`npm run lint` | to run tslint against the TypeScript
`npm run compile` | to compile all TypeScript into JavaScript
`npm test` | to run tests and ensure everything is working
`npm run autotest` | run tests continuously (you may also need to run `tsc -w`)
`npm run clean` | remove stray compiled JavaScript files and build directory

### Release

To create a new release of the project, simply push a tag of the form
`M.N.P` where `M`, `N`, and `P` are integers that form the next
appropriate [semantic version][semver] for release.  The version in
the package.json is replaced by the build and is totally ignored!  For
example:

[semver]: http://semver.org

```
$ git tag -a 1.2.3
$ git push --tags
```

The Travis CI build (see badge at the top of this page) will publish
the NPM module and automatically create a GitHub release using the tag
name for the release and the comment provided on the annotated tag as
the contents of the release notes.

---
Created by [Atomist][atomist].
Need Help?  [Join our Slack team][slack].

[atomist]: https://www.atomist.com/
[slack]: https://join.atomist.com

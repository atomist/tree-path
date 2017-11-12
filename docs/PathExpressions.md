# Path Expressions

Path expressions are inspired by [XPath](https://www.w3.org/TR/1999/REC-xpath-19991116/). 
We borrow from XPath the concept of **axis specifier**, **node test** and **predicate**.
However, the fact that this library runs in a JavaScript environment allows
us to have a simpler yet more powerful approach to functions, which simplifies
the handling of predicates overall.

## Path Expression Syntax
Example--find all variable names in a TypeScript file (using TypeScript AST integration in [automation-client](https://github.com/atomist/automation-client-ts):

```typescript
const variableNames = evaluateScalarValue(
	sourceFile, 
	"//VariableDeclaration/Identifier");
```

### Supported Syntax

Only node values are returned by expressions. Convenience methods in TypeScript provide
ways of extracting scalar values, instead of having different return types from
path expressions themselves.

We support unions via the `|` operations. For example:

```typescript
const variableNames = evaluateExpression(
	sourceFile, 
	"//VariableDeclaration/Identifier | //ClassDeclaration/Identifier");
```

### Supported Axes
The following XPath axes--node navigation directions--are supported:

- ancestor
- ancestor-or-self
- self: `.`
- child: `/`
- descendant
- descendant or self: `//`
- following-sibling
- preceding-sibling
- parent

The folowing axes are not currently supported. 
Those in ~~strike through~~ are not relevant and will never be supported. 
The others may be if there is demand for them:

- ~~attribute~~	
- following
- ~~namespace~~	
- preceding

### Functions
XPath provides a set of functions to test nodes for matching. 
Given that this project runs in a JavaScript environment, we provide a general solution: simply passing an arbitrary function to the runtime and invoking it in a predicate consisting of the function name preceded by `?`. For example:

```typescript
const result = evaluateExpression(tn, "/*[@value='x'][?veto]", {
        veto: n => n.$name === "Thing1",
    }) as SuccessResult;
```

Functions, such as the veto function in the object literal above, should implement the signature of the `PredicateTest` type.


## Integration

It's possible to run path expressions against
any implementation of the simple `TreeNode` interface: 

```typescript
export interface TreeNode {

    readonly $name: string;

    $children?: TreeNode[];

    /**
     * Value, if this is a terminal node
     */
    $value?: string;

    /** Offset from 0 in the file, if available */
    readonly $offset?: number;

}
```
This makes it simple to expose any parsed structure so that it has path expression support.

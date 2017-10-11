# Path Expressions

Path expressions are inspired by XPath.

It's possible to run path expressions against
implementations of the simple `TreeNode` interface: 

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

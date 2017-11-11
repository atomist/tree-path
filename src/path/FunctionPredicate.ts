/**
 * General alternative to XPath functions. Allows the identification
 * of arbitrary function to be executed against the
 */

import { TreeNode } from "../TreeNode";
import { ExpressionEngine } from "./expressionEngine";
import { Predicate, PredicateTest } from "./pathExpression";

/**
 * Predicate that executes a named predicate function, defined on the functionRegistry
 */
export class FunctionPredicate implements Predicate {

    public kind = "FunctionPredicate";

    /**
     * Takes the name of a predicate function
     * @param {string} name
     */
    constructor(public name: string) {
    }

    public evaluate(nodeToTest: TreeNode, returnedNodes: TreeNode[],
                    ee: ExpressionEngine, functionRegistry: any): boolean {
        return !!functionRegistry[this.name] &&
            (functionRegistry[this.name] as PredicateTest)(nodeToTest, returnedNodes, ee, functionRegistry);
    }

    public toString() {
        return `Function: '${this.name}'`;
    }
}

export function isFunctionPredicate(p: Predicate): p is FunctionPredicate {
    const maybeFp = p as FunctionPredicate;
    return maybeFp.kind === "FunctionPredicate" && !!maybeFp.name;
}

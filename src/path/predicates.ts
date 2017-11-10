import { TreeNode } from "../TreeNode";
import { ExpressionEngine } from "./expressionEngine";
import { isSuccessResult, PathExpression, Predicate, stringify } from "./pathExpression";

export class AttributeEqualityPredicate implements Predicate {

    constructor(public readonly name: string, public readonly value: string) {
    }

    public evaluate(nodeToTest: TreeNode): boolean {
        return nodeToTest.$value === this.value;
    }

    public toString() {
        return `@${this.name}='${this.value}'`;
    }
}

/**
 * Position within results. Indexing starts from 1
 */
export class PositionPredicate implements Predicate {

    constructor(public readonly index: number) {
    }

    public evaluate(nodeToTest: TreeNode, returnedNodes: TreeNode[]): boolean {
        return returnedNodes.indexOf(nodeToTest) === this.index - 1;
    }

    public toString() {
        return `[${this.index}]'`;
    }
}

export class NestedPathExpressionPredicate implements Predicate {

    constructor(public pathExpression: PathExpression) {
    }

    public evaluate(nodeToTest: TreeNode, returnedNodes: TreeNode[],
                    ee: ExpressionEngine, functionRegistry: object): boolean {
        const r = ee(nodeToTest, this.pathExpression, functionRegistry);
        return isSuccessResult(r) && r.length > 0;
    }

    public toString() {
        return stringify(this.pathExpression);
    }
}

import { TreeNode } from "../TreeNode";
import {
    ExpressionEngine,
    FunctionRegistry,
} from "./expressionEngine";
import {
    isSuccessResult,
    PathExpression,
    Predicate,
    stringify,
} from "./pathExpression";

export class AttributeEqualityPredicate implements Predicate {

    constructor(public readonly name: string, public readonly value: string) {
    }

    public evaluate(nodeToTest: TreeNode): boolean {
        switch (this.name) {
            case "value" :
                return nodeToTest.$value === this.value;
            default:
                return nodeToTest[this.name] === this.value;
        }
    }

    public toString() {
        return `@${this.name}='${this.value}'`;
    }
}

/**
 * Position within results. Indexing starts from 1, following XPath spec
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
                    ee: ExpressionEngine, functionRegistry: FunctionRegistry): boolean {
        const r = ee(nodeToTest, this.pathExpression, functionRegistry);
        return isSuccessResult(r) && r.length > 0;
    }

    public toString() {
        return stringify(this.pathExpression);
    }
}

export class OrPredicate implements Predicate {

    constructor(public readonly a: Predicate, public readonly b: Predicate) {
    }

    public evaluate(nodeToTest: TreeNode,
                    returnedNodes: TreeNode[],
                    ee: ExpressionEngine,
                    functionRegistry: FunctionRegistry): boolean {
        return this.a.evaluate(nodeToTest, returnedNodes, ee, functionRegistry) ||
            this.b.evaluate(nodeToTest, returnedNodes, ee, functionRegistry);
    }

    public toString() {
        return `${this.a} or ${this.b}'`;
    }
}

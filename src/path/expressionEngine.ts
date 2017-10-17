import { TreeNode } from "../TreeNode";
import { ExecutionResult, isSuccessResult, PathExpression } from "./pathExpression";

import * as _ from "lodash";
import { toPathExpression } from "./pathExpressionParser";

export type ExpressionEngine = (node: TreeNode, parsed: PathExpression | string) => ExecutionResult;

/**
 * Return the result of evaluating the expression. If the expression is invalid
 * return a message, otherwise the result of invoking the valid expression.
 *
 * @param root  root node to evaluateExpression the path against
 * @param pex   Parsed or string path expression.
 * @return
 */
export function evaluateExpression(root: TreeNode,
                                   pex: string | PathExpression): ExecutionResult {
    const parsed = toPathExpression(pex);
    let currentResult: ExecutionResult = [root];
    for (const locationStep of parsed.locationSteps) {
        if (isSuccessResult(currentResult)) {
            if (currentResult.length > 0) {
                const allNextNodes =
                    currentResult.map(n => locationStep.follow(n, root, evaluateExpression));
                const next = _.flatten(allNextNodes);
                console.log("Executing location step %s against [%s]:count=%d",
                    locationStep,
                    currentResult.map(n => n.$name).join(","),
                    next.length);
                currentResult = next;
            }
        } else {
            return currentResult;
        }
    }
    return currentResult;
}

/**
 * Convenience method to return the result of evaluating the $value of the scalar expression,
 * which is usually a terminal.
 * Undefined if there is not exactly one.
 *
 * @param root  root node to evaluateExpression the path against
 * @param pex   Parsed or string path expression.
 * @return
 */
export function evaluateScalar(root: TreeNode,
                               pex: string | PathExpression): TreeNode {
    const results = evaluateExpression(root, pex);
    if (isSuccessResult(results) && results.length === 1) {
        return results[0];
    } else {
        return undefined;
    }
}

/**
 * Convenience method to return the result of evaluating the $value of the scalar expression,
 * which is usually a terminal.
 * Undefined if there is not exactly one.
 *
 * @param root  root node to evaluateExpression the path against
 * @param pex   Parsed or string path expression.
 * @return
 */
export function evaluateScalarValue(root: TreeNode,
                                    pex: string | PathExpression): string | undefined {
    const node = evaluateScalar(root, pex);
    return node ? node.$value : undefined;
}

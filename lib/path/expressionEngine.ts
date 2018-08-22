import { TreeNode } from "../TreeNode";
import {
    ExecutionResult, FailureResult, isFailureResult, isSuccessResult, isUnionPathExpression,
    PathExpression, SuccessResult,
} from "./pathExpression";

import * as _ from "lodash";
import { allPredicates } from "../internal/pathExpressionUtils";
import { FunctionPredicate, isFunctionPredicate } from "./FunctionPredicate";
import { toPathExpression } from "./utils";

export type ExpressionEngine = (node: TreeNode,
                                parsed: PathExpression | string,
                                functionRegistry: object) => ExecutionResult;

/**
 * Return the result of evaluating the expression. If the expression is invalid
 * return a message, otherwise the result of invoking the valid expression.
 * All other functions ultimately run through this.
 *
 * @param root  root node to evaluateExpression the path against
 * @param pex   Parsed or string path expression.
 * @param functionRegistry registry to use to look up functions
 * @return ExecutionResult
 */
export function evaluateExpression(root: TreeNode,
                                   pex: string | PathExpression, functionRegistry: object = {}): ExecutionResult {
    const parsed = toPathExpression(pex);
    const failure = validateFunctionPredicates(parsed, functionRegistry);
    if (isFailureResult(failure)) {
        return failure;
    }

    if (isUnionPathExpression(parsed)) {
        const results = parsed.unions.map(u => evaluateExpression(root, u));
        const fail = results.find(isFailureResult);
        if (!!fail) {
            return fail;
        }
        return _.uniq(_.flatten(results.map(r => r as SuccessResult)));
    }

    let currentResult: ExecutionResult = [root];
    for (const locationStep of parsed.locationSteps) {
        if (isSuccessResult(currentResult)) {
            if (currentResult.length > 0) {
                const allNextNodes =
                    currentResult.map(n => locationStep.follow(n, root, evaluateExpression, functionRegistry));
                const next = _.flatten(allNextNodes);
                // console.debug("Executing location step %s against [%s]:count=%d",
                //     locationStep,
                //     currentResult.map(n => n.$name).join(","),
                //     next.length);
                currentResult = next;
            }
        } else {
            return currentResult;
        }
    }
    return currentResult;
}

function validateFunctionPredicates(pex: PathExpression, functionRegistry: object): FailureResult | void {
    const functionPredicates: FunctionPredicate[] = allPredicates(pex)
        .filter(isFunctionPredicate)
        .map(f => f);

    const missingFunctions = functionPredicates
        .filter(fp => !functionRegistry[fp.name])
        .map(fp => fp.name);
    if (missingFunctions.length > 0) {
        return `Function predicate '${missingFunctions.join()}' not found in registry`;
    }
}

/**
 * Convenience method to return the result of evaluating the $value of the scalar expression,
 * which is usually a terminal.
 * Undefined if there is not exactly one.
 *
 * @param root  root node to evaluateExpression the path against
 * @param pex   Parsed or string path expression.
 * @param functionRegistry registry to use to look up functions
 * @return
 */
export function evaluateScalar(root: TreeNode,
                               pex: string | PathExpression,
                               functionRegistry: object = {}): TreeNode {
    const results = evaluateExpression(root, pex, functionRegistry);
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
 * @param functionRegistry registry to use to look up functions
 * @return
 */
export function evaluateScalarValue(root: TreeNode,
                                    pex: string | PathExpression,
                                    functionRegistry: object = {}): string | undefined {
    const node = evaluateScalar(root, pex, functionRegistry);
    return node ? node.$value : undefined;
}

/**
 * Convenience method to return an array of literal $value's
 * of the nodes returned by the expression, which usually matches terminals.
 * Returns the empty array without error if there are 0.
 *
 * @param root  root node to evaluateExpression the path against
 * @param pex   Parsed or string path expression.
 * @param functionRegistry registry to use to look up functions
 * @return
 */
export function evaluateScalarValues(root: TreeNode,
                                     pex: string | PathExpression,
                                     functionRegistry: object = {}): string[] {
    const values = (evaluateExpression(root, pex, functionRegistry));
    return isSuccessResult(values) ?
        values.map(n => n.$value) :
        [];
}

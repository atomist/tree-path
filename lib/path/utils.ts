import { PathExpression } from "./pathExpression";
import { parsePathExpression } from "./pathExpressionParser";

export function toPathExpression(pathExpression: string | PathExpression): PathExpression {
    return (typeof pathExpression === "string") ?
        parsePathExpression(pathExpression) :
        pathExpression;
}

import * as _ from "lodash";

import { PathExpression, Predicate } from "./pathExpression";
import { parsePathExpression } from "./pathExpressionParser";

export function toPathExpression(pathExpression: string | PathExpression): PathExpression {
    return (typeof pathExpression === "string") ?
        parsePathExpression(pathExpression) :
        pathExpression;
}

export function allPredicates(pe: PathExpression): Predicate[] {
    return _.flatten(pe.locationSteps.map(s => s.predicates));
}

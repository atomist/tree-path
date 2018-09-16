import * as _ from "lodash";

import {
    isUnionPathExpression,
    NodeTest,
    PathExpression,
    Predicate,
} from "../path/pathExpression";

export function allPredicates(pe: PathExpression): Predicate[] {
    return isUnionPathExpression(pe) ?
        _.flatten(pe.unions.map(allPredicates)) :
        _.flatten(pe.locationSteps.map(s => s.predicates));
}

export function allNodeTests(pe: PathExpression): NodeTest[] {
    return isUnionPathExpression(pe) ?
        _.flatten(pe.unions.map(allNodeTests)) :
        _.flatten(pe.locationSteps.map(s => s.test));
}

import * as _ from "lodash";

import { isUnionPathExpression, PathExpression, Predicate } from "../path/pathExpression";

export function allPredicates(pe: PathExpression): Predicate[] {
    return isUnionPathExpression(pe) ?
        _.flatten(pe.unions.map(u => allPredicates(u))) :
        _.flatten(pe.locationSteps.map(s => s.predicates));
}

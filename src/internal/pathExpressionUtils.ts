
import * as _ from "lodash";

import { PathExpression, Predicate } from "../path/pathExpression";

export function allPredicates(pe: PathExpression): Predicate[] {
    return _.flatten(pe.locationSteps.map(s => s.predicates));
}

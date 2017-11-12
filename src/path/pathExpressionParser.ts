import { Concat } from "@atomist/microgrammar/matchers/Concat";
import { Microgrammar } from "@atomist/microgrammar/Microgrammar";
import { firstOf, optional } from "@atomist/microgrammar/Ops";
import { isPatternMatch } from "@atomist/microgrammar/PatternMatch";
import { Integer } from "@atomist/microgrammar/Primitives";
import { Rep1Sep, zeroOrMore } from "@atomist/microgrammar/Rep";
import {
    ChildAxisSpecifier, DescendantAxisSpecifier, DescendantOrSelfAxisSpecifier, FollowingSiblingAxisSpecifier,
    PrecedingSiblingAxisSpecifier,
    SelfAxisSpecifier,
} from "./axisSpecifiers";
import { FunctionPredicate } from "./FunctionPredicate";
import { AllNodeTest, NamedNodeTest } from "./nodeTests";
import { LocationStep, PathExpression, Predicate } from "./pathExpression";
import { AttributeEqualityPredicate, NestedPathExpressionPredicate, PositionPredicate } from "./predicates";

/**
 * Parse the given string to path expression. Throw an error in the event of failure.
 * @param {string} expr expression ot path
 * @return {PathExpression}
 */
export function parsePathExpression(expr: string): PathExpression {
    const pg = PredicateGrammarDefs as any;
    // TODO the _initialized property is being added to microgrammar LazyMatcher
    // to avoid the need for adding a property here
    if (!pg._initialized) {
        pg._term = firstOf(
            ValuePredicateGrammar, PositionPredicateGrammar,
            PathExpressionGrammar, FunctionPredicateGrammar);
        pg._initialized = true;
        PredicateGrammar._init();
    }

    const m = PathExpressionGrammar.exactMatch(expr);
    if (isPatternMatch(m)) {
        // logger.debug("Successfully parsed path expression [%s]: %s", expr, stringify(m));
        return m;
    } else {
        // logger.info("Error parsing path expression [%s]: %s", expr, JSON.stringify(m));
        throw new Error("Failure: " + JSON.stringify(m));
    }
}

const NodeName = /[.a-zA-Z0-9_\-$#]+/;

// TODO allow double quotes, and string escaping, and possibly integer literals
const ValuePredicateGrammar = Microgrammar.fromString<Predicate>(
    "@${name}='${value}'");

const FunctionPredicateGrammar = Microgrammar.fromString<Predicate>(
    "?${functionName}", {
        functionName: /[a-zA-Z_][a-zA-Z0-9_]*/,
    });

const PositionPredicateGrammar = Microgrammar.fromString<Predicate>(
    "${position}", {position: Integer});

const PredicateGrammarDefs = {
    _lb: "[",
    _term: null, // Will be set later to avoid circularity
    term: ctx => {
        if (!!ctx._term.name && !!ctx._term.value) {
            return new AttributeEqualityPredicate(ctx._term.name, ctx._term.value);
        } else if (!!ctx._term.position) {
            return new PositionPredicate(ctx._term.position);
        } else if (!!ctx._term.locationSteps) {
            return new NestedPathExpressionPredicate(ctx._term as PathExpression);
        } else if (!!ctx._term.functionName) {
            return new FunctionPredicate(ctx._term.functionName as string);
        }
        throw new Error(`Unsupported predicate: ${JSON.stringify(ctx._term)}`);
    },
    _rb: "]",
    $lazy: true,
};

const PredicateGrammar = Concat.of(PredicateGrammarDefs);

const NodeTestGrammar = {
    _it: firstOf("*", NodeName),
    test: ctx => ctx._it === "*" ? AllNodeTest : new NamedNodeTest(ctx._it),
};

const LocationStepGrammar = Microgrammar.fromDefinitions<LocationStep>({
    _axis: optional(firstOf("/", ".",
        /[a-z\-]+::/)),
    axis: ctx => {
        switch (ctx._axis) {
            case undefined :
                return ChildAxisSpecifier;
            case "/" :
                return DescendantOrSelfAxisSpecifier;
            case "." :
                return SelfAxisSpecifier;
            default:
                if (ctx._axis.endsWith("::")) {
                    const specifier = ctx._axis.substr(0, ctx._axis.length - 2);
                    switch (specifier) {
                        case ChildAxisSpecifier.type :
                            return ChildAxisSpecifier;
                        case DescendantAxisSpecifier.type :
                            return DescendantAxisSpecifier;
                        case DescendantOrSelfAxisSpecifier.type :
                            return DescendantOrSelfAxisSpecifier;
                        case FollowingSiblingAxisSpecifier.type :
                            return FollowingSiblingAxisSpecifier;
                        case PrecedingSiblingAxisSpecifier.type :
                            return PrecedingSiblingAxisSpecifier;
                        case SelfAxisSpecifier.type :
                            return SelfAxisSpecifier;
                    }
                }
                throw new Error(`Unsupported axis specifier [${ctx._axis}]`);
        }
    },
    ...NodeTestGrammar,
    _predicates: zeroOrMore(PredicateGrammar),
    predicates: ctx => ctx._predicates.map(p => p.term),
});

const RelativePathExpressionDefs = {
    _locationSteps: new Rep1Sep(LocationStepGrammar, "/"),
    locationSteps: ctx => ctx._locationSteps.map(l => new LocationStep(l.axis, l.test, l.predicates)),
};

const PathExpressionGrammar = Microgrammar.fromDefinitions<PathExpression>({
    _slash: optional("/"),
    absolute: ctx => !!ctx._slash,
    ...RelativePathExpressionDefs,
});


import * as assert from "power-assert";
import {
    ChildAxisSpecifier,
    DescendantOrSelfAxisSpecifier,
    FollowingSiblingAxisSpecifier,
    ParentAxisSpecifier,
    SelfAxisSpecifier,
} from "../../lib/path/axisSpecifiers";
import { FunctionPredicate } from "../../lib/path/FunctionPredicate";
import {
    AllNodeTest,
    NamedNodeTest,
} from "../../lib/path/nodeTests";
import {
    SimplePathExpression,
    UnionPathExpression,
} from "../../lib/path/pathExpression";
import { parsePathExpression } from "../../lib/path/pathExpressionParser";
import {
    AttributeEqualityPredicate,
    NestedPathExpressionPredicate,
    OrPredicate,
    PositionPredicate,
} from "../../lib/path/predicates";

describe("pathExpressionParser", () => {

    it("should parse self", () => {
        const expr = ".";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis ===  SelfAxisSpecifier);
        assert(parsed.locationSteps[0].test === AllNodeTest, JSON.stringify(parsed.locationSteps[0].test));
    });

    it("should parse parent", () => {
        const expr = "..";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis ===  ParentAxisSpecifier);
        assert(parsed.locationSteps[0].test === AllNodeTest, JSON.stringify(parsed.locationSteps[0].test));
    });

    it("should parse all children", () => {
        const expr = "/*";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis ===  ChildAxisSpecifier);
        assert(parsed.locationSteps[0].test === AllNodeTest, JSON.stringify(parsed.locationSteps[0].test));
    });

    it("should parse all descendants", () => {
        const expr = "//*";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === DescendantOrSelfAxisSpecifier);
        assert(parsed.locationSteps[0].test === AllNodeTest);
    });

    it("should parse all descendants with name", () => {
        const expr = "//thing";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === DescendantOrSelfAxisSpecifier);
        const nt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nt.name === "thing");
    });

    it("should parse named children", () => {
        const expr = "/foo";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
    });

    it("should parse named children with full syntax", () => {
        const expr = "child::foo";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
    });

    it("should parse children at position", () => {
        const expr = "/foo[3]";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(parsed.locationSteps[0].predicates.length === 1);
        const pp = parsed.locationSteps[0].predicates[0] as PositionPredicate;
        assert(pp.index === 3);
    });

    it("should parse named descendants", () => {
        const expr = "//foo";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === DescendantOrSelfAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(parsed.locationSteps[0].predicates.length === 0);
    });

    it("should parse named child then named descendants", () => {
        const expr = "/fizz//foo";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 2);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt1 = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt1.name === "fizz");
        assert(parsed.locationSteps[1].axis === DescendantOrSelfAxisSpecifier);
        const nnt2 = parsed.locationSteps[1].test as NamedNodeTest;
        assert(nnt2.name === "foo");
    });

    it("should parse named children with attribute", () => {
        const expr = "/foo[@value='bar']";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(parsed.locationSteps[0].predicates.length === 1);
        const pred = parsed.locationSteps[0].predicates[0] as AttributeEqualityPredicate;
        assert(pred.value === "bar");
    });

    it("should parse children with custom attribute", () => {
        const expr = "/foo[@smeg='smog']";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(parsed.locationSteps[0].predicates.length === 1);
        const pred = parsed.locationSteps[0].predicates[0] as AttributeEqualityPredicate;
        assert(pred.name === "smeg");
        assert(pred.value === "smog");
    });

    it("should parse nested path expression predicate", () => {
        const expr = "/foo[/bar/baz]";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(parsed.locationSteps[0].predicates.length === 1);
        const pred = parsed.locationSteps[0].predicates[0] as NestedPathExpressionPredicate;
        assert(!!pred.pathExpression);
    });

    it("should parse multiple nested path expression predicates", () => {
        const expr = "/foo[/bar/baz][/dog/cat]";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(parsed.locationSteps[0].predicates.length === 2);
        const pred1 = parsed.locationSteps[0].predicates[0] as NestedPathExpressionPredicate;
        assert(!!pred1.pathExpression);
        const pred2 = parsed.locationSteps[0].predicates[0] as NestedPathExpressionPredicate;
        assert(!!pred2.pathExpression);
    });

    it("should parse nested nested path expression", () => {
        const expr = "/foo[/bar/baz[/dog/cat]]";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(parsed.locationSteps[0].predicates.length === 1);
        const pred1 = parsed.locationSteps[0].predicates[0] as NestedPathExpressionPredicate;
        assert(!!pred1.pathExpression);
        const npe = pred1.pathExpression as SimplePathExpression;
        assert(npe.locationSteps.length === 2);
        assert(npe.locationSteps[1].predicates.length === 1);
        const pred2 = npe.locationSteps[1].predicates[0] as NestedPathExpressionPredicate;
        assert(!!pred2.pathExpression);
    });

    it.skip("should OR predicates", () => {
        const expr = "/foo[@value='bar' or @value='baz']";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(parsed.locationSteps[0].predicates.length === 1);
        const pred = parsed.locationSteps[0].predicates[0] as OrPredicate;
        assert((pred.a as any).value === "bar");
        assert((pred.a as any).value === "baz");
    });

    it("should AND predicates");

    it("should parse function attribute", () => {
        const expr = "/foo[?smeg]";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(parsed.locationSteps[0].predicates.length === 1);
        const pred = parsed.locationSteps[0].predicates[0] as FunctionPredicate;
        assert(pred.name === "smeg");
    });

    it("should parse following sibling", () => {
        const expr = "following-sibling::foo";
        const parsed = parsePathExpression(expr) as SimplePathExpression;
        assert(parsed.locationSteps.length === 1);
        assert(parsed.locationSteps[0].axis === FollowingSiblingAxisSpecifier);
        const nnt = parsed.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
    });

    it("should parse union path expression", () => {
        const expr = "/foo[@smeg='smog'] | //dog";
        const u = parsePathExpression(expr) as UnionPathExpression;
        assert(u.unions.length === 2);
        const first = u.unions[0] as SimplePathExpression;
        assert(first.locationSteps.length === 1);
        assert(first.locationSteps[0].axis === ChildAxisSpecifier);
        const nnt = first.locationSteps[0].test as NamedNodeTest;
        assert(nnt.name === "foo");
        assert(first.locationSteps[0].predicates.length === 1);
        const pred = first.locationSteps[0].predicates[0] as AttributeEqualityPredicate;
        assert(pred.name === "smeg");
        assert(pred.value === "smog");
        const second = u.unions[1] as SimplePathExpression;
        assert(second.locationSteps.length === 1);
        assert(second.locationSteps[0].axis === DescendantOrSelfAxisSpecifier);
    });

});

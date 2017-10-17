import "mocha";

import * as assert from "power-assert";
import {
    ChildAxisSpecifier, DescendantAxisSpecifier,
    DescendantOrSelfAxisSpecifier, SelfAxisSpecifier,
} from "../../src/path/axisSpecifiers";
import { evaluateExpression, evaluateScalar, evaluateScalarValue } from "../../src/path/expressionEngine";
import { AllNodeTest, NamedNodeTest } from "../../src/path/nodeTests";
import { LocationStep, PathExpression } from "../../src/path/pathExpression";
import { parsePathExpression } from "../../src/path/pathExpressionParser";
import { AttributeEqualityPredicate, NestedPathExpressionPredicate } from "../../src/path/predicates";
import { TreeNode } from "../../src/TreeNode";

describe("expressionEngine", () => {

    it("should evaluateExpression no matches", () => {
        const tn: TreeNode = {$name: "foo"};
        const pe = {
            locationSteps: [new LocationStep(ChildAxisSpecifier, AllNodeTest, [])],
        };
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, []);
    });

    it("should return self", () => {
        const tn = {$name: "Thing1"};
        const pe = {
            locationSteps: [new LocationStep(SelfAxisSpecifier, AllNodeTest, [])],
        };
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, [tn]);
    });

    it("should return self passing test from parsed expression", () => {
        const pe = {
            locationSteps: [new LocationStep(SelfAxisSpecifier, AllNodeTest, [ { evaluate: () => true } ])],
        };
        returnSelf(pe);
    });

    it("should return self passing test from string", () => {
        returnSelf(".*");
    });

    function returnSelf(pe: string | PathExpression) {
        const tn = {$name: "Thing1"};
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, [tn]);
    }

    it("should not return self failing test", () => {
        const tn = {$name: "Thing1"};
        const pe = {
            locationSteps: [new LocationStep(SelfAxisSpecifier, AllNodeTest, [ { evaluate: () => false } ])],
        };
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, []);
    });

    it("should find children", () => {
        const thing1 = {$name: "Thing1"};
        const thing2 = {$name: "Thing2"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const pe = {
            locationSteps: [new LocationStep(ChildAxisSpecifier, AllNodeTest, [])],
        };
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, [thing1, thing2]);
    });

    it("should find children matching on name", () => {
        const thing1 = {$name: "Thing"};
        const thing2 = {$name: "Thing"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const pe = {
            locationSteps: [new LocationStep(ChildAxisSpecifier, new NamedNodeTest("Thing"), [])],
        };
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, [thing1, thing2]);
    });

    it("should not find children excluding on name", () => {
        const thing1 = {$name: "Thing"};
        const thing2 = {$name: "Thing"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const pe = {
            locationSteps: [new LocationStep(ChildAxisSpecifier, new NamedNodeTest("Thingxxx"), [])],
        };
        const result = evaluateExpression(tn, pe);
        assert(result.length === 0);
    });

    it("should find children matching on value", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const pe = {
            locationSteps: [new LocationStep(ChildAxisSpecifier, AllNodeTest,
                [new AttributeEqualityPredicate("$value", "x")])],
        };
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, [thing1, thing2]);
    });

    it("should not find children excluding on value", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const pe = {
            locationSteps: [new LocationStep(ChildAxisSpecifier, AllNodeTest,
                [new AttributeEqualityPredicate("$value", "xyz")])],
        };
        const result = evaluateExpression(tn, pe);
        assert(result.length === 0);
    });

    it("should find grandchildren", () => {
        const grandkid1 = {$name: "Grandkid1"};
        const grandkid2 = {$name: "Grandkid2"};
        const thing1 = {$name: "Thing1", $children: [grandkid1]};
        const thing2 = {$name: "Thing2", $children: [grandkid2]};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const pe = {
            locationSteps: [new LocationStep(DescendantAxisSpecifier, AllNodeTest, [])],
        };
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, [thing1, thing2, grandkid1, grandkid2]);
    });

    it("should execute nested predicate: match", () => {
        const grandkid1 = {$name: "Grandkid1"};
        const grandkid2 = {$name: "Grandkid2"};
        const thing1 = {$name: "Thing1", $children: [grandkid1]};
        const thing2 = {$name: "Thing2", $children: [grandkid2]};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const pe = {
            locationSteps: [
                new LocationStep(DescendantOrSelfAxisSpecifier, AllNodeTest, [
                    new NestedPathExpressionPredicate(parsePathExpression("/Thing1")),
                ]),
                new LocationStep(ChildAxisSpecifier, new NamedNodeTest("Thing2"), [])],
        };
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, [thing2]);
    });

    it("should execute nested predicate: excludes", () => {
        const grandkid1 = {$name: "Grandkid1"};
        const grandkid2 = {$name: "Grandkid2"};
        const thing1 = {$name: "Thing1", $children: [grandkid1]};
        const thing2 = {$name: "Thing2", $children: [grandkid2]};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const pe = {
            locationSteps: [new LocationStep(DescendantOrSelfAxisSpecifier, AllNodeTest, [
                new NestedPathExpressionPredicate(parsePathExpression("/no/such/thing")),
            ])],
        };
        const result = evaluateExpression(tn, pe);
        assert.deepEqual(result, []);
    });

    it("should evaluate scalar: 0", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateScalar(tn, "/*[@value='nothotdog']");
        assert(result === undefined);
    });

    it("should evaluate scalarValue: 0", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateScalarValue(tn, "/*[@value='nothotdog']");
        assert(result === undefined);
    });

    it("should evaluate scalar: > 1", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateScalar(tn, "/*[@value='x']");
        assert(result === undefined);
    });

    it("should evaluate scalarValue: > 1", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateScalarValue(tn, "/*[@value='x']");
        assert(result === undefined);
    });

    it("should evaluate scalar: 1", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1,
            ],
        };
        const result = evaluateScalar(tn, "/*[@value='x']");
        assert(result.$value === "x");
    });

    it("should evaluate scalarValue: 1", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1,
            ],
        };
        const result = evaluateScalarValue(tn, "/*[@value='x']");
        assert(result === "x");
    });

});
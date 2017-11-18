import "mocha";

import * as assert from "power-assert";
import {
    ChildAxisSpecifier, DescendantAxisSpecifier,
    DescendantOrSelfAxisSpecifier, SelfAxisSpecifier,
} from "../../src/path/axisSpecifiers";
import {
    evaluateExpression, evaluateScalar, evaluateScalarValue,
    evaluateScalarValues,
} from "../../src/path/expressionEngine";
import { AllNodeTest, NamedNodeTest } from "../../src/path/nodeTests";
import { FailureResult, LocationStep, PathExpression, SuccessResult, unionOf } from "../../src/path/pathExpression";
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
            locationSteps: [new LocationStep(SelfAxisSpecifier, AllNodeTest, [{evaluate: () => true}])],
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
            locationSteps: [new LocationStep(SelfAxisSpecifier, AllNodeTest, [{evaluate: () => false}])],
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

    it("should evaluate scalarValues: 0", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateScalarValues(tn, "/*[@value='nothotdog']");
        assert.deepEqual(result, []);
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

    it("should evaluate scalarValues: > 1", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateScalarValues(tn, "/*[@value='x']");
        assert.deepEqual(result, ["x", "x"]);
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

    it("should evaluate scalar >1 with position", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateScalar(tn, "/*[@value='x'][1]");
        assert(result === thing1);
    });

    it("should handle false function predicate", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateExpression(tn, "/*[@value='x'][?veto]", {
            veto: () => false,
        }) as SuccessResult;
        assert(result.length === 0);
    });

    it("should handle true function predicate", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateExpression(tn, "/*[@value='x'][?veto]", {
            veto: () => true,
        }) as SuccessResult;
        assert(result.length === 2);
    });

    it("should handle computing function predicate", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateExpression(tn, "/*[@value='x'][?veto]", {
            veto: n => n.$name === "Thing1",
        }) as SuccessResult;
        assert.deepEqual(result, [ thing1 ]);
    });

    it("should handle missing function predicate", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateExpression(tn, "/*[@value='x'][?veto]") as FailureResult;
        assert(typeof result === "string");
        assert(result.includes("veto"));
    });

    it("should evaluate following sibling", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateScalar(tn, "/*[@value='x'][1]/following-sibling::Thing2");
        assert(result === thing2);
    });

    it("should evaluate preceding sibling", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const result = evaluateScalar(tn, "/*[@value='x'][2]/preceding-sibling::Thing1");
        assert(result === thing1);
    });

    it("should evaluate has a preceding sibling in predicate", () => {
        const thing1 = {$name: "Thing1", $value: "x"} as TreeNode;
        const thing2 = {$name: "Thing2", $value: "x"} as TreeNode;
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        thing1.$parent = thing2.$parent = tn;
        const result = evaluateScalar(tn, "/*[@value='x'][/preceding-sibling::*]");
        assert(!!result);
        assert(result === thing2);
    });

    it("should evaluate has named preceding sibling in predicate", () => {
        const thing1 = {$name: "Thing1", $value: "x"} as TreeNode;
        const thing2 = {$name: "Thing2", $value: "x"} as TreeNode;
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        thing1.$parent = thing2.$parent = tn;
        const result = evaluateScalar(tn, "/*[/preceding-sibling::Thing1]");
        assert(!!result);
        assert(result === thing2);
    });

    it("should evaluate ancestor", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const result = evaluateExpression(root, "//Thing1/ancestor::*");
        assert.deepEqual(result, [ root, kid ]);
    });

    it("should evaluate ancestor-or-self", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const result = evaluateExpression(root, "//Thing1/ancestor-or-self::*");
        assert.deepEqual(result, [ root, kid, grandkid ]);
    });

    it("should evaluate parent", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const result = evaluateExpression(root, "//Thing1/parent::*");
        assert.deepEqual(result, [ kid ]);
    });

    it("should evaluate parent with abbreviated syntax", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const result = evaluateExpression(root, "//Thing1/..");
        assert.deepEqual(result, [ kid ]);
    });

    it("should evaluate descendant", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const result = evaluateExpression(root, "/descendant::*");
        assert.deepEqual(result, [ kid, grandkid ]);
    });

});

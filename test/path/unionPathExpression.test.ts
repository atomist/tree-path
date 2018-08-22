import * as assert from "power-assert";

import { evaluateExpression } from "../../lib/path/expressionEngine";
import { unionOf } from "../../lib/path/pathExpression";
import { TreeNode } from "../../lib/TreeNode";

describe("union path expressions", () => {

    it("should evaluate simple", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const result = evaluateExpression(root, "//Thing2 | /Thing2/Thing1");
        assert.deepEqual(result, [kid, grandkid]);
    });

    it("should evaluate selective a and b", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const result = evaluateExpression(root, "//Thing2 | /Thing2/Thing1");
        assert.deepEqual(result, [kid, grandkid]);
    });

    it("should evaluate selective b and a", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const result = evaluateExpression(root, "/Thing2/Thing1 | //Thing2");
        assert.deepEqual(result, [grandkid, kid]);
    });

    it("should union with predicates", () => {
        const grandkid = {$name: "Thing1", $value: "y"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const parent = {$name: "newLevel", $children: [kid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                parent,
            ],
        };
        const result = evaluateExpression(root, "/newLevel//Thing1[@value='y'] | //Thing2[@value='x']");
        assert.deepEqual(result, [grandkid, kid]);
    });

    it("should evaluate x3", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const result = evaluateExpression(root, unionOf(["//Thing2", "/Thing2/Thing1", "//*"]));
        assert.deepEqual(result, [kid, grandkid, root]);
    });

});

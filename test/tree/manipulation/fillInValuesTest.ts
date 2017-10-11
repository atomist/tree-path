import "mocha";

import * as assert from "power-assert";
import { fillInEmptyNonTerminalValues } from "../../../src/tree/manipulation/enrichment";
import { TreeNode } from "../../../src/tree/TreeNode";

describe("fill in values", () => {

    it("should fill in value with 2 terminal scalar children, exposing terminal values", () => {
        const input = "AB";
        const a: TreeNode = {$name: "a", $value: "A", $offset: 0};
        const b: TreeNode = {$name: "b", $value: "B", $offset: 1};
        const parent: any = {$name: "foo", $children: [a, b], $offset: 0 };
        assert(!parent.$value);
        fillInEmptyNonTerminalValues(parent, input);
        assert(!!parent.$value);
        assert(parent.$value === input);
    });

    it("should enrich node with non-terminal child", () => {
        const input = "B";
        const grandkid: TreeNode = {$name: "grandkid", $value: "B", $offset: 0};
        const kid: TreeNode = {$name: "kid", $children: [grandkid], $offset: 0};
        const parent: any = {$name: "foo", $children: [kid], $offset: 0};

        assert(!parent.$value);
        fillInEmptyNonTerminalValues(parent, input);
        assert(!!parent.$value);
        assert(!!kid.$value);
        assert(parent.$value === input);
        assert(kid.$value === input);
    });
});

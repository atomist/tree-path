import "mocha";

import * as assert from "power-assert";
import { defineDynamicProperties } from "../../../src/tree/manipulation/enrichment";
import { TreeNode } from "../../../src/tree/TreeNode";

describe("dynamic property enrichment", () => {

    it("should enrich node with 2 terminal scalar children, exposing terminal values", () => {
        const a: TreeNode = {$name: "a", $value: "A"};
        const b: TreeNode = {$name: "b", $value: "B"};
        const parent: any = {$name: "foo", $children: [a, b]};
        assert(!parent.a);
        defineDynamicProperties(parent);
        assert(!!parent.a);
        assert(parent.a === a.$value);
    });

    it("should enrich node with non-terminal child", () => {
        const grandkid: TreeNode = {$name: "grandkid", $value: "B"};
        const kid: TreeNode = {$name: "kid", $children: [grandkid]};
        const parent: any = {$name: "foo", $children: [kid]};

        assert(!parent.kid);
        defineDynamicProperties(parent);
        assert(!!parent.kid);
        assert(parent.kid === kid);
        assert(parent.kid.grandkid === "B");
    });
});

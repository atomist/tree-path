
import { DefaultTreeNodeReplacer, TreeNode, treeNodeReplacer } from "../../lib/TreeNode";

import * as assert from "power-assert";
import { fail } from "power-assert";

describe("node JSON stringification", () => {

    it("should stringify a node without failure", () => {
        const thing1 = {$name: "Thing1", $value: "x"} as TreeNode;
        const thing2 = {$name: "Thing2", $value: "x"} as TreeNode;
        const tn: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        thing1.$parent = thing2.$parent = tn;
        const s = JSON.stringify(tn, DefaultTreeNodeReplacer);
        assert(!!s);
        assert(s.includes("Thing1"));
        assert(s.includes("Thing2"));
    });

    it("should stringify a specifically circular node without failure", () => {
        const thing1 = {$name: "Thing1", $value: "x"} as any;
        const thing2 = {$name: "Thing2", $value: "x"} as any;
        const tn: any = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        thing1.$parent = thing2.$parent = tn;
        thing1.evenMoreCircular = tn;
        const s = JSON.stringify(tn, treeNodeReplacer());
        assert(s.includes("Thing1"));
        assert(s.includes("Thing2"));
    });

    it("should stringify a specifically circular node with failure", () => {
        const thing1 = {$name: "Thing1", $value: "x"} as any;
        const thing2 = {$name: "Thing2", $value: "x"} as TreeNode;
        const tn: any = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        thing1.$parent = thing2.$parent = tn;
        thing1.evenMoreCircular = thing1;
        try {
            JSON.stringify(tn, treeNodeReplacer("evenMoreCircular"));
            fail("Should have failed with circularity error");
        } catch (e) {
            // Ok
        }
    });

});

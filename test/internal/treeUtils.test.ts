
import * as assert from "power-assert";

import {
    parentOf,
    pathDownTo,
} from "../../lib/internal/treeUtils";
import { TreeNode } from "../../lib/TreeNode";

describe("treeUtils", () => {

    it("should find path to node directly under root", () => {
        const thing1 = {$name: "Thing1", $value: "x"};
        const thing2 = {$name: "Thing2", $value: "x"};
        const root: TreeNode = {
            $name: "foo", $children: [
                thing1, thing2,
            ],
        };
        const path = pathDownTo(thing2, root);
        assert.deepEqual(path, [root, thing2]);
    });

    it("should find path to nested node", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        const path = pathDownTo(grandkid, root);
        assert(path.length === 3);
        assert.deepEqual(path, [root, kid, grandkid]);
    });

    it("should find parent of nested node", () => {
        const grandkid = {$name: "Thing1", $value: "x"};
        const kid = {$name: "Thing2", $value: "x", $children: [grandkid]};
        const root: TreeNode = {
            $name: "foo", $children: [
                kid,
            ],
        };
        assert.equal(kid, parentOf(grandkid, root));
    });

});

import * as assert from "power-assert";
import { stripPositionalInfo } from "../../src";
import { TreeNode } from "../../src/TreeNode";
import { TreeVisitor, visit } from "../../src/visitor";

describe("canonicalize", () => {

    describe("stipPositionalInfo", () => {

        it("2 terminal scalar children, exposing terminal values", () => {
            const a: TreeNode = {$name: "a", $value: "A", $offset: 0};
            const b: TreeNode = {$name: "b", $value: "B", $offset: 1};
            const parent: any = {$name: "foo", $children: [a, b], $offset: 0};
            stripPositionalInfo(parent);
            visit(parent, CheckMinimalVisitor);

        });

        it("non-terminal child", () => {
            const grandkid: TreeNode = {$name: "grandkid", $value: "B", $offset: 0};
            const kid: TreeNode = {$name: "kid", $children: [grandkid], $offset: 0};
            const parent: any = {$name: "foo", $children: [kid], $offset: 0};
            stripPositionalInfo(parent);
            assert(!parent.$value);
            visit(parent, CheckMinimalVisitor);
        });

    });
});

const CheckMinimalVisitor: TreeVisitor = tn => {
    for (const key of Object.getOwnPropertyNames(tn)) {
        assert(["$name", "$children", "$value"].includes(key) || tn[key] === undefined,
            `Key [${key}] not permitted after clean: value is [${tn[key]}]`);
    }
    return true;
};

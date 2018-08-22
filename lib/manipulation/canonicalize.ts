import { TreeNode } from "../TreeNode";
import { visit } from "../visitor";

/**
 * Strip positional info so we can compare ASTs
 * @param {TreeNode} tn
 * @return {TreeNode}
 */
export function stripPositionalInfo(tn: TreeNode): TreeNode {
    visit(tn, n => {
        for (const key of Object.getOwnPropertyNames(n)) {
            if (!["$name", "$children", "$value"].includes(key)) {
                n[key] = undefined;
            }
        }
        return true;
    });
    return tn;
}

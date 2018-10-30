import { TreeNode } from "./TreeNode";

/**
 * Function that can visit a tree node.
 * @return whether to visit the node's children, if any
 */
export type TreeVisitor = (n: TreeNode) => boolean;

/**
 * Visit the node, returning whether to continue
 * @param {TreeNode} tn node to visit
 * @param v visitor
 * @return {boolean} whether to visit the node's children, if any
 */
export function visit(tn: TreeNode, v: TreeVisitor) {
    if (v(tn)) {
        (tn.$children || []).forEach(n => visit(n, v));
    }
}

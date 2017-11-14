
import { TreeNode } from "../TreeNode";

/**
 * Return the path from the root down to the target node.
 * Path includes root and target node.
 * @param {TreeNode} from start node
 * @param seen: Nodes we've already seen in this path
 * @param {TreeNode} node
 * @return {TreeNode[]}
 */
export function pathDownTo(node: TreeNode, from: TreeNode, seen: TreeNode[] = []): TreeNode[] | undefined {
    if (from === node) {
        return seen.concat(from);
    }
    if (!from.$children) {
        return undefined;
    }
    if (from.$children.includes(node)) {
        return seen.concat([ from, node ]);
    }
    for (const kid of from.$children) {
        const path = pathDownTo(node, kid, seen.concat(from));
        if (path) {
            return path;
        }
    }
    return undefined;
}

/**
 * Find the parent of the target node.
 * @param {TreeNode} root
 * @param {TreeNode} node
 * @return {TreeNode}
 */
export function parentOf(node: TreeNode, root: TreeNode): TreeNode {
    if (node.$parent) {
        return node.$parent;
    }
    const path = pathDownTo(node, root);
    return !!path && path.length >= 2 ? path[path.length - 2] : undefined;
}

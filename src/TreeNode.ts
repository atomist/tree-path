/**
 * Core abstraction supporting path expressions.
 * Represents a tree node. Property and function names begin with $
 * to ensure they're out of band if we mix in user data.
 * TreeNode instances may be parsed from text input, in which case
 * they will have offsets within the input.
 * NB: If you need to JSON stringify TreeNode instances,
 * use the treeNodeReplacer function to avoid circularity errors.
 */

import { isNumber } from "util";

export interface TreeNode {

    readonly $name: string;

    /**
     * Used to evaluate ancestor and other such predicates efficiently.
     * If not available, backup resolution will attempt to navigate from
     * document root if available.
     */
    $parent?: TreeNode;

    /**
     * Children of the node if it's a non-terminal
     */
    $children?: TreeNode[];

    /**
     * Value. If this is a terminal node, its own value, which will always be available.
     * If it's a non-terminal, the value is not guaranteed to be available.
     * If it is, it will be the text from the offset to the end of the
     * last token. This preserves white space between non-terminals.
     */
    $value?: string;

    /** Offset from 0 in the file, if available */
    readonly $offset?: number;

}

export function isTerminal(tn: TreeNode): boolean {
    return tn.$value && !(tn.$children && tn.$children.length > 0);
}

/**
 * Replacer to safely stringify nodes, avoiding circularity errors
 * @params keep: Property names to include. Allows us to include
 * node-specific data. By default includes all array elements and
 * name, children, value and offset.
 * @constructor
 */
export function treeNodeReplacer(...keep: string[]): (key: string, value: any) => any {
    return (key, value) => {
        if (key.match(/[0-9]+/) || ["", "$name", "$children", "$value", "$offset"].concat(keep).includes(key)) {
            return value;
        }
        return undefined;
    };
}

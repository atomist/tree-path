import * as _ from "lodash";

import { parentOf, pathDownTo } from "../internal/treeUtils";
import { TreeNode } from "../TreeNode";
import { AxisSpecifier } from "./pathExpression";

export const ChildAxisSpecifier: AxisSpecifier = {

    type: "child",

    follow(tn: TreeNode) {
        return tn.$children || [];
    },
};

export const DescendantAxisSpecifier: AxisSpecifier = {

    type: "descendant",

    follow(tn: TreeNode) {
        return allDescendants(tn);
    },
};

export const DescendantOrSelfAxisSpecifier: AxisSpecifier = {

    type: "descendant-or-self",

    follow(tn: TreeNode) {
        return allDescendants(tn).concat(tn);
    },
};

export const SelfAxisSpecifier: AxisSpecifier = {

    type: "self",

    follow(tn: TreeNode) {
        return [tn];
    },
};

export function allDescendants(tn: TreeNode): TreeNode[] {
    if (!tn.$children) {
        return [];
    }
    return (tn.$children || []).concat(
        _.flatMap(tn.$children.map(allDescendants)));
}

export const AncestorAxisSpecifier: AxisSpecifier = {

    type: "ancestor",

    follow(tn: TreeNode, root: TreeNode): TreeNode[] {
        const ancestorsAndThis = pathDownTo(tn, root);
        return !!ancestorsAndThis ? _.dropRight(ancestorsAndThis, 1) : [];
    },
};

export const AncestorOrSelfAxisSpecifier: AxisSpecifier = {

    type: "ancestor-or-self",

    follow(tn: TreeNode, root: TreeNode): TreeNode[] {
        const ancestorsAndThis = pathDownTo(tn, root);
        return !!ancestorsAndThis ? ancestorsAndThis : [];
    },
};

export const ParentAxisSpecifier: AxisSpecifier = {

    type: "parent",

    follow(tn: TreeNode, root: TreeNode): TreeNode[] {
        const parent = parentOf(tn, root);
        return !!parent ? [parent] : [];
    },
};

export const FollowingSiblingAxisSpecifier: AxisSpecifier = {

    type: "following-sibling",

    follow(tn: TreeNode, root: TreeNode): TreeNode[] {
        const parent = parentOf(tn, root);
        if (!parent) {
            return [];
        }
        const kids = parent.$children;
        const index = kids.indexOf(tn);
        return (index >= 0 && kids.length > index + 1) ?
            [kids[index + 1]] :
            [];
    },
};

export const PrecedingSiblingAxisSpecifier: AxisSpecifier = {

    type: "preceding-sibling",

    follow(tn: TreeNode, root: TreeNode): TreeNode[] {
        const parent = parentOf(tn, root);
        if (!parent) {
            return [];
        }
        const kids = parent.$children;
        const index = kids.indexOf(tn);
        return (index > 0) ?
            [kids[index - 1]] :
            [];
    },
};

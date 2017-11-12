import * as _ from "lodash";

import { parentOf } from "../internal/treeUtils";
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
        _.flatMap(tn.$children.map(kid => allDescendants(kid))));
}

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

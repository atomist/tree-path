/*
 * Copyright © 2018 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export {
    stripPositionalInfo,
} from "./lib/manipulation/canonicalize";

export {
    defineDynamicProperties,
    fillInEmptyNonTerminalValues,
} from "./lib/manipulation/enrichment";

export {
    SelfAxisSpecifier,
} from "./lib/path/axisSpecifiers";

export {
    evaluateExpression,
    evaluateScalar,
    evaluateScalarValue,
    evaluateScalarValues,
    FunctionRegistry,
} from "./lib/path/expressionEngine";

export {
    AllNodeTest,
    isNamedNodeTest,
    NamedNodeTest,
} from "./lib/path/nodeTests";

export {
    isSuccessResult,
    isUnionPathExpression,
    LocationStep,
    NodeTest,
    PathExpression,
    stringify,
    UnionPathExpression,
} from "./lib/path/pathExpression";

export {
    parsePathExpression,
} from "./lib/path/pathExpressionParser";

export {
    toPathExpression,
} from "./lib/path/utils";

export {
    TreeNode,
} from "./lib/TreeNode";

export {
    TreeVisitor,
    visit,
} from "./lib/visitor";

export * from "./lib/manipulation/canonicalize";

import { Interval } from 'ohm-js';

export type SourceLocation = {
    interval: Interval;
    // made it a separate type for future addition of file name
};

export type AstModule = {
    kind: 'module';
    items: AstModuleItem[];
    id: number;
    source: SourceLocation;
};

export type AstModuleItem = AstHouse | AstStatementConst | AstFunction;

export type AstHouse = {
    kind: 'house';
    name: AstId;
    items: AstHouseItem[];
    id: number;
    source: SourceLocation;
};

export type AstHouseItem =
    | AstGlobalStat
    | AstPlayerStat
    | AstHandler
    | AstFunction;

export type AstGlobalStat = {
    kind: 'globalStat';
    name: AstId;
    type: AstId;
    id: number;
    source: SourceLocation;
};

export type AstPlayerStat = {
    kind: 'playerStat';
    name: AstId;
    type: AstId;
    id: number;
    source: SourceLocation;
};

export type AstHandler = {
    kind: 'handler';
    event: AstId;
    statements: AstStatement[];
    id: number;
    source: SourceLocation;
};

export type AstParameter = {
    kind: 'parameter';
    name: AstId;
    type: AstId;
    id: number;
    source: SourceLocation;
};

export type AstFunction = {
    kind: 'function';
    name: AstId;
    parameters: AstParameter[];
    returnType: AstId;
    statements: AstStatement[];
    id: number;
    source: SourceLocation;
};

export type AstStatement =
    | AstStatementAssign
    | AstStatementAugmentedAssign
    | AstStatementLet
    | AstStatementConst
    | AstStatementExpression
    | AstStatementIf
    | AstStatementReturn;

export type AstStatementAssign = {
    kind: 'statementAssign';
    lvalue: AstExpression;
    value: AstExpression;
    id: number;
    source: SourceLocation;
};

export type AstStatementLet = {
    kind: 'statementLet';
    name: AstId;
    type: AstId;
    value: AstExpression;
    id: number;
    source: SourceLocation;
};

export type AstStatementConst = {
    kind: 'statementConst';
    name: AstId;
    type: AstId;
    value: AstExpression;
    id: number;
    source: SourceLocation;
};

export type AstStatementExpression = {
    kind: 'statementExpression';
    expression: AstExpression;
    id: number;
    source: SourceLocation;
};

export type AstStatementIf = {
    kind: 'statementIf';
    condition: AstExpression;
    then: AstStatement[];
    else?: AstStatement[];
    id: number;
    source: SourceLocation;
};

export type AstStatementReturn = {
    kind: 'statementReturn';
    expression?: AstExpression;
    id: number;
    source: SourceLocation;
};

export type AstExpression =
    | AstExpressionField
    | AstExpressionBinary
    | AstExpressionUnary
    | AstIntegerLiteral
    | AstBooleanLiteral
    | AstExpressionId
    | AstExpressionCall;

export type AstExpressionField = {
    kind: 'expressionField';
    struct: AstExpression;
    field: AstId;
    id: number;
    source: SourceLocation;
};

export type AstBinaryOp =
    | '+'
    | '-'
    | '*'
    | '/'
    | '=='
    | '!='
    | '<'
    | '<='
    | '>'
    | '>='
    | '&&'
    | '||';

export type AstExpressionBinary = {
    kind: 'expressionBinary';
    op: AstBinaryOp;
    left: AstExpression;
    right: AstExpression;
    id: number;
    source: SourceLocation;
};

export type AstUnaryOp = '-' | '!';

export type AstExpressionUnary = {
    kind: 'expressionUnary';
    op: AstUnaryOp;
    operand: AstExpression;
    id: number;
    source: SourceLocation;
};

export type AstAugmentedAssignOp = '+' | '-' | '*' | '/';

export type AstStatementAugmentedAssign = {
    kind: 'statementAugmentedAssign';
    lvalue: AstExpression;
    op: AstAugmentedAssignOp;
    value: AstExpression;
    id: number;
    source: SourceLocation;
};

export type AstIntegerLiteral = {
    kind: 'integerLiteral';
    value: string;
    id: number;
    source: SourceLocation;
};

export type AstBooleanLiteral = {
    kind: 'booleanLiteral';
    value: boolean;
    id: number;
    source: SourceLocation;
};

export type AstExpressionId = {
    kind: 'expressionId';
    name: AstId;
    id: number;
    source: SourceLocation;
};

export type AstExpressionCall = {
    kind: 'expressionCall';
    function: AstId;
    arguments: AstExpression[];
    id: number;
    source: SourceLocation;
};

export type AstId = {
    kind: 'id';
    name: string;
    id: number;
    source: SourceLocation;
};

export type AstNode =
    | AstModule
    | AstModuleItem
    | AstHouseItem
    | AstStatement
    | AstExpression
    | AstId
    | AstParameter;

let nextId = 1;

const astNodes = new Map<number, AstNode>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, K extends keyof any> = T extends any
    ? Omit<T, K>
    : never;

export function createAstNode(src: DistributiveOmit<AstNode, 'id'>): AstNode {
    const node = Object.freeze(Object.assign({ id: nextId++ }, src));
    astNodes.set(node.id, node);
    return node;
}

export function cloneAstNode<T extends AstNode>(src: T): T {
    const node = { ...src, id: nextId++ };
    astNodes.set(node.id, node);
    return node;
}

export function resetNodeId() {
    nextId = 1;
    astNodes.clear();
}

export function getAstNodeById(id: number) {
    return astNodes.get(id);
}

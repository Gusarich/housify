export type AstModule = {
    kind: 'module';
    items: AstModuleItem[];
    id: number;
};

export type AstModuleItem = AstHouse;

export type AstHouse = {
    kind: 'house';
    name: AstId;
    items: AstHouseItem[];
    id: number;
};

export type AstHouseItem = AstGlobalStat | AstPlayerStat | AstHandler;

export type AstGlobalStat = {
    kind: 'globalStat';
    name: AstId;
    type: AstId;
    defaultValue?: AstExpression;
    id: number;
};

export type AstPlayerStat = {
    kind: 'playerStat';
    name: AstId;
    type: AstId;
    defaultValue?: AstExpression;
    id: number;
};

export type AstHandler = {
    kind: 'handler';
    event: AstId;
    statements: AstStatement[];
    id: number;
};

export type AstStatement =
    | AstStatementAssign
    | AstStatementLet
    | AstStatementExpression
    | AstStatementIf;

export type AstStatementAssign = {
    kind: 'statementAssign';
    lvalue: AstExpression;
    value: AstExpression;
    id: number;
};

export type AstStatementLet = {
    kind: 'statementLet';
    name: AstId;
    type: AstId;
    value: AstExpression;
    id: number;
};

export type AstStatementExpression = {
    kind: 'statementExpression';
    expression: AstExpression;
    id: number;
};

export type AstStatementIf = {
    kind: 'statementIf';
    condition: AstExpression;
    then: AstStatement[];
    else?: AstStatement[];
    id: number;
};

export type AstExpression =
    | AstExpressionBinary
    | AstExpressionUnary
    | AstIntegerLiteral
    | AstExpressionId;

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
};

export type AstUnaryOp = '+' | '-' | '!';

export type AstExpressionUnary = {
    kind: 'expressionUnary';
    op: AstUnaryOp;
    operand: AstExpression;
    id: number;
};

export type AstIntegerLiteral = {
    kind: 'integerLiteral';
    value: string;
    id: number;
};

export type AstExpressionId = {
    kind: 'expressionId';
    name: AstId;
    id: number;
};

export type AstId = {
    kind: 'id';
    name: string;
    id: number;
};

export type AstNode =
    | AstModule
    | AstModuleItem
    | AstHouseItem
    | AstStatement
    | AstExpression
    | AstId;

let nextId = 1;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, K extends keyof any> = T extends any
    ? Omit<T, K>
    : never;

export function createAstNode(src: DistributiveOmit<AstNode, 'id'>): AstNode {
    return Object.freeze(Object.assign({ id: nextId++ }, src));
}

export function cloneAstNode<T extends AstNode>(src: T): T {
    return { ...src, id: nextId++ };
}

export function resetNodeId() {
    nextId = 1;
}

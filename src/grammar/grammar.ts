import { IterationNode } from 'ohm-js';
import {
    AstBinaryOp,
    AstModule,
    AstNode,
    AstUnaryOp,
    createAstNode,
} from './ast';
import grammar from './grammar.ohm-bundle';

function unwrapOptNode(node: IterationNode): IterationNode | undefined {
    return node.children.length === 0 ? undefined : node.children[0];
}

const semantics = grammar.createSemantics();

semantics.addOperation<AstNode>('astOfModule', {
    Module(items) {
        return createAstNode({
            kind: 'module',
            items: items.children.map((item) => item.astOfModuleItem()),
        });
    },
});

semantics.addOperation<AstNode>('astOfModuleItem', {
    ModuleItem(arg0) {
        return arg0.astOfModuleItem();
    },
    House(_arg0, id, _arg2, items, _arg4) {
        return createAstNode({
            kind: 'house',
            name: id.astOfExpression(),
            items: items.children.map((item) => item.astOfHouseItem()),
        });
    },
});

semantics.addOperation<AstNode>('astOfHouseItem', {
    HouseItem(arg0) {
        return arg0.astOfHouseItem();
    },
    GlobalStat(_arg0, name, _arg2, type, _arg4, defaultValueOpt, _arg6) {
        return createAstNode({
            kind: 'globalStat',
            name: name.astOfExpression(),
            type: type.astOfType(),
            defaultValue: unwrapOptNode(defaultValueOpt)?.astOfExpression(),
        });
    },
    PlayerStat(_arg0, name, _arg2, type, _arg4, defaultValueOpt, _arg6) {
        return createAstNode({
            kind: 'playerStat',
            name: name.astOfExpression(),
            type: type.astOfType(),
            defaultValue: unwrapOptNode(defaultValueOpt)?.astOfExpression(),
        });
    },
    Handler(_arg0, event, _arg2, statements, _arg4) {
        return createAstNode({
            kind: 'handler',
            event: event.astOfExpression(),
            statements: statements.children.map((statement) =>
                statement.astOfStatement(),
            ),
        });
    },
});

semantics.addOperation<AstNode>('astOfType', {
    Type(arg0) {
        return arg0.astOfType();
    },
    Type_regular(arg0) {
        return arg0.astOfExpression();
    },
});

semantics.addOperation<AstNode>('astOfStatement', {
    Statement(arg0) {
        return arg0.astOfStatement();
    },
    StatementAssign(lvalue, _arg1, expression, _arg3) {
        return createAstNode({
            kind: 'statementAssign',
            lvalue: lvalue.astOfExpression(),
            value: expression.astOfExpression(),
        });
    },
    StatementLet(_arg0, name, _arg2, type, _arg4, expression, _arg6) {
        return createAstNode({
            kind: 'statementLet',
            name: name.astOfExpression(),
            type: type.astOfType(),
            value: expression.astOfExpression(),
        });
    },
    StatementExpression(expression, _arg1) {
        return createAstNode({
            kind: 'statementExpression',
            expression: expression.astOfExpression(),
        });
    },
    StatementIf(arg0) {
        return arg0.astOfStatement();
    },
    StatementIf_noElse(_arg0, condition, _arg2, statements, _arg4) {
        return createAstNode({
            kind: 'statementIf',
            condition: condition.astOfExpression(),
            then: statements.children.map((statement) =>
                statement.astOfStatement(),
            ),
        });
    },
    StatementIf_withElse(
        _arg0,
        condition,
        _arg2,
        statements,
        _arg4,
        _arg5,
        _arg6,
        elseStatements,
        _arg8,
    ) {
        return createAstNode({
            kind: 'statementIf',
            condition: condition.astOfExpression(),
            then: statements.children.map((statement) =>
                statement.astOfStatement(),
            ),
            else: elseStatements.children.map((statement) =>
                statement.astOfStatement(),
            ),
        });
    },
    StatementIf_withElseIf(
        _arg0,
        condition,
        _arg2,
        statements,
        _arg4,
        _arg5,
        elseif,
    ) {
        return createAstNode({
            kind: 'statementIf',
            condition: condition.astOfExpression(),
            then: statements.children.map((statement) =>
                statement.astOfStatement(),
            ),
            else: [elseif.astOfStatement()],
        });
    },
});

semantics.addOperation<AstNode>('astOfExpression', {
    Expression(arg0) {
        return arg0.astOfExpression();
    },
    ExpressionBinary(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: op.astOfBinaryOp(),
            left: left.astOfExpression(),
            right: right.astOfExpression(),
        });
    },
    ExpressionUnary(op, operand) {
        return createAstNode({
            kind: 'expressionUnary',
            op: op.astOfUnaryOp(),
            operand: operand.astOfExpression(),
        });
    },
    ExpressionField(path, _arg1, id) {
        return createAstNode({
            kind: 'expressionField',
            path: path.astOfExpression(),
            field: id.astOfExpression(),
        });
    },
    ExpressionLiteral(arg0) {
        return arg0.astOfExpression();
    },
    ExpressionId(arg0) {
        return arg0.astOfExpression();
    },
    id(_arg0, _arg1) {
        return createAstNode({
            kind: 'id',
            name: this.sourceString,
        });
    },
    integerLiteral(_arg0) {
        return createAstNode({
            kind: 'expressionLiteral',
            value: this.sourceString,
        });
    },
    ExpressionParens(_arg0, expression, _arg2) {
        return expression.astOfExpression();
    },
});

semantics.addOperation<AstBinaryOp>('astOfBinaryOp', {
    binaryOp(op) {
        switch (op.sourceString) {
            case '+':
            case '-':
            case '*':
            case '/':
                return op.sourceString as AstBinaryOp;
            default:
                throw new Error(
                    `Unexpected binary operator: ${op.sourceString}`,
                );
        }
    },
});

semantics.addOperation<AstUnaryOp>('astOfUnaryOp', {
    unaryOp(op) {
        switch (op.sourceString) {
            case '+':
            case '-':
            case '!':
                return op.sourceString as AstUnaryOp;
            default:
                throw new Error(
                    `Unexpected unary operator: ${op.sourceString}`,
                );
        }
    },
});

export function parse(src: string): AstModule {
    const matchResult = grammar.match(src);
    if (matchResult.failed()) {
        throw Error(matchResult.message);
    }
    return semantics(matchResult).astOfModule();
}

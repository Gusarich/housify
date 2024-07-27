import { InternalError, ParseError } from '../errors';
import {
    AstAugmentedAssignOp,
    AstModule,
    AstNode,
    createAstNode,
    SourceLocation,
} from './ast';
import grammar from './grammar.ohm-bundle';
import { Node } from 'ohm-js';

const semantics = grammar.createSemantics();

function getSourceLocation(s: Node): SourceLocation {
    return {
        interval: s.source,
    };
}

semantics.addOperation<AstNode>('astOfModule', {
    Module(items) {
        return createAstNode({
            kind: 'module',
            items: items.children.map((item) => item.astOfModuleItem()),
            source: getSourceLocation(this),
        });
    },
});

semantics.addOperation<AstNode>('astOfModuleItem', {
    ModuleItem(arg0) {
        return arg0.astOfModuleItem();
    },
    House(_arg0, id, _arg2, itemsTop, items, _arg4) {
        return createAstNode({
            kind: 'house',
            name: id.astOfExpression(),
            items: itemsTop.children
                .map((item) => item.astOfHouseItem())
                .concat(items.children.map((item) => item.astOfHouseItem())),
            source: getSourceLocation(this),
        });
    },
    StatementConst(_arg0, name, _arg2, type, _arg4, expression, _arg6) {
        return createAstNode({
            kind: 'statementConst',
            name: name.astOfExpression(),
            type: type.astOfType(),
            value: expression.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
});

semantics.addOperation<AstNode>('astOfHouseItem', {
    HouseItem(arg0) {
        return arg0.astOfHouseItem();
    },
    HouseItemTop(arg0) {
        return arg0.astOfHouseItem();
    },
    GlobalStat(_arg0, name, _arg2, type, _arg4) {
        return createAstNode({
            kind: 'globalStat',
            name: name.astOfExpression(),
            type: type.astOfType(),
            source: getSourceLocation(this),
        });
    },
    PlayerStat(_arg0, name, _arg2, type, _arg4) {
        return createAstNode({
            kind: 'playerStat',
            name: name.astOfExpression(),
            type: type.astOfType(),
            source: getSourceLocation(this),
        });
    },
    Handler(_arg0, event, _arg4, statements, _arg6) {
        return createAstNode({
            kind: 'handler',
            event: event.astOfExpression(),
            statements: statements.children.map((statement) =>
                statement.astOfStatement(),
            ),
            source: getSourceLocation(this),
        });
    },
});

semantics.addOperation<AstNode>('astOfParameter', {
    Parameter(arg0, _arg1, arg2) {
        return createAstNode({
            kind: 'parameter',
            name: arg0.astOfExpression(),
            type: arg2.astOfType(),
            source: getSourceLocation(this),
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
    StatementAssign(lvalue, operator, expression, _arg3) {
        if (operator.sourceString === '=') {
            return createAstNode({
                kind: 'statementAssign',
                lvalue: lvalue.astOfExpression(),
                value: expression.astOfExpression(),
                source: getSourceLocation(this),
            });
        } else {
            let op: AstAugmentedAssignOp;
            switch (operator.sourceString) {
                case '+=':
                    op = '+';
                    break;
                case '-=':
                    op = '-';
                    break;
                case '*=':
                    op = '*';
                    break;
                case '/=':
                    op = '/';
                    break;
                default:
                    // should never happen
                    throw new InternalError(
                        `Unknown operator`,
                        getSourceLocation(this),
                    );
            }
            return createAstNode({
                kind: 'statementAugmentedAssign',
                lvalue: lvalue.astOfExpression(),
                op,
                value: expression.astOfExpression(),
                source: getSourceLocation(this),
            });
        }
    },
    StatementLet(_arg0, name, _arg2, type, _arg4, expression, _arg6) {
        return createAstNode({
            kind: 'statementLet',
            name: name.astOfExpression(),
            type: type.astOfType(),
            value: expression.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    StatementConst(_arg0, name, _arg2, type, _arg4, expression, _arg6) {
        return createAstNode({
            kind: 'statementConst',
            name: name.astOfExpression(),
            type: type.astOfType(),
            value: expression.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    StatementExpression(expression, _arg1) {
        return createAstNode({
            kind: 'statementExpression',
            expression: expression.astOfExpression(),
            source: getSourceLocation(this),
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
            source: getSourceLocation(this),
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
            source: getSourceLocation(this),
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
            source: getSourceLocation(this),
        });
    },
});

semantics.addOperation<AstNode>('astOfExpression', {
    Expression(arg0) {
        return arg0.astOfExpression();
    },
    ExpressionAdd_add(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '+',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionAdd_sub(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '-',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionAnd_and(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '&&',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionCompare_gt(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '>',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionCompare_gte(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '>=',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionCompare_lt(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '<',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionCompare_lte(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '<=',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionEquality_eq(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '==',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionEquality_not(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '!=',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionMul_div(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '/',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionMul_mul(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '*',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionOr_or(left, op, right) {
        return createAstNode({
            kind: 'expressionBinary',
            op: '||',
            left: left.astOfExpression(),
            right: right.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionUnary_minus(op, operand) {
        return createAstNode({
            kind: 'expressionUnary',
            op: '-',
            operand: operand.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionUnary_not(op, operand) {
        return createAstNode({
            kind: 'expressionUnary',
            op: '!',
            operand: operand.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionLiteral(arg0) {
        return arg0.astOfExpression();
    },
    ExpressionId(arg0) {
        return createAstNode({
            kind: 'expressionId',
            name: arg0.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    ExpressionField(struct, _arg1, field) {
        return createAstNode({
            kind: 'expressionField',
            struct: struct.astOfExpression(),
            field: field.astOfExpression(),
            source: getSourceLocation(this),
        });
    },
    id(_arg0, _arg1) {
        return createAstNode({
            kind: 'id',
            name: this.sourceString,
            source: getSourceLocation(this),
        });
    },
    integerLiteral(_arg0) {
        return createAstNode({
            kind: 'integerLiteral',
            value: this.sourceString,
            source: getSourceLocation(this),
        });
    },
    booleanLiteral(_arg0) {
        return createAstNode({
            kind: 'booleanLiteral',
            value: this.sourceString === 'true',
            source: getSourceLocation(this),
        });
    },
    ExpressionParens(_arg0, expression, _arg2) {
        return expression.astOfExpression();
    },
});

export function parse(src: string): AstModule {
    const matchResult = grammar.match(src);
    if (matchResult.failed()) {
        throw new ParseError(matchResult.message ?? '', {
            interval: matchResult.getInterval(),
        });
    }
    return semantics(matchResult).astOfModule();
}

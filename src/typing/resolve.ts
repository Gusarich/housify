import { AstExpression, AstStatement } from '../grammar/ast';
import { StatementContext } from './context';
import { Type } from './type';

export function resolveExpression(
    expression: AstExpression,
    sctx: StatementContext,
): Type {
    switch (expression.kind) {
        case 'expressionId': {
            if (!sctx.hasVariable(expression.name.name)) {
                throw new Error(`Variable '${expression.name.name}' not found`);
            }
            return sctx.getVariable(expression.name.name)!;
        }
        case 'integerLiteral':
            return 'int';
        case 'expressionBinary': {
            const left = resolveExpression(expression.left, sctx);
            const right = resolveExpression(expression.right, sctx);
            if (left !== 'int' || right !== 'int') {
                throw new Error('Binary operands must be integers');
            }
            return 'int';
        }
        case 'expressionUnary': {
            const operand = resolveExpression(expression.operand, sctx);
            if (operand !== 'int') {
                throw new Error('Unary operand must be an integer');
            }
            return 'int';
        }
        case 'expressionField': {
            // const path = resolveExpression(expression.path, sctx);
            // TODO: Implement field resolution
            return 'int';
        }
    }
}

export function resolveStatement(
    statement: AstStatement,
    sctx: StatementContext,
) {
    switch (statement.kind) {
        case 'statementAssign': {
            if (
                statement.lvalue.kind !== 'expressionId' &&
                statement.lvalue.kind !== 'expressionField'
            ) {
                throw new Error(
                    `'${statement.lvalue.kind}' cannot be assigned`,
                );
            }
            // TODO
            break;
        }
        case 'statementIf': {
            const conditionType = resolveExpression(statement.condition, sctx);
            if (conditionType !== 'int') {
                throw new Error('If condition must be an integer');
            }
            for (const thenStatement of statement.then) {
                resolveStatement(thenStatement, sctx);
            }
            if (statement.else) {
                for (const elseStatement of statement.else) {
                    resolveStatement(elseStatement, sctx);
                }
            }
            break;
        }
    }
}

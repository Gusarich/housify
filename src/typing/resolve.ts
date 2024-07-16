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
            return { name: 'int' };
        case 'expressionBinary': {
            const left = resolveExpression(expression.left, sctx);
            const right = resolveExpression(expression.right, sctx);
            switch (expression.op) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '<':
                case '<=':
                case '>':
                case '>=':
                    if (left.name !== 'int' || right.name !== 'int') {
                        throw new Error('Operands must be integers');
                    }
                    return { name: 'int' };
                case '==':
                case '!=':
                    if (left.name !== right.name) {
                        throw new Error('Operands must be of the same type');
                    }
                    return { name: 'bool' };
                case '&&':
                case '||':
                    if (left.name !== 'bool' || right.name !== 'bool') {
                        throw new Error('Operands must be booleans');
                    }
                    return { name: 'bool' };
            }
        }
        case 'expressionUnary': {
            const operand = resolveExpression(expression.operand, sctx);
            switch (expression.op) {
                case '+':
                case '-':
                    if (operand.name !== 'int') {
                        throw new Error('Operand must be an integer');
                    }
                    return { name: 'int' };
                case '!':
                    if (operand.name !== 'bool') {
                        throw new Error('Operand must be a boolean');
                    }
                    return { name: 'bool' };
            }
        }
        case 'expressionField': {
            const struct = resolveExpression(expression.struct, sctx);
            if (struct.name !== 'struct') {
                throw new Error('Expression must be a struct');
            }
            const field = struct.fields.find(
                (field) => field.name === expression.field.name,
            );
            if (!field) {
                throw new Error(`Field '${expression.field.name}' not found`);
            }
            return field.type;
        }
    }
}

export function resolveStatement(
    statement: AstStatement,
    sctx: StatementContext,
) {
    switch (statement.kind) {
        case 'statementAssign': {
            if (statement.lvalue.kind !== 'expressionId') {
                throw new Error(
                    `'${statement.lvalue.kind}' cannot be assigned`,
                );
            }
            const variableType = sctx.getVariable(statement.lvalue.name.name);
            if (!variableType) {
                throw new Error(
                    `Variable '${statement.lvalue.name.name}' not found`,
                );
            }
            const expressionType = resolveExpression(statement.value, sctx);
            if (variableType.name !== expressionType.name) {
                throw new Error(
                    `Cannot assign '${expressionType.name}' to '${variableType.name}'`,
                );
            }
            break;
        }
        case 'statementIf': {
            const conditionType = resolveExpression(statement.condition, sctx);
            if (conditionType.name !== 'bool') {
                throw new Error('Condition must be a boolean');
            }
            for (const thenStatement of statement.then) {
                resolveStatement(thenStatement, sctx.clone());
            }
            if (statement.else) {
                for (const elseStatement of statement.else) {
                    resolveStatement(elseStatement, sctx.clone());
                }
            }
            break;
        }
        case 'statementLet': {
            if (sctx.hasVariable(statement.name.name)) {
                throw new Error(
                    `Variable '${statement.name.name}' already exists`,
                );
            }
            const valueType = resolveExpression(statement.value, sctx);
            if (statement.type.name !== valueType.name) {
                throw new Error(
                    `Cannot assign '${valueType.name}' to '${statement.type.name}'`,
                );
            }
            sctx.addVariable(statement.name.name, valueType);
            break;
        }
        case 'statementExpression': {
            resolveExpression(statement.expression, sctx);
            break;
        }
    }
}

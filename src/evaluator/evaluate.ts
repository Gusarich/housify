import { AstExpression } from '../grammar/ast';
import { CompilerContext, StatementContext } from '../resolver/context';
import { resolveExpression } from '../resolver/resolve';

function ensureNumber(value: number | boolean): number {
    if (typeof value !== 'number') {
        throw new Error('Expected number');
    }
    return value;
}

function ensureBoolean(value: number | boolean): boolean {
    if (typeof value !== 'boolean') {
        throw new Error('Expected boolean');
    }
    return value;
}

export function evaluateConstantValue(
    expression: AstExpression,
    ctx: CompilerContext,
    sctx: StatementContext,
): number | boolean {
    switch (expression.kind) {
        case 'integerLiteral':
            return parseInt(expression.value);
        case 'booleanLiteral':
            return expression.value;
        case 'expressionField': {
            const structType = resolveExpression(expression.struct, ctx, sctx);
            if (structType.type !== 'struct') {
                throw new Error('Expected struct');
            }
            const field = structType.fields.find(
                (field) => field.name === expression.field.name,
            );
            if (!field) {
                throw new Error(`Field '${expression.field.name}' not found`);
            }
            if (!field.defaultValue) {
                throw new Error(
                    `Field '${expression.field.name}' has no default value`,
                );
            }
            return evaluateConstantValue(field.defaultValue, ctx, sctx);
        }
        case 'expressionUnary': {
            const value = evaluateConstantValue(expression.operand, ctx, sctx);
            switch (expression.op) {
                case '+':
                    return +ensureNumber(value);
                case '-':
                    return -ensureNumber(value);
                case '!':
                    return !ensureBoolean(value);
            }
            break;
        }
        case 'expressionBinary': {
            const left = evaluateConstantValue(expression.left, ctx, sctx);
            const right = evaluateConstantValue(expression.right, ctx, sctx);
            switch (expression.op) {
                case '+':
                    return ensureNumber(left) + ensureNumber(right);
                case '-':
                    return ensureNumber(left) - ensureNumber(right);
                case '*':
                    return ensureNumber(left) * ensureNumber(right);
                case '/':
                    return ensureNumber(left) / ensureNumber(right);
                case '==':
                    return left === right;
                case '!=':
                    return left !== right;
                case '<':
                    return ensureNumber(left) < ensureNumber(right);
                case '<=':
                    return ensureNumber(left) <= ensureNumber(right);
                case '>':
                    return ensureNumber(left) > ensureNumber(right);
                case '>=':
                    return ensureNumber(left) >= ensureNumber(right);
                case '&&':
                    return ensureBoolean(left) && ensureBoolean(right);
                case '||':
                    return ensureBoolean(left) || ensureBoolean(right);
            }
            break;
        }
        default:
            throw new Error(`Unexpected expression kind: ${expression.kind}`);
    }
}

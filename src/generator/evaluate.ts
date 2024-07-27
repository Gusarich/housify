import { ConstantEvaluationError } from '../errors';
import { AstExpression } from '../grammar/ast';
import { CompilerContext } from '../resolver/context';

export function evaluateConstantExpression(
    expression: AstExpression,
    ctx: CompilerContext,
): string {
    switch (expression.kind) {
        case 'integerLiteral':
            if (!/^-?\d+$/.test(expression.value)) {
                throw new ConstantEvaluationError(
                    `Invalid integer literal '${expression.value}'`,
                    expression.source,
                    true,
                );
            }
            return expression.value;
        case 'booleanLiteral':
            return expression.value ? '1' : '0';
        case 'expressionBinary': {
            const left = parseInt(
                evaluateConstantExpression(expression.left, ctx),
            );
            const right = parseInt(
                evaluateConstantExpression(expression.right, ctx),
            );
            switch (expression.op) {
                case '+':
                    return (left + right).toString();
                case '-':
                    return (left - right).toString();
                case '*':
                    return (left * right).toString();
                case '/':
                    if (right === 0) {
                        throw new ConstantEvaluationError(
                            'Division by zero',
                            expression.source,
                            true,
                        );
                    }
                    return (left / right).toString();
                case '==':
                    return left === right ? '1' : '0';
                case '!=':
                    return left !== right ? '1' : '0';
                case '<':
                    return left < right ? '1' : '0';
                case '<=':
                    return left <= right ? '1' : '0';
                case '>':
                    return left > right ? '1' : '0';
                case '>=':
                    return left >= right ? '1' : '0';
                case '&&':
                    return left && right ? '1' : '0';
                case '||':
                    return left || right ? '1' : '0';
            }
            break;
        }
        case 'expressionUnary': {
            const operand = parseInt(
                evaluateConstantExpression(expression.operand, ctx),
            );
            switch (expression.op) {
                case '-':
                    return (-operand).toString();
                case '!':
                    return operand === 0 ? '1' : '0';
            }
            break;
        }
        case 'expressionId':
            if (!ctx.hasStaticConstant(expression.name.name)) {
                throw new ConstantEvaluationError(
                    `No static constant '${expression.name.name}' found`,
                    expression.source,
                    false,
                );
            }
            return ctx.getStaticConstant(expression.name.name)!.value;
        default:
            throw new ConstantEvaluationError(
                `Cannot evaluate ${expression.kind}`,
                expression.source,
            );
    }
}

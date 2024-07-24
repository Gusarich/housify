import { ConstantEvaluationError } from '../errors';
import { AstExpression } from '../grammar/ast';

export function evaluateConstantExpression(expression: AstExpression): string {
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
            const left = parseInt(evaluateConstantExpression(expression.left));
            const right = parseInt(
                evaluateConstantExpression(expression.right),
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
                evaluateConstantExpression(expression.operand),
            );
            switch (expression.op) {
                case '-':
                    return (-operand).toString();
                case '!':
                    return operand === 0 ? '1' : '0';
            }
            break;
        }
        default:
            throw new ConstantEvaluationError(
                `Cannot evaluate ${expression.kind}`,
                expression.source,
            );
    }
}

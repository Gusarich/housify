import { InternalError, ResolveError } from '../errors';
import { evaluateConstantExpression } from '../generator/evaluate';
import {
    AstExpression,
    AstExpressionField,
    AstFunction,
    AstGlobalStat,
    AstHouse,
    AstId,
    AstModule,
    AstPlayerStat,
    AstStatement,
    AstStatementConst,
} from '../grammar/ast';
import { EventType } from '../housing/events';
import { CompilerContext, StatementContext } from './context';
import { Type } from './type';

export function registerExpression(
    ctx: CompilerContext,
    id: number,
    type: Type,
) {
    ctx.expressions.set(id, type);
    return type;
}

export function resolveType(type: AstId, ctx: CompilerContext): Type {
    switch (type.name) {
        case 'void':
            return { type: 'void' };
        case 'int':
            return { type: 'int' };
        case 'bool':
            return { type: 'bool' };
        default:
            if (!ctx.hasType(type.name)) {
                throw new ResolveError(
                    `Type '${type.name}' not found`,
                    type.source,
                );
            }
            return ctx.getType(type.name)!;
    }
}

export function resolveStructPath(path: AstExpressionField): string[] {
    if (path.struct.kind === 'expressionId') {
        return [path.struct.name.name, path.field.name];
    } else if (path.struct.kind === 'expressionField') {
        return resolveStructPath(path.struct).concat(path.field.name);
    } else {
        throw new InternalError('Invalid struct path', path.source);
    }
}

export function areTypesEqual(
    left: Type,
    right: Type,
): {
    equal: boolean;
    first?: string;
    second?: string;
} {
    if (left.type !== right.type) {
        return {
            equal: false,
            first: left.type,
            second: right.type,
        };
    }
    if (
        left.type === 'struct' &&
        right.type === 'struct' &&
        left.name !== right.name
    ) {
        return {
            equal: false,
            first: left.name,
            second: right.name,
        };
    }
    return {
        equal: true,
    };
}

export function resolveExpression(
    expression: AstExpression,
    ctx: CompilerContext,
    sctx: StatementContext,
): Type {
    if (ctx.expressions.has(expression.id)) {
        return ctx.expressions.get(expression.id)!;
    }

    switch (expression.kind) {
        case 'expressionId': {
            if (ctx.hasStaticConstant(expression.name.name)) {
                return registerExpression(
                    ctx,
                    expression.id,
                    ctx.getStaticConstant(expression.name.name)!.type,
                );
            }
            if (!sctx.hasVariable(expression.name.name)) {
                throw new ResolveError(
                    `Variable '${expression.name.name}' not found`,
                    expression.name.source,
                );
            }
            return registerExpression(
                ctx,
                expression.id,
                sctx.getVariable(expression.name.name)!.type,
            );
        }
        case 'integerLiteral':
            return registerExpression(ctx, expression.id, { type: 'int' });
        case 'booleanLiteral':
            return registerExpression(ctx, expression.id, { type: 'bool' });
        case 'expressionBinary': {
            const left = resolveExpression(expression.left, ctx, sctx);
            const right = resolveExpression(expression.right, ctx, sctx);
            switch (expression.op) {
                case '+':
                case '-':
                case '*':
                case '/':
                    if (left.type !== 'int') {
                        throw new ResolveError(
                            `Operands must be integers, got '${left.type}'`,
                            expression.left.source,
                        );
                    }
                    if (right.type !== 'int') {
                        throw new ResolveError(
                            `Operands must be integers, got '${right.type}'`,
                            expression.right.source,
                        );
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'int',
                    });
                case '<':
                case '<=':
                case '>':
                case '>=':
                    if (left.type !== 'int') {
                        throw new ResolveError(
                            `Operands must be integers, got '${left.type}'`,
                            expression.left.source,
                        );
                    }
                    if (right.type !== 'int') {
                        throw new ResolveError(
                            `Operands must be integers, got '${right.type}'`,
                            expression.right.source,
                        );
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'bool',
                    });
                case '==':
                case '!=': {
                    const typesEqual = areTypesEqual(left, right);
                    if (!typesEqual.equal) {
                        throw new ResolveError(
                            `Operands must be of the same type, got '${typesEqual.first}' and '${typesEqual.second}'`,
                            expression.source,
                        );
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'bool',
                    });
                }
                case '&&':
                case '||':
                    if (left.type !== 'bool') {
                        throw new ResolveError(
                            `Operands must be booleans, got '${left.type}'`,
                            expression.left.source,
                        );
                    }
                    if (right.type !== 'bool') {
                        throw new ResolveError(
                            `Operands must be booleans, got '${right.type}'`,
                            expression.right.source,
                        );
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'bool',
                    });
            }
            break;
        }
        case 'expressionUnary': {
            const operand = resolveExpression(expression.operand, ctx, sctx);
            switch (expression.op) {
                case '-':
                    if (operand.type !== 'int') {
                        throw new ResolveError(
                            `Operand must be an integer, got '${operand.type}'`,
                            expression.operand.source,
                        );
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'int',
                    });
                case '!':
                    if (operand.type !== 'bool') {
                        throw new ResolveError(
                            `Operand must be a boolean, got '${operand.type}'`,
                            expression.operand.source,
                        );
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'bool',
                    });
            }
            break;
        }
        case 'expressionField': {
            const struct = resolveExpression(expression.struct, ctx, sctx);
            if (struct.type !== 'struct') {
                throw new ResolveError(
                    `Expected a struct, got '${struct.type}'`,
                    expression.struct.source,
                );
            }
            const field = struct.fields.find(
                (field) => field.name === expression.field.name,
            );
            if (!field) {
                throw new ResolveError(
                    `Field '${expression.field.name}' not found in struct '${struct.name}'`,
                    expression.field.source,
                );
            }
            return registerExpression(ctx, expression.id, field.type);
        }
        case 'expressionCall': {
            const func = ctx.getInlineFunction(expression.function.name);
            if (!func) {
                throw new ResolveError(
                    `Function '${expression.function.name}' not found`,
                    expression.function.source,
                );
            }
            if (func.parameters.length !== expression.arguments.length) {
                throw new ResolveError(
                    `Expected ${func.parameters.length} arguments, got ${expression.arguments.length}`,
                    expression.source,
                );
            }
            for (const [i, argument] of expression.arguments.entries()) {
                const parameter = func.parameters[i]!;
                const argumentType = resolveExpression(argument, ctx, sctx);
                if (parameter.type.type !== argumentType.type) {
                    throw new ResolveError(
                        `Argument ${i} must be of type '${parameter.type.type}', got '${argumentType.type}'`,
                        argument.source,
                    );
                }
            }
            return registerExpression(ctx, expression.id, func.type);
        }
    }
}

export function processStatement(
    statement: AstStatement,
    ctx: CompilerContext,
    sctx: StatementContext,
) {
    if (sctx.alwaysReturns) {
        throw new ResolveError('Unreachable code', statement.source);
    }

    switch (statement.kind) {
        case 'statementAssign':
        case 'statementAugmentedAssign': {
            if (
                statement.lvalue.kind !== 'expressionId' &&
                statement.lvalue.kind !== 'expressionField'
            ) {
                throw new ResolveError(
                    `'${statement.lvalue.kind}' cannot be assigned`,
                    statement.source,
                );
            }

            const variableType = resolveExpression(statement.lvalue, ctx, sctx);
            const expressionType = resolveExpression(
                statement.value,
                ctx,
                sctx,
            );

            if (statement.lvalue.kind === 'expressionId') {
                const variable = sctx.getVariable(statement.lvalue.name.name)!;
                if (variable.constant) {
                    throw new ResolveError(
                        `Cannot assign to constant '${statement.lvalue.name.name}'`,
                        statement.source,
                    );
                }
            } else if (statement.lvalue.kind === 'expressionField') {
                const path = resolveStructPath(statement.lvalue);
                const struct = sctx.getVariable(path[0]!)!;
                if (struct.constant) {
                    throw new ResolveError(
                        `Cannot assign to a field of a constant struct '${path[0]}'`,
                        statement.source,
                    );
                }
            }

            if (statement.kind === 'statementAssign') {
                if (variableType.type !== expressionType.type) {
                    throw new ResolveError(
                        `Cannot assign '${expressionType.type}' to '${variableType.type}'`,
                        statement.source,
                    );
                }
            } else {
                if (variableType.type !== 'int') {
                    throw new ResolveError(
                        `Operands must be integers, got '${variableType.type}'`,
                        statement.source,
                    );
                }
                if (expressionType.type !== 'int') {
                    throw new ResolveError(
                        `Operands must be integers, got '${expressionType.type}'`,
                        statement.source,
                    );
                }
            }
            break;
        }
        case 'statementIf': {
            const conditionType = resolveExpression(
                statement.condition,
                ctx,
                sctx,
            );
            if (conditionType.type !== 'bool') {
                throw new ResolveError(
                    `Condition must be a boolean expression, got '${conditionType.type}'`,
                    statement.condition.source,
                );
            }
            const sctxThen = sctx.clone();
            for (const thenStatement of statement.then) {
                processStatement(thenStatement, ctx, sctxThen);
            }
            if (statement.else) {
                const sctxElse = sctx.clone();
                for (const elseStatement of statement.else) {
                    processStatement(elseStatement, ctx, sctxElse);
                }
                if (sctxThen.alwaysReturns && sctxElse.alwaysReturns) {
                    sctx.setAlwaysReturns();
                }
            }
            break;
        }
        case 'statementLet':
        case 'statementConst': {
            if (sctx.hasVariable(statement.name.name)) {
                throw new ResolveError(
                    `Variable '${statement.name.name}' already exists`,
                    statement.name.source,
                );
            }
            if (statement.type.name === 'void') {
                throw new ResolveError(
                    "Cannot declare a variable of type 'void'",
                    statement.type.source,
                );
            }
            const valueType = resolveExpression(statement.value, ctx, sctx);
            if (statement.type.name !== valueType.type) {
                throw new ResolveError(
                    `Cannot assign '${valueType.type}' to '${statement.type.name}'`,
                    statement.source,
                );
            }
            sctx.addVariable(statement.name.name, {
                type: valueType,
                constant: statement.kind === 'statementConst',
            });
            break;
        }
        case 'statementExpression': {
            const type = resolveExpression(statement.expression, ctx, sctx);
            if (type.type !== 'void') {
                throw new ResolveError(
                    `Expression of type '${type.type}' cannot be used as a statement`,
                    statement.source,
                );
            }
            break;
        }
        case 'statementReturn': {
            if (statement.expression) {
                const type = resolveExpression(statement.expression, ctx, sctx);
                const typesEqual = areTypesEqual(type, sctx.expectedReturnType);
                if (!typesEqual.equal) {
                    throw new ResolveError(
                        `Expected return type '${sctx.expectedReturnType.type}', got '${type.type}'`,
                        statement.expression.source,
                    );
                }
            } else {
                if (sctx.expectedReturnType.type !== 'void') {
                    throw new ResolveError(
                        `Expected return type '${sctx.expectedReturnType.type}', got 'void'`,
                        statement.source,
                    );
                }
            }
            sctx.setAlwaysReturns();
        }
    }
}

export function processStatDefinition(
    stat: AstGlobalStat | AstPlayerStat,
    houseName: string,
    ctx: CompilerContext,
    sctx: StatementContext,
) {
    const statKind = stat.kind === 'globalStat' ? 'global' : 'player';

    const statStruct = sctx.getVariable(statKind)!.type;
    if (statStruct.type !== 'struct') {
        throw new InternalError('Global must be a struct', stat.source);
    }

    // Check if the stat already exists
    if (statStruct.fields.find((field) => field.name === stat.name.name)) {
        throw new ResolveError(
            `Global stat '${stat.name.name}' already exists`,
            stat.source,
        );
    }

    // Check for `void` type
    if (stat.type.name === 'void') {
        throw new ResolveError(
            "Cannot declare a stat of type 'void'",
            stat.type.source,
        );
    }

    // Check if there are already 20 stats
    if (statStruct.fields.length >= 20) {
        throw new ResolveError(
            `Cannot have more than 20 persistent ${statKind} stats`,
            stat.source,
        );
    }

    // Add the stat
    const type = resolveType(stat.type, ctx);

    statStruct.fields.push({
        name: stat.name.name,
        type,
    });
    if (stat.kind === 'globalStat') {
        ctx.houses.get(houseName)!.globalStats.push({
            name: stat.name.name,
            type,
        });
    } else {
        ctx.houses.get(houseName)!.playerStats.push({
            name: stat.name.name,
            type,
        });
    }
}

export function processHouse(house: AstHouse, ctx: CompilerContext) {
    const sctx = new StatementContext();

    ctx.addHouse(house.name.name, {
        globalStats: [],
        playerStats: [],
        handlers: [],
    });
    sctx.addVariable('global', {
        type: {
            type: 'struct',
            name: 'global',
            fields: [],
        },
        constant: false,
    });
    sctx.addVariable('player', {
        type: {
            type: 'struct',
            name: 'player',
            fields: [],
        },
        constant: false,
    });

    for (const item of house.items) {
        switch (item.kind) {
            case 'playerStat':
            case 'globalStat':
                processStatDefinition(item, house.name.name, ctx, sctx);
                break;
            case 'handler': {
                if (!(item.event.name in EventType)) {
                    throw new ResolveError(
                        `Event '${item.event.name}' not found`,
                        item.event.source,
                    );
                }
                ctx.getHouse(house.name.name)!.handlers.push(
                    item.event.name as EventType,
                );

                const sctxHandler = sctx.clone();
                for (const statement of item.statements) {
                    processStatement(statement, ctx, sctxHandler);
                }
                break;
            }
        }
    }
}

export function processStaticConstant(
    constant: AstStatementConst,
    ctx: CompilerContext,
) {
    if (ctx.hasStaticConstant(constant.name.name)) {
        throw new ResolveError(
            `Static constant '${constant.name.name}' already exists`,
            constant.source,
        );
    }

    if (constant.type.name === 'void') {
        throw new ResolveError(
            "Cannot declare a constant of type 'void'",
            constant.type.source,
        );
    }

    const value = evaluateConstantExpression(constant.value, ctx);
    const type = resolveType(constant.type, ctx);

    ctx.addStaticConstant(constant.name.name, {
        type,
        value,
    });
}

export function prepareProcessInlineFunction(
    func: AstFunction,
    ctx: CompilerContext,
) {
    if (ctx.hasInlineFunction(func.name.name)) {
        throw new ResolveError(
            `Inline function '${func.name.name}' already exists`,
            func.source,
        );
    }

    const parameters = func.parameters.map((param) => ({
        name: param.name.name,
        type: resolveType(param.type, ctx),
    }));
    const type = resolveType(func.returnType, ctx);

    if (func.returnType.name === 'void') {
        throw new ResolveError(
            "Cannot declare a function of type 'void'",
            func.returnType.source,
        );
    }

    ctx.addInlineFunction(func.name.name, {
        type,
        parameters,
        astId: func.id,
    });
}

export function processInlineFunction(func: AstFunction, ctx: CompilerContext) {
    const resolvedFunc = ctx.getInlineFunction(func.name.name)!;

    // Process statements
    const sctx = new StatementContext(resolvedFunc.type);
    for (const param of resolvedFunc.parameters) {
        sctx.addVariable(param.name, {
            type: param.type,
            constant: false,
        });
    }
    for (const statement of func.statements) {
        processStatement(statement, ctx, sctx);
    }
    if (!sctx.alwaysReturns) {
        throw new ResolveError(
            `Function '${func.name.name}' does not always return a value`,
            func.source,
        );
    }
}

export function resolveModule(module: AstModule, ctx: CompilerContext) {
    // Go through function definitions first to allow for recursive calls
    for (const item of module.items) {
        if (item.kind === 'function') {
            prepareProcessInlineFunction(item, ctx);
        }
    }

    // Process all module items
    for (const item of module.items) {
        switch (item.kind) {
            case 'house':
                processHouse(item, ctx);
                break;
            case 'statementConst':
                processStaticConstant(item, ctx);
                break;
            case 'function':
                processInlineFunction(item, ctx);
                break;
        }
    }
}

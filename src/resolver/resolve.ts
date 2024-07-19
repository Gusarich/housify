import {
    AstExpression,
    AstGlobalStat,
    AstHouse,
    AstId,
    AstModule,
    AstPlayerStat,
    AstStatement,
} from '../grammar/ast';
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

export function resolveType(type: AstId, sctx: StatementContext): Type {
    switch (type.name) {
        case 'void':
            return { type: 'void' };
        case 'int':
            return { type: 'int' };
        case 'bool':
            return { type: 'bool' };
        default:
            if (!sctx.hasType(type.name)) {
                throw new Error(`Type '${type.name}' not found`);
            }
            return sctx.getType(type.name)!;
    }
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
            if (!sctx.hasVariable(expression.name.name)) {
                throw new Error(`Variable '${expression.name.name}' not found`);
            }
            return registerExpression(
                ctx,
                expression.id,
                sctx.getVariable(expression.name.name)!,
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
                    if (left.type !== 'int' || right.type !== 'int') {
                        throw new Error('Operands must be integers');
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'int',
                    });
                case '<':
                case '<=':
                case '>':
                case '>=':
                    if (left.type !== 'int' || right.type !== 'int') {
                        throw new Error('Operands must be integers');
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'bool',
                    });
                case '==':
                case '!=':
                    if (left.type !== right.type) {
                        throw new Error('Operands must be of the same type');
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'bool',
                    });
                case '&&':
                case '||':
                    if (left.type !== 'bool' || right.type !== 'bool') {
                        throw new Error('Operands must be booleans');
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
                case '+':
                case '-':
                    if (operand.type !== 'int') {
                        throw new Error('Operand must be an integer');
                    }
                    return registerExpression(ctx, expression.id, {
                        type: 'int',
                    });
                case '!':
                    if (operand.type !== 'bool') {
                        throw new Error('Operand must be a boolean');
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
                throw new Error('Expression must be a struct');
            }
            const field = struct.fields.find(
                (field) => field.name === expression.field.name,
            );
            if (!field) {
                throw new Error(`Field '${expression.field.name}' not found`);
            }
            return registerExpression(ctx, expression.id, field.type);
        }
    }
}

export function processStatement(
    statement: AstStatement,
    ctx: CompilerContext,
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
            const variableType = resolveExpression(statement.lvalue, ctx, sctx);
            const expressionType = resolveExpression(
                statement.value,
                ctx,
                sctx,
            );
            if (variableType.type !== expressionType.type) {
                throw new Error(
                    `Cannot assign '${expressionType.type}' to '${variableType.type}'`,
                );
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
                throw new Error('Condition must be a boolean');
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
            }
            break;
        }
        case 'statementLet': {
            if (sctx.hasVariable(statement.name.name)) {
                throw new Error(
                    `Variable '${statement.name.name}' already exists`,
                );
            }
            const valueType = resolveExpression(statement.value, ctx, sctx);
            if (statement.type.name !== valueType.type) {
                throw new Error(
                    `Cannot assign '${valueType.type}' to '${statement.type.name}'`,
                );
            }
            sctx.addVariable(statement.name.name, valueType);
            break;
        }
        case 'statementExpression': {
            resolveExpression(statement.expression, ctx, sctx);
            break;
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

    const statStruct = sctx.getVariable(statKind)!;
    if (statStruct.type !== 'struct') {
        // must never happen
        throw new Error('Global must be a struct');
    }

    // Check if the stat already exists
    if (statStruct.fields.find((field) => field.name === stat.name.name)) {
        throw new Error(`Global stat '${stat.name.name}' already exists`);
    }

    // Check if the specified type matches the default value
    if (stat.defaultValue) {
        const valueType = resolveExpression(stat.defaultValue, ctx, sctx);
        if (stat.type.name !== valueType.type) {
            throw new Error(
                `Cannot assign '${valueType.type}' to '${stat.type.name}'`,
            );
        }
    }

    // Add the stat
    const type = resolveType(stat.type, sctx);

    statStruct.fields.push({
        name: stat.name.name,
        type,
        defaultValue: stat.defaultValue,
    });
    if (stat.kind === 'globalStat') {
        ctx.houses.get(houseName)!.globalStats.push({
            name: stat.name.name,
            type,
            defaultValue: stat.defaultValue,
        });
    } else {
        ctx.houses.get(houseName)!.playerStats.push({
            name: stat.name.name,
            type,
            defaultValue: stat.defaultValue,
        });
    }
}

export function processHouse(
    house: AstHouse,
    ctx: CompilerContext,
    sctx: StatementContext,
) {
    ctx.addHouse(house.name.name, {
        globalStats: [],
        playerStats: [],
        handlers: [],
    });
    sctx.addVariable('global', {
        type: 'struct',
        name: 'global',
        fields: [],
    });
    sctx.addVariable('player', {
        type: 'struct',
        name: 'player',
        fields: [],
    });
    for (const item of house.items) {
        switch (item.kind) {
            case 'playerStat':
            case 'globalStat':
                processStatDefinition(item, house.name.name, ctx, sctx);
                break;
            case 'handler': {
                const sctxHandler = sctx.clone();
                for (const statement of item.statements) {
                    processStatement(statement, ctx, sctxHandler);
                }
                break;
            }
        }
    }
}

export function resolveModule(module: AstModule, ctx: CompilerContext) {
    const sctx = new StatementContext();
    for (const item of module.items) {
        processHouse(item, ctx, sctx.clone());
    }
}
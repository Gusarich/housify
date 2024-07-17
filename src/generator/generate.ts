import {
    AstExpression,
    AstHandler,
    AstHouse,
    AstModule,
    AstStatement,
} from '../grammar/ast';
import { Action, ActionType } from '../housing/actions';
import { EventType } from '../housing/events';
import { StatMode } from '../housing/util';
import { CompilerContext } from '../resolver/context';

export type CompiledModule = {
    kind: 'module';
    houses: CompiledHouse[];
};

export type CompiledHouse = {
    kind: 'house';
    name: string;
    globalStats: string[];
    playerStats: string[];
    handlers: CompiledHandler[];
};

export type CompiledHandler = {
    kind: 'handler';
    event: EventType;
    actions: Action[];
};

export function writeExpression(expression: AstExpression): string {
    switch (expression.kind) {
        case 'integerLiteral':
            return expression.value;
        case 'booleanLiteral':
            return expression.value ? '1' : '0';
        default:
            return 'TODO';
    }
}

export function writeStatement(
    statement: AstStatement,
    ctx: CompilerContext,
    actions: Action[],
) {
    switch (statement.kind) {
        case 'statementLet':
            actions.push({
                type: ActionType.CHANGE_STAT,
                mode: StatMode.SET,
                stat: `${statement.name.name}`,
                amount: writeExpression(statement.value),
            });
    }
}

export function writeHandler(
    ast: AstHandler,
    ctx: CompilerContext,
): CompiledHandler {
    if (!(ast.event.name in EventType)) {
        // must never happen
        throw new Error(`Unknown event type: ${ast.event.name}`);
    }

    const actions: Action[] = [];
    for (const item of ast.statements) {
        writeStatement(item, ctx, actions);
    }

    return {
        kind: 'handler',
        event: ast.event.name as EventType,
        actions,
    };
}

export function writeHouse(ast: AstHouse, ctx: CompilerContext): CompiledHouse {
    const house = ctx.getHouse(ast.name.name);
    if (!house) {
        // must never happen
        throw new Error(`House not found: ${ast.name.name}`);
    }

    const globalStats = house.globalStats.map((stat) => stat.name);
    const playerStats = house.playerStats.map((stat) => stat.name);
    const handlers: CompiledHandler[] = [];

    for (const item of ast.items) {
        if (item.kind === 'handler') {
            handlers.push(writeHandler(item, ctx));
        }
    }

    return {
        kind: 'house',
        name: ast.name.name,
        globalStats,
        playerStats,
        handlers,
    };
}

export function writeModule(
    ast: AstModule,
    ctx: CompilerContext,
): CompiledModule {
    const houses: CompiledHouse[] = [];

    for (const item of ast.items) {
        houses.push(writeHouse(item, ctx));
    }

    return {
        kind: 'module',
        houses,
    };
}

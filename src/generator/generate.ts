import {
    AstExpression,
    AstExpressionField,
    AstHandler,
    AstHouse,
    AstModule,
    AstStatement,
} from '../grammar/ast';
import { Action, ActionType } from '../housing/actions';
import { EventType } from '../housing/events';
import { StatMode } from '../housing/util';
import { CompilerContext } from '../resolver/context';
import { camelToSnake } from '../utils/letterCases';

type WriterContext = {
    actions: Action[];
    globalStats: Map<string, number>;
    playerStats: Map<string, number>;
    ctx: CompilerContext;
};

let tempId = 0;

function getNextTempId() {
    return tempId++;
}

export function resetTempId() {
    tempId = 0;
}

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

export function writeStructPath(path: AstExpressionField): string {
    if (path.struct.kind === 'expressionId') {
        return path.struct.name.name + '.' + path.field.name;
    } else if (path.struct.kind === 'expressionField') {
        return writeStructPath(path.struct) + '.' + path.field.name;
    } else {
        // must never happen
        throw new Error('Invalid struct path');
    }
}

export function writeExpression(
    expression: AstExpression,
    wctx: WriterContext,
): string {
    switch (expression.kind) {
        case 'integerLiteral':
            return expression.value;
        case 'booleanLiteral':
            return expression.value ? '1' : '0';
        case 'expressionId':
            return '%player.$' + expression.name.name + '%';
        case 'expressionField':
            if (expression.struct.kind === 'expressionId') {
                if (expression.struct.name.name === 'global') {
                    return '%global.' + expression.field.name + '%';
                } else {
                    return '%' + writeStructPath(expression) + '%';
                }
            } else {
                return '%' + writeStructPath(expression) + '%';
            }
        case 'expressionUnary': {
            const operand = writeExpression(expression.operand, wctx);
            const tempStat = '$$' + getNextTempId();
            wctx.playerStats.set(tempStat, wctx.playerStats.size);

            switch (expression.op) {
                case '-': {
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: tempStat,
                        amount: '0',
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.DECREMENT,
                        stat: tempStat,
                        amount: operand,
                    });
                    break;
                }
                case '!': {
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: tempStat,
                        amount: '1',
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.DECREMENT,
                        stat: tempStat,
                        amount: operand,
                    });
                    break;
                }
            }
            return '%' + tempStat + '%';
        }
        case 'expressionBinary': {
            const left = writeExpression(expression.left, wctx);
            const right = writeExpression(expression.right, wctx);
            const tempStat = '$$' + getNextTempId();
            wctx.playerStats.set(tempStat, wctx.playerStats.size);

            switch (expression.op) {
                case '+':
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: tempStat,
                        amount: left,
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.INCREMENT,
                        stat: tempStat,
                        amount: right,
                    });
                    break;
                case '-':
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: tempStat,
                        amount: left,
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.DECREMENT,
                        stat: tempStat,
                        amount: right,
                    });
                    break;
                case '*':
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: tempStat,
                        amount: left,
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.MULTIPLY,
                        stat: tempStat,
                        amount: right,
                    });
                    break;
                case '/':
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: tempStat,
                        amount: left,
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.DIVIDE,
                        stat: tempStat,
                        amount: right,
                    });
                    break;
                case '&&':
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: tempStat,
                        amount: left,
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.MULTIPLY,
                        stat: tempStat,
                        amount: right,
                    });
                    break;
                case '||': {
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: tempStat,
                        amount: left,
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.INCREMENT,
                        stat: tempStat,
                        amount: right,
                    });
                    const tempStat2 = '$$' + getNextTempId();
                    wctx.playerStats.set(tempStat2, wctx.playerStats.size);
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: tempStat2,
                        amount: left,
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.MULTIPLY,
                        stat: tempStat2,
                        amount: right,
                    });
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.DECREMENT,
                        stat: tempStat,
                        amount: tempStat2,
                    });
                    break;
                }
                default:
                    throw new Error('Comparisons are not implemented yet');
            }
            return '%' + tempStat + '%';
        }
    }
}

export function writeStatement(statement: AstStatement, wctx: WriterContext) {
    switch (statement.kind) {
        case 'statementLet':
            wctx.playerStats.set(
                '$' + statement.name.name,
                wctx.playerStats.size,
            );
            wctx.actions.push({
                type: ActionType.CHANGE_STAT,
                mode: StatMode.SET,
                stat: '$' + statement.name.name,
                amount: writeExpression(statement.value, wctx),
            });
            break;
        case 'statementAssign':
            if (statement.lvalue.kind === 'expressionId') {
                wctx.actions.push({
                    type: ActionType.CHANGE_STAT,
                    mode: StatMode.SET,
                    stat: '$' + statement.lvalue.name.name,
                    amount: writeExpression(statement.value, wctx),
                });
            } else if (statement.lvalue.kind === 'expressionField') {
                if (statement.lvalue.struct.kind === 'expressionId') {
                    if (statement.lvalue.struct.name.name === 'global') {
                        wctx.actions.push({
                            type: ActionType.CHANGE_GLOBAL_STAT,
                            mode: StatMode.SET,
                            stat: statement.lvalue.field.name,
                            amount: writeExpression(statement.value, wctx),
                        });
                    } else if (statement.lvalue.struct.name.name === 'player') {
                        wctx.actions.push({
                            type: ActionType.CHANGE_STAT,
                            mode: StatMode.SET,
                            stat: statement.lvalue.field.name,
                            amount: writeExpression(statement.value, wctx),
                        });
                    } else {
                        wctx.actions.push({
                            type: ActionType.CHANGE_STAT,
                            mode: StatMode.SET,
                            stat: writeStructPath(statement.lvalue),
                            amount: writeExpression(statement.value, wctx),
                        });
                    }
                } else {
                    wctx.actions.push({
                        type: ActionType.CHANGE_STAT,
                        mode: StatMode.SET,
                        stat: writeStructPath(statement.lvalue),
                        amount: writeExpression(statement.value, wctx),
                    });
                }
            } else {
                // must never happen
                throw new Error('Invalid lvalue');
            }
            break;
        case 'statementExpression':
            writeExpression(statement.expression, wctx);
            break;
        case 'statementIf': {
            // TODO: Implement
            // const condition = writeExpression(
            //     statement.condition,
            //     actions,
            //     ctx,
            // );
            // actions.push({
            //     type: ActionType.CONDITIONAL,
            //     conditions: [
            //         {
            //             type: ConditionType.PLAYER_STAT,
            //             stat: condition,
            //             mode: mode
            //         },
            //     ],
            // });
            throw new Error('If statements are not implemented yet');
        }
    }
}

export function writeHandler(
    ast: AstHandler,
    wctx: WriterContext,
): CompiledHandler {
    const eventName = ast.event.type.name;
    const eventNameSnake = camelToSnake(eventName.slice(0, -5)).toUpperCase();

    if (!(eventNameSnake in EventType)) {
        // must never happen
        throw new Error(`Unknown event type: ${eventName}`);
    }

    for (const item of ast.statements) {
        writeStatement(item, wctx);
    }

    return {
        kind: 'handler',
        event: eventNameSnake as EventType,
        actions: wctx.actions,
    };
}

export function writeHouse(ast: AstHouse, ctx: CompilerContext): CompiledHouse {
    const house = ctx.getHouse(ast.name.name);
    if (!house) {
        // must never happen
        throw new Error(`House not found: ${ast.name.name}`);
    }

    const globalStats: Map<string, number> = new Map();
    house.globalStats.forEach((stat, index) => {
        globalStats.set(stat.name, index);
    });
    const playerStats: Map<string, number> = new Map();
    house.playerStats.forEach((stat, index) => {
        playerStats.set(stat.name, index);
    });
    const handlers: CompiledHandler[] = [];

    for (const item of ast.items) {
        if (item.kind === 'handler') {
            handlers.push(
                writeHandler(item, {
                    globalStats,
                    playerStats,
                    ctx,
                    actions: [],
                }),
            );
        }
    }

    return {
        kind: 'house',
        name: ast.name.name,
        globalStats: [...globalStats.keys()].sort(
            (a, b) => globalStats.get(a)! - globalStats.get(b)!,
        ),
        playerStats: [...playerStats.keys()].sort(
            (a, b) => playerStats.get(a)! - playerStats.get(b)!,
        ),
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

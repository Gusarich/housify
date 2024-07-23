import {
    AstExpression,
    AstHandler,
    AstHouse,
    AstModule,
    AstStatement,
} from '../grammar/ast';
import { Action, ActionKind } from '../housing/actions';
import { ConditionKind } from '../housing/conditions';
import { EventType } from '../housing/events';
import { StatCompareMode, StatChangeMode } from '../housing/util';
import { CompilerContext } from '../resolver/context';
import { resolveStructPath } from '../resolver/resolve';
import { evaluateConstantExpression } from './evaluate';

type WriterContext = {
    actions: Action[];
    globalStats: Map<string, number>;
    playerStats: Map<string, number>;
    ctx: CompilerContext;
};

export function wrapAsPlayerStat(stat: string) {
    return '%stat.player/' + stat + '%';
}

export function wrapAsGlobalStat(stat: string) {
    return '%stat.global/' + stat + '%';
}

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

export function cloneCompiledPiece(
    piece: CompiledModule | CompiledHouse | CompiledHandler,
): CompiledModule | CompiledHouse | CompiledHandler {
    switch (piece.kind) {
        case 'module':
            return {
                ...piece,
                houses: piece.houses.map(cloneCompiledPiece) as CompiledHouse[],
            };
        case 'house':
            return {
                ...piece,
                globalStats: [...piece.globalStats],
                playerStats: [...piece.playerStats],
                handlers: piece.handlers.map(
                    cloneCompiledPiece,
                ) as CompiledHandler[],
            };
        case 'handler':
            return {
                ...piece,
                actions: [...piece.actions],
            };
    }
}

export function writeExpression(
    expression: AstExpression,
    wctx: WriterContext,
): string {
    try {
        const result = evaluateConstantExpression(expression);
        const tempStat = '$$' + getNextTempId();
        wctx.actions.push({
            kind: ActionKind.CHANGE_PLAYER_STAT,
            mode: StatChangeMode.SET,
            stat: tempStat,
            value: result,
        });
        return tempStat;
    } catch {
        /* empty */
    }

    switch (expression.kind) {
        case 'integerLiteral': {
            const tempStat = '$$' + getNextTempId();
            wctx.actions.push({
                kind: ActionKind.CHANGE_PLAYER_STAT,
                mode: StatChangeMode.SET,
                stat: tempStat,
                value: expression.value,
            });
            return tempStat;
        }
        case 'booleanLiteral': {
            const tempStat = '$$' + getNextTempId();
            wctx.actions.push({
                kind: ActionKind.CHANGE_PLAYER_STAT,
                mode: StatChangeMode.SET,
                stat: tempStat,
                value: expression.value ? '1' : '0',
            });
            return tempStat;
        }
        case 'expressionId':
            return '$' + expression.name.name;
        case 'expressionField':
            if (expression.struct.kind === 'expressionId') {
                if (expression.struct.name.name === 'global') {
                    return expression.field.name;
                } else if (expression.struct.name.name === 'player') {
                    return expression.field.name;
                }
            }
            return '$' + resolveStructPath(expression).join('.');

        case 'expressionUnary': {
            const operand = writeExpression(expression.operand, wctx);
            const tempStat = '$$' + getNextTempId();

            switch (expression.op) {
                case '-': {
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: '0',
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.DECREMENT,
                        stat: tempStat,
                        value: wrapAsPlayerStat(operand),
                    });
                    break;
                }
                case '!': {
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: '1',
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.DECREMENT,
                        stat: tempStat,
                        value: wrapAsPlayerStat(operand),
                    });
                    break;
                }
            }
            return tempStat;
        }
        case 'expressionBinary': {
            const left = writeExpression(expression.left, wctx);
            const right = writeExpression(expression.right, wctx);
            const tempStat = '$$' + getNextTempId();

            switch (expression.op) {
                case '+':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: wrapAsPlayerStat(left),
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.INCREMENT,
                        stat: tempStat,
                        value: wrapAsPlayerStat(right),
                    });
                    break;
                case '-':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: wrapAsPlayerStat(left),
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.DECREMENT,
                        stat: tempStat,
                        value: wrapAsPlayerStat(right),
                    });
                    break;
                case '*':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: wrapAsPlayerStat(left),
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.MULTIPLY,
                        stat: tempStat,
                        value: wrapAsPlayerStat(right),
                    });
                    break;
                case '/':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: wrapAsPlayerStat(left),
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.DIVIDE,
                        stat: tempStat,
                        value: wrapAsPlayerStat(right),
                    });
                    break;
                case '&&':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: wrapAsPlayerStat(left),
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.MULTIPLY,
                        stat: tempStat,
                        value: wrapAsPlayerStat(right),
                    });
                    break;
                case '||': {
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: wrapAsPlayerStat(left),
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.INCREMENT,
                        stat: tempStat,
                        value: wrapAsPlayerStat(right),
                    });
                    const tempStat2 = '$$' + getNextTempId();
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat2,
                        value: wrapAsPlayerStat(left),
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.MULTIPLY,
                        stat: tempStat2,
                        value: wrapAsPlayerStat(right),
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.DECREMENT,
                        stat: tempStat,
                        value: wrapAsPlayerStat(tempStat2),
                    });
                    break;
                }
                case '==':
                case '!=':
                case '<':
                case '<=':
                case '>':
                case '>=':
                    wctx.actions.push({
                        kind: ActionKind.CONDITIONAL,
                        conditions: [
                            {
                                kind: ConditionKind.PLAYER_STAT,
                                stat: left,
                                mode:
                                    expression.op === '==' ||
                                    expression.op === '!='
                                        ? StatCompareMode.EQUAL
                                        : expression.op === '>'
                                          ? StatCompareMode.GREATER_THAN
                                          : expression.op === '>='
                                            ? StatCompareMode.GREATER_THAN_OR_EQUAL
                                            : expression.op === '<'
                                              ? StatCompareMode.LESS_THAN
                                              : StatCompareMode.LESS_THAN_OR_EQUAL,
                                value: wrapAsPlayerStat(right),
                            },
                        ],
                        matchAny: false,
                        then: [
                            {
                                kind: ActionKind.CHANGE_PLAYER_STAT,
                                stat: tempStat,
                                mode: StatChangeMode.SET,
                                value: expression.op === '!=' ? '0' : '1',
                            },
                        ],
                        else: [
                            {
                                kind: ActionKind.CHANGE_PLAYER_STAT,
                                stat: tempStat,
                                mode: StatChangeMode.SET,
                                value: expression.op === '!=' ? '1' : '0',
                            },
                        ],
                    });
            }
            return tempStat;
        }
    }
}

export function writeStatement(statement: AstStatement, wctx: WriterContext) {
    switch (statement.kind) {
        case 'statementLet':
            wctx.actions.push({
                kind: ActionKind.CHANGE_PLAYER_STAT,
                mode: StatChangeMode.SET,
                stat: '$' + statement.name.name,
                value: wrapAsPlayerStat(writeExpression(statement.value, wctx)),
            });
            break;
        case 'statementAssign':
            if (statement.lvalue.kind === 'expressionId') {
                wctx.actions.push({
                    kind: ActionKind.CHANGE_PLAYER_STAT,
                    mode: StatChangeMode.SET,
                    stat: '$' + statement.lvalue.name.name,
                    value: wrapAsPlayerStat(
                        writeExpression(statement.value, wctx),
                    ),
                });
            } else if (statement.lvalue.kind === 'expressionField') {
                if (statement.lvalue.struct.kind === 'expressionId') {
                    if (statement.lvalue.struct.name.name === 'global') {
                        wctx.actions.push({
                            kind: ActionKind.CHANGE_GLOBAL_STAT,
                            mode: StatChangeMode.SET,
                            stat: statement.lvalue.field.name,
                            value: wrapAsGlobalStat(
                                writeExpression(statement.value, wctx),
                            ),
                        });
                        break;
                    }
                    if (statement.lvalue.struct.name.name === 'player') {
                        wctx.actions.push({
                            kind: ActionKind.CHANGE_PLAYER_STAT,
                            mode: StatChangeMode.SET,
                            stat: statement.lvalue.field.name,
                            value: wrapAsPlayerStat(
                                writeExpression(statement.value, wctx),
                            ),
                        });
                        break;
                    }
                }
                wctx.actions.push({
                    kind: ActionKind.CHANGE_PLAYER_STAT,
                    mode: StatChangeMode.SET,
                    stat: '$' + resolveStructPath(statement.lvalue).join('.'),
                    value: wrapAsPlayerStat(
                        writeExpression(statement.value, wctx),
                    ),
                });
            } else {
                // must never happen
                throw new Error('Invalid lvalue');
            }
            break;
        case 'statementExpression':
            writeExpression(statement.expression, wctx);
            break;
        case 'statementIf': {
            const condition = writeExpression(statement.condition, wctx);

            const thenWctx: WriterContext = {
                actions: [],
                globalStats: wctx.globalStats,
                playerStats: wctx.playerStats,
                ctx: wctx.ctx,
            };
            for (const thenStatement of statement.then) {
                writeStatement(thenStatement, thenWctx);
            }

            const elseWctx: WriterContext = {
                actions: [],
                globalStats: wctx.globalStats,
                playerStats: wctx.playerStats,
                ctx: wctx.ctx,
            };
            if (statement.else) {
                for (const elseStatement of statement.else) {
                    writeStatement(elseStatement, elseWctx);
                }
            }

            wctx.actions.push({
                kind: ActionKind.CONDITIONAL,
                conditions: [
                    {
                        kind: ConditionKind.PLAYER_STAT,
                        stat: condition,
                        mode: StatCompareMode.EQUAL,
                        value: '1',
                    },
                ],
                matchAny: false,
                then: thenWctx.actions,
                else: elseWctx.actions,
            });
            break;
        }
    }
}

export function writeHandler(
    ast: AstHandler,
    wctx: WriterContext,
): CompiledHandler {
    if (!(ast.event.name in EventType)) {
        // must never happen
        throw new Error(`Unknown event type: ${ast.event.name}`);
    }

    for (const item of ast.statements) {
        writeStatement(item, wctx);
    }

    return {
        kind: 'handler',
        event: ast.event.name as EventType,
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
            resetTempId();
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
        resetTempId();
        houses.push(writeHouse(item, ctx));
    }

    return {
        kind: 'module',
        houses,
    };
}

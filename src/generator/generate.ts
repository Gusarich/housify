import { ConstantEvaluationError, InternalError } from '../errors';
import {
    AstExpression,
    AstHandler,
    AstHouse,
    AstModule,
    AstStatement,
    getAstNodeById,
    SourceLocation,
} from '../grammar/ast';
import { Action, ActionKind } from '../housing/actions';
import { ConditionKind } from '../housing/conditions';
import { EventType } from '../housing/events';
import { StatCompareMode, StatChangeMode } from '../housing/util';
import { CompilerContext } from '../resolver/context';
import { resolveStructPath } from '../resolver/resolve';
import { evaluateConstantExpression } from './evaluate';

export class WriterContext {
    actions: Action[];
    globalStats: Map<string, number>;
    playerStats: Map<string, number>;
    usedStats: Set<string>;
    statsMapping: Map<string, string>;
    ctx: CompilerContext;

    constructor(ctx: CompilerContext) {
        this.actions = [];
        this.globalStats = new Map();
        this.playerStats = new Map();
        this.usedStats = new Set();
        this.statsMapping = new Map();
        this.ctx = ctx;
    }

    clone() {
        const wctx = new WriterContext(this.ctx);
        wctx.actions = [...this.actions];
        wctx.globalStats = new Map(this.globalStats);
        wctx.playerStats = new Map(this.playerStats);
        wctx.usedStats = new Set(this.usedStats);
        wctx.statsMapping = new Map(this.statsMapping);
        return wctx;
    }

    mapStatName(stat: string) {
        const mappedStat = this.statsMapping.get(stat);
        return mappedStat ?? '$' + stat;
    }
}

export function wrapAsPlayerStat(stat: string) {
    return '%stat.player/' + stat + '%';
}

export function wrapAsGlobalStat(stat: string) {
    return '%stat.global/' + stat + '%';
}

export function isStatReference(stat: string) {
    return stat.startsWith('%stat.player/') || stat.startsWith('%stat.global/');
}

export function isGlobalStatReference(stat: string) {
    return stat.startsWith('%stat.global/');
}

export function unwrapStatReference(stat: string, location?: SourceLocation) {
    if (!isStatReference(stat)) {
        throw new InternalError('Not a stat reference', location);
    }
    return stat.slice(13, -1);
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
    ctx: CompilerContext,
    wctx: WriterContext,
): string {
    try {
        const result = evaluateConstantExpression(expression, ctx);
        const tempStat = '$$' + getNextTempId();
        wctx.usedStats.add(tempStat);
        wctx.actions.push({
            kind: ActionKind.CHANGE_PLAYER_STAT,
            mode: StatChangeMode.SET,
            stat: tempStat,
            value: result,
        });
        return wrapAsPlayerStat(tempStat);
    } catch (e) {
        if (e instanceof ConstantEvaluationError && e.fatal) {
            throw e;
        }
    }

    switch (expression.kind) {
        case 'integerLiteral': {
            const tempStat = '$$' + getNextTempId();
            wctx.usedStats.add(tempStat);
            wctx.actions.push({
                kind: ActionKind.CHANGE_PLAYER_STAT,
                mode: StatChangeMode.SET,
                stat: tempStat,
                value: expression.value,
            });
            return wrapAsPlayerStat(tempStat);
        }
        case 'booleanLiteral': {
            const tempStat = '$$' + getNextTempId();
            wctx.usedStats.add(tempStat);
            wctx.actions.push({
                kind: ActionKind.CHANGE_PLAYER_STAT,
                mode: StatChangeMode.SET,
                stat: tempStat,
                value: expression.value ? '1' : '0',
            });
            return wrapAsPlayerStat(tempStat);
        }
        case 'expressionId': {
            return wrapAsPlayerStat(wctx.mapStatName(expression.name.name));
        }
        case 'expressionField':
            if (expression.struct.kind === 'expressionId') {
                if (expression.struct.name.name === 'global') {
                    return wrapAsGlobalStat(expression.field.name);
                } else if (expression.struct.name.name === 'player') {
                    return wrapAsPlayerStat(expression.field.name);
                }
            }
            return wrapAsPlayerStat(
                resolveStructPath(expression, wctx).join('.'),
            );

        case 'expressionUnary': {
            const operand = writeExpression(expression.operand, ctx, wctx);
            const tempStat = '$$' + getNextTempId();
            wctx.usedStats.add(tempStat);

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
                        value: operand,
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
                        value: operand,
                    });
                    break;
                }
            }
            return wrapAsPlayerStat(tempStat);
        }
        case 'expressionBinary': {
            const left = writeExpression(expression.left, ctx, wctx);
            const right = writeExpression(expression.right, ctx, wctx);
            const tempStat = '$$' + getNextTempId();
            wctx.usedStats.add(tempStat);

            switch (expression.op) {
                case '+':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: left,
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.INCREMENT,
                        stat: tempStat,
                        value: right,
                    });
                    break;
                case '-':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: left,
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.DECREMENT,
                        stat: tempStat,
                        value: right,
                    });
                    break;
                case '*':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: left,
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.MULTIPLY,
                        stat: tempStat,
                        value: right,
                    });
                    break;
                case '/':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: left,
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.DIVIDE,
                        stat: tempStat,
                        value: right,
                    });
                    break;
                case '&&':
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: left,
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.MULTIPLY,
                        stat: tempStat,
                        value: right,
                    });
                    break;
                case '||': {
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat,
                        value: left,
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.INCREMENT,
                        stat: tempStat,
                        value: right,
                    });
                    const tempStat2 = '$$' + getNextTempId();
                    wctx.usedStats.add(tempStat2);
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.SET,
                        stat: tempStat2,
                        value: left,
                    });
                    wctx.actions.push({
                        kind: ActionKind.CHANGE_PLAYER_STAT,
                        mode: StatChangeMode.MULTIPLY,
                        stat: tempStat2,
                        value: right,
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
                                kind: isGlobalStatReference(left)
                                    ? ConditionKind.GLOBAL_STAT
                                    : ConditionKind.PLAYER_STAT,
                                stat: unwrapStatReference(
                                    left,
                                    expression.left.source,
                                ),
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
                                value: right,
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
            return wrapAsPlayerStat(tempStat);
        }
        case 'expressionCall': {
            const func = ctx.getInlineFunction(expression.function.name);
            if (!func) {
                throw new InternalError(
                    `Function not found: ${expression.function.name}`,
                    expression.source,
                );
            }

            const callWctx = wctx.clone();

            const statsMapping = new Map(wctx.statsMapping);

            for (const [index, arg] of expression.arguments.entries()) {
                const argStat = '$$' + getNextTempId();
                const value = writeExpression(arg, ctx, callWctx);
                callWctx.usedStats.add(argStat);
                statsMapping.set(func.parameters[index]!.name, argStat);
                callWctx.actions.push({
                    kind: ActionKind.CHANGE_PLAYER_STAT,
                    mode: StatChangeMode.SET,
                    stat: argStat,
                    value,
                });
            }

            callWctx.statsMapping = statsMapping;

            const ast = getAstNodeById(func.astId);
            if (!ast || ast.kind !== 'function') {
                throw new InternalError(
                    `Invalid function AST with ID ${func.astId}: ${ast?.kind}`,
                    expression.source,
                );
            }

            const returnStat = '$$' + getNextTempId();
            callWctx.usedStats.add(returnStat);
            for (const statement of ast.statements) {
                writeStatement(statement, returnStat, ctx, callWctx);
            }

            wctx.actions = [...callWctx.actions];
            wctx.usedStats = new Set(callWctx.usedStats);

            return wrapAsPlayerStat(returnStat);
        }
    }
}

export function writeStatement(
    statement: AstStatement,
    returnStat: string | null,
    ctx: CompilerContext,
    wctx: WriterContext,
) {
    switch (statement.kind) {
        case 'statementLet': {
            const stat = '$' + statement.name.name;
            wctx.usedStats.add(stat);
            const value = writeExpression(statement.value, ctx, wctx);
            wctx.actions.push({
                kind: ActionKind.CHANGE_PLAYER_STAT,
                mode: StatChangeMode.SET,
                stat,
                value,
            });
            break;
        }
        case 'statementAssign':
        case 'statementAugmentedAssign': {
            const mode =
                statement.kind === 'statementAssign'
                    ? StatChangeMode.SET
                    : statement.op === '+'
                      ? StatChangeMode.INCREMENT
                      : statement.op === '-'
                        ? StatChangeMode.DECREMENT
                        : statement.op === '*'
                          ? StatChangeMode.MULTIPLY
                          : statement.op === '/'
                            ? StatChangeMode.DIVIDE
                            : StatChangeMode.SET;
            if (statement.lvalue.kind === 'expressionId') {
                wctx.actions.push({
                    kind: ActionKind.CHANGE_PLAYER_STAT,
                    mode,
                    stat: wctx.mapStatName(statement.lvalue.name.name),
                    value: writeExpression(statement.value, ctx, wctx),
                });
            } else if (statement.lvalue.kind === 'expressionField') {
                if (statement.lvalue.struct.kind === 'expressionId') {
                    if (statement.lvalue.struct.name.name === 'global') {
                        wctx.actions.push({
                            kind: ActionKind.CHANGE_GLOBAL_STAT,
                            mode,
                            stat: statement.lvalue.field.name,
                            value: writeExpression(statement.value, ctx, wctx),
                        });
                        break;
                    }
                    if (statement.lvalue.struct.name.name === 'player') {
                        wctx.actions.push({
                            kind: ActionKind.CHANGE_PLAYER_STAT,
                            mode,
                            stat: statement.lvalue.field.name,
                            value: writeExpression(statement.value, ctx, wctx),
                        });
                        break;
                    }
                }
                wctx.actions.push({
                    kind: ActionKind.CHANGE_PLAYER_STAT,
                    mode,
                    stat: resolveStructPath(statement.lvalue, wctx).join('.'),
                    value: writeExpression(statement.value, ctx, wctx),
                });
            } else {
                throw new InternalError('Invalid lvalue', statement.source);
            }
            break;
        }
        case 'statementExpression':
            writeExpression(statement.expression, ctx, wctx);
            break;
        case 'statementIf': {
            const condition = writeExpression(statement.condition, ctx, wctx);

            const thenWctx = wctx.clone();
            for (const thenStatement of statement.then) {
                writeStatement(thenStatement, returnStat, ctx, thenWctx);
            }
            wctx.usedStats = new Set(thenWctx.usedStats);

            const elseWctx = wctx.clone();
            if (statement.else) {
                for (const elseStatement of statement.else) {
                    writeStatement(elseStatement, returnStat, ctx, elseWctx);
                }
            }
            wctx.usedStats = new Set(elseWctx.usedStats);

            wctx.actions.push({
                kind: ActionKind.CONDITIONAL,
                conditions: [
                    {
                        kind: isGlobalStatReference(condition)
                            ? ConditionKind.GLOBAL_STAT
                            : ConditionKind.PLAYER_STAT,
                        stat: unwrapStatReference(
                            condition,
                            statement.condition.source,
                        ),
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
        case 'statementReturn':
            if (returnStat && statement.expression) {
                wctx.actions.push({
                    kind: ActionKind.CHANGE_PLAYER_STAT,
                    mode: StatChangeMode.SET,
                    stat: returnStat,
                    value: writeExpression(statement.expression, ctx, wctx),
                });
            }
            break;
    }
}

export function writeHandler(
    ast: AstHandler,
    ctx: CompilerContext,
    wctx: WriterContext,
): CompiledHandler {
    if (!(ast.event.name in EventType)) {
        throw new InternalError(
            `Invalid event type: ${ast.event.name}`,
            ast.event.source,
        );
    }

    for (const item of ast.statements) {
        writeStatement(item, null, ctx, wctx);
    }

    // Set all temp stats to 0
    for (const stat of wctx.usedStats) {
        wctx.actions.push({
            kind: ActionKind.CHANGE_PLAYER_STAT,
            mode: StatChangeMode.SET,
            stat,
            value: '0',
        });
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
        throw new InternalError(
            `House not found: ${ast.name.name}`,
            ast.name.source,
        );
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
            handlers.push(writeHandler(item, ctx, new WriterContext(ctx)));
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
        if (item.kind === 'house') {
            houses.push(writeHouse(item, ctx));
        }
    }

    return {
        kind: 'module',
        houses,
    };
}

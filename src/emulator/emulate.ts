import { EmulationError } from '../errors';
import {
    CompiledHouse,
    isGlobalStatReference,
    isStatReference,
    unwrapStatReference,
} from '../generator/generate';
import { Action, ActionKind } from '../housing/actions';
import { Condition, ConditionKind } from '../housing/conditions';
import { EventType } from '../housing/events';
import { StatChangeMode, StatCompareMode } from '../housing/util';

export class EmulatedHouse {
    handlers: Map<EventType, Action[]> = new Map();
    #globalStats: Map<string, number> = new Map();
    #playerStats: Map<string, Map<string, number>> = new Map();
    #uncollectedActions: Action[] = [];

    constructor(house: CompiledHouse) {
        for (const handler of house.handlers) {
            this.handlers.set(handler.event, handler.actions);
        }
    }

    reset() {
        this.#globalStats.clear();
        this.#playerStats.clear();
        this.#uncollectedActions = [];
    }

    emit(event: EventType, player: string) {
        if (!this.handlers.has(event)) {
            return;
        }
        const actions = this.handlers.get(event)!;
        for (const action of actions) {
            this.processAction(action, player);
        }
    }

    collect(): Action[] {
        const actions = this.#uncollectedActions;
        this.#uncollectedActions = [];
        return actions;
    }

    globalStat(stat: string): number {
        return this.#globalStats.get(stat) ?? 0;
    }

    playerStat(player: string, stat: string): number {
        return this.#playerStats.get(player)?.get(stat) ?? 0;
    }

    getValue(value: string, player: string) {
        if (isStatReference(value)) {
            const unwrapped = unwrapStatReference(value);
            if (isGlobalStatReference(value)) {
                return this.globalStat(unwrapped).toString();
            } else {
                return this.playerStat(player, unwrapped).toString();
            }
        }
        return value;
    }

    processAction(action: Action, player: string) {
        switch (action.kind) {
            case ActionKind.CHANGE_GLOBAL_STAT:
                this.changeGlobalStat(
                    player,
                    action.stat,
                    action.mode,
                    action.value,
                );
                break;
            case ActionKind.CHANGE_PLAYER_STAT:
                this.changePlayerStat(
                    player,
                    action.stat,
                    action.mode,
                    action.value,
                );
                break;
            case ActionKind.CONDITIONAL: {
                const results = action.conditions.map((condition) =>
                    this.checkCondition(condition, player),
                );
                if (
                    (action.matchAny && results.some((result) => result)) ||
                    (!action.matchAny && results.every((result) => result))
                ) {
                    for (const thenAction of action.then) {
                        this.processAction(thenAction, player);
                    }
                } else {
                    for (const elseAction of action.else) {
                        this.processAction(elseAction, player);
                    }
                }
                break;
            }
            default:
                this.#uncollectedActions.push(action);
        }
    }

    checkCondition(condition: Condition, player: string) {
        switch (condition.kind) {
            case ConditionKind.GLOBAL_STAT:
                return this.compareGlobalStat(
                    player,
                    condition.stat,
                    condition.mode,
                    condition.value,
                );
            case ConditionKind.PLAYER_STAT:
                return this.comparePlayerStat(
                    player,
                    condition.stat,
                    condition.mode,
                    condition.value,
                );
            default:
                throw new EmulationError(
                    `Unsupported condition: '${condition.kind}'`,
                );
        }
    }

    changeGlobalStat(
        player: string,
        stat: string,
        mode: StatChangeMode,
        value: string,
    ) {
        if (!this.#globalStats.has(stat)) {
            this.#globalStats.set(stat, 0);
        }

        value = this.getValue(value, player);

        switch (mode) {
            case StatChangeMode.INCREMENT:
                this.#globalStats.set(
                    stat,
                    this.#globalStats.get(stat)! + parseInt(value),
                );
                break;
            case StatChangeMode.DECREMENT:
                this.#globalStats.set(
                    stat,
                    this.#globalStats.get(stat)! - parseInt(value),
                );
                break;
            case StatChangeMode.SET:
                this.#globalStats.set(stat, parseInt(value));
                break;
            case StatChangeMode.MULTIPLY:
                this.#globalStats.set(
                    stat,
                    this.#globalStats.get(stat)! * parseInt(value),
                );
                break;
            case StatChangeMode.DIVIDE:
                this.#globalStats.set(
                    stat,
                    Math.trunc(this.#globalStats.get(stat)! / parseInt(value)),
                );
                break;
        }
    }

    changePlayerStat(
        player: string,
        stat: string,
        mode: StatChangeMode,
        value: string,
    ) {
        if (!this.#playerStats.has(player)) {
            this.#playerStats.set(player, new Map());
        }

        if (!this.#playerStats.get(player)!.has(stat)) {
            this.#playerStats.get(player)!.set(stat, 0);
        }

        value = this.getValue(value, player);

        switch (mode) {
            case StatChangeMode.INCREMENT:
                this.#playerStats
                    .get(player)!
                    .set(
                        stat,
                        this.#playerStats.get(player)!.get(stat)! +
                            parseInt(value),
                    );
                break;
            case StatChangeMode.DECREMENT:
                this.#playerStats
                    .get(player)!
                    .set(
                        stat,
                        this.#playerStats.get(player)!.get(stat)! -
                            parseInt(value),
                    );
                break;
            case StatChangeMode.SET:
                this.#playerStats.get(player)!.set(stat, parseInt(value));
                break;
            case StatChangeMode.MULTIPLY:
                this.#playerStats
                    .get(player)!
                    .set(
                        stat,
                        this.#playerStats.get(player)!.get(stat)! *
                            parseInt(value),
                    );
                break;
            case StatChangeMode.DIVIDE:
                this.#playerStats
                    .get(player)!
                    .set(
                        stat,
                        Math.trunc(
                            this.#playerStats.get(player)!.get(stat)! /
                                parseInt(value),
                        ),
                    );
                break;
        }
    }

    compareGlobalStat(
        player: string,
        stat: string,
        mode: StatCompareMode,
        value: string,
    ) {
        value = this.getValue(value, player);

        switch (mode) {
            case StatCompareMode.EQUAL:
                return (this.#globalStats.get(stat) ?? 0) === parseInt(value);
            case StatCompareMode.GREATER_THAN:
                return (this.#globalStats.get(stat) ?? 0) > parseInt(value);
            case StatCompareMode.LESS_THAN:
                return (this.#globalStats.get(stat) ?? 0) < parseInt(value);
            case StatCompareMode.GREATER_THAN_OR_EQUAL:
                return (this.#globalStats.get(stat) ?? 0) >= parseInt(value);
            case StatCompareMode.LESS_THAN_OR_EQUAL:
                return (this.#globalStats.get(stat) ?? 0) <= parseInt(value);
        }
    }

    comparePlayerStat(
        player: string,
        stat: string,
        mode: StatCompareMode,
        value: string,
    ) {
        value = this.getValue(value, player);

        switch (mode) {
            case StatCompareMode.EQUAL:
                return (
                    (this.#playerStats.get(player)?.get(stat) ?? 0) ===
                    parseInt(value)
                );
            case StatCompareMode.GREATER_THAN:
                return (
                    (this.#playerStats.get(player)?.get(stat) ?? 0) >
                    parseInt(value)
                );
            case StatCompareMode.LESS_THAN:
                return (
                    (this.#playerStats.get(player)?.get(stat) ?? 0) <
                    parseInt(value)
                );
            case StatCompareMode.GREATER_THAN_OR_EQUAL:
                return (
                    (this.#playerStats.get(player)?.get(stat) ?? 0) >=
                    parseInt(value)
                );
            case StatCompareMode.LESS_THAN_OR_EQUAL:
                return (
                    (this.#playerStats.get(player)?.get(stat) ?? 0) <=
                    parseInt(value)
                );
        }
    }
}

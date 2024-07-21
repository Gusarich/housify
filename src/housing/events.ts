import { ConditionKind } from './conditions';
import { ActionKind } from './actions';

export enum EventType {
    JOIN = 'JOIN',
    QUIT = 'QUIT',
    DEATH = 'DEATH',
    KILL = 'KILL',
    RESPAWN = 'RESPAWN',
    GROUP_CHANGE = 'GROUP_CHANGE',
    PVP_STATE_CHANGE = 'PVP_STATE_CHANGE',
    FISH_CAUGHT = 'FISH_CAUGHT',
    PORTAL_USE = 'PORTAL_USE',
    DAMAGE = 'DAMAGE',
    BLOCK_BREAK = 'BLOCK_BREAK',
    PARKOUR_START = 'PARKOUR_START',
    PARKOUR_FINISH = 'PARKOUR_FINISH',
    DROP_ITEM = 'DROP_ITEM',
    PICKUP_ITEM = 'PICKUP_ITEM',
    CHANGE_HELD_ITEM = 'CHANGE_HELD_ITEM',
    TOGGLE_SNEAK = 'TOGGLE_SNEAK',
    TOGGLE_FLIGHT = 'TOGGLE_FLIGHT',
}

export type Event = {
    type: EventType;
    actions: ActionKind[];
    conditions: ConditionKind[];
};

const defaultActions = [
    ActionKind.CONDITIONAL,
    ActionKind.CHANGE_PLAYER_GROUP,
    ActionKind.FULL_HEAL,
    ActionKind.DISPLAY_TITLE,
    ActionKind.DISPLAY_ACTION_BAR,
    ActionKind.RESET_INVENTORY,
    ActionKind.CHANGE_MAX_HEALTH,
    ActionKind.PARKOUR_CHECKPOINT,
    ActionKind.GIVE_ITEM,
    ActionKind.REMOVE_ITEM,
    ActionKind.SEND_CHAT_MESSAGE,
    ActionKind.APPLY_POTION_EFFECT,
    ActionKind.CLEAR_POTION_EFFECTS,
    ActionKind.GIVE_EXP_LEVELS,
    ActionKind.CHANGE_PLAYER_STAT,
    ActionKind.CHANGE_GLOBAL_STAT,
    ActionKind.TELEPORT_PLAYER,
    ActionKind.FAIL_PARKOUR,
    ActionKind.PLAY_SOUND,
    ActionKind.SET_COMPASS_TARGET,
    ActionKind.SET_GAME_MODE,
    ActionKind.CHANGE_HEALTH,
    ActionKind.CHANGE_HUNGER_LEVEL,
    ActionKind.RANDOM_ACTION,
    ActionKind.TRIGGER_FUNCTION,
    ActionKind.APPLY_INVENTORY_LAYOUT,
    ActionKind.ENCHANT_HELD_ITEM,
    ActionKind.PAUSE_EXECUTION,
    ActionKind.SET_PLAYER_TEAM,
    ActionKind.CHANGE_TEAM_STAT,
    ActionKind.DISPLAY_MENU,
];

const defaultConditions = [
    ConditionKind.REQUIRED_GROUP,
    ConditionKind.PLAYER_STAT,
    ConditionKind.GLOBAL_STAT,
    ConditionKind.REQUIRED_PERMISSION,
    ConditionKind.WITHIN_REGION,
    ConditionKind.HAS_ITEM,
    ConditionKind.DOING_PARKOUR,
    ConditionKind.HAS_POTION_EFFECT,
    ConditionKind.SNEAKING,
    ConditionKind.FLYING,
    ConditionKind.HEALTH,
    ConditionKind.MAX_HEALTH,
    ConditionKind.HUNGER,
    ConditionKind.REQUIRED_GAMEMODE,
    ConditionKind.PLACEHOLDER_NUMBER,
    ConditionKind.REQUIRED_TEAM,
    ConditionKind.TEAM_STAT,
];

export const JoinEvent: Event = {
    type: EventType.JOIN,
    actions: [...defaultActions],
    conditions: [...defaultConditions],
};

export const QuitEvent: Event = {
    type: EventType.QUIT,
    actions: [
        ActionKind.CONDITIONAL,
        ActionKind.CHANGE_PLAYER_STAT,
        ActionKind.CHANGE_GLOBAL_STAT,
        ActionKind.RANDOM_ACTION,
        ActionKind.TRIGGER_FUNCTION,
        ActionKind.PAUSE_EXECUTION,
        ActionKind.CHANGE_TEAM_STAT,
    ],
    conditions: [...defaultConditions],
};

export const DeathEvent: Event = {
    type: EventType.DEATH,
    actions: [...defaultActions, ActionKind.CANCEL_EVENT],
    conditions: [...defaultConditions],
};

export const KillEvent: Event = {
    type: EventType.KILL,
    actions: [...defaultActions],
    conditions: [...defaultConditions],
};

export const RespawnEvent: Event = {
    type: EventType.RESPAWN,
    actions: [...defaultActions],
    conditions: [...defaultConditions],
};

export const GroupChangeEvent: Event = {
    type: EventType.GROUP_CHANGE,
    actions: [...defaultActions],
    conditions: [...defaultConditions],
};

export const PvpStateChangeEvent: Event = {
    type: EventType.PVP_STATE_CHANGE,
    actions: [...defaultActions],
    conditions: [...defaultConditions, ConditionKind.PVP_ENABLED],
};

export const FishCaughtEvent: Event = {
    type: EventType.FISH_CAUGHT,
    actions: [...defaultActions, ActionKind.CANCEL_EVENT],
    conditions: [...defaultConditions, ConditionKind.FISHING_ENVIRONMENT],
};

export const PortalUseEvent: Event = {
    type: EventType.PORTAL_USE,
    actions: [...defaultActions],
    conditions: [...defaultConditions, ConditionKind.PORTAL_TYPE],
};

export const DamageEvent: Event = {
    type: EventType.DAMAGE,
    actions: [...defaultActions, ActionKind.CANCEL_EVENT],
    conditions: [
        ...defaultConditions,
        ConditionKind.DAMAGE_CAUSE,
        ConditionKind.DAMAGE_AMOUNT,
    ],
};

export const BlockBreakEvent: Event = {
    type: EventType.BLOCK_BREAK,
    actions: [...defaultActions],
    conditions: [...defaultConditions, ConditionKind.BLOCK_TYPE],
};

export const ParkourStartEvent: Event = {
    type: EventType.PARKOUR_START,
    actions: [...defaultActions],
    conditions: [...defaultConditions],
};

export const ParkourFinishEvent: Event = {
    type: EventType.PARKOUR_FINISH,
    actions: [...defaultActions],
    conditions: [...defaultConditions],
};

export const DropItemEvent: Event = {
    type: EventType.DROP_ITEM,
    actions: [...defaultActions, ActionKind.CANCEL_EVENT],
    conditions: [...defaultConditions, ConditionKind.IS_ITEM],
};

export const PickupItemEvent: Event = {
    type: EventType.PICKUP_ITEM,
    actions: [...defaultActions, ActionKind.CANCEL_EVENT],
    conditions: [...defaultConditions, ConditionKind.IS_ITEM],
};

export const ChangeHeldItemEvent: Event = {
    type: EventType.CHANGE_HELD_ITEM,
    actions: [...defaultActions, ActionKind.CANCEL_EVENT],
    conditions: [...defaultConditions, ConditionKind.IS_ITEM],
};

export const ToggleSneakEvent: Event = {
    type: EventType.TOGGLE_SNEAK,
    actions: [...defaultActions, ActionKind.CANCEL_EVENT],
    conditions: [...defaultConditions],
};

export const ToggleFlightEvent: Event = {
    type: EventType.TOGGLE_FLIGHT,
    actions: [...defaultActions, ActionKind.CANCEL_EVENT],
    conditions: [...defaultConditions],
};

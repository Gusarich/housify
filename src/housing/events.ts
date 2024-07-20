import { ConditionType } from './conditions';
import { ActionType } from './actions';

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
    actions: ActionType[];
    conditions: ConditionType[];
};

const defaultActions = [
    ActionType.CONDITIONAL,
    ActionType.CHANGE_PLAYER_GROUP,
    ActionType.FULL_HEAL,
    ActionType.DISPLAY_TITLE,
    ActionType.DISPLAY_ACTION_BAR,
    ActionType.RESET_INVENTORY,
    ActionType.CHANGE_MAX_HEALTH,
    ActionType.PARKOUR_CHECKPOINT,
    ActionType.GIVE_ITEM,
    ActionType.REMOVE_ITEM,
    ActionType.SEND_CHAT_MESSAGE,
    ActionType.APPLY_POTION_EFFECT,
    ActionType.CLEAR_POTION_EFFECTS,
    ActionType.GIVE_EXP_LEVELS,
    ActionType.CHANGE_PLAYER_STAT,
    ActionType.CHANGE_GLOBAL_STAT,
    ActionType.TELEPORT_PLAYER,
    ActionType.FAIL_PARKOUR,
    ActionType.PLAY_SOUND,
    ActionType.SET_COMPASS_TARGET,
    ActionType.SET_GAME_MODE,
    ActionType.CHANGE_HEALTH,
    ActionType.CHANGE_HUNGER_LEVEL,
    ActionType.RANDOM_ACTION,
    ActionType.TRIGGER_FUNCTION,
    ActionType.APPLY_INVENTORY_LAYOUT,
    ActionType.ENCHANT_HELD_ITEM,
    ActionType.PAUSE_EXECUTION,
    ActionType.SET_PLAYER_TEAM,
    ActionType.CHANGE_TEAM_STAT,
    ActionType.DISPLAY_MENU,
];

const defaultConditions = [
    ConditionType.REQUIRED_GROUP,
    ConditionType.PLAYER_STAT,
    ConditionType.GLOBAL_STAT,
    ConditionType.REQUIRED_PERMISSION,
    ConditionType.WITHIN_REGION,
    ConditionType.HAS_ITEM,
    ConditionType.DOING_PARKOUR,
    ConditionType.HAS_POTION_EFFECT,
    ConditionType.SNEAKING,
    ConditionType.FLYING,
    ConditionType.HEALTH,
    ConditionType.MAX_HEALTH,
    ConditionType.HUNGER,
    ConditionType.REQUIRED_GAMEMODE,
    ConditionType.PLACEHOLDER_NUMBER,
    ConditionType.REQUIRED_TEAM,
    ConditionType.TEAM_STAT,
];

export const JoinEvent: Event = {
    type: EventType.JOIN,
    actions: [...defaultActions],
    conditions: [...defaultConditions],
};

export const QuitEvent: Event = {
    type: EventType.QUIT,
    actions: [
        ActionType.CONDITIONAL,
        ActionType.CHANGE_PLAYER_STAT,
        ActionType.CHANGE_GLOBAL_STAT,
        ActionType.RANDOM_ACTION,
        ActionType.TRIGGER_FUNCTION,
        ActionType.PAUSE_EXECUTION,
        ActionType.CHANGE_TEAM_STAT,
    ],
    conditions: [...defaultConditions],
};

export const DeathEvent: Event = {
    type: EventType.DEATH,
    actions: [...defaultActions, ActionType.CANCEL_EVENT],
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
    conditions: [...defaultConditions, ConditionType.PVP_ENABLED],
};

export const FishCaughtEvent: Event = {
    type: EventType.FISH_CAUGHT,
    actions: [...defaultActions, ActionType.CANCEL_EVENT],
    conditions: [...defaultConditions, ConditionType.FISHING_ENVIRONMENT],
};

export const PortalUseEvent: Event = {
    type: EventType.PORTAL_USE,
    actions: [...defaultActions],
    conditions: [...defaultConditions, ConditionType.PORTAL_TYPE],
};

export const DamageEvent: Event = {
    type: EventType.DAMAGE,
    actions: [...defaultActions, ActionType.CANCEL_EVENT],
    conditions: [
        ...defaultConditions,
        ConditionType.DAMAGE_CAUSE,
        ConditionType.DAMAGE_AMOUNT,
    ],
};

export const BlockBreakEvent: Event = {
    type: EventType.BLOCK_BREAK,
    actions: [...defaultActions],
    conditions: [...defaultConditions, ConditionType.BLOCK_TYPE],
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
    actions: [...defaultActions, ActionType.CANCEL_EVENT],
    conditions: [...defaultConditions, ConditionType.IS_ITEM],
};

export const PickupItemEvent: Event = {
    type: EventType.PICKUP_ITEM,
    actions: [...defaultActions, ActionType.CANCEL_EVENT],
    conditions: [...defaultConditions, ConditionType.IS_ITEM],
};

export const ChangeHeldItemEvent: Event = {
    type: EventType.CHANGE_HELD_ITEM,
    actions: [...defaultActions, ActionType.CANCEL_EVENT],
    conditions: [...defaultConditions, ConditionType.IS_ITEM],
};

export const ToggleSneakEvent: Event = {
    type: EventType.TOGGLE_SNEAK,
    actions: [...defaultActions, ActionType.CANCEL_EVENT],
    conditions: [...defaultConditions],
};

export const ToggleFlightEvent: Event = {
    type: EventType.TOGGLE_FLIGHT,
    actions: [...defaultActions, ActionType.CANCEL_EVENT],
    conditions: [...defaultConditions],
};

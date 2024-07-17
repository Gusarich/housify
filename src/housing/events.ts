import { ConditionType } from './conditions';
import { ActionType } from './actions';

//
// TODO: COMPLETE AND ENSURE TO MATCH ACTUAL TYPES
//

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
    cancellable: boolean;
    actions: ActionType[];
    conditions: ConditionType[];
};

export const JoinEvent: Event = {
    type: EventType.JOIN,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const QuitEvent: Event = {
    type: EventType.QUIT,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const DeathEvent: Event = {
    type: EventType.DEATH,
    cancellable: true,
    actions: [],
    conditions: [],
};

export const KillEvent: Event = {
    type: EventType.KILL,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const RespawnEvent: Event = {
    type: EventType.RESPAWN,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const GroupChangeEvent: Event = {
    type: EventType.GROUP_CHANGE,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const PvpStateChangeEvent: Event = {
    type: EventType.PVP_STATE_CHANGE,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const FishCaughtEvent: Event = {
    type: EventType.FISH_CAUGHT,
    cancellable: true,
    actions: [],
    conditions: [],
};

export const PortalUseEvent: Event = {
    type: EventType.PORTAL_USE,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const DamageEvent: Event = {
    type: EventType.DAMAGE,
    cancellable: true,
    actions: [],
    conditions: [],
};

export const BlockBreakEvent: Event = {
    type: EventType.BLOCK_BREAK,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const ParkourStartEvent: Event = {
    type: EventType.PARKOUR_START,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const ParkourFinishEvent: Event = {
    type: EventType.PARKOUR_FINISH,
    cancellable: false,
    actions: [],
    conditions: [],
};

export const DropItemEvent: Event = {
    type: EventType.DROP_ITEM,
    cancellable: true,
    actions: [],
    conditions: [],
};

export const PickupItemEvent: Event = {
    type: EventType.PICKUP_ITEM,
    cancellable: true,
    actions: [],
    conditions: [],
};

export const ChangeHeldItemEvent: Event = {
    type: EventType.CHANGE_HELD_ITEM,
    cancellable: true,
    actions: [],
    conditions: [],
};

export const ToggleSneakEvent: Event = {
    type: EventType.TOGGLE_SNEAK,
    cancellable: true,
    actions: [],
    conditions: [],
};

export const ToggleFlightEvent: Event = {
    type: EventType.TOGGLE_FLIGHT,
    cancellable: true,
    actions: [],
    conditions: [],
};

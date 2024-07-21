import { Condition } from './conditions';
import { Gamemode, StatMode } from './util';

export type Action =
    | ConditionalAction
    | CancelEventAction
    | ExitAction
    | ChangePlayerGroupAction
    | KillPlayerAction
    | FullHealAction
    | SetSpawnAction
    | DisplayTitleAction
    | DisplayActionBarAction
    | ResetInventoryAction
    | ChangeMaxHealthAction
    | ParkourCheckpointAction
    | GiveItemAction
    | RemoveItemAction
    | SendChatMessageAction
    | ApplyPotionEffectAction
    | ClearPotionEffectsAction
    | GiveExpLevelsAction
    | SendToLobbyAction
    | ChangePlayerStatAction
    | ChangeGlobalStatAction
    | TeleportPlayerAction
    | FailParkourAction
    | PlaySoundAction
    | SetCompassTargetAction
    | SetGamemodeAction
    | ChangeHealthAction
    | ChangeHungerLevelAction
    | RandomAction
    | UseHeldItemAction
    | TriggerFunctionAction
    | ApplyInventoryLayoutAction
    | EnchantHeldItemAction
    | PauseExecutionAction
    | SetPlayerTeamAction
    | ChangeTeamStatAction
    | DisplayMenuAction
    | CloseMenuAction;

export enum ActionKind {
    CONDITIONAL = 'CONDITIONAL',
    CANCEL_EVENT = 'CANCEL_EVENT',
    EXIT = 'EXIT',
    CHANGE_PLAYER_GROUP = 'CHANGE_PLAYER_GROUP',
    KILL_PLAYER = 'KILL_PLAYER',
    FULL_HEAL = 'FULL_HEAL',
    SET_SPAWN = 'SET_SPAWN',
    DISPLAY_TITLE = 'DISPLAY_TITLE',
    DISPLAY_ACTION_BAR = 'DISPLAY_ACTION_BAR',
    RESET_INVENTORY = 'RESET_INVENTORY',
    CHANGE_MAX_HEALTH = 'CHANGE_MAX_HEALTH',
    PARKOUR_CHECKPOINT = 'PARKOUR_CHECKPOINT',
    GIVE_ITEM = 'GIVE_ITEM',
    REMOVE_ITEM = 'REMOVE_ITEM',
    SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE',
    APPLY_POTION_EFFECT = 'APPLY_POTION_EFFECT',
    CLEAR_POTION_EFFECTS = 'CLEAR_POTION_EFFECTS',
    GIVE_EXP_LEVELS = 'GIVE_EXP_LEVELS',
    SEND_TO_LOBBY = 'SEND_TO_LOBBY',
    CHANGE_PLAYER_STAT = 'CHANGE_PLAYER_STAT',
    CHANGE_GLOBAL_STAT = 'CHANGE_GLOBAL_STAT',
    TELEPORT_PLAYER = 'TELEPORT_PLAYER',
    FAIL_PARKOUR = 'FAIL_PARKOUR',
    PLAY_SOUND = 'PLAY_SOUND',
    SET_COMPASS_TARGET = 'SET_COMPASS_TARGET',
    SET_GAME_MODE = 'SET_GAME_MODE',
    CHANGE_HEALTH = 'CHANGE_HEALTH',
    CHANGE_HUNGER_LEVEL = 'CHANGE_HUNGER_LEVEL',
    RANDOM_ACTION = 'RANDOM_ACTION',
    USE_HELD_ITEM = 'USE_HELD_ITEM',
    TRIGGER_FUNCTION = 'TRIGGER_FUNCTION',
    APPLY_INVENTORY_LAYOUT = 'APPLY_INVENTORY_LAYOUT',
    ENCHANT_HELD_ITEM = 'ENCHANT_HELD_ITEM',
    PAUSE_EXECUTION = 'PAUSE_EXECUTION',
    SET_PLAYER_TEAM = 'SET_PLAYER_TEAM',
    CHANGE_TEAM_STAT = 'CHANGE_TEAM_STAT',
    DISPLAY_MENU = 'DISPLAY_MENU',
    CLOSE_MENU = 'CLOSE_MENU',
}

export type ConditionalAction = {
    kind: ActionKind.CONDITIONAL;
    conditions: Condition[];
    matchAny: boolean;
    then: Action[];
    else: Action[];
};

export type CancelEventAction = {
    kind: ActionKind.CANCEL_EVENT;
};

export type ExitAction = {
    kind: ActionKind.EXIT;
};

export type ChangePlayerGroupAction = {
    kind: ActionKind.CHANGE_PLAYER_GROUP;
    group: string;
    demotionProtection: boolean;
};

export type KillPlayerAction = {
    kind: ActionKind.KILL_PLAYER;
};

export type FullHealAction = {
    kind: ActionKind.FULL_HEAL;
};

export type SetSpawnAction = {
    kind: ActionKind.SET_SPAWN;
};

export type DisplayTitleAction = {
    kind: ActionKind.DISPLAY_TITLE;
    title: string;
    subtitle: string;
    fadein: number;
    stay: number;
    fadeout: number;
};

export type DisplayActionBarAction = {
    kind: ActionKind.DISPLAY_ACTION_BAR;
    message: string;
};

export type ResetInventoryAction = {
    kind: ActionKind.RESET_INVENTORY;
};

export type ChangeMaxHealthAction = {
    kind: ActionKind.CHANGE_MAX_HEALTH;
    value: string;
    mode: StatMode;
    healOnChange: boolean;
};

export type ParkourCheckpointAction = {
    kind: ActionKind.PARKOUR_CHECKPOINT;
};

export type GiveItemAction = {
    kind: ActionKind.GIVE_ITEM;
    item: string;
    allowMultiple: boolean;
    slot: number;
    replace: boolean;
};

export type RemoveItemAction = {
    kind: ActionKind.REMOVE_ITEM;
    item: string;
};

export type SendChatMessageAction = {
    kind: ActionKind.SEND_CHAT_MESSAGE;
    message: string;
};

export type ApplyPotionEffectAction = {
    kind: ActionKind.APPLY_POTION_EFFECT;
    effect: string; // TODO: make an enum with all effects
    duration: number;
    level: number;
    override: boolean;
};

export type ClearPotionEffectsAction = {
    kind: ActionKind.CLEAR_POTION_EFFECTS;
};

export type GiveExpLevelsAction = {
    kind: ActionKind.GIVE_EXP_LEVELS;
    levels: number;
};

export type SendToLobbyAction = {
    kind: ActionKind.SEND_TO_LOBBY;
    location: string; // TODO: make an enum with all locations
};

export type ChangePlayerStatAction = {
    kind: ActionKind.CHANGE_PLAYER_STAT;
    stat: string;
    mode: StatMode;
    value: string;
};

export type ChangeGlobalStatAction = {
    kind: ActionKind.CHANGE_GLOBAL_STAT;
    stat: string;
    mode: StatMode;
    value: string;
};

export type TeleportPlayerAction = {
    kind: ActionKind.TELEPORT_PLAYER;
    location: Location;
};

export type FailParkourAction = {
    kind: ActionKind.FAIL_PARKOUR;
    reason: string;
};

export type PlaySoundAction = {
    kind: ActionKind.PLAY_SOUND;
    sound: string;
    volume: number;
    pitch: number;
    location: Location;
};

export type SetCompassTargetAction = {
    kind: ActionKind.SET_COMPASS_TARGET;
    location: Location;
};

export type SetGamemodeAction = {
    kind: ActionKind.SET_GAME_MODE;
    gamemode: Gamemode;
};

export type ChangeHealthAction = {
    kind: ActionKind.CHANGE_HEALTH;
    value: string;
    mode: StatMode;
};

export type ChangeHungerLevelAction = {
    kind: ActionKind.CHANGE_HUNGER_LEVEL;
    value: string;
    mode: StatMode;
};

export type RandomAction = {
    kind: ActionKind.RANDOM_ACTION;
    actions: Action[];
};

export type UseHeldItemAction = {
    kind: ActionKind.USE_HELD_ITEM;
};

export type TriggerFunctionAction = {
    kind: ActionKind.TRIGGER_FUNCTION;
    function: string;
    everyone: boolean;
};

export type ApplyInventoryLayoutAction = {
    kind: ActionKind.APPLY_INVENTORY_LAYOUT;
    layout: string;
};

export type EnchantHeldItemAction = {
    kind: ActionKind.ENCHANT_HELD_ITEM;
    enchantment: string; // TODO: make an enum with all enchantments
    level: number;
};

export type PauseExecutionAction = {
    kind: ActionKind.PAUSE_EXECUTION;
    ticks: number;
};

export type SetPlayerTeamAction = {
    kind: ActionKind.SET_PLAYER_TEAM;
    team: string;
};

export type ChangeTeamStatAction = {
    kind: ActionKind.CHANGE_TEAM_STAT;
    stat: string;
    mode: StatMode;
    value: string;
    team: string;
};

export type DisplayMenuAction = {
    kind: ActionKind.DISPLAY_MENU;
    menu: string;
};

export type CloseMenuAction = {
    kind: ActionKind.CLOSE_MENU;
};

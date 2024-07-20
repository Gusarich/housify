import { Condition } from './conditions';
import { Coordinates, GameMode, StatMode } from './util';

//
// TODO: COMPLETE AND ENSURE TO MATCH ACTUAL TYPES
//

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
    | SetGameModeAction
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

export enum ActionType {
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
    type: ActionType.CONDITIONAL;
    conditions: Condition[];
    match_any_condition: boolean;
    if_actions: Action[];
    else_actions: Action[];
};

export type CancelEventAction = {
    type: ActionType.CANCEL_EVENT;
};

export type ExitAction = {
    type: ActionType.EXIT;
};

export type ChangePlayerGroupAction = {
    type: ActionType.CHANGE_PLAYER_GROUP;
    group: string;
    demotion_protection: boolean;
};

export type KillPlayerAction = {
    type: ActionType.KILL_PLAYER;
};

export type FullHealAction = {
    type: ActionType.FULL_HEAL;
};

export type SetSpawnAction = {
    type: ActionType.SET_SPAWN;
};

export type DisplayTitleAction = {
    type: ActionType.DISPLAY_TITLE;
    title: string;
    subtitle: string;
    fadein: number;
    stay: number;
    fadeout: number;
};

export type DisplayActionBarAction = {
    type: ActionType.DISPLAY_ACTION_BAR;
    message: string;
};

export type ResetInventoryAction = {
    type: ActionType.RESET_INVENTORY;
};

export type ChangeMaxHealthAction = {
    type: ActionType.CHANGE_MAX_HEALTH;
    max_health: number;
    heal_on_change: boolean;
};

export type ParkourCheckpointAction = {
    type: ActionType.PARKOUR_CHECKPOINT;
};

export type GiveItemAction = {
    type: ActionType.GIVE_ITEM;
    item: string;
    allow_multiple: boolean;
    inventory_slot: number;
    replace_existing_item: boolean;
};

export type RemoveItemAction = {
    type: ActionType.REMOVE_ITEM;
    item: string;
};

export type SendChatMessageAction = {
    type: ActionType.SEND_CHAT_MESSAGE;
    message: string;
};

export type ApplyPotionEffectAction = {
    type: ActionType.APPLY_POTION_EFFECT;
    effect: number;
    level: number;
    duration: number;
    override_existing_effects: boolean;
};

export type ClearPotionEffectsAction = {
    type: ActionType.CLEAR_POTION_EFFECTS;
};

export type GiveExpLevelsAction = {
    type: ActionType.GIVE_EXP_LEVELS;
    levels: number;
};

export type SendToLobbyAction = {
    type: ActionType.SEND_TO_LOBBY;
    location: string;
};

export type ChangePlayerStatAction = {
    type: ActionType.CHANGE_PLAYER_STAT;
    mode: StatMode;
    stat: string;
    amount: string;
};

export type ChangeGlobalStatAction = {
    type: ActionType.CHANGE_GLOBAL_STAT;
    mode: StatMode;
    stat: string;
    amount: string;
};

export type TeleportPlayerAction = {
    type: ActionType.TELEPORT_PLAYER;
    location: Coordinates;
};

export type FailParkourAction = {
    type: ActionType.FAIL_PARKOUR;
    reason: string;
};

export type PlaySoundAction = {
    type: ActionType.PLAY_SOUND;
    sound: string;
    volume: number;
    pitch: number;
};

export type SetCompassTargetAction = {
    type: ActionType.SET_COMPASS_TARGET;
    location: Coordinates;
};

export type SetGameModeAction = {
    type: ActionType.SET_GAME_MODE;
    gamemode: GameMode;
};

export type ChangeHealthAction = {
    type: ActionType.CHANGE_HEALTH;
    health: number;
};

export type ChangeHungerLevelAction = {
    type: ActionType.CHANGE_HUNGER_LEVEL;
    hunger: number;
};

export type RandomAction = {
    type: ActionType.RANDOM_ACTION;
    actions: Action[];
};

export type UseHeldItemAction = {
    type: ActionType.USE_HELD_ITEM;
};

export type TriggerFunctionAction = {
    type: ActionType.TRIGGER_FUNCTION;
    function: string;
};

export type ApplyInventoryLayoutAction = {
    type: ActionType.APPLY_INVENTORY_LAYOUT;
    layout: string;
};

export type EnchantHeldItemAction = {
    type: ActionType.ENCHANT_HELD_ITEM;
    enchantment: number;
    level: number;
};

export type PauseExecutionAction = {
    type: ActionType.PAUSE_EXECUTION;
    ticks_to_wait: number;
};

export type SetPlayerTeamAction = {
    type: ActionType.SET_PLAYER_TEAM;
    team: string;
};

export type ChangeTeamStatAction = {
    type: ActionType.CHANGE_TEAM_STAT;
    stat: string;
    mode: StatMode;
    amount: string;
    team: string;
};

export type DisplayMenuAction = {
    type: ActionType.DISPLAY_MENU;
    menu: string;
};

export type CloseMenuAction = {
    type: ActionType.CLOSE_MENU;
};

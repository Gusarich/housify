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
    | KillAction
    | FullHealAction
    | SpawnAction
    | TitleAction
    | ActionBarAction
    | ResetInventoryAction
    | SetMaxHealthAction
    | ParkourCheckpointAction
    | GiveItemAction
    | RemoveItemAction
    | SendMessageAction
    | PotionEffectAction
    | ClearEffectsAction
    | GiveExpLevelsAction
    | SendToLobbyAction
    | ChangeStatAction
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
    | ApplyLayoutAction
    | EnchantHeldItemAction
    | PauseAction
    | SetPlayerTeamAction
    | ChangeTeamStatAction
    | DisplayMenuAction
    | CloseMenuAction;

export enum ActionType {
    CONDITIONAL = 'CONDITIONAL',
    CANCEL_EVENT = 'CANCEL_EVENT',
    EXIT = 'EXIT',
    CHANGE_PLAYER_GROUP = 'CHANGE_PLAYER_GROUP',
    KILL = 'KILL',
    FULL_HEAL = 'FULL_HEAL',
    SPAWN = 'SPAWN',
    TITLE = 'TITLE',
    ACTION_BAR = 'ACTION_BAR',
    RESET_INVENTORY = 'RESET_INVENTORY',
    SET_MAX_HEALTH = 'SET_MAX_HEALTH',
    PARKOUR_CHECKPOINT = 'PARKOUR_CHECKPOINT',
    GIVE_ITEM = 'GIVE_ITEM',
    REMOVE_ITEM = 'REMOVE_ITEM',
    SEND_MESSAGE = 'SEND_MESSAGE',
    POTION_EFFECT = 'POTION_EFFECT',
    CLEAR_EFFECTS = 'CLEAR_EFFECTS',
    GIVE_EXP_LEVELS = 'GIVE_EXP_LEVELS',
    SEND_TO_LOBBY = 'SEND_TO_LOBBY',
    CHANGE_STAT = 'CHANGE_STAT',
    CHANGE_GLOBAL_STAT = 'CHANGE_GLOBAL_STAT',
    TELEPORT_PLAYER = 'TELEPORT_PLAYER',
    FAIL_PARKOUR = 'FAIL_PARKOUR',
    PLAY_SOUND = 'PLAY_SOUND',
    SET_COMPASS_TARGET = 'SET_COMPASS_TARGET',
    SET_GAME_MODE = 'SET_GAME_MODE',
    SET_HEALTH = 'SET_HEALTH',
    SET_HUNGER_LEVEL = 'SET_HUNGER_LEVEL',
    RANDOM_ACTION = 'RANDOM_ACTION',
    USE_HELD_ITEM = 'USE_HELD_ITEM',
    TRIGGER_FUNCTION = 'TRIGGER_FUNCTION',
    APPLY_LAYOUT = 'APPLY_LAYOUT',
    ENCHANT_HELD_ITEM = 'ENCHANT_HELD_ITEM',
    PAUSE = 'PAUSE',
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

export type KillAction = {
    type: ActionType.KILL;
};

export type FullHealAction = {
    type: ActionType.FULL_HEAL;
};

export type SpawnAction = {
    type: ActionType.SPAWN;
};

export type TitleAction = {
    type: ActionType.TITLE;
    title: string;
    subtitle: string;
    fadein: number;
    stay: number;
    fadeout: number;
};

export type ActionBarAction = {
    type: ActionType.ACTION_BAR;
    message: string;
};

export type ResetInventoryAction = {
    type: ActionType.RESET_INVENTORY;
};

export type SetMaxHealthAction = {
    type: ActionType.SET_MAX_HEALTH;
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

export type SendMessageAction = {
    type: ActionType.SEND_MESSAGE;
    message: string;
};

export type PotionEffectAction = {
    type: ActionType.POTION_EFFECT;
    effect: number;
    level: number;
    duration: number;
    override_existing_effects: boolean;
};

export type ClearEffectsAction = {
    type: ActionType.CLEAR_EFFECTS;
};

export type GiveExpLevelsAction = {
    type: ActionType.GIVE_EXP_LEVELS;
    levels: number;
};

export type SendToLobbyAction = {
    type: ActionType.SEND_TO_LOBBY;
    location: string;
};

export type ChangeStatAction = {
    type: ActionType.CHANGE_STAT;
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
    type: ActionType.SET_HEALTH;
    health: number;
};

export type ChangeHungerLevelAction = {
    type: ActionType.SET_HUNGER_LEVEL;
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

export type ApplyLayoutAction = {
    type: ActionType.APPLY_LAYOUT;
    layout: string;
};

export type EnchantHeldItemAction = {
    type: ActionType.ENCHANT_HELD_ITEM;
    enchantment: number;
    level: number;
};

export type PauseAction = {
    type: ActionType.PAUSE;
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

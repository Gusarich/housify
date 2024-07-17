import { GameMode, StatMode } from './util';

//
// TODO: COMPLETE AND ENSURE TO MATCH ACTUAL TYPES
//

export type Condition =
    | InGroupCondition
    | PlayerStatCondition
    | GlobalStatCondition
    | HasPermissionCondition
    | InRegionCondition
    | HasItemCondition
    | InParkourCondition
    | PotionEffectCondition
    | SneakingCondition
    | FlyingCondition
    | HealthCondition
    | MaxHealthCondition
    | HungerLevelCondition
    | GameModeCondition
    | PlaceholderNumberCondition
    | InTeamCondition
    | TeamStatCondition;

export enum ConditionType {
    IN_GROUP = 'IN_GROUP',
    PLAYER_STAT = 'PLAYER_STAT',
    GLOBAL_STAT = 'GLOBAL_STAT',
    HAS_PERMISSION = 'HAS_PERMISSION',
    IN_REGION = 'IN_REGION',
    HAS_ITEM = 'HAS_ITEM',
    IN_PARKOUR = 'IN_PARKOUR',
    POTION_EFFECT = 'POTION_EFFECT',
    SNEAKING = 'SNEAKING',
    FLYING = 'FLYING',
    HEALTH = 'HEALTH',
    MAX_HEALTH = 'MAX_HEALTH',
    HUNGER_LEVEL = 'HUNGER_LEVEL',
    GAMEMODE = 'GAMEMODE',
    PLACEHOLDER_NUMBER = 'PLACEHOLDER_NUMBER',
    IN_TEAM = 'IN_TEAM',
    TEAM_STAT = 'TEAM_STAT',
    PVP_ENABLED = 'PVP_ENABLED',
    FISHING_ENVIRONMENT = 'FISHING_ENVIRONMENT',
    PORTAL_TYPE = 'PORTAL_TYPE',
    DAMAGE_CAUSE = 'DAMAGE_CAUSE',
    DAMAGE_AMOUNT = 'DAMAGE_AMOUNT',
    BLOCK_TYPE = 'BLOCK_TYPE',
    IS_ITEM = 'IS_ITEM',
}

export type InGroupCondition = {
    type: ConditionType.IN_GROUP;
    required_group: string;
    include_higher_groups: boolean;
};

export type PlayerStatCondition = {
    type: ConditionType.PLAYER_STAT;
    stat: string;
    mode: StatMode;
    amount: number;
};

export type GlobalStatCondition = {
    type: ConditionType.GLOBAL_STAT;
    stat: string;
    mode: StatMode;
    amount: number;
};

export type HasPermissionCondition = {
    type: ConditionType.HAS_PERMISSION;
    required_permission: string;
};

export type InRegionCondition = {
    type: ConditionType.IN_REGION;
    region: string;
};

export type HasItemCondition = {
    type: ConditionType.HAS_ITEM;
    item: string;
    what_to_check: 'Metadata' | 'AnotherOption'; // Adjust with actual options
    where_to_check: 'Anywhere' | 'AnotherOption'; // Adjust with actual options
    required_amount: 'Any' | number; // Adjust if there are more specific types
};

export type InParkourCondition = {
    type: ConditionType.IN_PARKOUR;
};

export type PotionEffectCondition = {
    type: ConditionType.POTION_EFFECT;
    effect: number;
};

export type SneakingCondition = {
    type: ConditionType.SNEAKING;
};

export type FlyingCondition = {
    type: ConditionType.FLYING;
};

export type HealthCondition = {
    type: ConditionType.HEALTH;
    mode: StatMode;
    amount: number;
};

export type MaxHealthCondition = {
    type: ConditionType.MAX_HEALTH;
    mode: StatMode;
    amount: number;
};

export type HungerLevelCondition = {
    type: ConditionType.HUNGER_LEVEL;
    mode: StatMode;
    amount: number;
};

export type GameModeCondition = {
    type: ConditionType.GAMEMODE;
    required_gamemode: GameMode;
};

export type PlaceholderNumberCondition = {
    type: ConditionType.PLACEHOLDER_NUMBER;
    placeholder: string;
    mode: StatMode;
    amount: number;
};

export type InTeamCondition = {
    type: ConditionType.IN_TEAM;
    required_team: string;
};

export type TeamStatCondition = {
    type: ConditionType.TEAM_STAT;
    stat: string;
    team: string;
    mode: StatMode;
    amount: number;
};

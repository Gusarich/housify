import { GameMode, StatMode } from './util';

//
// TODO: COMPLETE AND ENSURE TO MATCH ACTUAL TYPES
//

export type Condition =
    | RequiredGroupCondition
    | PlayerStatCondition
    | GlobalStatCondition
    | RequiredPermissionCondition
    | WithinRegionCondition
    | HasItemCondition
    | DoingParkourCondition
    | HasPotionEffectCondition
    | SneakingCondition
    | FlyingCondition
    | HealthCondition
    | MaxHealthCondition
    | HungerCondition
    | RequiredGamemodeCondition
    | PlaceholderNumberCondition
    | RequiredTeamCondition
    | TeamStatCondition;

export enum ConditionType {
    REQUIRED_GROUP = 'REQUIRED_GROUP',
    PLAYER_STAT = 'PLAYER_STAT',
    GLOBAL_STAT = 'GLOBAL_STAT',
    REQUIRED_PERMISSION = 'REQUIRED_PERMISSION',
    WITHIN_REGION = 'WITHIN_REGION',
    HAS_ITEM = 'HAS_ITEM',
    DOING_PARKOUR = 'DOING_PARKOUR',
    HAS_POTION_EFFECT = 'HAS_POTION_EFFECT',
    SNEAKING = 'SNEAKING',
    FLYING = 'FLYING',
    HEALTH = 'HEALTH',
    MAX_HEALTH = 'MAX_HEALTH',
    HUNGER = 'HUNGER',
    REQUIRED_GAMEMODE = 'REQUIRED_GAMEMODE',
    PLACEHOLDER_NUMBER = 'PLACEHOLDER_NUMBER',
    REQUIRED_TEAM = 'REQUIRED_TEAM',
    TEAM_STAT = 'TEAM_STAT',
    PVP_ENABLED = 'PVP_ENABLED',
    FISHING_ENVIRONMENT = 'FISHING_ENVIRONMENT',
    PORTAL_TYPE = 'PORTAL_TYPE',
    DAMAGE_CAUSE = 'DAMAGE_CAUSE',
    DAMAGE_AMOUNT = 'DAMAGE_AMOUNT',
    BLOCK_TYPE = 'BLOCK_TYPE',
    IS_ITEM = 'IS_ITEM',
}

export type RequiredGroupCondition = {
    type: ConditionType.REQUIRED_GROUP;
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

export type RequiredPermissionCondition = {
    type: ConditionType.REQUIRED_PERMISSION;
    required_permission: string;
};

export type WithinRegionCondition = {
    type: ConditionType.WITHIN_REGION;
    region: string;
};

export type HasItemCondition = {
    type: ConditionType.HAS_ITEM;
    item: string;
    what_to_check: 'Metadata' | 'AnotherOption'; // Adjust with actual options
    where_to_check: 'Anywhere' | 'AnotherOption'; // Adjust with actual options
    required_amount: 'Any' | number; // Adjust if there are more specific types
};

export type DoingParkourCondition = {
    type: ConditionType.DOING_PARKOUR;
};

export type HasPotionEffectCondition = {
    type: ConditionType.HAS_POTION_EFFECT;
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

export type HungerCondition = {
    type: ConditionType.HUNGER;
    mode: StatMode;
    amount: number;
};

export type RequiredGamemodeCondition = {
    type: ConditionType.REQUIRED_GAMEMODE;
    required_gamemode: GameMode;
};

export type PlaceholderNumberCondition = {
    type: ConditionType.PLACEHOLDER_NUMBER;
    placeholder: string;
    mode: StatMode;
    amount: number;
};

export type RequiredTeamCondition = {
    type: ConditionType.REQUIRED_TEAM;
    required_team: string;
};

export type TeamStatCondition = {
    type: ConditionType.TEAM_STAT;
    stat: string;
    team: string;
    mode: StatMode;
    amount: number;
};

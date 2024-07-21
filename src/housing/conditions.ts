import { Comparator, Gamemode } from './util';

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
    group: string;
    includeHigher: boolean;
};

export type PlayerStatCondition = {
    type: ConditionType.PLAYER_STAT;
    stat: string;
    mode: Comparator;
    value: string;
};

export type GlobalStatCondition = {
    type: ConditionType.GLOBAL_STAT;
    stat: string;
    mode: Comparator;
    value: string;
};

export type RequiredPermissionCondition = {
    type: ConditionType.REQUIRED_PERMISSION;
    permission: string; // TODO: make an enum with all permissions
};

export type WithinRegionCondition = {
    type: ConditionType.WITHIN_REGION;
    region: string;
};

export type HasItemCondition = {
    type: ConditionType.HAS_ITEM;
    item: string;
    what: 'ItemType' | 'Metadata';
    where: 'Hand' | 'Armor' | 'Hotbar' | 'Inventory' | 'Anywhere';
    amount: 'Any' | 'GreaterOrEqual';
};

export type DoingParkourCondition = {
    type: ConditionType.DOING_PARKOUR;
};

export type HasPotionEffectCondition = {
    type: ConditionType.HAS_POTION_EFFECT;
    effect: string; // TODO: make an enum with all effects
};

export type SneakingCondition = {
    type: ConditionType.SNEAKING;
};

export type FlyingCondition = {
    type: ConditionType.FLYING;
};

export type HealthCondition = {
    type: ConditionType.HEALTH;
    mode: Comparator;
    value: string;
};

export type MaxHealthCondition = {
    type: ConditionType.MAX_HEALTH;
    mode: Comparator;
    value: string;
};

export type HungerCondition = {
    type: ConditionType.HUNGER;
    mode: Comparator;
    value: string;
};

export type RequiredGamemodeCondition = {
    type: ConditionType.REQUIRED_GAMEMODE;
    gamemode: Gamemode;
};

export type PlaceholderNumberCondition = {
    type: ConditionType.PLACEHOLDER_NUMBER;
    placeholder: string;
    mode: Comparator;
    value: string;
};

export type RequiredTeamCondition = {
    type: ConditionType.REQUIRED_TEAM;
    team: string;
};

export type TeamStatCondition = {
    type: ConditionType.TEAM_STAT;
    stat: string;
    team: string;
    mode: Comparator;
    value: string;
};

export type PvpEnabledCondition = {
    type: ConditionType.PVP_ENABLED;
};

export type FishingEnvironmentCondition = {
    type: ConditionType.FISHING_ENVIRONMENT;
    environment: 'Water' | 'Lava';
};

export type PortalTypeCondition = {
    type: ConditionType.PORTAL_TYPE;
    portal: 'Nether' | 'End';
};

export type DamageCauseCondition = {
    type: ConditionType.DAMAGE_CAUSE;
    cause: string; // TODO: make an enum with all causes
};

export type DamageAmountCondition = {
    type: ConditionType.DAMAGE_AMOUNT;
    mode: Comparator;
    value: string;
};

export type BlockTypeCondition = {
    type: ConditionType.BLOCK_TYPE;
    item: string;
    matchTypeOnly: boolean;
};

export type IsItemCondition = {
    type: ConditionType.IS_ITEM;
    item: string;
    what: 'ItemType' | 'Metadata';
    where: 'Hand' | 'Armor' | 'Hotbar' | 'Inventory' | 'Anywhere';
    amount: 'Any' | 'GreaterOrEqual';
};

import {
    StatCompareMode,
    DamageCause,
    FishingEnvironment,
    Gamemode,
    ItemAmount,
    ItemLocation,
    ItemProperty,
    Permission,
    PortalType,
    PotionEffect,
} from './util';

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
    | TeamStatCondition
    | PvpEnabledCondition
    | FishingEnvironmentCondition
    | PortalTypeCondition
    | DamageCauseCondition
    | DamageAmountCondition
    | BlockTypeCondition
    | IsItemCondition;

export enum ConditionKind {
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
    kind: ConditionKind.REQUIRED_GROUP;
    group: string;
    includeHigher: boolean;
};

export type PlayerStatCondition = {
    kind: ConditionKind.PLAYER_STAT;
    stat: string;
    mode: StatCompareMode;
    value: string;
};

export type GlobalStatCondition = {
    kind: ConditionKind.GLOBAL_STAT;
    stat: string;
    mode: StatCompareMode;
    value: string;
};

export type RequiredPermissionCondition = {
    kind: ConditionKind.REQUIRED_PERMISSION;
    permission: Permission;
};

export type WithinRegionCondition = {
    kind: ConditionKind.WITHIN_REGION;
    region: string;
};

export type HasItemCondition = {
    kind: ConditionKind.HAS_ITEM;
    item: string;
    what: ItemProperty;
    where: ItemLocation;
    amount: ItemAmount;
};

export type DoingParkourCondition = {
    kind: ConditionKind.DOING_PARKOUR;
};

export type HasPotionEffectCondition = {
    kind: ConditionKind.HAS_POTION_EFFECT;
    effect: PotionEffect;
};

export type SneakingCondition = {
    kind: ConditionKind.SNEAKING;
};

export type FlyingCondition = {
    kind: ConditionKind.FLYING;
};

export type HealthCondition = {
    kind: ConditionKind.HEALTH;
    mode: StatCompareMode;
    value: string;
};

export type MaxHealthCondition = {
    kind: ConditionKind.MAX_HEALTH;
    mode: StatCompareMode;
    value: string;
};

export type HungerCondition = {
    kind: ConditionKind.HUNGER;
    mode: StatCompareMode;
    value: string;
};

export type RequiredGamemodeCondition = {
    kind: ConditionKind.REQUIRED_GAMEMODE;
    gamemode: Gamemode;
};

export type PlaceholderNumberCondition = {
    kind: ConditionKind.PLACEHOLDER_NUMBER;
    placeholder: string;
    mode: StatCompareMode;
    value: string;
};

export type RequiredTeamCondition = {
    kind: ConditionKind.REQUIRED_TEAM;
    team: string;
};

export type TeamStatCondition = {
    kind: ConditionKind.TEAM_STAT;
    stat: string;
    team: string;
    mode: StatCompareMode;
    value: string;
};

export type PvpEnabledCondition = {
    kind: ConditionKind.PVP_ENABLED;
};

export type FishingEnvironmentCondition = {
    kind: ConditionKind.FISHING_ENVIRONMENT;
    environment: FishingEnvironment;
};

export type PortalTypeCondition = {
    kind: ConditionKind.PORTAL_TYPE;
    portal: PortalType;
};

export type DamageCauseCondition = {
    kind: ConditionKind.DAMAGE_CAUSE;
    cause: DamageCause;
};

export type DamageAmountCondition = {
    kind: ConditionKind.DAMAGE_AMOUNT;
    mode: StatCompareMode;
    value: string;
};

export type BlockTypeCondition = {
    kind: ConditionKind.BLOCK_TYPE;
    item: string;
    matchTypeOnly: boolean;
};

export type IsItemCondition = {
    kind: ConditionKind.IS_ITEM;
    item: string;
    what: ItemProperty;
    where: ItemLocation;
    amount: ItemAmount;
};

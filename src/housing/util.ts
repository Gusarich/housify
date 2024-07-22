export type Coordinates = {
    x: number;
    y: number;
    z: number;
    pitch: number;
    yaw: number;
};

export enum StatMode {
    INCREMENT = 'INCREMENT',
    DECREMENT = 'DECREMENT',
    SET = 'SET',
    MULTIPLY = 'MULTIPLY',
    DIVIDE = 'DIVIDE',
}

export enum Gamemode {
    ADVENTURE = 'ADVENTURE',
    SURVIVAL = 'SURVIVAL',
    CREATIVE = 'CREATIVE',
}

export enum Comparator {
    LESS_THAN = 'LESS_THAN',
    LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
    EQUAL = 'EQUAL',
    GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
    GREATER_THAN = 'GREATER_THAN',
}

export type Location = 'Spawn' | 'Invoker' | Coordinates; // we don't support "Current Location" due to its unpredictability

export type FishingEnvironment = 'Water' | 'Lava';

export type PortalType = 'Nether' | 'End';

export type ItemProperty = 'ItemType' | 'Metadata';

export type ItemLocation =
    | 'Hand'
    | 'Armor'
    | 'Hotbar'
    | 'Inventory'
    | 'Anywhere';

export type ItemAmount = 'Any' | 'GreaterOrEqual';

export type PotionEffect =
    | 'Speed'
    | 'Slowness'
    | 'Haste'
    | 'MiningFatigue'
    | 'Strength'
    | 'InstantHealth'
    | 'InstantDamage'
    | 'JumpBoost'
    | 'Nausea'
    | 'Regeneration'
    | 'Resistance'
    | 'FireResistance'
    | 'WaterBreathing'
    | 'Invisibility'
    | 'Blindness'
    | 'NightVision'
    | 'Hunger'
    | 'Weakness'
    | 'Poison'
    | 'Wither'
    | 'HealthBoost'
    | 'Absorption';

export type DamageCause =
    | 'EntityAttack'
    | 'Projectile'
    | 'Suffocation'
    | 'Fall'
    | 'Lava'
    | 'Fire'
    | 'FireTick'
    | 'Drowning'
    | 'Starvation'
    | 'Poison'
    | 'Thorns';

export type Enchantment =
    | 'Protection'
    | 'FireProtection'
    | 'FeatherFalling'
    | 'BlastProtection'
    | 'ProjectileProtection'
    | 'Respiration'
    | 'AquaAffinity'
    | 'Thorns'
    | 'DepthStrider'
    | 'Sharpness'
    | 'Smite'
    | 'BaneOfArthropods'
    | 'Knockback'
    | 'FireAspect'
    | 'Looting'
    | 'Efficiency'
    | 'SilkTouch'
    | 'Unbreaking'
    | 'Fortune'
    | 'Power'
    | 'Punch'
    | 'Flame'
    | 'Infinity'
    | 'LuckoftheSea'
    | 'Lure';

export type LobbyLocation =
    | 'MainLobby'
    | 'TournamentHall'
    | 'BlitzSG'
    | 'TNTGames'
    | 'MegaWalls'
    | 'ArcadeGames'
    | 'CopsAndCrims'
    | 'UHCChampions'
    | 'Warlords'
    | 'SmashHeroes'
    | 'Housing'
    | 'SkyWars'
    | 'SpeedUHC'
    | 'ClassicGames'
    | 'Prototype'
    | 'BedWars'
    | 'MurderMystery'
    | 'BuildBattle'
    | 'Duels'
    | 'WoolWars';

export type Permission =
    | 'Fly'
    | 'WoodDoor'
    | 'IronDoor'
    | 'WoodTrapDoor'
    | 'IronTrapDoor'
    | 'FenceGate'
    | 'Button'
    | 'Lever'
    | 'UseLaunchPads'
    | 'TP'
    | 'TPOtherPlayers'
    | 'Jukebox'
    | 'Kick'
    | 'Ban'
    | 'Mute'
    | 'PetSpawning'
    | 'Build'
    | 'OfflineBuild'
    | 'Fluid'
    | 'ProTools'
    | 'UseChests'
    | 'UseEnderChests'
    | 'ItemEditor'
    | 'SwitchGamemode'
    | 'EditStats'
    | 'ChangePlayerGroup'
    | 'ChangeGamerules'
    | 'HousingMenu'
    | 'TeamChatSpy'
    | 'EditActions'
    | 'EditRegions'
    | 'EditScoreboard'
    | 'EditEventActions'
    | 'EditCommands'
    | 'EditFunctions'
    | 'EditInventoryLayouts'
    | 'EditTeams'
    | 'EditCustomMenus'
    | 'ItemMailbox'
    | 'ItemEggHunt'
    | 'ItemTeleportPad'
    | 'ItemLaunchPad'
    | 'ItemActionPad'
    | 'ItemHologram'
    | 'ItemNPCs'
    | 'ItemActionButton'
    | 'ItemLeaderboard'
    | 'ItemTrashCan'
    | 'ItemBiomeStick';

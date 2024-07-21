export type Coordinates = {
    x: number;
    y: number;
    z: number;
    pitch: number;
    yaw: number;
};

export type Location = 'Spawn' | 'Invoker' | Coordinates; // we don't support "Current Location" due to its unpredictability

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

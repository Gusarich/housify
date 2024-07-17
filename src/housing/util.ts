//
// TODO: COMPLETE AND ENSURE TO MATCH ACTUAL TYPES
//

export type Coordinates = {
    relZ: number;
    relY: number;
    relX: number;
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

export enum GameMode {
    ADVENTURE = 'ADVENTURE',
    SURVIVAL = 'SURVIVAL',
    CREATIVE = 'CREATIVE',
}

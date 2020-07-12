declare module "constants" {
    export const AVAILABLE_PINS: number[];
    export const AVAILABLE_DEVICE_TYPE_INPUT: string[];
    export const AVAILABLE_DEVICE_TYPE_OUTPUT: string[];
    export const AVAILABLE_DEVICE_TYPES: string[];
}
declare module "schemas/board" {
    export const deviceSchema: {
        id: string;
        type: string;
        properties: {
            label: {
                type: string;
                required: boolean;
            };
            pin: {
                type: string;
                required: boolean;
                format: string;
            };
            type: {
                type: string;
                required: boolean;
                format: string;
            };
        };
    };
    export const devicesSchema: {
        id: string;
        type: string;
        uniqueItems: boolean;
        items: {
            $ref: string;
            minItems: number;
        };
    };
    export const dependencySchema: {
        id: string;
        type: string;
        properties: {
            inputPin: {
                type: string;
                required: boolean;
                format: string;
            };
            outputPin: {
                type: string;
                required: boolean;
                format: string;
            };
        };
    };
    export const dependenciesSchema: {
        id: string;
        type: string;
        uniqueItems: boolean;
        items: {
            $ref: string;
            minItems: number;
        };
    };
    export const boardSchema: {
        id: string;
        type: string;
        properties: {
            devices: {
                $ref: string;
            };
            dependencies: {
                $ref: string;
            };
        };
    };
}
declare module "schemas/boardSchemaValidator" {
    import type { Config } from "utils/config";
    const validate: (config: Config) => boolean;
    export default validate;
}
declare module "utils/config" {
    type Device = {
        label: string;
        pin: number;
        type: string;
    };
    type Dependency = {
        inputPin: number;
        outputPin: number;
    };
    export type Devices = Array<Device>;
    export type Dependencies = Array<Dependency>;
    export type Config = {
        devices: Devices;
        dependencies: Dependencies;
    };
    export const validateDevice: (device: Device, devices?: Devices | undefined) => void;
    export const validateAndGetConfigObject: (config: Config) => Config;
}
declare module "board" {
    import type { Config, Dependencies, Devices } from "utils/config";
    export class Board {
        private config;
        constructor(config: Config);
        devices: () => Devices;
        dependencies: () => Dependencies;
        availableTypesAndDirections: () => object;
        changeStatus: (pin: number) => number;
        run: () => void;
    }
}
declare module "board.test" { }
declare module "index" {
    export { Board } from "board";
    export { validateDevice } from "utils/config";
}
declare module "utils/config.test" { }

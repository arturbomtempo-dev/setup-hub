export const SETUP_CATEGORY_VALUES = [
    'GAMING',
    'DEVELOPMENT',
    'MINIMALIST',
    'STUDY',
    'STREAMING',
] as const;

export const GEAR_TYPE_VALUES = [
    'KEYBOARD',
    'MOUSE',
    'MONITOR',
    'HEADSET',
    'CHAIR',
    'MICROPHONE',
    'WEBCAM',
    'NOTEBOOK',
    'DESK',
    'OTHER',
] as const;

export type SetupCategory = (typeof SETUP_CATEGORY_VALUES)[number];
export type GearType = (typeof GEAR_TYPE_VALUES)[number];

export interface SetupResponse {
    id: string;
    title: string;
    description: string;
    category: SetupCategory;
    imageUrl: string;
    estimatedCost: number;
    createdAt: string;
}

export interface SetupPayload {
    title: string;
    description: string;
    category: SetupCategory;
    imageUrl: string;
    estimatedCost: number;
}

export interface GearItemResponse {
    id: string;
    name: string;
    brand: string;
    type: GearType;
    price: number;
    setupId: string;
}

export interface GearItemPayload {
    name: string;
    brand: string;
    type: GearType;
    price: number;
    setupId: string;
}

export interface ErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}

export interface SetupWithGear extends SetupResponse {
    gear: GearItemResponse[];
}

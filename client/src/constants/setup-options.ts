import type { GearType, SetupCategory } from '@/types/api';

export const SETUP_CATEGORY_OPTIONS: Array<{ value: SetupCategory; label: string }> = [
    { value: 'GAMING', label: 'Games' },
    { value: 'DEVELOPMENT', label: 'Desenvolvimento' },
    { value: 'MINIMALIST', label: 'Minimalista' },
    { value: 'STUDY', label: 'Estudos' },
    { value: 'STREAMING', label: 'Streaming' },
];

export const GEAR_TYPE_OPTIONS: Array<{ value: GearType; label: string }> = [
    { value: 'KEYBOARD', label: 'Teclado' },
    { value: 'MOUSE', label: 'Mouse' },
    { value: 'MONITOR', label: 'Monitor' },
    { value: 'HEADSET', label: 'Headset' },
    { value: 'CHAIR', label: 'Cadeira' },
    { value: 'MICROPHONE', label: 'Microfone' },
    { value: 'WEBCAM', label: 'Webcam' },
    { value: 'NOTEBOOK', label: 'Notebook' },
    { value: 'DESK', label: 'Mesa' },
    { value: 'OTHER', label: 'Outro' },
];

export const SETUP_CATEGORY_LABELS = Object.fromEntries(
    SETUP_CATEGORY_OPTIONS.map((option) => [option.value, option.label])
) as Record<SetupCategory, string>;

export const GEAR_TYPE_LABELS = Object.fromEntries(
    GEAR_TYPE_OPTIONS.map((option) => [option.value, option.label])
) as Record<GearType, string>;

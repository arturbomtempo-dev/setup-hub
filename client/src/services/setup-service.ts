import { api } from '@/lib/axios';
import {
    gearItemListSchema,
    gearItemRequestSchema,
    gearItemResponseSchema,
    setupListSchema,
    setupRequestSchema,
    setupResponseSchema,
} from '@/schemas/setup-schemas';
import type { GearItemPayload, GearItemResponse, SetupPayload, SetupResponse } from '@/types/api';

export const setupService = {
    async list() {
        const response = await api.get('/setups');
        return setupListSchema.parse(response.data);
    },

    async getById(id: string) {
        const response = await api.get(`/setups/${id}`);
        return setupResponseSchema.parse(response.data);
    },

    async create(payload: SetupPayload) {
        const validated = setupRequestSchema.parse(payload);
        const response = await api.post('/setups', validated);
        return setupResponseSchema.parse(response.data);
    },

    async update(id: string, payload: SetupPayload) {
        const validated = setupRequestSchema.parse(payload);
        const response = await api.put(`/setups/${id}`, validated);
        return setupResponseSchema.parse(response.data);
    },

    async remove(id: string) {
        await api.delete(`/setups/${id}`);
    },
};

export const gearItemService = {
    async listAll() {
        const response = await api.get('/gear-items');
        return gearItemListSchema.parse(response.data);
    },

    async listBySetup(setupId: string) {
        const response = await api.get('/gear-items', {
            params: { setupId },
        });
        return gearItemListSchema.parse(response.data);
    },

    async create(payload: GearItemPayload) {
        const validated = gearItemRequestSchema.parse(payload);
        const response = await api.post('/gear-items', validated);
        return gearItemResponseSchema.parse(response.data);
    },

    async update(id: string, payload: GearItemPayload) {
        const validated = gearItemRequestSchema.parse(payload);
        const response = await api.put(`/gear-items/${id}`, validated);
        return gearItemResponseSchema.parse(response.data);
    },

    async remove(id: string) {
        await api.delete(`/gear-items/${id}`);
    },

    sumPrices(items: GearItemResponse[]) {
        return items.reduce((total, item) => total + item.price, 0);
    },

    toEstimatedCost(items: GearItemResponse[], fallback: number) {
        const sum = this.sumPrices(items);
        return sum > 0 ? sum : fallback;
    },
};

export type { GearItemPayload, GearItemResponse, SetupPayload, SetupResponse };

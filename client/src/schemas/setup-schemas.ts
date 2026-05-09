import { GEAR_TYPE_VALUES, SETUP_CATEGORY_VALUES } from '@/types/api';
import { z } from 'zod';

export const setupResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    category: z.enum(SETUP_CATEGORY_VALUES),
    imageUrl: z.string(),
    estimatedCost: z.coerce.number(),
    createdAt: z.string(),
});

export const setupRequestSchema = z.object({
    title: z
        .string({ required_error: 'Título é obrigatório' })
        .trim()
        .min(3, 'Título deve ter no mínimo 3 caracteres')
        .max(120, 'Título deve ter no máximo 120 caracteres'),
    description: z
        .string({ required_error: 'Descrição é obrigatória' })
        .trim()
        .min(10, 'Descrição deve ter no mínimo 10 caracteres')
        .max(3000, 'Descrição deve ter no máximo 3000 caracteres'),
    category: z.enum(SETUP_CATEGORY_VALUES, {
        errorMap: () => ({ message: 'Categoria é obrigatória' }),
    }),
    imageUrl: z
        .string({ required_error: 'URL da imagem é obrigatória' })
        .trim()
        .min(1, 'URL da imagem é obrigatória'),
    estimatedCost: z.coerce
        .number({ required_error: 'Custo estimado é obrigatório' })
        .positive('Custo estimado deve ser maior que zero'),
});

export const gearItemResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    brand: z.string(),
    type: z.enum(GEAR_TYPE_VALUES),
    price: z.coerce.number(),
    setupId: z.string().uuid(),
});

export const gearItemRequestSchema = z.object({
    name: z
        .string({ required_error: 'Nome é obrigatório' })
        .trim()
        .min(2, 'Nome deve ter no mínimo 2 caracteres')
        .max(120, 'Nome deve ter no máximo 120 caracteres'),
    brand: z
        .string({ required_error: 'Marca é obrigatória' })
        .trim()
        .min(2, 'Marca deve ter no mínimo 2 caracteres')
        .max(80, 'Marca deve ter no máximo 80 caracteres'),
    type: z.enum(GEAR_TYPE_VALUES, {
        errorMap: () => ({ message: 'Tipo é obrigatório' }),
    }),
    price: z.coerce
        .number({ required_error: 'Preço é obrigatório' })
        .positive('Preço deve ser maior que zero'),
    setupId: z.string().uuid('Setup inválido'),
});

export const setupListSchema = z.array(setupResponseSchema);
export const gearItemListSchema = z.array(gearItemResponseSchema);

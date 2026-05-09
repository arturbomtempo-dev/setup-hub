import { AxiosError } from 'axios';
import { z, ZodError } from 'zod';
import type { ErrorResponse } from '@/types/api';

function formatZodErrors(error: ZodError) {
    return error.issues.map((issue) => issue.message).join(' | ');
}

export function getErrorMessage(error: unknown) {
    if (error instanceof ZodError) {
        return formatZodErrors(error);
    }

    if (error instanceof AxiosError) {
        const data = error.response?.data as Partial<ErrorResponse> | undefined;
        if (typeof data?.message === 'string' && data.message.length > 0) {
            return data.message;
        }

        if (typeof error.message === 'string' && error.message.length > 0) {
            return error.message;
        }

        return 'Falha de comunicação com o servidor.';
    }

    if (error instanceof z.ZodError) {
        return formatZodErrors(error);
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Ocorreu um erro inesperado.';
}

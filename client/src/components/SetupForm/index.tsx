import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SETUP_CATEGORY_OPTIONS } from '@/constants/setup-options';
import { setupRequestSchema } from '@/schemas/setup-schemas';
import type { SetupCategory, SetupPayload, SetupResponse } from '@/types/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SetupFormProps {
    initial?: SetupResponse;
    onSubmit: (payload: SetupPayload) => Promise<void>;
    isSubmitting?: boolean;
}

export function SetupForm({ initial, onSubmit, isSubmitting = false }: SetupFormProps) {
    const navigate = useNavigate();
    const [title, setTitle] = useState(initial?.title ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [category, setCategory] = useState<SetupCategory>(
        initial?.category ?? SETUP_CATEGORY_OPTIONS[0].value
    );
    const [estimatedCost, setEstimatedCost] = useState<string>(
        initial ? String(initial.estimatedCost) : ''
    );
    const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=1200';
    const [imageUrl, setImageUrl] = useState(
        initial?.imageUrl && initial.imageUrl !== DEFAULT_IMAGE ? initial.imageUrl : ''
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            title: title.trim(),
            description: description.trim(),
            category,
            estimatedCost: Number(estimatedCost) || 0,
            imageUrl: imageUrl.trim() || DEFAULT_IMAGE,
        };

        const parsed = setupRequestSchema.safeParse(payload);
        if (!parsed.success) {
            const message = parsed.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(' | ');
            toast.error(message);
            return;
        }

        await onSubmit(parsed.data);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Field label="Título" hint="Dê um nome marcante ao seu setup">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Cyber Dev Cave"
                    required
                    className="h-12 rounded-xl border-border/60 bg-surface text-base"
                />
            </Field>

            <Field label="Descrição" hint="Conte a história por trás do setup">
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ergonomia, iluminação, vibe que você buscou..."
                    required
                    rows={5}
                    className="resize-none rounded-xl border-border/60 bg-surface text-base"
                />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
                <Field label="Categoria">
                    <Select value={category} onValueChange={(v) => setCategory(v as SetupCategory)}>
                        <SelectTrigger className="h-12 rounded-xl border-border/60 bg-surface">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SETUP_CATEGORY_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Orçamento estimado (R$)">
                    <Input
                        type="number"
                        min={0}
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                        placeholder="0"
                        required
                        className="h-12 rounded-xl border-border/60 bg-surface text-base"
                    />
                </Field>
            </div>

            <Field label="URL da imagem" hint="Opcional. Cole o link de uma imagem do seu setup.">
                <Input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-12 rounded-xl border-border/60 bg-surface text-base"
                />
            </Field>

            <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
                    {initial ? 'Salvar alterações' : 'Publicar setup'}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    disabled={isSubmitting}
                    onClick={() => navigate(initial ? `/setups/${initial.id}` : '/')}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                </label>
                {hint && <span className="text-xs text-muted-foreground/70">{hint}</span>}
            </div>
            {children}
        </div>
    );
}

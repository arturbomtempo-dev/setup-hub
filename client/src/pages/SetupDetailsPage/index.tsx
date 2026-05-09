import { EmptyState } from '@/components/EmptyState';
import { AddGearButton, GearList } from '@/components/GearList';
import { Navbar } from '@/components/Navbar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { SETUP_CATEGORY_LABELS } from '@/constants/setup-options';
import { getErrorMessage } from '@/lib/error-handler';
import { formatCurrency } from '@/lib/format';
import {
    gearItemService,
    setupService,
    type GearItemPayload,
    type GearItemResponse,
} from '@/services/setup-service';
import type { SetupResponse } from '@/types/api';
import { ArrowLeft, Calendar, Pencil, Plus, SearchX, Trash2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function SetupDetailsPage() {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const [setup, setSetup] = useState<SetupResponse | null>(null);
    const [gearItems, setGearItems] = useState<GearItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadSetupData() {
            try {
                setIsLoading(true);
                const [setupData, gearData] = await Promise.all([
                    setupService.getById(id),
                    gearItemService.listBySetup(id),
                ]);

                if (!isMounted) return;

                setSetup(setupData);
                setGearItems(gearData);
            } catch (error) {
                toast.error(getErrorMessage(error));
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (id) {
            loadSetupData();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    const totalGear = useMemo(() => gearItemService.sumPrices(gearItems), [gearItems]);

    async function updateEstimatedCost(nextGearItems: GearItemResponse[]) {
        if (!setup) return;

        const nextEstimatedCost = gearItemService.toEstimatedCost(
            nextGearItems,
            setup.estimatedCost
        );

        const updatedSetup = await setupService.update(setup.id, {
            title: setup.title,
            description: setup.description,
            category: setup.category,
            imageUrl: setup.imageUrl,
            estimatedCost: nextEstimatedCost,
        });

        setSetup(updatedSetup);
    }

    async function handleGearSubmit(payload: GearItemPayload, gearId?: string) {
        if (!setup) return;

        if (gearId) {
            const updated = await gearItemService.update(gearId, payload);
            const nextItems = gearItems.map((item) => (item.id === updated.id ? updated : item));
            setGearItems(nextItems);
            await updateEstimatedCost(nextItems);
            toast.success('Item atualizado com sucesso.');
            return;
        }

        const created = await gearItemService.create(payload);
        const nextItems = [...gearItems, created];
        setGearItems(nextItems);
        await updateEstimatedCost(nextItems);
        toast.success('Item adicionado com sucesso.');
    }

    async function handleGearRemove(gearId: string) {
        await gearItemService.remove(gearId);
        const nextItems = gearItems.filter((item) => item.id !== gearId);
        setGearItems(nextItems);
        await updateEstimatedCost(nextItems);
        toast.success('Item removido com sucesso.');
    }

    async function handleDeleteSetup() {
        if (!setup) return;

        try {
            await setupService.remove(setup.id);
            toast.success('Setup removido com sucesso.');
            navigate('/');
        } catch (error) {
            if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status === 409 || status === 500) {
                    toast.error(
                        'Este setup possui itens vinculados. Remova todos os gear items antes de excluí-lo.',
                    );
                } else {
                    toast.error(getErrorMessage(error));
                }
            } else {
                toast.error(getErrorMessage(error));
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="mx-auto max-w-3xl px-4 py-24 md:px-8">
                    <div className="text-sm text-muted-foreground">Carregando setup...</div>
                </div>
            </div>
        );
    }

    if (!setup) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="mx-auto max-w-3xl px-4 py-24 md:px-8">
                    <EmptyState
                        icon={SearchX}
                        title="Setup não encontrado"
                        description="O setup que você procura pode ter sido removido ou nunca existiu."
                        action={
                            <Button asChild variant="hero">
                                <Link to="/">Voltar para a galeria</Link>
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24">
            <Navbar />

            <section className="relative">
                <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
                    <img
                        src={setup.imageUrl}
                        alt={setup.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
                </div>

                <div className="mx-auto -mt-48 max-w-7xl px-4 md:px-8">
                    <Link
                        to="/"
                        className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/60 bg-surface/80 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-md transition-smooth hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Galeria
                    </Link>

                    <div className="glass-strong relative overflow-hidden rounded-3xl p-8 md:p-12">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-5">
                                <span className="inline-block rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-glow">
                                    {SETUP_CATEGORY_LABELS[setup.category]}
                                </span>
                                <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">
                                    {setup.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                    <span className="inline-flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(setup.createdAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-4 lg:items-end">
                                <div className="rounded-2xl border border-border/60 bg-surface px-6 py-4 text-right">
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Custo estimado
                                    </div>
                                    <div className="font-display text-3xl font-bold text-gradient">
                                        {formatCurrency(setup.estimatedCost)}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button asChild variant="glass" size="default">
                                        <Link to={`/setups/${setup.id}/edit`}>
                                            <Pencil className="h-4 w-4" /> Editar
                                        </Link>
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="default"
                                                className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" /> Deletar
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="glass-strong rounded-2xl border-border/50">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="font-display">
                                                    Deletar este setup?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Essa ação não pode ser desfeita. O setup e todos
                                                    os gear items serão removidos permanentemente.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-xl">
                                                    Cancelar
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    onClick={handleDeleteSetup}
                                                >
                                                    Deletar setup
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-12 grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[1.5fr_1fr]">
                <div className="space-y-10">
                    <div>
                        <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">
                            Sobre o setup
                        </h2>
                        <p className="text-base leading-relaxed text-muted-foreground">
                            {setup.description}
                        </p>
                    </div>

                    <div>
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Equipamentos
                                </div>
                                <h2 className="font-display text-2xl font-bold tracking-tight">
                                    Gear list ({gearItems.length})
                                </h2>
                            </div>
                            <AddGearButton setupId={setup.id} onSubmit={handleGearSubmit} />
                        </div>

                        {gearItems.length === 0 ? (
                            <EmptyState
                                icon={Plus}
                                title="Sem gear ainda"
                                description="Adicione os equipamentos que compõem esse setup. Teclado, mouse, monitor, cadeira — tudo conta."
                                action={
                                    <AddGearButton setupId={setup.id} onSubmit={handleGearSubmit} />
                                }
                            />
                        ) : (
                            <GearList
                                setupId={setup.id}
                                items={gearItems}
                                onSubmit={handleGearSubmit}
                                onRemove={handleGearRemove}
                            />
                        )}
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="glass rounded-2xl p-6">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Resumo
                        </div>
                        <h3 className="mt-1 font-display text-xl font-bold">Investimento total</h3>
                        <div className="mt-4 space-y-3">
                            <SummaryRow
                                label="Custo estimado"
                                value={formatCurrency(setup.estimatedCost)}
                            />
                            <SummaryRow label="Soma do gear" value={formatCurrency(totalGear)} />
                            <SummaryRow
                                label="Itens cadastrados"
                                value={String(gearItems.length)}
                            />
                            <SummaryRow
                                label="Categoria"
                                value={SETUP_CATEGORY_LABELS[setup.category]}
                            />
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between border-b border-border/40 pb-2 last:border-b-0 last:pb-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-mono text-sm font-semibold">{value}</span>
        </div>
    );
}

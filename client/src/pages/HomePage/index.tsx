import heroImage from '@/assets/hero-setup.jpg';
import { EmptyState } from '@/components/EmptyState';
import { Navbar } from '@/components/Navbar';
import { SetupCard } from '@/components/SetupCard';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { gearItemService, setupService } from '@/services/setup-service';
import type { SetupWithGear } from '@/types/api';
import { ArrowRight, SearchX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
    const [setups, setSetups] = useState<SetupWithGear[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                setIsLoading(true);
                const [setupList, gearList] = await Promise.all([
                    setupService.list(),
                    gearItemService.listAll(),
                ]);

                if (!isMounted) return;

                const gearBySetupId = new Map<string, typeof gearList>();
                gearList.forEach((gearItem) => {
                    const current = gearBySetupId.get(gearItem.setupId) ?? [];
                    current.push(gearItem);
                    gearBySetupId.set(gearItem.setupId, current);
                });

                const merged = setupList.map((setup) => {
                    const gear = gearBySetupId.get(setup.id) ?? [];
                    return {
                        ...setup,
                        gear,
                        estimatedCost: gearItemService.toEstimatedCost(gear, setup.estimatedCost),
                    };
                });

                setSetups(merged);
            } catch {
                // silently fall through to empty state
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    const publishedCount = useMemo(() => setups.length, [setups]);
    const totalGearItems = useMemo(
        () => setups.reduce((total, setup) => total + setup.gear.length, 0),
        [setups]
    );
    const totalEstimated = useMemo(
        () => setups.reduce((total, setup) => total + setup.estimatedCost, 0),
        [setups]
    );

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden">
                <img
                    src={heroImage}
                    alt="Setup moderno com monitor ultrawide e iluminação ambiente"
                    className="pointer-events-none absolute inset-0 h-full w-full scale-[1.03] object-cover object-center brightness-110 contrast-110 saturate-125 blur-[3px] md:blur-[5px]"
                />
                <div className="pointer-events-none absolute inset-0 bg-background/45" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-70" />

                <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
                    <div className="mx-auto max-w-3xl space-y-8 text-center">
                        <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="block">Os setups que</span>
                            <em className="block text-gradient not-italic">moldam código.</em>
                        </h1>

                        <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
                            SetupHub é a galeria definitiva de workspaces de desenvolvedores, gamers
                            e criadores. Inspire-se, compartilhe e monte o setup dos seus sonhos.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Button asChild variant="hero" size="lg">
                                <Link to="/setups/new">
                                    Publicar setup <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-primary/60 bg-transparent text-primary hover:border-primary hover:bg-primary/10 hover:text-primary"
                            >
                                <a href="#galeria">Explorar galeria</a>
                            </Button>
                        </div>

                        <div className="grid gap-3 pt-4 text-left sm:grid-cols-3">
                            <MetricCard label="Publicados" value={String(publishedCount)} />
                            <MetricCard label="Itens cadastrados" value={String(totalGearItems)} />
                            <MetricCard
                                label="Investimento total"
                                value={formatCurrency(totalEstimated)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-24 pt-16 md:px-8 md:pt-20" id="galeria">
                <div className="mb-10 flex items-end justify-between gap-6">
                    <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Galeria
                        </div>
                        <h2 className="mt-2 font-display text-4xl font-normal tracking-tight md:text-5xl">
                            Todos os setups
                        </h2>
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:block">
                        {publishedCount} publicados
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-sm text-muted-foreground">Carregando setups...</div>
                ) : setups.length === 0 ? (
                    <EmptyState
                        icon={SearchX}
                        title="Nenhum setup publicado"
                        description="Seja o primeiro a publicar seu setup na galeria."
                        action={
                            <Button asChild variant="hero">
                                <Link to="/setups/new">Publicar setup</Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {setups.map((s) => (
                            <SetupCard key={s.id} setup={s} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function MetricCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-border/60 bg-background/40 px-4 py-3 backdrop-blur-md">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {label}
            </div>
            <div className="mt-1 font-mono text-sm font-semibold text-foreground">{value}</div>
        </div>
    );
}

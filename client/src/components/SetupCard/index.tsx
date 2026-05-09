import { GEAR_TYPE_LABELS, SETUP_CATEGORY_LABELS } from '@/constants/setup-options';
import { formatCurrency } from '@/lib/format';
import type { SetupWithGear } from '@/types/api';
import { ArrowUpRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SetupCard({
    setup,
    featured = false,
}: {
    setup: SetupWithGear;
    featured?: boolean;
}) {
    return (
        <Link
            to={`/setups/${setup.id}`}
            className={`group relative block cursor-pointer overflow-hidden rounded-3xl border border-border/50 bg-card hover-lift ${
                featured ? 'md:col-span-2 md:row-span-2' : ''
            }`}
        >
            <div
                className={`relative overflow-hidden ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
            >
                <img
                    src={setup.imageUrl}
                    alt={setup.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-smooth duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full bg-background/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-md">
                        {SETUP_CATEGORY_LABELS[setup.category]}
                    </span>
                </div>
                <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/60 opacity-0 backdrop-blur-md transition-smooth group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                </div>
            </div>

            <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate font-display text-xl font-normal tracking-tight">
                            {setup.title}
                        </h3>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Custo
                        </div>
                        <div className="font-mono text-sm font-semibold text-gradient">
                            {formatCurrency(setup.estimatedCost)}
                        </div>
                    </div>
                </div>

                {setup.gear.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {setup.gear.slice(0, 3).map((g) => (
                            <span
                                key={g.id}
                                className="rounded-full border border-border/60 bg-secondary/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
                            >
                                {GEAR_TYPE_LABELS[g.type]} · {g.brand}
                            </span>
                        ))}
                        {setup.gear.length > 3 && (
                            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                                <Layers className="h-3 w-3" />+{setup.gear.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}

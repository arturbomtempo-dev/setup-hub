import { type LucideIcon } from 'lucide-react';

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="glass relative overflow-hidden rounded-3xl px-8 py-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-40" />
            <div className="relative mx-auto flex max-w-md flex-col items-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-2xl" />
                    <div className="grid h-20 w-20 place-items-center rounded-2xl border border-border/60 bg-surface-elevated shadow-card">
                        <Icon className="h-9 w-9 text-primary" strokeWidth={1.5} />
                    </div>
                </div>
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                {action && <div className="mt-6">{action}</div>}
            </div>
        </div>
    );
}

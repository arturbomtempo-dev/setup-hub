import { Navbar } from '@/components/Navbar';
import { SetupForm } from '@/components/SetupForm';
import { getErrorMessage } from '@/lib/error-handler';
import { setupService, type SetupPayload } from '@/services/setup-service';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function NewSetupPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleCreate(payload: SetupPayload) {
        try {
            setIsSubmitting(true);
            const created = await setupService.create(payload);
            toast.success('Setup publicado com sucesso.');
            navigate(`/setups/${created.id}`);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen pb-24">
            <Navbar />
            <div className="mx-auto max-w-3xl px-4 py-12 md:px-8">
                <Link
                    to="/"
                    className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Voltar
                </Link>

                <div className="mb-10 flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Novo setup
                        </div>
                        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                            Compartilhe seu workspace
                        </h1>
                    </div>
                </div>

                <div className="glass-strong rounded-3xl p-6 md:p-10">
                    <SetupForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
    );
}

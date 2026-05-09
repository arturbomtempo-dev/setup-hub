import { EmptyState } from '@/components/EmptyState';
import { Navbar } from '@/components/Navbar';
import { SetupForm } from '@/components/SetupForm';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/error-handler';
import { setupService, type SetupPayload } from '@/services/setup-service';
import type { SetupResponse } from '@/types/api';
import { Pencil, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function EditSetupPage() {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const [setup, setSetup] = useState<SetupResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadSetup() {
            try {
                setIsLoading(true);
                const data = await setupService.getById(id);
                if (!isMounted) return;
                setSetup(data);
            } catch (error) {
                toast.error(getErrorMessage(error));
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (id) {
            loadSetup();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    async function handleUpdate(payload: SetupPayload) {
        if (!setup) return;

        try {
            setIsSubmitting(true);
            const updated = await setupService.update(setup.id, payload);
            toast.success('Setup atualizado com sucesso.');
            navigate(`/setups/${updated.id}`);
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
                {isLoading ? (
                    <div className="text-sm text-muted-foreground">Carregando setup...</div>
                ) : !setup ? (
                    <EmptyState
                        icon={Search}
                        title="Setup não encontrado"
                        description="Não conseguimos encontrar este setup."
                        action={
                            <Button asChild variant="hero">
                                <Link to="/">Ir para galeria</Link>
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <div className="mb-10 flex items-center gap-4">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
                                <Pencil className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Editar setup
                                </div>
                                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                                    {setup.title}
                                </h1>
                            </div>
                        </div>
                        <div className="glass-strong rounded-3xl p-6 md:p-10">
                            <SetupForm
                                initial={setup}
                                onSubmit={handleUpdate}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="glass-strong border-b border-border/40">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                    <Link to="/" className="group flex cursor-pointer items-center gap-2.5">
                        <div className="leading-none">
                            <div className="font-display text-lg font-semibold tracking-tight">
                                Setup<span className="text-gradient">Hub</span>
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `cursor-pointer text-sm font-medium transition-smooth hover:text-foreground ${
                                    isActive ? 'text-foreground' : 'text-muted-foreground'
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <a
                            href="#galeria"
                            className="cursor-pointer text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
                        >
                            Galeria
                        </a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="hero" size="sm" className="rounded-full">
                            <Link to="/setups/new">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Novo Setup</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export function Footer() {
    return (
        <footer className="border-t border-border/40 py-6">
            <p className="text-center text-xs text-muted-foreground">
                Desenvolvido por{' '}
                <a
                    href="https://www.arturbomtempo.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-medium text-foreground transition-smooth hover:text-primary"
                >
                    Artur Bomtempo
                </a>
            </p>
        </footer>
    );
}

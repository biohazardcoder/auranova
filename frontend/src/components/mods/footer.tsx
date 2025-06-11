const Footer = () => {
    return (
        <footer className="bg-secondary text-muted-foreground flex items-center justify-center py-2 h-[4vh]">
            <p className="font-semibold text-sm">&copy; {new Date().getFullYear()} Aura Nova. Barcha huquqlar himoyalangan.</p>
        </footer>
    );
};

export default Footer;

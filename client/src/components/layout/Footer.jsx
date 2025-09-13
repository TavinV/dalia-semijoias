import Logo from "../ui/Logo";

const Footer = () => {
    return (
        <footer className="bg-secondary w-screen p-6 sm:p-10 border-t border-dark-accent grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-30">
            {/* Coluna 1 */}
            <div className="flex flex-col gap-4">
                <Logo />
                <h2 className="font-title text-base md:text-lg">
                    Feita para os que amam e <br /> para os que vão amar
                </h2>
            </div>

            {/* Coluna 2 */}
            <div className="flex flex-col gap-2">
                <h1 className="font-title font-semibold uppercase text-lg md:text-xl">Coleção</h1>
                <ul className="list-none flex flex-col gap-1">
                    <li>Aneis</li>
                    <li>Brincos</li>
                    <li>Braceletes</li>
                    <li>Colares</li>
                    <li>Correntes</li>
                    <li>Masculino</li>
                    <li>Piercings</li>
                    <li>Pulseiras</li>
                    <li>Tornozeleiras</li>
                </ul>
            </div>

            {/* Coluna 3 */}
            <div className="flex flex-col gap-2">
                <h1 className="font-title uppercase font-semibold text-lg md:text-xl">Institucional</h1>
                <ul className="list-none flex flex-col gap-1">
                    <li>Catálogo</li>
                    <li>Sobre nós</li>
                    <li>Contato</li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;

// Footer.jsx
import Logo from "../ui/Logo";
import { NavLink } from "react-router-dom";
import { FiInstagram, FiMail, FiPhone } from "react-icons/fi";
import { LuHeart, LuArrowUpRight } from "react-icons/lu";

const collections = [
  { name: "Anéis", path: "/aneis" },
  { name: "Brincos", path: "/brincos" },
  { name: "Braceletes", path: "/braceletes" },
  { name: "Colares", path: "/colares" },
  { name: "Correntes", path: "/correntes" },
  { name: "Masculino", path: "/masculino" },
  { name: "Piercings", path: "/piercings" },
  { name: "Pulseiras", path: "/pulseiras" },
  { name: "Tornozeleiras", path: "/tornozeleiras" },
];

const Footer = () => {
  return (
    <>
      <footer className="w-full bg-[#F5F0EB] relative font-inter">
        {/* Textura sutil de fundo */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMCA0MCAyMCAyMCAwIDAgMSAwLTQweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTY3OTY1IiBzdHJva2Utd2lkdGg9IjAuMiIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />

        {/* Linha decorativa superior com gradiente mais marcante */}
        <div className="relative w-full h-px bg-gradient-to-r from-transparent via-[#967965] to-transparent opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Coluna 1 - Logo e Slogan - 5 colunas */}
            <div className="lg:col-span-5 space-y-8">
              <Logo />

              <div className="space-y-6">
                <h2 className="font-fancy text-2xl sm:text-3xl text-[#4A3F3A] leading-relaxed">
                  Feita para os que amam
                  <br />e para os que vão amar
                </h2>

                <p className="text-base text-[#6B625C] font-light leading-relaxed max-w-md">
                  Semijoias exclusivas que contam histórias e celebram momentos
                  especiais, com a qualidade e o brilho que você merece.
                </p>
              </div>

            </div>

            {/* Coluna 2 - Coleção - 3 colunas */}
            <div className="lg:col-span-3">
              <h3 className="font-fancy text-xl font-medium text-[#4A3F3A] mb-8 relative inline-block">
                Coleção
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#967965]/60" />
              </h3>

              <ul className="space-y-4">
                {collections.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className="group flex items-center justify-between text-sm text-[#6B625C] hover:text-[#967965] transition-all duration-300"
                    >
                      <span>{item.name}</span>
                      <LuArrowUpRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#967965]"
                      />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 3 - Contato - 4 colunas */}
            <div className="lg:col-span-4">
              <h3 className="font-fancy text-xl font-medium text-[#4A3F3A] mb-8 relative inline-block">
                Contato
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#967965]/60" />
              </h3>

              <div className="space-y-6">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/daliaa.concept"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#967965]/10 flex items-center justify-center group-hover:bg-[#967965] transition-all duration-500 shadow-sm group-hover:shadow-md">
                    <FiInstagram
                      className="text-[#967965] group-hover:text-white transition-colors duration-500"
                      size={20}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#8B7A70] uppercase tracking-wider">
                      Instagram
                    </span>
                    <span className="text-base text-[#4A3F3A] group-hover:text-[#967965] transition-colors">
                      @daliaa.concept
                    </span>
                  </div>
                </a>

                {/* Telefone 1 */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-[#967965]/10 flex items-center justify-center group-hover:bg-[#967965] transition-all duration-500 shadow-sm group-hover:shadow-md">
                    <FiPhone
                      className="text-[#967965] group-hover:text-white transition-colors duration-500"
                      size={20}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#8B7A70] uppercase tracking-wider">
                      WhatsApp 1
                    </span>
                    <span className="text-base text-[#4A3F3A]">
                      +55 11 97515-3050
                    </span>
                  </div>
                </div>

                {/* Telefone 2 */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-[#967965]/10 flex items-center justify-center group-hover:bg-[#967965] transition-all duration-500 shadow-sm group-hover:shadow-md">
                    <FiPhone
                      className="text-[#967965] group-hover:text-white transition-colors duration-500"
                      size={20}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#8B7A70] uppercase tracking-wider">
                      WhatsApp 2
                    </span>
                    <span className="text-base text-[#4A3F3A]">
                      +55 11 94703-4640
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória inferior com gradiente */}
        <div className="relative w-full h-px bg-gradient-to-r from-transparent via-[#967965] to-transparent opacity-20" />
      </footer>

      {/* Copyright com design refinado */}
      <div className="w-full bg-[#4A3F3A] py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLink
            to="/dashboard"
            className="text-xs text-[#E0D6CF] hover:text-white transition-colors duration-300 tracking-wide"
          >
            © 2025 Dália Concept - Todos os direitos reservados
          </NavLink>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8B7A70]">|</span>
            <span className="text-xs text-[#E0D6CF] font-light flex items-center gap-1">
              Feito com <span className="text-[#E0BEA2] animate-pulse">❤</span>{" "}
              para você
            </span>
            <span className="text-xs text-[#8B7A70]">|</span>
            <span className="text-xs text-[#E0D6CF] font-light">v.1.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

import { motion } from "framer-motion";

// Wrapper de transição usado em cada rota do app.
// Faz um fade + leve slide ao entrar (a cada navegação).
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default PageWrapper;

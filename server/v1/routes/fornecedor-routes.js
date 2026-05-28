import express from "express";
import fornecedorController from "../controllers/fornecedor-controller.js";
import { authenticateToken } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/", authenticateToken, fornecedorController.createFornecedor);
router.get("/", authenticateToken, fornecedorController.getAllFornecedores);

// Rotas específicas antes das parametrizadas
router.get(
    "/:id/resumo",
    authenticateToken,
    fornecedorController.getResumoFornecedor
);
router.patch(
    "/:id/toggle-ativo",
    authenticateToken,
    fornecedorController.toggleAtivo
);

router.get("/:id", authenticateToken, fornecedorController.getFornecedorById);
router.put("/:id", authenticateToken, fornecedorController.updateFornecedor);
router.delete("/:id", authenticateToken, fornecedorController.deleteFornecedor);

export default router;

import express from "express";
import compraFornecedorController from "../controllers/compra-fornecedor-controller.js";
import { authenticateToken } from "../middlewares/auth-middleware.js";

const router = express.Router();

// Criação
router.post("/", authenticateToken, compraFornecedorController.createCompra);

// Listagens / agregações específicas (ANTES de /:id pra evitar conflito)
router.get("/", authenticateToken, compraFornecedorController.getAllCompras);
router.get(
    "/por-mes",
    authenticateToken,
    compraFornecedorController.getComprasPorMes
);
router.get(
    "/estoque-por-categoria",
    authenticateToken,
    compraFornecedorController.getEstoquePorCategoria
);
router.get(
    "/fornecedor/:fornecedorId",
    authenticateToken,
    compraFornecedorController.getComprasByFornecedor
);

// Itens (rotas específicas em /itens/:itemId)
router.put(
    "/itens/:itemId",
    authenticateToken,
    compraFornecedorController.updateItem
);
router.delete(
    "/itens/:itemId",
    authenticateToken,
    compraFornecedorController.deleteItem
);

// Compra individual + seus itens
router.get("/:id", authenticateToken, compraFornecedorController.getCompraById);
router.get(
    "/:id/itens",
    authenticateToken,
    compraFornecedorController.getItensByCompra
);
router.post(
    "/:id/itens",
    authenticateToken,
    compraFornecedorController.addItem
);
router.put("/:id", authenticateToken, compraFornecedorController.updateCompra);
router.delete(
    "/:id",
    authenticateToken,
    compraFornecedorController.deleteCompra
);

export default router;

import express from "express";
import saleController from "../controllers/sale-controller.js";
import { authenticateToken } from "../middlewares/auth-middleware.js";

const router = express.Router();

// Rota pública (sem auth) — só agregação de nomes + qty, sem expor cliente/valor
router.get("/top-mes", saleController.getTopVendidosNoMes);

router.post("/", authenticateToken, saleController.createSale);
router.get("/", authenticateToken, saleController.getAllSales);
router.get("/unpaid", authenticateToken, saleController.getUnpaidSales);
router.get("/client/:clientId", authenticateToken, saleController.getSalesByClient);
router.patch("/:id/pay", authenticateToken, saleController.markAsPaid);
router.put("/:id", authenticateToken, saleController.updateSale);
router.delete("/:id", authenticateToken, saleController.deleteSale);

export default router;

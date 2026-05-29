import express from "express";
import saidaController from "../controllers/saida-controller.js";
import { authenticateToken } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/", authenticateToken, saidaController.createSaida);
router.get("/", authenticateToken, saidaController.getAllSaidas);
router.get("/:id", authenticateToken, saidaController.getSaidaById);
router.put("/:id", authenticateToken, saidaController.updateSaida);
router.delete("/:id", authenticateToken, saidaController.deleteSaida);

export default router;

import express from "express";
import clientController from "../controllers/client-controller.js";
import { authenticateToken } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/", authenticateToken, clientController.createClient);
router.get("/", authenticateToken, clientController.getAllClients);
router.get("/:id", authenticateToken, clientController.getClientById);
router.put("/:id", authenticateToken, clientController.updateClient);
router.delete("/:id", authenticateToken, clientController.deleteClient);

export default router;

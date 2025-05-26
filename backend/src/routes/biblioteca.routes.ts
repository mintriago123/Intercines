import { Router } from "express";
import { RequestHandler } from "express"; // Añadir esta importación
import * as controller from "../controllers/biblioteca.controller";

const router = Router();

// Convertir los controladores a RequestHandler
router.get("/", controller.getAll as unknown as RequestHandler);
router.get("/:id", controller.getOne as RequestHandler);
router.post("/", controller.create as RequestHandler);
router.put("/:id", controller.update as RequestHandler);
router.delete("/:id", controller.remove as RequestHandler);

export default router;
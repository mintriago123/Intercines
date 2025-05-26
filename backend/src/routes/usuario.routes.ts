import { Router } from "express";
import { RequestHandler } from "express";

import * as controller from "../controllers/usuario.controller";

const router = Router();

// Y actualizar los nombres de los controladores:
router.get("/", controller.getUsuarios as unknown as RequestHandler);
router.get("/:id", controller.getUsuario as RequestHandler);
router.post("/", controller.createUsuario as RequestHandler);
router.put("/:id", controller.updateUsuario as RequestHandler);
router.delete("/:id", controller.deleteUsuario as RequestHandler);

export default router;
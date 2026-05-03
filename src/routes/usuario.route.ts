import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { atualizarUsuario, consultarUsuario, consultarUsuarios, deletarUsuario, registrarUsuario } from "../controllers/usuario.controller";

const router = Router()

router.get('/usuarios', authMiddleware, adminMiddleware, consultarUsuarios)
router.get('/usuarios/:id', authMiddleware, adminMiddleware, consultarUsuario)
router.post('/usuario', authMiddleware, adminMiddleware, registrarUsuario)
router.put('/usuarios/:id', authMiddleware, adminMiddleware, atualizarUsuario)
router.delete('/usuarios/:id', authMiddleware, adminMiddleware, deletarUsuario)

export {router as usuarioRouter}
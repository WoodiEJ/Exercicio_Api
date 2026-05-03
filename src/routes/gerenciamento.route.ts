import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { atualizarEmprestimo, consultarEmprestimo, consultarEmprestimos, excluirEmprestimo } from "../controllers/gerenciamento.controller";

const router = Router()

router.get('/reservas/gerenciar', authMiddleware, adminMiddleware, consultarEmprestimos)
router.get('/reservas/gerenciar/:id', authMiddleware, adminMiddleware, consultarEmprestimo)
router.put('/reservas/gerenciar/:id', authMiddleware, adminMiddleware, atualizarEmprestimo)
router.delete('/reservas/gerenciar/:id', authMiddleware, adminMiddleware, excluirEmprestimo)

export {router as gerenciamentoRouter}
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { atualizarLivro, cadastrarLivro, cadastroCategoria, consultarLivro, consultarLivros, deletarLivro, devolverLivro } from "../controllers/livros.controller";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router()

router.get('/livro', authMiddleware, adminMiddleware, consultarLivros)
router.get('/livro/:id', authMiddleware, consultarLivro)
router.post('/livro/categoria', authMiddleware, adminMiddleware, cadastroCategoria)
router.post('/livro', authMiddleware, adminMiddleware, cadastrarLivro)
router.put('/livro/:id', authMiddleware, adminMiddleware, atualizarLivro)
router.delete('/livro/:id', authMiddleware, adminMiddleware, deletarLivro)
router.put('/livro/:id', authMiddleware, adminMiddleware, devolverLivro)

export {router as livrosRouter}
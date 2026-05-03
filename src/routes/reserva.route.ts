import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { reservarLivro } from "../controllers/reserva.controller";

const router = Router()

router.post('/reservar', authMiddleware, reservarLivro)

export {router as reservaRouter}
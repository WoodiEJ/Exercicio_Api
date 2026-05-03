import { Router } from "express";
import { logar } from "../controllers/login.controller";

const router = Router()

router.post('/login', logar)

export default router

export {router as loginRouter}
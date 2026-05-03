import { Request, Response } from "express";
import { NextFunction } from "express";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.usuario.role !== 'ADMIN') {
        return res.status(400).json({mensagem: "Acesso negado"})
    }
    next()
}
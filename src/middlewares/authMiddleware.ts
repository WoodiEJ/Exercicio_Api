import { Request, Response } from "express";
import { NextFunction } from "express";
import  jwt  from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    
    if (!header) {
        return res.status(400).json({mensagem: "Token nao encontrado"})
    }

    const token = header.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id:number, role:string}
        req.usuario = { id: decoded.id, role: decoded.role }
        next()
    } catch (erro) {
        console.log(erro)
    }
}
import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";
import z from "zod";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function logar(req: Request, res: Response) {
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    try {
        const result = loginSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({mensagem: "Preenche os campos"})
        }
        
        const {email, password} = result.data
        const usuario = await prisma.usuario.findUnique({where: {email}})

        if (!usuario) {
            return res.status(401).json({mensagem: "Não tem cadastro com a gente"})
        }

        const senhaCorreta = await bcrypt.compare(password, usuario.password)

        if (!senhaCorreta) {
            return res.status(401).json({mensagem: "Credencias invalidos"})
        }

        const token = jwt.sign(
            {id: usuario.id, role: usuario.role },
            process.env.JWT_SECRET!,
            {expiresIn: '8h'}
        )
        
        return res.status(200).json({ token })
    } catch (erro) {
        console.log(erro)
    }
}
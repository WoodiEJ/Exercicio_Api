import { prisma } from '@/lib/prisma'
import { Request, Response } from 'express'
import z from 'zod'
import bcrypt from 'bcrypt'


const registroSchema = z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "USER"])
})

const optionalSchema = z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "USER"])
}).partial()

export async function registrarUsuario(req: Request, res: Response) {
    try {
        const result = registroSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({mensagem: "Preenche os dados corretamente"})
        }

        const {nome, email, password, role} = result.data
        const usuarioExiste = await prisma.usuario.findFirst({where: {email}})

        if (usuarioExiste) {
            return res.status(400).json({mensagem: "Usuario ja existe"})
        }

        const senhaCriptografada = await bcrypt.hash(password, 10)

        await prisma.usuario.create({
            data: {
                nome,
                email,
                password: senhaCriptografada,
                role
            }
        })

        return res.status(201).json({mensagem: "Usuario criado com sucesso!"})
    } catch (erro) {
        console.log(erro)
    }
}

export async function consultarUsuarios(req: Request, res: Response) {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {id: true, nome: true, email: true, role: true}
        })
        return res.status(200).json(usuarios)
    } catch (erro) {
        console.log(erro)
    }
}

export async function consultarUsuario(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const usuario = await prisma.usuario.findUnique({
            where: {id},
            select: {id: true, nome: true, email: true, role: true}
        })

        if (!usuario) {
            return res.status(400).json({mensagem: "Usuario não existe"})
        }

        return res.json(usuario)
    } catch (erro) {
        console.log(erro)
    }
}

export async function atualizarUsuario(req: Request, res: Response) {
    try { 
        const id = Number(req.params.id)
        const usuario = await prisma.usuario.findUnique({where: {id}})

        if (!usuario) {
            return res.status(400).json({mensagem: "Usuario nao existe"})
        }

        const result = optionalSchema.safeParse(req.body)

        if (!result.success) {
            return res.json({mensagem: "Erro de validação"})
        }

        const {nome, email, password, role} = result.data
        const senhaCriptografada = password ? await bcrypt.hash(password, 10) : undefined

        await prisma.usuario.update({
            where: {id},
            data: {
                nome,
                email, 
                password: senhaCriptografada,
                role
            }
        })

        return res.status(200).json({mensagem: "Usuario atualizado com sucesso"})
    } catch (erro) {
        console.log(erro)
    }
}

export async function deletarUsuario(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const usuario = await prisma.usuario.findUnique({where: {id}})

        if (!usuario) {
            return res.status(200).json({mensagem: "Usuario nao existe"})
        }

        const usuarioComEmprestimoAtivo = await prisma.emprestimo.findFirst({
            where: {
                usuario_id: id,
                ativo: true
            }
        })

        if (usuarioComEmprestimoAtivo) {
            return res.status(400).json({mensagem: "Usuario esta com emprestimo ativo"})
        }

        await prisma.usuario.delete({where: {id}})
        return res.status(200).json({mensagem: "Deletado com sucesso!"})
    } catch (erro) {
        console.log(erro)
    }
}
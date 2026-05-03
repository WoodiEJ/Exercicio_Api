import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";
import z from "zod";

const optionalSchema = z.object({
    usuario_id: z.number(),
    livro_id: z.number(),
    ativo: z.boolean().default(true),
    data_comeco: z.date(),
    data_fim: z.date(),
    volta: z.date()
}).partial()

export async function consultarEmprestimos(req: Request, res: Response) {
    try {
        const emprestimos = await prisma.emprestimo.findMany()
        return res.status(200).json(emprestimos)
    } catch (erro) {
        console.log(erro)
    }
}

export async function consultarEmprestimo(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const emprestimo = await prisma.emprestimo.findUnique({where: {id}})

        if (!emprestimo) {
            return res.status(404).json({mensagem: "Emprestimo nao existe"})
        }

        return res.json(emprestimo)
    } catch (erro) {
        console.log(erro)
    }
}

export async function atualizarEmprestimo(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const result = optionalSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({mensagem: "Valide os dados"})
        }

        const emprestimoExiste = await prisma.emprestimo.findUnique({where: {id}})

        if (!emprestimoExiste) {
            return res.status(404).json({mensagem: "Emprestimo nao existe"})
        }

        await prisma.emprestimo.update({
            where: {id},
            data: result.data
        })

        return res.status(200).json({mensagem: "Emprestimo atualizado com sucesso"})
    } catch (erro) {
        console.log(erro)
    }
}

export async function excluirEmprestimo(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const emprestimo = await prisma.emprestimo.findUnique({where: {id}})

        if (!emprestimo) {
            return res.status(404).json({mensagem: "Emprestimo nao existe"})
        }

        const emprestimoAtivo = await prisma.emprestimo.findUnique({
            where: {id},
            select: {ativo: true}
        })

        if (emprestimoAtivo) {
            return res.status(400).json({mensagem: "Emprestimo esta ativo, não é possivel excluir"})
        }

        await prisma.emprestimo.delete({where: {id}})
        return res.status(200).json({mensagem: "Emprestimo deletado com sucesso"})
    } catch (erro) {
        console.log(erro)
    }
}
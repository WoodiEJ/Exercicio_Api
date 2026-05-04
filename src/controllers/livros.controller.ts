import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";
import z from "zod";

const optionalSchema = z.object({
    titulo: z.string(),
    descricao: z.string(),
    autor: z.string(),
    categoria_id: z.number()
}).partial()

const livroSchema = z.object({
    titulo: z.string(),
    descricao: z.string(),
    autor: z.string(),
    categoria_id: z.number()
})

const categoriaSchema = z.object({
    nome: z.string()
})

export async function cadastroCategoria(req: Request, res: Response) {
    try {
        const result = categoriaSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({mensagem: "Preenche os campos"})
        }

        const { nome } = result.data
        const categoriaExiste = await prisma.categoria.findUnique({where: {nome}})

        if (categoriaExiste) {
            return res.status(400).json({mensagem: "A categoria ja existe"})
        }

        await prisma.categoria.create({
            data: {
                nome
            }
        })

        return res.status(201).json({mensagem: "Categoria criado com sucesso"})
    } catch (erro) {
        console.log(erro)
    }
}

export async function consultarLivros(req: Request, res: Response) {
    try {
        const livros = await prisma.livro.findMany()
        return res.status(200).json(livros)
    } catch (erro) {
        console.log(erro)
    } 
}

export async function consultarLivro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const livro = await prisma.livro.findUnique({where: {id}})

        if (!livro) {
            return res.status(404).json({mensagem: "Livro não encontrado"})
        }

        return res.json(livro)
    } catch (erro) {
        console.log(erro)
    }
}

export async function atualizarLivro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const result = optionalSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({mensagem: "Valide os dados"})
        }

        const livroExiste = await prisma.livro.findUnique({where: {id}})

        if (!livroExiste) {
            return res.status(404).json({mensagem: "O livro nao existe"})
        }

        await prisma.livro.update({
            where: {id},
            data: result.data
        })

        return res.status(200).json({mensagem: "Livro atualizado com sucesso"})
    } catch (erro) {
        console.log(erro)
    }
}

export async function deletarLivro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const livro = await prisma.livro.findUnique({where: {id}})

        if (!livro) {
            return res.status(404).json({mensagem: "Livro nao existe"})
        }

        const livroEmprestado = await prisma.emprestimo.findFirst({
            where: {
                livro_id: id,
                ativo: true
            }
        })

        if (livroEmprestado) {
            return res.status(400).json({mensagem: "O livro esta com emprestimo ativo"})
        }

        await prisma.emprestimo.deleteMany({ where: { livro_id: id } })
        await prisma.livro.delete({where: {id}})
        return res.status(200).json({mensagem: "Livro deletado"})
    } catch (erro) {
        console.log(erro)
    }
}

export async function devolverLivro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const emprestimo = await prisma.emprestimo.findUnique({where: {id}})

        if (!emprestimo) {
            return res.status(404).json({mensagem: "Emprestimo não existe"})
        }

        const emprestimoInativo = await prisma.emprestimo.findUnique({
            where: {id},
            select: {ativo: false}
        })

        if (emprestimoInativo) {
            return res.status(400).json({mensagem: "Emprestimo ja esta inativo"})
        }

        const dataVolta = new Date()

        await prisma.emprestimo.update({
            where: {id},
            data: {
                ativo: false,
                volta: dataVolta
            }
        })
    } catch (erro) {
        console.log(erro)
    }
}

export async function cadastrarLivro(req: Request, res: Response) {
    try {
        const result = livroSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({mensagem: "Valide os campos"})
        }

        const {titulo, descricao, autor, categoria_id} = result.data
        const livroExiste = await prisma.livro.findFirst({
            where: {
                titulo: titulo,
                descricao: descricao,
                autor: autor
            }
        })

        if (livroExiste) {
            return res.status(400).json({mensagem: "Livro ja existe"})
        }

        await prisma.livro.create({
            data: {
                titulo, 
                descricao, 
                autor, 
                categoria_id
            }
        })

        return res.status(201).json({mensagem: "Livro criado com sucesso"})
    } catch (erro) {
        console.log(erro)
    }
}
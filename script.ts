import { prisma } from "./lib/prisma";
import bcrypt from 'bcrypt'

async function main() {
    const senhaHash = await bcrypt.hash('admin123', 10)

    const admin = await prisma.usuario.create({
        data: {
            nome: 'Admin',
            email: 'admin@admin.com',
            password: senhaHash,
            role: 'ADMIN'
        }
    })

    console.log('Admin criado:', admin, "Senha Verdadeira: admin123")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
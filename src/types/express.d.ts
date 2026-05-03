declare namespace Express {
    interface Request {
        usuario: {
            id: number
            role: string
        }
    }
}
import  express  from "express";
import cors from 'cors'
import { livrosRouter } from "./routes/livros.route";
import { gerenciamentoRouter } from "./routes/gerenciamento.route";
import { loginRouter } from "./routes/login.route";
import { reservaRouter } from "./routes/reserva.route";
import { usuarioRouter } from "./routes/usuario.route";


const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(loginRouter)
app.use(livrosRouter)
app.use(gerenciamentoRouter)
app.use(reservaRouter)
app.use(usuarioRouter)

app.listen(port, () => {
    console.log(`Backend rodando na porta ${port}`)
})
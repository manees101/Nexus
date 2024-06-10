import dotenv from "dotenv"
dotenv.config()
import fastify from "fastify"
const app=fastify()

app.get("/",(req,res)=>{
    res.send("Hellow from server")
})

app.listen({port:parseInt(process.env.PORT!)})
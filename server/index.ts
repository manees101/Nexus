import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./routes/userRoutes";
const app = fastify();
app.get("/",(req,res)=>{
  res.send("Hellow from server")
})

app.register(cors, { origin: process.env.CLIENT_URL });
app.register(userRoutes);
app.listen({ port: parseInt(process.env.PORT!) }, () =>
  console.log("server listening on port ", process.env.PORT)
);

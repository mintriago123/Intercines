// index.ts
import "dotenv/config"; 
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import usuarioRoutes from "./routes/usuario.routes";
import peliculaRoutes from "./routes/pelicula.routes";
import serieRoutes from "./routes/serie.routes";
import bibliotecaRoutes from "./routes/biblioteca.routes";
import carritoRoutes from "./routes/carrito.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

AppDataSource.initialize().then(() => {
  console.log("Conectado a la base de datos");

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/peliculas", peliculaRoutes);
app.use("/api/series", serieRoutes);
app.use("/api/biblioteca", bibliotecaRoutes);
app.use("/api/carrito", carritoRoutes);

  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}).catch(err => {
  console.error("Error al conectar la base de datos:", err);
});

// data-source.ts
import { DataSource } from "typeorm";
import { Usuario } from "./models/Usuario";
import { Pelicula } from "./models/Pelicula";
import { Serie } from "./models/Serie";
import { Biblioteca } from "./models/Biblioteca";
import { Carrito } from "./models/Carrito";
import "dotenv/config"; 

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [Usuario, Pelicula, Serie, Biblioteca, Carrito],
});

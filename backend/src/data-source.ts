// data-source.ts
import { DataSource } from "typeorm";
import { Usuario } from "./models/Usuario";
import { Pelicula } from "./models/Pelicula";
import { Serie } from "./models/Serie";
import { Biblioteca } from "./models/Biblioteca";
import { Carrito } from "./models/Carrito";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "michael",
  password: "hola12p12",
  database: "intercine",
  synchronize: true,
  entities: [Usuario, Pelicula, Serie, Biblioteca, Carrito],
});

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Carrito } from "../models/Carrito";
import { Usuario } from "../models/Usuario";
import { Pelicula } from "../models/Pelicula";
import { Serie } from "../models/Serie";

const repo = AppDataSource.getRepository(Carrito);

export const getAll = async (_: Request, res: Response) => {{
  const items = await repo.find();
  res.json(items);
}};

export const getOne = async (req: Request, res: Response) => {{
  const item = await repo.findOneBy({ id: Number(req.params.id) });
  if (!item) return res.status(404).json({message: "No encontrado" });
  res.json(item);
}};

export const create = async (req: Request, res: Response) => {{
  const item = repo.create(req.body);
  const result = await repo.save(item);
  res.status(201).json(result);
}};

export const update = async (req: Request, res: Response) => {{
  const item = await repo.findOneBy({ id: Number(req.params.id) });
  if (!item) return res.status(404).json({ message: "No encontrado" });
  repo.merge(item, req.body);
  const result = await repo.save(item);
  res.json(result);
}};

export const remove = async (req: Request, res: Response) => {{
  const result = await repo.delete(req.params.id);
  res.json(result);
}};




export const agregarAlCarrito = async (req: Request, res: Response) => {
  const { idUsuario, idPelicula, idSerie, cantidad } = req.body;

  const usuarioRepo = AppDataSource.getRepository(Usuario);
  const peliculaRepo = AppDataSource.getRepository(Pelicula);
  const serieRepo = AppDataSource.getRepository(Serie);
  const carritoRepo = AppDataSource.getRepository(Carrito);

  try {
    const usuario = await usuarioRepo.findOne({ where: { id: idUsuario } });
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    let pelicula = null;
    let serie = null;

    if (idPelicula) {
      pelicula = await peliculaRepo.findOne({ where: { id: idPelicula } });
      if (!pelicula) return res.status(404).json({ mensaje: "Película no encontrada" });
    }

    if (idSerie) {
      serie = await serieRepo.findOne({ where: { id: idSerie } });
      if (!serie) return res.status(404).json({ mensaje: "Serie no encontrada" });
    }

    if (!pelicula && !serie) {
      return res.status(400).json({ mensaje: "Debes enviar el ID de una película o serie" });
    }

    const item = new Carrito();
    item.usuario = usuario;
    item.pelicula = pelicula || null;
    item.serie = serie || null;
    item.cantidad = cantidad || 1;

    await carritoRepo.save(item);

    return res.status(201).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error del servidor" });
  }
};

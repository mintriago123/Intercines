import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Biblioteca } from "../models/Biblioteca";

const repo = AppDataSource.getRepository(Biblioteca);

export const getAll = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Biblioteca);
    const bibliotecas = await repo.find();
    return res.json(bibliotecas);
  } catch (err) {
    return res.status(500).json({ message: "Error al obtener bibliotecas." });
  }
};
export const getOne  = async (req: Request, res: Response) => {
{{
  const item = await repo.findOneBy({ id: Number(req.params.id) });
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
}}
};

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

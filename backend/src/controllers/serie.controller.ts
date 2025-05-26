import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Serie } from "../models/Serie";

const repo = AppDataSource.getRepository(Serie);

export const getAll = async (_: Request, res: Response) => {{
  const items = await repo.find();
  res.json(items);
}};

export const getOne = async (req: Request, res: Response) => {{
  const item = await repo.findOneBy({ id: Number(req.params.id) });
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
}};

export const create = async (req: Request, res: Response) => {{
  const item = repo.create(req.body);
  const result = await repo.save(item);
  res.status(201).json(result);
}};

export const update = async (req: Request, res: Response) => {{
  const item = await repo.findOneBy({ id: Number(req.params.id) });
  if (!item) return res.status(404).json({message: "No encontrado" });
  repo.merge(item, req.body);
  const result = await repo.save(item);
  res.json(result);
}};

export const remove = async (req: Request, res: Response) => {{
  const result = await repo.delete(req.params.id);
  res.json(result);
}};

// controllers/usuario.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../models/Usuario";

const usuarioRepo = AppDataSource.getRepository(Usuario);

export const getUsuarios = async (req: Request, res: Response) => {
    return res.json({ mensaje: "Lista de usuarios" });
};

export const getUsuario = async (req: Request, res: Response) => {
  const usuario = await usuarioRepo.findOneBy({ id: Number(req.params.id) });
  if (!usuario) return res.status(404).json({ message: "No encontrado" });
  res.json(usuario);
};

export const createUsuario = async (req: Request, res: Response) => {
  const usuario = usuarioRepo.create(req.body);
  const result = await usuarioRepo.save(usuario);
  res.status(201).json(result);
};

export const updateUsuario = async (req: Request, res: Response) => {
  const usuario = await usuarioRepo.findOneBy({ id: Number(req.params.id) });
  if (!usuario) return res.status(404).json({ message: "No encontrado" });

  usuarioRepo.merge(usuario, req.body);
  const result = await usuarioRepo.save(usuario);
  res.json(result);
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const result = await usuarioRepo.delete(req.params.id);
  res.json(result);
};

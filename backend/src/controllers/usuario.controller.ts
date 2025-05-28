// controllers/usuario.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcrypt";


const usuarioRepo = AppDataSource.getRepository(Usuario);

const getSafeUser = (user: Usuario) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioRepo.find({
      select: ["id", "nombre", "email", "nombre_usuario", "created_at", "is_admin"]
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioRepo.findOne({ 
      where: { id: Number(req.params.id) },
      select: ["id", "nombre", "email", "nombre_usuario", "created_at", "is_admin"]
    });
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, nombre_usuario, password, is_admin } = req.body;

    // Validaciones
    if (!nombre || !email || !nombre_usuario || !password) {
      return res.status(400).json({
        message: "Todos los campos son requeridos: nombre, email, nombre_usuario, password"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de email inválido" });
    }

    const usuarioExistente = await usuarioRepo.findOne({ 
      where: [{ nombre_usuario }, { email }] 
    });

    if (usuarioExistente) {
      if (usuarioExistente.nombre_usuario === nombre_usuario) {
        return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
      }
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        message: "La contraseña debe tener al menos 8 caracteres" 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = usuarioRepo.create({
      nombre,
      email,
      nombre_usuario,
      password: hashedPassword,
      is_admin: is_admin || false
    });

    const result = await usuarioRepo.save(nuevoUsuario);
    res.status(201).json(getSafeUser(result));

  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, nombre_usuario, password, is_admin } = req.body;
    const usuario = await usuarioRepo.findOneBy({ id: Number(req.params.id) });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validaciones
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de email inválido" });
      }

      const emailExistente = await usuarioRepo.findOne({ where: { email } });
      if (emailExistente && emailExistente.id !== usuario.id) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
    }

    if (nombre_usuario) {
      const usuarioExistente = await usuarioRepo.findOne({ where: { nombre_usuario } });
      if (usuarioExistente && usuarioExistente.id !== usuario.id) {
        return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
      }
    }

    // Actualizar campos
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (nombre_usuario) usuario.nombre_usuario = nombre_usuario;
    if (typeof is_admin !== 'undefined') usuario.is_admin = is_admin;
    
    // Si se proporciona nueva contraseña
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ 
          message: "La contraseña debe tener al menos 8 caracteres" 
        });
      }
      usuario.password = await bcrypt.hash(password, 10);
    }

    const result = await usuarioRepo.save(usuario);
    res.json(getSafeUser(result));

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioRepo.findOneBy({ id: Number(req.params.id) });
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await usuarioRepo.remove(usuario);
    res.json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

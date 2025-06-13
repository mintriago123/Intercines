import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcrypt";

const usuarioRepo = AppDataSource.getRepository(Usuario);

const getSafeUser = (user: Usuario) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// --- Helper functions for validations ---

// Compliant regex: linear time, avoids catastrophic backtracking
const isEmailValid = (email: string): boolean =>
  // - [^@]+        : one or more non-@ characters before @
  // - @            : at
  // - [^@.]+       : one or more non-@ and non-dot chars (domain)
  // - \.           : dot
  // - [a-zA-Z]{2,} : at least two alpha chars (TLD)
  // This regex is safe and does not use nested or ambiguous quantifiers.
  /^[^@]+@[^@.]+\.[a-zA-Z]{2,}$/.test(email);

const isPasswordValid = (password: string): boolean => password.length >= 8;

const validateUserFields = ({
  nombre,
  email,
  nombre_usuario,
  password,
}: {
  nombre?: string;
  email?: string;
  nombre_usuario?: string;
  password?: string;
}): string | null => {
  if (!nombre || !email || !nombre_usuario || !password) {
    return "Todos los campos son requeridos: nombre, email, nombre_usuario, password";
  }
  if (!isEmailValid(email)) {
    return "Formato de email inválido";
  }
  if (!isPasswordValid(password)) {
    return "La contraseña debe tener al menos 8 caracteres";
  }
  return null;
};

const checkUniqueUserFields = async (
  email: string,
  nombre_usuario: string,
  ignoreId?: number
): Promise<string | null> => {
  const [usuarioExistenteEmail, usuarioExistenteNombreUsuario] = await Promise.all([
    usuarioRepo.findOne({ where: { email } }),
    usuarioRepo.findOne({ where: { nombre_usuario } }),
  ]);
  if (usuarioExistenteEmail && usuarioExistenteEmail.id !== ignoreId) {
    return "El email ya está registrado";
  }
  if (usuarioExistenteNombreUsuario && usuarioExistenteNombreUsuario.id !== ignoreId) {
    return "El nombre de usuario ya está en uso";
  }
  return null;
};

// --- Controllers ---

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioRepo.find({
      select: ["id", "nombre", "email", "nombre_usuario", "created_at", "is_admin"],
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
      select: ["id", "nombre", "email", "nombre_usuario", "created_at", "is_admin"],
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
    const errorMsg = validateUserFields({ nombre, email, nombre_usuario, password });
    if (errorMsg) {
      return res.status(400).json({ message: errorMsg });
    }

    const uniqueError = await checkUniqueUserFields(email, nombre_usuario);
    if (uniqueError) {
      return res.status(400).json({ message: uniqueError });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = usuarioRepo.create({
      nombre,
      email,
      nombre_usuario,
      password: hashedPassword,
      is_admin: is_admin || false,
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

    // Validaciones de unicidad y formato
    if (email || nombre_usuario) {
      const uniqueError = await checkUniqueUserFields(
        email ?? usuario.email,
        nombre_usuario ?? usuario.nombre_usuario,
        usuario.id
      );
      if (uniqueError) {
        return res.status(400).json({ message: uniqueError });
      }
      if (email && !isEmailValid(email)) {
        return res.status(400).json({ message: "Formato de email inválido" });
      }
    }

    // Actualizar campos si se proporcionan
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (nombre_usuario) usuario.nombre_usuario = nombre_usuario;
    if (typeof is_admin !== "undefined") usuario.is_admin = is_admin;

    // Actualizar contraseña si se proporciona
    if (password) {
      if (!isPasswordValid(password)) {
        return res.status(400).json({
          message: "La contraseña debe tener al menos 8 caracteres",
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
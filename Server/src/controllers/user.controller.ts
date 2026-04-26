import { User } from "../models/UserModel.js";
import { Op } from "sequelize";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secreto_fomokiller_2026";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Ya existe un usuario con ese email" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });

    const newUser = createdUser.toJSON() as {
      id: number;
      username: string;
      email: string;
    };

    const token = jsonwebtoken.sign({ id: newUser.id }, JWT_SECRET, {
      expiresIn: "7d",
    });


    res.cookie("fomokiller_token", token, {
      httpOnly: true,
      secure: false, // cuando vayas a produccion cambia a true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }

    const user = foundUser.toJSON() as {
      id: number;
      username: string;
      email: string;
      passwordHash: string;
      role: string;
      hasCompletedOnboarding: boolean;
    };

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }

    const token = jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("fomokiller_token", token, {
      httpOnly: true,
      secure: false, // cuando vayas a produccion cambia a true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(Number(userId), {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const [updatedRows] = await User.update(req.body, {
      where: { id: Number(userId) },
    });
    if (updatedRows > 0) {
      const updatedUser = await User.findByPk(Number(userId), {
        attributes: { exclude: ["passwordHash"] },
      });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "Usuario no encontrado para editar" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const { id } = (req as any).user;
        const user = await User.findByPk(id, {
            attributes: ['id', 'username', 'email', 'role', 'avatarUrl', 'bannerUrl', 'bio', 'hasCompletedOnboarding']
        });
        if (!user) {
            res.status(401).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json(user);
    } catch {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie('fomokiller_token');
    res.status(200).json({ message: 'Sesión cerrada' });
};
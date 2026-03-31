import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/userModel";
import { CreateUserDTO, UpdateUserDTO } from "../types/user";
import { HttpError } from "../utils/httpError";

export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  const role = req.query.role as string | undefined;
  const search = req.query.search as string | undefined;
  const pageRaw = req.query.page as string | undefined;
  const limitRaw = req.query.limit as string | undefined;

  if (role && role !== "admin" && role !== "user") {
    return next(
      new HttpError(400, "Paramètre 'role' invalide. Valeurs acceptées : admin | user")
    );
  }

  try {
    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (search) filter.name = new RegExp(search, "i");

    const paginationEnabled = pageRaw !== undefined || limitRaw !== undefined;

    if (!paginationEnabled) {
      const users = await User.find(filter).lean();
      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
      return;
    }

    const page = pageRaw ? Number.parseInt(pageRaw, 10) : 1;
    const limit = limitRaw ? Number.parseInt(limitRaw, 10) : 10;

    if (!Number.isFinite(page) || page < 1) return next(new HttpError(400, "Paramètre 'page' invalide"));
    if (!Number.isFinite(limit) || limit < 1) return next(new HttpError(400, "Paramètre 'limit' invalide"));

    const totalCount = await User.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const skip = (page - 1) * limit;

    const users = await User.find(filter).skip(skip).limit(limit).lean();
    res.status(200).json({
      success: true,
      page,
      limit,
      totalCount,
      totalPages,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return next(new HttpError(400, "ObjectId invalide"));
  }

  try {
    const user = await User.findById(id).lean();

    if (!user) {
      return next(new HttpError(404, "Utilisateur non trouvé"));
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// ----------------------------------------------------------
//  POST /api/users
//  Crée un nouvel utilisateur
// ----------------------------------------------------------
export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { name, email, role } = req.body as Partial<CreateUserDTO>;

  // Validation : champs obligatoires
  if (!name || !email) {
    return next(new HttpError(400, "Les champs 'name' et 'email' sont obligatoires"));
  }

  // Validation basique du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new HttpError(400, "Format d'email invalide"));
  }

  // Validation du rôle si fourni
  if (role && role !== "admin" && role !== "user") {
    return next(new HttpError(400, "Le champ 'role' doit être 'admin' ou 'user'"));
  }

  try {
    const newUser = await User.create({ name, email, role });
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    next(err);
  }
}

// ----------------------------------------------------------
//  PUT /api/users/:id
//  Met à jour partiellement un utilisateur
// ----------------------------------------------------------
export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return next(new HttpError(400, "ObjectId invalide"));
  }

  const { name, email, role } = req.body as Partial<UpdateUserDTO> & {
    _id?: unknown;
    createdAt?: unknown;
  };

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new HttpError(400, "Format d'email invalide"));
    }
  }

  if (role && role !== "admin" && role !== "user") {
    return next(new HttpError(400, "Le champ 'role' doit être 'admin' ou 'user'"));
  }

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (role !== undefined) updateData.role = role;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) {
      return next(new HttpError(404, "Utilisateur non trouvé"));
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return next(new HttpError(400, "ObjectId invalide"));
  }

  try {
    const deleted = await User.findByIdAndDelete(id).lean();
    if (!deleted) {
      return next(new HttpError(404, "Utilisateur non trouvé"));
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

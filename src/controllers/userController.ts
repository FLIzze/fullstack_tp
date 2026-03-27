import { Request, Response } from "express";
import * as UserModel from "../models/userModel";
import { CreateUserDTO, UpdateUserDTO } from "../types/user";

export function getAllUsers(req: Request, res: Response): void {
  const role = req.query.role as string | undefined;

  if (role && role !== "admin" && role !== "user") {
    res.status(400).json({
      success: false,
      message: "Paramètre 'role' invalide. Valeurs acceptées : admin | user",
    });
    return;
  }

  const users = UserModel.getAll(role);

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
}

export function getUserById(req: Request, res: Response): void {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "L'id doit être un nombre entier" });
    return;
  }

  const user = UserModel.getById(id);

  if (!user) {
    res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    return;
  }

  res.status(200).json({ success: true, data: user });
}

// ----------------------------------------------------------
//  POST /api/users
//  Crée un nouvel utilisateur
// ----------------------------------------------------------
export function createUser(req: Request, res: Response): void {
  const { name, email, role } = req.body as Partial<CreateUserDTO>;

  // Validation : champs obligatoires
  if (!name || !email) {
    res.status(400).json({
      success: false,
      message: "Les champs 'name' et 'email' sont obligatoires",
    });
    return;
  }

  // Validation basique du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ success: false, message: "Format d'email invalide" });
    return;
  }

  // Bonus B : vérifier l'unicité de l'email
  if (UserModel.emailExists(email)) {
    res.status(409).json({
      success: false,
      message: "Cet email est déjà utilisé par un autre utilisateur",
    });
    return;
  }

  // Validation du rôle si fourni
  if (role && role !== "admin" && role !== "user") {
    res.status(400).json({
      success: false,
      message: "Le champ 'role' doit être 'admin' ou 'user'",
    });
    return;
  }

  const newUser = UserModel.create({ name, email, role });

  res.status(201).json({ success: true, data: newUser });
}

// ----------------------------------------------------------
//  PUT /api/users/:id
//  Met à jour partiellement un utilisateur
// ----------------------------------------------------------
export function updateUser(req: Request, res: Response): void {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "L'id doit être un nombre entier" });
    return;
  }

  // Vérifier que la ressource existe
  if (!UserModel.getById(id)) {
    res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    return;
  }

  const { name, email, role } = req.body as Partial<UpdateUserDTO>;

  // Bonus B : vérifier l'unicité de l'email (en excluant l'utilisateur courant)
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: "Format d'email invalide" });
      return;
    }
    if (UserModel.emailExists(email, id)) {
      res.status(409).json({
        success: false,
        message: "Cet email est déjà utilisé par un autre utilisateur",
      });
      return;
    }
  }

  // Validation du rôle si fourni
  if (role && role !== "admin" && role !== "user") {
    res.status(400).json({
      success: false,
      message: "Le champ 'role' doit être 'admin' ou 'user'",
    });
    return;
  }

  // Construire le payload de mise à jour (uniquement les champs fournis)
  const updateData: UpdateUserDTO = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (role !== undefined) updateData.role = role;

  const updatedUser = UserModel.update(id, updateData);

  res.status(200).json({ success: true, data: updatedUser });
}

export function deleteUser(req: Request, res: Response): void {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "L'id doit être un nombre entier" });
    return;
  }

  const deleted = UserModel.remove(id);

  if (!deleted) {
    res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    return;
  }

  res.status(204).send();
}

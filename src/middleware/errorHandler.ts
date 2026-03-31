import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (err?.name === "ValidationError") {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  if (err?.code === 11000) {
    res.status(409).json({
      success: false,
      message: "Cet email est déjà utilisé par un autre utilisateur",
    });
    return;
  }

  console.error("[ERROR]", err?.stack ?? err);
  res.status(500).json({
    success: false,
    message: "Erreur interne du serveur",
  });
}

import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("[ERROR]", err.stack);
  res.status(500).json({
    success: false,
    message: "Erreur interne du serveur",
  });
}

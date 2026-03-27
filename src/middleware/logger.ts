import { Request, Response, NextFunction } from "express";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;

    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace("T", " ")
      .substring(0, 19); 

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}
